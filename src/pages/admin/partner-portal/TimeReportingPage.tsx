import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Trash2, Coins, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { getCurrentUser, isAdmin } from '../../../lib/auth';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { safeNumber, safeDivide } from '../../../lib/data-validators';
import { PageHeader } from '../../../components/admin/PageHeader';
import { PAGE_HELP_CONTENT } from '../../../lib/page-help-content';
import type { TimeEntryWithRelations, Customer, Project, WorkType, Partner } from '../../../lib/partner-portal-types';

const TimeReportingPage: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryWithRelations[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [allowedWorkTypes, setAllowedWorkTypes] = useState<WorkType[]>([]);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [newEntry, setNewEntry] = useState({
    customer_id: '',
    project_id: '',
    work_type_id: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
    billable: true,
  });

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await getCurrentUser();
      const userIsAdmin = await isAdmin();
      setIsAdminUser(userIsAdmin);

      let partnerId: string | undefined;
      if (!userIsAdmin && user) {
        const partner = await partnerPortalApi.partners.getByUserId(user.id);
        if (partner) {
          setCurrentPartner(partner);
          partnerId = partner.id;
        }
      }

      const { startDate, endDate } = getPeriodDates(selectedPeriod);
      const entries = await partnerPortalApi.timeEntries.getAll({
        partnerId,
        startDate,
        endDate,
      });
      setTimeEntries(entries);

      const customersData = await partnerPortalApi.customers.getAll();
      setCustomers(customersData);

      const projectsData = await partnerPortalApi.projects.getAll();
      setProjects(projectsData);

      const workTypesData = await partnerPortalApi.workTypes.getAll();
      setWorkTypes(workTypesData);

      if (partnerId && !userIsAdmin) {
        const partnerAllowedWorkTypes = await partnerPortalApi.partnerWorkTypeAssignments.getAllowedWorkTypes(partnerId);
        setAllowedWorkTypes(partnerAllowedWorkTypes.length > 0 ? partnerAllowedWorkTypes : workTypesData);
      } else {
        setAllowedWorkTypes(workTypesData);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda tidsrapportering. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodDates = (period: string) => {
    const now = new Date();
    let startDate = new Date();
    const endDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - now.getDay());
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner && !isAdminUser) return;

    try {
      await partnerPortalApi.timeEntries.create({
        ...newEntry,
        partner_id: currentPartner?.id || '',
        hours: parseFloat(newEntry.hours),
        project_id: newEntry.project_id || undefined,
      });

      setShowCreateModal(false);
      setNewEntry({
        customer_id: '',
        project_id: '',
        work_type_id: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        description: '',
        billable: true,
      });
      loadData();
    } catch (error) {
      console.error('Error creating time entry:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this time entry?')) return;

    try {
      await partnerPortalApi.timeEntries.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting time entry:', error);
    }
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
  const totalCredits = timeEntries.reduce((sum, entry) => sum + (Number(entry.credits_consumed) || 0), 0);
  const totalCost = timeEntries.reduce((sum, entry) => sum + (Number(entry.internal_cost) || 0), 0);
  const billableHours = timeEntries.filter(e => e.billable).reduce((sum, entry) => sum + Number(entry.hours), 0);

  const groupedByDate = timeEntries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntryWithRelations[]>);

  const workTypeBreakdown = timeEntries.reduce((acc, entry) => {
    const typeName = entry.work_type?.name || 'Unknown';
    if (!acc[typeName]) {
      acc[typeName] = { hours: 0, credits: 0, count: 0 };
    }
    acc[typeName].hours += Number(entry.hours);
    acc[typeName].credits += Number(entry.credits_consumed) || 0;
    acc[typeName].count += 1;
    return acc;
  }, {} as Record<string, { hours: number; credits: number; count: number }>);

  const filteredProjects = projects.filter(p => p.customer_id === newEntry.customer_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar tidsrapportering...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Fel vid laddning</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Time Reporting"
        description="Track and manage your work hours"
        icon={Clock}
        action={{
          label: 'Report Time',
          onClick: () => setShowCreateModal(true),
          icon: Plus,
        }}
        help={PAGE_HELP_CONTENT.time}
      />

        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Total Hours</span>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900">{safeNumber(totalHours, 0).toFixed(1)}</div>
              <div className="text-xs text-blue-700 mt-1">
                {safeNumber(billableHours, 0).toFixed(1)} billable ({(safeDivide(billableHours, totalHours, 0) * 100).toFixed(0)}%)
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-800">Credits Used</span>
                <Coins className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-primary-900">{safeNumber(totalCredits, 0).toFixed(1)}</div>
              <div className="text-xs text-primary-700 mt-1">
                Avg {safeDivide(totalCredits, totalHours, 0).toFixed(2)} per hour
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-800">Internal Cost</span>
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-900">{(safeNumber(totalCost, 0) / 1000).toFixed(1)}k</div>
              <div className="text-xs text-amber-700 mt-1">
                {safeDivide(totalCost, totalHours, 0).toFixed(0)} SEK/hour
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Work Types</span>
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900">{Object.keys(workTypeBreakdown).length}</div>
              <div className="text-xs text-green-700 mt-1">
                {timeEntries.length} entries
              </div>
            </div>
          </div>

          {Object.keys(workTypeBreakdown).length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Work Type Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(workTypeBreakdown)
                  .sort(([, a], [, b]) => b.hours - a.hours)
                  .map(([type, data]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{type}</span>
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{data.count} entries</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{data.hours.toFixed(1)}h</span>
                        <span>{data.credits.toFixed(1)} credits</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-6">

          {timeEntries.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No time entries for this period</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Report your first hours
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, entries]) => {
                  const dayTotal = entries.reduce((sum, e) => sum + Number(e.hours), 0);
                  return (
                    <div key={date} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-semibold text-gray-900">
                            {new Date(date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{dayTotal.toFixed(2)}h</span>
                      </div>
                      <div className="space-y-2 ml-7">
                        {entries.map((entry) => {
                          const creditsConsumed = entry.credits_consumed || 0;
                          const internalCost = entry.internal_cost || 0;
                          const workTypeMultiplier = entry.work_type?.credits_per_hour || 1.0;
                          const costFactor = entry.work_type?.internal_cost_factor || 1.0;

                          return (
                            <div
                              key={entry.id}
                              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">
                                      {entry.customer?.company_name}
                                    </span>
                                    {entry.project && (
                                      <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-sm text-gray-600">{entry.project.name}</span>
                                      </>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                      {entry.work_type?.name} ({workTypeMultiplier}x)
                                    </span>
                                    {entry.billable && (
                                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                        Billable
                                      </span>
                                    )}
                                    {costFactor !== 1.0 && (
                                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                        Cost Factor: {costFactor}x
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 ml-4">
                                  <span className="text-lg font-semibold text-gray-900">{entry.hours}h</span>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-1">Credits Consumed</p>
                                  <p className="text-sm font-semibold text-primary-600">
                                    {creditsConsumed.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {entry.hours}h × {workTypeMultiplier}x
                                  </p>
                                </div>
                                <div className="text-center border-l border-gray-200">
                                  <p className="text-xs text-gray-500 mb-1">Internal Cost</p>
                                  <p className="text-sm font-semibold text-amber-600">
                                    {internalCost.toFixed(0)} SEK
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {costFactor}x factor
                                  </p>
                                </div>
                                <div className="text-center border-l border-gray-200">
                                  <p className="text-xs text-gray-500 mb-1">Partner</p>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {entry.partner?.partner_name || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Report Time</h2>
            </div>
            <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer *
                  </label>
                  <select
                    required
                    value={newEntry.customer_id}
                    onChange={(e) => setNewEntry({ ...newEntry, customer_id: e.target.value, project_id: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <select
                    value={newEntry.project_id}
                    onChange={(e) => setNewEntry({ ...newEntry, project_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    disabled={!newEntry.customer_id}
                  >
                    <option value="">No project</option>
                    {filteredProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Type *
                  </label>
                  <select
                    required
                    value={newEntry.work_type_id}
                    onChange={(e) => setNewEntry({ ...newEntry, work_type_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="">Select work type</option>
                    {allowedWorkTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.credits_per_hour}x)
                      </option>
                    ))}
                  </select>
                  {!isAdminUser && allowedWorkTypes.length < workTypes.length && (
                    <p className="text-xs text-gray-500 mt-1">
                      Showing only work types you're assigned to
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="24"
                    required
                    value={newEntry.hours}
                    onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billable
                  </label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      checked={newEntry.billable}
                      onChange={(e) => setNewEntry({ ...newEntry, billable: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                    />
                    <label className="ml-2 text-sm text-gray-700">Billable hours</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="Describe what you worked on..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeReportingPage;
