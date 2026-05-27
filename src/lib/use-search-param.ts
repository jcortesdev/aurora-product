import { useEffect, useState } from 'react';

function readParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

// Two-way bind a single URL search param to React state.
// Uses replaceState (not pushState) so variant flips don't pollute browser history.
export function useSearchParam(key: string): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState<string | null>(() => readParam(key));

  useEffect(() => {
    function onPopState() {
      setValue(readParam(key));
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [key]);

  function update(next: string | null) {
    setValue(next);
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (next === null) {
      params.delete(key);
    } else {
      params.set(key, next);
    }
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }

  return [value, update];
}
