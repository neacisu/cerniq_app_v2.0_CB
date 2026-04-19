#!/usr/bin/env python3
"""Gate: documentul golden-thread-matrix.md există și respectă contractul minim de trasabilitate."""
from __future__ import annotations

import re
import sys
from pathlib import Path

MIN_GT_ROWS = 28
DOC_REL = Path("docs") / "enterprise" / "golden-thread-matrix.md"


def _require_substrings(text: str, needles: tuple[str, ...], path: Path) -> list[str]:
    bad: list[str] = []
    for n in needles:
        if n not in text:
            bad.append(f"{path}: lipsă secvență obligatorie {n!r}")
    return bad


def _count_gt_rows(text: str) -> int:
    return len(re.findall(r"^\| GT-\d+", text, re.MULTILINE))


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    path = root / DOC_REL
    if not path.is_file():
        print(f"GATE FAIL: lipsă {path.relative_to(root)}", file=sys.stderr)
        return 1
    text = path.read_text(encoding="utf-8", errors="replace")
    needles = (
        "doc-enterprise-stacks-golden-thread",
        "compliance-stacks-01-05.md",
        "../research/deep-research-report_cerniq.md",
        "../research/deep-research-report_cerniq_ui.md",
        "Cerniq_CB_V2_UI_Blueprint_Implementation_Plan_Apr2026_v2_full_suite.md",
        "CognitiveBrain",
        "golden_thread_matrix_gate.py",
    )
    bad = _require_substrings(text, needles, path)
    gt = _count_gt_rows(text)
    if gt < MIN_GT_ROWS:
        bad.append(f"{path}: prea puține rânduri GT (amu {gt}, minim {MIN_GT_ROWS})")
    if bad:
        print("GATE FAIL: golden_thread_matrix:", file=sys.stderr)
        for b in bad:
            print(f"  - {b}", file=sys.stderr)
        return 1
    print("golden_thread_matrix: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
