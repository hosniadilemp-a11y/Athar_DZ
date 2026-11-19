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

const EXACT_ENTITY_LABELS: Record<string, { ar: string; en: string }> = {
  'SYNDICAT CANDY WHEELS (33.5M DZD)': {
    ar: 'شبكة كاندي ويلز الإجرامية (33.5 مليون دج)',
    en: 'CANDY WHEELS SYNDICATE (33.5M DZD)',
  },
  'Faux Bon Commande PDF': {
    ar: 'وصل طلبية مزور (PDF)',
    en: 'Fake Order Form (PDF)',
  },
  'Récépissé BaridiMob TXN': {
    ar: 'إيصال تحويل بريدي موب (TXN)',
    en: 'BaridiMob Transfer Receipt (TXN)',
  },
  'DZ-Dev & Ops Hub': {
    ar: 'مركز التطوير والعمليات (DZ-Dev)',
    en: 'DZ-Dev & Ops Hub',
  },
  'SARL Ouest Pneumatiques (Écran)': {
    ar: 'ش.ذ.م.م غرب للعجلات (شركة واجهة)',
    en: 'SARL Ouest Tyres (Shell Corp)',
  },
  'Horizon Visas Consulting (Écran)': {
    ar: 'أفق لاستشارات التأشيرات (شركة واجهة)',
    en: 'Horizon Visas Consulting (Shell Corp)',
  },
};

const AR_TOKEN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bKarim Zerrouki\b/gi, 'كريم زروقي'],
  [/\bMeriem Benali\b/gi, 'مريم بن علي'],
  [/\bDjamel E\. Mansouri\b/gi, 'جمال المنصوري'],
  [/\bSalim Kheddam\b/gi, 'سليم خدام'],
  [/\bAmina Taleb\b/gi, 'أمينة طالب'],
  [/\bRachid Bouzid\b/gi, 'رشيد بوزيد'],
  [/\bTahar Mebarki\b/gi, 'طاهر مباركي'],
  [/\bMourad Belhadj\b/gi, 'مراد بلحاج'],
  [/\bFatima Z\. Cherif\b/gi, 'فاطمة الزهراء شريف'],
  [/\bOmar Latreche\b/gi, 'عمر لطرش'],
  [/\bTarek H\./gi, 'طارق ح.'],
  [/\bEl-Hadj\b/gi, 'الحاج'],
  [/\bSofiane K\./gi, 'سفيان ك.'],
  [/\bKamel V\./gi, 'كمال ف.'],
  [/\bLe Caissier\b/gi, 'أمين الصندوق'],
  [/\bYoucef R\./gi, 'يوسف ر.'],
  [/\bNadia M\./gi, 'نادية م.'],
  [/\bDina\b/gi, 'دينا'],
  [/\bFarid T\./gi, 'فريد ت.'],
  [/\bAmine B\./gi, 'أمين ب.'],
  [/\bAmine Import\b/gi, 'أمين للاستيراد'],
  [/\bBilel S\./gi, 'بلال س.'],
  [/\bFares K\./gi, 'فارس ك.'],
  [/\bSarah T\./gi, 'سارة ت.'],
  [/\bMourad Z\./gi, 'مراد ز.'],
  [/\bLyès B\./gi, 'إلياس ب.'],
  [/\bAkram L\./gi, 'أكرم ل.'],
  [/\bWalid M\./gi, 'وليد م.'],
  [/\bSamir B\./gi, 'سمير ب.'],
  [/\bYasmine D\./gi, 'ياسمين د.'],
  [/\bPV Plainte\b/gi, 'محضر شكوى'],
  [/\bPièce\b/gi, 'حرز'],
  [/\bVocal WhatsApp\b/gi, 'تسجيل واتساب'],
  [/\bVocal Telegram\b/gi, 'تسجيل تيليغرام'],
  [/\bChat Telegram\b/gi, 'محادثة تيليغرام'],
  [/\bLog Discord\b/gi, 'سجل ديسكورد'],
  [/\bBinaire\b/gi, 'ملف تنفيذي'],
  [/\bOpérateur Pneus\b/gi, 'مشغّل عجلات'],
  [/\bOpérateur Visas\b/gi, 'مشغّل تأشيرات'],
  [/\bOpératrice Visas\b/gi, 'مشغّلة تأشيرات'],
  [/\bOpérateur Électro\b/gi, 'مشغّل كهرومنزلي'],
  [/\bOpérateur Or\b/gi, 'مشغّل ذهب'],
  [/\bOpérateur Commercial\b/gi, 'مشغّل تجاري'],
  [/\bMule BaridiMob\b/gi, 'وسيط بريدي موب'],
  [/\bLT Pneus\b/gi, 'مسؤول عجلات'],
  [/\bLT Visas\b/gi, 'مسؤولة تأشيرات'],
  [/\bLT Électro\b/gi, 'مسؤول كهرومنزلي'],
  [/\bLieutenant Pneus\b/gi, 'مسؤول فرع العجلات'],
  [/\bLieutenante Nadia\b/gi, 'المسؤولة نادية'],
  [/\bCellule Visas\b/gi, 'خلية التأشيرات'],
  [/\bCellule Pneus\b/gi, 'خلية العجلات'],
  [/\bBoss\b/gi, 'المدبّر'],
  [/\bVictime\b/gi, 'ضحية'],
  [/\bSaisie Douane\b/gi, 'حجز جمركي'],
  [/\bContrat Esp\b/gi, 'عقد إسبانيا'],
  [/\bRDV TLS\b/gi, 'موعد TLS'],
  [/\bPost FB\b/gi, 'منشور فيسبوك'],
  [/\bCompte BaridiMob Détecté\b/gi, 'حساب بريدي موب مكتشف'],
  [/\bProfil Facebook Suspect\b/gi, 'حساب فيسبوك مشبوه'],
  [/\bServeur C2 Localisé\b/gi, 'خادم تحكم C2 مكتشف'],
  [/\bAlger\b/gi, 'الجزائر'],
  [/\bOran\b/gi, 'وهران'],
  [/\bBlida\b/gi, 'البليدة'],
  [/\bConstantine\b/gi, 'قسنطينة'],
  [/\bConst\b/g, 'قسنطينة'],
  [/\bSétif\b/gi, 'سطيف'],
  [/\bAnnaba\b/gi, 'عنابة'],
  [/\bEs S[eé]nia\b/gi, 'السانية'],
  [/\bKouba\b/gi, 'القبة'],
  [/\bBoufarik\b/gi, 'بوفاريك'],
  [/\bBab El Oued\b/gi, 'باب الوادي'],
  [/\bDZD\b/g, 'دج'],
  [/\beans\b/g, 'سنة'],
  [/\bÉtudiante\b/gi, 'طالبة'],
  [/\bÉtudiant\b/gi, 'طالب'],
  [/\bIntérimaire\b/gi, 'عامل مؤقت'],
  [/\bÉcran\b/gi, 'واجهة'],
];

const EN_TOKEN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bPV Plainte\b/gi, 'Complaint Report'],
  [/\bPièce\b/gi, 'Exhibit'],
  [/\bVocal WhatsApp\b/gi, 'WhatsApp Voice'],
  [/\bVocal Telegram\b/gi, 'Telegram Voice'],
  [/\bChat Telegram\b/gi, 'Telegram Chat'],
  [/\bLog Discord\b/gi, 'Discord Log'],
  [/\bBinaire\b/gi, 'Binary'],
  [/\bOpérateur Pneus\b/gi, 'Tyres Operator'],
  [/\bOpérateur Visas\b/gi, 'Visas Operator'],
  [/\bOpératrice Visas\b/gi, 'Visas Operator'],
  [/\bOpérateur Électro\b/gi, 'Electronics Operator'],
  [/\bOpérateur Or\b/gi, 'Gold Operator'],
  [/\bOpérateur Commercial\b/gi, 'Sales Operator'],
  [/\bMule BaridiMob\b/gi, 'BaridiMob Mule'],
  [/\bLT Pneus\b/gi, 'LT Tyres'],
  [/\bLT Visas\b/gi, 'LT Visas'],
  [/\bLT Électro\b/gi, 'LT Electronics'],
  [/\bLieutenant Pneus\b/gi, 'Tyres Lieutenant'],
  [/\bCellule Visas\b/gi, 'Visas Cell'],
  [/\bCellule Pneus\b/gi, 'Tyres Cell'],
  [/\bLe Caissier\b/gi, 'The Cashier'],
  [/\bVictime\b/gi, 'Victim'],
  [/\bSaisie Douane\b/gi, 'Customs Seizure'],
  [/\bContrat Esp\b/gi, 'Spain Contract'],
  [/\bRDV TLS\b/gi, 'TLS Appointment'],
  [/\bPost FB\b/gi, 'FB Post'],
  [/\bCompte BaridiMob Détecté\b/gi, 'Detected BaridiMob Account'],
  [/\bProfil Facebook Suspect\b/gi, 'Suspect Facebook Profile'],
  [/\bServeur C2 Localisé\b/gi, 'Located C2 Server'],
  [/\bAlger\b/gi, 'Algiers'],
  [/\bConst\b/g, 'Constantine'],
  [/\bÉtudiante\b/gi, 'Student'],
  [/\bÉtudiant\b/gi, 'Student'],
  [/\bIntérimaire\b/gi, 'Temp Worker'],
  [/\bÉcran\b/gi, 'Shell Corp'],
];

/**
 * Translates dynamic entity/node labels and subtitles into Arabic or English
 * while preserving French labels verbatim in the 'fr' locale.
 */
export function translateEntityLabel(raw: string, locale: Locale): string {
  if (!raw || locale === 'fr') return raw;
  const exact = EXACT_ENTITY_LABELS[raw];
  if (exact) return exact[locale];
  const phraseMatch = PHRASES[raw];
  if (phraseMatch) return phraseMatch[locale];

  let out = raw;
  const rules = locale === 'ar' ? AR_TOKEN_REPLACEMENTS : EN_TOKEN_REPLACEMENTS;
  for (const [pattern, replacement] of rules) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
