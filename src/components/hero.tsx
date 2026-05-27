import { Button } from '@/components/button';
import { formatPrice } from '@/lib/format-price';
import { product } from '@/lib/product-data';

export function Hero() {
  return (
    <section
      aria-labelledby="product-name"
      className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12"
    >
      <picture className="block overflow-hidden rounded-lg bg-(--color-surface) ring-1 ring-(--color-border)">
        {product.heroImage.sources.avif && (
          <source srcSet={product.heroImage.sources.avif} type="image/avif" />
        )}
        {product.heroImage.sources.webp && (
          <source srcSet={product.heroImage.sources.webp} type="image/webp" />
        )}
        <img
          src={product.heroImage.img.src}
          width={product.heroImage.img.w}
          height={product.heroImage.img.h}
          alt={product.heroImageAlt}
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full"
        />
      </picture>
      <div className="flex flex-col gap-5">
        <p className="text-body-sm font-medium uppercase tracking-[0.18em] text-(--color-text-muted)">
          {product.tagline}
        </p>
        <h1
          id="product-name"
          className="text-display font-semibold tracking-tight text-(--color-text-primary)"
        >
          {product.name}
        </h1>
        <p className="text-h3 font-medium text-(--color-text-primary)">
          {formatPrice(product.price, product.currency)}
        </p>
        <p className="text-body-lg text-(--color-text-secondary)">{product.description}</p>
        <div className="mt-2">
          <Button variant="primary" size="lg">
            Add to cart
          </Button>
        </div>
      </div>
    </section>
  );
}
