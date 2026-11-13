import json
import sys
import tempfile
import threading
import unittest
import zipfile
from pathlib import Path
from urllib.request import urlopen

sys.path.insert(0, str(Path(__file__).resolve().parent))
import installer  # noqa: E402


class TestToolsInstaller(unittest.TestCase):
    def setUp(self) -> None:
        self.catalog = installer.load_catalog()

    def test_smoke_test_profile_under_100mb_even_for_both(self) -> None:
        smoke_ids = [
            t["id"]
            for t in self.catalog["tools"]
            if "smoke_test" in t.get("profiles", [])
        ]
        self.assertGreaterEqual(len(smoke_ids), 6)
        for target_os in ("windows", "linux", "both"):
            for compute in ("cpu", "gpu", "both"):
                plan = installer.resolve_plan(
                    self.catalog, smoke_ids, target_os, "amd64", compute, 50.0
                )
                self.assertEqual(plan["skipped_os_count"], 0)
                self.assertLessEqual(plan["total_download_mb"], 100.0)

    def test_os_compatibility_skips_linux_only_on_windows(self) -> None:
        all_ids = [t["id"] for t in self.catalog["tools"]]
        win_plan = installer.resolve_plan(
            self.catalog, all_ids, "windows", "amd64", "cpu", 50.0
        )
        both_plan = installer.resolve_plan(
            self.catalog, all_ids, "both", "amd64", "both", 50.0
        )
        self.assertGreater(win_plan["skipped_os_count"], 0)
        self.assertEqual(both_plan["skipped_os_count"], 0)

    def test_gpu_vs_cpu_vs_both_size_difference(self) -> None:
        ai_ids = [
            t["id"]
            for t in self.catalog["tools"]
            if "polyglot_ai" in t.get("profiles", [])
        ]
        cpu_plan = installer.resolve_plan(
            self.catalog, ai_ids, "linux", "amd64", "cpu", 50.0
        )
        gpu_plan = installer.resolve_plan(
            self.catalog, ai_ids, "linux", "amd64", "gpu", 50.0
        )
        both_plan = installer.resolve_plan(
            self.catalog, ai_ids, "linux", "amd64", "both", 50.0
        )
        self.assertGreater(gpu_plan["total_download_mb"], cpu_plan["total_download_mb"])
        self.assertGreater(both_plan["total_download_mb"], gpu_plan["total_download_mb"])

    def test_source_channels_mapped(self) -> None:
        all_ids = [t["id"] for t in self.catalog["tools"]]
        plan = installer.resolve_plan(
            self.catalog, all_ids, "both", "amd64", "both", 50.0
        )
        self.assertGreater(plan["channel_counts"]["docker"], 0)
        self.assertGreater(plan["channel_counts"]["github"], 0)
        self.assertGreater(plan["channel_counts"]["pypi"], 0)
        self.assertGreater(plan["channel_counts"]["http"], 0)
        self.assertGreater(plan["channel_counts"]["ai"], 0)

    def test_zip_slip_blocked(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            zpath = tmp_path / "evil.zip"
            with zipfile.ZipFile(zpath, "w") as zf:
                zf.writestr("../../outside.txt", "bad")
            with self.assertRaises(RuntimeError):
                installer.extract_archive(zpath, tmp_path / "out")

    def test_dry_run_both_os_both_compute_and_http_api(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            manager = installer.DownloadManager(self.catalog)
            server = installer.ThreadingHTTPServer(
                ("127.0.0.1", 0), installer.make_handler(manager)
            )
            port = server.server_address[1]
            th = threading.Thread(target=server.serve_forever, daemon=True)
            th.start()
            try:
                with urlopen(f"http://127.0.0.1:{port}/api/bootstrap") as r:
                    boot = json.loads(r.read().decode("utf-8"))
                    self.assertIn("catalog", boot)
                    self.assertIn("channels", boot["env"])

                smoke_ids = [
                    t["id"]
                    for t in self.catalog["tools"]
                    if "smoke_test" in t.get("profiles", [])
                ]
                plan = manager.start(
                    selected_ids=smoke_ids,
                    target_os="both",
                    target_arch="amd64",
                    compute="both",
                    dest_dir=Path(tmp),
                    dry_run=True,
                )
                manager.wait()
                self.assertGreater(plan["active_count"], 0)
                snap = manager.get_snapshot()
                for tid in smoke_ids:
                    self.assertEqual(snap["items"][tid]["status"], "done")
            finally:
                server.shutdown()
                server.server_close()


if __name__ == "__main__":
    unittest.main()
