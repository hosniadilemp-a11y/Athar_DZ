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
  // Transverse cross-entity matrix relations & neutral judicial terminology
  PHOTO_DE_PROFIL_DE: {
    fr: 'Photo de profil du compte',
    ar: 'صورة الملف الشخصي للحساب',
    en: 'Account profile photo',
  },
  PUBLIEE_PAR_COMPTE: {
    fr: 'Publiée par le compte',
    ar: 'نُشرت بواسطة الحساب',
    en: 'Published by account',
  },
  EXTRAITE_DU_PROFIL: {
    fr: 'Extraite du profil numérique',
    ar: 'مستخرجة من الملف الرقمي',
    en: 'Extracted from profile',
  },
  IDENTIFIE_SUR_CLICHE: {
    fr: 'Identifié sur le cliché numérique',
    ar: 'تم التعرف عليه في الصورة الرقمية',
    en: 'Identified on digital photo',
  },
  REPRESENTE_PERSONNE: {
    fr: 'Représente la personne physique',
    ar: 'تمثل الشخص الطبيعي',
    en: 'Depicts individual',
  },
  DETIENT_CLICHE: {
    fr: 'Détient le cliché / support',
    ar: 'يحوز الصورة / الدعامة',
    en: 'Possesses photo / media',
  },
  CORRESPONDANCE_FACIALE: {
    fr: 'Correspondance biométrique faciale',
    ar: 'تطابق القياسات الحيوية للوجه',
    en: 'Facial biometric match',
  },
  MONTRE_PLAQUE_IMMATRICULATION: {
    fr: 'Montre la plaque d’immatriculation',
    ar: 'تظهر لوحة الترقيم للمركبة',
    en: 'Shows vehicle license plate',
  },
  PHOTOGRAPHIE_VEHICULE_LIEU: {
    fr: 'Véhicule photographié sur les lieux',
    ar: 'مركبة ملتقطة في مسرح الواقعة',
    en: 'Vehicle photographed at location',
  },
  ILLUSTRE_ANNONCE: {
    fr: 'Illustre l’annonce publiée',
    ar: 'توضح الإعلان المنشور',
    en: 'Illustrates published listing',
  },
  ASSOCIE_AU_NUMERO: {
    fr: 'Associé au numéro de téléphone',
    ar: 'مرتبط برقم الهاتف',
    en: 'Associated with phone number',
  },
  CONTACT_WHATSAPP_TELEGRAM: {
    fr: 'Canal de contact WhatsApp / Telegram',
    ar: 'قناة تواصل واتساب / تيليغرام',
    en: 'WhatsApp / Telegram contact channel',
  },
  MENTIONNE_COORDONNEES_RIB: {
    fr: 'Mentionne les coordonnées RIB / RIP',
    ar: 'يذكر بيانات الحساب البريدي أو البنكي',
    en: 'Mentions bank details (RIB/RIP)',
  },
  CONNEXION_DEPUIS_IP: {
    fr: 'Connexion établie depuis l’adresse IP',
    ar: 'اتصال من عنوان الآي بي',
    en: 'Connection from IP address',
  },
  PUBLIE_ANNONCE: {
    fr: 'Publie l’annonce commerciale',
    ar: 'ينشر الإعلان التجاري',
    en: 'Publishes commercial listing',
  },
  COMPTE_BENEFICIAIRE: {
    fr: 'Compte bancaire / postal bénéficiaire',
    ar: 'الحساب البنكي / البريدي المستفيد',
    en: 'Beneficiary account',
  },
  SITE_WEB_LITIGIEUX: {
    fr: 'Site web litigieux',
    ar: 'الموقع الإلكتروني محل النزاع',
    en: 'Disputed website',
  },
  EMETTEUR_COMMANDE: {
    fr: 'Émetteur de la commande',
    ar: 'مُصدر الطلبية',
    en: 'Order issuer',
  },
  RELIE_A: {
    fr: 'Relié à (Rapprochement général)',
    ar: 'مرتبط بـ (تقارب عام)',
    en: 'Linked to (General connection)',
  },
  RAPPROCHEMENT_PROBATOIRE: {
    fr: 'Rapprochement probatoire',
    ar: 'تقارب استدلالي',
    en: 'Probative match',
  },
  EXTRAIT_DE: {
    fr: 'Extrait de la pièce',
    ar: 'مستخرج من الدليل',
    en: 'Extracted from Evidence',
  },
  UTILISE_EMAIL: {
    fr: 'Utilise l’adresse e-mail',
    ar: 'يستخدم البريد الإلكتروني',
    en: 'Uses email address',
  },
  IMPLIQUE_TRANSACTION: {
    fr: 'Implique la transaction DZD',
    ar: 'يشمل المعاملة المالية',
    en: 'Involves financial transaction',
  },
  TITULAIRE_LIGNE_SIM: {
    fr: 'Titulaire officiel de la ligne / SIM',
    ar: 'صاحب الخط أو الشريحة المسجّل',
    en: 'Registered line / SIM owner',
  },
  CONTACT_TELEPHONIQUE: {
    fr: 'Contact ou correspondant téléphonique',
    ar: 'جهة اتصال أو مراسلة هاتفية',
    en: 'Telephone contact / correspondent',
  },
  RECOIT_SMS_APPELS: {
    fr: 'Reçoit les appels / SMS ou OTP sur la ligne',
    ar: 'يستقبل المكالمات أو رموز التحقق عبر الخط',
    en: 'Receives calls / SMS / OTP on line',
  },
  DOMICILIE_A: {
    fr: 'Domicilié / résident à',
    ar: 'مقيم في',
    en: 'Resides at',
  },
  LOCALISE_A: {
    fr: 'Localisé / géolocalisé à',
    ar: 'محدد الموقع الجغرافي في',
    en: 'Located at',
  },
  NE_A: {
    fr: 'Né(e) à',
    ar: 'مولود في',
    en: 'Born in',
  },
  INTERPELLE_A: {
    fr: 'Interpellé / arrêté à',
    ar: 'أُلقي القبض عليه في',
    en: 'Apprehended at',
  },
  FREQUENTE_LIEU: {
    fr: 'Fréquente le lieu / zone',
    ar: 'يتردد على المكان أو المنطقة',
    en: 'Frequents location',
  },
  UTILISE_ADRESSE_EMAIL: {
    fr: 'Utilise ou détient l’adresse e-mail',
    ar: 'يستخدم أو يملك البريد الإلكتروني',
    en: 'Uses / owns email address',
  },
  EMPLOYE_OU_ASSOCIE: {
    fr: 'Employé, associé ou mandataire de',
    ar: 'موظف أو شريك أو وكيل لدى',
    en: 'Employee, partner or agent of',
  },
  CONDUCTEUR_HABITUEL: {
    fr: 'Conducteur habituel du véhicule',
    ar: 'السائق المعتاد للمركبة',
    en: 'Habitual driver of vehicle',
  },
  PASSAGER_IDENTIFIE: {
    fr: 'Passager identifié dans le véhicule',
    ar: 'راكب تم التعرف عليه في المركبة',
    en: 'Identified passenger in vehicle',
  },
  LIEN_FAMILIAL_CONJOINT: {
    fr: 'Lien familial ou conjoint',
    ar: 'صلة قرابة أو زواج',
    en: 'Family / spouse tie',
  },
  VICTIME_DE_ESCROQUERIE: {
    fr: 'Victime présumée des faits impliquant',
    ar: 'ضحية مفترضة في وقائع تشمل',
    en: 'Alleged victim in facts involving',
  },
  MENTIONNE_DANS_DOCUMENT: {
    fr: 'Mentionné(e) dans le procès-verbal / document',
    ar: 'مذكور في المحضر أو الوثيقة',
    en: 'Mentioned in report / document',
  },
  CORROBORATION_PREUVE: {
    fr: 'Corrobore l’élément de preuve',
    ar: 'يعزز ويدعم عنصر الإثبات',
    en: 'Corroborates evidence item',
  },
  TRANSFERT_APPEL_VERS: {
    fr: 'Appelle ou transfère vers la ligne',
    ar: 'يتصل أو يحوّل المكالمات إلى الخط',
    en: 'Calls or forwards to line',
  },
  CONVOQUE_PAR_UNITE: {
    fr: 'Convoqué / entendu par l’unité',
    ar: 'مُستدعى أو مسموع لدى الوحدة',
    en: 'Summoned / heard by unit',
  },
};

export interface AvailableRelation {
  key: string;
  label: string;
  description?: string;
  isRecommended?: boolean;
  isReverseDirection?: boolean;
}

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
 * prioritized with contextual recommendations, bidirectional registry matches, and general forensic relations.
 */
export function getAvailableRelationsForNodes(
  sourceType?: string,
  targetType?: string,
  locale: Locale = 'fr'
): Array<AvailableRelation> {
  const recommendations: AvailableRelation[] = [];
  const s = (sourceType || '').toLowerCase();
  const t = (targetType || '').toLowerCase();

  const isPhoto = (type: string) =>
    type.includes('photo') ||
    type.includes('facial') ||
    type.includes('image') ||
    type.includes('media') ||
    type.includes('cliche') ||
    type.includes('piece_jointe');
  const isAudio = (type: string) =>
    type.includes('vocal') || type.includes('audio');
  const isSocial = (type: string) =>
    type.includes('social') ||
    type.includes('facebook') ||
    type.includes('telegram') ||
    type.includes('instagram') ||
    type.includes('compte_social') ||
    type.includes('compte_reseau') ||
    type.includes('message_chat');
  const isEmail = (type: string) =>
    type.includes('email') || type.includes('courriel');
  const isPerson = (type: string) =>
    type.includes('person') ||
    type.includes('individu') ||
    type.includes('suspect') ||
    type.includes('victime') ||
    type.includes('magistrat');
  const isCompany = (type: string) =>
    type.includes('entreprise') || type.includes('unite');
  const isVehicle = (type: string) =>
    type.includes('vehicule') || type.includes('vehicle') || type.includes('voiture');
  const isPostOrAd = (type: string) =>
    type.includes('annonce') || type.includes('post') || type.includes('publication') || type.includes('listing');
  const isPhone = (type: string) =>
    type === 'telephone' ||
    type.includes('phone') ||
    type.includes('sim') ||
    type.includes('appareil_mobile') ||
    type.includes('cdr');
  const isBank = (type: string) =>
    type.includes('bank') ||
    type.includes('bancaire') ||
    type.includes('transaction_financiere') ||
    type.includes('guichet_gab') ||
    type.includes('postal') ||
    type.includes('ccp') ||
    type.includes('baridimob') ||
    type.includes('rib') ||
    type.includes('crypto');
  const isTerritory = (type: string) =>
    type === 'wilaya' ||
    type === 'daira' ||
    type === 'commune' ||
    type === 'adresse' ||
    type === 'lieu';
  const isBts = (type: string) => type.includes('antenne') || type.includes('bts');
  const isSealOrDoc = (type: string) =>
    type.includes('scelle') ||
    type.includes('document') ||
    type.includes('affaire') ||
    type.includes('artefact') ||
    type.includes('merkle');
  const isIP = (type: string) =>
    type.includes('ip') ||
    type.includes('serveur') ||
    type.includes('server') ||
    type.includes('host') ||
    type.includes('dns') ||
    type.includes('domaine') ||
    type.includes('site_web') ||
    type.includes('apk') ||
    type.includes('certificat') ||
    type.includes('infrastructure');

  const addRec = (key: string, description?: string) => {
    recommendations.push({
      key,
      label: getRelationLabel(key, locale),
      description,
      isRecommended: true,
    });
  };

  // 1. Person ↔ Person
  if (isPerson(s) && isPerson(t)) {
    addRec('COMMUNIQUE_AVEC', 'Échanges téléphoniques, messages ou rencontres entre les deux individus.');
    addRec('COMPLICE_DE', 'Participation conjointe ou co-action dans l’infraction.');
    addRec('VICTIME_DE_ESCROQUERIE', 'Lien entre personne lésée / plaignante et auteur présumé.');
    addRec('LIEN_FAMILIAL_CONJOINT', 'Parenté, alliance ou proximité familiale vérifiée.');
    addRec('REPORTS_TO_BOSS', 'Lien hiérarchique ou subordination au sein d’un réseau.');
  }

  // 2. Person ↔ Phone / SIM / Mobile
  if ((isPerson(s) && isPhone(t)) || (isPhone(s) && isPerson(t))) {
    addRec('UTILISE_TELEPHONE', 'Emploi effectif ou détention physique du numéro / terminal.');
    addRec('TITULAIRE_LIGNE_SIM', 'Identité déclarée auprès de l’opérateur télécom.');
    addRec('CONTACT_TELEPHONIQUE', 'Ligne appelée ou contactée régulièrement par l’individu.');
    addRec('RECOIT_SMS_APPELS', 'Réception de codes OTP BaridiMob ou appels d’intérêt.');
  }

  // 3. Person ↔ Bank / Crypto / GAB
  if ((isPerson(s) && isBank(t)) || (isBank(s) && isPerson(t))) {
    addRec('ACCOUNT_HOLDER', 'Identité certifiée par réquisition bancaire / postale.');
    addRec('COMPTE_BENEFICIAIRE', 'Compte destinataire ou bénéficiaire des fonds.');
    addRec('RENTS_CARD_FOR_15K', 'Mise à disposition ou location de carte de paiement (mule).');
    addRec('CONTROLS_PRIVATE_KEY', 'Contrôle ou signature des actifs du portefeuille.');
  }

  // 4. Person ↔ Social Account / Email / Post
  if ((isPerson(s) && isSocial(t)) || (isSocial(s) && isPerson(t))) {
    addRec('POSSEDE_PROFIL_SOCIAL', 'Compte ou canal administré / utilisé par la personne.');
    addRec('CONTACTED_PAGE', 'Interaction directe ou prise de contact avec la page.');
  }
  if ((isPerson(s) && isEmail(t)) || (isEmail(s) && isPerson(t))) {
    addRec('UTILISE_ADRESSE_EMAIL', 'Boîte mail attribuée ou exploitée par l’individu.');
  }

  // 5. Person ↔ Vehicle
  if ((isPerson(s) && isVehicle(t)) || (isVehicle(s) && isPerson(t))) {
    addRec('PROPRIETAIRE_VEHICULE', 'Titulaire de la carte grise / certificat d’immatriculation.');
    addRec('CONDUCTEUR_HABITUEL', 'Conducteur observé ou identifié au volant du véhicule.');
    addRec('PASSAGER_IDENTIFIE', 'Personne transportée ou signalée à bord du véhicule.');
  }

  // 6. Person ↔ Company / Unit
  if ((isPerson(s) && isCompany(t)) || (isCompany(s) && isPerson(t))) {
    addRec('DIRIGE_ENTREPRISE', 'Gérant, dirigeant de droit ou de fait de la structure.');
    addRec('EMPLOYE_OU_ASSOCIE', 'Associé, employé ou mandataire agissant pour l’entité.');
    addRec('CONVOQUE_PAR_UNITE', 'Individu entendu ou interpellé par l’unité enquêteuse.');
  }

  // 7. Person / Company / Vehicle / Phone / Bank ↔ Territory
  if (
    ((isPerson(s) || isCompany(s) || isPhone(s) || isVehicle(s) || isBank(s) || isBts(s)) &&
      isTerritory(t)) ||
    (isTerritory(s) &&
      (isPerson(t) || isCompany(t) || isPhone(t) || isVehicle(t) || isBank(t) || isBts(t)))
  ) {
    addRec('DOMICILIE_A', 'Adresse de résidence ou siège administratif déclaré.');
    addRec('LOCALISE_A', 'Localisation géographique établie (GPS, perquisition, bornage).');
    addRec('FREQUENTE_LIEU', 'Zone d’activité, point de rendez-vous ou retrait constaté.');
    addRec('INTERPELLE_A', 'Lieu d’interpellation, de constatation ou de saisie.');
    addRec('NE_A', 'Lieu de naissance mentionné à l’état civil.');
  }

  // 8. Territory ↔ Territory
  if (isTerritory(s) && isTerritory(t)) {
    addRec('APPARTIENT_A_DAIRA', 'Rattachement administratif de la commune à la daïra.');
    addRec('APPARTIENT_A_WILAYA', 'Rattachement administratif de la daïra / zone à la wilaya.');
  }

  // 9. Photo ↔ Social Account / Person / Vehicle / Listing
  if ((isPhoto(s) && isSocial(t)) || (isSocial(s) && isPhoto(t))) {
    addRec('PHOTO_DE_PROFIL_DE', 'Cliché identifié comme avatar ou photo de profil du compte.');
    addRec('PUBLIEE_PAR_COMPTE', 'Image téléversée ou partagée dans une publication du compte.');
    addRec('EXTRAITE_DU_PROFIL', 'Pièce visuelle extraite lors de l’analyse technique du profil.');
    addRec('IDENTIFIE_SUR_CLICHE', 'Compte ou utilisateur tagué ou reconnu sur l’image.');
  }
  if ((isPhoto(s) && isPerson(t)) || (isPerson(s) && isPhoto(t))) {
    addRec('REPRESENTE_PERSONNE', 'Cliché figurant l’individu physique.');
    addRec('DETIENT_CLICHE', 'Photographie retrouvée en possession de l’individu.');
    addRec('CORRESPONDANCE_FACIALE', 'Concordance biométrique faciale positive.');
    addRec('IDENTIFIE_SUR_CLICHE', 'Reconnaissance formelle lors d’une audition ou tapissage.');
  }
  if ((isPhoto(s) && isVehicle(t)) || (isVehicle(s) && isPhoto(t))) {
    addRec('MONTRE_PLAQUE_IMMATRICULATION', 'Lisibilité directe de la plaque minéralogique.');
    addRec('PHOTOGRAPHIE_VEHICULE_LIEU', 'Prise de vue du véhicule sur le lieu des faits.');
  }
  if ((isPhoto(s) && isPostOrAd(t)) || (isPostOrAd(s) && isPhoto(t))) {
    addRec('ILLUSTRE_ANNONCE', 'Cliché utilisé pour illustrer la publication ou l’offre.');
  }

  // 10. Phone ↔ Phone / BTS / Social / Bank / Email
  if (isPhone(s) && isPhone(t)) {
    addRec('TRANSFERT_APPEL_VERS', 'Communication vocale, SMS ou renvoi d’appel entre lignes.');
    addRec('INSERE_DANS_SIM', 'Association technique MSISDN / carte SIM / terminal IMEI.');
  }
  if ((isPhone(s) && isBts(t)) || (isBts(s) && isPhone(t))) {
    addRec('BORNE_SUR_ANTENNE', 'Déclenchement / bornage sur la cellule relais BTS.');
  }
  if ((isSocial(s) && isPhone(t)) || (isPhone(s) && isSocial(t))) {
    addRec('ASSOCIE_AU_NUMERO', 'Ligne mobile liée à l’inscription ou à la double authentification.');
    addRec('CONTACT_WHATSAPP_TELEGRAM', 'Messagerie instantanée directe liée au profil.');
  }
  if ((isBank(s) && isPhone(t)) || (isPhone(s) && isBank(t))) {
    addRec('RECOIT_OTP_BARIDIMOB', 'Ligne associée aux notifications SMS / OTP BaridiMob.');
    addRec('ASSOCIE_AU_NUMERO', 'Numéro de téléphone rattaché au compte bancaire ou postal.');
  }
  if ((isEmail(s) && (isSocial(t) || isBank(t) || isIP(t))) || ((isSocial(s) || isBank(s) || isIP(s)) && isEmail(t))) {
    addRec('UTILISE_ADRESSE_EMAIL', 'Adresse e-mail de récupération, contact ou administration.');
  }

  // 11. Audio ↔ Person / Social
  if ((isAudio(s) && isPerson(t)) || (isPerson(s) && isAudio(t))) {
    addRec('ATTRIBUE_A_LOCUTEUR', 'Identification vocale ou transcription attribuée au locuteur.');
    addRec('RECORDED_SPEECH', 'Enregistrement sonore rattaché à l’individu.');
  }

  // 12. Social ↔ Bank / IP
  if ((isSocial(s) && isBank(t)) || (isBank(s) && isSocial(t))) {
    addRec('MENTIONNE_COORDONNEES_RIB', 'Transmission des identifiants bancaires par message direct.');
  }
  if ((isSocial(s) && isIP(t)) || (isIP(s) && isSocial(t))) {
    addRec('CONNEXION_DEPUIS_IP', 'Adresse IP ou domaine consigné dans les journaux de connexion.');
  }

  // 13. Person ↔ Listing / Website
  if ((isPerson(s) && (isPostOrAd(t) || isIP(t))) || ((isPostOrAd(s) || isIP(s)) && isPerson(t))) {
    addRec('PUBLIE_ANNONCE', 'Auteur ou commanditaire de la publication.');
    addRec('SITE_WEB_LITIGIEUX', 'Infrastructure exploitée dans le cadre de l’infraction.');
    addRec('EMETTEUR_COMMANDE', 'Personne ayant passé la commande en ligne.');
  }

  // 14. Seals / Documents / Evidence Files ↔ Any Entity
  if (isSealOrDoc(s) || isSealOrDoc(t) || isPhoto(s) || isPhoto(t) || isAudio(s) || isAudio(t)) {
    addRec('EXTRAIT_DE', 'Entité ou indice techniquement extrait de la pièce scellée.');
    addRec('MENTIONNE_DANS_DOCUMENT', 'Élément cité ou identifié dans un procès-verbal ou document.');
    addRec('CORROBORATION_PREUVE', 'Rapprochement probatoire entre deux pièces numériques ou matérielles.');
    addRec('PROTEGE_PAR_SCELLE', 'Acte ou fichier couvert par le scellé numérique WORM.');
  }

  // Second: Match from official ontology registry in BOTH directions (source->target and target->source)
  interface RawRegistryRelation {
    label_fr?: string;
    description_fr?: string;
    allowed_sources?: string[];
    allowed_targets?: string[];
  }
  const rawRelations = registry.relation_types as unknown as Record<string, RawRegistryRelation>;
  const forwardMatches: AvailableRelation[] = [];
  const reverseMatches: AvailableRelation[] = [];
  const allRegistryFallback: AvailableRelation[] = [];

  const sType = sourceType || '';
  const tType = targetType || '';

  Object.keys(rawRelations || {}).forEach((key) => {
    const def = rawRelations[key];
    if (!def) return;

    const localized = getRelationLabel(key, locale);
    const forwardOk =
      Boolean(sType && tType) &&
      (!def.allowed_sources || def.allowed_sources.includes(sType)) &&
      (!def.allowed_targets || def.allowed_targets.includes(tType));

    const reverseOk =
      !forwardOk &&
      Boolean(sType && tType) &&
      sType !== tType &&
      (!def.allowed_sources || def.allowed_sources.includes(tType)) &&
      (!def.allowed_targets || def.allowed_targets.includes(sType));

    if (forwardOk) {
      forwardMatches.push({
        key,
        label: localized,
        description: def.description_fr,
        isRecommended: true,
      });
    } else if (reverseOk) {
      reverseMatches.push({
        key,
        label: localized,
        description: def.description_fr,
        isRecommended: true,
        isReverseDirection: true,
      });
    } else {
      allRegistryFallback.push({
        key,
        label: localized,
        description: def.description_fr,
      });
    }
  });

  // Third: Common generic investigative relations
  const genericRelations: AvailableRelation[] = [
    { key: 'RAPPROCHEMENT_PROBATOIRE', label: getRelationLabel('RAPPROCHEMENT_PROBATOIRE', locale), description: 'Rapprochement motivé par éléments d’enquête concordants.' },
    { key: 'RELIE_A', label: getRelationLabel('RELIE_A', locale), description: 'Lien direct établi entre les deux entités.' },
    { key: 'COMMUNIQUE_AVEC', label: getRelationLabel('COMMUNIQUE_AVEC', locale), description: 'Échange de communications entre deux entités.' },
    { key: 'COMPLICE_DE', label: getRelationLabel('COMPLICE_DE', locale), description: 'Implication conjointe dans la commission des faits.' },
    { key: 'TRANSACTION_VERS', label: 'Virement ou Flux Financier vers', description: 'Mouvement de fonds ou remise d’argent.' },
    { key: 'UTILISE_LIGNE', label: 'Utilise le terminal ou la ligne', description: 'Emploi matériel d’un équipement télécom.' },
    { key: 'HEBERGE_SUR_SERVEUR', label: 'Hébergé ou relié techniquement à', description: 'Pivot d’infrastructure ou d’hébergement web.' },
    { key: 'DETECTE_DANS_IMAGE', label: 'Identifié sur un cliché / vidéo', description: 'Présence constatée sur une pièce visuelle.' },
    { key: 'BORNE_SUR_ANTENNE', label: 'Bornage sur relais géographique', description: 'Localisation cellulaire d’un terminal.' },
    { key: 'CORRESPONDS_TO', label: getRelationLabel('CORRESPONDS_TO', locale), description: 'Rapprochement direct établi par l’enquêteur.' },
  ];

  // Merge deduplicating by key: contextual recommendations + bidirectional registry matches + generic + remaining registry
  const seenKeys = new Set<string>();
  const result: AvailableRelation[] = [];

  [...recommendations, ...forwardMatches, ...reverseMatches, ...genericRelations, ...allRegistryFallback].forEach((item) => {
    if (!seenKeys.has(item.key)) {
      seenKeys.add(item.key);
      result.push(item);
    }
  });

  return result;
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
