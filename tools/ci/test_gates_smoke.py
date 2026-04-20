#!/usr/bin/env python3
"""Smoke tests pentru gate-uri CI (fără dependență pytest). Rulează: python3 -m unittest tools.ci.test_gates_smoke -v"""
from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


class TestAdr0010Present(unittest.TestCase):
    """ADR-0010 obligatoriu pentru mitigare research §6 vs CMDB (plan doc-backend-research-versions-matrix)."""

    def test_adr_0010_file_exists(self) -> None:
        path = REPO / "docs" / "adr" / "0010-research-backend-section6-version-deltas.md"
        self.assertTrue(path.is_file(), msg=f"lipsește {path}")
        text = path.read_text(encoding="utf-8")
        self.assertIn("D1", text)
        self.assertIn("ADR-0010", text)


class TestFrontendVersionPinsGate(unittest.TestCase):
    def test_frontend_version_pins_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "frontend_version_pins.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "frontend_version_pins failed",
        )


class TestNoCriticalPlaceholdersGate(unittest.TestCase):
    def test_no_critical_placeholders_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "no_critical_placeholders.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "no_critical_placeholders failed",
        )


class TestComposeNoDuplicateDatastoresGate(unittest.TestCase):
    def test_compose_no_duplicate_datastores_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "compose_no_duplicate_datastores.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "compose_no_duplicate_datastores failed",
        )


class TestTraefikNoHazardousComposePortsGate(unittest.TestCase):
    def test_traefik_no_hazardous_compose_ports_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "traefik_no_hazardous_compose_ports.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "traefik_no_hazardous_compose_ports failed",
        )


class TestPackageArtifactsGate(unittest.TestCase):
    def test_package_artifacts_gate_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "package_artifacts_gate.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "package_artifacts_gate failed",
        )


class TestWorkflowSecretsLeakGuard(unittest.TestCase):
    def test_workflow_secrets_leak_guard_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "workflow_secrets_leak_guard.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "workflow_secrets_leak_guard failed",
        )


class TestEnterpriseDocsGate(unittest.TestCase):
    def test_enterprise_docs_gate_exits_zero(self) -> None:
        script = REPO / "tools" / "ci" / "gates" / "enterprise_docs_gate.py"
        self.assertTrue(script.is_file(), msg=f"lipsește {script}")
        r = subprocess.run(
            [sys.executable, str(script)],
            cwd=str(REPO),
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(
            r.returncode,
            0,
            msg=r.stderr or r.stdout or "enterprise_docs_gate failed",
        )


if __name__ == "__main__":
    unittest.main()
