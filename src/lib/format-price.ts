export type SupportedCurrency = 'USD';

export function formatPrice(cents: number, currency: SupportedCurrency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
