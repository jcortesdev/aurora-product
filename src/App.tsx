import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { RelatedProductsSkeleton, ReviewsSkeleton } from '@/components/skeletons';
import { StickyAddToCart } from '@/components/sticky-add-to-cart';
import { type CartItem, addCartItem, removeCartItem } from '@/lib/cart';
import type { ColorId } from '@/lib/product-data';
import { useLocalStorage } from '@/lib/use-local-storage';
import { Suspense, lazy, useCallback, useState } from 'react';

// React.lazy needs a default export. The project bans default exports, so each
// lazy wrapper adapts the named export into the shape lazy() requires.
const LazyReviews = lazy(() =>
  import('@/components/reviews').then((m) => ({ default: m.Reviews }))
);
const LazyRelatedProducts = lazy(() =>
  import('@/components/related-products').then((m) => ({ default: m.RelatedProducts }))
);

export default function App() {
  const [items, setItems] = useLocalStorage<CartItem[]>('aurora-cart', []);
  const [heroCtaEl, setHeroCtaEl] = useState<HTMLElement | null>(null);

  const addToCart = useCallback(
    (colorId: ColorId) => setItems((prev) => addCartItem(prev, colorId)),
    [setItems]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        items={items}
        onRemove={(index) => setItems((prev) => removeCartItem(prev, index))}
        onClear={() => setItems([])}
      />
      <main className="flex-1 pb-(--spacing-section-y)">
        <Container className="py-(--spacing-section-y)">
          <Hero ctaRef={setHeroCtaEl} onAddToCart={addToCart} />
        </Container>
        <Container className="pb-(--spacing-section-y)">
          <Suspense fallback={<ReviewsSkeleton />}>
            <LazyReviews />
          </Suspense>
        </Container>
        <Container>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <LazyRelatedProducts />
          </Suspense>
        </Container>
      </main>
      <StickyAddToCart target={heroCtaEl} onAddToCart={addToCart} />
      <Footer />
    </div>
  );
}
