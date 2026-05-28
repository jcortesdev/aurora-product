import type { CartItem } from '@/lib/cart';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CartPopover } from './cart-popover';

function setup(items: CartItem[] = []) {
  const onRemove = vi.fn();
  const onClear = vi.fn();
  const onClose = vi.fn();
  const triggerRef = createRef<HTMLElement>();
  const utils = render(
    <CartPopover
      items={items}
      onRemove={onRemove}
      onClear={onClear}
      onClose={onClose}
      triggerRef={triggerRef}
    />
  );
  return { onRemove, onClear, onClose, triggerRef, ...utils };
}

describe('<CartPopover />', () => {
  it('exposes itself as a dialog with an accessible name', () => {
    setup();
    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
  });

  it('renders the empty state when the cart has no items', () => {
    setup([]);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear cart/i })).not.toBeInTheDocument();
  });

  it('renders one line per cart item with color name and qty', () => {
    setup([
      { colorId: 'mbk', qty: 2 },
      { colorId: 'mdb', qty: 1 },
    ]);
    expect(screen.getByText(/matte black · qty 2/i)).toBeInTheDocument();
    expect(screen.getByText(/midnight blue · qty 1/i)).toBeInTheDocument();
  });

  it('computes a subtotal across all lines', () => {
    setup([{ colorId: 'mbk', qty: 2 }]);
    expect(screen.getByText(/subtotal \$698\.00/i)).toBeInTheDocument();
  });

  it('fires onRemove with the line index when × is clicked', async () => {
    const user = userEvent.setup();
    const { onRemove } = setup([
      { colorId: 'mbk', qty: 1 },
      { colorId: 'mdb', qty: 1 },
    ]);
    await user.click(screen.getByRole('button', { name: /remove midnight blue/i }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('fires onClear when the Clear cart button is clicked', async () => {
    const user = userEvent.setup();
    const { onClear } = setup([{ colorId: 'mbk', qty: 1 }]);
    await user.click(screen.getByRole('button', { name: /clear cart/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('closes on Escape', () => {
    const { onClose } = setup([{ colorId: 'mbk', qty: 1 }]);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on outside click', () => {
    const { onClose } = setup([{ colorId: 'mbk', qty: 1 }]);
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not close on clicks inside the popover', () => {
    const { onClose } = setup([{ colorId: 'mbk', qty: 1 }]);
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
