import React from 'react';
import { Coins, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { creditsToMoney, formatCurrency, getDiscountVsStarter } from '../../lib/credits-pricing-config';

interface CreditsWithMoneyDisplayProps {
  credits: number;
  pricePerCreditEUR: number;
  currency?: string;
  showBreakdown?: boolean;
  showDiscount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

/**
 * Display credits with their monetary value
 * Shows both the credit amount and the equivalent money value
 */
export const CreditsWithMoneyDisplay: React.FC<CreditsWithMoneyDisplayProps> = ({
  credits,
  pricePerCreditEUR,
  currency = 'EUR',
  showBreakdown = false,
  showDiscount = false,
  size = 'md',
  label,
}) => {
  const moneyValue = creditsToMoney(credits, pricePerCreditEUR, currency);
  const discount = getDiscountVsStarter(pricePerCreditEUR);

  const sizeClasses = {
    sm: {
      credits: 'text-lg',
      money: 'text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      credits: 'text-2xl',
      money: 'text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      credits: 'text-3xl',
      money: 'text-lg',
      icon: 'w-6 h-6',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex flex-col">
      {label && <span className="text-sm text-gray-600 mb-1">{label}</span>}

      <div className="flex items-baseline gap-2">
        <div className="flex items-center gap-1">
          <Coins className={`${classes.icon} text-amber-500`} />
          <span className={`${classes.credits} font-bold text-gray-900`}>
            {credits.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">credits</span>
        </div>

        <span className="text-gray-400">≈</span>

        <div className="flex items-center gap-1">
          <DollarSign className={`${classes.icon} text-green-600`} />
          <span className={`${classes.money} font-semibold text-green-600`}>
            {formatCurrency(moneyValue, currency)}
          </span>
        </div>
      </div>

      {showBreakdown && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <span>
            {credits.toFixed(1)} credits × {formatCurrency(pricePerCreditEUR, 'EUR')}/credit
          </span>
        </div>
      )}

      {showDiscount && discount > 0 && (
        <div className="mt-1 inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
          <TrendingDown className="w-3 h-3" />
          <span className="font-medium">{discount.toFixed(0)}% discount vs Starter</span>
        </div>
      )}
    </div>
  );
};

interface PlanPricingCardProps {
  planName: string;
  pricePerCreditEUR: number;
  monthlyCredits: number;
  currency?: string;
}

/**
 * Display plan pricing information
 */
export const PlanPricingCard: React.FC<PlanPricingCardProps> = ({
  planName,
  pricePerCreditEUR,
  monthlyCredits,
  currency = 'EUR',
}) => {
  const monthlyValue = creditsToMoney(monthlyCredits, pricePerCreditEUR, currency);
  const discount = getDiscountVsStarter(pricePerCreditEUR);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 capitalize">{planName} Plan</h3>
        {discount > 0 && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            {discount.toFixed(0)}% off
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">Monthly Allocation</p>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-gray-900">{monthlyCredits}</span>
            <span className="text-sm text-gray-500">credits/month</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-1">Price per Credit</p>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xl font-semibold text-green-600">
              {formatCurrency(pricePerCreditEUR, 'EUR')}
            </span>
            <span className="text-sm text-gray-500">per credit</span>
          </div>
        </div>

        <div className="pt-3 border-t border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Monthly Recurring Revenue</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(monthlyValue, currency)}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MonetaryValueBadgeProps {
  credits: number;
  pricePerCreditEUR: number;
  currency?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

/**
 * Small badge showing monetary value of credits
 */
export const MonetaryValueBadge: React.FC<MonetaryValueBadgeProps> = ({
  credits,
  pricePerCreditEUR,
  currency = 'EUR',
  variant = 'default',
}) => {
  const moneyValue = creditsToMoney(credits, pricePerCreditEUR, currency);

  const variantClasses = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-orange-100 text-orange-700 border-orange-300',
    danger: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${variantClasses[variant]}`}
    >
      <DollarSign className="w-3 h-3" />
      {formatCurrency(moneyValue, currency)}
    </span>
  );
};
