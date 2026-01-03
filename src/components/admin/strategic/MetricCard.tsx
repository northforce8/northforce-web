import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    value: number;
    label?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'neutral';
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  status = 'neutral',
  subtitle,
  onClick,
  className = ''
}: MetricCardProps) {
  const statusConfig = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-700'
    },
    neutral: {
      bg: 'bg-white',
      border: 'border-gray-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700'
    }
  };

  const config = statusConfig[status];

  const getTrendIcon = () => {
    if (!trend) return null;

    const iconClass = "w-4 h-4";

    switch (trend.direction) {
      case 'up':
        return <TrendingUp className={`${iconClass} text-green-600`} />;
      case 'down':
        return <TrendingDown className={`${iconClass} text-red-600`} />;
      case 'stable':
        return <Minus className={`${iconClass} text-gray-600`} />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-600';

    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`
        ${config.bg} border ${config.border} rounded-lg p-4 transition-all
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`${config.iconBg} p-2 rounded-lg`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>
        {unit && (
          <span className="text-lg text-gray-600">{unit}</span>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend.direction === 'up' && '+'}
            {trend.value}%
          </span>
          {trend.label && (
            <span className="text-xs text-gray-500">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}

interface MiniMetricCardProps {
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  className?: string;
}

export function MiniMetricCard({
  label,
  value,
  color = 'blue',
  className = ''
}: MiniMetricCardProps) {
  const colorConfig = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700'
  };

  return (
    <div className={`border rounded-lg p-3 ${colorConfig[color]} ${className}`}>
      <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
