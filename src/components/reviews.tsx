import { AVERAGE_RATING, type Review, TOTAL_REVIEWS, reviews } from '@/lib/reviews-data';

export function Reviews() {
  return (
    <section aria-labelledby="reviews-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          id="reviews-heading"
          className="text-h2 font-semibold tracking-tight text-(--color-text-primary)"
        >
          Customer reviews
        </h2>
        <p className="text-body text-(--color-text-secondary)">
          <Stars value={AVERAGE_RATING} />
          <span className="ml-2 font-semibold text-(--color-text-primary)">{AVERAGE_RATING}</span>
          <span aria-hidden="true"> · </span>
          <span>{TOTAL_REVIEWS.toLocaleString()} reviews</span>
        </p>
      </div>
      <ul className="flex flex-col gap-6">
        {reviews.map((review) => (
          <li key={review.id} className="border-t border-(--color-border) pt-6">
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-center gap-3 text-body-sm text-(--color-text-secondary)">
        <Stars value={review.rating} />
        <span className="font-medium text-(--color-text-primary)">{review.author}</span>
        <span aria-hidden="true">·</span>
        <span>{review.date}</span>
      </div>
      <h3 className="text-body-lg font-semibold text-(--color-text-primary)">{review.title}</h3>
      <p className="text-body text-(--color-text-secondary)">{review.body}</p>
    </article>
  );
}

function Stars({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span
      role="img"
      aria-label={`${value} out of 5 stars`}
      className="inline-flex items-center gap-0.5 align-middle text-(--color-accent)"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} filled={i < filled} />
      ))}
    </span>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
