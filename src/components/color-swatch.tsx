import type { ColorId, ProductColor } from '@/lib/product-data';
import { type KeyboardEvent, useRef } from 'react';

type ColorSwatchProps = {
  colors: ProductColor[];
  selectedId: ColorId;
  onSelect: (id: ColorId) => void;
};

export function ColorSwatch({ colors, selectedId, onSelect }: ColorSwatchProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inStockIndexes = colors.flatMap((color, index) => (color.inStock ? [index] : []));
  const selectedColor = colors.find((color) => color.id === selectedId) ?? colors[0];

  function focusAndSelect(index: number) {
    const target = colors[index];
    if (!target?.inStock) return;
    onSelect(target.id);
    buttonRefs.current[index]?.focus();
  }

  function moveBy(currentIndex: number, direction: 1 | -1) {
    if (inStockIndexes.length === 0) return;
    const orderPosition = inStockIndexes.indexOf(currentIndex);
    const nextOrder =
      orderPosition === -1
        ? 0
        : (orderPosition + direction + inStockIndexes.length) % inStockIndexes.length;
    focusAndSelect(inStockIndexes[nextOrder]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, currentIndex: number) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        moveBy(currentIndex, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        moveBy(currentIndex, -1);
        break;
      case 'Home':
        event.preventDefault();
        if (inStockIndexes[0] !== undefined) focusAndSelect(inStockIndexes[0]);
        break;
      case 'End':
        event.preventDefault();
        if (inStockIndexes.length > 0) {
          focusAndSelect(inStockIndexes[inStockIndexes.length - 1]);
        }
        break;
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm text-(--color-text-secondary)">
        Color: <span className="font-medium text-(--color-text-primary)">{selectedColor.name}</span>
      </p>
      <div
        role="radiogroup"
        aria-label="Color"
        className="flex items-center gap-3"
        onKeyDown={(event) => {
          const focusedIndex = buttonRefs.current.findIndex((el) => el === document.activeElement);
          handleKeyDown(event, focusedIndex === -1 ? colors.indexOf(selectedColor) : focusedIndex);
        }}
      >
        {colors.map((color, index) => {
          const isSelected = color.id === selectedColor.id;
          return (
            <button
              key={color.id}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${color.name}${color.inStock ? '' : ', out of stock'}`}
              title={color.name}
              disabled={!color.inStock}
              tabIndex={isSelected && color.inStock ? 0 : -1}
              onClick={() => {
                if (color.inStock) onSelect(color.id);
              }}
              style={{ backgroundColor: color.hex }}
              data-out-of-stock={color.inStock ? undefined : ''}
              className="relative h-9 w-9 rounded-full ring-1 ring-(--color-border) transition-transform duration-200 ease-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background) aria-checked:scale-110 aria-checked:ring-2 aria-checked:ring-(--color-accent) aria-checked:ring-offset-2 aria-checked:ring-offset-(--color-background) disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 motion-reduce:transition-none motion-reduce:hover:scale-100 data-[out-of-stock]:after:absolute data-[out-of-stock]:after:inset-0 data-[out-of-stock]:after:rounded-full data-[out-of-stock]:after:bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),var(--color-text-primary)_calc(50%-1px),var(--color-text-primary)_calc(50%+1px),transparent_calc(50%+1px))]"
            />
          );
        })}
      </div>
    </div>
  );
}
