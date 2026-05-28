import type { CartItem } from '@/lib/cart';
import { formatPrice } from '@/lib/format-price';
import { type ColorId, product } from '@/lib/product-data';
import { type RefObject, useEffect, useRef } from 'react';

type CartPopoverProps = {
  items: CartItem[];
  onRemove: (index: number) => void;
  onClear: () => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
};

function colorName(colorId: ColorId): string {
  return product.colors.find((c) => c.id === colorId)?.name ?? colorId;
}

export function CartPopover({ items, onRemove, onClear, onClose, triggerRef }: CartPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (ref.current?.contains(target) || triggerRef.current?.contains(target)) return;
      onClose();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onPointer);
    };
  }, [onClose, triggerRef]);

  useEffect(() => {
    // Move focus inside the popover on open so keyboard users land on actionable
    // content; falls back to the dialog itself when the cart is empty.
    const first = ref.current?.querySelector<HTMLElement>('button');
    (first ?? ref.current)?.focus();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.qty * product.price, 0);

  return (
    <div
      ref={ref}
      // biome-ignore lint/a11y/useSemanticElements: native <dialog> would require show()/showModal() lifecycle calls and doesn't fit an anchored popover.
      role="dialog"
      aria-label="Shopping cart"
      tabIndex={-1}
      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-(--color-border) bg-(--color-surface) p-4 shadow-lg focus:outline-none"
    >
      {items.length === 0 ? (
        <p className="text-body-sm text-(--color-text-secondary)">Your cart is empty.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => (
              <li
                key={`${item.colorId}-${index}`}
                className="flex items-center gap-3 text-(--color-text-primary)"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium">{product.name}</p>
                  <p className="truncate text-body-sm text-(--color-text-secondary)">
                    {colorName(item.colorId)} · Qty {item.qty}
                  </p>
                </div>
                <p className="shrink-0 text-body-sm font-semibold">
                  {formatPrice(item.qty * product.price, product.currency)}
                </p>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${colorName(item.colorId)} from cart`}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-(--color-text-muted) hover:bg-(--color-background) hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-surface)"
                >
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-(--color-border) pt-3">
            <p className="text-body-sm font-semibold text-(--color-text-primary)">
              Subtotal {formatPrice(subtotal, product.currency)}
            </p>
            <button
              type="button"
              onClick={onClear}
              className="rounded-md px-2 py-1 text-body-sm text-(--color-text-muted) hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-surface)"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
