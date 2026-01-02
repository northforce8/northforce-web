import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, Search, Calendar, Target, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { StatusIndicator } from '../../../components/admin/StatusIndicator';
import InfoIcon from '../../../components/admin/InfoIcon';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { GrowthPlan } from '../../../lib/enterprise-types';
import { partnerPortalApi } from '../../../lib/partner-portal-api';

type Customer = {
  id: string;
  company_name: string;
};

export default function GrowthPlansPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [plans, setPlans] = useState<GrowthPlan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_name: '',
    vision_statement: '',
    mission_statement: '',
    time_horizon_months: 12,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'draft' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [plansData, customersData] = await Promise.all([
        enterpriseAPI.getGrowthPlans(),
        partnerPortalApi.getCustomers()
      ]);
      setPlans(plansData);
      setCustomers(customersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endDate = formData.end_date || calculateEndDate(formData.start_date, formData.time_horizon_months);

      await enterpriseAPI.createGrowthPlan({
        ...formData,
        end_date: endDate,
        overall_progress: 0
      });

      setShowCreateModal(false);
      setFormData({
        customer_id: '',
        plan_name: '',
        vision_statement: '',
        mission_statement: '',
        time_horizon_months: 12,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'draft'
      });

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create plan');
      console.error('Error creating plan:', err);
    }
  };

  const calculateEndDate = (startDate: string, months: number): string => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      on_hold: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'active':
        return <Circle className="w-4 h-4 fill-current" />;
      case 'on_hold':
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: plans.length,
    active: plans.filter(p => p.status === 'active').length,
    completed: plans.filter(p => p.status === 'completed').length,
    avgProgress: plans.length > 0
      ? Math.round(plans.reduce((sum, p) => sum + p.overall_progress, 0) / plans.length)
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{t('common.loading', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('growth.plans.title', 'Growth Plans')}
        subtitle={t('growth.plans.subtitle', 'Strategic growth planning and tracking')}
        icon={<TrendingUp className="w-8 h-8" />}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('growth.plans.create', 'Create Plan')}
        </button>
      </PageHeader>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('growth.plans.stats.total', 'Total Plans')}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('growth.plans.stats.active', 'Active')}</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Circle className="w-8 h-8 text-green-600 fill-current" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('growth.plans.stats.completed', 'Completed')}</p>
              <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('growth.plans.stats.avgProgress', 'Avg Progress')}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgProgress}%</p>
            </div>
            <Target className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{t('growth.plans.allPlans', 'All Growth Plans')}</h2>
            <InfoIcon helpId="growth_plans" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search', 'Search...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('common.allStatuses', 'All Statuses')}</option>
              <option value="draft">{t('common.status.draft', 'Draft')}</option>
              <option value="active">{t('common.status.active', 'Active')}</option>
              <option value="on_hold">{t('common.status.onHold', 'On Hold')}</option>
              <option value="completed">{t('common.status.completed', 'Completed')}</option>
              <option value="cancelled">{t('common.status.cancelled', 'Cancelled')}</option>
            </select>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? t('growth.plans.noResults', 'No plans match your filters')
                : t('growth.plans.empty', 'No growth plans yet. Create your first plan to get started.')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => navigate(`/admin/partner-portal/growth-plans/${plan.id}`)}
                className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.plan_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(plan.status)}`}>
                        {getStatusIcon(plan.status)}
                        {t(`common.status.${plan.status}`, plan.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {(plan as any).customer?.company_name || 'Unknown Customer'}
                    </p>
                    {plan.vision_statement && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">{plan.vision_statement}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('growth.plans.horizon', 'Time Horizon')}</p>
                    <p className="text-sm font-medium">{plan.time_horizon_months} {t('common.months', 'months')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('growth.plans.startDate', 'Start Date')}</p>
                    <p className="text-sm font-medium">{new Date(plan.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('growth.plans.endDate', 'End Date')}</p>
                    <p className="text-sm font-medium">
                      {plan.end_date ? new Date(plan.end_date).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('growth.plans.progress', 'Progress')}</p>
                    <p className="text-sm font-medium">{plan.overall_progress}%</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(plan.overall_progress)} transition-all duration-500`}
                      style={{ width: `${plan.overall_progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={t('growth.plans.createNew', 'Create New Growth Plan')}
        >
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('growth.plans.customer', 'Customer')} *
              </label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('common.selectOption', 'Select...')}</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('growth.plans.planName', 'Plan Name')} *
              </label>
              <input
                type="text"
                required
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                placeholder={t('growth.plans.planNamePlaceholder', 'e.g., 2024 Growth Strategy')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('growth.plans.vision', 'Vision Statement')}
              </label>
              <textarea
                value={formData.vision_statement}
                onChange={(e) => setFormData({ ...formData, vision_statement: e.target.value })}
                rows={3}
                placeholder={t('growth.plans.visionPlaceholder', 'Where do you want to be?')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('growth.plans.mission', 'Mission Statement')}
              </label>
              <textarea
                value={formData.mission_statement}
                onChange={(e) => setFormData({ ...formData, mission_statement: e.target.value })}
                rows={3}
                placeholder={t('growth.plans.missionPlaceholder', 'How will you get there?')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('growth.plans.horizon', 'Time Horizon (months)')} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="60"
                  value={formData.time_horizon_months}
                  onChange={(e) => setFormData({ ...formData, time_horizon_months: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('growth.plans.startDate', 'Start Date')} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.create', 'Create')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
