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
};

export interface AvailableRelation {
  key: string;
  label: string;
  description?: string;
  isRecommended?: boolean;
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
 * prioritized with contextual recommendations based on entity types.
 */
export function getAvailableRelationsForNodes(
  sourceType?: string,
  targetType?: string
): Array<AvailableRelation> {
  const recommendations: AvailableRelation[] = [];
  const s = (sourceType || '').toLowerCase();
  const t = (targetType || '').toLowerCase();

  const isPhoto = (type: string) =>
    type.includes('photo') || type.includes('facial') || type.includes('image') || type.includes('media') || type.includes('cliche') || type.includes('piece_jointe');
  const isSocial = (type: string) =>
    type.includes('social') || type.includes('facebook') || type.includes('telegram') || type.includes('instagram') || type.includes('compte');
  const isPerson = (type: string) =>
    type.includes('person') || type.includes('individu') || type.includes('suspect') || type.includes('victime');
  const isVehicle = (type: string) =>
    type.includes('vehicule') || type.includes('vehicle') || type.includes('voiture');
  const isPostOrAd = (type: string) =>
    type.includes('annonce') || type.includes('post') || type.includes('publication') || type.includes('listing');
  const isPhone = (type: string) =>
    type.includes('phone') || type.includes('telephone') || type.includes('mobile') || type.includes('cdr');
  const isBank = (type: string) =>
    type.includes('bank') || type.includes('bancaire') || type.includes('postal') || type.includes('ccp') || type.includes('baridimob') || type.includes('rib');
  const isIP = (type: string) =>
    type.includes('ip') || type.includes('serveur') || type.includes('server') || type.includes('host') || type.includes('dns') || type.includes('domaine');

  // 1. Contextual Recommendations: Photo ↔ Social Account
  if ((isPhoto(s) && isSocial(t)) || (isSocial(s) && isPhoto(t))) {
    recommendations.push(
      { key: 'PHOTO_DE_PROFIL_DE', label: 'Photo de profil du compte', description: 'Cliché identifié comme avatar ou photo de profil du compte.', isRecommended: true },
      { key: 'PUBLIEE_PAR_COMPTE', label: 'Publiée par le compte', description: 'Image téléversée ou partagée dans une publication du compte.', isRecommended: true },
      { key: 'EXTRAITE_DU_PROFIL', label: 'Extraite du profil numérique', description: 'Pièce visuelle extraite lors de l’analyse technique du profil.', isRecommended: true },
      { key: 'IDENTIFIE_SUR_CLICHE', label: 'Identifié sur le cliché numérique', description: 'Compte ou utilisateur tagué ou reconnu sur l’image.', isRecommended: true }
    );
  }

  // 2. Photo ↔ Person
  if ((isPhoto(s) && isPerson(t)) || (isPerson(s) && isPhoto(t))) {
    recommendations.push(
      { key: 'REPRESENTE_PERSONNE', label: 'Représente la personne physique', description: 'Cliché figurant l’individu physique.', isRecommended: true },
      { key: 'DETIENT_CLICHE', label: 'Détient le cliché / support', description: 'Photographie retrouvée en possession de l’individu.', isRecommended: true },
      { key: 'CORRESPONDANCE_FACIALE', label: 'Correspondance biométrique faciale', description: 'Concordance biométrique faciale algorithmique positive.', isRecommended: true },
      { key: 'IDENTIFIE_SUR_CLICHE', label: 'Identifié sur le cliché numérique', description: 'Reconnaissance formelle lors d’une audition ou tapissage.', isRecommended: true }
    );
  }

  // 3. Photo ↔ Vehicle
  if ((isPhoto(s) && isVehicle(t)) || (isVehicle(s) && isPhoto(t))) {
    recommendations.push(
      { key: 'MONTRE_PLAQUE_IMMATRICULATION', label: 'Montre la plaque d’immatriculation', description: 'Lisibilité directe de la plaque minéralogique.', isRecommended: true },
      { key: 'PHOTOGRAPHIE_VEHICULE_LIEU', label: 'Véhicule photographié sur les lieux', description: 'Prise de vue du véhicule sur le lieu des faits.', isRecommended: true }
    );
  }

  // 4. Photo ↔ Listing / Ad
  if ((isPhoto(s) && isPostOrAd(t)) || (isPostOrAd(s) && isPhoto(t))) {
    recommendations.push(
      { key: 'ILLUSTRE_ANNONCE', label: 'Illustre l’annonce publiée', description: 'Cliché utilisé pour agrémenter la publication ou l’offre.', isRecommended: true }
    );
  }

  // 5. Social Account ↔ Phone
  if ((isSocial(s) && isPhone(t)) || (isPhone(s) && isSocial(t))) {
    recommendations.push(
      { key: 'ASSOCIE_AU_NUMERO', label: 'Associé au numéro de téléphone', description: 'Ligne mobile liée à l’inscription ou la double authentification.', isRecommended: true },
      { key: 'CONTACT_WHATSAPP_TELEGRAM', label: 'Canal de contact WhatsApp / Telegram', description: 'Messagerie instantanée directe liée au profil.', isRecommended: true }
    );
  }

  // 6. Social Account ↔ Bank Account
  if ((isSocial(s) && isBank(t)) || (isBank(s) && isSocial(t))) {
    recommendations.push(
      { key: 'MENTIONNE_COORDONNEES_RIB', label: 'Mentionne les coordonnées RIB / RIP', description: 'Transmission des identifiants bancaires par message direct.', isRecommended: true }
    );
  }

  // 7. Social Account ↔ IP / Server
  if ((isSocial(s) && isIP(t)) || (isIP(s) && isSocial(t))) {
    recommendations.push(
      { key: 'CONNEXION_DEPUIS_IP', label: 'Connexion établie depuis l’adresse IP', description: 'Adresse IP de connexion consignée dans les logs du réseau social.', isRecommended: true }
    );
  }

  // 8. Person ↔ Bank Account
  if ((isPerson(s) && isBank(t)) || (isBank(s) && isPerson(t))) {
    recommendations.push(
      { key: 'ACCOUNT_HOLDER', label: 'Titulaire du compte postal / bancaire', description: 'Identité certifiée par réquisition bancaire officielle.', isRecommended: true },
      { key: 'COMPTE_BENEFICIAIRE', label: 'Compte bancaire / postal bénéficiaire', description: 'Compte destinataire désigné pour recevoir les fonds.', isRecommended: true }
    );
  }

  // 9. Person ↔ Listing / Website
  if ((isPerson(s) && (isPostOrAd(t) || isIP(t))) || ((isPostOrAd(s) || isIP(s)) && isPerson(t))) {
    recommendations.push(
      { key: 'PUBLIE_ANNONCE', label: 'Publie l’annonce commerciale', description: 'Auteur ou commanditaire de la publication.', isRecommended: true },
      { key: 'SITE_WEB_LITIGIEUX', label: 'Site web litigieux', description: 'Infrastructure exploitée dans le cadre de l’infraction.', isRecommended: true },
      { key: 'EMETTEUR_COMMANDE', label: 'Émetteur de la commande', description: 'Personne ayant passé la commande en ligne.', isRecommended: true }
    );
  }

  // Second, match from ontology registry
  const registrySuggestions: AvailableRelation[] = [];
  const allRegKeys = Object.keys(registry.relation_types || {});

  allRegKeys.forEach((key) => {
    const def = (registry.relation_types as Record<string, any>)[key];
    if (!def) return;

    const sourceOk = !sourceType || !def.allowed_sources || def.allowed_sources.includes(sourceType);
    const targetOk = !targetType || !def.allowed_targets || def.allowed_targets.includes(targetType);

    if (sourceOk && targetOk) {
      registrySuggestions.push({
        key,
        label: def.label_fr || key,
        description: def.description_fr,
      });
    }
  });

  // Third, common generic investigative relations
  const genericRelations: AvailableRelation[] = [
    { key: 'COMMUNIQUE_AVEC', label: 'Communique avec (Appel, Message)', description: 'Échange de communications entre deux entités.' },
    { key: 'COMPLICE_DE', label: 'Complice de / Co-auteur', description: 'Implication conjointe dans la commission des faits.' },
    { key: 'TRANSACTION_VERS', label: 'Virement ou Flux Financier vers', description: 'Mouvement de fonds ou remise d’argent.' },
    { key: 'UTILISE_LIGNE', label: 'Utilise le terminal ou la ligne', description: 'Emploi matériel d’un équipement télécom.' },
    { key: 'HEBERGE_SUR_SERVEUR', label: 'Hébergé ou relié techniquement à', description: 'Pivot d’infrastructure ou d’hébergement web.' },
    { key: 'DETECTE_DANS_IMAGE', label: 'Identifié sur un cliché / vidéo', description: 'Présence constatée sur une pièce visuelle.' },
    { key: 'BORNE_SUR_ANTENNE', label: 'Bornage sur relais géographique', description: 'Localisation cellulaire d’un terminal.' },
    { key: 'RAPPROCHEMENT_PROBATOIRE', label: 'Rapprochement probatoire', description: 'Rapprochement motivé par éléments d’enquête concordants.' },
    { key: 'RELIE_A', label: 'Relié à (Rapprochement général)', description: 'Lien direct établi entre les deux entités.' },
    { key: 'CORRESPONDS_TO', label: 'Liaison directe (Hypothèse)', description: 'Rapprochement direct établi par l’enquêteur.' },
  ];

  // Merge deduplicating by key, preserving recommendations first
  const seenKeys = new Set<string>();
  const result: AvailableRelation[] = [];

  [...recommendations, ...registrySuggestions, ...genericRelations].forEach((item) => {
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
