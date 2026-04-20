import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CHAPTERS } from '../../../../lib/chapters';
import { ChapterPageBody } from '../../../../components/chapters/chapter-page-body';
import { NEURON_EXPLANATION_FOCUS } from '../../../../lib/brain-cross-entity';

type ChapterPageProps = Readonly<{
  params: Promise<{ chapter: string; path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function firstQuery(
  value: string | string[] | undefined,
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function ChapterPage({
  params,
  searchParams,
}: ChapterPageProps) {
  const { chapter: chapterIdRaw, path: pathSegments } = await params;
  const sp = await searchParams;
  const chapter = CHAPTERS.find((c) => c.id === chapterIdRaw);
  if (!chapter) notFound();

  if (!pathSegments || pathSegments.length === 0) {
    redirect(chapter.href);
  }

  const fullPath = `/${chapterIdRaw}/${pathSegments.join('/')}`;
  const leaf = chapter.secondary.find((s) => s.href === fullPath);
  if (!leaf) notFound();

  const title = leaf.label;
  const traceQuery = firstQuery(sp.trace);
  const neuronQuery = firstQuery(sp.neuron);
  const focusQuery = firstQuery(sp.cerniq_focus);

  return (
    <div className="@container max-w-6xl space-y-6">
      <header className="space-y-1 border-b border-cb-border pb-4">
        <p className="text-xs uppercase tracking-wide text-cb-muted">
          <Link href={chapter.href} className="hover:text-cb-ink">
            {chapter.label}
          </Link>
          <span className="mx-1">/</span>
          <span>{title}</span>
        </p>
        <h1 className="text-2xl font-semibold text-cb-ink">
          {chapter.label}: {title}
        </h1>
        <p className="text-sm text-cb-muted">
          Blueprint §22–§23 — șablon capitol + dovezi Brain unde e cazul; RBAC API{' '}
          <code className="rounded bg-cb-nav-hover px-1 text-xs">chapter:{chapter.id}</code>.
        </p>
      </header>

      <ChapterPageBody
        chapterId={chapter.id}
        fullPath={fullPath}
        traceQuery={traceQuery}
        neuronQuery={neuronQuery}
        neuronExplanationFocus={focusQuery === NEURON_EXPLANATION_FOCUS}
      />

      <p className="text-xs text-cb-muted">
        Rută: <code className="text-cb-ink/80">{fullPath}</code>
      </p>
    </div>
  );
}
