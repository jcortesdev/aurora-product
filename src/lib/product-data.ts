import auroraDetail from '@/assets/hero/aurora-one-detail.jpg?w=400;800;1200;1600&format=avif;webp;jpg&as=picture';
import auroraFront from '@/assets/hero/aurora-one-front.jpg?w=400;800;1200;1600&format=avif;webp;jpg&as=picture';
import auroraSide from '@/assets/hero/aurora-one-side.jpg?w=400;800;1200;1600&format=avif;webp;jpg&as=picture';
import auroraHero from '@/assets/hero/aurora-one.jpg?w=400;800;1200;1600&format=avif;webp;jpg&as=picture';
import type { SupportedCurrency } from '@/lib/format-price';

export type ProductImage = typeof auroraHero;

export type GalleryImage = {
  picture: ProductImage;
  alt: string;
};

export type Product = {
  name: string;
  tagline: string;
  price: number;
  currency: SupportedCurrency;
  description: string;
  images: GalleryImage[];
};

export const product: Product = {
  name: 'Aurora One',
  tagline: 'Wireless over-ear headphones',
  price: 34900,
  currency: 'USD',
  description:
    'Studio-grade 40mm drivers, adaptive noise cancellation, and 50-hour battery life. Machined aluminum cups, memory-foam earpads, and a connection that quietly follows you between devices.',
  images: [
    {
      picture: auroraHero,
      alt: 'Aurora One headphones in matte black, three-quarter view, brushed aluminum ear cups, floating against a dark gradient backdrop.',
    },
    {
      picture: auroraFront,
      alt: 'Aurora One headphones in matte black, front-facing view with the headband arched upward and both earcups visible head-on.',
    },
    {
      picture: auroraSide,
      alt: 'Aurora One headphones in matte black, pure side profile showing the brushed aluminum trim ring around the earcup driver.',
    },
    {
      picture: auroraDetail,
      alt: 'Aurora One earcup in close-up, revealing the matte finish, brushed aluminum trim, and soft memory-foam edge.',
    },
  ],
};
