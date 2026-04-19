#!/usr/bin/env python3
"""Gate Task 0 (parțial): dacă există local main și work/Bootstrap, vârfurile trebuie aliniate.

Push la origin nu se poate verifica fără credențiale; acest gate prinde deriva locală înainte de PR.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    if not (root / ".git").is_dir():
        print("git_bootstrap_branches_aligned: skip (nu e repo Git)")
        return 0

    def _has_branch(name: str) -> bool:
        r = subprocess.run(
            ["git", "show-ref", "--verify", "--quiet", f"refs/heads/{name}"],
            cwd=root,
            check=False,
        )
        return r.returncode == 0

    if not _has_branch("main") or not _has_branch("work/Bootstrap"):
        print("git_bootstrap_branches_aligned: skip (lipsește main sau work/Bootstrap local)")
        return 0

    r = subprocess.run(
        ["git", "rev-parse", "main", "work/Bootstrap"],
        cwd=root,
        check=True,
        capture_output=True,
        text=True,
    )
    lines = [ln.strip() for ln in r.stdout.strip().splitlines() if ln.strip()]
    if len(lines) != 2:
        print("GATE FAIL: git rev-parse neașteptat", file=sys.stderr)
        return 1
    if lines[0] != lines[1]:
        print(
            "GATE FAIL: main și work/Bootstrap nu sunt aliniate (Task 0). "
            f"main={lines[0][:8]}… work/Bootstrap={lines[1][:8]}… — rulează: git checkout main && git merge work/Bootstrap --ff-only",
            file=sys.stderr,
        )
        return 1
    print("git_bootstrap_branches_aligned: OK (main == work/Bootstrap)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
