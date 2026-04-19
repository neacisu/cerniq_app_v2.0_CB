#!/usr/bin/env python3
"""Gate stacks-01: fără stub/mock în suprafața API (routes + plugins) și fără marcaje în pachete sensibile."""
from __future__ import annotations

import re
import sys
from pathlib import Path

# Rute și plugin-uri Fastify — scanare completă (nu doar path cu substring „auth”).
API_SURFACE_DIRS = ("routes", "plugins")

FORBIDDEN_API = re.compile(
    r"anonymous-stub|\bStub IAM\b|mockAuth|placeholder secret|\bMOCK_",
    re.IGNORECASE,
)

# În packages, doar căi care sugerează identitate / tenant / plată.
PACKAGE_CRITICAL = ("auth", "tenant", "payment", "billing", "session", "jwt")
PATTERN_PACKAGES = re.compile(r"\b(TODO|FIXME|MOCK_|mockAuth|placeholder secret)\b", re.IGNORECASE)


def _iter_ts_sources(base: Path) -> list[Path]:
    if not base.is_dir():
        return []
    out: list[Path] = []
    for path in base.rglob("*.ts"):
        if "node_modules" in path.parts or ".spec." in path.name:
            continue
        out.append(path)
    return out


def _scan_api_surface(root: Path, api_app: Path) -> list[str]:
    failures: list[str] = []
    for name in API_SURFACE_DIRS:
        for path in _iter_ts_sources(api_app / name):
            text = path.read_text(encoding="utf-8", errors="replace")
            if FORBIDDEN_API.search(text):
                failures.append(str(path.relative_to(root)))
    return failures


def _rel_is_critical_package(rel_lower: str) -> bool:
    return any(s in rel_lower for s in PACKAGE_CRITICAL)


def _scan_packages(root: Path, pkg_root: Path) -> list[str]:
    if not pkg_root.is_dir():
        return []
    failures: list[str] = []
    for path in pkg_root.rglob("*.ts"):
        if "node_modules" in path.parts or ".spec." in path.name:
            continue
        rel = str(path.relative_to(root)).lower()
        if not _rel_is_critical_package(rel):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if PATTERN_PACKAGES.search(text):
            failures.append(str(path.relative_to(root)))
    return failures


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    api_app = root / "apps" / "api" / "src" / "app"
    pkg_root = root / "packages"

    failures = _scan_api_surface(root, api_app) + _scan_packages(root, pkg_root)

    if failures:
        print("GATE FAIL: placeholder/stub interzis în suprafață API sau pachete critice:", file=sys.stderr)
        for f in failures:
            print(f"  - {f}", file=sys.stderr)
        return 1
    print("no_critical_placeholders: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
