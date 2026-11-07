/**
 * CurrencyService
 * Single Responsibility: Consistent price formatting in Colombian Pesos (COP) across all views.
 */
export const CurrencyService = {
  formatCOP(amount: number): string {
    const normalizedCop = amount < 1000 ? amount * 1000 : amount;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(normalizedCop);
  },

  formatUSD(amount: number): string {
    return this.formatCOP(amount);
  },
};
