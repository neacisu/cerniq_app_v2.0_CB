#!/usr/bin/env python3
"""Gate stacks-02: fără postgres/redis/mail în compose-ul proiectului."""
from __future__ import annotations

import re
import sys
from pathlib import Path

FORBIDDEN = re.compile(
    r"^\s*(postgres|redis|mail|stalwart|smtp)\s*:\s*$", re.IGNORECASE | re.MULTILINE
)


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    hits: list[str] = []
    for pattern in ("**/docker-compose*.yml", "**/docker-compose*.yaml"):
        for path in root.glob(pattern):
            if "node_modules" in path.parts:
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            if FORBIDDEN.search(text):
                hits.append(str(path.relative_to(root)))
    if hits:
        print("GATE FAIL: servicii interzise (postgres/redis/mail) în compose:", file=sys.stderr)
        for h in hits:
            print(f"  - {h}", file=sys.stderr)
        return 1
    print("compose_no_duplicate_datastores: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
