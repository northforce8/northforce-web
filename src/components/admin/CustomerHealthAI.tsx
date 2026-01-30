/**
 * Customer Health AI Module
 *
 * Displays AI-powered health analysis, risk detection, and recommended actions
 * for a specific customer.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { aiService } from '../../lib/ai-service';
import { useLanguage } from '../../contexts/LanguageContext';
import type { CustomerHealthSummary, AIFlag, AIAction, RiskLevel } from '../../lib/ai-service';

interface CustomerHealthAIProps {
  customerId: string;
  onActionTaken?: () => void;
}

const CustomerHealthAI: React.FC<CustomerHealthAIProps> = ({ customerId, onActionTaken }) => {
  const { t } = useLanguage();
  const [health, setHealth] = useState<CustomerHealthSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReasoningData, setShowReasoningData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHealthAnalysis();
  }, [customerId]);

  const loadHealthAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const analysis = await aiService.analyzeCustomerHealth(customerId);
      setHealth(analysis);
    } catch (err) {
      console.error('Error loading health analysis:', err);
      setError(t('customer_health.error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskLevelIcon = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'low':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: AIAction['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'high':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'medium':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'low':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-5 h-5 text-primary-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Health Analysis</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Analyzing customer health...</p>
        </div>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Health Analysis</h3>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">{error || 'Unable to load analysis'}</p>
          <button
            onClick={loadHealthAnalysis}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-cyan-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Zap className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Decision Support</h3>
              <p className="text-sm text-gray-600">Real-time health analysis & recommendations</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border-2 flex items-center space-x-2 ${getRiskLevelColor(health.risk_level)}`}>
            {getRiskLevelIcon(health.risk_level)}
            <span className="font-semibold capitalize">{health.risk_level} Risk</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Health Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Health Score</span>
            <span className="text-2xl font-bold text-gray-900">{health.health_score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                health.health_score >= 80
                  ? 'bg-green-500'
                  : health.health_score >= 60
                  ? 'bg-yellow-500'
                  : health.health_score >= 40
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${health.health_score}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Confidence: <span className="font-medium capitalize">{health.confidence}</span>
          </p>
        </div>

        {/* Reasoning */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">{health.reasoning}</p>
            </div>
          </div>
        </div>

        {/* Risk Flags */}
        {health.flags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
              Active Risk Flags ({health.flags.length})
            </h4>
            <div className="space-y-2">
              {health.flags.map((flag, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    flag.severity === 'critical'
                      ? 'bg-red-50 border-red-500'
                      : flag.severity === 'high'
                      ? 'bg-amber-50 border-amber-500'
                      : flag.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {flag.flag_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{flag.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Triggered by: {flag.triggered_by.replace(/_/g, ' ')} |
                        Threshold: {flag.threshold_value} | Actual: {flag.actual_value.toFixed(1)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      flag.severity === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : flag.severity === 'high'
                        ? 'bg-amber-200 text-amber-800'
                        : flag.severity === 'medium'
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {flag.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {health.next_actions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-primary-600" />
              Next Best Actions ({health.next_actions.length})
            </h4>
            <div className="space-y-2">
              {health.next_actions.map((action) => (
                <div
                  key={action.action_id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-gray-900">{action.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ml-3 ${
                      action.priority === 'critical'
                        ? 'bg-red-200 text-red-800'
                        : action.priority === 'high'
                        ? 'bg-amber-200 text-amber-800'
                        : action.priority === 'medium'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {action.priority}
                    </span>
                  </div>
                  {action.link && (
                    <Link
                      to={action.link}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium mt-3 ${getPriorityColor(action.priority)}`}
                    >
                      <span className="capitalize">{action.action_type.replace(/_/g, ' ')}</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Points Toggle */}
        <div>
          <button
            onClick={() => setShowReasoningData(!showReasoningData)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {showReasoningData ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span>Show Reasoning Data</span>
          </button>

          {showReasoningData && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-3">Data Points Used</h5>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(health.data_points).map(([key, value]) => (
                  <div key={key} className="bg-white rounded p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Last analyzed: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={loadHealthAnalysis}
            className="w-full px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Refresh Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHealthAI;
