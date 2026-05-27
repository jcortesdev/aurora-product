import { product } from '@/lib/product-data';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('puts only the active thumbnail in the tab order (roving tabindex)', () => {
    render(<Gallery images={product.images} />);
    const buttons = screen
      .getByRole('toolbar', { name: /product images/i })
      .querySelectorAll('button');
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    expect(buttons[1]).toHaveAttribute('tabindex', '-1');
    expect(buttons[2]).toHaveAttribute('tabindex', '-1');
    expect(buttons[3]).toHaveAttribute('tabindex', '-1');
  });

  it('moves the active image forward with ArrowRight and back with ArrowLeft', async () => {
    const user = userEvent.setup();
    render(<Gallery images={product.images} />);
    const first = screen.getByRole('button', { name: `View ${product.images[0].alt}` });
    first.focus();

    await user.keyboard('{ArrowRight}');
    const second = screen.getByRole('button', { name: `View ${product.images[1].alt}` });
    expect(second).toHaveAttribute('aria-pressed', 'true');
    expect(second).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(first).toHaveFocus();
  });

  it('wraps around at the edges', async () => {
    const user = userEvent.setup();
    render(<Gallery images={product.images} />);
    const first = screen.getByRole('button', { name: `View ${product.images[0].alt}` });
    first.focus();

    await user.keyboard('{ArrowLeft}');
    const last = screen.getByRole('button', {
      name: `View ${product.images[product.images.length - 1].alt}`,
    });
    expect(last).toHaveAttribute('aria-pressed', 'true');
    expect(last).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(first).toHaveFocus();
  });

  it('jumps to first and last with Home and End', async () => {
    const user = userEvent.setup();
    render(<Gallery images={product.images} />);
    const second = screen.getByRole('button', { name: `View ${product.images[1].alt}` });
    second.focus();
    // bring focus to the active button so the toolbar receives the key event
    fireEvent.click(second);

    await user.keyboard('{End}');
    const last = screen.getByRole('button', {
      name: `View ${product.images[product.images.length - 1].alt}`,
    });
    expect(last).toHaveAttribute('aria-pressed', 'true');
    expect(last).toHaveFocus();

    await user.keyboard('{Home}');
    const first = screen.getByRole('button', { name: `View ${product.images[0].alt}` });
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(first).toHaveFocus();
  });
});
