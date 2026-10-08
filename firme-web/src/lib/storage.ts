import { useCallback, useEffect, useRef, useState } from 'react';

export function readJson<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? ({ ...(typeof fallback === 'object' && !Array.isArray(fallback) ? fallback : {}), ...JSON.parse(v) } as T) : fallback; } catch { return fallback; }
}
export function readRaw<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
export function writeJson(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* spațiu plin sau mod privat */ }
}

/** Stare persistată în localStorage, sincronizată între taburi. */
export function useStored<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => readRaw<T>(key, initial));
  const keyRef = useRef(key);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setVal((p) => { const n = typeof v === 'function' ? (v as (p: T) => T)(p) : v; writeJson(keyRef.current, n); return n; });
  }, []);
  useEffect(() => {
    const on = (e: StorageEvent) => { if (e.key === keyRef.current && e.newValue) { try { setVal(JSON.parse(e.newValue) as T); } catch { /* ignorat */ } } };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  return [val, set];
}
