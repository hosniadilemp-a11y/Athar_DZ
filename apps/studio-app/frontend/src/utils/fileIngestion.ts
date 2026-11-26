/**
 * Pure client-side ingestion utilities for Option B (Non-Intrusive Raw File Drop).
 *
 * Conforms to DECISIONS.md (D10, D12, D14, D15), doc/SPECIFICATION.md (Ch. 12.1 & 12.4),
 * and .agent/security-rules.md (§11: client hash is explicitly labeled as pre-seal Phase 1 preview).
 */

import type { AnalysisMode } from '../types/graph';

export type FileFamilyKey =
  | 'image'
  | 'audio'
  | 'document'
  | 'tabular_cdr'
  | 'web_osint'
  | 'video'
  | 'dfir_mobile'
  | 'email'
  | 'archive'
  | 'generic';

export interface ForensicPluginSpec {
  id: string;
  name: string;
  phase: string;
  minMode: AnalysisMode;
  descriptionFr: string;
}

export interface FileTaxonomyMatch {
  family: FileFamilyKey;
  labelFr: string;
  icon: string;
  expectedDerivedType: string;
  plugins: ForensicPluginSpec[];
}

export interface IngestionModeSpec {
  key: AnalysisMode;
  titleFr: string;
  shortTitleFr: string;
  subtitleFr: string;
  descriptionFr: string;
  targetPhase: string;
  initialProgress: number;
  stageFr: string;
  iconName: 'zap' | 'list-checks' | 'cpu';
}

export interface ProcessTreeStep {
  id: string;
  labelFr: string;
  enabled: boolean;
  requiresValidation: boolean;
  pluginIds: string[];
}

export function buildDefaultProcessTree(
  mode: AnalysisMode,
  plugins: ForensicPluginSpec[],
  selectedPluginIds: string[]
): ProcessTreeStep[] {
  const activeSet = new Set(selectedPluginIds);
  const chosenPlugins = plugins.filter((p) => activeSet.has(p.id)).map((p) => p.id);

  const steps: ProcessTreeStep[] = [
    {
      id: 'step-preseal',
      labelFr: 'Pré-scellage SHA-256 & métadonnées structurelles',
      enabled: true,
      requiresValidation: false,
      pluginIds: [],
    },
    {
      id: 'step-extractors',
      labelFr: 'Exécution des extracteurs SPI cochés',
      enabled: chosenPlugins.length > 0,
      requiresValidation: mode === 'step_by_step',
      pluginIds: chosenPlugins,
    },
    {
      id: 'step-entities',
      labelFr: "Corrélation graphe & création d'entités dérivées",
      enabled: true,
      requiresValidation: mode === 'step_by_step',
      pluginIds: [],
    },
  ];

  if (mode === 'recursive') {
    steps.push({
      id: 'step-recursive',
      labelFr: 'Réinjection autonome récursive (saturation Blackboard)',
      enabled: true,
      requiresValidation: false,
      pluginIds: chosenPlugins,
    });
  }

  return steps;
}

export const INGESTION_MODES: IngestionModeSpec[] = [
  {
    key: 'quick',
    titleFr: 'Mode 1 : Analyse Rapide',
    shortTitleFr: 'Analyse Rapide',
    subtitleFr: 'Extraction légère & prioritaire',
    descriptionFr:
      'Exécute uniquement les extracteurs légers (métadonnées EXIF, vignettes, empreintes, titres OCR) à faible charge CPU/GPU.',
    targetPhase: 'Phase 2',
    initialProgress: 20,
    stageFr: 'Extraction rapide en attente (Moteur Phase 2)',
    iconName: 'zap',
  },
  {
    key: 'step_by_step',
    titleFr: 'Mode 2 : Analyse Complète Étape par Étape',
    shortTitleFr: 'Analyse Complète',
    subtitleFr: 'Contrôle humain (Human-in-the-Loop)',
    descriptionFr:
      'Analyse exhaustive avec points de contrôle humains : vous validez chaque découverte intermédiaire avant de lancer les étapes suivantes.',
    targetPhase: 'Phase 2',
    initialProgress: 15,
    stageFr: 'Étape 1 en attente de validation humaine (Phase 2)',
    iconName: 'list-checks',
  },
  {
    key: 'recursive',
    titleFr: 'Mode 3 : Analyse Complète Autonome Récursive',
    shortTitleFr: 'Analyse Autonome',
    subtitleFr: 'Saturation informationnelle continue',
    descriptionFr:
      'Orchestration autonome et récursive de tous les plugins SPI et recoupements jusqu’à saturation du Blackboard.',
    targetPhase: 'Phase 6',
    initialProgress: 10,
    stageFr: 'Pipeline récursif autonome planifié (Phase 6)',
    iconName: 'cpu',
  },
];

// Standard FIPS 180-4 SHA-256 constants
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

/**
 * Pure TypeScript FIPS 180-4 SHA-256 fallback (used when `crypto.subtle` is absent on non-HTTPS origins).
 */
export function sha256FallbackHex(bytes: Uint8Array): string {
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);

  const bitLen = bytes.length * 8;
  const rem = (bytes.length + 1 + 8) % 64;
  const zeroPadBytes = rem === 0 ? 0 : 64 - rem;
  const padded = new Uint8Array(bytes.length + 1 + zeroPadBytes + 8);
  padded.set(bytes, 0);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  const highBits = Math.floor(bitLen / 0x100000000);
  const lowBits = bitLen >>> 0;
  view.setUint32(padded.length - 8, highBits, false);
  view.setUint32(padded.length - 4, lowBits, false);

  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15] ?? 0, 7) ^ rotr(w[i - 15] ?? 0, 18) ^ ((w[i - 15] ?? 0) >>> 3);
      const s1 = rotr(w[i - 2] ?? 0, 17) ^ rotr(w[i - 2] ?? 0, 19) ^ ((w[i - 2] ?? 0) >>> 10);
      w[i] = ((w[i - 16] ?? 0) + s0 + (w[i - 7] ?? 0) + s1) >>> 0;
    }

    let a = h[0] ?? 0;
    let b = h[1] ?? 0;
    let c = h[2] ?? 0;
    let d = h[3] ?? 0;
    let e = h[4] ?? 0;
    let f = h[5] ?? 0;
    let g = h[6] ?? 0;
    let hh = h[7] ?? 0;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + (SHA256_K[i] ?? 0) + (w[i] ?? 0)) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      hh = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h[0] = ((h[0] ?? 0) + a) >>> 0;
    h[1] = ((h[1] ?? 0) + b) >>> 0;
    h[2] = ((h[2] ?? 0) + c) >>> 0;
    h[3] = ((h[3] ?? 0) + d) >>> 0;
    h[4] = ((h[4] ?? 0) + e) >>> 0;
    h[5] = ((h[5] ?? 0) + f) >>> 0;
    h[6] = ((h[6] ?? 0) + g) >>> 0;
    h[7] = ((h[7] ?? 0) + hh) >>> 0;
  }

  return Array.from(h)
    .map((word) => word.toString(16).padStart(8, '0'))
    .join('');
}

/**
 * Computes the exact lowercase hex SHA-256 digest of a dropped File or byte buffer.
 */
export async function computeClientSha256(
  input: File | ArrayBuffer | Uint8Array
): Promise<string> {
  let bytes: Uint8Array;
  if (input instanceof Uint8Array) {
    bytes = input;
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input);
  } else {
    const buffer = await input.arrayBuffer();
    bytes = new Uint8Array(buffer);
  }

  const subtle = globalThis.crypto?.subtle;
  if (subtle && typeof subtle.digest === 'function') {
    try {
      const digestInput = new Uint8Array(bytes.byteLength);
      digestInput.set(bytes);
      const digest = await subtle.digest('SHA-256', digestInput.buffer);
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      return sha256FallbackHex(bytes);
    }
  }

  return sha256FallbackHex(bytes);
}

/**
 * Sanitizes an untrusted filename for safe React text rendering and label creation.
 */
export function sanitizeFileName(raw: string): string {
  const base = (raw || '').split(/[/\\]/).pop() ?? '';
  const cleaned = Array.from(base.replace(/\.\./g, ''))
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127 && !'<>:"|?*'.includes(ch);
    })
    .join('')
    .trim();
  if (!cleaned) return 'piece_brute';
  return cleaned.slice(0, 180);
}

export function formatByteSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 o';
  if (bytes < 1024) return `${Math.round(bytes)} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

export function truncateSha256(hash: string): string {
  if (!hash) return '—';
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

const TAXONOMY_DEFINITIONS: Record<FileFamilyKey, FileTaxonomyMatch> = {
  image: {
    family: 'image',
    labelFr: "Photographies & Captures d'Écran",
    icon: 'image',
    expectedDerivedType: 'image_preuve',
    plugins: [
      { id: 'exiftool', name: 'ExifTool 12.84', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Extraction GPS, appareil et horodatage EXIF' },
      { id: 'paddleocr', name: 'PaddleOCR v2.7', phase: 'Phase 4', minMode: 'step_by_step', descriptionFr: 'Lecture OCR des reçus, chèques et plaques' },
      { id: 'insightface', name: 'InsightFace / ArcFace', phase: 'Phase 4', minMode: 'step_by_step', descriptionFr: 'Détection et vecteurs faciaux 512-d Qdrant' },
      { id: 'yolov8x', name: 'YOLOv8x Object Detector', phase: 'Phase 4', minMode: 'recursive', descriptionFr: 'Détection objets et véhicules en arrière-plan' },
    ],
  },
  audio: {
    family: 'audio',
    labelFr: 'Notes Vocales & Fichiers Audio',
    icon: 'mic',
    expectedDerivedType: 'enregistrement_vocal',
    plugins: [
      { id: 'audio-meta', name: 'Analyseur Conteneur Audio', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Durée, codec, fréquence et empreinte acoustique' },
      { id: 'whisper-darija', name: 'Faster-Whisper (Darija DZ)', phase: 'Phase 5', minMode: 'step_by_step', descriptionFr: 'Transcription arabe dialectal algérien et montants DZD' },
      { id: 'pyannote', name: 'PyAnnote Audio 3.1', phase: 'Phase 5', minMode: 'step_by_step', descriptionFr: 'Diarisation et séparation locuteur suspect / victime' },
    ],
  },
  document: {
    family: 'document',
    labelFr: 'Procès-Verbaux & Documents Texte',
    icon: 'file-text',
    expectedDerivedType: 'document_judiciaire',
    plugins: [
      { id: 'pymupdf', name: 'PyMuPDF / pdfplumber', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Extraction texte intégral et métadonnées auteur' },
      { id: 'python-docx', name: 'python-docx', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Analyse structurelle et pièces jointes bureautiques' },
      { id: 'arabic-ner', name: 'CAMeL Tools / Qwen 2.5 NER', phase: 'Phase 2', minMode: 'step_by_step', descriptionFr: 'Repérage entités (noms, CCP/BaridiMob, téléphones)' },
    ],
  },
  tabular_cdr: {
    family: 'tabular_cdr',
    labelFr: 'Relevés Télécom & Extractions Bancaires',
    icon: 'table',
    expectedDerivedType: 'telecom_cdr',
    plugins: [
      { id: 'regex-e164-rip', name: 'Validateurs RegEx E.164 / RIP', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Détection schémas numéros DZ et comptes CCP' },
      { id: 'polars-cdr', name: 'Moteur Heuristique Polars CDR', phase: 'Phase 5', minMode: 'step_by_step', descriptionFr: 'Ingestion massive CDR, bornages BTS et chronologie' },
    ],
  },
  web_osint: {
    family: 'web_osint',
    labelFr: 'Pages Web & Captures OSINT',
    icon: 'globe',
    expectedDerivedType: 'site_web',
    plugins: [
      { id: 'beautifulsoup4', name: 'BeautifulSoup4 (Hors-ligne)', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Extraction DOM hors-ligne : métadonnées, traceurs UA-*/GTM/Meta, formulaires et liens' },
      { id: 'html-jsonld-tables', name: 'JSON-LD & Tableaux HTML', phase: 'Phase 2', minMode: 'step_by_step', descriptionFr: 'Parsing Schema.org, tableaux DZD, posts archivés et images base64' },
      { id: 'trafilatura', name: 'Trafilatura (Web Réseau)', phase: 'Phase 3', minMode: 'quick', descriptionFr: 'Extraction texte principal, e-mails et métadonnées OpenGraph distantes' },
      { id: 'archivebox', name: 'ArchiveBox ISO 28500', phase: 'Phase 3', minMode: 'step_by_step', descriptionFr: 'Scellement WARC et instantané probatoire' },
    ],
  },
  video: {
    family: 'video',
    labelFr: 'Vidéosurveillance & Vidéos',
    icon: 'video',
    expectedDerivedType: 'scelle_numerique',
    plugins: [
      { id: 'ffmpeg-keyframes', name: 'FFmpeg 6.1 Keyframes', phase: 'Phase 4', minMode: 'quick', descriptionFr: 'Horodatage flux et découpage des images clés' },
      { id: 'yolov8-video', name: 'YOLOv8 Détection Véhicules', phase: 'Phase 4', minMode: 'step_by_step', descriptionFr: 'Extraction plaques et véhicules sur images clés' },
      { id: 'insightface-video', name: 'InsightFace Vidéo', phase: 'Phase 4', minMode: 'recursive', descriptionFr: 'Rapprochement facial sur séquences extraites' },
    ],
  },
  dfir_mobile: {
    family: 'dfir_mobile',
    labelFr: 'Fichiers DFIR & Extractions Mobiles',
    icon: 'smartphone',
    expectedDerivedType: 'artefact_dfir',
    plugins: [
      { id: 'sqlite3-driver', name: 'SQLite3 Forensic Driver', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Lecture sûre des bases SQLite (messages, journaux)' },
      { id: 'jadx-androguard', name: 'Jadx / Androguard', phase: 'Phase 3', minMode: 'step_by_step', descriptionFr: 'Décompilation APK, permissions et URLs C2' },
      { id: 'scapy-tshark', name: 'Scapy / TShark', phase: 'Phase 3', minMode: 'step_by_step', descriptionFr: 'Inspection DNS, certificats TLS et flux PCAP' },
    ],
  },
  email: {
    family: 'email',
    labelFr: 'E-mails & Correspondances Brutes',
    icon: 'mail',
    expectedDerivedType: 'adresse_email',
    plugins: [
      { id: 'python-email', name: 'Python Email Parser', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'En-têtes SMTP Received, émetteur et destinataires' },
      { id: 'mail-parser', name: 'mail-parser SPF / DKIM', phase: 'Phase 2', minMode: 'step_by_step', descriptionFr: 'Vérification DKIM/DMARC et extraction pièces jointes' },
    ],
  },
  archive: {
    family: 'archive',
    labelFr: "Conteneurs d'Archives",
    icon: 'archive',
    expectedDerivedType: 'scelle_numerique',
    plugins: [
      { id: 'zipfile-safe', name: 'ZipFile Sécurisé (anti Zip-Slip)', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Inventaire arborescent et contrôle anti-Path Traversal' },
      { id: 'recursive-unpack', name: 'Réinjection Récursive Filles', phase: 'Phase 6', minMode: 'recursive', descriptionFr: 'Décompression sandboxée et scellement en cascade' },
    ],
  },
  generic: {
    family: 'generic',
    labelFr: 'Pièce Numérique Brute',
    icon: 'file-text',
    expectedDerivedType: 'scelle_numerique',
    plugins: [
      { id: 'magic-sha256', name: 'Empreinte SHA-256 & Magic Bytes', phase: 'Phase 2', minMode: 'quick', descriptionFr: 'Identification binaire et scellement WORM MinIO' },
    ],
  },
};

const EXTENSION_TO_FAMILY: Record<string, FileFamilyKey> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  heic: 'image',
  tiff: 'image',
  tif: 'image',
  opus: 'audio',
  m4a: 'audio',
  ogg: 'audio',
  mp3: 'audio',
  wav: 'audio',
  pdf: 'document',
  docx: 'document',
  doc: 'document',
  odt: 'document',
  txt: 'document',
  csv: 'tabular_cdr',
  xlsx: 'tabular_cdr',
  xls: 'tabular_cdr',
  tsv: 'tabular_cdr',
  html: 'web_osint',
  htm: 'web_osint',
  mhtml: 'web_osint',
  warc: 'web_osint',
  url: 'web_osint',
  mp4: 'video',
  mkv: 'video',
  avi: 'video',
  mov: 'video',
  apk: 'dfir_mobile',
  json: 'dfir_mobile',
  sqlite: 'dfir_mobile',
  db: 'dfir_mobile',
  pcap: 'dfir_mobile',
  plist: 'dfir_mobile',
  eml: 'email',
  msg: 'email',
  mbox: 'email',
  zip: 'archive',
  tar: 'archive',
  gz: 'archive',
  tgz: 'archive',
  rar: 'archive',
  '7z': 'archive',
};

/**
 * Classifies a dropped file into one of the 9 Chapter 12.4 forensic families.
 */
export function classifyFileTaxonomy(fileName: string, mimeType = ''): FileTaxonomyMatch {
  const cleanName = sanitizeFileName(fileName).toLowerCase();
  const ext = cleanName.includes('.') ? cleanName.split('.').pop() ?? '' : '';
  const byExt = EXTENSION_TO_FAMILY[ext];
  if (byExt) return TAXONOMY_DEFINITIONS[byExt];

  const mime = (mimeType || '').toLowerCase();
  if (mime.startsWith('image/')) return TAXONOMY_DEFINITIONS.image;
  if (mime.startsWith('audio/')) return TAXONOMY_DEFINITIONS.audio;
  if (mime.startsWith('video/')) return TAXONOMY_DEFINITIONS.video;
  if (mime === 'application/pdf' || mime === 'text/plain') return TAXONOMY_DEFINITIONS.document;
  if (mime === 'text/csv' || mime.includes('spreadsheet') || mime.includes('excel')) {
    return TAXONOMY_DEFINITIONS.tabular_cdr;
  }
  if (mime === 'text/html') return TAXONOMY_DEFINITIONS.web_osint;
  if (mime === 'application/json') return TAXONOMY_DEFINITIONS.dfir_mobile;
  if (mime === 'message/rfc822') return TAXONOMY_DEFINITIONS.email;
  if (mime.includes('zip') || mime.includes('tar') || mime.includes('compressed')) {
    return TAXONOMY_DEFINITIONS.archive;
  }

  return TAXONOMY_DEFINITIONS.generic;
}

/**
 * Returns true when a file has a live Phase 2A static backend extractor (PDF or HTML).
 */
export function isStaticIngestionSupportedFile(fileName: string, mimeType = ''): boolean {
  const cleanName = sanitizeFileName(fileName).toLowerCase();
  const ext = cleanName.includes('.') ? cleanName.split('.').pop() ?? '' : '';
  const mime = (mimeType || '').toLowerCase().split(';')[0]?.trim() ?? '';
  return (
    ext === 'pdf' ||
    mime === 'application/pdf' ||
    ext === 'html' ||
    ext === 'htm' ||
    mime === 'text/html'
  );
}

/**
 * Returns true when an analysis mode has a live static backend extractor enabled in Phase 2A.
 * Live for PDF documents and static HTML pages in Mode 1 (quick) and Mode 2 (step_by_step).
 */
export function isIngestionModeLive(
  mode: AnalysisMode,
  fileName: string,
  mimeType = ''
): boolean {
  if (mode !== 'quick' && mode !== 'step_by_step') return false;
  return isStaticIngestionSupportedFile(fileName, mimeType);
}
