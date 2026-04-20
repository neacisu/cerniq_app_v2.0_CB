/** My Work — cozi personale și sarcini (fără date sensibile mock). */
export function HomeMyWorkPanel() {
  const items = [
    { id: 't1', title: 'Revizuire batch import', chapter: 'Ingest' },
    { id: 't2', title: 'Follow-up oportunitate', chapter: 'Sales' },
  ];

  return (
    <div className="rounded-xl border border-cb-border bg-cb-surface p-4">
      <h2 className="text-lg font-semibold text-cb-ink">My Work</h2>
      <p className="mt-1 text-sm text-cb-muted">
        Listă sarcini — integrare API task/workflow; demo static.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-cb-ink">
        {items.map((i) => (
          <li key={i.id}>
            <span className="text-cb-muted">[{i.chapter}]</span> {i.title}
          </li>
        ))}
      </ol>
    </div>
  );
}
