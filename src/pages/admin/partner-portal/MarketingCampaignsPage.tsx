import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Edit2, Trash2, AlertTriangle, RefreshCw, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logAdminError } from '../../../lib/admin-error-logger';
import type { MarketingCampaign } from '../../../lib/enterprise-types';

export default function MarketingCampaignsPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    customer_id: '',
    campaign_name: '',
    description: '',
    objective: '',
    target_audience: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    budget_allocated: '',
    status: 'planning' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [campaignsData, customersData] = await Promise.all([
        enterpriseAPI.getMarketingCampaigns(),
        partnerPortalApi.getCustomers()
      ]);
      setCampaigns(campaignsData);
      setCustomers(customersData);
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'MarketingCampaignsPage.loadData',
        action: 'Loading campaigns and customers'
      });
      console.error(`[${errorId}] Error loading data:`, err);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      campaign_name: '',
      description: '',
      objective: '',
      target_audience: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      budget_allocated: '',
      status: 'planning'
    });
    setSelectedCampaign(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const budgetValue = parseFloat(formData.budget_allocated);
      if (isNaN(budgetValue) || budgetValue < 0) {
        setError('Please enter a valid budget amount.');
        return;
      }

      await enterpriseAPI.createMarketingCampaign({
        ...formData,
        budget_allocated: budgetValue,
        budget_spent: 0,
        credits_allocated: 0,
        credits_spent: 0,
        leads_generated: 0,
        conversions_actual: 0,
        approved_by_customer: false
      });
      setShowCreateModal(false);
      resetForm();
      setSuccess('Marketing campaign created successfully!');
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'MarketingCampaignsPage.handleCreate',
        action: 'Creating marketing campaign'
      });
      console.error(`[${errorId}] Error creating campaign:`, err);
      setError('Failed to create campaign. Please try again.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    try {
      setError(null);
      const budgetValue = parseFloat(formData.budget_allocated);
      if (isNaN(budgetValue) || budgetValue < 0) {
        setError('Please enter a valid budget amount.');
        return;
      }

      await enterpriseAPI.updateMarketingCampaign(selectedCampaign.id, {
        ...formData,
        budget_allocated: budgetValue
      });
      setShowCreateModal(false);
      resetForm();
      setSuccess('Marketing campaign updated successfully!');
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'MarketingCampaignsPage.handleUpdate',
        action: 'Updating marketing campaign'
      });
      console.error(`[${errorId}] Error updating campaign:`, err);
      setError('Failed to update campaign. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      await enterpriseAPI.deleteMarketingCampaign(id);
      setSuccess('Marketing campaign deleted successfully!');
      await loadData();
    } catch (err) {
      const errorId = logAdminError(err as Error, {
        context: 'MarketingCampaignsPage.handleDelete',
        action: 'Deleting marketing campaign'
      });
      console.error(`[${errorId}] Error deleting campaign:`, err);
      setError('Failed to delete campaign. Please try again.');
    }
  };

  const handleEdit = (campaign: MarketingCampaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      customer_id: campaign.customer_id,
      campaign_name: campaign.campaign_name,
      description: campaign.description || '',
      objective: campaign.objective || '',
      target_audience: campaign.target_audience || '',
      start_date: campaign.start_date,
      end_date: campaign.end_date || '',
      budget_allocated: campaign.budget_allocated.toString(),
      status: campaign.status
    });
    setShowCreateModal(true);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = !searchQuery ||
      campaign.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.objective?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.target_audience?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-primary-600 animate-spin" />
          <span className="text-gray-600">Loading campaigns...</span>
        </div>
      </div>
    );
  }

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads_generated, 0),
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget_allocated, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.budget_spent, 0),
    avgROI: campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + (c.roi_actual || 0), 0) / campaigns.length
      : 0
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-700 text-sm mt-1">{success}</p>
          </div>
        </div>
      )}

      <PageHeader
        title={t('marketing.campaigns.title', 'Marketing Campaigns')}
        description={t('marketing.campaigns.subtitle', 'Plan, execute, and track marketing campaign performance')}
        action={{
          label: 'Create Campaign',
          onClick: () => {
            resetForm();
            setShowCreateModal(true);
          },
          icon: Plus
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Campaigns</p>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active</p>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Leads</p>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg ROI</p>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {stats.avgROI.toFixed(1)}x
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">All Campaigns</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No campaigns found' : 'No campaigns yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first marketing campaign to start tracking performance.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create First Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{campaign.campaign_name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                        campaign.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {(campaign as any).customer?.company_name || 'Unknown Customer'}
                    </p>
                    {campaign.objective && (
                      <p className="text-sm text-gray-700 mb-3">{campaign.objective}</p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-semibold">{campaign.budget_allocated.toLocaleString()} SEK</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Spent</p>
                        <p className="font-semibold">{campaign.budget_spent.toLocaleString()} SEK</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Leads Generated</p>
                        <p className="font-semibold">{campaign.leads_generated}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ROI</p>
                        <p className="font-semibold">{campaign.roi_actual ? `${campaign.roi_actual.toFixed(1)}x` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit campaign"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          title={selectedCampaign ? 'Edit Campaign' : 'Create Campaign'}
        >
          <form onSubmit={selectedCampaign ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
              <input
                type="text"
                required
                value={formData.campaign_name}
                onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                placeholder="e.g., Q1 2024 Brand Awareness Campaign"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                rows={2}
                placeholder="Campaign objective..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                placeholder="e.g., CEOs in tech companies"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (SEK) *</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.budget_allocated}
                onChange={(e) => setFormData({ ...formData, budget_allocated: e.target.value })}
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {selectedCampaign ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
