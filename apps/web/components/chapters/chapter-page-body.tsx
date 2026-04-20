import type { ReactNode } from 'react';
import type { ChapterId } from '../../lib/shell-store';
import { getSuiteChapterCopy, suiteDemoBrainIds } from '../../lib/suite-chapter-copy';
import { FlagshipWorkbench } from '../workbench/flagship-workbench';
import { BrainOverviewPanel } from '../brain/brain-overview-panel';
import { TopologyPanel } from '../brain/topology-panel';
import { BrainLivePanel } from '../brain/brain-live-panel';
import { BrainGatewaysPanel } from '../brain/brain-gateways-panel';
import { BrainTracesPanel } from '../brain/brain-traces-panel';
import { BrainMemoryPanel } from '../brain/brain-memory-panel';
import { BrainSettingsPanel } from '../brain/brain-settings-panel';
import { BrainIncidentPanel } from '../brain/brain-incident-panel';
import { ImportsPanel } from '../ingest/imports-panel';
import { HomeWorkspacePanel } from '../home/home-workspace-panel';
import { HomeMyWorkPanel } from '../home/home-my-work-panel';
import { HomeSavedViewsPanel } from '../home/home-saved-views-panel';
import { HomeNotificationsPanel } from '../home/home-notifications-panel';
import { AnalyticsChapterWorkbench } from '../analytics/analytics-chapter-workbench';
import { AdminGovernanceWorkbench } from '../admin/admin-governance-workbench';

export type ChapterPageBodyProps = Readonly<{
  chapterId: ChapterId;
  fullPath: string;
  /** Primul `trace` din query (BrainCrossLinks). */
  traceQuery?: string;
  /** Primul `neuron` din query — ID încrucișat business ↔ Brain. */
  neuronQuery?: string;
  /** `cerniq_focus=neuron_explanation` din query string. */
  neuronExplanationFocus?: boolean;
}>;

type BrainPanelOpts = Readonly<{
  traceQuery?: string;
  neuronQuery?: string;
  neuronExplanationFocus?: boolean;
}>;

const HOME_PANELS: Record<string, () => ReactNode> = {
  '/home/workspace': () => <HomeWorkspacePanel />,
  '/home/my-work': () => <HomeMyWorkPanel />,
  '/home/saved-views': () => <HomeSavedViewsPanel />,
  '/home/notifications': () => <HomeNotificationsPanel />,
};

const BRAIN_PANELS: Record<string, (opts: BrainPanelOpts) => ReactNode> = {
  '/brain/overview': ({ neuronQuery, neuronExplanationFocus }) => (
    <BrainOverviewPanel
      key={`brain-overview-${neuronQuery ?? ''}-${neuronExplanationFocus ? '1' : '0'}`}
      crossRefNeuronId={neuronQuery}
      crossRefExplanation={Boolean(neuronExplanationFocus && neuronQuery)}
    />
  ),
  '/brain/topology': () => <TopologyPanel />,
  '/brain/live': () => <BrainLivePanel />,
  '/brain/gateways': () => <BrainGatewaysPanel />,
  '/brain/traces': ({ traceQuery }) => (
    <BrainTracesPanel highlightTraceId={traceQuery} />
  ),
  '/brain/memory': () => <BrainMemoryPanel />,
  '/brain/settings': () => <BrainSettingsPanel />,
  '/brain/incident': () => <BrainIncidentPanel />,
};

type ChapterRenderArgs = Readonly<{
  fullPath: string;
  traceQuery?: string;
  neuronQuery?: string;
  neuronExplanationFocus?: boolean;
}>;

function renderSuiteWorkbench(fullPath: string): ReactNode | undefined {
  const copy = getSuiteChapterCopy(fullPath);
  if (!copy) return undefined;
  return (
    <FlagshipWorkbench
      copy={copy}
      traceId={suiteDemoBrainIds.traceId}
      gatewayId={suiteDemoBrainIds.gatewayId}
      neuronId={suiteDemoBrainIds.neuronId}
    />
  );
}

const CHAPTER_RENDERERS: Record<ChapterId, (args: ChapterRenderArgs) => ReactNode | undefined> = {
  home: ({ fullPath }) => HOME_PANELS[fullPath]?.(),
  brain: ({ fullPath, traceQuery, neuronQuery, neuronExplanationFocus }) =>
    BRAIN_PANELS[fullPath]?.({ traceQuery, neuronQuery, neuronExplanationFocus }),
  ingest: ({ fullPath }) =>
    fullPath === '/ingest/imports' ? <ImportsPanel /> : renderSuiteWorkbench(fullPath),
  customers: ({ fullPath }) => renderSuiteWorkbench(fullPath),
  inbox: ({ fullPath }) => renderSuiteWorkbench(fullPath),
  sales: ({ fullPath }) => renderSuiteWorkbench(fullPath),
  workflows: ({ fullPath }) => renderSuiteWorkbench(fullPath),
  operations: ({ fullPath }) => renderSuiteWorkbench(fullPath),
  analytics: ({ fullPath }) => {
    if (fullPath === '/analytics/executive') return <AnalyticsChapterWorkbench mode="executive" />;
    if (fullPath === '/analytics/operational')
      return <AnalyticsChapterWorkbench mode="operational" />;
    if (fullPath === '/analytics/drill-down') return <AnalyticsChapterWorkbench mode="drill-down" />;
    return renderSuiteWorkbench(fullPath);
  },
  admin: ({ fullPath }) => {
    const suite = renderSuiteWorkbench(fullPath);
    return (
      <div className="space-y-8">
        <AdminGovernanceWorkbench fullPath={fullPath} />
        {suite}
      </div>
    );
  },
};

/**
 * Conținut capitol — panouri dedicate Home/Brain/Imports sau șablon suite (§24) + dovezi Brain.
 */
export function ChapterPageBody({
  chapterId,
  fullPath,
  traceQuery,
  neuronQuery,
  neuronExplanationFocus,
}: ChapterPageBodyProps) {
  const out = CHAPTER_RENDERERS[chapterId]?.({
    fullPath,
    traceQuery,
    neuronQuery,
    neuronExplanationFocus,
  });
  if (out) return out;

  return (
    <p className="text-sm text-amber-200">
      Lipsește șablon pentru rută — verifică `suite-chapter-copy` și `chapter-page-body`.
    </p>
  );
}
