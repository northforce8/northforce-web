import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, AlertTriangle, User, Building2, FolderKanban } from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { supabase } from '../../../lib/supabase';
import CapacityConflictsAI from '../../../components/admin/CapacityConflictsAI';

type ViewMode = 'week' | 'month' | 'quarter';

interface CapacityEntry {
  id: string;
  partner_id?: string;
  customer_id?: string;
  project_id?: string;
  start_date: string;
  end_date: string;
  allocated_hours: number;
  allocated_credits: number;
  recurrence_pattern?: 'none' | 'weekly' | 'biweekly' | 'monthly';
  notes?: string;
  partner?: { partner_name: string };
  customer?: { company_name: string };
  project?: { name: string };
}

export default function PlanningPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [capacityEntries, setCapacityEntries] = useState<CapacityEntry[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [currentDate, viewMode]);

  async function loadData() {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();

      const [entriesData, partnersData, customersData, projectsData] = await Promise.all([
        loadCapacityEntries(startDate, endDate),
        partnerPortalApi.partners.getAll(),
        partnerPortalApi.customers.getAll(),
        partnerPortalApi.projects.getAll(),
      ]);

      setCapacityEntries(entriesData);
      setPartners(partnersData);
      setCustomers(customersData);
      setProjects(projectsData);

      detectConflicts(entriesData);
    } catch (error) {
      console.error('Error loading planning data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCapacityEntries(startDate: string, endDate: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('capacity_calendar')
      .select(`
        *,
        partner:partners(partner_name),
        customer:customers(company_name),
        project:projects(name)
      `)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
      .order('start_date');

    if (error) throw error;
    return data || [];
  }

  function getDateRange() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let startDate: Date;
    let endDate: Date;

    if (viewMode === 'week') {
      const dayOfWeek = currentDate.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (viewMode === 'month') {
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    } else {
      const quarter = Math.floor(month / 3);
      startDate = new Date(year, quarter * 3, 1);
      endDate = new Date(year, quarter * 3 + 3, 0);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  function detectConflicts(entries: CapacityEntry[]) {
    const partnerCapacity: Record<string, { date: string; total: number; entries: CapacityEntry[] }[]> = {};

    entries.forEach(entry => {
      if (!entry.partner_id) return;

      const start = new Date(entry.start_date);
      const end = new Date(entry.end_date);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        const partnerKey = entry.partner_id;

        if (!partnerCapacity[partnerKey]) {
          partnerCapacity[partnerKey] = [];
        }

        let dayEntry = partnerCapacity[partnerKey].find(e => e.date === dateKey);
        if (!dayEntry) {
          dayEntry = { date: dateKey, total: 0, entries: [] };
          partnerCapacity[partnerKey].push(dayEntry);
        }

        dayEntry.total += entry.allocated_hours;
        dayEntry.entries.push(entry);
      }
    });

    const detectedConflicts: any[] = [];
    Object.entries(partnerCapacity).forEach(([partnerId, days]) => {
      days.forEach(day => {
        if (day.total > 8) {
          const partner = partners.find(p => p.id === partnerId);
          detectedConflicts.push({
            partnerId,
            partnerName: partner?.partner_name || 'Unknown',
            date: day.date,
            totalHours: day.total,
            entries: day.entries,
          });
        }
      });
    });

    setConflicts(detectedConflicts);
  }

  function navigate(direction: 'prev' | 'next') {
    const newDate = new Date(currentDate);

    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 3 : -3));
    }

    setCurrentDate(newDate);
  }

  function getDateRangeLabel() {
    const { startDate, endDate } = getDateRange();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (viewMode === 'week') {
      return `${start.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'month') {
      return start.toLocaleDateString('sv-SE', { month: 'long', year: 'numeric' });
    } else {
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Calendar & Planning"
        description="Schedule and allocate partner capacity"
        icon={Calendar}
        action={{
          label: 'Add Capacity',
          onClick: () => setShowCreateModal(true),
          icon: Plus,
        }}
        help={PAGE_HELP_CONTENT.calendar}
      />

      {/* AI Capacity Conflict Detection */}
      <CapacityConflictsAI
        startDate={getDateRange().startDate}
        endDate={getDateRange().endDate}
        onRefresh={loadData}
      />

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('prev')}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{getDateRangeLabel()}</h2>
              <button
                onClick={() => navigate('next')}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="ml-4 text-sm text-blue-600 hover:text-blue-900"
              >
                Today
              </button>
            </div>

            <div className="flex gap-2">
              {(['week', 'month', 'quarter'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '—'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading calendar...</div>
        ) : (
          <div className="p-4">
            <div className="space-y-2">
              {capacityEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No capacity entries</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding capacity allocation.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Capacity
                    </button>
                  </div>
                </div>
              ) : (
                capacityEntries.map(entry => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {entry.partner && (
                            <div className="flex items-center gap-1 text-sm">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{entry.partner.partner_name}</span>
                            </div>
                          )}
                          {entry.customer && (
                            <div className="flex items-center gap-1 text-sm">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-700">{entry.customer.company_name}</span>
                            </div>
                          )}
                          {entry.project && (
                            <div className="flex items-center gap-1 text-sm">
                              <FolderKanban className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{entry.project.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(entry.start_date).toLocaleDateString('sv-SE')} - {new Date(entry.end_date).toLocaleDateString('sv-SE')}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                          <span>{entry.allocated_hours}h allocated</span>
                          <span>{entry.allocated_credits} credits</span>
                          {entry.recurrence_pattern && entry.recurrence_pattern !== 'none' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              Recurring: {entry.recurrence_pattern}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCapacityModal
          partners={partners}
          customers={customers}
          projects={projects}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function CreateCapacityModal({ partners, customers, projects, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    partner_id: '',
    customer_id: '',
    project_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    allocated_hours: '',
    allocated_credits: '',
    recurrence_pattern: 'none',
    recurrence_end_date: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      alert('Database not configured');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.from('capacity_calendar').insert({
        partner_id: formData.partner_id || null,
        customer_id: formData.customer_id || null,
        project_id: formData.project_id || null,
        start_date: formData.start_date,
        end_date: formData.end_date || formData.start_date,
        allocated_hours: Number(formData.allocated_hours) || 0,
        allocated_credits: Number(formData.allocated_credits) || 0,
        recurrence_pattern: formData.recurrence_pattern as any,
        recurrence_end_date: formData.recurrence_end_date || null,
        notes: formData.notes || null,
      });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error creating capacity entry:', error);
      alert('Failed to create capacity entry');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Add Capacity Allocation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner</label>
            <select
              value={formData.partner_id}
              onChange={(e) => setFormData({ ...formData, partner_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select partner...</option>
              {partners.map((p: any) => (
                <option key={p.id} value={p.id}>{p.partner_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer (Optional)</label>
            <select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select customer...</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.company_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project (Optional)</label>
            <select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select project...</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Hours</label>
              <input
                type="number"
                step="0.5"
                value={formData.allocated_hours}
                onChange={(e) => setFormData({ ...formData, allocated_hours: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Credits</label>
              <input
                type="number"
                step="0.1"
                value={formData.allocated_credits}
                onChange={(e) => setFormData({ ...formData, allocated_credits: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
            <select
              value={formData.recurrence_pattern}
              onChange={(e) => setFormData({ ...formData, recurrence_pattern: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="none">No recurrence</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {formData.recurrence_pattern !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence End Date</label>
              <input
                type="date"
                value={formData.recurrence_end_date}
                onChange={(e) => setFormData({ ...formData, recurrence_end_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Capacity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
