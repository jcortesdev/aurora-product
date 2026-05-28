import type { CartItem } from '@/lib/cart';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('<Header />', () => {
  it('renders the brand link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /aurora/i })).toBeInTheDocument();
  });

  it('always renders the cart toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /cart, empty/i })).toBeInTheDocument();
  });

  it('shows a singular count label when there is one item', () => {
    const items: CartItem[] = [{ colorId: 'mbk', qty: 1 }];
    render(<Header items={items} />);
    expect(screen.getByRole('button', { name: 'Cart, 1 item' })).toBeInTheDocument();
  });

  it('shows a plural count label for multiple items', () => {
    const items: CartItem[] = [{ colorId: 'mbk', qty: 3 }];
    render(<Header items={items} />);
    expect(screen.getByRole('button', { name: 'Cart, 3 items' })).toBeInTheDocument();
  });

  it('renders the numeric badge only when the cart has items', () => {
    const { container, rerender } = render(<Header />);
    expect(container.querySelector('header .rounded-full')).toBeNull();
    rerender(<Header items={[{ colorId: 'mbk', qty: 2 }]} />);
    const badge = container.querySelector('header .rounded-full');
    expect(badge).toHaveTextContent('2');
  });

  it('opens the cart popover when the toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<Header items={[{ colorId: 'mbk', qty: 1 }]} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /cart, 1 item/i }));
    expect(screen.getByRole('dialog', { name: /shopping cart/i })).toBeInTheDocument();
  });

  it('closes the popover when the toggle is clicked again', async () => {
    const user = userEvent.setup();
    render(<Header items={[{ colorId: 'mbk', qty: 1 }]} />);
    const toggle = screen.getByRole('button', { name: /cart, 1 item/i });
    await user.click(toggle);
    await user.click(toggle);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps the live region present even when empty so SR can announce the first add', () => {
    render(<Header />);
    const live = document.querySelector('header [aria-live="polite"]');
    expect(live).toBeInTheDocument();
    expect(live).toHaveTextContent('');
  });

  it('updates the live region with the cart count', () => {
    render(<Header items={[{ colorId: 'mbk', qty: 2 }]} />);
    const live = document.querySelector('header [aria-live="polite"]');
    expect(live).toHaveTextContent('Cart, 2 items');
  });
});
