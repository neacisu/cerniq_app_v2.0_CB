import type { ChapterId } from './shell-store';

export interface ChapterDef {
  readonly id: ChapterId;
  readonly label: string;
  readonly href: string;
  readonly secondary: readonly { label: string; href: string }[];
}

export const CHAPTERS: readonly ChapterDef[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/home/workspace',
    secondary: [
      { label: 'Workspace', href: '/home/workspace' },
      { label: 'My Work', href: '/home/my-work' },
      { label: 'Saved Views', href: '/home/saved-views' },
      { label: 'Notifications', href: '/home/notifications' },
    ],
  },
  {
    id: 'brain',
    label: 'Brain',
    href: '/brain/overview',
    secondary: [
      { label: 'Overview', href: '/brain/overview' },
      { label: 'Live', href: '/brain/live' },
      { label: 'Gateways', href: '/brain/gateways' },
      { label: 'Topology', href: '/brain/topology' },
      { label: 'Traces', href: '/brain/traces' },
      { label: 'Memory', href: '/brain/memory' },
      { label: 'Settings', href: '/brain/settings' },
      { label: 'Incident', href: '/brain/incident' },
    ],
  },
  {
    id: 'ingest',
    label: 'Ingest',
    href: '/ingest/imports',
    secondary: [
      { label: 'Imports', href: '/ingest/imports' },
      { label: 'Connectors', href: '/ingest/connectors' },
      { label: 'Mapping', href: '/ingest/mapping' },
      { label: 'Validation', href: '/ingest/validation' },
      { label: 'Quarantine', href: '/ingest/quarantine' },
      { label: 'Audit', href: '/ingest/audit' },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/customers/accounts',
    secondary: [
      { label: 'Accounts', href: '/customers/accounts' },
      { label: 'Contacts', href: '/customers/contacts' },
      { label: 'Customer 360', href: '/customers/customer-360' },
      { label: 'Graph', href: '/customers/graph' },
      { label: 'Segments', href: '/customers/segments' },
    ],
  },
  {
    id: 'inbox',
    label: 'Inbox',
    href: '/inbox/unified',
    secondary: [
      { label: 'Unified Inbox', href: '/inbox/unified' },
      { label: 'Thread', href: '/inbox/thread' },
      { label: 'Composer', href: '/inbox/composer' },
      { label: 'SLA', href: '/inbox/sla' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    href: '/sales/pipeline',
    secondary: [
      { label: 'Pipeline', href: '/sales/pipeline' },
      { label: 'Opportunities', href: '/sales/opportunities' },
      { label: 'Opportunity (demo)', href: '/sales/opportunity/demo' },
      { label: 'Deal room', href: '/sales/deal-room' },
      { label: 'Forecast', href: '/sales/forecast' },
    ],
  },
  {
    id: 'workflows',
    label: 'Workflows',
    href: '/workflows/catalog',
    secondary: [
      { label: 'Catalog', href: '/workflows/catalog' },
      { label: 'Builder', href: '/workflows/builder' },
      { label: 'Run queue', href: '/workflows/runs' },
      { label: 'Run (demo)', href: '/workflows/run/demo' },
      { label: 'DLQ', href: '/workflows/dlq' },
      { label: 'Approvals', href: '/workflows/approvals' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    href: '/operations/orders',
    secondary: [
      { label: 'Orders', href: '/operations/orders' },
      { label: 'Contracts', href: '/operations/contracts' },
      { label: 'Billing', href: '/operations/billing' },
      { label: 'Logistics', href: '/operations/logistics' },
      { label: 'Churn', href: '/operations/churn' },
      { label: 'Referrals', href: '/operations/referrals' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics/executive',
    secondary: [
      { label: 'Executive', href: '/analytics/executive' },
      { label: 'Operational', href: '/analytics/operational' },
      { label: 'Drill-down', href: '/analytics/drill-down' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin/users',
    secondary: [
      { label: 'Users', href: '/admin/users' },
      { label: 'Roles', href: '/admin/roles' },
      { label: 'Tenant', href: '/admin/tenant' },
      { label: 'Policies', href: '/admin/policies' },
      { label: 'Model routing', href: '/admin/model-routing' },
      { label: 'Audit', href: '/admin/audit' },
      { label: 'Retention', href: '/admin/retention' },
    ],
  },
] as const;
