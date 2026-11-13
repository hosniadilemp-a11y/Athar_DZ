import type { PhraseBook } from './index';

export const SHELL_PHRASES: PhraseBook = {
  // App shell / status bar
  'Chargement du graphe forensique...': {
    ar: 'جارٍ تحميل المخطط الجنائي...',
    en: 'Loading forensic graph...',
  },
  'Affaire : {code}': {
    ar: 'الملف : {code}',
    en: 'Case: {code}',
  },
  'Nœuds affichés : {n}': {
    ar: 'الكيانات المعروضة : {n}',
    en: 'Displayed nodes: {n}',
  },
  'Relations : {n}': {
    ar: 'العلاقات : {n}',
    en: 'Relations: {n}',
  },
  'Scellé WORM : Inaltérable (SHA-256)': {
    ar: 'مختوم WORM : غير قابل للتعديل (SHA-256)',
    en: 'WORM Sealed: Immutable (SHA-256)',
  },
  "Registre d'Audit : Actif ISO 27037": {
    ar: 'سجل التدقيق : نشط ISO 27037',
    en: 'Audit Ledger: Active ISO 27037',
  },
  'Données d\'exercice judiciaires': {
    ar: 'بيانات تدريبية قضائية',
    en: 'Judicial training data',
  },
  'Fermer [Échap]': {
    ar: 'إغلاق [Échap]',
    en: 'Close [Esc]',
  },
  'Panneau Social Network Analysis': {
    ar: 'لوحة تحليل الشبكات الاجتماعية',
    en: 'Social Network Analysis Panel',
  },
  // Resizer handles
  "Redimensionner l'inspecteur judiciaire": {
    ar: 'تغيير حجم لوحة التفتيش القضائي',
    en: 'Resize judicial inspector',
  },
  'Redimensionner le panneau gauche': {
    ar: 'تغيير حجم اللوحة اليسرى',
    en: 'Resize left panel',
  },
  'Barre d\'état judiciaire et intégrité forensique': {
    ar: 'شريط الحالة القضائية والنزاهة الجنائية',
    en: 'Judicial status bar and forensic integrity',
  },
  // Domains (LeftAccordion)
  'Tous': { ar: 'الكل', en: 'All' },
  'Territoire': { ar: 'إقليم', en: 'Territory' },
  'Acteurs': { ar: 'الأطراف', en: 'Actors' },
  'Télécoms': { ar: 'الاتصالات', en: 'Telecoms' },
  'Finances': { ar: 'المالية', en: 'Finance' },
  'Cyber': { ar: 'الفضاء الإلكتروني', en: 'Cyber' },
  'Biométrie': { ar: 'القياس الحيوي', en: 'Biometrics' },
  'Preuve': { ar: 'الأدلة', en: 'Evidence' },
  // Nature filters
  'Tous (8)': { ar: 'الكل (8)', en: 'All (8)' },
  'Téléphonie (1)': { ar: 'الهاتفية (1)', en: 'Telephony (1)' },
  'Réseaux (3)': { ar: 'الشبكات (3)', en: 'Networks (3)' },
  'Web / Serveurs (2)': { ar: 'الويب / الخوادم (2)', en: 'Web / Servers (2)' },
  'Sujets (1)': { ar: 'الأشخاص (1)', en: 'Persons (1)' },
  // Toolbox header
  'Cliquer ou glisser :': { ar: 'انقر أو اسحب :', en: 'Click or drag:' },
  '{n} types': { ar: '{n} نوع', en: '{n} types' },
  // Guided queries
  'Qui encaisse les fonds BaridiMob ?': {
    ar: 'من يستلم أموال BaridiMob ؟',
    en: 'Who collects BaridiMob funds?',
  },
  'Téléphones communs identifiés ?': {
    ar: 'هل توجد هواتف مشتركة ؟',
    en: 'Common phones identified?',
  },
  'Bornages relais suspects (Oran / Alger) ?': {
    ar: 'تحديد إشارات المحطات المشبوهة (وهران / الجزائر) ؟',
    en: 'Suspicious BTS relay contacts (Oran / Algiers)?',
  },
  'Analyses': { ar: 'تحليلات', en: 'Analyses' },
  'Panneau accordéon des calques, outils et filtres': {
    ar: 'لوحة الأكورديون للطبقات والأدوات والمرشحات',
    en: 'Accordion panel for layers, tools and filters',
  },
  'Cliquer pour ajouter au centre ou glisser sur le canevas : {label}': {
    ar: 'انقر للإضافة في المركز أو اسحب إلى اللوحة : {label}',
    en: 'Click to add to center or drag onto canvas: {label}',
  },
  'Cliquer pour relier deux nœuds sur le canevas': {
    ar: 'انقر لإنشاء رابط بين كيانين على اللوحة',
    en: 'Click to link two nodes on the canvas',
  },
  'Filtrer les entités par domaine': {
    ar: 'تصفية الكيانات حسب المجال',
    en: 'Filter entities by domain',
  },
  // Phase notice
  'Phase {n}': { ar: 'المرحلة {n}', en: 'Phase {n}' },
  // Layers toolbar visibility
  'Visibilité :': { ar: 'الرؤية :', en: 'Visibility:' },
  'Afficher tous les calques': { ar: 'إظهار كل الطبقات', en: 'Show all layers' },
  'Masquer tous les calques': { ar: 'إخفاء كل الطبقات', en: 'Hide all layers' },
  'Aucun': { ar: 'لا شيء', en: 'None' },
  'Masquer': { ar: 'إخفاء', en: 'Hide' },
  'Masquer le calque': { ar: 'إخفاء الطبقة', en: 'Hide layer' },
  'Afficher': { ar: 'إظهار', en: 'Show' },
  'Afficher le calque': { ar: 'إظهار الطبقة', en: 'Show layer' },
};
