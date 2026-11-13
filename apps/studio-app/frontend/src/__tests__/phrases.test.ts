import { describe, expect, it } from 'vitest';
import { PHRASE_MODULES, PHRASES, translatePhrase, localizedLabel } from '../i18n/phrases';

const ARABIC_RE = /[\u0600-\u06FF]/;

describe('phrase book (FR source -> AR / EN)', () => {
  it('has non-empty ar and en for every phrase', () => {
    for (const [fr, entry] of Object.entries(PHRASES)) {
      expect(fr.trim().length, fr).toBeGreaterThan(0);
      expect(entry.ar.trim().length, `ar missing: ${fr}`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `en missing: ${fr}`).toBeGreaterThan(0);
    }
  });

  it('arabic translations actually contain arabic script', () => {
    for (const [fr, entry] of Object.entries(PHRASES)) {
      // Pure technical tokens (e.g. "SHA-256", "JSON") may stay latin
      if (!/[a-zA-ZÀ-ÿ]{4,}/.test(fr.replace(/\{\w+\}/g, ''))) continue;
      expect(ARABIC_RE.test(entry.ar), `not arabic: ${fr} -> ${entry.ar}`).toBe(true);
    }
  });

  it('keeps the same interpolation placeholders in every locale', () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    for (const [fr, entry] of Object.entries(PHRASES)) {
      expect(ph(entry.ar), `ar placeholders: ${fr}`).toBe(ph(fr));
      expect(ph(entry.en), `en placeholders: ${fr}`).toBe(ph(fr));
    }
  });

  it('has no key duplicated across modules with different translations', () => {
    const seen = new Map<string, string>();
    for (const [mod, book] of Object.entries(PHRASE_MODULES)) {
      for (const [fr, entry] of Object.entries(book)) {
        const sig = `${entry.ar}|${entry.en}`;
        const prev = seen.get(fr);
        if (prev !== undefined) expect(prev, `conflict on "${fr}" (${mod})`).toBe(sig);
        seen.set(fr, sig);
      }
    }
  });

  it('interpolates variables and falls back to French', () => {
    expect(translatePhrase('Inconnu {n}', 'fr', { n: 3 })).toBe('Inconnu 3');
    expect(translatePhrase('__phrase_absente__', 'ar')).toBe('__phrase_absente__');
  });

  it('picks the right registry label per locale', () => {
    const def = { label_fr: 'Téléphone', label_ar: 'هاتف', label_en: 'Phone' };
    expect(localizedLabel(def, 'fr')).toBe('Téléphone');
    expect(localizedLabel(def, 'ar')).toBe('هاتف');
    expect(localizedLabel(def, 'en')).toBe('Phone');
    expect(localizedLabel({ label_fr: 'X' }, 'ar')).toBe('X');
    expect(localizedLabel(undefined, 'ar', 'fb')).toBe('fb');
  });
});
