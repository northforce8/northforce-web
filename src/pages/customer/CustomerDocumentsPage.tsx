import React from 'react';
import { FileText, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const CustomerDocumentsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('customer.documents.title')}</h1>
        <p className="text-gray-500 mt-2">{t('customer.documents.subtitle')}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('customer.documents.coming_soon')}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {t('customer.documents.coming_soon_text')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDocumentsPage;
