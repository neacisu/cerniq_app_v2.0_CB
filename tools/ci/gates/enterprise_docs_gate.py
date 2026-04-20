#!/usr/bin/env python3
"""Verifică ancore doc enterprise Faza 0 + runbook-uri + ADR program (fără IP inventat)."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ENTERPRISE = ROOT / "docs" / "enterprise"
RUNBOOKS = ROOT / "docs" / "runbooks"

# Titluri fișiere / ancore repetate între doc-uri (Sonar S1192)
DOC_CONTRACTS_API_EVENTS = "contracts-api-events.md"
DOC_LOGGING_AUDIT_POLICY = "logging-audit-policy.md"
# Ancore identice în mai multe intrări CHECKS (Sonar S1192 — literal unic)
NEEDLE_HZ_164 = "hz.164"
NEEDLE_HZ_247 = "hz.247"
NEEDLE_APPS_WEB = "apps/web"
NEEDLE_SHELL_ROUTE_GROUP = "(shell)"

CHECKS: list[tuple[str, list[str]]] = [
    (
        "c4-deployment-views.md",
        [
            "77.42.76.185",
            "10.0.1.107",
            "10.0.1.10",
            "25010",
            "hz.223",
            NEEDLE_HZ_164,
            "```mermaid",
            "Traefik",
        ],
    ),
    (
        DOC_CONTRACTS_API_EVENTS,
        [
            "openapi/openapi.yaml",
            "Traefik",
            "X-Request-Id",
            "Idempotency-Key",
            "/v1/cognitive/stream",
            "openapi_paths_sync_gate.py",
            "BrainCrossEntityRefs",
            "cerniq_focus",
        ],
    ),
    (
        "data-domain-erd.md",
        [
            "brain_core",
            "10.0.1.107",
            "NEURON_MATRIX",
            "packages/db-migrations",
            "pgvector",
            "```mermaid",
        ],
    ),
    (
        "adr-program.md",
        [
            "0001",
            "0010",
            "Mitigare",
            "Turbo",
            "25xxx",
            "LangGraph",
            "template.md",
            "compliance-stacks-01-05.md",
            "deep-research-report_cerniq",
            "Blueprint",
        ],
    ),
    (
        "security-privacy.md",
        [
            "Vector",
            "Stalwart",
            "redis-shared",
            "49xxx",
            "matrice",
            "CSP",
            DOC_LOGGING_AUDIT_POLICY,
        ],
    ),
    (
        "orchestration-matrix.md",
        [
            "XREADGROUP",
            "gateway-hello",
            "SYNAPSE_MATRIX",
            "0004",
            "redis-streams.ts",
            "orchestration_manifests",
            "synapse_matrix_unique_streams",
            "LangGraph",
        ],
    ),
    (
        "deploy-topology-v2.md",
        [
            "77.42.76.185",
            "25000",
            "25010",
            "10.0.1.109",
            "10.0.1.110",
            NEEDLE_HZ_164,
            "api.v2.cerniq.app",
            "SSR",
        ],
    ),
    (
        "frontend-version-pin.md",
        [
            "pnpm-lock.yaml",
            "0009",
            "21.6.11",
            "@nx/next",
            "5.99.1",
            "frontend_version_pins.py",
        ],
    ),
    (
        DOC_LOGGING_AUDIT_POLICY,
        [
            "brain_audit",
            "Vector",
            "trace_id",
            "0008",
            "PII",
            "X-Request-Id",
        ],
    ),
    (
        "business-tenancy-batch-import.md",
        [
            "NEURON_MATRIX",
            "SYNAPSE_MATRIX",
            "RLS",
            "Batch",
            "tenant_id",
            "packages/manifests",
        ],
    ),
    (
        "llm-quotas-priority.md",
        [
            "49000",
            "Prometheus",
            "redis-shared",
            "packages/llm",
            "tenant",
            "429",
            "LLM_GUARD_BASE_URL",
        ],
    ),
    (
        "compliance-data-lifecycle.md",
        [
            "GDPR",
            "DPIA",
            "brain_core",
            "pgvector",
            DOC_LOGGING_AUDIT_POLICY,
            "PII",
        ],
    ),
    (
        "dr-rpo-rto.md",
        [
            "RPO",
            "RTO",
            "10.0.1.107",
            "Temporal",
            "hz.62",
            "CMDB",
        ],
    ),
    (
        "disaster-recovery.md",
        [
            "dr-rpo-rto.md",
        ],
    ),
    (
        "external-integrations.md",
        [
            "webhooks",
            "OpenBao",
            "redis-shared",
            "Idempotency",
            "webhooks-inbound.ts",
        ],
    ),
    (
        "v1-continuity-bridge.md",
        [
            "greenfield",
            "ADR",
            "Excluded",
            "stacks-01",
            "business-tenancy-batch-import.md",
        ],
    ),
    (
        "ui-blueprint-suite-inventory.md",
        [
            "§28",
            "§18",
            "22.2",
            DOC_CONTRACTS_API_EVENTS,
            "golden-thread-matrix.md",
            "CognitiveBrain",
        ],
    ),
    (
        "ui-prototype-cognitivebrain-reference.md",
        [
            "tokens.css",
            "global.css",
            "Liquid Cognitive",
            "UMD",
            "NeuronInspector",
            NEEDLE_APPS_WEB,
            NEEDLE_SHELL_ROUTE_GROUP,
        ],
    ),
    (
        "ui-chapter-shell-full-suite.md",
        [
            "§25",
            "§28",
            "CHAPTERS",
            "4.5rem",
            "Traefik",
            "AppShell",
            DOC_CONTRACTS_API_EVENTS,
        ],
    ),
    (
        "ui-api-routes-sse-telemetry.md",
        [
            "CERNIQ_API_INTERNAL_URL",
            "/v1/cognitive/stream",
            DOC_CONTRACTS_API_EVENTS,
            "openapi",
            "Traefik",
            "text/event-stream",
            "app/api/live",
        ],
    ),
    (
        "bootstrap-nx-evidence.md",
        [
            "apps/api",
            NEEDLE_APPS_WEB,
            "packages/neurons",
            "packages/gateways",
            "@nx/next",
            NEEDLE_SHELL_ROUTE_GROUP,
            "app/api/live",
            "tools/generators",
            "gateway-hello",
            "UMD",
        ],
    ),
    (
        "ui-blueprint-phased-milestones.md",
        [
            "§18",
            "§28",
            "§19",
            "§29",
            "ui-packages-tanstack-zustand-storybook",
            "golden-thread-matrix.md",
            "Brain-centric",
            "suite",
        ],
    ),
    (
        "data-model-erd-migrations.md",
        [
            "V20260419130000",
            "10.0.1.107",
            "CloudBeaver",
            "pgvector",
            "packages/db-migrations/sql",
        ],
    ),
    (
        "generators-manifests.md",
        [
            "generate_from_matrix.py",
            "NEURON_MATRIX",
            "manifest.json",
            "orchestration_manifests.py",
        ],
    ),
    (
        "auth-iam-implementation.md",
        [
            "35-jwt-auth",
            "ADR-0003",
            "OpenBao",
            "Traefik",
            "V20260419120000",
        ],
    ),
    (
        "api-contract-openapi.md",
        [
            "openapi.yaml",
            "openapi_paths_sync_gate",
            "Idempotency",
            "Traefik",
            "64xxx",
        ],
    ),
    (
        "apps-api-fastify-core.md",
        [
            "Fastify",
            "/health",
            "/ready",
            "25010",
            "Vector",
            "main.ts",
            "gate-pr-stacks-02-traefik-ingress-only",
            "20-error-envelope",
        ],
    ),
    (
        "backend-research-versions-matrix.md",
        [
            "deep-research-report_cerniq",
            "§6",
            "PostgreSQL 16",
            "pnpm-lock.yaml",
            "stacks-05-port-matrix",
            "ADR-0010",
            "D1",
            "D16",
            "SELECT version()",
        ],
    ),
    (
        "llm-client-hardening.md",
        [
            "LLM_GUARD_BASE_URL",
            "49004",
            "Vector",
            "packages/llm",
        ],
    ),
    (
        "messaging-redis-bullmq-ops.md",
        [
            "redis-shared",
            "10.0.1.10",
            "bullmq-queue",
            "apps/bullmq-worker",
            "REDIS_URL",
            "XREADGROUP",
        ],
    ),
    (
        "temporal-standards-ops.md",
        [
            "lxc-ci-worker",
            "TEMPORAL_TASK_QUEUE",
            "apps/temporal-worker",
            "/metrics",
            "METRICS_PORT",
            "stacks-02",
            "0008",
        ],
    ),
    (
        "langgraph-placement-adr.md",
        [
            "ADR-0006",
            "ADR-0007",
            "orchestration_manifests",
            "Deferred",
        ],
    ),
    (
        "local-dev-story.md",
        [
            "compose_no_duplicate_datastores",
            "10.0.1.107",
            NEEDLE_HZ_164,
            "MTU",
            "OpenBao",
            "network-stacks-04-mtu-vip.md",
            "haproxy-vip-path-stacks-05.md",
            "10.0.1.10",
        ],
    ),
    (
        "infra-phase0.md",
        [
            "compose_no_duplicate_datastores",
            "hz.223",
            "10.0.1.10",
            "Vector",
        ],
    ),
    (
        "observability-slo-alerts.md",
        [
            "Prometheus",
            "Tempo",
            "Alertmanager",
            DOC_LOGGING_AUDIT_POLICY,
        ],
    ),
    (
        "security-baseline.md",
        [
            "dependabot.yml",
            "brain_audit",
            "Stalwart",
            "Traefik",
            "redis-shared",
        ],
    ),
    (
        "port-matrix-v2-25xxx.md",
        [
            "25000",
            NEEDLE_HZ_247,
            "77.42.76.185",
            "stacks-05",
            "haproxy-vip-path",
        ],
    ),
    (
        "network-stacks-04-mtu-vip.md",
        [
            "10.0.0.2",
            "6379",
            "DNAT",
            "1450",
            "1360",
            "MSS",
            "10.0.1.10",
            NEEDLE_HZ_247,
            "local-dev-story.md",
            "mtu-mss-stacks-04.md",
        ],
    ),
    (
        "haproxy-vip-path-stacks-05.md",
        [
            "10.0.1.10",
            "10.0.0.2",
            "443",
            "25000",
            "25010",
            "Traefik",
            NEEDLE_HZ_247,
            "health",
            "19xxx",
            "29xxx",
            "stacks-05",
        ],
    ),
    (
        "ui-stack-adr-next-nx.md",
        [
            "ADR-0002",
            NEEDLE_APPS_WEB,
            "useBrainSse",
            "Traefik",
        ],
    ),
    (
        "ui-design-system-tailwind-motion.md",
        [
            "global.css",
            "OKLCH",
            "prefers-reduced-motion",
            "motion",
            "ESLint",
        ],
    ),
    (
        "ui-organisms-brain-sse-toolbar.md",
        [
            "brain-canvas.tsx",
            "TelemetryTray",
            "WCAG",
            "Storybook",
        ],
    ),
    (
        "ui-pages-sitemap-layouts.md",
        [
            "chapters.ts",
            "AppShell",
            "TopologyPanel",
            "ImportsPanel",
            "Traefik",
            NEEDLE_SHELL_ROUTE_GROUP,
            "AnalyticsChapterWorkbench",
            "AdminGovernanceWorkbench",
            "brain-cross-entity.ts",
        ],
    ),
    (
        "ui-sse-optimistic-realtime.md",
        [
            "useBrainSse",
            "EventSource",
            "throttleMs",
            "httpOnly",
        ],
    ),
    (
        "ui-testing-storybook-playwright.md",
        [
            "Playwright",
            "Storybook",
            "jest-axe",
            "web-e2e",
            "Vitest",
            "perf-budgets.json",
        ],
    ),
    (
        "ui-migration-legacy-map.md",
        [
            "CognitiveBrain",
            "ui-blueprint-phased-milestones",
            "chapters.ts",
            NEEDLE_SHELL_ROUTE_GROUP,
            "contracts-api-events.md",
        ],
    ),
    (
        "ui-otel-rum-frontend.md",
        [
            "Vector",
            "Prometheus",
            "otel-rum.ts",
            "NEXT_PUBLIC_OTEL_RUM",
            "NEXT_PUBLIC_RUM_INGEST_URL",
            "NEXT_PUBLIC_GRAFANA_RUM_DASHBOARD_URL",
            "grafana_rum_dashboard_url",
            "sendBeacon",
            "logging-audit-policy.md",
        ],
    ),
    (
        "ui-research-milestones-map.md",
        [
            "deep-research-report_cerniq_ui",
            "ui-ms01",
            "frontend-version-pin",
            "ui-blueprint-phased-milestones",
            "Next 16",
            "GT-24",
            "§18",
            "§28",
            "definition-of-done",
        ],
    ),
    (
        "testing-quality-gates.md",
        [
            "stacks-01",
            "stacks-02",
            "stacks-03",
            "lxc-ci-worker",
            "Testcontainers",
            "ioredis-mock",
            "orchestration_manifests.py",
            "synapse_matrix_unique_streams.py",
            "playwright",
        ],
    ),
]

RUNBOOK_FILES: list[str] = [
    "README.md",
    "incident-response.md",
    "change-deploy-rollback.md",
    "postgres-backup-restore.md",
    "redis-streams-retention-replay.md",
    "openbao-secrets-rotation.md",
    "mtu-mss-stacks-04.md",
    "traefik-reload.md",
    "cloudflare-records-registry.md",
]

README_ANCHORS: list[str] = [
    "incident-response.md",
    "CMDB",
    "adr-program.md",
    "Postgres",
    "Traefik",
    "OpenBao",
]


def _enterprise_document_needle_errors() -> int:
    errors = 0
    for name, needles in CHECKS:
        path = ENTERPRISE / name
        if not path.is_file():
            print("enterprise_docs_gate: lipsește", path, file=sys.stderr)
            errors += 1
            continue
        text = path.read_text(encoding="utf-8")
        for needle in needles:
            if needle not in text:
                print(
                    f"enterprise_docs_gate: {name} lipsește ancoră: {needle!r}",
                    file=sys.stderr,
                )
                errors += 1
    return errors


def _runbook_file_errors() -> int:
    errors = 0
    for rb in RUNBOOK_FILES:
        path = RUNBOOKS / rb
        if not path.is_file():
            print("enterprise_docs_gate: lipsește runbook", path, file=sys.stderr)
            errors += 1
    return errors


def _readme_anchor_errors() -> int:
    readme = RUNBOOKS / "README.md"
    if not readme.is_file():
        return 0
    text = readme.read_text(encoding="utf-8")
    errors = 0
    for needle in README_ANCHORS:
        if needle not in text:
            print(
                f"enterprise_docs_gate: runbooks/README.md lipsește ancoră: {needle!r}",
                file=sys.stderr,
            )
            errors += 1
    return errors


def main() -> int:
    total = (
        _enterprise_document_needle_errors()
        + _runbook_file_errors()
        + _readme_anchor_errors()
    )
    if total == 0:
        print(
            f"enterprise_docs_gate: OK ({len(CHECKS)} enterprise + {len(RUNBOOK_FILES)} runbook-uri)",
        )
    return 1 if total else 0


if __name__ == "__main__":
    raise SystemExit(main())
