import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type DialogId = 'palette' | 'settings' | 'shortcuts' | 'share' | 'export' | 'picker' | 'confirm' | 'caen' | 'help';
export interface ToastItem { id: number; text: string; tone: 'ok' | 'info' | 'err'; action?: { label: string; run: () => void } }
export interface ConfirmOpts { titlu: string; text: string; confirmare: string; periculos?: boolean; onConfirm: () => void }
export interface DialogState { id: DialogId | null; props?: Record<string, unknown> }

interface Ctx {
  dialog: DialogState; open: (id: DialogId, props?: Record<string, unknown>) => void; close: () => void;
  toasts: ToastItem[]; toast: (text: string, tone?: ToastItem['tone'], action?: ToastItem['action']) => void; dismiss: (id: number) => void;
  confirm: (o: ConfirmOpts) => void; confirmOpts: ConfirmOpts | null;
  navOpen: boolean; setNavOpen: (v: boolean) => void;
}
const UiCtx = createContext<Ctx | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({ id: null });
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmOpts, setConfirmOpts] = useState<ConfirmOpts | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const seq = useRef(0);

  const open = useCallback((id: DialogId, props?: Record<string, unknown>) => setDialog({ id, props }), []);
  const close = useCallback(() => setDialog({ id: null }), []);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((text: string, tone: ToastItem['tone'] = 'ok', action?: ToastItem['action']) => {
    const id = ++seq.current;
    setToasts((t) => [...t.slice(-3), { id, text, tone, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 7000 : 3800);
  }, []);
  const confirm = useCallback((o: ConfirmOpts) => { setConfirmOpts(o); setDialog({ id: 'confirm' }); }, []);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setDialog((d) => (d.id === 'palette' ? { id: null } : { id: 'palette' })); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '?') { e.preventDefault(); setDialog({ id: 'shortcuts' }); }
      else if (e.key === '/') { e.preventDefault(); document.getElementById('global-search')?.focus(); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  const value = useMemo(() => ({ dialog, open, close, toasts, toast, dismiss, confirm, confirmOpts, navOpen, setNavOpen }), [dialog, open, close, toasts, toast, dismiss, confirm, confirmOpts, navOpen]);
  return <UiCtx.Provider value={value}>{children}</UiCtx.Provider>;
}
export function useUi(): Ctx {
  const c = useContext(UiCtx);
  if (!c) throw new Error('useUi în afara UiProvider');
  return c;
}
