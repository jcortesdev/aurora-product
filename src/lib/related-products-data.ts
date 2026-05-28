// Related products are fictional companion items used purely to demonstrate
// the section layout. None of these have real product pages.
import type { SupportedCurrency } from '@/lib/format-price';

export type RelatedProductIcon = 'earbud' | 'speaker' | 'over-ear';

export type RelatedProduct = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  currency: SupportedCurrency;
  icon: RelatedProductIcon;
  href: string;
};

export const relatedProducts: RelatedProduct[] = [
  {
    id: 'aurora-buds',
    name: 'Aurora Buds',
    tagline: 'True wireless earbuds',
    price: 17900,
    currency: 'USD',
    icon: 'earbud',
    href: '#',
  },
  {
    id: 'aurora-beam',
    name: 'Aurora Beam',
    tagline: 'Portable speaker',
    price: 24900,
    currency: 'USD',
    icon: 'speaker',
    href: '#',
  },
  {
    id: 'aurora-lite',
    name: 'Aurora Lite',
    tagline: 'Wireless over-ear',
    price: 22900,
    currency: 'USD',
    icon: 'over-ear',
    href: '#',
  },
];
