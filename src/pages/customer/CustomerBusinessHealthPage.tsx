import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card } from '../../components/admin/ui/Card';
import { enterpriseAPI } from '../../lib/enterprise-api';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CustomerBusinessHealthPage() {
  const { t } = useLanguage();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allCustomers = await import('../../lib/partner-portal-api').then(m => m.partnerPortalApi.getCustomers());
      if (allCustomers.length > 0) {
        const data = await enterpriseAPI.getStrategicGoals(allCustomers[0].id);
        setGoals(data);
      }
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
        <BarChart3 className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('customer.businessHealth.title', 'Business Health')}</h1>
          <p className="text-gray-600 mt-1">{t('customer.businessHealth.subtitle', 'Strategic goals and performance tracking')}</p>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Strategic Goals Yet</h3>
          <p className="text-gray-600">Your consultant will define strategic goals with you.</p>
        </Card>
      ) : (
        goals.map((goal) => (
          <Card key={goal.id} className="p-6">
            <h2 className="text-xl font-bold mb-2">{goal.goal_name}</h2>
            <p className="text-sm text-gray-600 capitalize mb-4">Category: {goal.goal_category.replace('_', ' ')}</p>
            {goal.description && (
              <p className="text-gray-700 mb-4">{goal.description}</p>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Baseline</p>
                <p className="text-lg font-semibold">{goal.baseline_value || '-'} {goal.unit || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current</p>
                <p className="text-lg font-semibold">{goal.current_value || '-'} {goal.unit || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Target</p>
                <p className="text-lg font-semibold">{goal.target_value || '-'} {goal.unit || ''}</p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
