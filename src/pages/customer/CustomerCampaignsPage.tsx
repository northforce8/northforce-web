import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Card } from '../../components/admin/ui/Card';
import { enterpriseAPI } from '../../lib/enterprise-api';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CustomerCampaignsPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await enterpriseAPI.getMarketingCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Target className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('customer.campaigns.title', 'Marketing Performance')}</h1>
          <p className="text-gray-600 mt-1">{t('customer.campaigns.subtitle', 'Track your marketing campaigns and ROI')}</p>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
          <p className="text-gray-600">Marketing campaigns will appear here when launched.</p>
        </Card>
      ) : (
        campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <h2 className="text-xl font-bold mb-2">{campaign.campaign_name}</h2>
            <p className="text-gray-600 mb-4">{campaign.objective}</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-lg font-semibold">{campaign.budget_allocated.toLocaleString()} SEK</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Leads</p>
                <p className="text-lg font-semibold">{campaign.leads_generated}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold capitalize">{campaign.status}</p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
