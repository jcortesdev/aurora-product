import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('returns the initial value when no entry exists', () => {
    const { result } = renderHook(() => useLocalStorage('cart', [] as number[]));
    expect(result.current[0]).toEqual([]);
  });

  it('hydrates from existing localStorage on mount', () => {
    window.localStorage.setItem('cart', JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useLocalStorage('cart', [] as number[]));
    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('persists updates back to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('cart', [] as number[]));
    act(() => result.current[1]([1, 2]));
    expect(result.current[0]).toEqual([1, 2]);
    expect(window.localStorage.getItem('cart')).toBe('[1,2]');
  });

  it('supports functional updater form', () => {
    const { result } = renderHook(() => useLocalStorage('cart', [1]));
    act(() => result.current[1]((prev) => [...prev, 2]));
    expect(result.current[0]).toEqual([1, 2]);
    expect(window.localStorage.getItem('cart')).toBe('[1,2]');
  });

  it('falls back to the initial value when stored JSON is corrupted', () => {
    window.localStorage.setItem('cart', '{not json');
    const { result } = renderHook(() => useLocalStorage('cart', [] as number[]));
    expect(result.current[0]).toEqual([]);
  });

  it('reacts to storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('cart', [] as number[]));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'cart',
          newValue: JSON.stringify([9]),
          storageArea: window.localStorage,
        })
      );
    });
    expect(result.current[0]).toEqual([9]);
  });

  it('ignores storage events for unrelated keys', () => {
    const { result } = renderHook(() => useLocalStorage('cart', [1]));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: '"dark"',
          storageArea: window.localStorage,
        })
      );
    });
    expect(result.current[0]).toEqual([1]);
  });
});
