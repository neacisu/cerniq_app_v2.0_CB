import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CHAPTERS } from '../../../../lib/chapters';
import { BrainCrossLinks } from '../../../../components/shell/brain-cross-links';
import { BrainCanvas } from '../../../../components/brain/brain-canvas';
import { NeuronInspector } from '../../../../components/brain/neuron-inspector';

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string; path?: string[] }>;
}) {
  const { chapter: chapterId, path: pathSegments } = await params;
  const chapter = CHAPTERS.find((c) => c.id === chapterId);
  if (!chapter) notFound();

  if (!pathSegments || pathSegments.length === 0) {
    redirect(chapter.href);
  }

  const fullPath = `/${chapterId}/${pathSegments.join('/')}`;
  const leaf = chapter.secondary.find((s) => s.href === fullPath);
  if (!leaf) notFound();

  const title = leaf.label;

  const showBrainWorkbench =
    fullPath === '/ingest/imports' ||
    fullPath === '/customers/customer-360' ||
    fullPath === '/inbox/unified' ||
    fullPath === '/sales/opportunity/demo' ||
    fullPath === '/workflows/run/demo';

  return (
    <div className="@container max-w-6xl space-y-6">
      <header className="space-y-1 border-b border-zinc-800 pb-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          <Link href={chapter.href} className="hover:text-zinc-300">
            {chapter.label}
          </Link>
          <span className="mx-1">/</span>
          <span>{title}</span>
        </p>
        <h1 className="text-2xl font-semibold text-zinc-50">
          Welcome — {chapter.label}: {title}
        </h1>
        <p className="text-sm text-zinc-400">
          Blueprint §22–§23 — workbench flagship unde e cazul + legături Brain.
        </p>
      </header>

      {chapter.id === 'brain' && fullPath === '/brain/overview' ? (
        <div className="grid gap-4 @lg:grid-cols-[1fr_280px]">
          <BrainCanvas
            gatewayLabel="gateway-hello"
            neuronLabel="neuron-ping"
            synapseLabel="synapse-ping"
          />
          <NeuronInspector
            neuronId="neuron-ping"
            description="Exemplu static — milestone UI (canvas + inspector)."
            capabilities={['ping', 'telemetry']}
          />
        </div>
      ) : null}

      {showBrainWorkbench ? (
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <h2 className="text-sm font-medium text-zinc-200">Dovezi Brain</h2>
          <p className="mt-1 text-xs text-zinc-500">
            gateway · trace · telemetrie live (blueprint §28 Faza 2–3)
          </p>
          <div className="mt-3">
            <BrainCrossLinks
              traceId="trace-demo-1"
              gatewayId="gateway-hello"
              neuronId="neuron-ping"
            />
          </div>
        </section>
      ) : null}

      <p className="text-xs text-zinc-600">
        Rută: <code className="text-zinc-400">{fullPath}</code>
      </p>
    </div>
  );
}
