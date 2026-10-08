import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useUi } from '../state/ui';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Dialog({ title, children, footer, width, className = '', bare }: { title: string; children: ReactNode; footer?: ReactNode; width?: number; className?: string; bare?: boolean }) {
  const { close } = useUi();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const root = document.getElementById('root');
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    const first = ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? ref.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    return () => {
      document.body.style.overflow = ''; root?.removeAttribute('inert');
      window.scrollTo(0, scrollY); prev?.focus?.();
    };
  }, []);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab' || !ref.current) return;
    const els = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((x) => x.offsetParent !== null);
    if (!els.length) return;
    const a = els[0]!, z = els[els.length - 1]!;
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  };
  return createPortal(
    <div className="dialog-back" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }} onKeyDown={onKey}>
      <div ref={ref} className={`dialog glass ${className}`} role="dialog" aria-modal="true" aria-label={title} style={width ? ({ '--dw': `${width}px` } as React.CSSProperties) : undefined}>
        {!bare && (
          <div className="dialog-head">
            <h2>{title}</h2>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={close} aria-label="Închide"><X size={20} aria-hidden="true" /></button>
          </div>
        )}
        {bare ? children : <div className="dialog-body">{children}</div>}
        {footer && <div className="dialog-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
