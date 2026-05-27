import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('<Button />', () => {
  it('exposes its label as the accessible name', () => {
    render(<Button>Add to cart</Button>);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Out of stock
      </Button>
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('defaults to type="button" so it does not submit ambient forms', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies size-specific classes', () => {
    render(<Button size="lg">Big</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/h-12/);
    expect(button.className).toMatch(/text-lg/);
  });

  it('switches token classes when the variant changes', () => {
    const { rerender } = render(<Button variant="primary">A</Button>);
    expect(screen.getByRole('button').className).toMatch(/bg-\(--color-accent\)/);

    rerender(<Button variant="secondary">A</Button>);
    expect(screen.getByRole('button').className).toMatch(/border-\(--color-border\)/);
  });

  it('merges a custom className without losing variant classes', () => {
    render(
      <Button variant="primary" className="w-full">
        Wide
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/w-full/);
    expect(button.className).toMatch(/bg-\(--color-accent\)/);
  });
});
