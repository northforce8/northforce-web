import React from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ProgressIndicatorProps {
  label: string;
  current: number;
  target?: number;
  percentage?: number;
  status?: 'on_track' | 'at_risk' | 'behind' | 'completed' | 'not_started';
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
  showTrend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressIndicator({
  label,
  current,
  target,
  percentage,
  status = 'on_track',
  trend,
  unit = '',
  showTrend = true,
  size = 'md',
  className = ''
}: ProgressIndicatorProps) {
  const calculatedPercentage = percentage ?? (target ? Math.min((current / target) * 100, 100) : 0);

  const statusConfig = {
    on_track: {
      color: 'text-green-700',
      bg: 'bg-green-100',
      border: 'border-green-200',
      progressBg: 'bg-green-600',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    at_risk: {
      color: 'text-yellow-700',
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
      progressBg: 'bg-yellow-600',
      icon: <AlertCircle className="w-4 h-4" />
    },
    behind: {
      color: 'text-red-700',
      bg: 'bg-red-100',
      border: 'border-red-200',
      progressBg: 'bg-red-600',
      icon: <AlertCircle className="w-4 h-4" />
    },
    completed: {
      color: 'text-green-700',
      bg: 'bg-green-100',
      border: 'border-green-200',
      progressBg: 'bg-green-600',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    not_started: {
      color: 'text-gray-700',
      bg: 'bg-gray-100',
      border: 'border-gray-200',
      progressBg: 'bg-gray-600',
      icon: <Clock className="w-4 h-4" />
    }
  };

  const config = statusConfig[status];

  const sizeConfig = {
    sm: {
      text: 'text-sm',
      label: 'text-xs',
      height: 'h-1.5',
      padding: 'p-3'
    },
    md: {
      text: 'text-base',
      label: 'text-sm',
      height: 'h-2',
      padding: 'p-4'
    },
    lg: {
      text: 'text-lg',
      label: 'text-base',
      height: 'h-3',
      padding: 'p-5'
    }
  };

  const sConfig = sizeConfig[size];

  const getTrendIcon = () => {
    if (!showTrend || !trend) return null;

    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white border rounded-lg ${config.border} ${sConfig.padding} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium text-gray-700 ${sConfig.label}`}>{label}</span>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
            {config.icon}
            <span className="capitalize">{status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className={`font-bold text-gray-900 ${sConfig.text}`}>
          {current}{unit}
        </span>
        {target !== undefined && (
          <>
            <span className="text-gray-400">/</span>
            <span className={`text-gray-600 ${sConfig.label}`}>
              {target}{unit}
            </span>
          </>
        )}
        <span className={`ml-auto font-semibold ${config.color} ${sConfig.label}`}>
          {Math.round(calculatedPercentage)}%
        </span>
      </div>

      <div className={`w-full bg-gray-200 rounded-full ${sConfig.height}`}>
        <div
          className={`${config.progressBg} ${sConfig.height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(calculatedPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

interface SimpleProgressBarProps {
  percentage: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function SimpleProgressBar({
  percentage,
  color = 'blue',
  size = 'md',
  showLabel = true,
  className = ''
}: SimpleProgressBarProps) {
  const colorConfig = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  const sizeConfig = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeConfig[size]}`}>
        <div
          className={`${colorConfig[color]} ${sizeConfig[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  label,
  showPercentage = true
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-600 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}
