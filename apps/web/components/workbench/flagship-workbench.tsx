import type { ReactNode } from 'react';
import type { SuiteChapterCopy } from '../../lib/suite-chapter-copy';
import { BrainCrossLinks } from '../shell/brain-cross-links';

/** Alias compat Storybook / cod existent. */
type FlagshipWorkbenchCopy = SuiteChapterCopy;

export type FlagshipWorkbenchProps = Readonly<{
  copy: FlagshipWorkbenchCopy;
  traceId: string;
  gatewayId: string;
  neuronId: string;
  footer?: ReactNode;
}>;

/**
 * Șablon workbench flagship: strip sumar (§24) + zonă primară + panou dovezi Brain (gateway, trace, neuron, telemetrie).
 */
export function FlagshipWorkbench({
  copy,
  traceId,
  gatewayId,
  neuronId,
  footer,
}: FlagshipWorkbenchProps) {
  return (
    <article className="space-y-6" aria-labelledby="workbench-headline">
      <section className="rounded-lg border border-cb-border bg-cb-nav-hover/30 p-4">
        <h2 id="workbench-headline" className="text-lg font-semibold text-cb-ink">
          {copy.headline}
        </h2>
        <p className="mt-2 text-sm text-cb-muted">{copy.summary}</p>
      </section>
      <section
        className="rounded-lg border border-dashed border-cb-border p-4"
        aria-labelledby="primary-zone-label"
      >
        <h3 id="primary-zone-label" className="text-sm font-medium text-cb-ink">
          {copy.primaryZoneLabel}
        </h3>
        <p className="mt-2 text-sm text-cb-muted">{copy.primaryZoneBody}</p>
      </section>
      <section className="rounded-lg border border-cb-border bg-cb-nav-hover/40 p-4">
        <h3 className="text-sm font-medium text-cb-ink">Dovezi Brain</h3>
        <p className="mt-1 text-xs text-cb-muted">
          Gateway · trace · neuron · telemetrie live (blueprint §28 Faza 2–3)
        </p>
        <div className="mt-3">
          <BrainCrossLinks
            traceId={traceId}
            gatewayId={gatewayId}
            neuronId={neuronId}
          />
        </div>
      </section>
      {footer}
    </article>
  );
}
