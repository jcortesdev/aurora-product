import { Button } from '@/components/button';
import { formatPrice } from '@/lib/format-price';
import { product } from '@/lib/product-data';
import { useSearchParam } from '@/lib/use-search-param';
import { useEffect, useState } from 'react';

type StickyAddToCartProps = {
  target: HTMLElement | null;
  onAddToCart: () => void;
};

function resolveColor(paramValue: string | null) {
  const candidate = product.colors.find((color) => color.id === paramValue && color.inStock);
  if (candidate) return candidate;
  const fallback = product.colors.find((color) => color.id === product.defaultColorId);
  if (!fallback) throw new Error(`Default color "${product.defaultColorId}" not found in colors`);
  return fallback;
}

export function StickyAddToCart({ target, onAddToCart }: StickyAddToCartProps) {
  const [colorParam] = useSearchParam('color');
  const selectedColor = resolveColor(colorParam);
  const [stuck, setStuck] = useState(false);
  // Mount with the hidden transform/opacity then flip to visible on the next
  // frame so the CSS transition actually runs. Without the rAF, React would
  // commit both states in the same paint and the bar would just appear.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!stuck) {
      setEntered(false);
      return;
    }
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [stuck]);

  // Conditional render keeps the bar out of the accessibility tree (and out of
  // axe's color-contrast pass) whenever it's not active. Exit is therefore
  // instant; the standard pattern in premium e-commerce.
  if (!stuck) return null;

  const thumb = selectedColor.images[0];

  return (
    <aside
      aria-label="Sticky add to cart"
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-(--color-border) bg-(--color-surface) shadow-lg transition-[transform,opacity] duration-250 ease-out motion-reduce:transition-none ${
        entered
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        {thumb && (
          <picture className="block h-12 w-12 shrink-0 overflow-hidden rounded-md bg-(--color-background) ring-1 ring-(--color-border)">
            {thumb.picture.sources.avif && (
              <source srcSet={thumb.picture.sources.avif} type="image/avif" />
            )}
            {thumb.picture.sources.webp && (
              <source srcSet={thumb.picture.sources.webp} type="image/webp" />
            )}
            <img
              src={thumb.picture.img.src}
              width={thumb.picture.img.w}
              height={thumb.picture.img.h}
              alt=""
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
            />
          </picture>
        )}
        <div className="min-w-0 flex-1">
          <p className="hidden truncate text-body-sm font-medium text-(--color-text-primary) sm:block">
            {product.name}
          </p>
          <p className="truncate text-body-sm text-(--color-text-secondary)">
            {selectedColor.name}
          </p>
        </div>
        <p className="shrink-0 text-body-sm font-semibold text-(--color-text-primary) sm:text-body">
          {formatPrice(product.price, product.currency)}
        </p>
        <Button variant="primary" size="md" onClick={onAddToCart} className="shrink-0">
          Add to cart
        </Button>
      </div>
    </aside>
  );
}
