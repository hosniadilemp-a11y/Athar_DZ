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
};
