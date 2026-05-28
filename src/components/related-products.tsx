import { formatPrice } from '@/lib/format-price';
import {
  type RelatedProduct,
  type RelatedProductIcon,
  relatedProducts,
} from '@/lib/related-products-data';

export function RelatedProducts() {
  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-6">
      <h2
        id="related-heading"
        className="text-h2 font-semibold tracking-tight text-(--color-text-primary)"
      >
        You may also like
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {relatedProducts.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductCard({ product }: { product: RelatedProduct }) {
  return (
    <a
      href={product.href}
      aria-disabled="true"
      onClick={(e) => e.preventDefault()}
      className="group block cursor-default rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)"
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-(--color-surface) to-(--color-background) text-(--color-text-secondary) ring-1 ring-(--color-border)">
        <ProductIcon kind={product.icon} />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-body font-medium text-(--color-text-primary)">{product.name}</p>
        <p className="text-body-sm text-(--color-text-muted)">{product.tagline}</p>
        <p className="text-body font-semibold text-(--color-text-primary)">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </a>
  );
}

function ProductIcon({ kind }: { kind: RelatedProductIcon }) {
  switch (kind) {
    case 'earbud':
      return <EarbudIcon />;
    case 'speaker':
      return <SpeakerIcon />;
    case 'over-ear':
      return <OverEarIcon />;
  }
}

const iconProps = {
  width: 64,
  height: 64,
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function EarbudIcon() {
  return (
    <svg aria-hidden="true" {...iconProps}>
      <ellipse cx="22" cy="24" rx="9" ry="11" />
      <path d="M22 35 L22 46" />
      <circle cx="22" cy="50" r="4" />
      <ellipse cx="42" cy="24" rx="9" ry="11" />
      <path d="M42 35 L42 46" />
      <circle cx="42" cy="50" r="4" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg aria-hidden="true" {...iconProps}>
      <rect x="18" y="8" width="28" height="48" rx="4" />
      <circle cx="32" cy="22" r="5" />
      <circle cx="32" cy="42" r="8" />
    </svg>
  );
}

function OverEarIcon() {
  return (
    <svg aria-hidden="true" {...iconProps}>
      <path d="M12 32 Q12 12 32 12 Q52 12 52 32" />
      <rect x="8" y="32" width="10" height="16" rx="3" />
      <rect x="46" y="32" width="10" height="16" rx="3" />
    </svg>
  );
}
