import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ variant, children, size = 'md', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: BadgeSize;
}

export function StatusBadge({ status, className, size }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '');

  const getVariant = (): BadgeVariant => {
    if (['active', 'paid', 'completed', 'approved', 'confirmed', 'success'].includes(normalizedStatus)) {
      return 'success';
    }
    if (['pending', 'inprogress', 'processing', 'warning'].includes(normalizedStatus)) {
      return 'warning';
    }
    if (['overdue', 'failed', 'error', 'critical', 'expired', 'cancelled'].includes(normalizedStatus)) {
      return 'error';
    }
    if (['draft', 'planned', 'scheduled', 'info'].includes(normalizedStatus)) {
      return 'info';
    }
    return 'neutral';
  };

  const formatStatus = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Badge variant={getVariant()} size={size} className={className}>
      {formatStatus(status)}
    </Badge>
  );
}
