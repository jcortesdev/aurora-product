import { relatedProducts } from '@/lib/related-products-data';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RelatedProducts } from './related-products';

describe('<RelatedProducts />', () => {
  it('renders the section with an accessible heading', () => {
    render(<RelatedProducts />);
    expect(
      screen.getByRole('heading', { level: 2, name: /you may also like/i })
    ).toBeInTheDocument();
  });

  it('renders one card per related product', () => {
    render(<RelatedProducts />);
    for (const p of relatedProducts) {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.tagline)).toBeInTheDocument();
    }
  });

  it('formats each price', () => {
    render(<RelatedProducts />);
    expect(screen.getByText('$179.00')).toBeInTheDocument();
    expect(screen.getByText('$249.00')).toBeInTheDocument();
    expect(screen.getByText('$229.00')).toBeInTheDocument();
  });

  it('marks the cards as aria-disabled since they have no real destination', () => {
    render(<RelatedProducts />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(relatedProducts.length);
    for (const link of links) {
      expect(link).toHaveAttribute('aria-disabled', 'true');
    }
  });
});
