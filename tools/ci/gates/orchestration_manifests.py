#!/usr/bin/env python3
"""Verifică manifeste gateway: câmp obligatoriu orchestration."""
from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    gateways = root / "packages" / "gateways"
    if not gateways.is_dir():
        print("orchestration_manifests: no gateways dir")
        return 0
    bad: list[str] = []
    for manifest in gateways.glob("*/manifest.json"):
        data = json.loads(manifest.read_text(encoding="utf-8"))
        if data.get("type") != "gateway":
            continue
        orch = data.get("orchestration")
        if orch not in ("stream", "bullmq", "temporal", "sync", "langgraph"):
            bad.append(f"{manifest.relative_to(root)}: orchestration invalid sau lipsă ({orch!r})")
    if bad:
        print("GATE FAIL: manifeste gateway:", file=sys.stderr)
        for b in bad:
            print(f"  - {b}", file=sys.stderr)
        return 1
    print("orchestration_manifests: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
