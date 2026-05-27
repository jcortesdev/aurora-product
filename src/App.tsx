import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { useCallback, useState } from 'react';

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [, setHeroCtaEl] = useState<HTMLElement | null>(null);

  const addToCart = useCallback(() => {
    setCartCount((n) => n + 1);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1">
        <Container className="py-(--spacing-section-y)">
          <Hero ctaRef={setHeroCtaEl} onAddToCart={addToCart} />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
