import React from 'react';
import {
  AlertCircle,
  CheckCircle,
  X,
  FileText,
  Coins,
  Calendar,
  AlertTriangle,
  Users,
  TrendingUp,
} from 'lucide-react';
import type { Recommendation } from '../../lib/partner-portal-types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onDismiss?: (id: string) => void;
  onAction?: (id: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onDismiss,
  onAction,
}) => {
  const getIcon = () => {
    const icons = {
      scope_review: FileText,
      credits_topup: Coins,
      strategy_meeting: Calendar,
      risk_alert: AlertTriangle,
      partner_change: Users,
      capacity_upgrade: TrendingUp,
    };
    return icons[recommendation.recommendation_type];
  };

  const getPriorityConfig = () => {
    const configs = {
      critical: { color: 'border-red-500 bg-red-50', textColor: 'text-red-700', badgeColor: 'bg-red-100 text-red-800' },
      high: { color: 'border-orange-500 bg-orange-50', textColor: 'text-orange-700', badgeColor: 'bg-orange-100 text-orange-800' },
      medium: { color: 'border-yellow-500 bg-yellow-50', textColor: 'text-yellow-700', badgeColor: 'bg-yellow-100 text-yellow-800' },
      low: { color: 'border-blue-500 bg-blue-50', textColor: 'text-blue-700', badgeColor: 'bg-blue-100 text-blue-800' },
    };
    return configs[recommendation.priority];
  };

  const Icon = getIcon();
  const config = getPriorityConfig();

  return (
    <div className={`border-l-4 ${config.color} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${config.badgeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.badgeColor}`}>
                {recommendation.priority.toUpperCase()}
              </span>
              {recommendation.ai_priority_score !== undefined && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                  Priority: {recommendation.ai_priority_score}/100
                </span>
              )}
              {recommendation.business_criticality && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  recommendation.business_criticality === 'critical' ? 'bg-red-100 text-red-800 border border-red-300' :
                  recommendation.business_criticality === 'high' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                  recommendation.business_criticality === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                  'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {recommendation.business_criticality.charAt(0).toUpperCase() + recommendation.business_criticality.slice(1)} Impact
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{recommendation.description}</p>
            {recommendation.reasoning && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Why:</span> {recommendation.reasoning}
              </p>
            )}
            {recommendation.suggested_action && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Suggested action:</span> {recommendation.suggested_action}
              </p>
            )}
          </div>
        </div>
        {onDismiss && recommendation.status === 'active' && (
          <button
            onClick={() => onDismiss(recommendation.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {recommendation.status === 'active' && (onAction || onDismiss) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          {onAction && (
            <button
              onClick={() => onAction(recommendation.id)}
              className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Actioned
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => onDismiss(recommendation.id)}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {recommendation.status !== 'active' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {recommendation.status === 'dismissed' ? 'Dismissed' : 'Actioned'} on{' '}
            {new Date(recommendation.actioned_at!).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;