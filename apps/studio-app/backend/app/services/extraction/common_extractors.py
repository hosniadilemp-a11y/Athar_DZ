"""Shared deterministic extractors, Algerian location attributes, and relations (Phase 2A+).

Used by both `pdf_extractor.py` (D16) and `html_extractor.py` (D17) per Decision D18:
- Wilayas & communes are NEVER emitted as standalone graph entity candidates;
  they are extracted into geographic attributes (`wilaya`, `commune`) on entities
  and `extracted_locations` in evidence metadata.
- Extracts deterministic semantic relations (`ExtractedRelationItem`) validated
  against `registry.py` (`validate_relation`).
"""

from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import Any

import phonenumbers

from app.domain.registry import NODE_TYPES, LayerId, validate_relation
from app.services.extraction.camel_ner import (
    extract_camel_ner_entities,
    extract_camel_ner_locations,
)
from app.services.extraction.wikineural_ner import extract_wikineural_ner_entities

# ---------------------------------------------------------------------------
# Gazetteers (58 Algerian Wilayas + key communes — attribute-only per D18)
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
TELEGRAM_RE = re.compile(r"(?<![A-Za-z0-9._%+\-])@([a-zA-Z][a-zA-Z0-9_]{4,31})\b")
TME_BARE_RE = re.compile(
    r"\b(?:https?://)?(?:t\.me|telegram\.me)/([a-zA-Z][a-zA-Z0-9_]{3,31})\b",
    re.IGNORECASE,
)
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
    r"Titulaire|B[eé]n[eé]ficiaire|Beneficiaire|T[eé]moin|Temoin|Nomm[eé]e?|M\.|Mme|"
    r"Complainant|Victim|Director|Manager|Account Holder|Beneficiary|Witness)[ \t]*:[ \t]*"
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


@dataclass(frozen=True)
class ExtractedRelationItem:
    """Single semantic relation between extracted entities staged for human review."""

    relation_type: str
    source_entity_type: str
    source_normalized_value: str
    target_entity_type: str
    target_normalized_value: str
    suggested_layer: str
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


def normalize_phone(raw: str, default_region: str = "DZ") -> str:
    """Normalize Algerian or international phone strings to E.164 without dropping synthetic DZ."""
    stripped = (raw or "").strip()
    digits = re.sub(r"\D", "", stripped)
    if (
        stripped.startswith(("+213", "00213"))
        or (not stripped.startswith("+") and digits.startswith(("213", "00213", "05", "06", "07")))
    ):
        return normalize_dz_phone(stripped)
    try:
        parsed = phonenumbers.parse(stripped, default_region)
        if phonenumbers.is_possible_number(parsed):
            return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    except Exception:  # noqa: BLE001
        pass
    return normalize_dz_phone(stripped) if digits else ""


def _unify_algerie_poste_rip_and_ccp(
    items: list[ExtractedCandidateItem],
) -> list[ExtractedCandidateItem]:
    """Merge standalone CCP candidates into their parent 20-digit BaridiMob RIP (D18+)."""
    rips: list[tuple[int, str, str]] = []
    for idx, item in enumerate(items):
        if item.entity_type != "compte_bancaire":
            continue
        digits = re.sub(r"\D", "", item.normalized_value)
        if digits.startswith("00799999") and len(digits) == 20:
            embedded_ccp = digits[8:18]
            rips.append((idx, embedded_ccp, embedded_ccp.lstrip("0")))

    if not rips:
        return items

    ccp_to_drop: set[int] = set()
    updated = list(items)
    for idx, item in enumerate(items):
        if item.entity_type != "compte_bancaire":
            continue
        digits = re.sub(r"\D", "", item.normalized_value)
        if digits.startswith("00799999") and len(digits) == 20:
            continue
        for rip_idx, emb_10, emb_trim in rips:
            if digits in {emb_10, emb_trim}:
                rip_cand = updated[rip_idx]
                attrs = dict(rip_cand.attributes)
                attrs.setdefault("ccp", item.normalized_value)
                attrs.setdefault("banque", "Algérie Poste / BaridiMob")
                tools = list(attrs.get("also_detected_by", []))
                if item.extractor_tool not in tools:
                    tools.append(item.extractor_tool)
                attrs["also_detected_by"] = tools
                updated[rip_idx] = ExtractedCandidateItem(
                    entity_type=rip_cand.entity_type,
                    suggested_layer=rip_cand.suggested_layer,
                    label=rip_cand.label,
                    normalized_value=rip_cand.normalized_value,
                    attributes=attrs,
                    confidence=max(rip_cand.confidence, item.confidence),
                    extractor_tool=rip_cand.extractor_tool,
                    stage_number=rip_cand.stage_number,
                    source_page=rip_cand.source_page,
                    quote_snippet=rip_cand.quote_snippet,
                    source_locator=rip_cand.source_locator,
                )
                ccp_to_drop.add(idx)
                break

    return [item for i, item in enumerate(updated) if i not in ccp_to_drop]


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

    return _unify_algerie_poste_rip_and_ccp([merged[k] for k in order])


def fuse_relations(relations: list[ExtractedRelationItem]) -> list[ExtractedRelationItem]:
    """Deduplicate ontologically valid semantic relation candidates."""
    merged: dict[tuple[str, str, str, str, str], ExtractedRelationItem] = {}
    order: list[tuple[str, str, str, str, str]] = []

    for rel in relations:
        is_ok, _ = validate_relation(
            rel.source_entity_type, rel.relation_type, rel.target_entity_type
        )
        if not is_ok:
            continue
        if (
            rel.source_entity_type == rel.target_entity_type
            and rel.source_normalized_value.lower() == rel.target_normalized_value.lower()
        ):
            continue
        key = (
            rel.relation_type,
            rel.source_entity_type,
            rel.source_normalized_value.lower(),
            rel.target_entity_type,
            rel.target_normalized_value.lower(),
        )
        if key not in merged:
            merged[key] = rel
            order.append(key)
            continue
        existing = merged[key]
        winner, loser = (rel, existing) if rel.confidence > existing.confidence else (existing, rel)
        merged_attrs = {**loser.attributes, **winner.attributes}
        merged[key] = ExtractedRelationItem(
            relation_type=winner.relation_type,
            source_entity_type=winner.source_entity_type,
            source_normalized_value=winner.source_normalized_value,
            target_entity_type=winner.target_entity_type,
            target_normalized_value=winner.target_normalized_value,
            suggested_layer=winner.suggested_layer,
            attributes=merged_attrs,
            confidence=winner.confidence,
            extractor_tool=winner.extractor_tool,
            stage_number=winner.stage_number,
            source_page=winner.source_page,
            quote_snippet=winner.quote_snippet or loser.quote_snippet,
            source_locator=winner.source_locator or loser.source_locator,
        )

    return [merged[k] for k in order]


def extract_location_attributes(
    segments: list[tuple[int, str, str]],
) -> tuple[dict[str, list[str]], dict[int, dict[str, Any]]]:
    """Extract Algerian wilaya & commune mentions as geographic attributes (never nodes)."""
    all_wilayas: list[str] = []
    all_communes: list[str] = []
    per_page: dict[int, dict[str, Any]] = {}

    for page_num, _locator, text in segments:
        folded = fold_accents(text)
        page_entry = per_page.setdefault(page_num, {"wilayas": [], "communes": []})

        for wilaya in ALGERIAN_WILAYAS:
            if re.search(rf"\b{re.escape(wilaya)}\b", folded, re.IGNORECASE):
                if wilaya not in page_entry["wilayas"]:
                    page_entry["wilayas"].append(wilaya)
                if wilaya not in all_wilayas:
                    all_wilayas.append(wilaya)

        for commune in ALGERIAN_COMMUNES:
            if re.search(rf"\b{re.escape(commune)}\b", folded, re.IGNORECASE):
                if commune not in page_entry["communes"]:
                    page_entry["communes"].append(commune)
                if commune not in all_communes:
                    all_communes.append(commune)

        camel_locs = extract_camel_ner_locations(text)
        for w in camel_locs.get("wilayas", []):
            if w not in page_entry["wilayas"]:
                page_entry["wilayas"].append(w)
            if w not in all_wilayas:
                all_wilayas.append(w)
        for c in camel_locs.get("communes", []):
            if c not in page_entry["communes"]:
                page_entry["communes"].append(c)
            if c not in all_communes:
                all_communes.append(c)

    return {"wilayas": all_wilayas, "communes": all_communes}, per_page


def enrich_candidates_with_locations(
    candidates: list[ExtractedCandidateItem],
    per_page_locations: dict[int, dict[str, Any]],
) -> list[ExtractedCandidateItem]:
    """Attach detected wilaya/commune attributes onto co-occurring entity candidates."""
    enriched: list[ExtractedCandidateItem] = []
    for cand in candidates:
        loc = per_page_locations.get(cand.source_page)
        if not loc or (not loc.get("wilayas") and not loc.get("communes")):
            enriched.append(cand)
            continue
        attrs = dict(cand.attributes)
        if loc.get("wilayas"):
            attrs.setdefault("wilaya", loc["wilayas"][0])
            attrs.setdefault("wilayas_mentionnees", loc["wilayas"])
        if loc.get("communes"):
            attrs.setdefault("commune", loc["communes"][0])
            attrs.setdefault("communes_donnees", loc["communes"])
        enriched.append(
            ExtractedCandidateItem(
                entity_type=cand.entity_type,
                suggested_layer=cand.suggested_layer,
                label=cand.label,
                normalized_value=cand.normalized_value,
                attributes=attrs,
                confidence=cand.confidence,
                extractor_tool=cand.extractor_tool,
                stage_number=cand.stage_number,
                source_page=cand.source_page,
                quote_snippet=cand.quote_snippet,
                source_locator=cand.source_locator,
            )
        )
    return enriched


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

        for pm in phonenumbers.PhoneNumberMatcher(text, "DZ"):
            if not pm.raw_string.lstrip().startswith(("+", "00")):
                continue
            norm = phonenumbers.format_number(pm.number, phonenumbers.PhoneNumberFormat.E164)
            add_item(
                "telephone", norm, norm, page_num, locator, text, (pm.start, pm.end),
                "phonenumbers-e164", 0.93,
                {"numero_e164": norm, "raw": pm.raw_string.strip(), "region": phonenumbers.region_code_for_number(pm.number) or ""},
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
                "regex-telegram-url", 0.93, {"handle": handle, "url": m.group(0)},
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
    """Stage 3 extractors: persons, companies, IMEI, GAB, CAMeL NER (no location nodes)."""
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

        for wiki_ent in extract_wikineural_ner_entities(text):
            w_low = wiki_ent.normalized_value.lower()
            key = (wiki_ent.entity_type, w_low)
            if key in seen:
                continue
            if wiki_ent.entity_type == "entreprise":
                w_core = re.sub(r"^(?:sarl|eurl|spa|snc|sas)\s+", "", w_low).strip()
                if any(
                    st == "entreprise"
                    and (
                        w_core in re.sub(r"^(?:sarl|eurl|spa|snc|sas)\s+", "", sv).strip()
                        or re.sub(r"^(?:sarl|eurl|spa|snc|sas)\s+", "", sv).strip() in w_core
                    )
                    for st, sv in seen
                ):
                    continue
            seen.add(key)
            items.append(
                ExtractedCandidateItem(
                    entity_type=wiki_ent.entity_type,
                    suggested_layer=default_non_verified_layer(wiki_ent.entity_type),
                    label=wiki_ent.label[:255],
                    normalized_value=wiki_ent.normalized_value[:512],
                    attributes={"wikineural_tag": wiki_ent.tag},
                    confidence=wiki_ent.confidence,
                    extractor_tool="wikineural-multilingual-ner",
                    stage_number=stage_number,
                    source_page=page_num,
                    quote_snippet=sanitize_snippet(wiki_ent.quote_snippet),
                    source_locator=locator,
                )
            )

    return items


ARABIC_DIACRITICS_RE = re.compile(r"[\u064B-\u065F\u0670]")
ROLE_WINDOW_RE = re.compile(
    r"G[eé]rant|Directeur|Directrice|\bDirector\b|\bManager\b|\bCEO\b|"
    r"مسير|المسير|مدير|المدير|رئيس|صاحب",
    re.IGNORECASE,
)
TRANSFER_CUE_RE = re.compile(
    r"virement|\bvers\b|re[cç]u\s+de|envoy[eé]|transfert|\btransfer\b|\bwire\b|"
    r"sent\s+to|received\s+from|تحويل|إرسال|استلام",
    re.IGNORECASE,
)
INCOMING_TRANSFER_RE = re.compile(
    r"re[cç]u\s+de|received\s+from|incoming\s+from|مستلم\s+من|وارد\s+من",
    re.IGNORECASE,
)

ROLE_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    (
        "plaignant",
        re.compile(
            r"\bPlaignant\b|\bVictime\b|\bComplainant\b|\bVictim\b|المشتكي|الضحية",
            re.IGNORECASE,
        ),
    ),
    ("suspect", re.compile(r"\bSuspect\b|mis\s+en\s+cause|المشتبه", re.IGNORECASE)),
    (
        "titulaire",
        re.compile(
            r"\bTitulaire\b|Account\s+Holder|صاحب\s+الحساب",
            re.IGNORECASE,
        ),
    ),
    (
        "beneficiaire",
        re.compile(
            r"\bB[eé]n[eé]ficiaire\b|\bBeneficiary\b|\bRecipient\b|المستفيد",
            re.IGNORECASE,
        ),
    ),
    ("gerant", ROLE_WINDOW_RE),
)
PHONE_CUE_RE = re.compile(
    r"(?:^(?:T[eé]l[eé]phone|T[eé]l\b|Phone|Mobile|Contact|Num[eé]ro\s+OTP)|"
    r"(?:T[eé]l[eé]phone|Phone|Mobile|الهاتف|رقم\s+الهاتف)\s*:)",
    re.IGNORECASE,
)
EMAIL_CUE_RE = re.compile(
    r"(?:^(?:Courriel|E-?mail|Mail)|(?:Courriel|E-?mail|Email|البريد(?:\s+الإلكتروني)?)\s*:)",
    re.IGNORECASE,
)
PRIMARY_BANK_CUE_RE = re.compile(
    r"rip\s+principal|compte\s+principal|primary\s+(?:rip|account)|"
    r"الحساب\s+الرئيسي|الرقم\s+البريدي\s+الرئيسي",
    re.IGNORECASE,
)
DEST_BANK_CUE_RE = re.compile(
    r"compte\s+destinataire|b[eé]n[eé]ficiaire|destinataire|"
    r"target\s+account|recipient\s+account|destination\s+account|"
    r"الحساب\s+المستفيد|الحساب\s+المستلم|حساب\s+المشتبه",
    re.IGNORECASE,
)

_BOUNDARY_SENSITIVE_TYPES: frozenset[str] = frozenset(
    {"compte_bancaire", "appareil_mobile", "identifiant_infrastructure", "serveur_c2", "vehicule"}
)


def _normalize_match_text(text: str) -> str:
    """Normalize text for multilingual (FR/EN/AR) co-occurrence matching."""
    return ARABIC_DIACRITICS_RE.sub("", unicodedata.normalize("NFKC", text)).lower()


def _extract_line_tx_attrs(line: str) -> dict[str, Any]:
    """Extract optional amount/date/canal metadata for financial transfer edges."""
    attrs: dict[str, Any] = {}
    amt = AMOUNT_RE.search(line)
    if amt:
        digits = int(re.sub(r"[\s\u00a0]", "", amt.group(1)))
        curr = amt.group(2).upper()
        attrs["devise"] = curr
        if curr in {"DZD", "DA"}:
            attrs["montant_dzd"] = digits
        else:
            attrs["montant"] = digits
    dt = DATE_ISO_RE.search(line)
    if dt:
        attrs["date_operation"] = dt.group(1)
    norm_l = _normalize_match_text(line)
    if "baridimob" in norm_l or "بريدي موب" in norm_l:
        attrs["canal"] = "BaridiMob"
    return attrs


def extract_cooccurrence_relations(
    segments: list[tuple[int, str, str]],
    candidates: list[ExtractedCandidateItem],
    stage_number: int,
) -> list[ExtractedRelationItem]:
    """Infer deterministic semantic relations from line/block & role co-occurrence."""
    by_type: dict[str, list[ExtractedCandidateItem]] = {}
    for c in candidates:
        by_type.setdefault(c.entity_type, []).append(c)

    relations: list[ExtractedRelationItem] = []

    def emit(
        rel_type: str,
        src: ExtractedCandidateItem,
        tgt: ExtractedCandidateItem,
        *,
        page_num: int,
        locator: str,
        snippet: str,
        tool: str,
        confidence: float,
        layer: str | None = None,
        attrs: dict[str, Any] | None = None,
    ) -> None:
        relations.append(
            ExtractedRelationItem(
                relation_type=rel_type,
                source_entity_type=src.entity_type,
                source_normalized_value=src.normalized_value,
                target_entity_type=tgt.entity_type,
                target_normalized_value=tgt.normalized_value,
                suggested_layer=layer or tgt.suggested_layer or "HYPOTHESIS",
                attributes=attrs or {},
                confidence=confidence,
                extractor_tool=tool,
                stage_number=stage_number,
                source_page=page_num,
                quote_snippet=sanitize_snippet(snippet),
                source_locator=locator,
            )
        )

    def _matches_in_text(entity: ExtractedCandidateItem, haystack: str) -> bool:
        h_low = _normalize_match_text(haystack)
        norm = _normalize_match_text(entity.normalized_value)
        if entity.entity_type == "telephone":
            digits = re.sub(r"\D", "", entity.normalized_value)[-8:]
            return bool(digits and digits in re.sub(r"\D", "", haystack))
        if entity.entity_type in _BOUNDARY_SENSITIVE_TYPES:
            return re.search(rf"(?<!\d){re.escape(norm)}(?!\d)", h_low) is not None
        if entity.entity_type == "transaction_financiere":
            compact_h = re.sub(r"(?<=\d)\s+(?=\d)", "", h_low)
            num_part = re.sub(r"\D", "", norm)
            return bool(num_part and re.search(rf"(?<!\d){re.escape(num_part)}(?!\d)", compact_h))
        return norm in h_low

    def _detect_roles(line_text: str) -> list[str]:
        return [rkey for rkey, rpat in ROLE_PATTERNS if rpat.search(line_text)]

    # Cross-page state for paginated PDF documents ("page:N")
    active_roles: dict[str, ExtractedCandidateItem] = {}
    last_person: ExtractedCandidateItem | None = None
    last_person_line_abs = -10
    last_role_key: str | None = None
    active_subject: ExtractedCandidateItem | None = None
    primary_account: ExtractedCandidateItem | None = None
    last_bank: ExtractedCandidateItem | None = None
    last_bank_line_abs = -10
    abs_line_idx = 0

    for page_num, locator, text in segments:
        if not locator.startswith("page:"):
            active_roles = {}
            last_person = None
            last_person_line_abs = -10
            last_role_key = None
            active_subject = None
            primary_account = None
            last_bank = None
            last_bank_line_abs = -10

        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        emails_owned_by_person: set[str] = set()
        for ln in lines:
            if any(_matches_in_text(p, ln) for p in by_type.get("personne", [])):
                for em in by_type.get("adresse_email", []):
                    if _matches_in_text(em, ln):
                        emails_owned_by_person.add(em.normalized_value)

        for idx, line in enumerate(lines):
            abs_line_idx += 1
            window = line if idx + 1 >= len(lines) else f"{line} {lines[idx + 1]}"
            line_roles = _detect_roles(line)

            # Line-strict pairs (same line)
            line_persons = [
                p for p in by_type.get("personne", []) if _matches_in_text(p, line)
            ]
            line_phones = [
                t for t in by_type.get("telephone", []) if _matches_in_text(t, line)
            ]
            line_emails = [
                e for e in by_type.get("adresse_email", []) if _matches_in_text(e, line)
            ]
            line_banks = [
                b for b in by_type.get("compte_bancaire", []) if _matches_in_text(b, line)
            ]
            line_txs = [
                tx for tx in by_type.get("transaction_financiere", [])
                if _matches_in_text(tx, line)
            ]
            line_gabs = [
                g for g in by_type.get("guichet_gab", []) if _matches_in_text(g, line)
            ]
            line_cars = [
                v for v in by_type.get("vehicule", []) if _matches_in_text(v, line)
            ]
            line_companies = [
                c for c in by_type.get("entreprise", []) if _matches_in_text(c, line)
            ]
            line_crypto = [
                cw for cw in by_type.get("crypto_wallet", []) if _matches_in_text(cw, line)
            ]

            if line_persons:
                last_person = line_persons[-1]
                last_person_line_abs = abs_line_idx
                for rk in line_roles:
                    active_roles[rk] = line_persons[0]
                    last_role_key = rk
                # Transfer line followed immediately by "Beneficiaire : <Person>"
                if (
                    "beneficiaire" in line_roles
                    and last_bank is not None
                    and abs_line_idx - last_bank_line_abs == 1
                ):
                    emit(
                        "DETIENT_COMPTE_BANCAIRE",
                        line_persons[0],
                        last_bank,
                        page_num=page_num,
                        locator=locator,
                        snippet=line,
                        tool="rel-beneficiary-account",
                        confidence=0.87,
                        layer="FLOWS",
                    )
            else:
                # Narrative coreference e.g. "le suspect a exige..."
                for rk in line_roles:
                    if rk in active_roles:
                        active_subject = active_roles[rk]
                        last_role_key = rk

            # Role-anchored phone linking across adjacent lines
            if line_phones and not line_persons and not line_companies:
                target_person: ExtractedCandidateItem | None = None
                for rk in line_roles:
                    if rk in active_roles:
                        target_person = active_roles[rk]
                        break
                if (
                    target_person is None
                    and PHONE_CUE_RE.search(line)
                    and last_person is not None
                    and abs_line_idx - last_person_line_abs == 1
                ):
                    target_person = last_person
                if target_person is not None:
                    for t in line_phones:
                        emit(
                            "UTILISE_TELEPHONE",
                            target_person,
                            t,
                            page_num=page_num,
                            locator=locator,
                            snippet=line,
                            tool="rel-role-phone",
                            confidence=0.89,
                        )

            # Role-anchored email linking across adjacent lines
            if (
                line_emails
                and not line_persons
                and not line_companies
                and EMAIL_CUE_RE.search(line)
            ):
                email_owner: ExtractedCandidateItem | None = None
                for rk in line_roles:
                    if rk in active_roles:
                        email_owner = active_roles[rk]
                        break
                if (
                    email_owner is None
                    and last_role_key is not None
                    and abs_line_idx - last_person_line_abs <= 2
                ):
                    email_owner = active_roles.get(last_role_key)
                if email_owner is not None:
                    for em in line_emails:
                        emit(
                            "UTILISE_EMAIL",
                            email_owner,
                            em,
                            page_num=page_num,
                            locator=locator,
                            snippet=line,
                            tool="rel-role-email",
                            confidence=0.85,
                        )

            for p in line_persons:
                for t in line_phones:
                    emit(
                        "UTILISE_TELEPHONE", p, t, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.88,
                    )
                for e in line_emails:
                    emit(
                        "UTILISE_EMAIL", p, e, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.87,
                    )
                for b in line_banks:
                    emit(
                        "DETIENT_COMPTE_BANCAIRE", p, b, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.89,
                    )
                for v in line_cars:
                    emit(
                        "PROPRIETAIRE_VEHICULE", p, v, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.84,
                    )
                for c in line_companies:
                    emit(
                        "DIRIGE_ENTREPRISE", p, c, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.90,
                    )

            for c in line_companies:
                for e in line_emails:
                    emit(
                        "UTILISE_EMAIL", c, e, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.88,
                    )
                for tx_item in line_txs:
                    emit(
                        "IMPLIQUE_TRANSACTION", c, tx_item, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.85, layer="FLOWS",
                    )

            for b in line_banks:
                for g in line_gabs:
                    emit(
                        "RETRAIT_ESPECES_GAB", b, g, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-table-cooccurrence", confidence=0.92, layer="FLOWS",
                    )
                for tx in line_txs:
                    emit(
                        "IMPLIQUE_TRANSACTION", b, tx, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.90, layer="FLOWS",
                    )
                for cw in line_crypto:
                    emit(
                        "CONVERTIT_EN_CRYPTO", b, cw, page_num=page_num, locator=locator,
                        snippet=line, tool="rel-line-cooccurrence", confidence=0.88, layer="FLOWS",
                    )

            # Bank ownership & primary account tracking
            if line_banks:
                last_bank = line_banks[-1]
                last_bank_line_abs = abs_line_idx
                if PRIMARY_BANK_CUE_RE.search(line):
                    primary_account = line_banks[0]
                    titulaire = active_roles.get("titulaire")
                    if titulaire is not None:
                        emit(
                            "DETIENT_COMPTE_BANCAIRE",
                            titulaire,
                            primary_account,
                            page_num=page_num,
                            locator=locator,
                            snippet=line,
                            tool="rel-titulaire-account",
                            confidence=0.92,
                            layer="FLOWS",
                        )
                elif DEST_BANK_CUE_RE.search(line) and active_subject is not None:
                    emit(
                        "DETIENT_COMPTE_BANCAIRE",
                        active_subject,
                        line_banks[0],
                        page_num=page_num,
                        locator=locator,
                        snippet=line,
                        tool="rel-role-coref-account",
                        confidence=0.88,
                        layer="FLOWS",
                    )

            # Account-to-account transfers (requires distinct accounts + transfer cue)
            tx_attrs = _extract_line_tx_attrs(line)
            if (
                len(line_banks) >= 2
                and line_banks[0].normalized_value != line_banks[1].normalized_value
                and TRANSFER_CUE_RE.search(line)
            ):
                emit(
                    "EFFECTUE_VIREMENT_VERS",
                    line_banks[0],
                    line_banks[1],
                    page_num=page_num,
                    locator=locator,
                    snippet=line,
                    tool="rel-transfer-line",
                    confidence=0.91,
                    layer="FLOWS",
                    attrs=tx_attrs,
                )
            elif (
                len(line_banks) == 1
                and primary_account is not None
                and line_banks[0].normalized_value != primary_account.normalized_value
                and TRANSFER_CUE_RE.search(line)
            ):
                if INCOMING_TRANSFER_RE.search(line):
                    src_acc, tgt_acc = line_banks[0], primary_account
                else:
                    src_acc, tgt_acc = primary_account, line_banks[0]
                emit(
                    "EFFECTUE_VIREMENT_VERS",
                    src_acc,
                    tgt_acc,
                    page_num=page_num,
                    locator=locator,
                    snippet=line,
                    tool="rel-statement-transfer",
                    confidence=0.92,
                    layer="FLOWS",
                    attrs=tx_attrs,
                )

            line_norm = _normalize_match_text(line)
            if (
                "otp" in line_norm
                or "baridimob" in line_norm
                or "بريدي موب" in line_norm
                or "رمز التحقق" in line_norm
            ):
                for t in line_phones:
                    for b in line_banks:
                        emit(
                            "RECOIT_OTP_BARIDIMOB", t, b, page_num=page_num, locator=locator,
                            snippet=line, tool="rel-otp-context", confidence=0.88, layer="FLOWS",
                        )

            # 2-line adjacent window for role/company & person/company & company/email
            win_persons = [p for p in by_type.get("personne", []) if _matches_in_text(p, window)]
            win_companies = [
                c for c in by_type.get("entreprise", []) if _matches_in_text(c, window)
            ]
            win_emails = [
                e for e in by_type.get("adresse_email", []) if _matches_in_text(e, window)
            ]
            win_banks = [
                b for b in by_type.get("compte_bancaire", []) if _matches_in_text(b, window)
            ]
            win_crypto = [
                cw for cw in by_type.get("crypto_wallet", []) if _matches_in_text(cw, window)
            ]

            if ROLE_WINDOW_RE.search(window):
                for p in win_persons:
                    for c in win_companies:
                        emit(
                            "DIRIGE_ENTREPRISE", p, c, page_num=page_num, locator=locator,
                            snippet=window, tool="rel-role-window", confidence=0.91,
                        )
            for c in win_companies:
                for e in win_emails:
                    if e.normalized_value in emails_owned_by_person:
                        continue
                    emit(
                        "UTILISE_EMAIL", c, e, page_num=page_num, locator=locator,
                        snippet=window, tool="rel-window-cooccurrence", confidence=0.86,
                    )
            for b in win_banks:
                for cw in win_crypto:
                    emit(
                        "CONVERTIT_EN_CRYPTO", b, cw, page_num=page_num, locator=locator,
                        snippet=window, tool="rel-window-cooccurrence",
                        confidence=0.86, layer="FLOWS",
                    )

    return fuse_relations(relations)


def build_extraction_summary(
    *,
    mode: str,
    stage: int | None,
    candidates: list[ExtractedCandidateItem],
    relations: list[ExtractedRelationItem] | None = None,
    locations: dict[str, list[str]] | None = None,
    extra: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build consistent run summary dictionary for Mode 1 and Mode 2."""
    cand_tools = {c.extractor_tool for c in candidates}
    rel_tools = {r.extractor_tool for r in (relations or [])}
    summary: dict[str, Any] = {
        "mode": mode,
        "candidates_found": len(candidates),
        "relations_found": len(relations or []),
        "tools_used": sorted(cand_tools | rel_tools),
    }
    if locations:
        summary["extracted_locations"] = locations
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
    "ExtractedRelationItem",
    "TELEGRAM_RE",
    "build_extraction_summary",
    "default_non_verified_layer",
    "enrich_candidates_with_locations",
    "extract_contextual_entities",
    "extract_cooccurrence_relations",
    "extract_deterministic_identifiers",
    "extract_location_attributes",
    "fold_accents",
    "fuse_candidates",
    "fuse_relations",
    "normalize_dz_phone",
    "sanitize_snippet",
    "snippet_around",
]
