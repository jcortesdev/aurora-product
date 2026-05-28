import { product } from '@/lib/product-data';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Hero } from './hero';

describe('<Hero />', () => {
  it('renders the product name as the page h1', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(product.name);
  });

  it('shows the formatted price', () => {
    render(<Hero />);
    expect(screen.getByText('$349.00')).toBeInTheDocument();
  });

  it('shows the tagline and description', () => {
    render(<Hero />);
    expect(screen.getByText(product.tagline)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
  });

  it('exposes the call-to-action as a button', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('is announced by its product name to assistive tech', () => {
    render(<Hero />);
    expect(screen.getByRole('region', { name: product.name })).toBeInTheDocument();
  });

  it('renders the lead product image with descriptive alt text', () => {
    render(<Hero />);
    expect(screen.getByAltText(product.colors[0].images[0].alt)).toBeInTheDocument();
  });

  it('marks the lead image as high fetch priority for LCP', () => {
    render(<Hero />);
    const img = screen.getByAltText(product.colors[0].images[0].alt);
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
  });

  it('calls onAddToCart when the Add to cart button is clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    render(<Hero onAddToCart={onAddToCart} />);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledOnce();
  });

  it('passes the CTA wrapper element to ctaRef so the sticky bar can observe it', () => {
    const ctaRef = vi.fn();
    render(<Hero ctaRef={ctaRef} />);
    expect(ctaRef).toHaveBeenCalled();
    const lastArg = ctaRef.mock.calls.at(-1)?.[0];
    expect(lastArg).toBeInstanceOf(HTMLElement);
  });
});
