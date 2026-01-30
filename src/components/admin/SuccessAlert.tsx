import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SuccessAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  title,
  message,
  onDismiss
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('admin.success_alert.success');

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-green-800 font-medium">{displayTitle}</p>
        <p className="text-green-700 text-sm mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-green-600 hover:text-green-800 transition-colors"
          aria-label={t('admin.success_alert.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
