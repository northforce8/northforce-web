import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  fullScreen = true
}) => {
  const { t } = useLanguage();
  const displayMessage = message || t('admin.loading_state.loading');

  const containerClass = fullScreen
    ? 'flex items-center justify-center h-screen'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3">
        <RefreshCw className="h-5 w-5 text-primary-600 animate-spin" />
        <span className="text-gray-600">{displayMessage}</span>
      </div>
    </div>
  );
};
