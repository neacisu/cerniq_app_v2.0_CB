#!/usr/bin/env python3
"""Verifică că fiecare path din docs/openapi/openapi.yaml apare în apps/api routes (string de înregistrare)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OPENAPI = ROOT / "docs" / "openapi" / "openapi.yaml"
ROUTES = ROOT / "apps" / "api" / "src" / "app" / "routes"


def extract_paths(yaml_text: str) -> list[str]:
    lines = yaml_text.splitlines()
    out: list[str] = []
    in_paths = False
    for line in lines:
        if line.rstrip() == "paths:":
            in_paths = True
            continue
        if in_paths and line.startswith("components:"):
            break
        if not in_paths:
            continue
        m = re.match(r"^  (/[^\s:]+):\s*$", line)
        if m:
            out.append(m.group(1))
    return out


def load_route_sources() -> str:
    parts: list[str] = []
    for p in sorted(ROUTES.rglob("*.ts")):
        if p.name.endswith(".spec.ts") or p.name.endswith(".test.ts"):
            continue
        parts.append(p.read_text(encoding="utf-8"))
    return "\n".join(parts)


def path_in_sources(path: str, src: str) -> bool:
    q1 = f"'{path}'"
    q2 = f'"{path}"'
    if q1 in src or q2 in src:
        return True
    # Rute în `routes/v1/*.ts`: AutoLoad prefixează cu `/v1`, iar în cod e calea relativă (ex. `/me`).
    if path.startswith("/v1/"):
        rel = path[len("/v1") :]  # ex. /me, /cognitive/hello
        r1 = f"'{rel}'"
        r2 = f'"{rel}"'
        if r1 in src or r2 in src:
            return True
    return False


def main() -> int:
    if not OPENAPI.is_file():
        print("openapi_paths_sync_gate: lipsește", OPENAPI, file=sys.stderr)
        return 1
    paths = extract_paths(OPENAPI.read_text(encoding="utf-8"))
    if not paths:
        print("openapi_paths_sync_gate: nu s-au găsit paths în OpenAPI", file=sys.stderr)
        return 1
    src = load_route_sources()
    missing = [p for p in paths if not path_in_sources(p, src)]
    if missing:
        print("openapi_paths_sync_gate: căi OpenAPI fără match în routes:", missing, file=sys.stderr)
        return 1
    print("openapi_paths_sync_gate: OK", len(paths), "paths")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
