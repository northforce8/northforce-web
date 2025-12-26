import React from 'react';
import { Coins, TrendingDown, AlertTriangle } from 'lucide-react';
import type { Customer } from '../../lib/partner-portal-types';

interface CreditsDisplayProps {
  customer: Customer;
  showDetails?: boolean;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ customer, showDetails = false }) => {
  const percentage = (customer.credits_balance / customer.credits_monthly_allocation) * 100;
  const isLow = percentage < 20;
  const isMedium = percentage >= 20 && percentage < 50;

  const getBarColor = () => {
    if (isLow) return 'bg-red-500';
    if (isMedium) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBackgroundColor = () => {
    if (isLow) return 'bg-red-50 border-red-200';
    if (isMedium) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getPlanLabel = (level: string) => {
    const labels: Record<string, string> = {
      starter: 'Starter',
      growth: 'Growth',
      scale: 'Scale',
      custom: 'Custom',
    };
    return labels[level] || level;
  };

  return (
    <div className={`border rounded-lg p-4 ${getBackgroundColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-gray-700" />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {customer.credits_balance.toFixed(0)} / {customer.credits_monthly_allocation.toFixed(0)} Credits
            </div>
            <div className="text-xs text-gray-600">{getPlanLabel(customer.credits_plan_level)}</div>
          </div>
        </div>
        {isLow && (
          <AlertTriangle className="w-5 h-5 text-red-600" />
        )}
      </div>

      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getBarColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">{percentage.toFixed(0)}% remaining</span>
        {customer.credits_auto_refill && (
          <span className="text-green-600 font-medium">Auto-refill enabled</span>
        )}
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Monthly Allocation:</span>
              <div className="font-semibold">{customer.credits_monthly_allocation.toFixed(0)}</div>
            </div>
            <div>
              <span className="text-gray-600">Current Balance:</span>
              <div className="font-semibold">{customer.credits_balance.toFixed(0)}</div>
            </div>
          </div>
        </div>
      )}

      {isLow && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <div className="flex items-center gap-2 text-red-700 text-xs">
            <TrendingDown className="w-4 h-4" />
            <span className="font-medium">Credits running low - consider top-up</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditsDisplay;