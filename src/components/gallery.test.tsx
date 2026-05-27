import { product } from '@/lib/product-data';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Gallery } from './gallery';

describe('<Gallery />', () => {
  it('renders one thumbnail button per image', () => {
    render(<Gallery images={product.images} />);
    const toolbar = screen.getByRole('toolbar', { name: /product images/i });
    expect(within(toolbar).getAllByRole('button')).toHaveLength(product.images.length);
  });

  it('marks the first thumbnail as active by default', () => {
    render(<Gallery images={product.images} />);
    const first = screen.getByRole('button', { name: `View ${product.images[0].alt}` });
    expect(first).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches the active image when a thumbnail is clicked', () => {
    render(<Gallery images={product.images} />);
    const target = screen.getByRole('button', { name: `View ${product.images[2].alt}` });
    fireEvent.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    const previous = screen.getByRole('button', { name: `View ${product.images[0].alt}` });
    expect(previous).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks the first stacked image as high fetch priority for LCP', () => {
    render(<Gallery images={product.images} />);
    const lead = screen.getByAltText(product.images[0].alt);
    expect(lead).toHaveAttribute('fetchpriority', 'high');
    expect(lead).toHaveAttribute('width');
    expect(lead).toHaveAttribute('height');
  });

  it('lazy-loads non-lead stacked images', () => {
    render(<Gallery images={product.images} />);
    const second = screen.getByAltText(product.images[1].alt);
    expect(second).toHaveAttribute('loading', 'lazy');
    expect(second).toHaveAttribute('fetchpriority', 'low');
  });

  it('hides inactive pictures from assistive tech', () => {
    const { container } = render(<Gallery images={product.images} />);
    const pictures = container.querySelectorAll('picture');
    expect(pictures[0]).toHaveAttribute('aria-hidden', 'false');
    expect(pictures[1]).toHaveAttribute('aria-hidden', 'true');
  });
});
