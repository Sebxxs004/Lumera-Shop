/**
 * CurrencyService
 * Single Responsibility: Consistent price formatting across all views.
 */
export const CurrencyService = {
  formatUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },
};

