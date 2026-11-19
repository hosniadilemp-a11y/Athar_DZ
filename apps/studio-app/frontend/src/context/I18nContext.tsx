import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TRANSLATIONS, type Locale, type TranslationDictionary } from '../i18n/translations';
import {
  translatePhrase,
  translateEntityLabel,
  localizedLabel,
  type PhraseVars,
  type LocalizedLabelSource,
} from '../i18n/phrases';

interface I18nContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
  /** Translate a French source phrase into the active locale. */
  tr: (fr: string, vars?: PhraseVars) => string;
  /** Translate a dynamic entity/node label or subtitle into the active locale. */
  trLabel: (raw: string) => string;
  /** Pick label_ar / label_en / label_fr from a registry definition. */
  label: (def: LocalizedLabelSource | undefined | null, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const tr = useCallback((fr: string, vars?: PhraseVars) => translatePhrase(fr, locale, vars), [locale]);
  const trLabel = useCallback((raw: string) => translateEntityLabel(raw, locale), [locale]);
  const label = useCallback(
    (def: LocalizedLabelSource | undefined | null, fallback = '') => localizedLabel(def, locale, fallback),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, dir, setLocale, t: TRANSLATIONS[locale], tr, trLabel, label }),
    [locale, dir, tr, trLabel, label],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
