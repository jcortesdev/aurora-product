import type { ProductColor } from '@/lib/product-data';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColorSwatch } from './color-swatch';

const colors: ProductColor[] = [
  { id: 'mbk', name: 'Matte Black', sku: 'AUR-ONE-MBK', hex: '#1a1a1a', inStock: true, images: [] },
  {
    id: 'mdb',
    name: 'Midnight Blue',
    sku: 'AUR-ONE-MDB',
    hex: '#1e2a44',
    inStock: true,
    images: [],
  },
  { id: 'ivy', name: 'Ivory', sku: 'AUR-ONE-IVY', hex: '#f0e8d8', inStock: false, images: [] },
];

function setup(selectedId: 'mbk' | 'mdb' | 'ivy' = 'mbk') {
  const onSelect = vi.fn();
  render(<ColorSwatch colors={colors} selectedId={selectedId} onSelect={onSelect} />);
  return { onSelect };
}

describe('<ColorSwatch />', () => {
  it('renders one button per color inside a radiogroup', () => {
    setup();
    const group = screen.getByRole('radiogroup', { name: /color/i });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
  });

  it('marks the selected color with aria-checked', () => {
    setup('mdb');
    const mdb = screen.getByRole('radio', { name: 'Midnight Blue' });
    expect(mdb).toHaveAttribute('aria-checked', 'true');
    const mbk = screen.getByRole('radio', { name: 'Matte Black' });
    expect(mbk).toHaveAttribute('aria-checked', 'false');
  });

  it('shows the selected color name as visible text', () => {
    setup('mdb');
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument();
  });

  it('calls onSelect when an in-stock swatch is clicked', async () => {
    const user = userEvent.setup();
    const { onSelect } = setup('mbk');
    await user.click(screen.getByRole('radio', { name: 'Midnight Blue' }));
    expect(onSelect).toHaveBeenCalledWith('mdb');
  });

  it('does not call onSelect when an out-of-stock swatch is clicked', async () => {
    const user = userEvent.setup();
    const { onSelect } = setup('mbk');
    await user.click(screen.getByRole('radio', { name: /ivory, out of stock/i }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('marks out-of-stock swatches as disabled with descriptive label', () => {
    setup();
    const ivory = screen.getByRole('radio', { name: /ivory, out of stock/i });
    expect(ivory).toBeDisabled();
    expect(ivory).toHaveAttribute('data-out-of-stock', '');
  });

  it('only puts the selected in-stock swatch in the tab order', () => {
    setup('mdb');
    expect(screen.getByRole('radio', { name: 'Matte Black' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Midnight Blue' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: /ivory, out of stock/i })).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });

  it('moves selection to the next in-stock swatch on ArrowRight (skipping OOS)', async () => {
    const user = userEvent.setup();
    const { onSelect } = setup('mdb');
    screen.getByRole('radio', { name: 'Midnight Blue' }).focus();
    await user.keyboard('{ArrowRight}');
    // mdb is index 1; ivy (2) is OOS so wrap to mbk (0)
    expect(onSelect).toHaveBeenCalledWith('mbk');
  });

  it('wraps around with ArrowLeft skipping OOS', async () => {
    const user = userEvent.setup();
    const { onSelect } = setup('mbk');
    screen.getByRole('radio', { name: 'Matte Black' }).focus();
    await user.keyboard('{ArrowLeft}');
    // mbk is index 0; ArrowLeft wraps to last in-stock = mdb
    expect(onSelect).toHaveBeenCalledWith('mdb');
  });

  it('jumps to first and last in-stock with Home and End', async () => {
    const user = userEvent.setup();
    const { onSelect } = setup('mdb');
    screen.getByRole('radio', { name: 'Midnight Blue' }).focus();
    await user.keyboard('{Home}');
    expect(onSelect).toHaveBeenLastCalledWith('mbk');
    await user.keyboard('{End}');
    // End = last in-stock = mdb (skips ivy)
    expect(onSelect).toHaveBeenLastCalledWith('mdb');
  });
});
