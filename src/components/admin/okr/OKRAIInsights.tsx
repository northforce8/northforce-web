import React, { useEffect, useState } from 'react';
import { Brain, AlertTriangle, Lightbulb, TrendingUp, Target, Zap, CheckCircle2 } from 'lucide-react';
import { aiStrategicEngine, type OKRInsight, type AIRecommendation } from '../../../lib/ai-strategic-engine';

interface OKRAIInsightsProps {
  objectiveId: string;
  objective: {
    title: string;
    start_date: string;
    end_date: string;
    progress_percentage: number;
  };
}

export function OKRAIInsights({ objectiveId, objective }: OKRAIInsightsProps) {
  const [insight, setInsight] = useState<OKRInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [objectiveId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await aiStrategicEngine.analyzeObjective(objectiveId);
      setInsight(data);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-8">
          No AI insights available
        </div>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-green-700 bg-green-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high': return <Zap className="w-5 h-5 text-orange-600" />;
      case 'medium': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-l-red-500 bg-red-50';
      case 'opportunity': return 'border-l-green-500 bg-green-50';
      case 'adjustment': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Strategic Analysis</h3>
            <p className="text-sm text-gray-600">Powered by NorthForce Intelligence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-lg border ${getHealthColor(insight.health_score)}`}>
            <div className="text-sm font-medium mb-1">Health Score</div>
            <div className="text-3xl font-bold">{insight.health_score}</div>
            <div className="text-xs mt-1 opacity-75">out of 100</div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="text-sm font-medium text-gray-600 mb-1">Completion Probability</div>
            <div className="text-3xl font-bold text-gray-900">{insight.completion_probability}%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${insight.completion_probability}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-white">
            <div className="text-sm font-medium text-gray-600 mb-1">Trend</div>
            <div className="flex items-center gap-2">
              {getTrendIcon(insight.trend)}
              <span className="text-2xl font-bold text-gray-900 capitalize">{insight.trend}</span>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-2 ${getRiskColor(insight.risk_level)}`}>
              {insight.risk_level} risk
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{insight.data_points.key_results_on_track}</div>
            <div className="text-xs text-gray-600 mt-1">On Track</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{insight.data_points.key_results_at_risk}</div>
            <div className="text-xs text-gray-600 mt-1">At Risk</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{insight.data_points.key_results_behind}</div>
            <div className="text-xs text-gray-600 mt-1">Behind</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-2">Velocity Analysis</div>
              <div className="text-sm text-gray-600">
                Current progress velocity: <span className="font-semibold text-gray-900">{insight.data_points.velocity}% per day</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Days remaining: <span className="font-semibold text-gray-900">{insight.data_points.days_remaining} days</span>
              </div>
            </div>
            {insight.predicted_completion_date && (
              <div className="text-right">
                <div className="text-xs text-gray-600">Predicted Completion</div>
                <div className="text-sm font-semibold text-gray-900">{insight.predicted_completion_date}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {insight.recommendations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-gray-900">AI Recommendations</h4>
            <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {insight.recommendations.length} insights
            </span>
          </div>

          <div className="space-y-3">
            {insight.recommendations.map((rec: AIRecommendation) => (
              <div
                key={rec.id}
                className={`border-l-4 rounded-lg p-4 ${getRecommendationColor(rec.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getPriorityIcon(rec.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-900">{rec.title}</h5>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        rec.priority === 'critical' ? 'bg-red-200 text-red-800' :
                        rec.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                        rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        Impact: {rec.impact_score}/100
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                    <div className="text-xs text-gray-600 mb-3 bg-white bg-opacity-60 p-2 rounded">
                      <span className="font-medium">Reasoning:</span> {rec.reasoning}
                    </div>
                    {rec.suggested_actions.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-700">Suggested Actions:</div>
                        <ul className="space-y-1">
                          {rec.suggested_actions.map((action, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <span className="text-gray-400 mt-0.5">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <span>Confidence: {rec.confidence}</span>
                      <span>•</span>
                      <span className="capitalize">{rec.type} insight</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
