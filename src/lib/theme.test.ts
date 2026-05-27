import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, getInitialTheme } from './theme';

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('dark') ? prefersDark : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('getInitialTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('returns the stored value when localStorage holds a valid theme', () => {
    localStorage.setItem('theme', 'dark');
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe('dark');
  });

  it('falls back to prefers-color-scheme when storage is empty', () => {
    mockMatchMedia(true);
    expect(getInitialTheme()).toBe('dark');
  });

  it('defaults to light when nothing else is available', () => {
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe('light');
  });

  it('ignores garbage stored values', () => {
    localStorage.setItem('theme', 'neon');
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe('light');
  });
});

describe('applyTheme', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('writes the data-theme attribute on <html>', () => {
    applyTheme('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persists the choice to localStorage', () => {
    applyTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
