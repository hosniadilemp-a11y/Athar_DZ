"""Shared deterministic extractors, Algerian gazetteers, and fusion helpers (Phase 2A).

Used by both `pdf_extractor.py` (D16) and `html_extractor.py` (D17) to avoid
duplicating regex patterns, normalization, non-VERIFIED layer guards, or candidate
deduplication logic. All processing is 100% offline and deterministic.
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import Any

from app.domain.registry import NODE_TYPES, LayerId
from app.services.extraction.camel_ner import extract_camel_ner_entities

# ---------------------------------------------------------------------------
# Gazetteers (58 Algerian Wilayas + key communes)
# ---------------------------------------------------------------------------

ALGERIAN_WILAYAS: tuple[str, ...] = (
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra",
    "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret",
    "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda",
    "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem",
    "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi",
    "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt",
    "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla",
    "Naama", "Ain Temouchent", "Ghardaia", "Relizane", "Timimoun",
    "Bordj Badji Mokhtar", "Ouled Djellal", "Beni Abbes", "In Salah",
    "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
)

ALGERIAN_COMMUNES: tuple[str, ...] = (
    "Kouba", "Bir El Djir", "Bab El Oued", "Hydra", "El Harrach",
    "Hussein Dey", "Cheraga", "Draria", "Dar El Beida", "Rouiba",
    "Es Senia", "Ain El Turk", "El Khroub", "El Eulma", "Boufarik",
    "Sidi M'Hamed", "Birkhadem", "Ben Aknoun", "Delly Brahim", "Dely Brahim",
    "Zeralda", "Ouled Fayet", "Bordj El Kiffan", "Baraki",
)

# ---------------------------------------------------------------------------
# Regex Patterns (100% deterministic)
# ---------------------------------------------------------------------------

PHONE_RE = re.compile(
    r"(?<!\d)(?:\+213|00213|0)[\s.\-]*(?:555[\s.\-]*01\d{2}|[567]\d{2}(?:[\s.\-]*\d{2}){3})(?!\d)"
)
RIP_RE = re.compile(r"(?<!\d)(00799999\d{12})(?!\d)")
CCP_RE = re.compile(r"\bCCP\s*[:#N°]?\s*(\d{7,12})\b", re.IGNORECASE)
EMAIL_RE = re.compile(r"\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b")
URL_RE = re.compile(r"(https?://[^\s<>\"'\)\]]+)")
TME_BARE_RE = re.compile(
    r"(?<![A-Za-z0-9./])(?:t\.me|telegram\.me)/([a-zA-Z][a-zA-Z0-9_]{4,31})\b",
    re.IGNORECASE,
)
TELEGRAM_RE = re.compile(r"(?<![A-Za-z0-9._%+\-])@([a-zA-Z][a-zA-Z0-9_]{4,31})\b")
IPV4_RE = re.compile(
    r"(?<!\d)(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}"
    r"(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?!\d)"
)
PLATE_RE = re.compile(r"\b(\d{5}[\s\-]\d{3}[\s\-]\d{2})\b")
BTC_BECH32_RE = re.compile(r"\b(bc1[ac-hj-np-z02-9]{25,59})\b")
BTC_LEGACY_RE = re.compile(r"\b([13][a-km-zA-HJ-NP-Z1-9]{25,34})\b")
TRC20_RE = re.compile(r"\b(T[1-9A-HJ-NP-Za-km-z]{33})\b")
ETH_RE = re.compile(r"\b(0x[0-9a-fA-F]{40})\b")
AMOUNT_RE = re.compile(
    r"(?<!\d)(\d{1,3}(?:[\s\u00a0]\d{3})+|\d{4,9})(?:[.,]\d{2})?\s*(DZD|DA|EUR|USD)\b"
)
DATE_ISO_RE = re.compile(r"\b(20\d{2}-\d{2}-\d{2})\b")
IMEI_RE = re.compile(r"\bIMEI\s*[:#]?\s*(\d{15})\b", re.IGNORECASE)
GAB_RE = re.compile(r"\b(GAB-[A-Z0-9\-]{3,32})\b")

PERSON_ROLE_RE = re.compile(
    r"\b(?:Plaignant|Victime|Suspect|Mis en cause|G[eé]rant|Gerant|Directeur|Directrice|"
    r"Titulaire|B[eé]n[eé]ficiaire|Beneficiaire|T[eé]moin|Temoin|Nomm[eé]e?|M\.|Mme)[ \t]*:[ \t]*"
    r"([A-ZÀ-Ÿ][a-zà-ÿ\-]+(?:[ \t]+[A-ZÀ-Ÿ][a-zà-ÿ\-]+){1,2})"
)
COMPANY_RE = re.compile(
    r"\b((?:SARL|EURL|SPA|SNC)[ \t]+[A-ZÀ-Ÿ][A-Za-zÀ-ÿ0-9\-& ]{2,55}?)"
    r"(?=[ \t]*(?:\||$|\n|,|\.|;|·|—|–|Registre|\())"
)
RC_RE = re.compile(r"\bRC\s*[:#]?\s*([0-9]{2}/[0-9]{2}-[0-9A-Za-z]+)\b")
NIF_RE = re.compile(r"\bNIF\s*[:#]?\s*(\d{15})\b")


@dataclass(frozen=True)
class ExtractedCandidateItem:
    """Single candidate entity staged for isolated investigator review."""

    entity_type: str
    suggested_layer: str
    label: str
    normalized_value: str
    attributes: dict[str, Any]
    confidence: float
    extractor_tool: str
    stage_number: int
    source_page: int
    quote_snippet: str
    source_locator: str = ""


def fold_accents(value: str) -> str:
    """Fold Unicode combining marks to ASCII equivalents for resilient matching."""
    nfkd = unicodedata.normalize("NFKD", value)
    return "".join(ch for ch in nfkd if not unicodedata.combining(ch))


def default_non_verified_layer(entity_type: str) -> str:
    """Return canonical layer for entity_type, never auto-promoting to VERIFIED."""
    node_def = NODE_TYPES.get(entity_type)
    if node_def is None:
        return str(LayerId.OSINT_RAW.value)
    if node_def.layer == LayerId.VERIFIED:
        return str(LayerId.OSINT_RAW.value)
    return str(node_def.layer.value)


def sanitize_snippet(raw: str, max_len: int = 180) -> str:
    """Normalize whitespace and strip angle-bracket tag delimiters from snippets."""
    cleaned = " ".join(str(raw or "").replace("<", " ").replace(">", " ").split())
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 3] + "..."


def snippet_around(text: str, start: int, end: int, max_len: int = 180) -> str:
    """Extract a concise sanitized context snippet around [start, end]."""
    left = max(0, start - 55)
    right = min(len(text), end + 55)
    return sanitize_snippet(text[left:right], max_len=max_len)


def normalize_dz_phone(raw: str) -> str:
    """Normalize Algerian phone string into E.164 (+213...)."""
    digits = re.sub(r"\D", "", raw)
    if digits.startswith("00213"):
        digits = digits[5:]
    elif digits.startswith("213"):
        digits = digits[3:]
    elif digits.startswith("0"):
        digits = digits[1:]
    return f"+213{digits}"


def fuse_candidates(candidates: list[ExtractedCandidateItem]) -> list[ExtractedCandidateItem]:
    """Deduplicate and merge candidates from complementary extractors."""
    merged: dict[tuple[str, str], ExtractedCandidateItem] = {}
    order: list[tuple[str, str]] = []

    for item in candidates:
        if item.entity_type == "transaction_financiere":
            tx_date = str(item.attributes.get("date_operation") or "")
            dedup_val = f"{tx_date}:{item.normalized_value.lower()}"
        else:
            dedup_val = item.normalized_value.lower()
        key = (item.entity_type, dedup_val)

        if key not in merged:
            merged[key] = item
            order.append(key)
            continue

        existing = merged[key]
        winner, loser = (
            (item, existing) if item.confidence > existing.confidence else (existing, item)
        )
        detected_by = list(winner.attributes.get("also_detected_by", []))
        for tool_name in (winner.extractor_tool, loser.extractor_tool):
            if tool_name not in detected_by:
                detected_by.append(tool_name)
        merged_attrs = {**loser.attributes, **winner.attributes, "also_detected_by": detected_by}
        merged[key] = ExtractedCandidateItem(
            entity_type=winner.entity_type,
            suggested_layer=winner.suggested_layer,
            label=winner.label,
            normalized_value=winner.normalized_value,
            attributes=merged_attrs,
            confidence=winner.confidence,
            extractor_tool=winner.extractor_tool,
            stage_number=winner.stage_number,
            source_page=winner.source_page,
            quote_snippet=winner.quote_snippet or loser.quote_snippet,
            source_locator=winner.source_locator or loser.source_locator,
        )

    return [merged[k] for k in order]


def extract_deterministic_identifiers(
    segments: list[tuple[int, str, str]],
    stage_number: int,
    *,
    include_transactions: bool,
    extract_bare_at_as_telegram: bool = True,
    ipv4_as_c2_when_script: bool = False,
) -> list[ExtractedCandidateItem]:
    """Extract phones, bank accounts, emails, URLs, IPs, plates, Telegram, crypto, amounts."""
    items: list[ExtractedCandidateItem] = []
    seen: set[tuple[str, str]] = set()

    def add_item(
        entity_type: str,
        normalized: str,
        label: str,
        page_num: int,
        locator: str,
        text: str,
        span: tuple[int, int],
        tool: str,
        confidence: float,
        attrs: dict[str, Any] | None = None,
    ) -> None:
        key = (entity_type, normalized.lower() if entity_type != "crypto_wallet" else normalized)
        if key in seen:
            return
        seen.add(key)
        items.append(
            ExtractedCandidateItem(
                entity_type=entity_type,
                suggested_layer=default_non_verified_layer(entity_type),
                label=label[:255],
                normalized_value=normalized[:512],
                attributes=attrs or {},
                confidence=confidence,
                extractor_tool=tool,
                stage_number=stage_number,
                source_page=page_num,
                quote_snippet=snippet_around(text, span[0], span[1]),
                source_locator=locator,
            )
        )

    for page_num, locator, text in segments:
        for m in PHONE_RE.finditer(text):
            norm = normalize_dz_phone(m.group(0))
            add_item(
                "telephone", norm, norm, page_num, locator, text, m.span(),
                "regex-e164-dz", 0.94, {"numero_e164": norm, "raw": m.group(0).strip()},
            )

        for m in RIP_RE.finditer(text):
            rip = m.group(1)
            add_item(
                "compte_bancaire", rip, f"RIP {rip}", page_num, locator, text, m.span(),
                "regex-baridimob-rip", 0.96, {"rip": rip, "banque": "Algerie Poste / BaridiMob"},
            )

        for m in CCP_RE.finditer(text):
            ccp = m.group(1)
            add_item(
                "compte_bancaire", ccp, f"CCP {ccp}", page_num, locator, text, m.span(),
                "regex-ccp", 0.90, {"ccp": ccp, "banque": "Algerie Poste CCP"},
            )

        for m in EMAIL_RE.finditer(text):
            email = m.group(1).lower()
            add_item(
                "adresse_email", email, email, page_num, locator, text, m.span(),
                "regex-email", 0.95, {"email": email},
            )

        for m in URL_RE.finditer(text):
            url = m.group(1).rstrip(".,;:)")
            if "t.me/" in url.lower() or "telegram.me/" in url.lower():
                handle = "@" + url.rstrip("/").split("/")[-1].split("?")[0]
                if len(handle) > 2:
                    add_item(
                        "canal_telegram", handle, handle, page_num, locator, text, m.span(),
                        "regex-telegram-url", 0.93, {"handle": handle, "url": url},
                    )
            else:
                add_item(
                    "site_web", url, url, page_num, locator, text, m.span(),
                    "regex-url", 0.93, {"url": url},
                )

        for m in TME_BARE_RE.finditer(text):
            handle = f"@{m.group(1)}"
            add_item(
                "canal_telegram", handle, handle, page_num, locator, text, m.span(),
                "regex-telegram-url", 0.92, {"handle": handle, "url": f"https://{m.group(0)}"},
            )

        if extract_bare_at_as_telegram:
            for m in TELEGRAM_RE.finditer(text):
                handle = f"@{m.group(1)}"
                add_item(
                    "canal_telegram", handle, handle, page_num, locator, text, m.span(),
                    "regex-telegram-handle", 0.90, {"handle": handle},
                )

        for m in IPV4_RE.finditer(text):
            ip = m.group(0)
            is_c2_ctx = ipv4_as_c2_when_script and (
                locator.startswith("script") or "c2" in text.lower()
            )
            etype = "serveur_c2" if is_c2_ctx else "identifiant_infrastructure"
            tool = "html-script-c2-ipv4" if is_c2_ctx else "regex-ipv4"
            add_item(
                etype, ip, ip, page_num, locator, text, m.span(),
                tool, 0.92, {"ip_address": ip},
            )

        for m in PLATE_RE.finditer(text):
            plate = re.sub(r"\s+", "-", m.group(1))
            add_item(
                "vehicule", plate, plate, page_num, locator, text, m.span(),
                "regex-plate-dz", 0.93, {"immatriculation": plate},
            )

        for m in BTC_BECH32_RE.finditer(text):
            addr = m.group(1)
            add_item(
                "crypto_wallet", addr, addr, page_num, locator, text, m.span(),
                "regex-crypto-btc", 0.95, {"network": "BTC", "adresse_wallet": addr},
            )

        for m in TRC20_RE.finditer(text):
            addr = m.group(1)
            add_item(
                "crypto_wallet", addr, addr, page_num, locator, text, m.span(),
                "regex-crypto-trc20", 0.92, {"network": "TRC20", "adresse_wallet": addr},
            )

        for m in ETH_RE.finditer(text):
            addr = m.group(1)
            add_item(
                "crypto_wallet", addr, addr, page_num, locator, text, m.span(),
                "regex-crypto-eth", 0.92, {"network": "ETH", "adresse_wallet": addr},
            )

        for m in BTC_LEGACY_RE.finditer(text):
            addr = m.group(1)
            add_item(
                "crypto_wallet", addr, addr, page_num, locator, text, m.span(),
                "regex-crypto-btc-legacy", 0.85, {"network": "BTC", "adresse_wallet": addr},
            )

        if include_transactions:
            for line_text in text.splitlines():
                date_match = DATE_ISO_RE.search(line_text)
                tx_date = date_match.group(1) if date_match else None
                for m in AMOUNT_RE.finditer(line_text):
                    digits = re.sub(r"[\s\u00a0]", "", m.group(1))
                    currency = m.group(2).upper()
                    norm = f"{digits} {currency}"
                    tx_key = f"{tx_date}:{norm}" if tx_date else norm
                    if ("transaction_financiere", tx_key.lower()) in seen:
                        continue
                    seen.add(("transaction_financiere", tx_key.lower()))
                    attrs: dict[str, Any] = {"montant": int(digits), "devise": currency}
                    if tx_date:
                        attrs["date_operation"] = tx_date
                    items.append(
                        ExtractedCandidateItem(
                            entity_type="transaction_financiere",
                            suggested_layer=default_non_verified_layer("transaction_financiere"),
                            label=norm,
                            normalized_value=norm,
                            attributes=attrs,
                            confidence=0.89,
                            extractor_tool="regex-table-amount-dzd",
                            stage_number=stage_number,
                            source_page=page_num,
                            quote_snippet=sanitize_snippet(line_text),
                            source_locator=locator,
                        )
                    )

    return items


def extract_contextual_entities(
    segments: list[tuple[int, str, str]],
    stage_number: int,
) -> list[ExtractedCandidateItem]:
    """Stage 3 static extractors: persons, companies, IMEI, GAB, DZ wilayas/communes, CAMeL NER."""
    items: list[ExtractedCandidateItem] = []
    seen: set[tuple[str, str]] = set()

    def add_item(
        entity_type: str,
        normalized: str,
        label: str,
        page_num: int,
        locator: str,
        text: str,
        span: tuple[int, int],
        tool: str,
        confidence: float,
        attrs: dict[str, Any] | None = None,
    ) -> None:
        key = (entity_type, normalized.lower())
        if key in seen:
            return
        seen.add(key)
        items.append(
            ExtractedCandidateItem(
                entity_type=entity_type,
                suggested_layer=default_non_verified_layer(entity_type),
                label=label[:255],
                normalized_value=normalized[:512],
                attributes=attrs or {},
                confidence=confidence,
                extractor_tool=tool,
                stage_number=stage_number,
                source_page=page_num,
                quote_snippet=snippet_around(text, span[0], span[1]),
                source_locator=locator,
            )
        )

    for page_num, locator, text in segments:
        for m in COMPANY_RE.finditer(text):
            company = " ".join(m.group(1).split()).strip()
            rc_match = RC_RE.search(text)
            nif_match = NIF_RE.search(text)
            attrs: dict[str, Any] = {"raison_sociale": company}
            if rc_match:
                attrs["registre_commerce"] = rc_match.group(1)
            if nif_match:
                attrs["nif"] = nif_match.group(1)
            add_item(
                "entreprise", company, company, page_num, locator, text, m.span(),
                "rule-company-dz", 0.90, attrs,
            )

        for m in PERSON_ROLE_RE.finditer(text):
            name = " ".join(m.group(1).split()).strip()
            if len(name.split()) < 2:
                continue
            add_item(
                "personne", name, name, page_num, locator, text, m.span(),
                "rule-person-role-fr", 0.86, {"nom_complet": name},
            )

        for m in IMEI_RE.finditer(text):
            imei = m.group(1)
            add_item(
                "appareil_mobile", imei, f"IMEI {imei}", page_num, locator, text, m.span(),
                "regex-imei", 0.95, {"imei": imei},
            )

        for m in GAB_RE.finditer(text):
            gab = m.group(1)
            add_item(
                "guichet_gab", gab, gab, page_num, locator, text, m.span(),
                "regex-gab-id", 0.92, {"code_gab": gab},
            )

        folded_text = fold_accents(text)
        for wilaya in ALGERIAN_WILAYAS:
            pattern = re.compile(rf"\b{re.escape(wilaya)}\b", re.IGNORECASE)
            wm = pattern.search(folded_text)
            if wm:
                add_item(
                    "wilaya", wilaya, wilaya, page_num, locator, text, wm.span(),
                    "gazetteer-wilayas-58", 0.88, {"nom_fr": wilaya},
                )

        for commune in ALGERIAN_COMMUNES:
            pattern = re.compile(rf"\b{re.escape(commune)}\b", re.IGNORECASE)
            cm = pattern.search(folded_text)
            if cm:
                add_item(
                    "commune", commune, commune, page_num, locator, text, cm.span(),
                    "gazetteer-communes-dz", 0.85, {"nom_fr": commune},
                )

        for camel_ent in extract_camel_ner_entities(text):
            key = (camel_ent.entity_type, camel_ent.normalized_value.lower())
            if key in seen:
                continue
            seen.add(key)
            items.append(
                ExtractedCandidateItem(
                    entity_type=camel_ent.entity_type,
                    suggested_layer=default_non_verified_layer(camel_ent.entity_type),
                    label=camel_ent.label[:255],
                    normalized_value=camel_ent.normalized_value[:512],
                    attributes={"camel_ner_tag": camel_ent.tag},
                    confidence=camel_ent.confidence,
                    extractor_tool="camel-tools-ner",
                    stage_number=stage_number,
                    source_page=page_num,
                    quote_snippet=sanitize_snippet(camel_ent.quote_snippet),
                    source_locator=locator,
                )
            )

    return items


def build_extraction_summary(
    *,
    mode: str,
    stage: int | None,
    candidates: list[ExtractedCandidateItem],
    extra: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build consistent run summary dictionary for Mode 1 and Mode 2."""
    summary: dict[str, Any] = {
        "mode": mode,
        "candidates_found": len(candidates),
        "tools_used": sorted({c.extractor_tool for c in candidates}),
    }
    if stage is not None:
        summary["stage"] = stage
    if extra:
        summary.update(extra)
    return summary


__all__ = [
    "ALGERIAN_COMMUNES",
    "ALGERIAN_WILAYAS",
    "AMOUNT_RE",
    "DATE_ISO_RE",
    "ExtractedCandidateItem",
    "TELEGRAM_RE",
    "build_extraction_summary",
    "default_non_verified_layer",
    "extract_contextual_entities",
    "extract_deterministic_identifiers",
    "fold_accents",
    "fuse_candidates",
    "normalize_dz_phone",
    "sanitize_snippet",
    "snippet_around",
]
