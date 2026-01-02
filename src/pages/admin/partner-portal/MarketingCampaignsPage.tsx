import React, { useState, useEffect } from 'react';
import { Target, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { Modal } from '../../../components/admin/ui/Modal';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { partnerPortalApi } from '../../../lib/partner-portal-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { MarketingCampaign } from '../../../lib/enterprise-types';

export default function MarketingCampaignsPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    campaign_name: '',
    description: '',
    objective: '',
    target_audience: '',
    start_date: new Date().toISOString().split('T')[0],
    budget_allocated: '',
    status: 'planning' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsData, customersData] = await Promise.all([
        enterpriseAPI.getMarketingCampaigns(),
        partnerPortalApi.getCustomers()
      ]);
      setCampaigns(campaignsData);
      setCustomers(customersData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enterpriseAPI.createMarketingCampaign({
        ...formData,
        budget_allocated: parseFloat(formData.budget_allocated) || 0,
        budget_spent: 0,
        credits_allocated: 0,
        credits_spent: 0,
        leads_generated: 0,
        conversions_actual: 0,
        approved_by_customer: false
      });
      setShowCreateModal(false);
      await loadData();
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalLeads: campaigns.reduce((sum, c) => sum + c.leads_generated, 0),
    totalROI: campaigns.reduce((sum, c) => {
      if (c.budget_spent > 0 && c.roi_actual) {
        return sum + c.roi_actual;
      }
      return sum;
    }, 0)
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('marketing.campaigns.title', 'Marketing Campaigns')}
        subtitle={t('marketing.campaigns.subtitle', 'Plan and track marketing performance')}
        icon={<Target className="w-8 h-8" />}
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Leads</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Avg ROI</p>
          <p className="text-3xl font-bold">
            {campaigns.length > 0 ? (stats.totalROI / campaigns.length).toFixed(1) : 0}x
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Campaigns</h2>
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No campaigns yet. Create your first campaign.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{campaign.campaign_name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {(campaign as any).customer?.company_name || 'Unknown Customer'}
                    </p>
                    {campaign.objective && (
                      <p className="text-sm text-gray-700 mt-2">{campaign.objective}</p>
                    )}
                    <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-semibold">{campaign.budget_allocated.toLocaleString()} SEK</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Spent</p>
                        <p className="font-semibold">{campaign.budget_spent.toLocaleString()} SEK</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Leads</p>
                        <p className="font-semibold">{campaign.leads_generated}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-semibold capitalize">{campaign.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showCreateModal && (
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Campaign">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <select
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (SEK)</label>
              <input
                type="number"
                value={formData.budget_allocated}
                onChange={(e) => setFormData({ ...formData, budget_allocated: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Campaign
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
