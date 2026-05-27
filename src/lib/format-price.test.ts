import { describe, expect, it } from 'vitest';
import { formatPrice } from './format-price';

describe('formatPrice', () => {
  it('formats whole-dollar amounts with cents', () => {
    expect(formatPrice(34900)).toBe('$349.00');
  });

  it('keeps both decimal places for non-whole cent amounts', () => {
    expect(formatPrice(34999)).toBe('$349.99');
  });

  it('renders zero as $0.00 rather than collapsing it', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('defaults to USD when no currency is passed', () => {
    expect(formatPrice(12345)).toMatch(/^\$/);
  });
});
