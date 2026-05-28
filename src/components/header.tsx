import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/theme-toggle';

type HeaderProps = {
  cartCount?: number;
};

export function Header({ cartCount = 0 }: HeaderProps) {
  return (
    <header className="border-b border-(--color-border)">
      <Container className="flex h-16 items-center justify-between">
        <a
          href="/"
          className="text-xl font-semibold tracking-tight text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)"
        >
          Aurora
        </a>
        <div className="flex items-center gap-1">
          {cartCount > 0 && (
            <div
              className="relative inline-flex h-10 w-10 items-center justify-center text-(--color-text-secondary)"
              aria-hidden="true"
            >
              <CartIcon />
              <span
                key={cartCount}
                className="absolute top-1 right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--color-accent) px-1 text-[10px] font-semibold leading-none text-(--color-accent-foreground) animate-cart-bump motion-reduce:animate-none"
              >
                {cartCount}
              </span>
            </div>
          )}
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : ''}
          </span>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L4 2H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}
