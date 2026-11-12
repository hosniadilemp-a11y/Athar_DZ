import { describe, expect, it } from 'vitest';
import { TRANSLATIONS } from '../i18n/translations';

describe('i18n dictionary', () => {
  it('defines all keys across fr, ar, and en without empty values', () => {
    const frKeys = Object.keys(TRANSLATIONS.fr);
    for (const locale of ['fr', 'ar', 'en'] as const) {
      const dict = TRANSLATIONS[locale];
      expect(Object.keys(dict)).toEqual(frKeys);
      for (const key of frKeys) {
        expect(dict[key as keyof typeof dict].trim().length).toBeGreaterThan(0);
      }
    }
    expect(TRANSLATIONS.fr.appName).toBe('Athar');
    expect(TRANSLATIONS.en.appName).toBe('Athar');
  });
});
