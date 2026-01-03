import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, description, icon: Icon, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-5 border-b border-gray-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0 mt-0.5">
              <Icon className="h-5 w-5 text-gray-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function CardBody({ children, className = '', noPadding = false }: CardBodyProps) {
  return (
    <div className={noPadding ? className : `px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg ${className}`}>
      {children}
    </div>
  );
}
