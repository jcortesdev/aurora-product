import type { ColorId } from '@/lib/product-data';

export type CartItem = {
  colorId: ColorId;
  qty: number;
};

export function addCartItem(items: CartItem[], colorId: ColorId): CartItem[] {
  const existing = items.findIndex((item) => item.colorId === colorId);
  if (existing === -1) return [...items, { colorId, qty: 1 }];
  return items.map((item, i) => (i === existing ? { ...item, qty: item.qty + 1 } : item));
}

export function removeCartItem(items: CartItem[], index: number): CartItem[] {
  if (index < 0 || index >= items.length) return items;
  return items.filter((_, i) => i !== index);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.qty, 0);
}
