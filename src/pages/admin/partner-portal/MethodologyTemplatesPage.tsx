import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { PageHeader } from '../../../components/admin/PageHeader';
import { Card } from '../../../components/admin/ui/Card';
import { enterpriseAPI } from '../../../lib/enterprise-api';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { MethodologyTemplate } from '../../../lib/enterprise-types';

export default function MethodologyTemplatesPage() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<MethodologyTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await enterpriseAPI.getMethodologyTemplates();
      setTemplates(data);
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
        title={t('knowledge.templates.title', 'Methodology Templates')}
        subtitle={t('knowledge.templates.subtitle', 'Reusable project templates')}
        icon={<FileText className="w-8 h-8" />}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Project Templates</h2>
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No templates available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold">{template.template_name}</h3>
                <p className="text-sm text-gray-600 mt-1">Category: {template.category}</p>
                {template.description && (
                  <p className="text-gray-700 mt-2">{template.description}</p>
                )}
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{template.typical_duration_weeks || 0} weeks</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Credits</p>
                    <p className="font-semibold">{template.typical_credits || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Used</p>
                    <p className="font-semibold">{template.usage_count} times</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
