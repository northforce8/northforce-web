import React from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

const currencySymbols: Record<string, string> = {
  EUR: '€',
  SEK: 'kr',
  USD: '$',
  NOK: 'kr',
  DKK: 'kr',
};

export function CurrencyDisplay({ amount, currency = 'SEK', className = '' }: CurrencyDisplayProps) {
  const symbol = currencySymbols[currency] || currency;
  const formatted = new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const displayBefore = currency === 'EUR' || currency === 'USD';

  return (
    <span className={className}>
      {displayBefore ? `${symbol}${formatted}` : `${formatted} ${symbol}`}
    </span>
  );
}
