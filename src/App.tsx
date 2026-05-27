import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-(--spacing-section-y)">
          {/* Hero and product content lands here in Module 3. */}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
