import type { GalleryImage } from '@/lib/product-data';
import { type KeyboardEvent, useRef, useState } from 'react';

type GalleryProps = {
  images: GalleryImage[];
};

export function Gallery({ images }: GalleryProps) {
  const [active, setActive] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function moveTo(index: number) {
    setActive(index);
    thumbRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = images.length - 1;
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        moveTo(active === last ? 0 : active + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveTo(active === 0 ? last : active - 1);
        break;
      case 'Home':
        event.preventDefault();
        moveTo(0);
        break;
      case 'End':
        event.preventDefault();
        moveTo(last);
        break;
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-(--color-surface) ring-1 ring-(--color-border)">
        {images.map((image, index) => {
          const isActive = index === active;
          return (
            <picture
              // biome-ignore lint/suspicious/noArrayIndexKey: image order is stable
              key={index}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {image.picture.sources.avif && (
                <source srcSet={image.picture.sources.avif} type="image/avif" />
              )}
              {image.picture.sources.webp && (
                <source srcSet={image.picture.sources.webp} type="image/webp" />
              )}
              <img
                src={image.picture.img.src}
                width={image.picture.img.w}
                height={image.picture.img.h}
                alt={image.alt}
                fetchPriority={index === 0 ? 'high' : 'low'}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="block h-full w-full object-cover"
              />
            </picture>
          );
        })}
      </div>

      <div
        role="toolbar"
        aria-label="Product images"
        onKeyDown={handleKeyDown}
        className="grid grid-cols-4 gap-2"
      >
        {images.map((image, index) => {
          const isActive = index === active;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: image order is stable
              key={index}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              type="button"
              tabIndex={isActive ? 0 : -1}
              aria-pressed={isActive}
              aria-label={`View ${image.alt}`}
              onClick={() => setActive(index)}
              className="aspect-square overflow-hidden rounded-md bg-(--color-surface) ring-1 ring-(--color-border) transition-shadow hover:ring-(--color-text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background) aria-pressed:ring-2 aria-pressed:ring-(--color-accent) aria-pressed:ring-offset-2 aria-pressed:ring-offset-(--color-background)"
            >
              <img
                src={image.picture.img.src}
                width={image.picture.img.w}
                height={image.picture.img.h}
                alt=""
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
