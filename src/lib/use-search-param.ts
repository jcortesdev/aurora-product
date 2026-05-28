import { useEffect, useState } from 'react';

// Custom event used to broadcast in-page param updates between sibling
// instances of useSearchParam. `popstate` only fires for browser navigation,
// so without this every consumer except the one that called the setter would
// keep reading the stale value.
const PARAM_EVENT = 'aurora:searchparamchange';

type ParamEvent = CustomEvent<{ key: string }>;

function readParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

// Two-way bind a single URL search param to React state.
// Uses replaceState (not pushState) so variant flips don't pollute browser history.
// Multiple instances with the same key stay in sync via the in-page event below.
export function useSearchParam(key: string): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState<string | null>(() => readParam(key));

  useEffect(() => {
    function onPopState() {
      setValue(readParam(key));
    }
    function onParamChange(event: Event) {
      if ((event as ParamEvent).detail.key !== key) return;
      setValue(readParam(key));
    }
    window.addEventListener('popstate', onPopState);
    window.addEventListener(PARAM_EVENT, onParamChange);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener(PARAM_EVENT, onParamChange);
    };
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
    // Notify sibling instances so they re-read the URL.
    window.dispatchEvent(new CustomEvent(PARAM_EVENT, { detail: { key } }));
  }

  return [value, update];
}
