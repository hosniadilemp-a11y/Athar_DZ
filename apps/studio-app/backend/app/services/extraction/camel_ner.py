"""Offline Arabic NER integration via CAMeL Tools (CAMeL-Lab/bert-base-arabic-camelbert-mix-ner).

Supports:
1. Local in-process camel-tools NERecognizer when installed in the Python env.
2. Internal HTTP call to the dedicated athar-camel-ner worker container (`CAMEL_NER_URL`),
   which runs Python 3.11 + CPU torch + camel-tools 100% offline using cached wheels.
"""

from __future__ import annotations

import logging
import os
import re
import unicodedata
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

ARABIC_CHAR_RE = re.compile(r"[\u0600-\u06FF]")
ARABIC_PRESENTATION_RE = re.compile(r"[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]")
URL_OR_EMAIL_RE = re.compile(
    r"(?:https?://\S+|\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b)"
)

ARABIC_WILAYA_CANONICAL: dict[str, str] = {
    "الجزائر": "Alger",
    "الجزائر العاصمة": "Alger",
    "وهران": "Oran",
    "البليدة": "Blida",
    "قسنطينة": "Constantine",
    "سطيف": "Setif",
    "عنابة": "Annaba",
    "باتنة": "Batna",
    "تلمسان": "Tlemcen",
    "بجاية": "Bejaia",
    "تيزي وزو": "Tizi Ouzou",
    "بسكرة": "Biskra",
    "ورقلة": "Ouargla",
    "الشلف": "Chlef",
    "تيبازة": "Tipaza",
    "بومرداس": "Boumerdes",
}


@dataclass(frozen=True)
class CamelNerEntity:
    """Single Arabic entity span predicted by CAMeL Tools NERecognizer."""

    entity_type: str
    normalized_value: str
    label: str
    tag: str
    quote_snippet: str
    confidence: float


def normalize_arabic_text(text: str) -> str:
    """Normalize Arabic Presentation Forms (e.g. PyMuPDF/pdfplumber) to standard Unicode."""
    return unicodedata.normalize("NFKC", text or "")


def has_arabic_text(text: str) -> bool:
    """Return True if text contains at least 2 Arabic-script characters after NFKC."""
    norm = normalize_arabic_text(text)
    return (
        len(ARABIC_CHAR_RE.findall(norm)) >= 2
        or len(ARABIC_PRESENTATION_RE.findall(text or "")) >= 2
    )


def resolve_camel_model_dir() -> Path | None:
    """Locate local CAMeL-Lab NER weights on disk without external downloads."""
    settings = get_settings()
    candidates = [
        Path(settings.hf_models_dir) / "CAMeL-Lab__bert-base-arabic-camelbert-mix-ner",
        Path("/app/models/hf/CAMeL-Lab__bert-base-arabic-camelbert-mix-ner"),
    ]
    for path in candidates:
        if path.exists() and (path / "config.json").exists():
            return path
    return None


@lru_cache(maxsize=1)
def _load_camel_recognizer() -> Any | None:
    """Lazily load local in-process CAMeL Tools NERecognizer if installed."""
    model_dir = resolve_camel_model_dir()
    if model_dir is None:
        return None
    try:
        # camel_tools.data.catalogue creates ~/.camel_tools at import time.
        # Fall back to /tmp if HOME (e.g. /home/appuser) is missing or read-only.
        home_dir = Path(os.environ.get("HOME", "/tmp"))
        if not home_dir.exists() or not os.access(home_dir, os.W_OK):
            os.environ["HOME"] = "/tmp"
        camel_data = Path(os.environ.setdefault("CAMELTOOLS_DATA", "/tmp/.camel_tools"))
        camel_data.mkdir(parents=True, exist_ok=True)
        Path(os.environ["HOME"], ".camel_tools").mkdir(parents=True, exist_ok=True)

        import torch
        from camel_tools.ner import NERecognizer

        use_gpu = torch.cuda.is_available()
        rec = NERecognizer(str(model_dir), use_gpu=use_gpu)
        if use_gpu and getattr(rec, "model", None) is not None:
            rec.model.to("cuda")
            rec.model.eval()
        return rec
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to load local CAMeL NER recognizer: %s", exc)
        return None


def get_camel_ner_device() -> str:
    """Return the active torch execution device for CAMeL NER ('cuda:0', 'cpu', Worker, etc.)."""
    rec = _load_camel_recognizer()
    if rec is None:
        return "unavailable"
    model = getattr(rec, "model", None)
    if model is not None and hasattr(model, "parameters"):
        try:
            return str(next(model.parameters()).device)
        except StopIteration:
            return "cuda:0" if getattr(rec, "use_gpu", False) else "cpu"
    return "cuda:0" if getattr(rec, "use_gpu", False) else "cpu"


def _group_bio_entities(tokens: list[str], labels: list[str]) -> list[tuple[str, str]]:
    entities: list[tuple[str, str]] = []
    cur_type: str | None = None
    cur_tokens: list[str] = []

    for tok, lbl in zip(tokens, labels):
        if lbl.startswith("B-"):
            if cur_type and cur_tokens:
                entities.append((cur_type, " ".join(cur_tokens)))
            cur_type = lbl[2:]
            cur_tokens = [tok]
        elif lbl.startswith("I-") and cur_type == lbl[2:]:
            cur_tokens.append(tok)
        else:
            if cur_type and cur_tokens:
                entities.append((cur_type, " ".join(cur_tokens)))
            cur_type = None
            cur_tokens = []

    if cur_type and cur_tokens:
        entities.append((cur_type, " ".join(cur_tokens)))
    return entities


def _map_raw_spans(
    raw_spans: list[dict[str, str]], *, include_locations: bool = False
) -> list[CamelNerEntity]:
    results: list[CamelNerEntity] = []
    seen: set[tuple[str, str]] = set()
    for span in raw_spans:
        tag_type = str(span.get("tag") or "")
        surf = " ".join(str(span.get("surface") or "").split()).strip(".,;:()[]\"'،؛")
        quote = str(span.get("quote") or "")[:180]
        if not surf or not has_arabic_text(surf):
            continue

        if tag_type == "PERS":
            etype, norm, conf, label = "personne", surf, 0.87, surf
        elif tag_type == "ORG":
            etype, norm, conf, label = "entreprise", surf, 0.85, surf
        elif tag_type == "LOC" and include_locations:
            mapped = ARABIC_WILAYA_CANONICAL.get(surf)
            if mapped:
                etype, norm, conf, label = "wilaya_attr", mapped, 0.88, f"{mapped} ({surf})"
            else:
                etype, norm, conf, label = "commune_attr", surf, 0.80, surf
        else:
            continue

        key = (etype, norm.lower())
        if key in seen:
            continue
        seen.add(key)
        results.append(
            CamelNerEntity(
                entity_type=etype,
                normalized_value=norm,
                label=label,
                tag=tag_type,
                quote_snippet=quote,
                confidence=conf,
            )
        )
    return results


@lru_cache(maxsize=64)
def _run_camel_raw_cached(norm_text: str) -> tuple[tuple[str, str, str], ...]:
    """Cached batched CAMeL Tools NER pass over normalized Arabic text."""
    if not has_arabic_text(norm_text):
        return ()

    recognizer = _load_camel_recognizer()
    if recognizer is not None:
        try:
            from camel_tools.tokenizers.word import simple_word_tokenize
            from camel_tools.utils.dediac import dediac_ar

            batch_lines: list[str] = []
            batch_tokens: list[list[str]] = []
            for raw_line in norm_text.splitlines():
                line = raw_line.strip()
                if not line or not has_arabic_text(line):
                    continue
                cleaned_line = URL_OR_EMAIL_RE.sub(" ", line)
                tokens: list[str] = simple_word_tokenize(dediac_ar(cleaned_line))[:256]
                if not tokens:
                    continue
                batch_lines.append(line)
                batch_tokens.append(tokens)

            if not batch_tokens:
                return ()

            batch_labels: list[list[str]] = recognizer.predict(batch_tokens, batch_size=32)
            raw_spans: list[tuple[str, str, str]] = []
            for orig_line, tokens, labels in zip(batch_lines, batch_tokens, batch_labels):
                for tag_type, surface in _group_bio_entities(tokens, labels):
                    raw_spans.append((tag_type, surface, orig_line[:180]))
            return tuple(raw_spans)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Local CAMeL NER failed, falling back to worker: %s", exc)

    worker_url = get_settings().camel_ner_url.rstrip("/")
    if not worker_url:
        return ()
    try:
        with httpx.Client(timeout=20.0) as client:
            res = client.post(f"{worker_url}/ner", json={"text": norm_text})
        if res.status_code == 200:
            payload = res.json()
            spans = payload.get("entities") or []
            if isinstance(spans, list):
                return tuple(
                    (
                        str(s.get("tag") or ""),
                        str(s.get("surface") or ""),
                        str(s.get("quote") or ""),
                    )
                    for s in spans
                    if isinstance(s, dict)
                )
    except Exception as exc:  # noqa: BLE001
        logger.info("CAMeL NER worker unreachable (%s); continuing with static extractors.", exc)
    return ()


def _run_camel_raw(text: str) -> list[dict[str, str]]:
    """Run CAMeL Tools NER and return raw BIO spans."""
    norm_text = normalize_arabic_text(text)
    return [
        {"tag": tag, "surface": surf, "quote": quote}
        for tag, surf, quote in _run_camel_raw_cached(norm_text)
    ]


def extract_camel_ner_entities(text: str) -> list[CamelNerEntity]:
    """Run CAMeL Tools NER on Arabic text (PERS/ORG entities only; LOC stays attribute-only)."""
    return _map_raw_spans(_run_camel_raw(text), include_locations=False)


def extract_camel_ner_locations(text: str) -> dict[str, list[str]]:
    """Extract Arabic LOC spans as wilaya/commune attribute strings (never standalone nodes)."""
    loc_entities = _map_raw_spans(_run_camel_raw(text), include_locations=True)
    wilayas: list[str] = []
    communes: list[str] = []
    for ent in loc_entities:
        if ent.entity_type == "wilaya_attr" and ent.normalized_value not in wilayas:
            wilayas.append(ent.normalized_value)
        elif ent.entity_type == "commune_attr" and ent.normalized_value not in communes:
            communes.append(ent.normalized_value)
    return {"wilayas": wilayas, "communes": communes}
