"""Deterministic + CAMeL Arabic NER PDF extraction engine (Phase 2A + 2B).

Integrates three complementary local engines into one unified candidate stream:
1. PyMuPDF (fitz): metadata, embedded images, fast page text.
2. pdfplumber: structured table parsing & layout-aware financial row extraction.
3. CAMeL Tools (CAMeL-Lab/bert-base-arabic-camelbert-mix-ner): offline Arabic NER.
"""

from __future__ import annotations

import io
import logging
import re
import unicodedata
from dataclasses import dataclass, field
from typing import Any

import fitz  # PyMuPDF

from app.services.extraction.camel_ner import get_camel_ner_device, resolve_camel_model_dir
from app.services.extraction.common_extractors import (
    AMOUNT_RE,
    DATE_ISO_RE,
    ExtractedCandidateItem,
    ExtractedRelationItem,
    build_extraction_summary,
    default_non_verified_layer,
    enrich_candidates_with_locations,
    extract_contextual_entities,
    extract_cooccurrence_relations,
    extract_deterministic_identifiers,
    extract_location_attributes,
    fuse_candidates,
    fuse_relations,
)
from app.services.extraction.wikineural_ner import (
    get_wikineural_ner_device,
    resolve_wikineural_model_dir,
)

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PdfMetadataResult:
    """Extracted structural metadata of a PDF document."""

    title: str
    author: str
    subject: str
    creator: str
    producer: str
    creation_date: str
    page_count: int
    is_encrypted: bool
    embedded_images_count: int
    total_text_chars: int
    images_per_page: dict[int, int] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Serialize metadata to JSON-compatible dict."""
        return {
            "title": self.title,
            "author": self.author,
            "subject": self.subject,
            "creator": self.creator,
            "producer": self.producer,
            "creation_date": self.creation_date,
            "page_count": self.page_count,
            "is_encrypted": self.is_encrypted,
            "embedded_images_count": self.embedded_images_count,
            "total_text_chars": self.total_text_chars,
            "images_per_page": {str(k): v for k, v in self.images_per_page.items()},
        }


@dataclass(frozen=True)
class PdfExtractionStageOutput:
    """Result of running Mode 1 or a single Mode 2 stage on PDF bytes."""

    metadata: PdfMetadataResult
    stage_number: int
    candidates: list[ExtractedCandidateItem]
    summary: dict[str, Any]
    relations: list[ExtractedRelationItem] = field(default_factory=list)


def _read_pages(pdf_bytes: bytes) -> tuple[PdfMetadataResult, list[tuple[int, str, int]]]:
    """Open PDF in memory and extract metadata + per-page text and image counts."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    try:
        raw_meta = doc.metadata or {}
        pages: list[tuple[int, str, int]] = []
        images_per_page: dict[int, int] = {}
        total_images = 0
        total_chars = 0

        for idx, page in enumerate(doc, start=1):
            page_text = unicodedata.normalize("NFKC", page.get_text("text") or "")
            img_count = len(page.get_images(full=False))
            images_per_page[idx] = img_count
            total_images += img_count
            total_chars += len(page_text)
            pages.append((idx, page_text, img_count))

        meta = PdfMetadataResult(
            title=str(raw_meta.get("title") or ""),
            author=str(raw_meta.get("author") or ""),
            subject=str(raw_meta.get("subject") or ""),
            creator=str(raw_meta.get("creator") or ""),
            producer=str(raw_meta.get("producer") or ""),
            creation_date=str(raw_meta.get("creationDate") or ""),
            page_count=len(doc),
            is_encrypted=bool(doc.is_encrypted),
            embedded_images_count=total_images,
            total_text_chars=total_chars,
            images_per_page=images_per_page,
        )
        return meta, pages
    finally:
        doc.close()


def extract_pdf_metadata(pdf_bytes: bytes) -> PdfMetadataResult:
    """Extract structural metadata from raw PDF bytes."""
    meta, _ = _read_pages(pdf_bytes)
    return meta


def _extract_pdfplumber_data(
    pdf_bytes: bytes,
    stage_number: int,
) -> tuple[dict[int, str], list[ExtractedCandidateItem], int]:
    """Extract layout text and structured financial table rows via pdfplumber."""
    try:
        import pdfplumber
    except Exception as exc:  # noqa: BLE001
        logger.warning("pdfplumber unavailable, falling back to PyMuPDF only: %s", exc)
        return {}, [], 0

    page_texts: dict[int, str] = {}
    table_candidates: list[ExtractedCandidateItem] = []
    tables_count = 0

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            page_texts[page_num] = unicodedata.normalize("NFKC", page.extract_text() or "")
            tables = page.extract_tables() or []
            for table in tables:
                tables_count += 1
                for row_idx, row in enumerate(table, start=1):
                    cells = [
                        unicodedata.normalize("NFKC", " ".join((c or "").split()))
                        for c in row
                        if c and str(c).strip()
                    ]
                    if not cells:
                        continue
                    row_line = " | ".join(cells)
                    date_match = DATE_ISO_RE.search(row_line)
                    tx_date = date_match.group(1) if date_match else None
                    for m in AMOUNT_RE.finditer(row_line):
                        digits = re.sub(r"[\s\u00a0]", "", m.group(1))
                        currency = m.group(2).upper()
                        norm = f"{digits} {currency}"
                        attrs: dict[str, Any] = {
                            "montant": int(digits),
                            "devise": currency,
                            "table_row": cells,
                            "table_row_index": row_idx,
                        }
                        if tx_date:
                            attrs["date_operation"] = tx_date
                        table_candidates.append(
                            ExtractedCandidateItem(
                                entity_type="transaction_financiere",
                                suggested_layer=default_non_verified_layer("transaction_financiere"),
                                label=norm,
                                normalized_value=norm,
                                attributes=attrs,
                                confidence=0.93,
                                extractor_tool="pdfplumber-table-parser",
                                stage_number=stage_number,
                                source_page=page_num,
                                quote_snippet=row_line[:180],
                                source_locator=f"page:{page_num}:table#row:{row_idx}",
                            )
                        )
    return page_texts, table_candidates, tables_count


def _pages_to_segments(pages: list[tuple[int, str, int]]) -> list[tuple[int, str, str]]:
    return [(page_num, f"page:{page_num}", text) for page_num, text, _ in pages]


def _merge_pymupdf_and_plumber_pages(
    pages: list[tuple[int, str, int]],
    plumber_texts: dict[int, str],
) -> list[tuple[int, str, int]]:
    """Combine PyMuPDF page text with pdfplumber layout text when distinct."""
    combined: list[tuple[int, str, int]] = []
    for page_num, fitz_text, img_count in pages:
        p_text = plumber_texts.get(page_num, "")
        if p_text and p_text.strip() != fitz_text.strip():
            merged_text = f"{fitz_text}\n{p_text}"
        else:
            merged_text = fitz_text
        combined.append((page_num, merged_text, img_count))
    return combined


def _extract_pdf_structural_relations(
    candidates: list[ExtractedCandidateItem],
    segments: list[tuple[int, str, str]],
    stage_number: int,
) -> list[ExtractedRelationItem]:
    """Infer page-level cyber & financial structural relations on PDF documents."""
    rels = extract_cooccurrence_relations(segments, candidates, stage_number)
    by_page_type: dict[tuple[int, str], list[ExtractedCandidateItem]] = {}
    for c in candidates:
        by_page_type.setdefault((c.source_page, c.entity_type), []).append(c)

    for page_num, _loc, text in segments:
        sites = by_page_type.get((page_num, "site_web"), [])
        emails = by_page_type.get((page_num, "adresse_email"), [])
        banks = by_page_type.get((page_num, "compte_bancaire"), [])
        txs = by_page_type.get((page_num, "transaction_financiere"), [])
        phones = by_page_type.get((page_num, "telephone"), [])

        for s in sites:
            for e in emails:
                rels.append(
                    ExtractedRelationItem(
                        relation_type="UTILISE_EMAIL",
                        source_entity_type=s.entity_type,
                        source_normalized_value=s.normalized_value,
                        target_entity_type=e.entity_type,
                        target_normalized_value=e.normalized_value,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.82,
                        extractor_tool="pdf-page-cooccurrence",
                        stage_number=stage_number,
                        source_page=page_num,
                        quote_snippet=f"{s.label} <-> {e.label}"[:180],
                        source_locator=f"page:{page_num}",
                    )
                )
        low_text = unicodedata.normalize("NFKC", text).lower()
        has_stmt_cue = any(
            k in low_text
            for k in ("releve", "relevé", "solde", "كشف حساب", "رصيد", "statement", "balance")
        )
        has_single_bank_cue = len(banks) == 1 and any(
            k in low_text
            for k in (
                "virement", "prejudice", "préjudice", "acompte",
                "تحويل", "مبلغ", "transfer", "wire", "fraud", "damages", "deposit",
            )
        )
        if len(banks) >= 1 and txs and (has_stmt_cue or has_single_bank_cue):
            primary_bank = banks[0]
            for tx in txs:
                rels.append(
                    ExtractedRelationItem(
                        relation_type="IMPLIQUE_TRANSACTION",
                        source_entity_type=primary_bank.entity_type,
                        source_normalized_value=primary_bank.normalized_value,
                        target_entity_type=tx.entity_type,
                        target_normalized_value=tx.normalized_value,
                        suggested_layer="FLOWS",
                        attributes={},
                        confidence=0.88,
                        extractor_tool="pdf-statement-table",
                        stage_number=stage_number,
                        source_page=page_num,
                        quote_snippet=tx.quote_snippet,
                        source_locator=tx.source_locator or f"page:{page_num}",
                    )
                )
        if "otp" in text.lower() and phones and banks:
            for ph in phones:
                if "otp" in ph.quote_snippet.lower():
                    rels.append(
                        ExtractedRelationItem(
                            relation_type="RECOIT_OTP_BARIDIMOB",
                            source_entity_type=ph.entity_type,
                            source_normalized_value=ph.normalized_value,
                            target_entity_type=banks[0].entity_type,
                            target_normalized_value=banks[0].normalized_value,
                            suggested_layer="FLOWS",
                            attributes={},
                            confidence=0.88,
                            extractor_tool="pdf-otp-context",
                            stage_number=stage_number,
                            source_page=page_num,
                            quote_snippet=ph.quote_snippet,
                            source_locator=f"page:{page_num}",
                        )
                    )

    return fuse_relations(rels)


def extract_mode1_quick(pdf_bytes: bytes) -> PdfExtractionStageOutput:
    """Mode 1 (Analyse Rapide): PyMuPDF metadata + fast deterministic identifier regexes."""
    meta, pages = _read_pages(pdf_bytes)
    segments = _pages_to_segments(pages)
    locations, per_page_locs = extract_location_attributes(segments)
    raw_candidates = extract_deterministic_identifiers(
        segments=segments,
        stage_number=1,
        include_transactions=False,
    )
    candidates = enrich_candidates_with_locations(fuse_candidates(raw_candidates), per_page_locs)
    relations = _extract_pdf_structural_relations(candidates, segments, stage_number=1)
    return PdfExtractionStageOutput(
        metadata=meta,
        stage_number=1,
        candidates=candidates,
        relations=relations,
        summary=build_extraction_summary(
            mode="quick",
            stage=None,
            candidates=candidates,
            relations=relations,
            locations=locations,
            extra={
                "pages": meta.page_count,
                "embedded_images": meta.embedded_images_count,
                "camel_ner_device": get_camel_ner_device(),
                "wikineural_ner_device": get_wikineural_ner_device(),
            },
        ),
    )


def extract_mode2_stage(pdf_bytes: bytes, stage: int) -> PdfExtractionStageOutput:
    """Mode 2: Stage 1 PyMuPDF meta/images, Stage 2 PyMuPDF+pdfplumber, Stage 3 Rules+CAMeL."""
    if stage not in {1, 2, 3}:
        raise ValueError(f"Unsupported Mode 2 stage: {stage} (expected 1, 2, or 3)")

    meta, pages = _read_pages(pdf_bytes)
    candidates: list[ExtractedCandidateItem] = []
    relations: list[ExtractedRelationItem] = []
    tables_count = 0
    locations: dict[str, list[str]] = {"wilayas": [], "communes": []}

    if stage == 1:
        for page_num, _, img_count in pages:
            for img_idx in range(1, img_count + 1):
                norm = f"embedded_image_p{page_num}_{img_idx}"
                candidates.append(
                    ExtractedCandidateItem(
                        entity_type="image_preuve",
                        suggested_layer=default_non_verified_layer("image_preuve"),
                        label=f"Image integree p.{page_num} #{img_idx}",
                        normalized_value=norm,
                        attributes={"source_page": page_num, "image_index": img_idx},
                        confidence=0.98,
                        extractor_tool="pymupdf-image-inventory",
                        stage_number=1,
                        source_page=page_num,
                        quote_snippet=f"Image embarquee #{img_idx} detectee page {page_num}",
                        source_locator=f"page:{page_num}:img#{img_idx}",
                    )
                )
    elif stage == 2:
        plumber_texts, table_cands, tables_count = _extract_pdfplumber_data(
            pdf_bytes, stage_number=2
        )
        unified_pages = _merge_pymupdf_and_plumber_pages(pages, plumber_texts)
        segments = _pages_to_segments(unified_pages)
        locations, per_page_locs = extract_location_attributes(segments)
        id_cands = extract_deterministic_identifiers(
            segments=segments,
            stage_number=2,
            include_transactions=True,
        )
        candidates = enrich_candidates_with_locations(
            fuse_candidates([*table_cands, *id_cands]), per_page_locs
        )
        relations = _extract_pdf_structural_relations(candidates, segments, stage_number=2)
    else:
        plumber_texts, _, tables_count = _extract_pdfplumber_data(pdf_bytes, stage_number=3)
        unified_pages = _merge_pymupdf_and_plumber_pages(pages, plumber_texts)
        segments = _pages_to_segments(unified_pages)
        locations, per_page_locs = extract_location_attributes(segments)
        stage3_entities = enrich_candidates_with_locations(
            fuse_candidates(extract_contextual_entities(segments=segments, stage_number=3)),
            per_page_locs,
        )
        candidates = stage3_entities
        prior_entities = fuse_candidates(
            extract_deterministic_identifiers(
                segments=segments,
                stage_number=2,
                include_transactions=True,
            )
        )
        all_entities = fuse_candidates([*prior_entities, *stage3_entities])
        relations = _extract_pdf_structural_relations(all_entities, segments, stage_number=3)

    return PdfExtractionStageOutput(
        metadata=meta,
        stage_number=stage,
        candidates=candidates,
        relations=relations,
        summary=build_extraction_summary(
            mode="step_by_step",
            stage=stage,
            candidates=candidates,
            relations=relations,
            locations=locations,
            extra={
                "pages": meta.page_count,
                "embedded_images": meta.embedded_images_count,
                "pdfplumber_tables": tables_count,
                "camel_ner_available": resolve_camel_model_dir() is not None,
                "camel_ner_device": get_camel_ner_device(),
                "wikineural_ner_available": resolve_wikineural_model_dir() is not None,
                "wikineural_ner_device": get_wikineural_ner_device(),
            },
        ),
    )


__all__ = [
    "ExtractedCandidateItem",
    "PdfExtractionStageOutput",
    "PdfMetadataResult",
    "extract_mode1_quick",
    "extract_mode2_stage",
    "extract_pdf_metadata",
]
