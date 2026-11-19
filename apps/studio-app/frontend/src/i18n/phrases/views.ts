import type { PhraseBook } from './index';

export const VIEWS_PHRASES: PhraseBook = {
  // TimelineView
  'Chronologie Judiciaire': { ar: 'الخط الزمني القضائي', en: 'Judicial Timeline' },
  'Filtrer par couche...': { ar: 'تصفية حسب الطبقة...', en: 'Filter by layer...' },
  'Toutes les couches': { ar: 'كل الطبقات', en: 'All layers' },
  'Aucun événement à afficher': { ar: 'لا توجد أحداث للعرض', en: 'No events to display' },
  'Ajoutez des nœuds au graphe pour les voir apparaître ici': {
    ar: 'أضف كيانات إلى المخطط لتظهر هنا',
    en: 'Add nodes to the graph to see them appear here',
  },
  // AuditChainViewer
  'Registre d\'Audit Forensique': { ar: 'سجل التدقيق الجنائي', en: 'Forensic Audit Ledger' },
  'Revérifier': { ar: 'إعادة التحقق', en: 'Re-verify' },
  'Vérification en cours...': { ar: 'جارٍ التحقق...', en: 'Verifying...' },
  'Algorithme de hachage :': { ar: 'خوارزمية التجزئة :', en: 'Hash algorithm:' },
  'Entrées enregistrées :': { ar: 'المدخلات المسجلة :', en: 'Recorded entries:' },
  'Conformité judiciaire :': { ar: 'المطابقة القضائية :', en: 'Judicial compliance:' },
  'Dernière vérification :': { ar: 'آخر تحقق :', en: 'Last verification:' },
  'Statut de la chaîne :': { ar: 'حالة السلسلة :', en: 'Chain status:' },
  'Intègre': { ar: 'سليمة', en: 'Intact' },
  'Compromis': { ar: 'مخترقة', en: 'Compromised' },
  'Non vérifié': { ar: 'غير مُتحقق منه', en: 'Unverified' },
  '{n} entrées au total': { ar: '{n} مدخلات إجمالاً', en: '{n} total entries' },
  'Entrée #{index}': { ar: 'مدخلة #{index}', en: 'Entry #{index}' },
  // ExportDialog
  'Export Judiciaire': { ar: 'التصدير القضائي', en: 'Judicial Export' },
  'Générer le Rapport Forensique PDF / Impression': {
    ar: 'إنشاء التقرير الجنائي (PDF / طباعة)',
    en: 'Generate Forensic PDF Report / Print',
  },
  'Exporter en Format Structuré JSON': {
    ar: 'تصدير بصيغة JSON المنظمة',
    en: 'Export as Structured JSON Format',
  },
  'Export en cours...': { ar: 'جارٍ التصدير...', en: 'Exporting...' },
  'Génération du rapport...': { ar: 'جارٍ إنشاء التقرير...', en: 'Generating report...' },
  'Fermer': { ar: 'إغلاق', en: 'Close' },
  // MapView – beyond translations.ts
  'Légende': { ar: 'المفتاح', en: 'Legend' },
  'Entités géolocalisées': { ar: 'كيانات محددة جغرافياً', en: 'Geolocated entities' },
  'Entités sans GPS': { ar: 'كيانات بدون إحداثيات', en: 'Entities without GPS' },
  'Réseau d\'enquête': { ar: 'شبكة التحقيق', en: 'Investigation network' },
  'Nord': { ar: 'شمال', en: 'North' },
  // TimelineView additions
  'Filtrer par libellé...': { ar: 'تصفية حسب التسمية...', en: 'Filter by label...' },
  'Provenance :': { ar: 'المصدر :', en: 'Provenance:' },
  'Vue chronologique temporelle de l\'enquête': { ar: 'العرض الزمني للتحقيق', en: 'Temporal timeline view of the investigation' },
  'Événement séquentiel #{n}': { ar: 'حدث تسلسلي #{n}', en: 'Sequential event #{n}' },
  'événements': { ar: 'أحداث', en: 'events' },
  // AuditChainViewer additions
  'Chaîne de Preuves Cryptographique Intègre (ISO 27037)': {
    ar: 'سلسلة الأدلة التشفيرية سليمة (ISO 27037)',
    en: 'Cryptographic Evidence Chain Intact (ISO 27037)',
  },
  'Alerte : Altération Détectée dans la Chaîne de Preuves': {
    ar: 'تنبيه : تم اكتشاف تلاعب في سلسلة الأدلة',
    en: 'Alert: Tampering Detected in Evidence Chain',
  },
  'Caractéristiques du Registre Forensique d\'Athar': {
    ar: 'خصائص سجل التدقيق الجنائي لأثر',
    en: 'Athar Forensic Ledger Characteristics',
  },
  'Description du registre chaîné SHA-256': {
    ar: 'كل تعديل على الملف (تحميل حرز، ترقية طبقة قضائية، تنفيذ خوارزمية، تصدير قضائي) يُولِّد كتلة غير قابلة للتعديل مختومة ببصمة SHA-256 متسلسلة.',
    en: 'Every case mutation (sealed evidence load, judicial layer promotion, SNA execution, judicial export) generates an immutable block sealed by chained SHA-256 fingerprint.',
  },
  // ExportDialog additions
  'Dossier : {title} ({code})': { ar: 'الملف : {title} ({code})', en: 'Case: {title} ({code})' },
  'Volume : {nodes} entités et {edges} relations actives.': {
    ar: 'الحجم : {nodes} كيانات و {edges} علاقة نشطة.',
    en: 'Volume: {nodes} entities and {edges} active relations.',
  },
  'Chaîne de garde forensique (ISO 27037) validée : Empreintes SHA-256 certifiées.': {
    ar: 'سلسلة الحيازة الجنائية (ISO 27037) مُتحقق منها : بصمات SHA-256 معتمدة.',
    en: 'Forensic chain of custody (ISO 27037) validated: SHA-256 fingerprints certified.',
  },
  'Attention : le registre forensique présente des anomalies de vérification.': {
    ar: 'تحذير : يظهر سجل التدقيق الجنائي شذوذات في التحقق.',
    en: 'Warning: the forensic ledger shows verification anomalies.',
  },
  'Rapport officiel distinguant preuves scellées et hypothèses.': {
    ar: 'تقرير رسمي يميز بين الأدلة المختومة والفرضيات.',
    en: 'Official report distinguishing sealed evidence and hypotheses.',
  },
  'Archive complète avec métadonnées, graphe, couches et hachages.': {
    ar: 'أرشيف كامل مع البيانات الوصفية والمخطط والطبقات والبصمات.',
    en: 'Complete archive with metadata, graph, layers and hashes.',
  },
  // TimelineView DAG & Temporal Slider
  '1. Preuve Vérifiée': { ar: '1. دليل مُتحقق منه', en: '1. Verified Evidence' },
  '2. OSINT Brute': { ar: '2. استخبارات مصادر مفتوحة', en: '2. Raw OSINT' },
  '3. Données Opérateurs': { ar: '3. بيانات المتعاملين', en: '3. Operator Data' },
  '4. Hypothèses Enquêteur': { ar: '4. فرضيات المحقق', en: '4. Investigator Hypotheses' },
  '5. Flux Financiers': { ar: '5. التدفقات المالية', en: '5. Financial Flows' },
  'Activer toutes les pistes': { ar: 'تفعيل جميع المسارات', en: 'Enable all branches' },
  'Afficher toute la chronologie (100%)': { ar: 'عرض كامل التسلسل الزمني (100%)', en: 'Show full timeline (100%)' },
  'Animer': { ar: 'تحريك', en: 'Play' },
  'Arbre Multi-Branches': { ar: 'شجرة متعددة الفروع', en: 'Multi-Branch Tree' },
  "Chronologie Arborescente Descendante (Arbre d'enquête & convergences)": {
    ar: 'الخط الزمني الشجري التنازلي (شجرة التحقيق والتقاطعات)',
    en: 'Top-Down Branching Timeline (Investigation Tree & Convergences)',
  },
  'Classées par taille (les plus fournies à gauche)': {
    ar: 'مرتبة حسب الحجم (الأكبر على اليمين/اليسار)',
    en: 'Ordered by size (largest branches first)',
  },
  'Complet': { ar: 'كامل', en: 'Full' },
  "Curseur d'évolution temporelle de l'enquête": {
    ar: 'مؤشر التطور الزمني للتحقيق',
    en: 'Investigation temporal evolution slider',
  },
  'Désactiver toutes les pistes': { ar: 'تعطيل جميع المسارات', en: 'Disable all branches' },
  'Désactiver toutes les pistes chronologiques': {
    ar: 'تعطيل جميع المسارات الزمنية',
    en: 'Disable all timeline branches',
  },
  "Faire glisser dans le temps pour visualiser l'évolution progressive du réseau": {
    ar: 'اسحب عبر الزمن لمعاينة التطور التدريجي للشبكة',
    en: 'Slide through time to visualize progressive network evolution',
  },
  'Filtrer les pistes...': { ar: 'تصفية المسارات...', en: 'Filter branches...' },
  'Flux linéaire chronologique vertical': { ar: 'تدفق خطي زمني عمودي', en: 'Vertical chronological linear stream' },
  'Linéaire': { ar: 'خطي', en: 'Linear' },
  'Majeures (≥ 4)': { ar: 'الرئيسية (≥ 4)', en: 'Major (≥ 4)' },
  'Masquer automatiquement les pistes courtes (≤ 3 nœuds)': {
    ar: 'إخفاء المسارات القصيرة تلقائياً (≤ 3 كيانات)',
    en: 'Automatically hide short branches (≤ 3 nodes)',
  },
  'Mode chronologique': { ar: 'وضع الخط الزمني', en: 'Timeline mode' },
  'Pause': { ar: 'إيقاف مؤقت', en: 'Pause' },
  'Pistes chronologiques': { ar: 'المسارات الزمنية', en: 'Timeline branches' },
  'Pistes courtes (≤ 3)': { ar: 'المسارات القصيرة (≤ 3)', en: 'Short branches (≤ 3)' },
  "Pistes d'enquête": { ar: 'مسارات التحقيق', en: 'Investigation branches' },
  'Rechercher...': { ar: 'بحث...', en: 'Search...' },
  'Sélectionner les pistes chronologiques et filtrer par nombre de nœuds': {
    ar: 'اختيار المسارات الزمنية والتصفية حسب عدد الكيانات',
    en: 'Select timeline branches and filter by node count',
  },
  'Tout désactiver': { ar: 'تعطيل الكل', en: 'Disable all' },
  'Toutes': { ar: 'الكل', en: 'All' },
  'Vitesse de lecture temporelle': { ar: 'سرعة التشغيل الزمني', en: 'Temporal playback speed' },
  'Étape': { ar: 'مرحلة', en: 'Step' },
  'Étape précédente': { ar: 'المرحلة السابقة', en: 'Previous step' },
  'Étape suivante': { ar: 'المرحلة التالية', en: 'Next step' },
  // MapView additions
  'Wilaya de {name}': { ar: 'ولاية {name}', en: 'Wilaya of {name}' },
  "Ouvrir l'arborescence territoriale": { ar: 'فتح الشجرة الإقليمية', en: 'Open territorial hierarchy' },
  'Fond cartographique routier OpenStreetMap': { ar: 'خريطة الطرق OpenStreetMap', en: 'OpenStreetMap street base layer' },
  'Rues OSM': { ar: 'طرق OSM', en: 'OSM Streets' },
  "Recentrer sur l'Algérie entière": { ar: 'إعادة التمركز على كامل الجزائر', en: 'Recenter on all of Algeria' },
  'Algérie': { ar: 'الجزائر', en: 'Algeria' },
  "Afficher/masquer les liens d'enquête entre les coordonnées": {
    ar: 'إظهار/إخفاء روابط التحقيق بين الإحداثيات',
    en: 'Show/hide investigation links between coordinates',
  },
  'Liens': { ar: 'روابط', en: 'Links' },
  "Zoom routier jusqu'aux rues (Niveau 19)": { ar: 'تكبير تفصيلي حتى الشوارع (مستوى 19)', en: 'Street-level zoom (Level 19)' },
  // App Status Bar & Global
  'Exploration Réseau': { ar: 'استكشاف الشبكة', en: 'Network Exploration' },
  'Voisinage à {hops} bond(s) développé : {n} entité(s) révélée(s) autour de {name}': {
    ar: 'تم توسيع الجوار بـ {hops} وصلة : كشف {n} كيان حول {name}',
    en: '{hops}-hop neighborhood expanded: {n} entities revealed around {name}',
  },
};
