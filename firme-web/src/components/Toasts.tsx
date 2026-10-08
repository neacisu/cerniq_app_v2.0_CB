import { useUi } from '../state/ui';

export function Toasts() {
  const { toasts, dismiss } = useUi();
  return (
    <div className="toast-host" role="region" aria-live="polite" aria-label="Notificări">
      {toasts.map((t) => (
        <div key={t.id} className={`toast glass ${t.tone}`}>
          <span className="dot" aria-hidden="true" /><span>{t.text}</span>
          {t.action && <button className="btn btn-sm" onClick={() => { t.action!.run(); dismiss(t.id); }}>{t.action.label}</button>}
        </div>
      ))}
    </div>
  );
}
