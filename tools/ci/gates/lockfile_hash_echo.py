#!/usr/bin/env python3
"""Emite hash lockfile pentru audit CI (fără conținut secret)."""
from __future__ import annotations

import hashlib
import sys
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    lock = root / "pnpm-lock.yaml"
    if not lock.is_file():
        print("pnpm-lock.yaml lipsă", file=sys.stderr)
        return 1
    h = hashlib.sha256(lock.read_bytes()).hexdigest()
    print(f"lockfile_sha256={h}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
