import { reviews } from '@/lib/reviews-data';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reviews } from './reviews';

describe('<Reviews />', () => {
  it('renders the section with an accessible heading', () => {
    render(<Reviews />);
    expect(
      screen.getByRole('heading', { level: 2, name: /customer reviews/i })
    ).toBeInTheDocument();
  });

  it('shows the aggregate that mirrors the JSON-LD AggregateRating', () => {
    render(<Reviews />);
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText(/412 reviews/i)).toBeInTheDocument();
  });

  it('exposes the rating numerically for screen readers', () => {
    render(<Reviews />);
    expect(screen.getAllByLabelText(/4\.7 out of 5 stars/i).length).toBeGreaterThan(0);
  });

  it('renders one card per review with title and author', () => {
    render(<Reviews />);
    for (const review of reviews) {
      expect(screen.getByRole('heading', { level: 3, name: review.title })).toBeInTheDocument();
      expect(screen.getByText(review.author)).toBeInTheDocument();
    }
  });

  it('labels each per-review star group with its numeric value', () => {
    render(<Reviews />);
    for (const review of reviews) {
      // Multiple aria-labels can share the same rating; just assert presence.
      const matches = screen.getAllByLabelText(new RegExp(`${review.rating} out of 5 stars`));
      expect(matches.length).toBeGreaterThan(0);
    }
  });
});
