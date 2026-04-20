#!/usr/bin/env python3
"""Teste pentru generate_from_matrix (stdlib unittest, fără dependențe)."""

from __future__ import annotations

import io
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

# Modulul nu este pachet pip; încărcăm din același director.
sys.path.insert(0, str(Path(__file__).resolve().parent))

import generate_from_matrix as g  # noqa: E402


class TestManifestRowId(unittest.TestCase):
    def test_prefers_id(self) -> None:
        self.assertEqual(g._manifest_row_id({"id": "  neuron-x  ", "package_suffix": "y"}), "neuron-x")

    def test_fallback_package_suffix(self) -> None:
        self.assertEqual(g._manifest_row_id({"package_suffix": "neuron-z"}), "neuron-z")

    def test_empty_when_missing(self) -> None:
        self.assertEqual(g._manifest_row_id({}), "")


class TestNeuronTsStub(unittest.TestCase):
    def test_slug_uses_underscore(self) -> None:
        self.assertIn("neuron_a_b", g.neuron_ts_stub("neuron-a-b"))


class TestGatewayDerivedTs(unittest.TestCase):
    def test_contains_const(self) -> None:
        t = g.gateway_manifest_derived_ts("gw-a", "temporal")
        self.assertIn("GATEWAY_MANIFEST_NAME", t)
        self.assertIn("temporal", t)


class TestGenerateNeuronStubsDryRun(unittest.TestCase):
    def test_skips_empty_rows(self) -> None:
        buf = io.StringIO()
        with patch("sys.stdout", buf):
            g.generate_neuron_stubs([{}, {"id": ""}], Path("/tmp"), dry_run=True)
        self.assertEqual(buf.getvalue(), "")

    def test_emits_dry_run_line(self) -> None:
        buf = io.StringIO()
        with patch("sys.stdout", buf):
            g.generate_neuron_stubs([{"id": "neuron-ping"}], Path("/x/root"), dry_run=True)
        out = buf.getvalue()
        self.assertIn("[dry-run]", out)
        self.assertIn("neuron-ping", out)


if __name__ == "__main__":
    unittest.main()
