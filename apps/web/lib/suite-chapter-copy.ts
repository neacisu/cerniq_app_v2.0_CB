/**
 * Copy workbench per rută leaf — blueprint §22–§24 (șablon capitol + dovezi Brain unde e cazul).
 * Sursă unică pentru paginile suite care folosesc `FlagshipWorkbench` (fără date inventate de infrastructură).
 */

export interface SuiteChapterCopy {
  readonly headline: string;
  readonly summary: string;
  readonly primaryZoneLabel: string;
  readonly primaryZoneBody: string;
}

const DEMO_TRACE = 'trace-demo-1';
const DEMO_GATEWAY = 'gateway-hello';
const DEMO_NEURON = 'neuron-ping';

export const SUITE_CHAPTER_COPY: Readonly<Record<string, SuiteChapterCopy>> = {
  '/ingest/connectors': {
    headline: 'Connectors',
    summary:
      'Surse externe și conectori — §23.3; contracte și secrete via OpenBao (stacks-02), fără servicii duplicate.',
    primaryZoneLabel: 'Catalog conectori',
    primaryZoneBody:
      'Stare conexiune, rate limit, mapare entitate — date la integrare API ingest.',
  },
  '/ingest/mapping': {
    headline: 'Mapping',
    summary:
      'Mapare coloane CSV → câmpuri domeniu — aliniat `impl-import-domain-validation` și batch workspace.',
    primaryZoneLabel: 'Editor mapare',
    primaryZoneBody:
      'Reguli per coloană, preview erori — validare business înainte de commit batch.',
  },
  '/ingest/validation': {
    headline: 'Validation',
    summary:
      'Reguli de validare import — erori pentru UI quarantine; legătură cu motorul de domeniu.',
    primaryZoneLabel: 'Rezultate validare',
    primaryZoneBody:
      'Lista încălcări, severitate, rând sursă — fără PII în loguri client.',
  },
  '/ingest/quarantine': {
    headline: 'Quarantine',
    summary:
      'Rânduri respinse sau suspecte — izolare până la remediere; audit în pagina Audit.',
    primaryZoneLabel: 'Coadă carantină',
    primaryZoneBody:
      'Reluare după corectare mapare sau date sursă — conform politicii retenție.',
  },
  '/ingest/audit': {
    headline: 'Audit ingest',
    summary:
      'Istoric operații import — brain_audit vs Vector JSON (stacks-02); diferență audit business vs debug.',
    primaryZoneLabel: 'Jurnal audit',
    primaryZoneBody:
      'Actor, batch, acțiune, timestamp — detalii sensibile doar în backend.',
  },
  '/customers/accounts': {
    headline: 'Accounts',
    summary: 'Conturi organizații — CRM §23.4; RBAC `chapter:customers`.',
    primaryZoneLabel: 'Listă conturi',
    primaryZoneBody:
      'Filtru, health, owner — date mock până la contracte CRM.',
  },
  '/customers/contacts': {
    headline: 'Contacts',
    summary: 'Persoane asociate conturilor — clasificare GDPR conform `doc-compliance-data-lifecycle`.',
    primaryZoneLabel: 'Agendă contacte',
    primaryZoneBody: 'Legături cont, rol, consimțământ — fără export PII în telemetrie client.',
  },
  '/customers/customer-360': {
    headline: 'Customer 360',
    summary:
      'Vedere unificată — CRM §24.2; legături către Brain pentru explicații și trace.',
    primaryZoneLabel: 'Panou 360',
    primaryZoneBody:
      'Timeline, segmente, health — date mock; dovezi Brain în panoul lateral.',
  },
  '/customers/graph': {
    headline: 'Graph',
    summary:
      'Relații cont–contact–oportunitate — explorare graf; performanță și virtualizare la volum mare.',
    primaryZoneLabel: 'Vizualizare graf',
    primaryZoneBody:
      'Noduri și muchii din API — layout incremental până la date reale.',
  },
  '/customers/segments': {
    headline: 'Segments',
    summary: 'Segmente dinamice și campanii — fără duplicare motor decizie în alt stack.',
    primaryZoneLabel: 'Definiții segment',
    primaryZoneBody: 'Reguli, cardinalitate, refresh — integrare analytics la pasul următor.',
  },
  '/inbox/unified': {
    headline: 'Unified Inbox',
    summary:
      'Cozi conversații, SLA — Inbox §24.3; evenimente critice propagate spre telemetrie Brain.',
    primaryZoneLabel: 'Zonă primară (inbox)',
    primaryZoneBody:
      'Listă thread-uri prioritizată, filtre canal — integrare gateway mesagerie la API.',
  },
  '/inbox/thread': {
    headline: 'Thread',
    summary: 'Conversație pe canal — istoric mesaje și atașamente; retenție conform policy.',
    primaryZoneLabel: 'Mesaje',
    primaryZoneBody:
      'Thread selectat, escaladare, note interne — conținut doar prin API securizat.',
  },
  '/inbox/composer': {
    headline: 'Composer',
    summary:
      'Redactare răspuns — template-uri, semnătură, canal de ieșire; fără secrete în client.',
    primaryZoneLabel: 'Editor',
    primaryZoneBody:
      'Preview, atașamente, programare trimitere — validare server-side obligatorie.',
  },
  '/inbox/sla': {
    headline: 'SLA',
    summary:
      'Indicatori timp răspuns și încălcire — legătură cu workflow-uri și notificări.',
    primaryZoneLabel: 'Tablou SLA',
    primaryZoneBody:
      'Praguri per canal, incidente deschise — date agregate fără PII în UI.',
  },
  '/sales/pipeline': {
    headline: 'Pipeline',
    summary: 'Vedere pâlnie — Sales §23.6; tranziții pot declanșa gateway-uri.',
    primaryZoneLabel: 'Board pipeline',
    primaryZoneBody:
      'Coloane stadiu, valoare agregată — drag-and-drop la integrare API.',
  },
  '/sales/opportunities': {
    headline: 'Opportunities',
    summary: 'Listă oportunități — filtre owner, teritoriu, probabilitate.',
    primaryZoneLabel: 'Listă',
    primaryZoneBody: 'Sortare, salvare view — aliniat Saved Views din Home.',
  },
  '/sales/opportunity/demo': {
    headline: 'Opportunity (demo)',
    summary:
      'Pipeline, stagii, deal room — Sales §24.4; tranziții pot declanșa gateway-uri și workflow-uri.',
    primaryZoneLabel: 'Zonă primară (oportunitate)',
    primaryZoneBody:
      'Istoric stagii, valoare, competitori — demo fără persistență până la API Sales.',
  },
  '/sales/deal-room': {
    headline: 'Deal room',
    summary:
      'Colaborare stakeholder — documente și milestone; acces RBAC strict.',
    primaryZoneLabel: 'Spațiu deal',
    primaryZoneBody:
      'Agendă, note, atașamente — semnături și versiuni prin backend.',
  },
  '/sales/forecast': {
    headline: 'Forecast',
    summary:
      'Prognoză venituri — agregări per teritoriu și perioadă; consistență cu pipeline.',
    primaryZoneLabel: 'Tablou forecast',
    primaryZoneBody:
      'Scenarii, ajustări manuale — surse numerice din API, nu calcule ad-hoc în UI.',
  },
  '/workflows/catalog': {
    headline: 'Workflow catalog',
    summary:
      'Catalog definiții — Workflows §23.7; versioning și ownership conform `temporal-standards-ops`.',
    primaryZoneLabel: 'Definiții',
    primaryZoneBody:
      'Nume, versiune, status — legătură declarativă la worker Temporal (fără URL cluster hardcodat în UI).',
  },
  '/workflows/builder': {
    headline: 'Builder',
    summary:
      'Editor flux — pași, compensări, semnale; respectă matricea orchestrare (ADR).',
    primaryZoneLabel: 'Canvas builder',
    primaryZoneBody:
      'Validare graf, fără dublare aceluiași pas în Stream+Temporal.',
  },
  '/workflows/runs': {
    headline: 'Run queue',
    summary:
      'Coadă execuții — prioritate, stare, durată; observabilitate către stack existent (stacks-02).',
    primaryZoneLabel: 'Runs',
    primaryZoneBody:
      'Filtru namespace/coadă — detalii run deschise în pagina Run (demo).',
  },
  '/workflows/run/demo': {
    headline: 'Workflow run (demo)',
    summary:
      'Run queue, pași Temporal, DLQ — Workflows §24.5; vizualizare legată de trace și gateway.',
    primaryZoneLabel: 'Zonă primară (run)',
    primaryZoneBody:
      'Timeline pași, retry, compensare — date demo; worker conform `doc-orchestration-matrix-adr`.',
  },
  '/workflows/dlq': {
    headline: 'DLQ',
    summary:
      'Dead letter — mesaje eșuate pentru analiză; nu reimplementare cozi paralele pe Redis.',
    primaryZoneLabel: 'Coadă DLQ',
    primaryZoneBody:
      'Replay, discard, tichet — acțiuni tranzacționate prin API.',
  },
  '/workflows/approvals': {
    headline: 'Approvals',
    summary:
      'Aprobări umane în flux — SLA și delegare; jurnal în audit business.',
    primaryZoneLabel: 'Cereri în așteptare',
    primaryZoneBody:
      'Aprobă/respinge cu motiv — fără stocare secretelor în browser.',
  },
  '/operations/orders': {
    headline: 'Orders',
    summary:
      'Comenzi — Operations §23.8; excepții pot ridica incident Brain (legătură mai jos).',
    primaryZoneLabel: 'Listă comenzi',
    primaryZoneBody:
      'Stare, livrare, plată — integrare ERP prin contracte stabilite.',
  },
  '/operations/contracts': {
    headline: 'Contracts',
    summary: 'Contracte și termeni — renewals și obligații; conformitate documentată.',
    primaryZoneLabel: 'Contracte',
    primaryZoneBody:
      'Milestone-uri, alerte expirare — fără date sensibile în log client.',
  },
  '/operations/billing': {
    headline: 'Billing',
    summary: 'Facturare și încasări — reconciliere cu comenzi și contracte.',
    primaryZoneLabel: 'Tablou billing',
    primaryZoneBody:
      'Încasări, restanțe, dispute — agregate din API.',
  },
  '/operations/logistics': {
    headline: 'Logistics',
    summary: 'Livrări și transport — excepții propagate spre incidente și Brain.',
    primaryZoneLabel: 'Livrări',
    primaryZoneBody:
      'Tracking, ETA, excepții — legătură cu comenzi.',
  },
  '/operations/churn': {
    headline: 'Churn',
    summary:
      'Risc abandon — semnale din CRM și operațiuni; drill-down la Customer 360.',
    primaryZoneLabel: 'Indicatori churn',
    primaryZoneBody:
      'Scor, factori, acțiuni recomandate — modele pe server.',
  },
  '/operations/referrals': {
    headline: 'Referrals',
    summary: 'Program recomandări — urmărire conversii și recompense.',
    primaryZoneLabel: 'Referrals',
    primaryZoneBody:
      'Coduri, status, plăți — RBAC `chapter:operations`.',
  },
  '/analytics/executive': {
    headline: 'Executive dashboards',
    summary:
      'Analytics §23.9 — KPI executive; drill-down la trace/run în Brain (§24.6).',
    primaryZoneLabel: 'Panou executive',
    primaryZoneBody:
      'Agregate per tenant — fără export neautorizat.',
  },
  '/analytics/operational': {
    headline: 'Operational',
    summary: 'Metrici operaționale — cozi, latency, erori; aliniat observability stacks-02.',
    primaryZoneLabel: 'Metrici',
    primaryZoneBody:
      'Dashboard-uri Grafana/Prometheus — UI doar încapsulare, sursa de adevăr în backend.',
  },
  '/analytics/drill-down': {
    headline: 'Drill-down',
    summary:
      'Navigare de la agregat la eveniment — legătură obligatorie la trace și gateway.',
    primaryZoneLabel: 'Explorare',
    primaryZoneBody:
      'Filtre timp, entitate, severitate — deep link către `/brain/traces`.',
  },
  '/admin/users': {
    headline: 'Users',
    summary:
      'Utilizatori — Admin §23.10; `auth-adr-impl`, fără auth SaaS extern neplanificat.',
    primaryZoneLabel: 'Utilizatori',
    primaryZoneBody:
      'Invitații, stare, roluri — secrete și chei doar OpenBao.',
  },
  '/admin/roles': {
    headline: 'Roles',
    summary:
      'Mapare roluri → permisiuni capitole (`chapter:*`) și operații Brain — consistent cu API.',
    primaryZoneLabel: 'Roluri',
    primaryZoneBody:
      'Editare permisiuni — teste negative în suite e2e staging.',
  },
  '/admin/tenant': {
    headline: 'Tenant',
    summary:
      'Setări tenant — izolare date conform ADR tenancy; fără RLS ocolit din UI.',
    primaryZoneLabel: 'Profil tenant',
    primaryZoneBody:
      'Limite, branding, feature flags — modificări auditate.',
  },
  '/admin/policies': {
    headline: 'Policies',
    summary: 'Politici securitate și retenție — `doc-compliance-data-lifecycle`.',
    primaryZoneLabel: 'Politici',
    primaryZoneBody:
      'Clasificare date, păstrare, ștergere — aprobare formală pentru excepții.',
  },
  '/admin/model-routing': {
    headline: 'Model routing',
    summary:
      'Rutare LLM guard/fast/reasoning/embeddings — VIP stacks-05, ACL stacks-04; fără URL inventat în UI.',
    primaryZoneLabel: 'Rute model',
    primaryZoneBody:
      'Prioritate, degradare, cote — `doc-llm-quotas-priority`.',
  },
  '/admin/audit': {
    headline: 'Audit admin',
    summary: 'Jurnal acțiuni administrative — separat de audit business brain_audit.',
    primaryZoneLabel: 'Jurnal',
    primaryZoneBody:
      'Căutare după actor, resursă, interval — export controlat.',
  },
  '/admin/retention': {
    headline: 'Retention',
    summary: 'Politici păstrare și ștergere — GDPR și cerințe interne.',
    primaryZoneLabel: 'Retenție',
    primaryZoneBody:
      'Job-uri programate — coordonare cu Vector și PG central.',
  },
};

export function getSuiteChapterCopy(path: string): SuiteChapterCopy | undefined {
  return SUITE_CHAPTER_COPY[path];
}

/** Constante demo pentru panoul «Dovezi Brain» (ID-uri fără PII). */
export const suiteDemoBrainIds = {
  traceId: DEMO_TRACE,
  gatewayId: DEMO_GATEWAY,
  neuronId: DEMO_NEURON,
} as const;
