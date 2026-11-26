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


@dataclass(frozen=True)
class GroundTruthRelation:
    relation_type: str
    source_type: str
    source_value: str
    target_type: str
    target_value: str
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


def _parse_ground_truth(
    md_path: Path,
) -> tuple[dict[str, str], list[GroundTruthEntity], list[GroundTruthRelation]]:
    meta: dict[str, str] = {}
    entities: list[GroundTruthEntity] = []
    relations: list[GroundTruthRelation] = []
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
                    GroundTruthRelation(
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
                    GroundTruthEntity(
                        entity_type=parts[0],
                        normalized_value=parts[1],
                        label=parts[2],
                        page=int(parts[3]),
                        min_mode=parts[4],
                    )
                )
    return meta, entities, relations


SAMPLE_NAMES = [
    "01_pv_plainte_escroquerie",
    "02_facture_societe_ecran",
    "03_releve_bancaire_baridimob",
    "04_rapport_osint_domaine_cyber",
    "05_pv_perquisition_saisie",
]


@pytest.mark.parametrize("sample_stem", SAMPLE_NAMES)
def test_pdf_ground_truth_mode1_and_mode2(sample_stem: str) -> None:
    """Every entity and semantic relation documented in the .md ground truth must be extracted."""
    samples_dir = _resolve_samples_dir()
    pdf_bytes = (samples_dir / f"{sample_stem}.pdf").read_bytes()
    meta_expected, gt_entities, gt_relations = _parse_ground_truth(
        samples_dir / f"{sample_stem}.md"
    )
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

    # Mode 2 (all 3 stages combined)
    m2_all = []
    m2_rels = []
    last_summary: dict = {}
    for stage in (1, 2, 3):
        out = extract_mode2_stage(pdf_bytes, stage=stage)
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

    # D18: Locations are attribute-only, never standalone entity nodes
    for cand in [*m1.candidates, *m2_all]:
        assert cand.entity_type not in {"wilaya", "commune"}
        assert cand.suggested_layer != "VERIFIED"

    expected_locs = {
        loc.strip()
        for loc in meta_expected.get("locations", "").split(";")
        if loc.strip()
    }
    extracted_locs = last_summary.get("extracted_locations", {})
    found_locs = set(extracted_locs.get("wilayas", [])) | set(
        extracted_locs.get("communes", [])
    )
    assert expected_locs.issubset(found_locs), (
        f"Missing expected locations {expected_locs - found_locs} in {sample_stem}"
    )


def test_camel_tools_arabic_ner_and_pdfplumber_integration() -> None:
    """Verify CAMeL Tools Arabic NER works offline and integrates with PyMuPDF + pdfplumber."""
    from app.services.extraction.camel_ner import (
        extract_camel_ner_entities,
        extract_camel_ner_locations,
        resolve_camel_model_dir,
    )

    assert resolve_camel_model_dir() is not None, "CAMeL-Lab local model directory missing"
    arabic_sample = "تقدم المشتكي كريم منصوري ببلاغ في الجزائر ضد شركة أطلس للنقل"
    entities = extract_camel_ner_entities(arabic_sample)
    types_found = {e.entity_type for e in entities}
    assert "personne" in types_found or "entreprise" in types_found, (
        f"Expected Arabic NER entities from CAMeL Tools, got {entities}"
    )
    assert "wilaya" not in types_found and "commune" not in types_found
    locs = extract_camel_ner_locations(arabic_sample)
    assert "Alger" in locs["wilayas"]

    # Also verify pdfplumber runs on sample 03
    samples_dir = _resolve_samples_dir()
    pdf_bytes = (samples_dir / "03_releve_bancaire_baridimob.pdf").read_bytes()
    s2 = extract_mode2_stage(pdf_bytes, stage=2)
    assert len(s2.candidates) >= 8
    assert s2.summary["camel_ner_available"] is True


def test_camel_gpu_and_arabic_entity_relation_linking(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Verify CAMeL NER runs on GPU (when CUDA is present), normalizes Arabic & links entities."""
    import torch

    from app.services.extraction.camel_ner import (
        _load_camel_recognizer,
        extract_camel_ner_entities,
        get_camel_ner_device,
        resolve_camel_model_dir,
    )
    from app.services.extraction.html_extractor import extract_html_mode2_stage
    from app.services.extraction.pdf_extractor import PdfMetadataResult

    assert resolve_camel_model_dir() is not None
    device_str = get_camel_ner_device()
    if torch.cuda.is_available():
        assert device_str.startswith("cuda"), f"Expected CAMeL model on CUDA, got {device_str}"
        rec = _load_camel_recognizer()
        assert rec is not None
        assert next(rec.model.parameters()).device.type == "cuda"

    # Arabic Presentation Forms (often emitted by PDF fonts) must normalize cleanly
    pres_forms = "ﺗﻘﺪﻡ ﺍﻟﻤﺸﺘﻜﻲ ﻛﺮﻳﻢ ﻣﻨﺼﻮﺭﻱ"
    nf_ents = extract_camel_ner_entities(pres_forms)
    assert ("personne", "كريم منصوري") in {
        (e.entity_type, e.normalized_value) for e in nf_ents
    }

    arabic_lines = [
        "محضر شكوى رقم 2026-01 - ولاية الجزائر - بلدية القبة",
        "تقدم المشتكي كريم منصوري الهاتف +213 555 0101 البريد karim.ar@example.com",
        "ضد المشتبه فيه ياسين بن علي المسير في شركة أطلس للاستيراد",
        "حساب بريدي موب RIP 00799999001234567890 بمبلغ 185000 DZD",
        "المركبة المستعملة 04821-116-16 لصاحبها ياسين بن علي",
    ]
    arabic_html = (
        '<!DOCTYPE html><html lang="ar"><head><meta charset="utf-8">'
        "<title>محضر</title></head><body>"
        + "".join(f"<p>{ln}</p>" for ln in arabic_lines)
        + "</body></html>"
    ).encode("utf-8")

    h3 = extract_html_mode2_stage(arabic_html, stage=3)
    assert h3.summary["camel_ner_device"] == device_str
    h3_pairs = {(c.entity_type, c.normalized_value) for c in h3.candidates}
    assert ("personne", "كريم منصوري") in h3_pairs
    assert ("personne", "ياسين بن علي") in h3_pairs
    assert ("entreprise", "أطلس للاستيراد") in h3_pairs
    assert ("entreprise", "example") not in h3_pairs
    assert not any(c.entity_type in {"wilaya", "commune"} for c in h3.candidates)
    locs = h3.summary.get("extracted_locations", {})
    assert "Alger" in locs.get("wilayas", [])
    assert "القبة" in locs.get("communes", [])

    h3_rels = {
        (
            r.relation_type,
            r.source_entity_type,
            r.source_normalized_value,
            r.target_entity_type,
            r.target_normalized_value,
        )
        for r in h3.relations
    }
    expected_ar_rels = {
        ("UTILISE_TELEPHONE", "personne", "كريم منصوري", "telephone", "+2135550101"),
        ("UTILISE_EMAIL", "personne", "كريم منصوري", "adresse_email", "karim.ar@example.com"),
        ("DIRIGE_ENTREPRISE", "personne", "ياسين بن علي", "entreprise", "أطلس للاستيراد"),
        ("PROPRIETAIRE_VEHICULE", "personne", "ياسين بن علي", "vehicule", "04821-116-16"),
        (
            "IMPLIQUE_TRANSACTION",
            "compte_bancaire",
            "00799999001234567890",
            "transaction_financiere",
            "185000 DZD",
        ),
    }
    assert expected_ar_rels.issubset(h3_rels)
    assert (
        "UTILISE_EMAIL",
        "entreprise",
        "أطلس للاستيراد",
        "adresse_email",
        "karim.ar@example.com",
    ) not in h3_rels

    # Verify PDF Stage 3 path emits the same CAMeL Arabic entities & linked relations
    ar_pdf_text = "\n".join(arabic_lines)
    fake_meta = PdfMetadataResult(
        title="محضر شكوى",
        author="OPJ",
        subject="Arabic Test",
        creator="Test",
        producer="Test",
        creation_date="",
        page_count=1,
        is_encrypted=False,
        embedded_images_count=0,
        total_text_chars=len(ar_pdf_text),
        images_per_page={1: 0},
    )
    monkeypatch.setattr(
        "app.services.extraction.pdf_extractor._read_pages",
        lambda _b: (fake_meta, [(1, ar_pdf_text, 0)]),
    )
    monkeypatch.setattr(
        "app.services.extraction.pdf_extractor._extract_pdfplumber_data",
        lambda _b, stage_number: ({1: ar_pdf_text}, [], 0),
    )
    p3 = extract_mode2_stage(b"%PDF-1.4\n", stage=3)
    assert p3.summary["camel_ner_device"] == device_str
    p3_pairs = {(c.entity_type, c.normalized_value) for c in p3.candidates}
    assert ("personne", "كريم منصوري") in p3_pairs
    assert ("personne", "ياسين بن علي") in p3_pairs
    assert ("entreprise", "أطلس للاستيراد") in p3_pairs
    p3_rels = {
        (
            r.relation_type,
            r.source_entity_type,
            r.source_normalized_value,
            r.target_entity_type,
            r.target_normalized_value,
        )
        for r in p3.relations
    }
    assert expected_ar_rels.issubset(p3_rels)


def test_wikineural_gpu_multilingual_ner_and_section6_fixes() -> None:
    """Verify WikiNEuRal runs on GPU (FR/EN/Latin) and validates Section 6 relation fixes."""
    import torch

    from app.services.extraction.wikineural_ner import (
        extract_wikineural_ner_entities,
        get_wikineural_ner_device,
        resolve_wikineural_model_dir,
    )

    assert resolve_wikineural_model_dir() is not None
    wiki_device = get_wikineural_ner_device()
    if torch.cuda.is_available():
        assert wiki_device.startswith("cuda"), f"Expected WikiNEuRal on CUDA, got {wiki_device}"

    # Free-form French & English prose (no regex role prefixes!)
    fr_en_text = (
        "Karim Mansouri has contacted John Smith at Acme Global Logistics regarding the case.\n"
        "Selon nos sources, Amel Haddad travaille aussi avec Nabil Khelifi.\n"
        "Localisation: Kouba, Alger."
    )
    wiki_ents = extract_wikineural_ner_entities(fr_en_text)
    wiki_pairs = {(e.entity_type, e.normalized_value) for e in wiki_ents}
    assert ("personne", "Karim Mansouri") in wiki_pairs
    assert ("personne", "John Smith") in wiki_pairs
    assert ("entreprise", "Acme Global Logistics") in wiki_pairs
    assert ("personne", "Amel Haddad") in wiki_pairs
    assert ("personne", "Nabil Khelifi") in wiki_pairs
    assert all(e.entity_type not in {"wilaya", "commune"} for e in wiki_ents)

    samples_dir = _resolve_samples_dir()

    # PDF 1: unified RIP+CCP, zero bogus self-transfer, role-anchored links recovered
    pdf1_bytes = (samples_dir / "01_pv_plainte_escroquerie.pdf").read_bytes()
    p1_m1 = extract_mode1_quick(pdf1_bytes)
    assert p1_m1.summary["wikineural_ner_device"] == wiki_device
    p1_banks = [c for c in p1_m1.candidates if c.entity_type == "compte_bancaire"]
    assert len(p1_banks) == 1
    assert p1_banks[0].normalized_value == "00799999001234567890"
    assert p1_banks[0].attributes.get("ccp") == "0012345678"
    assert not any(r.relation_type == "EFFECTUE_VIREMENT_VERS" for r in p1_m1.relations)

    p1_s3 = extract_mode2_stage(pdf1_bytes, stage=3)
    assert p1_s3.summary["wikineural_ner_available"] is True
    p1_s3_rels = {
        (
            r.relation_type,
            r.source_entity_type,
            r.source_normalized_value,
            r.target_entity_type,
            r.target_normalized_value,
        )
        for r in p1_s3.relations
    }
    assert ("UTILISE_TELEPHONE", "personne", "Karim Mansouri", "telephone", "+2135550101") in (
        p1_s3_rels
    )
    assert ("UTILISE_TELEPHONE", "personne", "Yacine Benali", "telephone", "+213661550102") in (
        p1_s3_rels
    )
    assert (
        "DETIENT_COMPTE_BANCAIRE",
        "personne",
        "Yacine Benali",
        "compte_bancaire",
        "00799999001234567890",
    ) in p1_s3_rels
    assert (
        "IMPLIQUE_TRANSACTION",
        "compte_bancaire",
        "00799999001234567890",
        "transaction_financiere",
        "185000 DZD",
    ) in p1_s3_rels

    # PDF 3: true bilateral statement transfer carries montant_dzd & date_operation attrs
    pdf3_bytes = (samples_dir / "03_releve_bancaire_baridimob.pdf").read_bytes()
    p3_m1 = extract_mode1_quick(pdf3_bytes)
    virement = next(
        r
        for r in p3_m1.relations
        if r.relation_type == "EFFECTUE_VIREMENT_VERS"
        and r.source_normalized_value == "00799999004455667788"
        and r.target_normalized_value == "00799999001122334455"
    )
    assert virement.attributes.get("montant_dzd") == 95000
    assert virement.attributes.get("date_operation") == "2026-10-12"
    assert virement.attributes.get("canal") == "BaridiMob"
