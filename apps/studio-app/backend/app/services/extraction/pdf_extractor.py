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
from dataclasses import dataclass, field
from typing import Any

import fitz  # PyMuPDF

from app.services.extraction.camel_ner import resolve_camel_model_dir
from app.services.extraction.common_extractors import (
    AMOUNT_RE,
    DATE_ISO_RE,
    ExtractedCandidateItem,
    build_extraction_summary,
    default_non_verified_layer,
    extract_contextual_entities,
    extract_deterministic_identifiers,
    fuse_candidates,
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
            page_text = page.get_text("text") or ""
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
            page_texts[page_num] = page.extract_text() or ""
            tables = page.extract_tables() or []
            for table in tables:
                tables_count += 1
                for row_idx, row in enumerate(table, start=1):
                    cells = [" ".join((c or "").split()) for c in row if c and str(c).strip()]
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


def extract_mode1_quick(pdf_bytes: bytes) -> PdfExtractionStageOutput:
    """Mode 1 (Analyse Rapide): PyMuPDF metadata + fast deterministic identifier regexes."""
    meta, pages = _read_pages(pdf_bytes)
    raw_candidates = extract_deterministic_identifiers(
        segments=_pages_to_segments(pages),
        stage_number=1,
        include_transactions=False,
    )
    candidates = fuse_candidates(raw_candidates)
    return PdfExtractionStageOutput(
        metadata=meta,
        stage_number=1,
        candidates=candidates,
        summary=build_extraction_summary(
            mode="quick",
            stage=None,
            candidates=candidates,
            extra={
                "pages": meta.page_count,
                "embedded_images": meta.embedded_images_count,
            },
        ),
    )


def extract_mode2_stage(pdf_bytes: bytes, stage: int) -> PdfExtractionStageOutput:
    """Mode 2: Stage 1 PyMuPDF meta/images, Stage 2 PyMuPDF+pdfplumber, Stage 3 Rules+CAMeL."""
    if stage not in {1, 2, 3}:
        raise ValueError(f"Unsupported Mode 2 stage: {stage} (expected 1, 2, or 3)")

    meta, pages = _read_pages(pdf_bytes)
    candidates: list[ExtractedCandidateItem] = []
    tables_count = 0

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
        id_cands = extract_deterministic_identifiers(
            segments=_pages_to_segments(unified_pages),
            stage_number=2,
            include_transactions=True,
        )
        candidates = fuse_candidates([*table_cands, *id_cands])
    else:
        plumber_texts, _, tables_count = _extract_pdfplumber_data(pdf_bytes, stage_number=3)
        unified_pages = _merge_pymupdf_and_plumber_pages(pages, plumber_texts)
        candidates = fuse_candidates(
            extract_contextual_entities(segments=_pages_to_segments(unified_pages), stage_number=3)
        )

    return PdfExtractionStageOutput(
        metadata=meta,
        stage_number=stage,
        candidates=candidates,
        summary=build_extraction_summary(
            mode="step_by_step",
            stage=stage,
            candidates=candidates,
            extra={
                "pages": meta.page_count,
                "embedded_images": meta.embedded_images_count,
                "pdfplumber_tables": tables_count,
                "camel_ner_available": resolve_camel_model_dir() is not None,
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
