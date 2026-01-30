import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type {
  DeliveryStatus,
  StrategicStatus,
  CommercialStatus,
  CollaborationStatus,
  ImpactStatus,
} from '../../lib/partner-portal-types';

interface StatusIndicatorProps {
  type: 'delivery' | 'strategic' | 'commercial' | 'collaboration' | 'impact';
  status: DeliveryStatus | StrategicStatus | CommercialStatus | CollaborationStatus | ImpactStatus;
  showLabel?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ type, status, showLabel = true }) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    const configs = {
      delivery: {
        on_track: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, labelKey: 'admin.status_indicator.on_track' },
        at_risk: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, labelKey: 'admin.status_indicator.at_risk' },
        delayed: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, labelKey: 'admin.status_indicator.delayed' },
      },
      strategic: {
        initiering: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock, labelKey: 'admin.status_indicator.initiation' },
        aktiv: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, labelKey: 'admin.status_indicator.active' },
        skalning: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle, labelKey: 'admin.status_indicator.scaling' },
        optimering: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle, labelKey: 'admin.status_indicator.optimization' },
        pausad: { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock, labelKey: 'admin.status_indicator.paused' },
      },
      commercial: {
        under_scope: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, labelKey: 'admin.status_indicator.under_scope' },
        near_limit: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, labelKey: 'admin.status_indicator.near_limit' },
        over_scope: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, labelKey: 'admin.status_indicator.over_scope' },
      },
      collaboration: {
        fungerar_bra: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, labelKey: 'admin.status_indicator.working_well' },
        kraver_beslut: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, labelKey: 'admin.status_indicator.needs_decision' },
        blockerad: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, labelKey: 'admin.status_indicator.blocked' },
      },
      impact: {
        positiv_trend: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, labelKey: 'admin.status_indicator.positive_trend' },
        neutral: { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock, labelKey: 'admin.status_indicator.neutral' },
        negativ_trend: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, labelKey: 'admin.status_indicator.negative_trend' },
      },
    };

    return configs[type][status as keyof typeof configs[typeof type]];
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${config.color} text-sm font-medium`}>
      <Icon className="w-4 h-4" />
      {showLabel && <span>{t(config.labelKey)}</span>}
    </div>
  );
};

export default StatusIndicator;
