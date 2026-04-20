#!/usr/bin/env python3
"""Interzice tipare de tip `echo` + `secrets.` în workflow-uri GitHub (stacks-02 — fără leak în log)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
WF_DIR = ROOT / ".github" / "workflows"

# Linii run care tipăresc explicit obiect secrets (ex. echo ${{ secrets.X }})
ECHO_SECRETS = re.compile(
    r"^\s*(?:-\s*)?(?:run\s*:\s*)?.*\becho\b.*\bsecrets\.",
    re.IGNORECASE,
)


def main() -> int:
    if not WF_DIR.is_dir():
        print("workflow_secrets_leak_guard: OK (no .github/workflows)", file=sys.stderr)
        return 0
    bad: list[str] = []
    for yml in sorted(WF_DIR.glob("*.yml")) + sorted(WF_DIR.glob("*.yaml")):
        text = yml.read_text(encoding="utf-8")
        for i, line in enumerate(text.splitlines(), start=1):
            s = line.strip()
            if s.startswith("#"):
                continue
            if ECHO_SECRETS.search(line):
                bad.append(f"{yml.relative_to(ROOT)}:{i}:{line.strip()}")
    if bad:
        print(
            "workflow_secrets_leak_guard: posibil leak (echo + secrets) — corectați:",
            file=sys.stderr,
        )
        for b in bad:
            print(" ", b, file=sys.stderr)
        return 1
    print("workflow_secrets_leak_guard: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
