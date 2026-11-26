import { describe, expect, it } from 'vitest';
import {
  INGESTION_MODES,
  buildDefaultProcessTree,
  classifyFileTaxonomy,
  computeClientSha256,
  formatByteSize,
  sanitizeFileName,
  sha256FallbackHex,
  truncateSha256,
} from '../utils/fileIngestion';

describe('fileIngestion utilities (Option B)', () => {
  it('computes NIST FIPS 180-4 SHA-256 vectors identically in fallback and computeClientSha256', async () => {
    const emptyBytes = new Uint8Array(0);
    const abcBytes = new TextEncoder().encode('abc');
    const twoBlockBytes = new TextEncoder().encode(
      'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'
    );

    // Official NIST SHA-256 test vectors
    const expectedEmpty = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    const expectedAbc = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
    const expectedTwoBlock = '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1';

    expect(sha256FallbackHex(emptyBytes)).toBe(expectedEmpty);
    expect(sha256FallbackHex(abcBytes)).toBe(expectedAbc);
    expect(sha256FallbackHex(twoBlockBytes)).toBe(expectedTwoBlock);

    expect(await computeClientSha256(emptyBytes)).toBe(expectedEmpty);
    expect(await computeClientSha256(abcBytes)).toBe(expectedAbc);
    expect(await computeClientSha256(twoBlockBytes)).toBe(expectedTwoBlock);
  });

  it('sanitizes unsafe path traversals and control characters in filenames', () => {
    expect(sanitizeFileName('../../secret\\payload\u0000.pdf')).toBe('payload.pdf');
    expect(sanitizeFileName('<>:"|?*')).toBe('piece_brute');
    expect(sanitizeFileName('  facture_2026.pdf  ')).toBe('facture_2026.pdf');
  });

  it('formats byte sizes and truncates SHA-256 hashes cleanly', () => {
    expect(formatByteSize(512)).toBe('512 o');
    expect(formatByteSize(2048)).toBe('2.0 Ko');
    expect(formatByteSize(3 * 1024 * 1024)).toBe('3.00 Mo');
    expect(
      truncateSha256('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    ).toBe('ba7816bf8f…f20015ad');
    expect(truncateSha256('')).toBe('—');
  });

  it('classifies all 9 Ch. 12.4 forensic file families + generic fallback', () => {
    const cases: Array<[string, string, string, string]> = [
      ['01_photo_suspect_exif.jpg', 'image/jpeg', 'image', 'exiftool'],
      ['02_appel_darija_sample.wav', 'audio/wav', 'audio', 'audio-meta'],
      ['03_facture_sarl_fictive.pdf', 'application/pdf', 'document', 'pymupdf'],
      ['04_cdr_operateur_fictif.csv', 'text/csv', 'tabular_cdr', 'regex-e164-rip'],
      ['05_profil_osint_capture.html', 'text/html', 'web_osint', 'trafilatura'],
      ['06_camerasurveillance_frame.mp4', 'video/mp4', 'video', 'ffmpeg-keyframes'],
      ['07_journal_forensique_android.json', 'application/json', 'dfir_mobile', 'sqlite3-driver'],
      ['08_alerte_virement_fictif.eml', 'message/rfc822', 'email', 'python-email'],
      ['09_dossier_pieces_scellees.zip', 'application/zip', 'archive', 'zipfile-safe'],
      ['inconnu_binaire.bin', 'application/octet-stream', 'generic', 'magic-sha256'],
    ];

    for (const [fileName, mime, expectedFamily, firstPluginId] of cases) {
      const match = classifyFileTaxonomy(fileName, mime);
      expect(match.family).toBe(expectedFamily);
      expect(match.plugins.some((p) => p.id === firstPluginId)).toBe(true);
    }
  });

  it('exposes the 3 Decision D14/D15 analysis modes with target phases', () => {
    expect(INGESTION_MODES.map((m) => m.key)).toEqual(['quick', 'step_by_step', 'recursive']);
    expect(INGESTION_MODES[0]?.targetPhase).toBe('Phase 2');
    expect(INGESTION_MODES[1]?.targetPhase).toBe('Phase 2');
    expect(INGESTION_MODES[2]?.targetPhase).toBe('Phase 6');
  });

  it('builds editable process trees for Complète and Autonome and avoids Lock on generic files', () => {
    const photoMatch = classifyFileTaxonomy('photo.jpg', 'image/jpeg');
    const genericMatch = classifyFileTaxonomy('unknown.bin', 'application/octet-stream');
    expect(genericMatch.icon).not.toBe('lock');

    const stepTree = buildDefaultProcessTree('step_by_step', photoMatch.plugins, ['exiftool']);
    expect(stepTree.length).toBe(3);
    expect(stepTree[1]?.requiresValidation).toBe(true);
    expect(stepTree[1]?.pluginIds).toEqual(['exiftool']);

    const recTree = buildDefaultProcessTree('recursive', photoMatch.plugins, ['exiftool', 'paddleocr']);
    expect(recTree.length).toBe(4);
    expect(recTree[3]?.id).toBe('step-recursive');
  });
});
