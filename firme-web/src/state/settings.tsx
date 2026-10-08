import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJson, writeJson } from '../lib/storage';

export type ThemeMode = 'auto' | 'light' | 'dark';
export interface Settings {
  theme: ThemeMode;
  accent: string;
  glass: number;          // 0–100 intensitate sticlă
  density: 'comfortable' | 'compact';
  motion: 'auto' | 'reduce';
  compactNumbers: boolean;
  sidebarCollapsed: boolean;
  cardView: 'cards' | 'list';
}
export const ACCENTS = [
  { id: '#3b5bdb', nume: 'Indigo' }, { id: '#0b7a75', nume: 'Smarald' }, { id: '#7048e8', nume: 'Violet' },
  { id: '#c2255c', nume: 'Zmeură' }, { id: '#c2410c', nume: 'Chihlimbar' },
];
export const DEFAULTS: Settings = {
  theme: 'auto', accent: '#3b5bdb', glass: 60, density: 'comfortable', motion: 'auto', compactNumbers: false, sidebarCollapsed: false, cardView: 'cards',
};
const KEY = 'firme.settings';

interface Ctx { settings: Settings; set: <K extends keyof Settings>(k: K, v: Settings[K]) => void; reset: () => void; resolvedDark: boolean }
const SettingsCtx = createContext<Ctx | null>(null);

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => readJson(KEY, DEFAULTS));
  const [sysDark, setSysDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent) => setSysDark(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const resolvedDark = settings.theme === 'dark' || (settings.theme === 'auto' && sysDark);

  useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = resolvedDark ? 'dark' : 'light';
    r.dataset.density = settings.density;
    r.dataset.motion = settings.motion;
    r.style.setProperty('--accent', settings.accent);
    r.style.setProperty('--accent-rgb', hexToRgb(settings.accent));
    r.style.setProperty('--glass', String(settings.glass / 100));
    writeJson(KEY, settings);
  }, [settings, resolvedDark]);

  const set = useCallback(<K extends keyof Settings>(k: K, v: Settings[K]) => setSettings((s) => ({ ...s, [k]: v })), []);
  const reset = useCallback(() => setSettings(DEFAULTS), []);
  const value = useMemo(() => ({ settings, set, reset, resolvedDark }), [settings, set, reset, resolvedDark]);
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}
export function useSettings(): Ctx {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error('useSettings în afara SettingsProvider');
  return c;
}
