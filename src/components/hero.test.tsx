import { product } from '@/lib/product-data';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
