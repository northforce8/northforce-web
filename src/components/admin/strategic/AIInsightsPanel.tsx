import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';

interface AIInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat' | 'recommendation' | 'warning';
  title: string;
  description: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  confidence?: number;
  actions?: string[];
}

interface AIInsightsPanelProps {
  title?: string;
  insights: AIInsight[];
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function AIInsightsPanel({
  title = 'AI-Driven Insights',
  insights,
  loading = false,
  onRefresh,
  className = ''
}: AIInsightsPanelProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpanded(newExpanded);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'weakness':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-blue-600" />;
      case 'threat':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'recommendation':
        return <Target className="w-5 h-5 text-purple-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength':
        return 'bg-green-50 border-green-200';
      case 'weakness':
        return 'bg-yellow-50 border-yellow-200';
      case 'opportunity':
        return 'bg-blue-50 border-blue-200';
      case 'threat':
        return 'bg-red-50 border-red-200';
      case 'recommendation':
        return 'bg-purple-50 border-purple-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;

    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded border ${colors[priority as keyof typeof colors]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Refresh insights"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No AI insights available yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            {onRefresh ? 'Click refresh to generate insights.' : 'Insights will appear here when available.'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            {insights.length} insight{insights.length !== 1 ? 's' : ''}
          </span>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh insights"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border rounded-lg transition-all ${getInsightColor(insight.type)}`}
          >
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/50 transition-colors rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {insight.priority && getPriorityBadge(insight.priority)}
                    {expanded.has(index) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                {!expanded.has(index) && (
                  <p className="text-sm text-gray-600 line-clamp-1">{insight.description}</p>
                )}
              </div>
            </button>

            {expanded.has(index) && (
              <div className="px-4 pb-4 pt-0">
                <div className="pl-8">
                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

                  {insight.confidence !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Confidence</span>
                        <span className="font-medium">{insight.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {insight.actions && insight.actions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Suggested Actions:</p>
                      <ul className="space-y-1">
                        {insight.actions.map((action, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-600 flex-shrink-0">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
