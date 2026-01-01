import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  trend?: {
    value: string;
    direction: 'up' | 'down';
    label: string;
  };
  onClick?: () => void;
  className?: string;
}

const iconColorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-50 text-gray-600',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'blue',
  trend,
  onClick,
  className = '',
}: StatCardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all';
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${iconColorClasses[iconColor]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-gray-600">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}
