#!/usr/bin/env python3
"""Rulează toate gate-urile stacks pentru PR/CI."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

GATES = [
    "compose_no_duplicate_datastores.py",
    "traefik_no_hazardous_compose_ports.py",
    "no_critical_placeholders.py",
    "orchestration_manifests.py",
    "golden_thread_matrix_gate.py",
    "git_bootstrap_branches_aligned.py",
    "lockfile_hash_echo.py",
]


def main() -> int:
    d = Path(__file__).resolve().parent / "gates"
    code = 0
    for g in GATES:
        r = subprocess.run([sys.executable, str(d / g)], check=False)
        if r.returncode != 0:
            code = r.returncode
    return code


if __name__ == "__main__":
    raise SystemExit(main())
