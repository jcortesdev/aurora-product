import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-(--spacing-section-y)">
          <Hero />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
