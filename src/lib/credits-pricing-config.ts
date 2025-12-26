/**
 * Credits Pricing Configuration
 *
 * Defines the monetary value of credits across different subscription plans.
 * This is the SINGLE SOURCE OF TRUTH for credits-to-money conversion.
 */

export interface CreditsPricingTier {
  plan: 'starter' | 'growth' | 'scale' | 'enterprise';
  pricePerCreditEUR: number;
  monthlyCredits: number;
  monthlyPriceEUR: number;
  features: string[];
}

export const CREDITS_PRICING_TIERS: Record<string, CreditsPricingTier> = {
  starter: {
    plan: 'starter',
    pricePerCreditEUR: 150,
    monthlyCredits: 20,
    monthlyPriceEUR: 3000,
    features: ['Basic support', 'Email access', 'Monthly reporting'],
  },
  growth: {
    plan: 'growth',
    pricePerCreditEUR: 135,
    monthlyCredits: 50,
    monthlyPriceEUR: 6750,
    features: ['Priority support', 'Dedicated CSM', 'Weekly reporting', 'API access'],
  },
  scale: {
    plan: 'scale',
    pricePerCreditEUR: 120,
    monthlyCredits: 100,
    monthlyPriceEUR: 12000,
    features: [
      'Premium support',
      'Dedicated team',
      'Daily reporting',
      'API access',
      'Custom integrations',
    ],
  },
  enterprise: {
    plan: 'enterprise',
    pricePerCreditEUR: 0, // Custom pricing
    monthlyCredits: 0, // Custom allocation
    monthlyPriceEUR: 0, // Custom
    features: [
      'White-glove support',
      'Dedicated account team',
      'Real-time reporting',
      'Full API access',
      'Custom integrations',
      'SLA guarantees',
      'Custom contract terms',
    ],
  },
};

/**
 * Currency conversion rates (base: EUR)
 * Updated regularly via admin settings
 */
export const CURRENCY_RATES: Record<string, number> = {
  EUR: 1.0,
  SEK: 11.5,
  USD: 1.09,
  NOK: 11.8,
  DKK: 7.45,
  GBP: 0.86,
};

/**
 * Get the price per credit for a specific plan
 */
export function getPricePerCredit(plan: string): number {
  const tier = CREDITS_PRICING_TIERS[plan.toLowerCase()];
  return tier ? tier.pricePerCreditEUR : 150; // Default to Starter pricing
}

/**
 * Convert credits to monetary value in specified currency
 */
export function creditsToMoney(
  credits: number,
  pricePerCreditEUR: number,
  targetCurrency: string = 'EUR'
): number {
  const eurValue = credits * pricePerCreditEUR;
  const rate = CURRENCY_RATES[targetCurrency] || 1;
  return eurValue * rate;
}

/**
 * Convert money to credits
 */
export function moneyToCredits(
  amount: number,
  pricePerCreditEUR: number,
  sourceCurrency: string = 'EUR'
): number {
  const rate = CURRENCY_RATES[sourceCurrency] || 1;
  const eurAmount = amount / rate;
  return eurAmount / pricePerCreditEUR;
}

/**
 * Format currency display
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  const symbols: Record<string, string> = {
    EUR: '€',
    SEK: 'kr',
    USD: '$',
    NOK: 'kr',
    DKK: 'kr',
    GBP: '£',
  };

  const symbol = symbols[currency] || currency;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));

  if (currency === 'SEK' || currency === 'NOK' || currency === 'DKK') {
    return `${formattedAmount} ${symbol}`;
  }
  return `${symbol}${formattedAmount}`;
}

/**
 * Get plan details by name
 */
export function getPlanDetails(planName: string): CreditsPricingTier | null {
  return CREDITS_PRICING_TIERS[planName.toLowerCase()] || null;
}

/**
 * Calculate MRR for a customer based on their plan and credits
 */
export function calculateMRR(
  monthlyCredits: number,
  pricePerCreditEUR: number,
  currency: string = 'EUR'
): number {
  return creditsToMoney(monthlyCredits, pricePerCreditEUR, currency);
}

/**
 * Get discount percentage compared to Starter plan
 */
export function getDiscountVsStarter(pricePerCredit: number): number {
  const starterPrice = CREDITS_PRICING_TIERS.starter.pricePerCreditEUR;
  return ((starterPrice - pricePerCredit) / starterPrice) * 100;
}
