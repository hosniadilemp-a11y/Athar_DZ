import type { PhraseBook } from './index';

export const CANVAS_PHRASES: PhraseBook = {
  // Toolbar – view tabs
  'Graphe': { ar: 'المخطط البياني', en: 'Graph' },
  'Carte SIG': { ar: 'خريطة SIG', en: 'GIS Map' },
  'Chronologie': { ar: 'الخط الزمني', en: 'Timeline' },
  'Tableau': { ar: 'الجدول', en: 'Table' },
  "Registre d'Audit": { ar: 'سجل التدقيق', en: 'Audit Ledger' },
  // Toolbar – layout pills
  'Disposition :': { ar: 'التخطيط :', en: 'Layout:' },
  'Concentrique': { ar: 'متحدد المركز', en: 'Concentric' },
  'Organique': { ar: 'عضوي', en: 'Organic' },
  'Circulaire': { ar: 'دائري', en: 'Circular' },
  'Hiérarchique': { ar: 'هرمي', en: 'Hierarchical' },
  'Grille': { ar: 'شبكي', en: 'Grid' },
  // Layout tooltips
  "Disposition Concentrique : Stratification en anneaux orbitaux par calque de preuve judiciaire (recommandé pour l'enquête)": {
    ar: 'التخطيط المتحدد المركز: تصنيف في حلقات مدارية حسب طبقة الأدلة القضائية (موصى به للتحقيق)',
    en: 'Concentric Layout: Layered orbital rings by judicial evidence layer (recommended for investigation)',
  },
  'Disposition Organique (Forces F-R) : Rapprochement physique des entités fortement connectées pour faire émerger les cellules': {
    ar: 'التخطيط العضوي (قوى F-R): اقتراب الكيانات المرتبطة ارتباطاً وثيقاً لإبراز الخلايا',
    en: 'Organic Layout (F-R Forces): Strongly connected entities cluster to surface cells',
  },
  'Disposition Circulaire : Placement équiangulaire sur un anneau unique pour analyser les flux transversaux': {
    ar: 'التخطيط الدائري: توضع متساو الزوايا على حلقة واحدة لتحليل التدفقات المتقاطعة',
    en: 'Circular Layout: Equiangular placement on a single ring to analyse cross-flows',
  },
  'Disposition Hiérarchique : Arborescence par niveau de causalité (Territoire ➔ Cibles ➔ Vecteurs ➔ Flux)': {
    ar: 'التخطيط الهرمي: شجرة حسب مستوى السببية (الإقليم ← الأهداف ← الموجهات ← التدفقات)',
    en: 'Hierarchical Layout: Tree by causality level (Territory → Targets → Vectors → Flows)',
  },
  "Disposition en Grille : Alignement cartésien compact ordonné par calque de scellé pour l'inventaire méthodique": {
    ar: 'التخطيط الشبكي: محاذاة ديكارتية مدمجة مرتبة حسب طبقة الحرز للجرد المنهجي',
    en: 'Grid Layout: Compact Cartesian alignment ordered by sealed layer for methodical inventory',
  },
  // Toolbar – impact view & actions
  'Vues analytiques': { ar: 'العروض التحليلية', en: 'Analytical views' },
  'Sous-barre de sélection de vue et actions de canevas': {
    ar: 'شريط اختيار العرض وإجراءات اللوحة',
    en: 'View selector sub-bar and canvas actions',
  },
  'Vue Graphe de Rapprochement [Alt+1]': {
    ar: 'عرض مخطط الربط [Alt+1]',
    en: 'Link Graph View [Alt+1]',
  },
  'Vue Cartographie SIG (8 types géolocalisés sur le territoire algérien) [Alt+3]': {
    ar: 'خريطة نظم المعلومات الجغرافية (8 أنواع محددة جغرافياً) [Alt+3]',
    en: 'GIS Map View (8 geolocated types on Algerian territory) [Alt+3]',
  },
  'Vue Chronologie Temporelle des Faits [Alt+2]': {
    ar: 'عرض الخط الزمني للوقائع [Alt+2]',
    en: 'Timeline View [Alt+2]',
  },
  'Vue Tableau Accessible (WCAG AA) [Alt+4]': {
    ar: 'عرض الجدول المتاح (WCAG AA) [Alt+4]',
    en: 'Accessible Table View (WCAG AA) [Alt+4]',
  },
  "Vue Registre d'Audit Forensique ISO 27037 [Alt+5]": {
    ar: 'عرض سجل التدقيق الجنائي ISO 27037 [Alt+5]',
    en: 'Forensic Audit Ledger ISO 27037 [Alt+5]',
  },
  'Basculer entre la vue d\'ensemble (100 nœuds) et la vue restreinte de préjudice (35 nœuds)': {
    ar: 'التبديل بين العرض الكامل (100 كيان) وعرض الضرر المحدود (35 كيان)',
    en: 'Toggle between full view (100 nodes) and impact-restricted view (35 nodes)',
  },
  'Vue Impact : {n} sur {total} nœuds': {
    ar: 'عرض التأثير : {n} من {total} كيان',
    en: 'Impact View: {n} of {total} nodes',
  },
  'Vue Impact : {n} / {total} nœuds': {
    ar: 'عرض التأثير : {n} / {total} كيان',
    en: 'Impact View: {n} / {total} nodes',
  },
  'Historique des actions': { ar: 'سجل الإجراءات', en: 'Action history' },
  'Annuler la dernière action ({n}) [Ctrl+Z]': {
    ar: 'تراجع عن الإجراء الأخير ({n}) [Ctrl+Z]',
    en: 'Undo last action ({n}) [Ctrl+Z]',
  },
  "Rétablir l'action ({n}) [Ctrl+Y]": {
    ar: 'إعادة الإجراء ({n}) [Ctrl+Y]',
    en: 'Redo action ({n}) [Ctrl+Y]',
  },
  'Annuler la dernière action': { ar: 'تراجع عن الإجراء الأخير', en: 'Undo last action' },
  'Rétablir la dernière action': { ar: 'إعادة الإجراء الأخير', en: 'Redo last action' },
  "Lancer le scénario d'enquête déterministe recommandé pour l'affaire en cours": {
    ar: 'تشغيل السيناريو الحتمي الموصى به للملف الجاري',
    en: 'Run the recommended deterministic investigation scenario for the active case',
  },
  'Lancer le Scénario Recommandé (Review-Run)': {
    ar: 'تشغيل السيناريو الموصى به',
    en: 'Run Recommended Scenario (Review-Run)',
  },
  'Lancer le Scénario Recommandé': { ar: 'تشغيل السيناريو الموصى به', en: 'Run Recommended Scenario' },
  'Exporter le dossier judiciaire en PDF ou archive JSON conforme': {
    ar: 'تصدير الملف القضائي بصيغة PDF أو أرشيف JSON المطابق',
    en: 'Export judicial case as PDF or conformant JSON archive',
  },
  'Exporter le Dossier Judiciaire': { ar: 'تصدير الملف القضائي', en: 'Export Judicial Case' },
  'Exporter': { ar: 'تصدير', en: 'Export' },
  // ContextMenu
  'Explorer voisinage (1 bond)': { ar: 'استكشاف الجوار (وصلة 1)', en: 'Explore neighbourhood (1 hop)' },
  'Explorer réseau élargi (2 bonds)': { ar: 'استكشاف الشبكة الموسعة (وصلتان)', en: 'Explore extended network (2 hops)' },
  'Inspecter les propriétés': { ar: 'فحص الخصائص', en: 'Inspect properties' },
  'Créer une liaison depuis cette entité...': { ar: 'إنشاء رابط من هذا الكيان...', en: 'Create link from this entity...' },
  'Promouvoir en VERIFIED (Justification requise)': {
    ar: 'ترقية إلى VERIFIED (مع مبرر إلزامي)',
    en: 'Promote to VERIFIED (Justification required)',
  },
  'Classer en HYPOTHESIS': { ar: 'تصنيف ضمن HYPOTHESIS', en: 'Classify as HYPOTHESIS' },
  'Enrichissement IA': { ar: 'الإثراء بالذكاء الاصطناعي', en: 'AI Enrichment' },
  'Masquer du graphe': { ar: 'إخفاء من المخطط', en: 'Hide from graph' },
  'Masquer le nœud "{label}" de la vue active ?': {
    ar: 'إخفاء الكيان "{label}" من العرض الحالي ؟',
    en: 'Hide node "{label}" from active view?',
  },
  "L'analyse prédictive IA sera disponible en Phase 3.": {
    ar: 'التحليل التنبؤي بالذكاء الاصطناعي سيكون متاحاً في المرحلة 3.',
    en: 'AI predictive analysis will be available in Phase 3.',
  },
  // AccessibleListView – table
  'Tableau des entités et relations': { ar: 'جدول الكيانات والعلاقات', en: 'Entities and relations table' },
  'Entités': { ar: 'الكيانات', en: 'Entities' },
  'Relations': { ar: 'العلاقات', en: 'Relations' },
  'Type': { ar: 'النوع', en: 'Type' },
  'Libellé': { ar: 'التسمية', en: 'Label' },
  'Couche': { ar: 'الطبقة', en: 'Layer' },
  'Confiance': { ar: 'درجة الثقة', en: 'Confidence' },
  'Actions': { ar: 'الإجراءات', en: 'Actions' },
  'Type Relation': { ar: 'نوع العلاقة', en: 'Relation Type' },
  'Source': { ar: 'المصدر', en: 'Source' },
  'Cible': { ar: 'الهدف', en: 'Target' },
  'Filtrer par type...': { ar: 'تصفية حسب النوع...', en: 'Filter by type...' },
  'Toutes les couches': { ar: 'كل الطبقات', en: 'All layers' },
  'Page {current} sur {total}': { ar: 'صفحة {current} من {total}', en: 'Page {current} of {total}' },
  'Page précédente': { ar: 'الصفحة السابقة', en: 'Previous page' },
  'Page suivante': { ar: 'الصفحة التالية', en: 'Next page' },
  'Inspecter {label}': { ar: 'فحص {label}', en: 'Inspect {label}' },
  'Développer 1-hop': { ar: 'توسيع 1 وصلة', en: 'Expand 1-hop' },
  'Développer 2-hops': { ar: 'توسيع 2 وصلة', en: 'Expand 2-hops' },
  'Aucune entité trouvée': { ar: 'لم يُعثر على أي كيان', en: 'No entity found' },
  'Aucune relation trouvée': { ar: 'لم يُعثر على أي علاقة', en: 'No relation found' },
  // Layout dropdown & floating palette
  'Dispositions du graphe': { ar: 'تخطيطات المخطط', en: 'Graph layouts' },
  'Disposition du Graphe': { ar: 'تخطيط المخطط', en: 'Graph Layout' },
  'Concentrique par Calque': { ar: 'متحد المركز حسب الطبقة', en: 'Concentric by Layer' },
  'Anneaux stratifiés selon les 5 calques de preuve': {
    ar: 'حلقات متدرجة حسب طبقات الإثبات الخمس',
    en: 'Stratified rings according to the 5 evidence layers',
  },
  'Organique (Forces)': { ar: 'عضوي (قوى الترابط)', en: 'Organic (Force-directed)' },
  'Regroupement physique par connexions et clusters': {
    ar: 'تجميع فيزيائي حسب الروابط والتجمعات',
    en: 'Physical clustering by connections and clusters',
  },
  'Circulaire Global': { ar: 'دائري شامل', en: 'Global Circular' },
  'Disposition orbitale régulière sur grand cercle': {
    ar: 'توزيع مداري منتظم على دائرة كبرى',
    en: 'Regular orbital distribution on a large circle',
  },
  'Arborescence par niveau (Territoire -> Cibles -> Flux)': {
    ar: 'تسلسل هرمي حسب المستوى (الإقليم -> الأهداف -> التدفقات)',
    en: 'Level tree (Territory -> Targets -> Flows)',
  },
  'Matrice en Grille': { ar: 'مصفوفة شبكية', en: 'Grid Matrix' },
  'Grille Compacte': { ar: 'شبكة مدمجة', en: 'Compact Grid' },
  'Matrice ordonnée par type et statut de scellé': {
    ar: 'مصفوفة مرتبة حسب النوع وحالة الحرز',
    en: 'Ordered matrix by type and sealed status',
  },
  'Outils de navigation et manipulation du canevas': {
    ar: 'أدوات التنقل والتحكم في اللوحة',
    en: 'Canvas navigation and manipulation tools',
  },
  'Mode Sélection (Pointeur)': { ar: 'وضع التحديد (المؤشر)', en: 'Selection Mode (Pointer)' },
  'Mode Sélection (Pointeur) [V]': { ar: 'وضع التحديد (المؤشر) [V]', en: 'Selection Mode (Pointer) [V]' },
  'Déplacer le canevas (Pan)': { ar: 'تحريك اللوحة', en: 'Pan Canvas' },
  'Déplacer le canevas (Glisser avec clic gauche) [H]': {
    ar: 'تحريك اللوحة (السحب بالنقر الأيسر) [H]',
    en: 'Pan canvas (Drag with left click) [H]',
  },
  'Mode Création de Liaison': { ar: 'وضع إنشاء الروابط', en: 'Link Creation Mode' },
  'Mode Création de Liaison (Relier 2 nœuds) [L]': {
    ar: 'وضع إنشاء الروابط (ربط كيانين) [L]',
    en: 'Link Creation Mode (Connect 2 nodes) [L]',
  },
  'Choisir la disposition du graphe': { ar: 'اختيار تخطيط المخطط', en: 'Choose graph layout' },
  'Changer la disposition du graphe (Actif : {layout})': {
    ar: 'تغيير تخطيط المخطط (النشط : {layout})',
    en: 'Change graph layout (Active: {layout})',
  },
  'Zoom avant': { ar: 'تكبير', en: 'Zoom in' },
  'Zoom avant (+)': { ar: 'تكبير (+)', en: 'Zoom in (+)' },
  'Zoom arrière': { ar: 'تصغير', en: 'Zoom out' },
  'Zoom arrière (-)': { ar: 'تصغير (-)', en: 'Zoom out (-)' },
  'Ajuster la vue (Centrer)': { ar: 'ملاءمة العرض (توسيط)', en: 'Fit view (Center)' },
  'Ajuster la vue (Centrer) [0]': { ar: 'ملاءمة العرض (توسيط) [0]', en: 'Fit view (Center) [0]' },
  'Analyse Réseau SNA (16 algorithmes graphiques)': {
    ar: 'تحليل الشبكات الاجتماعية SNA (16 خوارزمية جنائية)',
    en: 'Social Network Analysis SNA (16 forensic algorithms)',
  },
  'Ouvrir le panneau d\'analyse de centralité et détection de communautés (SNA)': {
    ar: 'فتح لوحة التحليل الجنائي للشبكات والصلات (SNA)',
    en: 'Open centrality and community detection forensic panel (SNA)',
  },
};
