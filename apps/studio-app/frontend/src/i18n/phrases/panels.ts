import type { PhraseBook } from './index';

export const PANELS_PHRASES: PhraseBook = {
  // InspectorPanel – node inspector
  'Fermer l\'inspecteur': { ar: 'إغلاق لوحة التفتيش', en: 'Close inspector' },
  'Synthèse de l\'affaire et boîte des indices': {
    ar: 'ملخص القضية وصندوق الأدلة',
    en: 'Case summary and clue inbox',
  },
  'Inspecteur de l\'entité {label}': {
    ar: 'تفتيش الكيان {label}',
    en: 'Entity inspector: {label}',
  },
  'Identifiant / Libellé': { ar: 'المعرّف / التسمية', en: 'Identifier / Label' },
  'COUCHE : {layer}': { ar: 'الطبقة : {layer}', en: 'LAYER: {layer}' },
  'CONFIANCE : {pct}%': { ar: 'الثقة : {pct}%', en: 'CONFIDENCE: {pct}%' },
  'Confiance analytique calculée par l\'algorithme ou l\'enquêteur': {
    ar: 'درجة الثقة التحليلية المحسوبة بالخوارزمية أو المحقق',
    en: 'Analytical confidence computed by algorithm or investigator',
  },
  'Empreinte Scellée (SHA-256)': { ar: 'البصمة الرقمية المختومة (SHA-256)', en: 'Sealed Fingerprint (SHA-256)' },
  'Copier l\'empreinte SHA-256': { ar: 'نسخ البصمة SHA-256', en: 'Copy SHA-256 fingerprint' },
  'Provenance : ': { ar: 'المصدر : ', en: 'Provenance: ' },
  'Métadonnées Spécifiques': { ar: 'البيانات الوصفية الخاصة', en: 'Specific Metadata' },
  'Changer de Calque (Justification Obligatoire)': {
    ar: 'تغيير الطبقة (مع مبرر إلزامي)',
    en: 'Change Layer (Justification Required)',
  },
  'Développer 1-hop': { ar: 'توسيع 1 وصلة', en: 'Expand 1-hop' },
  'Développer 2-hops': { ar: 'توسيع 2 وصلة', en: 'Expand 2-hops' },
  'Outils OSINT Proposés': { ar: 'أدوات OSINT المقترحة', en: 'Proposed OSINT Tools' },
  'Lancer l\'outil {name}': { ar: 'تشغيل الأداة {name}', en: 'Run tool {name}' },
  'Supprimer ce nœud du graphe': { ar: 'حذف هذا الكيان من المخطط', en: 'Delete this node from graph' },
  'Supprimer': { ar: 'حذف', en: 'Delete' },
  'Confirmer la suppression de "{label}" ?': {
    ar: 'تأكيد حذف "{label}" ؟',
    en: 'Confirm deletion of "{label}"?',
  },
  'Sélectionnez un nœud sur le canevas pour inspecter ses métadonnées forensiques détaillées.': {
    ar: 'حدد كيانًا على اللوحة لفحص بياناته الجنائية التفصيلية.',
    en: 'Select a node on the canvas to inspect its detailed forensic metadata.',
  },
  '{n} en attente': { ar: '{n} قيد المراجعة', en: '{n} pending' },
  'Indices détectés par les outils de collecte nécessitant une décision humaine avant versement au dossier (Review-Run).': {
    ar: 'أدلة اكتشفتها أدوات الجمع تتطلب قرار المحقق قبل إيداعها بالملف (Review-Run).',
    en: 'Clues detected by collection tools requiring human decision before adding to case (Review-Run).',
  },
  'Tous les indices ont été arbitrés.': {
    ar: 'تمت معالجة جميع الأدلة.',
    en: 'All clues have been processed.',
  },
  // Edge inspector
  'Relation sélectionnée': { ar: 'العلاقة المحددة', en: 'Selected relation' },
  'Fermer l\'inspecteur de relation': { ar: 'إغلاق تفتيش العلاقة', en: 'Close relation inspector' },
  'Type de relation : {type}': { ar: 'نوع العلاقة : {type}', en: 'Relation type: {type}' },
  'De : {src}': { ar: 'من : {src}', en: 'From: {src}' },
  'Vers : {dst}': { ar: 'إلى : {dst}', en: 'To: {dst}' },
  // SnaPanel
  'Social Network Analysis ({n} Outils)': { ar: 'تحليل الشبكات الاجتماعية ({n} أداة)', en: 'Social Network Analysis ({n} Tools)' },
  "PARAMÈTRES D'EXÉCUTION": { ar: 'معاملات التشغيل', en: 'EXECUTION PARAMETERS' },
  'Entité': { ar: 'الكيان', en: 'Entity' },
  'Score / Rôle': { ar: 'الدرجة / الدور', en: 'Score / Role' },
  'Lancer l\'analyse': { ar: 'تشغيل التحليل', en: 'Run analysis' },
  'Exporter les résultats': { ar: 'تصدير النتائج', en: 'Export results' },
  'Fermer le panneau SNA': { ar: 'إغلاق لوحة التحليل', en: 'Close SNA panel' },
  'Résultats': { ar: 'النتائج', en: 'Results' },
  'Aucun résultat': { ar: 'لا توجد نتائج', en: 'No results' },
  'Analyse en cours...': { ar: 'جارٍ التحليل...', en: 'Analysing...' },
  // CasePropertiesModal
  'Propriétés du Dossier Judiciaire': { ar: 'خصائص الملف القضائي', en: 'Judicial Case Properties' },
  'Juridiction Compétente': { ar: 'الجهة القضائية المختصة', en: 'Competent Jurisdiction' },
  "Ouverture de l'Instruction": { ar: 'تاريخ فتح التحقيق', en: 'Investigation Opening' },
  'Wilayas Rattachées': { ar: 'الولايات المعنية', en: 'Involved Wilayas' },
  'Volumétrie Graphique': { ar: 'حجم المخطط', en: 'Graph Volume' },
  'Empreinte Racine Scellée (SHA-256 RFC 3161) :': {
    ar: 'البصمة الجذرية المختومة (SHA-256 RFC 3161) :',
    en: 'Sealed Root Fingerprint (SHA-256 RFC 3161):',
  },
  'Fermer les propriétés': { ar: 'إغلاق الخصائص', en: 'Close properties' },
  // ToolInfoModal
  'Exécution Non Disponible': { ar: 'التنفيذ غير متاح', en: 'Execution Unavailable' },
  'Opérationnel en Phase 1': { ar: 'متاح في المرحلة 1', en: 'Operational in Phase 1' },
  'Fermer les informations de l\'outil': { ar: 'إغلاق معلومات الأداة', en: 'Close tool information' },
  'En savoir plus': { ar: 'معرفة المزيد', en: 'Learn more' },
  // InspectorPanel additions
  'Source : {src} • Confiance : {pct}%': {
    ar: 'المصدر : {src} • الثقة : {pct}%',
    en: 'Source: {src} • Confidence: {pct}%',
  },
  'Outils Forensiques Recommandés': { ar: 'الأدوات الجنائية الموصى بها', en: 'Recommended Forensic Tools' },
  'TYPE DE LIAISON': { ar: 'نوع الرابط', en: 'LINK TYPE' },
  'Source : ': { ar: 'المصدر : ', en: 'Source: ' },
  'Cible : ': { ar: 'الهدف : ', en: 'Target: ' },
  'Calcul en cours...': { ar: 'جارٍ الحساب...', en: 'Computing...' },
};
