import heroImage from '@/assets/hero/aurora-one.jpg?w=400;800;1200;1600&format=avif;webp;jpg&as=picture';
import type { SupportedCurrency } from '@/lib/format-price';

export type HeroImage = typeof heroImage;

export type Product = {
  name: string;
  tagline: string;
  price: number;
  currency: SupportedCurrency;
  description: string;
  heroImage: HeroImage;
  heroImageAlt: string;
};

export const product: Product = {
  name: 'Aurora One',
  tagline: 'Wireless over-ear headphones',
  price: 34900,
  currency: 'USD',
  description:
    'Studio-grade 40mm drivers, adaptive noise cancellation, and 50-hour battery life. Machined aluminum cups, memory-foam earpads, and a connection that quietly follows you between devices.',
  heroImage,
  heroImageAlt:
    'Aurora One headphones in matte black, three-quarter view, brushed aluminum ear cups, floating against a dark gradient backdrop.',
};
