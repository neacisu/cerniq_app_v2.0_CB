#!/usr/bin/env python3
"""Gate: pachete neuron / sinapsă / gateway au artefacte research §8 (metrics, otel, manifest, handlers, __tests__)."""
from __future__ import annotations

import sys
from pathlib import Path

REQUIRED = ("package.json", "tsconfig.json", "manifest.json", "src/metrics.ts", "src/otel.ts")


def _has_spec_under_tests(pkg: Path) -> bool:
    d = pkg / "__tests__"
    if not d.is_dir():
        return False
    return any(d.rglob("*.spec.ts"))


def _missing_required_files(root: Path, pkg: Path) -> list[str]:
    bad: list[str] = []
    for name in REQUIRED:
        p = pkg / name
        if not p.is_file():
            bad.append(f"{pkg.relative_to(root)}/{name}")
    return bad


def _kind_extra_relpath(kind: str) -> str | None:
    if kind == "neuron":
        return "src/lib/on-event.ts"
    if kind == "synapse":
        return "src/lib/on-stream-message.ts"
    return None


def _check_one_package(root: Path, pkg: Path, kind: str) -> list[str]:
    bad = _missing_required_files(root, pkg)
    if not _has_spec_under_tests(pkg):
        bad.append(f"{pkg.relative_to(root)}/__tests__/*.spec.ts")
    extra = _kind_extra_relpath(kind)
    if extra is not None:
        ep = pkg / extra
        if not ep.is_file():
            bad.append(f"{pkg.relative_to(root)}/{extra}")
    return bad


def _check_kind(root: Path, rel: str, kind: str) -> list[str]:
    base = root / rel
    if not base.is_dir():
        return [f"lipsește director {rel}"]
    failures: list[str] = []
    for pkg in sorted(p for p in base.iterdir() if p.is_dir() and not p.name.startswith(".")):
        failures.extend(_check_one_package(root, pkg, kind))
    return failures


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    failures: list[str] = []
    failures += _check_kind(root, "packages/neurons", "neuron")
    failures += _check_kind(root, "packages/synapses", "synapse")
    failures += _check_kind(root, "packages/gateways", "gateway")
    if failures:
        print(
            "GATE FAIL: package_artifacts — lipsesc artefacte research §8:",
            file=sys.stderr,
        )
        for f in failures:
            print(f"  - {f}", file=sys.stderr)
        return 1
    print("package_artifacts: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
