import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchParam } from './use-search-param';

function setUrl(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

describe('useSearchParam', () => {
  beforeEach(() => {
    setUrl('');
  });

  afterEach(() => {
    setUrl('');
  });

  it('reads the initial value from the URL', () => {
    setUrl('?color=mdb');
    const { result } = renderHook(() => useSearchParam('color'));
    expect(result.current[0]).toBe('mdb');
  });

  it('returns null when the param is absent', () => {
    const { result } = renderHook(() => useSearchParam('color'));
    expect(result.current[0]).toBeNull();
  });

  it('updates the URL via replaceState (no history entry)', () => {
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    const pushSpy = vi.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useSearchParam('color'));

    act(() => result.current[1]('mdb'));

    expect(window.location.search).toBe('?color=mdb');
    expect(replaceSpy).toHaveBeenCalled();
    expect(pushSpy).not.toHaveBeenCalled();
    replaceSpy.mockRestore();
    pushSpy.mockRestore();
  });

  it('reacts to popstate (browser back/forward)', () => {
    const { result } = renderHook(() => useSearchParam('color'));
    act(() => {
      setUrl('?color=mbk');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current[0]).toBe('mbk');
  });

  it('removes the param when set to null', () => {
    setUrl('?color=mdb');
    const { result } = renderHook(() => useSearchParam('color'));
    act(() => result.current[1](null));
    expect(result.current[0]).toBeNull();
    expect(window.location.search).toBe('');
  });

  it('preserves other params when setting or removing', () => {
    setUrl('?color=mdb&utm=foo');
    const { result } = renderHook(() => useSearchParam('color'));
    act(() => result.current[1]('mbk'));
    expect(window.location.search).toBe('?color=mbk&utm=foo');
    act(() => result.current[1](null));
    expect(window.location.search).toBe('?utm=foo');
  });

  it('does not grow the history stack across updates', () => {
    const startLength = window.history.length;
    const { result } = renderHook(() => useSearchParam('color'));
    act(() => result.current[1]('mdb'));
    act(() => result.current[1]('mbk'));
    act(() => result.current[1](null));
    expect(window.history.length).toBe(startLength);
  });
});
