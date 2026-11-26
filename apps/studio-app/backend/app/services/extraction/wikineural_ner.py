"""Offline multilingual NER integration via Babelscape/wikineural-multilingual-ner.

Runs strictly offline using cached HuggingFace weights in `HF_MODELS_DIR` and accelerates
batched inference on CUDA GPU (`float16`) when available alongside CAMeL Tools (Arabic).
Supports French, English, Spanish, Italian, German, and other Latin-script documents.
"""

from __future__ import annotations

import logging
import re
import unicodedata
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.config import get_settings

logger = logging.getLogger(__name__)

LATIN_LETTER_RE = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]")
MASK_SENSITIVE_TOKENS_RE = re.compile(
    r"(?:https?://\S+"
    r"|\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b"
    r"|(?<!\d)00799999\d{12}(?!\d)"
    r"|\b\d{5}[\s\-]\d{3}[\s\-]\d{2}\b)"
)
LOC_PREFIX_RE = re.compile(
    r"^(?:Wilaya\s+d['’\s]*|Commune\s+d[e'’\s]*|Da[iï]ra\s+d[e'’\s]*)",
    re.IGNORECASE,
)

PERSON_STOPWORDS: frozenset[str] = frozenset(
    {
        "courriel", "telephone", "téléphone", "montant", "beneficiaire", "bénéficiaire",
        "plaignant", "suspect", "gerant", "gérant", "directeur", "directrice", "client",
        "total", "virement", "facture", "compte", "adresse", "email", "contact",
        "vehicule", "véhicule", "smartphone", "releve", "relevé", "document",
        "prejudice", "préjudice", "acompte", "titulaire", "temoin", "témoin",
        "complainant", "victim", "director", "manager", "holder", "beneficiary",
        "witness", "address", "reference", "statement", "phone", "mobile",
    }
)

NON_COMPANY_ORG_KEYWORDS: tuple[str, ...] = (
    "brigade", "gendarmerie", "police", "tribunal", "parquet", "surete", "sûreté",
    "wilaya", "commune", "baridimob", "algerie poste", "algérie poste", "ccp",
    "telegram", "whatsapp", "facebook", "instagram", "google", "meta pixel",
    "yandex", "bitcoin", "tether", "tron", "whois", "cdn", "opj", "cellule",
    "section economique", "centre national", "prestations",
)

NON_LOCATION_WORDS: frozenset[str] = frozenset(
    {"montant", "total", "date", "page", "prix", "somme", "virement", "post", "http", "https"}
)


@dataclass(frozen=True)
class WikiNeuralEntity:
    """Single entity span predicted by Babelscape/wikineural-multilingual-ner."""

    entity_type: str
    normalized_value: str
    label: str
    tag: str
    quote_snippet: str
    confidence: float


def has_latin_text(text: str) -> bool:
    """Return True if text contains at least 2 Latin-script letters."""
    return len(LATIN_LETTER_RE.findall(text or "")) >= 2


def resolve_wikineural_model_dir() -> Path | None:
    """Locate local WikiNEuRal multilingual NER weights without network downloads."""
    settings = get_settings()
    candidates = [
        Path(settings.hf_models_dir) / "Babelscape__wikineural-multilingual-ner",
        Path("/app/models/hf/Babelscape__wikineural-multilingual-ner"),
    ]
    for path in candidates:
        if path.exists() and (path / "config.json").exists():
            return path
    return None


@lru_cache(maxsize=1)
def _load_wikineural_pipeline() -> Any | None:
    """Lazily load WikiNEuRal HuggingFace pipeline on CUDA GPU (fp16) or CPU."""
    model_dir = resolve_wikineural_model_dir()
    if model_dir is None:
        return None
    try:
        import torch
        from transformers import (
            AutoModelForTokenClassification,
            AutoTokenizer,
            pipeline,
        )

        use_gpu = torch.cuda.is_available()
        dtype = torch.float16 if use_gpu else torch.float32
        tokenizer = AutoTokenizer.from_pretrained(str(model_dir), local_files_only=True)
        model = AutoModelForTokenClassification.from_pretrained(
            str(model_dir),
            local_files_only=True,
            dtype=dtype,
        )
        if use_gpu:
            model = model.to("cuda")
        model.eval()
        pipe_factory: Any = pipeline
        return pipe_factory(
            "token-classification",
            model=model,
            tokenizer=tokenizer,
            aggregation_strategy="simple",
            device=0 if use_gpu else -1,
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to load local WikiNEuRal NER pipeline: %s", exc)
        return None


def get_wikineural_ner_device() -> str:
    """Return active execution device for WikiNEuRal ('cuda:0', 'cpu', or 'unavailable')."""
    ner_pipe = _load_wikineural_pipeline()
    if ner_pipe is None:
        return "unavailable"
    model = getattr(ner_pipe, "model", None)
    if model is not None and hasattr(model, "parameters"):
        try:
            return str(next(model.parameters()).device)
        except StopIteration:
            pass
    return "cpu"


def _clean_surface(raw: str) -> str:
    surf = " ".join(unicodedata.normalize("NFKC", raw).split())
    surf = re.split(r"\s+[—–|]\s+", surf)[0]
    surf = re.sub(r"\s*['’]\s*", "'", surf)
    surf = re.sub(r"\s*-\s*", "-", surf)
    return surf.strip(".,;:()[]\"'«» ")


@lru_cache(maxsize=64)
def _run_wikineural_raw_cached(norm_text: str) -> tuple[tuple[str, str, str, float], ...]:
    """Run one batched GPU NER pass over Latin-script lines in normalized text."""
    if not has_latin_text(norm_text):
        return ()

    ner_pipe = _load_wikineural_pipeline()
    if ner_pipe is None:
        return ()

    batch_orig: list[str] = []
    batch_clean: list[str] = []
    for raw_line in norm_text.splitlines():
        line = raw_line.strip()
        if not line or not has_latin_text(line):
            continue
        cleaned = " ".join(MASK_SENSITIVE_TOKENS_RE.sub(" ", line).split())
        if not has_latin_text(cleaned):
            continue
        batch_orig.append(line)
        batch_clean.append(cleaned[:512])

    if not batch_clean:
        return ()

    try:
        predictions = ner_pipe(batch_clean, batch_size=32)
        # transformers pipeline returns list[dict] when len == 1 unless list passed; normalize shape
        if predictions and isinstance(predictions[0], dict):
            predictions = [predictions]
    except Exception as exc:  # noqa: BLE001
        logger.warning("WikiNEuRal batched inference failed: %s", exc)
        return ()

    raw_spans: list[tuple[str, str, str, float]] = []
    for orig_line, spans in zip(batch_orig, predictions):
        if not isinstance(spans, list):
            continue
        for ent in spans:
            if not isinstance(ent, dict):
                continue
            tag = str(ent.get("entity_group") or "")
            word = str(ent.get("word") or "")
            score = float(ent.get("score") or 0.0)
            raw_spans.append((tag, word, orig_line[:180], score))
    return tuple(raw_spans)


def _map_raw_spans(
    raw_spans: tuple[tuple[str, str, str, float], ...],
    *,
    include_locations: bool = False,
) -> list[WikiNeuralEntity]:
    results: list[WikiNeuralEntity] = []
    seen: set[tuple[str, str]] = set()

    for tag, word, quote, score in raw_spans:
        if score < 0.75 or word.strip().startswith("##"):
            continue
        surf = _clean_surface(word)
        if len(surf) < 3 or not has_latin_text(surf):
            continue
        if surf.isupper() and len(surf.split()) >= 2:
            continue

        low = surf.lower()
        tokens_low = [t.strip(".,;:()") for t in low.split()]

        if tag == "PER":
            if len(tokens_low) < 2:
                continue
            if low in PERSON_STOPWORDS or any(tok in PERSON_STOPWORDS for tok in tokens_low):
                continue
            etype, norm, conf, label = "personne", surf, min(0.95, round(score, 3)), surf
        elif tag == "ORG":
            if any(kw in low for kw in NON_COMPANY_ORG_KEYWORDS):
                continue
            if len(surf) < 4:
                continue
            etype, norm, conf, label = "entreprise", surf, min(0.92, round(score, 3)), surf
        elif tag == "LOC" and include_locations:
            loc_clean = LOC_PREFIX_RE.sub("", surf).strip()
            if len(loc_clean) < 3 or loc_clean.lower() in NON_LOCATION_WORDS:
                continue
            etype, norm, conf, label = "loc_attr", loc_clean, min(0.94, round(score, 3)), loc_clean
        else:
            continue

        key = (etype, norm.lower())
        if key in seen:
            continue
        seen.add(key)
        results.append(
            WikiNeuralEntity(
                entity_type=etype,
                normalized_value=norm,
                label=label,
                tag=tag,
                quote_snippet=quote,
                confidence=conf,
            )
        )
    return results


def extract_wikineural_ner_entities(text: str) -> list[WikiNeuralEntity]:
    """Extract French/English/multilingual PER/ORG entities via WikiNEuRal on GPU."""
    norm_text = unicodedata.normalize("NFKC", text or "")
    return _map_raw_spans(_run_wikineural_raw_cached(norm_text), include_locations=False)


def extract_wikineural_ner_locations(text: str) -> list[str]:
    """Extract Latin-script LOC spans as strings (never standalone graph nodes per D18)."""
    norm_text = unicodedata.normalize("NFKC", text or "")
    locs = _map_raw_spans(_run_wikineural_raw_cached(norm_text), include_locations=True)
    return [item.normalized_value for item in locs]


__all__ = [
    "WikiNeuralEntity",
    "extract_wikineural_ner_entities",
    "extract_wikineural_ner_locations",
    "get_wikineural_ner_device",
    "has_latin_text",
    "resolve_wikineural_model_dir",
]
