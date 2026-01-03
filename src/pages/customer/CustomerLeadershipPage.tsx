import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '../../components/admin/ui/Card';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CustomerLeadershipPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Users className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('customer.leadership.title', 'Leadership Development')}</h1>
          <p className="text-gray-600 mt-1">{t('customer.leadership.subtitle', 'Your leadership assessment and development plan')}</p>
        </div>
      </div>

      <Card className="p-12 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('customer.leadership.empty_title')}</h3>
        <p className="text-gray-600">{t('customer.leadership.empty_desc')}</p>
      </Card>
    </div>
  );
}
