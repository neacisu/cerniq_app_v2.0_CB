#!/usr/bin/env python3
"""Gate stacks-02: compose cu publish 0.0.0.0:80/443 pentru app (pattern hazard)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

HAZARD = re.compile(r"['\"]?0\.0\.0\.0['\"]?\s*:\s*['\"]?(80|443)['\"]?", re.IGNORECASE)


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    bad: list[str] = []
    for pattern in ("**/docker-compose*.yml", "**/docker-compose*.yaml"):
        for path in root.glob(pattern):
            if "node_modules" in path.parts:
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            if HAZARD.search(text):
                bad.append(str(path.relative_to(root)))
    if bad:
        print("GATE FAIL: publish public 80/443 în compose (folosiți Traefik):", file=sys.stderr)
        for b in bad:
            print(f"  - {b}", file=sys.stderr)
        return 1
    print("traefik_no_hazardous_compose_ports: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
