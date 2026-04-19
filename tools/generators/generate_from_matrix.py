#!/usr/bin/env python3
"""Generează scaffold minim neuron/synapse din manifeste CSV (fără dependențe externe)."""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def neuron_ts_stub(name: str) -> str:
    return f"""export function {name.replace("-", "_")}(): string {{
  return "{name}";
}}
"""


def synapse_ts_stub(name: str) -> str:
    return f"""export const STREAM_KEY = "brain:{name}:stream";

export function describeSynapse(): string {{
  return "synapse-{name}";
}}
"""


def write_file(path: Path, content: str, dry_run: bool) -> None:
    if dry_run:
        print(f"[dry-run] would write {path}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"wrote {path}")


def _manifest_row_id(row: dict[str, str]) -> str:
    return (row.get("id") or row.get("package_suffix") or "").strip()


def generate_neuron_stubs(rows: list[dict[str, str]], root: Path, dry_run: bool) -> None:
    for row in rows:
        nid = _manifest_row_id(row)
        if not nid:
            continue
        slug = nid.removeprefix("neuron-") or nid
        out = root / "packages" / "neurons" / nid / "src" / "generated" / "stub.ts"
        write_file(out, neuron_ts_stub(slug), dry_run)


def generate_synapse_stubs(rows: list[dict[str, str]], root: Path, dry_run: bool) -> None:
    for row in rows:
        sid = _manifest_row_id(row)
        if not sid:
            continue
        slug = sid.removeprefix("synapse-") or sid
        out = root / "packages" / "synapses" / sid / "src" / "generated" / "stub.ts"
        write_file(out, synapse_ts_stub(slug), dry_run)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate stubs from NEURON/SYNAPSE CSV manifests.")
    parser.add_argument("--apply", action="store_true", help="Write files; default is dry-run.")
    parser.add_argument("--neuron-csv", type=Path, default=None)
    parser.add_argument("--synapse-csv", type=Path, default=None)
    args = parser.parse_args()

    root = repo_root()
    neuron_csv = args.neuron_csv or root / "packages/manifests/NEURON_MATRIX.csv"
    synapse_csv = args.synapse_csv or root / "packages/manifests/SYNAPSE_MATRIX.csv"
    dry_run = not args.apply

    if not neuron_csv.is_file():
        print(f"missing {neuron_csv}", file=sys.stderr)
        return 1

    generate_neuron_stubs(read_csv(neuron_csv), root, dry_run)

    if synapse_csv.is_file():
        generate_synapse_stubs(read_csv(synapse_csv), root, dry_run)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
