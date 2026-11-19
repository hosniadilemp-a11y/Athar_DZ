import type { Locale } from '../translations';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';

const registry = registryDataRaw as unknown as RegistryData;

export interface RelationTranslation {
  fr: string;
  ar: string;
  en: string;
}

export const KNOWN_RELATIONS_DICT: Record<string, RelationTranslation> = {
  // Mock Case Candy Wheels & OSINT Relations
  FILED_COMPLAINT: {
    fr: 'A déposé plainte',
    ar: 'قدّم شكوى رسمية',
    en: 'Filed complaint',
  },
  ORDERED_TV: {
    fr: 'A commandé un téléviseur',
    ar: 'طلب جهاز تلفاز',
    en: 'Ordered TV',
  },
  ORDERED_TYRES: {
    fr: 'A commandé des pneus',
    ar: 'طلب عجلات مطاطية',
    en: 'Ordered tyres',
  },
  ORDERED_PHONE: {
    fr: 'A commandé un téléphone',
    ar: 'طلب هاتفاً نقالاً',
    en: 'Ordered phone',
  },
  ORDERED_VISA: {
    fr: 'A commandé un visa fictif',
    ar: 'طلب تأشيرة وهمية',
    en: 'Ordered fake visa',
  },
  ORDERED_GOLD: {
    fr: 'A commandé de l’or',
    ar: 'طلب سبائك ذهب',
    en: 'Ordered gold',
  },
  ORDERED_CONTRACT: {
    fr: 'A souscrit un contrat',
    ar: 'وقّع عقداً مشبوهاً',
    en: 'Signed contract',
  },
  CLICKED_AD: {
    fr: 'A cliqué sur l’annonce',
    ar: 'نقر على الإعلان المموّل',
    en: 'Clicked advertisement',
  },
  CONTACTED_PAGE: {
    fr: 'A contacté la page',
    ar: 'تواصل مع الصفحة',
    en: 'Contacted page',
  },
  PRODUCED_RECEIPT: {
    fr: 'A fourni un reçu de virement',
    ar: 'قدّم وصل تحويل بنكي',
    en: 'Produced transfer receipt',
  },
  INSTALLED_APK: {
    fr: 'A installé l’application frauduleuse',
    ar: 'ثبّت التطبيق الخبيث',
    en: 'Installed fraudulent APK',
  },
  DELIVERS_BINARY: {
    fr: 'Distribue le binaire malveillant',
    ar: 'يوزّع الملف التنفيذي الخبيث',
    en: 'Delivers binary payload',
  },
  HOSTED_ON: {
    fr: 'Hébergé sur le serveur',
    ar: 'مستضاف على الخادم',
    en: 'Hosted on server',
  },
  HOSTS_DOWNLOAD_ON: {
    fr: 'Héberge le téléchargement sur',
    ar: 'يستضيف رابط التحميل على',
    en: 'Hosts download on',
  },
  EMBEDS_URL: {
    fr: 'Intègre l’URL malveillante',
    ar: 'يدرج الرابط المشبوه',
    en: 'Embeds URL',
  },
  INJECTS_PIXEL: {
    fr: 'Injecte le traceur Meta Pixel',
    ar: 'يحقن معرّف التتبع بيكسل',
    en: 'Injects tracker pixel',
  },
  DISPATCHES_TO_BOT: {
    fr: 'Transmet les victimes au bot Telegram',
    ar: 'يحيل الضحايا إلى بوت تيليغرام',
    en: 'Dispatches to Telegram bot',
  },
  LOGS_LEADS_TO: {
    fr: 'Enregistre les données volées vers',
    ar: 'يسجل البيانات المسروقة إلى',
    en: 'Logs victim leads to',
  },
  PUBLISHED_BY: {
    fr: 'Publié par',
    ar: 'نُشر بواسطة',
    en: 'Published by',
  },
  HAS_CHANNEL: {
    fr: 'Gère le canal Telegram',
    ar: 'يدير القناة',
    en: 'Manages channel',
  },
  OPERATOR_IN_GROUP: {
    fr: 'Opérateur dans le groupe',
    ar: 'مشغّل في المجموعة',
    en: 'Operator in group',
  },
  USED_BY_OPERATOR: {
    fr: 'Utilisé par l’opérateur',
    ar: 'مستخدم من طرف المشغّل',
    en: 'Used by operator',
  },
  CALL_TO_ACTION: {
    fr: 'Bouton d’action vers',
    ar: 'رابط دعوة للإجراء',
    en: 'Call to action link',
  },
  LINKED_OUEDKNISS: {
    fr: 'Annonce liée sur Ouedkniss',
    ar: 'إعلان مرتبط على واد كنيس',
    en: 'Linked Ouedkniss ad',
  },
  LINKED_INSTAGRAM: {
    fr: 'Compte Instagram associé',
    ar: 'حساب إنستغرام مرتبط',
    en: 'Associated Instagram',
  },
  CONTACT_PHONE: {
    fr: 'Numéro de contact affiché',
    ar: 'رقم هاتف الاتصال',
    en: 'Displayed contact phone',
  },
  CONNECTED_BTS: {
    fr: 'Bornage sur l’antenne relais',
    ar: 'اتصال ببرج التغطية الخلوي',
    en: 'Connected to cell tower',
  },
  REPORTS_TO_BOSS: {
    fr: 'Rend compte au commanditaire',
    ar: 'يتبع مباشرة للرأس المدبّر',
    en: 'Reports to syndicate boss',
  },
  REPORTS_TO_LT: {
    fr: 'Rend compte au lieutenant',
    ar: 'يتبع لمسؤول الخلية',
    en: 'Reports to lieutenant',
  },
  LEADS_CELL: {
    fr: 'Dirige la cellule',
    ar: 'يقود الخلية الميدانية',
    en: 'Leads operational cell',
  },
  HEADS_CRIME_SYNDICATE: {
    fr: 'Dirige le réseau criminel',
    ar: 'يتزعم الشبكة الإجرامية',
    en: 'Heads crime syndicate',
  },
  BRANCH_HEAD_PNEUS: {
    fr: 'Responsable branche Pneumatiques',
    ar: 'مسؤول فرع الاحتيال بالعجلات',
    en: 'Head of tyres fraud branch',
  },
  BRANCH_HEAD_VISAS: {
    fr: 'Responsable branche Fausses Visas',
    ar: 'مسؤول فرع التأشيرات الوهمية',
    en: 'Head of fake visas branch',
  },
  BRANCH_HEAD_ELECTRO: {
    fr: 'Responsable branche Électroménager',
    ar: 'مسؤول فرع الأجهزة الكهرومنزلية',
    en: 'Head of electronics fraud branch',
  },
  COMMITTED_BY: {
    fr: 'Infraction commise par',
    ar: 'مرتكبة من طرف',
    en: 'Offense committed by',
  },
  PAID_SLOT: {
    fr: 'A payé un acompte à',
    ar: 'دفع تسبيقاً مالياً إلى',
    en: 'Paid deposit slot to',
  },
  RENTED_CARD: {
    fr: 'A loué la carte bancaire de',
    ar: 'استأجر البطاقة البنكية من',
    en: 'Rented payment card of',
  },
  RENTS_CARD_FOR_15K: {
    fr: 'Loue sa carte BaridiMob (15 000 DZD)',
    ar: 'يؤجر بطاقته الذهبية مقابل 15 ألف دج',
    en: 'Rents BaridiMob card for 15k DZD',
  },
  ACCOUNT_HOLDER: {
    fr: 'Titulaire du compte postal / bancaire',
    ar: 'صاحب الحساب البريدي / البنكي',
    en: 'Bank account holder',
  },
  DRAWS_CASH_FROM_ATM: {
    fr: 'Retire des espèces au GAB',
    ar: 'يسحب أموالاً سائلة من الموزع الآلي',
    en: 'Withdraws cash from ATM',
  },
  DELIVERS_CASH_FOR_USDT: {
    fr: 'Remet le cash contre des USDT',
    ar: 'يسلّم نقوداً مقابل عملة رقمية',
    en: 'Exchanges cash for USDT',
  },
  MANAGES_P2P_MERCHANT: {
    fr: 'Gère le bureau de change P2P',
    ar: 'يدير حساب الصرافة الرقمية',
    en: 'Manages P2P merchant account',
  },
  TRANSFERS_USDT_TRC20: {
    fr: 'Virement USDT (Réseau TRC-20)',
    ar: 'تحويل عملات رقمية USDT (TRC-20)',
    en: 'Transfers USDT (TRC-20)',
  },
  CONTROLS_PRIVATE_KEY: {
    fr: 'Détient la clé privée du portefeuille',
    ar: 'يتحكم بالمفتاح الخاص للمحفظة',
    en: 'Controls wallet private key',
  },
  OPERATES_FAKE_CORP: {
    fr: 'Exploite une société écran',
    ar: 'يدير شركة وهمية واجهة',
    en: 'Operates shell company',
  },
  OPERATES_FAKE_AGENCY: {
    fr: 'Exploite une fausse agence de voyage',
    ar: 'يدير وكالة أسفار وهمية',
    en: 'Operates fake travel agency',
  },
  SHARED_PNEU_INVITE: {
    fr: 'A diffusé l’invitation du canal',
    ar: 'نشر رابط دعوة القناة',
    en: 'Shared channel invite link',
  },
  SHARED_VISA_INVITE: {
    fr: 'A diffusé l’invitation Visa',
    ar: 'نشر رابط دعوة التأشيرات',
    en: 'Shared visa invite link',
  },
  SHARED_ELECTRO_INVITE: {
    fr: 'A diffusé l’invitation Électroménager',
    ar: 'نشر رابط دعوة الأجهزة',
    en: 'Shared electronics invite link',
  },
  SHARED_VIP_INVITE: {
    fr: 'A diffusé l’invitation VIP',
    ar: 'نشر رابط القناة الخاصة',
    en: 'Shared VIP invite link',
  },
  BOSS_ORDERS_CLONES: {
    fr: 'Donne l’ordre de cloner la page',
    ar: 'أصدر أمراً باستنساخ الصفحة',
    en: 'Orders page cloning',
  },
  RECORDED_SPEECH: {
    fr: 'Enregistrement vocal authentifié',
    ar: 'تسجيل صوتي موثق',
    en: 'Recorded speech evidence',
  },
  AUDIO_LEAK_FARID: {
    fr: 'Interception audio (Suspect Farid)',
    ar: 'تسجيل صوتي للمشتبه فريد',
    en: 'Audio wiretap (Farid)',
  },
  AUDIO_LEAK_NADIA: {
    fr: 'Interception audio (Suspecte Nadia)',
    ar: 'تسجيل صوتي للمشتبهة نادية',
    en: 'Audio wiretap (Nadia)',
  },
  AUDIO_LEAK_BOSS: {
    fr: 'Interception audio (Commanditaire)',
    ar: 'تسجيل صوتي للمدبّر الرئيسي',
    en: 'Audio wiretap (Boss)',
  },
  SIGNED_BY: {
    fr: 'Signé par l’officier / greffe',
    ar: 'موقّع من طرف الضابط / كاتب الضبط',
    en: 'Signed by officer',
  },
  CONTAINS_DIRECTIVE: {
    fr: 'Contient les instructions judiciaires',
    ar: 'يتضمن التعليمات القضائية',
    en: 'Contains judicial directive',
  },
  CONTAINS_EVIDENCE: {
    fr: 'Scellé probatoire rattaché',
    ar: 'يحتوي على دليل جنائي',
    en: 'Contains evidentiary proof',
  },
  BELONGS_TO_DEV: {
    fr: 'Appartient au développeur cyber',
    ar: 'ينتمي للمطوّر البرمجي',
    en: 'Belongs to cyber developer',
  },
  CORRESPONDS_TO: {
    fr: 'Liaison directe',
    ar: 'ارتباط مباشر',
    en: 'Direct link',
  },
};

/**
 * Returns a human-readable, localized label for any relation code.
 * Falls back to registry definitions or nicely formatted title-case text.
 */
export function getRelationLabel(relationType: string, locale: Locale = 'fr'): string {
  if (!relationType) return '';

  const cleanKey = relationType.trim().toUpperCase();

  // 1. Check known dictionary
  const known = KNOWN_RELATIONS_DICT[cleanKey];
  if (known) {
    return known[locale] || known.fr;
  }

  // 2. Check official ontology registry (47 types)
  const regDef = registry.relation_types?.[cleanKey as keyof typeof registry.relation_types];
  if (regDef) {
    if (locale === 'ar' && regDef.label_ar) return regDef.label_ar;
    if (locale === 'en' && regDef.label_en) return regDef.label_en;
    if (regDef.label_fr) return regDef.label_fr;
  }

  // 3. Fallback: Humanize SNAKE_CASE cleanly
  return cleanKey
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Returns suggested relation types for connecting two nodes,
 * filtered by source and target types if defined in the registry.
 */
export function getAvailableRelationsForNodes(
  sourceType?: string,
  targetType?: string
): Array<{ key: string; label: string; description?: string }> {
  const suggestions: Array<{ key: string; label: string; description?: string }> = [];
  const allRegKeys = Object.keys(registry.relation_types || {});

  // First, find exact matches from ontology registry
  allRegKeys.forEach((key) => {
    const def = (registry.relation_types as Record<string, any>)[key];
    if (!def) return;

    const sourceOk = !sourceType || !def.allowed_sources || def.allowed_sources.includes(sourceType);
    const targetOk = !targetType || !def.allowed_targets || def.allowed_targets.includes(targetType);

    if (sourceOk && targetOk) {
      suggestions.push({
        key,
        label: def.label_fr || key,
        description: def.description_fr,
      });
    }
  });

  // Common generic investigative relations available for any nodes
  const genericRelations = [
    { key: 'COMMUNIQUE_AVEC', label: 'Communique avec (Appel, Message)', description: 'Échange de communications entre deux entités.' },
    { key: 'COMPLICE_DE', label: 'Complice de / Co-auteur', description: 'Implication conjointe dans la commission des faits.' },
    { key: 'TRANSACTION_VERS', label: 'Virement ou Flux Financier vers', description: 'Mouvement de fonds ou remise d’argent.' },
    { key: 'UTILISE_LIGNE', label: 'Utilise le terminal ou la ligne', description: 'Emploi matériel d’un équipement télécom.' },
    { key: 'HEBERGE_SUR_SERVEUR', label: 'Hébergé ou relié techniquement à', description: 'Pivot d’infrastructure ou d’hébergement web.' },
    { key: 'DETECTE_DANS_IMAGE', label: 'Identifié sur un cliché / vidéo', description: 'Présence constatée sur une pièce visuelle.' },
    { key: 'BORNE_SUR_ANTENNE', label: 'Bornage sur relais géographique', description: 'Localisation cellulaire d’un terminal.' },
    { key: 'CORRESPONDS_TO', label: 'Liaison directe (Hypothèse)', description: 'Rapprochement direct établi par l’enquêteur.' },
  ];

  genericRelations.forEach((gen) => {
    if (!suggestions.some((s) => s.key === gen.key)) {
      suggestions.push(gen);
    }
  });

  return suggestions;
}

export type EdgeCategory = 'telecom' | 'finance' | 'socmint' | 'legal' | 'general';

export const EDGE_CATEGORY_LABELS: Record<EdgeCategory, { fr: string; icon: string; color: string }> = {
  telecom: { fr: 'Télécoms & CDR', icon: 'Phone', color: '#6366f1' },
  finance: { fr: 'Finances & Virements', icon: 'CircleDollarSign', color: '#f59e0b' },
  socmint: { fr: 'Réseaux Sociaux & OSINT', icon: 'Share2', color: '#06b6d4' },
  legal: { fr: 'Procédure & Justice', icon: 'Scale', color: '#ea580c' },
  general: { fr: 'Relations Générales', icon: 'Network', color: '#94a3b8' },
};

export function getEdgeCategory(edgeType: string): EdgeCategory {
  const upper = edgeType.toUpperCase();
  if (
    upper.includes('APPEL') ||
    upper.includes('TRANSMET') ||
    upper.includes('BORNE') ||
    upper.includes('COMMUNIQUE') ||
    upper.includes('UTILISE_LIGNE') ||
    upper.includes('CELL') ||
    upper.includes('IMEI') ||
    upper.includes('IMSI')
  ) {
    return 'telecom';
  }
  if (
    upper.includes('VIREMENT') ||
    upper.includes('RETRAIT') ||
    upper.includes('TRANSACTION') ||
    upper.includes('PAIEMENT') ||
    upper.includes('RECEIPT') ||
    upper.includes('ORDERED') ||
    upper.includes('CRYPTO') ||
    upper.includes('BARIDIMOB')
  ) {
    return 'finance';
  }
  if (
    upper.includes('PAGE') ||
    upper.includes('AD') ||
    upper.includes('POST') ||
    upper.includes('PUBLIE') ||
    upper.includes('MEMBRE') ||
    upper.includes('CORRESPONDANCE') ||
    upper.includes('CHAT') ||
    upper.includes('TELEGRAM') ||
    upper.includes('SUIT') ||
    upper.includes('ADMINISTRE')
  ) {
    return 'socmint';
  }
  if (
    upper.includes('COMPLAINT') ||
    upper.includes('PLAINTE') ||
    upper.includes('MANDAT') ||
    upper.includes('SAISIE') ||
    upper.includes('CONVOQUE') ||
    upper.includes('AUDITION') ||
    upper.includes('SUSPECT') ||
    upper.includes('ENQUETE')
  ) {
    return 'legal';
  }
  return 'general';
}
