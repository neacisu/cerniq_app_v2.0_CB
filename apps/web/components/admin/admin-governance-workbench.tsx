/**
 * Capitol Admin §22.10 / §23.10 — suprafețe guvernanță (scaffolding până la API IAM).
 * Trasabilitate: `docs/enterprise/auth-iam-implementation.md`, `compliance-data-lifecycle.md`.
 */
export function AdminGovernanceWorkbench({
  fullPath,
}: Readonly<{ fullPath: string }>) {
  const docIam = 'docs/enterprise/auth-iam-implementation.md';
  const docLifecycle = 'docs/enterprise/compliance-data-lifecycle.md';

  const blocks: Record<
    string,
    { title: string; bullets: readonly string[]; refs: readonly string[] }
  > = {
    '/admin/users': {
      title: 'Utilizatori și echipe',
      bullets: [
        'Provisionare, grupuri, invitații — model JWT + tenant (`X-Tenant-Id`) conform ADR IAM.',
        'UI: listă utilizatori, roluri efective, revocare sesiuni (țintă API `/v1/...` la iterarea următoare).',
      ],
      refs: [docIam],
    },
    '/admin/roles': {
      title: 'Roluri și acces',
      bullets: [
        'Mapare capitole blueprint → permisiuni RBAC (`impl-rbac-suite-chapters`).',
        'Matrice rol × capitol × operație Brain (gateway pause, policy edit).',
      ],
      refs: [docIam],
    },
    '/admin/tenant': {
      title: 'Tenant și organizație',
      bullets: [
        'Izolare date: strategie documentată în `business-tenancy-batch-import.md`.',
        'Setări limită cotă LLM per tenant — legat `llm-quotas-priority.md`.',
      ],
      refs: [docIam, 'docs/enterprise/business-tenancy-batch-import.md'],
    },
    '/admin/policies': {
      title: 'Policy Center',
      bullets: [
        'Politici runtime Brain (rate, conținut, routing) vs politici edge Traefik.',
        'Versionare și audit modificări — `brain_audit` vs log Vector (vezi logging-audit-policy).',
      ],
      refs: [docIam, 'docs/enterprise/logging-audit-policy.md'],
    },
    '/admin/model-routing': {
      title: 'Model routing',
      bullets: [
        'Clase endpoint 49xxx (guard / fast / reasoning / embeddings) — `stacks-05`, pachet `@cerniq/llm`.',
        'Fallback și degradare controlată la cotă sau indisponibilitate.',
      ],
      refs: ['docs/enterprise/llm-quotas-priority.md', 'docs/enterprise/llm-client-hardening.md'],
    },
    '/admin/audit': {
      title: 'Jurnal audit',
      bullets: [
        'Evenimente IAM, schimbări policy, acces date sensibile — stocare PG `brain_audit` (nu PII în Vector).',
        'Export filtrat pentru compliance reviews.',
      ],
      refs: ['docs/enterprise/logging-audit-policy.md', docIam],
    },
    '/admin/retention': {
      title: 'Retenție și guvernanță date',
      bullets: [
        'Politică GDPR: embeddings, portabilitate, ștergere — `compliance-data-lifecycle.md`.',
        'Aliniere retenție Redis streams / replay — runbook-uri messaging.',
      ],
      refs: [docLifecycle, 'docs/enterprise/messaging-redis-bullmq-ops.md'],
    },
  };

  const block = blocks[fullPath];
  if (!block) {
    return (
      <p className="text-sm text-cb-muted">
        Secțiune admin necunoscută: <code className="text-cb-ink/80">{fullPath}</code>
      </p>
    );
  }

  return (
    <article className="space-y-4" aria-labelledby="admin-section-title">
      <h2 id="admin-section-title" className="text-lg font-semibold text-cb-ink">
        {block.title}
      </h2>
      <ul className="list-inside list-disc space-y-2 text-sm text-cb-muted">
        {block.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <section className="rounded-md border border-cb-border bg-cb-nav-hover/20 p-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-cb-muted">
          Documentație (monorepo)
        </h3>
        <ul className="mt-2 space-y-1 font-mono text-xs text-cyan-300/90">
          {block.refs.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
