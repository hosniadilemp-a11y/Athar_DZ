export type Locale = 'fr' | 'ar' | 'en';

export interface TranslationDictionary {
  appName: string;
  studioSubtitle: string;
  foundationTitle: string;
  foundationDesc: string;
  themeDark: string;
  themeLight: string;
  toggleThemeLabel: string;
  languageLabel: string;
  healthChecking: string;
  healthOnline: string;
  healthOffline: string;
  auditReady: string;

  // Menubar
  menuInvestigation: string;
  menuEdit: string;
  menuInsert: string;
  menuOsint: string;
  menuOsna: string;
  menuPolice: string;
  menuView: string;
  menuAi: string;

  // Modes
  modeCollect: string;
  modeAnalyze: string;
  modeReport: string;

  // Subbar & Search
  searchPlaceholder: string;
  stealthWarning: string;
  caseSelectorTitle: string;

  // Left Accordion
  layersTitle: string;
  creationTitle: string;
  linkModeLabel: string;
  filtersTitle: string;
  queriesTitle: string;
  auditLedgerBtn: string;

  // Right Inspector & Context
  caseOverviewTitle: string;
  kpiLoss: string;
  kpiLossVal: string;
  kpiVictims: string;
  kpiVictimsVal: string;
  kpiLocations: string;
  kpiLocationsVal: string;
  kpiEvidence: string;
  kpiEvidenceVal: string;
  inboxTitle: string;
  inboxBadge: string;
  inboxAddToGraph: string;
  inboxDismiss: string;

  // Phase Gating
  phaseNoticeTitle: string;
  phaseNoticeDesc: string;
  phaseNoticeClose: string;

  // Map & Geographic Tree
  mapTreeTitle: string;
  mapNationalTerritory: string;
  mapSkippedNodes: string;
  mapGeolocatedCount: string;
  mapWgs84: string;
  mapExpandAll: string;
  mapCollapseAll: string;
  mapFilterPlaceholder: string;
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  fr: {
    appName: 'Athar',
    studioSubtitle: "Studio d'Enquête Judiciaire & Forensique",
    foundationTitle: 'Socle Technique Phase 1 (v0.1)',
    foundationDesc:
      'L’architecture applicative et les moteurs Neo4j, PostgreSQL/TimescaleDB et Redis sont prêts.',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    toggleThemeLabel: 'Basculer le thème visuel',
    languageLabel: 'Langue de l’interface',
    healthChecking: 'Vérification des services…',
    healthOnline: 'Services Données : Connectés',
    healthOffline: 'Services Données : Hors ligne',
    auditReady: 'Journal d’audit : Actif (mode développement)',

    menuInvestigation: 'Dossier',
    menuEdit: 'Édition',
    menuInsert: 'Insérer',
    menuOsint: 'Outils OSINT',
    menuOsna: 'Réseaux Sociaux (OSNA)',
    menuPolice: 'Police Judiciaire',
    menuView: 'Affichage',
    menuAi: 'Assistant IA',

    modeCollect: 'Collecter',
    modeAnalyze: 'Analyser',
    modeReport: 'Rapporter',

    searchPlaceholder: 'Rechercher un indice, numéro, suspect ou lancer un outil... (Ctrl+K)',
    stealthWarning: 'ALERTE : Mode Furtif Inactif',
    caseSelectorTitle: 'Dossier Judiciaire Actif',

    layersTitle: 'Calques d’Enquête',
    creationTitle: 'Création & Liaisons',
    linkModeLabel: 'Mode Création de Liaison',
    filtersTitle: 'Filtres par Nature',
    queriesTitle: 'Questions Métier',
    auditLedgerBtn: 'Registre d’Audit Forensique',

    caseOverviewTitle: 'Synthèse de l’Affaire',
    kpiLoss: 'Préjudice Estimé',
    kpiLossVal: '1 450 000 DZD',
    kpiVictims: 'Plaintes Rattachées',
    kpiVictimsVal: '6 Victimes',
    kpiLocations: 'Wilayas Impliquées',
    kpiLocationsVal: 'Alger, Oran, Blida',
    kpiEvidence: 'Preuves Scellées',
    kpiEvidenceVal: '100% SHA-256',
    inboxTitle: 'Boîte d’Arbitrage des Indices',
    inboxBadge: '3 en attente',
    inboxAddToGraph: 'Verser au Dossier',
    inboxDismiss: 'Écarter',

    phaseNoticeTitle: 'Fonctionnalité Hors Phase 1',
    phaseNoticeDesc: 'Cette brique forensique est planifiée pour un jalon ultérieur de la feuille de route sovereign.',
    phaseNoticeClose: 'Compris',

    mapTreeTitle: 'Arborescence Territoriale',
    mapNationalTerritory: 'Territoire National (Algérie)',
    mapSkippedNodes: 'Hors Carte (Sans GPS)',
    mapGeolocatedCount: 'entités géolocalisées',
    mapWgs84: 'WGS-84 / Projection Conforme Algérie',
    mapExpandAll: 'Tout déplier',
    mapCollapseAll: 'Tout replier',
    mapFilterPlaceholder: 'Filtrer entités, wilayas...',
  },
  ar: {
    appName: 'أثر',
    studioSubtitle: 'منصة التحقيق القضائي والتحليل الجنائي',
    foundationTitle: 'القاعدة التقنية — المرحلة 1 (v0.1)',
    foundationDesc:
      'تم ربط خادم التطبيق وقواعد البيانات Neo4j و PostgreSQL و Redis بنجاح.',
    themeDark: 'داكن',
    themeLight: 'فاتح',
    toggleThemeLabel: 'تبديل المظهر',
    languageLabel: 'لغة الواجهة',
    healthChecking: 'جاري فحص الخدمات…',
    healthOnline: 'خدمات البيانات: متصلة',
    healthOffline: 'خدمات البيانات: غير متصلة',
    auditReady: 'سجل التدقيق: نشط (وضع التطوير)',

    menuInvestigation: 'الملف',
    menuEdit: 'تعديل',
    menuInsert: 'إدراج',
    menuOsint: 'أدوات OSINT',
    menuOsna: 'الشبكات الاجتماعية',
    menuPolice: 'الشرطة القضائية',
    menuView: 'العرض',
    menuAi: 'المساعد الذكي',

    modeCollect: 'جمع البيانات',
    modeAnalyze: 'تحليل',
    modeReport: 'إعداد التقرير',

    searchPlaceholder: 'البحث عن دليل، هاتف، مشتبه به أو تشغيل أداة... (Ctrl+K)',
    stealthWarning: 'تنبيه: وضع التخفي غير نشط',
    caseSelectorTitle: 'الملف القضائي النشط',

    layersTitle: 'طبقات التحقيق',
    creationTitle: 'إنشاء وربط الأدلة',
    linkModeLabel: 'وضع إنشاء الروابط',
    filtersTitle: 'التصفية حسب النوع',
    queriesTitle: 'استعلامات التحقيق',
    auditLedgerBtn: 'سجل التدقيق الجنائي',

    caseOverviewTitle: 'ملخص القضية',
    kpiLoss: 'الضرر المالي التقديري',
    kpiLossVal: '1 450 000 دج',
    kpiVictims: 'الشكاوى المقترنة',
    kpiVictimsVal: '6 ضحايا',
    kpiLocations: 'الولايات المعنية',
    kpiLocationsVal: 'الجزائر، وهران، البليدة',
    kpiEvidence: 'الأدلة المختومة',
    kpiEvidenceVal: '100% SHA-256',
    inboxTitle: 'صندوق فحص الأدلة الجديدة',
    inboxBadge: '3 قيد المراجعة',
    inboxAddToGraph: 'إيداع بالملف',
    inboxDismiss: 'استبعاد',

    phaseNoticeTitle: 'خاصية مجدولة للمراحل القادمة',
    phaseNoticeDesc: 'هذه الوحدة مبرمجة لمرحلة لاحقة في خريطة طريق النظام.',
    phaseNoticeClose: 'موافق',

    mapTreeTitle: 'شجرة التوزيع الجغرافي',
    mapNationalTerritory: 'التراب الوطني (الجزائر)',
    mapSkippedNodes: 'خارج الخريطة (دون إحداثيات)',
    mapGeolocatedCount: 'كيانات محددة جغرافياً',
    mapWgs84: 'WGS-84 / إسقاط معتمد للجزائر',
    mapExpandAll: 'توسيع الكل',
    mapCollapseAll: 'طي الكل',
    mapFilterPlaceholder: 'تصفية الكيانات والولايات...',
  },
  en: {
    appName: 'Athar',
    studioSubtitle: 'Judicial Investigation & OSINT Studio',
    foundationTitle: 'Phase 1 Technical Foundation (v0.1)',
    foundationDesc:
      'Application tier and Neo4j, PostgreSQL/TimescaleDB, and Redis data services are initialized.',
    themeDark: 'Dark',
    themeLight: 'Light',
    toggleThemeLabel: 'Toggle visual theme',
    languageLabel: 'Interface language',
    healthChecking: 'Checking data services…',
    healthOnline: 'Data Services: Connected',
    healthOffline: 'Data Services: Offline',
    auditReady: 'Audit Ledger: Active (development mode)',

    menuInvestigation: 'Case',
    menuEdit: 'Edit',
    menuInsert: 'Insert',
    menuOsint: 'OSINT Tools',
    menuOsna: 'Social Media (OSNA)',
    menuPolice: 'Judicial Police',
    menuView: 'View',
    menuAi: 'AI Assistant',

    modeCollect: 'Collect',
    modeAnalyze: 'Analyze',
    modeReport: 'Report',

    searchPlaceholder: 'Search clue, phone, suspect or run a tool... (Ctrl+K)',
    stealthWarning: 'WARNING: Stealth Mode Inactive',
    caseSelectorTitle: 'Active Judicial Case',

    layersTitle: 'Investigation Layers',
    creationTitle: 'Creation & Links',
    linkModeLabel: 'Link Creation Mode',
    filtersTitle: 'Nature Filters',
    queriesTitle: 'Investigative Queries',
    auditLedgerBtn: 'Forensic Audit Ledger',

    caseOverviewTitle: 'Case Summary',
    kpiLoss: 'Estimated Loss',
    kpiLossVal: '1,450,000 DZD',
    kpiVictims: 'Linked Complaints',
    kpiVictimsVal: '6 Victims',
    kpiLocations: 'Involved Wilayas',
    kpiLocationsVal: 'Algiers, Oran, Blida',
    kpiEvidence: 'Sealed Evidence',
    kpiEvidenceVal: '100% SHA-256',
    inboxTitle: 'Clue Arbitration Inbox',
    inboxBadge: '3 pending',
    inboxAddToGraph: 'Add to Case',
    inboxDismiss: 'Dismiss',

    phaseNoticeTitle: 'Scheduled for Later Phase',
    phaseNoticeDesc: 'This forensic brick is planned for a subsequent milestone in the sovereign roadmap.',
    phaseNoticeClose: 'Understood',

    mapTreeTitle: 'Territorial Hierarchy',
    mapNationalTerritory: 'National Territory (Algeria)',
    mapSkippedNodes: 'Off-Map (No GPS)',
    mapGeolocatedCount: 'geolocated entities',
    mapWgs84: 'WGS-84 / Algeria Conformal Projection',
    mapExpandAll: 'Expand All',
    mapCollapseAll: 'Collapse All',
    mapFilterPlaceholder: 'Filter entities, wilayas...',
  },
};
