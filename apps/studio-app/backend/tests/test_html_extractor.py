"""Benchmark & security tests for Phase 2A-HTML offline extraction (Decision D17)."""

from __future__ import annotations

import re
import socket
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pytest

from app.services.extraction.html_extractor import (
    extract_html_mode1_quick,
    extract_html_mode2_stage,
)


@dataclass(frozen=True)
class HtmlGroundTruthEntity:
    entity_type: str
    normalized_value: str
    label: str
    locator: str
    min_mode: str


@dataclass(frozen=True)
class HtmlGroundTruthRelation:
    relation_type: str
    source_type: str
    source_value: str
    target_type: str
    target_value: str
    min_mode: str


def _resolve_html_samples_dir() -> Path:
    container_mount = Path("/app/tests/fixtures/html_samples")
    if container_mount.exists():
        return container_mount
    repo_dir = (
        Path(__file__).resolve().parents[4]
        / "doc"
        / "examples"
        / "option_b_synthetic_samples"
        / "html"
    )
    if repo_dir.exists():
        return repo_dir
    raise FileNotFoundError("Phase 2A synthetic HTML samples directory not found")


META_BULLET_RE = re.compile(r"^-\s+\*\*(\w+)\*\*:\s*`(.*)`$")


def _parse_ground_truth(
    md_path: Path,
) -> tuple[dict[str, str], list[HtmlGroundTruthEntity], list[HtmlGroundTruthRelation]]:
    meta: dict[str, str] = {}
    entities: list[HtmlGroundTruthEntity] = []
    relations: list[HtmlGroundTruthRelation] = []
    section = ""
    for raw_line in md_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("## "):
            section = line[3:].strip()
            continue
        bullet_match = META_BULLET_RE.match(line)
        if bullet_match:
            meta[bullet_match.group(1)] = bullet_match.group(2)
            continue
        if (
            line.startswith("|")
            and not line.startswith("| entity_type")
            and not line.startswith("| relation_type")
            and not line.startswith("| :---")
        ):
            parts = [p.strip().strip("`") for p in line.strip("|").split("|")]
            if section == "Expected Relations" and len(parts) >= 6:
                relations.append(
                    HtmlGroundTruthRelation(
                        relation_type=parts[0],
                        source_type=parts[1],
                        source_value=parts[2],
                        target_type=parts[3],
                        target_value=parts[4],
                        min_mode=parts[5],
                    )
                )
            elif len(parts) >= 5:
                entities.append(
                    HtmlGroundTruthEntity(
                        entity_type=parts[0],
                        normalized_value=parts[1],
                        label=parts[2],
                        locator=parts[3],
                        min_mode=parts[4],
                    )
                )
    return meta, entities, relations


HTML_SAMPLE_NAMES = [
    "01_profil_osint_social",
    "02_page_phishing_baridimob",
    "03_annonce_marketplace_scam",
    "04_export_canal_telegram_web",
    "05_site_societe_ecran_mentions",
]


@pytest.mark.parametrize("sample_stem", HTML_SAMPLE_NAMES)
def test_html_ground_truth_mode1_and_mode2(sample_stem: str) -> None:
    """Every entity & relation documented in the .md ground truth must be extracted offline."""
    samples_dir = _resolve_html_samples_dir()
    html_bytes = (samples_dir / f"{sample_stem}.html").read_bytes()
    meta_expected, gt_entities, gt_relations = _parse_ground_truth(
        samples_dir / f"{sample_stem}.md"
    )
    assert len(gt_entities) > 0, f"Parsed 0 ground-truth entities from {sample_stem}.md"

    m1 = extract_html_mode1_quick(html_bytes)
    assert m1.metadata.title == meta_expected["title"]
    assert m1.metadata.lang == meta_expected["lang"]
    assert m1.metadata.canonical_url == meta_expected["canonical_url"]
    assert m1.metadata.embedded_images_count == int(meta_expected["embedded_images"])
    assert m1.metadata.forms_count == int(meta_expected["forms_count"])
    assert m1.metadata.scripts_count == int(meta_expected["scripts_count"])
    assert m1.metadata.json_ld_blocks == int(meta_expected["json_ld_blocks"])
    assert m1.metadata.comments_count == int(meta_expected["comments_count"])

    m1_pairs = {(c.entity_type, c.normalized_value) for c in m1.candidates}
    for gt in gt_entities:
        if gt.min_mode == "quick":
            assert (gt.entity_type, gt.normalized_value) in m1_pairs, (
                f"Mode 1 missed {(gt.entity_type, gt.normalized_value)} in {sample_stem}"
            )

    m1_rel_tuples = {
        (
            r.relation_type,
            r.source_entity_type,
            r.source_normalized_value,
            r.target_entity_type,
            r.target_normalized_value,
        )
        for r in m1.relations
    }
    for gtr in gt_relations:
        if gtr.min_mode == "quick":
            assert (
                gtr.relation_type,
                gtr.source_type,
                gtr.source_value,
                gtr.target_type,
                gtr.target_value,
            ) in m1_rel_tuples, f"Mode 1 missed relation {gtr} in {sample_stem}"

    m2_all = []
    m2_rels = []
    last_summary: dict[str, Any] = {}
    for stage in (1, 2, 3):
        out = extract_html_mode2_stage(html_bytes, stage=stage)
        m2_all.extend(out.candidates)
        m2_rels.extend(out.relations)
        last_summary = out.summary

    m2_pairs = {(c.entity_type, c.normalized_value) for c in m2_all}
    for gt in gt_entities:
        assert (gt.entity_type, gt.normalized_value) in m2_pairs, (
            f"Mode 2 missed {(gt.entity_type, gt.normalized_value)} in {sample_stem}"
        )

    m2_rel_tuples = {
        (
            r.relation_type,
            r.source_entity_type,
            r.source_normalized_value,
            r.target_entity_type,
            r.target_normalized_value,
        )
        for r in m2_rels
    }
    for gtr in gt_relations:
        assert (
            gtr.relation_type,
            gtr.source_type,
            gtr.source_value,
            gtr.target_type,
            gtr.target_value,
        ) in m2_rel_tuples, f"Mode 2 missed relation {gtr} in {sample_stem}"

    for cand in [*m1.candidates, *m2_all]:
        assert cand.entity_type not in {"wilaya", "commune"}
        assert cand.suggested_layer != "VERIFIED"
        assert "<script" not in cand.label.lower()
        assert "<script" not in cand.quote_snippet.lower()

    expected_locs = {
        loc.strip()
        for loc in meta_expected.get("locations", "").split(";")
        if loc.strip()
    }
    if expected_locs:
        extracted_locs = last_summary.get("extracted_locations", {})
        found_locs = set(extracted_locs.get("wilayas", [])) | set(
            extracted_locs.get("communes", [])
        )
        assert expected_locs.issubset(found_locs), (
            f"Missing expected locations {expected_locs - found_locs} in {sample_stem}"
        )


def test_html_extractor_zero_network_and_xss_ssrf_safety(monkeypatch: pytest.MonkeyPatch) -> None:
    """Adversarial HTML must never trigger outbound network calls or unsafe script tags."""

    def forbid_network(*_args: Any, **_kwargs: Any) -> Any:
        raise AssertionError("Offline HTML extractor attempted a network call!")

    monkeypatch.setattr(socket, "create_connection", forbid_network)
    monkeypatch.setattr(urllib.request, "urlopen", forbid_network)

    adversarial_html = b"""<!DOCTYPE html>
    <html>
      <head><title>Test &lt;script&gt;alert(1)&lt;/script&gt;</title></head>
      <body>
        <img src="http://169.254.169.254/latest/meta-data/" onerror="alert(1)" />
        <iframe src="javascript:alert(2)"></iframe>
        <form action="javascript:steal()"><button>Go</button></form>
        <a href="javascript:void(0)">Bad link</a>
        <script>alert('xss'); const ga = 'UA-123456-1';</script>
        <p>Contact suspect: +213 555 0190 &lt;script&gt;evil()&lt;/script&gt;</p>
      </body>
    </html>"""

    m1 = extract_html_mode1_quick(adversarial_html)
    norms = {(c.entity_type, c.normalized_value) for c in m1.candidates}
    assert ("identifiant_infrastructure", "UA-123456-1") in norms
    assert ("telephone", "+2135550190") in norms
    assert all("javascript:" not in c.normalized_value.lower() for c in m1.candidates)
    assert all("169.254.169.254" not in c.normalized_value for c in m1.candidates)
    for cand in m1.candidates:
        assert "<" not in cand.quote_snippet
        assert ">" not in cand.quote_snippet
