/**
 * In-memory client file preview registry for Option B dropped/imported evidence files.
 * Keeps blob URLs and lightweight decoded previews across optimistic-to-persisted ID switches.
 */

import type { FileFamilyKey } from './fileIngestion';

export interface LocalFileEntry {
  nodeId: string;
  sha256: string;
  fileName: string;
  mimeType: string;
  size: number;
  family: FileFamilyKey;
  blobUrl: string;
  file?: File;
  textPreview?: string;
  csvRows?: string[][];
  csvTotalRows?: number;
  hexHeader?: string;
}

const byNodeId = new Map<string, LocalFileEntry>();
const bySha256 = new Map<string, LocalFileEntry>();

function parseCsvPreview(rawText: string, maxRows = 25): { rows: string[][]; totalRows: number } {
  const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const rows: string[][] = [];
  for (let i = 0; i < Math.min(lines.length, maxRows); i += 1) {
    const line = lines[i] ?? '';
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c += 1) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());
    rows.push(cols);
  }
  return { rows, totalRows: lines.length };
}

function formatHexHeader(bytes: Uint8Array): string {
  const slice = bytes.slice(0, 64);
  const lines: string[] = [];
  for (let offset = 0; offset < slice.length; offset += 16) {
    const chunk = slice.slice(offset, offset + 16);
    const hexPart = Array.from(chunk)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' ')
      .padEnd(47, ' ');
    const asciiPart = Array.from(chunk)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('');
    lines.push(`${offset.toString(16).padStart(4, '0')}:  ${hexPart}  |${asciiPart}|`);
  }
  return lines.join('\n');
}

export async function registerLocalFile(
  nodeId: string,
  sha256: string,
  file: File,
  family: FileFamilyKey
): Promise<LocalFileEntry> {
  const blobUrl =
    typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
      ? URL.createObjectURL(file)
      : '';

  const entry: LocalFileEntry = {
    nodeId,
    sha256,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    family,
    blobUrl,
    file,
  };

  const lowerName = file.name.toLowerCase();
  const isTextLike =
    family === 'web_osint' ||
    family === 'email' ||
    lowerName.endsWith('.json') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md') ||
    file.type.startsWith('text/');

  try {
    if (family === 'tabular_cdr' && lowerName.endsWith('.csv')) {
      const text = await file.slice(0, 65536).text();
      const parsed = parseCsvPreview(text, 25);
      entry.csvRows = parsed.rows;
      entry.csvTotalRows = parsed.totalRows;
    } else if (isTextLike) {
      entry.textPreview = await file.slice(0, 16384).text();
    } else if (family === 'archive' || family === 'generic' || lowerName.endsWith('.sqlite') || lowerName.endsWith('.db')) {
      const buf = await file.slice(0, 64).arrayBuffer();
      entry.hexHeader = formatHexHeader(new Uint8Array(buf));
    }
  } catch {
    // Non-fatal: fallback to blob download / external tab opening
  }

  byNodeId.set(nodeId, entry);
  if (sha256) {
    bySha256.set(sha256, entry);
  }
  return entry;
}

export function rebindLocalFileNodeId(oldId: string, newId: string): void {
  const existing = byNodeId.get(oldId);
  if (!existing) return;
  const rebound: LocalFileEntry = { ...existing, nodeId: newId };
  byNodeId.set(newId, rebound);
  if (rebound.sha256) {
    bySha256.set(rebound.sha256, rebound);
  }
}

export function getLocalFileEntry(nodeId?: string | null, sha256?: string | null): LocalFileEntry | null {
  if (nodeId && byNodeId.has(nodeId)) {
    return byNodeId.get(nodeId) ?? null;
  }
  if (sha256 && bySha256.has(sha256)) {
    return bySha256.get(sha256) ?? null;
  }
  return null;
}

export function openLocalFileInNewTab(entry: LocalFileEntry): void {
  if (!entry.blobUrl || typeof window === 'undefined') return;
  window.open(entry.blobUrl, '_blank', 'noopener,noreferrer');
}
