/**
 * Reports Insights AI Module - Top actionable insights
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, AlertTriangle, Target, ExternalLink, ChevronRight } from 'lucide-react';
import { aiService } from '../../lib/ai-service';
import type { ReportInsight } from '../../lib/ai-service';

const ReportsInsightsAI: React.FC = () => {
  const [insights, setInsights] = useState<ReportInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await aiService.generateTopInsights(5);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'trend':
        return <Target className="w-5 h-5 text-blue-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">AI Intelligence</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-3">Analyzing data...</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Sparkles className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-900">All Clear</h4>
            <p className="text-xs text-green-700 mt-1">No critical insights at this time. System is operating normally.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Intelligence</h3>
            <p className="text-sm text-gray-600">Top {insights.length} actionable insights this week</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {insights.map((insight, index) => (
          <div
            key={insight.insight_id}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-0.5">{getInsightIcon(insight.insight_type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                    <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                  {insight.affected_entities.customer_ids && insight.affected_entities.customer_ids.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Affects {insight.affected_entities.customer_ids.length} customer{insight.affected_entities.customer_ids.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ml-3 ${getPriorityColor(insight.priority)}`}>
                {insight.priority}
              </span>
            </div>

            {insight.recommended_actions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                {insight.recommended_actions.map((action) => (
                  <Link
                    key={action.action_id}
                    to={action.link || '#'}
                    className={`flex items-center justify-between p-2 rounded text-sm font-medium transition-colors ${
                      action.priority === 'critical'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : action.priority === 'high'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <span>{action.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={loadInsights}
          className="w-full mt-4 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          Refresh Insights
        </button>
      </div>
    </div>
  );
};

export default ReportsInsightsAI;
