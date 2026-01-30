import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Coins,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit2,
  X,
} from 'lucide-react';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { safeNumber } from '../../../lib/data-validators';
import { useLanguage } from '../../../contexts/LanguageContext';
import type {
  Partner,
  PartnerRole,
  PartnerWorkTypeAssignmentWithRelations,
  PartnerCapacityPeriod,
  PartnerPerformanceMetrics,
  PartnerWorkloadRecommendationWithRelations,
  WorkType,
  PartnerCostRate,
} from '../../../lib/partner-portal-types';

const PartnerDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [role, setRole] = useState<PartnerRole | null>(null);
  const [workTypeAssignments, setWorkTypeAssignments] = useState<PartnerWorkTypeAssignmentWithRelations[]>([]);
  const [capacityPeriods, setCapacityPeriods] = useState<PartnerCapacityPeriod[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PartnerPerformanceMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<PartnerWorkloadRecommendationWithRelations[]>([]);
  const [costRates, setCostRates] = useState<PartnerCostRate[]>([]);
  const [availableWorkTypes, setAvailableWorkTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddWorkTypeModal, setShowAddWorkTypeModal] = useState(false);
  const [showAddCapacityModal, setShowAddCapacityModal] = useState(false);
  const [showEditPartnerModal, setShowEditPartnerModal] = useState(false);
  const [newWorkTypeAssignment, setNewWorkTypeAssignment] = useState({
    work_type_id: '',
    proficiency_level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    is_primary: false,
  });
  const [newCapacityPeriod, setNewCapacityPeriod] = useState({
    period_start: new Date().toISOString().split('T')[0],
    period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    available_hours: 160,
    capacity_type: 'regular' as 'regular' | 'overtime' | 'reduced' | 'unavailable',
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [
        partnerData,
        workTypesData,
        capacityData,
        metricsData,
        recommendationsData,
        costRatesData,
        allWorkTypes,
      ] = await Promise.all([
        partnerPortalApi.partners.getById(id),
        partnerPortalApi.partnerWorkTypeAssignments.getByPartner(id),
        partnerPortalApi.partnerCapacityPeriods.getByPartner(id),
        partnerPortalApi.partnerPerformanceMetrics.getLatest(id),
        partnerPortalApi.partnerWorkloadRecommendations.getAll({ partnerId: id, status: 'active' }),
        partnerPortalApi.partnerCostRates.getByPartner(id),
        partnerPortalApi.workTypes.getAll(),
      ]);

      if (!partnerData) {
        setError('Partner not found');
        return;
      }

      setPartner(partnerData);
      setWorkTypeAssignments(workTypesData);
      setCapacityPeriods(capacityData);
      setPerformanceMetrics(metricsData);
      setRecommendations(recommendationsData);
      setCostRates(costRatesData);
      setAvailableWorkTypes(allWorkTypes);

      if (partnerData.role_id) {
        const roleData = await partnerPortalApi.partnerRoles.getById(partnerData.role_id);
        setRole(roleData);
      }
    } catch (err) {
      console.error('Error loading partner data:', err);
      setError('Failed to load partner data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await partnerPortalApi.partnerWorkTypeAssignments.create({
        partner_id: id,
        ...newWorkTypeAssignment,
        assigned_date: new Date().toISOString().split('T')[0],
      });

      setShowAddWorkTypeModal(false);
      setNewWorkTypeAssignment({
        work_type_id: '',
        proficiency_level: 'intermediate',
        is_primary: false,
      });
      loadData();
    } catch (err) {
      console.error('Error adding work type:', err);
      setError('Failed to add work type');
    }
  };

  const handleRemoveWorkType = async (assignmentId: string) => {
    if (!confirm('Remove this work type assignment?')) return;

    try {
      await partnerPortalApi.partnerWorkTypeAssignments.delete(assignmentId);
      loadData();
    } catch (err) {
      console.error('Error removing work type:', err);
      setError('Failed to remove work type');
    }
  };

  const handleAddCapacity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await partnerPortalApi.partnerCapacityPeriods.create({
        partner_id: id,
        ...newCapacityPeriod,
        allocated_hours: 0,
        actual_hours: 0,
      });

      setShowAddCapacityModal(false);
      setNewCapacityPeriod({
        period_start: new Date().toISOString().split('T')[0],
        period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        available_hours: 160,
        capacity_type: 'regular',
      });
      loadData();
    } catch (err) {
      console.error('Error adding capacity:', err);
      setError('Failed to add capacity period');
    }
  };

  const handleDismissRecommendation = async (recommendationId: string) => {
    try {
      await partnerPortalApi.partnerWorkloadRecommendations.dismiss(recommendationId);
      loadData();
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('partner.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Partner not found'}</p>
          <button
            onClick={() => navigate('/admin/partner-portal/partners')}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Back to Partners
          </button>
        </div>
      </div>
    );
  }

  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const currentCapacity = capacityPeriods.find(
    cp => cp.period_start <= currentMonthStart && cp.period_end >= currentMonthStart
  );
  const utilizationPercentage = currentCapacity
    ? (currentCapacity.actual_hours / currentCapacity.available_hours) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/partner-portal/partners')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{partner.partner_name}</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">{role?.role_name || partner.role || 'Partner'}</p>
          </div>
        </div>
        <button
          onClick={() => setShowEditPartnerModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Partner
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.id} className={`p-4 rounded-lg border ${getSeverityColor(rec.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="font-semibold">{rec.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-white rounded uppercase font-medium">
                        {rec.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2 font-medium">{rec.description}</p>
                    {rec.suggested_action && (
                      <p className="text-sm font-semibold">Suggested: {rec.suggested_action}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDismissRecommendation(rec.id)}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900 font-medium">{partner.email || 'N/A'}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900 font-medium">{partner.phone || 'N/A'}</span>
            </div>
            {partner.partner_company && (
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-900 font-medium">{partner.partner_company}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-900 font-medium">
                Joined {new Date(partner.onboarding_date || partner.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Capacity & Utilization</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Utilization</span>
                <span className="font-semibold text-gray-900">{safeNumber(utilizationPercentage, 0).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    utilizationPercentage > 90
                      ? 'bg-red-500'
                      : utilizationPercentage > 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, utilizationPercentage)}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Capacity/Month</p>
                <p className="font-semibold text-gray-900">{partner.capacity_hours_per_month}h</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">This Month</p>
                <p className="font-semibold text-gray-900">{currentCapacity?.actual_hours || 0}h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Cost & Rates</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Hourly Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {partner.hourly_cost_rate || partner.default_hourly_cost} SEK
              </p>
            </div>
            {role && (
              <div className="text-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role Range</p>
                <p className="text-gray-900 font-medium">
                  {role.hourly_rate_min} - {role.hourly_rate_max} SEK
                </p>
              </div>
            )}
            {costRates.length > 0 && (
              <div className="text-xs text-gray-500 pt-2 border-t font-medium">
                {costRates.length} rate {costRates.length === 1 ? 'change' : 'changes'} recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {performanceMetrics && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{safeNumber(performanceMetrics.total_hours, 0).toFixed(1)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Billable Hours</p>
              <p className="text-2xl font-bold text-gray-900">{safeNumber(performanceMetrics.billable_hours, 0).toFixed(1)}</p>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <Coins className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Credits Generated</p>
              <p className="text-2xl font-bold text-gray-900">{safeNumber(performanceMetrics.credits_generated, 0).toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Internal Cost</p>
              <p className="text-2xl font-bold text-gray-900">{(safeNumber(performanceMetrics.internal_cost, 0) / 1000).toFixed(0)}k</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Efficiency Score</p>
              <p className="text-2xl font-bold text-gray-900">{safeNumber(performanceMetrics.efficiency_score, 0).toFixed(0)}%</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Quality Score</p>
              <p className="text-2xl font-bold text-gray-900">{safeNumber(performanceMetrics.quality_score, 0).toFixed(0)}%</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <Users className="h-6 w-6 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.active_customers_count}</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <Briefcase className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.active_projects_count}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Work Type Assignments</h2>
            <button
              onClick={() => setShowAddWorkTypeModal(true)}
              className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          {workTypeAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No work types assigned</p>
          ) : (
            <div className="space-y-2">
              {workTypeAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{assignment.work_type?.name}</span>
                      {assignment.is_primary && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Primary</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Award className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 capitalize">{assignment.proficiency_level}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveWorkType(assignment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Capacity Periods</h2>
            <button
              onClick={() => setShowAddCapacityModal(true)}
              className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          {capacityPeriods.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No capacity periods defined</p>
          ) : (
            <div className="space-y-2">
              {capacityPeriods.slice(0, 5).map((period) => {
                const utilization = period.available_hours > 0
                  ? (safeNumber(period.actual_hours, 0) / safeNumber(period.available_hours, 1)) * 100
                  : 0;
                return (
                  <div key={period.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {new Date(period.period_start).toLocaleDateString()} -{' '}
                          {new Date(period.period_end).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">{period.capacity_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {period.actual_hours} / {period.available_hours}h
                        </p>
                        <p className="text-xs text-gray-600">{safeNumber(utilization, 0).toFixed(0)}% used</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          utilization > 90 ? 'bg-red-500' : utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, utilization)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAddWorkTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Work Type</h2>
            <form onSubmit={handleAddWorkType} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                <select
                  required
                  value={newWorkTypeAssignment.work_type_id}
                  onChange={(e) => setNewWorkTypeAssignment({ ...newWorkTypeAssignment, work_type_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Select work type</option>
                  {availableWorkTypes
                    .filter((wt) => !workTypeAssignments.some((a) => a.work_type_id === wt.id))
                    .map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level *</label>
                <select
                  required
                  value={newWorkTypeAssignment.proficiency_level}
                  onChange={(e) =>
                    setNewWorkTypeAssignment({
                      ...newWorkTypeAssignment,
                      proficiency_level: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newWorkTypeAssignment.is_primary}
                  onChange={(e) =>
                    setNewWorkTypeAssignment({ ...newWorkTypeAssignment, is_primary: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 rounded focus:ring-primary-600"
                />
                <label className="ml-2 text-sm text-gray-700">Set as primary work type</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddWorkTypeModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Work Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCapacityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Capacity Period</h2>
            <form onSubmit={handleAddCapacity} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newCapacityPeriod.period_start}
                    onChange={(e) => setNewCapacityPeriod({ ...newCapacityPeriod, period_start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newCapacityPeriod.period_end}
                    onChange={(e) => setNewCapacityPeriod({ ...newCapacityPeriod, period_end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Hours *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={newCapacityPeriod.available_hours}
                  onChange={(e) =>
                    setNewCapacityPeriod({ ...newCapacityPeriod, available_hours: parseFloat(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Type *</label>
                <select
                  required
                  value={newCapacityPeriod.capacity_type}
                  onChange={(e) =>
                    setNewCapacityPeriod({ ...newCapacityPeriod, capacity_type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="regular">Regular</option>
                  <option value="overtime">Overtime</option>
                  <option value="reduced">Reduced</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCapacityModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Capacity Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDetailPage;
