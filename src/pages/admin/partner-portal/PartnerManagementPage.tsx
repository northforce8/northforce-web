import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Edit2,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  Target,
  Award,
} from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import type {
  Partner,
  PartnerCostRate,
  PartnerWithStats,
  CapacityUtilization,
  WorkType,
} from '../../../lib/partner-portal-types';

const PartnerManagementPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [costRates, setCostRates] = useState<PartnerCostRate[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityUtilization[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCostRateModal, setShowCostRateModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [newCostRate, setNewCostRate] = useState({
    hourly_cost: '',
    effective_from: new Date().toISOString().split('T')[0],
    effective_until: '',
  });
  const [partnerForm, setPartnerForm] = useState({
    partner_name: '',
    email: '',
    phone: '',
    specialization: '',
    default_hourly_cost: '850',
    capacity_hours_per_month: '160',
    status: 'active' as const,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersData, workTypesData] = await Promise.all([
        partnerPortalApi.partners.getAll(),
        partnerPortalApi.workTypes.getAll(),
      ]);
      setPartners(partnersData);
      setWorkTypes(workTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPartnerDetails = async (partner: Partner) => {
    try {
      setSelectedPartner(partner);
      const [rates, capacity] = await Promise.all([
        partnerPortalApi.partnerCostRates.getByPartner(partner.id),
        partnerPortalApi.capacityUtilization.getByPartner(partner.id, 30),
      ]);
      setCostRates(rates);
      setCapacityData(capacity);
    } catch (error) {
      console.error('Error loading partner details:', error);
    }
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await partnerPortalApi.partners.create({
        ...partnerForm,
        default_hourly_cost: parseFloat(partnerForm.default_hourly_cost),
        capacity_hours_per_month: parseFloat(partnerForm.capacity_hours_per_month),
      });
      setShowPartnerModal(false);
      setPartnerForm({
        partner_name: '',
        email: '',
        phone: '',
        specialization: '',
        default_hourly_cost: '850',
        capacity_hours_per_month: '160',
        status: 'active',
      });
      loadData();
    } catch (error) {
      console.error('Error creating partner:', error);
    }
  };

  const handleAddCostRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    try {
      await partnerPortalApi.partnerCostRates.create({
        partner_id: selectedPartner.id,
        hourly_cost: parseFloat(newCostRate.hourly_cost),
        effective_from: newCostRate.effective_from,
        effective_until: newCostRate.effective_until || undefined,
      });
      setShowCostRateModal(false);
      setNewCostRate({
        hourly_cost: '',
        effective_from: new Date().toISOString().split('T')[0],
        effective_until: '',
      });
      loadPartnerDetails(selectedPartner);
    } catch (error) {
      console.error('Error adding cost rate:', error);
    }
  };

  const getPartnerStats = (partner: Partner) => {
    const capacity = capacityData.filter(c => c.partner_id === partner.id);
    const totalHours = capacity.reduce((sum, c) => sum + Number(c.total_hours), 0);
    const utilization = partner.current_utilization_percentage || 0;

    return {
      totalHours,
      utilization,
    };
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading partners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage partner network, costs, and capacity</p>
          </div>
          <button
            onClick={() => setShowPartnerModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Partner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Partners</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{partners.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              {partners.filter(p => p.status === 'active').length} active
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Hourly Cost</span>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(partners.reduce((sum, p) => sum + (Number(p.default_hourly_cost) || 0), 0) / partners.length || 0).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">SEK per hour</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Capacity</span>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(partners.reduce((sum, p) => sum + (Number(p.capacity_hours_per_month) || 0), 0) || 0).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">hours/month</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Utilization</span>
              <Target className="w-5 h-5 text-accent-cyan" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(partners.reduce((sum, p) => sum + (Number(p.current_utilization_percentage) || 0), 0) / partners.length || 0).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">current load</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Partner Network</h2>
            <div className="space-y-4">
              {partners.map((partner) => {
                const stats = getPartnerStats(partner);
                const utilizationColor =
                  stats.utilization >= 90 ? 'text-red-600' :
                  stats.utilization >= 75 ? 'text-yellow-600' :
                  'text-green-600';

                return (
                  <div
                    key={partner.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-gray-50 transition-all cursor-pointer"
                    onClick={() => loadPartnerDetails(partner)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{partner.partner_name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            partner.status === 'active' ? 'bg-green-100 text-green-800' :
                            partner.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {partner.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{partner.specialization}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{partner.email}</span>
                          {partner.phone && <span>• {partner.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Hourly Cost</p>
                        <p className="text-sm font-semibold text-orange-600">
                          {partner.default_hourly_cost} SEK
                        </p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Capacity</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {partner.capacity_hours_per_month}h/mo
                        </p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Utilization</p>
                        <p className={`text-sm font-semibold ${utilizationColor}`}>
                          {stats.utilization.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {selectedPartner ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPartner.partner_name}</h2>
                  <p className="text-sm text-gray-600">{selectedPartner.specialization}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Cost Rate History</h3>
                    <button
                      onClick={() => setShowCostRateModal(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Add Rate
                    </button>
                  </div>
                  {costRates.length === 0 ? (
                    <p className="text-sm text-gray-500">No cost rate history</p>
                  ) : (
                    <div className="space-y-2">
                      {costRates.map((rate) => (
                        <div key={rate.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-900">{rate.hourly_cost} SEK/h</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {rate.is_current_rate ? 'Current' : 'Historical'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            From: {new Date(rate.effective_from).toLocaleDateString()}
                            {rate.effective_until && ` - Until: ${new Date(rate.effective_until).toLocaleDateString()}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Capacity Analysis</h3>
                  {capacityData.length === 0 ? (
                    <p className="text-sm text-gray-500">No capacity data available</p>
                  ) : (
                    <div className="space-y-3">
                      {capacityData.slice(0, 5).map((cap) => {
                        const utilizationPercentage = (Number(cap.total_hours) / Number(cap.available_capacity)) * 100;
                        return (
                          <div key={cap.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(cap.period_start).toLocaleDateString()} - {new Date(cap.period_end).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{cap.total_hours}h / {cap.available_capacity}h</span>
                              <span className={utilizationPercentage >= 90 ? 'text-red-600' : 'text-green-600'}>
                                {utilizationPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  utilizationPercentage >= 90 ? 'bg-red-600' :
                                  utilizationPercentage >= 75 ? 'bg-yellow-600' :
                                  'bg-green-600'
                                }`}
                                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a partner to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Partner</h2>
            </div>
            <form onSubmit={handleCreatePartner} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.partner_name}
                    onChange={(e) => setPartnerForm({ ...partnerForm, partner_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={partnerForm.phone}
                    onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.specialization}
                    onChange={(e) => setPartnerForm({ ...partnerForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Hourly Cost (SEK) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={partnerForm.default_hourly_cost}
                    onChange={(e) => setPartnerForm({ ...partnerForm, default_hourly_cost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (hours/month) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={partnerForm.capacity_hours_per_month}
                    onChange={(e) => setPartnerForm({ ...partnerForm, capacity_hours_per_month: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCostRateModal && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Cost Rate</h2>
              <p className="text-sm text-gray-600 mt-1">For {selectedPartner.partner_name}</p>
            </div>
            <form onSubmit={handleAddCostRate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Cost (SEK) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newCostRate.hourly_cost}
                  onChange={(e) => setNewCostRate({ ...newCostRate, hourly_cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective From *
                </label>
                <input
                  type="date"
                  required
                  value={newCostRate.effective_from}
                  onChange={(e) => setNewCostRate({ ...newCostRate, effective_from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Until (Optional)
                </label>
                <input
                  type="date"
                  value={newCostRate.effective_until}
                  onChange={(e) => setNewCostRate({ ...newCostRate, effective_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCostRateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManagementPage;
