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
}

export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  fr: {
    appName: 'Athar',
    studioSubtitle: 'Studio d’Enquête Judiciaire',
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
  },
  ar: {
    appName: 'أثر',
    studioSubtitle: 'منصة التحقيق القضائي',
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
  },
  en: {
    appName: 'Athar',
    studioSubtitle: 'Judicial Investigation Studio',
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
  },
};
