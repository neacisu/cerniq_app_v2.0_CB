#!/usr/bin/env python3
"""Verifică pin-uri UI față de doc-frontend-version-pin (blueprint §3/§17). stacks-01."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
WEB_PKG = ROOT / "apps" / "web" / "package.json"

# String-uri exacte în package.json (fără ^ ~) pentru Query/Zustand — aliniat blueprint Apr 2026.
EXACT_DEPS = {
    "@tanstack/react-query": "5.99.1",
    "zustand": "5.0.10",
}

# Dev: Storybook 10.x linia 10.3.5 (semver compatibil ^10.3.5)
STORYBOOK_PKGS = ("storybook", "@storybook/nextjs", "@storybook/addon-a11y")
STORYBOOK_PREFIX = "10.3."


def _semver_core(spec: str) -> str:
    s = spec.strip().lstrip("^~>=<")
    m = re.match(r"(\d+\.\d+\.\d+)", s)
    return m.group(1) if m else s


def main() -> int:
    if not WEB_PKG.is_file():
        print(f"GATE FAIL: lipsește {WEB_PKG}", file=sys.stderr)
        return 1
    data = json.loads(WEB_PKG.read_text(encoding="utf-8"))
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    failures: list[str] = []

    for pkg, want in EXACT_DEPS.items():
        got = deps.get(pkg)
        if got != want:
            failures.append(f"{pkg}: așteptat {want!r} (exact), am {got!r}")

    for pkg in STORYBOOK_PKGS:
        got = deps.get(pkg)
        if got is None:
            failures.append(f"{pkg}: absent (așteptat Storybook {STORYBOOK_PREFIX}x)")
            continue
        core = _semver_core(got)
        if not core.startswith(STORYBOOK_PREFIX):
            failures.append(f"{pkg}: {got!r} nu e Storybook 10.3.x")

    if "@tanstack/react-router" in deps:
        failures.append(
            "@tanstack/react-router: interzis în apps/web fără ADR (Next App Router acoperă blueprint §7)."
        )

    if failures:
        print("GATE FAIL: frontend_version_pins", file=sys.stderr)
        for f in failures:
            print(f"  - {f}", file=sys.stderr)
        return 1
    print("frontend_version_pins: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
