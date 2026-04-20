#!/usr/bin/env python3
"""SYNAPSE_MATRIX: stream_key unic — evită fan-out duplicat (doc-orchestration-matrix-adr). stacks-01."""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CSV_PATH = ROOT / "packages" / "manifests" / "SYNAPSE_MATRIX.csv"


def main() -> int:
    if not CSV_PATH.is_file():
        print(f"synapse_matrix_unique_streams: lipsește {CSV_PATH}", file=sys.stderr)
        return 1
    seen: dict[str, str] = {}
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            sk = (row.get("stream_key") or "").strip()
            sid = (row.get("id") or "").strip()
            if not sk:
                print(
                    f"synapse_matrix_unique_streams: rând fără stream_key ({sid!r})",
                    file=sys.stderr,
                )
                return 1
            if sk in seen:
                print(
                    "GATE FAIL: stream_key duplicat:",
                    sk,
                    "→",
                    seen[sk],
                    "și",
                    sid,
                    file=sys.stderr,
                )
                return 1
            seen[sk] = sid
    print("synapse_matrix_unique_streams: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
