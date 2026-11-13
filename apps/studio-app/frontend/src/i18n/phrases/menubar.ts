import type { PhraseBook } from './index';

export const MENUBAR_PHRASES: PhraseBook = {
  // Investigation menu
  "Nouveau Dossier d'Enquête...": { ar: 'ملف تحقيق جديد...', en: 'New Investigation File...' },
  'Ouvrir un Dossier...': { ar: 'فتح ملف...', en: 'Open Case...' },
  'Enregistrer': { ar: 'حفظ', en: 'Save' },
  'Enregistrer sous...': { ar: 'حفظ باسم...', en: 'Save As...' },
  'Importer des Indices (CDR, Photos)...': { ar: 'استيراد الأدلة (CDR، صور)...', en: 'Import Clues (CDR, Photos)...' },
  "Propriétés de l'Enquête...": { ar: 'خصائص التحقيق...', en: 'Investigation Properties...' },
  'Exporter le Dossier...': { ar: 'تصدير الملف...', en: 'Export Case...' },
  'Quitter': { ar: 'خروج', en: 'Quit' },
  // Edit menu
  'Annuler': { ar: 'تراجع', en: 'Undo' },
  'Rétablir': { ar: 'إعادة', en: 'Redo' },
  'Tout sélectionner': { ar: 'تحديد الكل', en: 'Select All' },
  'Supprimer la sélection': { ar: 'حذف التحديد', en: 'Delete Selection' },
  'Réinitialiser la vue': { ar: 'إعادة ضبط العرض', en: 'Reset View' },
  // Insert menu
  'Entité Terrain...': { ar: 'إضافة كيان ميداني...', en: 'Add Field Entity...' },
  'Entité Réseau Social...': { ar: 'إضافة كيان اجتماعي...', en: 'Add Social Entity...' },
  'Entité Infrastructure...': { ar: 'إضافة كيان بنية تحتية...', en: 'Add Infrastructure Entity...' },
  'Entité Flux Financier...': { ar: 'إضافة كيان مالي...', en: 'Add Financial Entity...' },
  'Entité Hypothèse...': { ar: 'إضافة كيان فرضية...', en: 'Add Hypothesis Entity...' },
  // View menu
  'Vue Graphe': { ar: 'العرض البياني', en: 'Graph View' },
  'Vue Carte SIG': { ar: 'خريطة نظم المعلومات الجغرافية', en: 'GIS Map View' },
  'Vue Chronologie': { ar: 'الخط الزمني', en: 'Timeline View' },
  'Vue Tableau': { ar: 'عرض الجدول', en: 'Table View' },
  "Vue Registre d'Audit": { ar: 'سجل التدقيق', en: 'Audit Ledger View' },
  'Disposition Concentrique': { ar: 'تخطيط متحدد المركز', en: 'Concentric Layout' },
  'Disposition Organique': { ar: 'التخطيط العضوي', en: 'Organic Layout' },
  'Disposition Circulaire': { ar: 'التخطيط الدائري', en: 'Circular Layout' },
  'Disposition Hiérarchique': { ar: 'التخطيط الهرمي', en: 'Hierarchical Layout' },
  'Disposition Grille': { ar: 'التخطيط الشبكي', en: 'Grid Layout' },
  // AI menu
  'Scénario Recommandé (Review-Run)': { ar: 'السيناريو الموصى به (Review-Run)', en: 'Recommended Scenario (Review-Run)' },
  'Analyse Prédictive IA': { ar: 'التحليل التنبؤي بالذكاء الاصطناعي', en: 'AI Predictive Analysis' },
  'Enrichissement Automatique': { ar: 'الإثراء التلقائي', en: 'Auto-enrichment' },
  // OSINT menu
  'Recherche Web OSINT': { ar: 'البحث على الويب OSINT', en: 'OSINT Web Search' },
  'Analyse Réseaux Sociaux (OSNA)': { ar: 'تحليل الشبكات الاجتماعية (OSNA)', en: 'Social Network Analysis (OSNA)' },
  // Police menu
  'Consultation Casier Judiciaire': { ar: 'الاطلاع على السجل العدلي', en: 'Criminal Record Lookup' },
  'Réquisition Téléphonique': { ar: 'طلب كشف الاتصالات الهاتفية', en: 'Telephone Requisition' },
  "Demande d'Entraide Judiciaire": { ar: 'طلب المساعدة القضائية الدولية', en: 'Mutual Legal Assistance Request' },
  // Themes / Lang
  'Basculer le thème': { ar: 'تبديل المظهر', en: 'Toggle theme' },
  // Alert texts
  "Affaire enregistrée dans la base PostgreSQL/TimescaleDB.": {
    ar: 'تم حفظ الملف في قاعدة البيانات PostgreSQL/TimescaleDB.',
    en: 'Case saved to PostgreSQL/TimescaleDB database.',
  },
  // CommandPalette
  'Rechercher une commande, vue ou outil...': {
    ar: 'البحث عن أمر أو عرض أو أداة...',
    en: 'Search command, view or tool...',
  },
  'Navigation': { ar: 'التنقل', en: 'Navigation' },
  'Actions': { ar: 'الإجراءات', en: 'Actions' },
  'Outils OSINT': { ar: 'أدوات OSINT', en: 'OSINT Tools' },
  'Vues': { ar: 'العروض', en: 'Views' },
  'Aucune commande trouvée': { ar: 'لم يُعثر على أي أمر', en: 'No command found' },
  '↑↓ pour naviguer • Entrée pour sélectionner': {
    ar: '↑↓ للتنقل • Enter للتحديد',
    en: '↑↓ to navigate • Enter to select',
  },
  'Échap pour fermer': { ar: 'Esc للإغلاق', en: 'Esc to close' },
  'Palette de commandes': { ar: 'لوحة الأوامر', en: 'Command palette' },
};
