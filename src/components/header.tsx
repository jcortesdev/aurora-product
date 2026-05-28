import { CartPopover } from '@/components/cart-popover';
import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/theme-toggle';
import { type CartItem, getCartCount } from '@/lib/cart';
import { useRef, useState } from 'react';

type HeaderProps = {
  items?: CartItem[];
  onRemove?: (index: number) => void;
  onClear?: () => void;
};

export function Header({ items = [], onRemove, onClear }: HeaderProps) {
  const cartCount = getCartCount(items);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function handleClose() {
    setOpen(false);
    // Restore focus to the trigger so keyboard users keep their place.
    triggerRef.current?.focus();
  }

  const triggerLabel =
    cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Cart, empty';

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
          <div className="relative">
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={triggerLabel}
              onClick={() => setOpen((prev) => !prev)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-(--color-text-secondary) hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute top-1 right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--color-accent) px-1 text-[10px] font-semibold leading-none text-(--color-accent-foreground) animate-cart-bump motion-reduce:animate-none"
                >
                  {cartCount}
                </span>
              )}
            </button>
            {open && (
              <CartPopover
                items={items}
                onRemove={(index) => onRemove?.(index)}
                onClear={() => onClear?.()}
                onClose={handleClose}
                triggerRef={triggerRef}
              />
            )}
          </div>
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
