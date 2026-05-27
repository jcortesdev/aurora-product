import { Button } from '@/components/button';
import { ColorSwatch } from '@/components/color-swatch';
import { Gallery } from '@/components/gallery';
import { formatPrice } from '@/lib/format-price';
import { type ColorId, product } from '@/lib/product-data';
import { useSearchParam } from '@/lib/use-search-param';

function resolveColor(paramValue: string | null) {
  const candidate = product.colors.find((color) => color.id === paramValue && color.inStock);
  if (candidate) return candidate;
  const fallback = product.colors.find((color) => color.id === product.defaultColorId);
  // defaultColorId is typed as ColorId and must exist in colors[]; product-data is the source of truth.
  if (!fallback) throw new Error(`Default color "${product.defaultColorId}" not found in colors`);
  return fallback;
}

type HeroProps = {
  onAddToCart?: () => void;
  ctaRef?: (el: HTMLElement | null) => void;
};

export function Hero({ onAddToCart, ctaRef }: HeroProps = {}) {
  const [colorParam, setColorParam] = useSearchParam('color');
  const selectedColor = resolveColor(colorParam);

  return (
    <section
      aria-labelledby="product-name"
      className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12"
    >
      <Gallery key={selectedColor.id} images={selectedColor.images} />
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
        <ColorSwatch
          colors={product.colors}
          selectedId={selectedColor.id}
          onSelect={(id: ColorId) => setColorParam(id)}
        />
        <p className="text-body-sm text-(--color-text-muted)">One size — adjustable headband</p>
        <div className="mt-2" ref={ctaRef}>
          <Button variant="primary" size="lg" onClick={onAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </section>
  );
}
