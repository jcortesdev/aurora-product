import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { StickyAddToCart } from '@/components/sticky-add-to-cart';
import { type CartItem, addCartItem, removeCartItem } from '@/lib/cart';
import type { ColorId } from '@/lib/product-data';
import { useLocalStorage } from '@/lib/use-local-storage';
import { useCallback, useState } from 'react';

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
      <main className="flex-1">
        <Container className="py-(--spacing-section-y)">
          <Hero ctaRef={setHeroCtaEl} onAddToCart={addToCart} />
        </Container>
      </main>
      <StickyAddToCart target={heroCtaEl} onAddToCart={addToCart} />
      <Footer />
    </div>
  );
}
