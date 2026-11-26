"""Benchmark tests verifying static PDF extraction against the 5 ground-truth .md files."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

import pytest

from app.services.extraction.pdf_extractor import (
    extract_mode1_quick,
    extract_mode2_stage,
)


@dataclass(frozen=True)
class GroundTruthEntity:
    entity_type: str
    normalized_value: str
    label: str
    page: int
    min_mode: str


def _resolve_samples_dir() -> Path:
    container_mount = Path("/app/tests/fixtures/pdf_samples")
    if container_mount.exists():
        return container_mount
    repo_dir = (
        Path(__file__).resolve().parents[4]
        / "doc"
        / "examples"
        / "option_b_synthetic_samples"
        / "pdf"
    )
    if repo_dir.exists():
        return repo_dir
    raise FileNotFoundError("Phase 2A synthetic PDF samples directory not found")


META_BULLET_RE = re.compile(r"^-\s+\*\*(\w+)\*\*:\s*`(.*)`$")


def _parse_ground_truth(md_path: Path) -> tuple[dict[str, str], list[GroundTruthEntity]]:
    meta: dict[str, str] = {}
    entities: list[GroundTruthEntity] = []
    for raw_line in md_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        bullet_match = META_BULLET_RE.match(line)
        if bullet_match:
            meta[bullet_match.group(1)] = bullet_match.group(2)
            continue
        if (
            line.startswith("|")
            and not line.startswith("| entity_type")
            and not line.startswith("| :---")
        ):
            parts = [p.strip().strip("`") for p in line.strip("|").split("|")]
            if len(parts) >= 5:
                entities.append(
                    GroundTruthEntity(
                        entity_type=parts[0],
                        normalized_value=parts[1],
                        label=parts[2],
                        page=int(parts[3]),
                        min_mode=parts[4],
                    )
                )
    return meta, entities


SAMPLE_NAMES = [
    "01_pv_plainte_escroquerie",
    "02_facture_societe_ecran",
    "03_releve_bancaire_baridimob",
    "04_rapport_osint_domaine_cyber",
    "05_pv_perquisition_saisie",
]


@pytest.mark.parametrize("sample_stem", SAMPLE_NAMES)
def test_pdf_ground_truth_mode1_and_mode2(sample_stem: str) -> None:
    """Every entity documented in the .md ground truth must be extracted accurately."""
    samples_dir = _resolve_samples_dir()
    pdf_bytes = (samples_dir / f"{sample_stem}.pdf").read_bytes()
    meta_expected, gt_entities = _parse_ground_truth(samples_dir / f"{sample_stem}.md")
    assert len(gt_entities) > 0, f"Parsed 0 ground-truth entities from {sample_stem}.md"

    # Mode 1 (quick)
    m1 = extract_mode1_quick(pdf_bytes)
    assert m1.metadata.page_count == int(meta_expected["pages"])
    assert m1.metadata.embedded_images_count == int(meta_expected["embedded_images"])
    assert m1.metadata.title == meta_expected["title"]

    m1_pairs = {(c.entity_type, c.normalized_value) for c in m1.candidates}
    for gt in gt_entities:
        if gt.min_mode == "quick":
            assert (gt.entity_type, gt.normalized_value) in m1_pairs, (
                f"Mode 1 missed {(gt.entity_type, gt.normalized_value)} in {sample_stem}"
            )

    # Mode 2 (all 3 stages combined)
    m2_all = []
    for stage in (1, 2, 3):
        out = extract_mode2_stage(pdf_bytes, stage=stage)
        m2_all.extend(out.candidates)

    m2_pairs = {(c.entity_type, c.normalized_value) for c in m2_all}
    for gt in gt_entities:
        assert (gt.entity_type, gt.normalized_value) in m2_pairs, (
            f"Mode 2 missed {(gt.entity_type, gt.normalized_value)} in {sample_stem}"
        )

    # Forensic invariant: no candidate may ever be suggested directly into VERIFIED
    for cand in [*m1.candidates, *m2_all]:
        assert cand.suggested_layer != "VERIFIED"


def test_camel_tools_arabic_ner_and_pdfplumber_integration() -> None:
    """Verify CAMeL Tools Arabic NER works offline and integrates with PyMuPDF + pdfplumber."""
    from app.services.extraction.camel_ner import (
        extract_camel_ner_entities,
        resolve_camel_model_dir,
    )

    assert resolve_camel_model_dir() is not None, "CAMeL-Lab local model directory missing"
    arabic_sample = "تقدم المشتكي كريم منصوري ببلاغ في الجزائر ضد شركة أطلس للنقل"
    entities = extract_camel_ner_entities(arabic_sample)
    types_found = {e.entity_type for e in entities}
    assert "personne" in types_found or "wilaya" in types_found, (
        f"Expected Arabic NER entities from CAMeL Tools, got {entities}"
    )

    # Also verify pdfplumber runs on sample 03
    samples_dir = _resolve_samples_dir()
    pdf_bytes = (samples_dir / "03_releve_bancaire_baridimob.pdf").read_bytes()
    s2 = extract_mode2_stage(pdf_bytes, stage=2)
    assert len(s2.candidates) >= 8
    assert s2.summary["camel_ner_available"] is True
