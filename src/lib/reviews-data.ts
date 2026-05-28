// Sample reviews are fictional. The aggregate (4.7 stars, 412 total reviews)
// is mirrored in the JSON-LD AggregateRating block of index.html — keep both
// in sync if either changes.
export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  title: string;
  body: string;
};

export const AVERAGE_RATING = 4.7;
export const TOTAL_REVIEWS = 412;

export const reviews: Review[] = [
  {
    id: '1',
    author: 'J. Martinez',
    rating: 5,
    date: 'March 12, 2026',
    title: 'Worth every penny',
    body: 'These replaced my old over-ears and the difference is night and day. The noise cancellation is genuinely impressive on a long-haul flight — I forgot I was on a plane.',
  },
  {
    id: '2',
    author: 'A. Chen',
    rating: 5,
    date: 'February 28, 2026',
    title: 'Studio-quality at home',
    body: "I mix audio professionally and use these for casual reference listening. Tonal balance is honest, the bass doesn't bloat, and the soundstage feels open for a closed-back design.",
  },
  {
    id: '3',
    author: 'M. Patel',
    rating: 4,
    date: 'February 14, 2026',
    title: 'Great sound, snug fit',
    body: 'ANC and battery life are excellent. The clamping force took a few days to settle in — fine after that, but worth mentioning if you have a larger head.',
  },
  {
    id: '4',
    author: 'R. Williams',
    rating: 5,
    date: 'January 30, 2026',
    title: 'Battery life is unreal',
    body: 'Flew NYC to Tokyo with ANC on the entire way, used them for two more days of meetings, and still had charge left. The 50-hour claim is not marketing fluff.',
  },
  {
    id: '5',
    author: 'L. Garcia',
    rating: 5,
    date: 'January 18, 2026',
    title: 'The connection just works',
    body: "Switches between my laptop and phone without any drama. The first headphone I've owned where multipoint is actually reliable. Build feels premium and the case is genuinely pocketable.",
  },
];
