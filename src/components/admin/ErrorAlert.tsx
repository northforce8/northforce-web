import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  onDismiss
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('admin.error_alert.error');

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-800 font-medium">{displayTitle}</p>
        <p className="text-red-700 text-sm mt-1">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 transition-colors"
          aria-label={t('admin.error_alert.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
