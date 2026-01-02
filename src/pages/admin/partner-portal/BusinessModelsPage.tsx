import React, { useState, useEffect } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { BusinessModel } from '../../../lib/enterprise-types';

export default function BusinessModelsPage() {
  const { t } = useLanguage();
  const [models, setModels] = useState<BusinessModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allCustomers = await import('../../../lib/partner-portal-api').then(m => m.partnerPortalApi.getCustomers());
      const allModels: BusinessModel[] = [];
      for (const customer of allCustomers) {
        const customerModels = await enterpriseAPI.getBusinessModels(customer.id);
        allModels.push(...customerModels);
      }
      setModels(allModels);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('business.models.title', 'Business Models')}
        subtitle={t('business.models.subtitle', 'Business Model Canvas documentation')}
        icon={<Briefcase className="w-8 h-8" />}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Business Models</h2>
        {models.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No business models documented yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold">{model.model_name}</h3>
                {model.value_proposition && (
                  <p className="text-gray-700 mt-2">{model.value_proposition}</p>
                )}
                <div className="mt-4 text-sm text-gray-600">
                  Version: {model.version} {model.is_current && <span className="text-green-600">(Current)</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
