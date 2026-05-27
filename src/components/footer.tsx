import { Container } from '@/components/container';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border) py-8">
      <Container className="text-center text-sm text-(--color-text-secondary)">
        © {year} Aurora
      </Container>
    </footer>
  );
}
