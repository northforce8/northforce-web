import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { BestPractice } from '../../../lib/enterprise-types';

export default function BestPracticesPage() {
  const { t } = useLanguage();
  const [practices, setPractices] = useState<BestPractice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await enterpriseAPI.getBestPractices();
      setPractices(data);
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
        title={t('knowledge.bestPractices.title', 'Best Practices')}
        subtitle={t('knowledge.bestPractices.subtitle', 'Knowledge base of proven methodologies')}
        icon={<Lightbulb className="w-8 h-8" />}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
        {practices.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No best practices documented yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {practices.map((practice) => (
              <div key={practice.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold">{practice.practice_title}</h3>
                <p className="text-sm text-gray-600 mt-1">Category: {practice.category}</p>
                <p className="text-gray-700 mt-2">{practice.description}</p>
                <div className="mt-3 text-sm text-gray-500">
                  Views: {practice.view_count}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
