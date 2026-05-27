import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="border-b border-(--color-border)">
      <Container className="flex h-16 items-center justify-between">
        <a
          href="/"
          className="text-xl font-semibold tracking-tight text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)"
        >
          Aurora
        </a>
        <ThemeToggle />
      </Container>
    </header>
  );
}
