import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StickyAddToCart } from './sticky-add-to-cart';

type IOCallback = (entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]) => void;

let ioCallback: IOCallback | null = null;
let observedTarget: Element | null = null;
const disconnectSpy = vi.fn();

// Minimal stub — not extending IntersectionObserver, since we only need to
// drive observe/disconnect and capture the callback.
class MockIntersectionObserver {
  constructor(cb: IOCallback) {
    ioCallback = cb;
  }
  observe(el: Element) {
    observedTarget = el;
  }
  disconnect() {
    disconnectSpy();
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

function setUrl(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

function fireIO(isIntersecting: boolean) {
  act(() => {
    ioCallback?.([{ isIntersecting } as IntersectionObserverEntry]);
  });
}

function makeTarget() {
  return document.createElement('div');
}

beforeEach(() => {
  ioCallback = null;
  observedTarget = null;
  disconnectSpy.mockClear();
  setUrl('');
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  setUrl('');
});

function getAside() {
  return document.querySelector('aside[aria-label="Sticky add to cart"]');
}

describe('<StickyAddToCart />', () => {
  it('renders nothing in the DOM before the IO reports anything', () => {
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    expect(getAside()).toBeNull();
  });

  it('does not attach an observer when target is null', () => {
    render(<StickyAddToCart target={null} onAddToCart={() => {}} />);
    expect(ioCallback).toBeNull();
    expect(observedTarget).toBeNull();
  });

  it('observes the target once it is non-null', () => {
    const target = makeTarget();
    render(<StickyAddToCart target={target} onAddToCart={() => {}} />);
    expect(observedTarget).toBe(target);
  });

  it('mounts the bar when the hero CTA leaves the viewport', () => {
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    expect(getAside()).toBeNull();
    fireIO(false);
    expect(getAside()).not.toBeNull();
  });

  it('unmounts the bar when the hero CTA re-enters the viewport', () => {
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    fireIO(false);
    expect(getAside()).not.toBeNull();
    fireIO(true);
    expect(getAside()).toBeNull();
  });

  it('calls onAddToCart when the sticky CTA is clicked', async () => {
    const onAddToCart = vi.fn();
    const user = userEvent.setup();
    render(<StickyAddToCart target={makeTarget()} onAddToCart={onAddToCart} />);
    fireIO(false);
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledOnce();
  });

  it('shows the default color (Matte Black) when no color param is set', () => {
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    fireIO(false);
    expect(screen.getByText('Matte Black')).toBeInTheDocument();
    expect(screen.getByText(/\$349\.00/)).toBeInTheDocument();
  });

  it('reflects ?color=mdb by showing Midnight Blue', () => {
    setUrl('?color=mdb');
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    fireIO(false);
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument();
  });

  it('falls back to the default color when the param is unknown', () => {
    setUrl('?color=foo');
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    fireIO(false);
    expect(screen.getByText('Matte Black')).toBeInTheDocument();
  });

  it('falls back to the default color when the requested variant is out of stock', () => {
    setUrl('?color=ivy');
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    fireIO(false);
    expect(screen.getByText('Matte Black')).toBeInTheDocument();
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    unmount();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('renders a thumbnail with empty alt (color name already conveys the variant)', () => {
    setUrl('?color=mdb');
    render(<StickyAddToCart target={makeTarget()} onAddToCart={() => {}} />);
    fireIO(false);
    const img = getAside()?.querySelector('picture img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', '');
  });
});
