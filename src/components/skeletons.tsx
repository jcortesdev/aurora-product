// Shimmer is a single utility composed inline so both skeletons stay tiny
// and don't pull a shared component into the eager bundle.
const shimmerClass =
  'animate-shimmer motion-reduce:animate-none bg-[linear-gradient(90deg,var(--color-surface)_0%,var(--color-border)_50%,var(--color-surface)_100%)] bg-[length:200%_100%] rounded-md';

export function ReviewsSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading reviews" className="flex flex-col gap-6">
      <div className={`h-8 w-64 ${shimmerClass}`} />
      <div className={`h-5 w-48 ${shimmerClass}`} />
      <div className="flex flex-col gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2 border-t border-(--color-border) pt-6">
            <div className={`h-4 w-40 ${shimmerClass}`} />
            <div className={`h-5 w-56 ${shimmerClass}`} />
            <div className={`h-4 w-full ${shimmerClass}`} />
            <div className={`h-4 w-5/6 ${shimmerClass}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading related products" className="flex flex-col gap-6">
      <div className={`h-8 w-56 ${shimmerClass}`} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className={`aspect-square w-full ${shimmerClass}`} />
            <div className={`h-5 w-32 ${shimmerClass}`} />
            <div className={`h-4 w-24 ${shimmerClass}`} />
            <div className={`h-5 w-20 ${shimmerClass}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
