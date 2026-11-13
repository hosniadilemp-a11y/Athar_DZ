/**
 * Phrase book: French source string -> { ar, en }.
 * French is the source locale. Each UI area owns one module to avoid merge conflicts.
 * Interpolation: placeholders written as {name} are replaced from `vars`.
 */
import type { Locale } from '../translations';
import { SHELL_PHRASES } from './shell';
import { MENUBAR_PHRASES } from './menubar';
import { CANVAS_PHRASES } from './canvas';
import { VIEWS_PHRASES } from './views';
import { PANELS_PHRASES } from './panels';

export interface PhraseEntry {
  ar: string;
  en: string;
}

export type PhraseBook = Record<string, PhraseEntry>;

export const PHRASE_MODULES: Record<string, PhraseBook> = {
  shell: SHELL_PHRASES,
  menubar: MENUBAR_PHRASES,
  canvas: CANVAS_PHRASES,
  views: VIEWS_PHRASES,
  panels: PANELS_PHRASES,
};

export const PHRASES: PhraseBook = Object.assign({}, ...Object.values(PHRASE_MODULES));

export type PhraseVars = Record<string, string | number>;

function interpolate(text: string, vars?: PhraseVars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export function translatePhrase(fr: string, locale: Locale, vars?: PhraseVars): string {
  if (locale === 'fr') return interpolate(fr, vars);
  const entry = PHRASES[fr];
  if (!entry) {
    if (import.meta.env?.DEV) {
      console.warn(`[i18n] Missing phrase for locale "${locale}": ${fr}`);
    }
    return interpolate(fr, vars);
  }
  return interpolate(entry[locale], vars);
}

/** Registry objects carry label_fr / label_ar / label_en. */
export interface LocalizedLabelSource {
  label_fr?: string;
  label_ar?: string;
  label_en?: string;
}

export function localizedLabel(def: LocalizedLabelSource | undefined | null, locale: Locale, fallback = ''): string {
  if (!def) return fallback;
  if (locale === 'ar') return def.label_ar || def.label_fr || fallback;
  if (locale === 'en') return def.label_en || def.label_fr || fallback;
  return def.label_fr || fallback;
}
