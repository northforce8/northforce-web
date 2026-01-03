import React, { useState, useEffect } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { Card } from '../../components/admin/ui/Card';
import { enterpriseAPI } from '../../lib/enterprise-api';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CustomerGrowthJourneyPage() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await enterpriseAPI.getGrowthPlans();
      setPlans(data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">{t('customer.growth.loading')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <TrendingUp className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('customer.growth.title', 'My Growth Journey')}</h1>
          <p className="text-gray-600 mt-1">{t('customer.growth.subtitle', 'Track your strategic objectives and progress')}</p>
        </div>
      </div>

      {plans.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('customer.growth.empty_title')}</h3>
          <p className="text-gray-600">{t('customer.growth.empty_desc')}</p>
        </Card>
      ) : (
        plans.map((plan) => (
          <Card key={plan.id} className="p-6">
            <h2 className="text-2xl font-bold mb-4">{plan.plan_name}</h2>
            {plan.vision_statement && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">{t('customer.growth.vision')}</h3>
                <p className="text-gray-800">{plan.vision_statement}</p>
              </div>
            )}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{t('customer.growth.overall_progress')}</span>
                <span className="font-semibold">{plan.overall_progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${plan.overall_progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
