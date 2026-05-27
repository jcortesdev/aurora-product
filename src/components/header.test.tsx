import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';

describe('<Header />', () => {
  it('renders the brand link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /aurora/i })).toBeInTheDocument();
  });

  it('does not render the cart indicator when count is 0 (default)', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header svg')).not.toBeNull(); // theme toggle icon still present
    // No cart badge: there should be no element styled as a rounded badge.
    expect(container.querySelector('header .rounded-full')).toBeNull();
  });

  it('renders the cart icon and numeric badge when count is > 0', () => {
    const { container } = render(<Header cartCount={1} />);
    const badge = container.querySelector('header .rounded-full');
    expect(badge).not.toBeNull();
    expect(badge).toHaveTextContent('1');
  });

  it('exposes a polite live region with singular wording for 1 item', () => {
    render(<Header cartCount={1} />);
    const live = document.querySelector('header [aria-live="polite"]');
    expect(live).toHaveTextContent('Cart, 1 item');
    expect(live).not.toHaveTextContent('items');
  });

  it('pluralizes the live region wording for 2+ items', () => {
    render(<Header cartCount={3} />);
    const live = document.querySelector('header [aria-live="polite"]');
    expect(live).toHaveTextContent('Cart, 3 items');
  });

  it('keeps the live region in the DOM even when empty so SR can hear the first add', () => {
    render(<Header cartCount={0} />);
    const live = document.querySelector('header [aria-live="polite"]');
    expect(live).toBeInTheDocument();
    expect(live).toHaveTextContent('');
  });
});
