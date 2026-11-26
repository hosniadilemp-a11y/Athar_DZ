"""Deterministic offline HTML extraction engine (Phase 2A-HTML, Decision D17).

Parses raw HTML bytes strictly offline using BeautifulSoup4 + lxml (or stdlib
html.parser fallback). Zero outbound network requests and zero JavaScript
execution ever occur. Extracts DOM metadata, trackers, forms, JSON-LD, tables,
social posts/messages, embedded base64 images, and deterministic identifiers.
"""

from __future__ import annotations

import base64
import hashlib
import json
import logging
import re
import unicodedata
from dataclasses import dataclass, field
from typing import Any

from bs4 import BeautifulSoup, Comment, Tag

from app.services.extraction.camel_ner import get_camel_ner_device, resolve_camel_model_dir
from app.services.extraction.common_extractors import (
    AMOUNT_RE,
    DATE_ISO_RE,
    TELEGRAM_RE,
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
    normalize_phone,
    sanitize_snippet,
)
from app.services.extraction.wikineural_ner import (
    get_wikineural_ner_device,
    resolve_wikineural_model_dir,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# HTML-specific regex patterns
# ---------------------------------------------------------------------------

GA_UA_RE = re.compile(r"\b(UA-\d{4,10}-\d{1,4})\b")
GA4_RE = re.compile(r"\b(G-[A-Z0-9]{6,14})\b")
GTM_RE = re.compile(r"\b(GTM-[A-Z0-9]{4,12})\b")
FBQ_INIT_RE = re.compile(r"fbq\(\s*['\"]init['\"]\s*,\s*['\"](\d{6,20})['\"]", re.IGNORECASE)
FB_PIXEL_TEXT_RE = re.compile(r"\b(fb-pixel-\d{4,20})\b", re.IGNORECASE)
YANDEX_RE = re.compile(r"\bym\(\s*(\d{5,12})\s*,")
DATA_IMAGE_RE = re.compile(
    r"^data:(image/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$",
    re.IGNORECASE,
)
APK_URL_RE = re.compile(r"([A-Za-z0-9._\-]+\.apk)\b", re.IGNORECASE)
META_CHARSET_RE = re.compile(rb"charset\s*=\s*['\"]?([a-zA-Z0-9_\-]+)", re.IGNORECASE)
CANAL_TELEGRAM_TEXT_RE = re.compile(
    r"(?:Canal\s+Telegram|Telegram\s+Channel|Telegram|قناة\s+تيليغرام|تيليغرام)\s*[:\-]?\s*"
    r"@([a-zA-Z][a-zA-Z0-9_]{4,31})\b",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class HtmlMetadataResult:
    """Extracted structural DOM metadata of a static HTML document."""

    title: str
    lang: str
    canonical_url: str
    author: str
    description: str
    og_title: str
    og_site_name: str
    embedded_images_count: int
    forms_count: int
    scripts_count: int
    iframes_count: int
    json_ld_blocks: int
    comments_count: int
    total_text_chars: int
    form_actions: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Serialize metadata to JSON-compatible dict."""
        return {
            "title": self.title,
            "lang": self.lang,
            "canonical_url": self.canonical_url,
            "author": self.author,
            "description": self.description,
            "og_title": self.og_title,
            "og_site_name": self.og_site_name,
            "embedded_images_count": self.embedded_images_count,
            "forms_count": self.forms_count,
            "scripts_count": self.scripts_count,
            "iframes_count": self.iframes_count,
            "json_ld_blocks": self.json_ld_blocks,
            "comments_count": self.comments_count,
            "total_text_chars": self.total_text_chars,
            "form_actions": self.form_actions,
        }


@dataclass(frozen=True)
class HtmlExtractionStageOutput:
    """Result of running Mode 1 or a single Mode 2 stage on HTML bytes."""

    metadata: HtmlMetadataResult
    stage_number: int
    candidates: list[ExtractedCandidateItem]
    summary: dict[str, Any]
    relations: list[ExtractedRelationItem] = field(default_factory=list)


@dataclass
class _ParsedHtmlDom:
    soup: BeautifulSoup
    metadata: HtmlMetadataResult
    visible_text: str
    comments: list[str]
    script_texts: list[str]
    json_ld_objects: list[dict[str, Any]]
    form_actions: list[tuple[int, str]]
    links: list[tuple[str, str]]
    inline_images: list[tuple[int, str, str, int]]  # (idx, mime, sha256, byte_len)


def _decode_html_bytes(html_bytes: bytes) -> str:
    """Safely decode raw HTML bytes without crashing on mixed encodings."""
    m = META_CHARSET_RE.search(html_bytes[:4096])
    encodings: list[str] = []
    if m:
        declared = m.group(1).decode("ascii", errors="ignore").strip()
        if declared:
            encodings.append(declared)
    encodings.extend(["utf-8", "cp1252", "latin-1"])
    for enc in encodings:
        try:
            return html_bytes.decode(enc)
        except (LookupError, UnicodeDecodeError):
            continue
    return html_bytes.decode("utf-8", errors="replace")


def _make_soup(html_text: str) -> BeautifulSoup:
    try:
        return BeautifulSoup(html_text, "lxml")
    except Exception:  # noqa: BLE001
        return BeautifulSoup(html_text, "html.parser")


def _safe_attr(tag: Tag, attr: str) -> str:
    val = tag.get(attr)
    if isinstance(val, list):
        return " ".join(str(x) for x in val).strip()
    return str(val or "").strip()


def _parse_html_dom(html_bytes: bytes) -> _ParsedHtmlDom:
    """Parse HTML bytes once into safe offline DOM structures."""
    html_text = _decode_html_bytes(html_bytes)
    soup = _make_soup(html_text)

    title = sanitize_snippet(soup.title.get_text(" ", strip=True), 220) if soup.title else ""
    html_tag = soup.find("html")
    lang = _safe_attr(html_tag, "lang") if isinstance(html_tag, Tag) else ""

    canonical_url = ""
    link_canon = soup.find(
        "link",
        rel=lambda v: bool(
            v and "canonical" in [str(x).lower() for x in (v if isinstance(v, list) else [v])]
        ),
    )
    if isinstance(link_canon, Tag):
        canonical_url = _safe_attr(link_canon, "href")

    author = ""
    description = ""
    og_title = ""
    og_site_name = ""
    for meta in soup.find_all("meta"):
        if not isinstance(meta, Tag):
            continue
        name = _safe_attr(meta, "name").lower()
        prop = _safe_attr(meta, "property").lower()
        content = sanitize_snippet(_safe_attr(meta, "content"), 300)
        if not content:
            continue
        if name == "author" and not author:
            author = content
        elif name == "description" and not description:
            description = content
        elif prop == "og:title" and not og_title:
            og_title = content
        elif prop == "og:site_name" and not og_site_name:
            og_site_name = content

    comments = [
        sanitize_snippet(str(c), 400)
        for c in soup.find_all(string=lambda s: isinstance(s, Comment))
        if str(c).strip()
    ]

    forms = [f for f in soup.find_all("form") if isinstance(f, Tag)]
    form_actions: list[tuple[int, str]] = []
    for idx, form in enumerate(forms):
        act = _safe_attr(form, "action")
        if act and not act.lower().startswith("javascript:"):
            form_actions.append((idx, act))

    scripts = [s for s in soup.find_all("script") if isinstance(s, Tag)]
    script_texts: list[str] = []
    json_ld_objects: list[dict[str, Any]] = []
    for sc in scripts:
        stype = _safe_attr(sc, "type").lower()
        raw_sc = sc.string or sc.get_text() or ""
        if "ld+json" in stype:
            try:
                parsed = json.loads(raw_sc)
                if isinstance(parsed, dict):
                    json_ld_objects.append(parsed)
                elif isinstance(parsed, list):
                    json_ld_objects.extend(item for item in parsed if isinstance(item, dict))
            except Exception:  # noqa: BLE001
                logger.debug("Skipping malformed JSON-LD block")
        elif raw_sc.strip():
            script_texts.append(raw_sc)

    links: list[tuple[str, str]] = []
    for a in soup.find_all("a"):
        if not isinstance(a, Tag):
            continue
        href = _safe_attr(a, "href")
        if not href or href.lower().startswith("javascript:"):
            continue
        links.append((href, sanitize_snippet(a.get_text(" ", strip=True), 120)))

    inline_images: list[tuple[int, str, str, int]] = []
    for img in soup.find_all("img"):
        if not isinstance(img, Tag):
            continue
        src = _safe_attr(img, "src")
        m = DATA_IMAGE_RE.match(src)
        if m:
            mime = m.group(1).lower()
            b64_payload = re.sub(r"\s+", "", m.group(2))
            if len(b64_payload) <= 10_000_000:
                try:
                    raw_img = base64.b64decode(b64_payload, validate=True)
                    digest = hashlib.sha256(raw_img).hexdigest()
                    inline_images.append((len(inline_images) + 1, mime, digest, len(raw_img)))
                except Exception:  # noqa: BLE001
                    logger.debug("Invalid base64 image URI ignored")

    iframes_count = len(soup.find_all("iframe"))

    # Build visible text copy excluding <script>, <style>, <svg>
    body_clone = _make_soup(html_text)
    for tag_name in ("script", "style", "noscript"):
        for t in body_clone.find_all(tag_name):
            t.decompose()
    visible_text = unicodedata.normalize(
        "NFKC",
        "\n".join(
            line.strip()
            for line in body_clone.get_text("\n").splitlines()
            if line.strip()
        ),
    )

    metadata = HtmlMetadataResult(
        title=title,
        lang=lang,
        canonical_url=canonical_url,
        author=author,
        description=description,
        og_title=og_title,
        og_site_name=og_site_name,
        embedded_images_count=len(inline_images),
        forms_count=len(forms),
        scripts_count=len(scripts),
        iframes_count=iframes_count,
        json_ld_blocks=len(json_ld_objects),
        comments_count=len(comments),
        total_text_chars=len(visible_text),
        form_actions=[act for _, act in form_actions],
    )
    return _ParsedHtmlDom(
        soup=soup,
        metadata=metadata,
        visible_text=visible_text,
        comments=comments,
        script_texts=script_texts,
        json_ld_objects=json_ld_objects,
        form_actions=form_actions,
        links=links,
        inline_images=inline_images,
    )


def extract_html_metadata(html_bytes: bytes) -> HtmlMetadataResult:
    """Extract structural DOM metadata from raw HTML bytes."""
    return _parse_html_dom(html_bytes).metadata


def _extract_trackers_and_forms(
    dom: _ParsedHtmlDom, stage_number: int
) -> list[ExtractedCandidateItem]:
    """Extract canonical URL, form actions, trackers, APK links, and og:url/Telegram headers."""
    items: list[ExtractedCandidateItem] = []

    if dom.metadata.canonical_url.startswith(("http://", "https://")):
        items.append(
            ExtractedCandidateItem(
                entity_type="site_web",
                suggested_layer=default_non_verified_layer("site_web"),
                label=dom.metadata.canonical_url[:255],
                normalized_value=dom.metadata.canonical_url[:512],
                attributes={"url": dom.metadata.canonical_url, "source_tag": "link[rel=canonical]"},
                confidence=0.98,
                extractor_tool="html-head-meta",
                stage_number=stage_number,
                source_page=1,
                quote_snippet=f"canonical: {dom.metadata.canonical_url}"[:180],
                source_locator="head:canonical",
            )
        )

    for meta in dom.soup.find_all("meta"):
        if not isinstance(meta, Tag):
            continue
        prop = _safe_attr(meta, "property").lower()
        name = _safe_attr(meta, "name").lower()
        content = _safe_attr(meta, "content")
        if not content:
            continue
        if prop == "og:url" and ("t.me/" in content.lower() or "telegram.me/" in content.lower()):
            handle = "@" + content.rstrip("/").split("/")[-1].split("?")[0]
            items.append(
                ExtractedCandidateItem(
                    entity_type="canal_telegram",
                    suggested_layer=default_non_verified_layer("canal_telegram"),
                    label=handle,
                    normalized_value=handle,
                    attributes={"handle": handle, "url": content},
                    confidence=0.96,
                    extractor_tool="html-head-meta",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=f"og:url -> {content}"[:180],
                    source_locator="head:meta",
                )
            )
        elif name == "analytics-tracker" and content:
            items.append(
                ExtractedCandidateItem(
                    entity_type="identifiant_infrastructure",
                    suggested_layer=default_non_verified_layer("identifiant_infrastructure"),
                    label=content,
                    normalized_value=content,
                    attributes={"type_tracker": "analytics-meta", "valeur_identifiant": content},
                    confidence=0.95,
                    extractor_tool="html-tracker-parser",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=f"meta[analytics-tracker]: {content}",
                    source_locator="head:meta",
                )
            )

    for idx, action in dom.form_actions:
        if action.startswith(("http://", "https://")):
            items.append(
                ExtractedCandidateItem(
                    entity_type="site_web",
                    suggested_layer=default_non_verified_layer("site_web"),
                    label=action[:255],
                    normalized_value=action[:512],
                    attributes={"url": action, "source_tag": "form[action]"},
                    confidence=0.96,
                    extractor_tool="html-form-action",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=f"<form action='{action}'>"[:180],
                    source_locator=f"form:action#{idx}",
                )
            )

    for href, link_text in dom.links:
        lower = href.lower()
        if lower.startswith(("http://", "https://")):
            if "t.me/" in lower or "telegram.me/" in lower:
                handle = "@" + href.rstrip("/").split("/")[-1].split("?")[0]
                items.append(
                    ExtractedCandidateItem(
                        entity_type="canal_telegram",
                        suggested_layer=default_non_verified_layer("canal_telegram"),
                        label=handle,
                        normalized_value=handle,
                        attributes={"handle": handle, "url": href},
                        confidence=0.94,
                        extractor_tool="html-link-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(f"{link_text} -> {href}"),
                        source_locator="body:link",
                    )
                )
            else:
                items.append(
                    ExtractedCandidateItem(
                        entity_type="site_web",
                        suggested_layer=default_non_verified_layer("site_web"),
                        label=href[:255],
                        normalized_value=href[:512],
                        attributes={"url": href, "anchor_text": link_text},
                        confidence=0.95,
                        extractor_tool="html-link-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(f"{link_text} -> {href}"),
                        source_locator="body:link",
                    )
                )
            apk_match = APK_URL_RE.search(href)
            if apk_match:
                apk_name = apk_match.group(1)
                items.append(
                    ExtractedCandidateItem(
                        entity_type="fichier_apk",
                        suggested_layer=default_non_verified_layer("fichier_apk"),
                        label=apk_name,
                        normalized_value=apk_name,
                        attributes={"nom_paquet": apk_name, "download_url": href},
                        confidence=0.96,
                        extractor_tool="html-apk-link",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(f"Lien APK: {href}"),
                        source_locator="body:link",
                    )
                )
        elif lower.startswith("mailto:"):
            email = href[7:].split("?")[0].strip().lower()
            if "@" in email:
                items.append(
                    ExtractedCandidateItem(
                        entity_type="adresse_email",
                        suggested_layer=default_non_verified_layer("adresse_email"),
                        label=email,
                        normalized_value=email,
                        attributes={"email": email},
                        confidence=0.97,
                        extractor_tool="html-link-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"mailto:{email}",
                        source_locator="body:link",
                    )
                )
        elif lower.startswith("tel:"):
            norm = normalize_phone(href[4:])
            if len(norm) >= 8:
                items.append(
                    ExtractedCandidateItem(
                        entity_type="telephone",
                        suggested_layer=default_non_verified_layer("telephone"),
                        label=norm,
                        normalized_value=norm,
                        attributes={"numero_e164": norm},
                        confidence=0.96,
                        extractor_tool="html-link-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"tel:{norm}",
                        source_locator="body:link",
                    )
                )

    # Trackers in scripts and visible text
    tracker_sources = [*dom.script_texts, dom.visible_text]
    for src in tracker_sources:
        for pat, label_prefix, ttype in (
            (GA_UA_RE, "", "Google Analytics UA"),
            (GA4_RE, "", "Google Analytics 4"),
            (GTM_RE, "", "Google Tag Manager"),
            (FB_PIXEL_TEXT_RE, "", "Meta Pixel"),
        ):
            for m in pat.finditer(src):
                val = m.group(1)
                items.append(
                    ExtractedCandidateItem(
                        entity_type="identifiant_infrastructure",
                        suggested_layer=default_non_verified_layer("identifiant_infrastructure"),
                        label=f"{label_prefix}{val}",
                        normalized_value=val,
                        attributes={"type_tracker": ttype, "valeur_identifiant": val},
                        confidence=0.95,
                        extractor_tool="html-tracker-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(m.group(0)),
                        source_locator="script:tracker",
                    )
                )
        for m in FBQ_INIT_RE.finditer(src):
            pid = m.group(1)
            norm = f"fb-pixel-{pid}"
            items.append(
                ExtractedCandidateItem(
                    entity_type="identifiant_infrastructure",
                    suggested_layer=default_non_verified_layer("identifiant_infrastructure"),
                    label=f"Meta Pixel {pid}",
                    normalized_value=norm,
                    attributes={"type_tracker": "Meta Pixel", "valeur_identifiant": norm},
                    confidence=0.95,
                    extractor_tool="html-tracker-parser",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=sanitize_snippet(m.group(0)),
                    source_locator="script:tracker",
                )
            )
        for m in YANDEX_RE.finditer(src):
            ym_id = f"ym-{m.group(1)}"
            items.append(
                ExtractedCandidateItem(
                    entity_type="identifiant_infrastructure",
                    suggested_layer=default_non_verified_layer("identifiant_infrastructure"),
                    label=ym_id,
                    normalized_value=ym_id,
                    attributes={"type_tracker": "Yandex Metrika", "valeur_identifiant": ym_id},
                    confidence=0.93,
                    extractor_tool="html-tracker-parser",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=sanitize_snippet(m.group(0)),
                    source_locator="script:tracker",
                )
            )

    # Explicit "Canal Telegram @handle" mentions in visible text
    for m in CANAL_TELEGRAM_TEXT_RE.finditer(dom.visible_text):
        handle = f"@{m.group(1)}"
        items.append(
            ExtractedCandidateItem(
                entity_type="canal_telegram",
                suggested_layer=default_non_verified_layer("canal_telegram"),
                label=handle,
                normalized_value=handle,
                attributes={"handle": handle},
                confidence=0.94,
                extractor_tool="html-telegram-header",
                stage_number=stage_number,
                source_page=1,
                quote_snippet=sanitize_snippet(m.group(0)),
                source_locator="body:text",
            )
        )

    return items


def _extract_json_ld_candidates(
    dom: _ParsedHtmlDom, stage_number: int, *, include_stage3_types: bool
) -> list[ExtractedCandidateItem]:
    """Extract structured Schema.org JSON-LD entities cleanly."""
    items: list[ExtractedCandidateItem] = []

    def walk(obj: Any, idx: int) -> None:
        if isinstance(obj, list):
            for el in obj:
                walk(el, idx)
            return
        if not isinstance(obj, dict):
            return

        locator = f"script:ld+json#{idx}"
        stype = str(obj.get("@type") or "").lower()
        name = sanitize_snippet(str(obj.get("name") or ""), 200)
        alt_name = sanitize_snippet(str(obj.get("alternateName") or ""), 120)

        if alt_name.startswith("@") and not include_stage3_types:
            items.append(
                ExtractedCandidateItem(
                    entity_type="compte_social",
                    suggested_layer=default_non_verified_layer("compte_social"),
                    label=alt_name,
                    normalized_value=alt_name,
                    attributes={"identifiant_unique": alt_name, "nom_profil": name},
                    confidence=0.96,
                    extractor_tool="html-jsonld-parser",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=sanitize_snippet(f"JSON-LD alternateName: {alt_name}"),
                    source_locator=locator,
                )
            )

        if stype == "offer" and not include_stage3_types:
            price = re.sub(r"[^\d]", "", str(obj.get("price") or ""))
            curr = str(obj.get("priceCurrency") or "DZD").upper()
            if price:
                norm = f"{price} {curr}"
                items.append(
                    ExtractedCandidateItem(
                        entity_type="transaction_financiere",
                        suggested_layer=default_non_verified_layer("transaction_financiere"),
                        label=norm,
                        normalized_value=norm,
                        attributes={"montant": int(price), "devise": curr},
                        confidence=0.95,
                        extractor_tool="html-jsonld-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(f"JSON-LD Offer: {norm}"),
                        source_locator=locator,
                    )
                )

        if include_stage3_types:
            if stype == "person" and len(name.split()) >= 2:
                geo_attrs: dict[str, Any] = {"nom_complet": name}
                work_loc = obj.get("workLocation")
                if isinstance(work_loc, dict) and isinstance(work_loc.get("geo"), dict):
                    geo = work_loc["geo"]
                    geo_attrs["latitude"] = geo.get("latitude")
                    geo_attrs["longitude"] = geo.get("longitude")
                items.append(
                    ExtractedCandidateItem(
                        entity_type="personne",
                        suggested_layer=default_non_verified_layer("personne"),
                        label=name,
                        normalized_value=name,
                        attributes=geo_attrs,
                        confidence=0.95,
                        extractor_tool="html-jsonld-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(f"JSON-LD Person: {name}"),
                        source_locator=locator,
                    )
                )
            elif stype == "organization" and name:
                items.append(
                    ExtractedCandidateItem(
                        entity_type="entreprise",
                        suggested_layer=default_non_verified_layer("entreprise"),
                        label=name,
                        normalized_value=name,
                        attributes={"raison_sociale": name},
                        confidence=0.95,
                        extractor_tool="html-jsonld-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(f"JSON-LD Organization: {name}"),
                        source_locator=locator,
                    )
                )

        for v in obj.values():
            if isinstance(v, (dict, list)):
                walk(v, idx)

    for idx, block in enumerate(dom.json_ld_objects):
        walk(block, idx)
    return items


def _extract_html_tables(dom: _ParsedHtmlDom, stage_number: int) -> list[ExtractedCandidateItem]:
    """Parse HTML <table> rows for DZD/currency amounts and structured coordinates."""
    items: list[ExtractedCandidateItem] = []
    for t_idx, table in enumerate(dom.soup.find_all("table")):
        if not isinstance(table, Tag):
            continue
        for r_idx, tr in enumerate(table.find_all("tr")):
            if not isinstance(tr, Tag):
                continue
            cells = [
                sanitize_snippet(td.get_text(" ", strip=True), 120)
                for td in tr.find_all(["td", "th"])
                if isinstance(td, Tag)
            ]
            cells = [c for c in cells if c]
            if not cells:
                continue
            row_line = " | ".join(cells)
            date_m = DATE_ISO_RE.search(row_line)
            tx_date = date_m.group(1) if date_m else None
            for m in AMOUNT_RE.finditer(row_line):
                digits = re.sub(r"[\s\u00a0]", "", m.group(1))
                currency = m.group(2).upper()
                norm = f"{digits} {currency}"
                attrs: dict[str, Any] = {
                    "montant": int(digits),
                    "devise": currency,
                    "table_row": cells,
                    "table_row_index": r_idx,
                }
                if tx_date:
                    attrs["date_operation"] = tx_date
                items.append(
                    ExtractedCandidateItem(
                        entity_type="transaction_financiere",
                        suggested_layer=default_non_verified_layer("transaction_financiere"),
                        label=norm,
                        normalized_value=norm,
                        attributes=attrs,
                        confidence=0.94,
                        extractor_tool="html-table-parser",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=sanitize_snippet(row_line),
                        source_locator=f"body:table#{t_idx}:r{r_idx}",
                    )
                )
    return items


def _extract_social_handles(dom: _ParsedHtmlDom, stage_number: int) -> list[ExtractedCandidateItem]:
    """Extract @handles (excluding known Telegram channels) as compte_social."""
    telegram_handles = {
        f"@{m.group(1)}".lower() for m in CANAL_TELEGRAM_TEXT_RE.finditer(dom.visible_text)
    }
    for meta in dom.soup.find_all("meta"):
        if isinstance(meta, Tag) and _safe_attr(meta, "property").lower() == "og:url":
            val = _safe_attr(meta, "content")
            if "t.me/" in val.lower() or "telegram.me/" in val.lower():
                telegram_handles.add("@" + val.rstrip("/").split("/")[-1].split("?")[0].lower())

    items: list[ExtractedCandidateItem] = []
    seen: set[str] = set()
    for m in TELEGRAM_RE.finditer(dom.visible_text):
        handle = f"@{m.group(1)}"
        if handle.lower() in telegram_handles or handle.lower() in seen:
            continue
        seen.add(handle.lower())
        items.append(
            ExtractedCandidateItem(
                entity_type="compte_social",
                suggested_layer=default_non_verified_layer("compte_social"),
                label=handle,
                normalized_value=handle,
                attributes={"identifiant_unique": handle},
                confidence=0.90,
                extractor_tool="html-social-handle",
                stage_number=stage_number,
                source_page=1,
                quote_snippet=sanitize_snippet(m.group(0)),
                source_locator="body:text",
            )
        )
    return items


def _extract_posts_and_messages(
    dom: _ParsedHtmlDom, stage_number: int
) -> list[ExtractedCandidateItem]:
    """Stage 3: extract archived social posts (<article>) and chat messages (.message)."""
    items: list[ExtractedCandidateItem] = []
    for idx, art in enumerate(dom.soup.find_all("article")):
        if not isinstance(art, Tag):
            continue
        post_id = _safe_attr(art, "data-post-id") or f"article-{idx + 1}"
        text = sanitize_snippet(art.get_text(" ", strip=True), 220)
        author_tag = art.find("strong")
        author = (
            sanitize_snippet(author_tag.get_text(" ", strip=True), 80)
            if isinstance(author_tag, Tag)
            else ""
        )
        label = f"Post #{post_id} ({author})" if author else f"Post #{post_id}"
        items.append(
            ExtractedCandidateItem(
                entity_type="publication_sociale",
                suggested_layer=default_non_verified_layer("publication_sociale"),
                label=label[:255],
                normalized_value=post_id,
                attributes={"id_publication": post_id, "auteur": author, "contenu_texte": text},
                confidence=0.94,
                extractor_tool="html-article-post-parser",
                stage_number=stage_number,
                source_page=1,
                quote_snippet=text[:180],
                source_locator=f"body:article#{idx}",
            )
        )

    msg_tags = [
        t for t in dom.soup.find_all(True) if isinstance(t, Tag) and t.has_attr("data-msg-id")
    ]
    for idx, msg in enumerate(msg_tags):
        msg_id = _safe_attr(msg, "data-msg-id") or f"msg-{idx + 1}"
        sender = _safe_attr(msg, "data-sender")
        text = sanitize_snippet(msg.get_text(" ", strip=True), 220)
        label = f"Message #{msg_id} ({sender})" if sender else f"Message #{msg_id}"
        items.append(
            ExtractedCandidateItem(
                entity_type="message_chat",
                suggested_layer=default_non_verified_layer("message_chat"),
                label=label[:255],
                normalized_value=msg_id,
                attributes={"id_message": msg_id, "expediteur_id": sender, "texte_message": text},
                confidence=0.94,
                extractor_tool="html-chat-message-parser",
                stage_number=stage_number,
                source_page=1,
                quote_snippet=text[:180],
                source_locator=f"body:message#{idx}",
            )
        )
    return items


def _build_text_segments(dom: _ParsedHtmlDom) -> list[tuple[int, str, str]]:
    """Build ordered (page=1, locator, text) segments from HTML DOM."""
    segments: list[tuple[int, str, str]] = [(1, "body:text", dom.visible_text)]
    for idx, comment in enumerate(dom.comments):
        segments.append((1, f"html:comment#{idx}", comment))
    for idx, script_text in enumerate(dom.script_texts):
        segments.append((1, f"script:inline#{idx}", script_text))
    return segments


def _extract_html_dom_relations(
    dom: _ParsedHtmlDom,
    candidates: list[ExtractedCandidateItem],
    stage_number: int,
) -> list[ExtractedRelationItem]:
    """Infer DOM, JSON-LD, article, Telegram, tracker, and co-occurrence relations."""
    segments = _build_text_segments(dom)
    rels = extract_cooccurrence_relations(segments, candidates, stage_number)

    by_type: dict[str, list[ExtractedCandidateItem]] = {}
    for c in candidates:
        by_type.setdefault(c.entity_type, []).append(c)

    sites = by_type.get("site_web", [])
    primary_site = next(
        (s for s in sites if s.source_locator in {"head:canonical", "form:action#0"}),
        sites[0] if sites else None,
    )

    if primary_site is not None:
        for trk in by_type.get("identifiant_infrastructure", []):
            if trk.attributes.get("type_tracker"):
                rels.append(
                    ExtractedRelationItem(
                        relation_type="EMBARQUE_PIXEL_TRACKER",
                        source_entity_type="site_web",
                        source_normalized_value=primary_site.normalized_value,
                        target_entity_type="identifiant_infrastructure",
                        target_normalized_value=trk.normalized_value,
                        suggested_layer="INFRA",
                        attributes={},
                        confidence=0.94,
                        extractor_tool="html-dom-tracker",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"{primary_site.label} -> {trk.label}"[:180],
                        source_locator=trk.source_locator or "script:tracker",
                    )
                )
        for c2 in by_type.get("serveur_c2", []):
            rels.append(
                ExtractedRelationItem(
                    relation_type="RESOLU_VERS_IP_C2",
                    source_entity_type="site_web",
                    source_normalized_value=primary_site.normalized_value,
                    target_entity_type="serveur_c2",
                    target_normalized_value=c2.normalized_value,
                    suggested_layer="INFRA",
                    attributes={},
                    confidence=0.92,
                    extractor_tool="html-dom-c2",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=f"{primary_site.label} -> {c2.label}"[:180],
                    source_locator=c2.source_locator or "script:inline",
                )
            )
        for apk in by_type.get("fichier_apk", []):
            dl_url = str(apk.attributes.get("download_url") or primary_site.normalized_value)
            rels.append(
                ExtractedRelationItem(
                    relation_type="DISTRIBUE_APPLICATION_APK",
                    source_entity_type="site_web",
                    source_normalized_value=dl_url,
                    target_entity_type="fichier_apk",
                    target_normalized_value=apk.normalized_value,
                    suggested_layer="INFRA",
                    attributes={},
                    confidence=0.96,
                    extractor_tool="html-dom-apk",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=f"{dl_url} -> {apk.label}"[:180],
                    source_locator="body:link",
                )
            )
        for email in by_type.get("adresse_email", []):
            if email.source_locator.startswith("html:comment") or dom.metadata.forms_count > 0:
                rels.append(
                    ExtractedRelationItem(
                        relation_type="UTILISE_EMAIL",
                        source_entity_type="site_web",
                        source_normalized_value=primary_site.normalized_value,
                        target_entity_type="adresse_email",
                        target_normalized_value=email.normalized_value,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.84,
                        extractor_tool="html-dom-email",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=email.quote_snippet,
                        source_locator=email.source_locator,
                    )
                )

    # JSON-LD Person / Organization relations
    for idx, block in enumerate(dom.json_ld_objects):
        btype = str(block.get("@type") or "").lower()
        name = sanitize_snippet(str(block.get("name") or ""), 200)
        alt = sanitize_snippet(str(block.get("alternateName") or ""), 120)
        if btype == "person" and name:
            if alt.startswith("@"):
                rels.append(
                    ExtractedRelationItem(
                        relation_type="POSSEDE_PROFIL_SOCIAL",
                        source_entity_type="personne",
                        source_normalized_value=name,
                        target_entity_type="compte_social",
                        target_normalized_value=alt,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.96,
                        extractor_tool="html-jsonld-relation",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"{name} ({alt})"[:180],
                        source_locator=f"script:ld+json#{idx}",
                    )
                )
            tel_val = str(block.get("telephone") or "").strip()
            if tel_val:
                rels.append(
                    ExtractedRelationItem(
                        relation_type="UTILISE_TELEPHONE",
                        source_entity_type="personne",
                        source_normalized_value=name,
                        target_entity_type="telephone",
                        target_normalized_value=normalize_phone(tel_val),
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.96,
                        extractor_tool="html-jsonld-relation",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"{name} -> {tel_val}"[:180],
                        source_locator=f"script:ld+json#{idx}",
                    )
                )
            em_val = str(block.get("email") or "").strip().lower()
            if em_val:
                rels.append(
                    ExtractedRelationItem(
                        relation_type="UTILISE_EMAIL",
                        source_entity_type="personne",
                        source_normalized_value=name,
                        target_entity_type="adresse_email",
                        target_normalized_value=em_val,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.96,
                        extractor_tool="html-jsonld-relation",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"{name} -> {em_val}"[:180],
                        source_locator=f"script:ld+json#{idx}",
                    )
                )
        elif btype == "organization" and name:
            em_val = str(block.get("email") or "").strip().lower()
            if em_val:
                rels.append(
                    ExtractedRelationItem(
                        relation_type="UTILISE_EMAIL",
                        source_entity_type="entreprise",
                        source_normalized_value=name,
                        target_entity_type="adresse_email",
                        target_normalized_value=em_val,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.95,
                        extractor_tool="html-jsonld-relation",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"{name} -> {em_val}"[:180],
                        source_locator=f"script:ld+json#{idx}",
                    )
                )

    # <article> posts -> author compte_social & mentioned phones
    for post in by_type.get("publication_sociale", []):
        author = str(post.attributes.get("auteur") or "").strip()
        if author.startswith("@"):
            rels.append(
                ExtractedRelationItem(
                    relation_type="PUBLIE_ANNONCE_SCAM",
                    source_entity_type="compte_social",
                    source_normalized_value=author,
                    target_entity_type="publication_sociale",
                    target_normalized_value=post.normalized_value,
                    suggested_layer="OSINT_RAW",
                    attributes={},
                    confidence=0.94,
                    extractor_tool="html-article-relation",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=post.quote_snippet,
                    source_locator=post.source_locator,
                )
            )
        post_text = str(post.attributes.get("contenu_texte") or "")
        for ph in by_type.get("telephone", []):
            digits = re.sub(r"\D", "", ph.normalized_value)[-8:]
            if digits and digits in re.sub(r"\D", "", post_text):
                rels.append(
                    ExtractedRelationItem(
                        relation_type="MENTIONNE_TELEPHONE",
                        source_entity_type="publication_sociale",
                        source_normalized_value=post.normalized_value,
                        target_entity_type="telephone",
                        target_normalized_value=ph.normalized_value,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.92,
                        extractor_tool="html-article-relation",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=post.quote_snippet,
                        source_locator=post.source_locator,
                    )
                )

    # Telegram channel -> message_chat & admin compte_social
    channels = by_type.get("canal_telegram", [])
    messages = by_type.get("message_chat", [])
    if channels and messages:
        ch = channels[0]
        for msg in messages:
            rels.append(
                ExtractedRelationItem(
                    relation_type="HEBERGE_MESSAGES",
                    source_entity_type="canal_telegram",
                    source_normalized_value=ch.normalized_value,
                    target_entity_type="message_chat",
                    target_normalized_value=msg.normalized_value,
                    suggested_layer="OSINT_RAW",
                    attributes={},
                    confidence=0.95,
                    extractor_tool="html-telegram-relation",
                    stage_number=stage_number,
                    source_page=1,
                    quote_snippet=msg.quote_snippet,
                    source_locator=msg.source_locator,
                )
            )
    if channels:
        for cs in by_type.get("compte_social", []):
            if "admin" in cs.quote_snippet.lower() or "admin" in dom.visible_text.lower():
                rels.append(
                    ExtractedRelationItem(
                        relation_type="ADMINISTRE_CANAL",
                        source_entity_type="compte_social",
                        source_normalized_value=cs.normalized_value,
                        target_entity_type="canal_telegram",
                        target_normalized_value=channels[0].normalized_value,
                        suggested_layer="OSINT_RAW",
                        attributes={},
                        confidence=0.89,
                        extractor_tool="html-telegram-relation",
                        stage_number=stage_number,
                        source_page=1,
                        quote_snippet=f"{cs.normalized_value} -> {channels[0].normalized_value}",
                        source_locator="body:text",
                    )
                )

    return fuse_relations(rels)


def extract_html_mode1_quick(html_bytes: bytes) -> HtmlExtractionStageOutput:
    """Mode 1 (Analyse Rapide): offline DOM metadata, trackers, forms, and identifiers."""
    dom = _parse_html_dom(html_bytes)
    segments = _build_text_segments(dom)
    locations, per_page_locs = extract_location_attributes(segments)
    structural = _extract_trackers_and_forms(dom, stage_number=1)
    deterministic = extract_deterministic_identifiers(
        segments=segments,
        stage_number=1,
        include_transactions=False,
        extract_bare_at_as_telegram=False,
        ipv4_as_c2_when_script=True,
    )
    candidates = enrich_candidates_with_locations(
        fuse_candidates([*structural, *deterministic]), per_page_locs
    )
    relations = _extract_html_dom_relations(dom, candidates, stage_number=1)
    return HtmlExtractionStageOutput(
        metadata=dom.metadata,
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
                "forms_count": dom.metadata.forms_count,
                "scripts_count": dom.metadata.scripts_count,
                "json_ld_blocks": dom.metadata.json_ld_blocks,
                "embedded_images": dom.metadata.embedded_images_count,
                "camel_ner_device": get_camel_ner_device(),
                "wikineural_ner_device": get_wikineural_ner_device(),
            },
        ),
    )


def extract_html_mode2_stage(html_bytes: bytes, stage: int) -> HtmlExtractionStageOutput:
    """Mode 2: Stage 1 DOM/Trackers/Images, Stage 2 JSON-LD/Tables/IDs, Stage 3 Posts/Entities."""
    if stage not in {1, 2, 3}:
        raise ValueError(f"Unsupported Mode 2 stage: {stage} (expected 1, 2, or 3)")

    dom = _parse_html_dom(html_bytes)
    segments = _build_text_segments(dom)
    locations, per_page_locs = extract_location_attributes(segments)
    candidates: list[ExtractedCandidateItem] = []
    relations: list[ExtractedRelationItem] = []

    if stage == 1:
        structural = _extract_trackers_and_forms(dom, stage_number=1)
        script_net = extract_deterministic_identifiers(
            segments=[
                (1, f"script:inline#{i}", txt) for i, txt in enumerate(dom.script_texts)
            ]
            + [(1, f"html:comment#{i}", c) for i, c in enumerate(dom.comments)],
            stage_number=1,
            include_transactions=False,
            extract_bare_at_as_telegram=False,
            ipv4_as_c2_when_script=True,
        )
        img_items: list[ExtractedCandidateItem] = []
        for idx, mime, img_sha, byte_len in dom.inline_images:
            norm = f"embedded_html_img_{idx}"
            img_items.append(
                ExtractedCandidateItem(
                    entity_type="image_preuve",
                    suggested_layer=default_non_verified_layer("image_preuve"),
                    label=f"Image intégrée HTML #{idx}",
                    normalized_value=norm,
                    attributes={
                        "image_index": idx,
                        "mime_type": mime,
                        "hash_sha256": img_sha,
                        "byte_size": byte_len,
                    },
                    confidence=0.97,
                    extractor_tool="html-embedded-image",
                    stage_number=1,
                    source_page=1,
                    quote_snippet=f"Image base64 ({mime}, {byte_len} o, sha256:{img_sha[:12]}...)",
                    source_locator=f"body:img#{idx - 1}",
                )
            )
        candidates = enrich_candidates_with_locations(
            fuse_candidates([*structural, *script_net, *img_items]), per_page_locs
        )
        relations = _extract_html_dom_relations(dom, candidates, stage_number=1)
    elif stage == 2:
        json_ld = _extract_json_ld_candidates(dom, stage_number=2, include_stage3_types=False)
        tables = _extract_html_tables(dom, stage_number=2)
        social = _extract_social_handles(dom, stage_number=2)
        deterministic = extract_deterministic_identifiers(
            segments=segments,
            stage_number=2,
            include_transactions=True,
            extract_bare_at_as_telegram=False,
            ipv4_as_c2_when_script=True,
        )
        candidates = enrich_candidates_with_locations(
            fuse_candidates([*json_ld, *tables, *social, *deterministic]), per_page_locs
        )
        relations = _extract_html_dom_relations(dom, candidates, stage_number=2)
    else:
        json_ld_entities = _extract_json_ld_candidates(
            dom, stage_number=3, include_stage3_types=True
        )
        posts_msgs = _extract_posts_and_messages(dom, stage_number=3)
        contextual = extract_contextual_entities(
            segments=[(1, "body:text", dom.visible_text)],
            stage_number=3,
        )
        stage3_entities = enrich_candidates_with_locations(
            fuse_candidates([*json_ld_entities, *posts_msgs, *contextual]), per_page_locs
        )
        candidates = stage3_entities

        # Combine prior stages' entities for complete Stage 3 relation linking
        s1_structural = _extract_trackers_and_forms(dom, stage_number=1)
        s2_json_ld = _extract_json_ld_candidates(dom, stage_number=2, include_stage3_types=False)
        s2_tables = _extract_html_tables(dom, stage_number=2)
        s2_social = _extract_social_handles(dom, stage_number=2)
        s2_det = extract_deterministic_identifiers(
            segments=segments,
            stage_number=2,
            include_transactions=True,
            extract_bare_at_as_telegram=False,
            ipv4_as_c2_when_script=True,
        )
        all_entities = fuse_candidates(
            [*s1_structural, *s2_json_ld, *s2_tables, *s2_social, *s2_det, *stage3_entities]
        )
        relations = _extract_html_dom_relations(dom, all_entities, stage_number=3)

    return HtmlExtractionStageOutput(
        metadata=dom.metadata,
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
                "forms_count": dom.metadata.forms_count,
                "scripts_count": dom.metadata.scripts_count,
                "json_ld_blocks": dom.metadata.json_ld_blocks,
                "embedded_images": dom.metadata.embedded_images_count,
                "camel_ner_available": resolve_camel_model_dir() is not None,
                "camel_ner_device": get_camel_ner_device(),
                "wikineural_ner_available": resolve_wikineural_model_dir() is not None,
                "wikineural_ner_device": get_wikineural_ner_device(),
            },
        ),
    )


__all__ = [
    "HtmlExtractionStageOutput",
    "HtmlMetadataResult",
    "extract_html_metadata",
    "extract_html_mode1_quick",
    "extract_html_mode2_stage",
]
