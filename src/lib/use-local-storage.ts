import { useCallback, useEffect, useRef, useState } from 'react';

type SetValue<T> = (next: T | ((prev: T) => T)) => void;

function read<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initial;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupted JSON or storage unavailable (private mode quota, etc.) —
    // fall back to the initial value rather than crashing the app.
    return initial;
  }
}

export function useLocalStorage<T>(key: string, initial: T): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => read(key, initial));
  // Latest `initial` captured by ref so the storage-event subscription can
  // reset to it without forcing the effect to re-run on every render.
  const initialRef = useRef(initial);
  initialRef.current = initial;

  const update = useCallback<SetValue<T>>(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // Quota exceeded or storage disabled — keep in-memory state
            // updated, just don't persist this round.
          }
        }
        return resolved;
      });
    },
    [key]
  );

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== key || event.storageArea !== window.localStorage) return;
      setValue(event.newValue === null ? initialRef.current : (JSON.parse(event.newValue) as T));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  return [value, update];
}
