import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
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
  const getStatusConfig = () => {
    const configs = {
      delivery: {
        on_track: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'On Track' },
        at_risk: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, label: 'At Risk' },
        delayed: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, label: 'Delayed' },
      },
      strategic: {
        initiering: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Clock, label: 'Initiering' },
        aktiv: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Aktiv' },
        skalning: { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: CheckCircle, label: 'Skalning' },
        optimering: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle, label: 'Optimering' },
        pausad: { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock, label: 'Pausad' },
      },
      commercial: {
        under_scope: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Under Scope' },
        near_limit: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, label: 'Near Limit' },
        over_scope: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, label: 'Over Scope' },
      },
      collaboration: {
        fungerar_bra: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Fungerar bra' },
        kraver_beslut: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle, label: 'Kräver beslut' },
        blockerad: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, label: 'Blockerad' },
      },
      impact: {
        positiv_trend: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Positiv trend' },
        neutral: { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: Clock, label: 'Neutral' },
        negativ_trend: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle, label: 'Negativ trend' },
      },
    };

    return configs[type][status as keyof typeof configs[typeof type]];
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${config.color} text-sm font-medium`}>
      <Icon className="w-4 h-4" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};

export default StatusIndicator;