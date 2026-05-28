import { describe, expect, it } from 'vitest';
import { addCartItem, getCartCount, removeCartItem } from './cart';

describe('cart helpers', () => {
  it('adds a new color as a fresh line with qty 1', () => {
    const next = addCartItem([], 'mbk');
    expect(next).toEqual([{ colorId: 'mbk', qty: 1 }]);
  });

  it('increments qty when the same color is added again', () => {
    const next = addCartItem([{ colorId: 'mbk', qty: 1 }], 'mbk');
    expect(next).toEqual([{ colorId: 'mbk', qty: 2 }]);
  });

  it('keeps separate lines for distinct colors', () => {
    const after = addCartItem(addCartItem([], 'mbk'), 'mdb');
    expect(after).toEqual([
      { colorId: 'mbk', qty: 1 },
      { colorId: 'mdb', qty: 1 },
    ]);
  });

  it('returns a new array reference (immutable update)', () => {
    const before: ReturnType<typeof addCartItem> = [];
    const after = addCartItem(before, 'mbk');
    expect(after).not.toBe(before);
  });

  it('removes the item at the given index', () => {
    const items = [
      { colorId: 'mbk' as const, qty: 1 },
      { colorId: 'mdb' as const, qty: 2 },
    ];
    expect(removeCartItem(items, 0)).toEqual([{ colorId: 'mdb', qty: 2 }]);
  });

  it('returns the input unchanged when removing an out-of-range index', () => {
    const items = [{ colorId: 'mbk' as const, qty: 1 }];
    expect(removeCartItem(items, 5)).toBe(items);
    expect(removeCartItem(items, -1)).toBe(items);
  });

  it('sums qty across lines for the total count', () => {
    expect(
      getCartCount([
        { colorId: 'mbk', qty: 2 },
        { colorId: 'mdb', qty: 3 },
      ])
    ).toBe(5);
  });

  it('reports 0 for an empty cart', () => {
    expect(getCartCount([])).toBe(0);
  });
});
