import type { SupportedCurrency } from '@/lib/format-price';

export type Product = {
  name: string;
  tagline: string;
  price: number;
  currency: SupportedCurrency;
  description: string;
  heroImageAlt: string;
};

export const product: Product = {
  name: 'Aurora One',
  tagline: 'Wireless over-ear headphones',
  price: 34900,
  currency: 'USD',
  description:
    'Studio-grade 40mm drivers, adaptive noise cancellation, and 50-hour battery life. Machined aluminum cups, memory-foam earpads, and a connection that quietly follows you between devices.',
  heroImageAlt:
    'Aurora One headphones in matte black, three-quarter view, against a dark gradient backdrop.',
};
