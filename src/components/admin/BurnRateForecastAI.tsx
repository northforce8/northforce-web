/**
 * Burn Rate Forecast AI Module
 *
 * Shows AI-powered burn rate predictions with confidence bands
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { aiService } from '../../lib/ai-service';
import type { BurnRateForecast } from '../../lib/ai-service';

interface BurnRateForecastAIProps {
  customerId: string;
}

const BurnRateForecastAI: React.FC<BurnRateForecastAIProps> = ({ customerId }) => {
  const [forecast, setForecast] = useState<BurnRateForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadForecast();
  }, [customerId]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      const data = await aiService.forecastBurnRate(customerId);
      setForecast(data);
    } catch (error) {
      console.error('Error loading forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  const getDaysColor = (days: number) => {
    if (days < 5) return 'text-red-600';
    if (days < 10) return 'text-orange-600';
    if (days < 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = () => {
    if (forecast.data_points.trend === 'increasing') {
      return <TrendingUp className="w-5 h-5 text-red-600" />;
    } else if (forecast.data_points.trend === 'decreasing') {
      return <TrendingDown className="w-5 h-5 text-green-600" />;
    }
    return <Zap className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <h4 className="text-sm font-semibold text-gray-900">AI Burn Rate Forecast</h4>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            forecast.confidence === 'high'
              ? 'bg-green-100 text-green-800'
              : forecast.confidence === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {forecast.confidence} confidence
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current burn rate:</span>
            <span className="text-lg font-bold text-gray-900">
              {forecast.current_burn_rate.toFixed(1)} <span className="text-sm font-normal">credits/day</span>
            </span>
          </div>

          {forecast.days_remaining < 999 && (
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-gray-700">Depletion forecast:</span>
              <div className="text-right">
                <div className={`text-xl font-bold ${getDaysColor(forecast.days_remaining)}`}>
                  {forecast.days_remaining} days
                </div>
                <div className="text-xs text-gray-500">{forecast.forecasted_depletion_date}</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-xs text-gray-500 mb-2">Confidence Band</div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-gray-600">Best case</div>
                <div className="font-semibold text-green-600">{forecast.confidence_band.best_case_days}d</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Most likely</div>
                <div className="font-bold text-blue-600">{forecast.days_remaining}d</div>
              </div>
              <div className="text-right">
                <div className="text-gray-600">Worst case</div>
                <div className="font-semibold text-red-600">{forecast.confidence_band.worst_case_days}d</div>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="flex items-start space-x-2 bg-white bg-opacity-60 rounded p-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700">{forecast.reasoning}</p>
          </div>

          {/* Actions */}
          {forecast.recommended_actions.length > 0 && (
            <div className="space-y-2">
              {forecast.recommended_actions.map((action) => (
                <Link
                  key={action.action_id}
                  to={action.link || '#'}
                  className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                    action.priority === 'critical'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : action.priority === 'high'
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <span>{action.title}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              ))}
            </div>
          )}

          {/* Show Data Points */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center space-x-2 text-xs text-blue-700 hover:text-blue-800 py-2"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{showDetails ? 'Hide' : 'Show'} data points</span>
          </button>

          {showDetails && (
            <div className="bg-white rounded-lg p-3 border border-blue-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Credits balance:</span>
                <span className="font-semibold">{forecast.data_points.credits_balance.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Avg daily (7d):</span>
                <span className="font-semibold">{forecast.data_points.avg_daily_consumption_7d.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Avg daily (30d):</span>
                <span className="font-semibold">{forecast.data_points.avg_daily_consumption_30d.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Trend:</span>
                <span className={`font-semibold capitalize ${
                  forecast.data_points.trend === 'increasing'
                    ? 'text-red-600'
                    : forecast.data_points.trend === 'decreasing'
                    ? 'text-green-600'
                    : 'text-blue-600'
                }`}>
                  {forecast.data_points.trend}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BurnRateForecastAI;
