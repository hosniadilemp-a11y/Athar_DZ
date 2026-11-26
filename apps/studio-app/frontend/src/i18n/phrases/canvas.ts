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
  'Minicarte radar': { ar: 'الخريطة المصغرة', en: 'Radar minimap' },
  'Radar ({n})': { ar: 'الرادار ({n})', en: 'Radar ({n})' },
  'Agrandir le radar': { ar: 'توسيع الرادار', en: 'Expand radar' },
  'Réduire le radar': { ar: 'طي الرادار', en: 'Collapse radar' },
  'Analyse Réseau SNA (16 algorithmes graphiques)': {
    ar: 'تحليل الشبكات الاجتماعية SNA (16 خوارزمية جنائية)',
    en: 'Social Network Analysis SNA (16 forensic algorithms)',
  },
  'Ouvrir le panneau d\'analyse de centralité et détection de communautés (SNA)': {
    ar: 'فتح لوحة التحليل الجنائي للشبكات والصلات (SNA)',
    en: 'Open centrality and community detection forensic panel (SNA)',
  },
  // Toolbar – Sizes, Visibility, Labels & Person-Only Projection
  'Tailles & Affichage': { ar: 'الأحجام والعرض', en: 'Sizes & Display' },
  'Visibilité & Étiquettes': { ar: 'الظهور والتسميات', en: 'Visibility & Labels' },
  'Affichage & Visibilité': { ar: 'العرض والظهور', en: 'Display & Visibility' },
  'Style & Tailles': { ar: 'النمط والأحجام', en: 'Style & Sizes' },
  "Personnaliser l'affichage et la visibilité du graphe": {
    ar: 'تخصيص عرض المخطط وظهور التسميات والروابط',
    en: 'Customize graph display, labels, and link visibility',
  },
  'Déplier tout le graphe': { ar: 'توسيع كامل المخطط', en: 'Expand full graph' },
  "Déplier tout le graphe pour afficher l'ensemble des entités et relations": {
    ar: 'توسيع كامل المخطط لعرض جميع الكيانات والعلاقات',
    en: 'Expand full graph to display all entities and relations',
  },
  'Vue Personnes (Replier)': { ar: 'عرض الأشخاص (طي الوسائط)', en: 'Persons View (Collapse)' },
  'Replier le graphe pour afficher uniquement les Personnes et leurs relations directes ou médiées': {
    ar: 'طي المخطط لعرض الأشخاص فقط وعلاقاتهم المباشرة أو الوسيطة',
    en: 'Collapse graph to display only Persons and their direct or mediated relations',
  },
  'Replier ({n})': { ar: 'طي ({n})', en: 'Collapse ({n})' },
  'Refermer les {n} entités intermédiaires dépliées': {
    ar: 'إغلاق {n} كيانات وسيطة موسعة',
    en: 'Collapse {n} expanded intermediate entities',
  },
  'Panneau de personnalisation du graphe': { ar: 'لوحة تخصيص المخطط', en: 'Graph customization panel' },
  'Personnalisation Visuelle': { ar: 'التخصيص البصري', en: 'Visual Customization' },
  'Personnaliser le canevas': { ar: 'تخصيص اللوحة', en: 'Customize canvas' },
  'Personnaliser le canevas : Tailles des nœuds, arêtes, libellés, photos et mode de coloration': {
    ar: 'تخصيص اللوحة: أحجام الكيانات، الروابط، التسميات، الصور ونمط التلوين',
    en: 'Customize canvas: Node sizes, edges, labels, photos and coloring mode',
  },
  'Réinitialiser par défaut': { ar: 'إعادة الضبط الافتراضي', en: 'Reset to default' },
  'Diamètre des Nœuds :': { ar: 'قطر الكيانات :', en: 'Node Diameter:' },
  'Épaisseur des Liens :': { ar: 'سمك الروابط :', en: 'Link Thickness:' },
  'Libellés des Nœuds :': { ar: 'تسميات الكيانات :', en: 'Node Labels:' },
  'Libellés des Liens :': { ar: 'تسميات الروابط :', en: 'Link Labels:' },
  'Mode de Coloration des Nœuds :': { ar: 'نمط تلوين الكيانات :', en: 'Node Coloring Mode:' },
  '5 Calques Judiciaires': { ar: '5 طبقات قضائية', en: '5 Judicial Layers' },
  '8 Catégories Métiers': { ar: '8 فئات موضوعية', en: '8 Domain Categories' },
  'Note : La bordure respecte toujours le Calque de preuve': {
    ar: 'ملاحظة: الإطار يحترم دائماً طبقة الإثبات القضائية',
    en: 'Note: Border always reflects the Evidence Layer',
  },
  'Afficher les portraits / scellés sur les nœuds': {
    ar: 'عرض الصور / الأحراز على الكيانات',
    en: 'Show portraits / sealed exhibits on nodes',
  },
  'Afficher les libellés sur les liens': { ar: 'عرض التسميات على الروابط', en: 'Show labels on links' },
  'Panneau de visibilité des étiquettes et liaisons': {
    ar: 'لوحة التحكم في ظهور التسميات والروابط',
    en: 'Labels and links visibility panel',
  },
  'Gérer la visibilité des étiquettes des nœuds et le filtrage des liaisons': {
    ar: 'إدارة ظهور تسميات الكيانات وتصفية الروابط',
    en: 'Manage node label visibility and link filtering',
  },
  'Étiquettes Nœuds': { ar: 'تسميات الكيانات', en: 'Node Labels' },
  'Liaisons & Arêtes': { ar: 'الروابط والأسهم', en: 'Links & Edges' },
  'Personnes': { ar: 'أشخاص', en: 'Persons' },
  'Personne': { ar: 'شخص', en: 'Person' },
  'Cibles': { ar: 'الأهداف', en: 'Targets' },
  'Tout': { ar: 'الكل', en: 'All' },
  'Masquées': { ar: 'مخفية', en: 'Hidden' },
  'Afficher uniquement les étiquettes des personnes': {
    ar: 'عرض تسميات الأشخاص فقط',
    en: 'Show person labels only',
  },
  'Afficher personnes et entités judiciaires majeures': {
    ar: 'عرض الأشخاص والكيانات القضائية الرئيسية',
    en: 'Show persons and major judicial entities',
  },
  'Afficher toutes les étiquettes': { ar: 'عرض جميع التسميات', en: 'Show all labels' },
  'Masquer toutes les étiquettes (visible au survol)': {
    ar: 'إخفاء جميع التسميات',
    en: 'Hide all labels',
  },
  'Filtrer les entités...': { ar: 'تصفية الكيانات...', en: 'Filter entities...' },
  'Aucun nœud correspondant': { ar: 'لا يوجد كيان مطابق', en: 'No matching node' },
  'Afficher le libellé': { ar: 'إظهار التسمية', en: 'Show label' },
  'Masquer le libellé': { ar: 'إخفاء التسمية', en: 'Hide label' },
  'Mode étiquettes des relations :': { ar: 'وضع تسميات العلاقات :', en: 'Relation labels mode:' },
  'Au survol': { ar: 'عند التمرير', en: 'On hover' },
  'Toujours': { ar: 'دائماً', en: 'Always' },
  'Étiquettes des liens reliés aux types :': {
    ar: 'تسميات الروابط المتصلة بالأنواع :',
    en: 'Labels of links connected to types:',
  },
  'Téléphones': { ar: 'هواتف', en: 'Phones' },
  'Comptes': { ar: 'حسابات', en: 'Accounts' },
  'Véhicules': { ar: 'مركبات', en: 'Vehicles' },
  'Familles de liaisons sur le canevas :': { ar: 'فئات الروابط على اللوحة :', en: 'Link families on canvas:' },
  'Dispositions :': { ar: 'التخطيطات :', en: 'Layouts:' },
  'Simulation en Direct': { ar: 'محاكاة حية', en: 'Live Simulation' },
  'Simulation Active (Figer)': { ar: 'المحاكاة نشطة (تثبيت)', en: 'Simulation Active (Freeze)' },
  'Activer la simulation organique des forces en temps réel': {
    ar: 'تفعيل المحاكاة العضوية للقوى في الوقت الفعلي',
    en: 'Enable real-time organic force simulation',
  },
  'Figer la simulation physique en direct': { ar: 'تثبيت المحاكاة الفيزيائية', en: 'Freeze live physical simulation' },
  // ContextMenu & GraphCanvasAdapter
  'Déplier / Replier ses entités cachées liées': {
    ar: 'توسيع / طي الكيانات المخفية المرتبطة',
    en: 'Expand / Collapse linked hidden entities',
  },
  'Mode Liaison Actif :': { ar: 'وضع الربط نشط :', en: 'Link Mode Active:' },
  'Cliquez sur le premier nœud de la liaison...': {
    ar: 'انقر على الكيان الأول للربط...',
    en: 'Click the first node of the link...',
  },
  'Premier nœud sélectionné ({name}). Cliquez sur le nœud cible pour créer la liaison...': {
    ar: 'تم تحديد الكيان الأول ({name}). انقر على الكيان الهدف لإنشاء الرابط...',
    en: 'First node selected ({name}). Click target node to create link...',
  },
  "Déposer l'entité ici pour l'ajouter au graphe": {
    ar: 'أفلت الكيان هنا لإضافته إلى المخطط',
    en: 'Drop entity here to add to graph',
  },
  "Effacer l'overlay SNA": { ar: 'مسح طبقة تحليل الشبكة SNA', en: 'Clear SNA overlay' },
  "Réinitialiser l'affichage SNA": { ar: 'إعادة ضبط عرض SNA', en: 'Reset SNA display' },
  'Cliquer pour ajouter au centre ou glisser sur le canevas : {label} ({domain})': {
    ar: 'انقر للإضافة في المركز أو اسحب إلى اللوحة : {label} ({domain})',
    en: 'Click to add at center or drag onto canvas: {label} ({domain})',
  },
  // DesktopMenuBar & Modals
  'Mode Enquêteur': { ar: 'وضع المحقق', en: 'Investigator Mode' },
  'Mode Analyste': { ar: 'وضع المحلل', en: 'Analyst Mode' },
  'Profil Enquête': { ar: 'نمط التحقيق', en: 'Investigation Profile' },
  'Basculer entre Mode Enquêteur et Mode Analyste': {
    ar: 'التبديل بين وضع المحقق ووضع المحلل',
    en: 'Toggle between Investigator Mode and Analyst Mode',
  },
  'Mode Enquêteur : Vue judiciaire simplifiée pour magistrat et police judiciaire (Cliquer pour basculer en Mode Analyste)': {
    ar: 'وضع المحقق: عرض قضائي مبسط للقاضي والشرطة القضائية (انقر للتبديل إلى وضع المحلل)',
    en: 'Investigator Mode: Simplified judicial view for magistrates and judicial police (Click to switch to Analyst Mode)',
  },
  'Mode Analyste : Métriques forensiques, hashes SHA-256 et ancrage Merkle actifs (Cliquer pour basculer en Mode Enquêteur)': {
    ar: 'وضع المحلل: المقاييس الجنائية وبصمات SHA-256 نشطة (انقر للتبديل إلى وضع المحقق)',
    en: 'Analyst Mode: Forensic metrics, SHA-256 hashes and Merkle anchoring active (Click to switch to Investigator Mode)',
  },
  'Mode Enquêteur actif : Procédure pénale, statuts judiciaires et fiches OPJ clarifiées.': {
    ar: 'وضع المحقق نشط: الإجراءات الجزائية والوضعيات القضائية موضحة.',
    en: 'Investigator Mode active: Criminal procedure, judicial statuses and records clarified.',
  },
  'Mode Analyste actif : Rôles SNA, communautés mathématiques et hashes SHA-256 déverrouillés.': {
    ar: 'وضع المحلل نشط: أدوار SNA والمجتمعات الرياضية وبصمات SHA-256 مفعّلة.',
    en: 'Analyst Mode active: SNA roles, mathematical communities and SHA-256 hashes unlocked.',
  },
  'Affaire enregistrée et scellée dans la base PostgreSQL / TimescaleDB.': {
    ar: 'تم حفظ وختم الملف في قاعدة البيانات PostgreSQL / TimescaleDB.',
    en: 'Case saved and sealed in PostgreSQL / TimescaleDB.',
  },
  'Enregistrement': { ar: 'حفظ', en: 'Save' },
  // Option A: Multi-Tab Investigation Workspace & Actor Sphere
  "Onglets d'enquête et sous-graphes": {
    ar: 'تبويبات التحقيق والرسوم البيانية الفرعية',
    en: 'Investigation tabs and subgraphs',
  },
  'Dossier Général': { ar: 'الملف العام', en: 'General Case' },
  "Sous-graphe isolé selon l'algorithme Actor Sphere": {
    ar: 'رسم فرعي معزول وفق خوارزمية Actor Sphere',
    en: 'Isolated subgraph via Actor Sphere algorithm',
  },
  "Vue d'ensemble complète du dossier": {
    ar: 'نظرة شاملة كاملة على الملف',
    en: 'Full case graph overview',
  },
  'Sphère ({n})': { ar: 'المجال ({n})', en: 'Sphere ({n})' },
  '{n} nœuds': { ar: '{n} كيانات', en: '{n} nodes' },
  "Fermer l'onglet {title}": { ar: 'إغلاق التبويب {title}', en: 'Close tab {title}' },
  "Fermer l'onglet": { ar: 'إغلاق التبويب', en: 'Close tab' },
  'Isoler un acteur dans un nouvel onglet': {
    ar: 'عزل فاعل في تبويب جديد',
    en: 'Isolate an actor in a new tab',
  },
  'Choisir un acteur à isoler': { ar: 'اختر فاعلاً لعزله', en: 'Choose an actor to isolate' },
  'Filtrer une personne ou entreprise...': {
    ar: 'تصفية شخص أو شركة...',
    en: 'Filter a person or company...',
  },
  'Aucun acteur disponible': { ar: 'لا يوجد فاعل متاح', en: 'No actor available' },
  "Arbre des Processus & Bassin d'Indices Non-Inclus": {
    ar: 'شجرة المعالجة وحوض القرائن غير المدرجة',
    en: 'Process Discovery Tree & Pending Clues Pool',
  },
  "Supervision de l'arbre des processus EDA et des indices en attente (Phase 3)": {
    ar: 'مراقبة شجرة المعالجة الحدثية والقرائن قيد الانتظار (المرحلة 3)',
    en: 'EDA process tree supervision and pending clues (Phase 3)',
  },
  'Processus & Bassin': { ar: 'المعالجة والحوض', en: 'Process & Pool' },
  "Ouvrir dans un nouvel onglet d'investigation": {
    ar: 'فتح في تبويب تحقيق جديد',
    en: 'Open in new investigation tab',
  },
  "Acteur frontière : arrêt de l'expansion Actor Sphere": {
    ar: 'فاعل حدودي: توقف توسع Actor Sphere',
    en: 'Boundary actor: Actor Sphere expansion stops here',
  },
  'Frontière': { ar: 'حدودي', en: 'Boundary' },
  "Basculer entre la vue d'ensemble et la vue restreinte de préjudice pour l'onglet actif": {
    ar: 'التبديل بين العرض الكامل وعرض الضرر المحدود للتبويب النشط',
    en: 'Toggle between full overview and critical impact view for the active tab',
  },
  'Onglet actif :': { ar: 'التبويب النشط :', en: 'Active tab:' },
  'Onglet actif : {tab}': { ar: 'التبويب النشط : {tab}', en: 'Active tab: {tab}' },
  'Tous les onglets ({n})': { ar: 'كل التبويبات ({n})', en: 'All tabs ({n})' },
  'Afficher tous les onglets ouverts ({n})': {
    ar: 'عرض كل التبويبات المفتوحة ({n})',
    en: 'Show all open tabs ({n})',
  },
  'Onglets ouverts': { ar: 'التبويبات المفتوحة', en: 'Open tabs' },
  'Échelle de zoom (10% – 1000%)': {
    ar: 'مقياس التكبير (10% – 1000%)',
    en: 'Zoom scale (10% – 1000%)',
  },
  'Choisir l\'échelle du graphe (10% à 1000%)': {
    ar: 'اختر مقياس عرض المخطط (10% إلى 1000%)',
    en: 'Choose graph scale (10% to 1000%)',
  },
  'Échelle :': { ar: 'المقياس :', en: 'Scale:' },
  'Échelle du graphe': { ar: 'مقياس المخطط', en: 'Graph scale' },
  'Échelle du graphe (Zoom) :': { ar: 'مقياس المخطط (التكبير) :', en: 'Graph scale (Zoom):' },
  'Ajuster': { ar: 'ملاءمة', en: 'Fit' },
  'Curseur d\'échelle de zoom': { ar: 'شريط تمرير مقياس التكبير', en: 'Zoom scale slider' },
  'Visibilité par type :': { ar: 'الظهور حسب النوع :', en: 'Visibility by type:' },
  '{n} / {total} visibles': { ar: '{n} / {total} ظاهر', en: '{n} / {total} visible' },
  'Codage couleur des nœuds :': { ar: 'ترميز ألوان الكيانات :', en: 'Node color encoding:' },
  'Intérieur (remplissage)': { ar: 'الداخل (التعبئة)', en: 'Interior (fill)' },
  'Bordure (contour)': { ar: 'الإطار (الحدود)', en: 'Border (outline)' },
  'Coloration du radar': { ar: 'تلوين الرادار', en: 'Radar coloring' },
  'Calques': { ar: 'الطبقات', en: 'Layers' },

  // Option B: Raw File Ingestion, Taxonomy & 3-Mode Process Discovery
  'Mode 1 : Analyse Rapide': { ar: 'الوضع 1: تحليل سريع', en: 'Mode 1: Quick Analysis' },
  'Extraction légère & prioritaire': {
    ar: 'استخلاص خفيف وذو أولوية',
    en: 'Lightweight & priority extraction',
  },
  'Exécute uniquement les extracteurs légers (métadonnées EXIF, vignettes, empreintes, titres OCR) à faible charge CPU/GPU.': {
    ar: 'تشغيل المستخلصات الخفيفة فقط (بيانات EXIF، المصغرات، البصمات، عناوين OCR) بحمل منخفض على المعالج.',
    en: 'Runs only lightweight extractors (EXIF metadata, thumbnails, fingerprints, OCR headers) with low CPU/GPU load.',
  },
  'Extraction rapide en attente (Moteur Phase 2)': {
    ar: 'الاستخلاص السريع قيد الانتظار (محرك المرحلة 2)',
    en: 'Quick extraction pending (Phase 2 Engine)',
  },
  'Mode 2 : Analyse Complète Étape par Étape': {
    ar: 'الوضع 2: تحليل شامل خطوة بخطوة',
    en: 'Mode 2: Complete Step-by-Step Analysis',
  },
  'Contrôle humain (Human-in-the-Loop)': {
    ar: 'تحكم بشري مباشر (Human-in-the-Loop)',
    en: 'Human-in-the-Loop control',
  },
  'Analyse exhaustive avec points de contrôle humains : vous validez chaque découverte intermédiaire avant de lancer les étapes suivantes.': {
    ar: 'تحليل شامل مع نقاط تحقق بشرية: تصادق على كل نتيجة مرحلية قبل إطلاق الخطوات الموالية.',
    en: 'Comprehensive analysis with human checkpoints: validate each intermediate finding before triggering the next steps.',
  },
  'Étape 1 en attente de validation humaine (Phase 2)': {
    ar: 'الخطوة 1 بانتظار المصادقة البشرية (المرحلة 2)',
    en: 'Step 1 awaiting human validation (Phase 2)',
  },
  'Mode 3 : Analyse Complète Autonome Récursive': {
    ar: 'الوضع 3: تحليل ذاتي متكرر شامل',
    en: 'Mode 3: Autonomous Recursive Full Analysis',
  },
  'Saturation informationnelle continue': {
    ar: 'إشباع معلوماتي مستمر',
    en: 'Continuous informational saturation',
  },
  'Orchestration autonome et récursive de tous les plugins SPI et recoupements jusqu’à saturation du Blackboard.': {
    ar: 'تنسيق ذاتي ومتكرر لجميع إضافات SPI والتقاطعات حتى إشباع لوحة التبادل.',
    en: 'Autonomous recursive orchestration of all SPI plugins and cross-checks until Blackboard saturation.',
  },
  'Pipeline récursif autonome planifié (Phase 6)': {
    ar: 'مسار التحليل الذاتي المتكرر مجدول (المرحلة 6)',
    en: 'Autonomous recursive pipeline scheduled (Phase 6)',
  },
  "Photographies & Captures d'Écran": {
    ar: 'صور ولقطات شاشة',
    en: 'Photographs & Screenshots',
  },
  'Notes Vocales & Fichiers Audio': {
    ar: 'رسائل صوتية وملفات صوتية',
    en: 'Voice Notes & Audio Files',
  },
  'Procès-Verbaux & Documents Texte': {
    ar: 'محاضر ووثائق نصية',
    en: 'Reports & Text Documents',
  },
  'Relevés Télécom & Extractions Bancaires': {
    ar: 'كشوفات الاتصالات والاستخلاصات البنكية',
    en: 'Telecom CDRs & Bank Extracts',
  },
  'Pages Web & Captures OSINT': {
    ar: 'صفحات ويب ولقطات OSINT',
    en: 'Web Pages & OSINT Captures',
  },
  'Vidéosurveillance & Vidéos': {
    ar: 'كاميرات مراقبة ومقاطع فيديو',
    en: 'CCTV Footage & Videos',
  },
  'Fichiers DFIR & Extractions Mobiles': {
    ar: 'ملفات DFIR واستخلاصات الهواتف',
    en: 'DFIR Files & Mobile Extractions',
  },
  'E-mails & Correspondances Brutes': {
    ar: 'رسائل بريد إلكتروني ومراسلات خام',
    en: 'Emails & Raw Correspondence',
  },
  "Conteneurs d'Archives": { ar: 'حاويات الأرشيف المضغوط', en: 'Compressed Archive Containers' },
  'Pièce Numérique Brute': { ar: 'دليل رقمي خام', en: 'Raw Digital Evidence' },
  'Extraction GPS, appareil et horodatage EXIF': {
    ar: 'استخراج إحداثيات GPS والجهاز والطابع الزمني EXIF',
    en: 'Extract GPS, device and EXIF timestamp',
  },
  'Lecture OCR des reçus, chèques et plaques': {
    ar: 'قراءة OCR للإيصالات والشيكات ولوحات الترقيم',
    en: 'OCR reading of receipts, cheques and license plates',
  },
  'Détection et vecteurs faciaux 512-d Qdrant': {
    ar: 'كشف الوجوه وتوليد المتجهات 512-d Qdrant',
    en: 'Face detection and 512-d Qdrant face embeddings',
  },
  'Détection objets et véhicules en arrière-plan': {
    ar: 'كشف الأجسام والمركبات في الخلفية',
    en: 'Background object and vehicle detection',
  },
  'Durée, codec, fréquence et empreinte acoustique': {
    ar: 'المدة والترميز والتردد والبصمة الصوتية',
    en: 'Duration, codec, sample rate and acoustic fingerprint',
  },
  'Transcription arabe dialectal algérien et montants DZD': {
    ar: 'تفريغ صوتي بالدارجة الجزائرية والمبالغ بالدينار',
    en: 'Algerian Arabic speech transcription and DZD amounts',
  },
  'Diarisation et séparation locuteur suspect / victime': {
    ar: 'فصل المتحدثين وتمييز المشتبه به عن الضحية',
    en: 'Speaker diarization (suspect vs. victim)',
  },
  'Extraction texte intégral et métadonnées auteur': {
    ar: 'استخراج النص الكامل وبيانات المؤلف',
    en: 'Full text and author metadata extraction',
  },
  'Analyse structurelle et pièces jointes bureautiques': {
    ar: 'تحليل البنية والمرفقات المكتبية',
    en: 'Structural analysis and office attachments',
  },
  'Repérage entités (noms, CCP/BaridiMob, téléphones)': {
    ar: 'استخراج الكيانات (أسماء، CCP/بريدي موب، هواتف)',
    en: 'Named entity extraction (names, CCP/BaridiMob, phones)',
  },
  'Détection schémas numéros DZ et comptes CCP': {
    ar: 'كشف أنماط أرقام الجزائر وحسابات CCP',
    en: 'Algerian phone pattern & CCP account detection',
  },
  'Ingestion massive CDR, bornages BTS et chronologie': {
    ar: 'استيعاب سجلات CDR وتحديد أبراج BTS والتسلسل الزمني',
    en: 'High-volume CDR ingestion, BTS triangulation & timeline',
  },
  'Extraction texte principal, e-mails et métadonnées OpenGraph': {
    ar: 'استخراج النص الرئيسي والبريد وبيانات OpenGraph',
    en: 'Main text, emails and OpenGraph metadata extraction',
  },
  'Repérage traceurs UA-*, Pixels Meta et liens sociaux': {
    ar: 'رصد متعقبات UA-* وبكسلات Meta والروابط الاجتماعية',
    en: 'Tracker UA-*, Meta Pixel & social link discovery',
  },
  'Scellement WARC et instantané probatoire': {
    ar: 'أرشفة WARC مختومة ولقطة إثبات جنائي',
    en: 'WARC forensic snapshot and probative sealing',
  },
  'Horodatage flux et découpage des images clés': {
    ar: 'الطابع الزمني للبث واستخراج الإطارات الرئيسية',
    en: 'Stream timestamping and keyframe extraction',
  },
  'Extraction plaques et véhicules sur images clés': {
    ar: 'استخلاص لوحات الترقيم والمركبات من الإطارات الرئيسية',
    en: 'License plate and vehicle extraction on keyframes',
  },
  'Rapprochement facial sur séquences extraites': {
    ar: 'مطابقة الوجوه عبر المقاطع المستخلصة',
    en: 'Facial matching across extracted sequences',
  },
  'Lecture sûre des bases SQLite (messages, journaux)': {
    ar: 'قراءة آمنة لقواعد SQLite (رسائل، سجلات)',
    en: 'Safe SQLite database reading (messages, logs)',
  },
  'Décompilation APK, permissions et URLs C2': {
    ar: 'تفكيك تطبيقات APK وفحص الأذونات وروابط C2',
    en: 'APK decompilation, permissions & C2 URL inspection',
  },
  'Inspection DNS, certificats TLS et flux PCAP': {
    ar: 'فحص DNS وشهادات TLS وتدفقات PCAP',
    en: 'DNS, TLS certificate & PCAP traffic inspection',
  },
  'En-têtes SMTP Received, émetteur et destinataires': {
    ar: 'ترويسات SMTP Received والمرسل والمستلمون',
    en: 'SMTP Received headers, sender and recipients',
  },
  'Vérification DKIM/DMARC et extraction pièces jointes': {
    ar: 'التحقق من DKIM/DMARC واستخراج المرفقات',
    en: 'DKIM/DMARC verification and attachment extraction',
  },
  'Inventaire arborescent et contrôle anti-Path Traversal': {
    ar: 'جرد الشجرة وفحص الحماية ضد اجتياز المسار',
    en: 'Tree inventory and anti-path-traversal check',
  },
  'Décompression sandboxée et scellement en cascade': {
    ar: 'فك ضغط معزول وختم متسلسل للأدلة',
    en: 'Sandboxed unpacking and cascaded evidence sealing',
  },
  'Identification binaire et scellement WORM MinIO': {
    ar: 'التعرف الثنائي والختم الدائم WORM على MinIO',
    en: 'Magic-byte identification and WORM MinIO sealing',
  },
  "Choix du mode d'investigation forensique": {
    ar: 'اختيار وضع التحقيق الجنائي',
    en: 'Forensic investigation mode selection',
  },
  "Fermer la fenêtre d'analyse": { ar: 'إغلاق نافذة التحليل', en: 'Close analysis dialog' },
  'Empreinte SHA-256 locale (pré-scellage Phase 1)': {
    ar: 'بصمة SHA-256 محلية (ما قبل الختم — المرحلة 1)',
    en: 'Local SHA-256 digest (Phase 1 pre-seal)',
  },
  "Copier l'empreinte SHA-256 complète": {
    ar: 'نسخ بصمة SHA-256 الكاملة',
    en: 'Copy full SHA-256 digest',
  },
  'Le scellage serveur WORM ISO 27037 sera activé en Phase 2.': {
    ar: 'سيتم تفعيل الختم الخادمي WORM ISO 27037 في المرحلة 2.',
    en: 'Server WORM ISO 27037 sealing will activate in Phase 2.',
  },
  'Extracteurs SPI détectés pour ce format': {
    ar: 'مستخلصات SPI المكتشفة لهذا التنسيق',
    en: 'Detected SPI extractors for this format',
  },
  "Modes d'investigation disponibles": {
    ar: 'أوضاع التحقيق المتاحة',
    en: 'Available investigation modes',
  },
  'Lancer': { ar: 'إطلاق', en: 'Launch' },
  "Le scellé numérique reste attaché au graphe. Vous pouvez lancer ou changer le mode plus tard depuis l'Inspecteur.": {
    ar: 'يبقى الدليل الرقمي مرتبطًا بالمخطط. يمكنك إطلاق التحليل أو تغيير الوضع لاحقًا من المفتش.',
    en: 'The digital seal stays attached to the graph. You can launch or switch the mode later from the Inspector.',
  },
  "En cours d'investigation": { ar: 'قيد التحقيق', en: 'Under investigation' },
  'Saturation terminée': { ar: 'اكتمل الإشباع', en: 'Saturation complete' },
  "En attente d'analyse": { ar: 'بانتظار التحليل', en: 'Pending analysis' },
  "En attente du choix de mode par l'enquêteur": {
    ar: 'بانتظار اختيار المحقق لوضع التحليل',
    en: 'Awaiting investigator mode choice',
  },
  "Pipeline d'investigation & Scellé numérique": {
    ar: 'مسار التحقيق والدليل الرقمي المختوم',
    en: 'Investigation pipeline & digital seal',
  },
  "Pipeline d'Investigation SPI": { ar: 'مسار التحقيق SPI', en: 'SPI Investigation Pipeline' },
  "Progression de l'analyse forensique": {
    ar: 'تقدم التحليل الجنائي',
    en: 'Forensic analysis progress',
  },
  "Changer ou lancer un mode d'analyse": {
    ar: 'تغيير أو إطلاق وضع تحليل',
    en: 'Switch or launch an analysis mode',
  },
  "Ouvrir le sélecteur d'analyse": {
    ar: 'فتح محدد أوضاع التحليل',
    en: 'Open analysis mode selector',
  },
  'Investigation forensique en cours sur ce scellé': {
    ar: 'التحقيق الجنائي جاري على هذا الختم الرقمي',
    en: 'Forensic investigation active on this seal',
  },
  "Scellé prêt : choisir un mode d'investigation": {
    ar: 'الختم جاهز: اختر وضع التحقيق',
    en: 'Seal ready: choose an investigation mode',
  },
  'Déposer un fichier brut pour scellage préliminaire SHA-256 et analyse SPI': {
    ar: 'أفلت ملفًا خامًا لحساب SHA-256 الأولي وتحليل SPI',
    en: 'Drop raw file for preliminary SHA-256 seal & SPI analysis',
  },
  'Importer un fichier brut comme scellé numérique': {
    ar: 'استيراد ملف خام كدليل رقمي مختوم',
    en: 'Import raw file as digital evidence seal',
  },
  'Importer un ou plusieurs fichiers bruts (calcul SHA-256 pré-scellage)': {
    ar: 'استيراد ملف خام أو عدة ملفات (حساب SHA-256 الأولي)',
    en: 'Import one or more raw files (pre-seal SHA-256 computation)',
  },
  'Importer fichier': { ar: 'استيراد ملف', en: 'Import file' },
  'Scellé préliminaire "{name}" créé (SHA-256 local)': {
    ar: 'تم إنشاء الختم الأولي "{name}" (SHA-256 محلي)',
    en: 'Preliminary seal "{name}" created (local SHA-256)',
  },
  'Ingestion de pièce brute': { ar: 'إدخال دليل خام', en: 'Raw evidence ingestion' },
  'Mode local temporaire (non persisté sur serveur)': {
    ar: 'وضع محلي مؤقت (غير محفوظ على الخادم)',
    en: 'Temporary local mode (not persisted on server)',
  },
  'Persistance scellé': { ar: 'حفظ الختم الرقمي', en: 'Seal persistence' },
  'Empreinte SHA-256 locale': { ar: 'بصمة SHA-256 محلية', en: 'Local SHA-256 digest' },
  'Outils disponibles': { ar: 'الأدوات المتاحة', en: 'Available tools' },
  'Analyse Rapide': { ar: 'تحليل سريع', en: 'Quick Analysis' },
  'Analyse Complète': { ar: 'تحليل شامل', en: 'Full Analysis' },
  'Analyse Autonome': { ar: 'تحليل ذاتي', en: 'Autonomous Analysis' },
  'Visualiser': { ar: 'معاينة', en: 'Preview' },
  'Nouvel onglet': { ar: 'تبويب جديد', en: 'New tab' },
  'Télécharger': { ar: 'تنزيل', en: 'Download' },
  'Visualisation du fichier': { ar: 'معاينة الملف', en: 'File preview' },
  "Configurer l'arbre des processus": {
    ar: 'تهيئة شجرة العمليات',
    en: 'Configure process tree',
  },
  'Arbre des processus': { ar: 'شجرة العمليات', en: 'Process tree' },
  'Validation humaine requise': {
    ar: 'مطلوب مصادقة بشرية',
    en: 'Human validation required',
  },
  'Pause validation': { ar: 'نقطة مصادقة', en: 'Validation checkpoint' },
  'Ajouter une étape personnalisée': {
    ar: 'إضافة خطوة مخصصة',
    en: 'Add custom step',
  },
  "Enregistrer l'arbre": { ar: 'حفظ الشجرة', en: 'Save tree' },
  'Enregistré': { ar: 'تم الحفظ', en: 'Saved' },
  'Pré-scellage SHA-256 & métadonnées structurelles': {
    ar: 'بصمة SHA-256 الأولية والبيانات الوصفية الهيكلية',
    en: 'SHA-256 pre-seal & structural metadata',
  },
  'Exécution des extracteurs SPI cochés': {
    ar: 'تشغيل مستخلصات SPI المحددة',
    en: 'Run checked SPI extractors',
  },
  "Corrélation graphe & création d'entités dérivées": {
    ar: 'ربط المخطط وإنشاء الكيانات المشتقة',
    en: 'Graph correlation & derived entity creation',
  },
  'Réinjection autonome récursive (saturation Blackboard)': {
    ar: 'إعادة ضخ ذاتية متكررة (إشباع لوحة التبادل)',
    en: 'Recursive autonomous feedback (Blackboard saturation)',
  },
  'Aperçu CSV ({shown} / {total} lignes)': {
    ar: 'معاينة CSV ({shown} / {total} سطر)',
    en: 'CSV preview ({shown} / {total} rows)',
  },
  "Aperçu binaire direct limité aux 64 premiers octets. Utilisez « Nouvel onglet » ou « Télécharger » pour l'ouvrir dans une application externe.": {
    ar: 'المعاينة الثنائية المباشرة محدودة بأول 64 بايت. استخدم « تبويب جديد » أو « تنزيل » لفتحه في تطبيق خارجي.',
    en: 'Direct binary preview limited to the first 64 bytes. Use "New tab" or "Download" to open externally.',
  },
  // Multi-node safe deletion modal & actions
  '{n} entité(s) supprimée(s) du graphe (Ctrl+Z pour annuler).': {
    ar: 'تم حذف {n} كيان(ات) من المخطط (Ctrl+Z للتراجع).',
    en: '{n} entity(ies) deleted from graph (Ctrl+Z to undo).',
  },
  'Suppression effectuée': { ar: 'تم الحذف', en: 'Deletion completed' },
  'Suppression impossible en mode compacté': {
    ar: 'الحذف غير ممكن في الوضع المدمج',
    en: 'Deletion blocked in compacted mode',
  },
  'Confirmer la suppression ({n} entité(s))': {
    ar: 'تأكيد الحذف ({n} كيان(ات))',
    en: 'Confirm deletion ({n} entity(ies))',
  },
  "Cette action est impossible en mode compacté : une tierce personne est impliquée dans les entités intermédiaires reliées aux nœuds sélectionnés. Affichez tout le graphe pour sélectionner manuellement les entités à supprimer.": {
    ar: 'هذا الإجراء غير ممكن في الوضع المدمج: هناك شخص ثالث مرتبط بالكيانات الوسيطة بين العقد المحددة. اعرض كامل المخطط لتحديد الكيانات المراد حذفها يدوياً.',
    en: 'This action is not possible in compacted mode: a third person is implicated in the intermediate entities linked to the selected nodes. Switch to the full graph to manually select the entities to delete.',
  },
  'Tierces personnes impliquées ({n}) :': {
    ar: 'الأشخاص الثالثون المرتبطون ({n}) :',
    en: 'Implicated third parties ({n}):',
  },
  'via': { ar: 'عبر', en: 'via' },
  'Entités sélectionnées à supprimer ({n}) :': {
    ar: 'الكيانات المحددة للحذف ({n}) :',
    en: 'Selected entities to delete ({n}):',
  },
  // Phase 2A: Static PDF extraction & isolated validation
  'Actif': { ar: 'نشط', en: 'Active' },
  'Isoler pour valider ({n})': {
    ar: 'عزل للتحقق من ({n})',
    en: 'Isolate to validate ({n})',
  },
  '{n} à valider': { ar: '{n} للتحقق', en: '{n} to review' },
  'Candidat': { ar: 'مرشح', en: 'Candidate' },
  'Candidat extrait en attente de validation': {
    ar: 'كيان مستخرج بانتظار المصادقة',
    en: 'Extracted candidate awaiting validation',
  },
  'Validation des entités extraites': {
    ar: 'التحقق من الكيانات المستخرجة',
    en: 'Extracted entity validation',
  },
  'Indices extraits à valider': {
    ar: 'الأدلة المستخرجة للمصادقة',
    en: 'Extracted clues to validate',
  },
  'Mode 2 : Étape {c}/{t}': {
    ar: 'الوضع 2 : المرحلة {c}/{t}',
    en: 'Mode 2: Stage {c}/{t}',
  },
  "Exécuter l'étape suivante": {
    ar: 'تنفيذ المرحلة التالية',
    en: 'Run next stage',
  },
  'Valider la sélection ({n})': {
    ar: 'اعتماد المحدد ({n})',
    en: 'Validate selected ({n})',
  },
  'Écarter': { ar: 'استبعاد', en: 'Reject' },
  'Valider': { ar: 'اعتماد', en: 'Validate' },
  'Fusionner': { ar: 'دمج', en: 'Merge' },
  'Confirmer': { ar: 'تأكيد', en: 'Confirm' },
  "Confirmer l'ajout de {n} entité(s) au graphe d'enquête ?": {
    ar: 'تأكيد إضافة {n} كيان(ات) إلى مخطط التحقيق؟',
    en: 'Confirm adding {n} entity(ies) to the investigation graph?',
  },
  'Confirmer le rejet de {n} candidat(s) ?': {
    ar: 'تأكيد استبعاد {n} مرشح(ات)؟',
    en: 'Confirm rejecting {n} candidate(s)?',
  },
  'Tous les candidats extraits ont été arbitrés.': {
    ar: 'تم البت في جميع الكيانات المستخرجة.',
    en: 'All extracted candidates have been reviewed.',
  },
  'Doublon potentiel : {name}': {
    ar: 'تكرار محتمل : {name}',
    en: 'Potential duplicate: {name}',
  },
  '{n} indice(s) prêt(s) pour publication Blackboard (Phase 2B)': {
    ar: '{n} مؤشر(ات) جاهزة للنشر في لوحة التبادل (المرحلة 2B)',
    en: '{n} clue(s) ready for Blackboard publication (Phase 2B)',
  },
  'Étape suivante exécutée': { ar: 'تم تنفيذ المرحلة التالية', en: 'Next stage executed' },
  'Extraction': { ar: 'الاستخراج الجنائي', en: 'Extraction' },
  'Extraction PDF': { ar: 'استخراج PDF', en: 'PDF Extraction' },
  'Relations sémantiques détectées': {
    ar: 'العلاقات الدلالية المستخرجة',
    en: 'Detected semantic relations',
  },
  'Relation mise à jour': { ar: 'تم تحديث العلاقة', en: 'Relation updated' },
  'Relation supprimée': { ar: 'تم حذف العلاقة', en: 'Relation deleted' },
  'Relation supprimée du dossier': {
    ar: 'تم حذف العلاقة من الملف',
    en: 'Relation deleted from case',
  },
  'Relation validée et ajoutée au graphe': {
    ar: 'تم اعتماد العلاقة وإضافتها إلى المخطط',
    en: 'Relation validated and added to graph',
  },
  '{n} relation(s) validée(s) et ajoutée(s) au graphe': {
    ar: 'تم اعتماد {n} علاقة وإضافتها إلى المخطط',
    en: '{n} relation(s) validated and added to graph',
  },
  'Supprimer la relation': { ar: 'حذف العلاقة', en: 'Delete relation' },
  'Confirmer la suppression définitive de cette relation ?': {
    ar: 'تأكيد الحذف النهائي لهذه العلاقة؟',
    en: 'Confirm permanent deletion of this relation?',
  },
  'Enregistrer la Relation': { ar: 'حفظ العلاقة', en: 'Save Relation' },
  'Type de Relation': { ar: 'نوع العلاقة', en: 'Relation Type' },
  'Valider ({n})': { ar: 'اعتماد ({n})', en: 'Validate ({n})' },
  'Inverser': { ar: 'عكس الاتجاه', en: 'Swap direction' },
  'Sens inversé': { ar: 'تم عكس الاتجاه', en: 'Direction swapped' },
  'Modifier': { ar: 'تعديل', en: 'Edit' },
  'Supprimer': { ar: 'حذف', en: 'Delete' },
  'Indice écarté': { ar: 'تم استبعاد المؤشر', en: 'Candidate rejected' },
  'Indice fusionné avec le nœud existant': {
    ar: 'تم دمج المؤشر مع العقدة الحالية',
    en: 'Candidate merged with existing node',
  },
  'Entité validée et ajoutée au graphe': {
    ar: 'تم اعتماد الكيان وإضافته للمخطط',
    en: 'Entity validated and added to graph',
  },
  'Validation isolée': { ar: 'مصادقة معزولة', en: 'Isolated validation' },
  'Validation groupée': { ar: 'مصادقة جماعية', en: 'Bulk validation' },
  '{n} entité(s) validée(s) et reliée(s) à la pièce': {
    ar: 'تم اعتماد {n} كيان(ات) وربطها بالوثيقة',
    en: '{n} entity(ies) validated and linked to evidence',
  },
  '{n} candidat(s) écarté(s)': { ar: 'تم استبعاد {n} مرشح(ات)', en: '{n} candidate(s) rejected' },
  'Entités intermédiaires entre les nœuds (également supprimées) ({n}) :': {
    ar: 'الكيانات الوسيطة بين العقد (سيتم حذفها أيضاً) ({n}) :',
    en: 'Intermediate entities between nodes (also deleted) ({n}):',
  },
  'Total : {nodes} entité(s) et {edges} liaison(s) associée(s) seront supprimées.': {
    ar: 'الإجمالي: سيتم حذف {nodes} كيان(ات) و {edges} رابط(روابط) مرتبط(ة).',
    en: 'Total: {nodes} entity(ies) and {edges} associated link(s) will be deleted.',
  },
  'Afficher tout le graphe et sélectionner les nœuds': {
    ar: 'عرض كامل المخطط وتحديد الكيانات',
    en: 'Show full graph and select nodes',
  },
  'Supprimer ({n})': { ar: 'حذف ({n})', en: 'Delete ({n})' },
  'Supprimer la sélection ({n})': {
    ar: 'حذف التحديد ({n})',
    en: 'Delete selection ({n})',
  },
  'Supprimer ce nœud': { ar: 'حذف هذا الكيان', en: 'Delete this node' },
  'Qualification judiciaire (Suspect / Victime / Témoin) :': {
    ar: 'الصفة القضائية (مشتبه فيه / ضحية / شاهد) :',
    en: 'Judicial role (Suspect / Victim / Witness):',
  },
  'Inverser Source ↔ Cible': {
    ar: 'عكس المصدر ↔ الهدف',
    en: 'Swap Source ↔ Target',
  },
  'Sens inverse': {
    ar: 'اتجاه عكسي',
    en: 'Reverse direction',
  },
  'Utiliser la relation personnalisée : {name}': {
    ar: 'استخدام علاقة مخصصة : {name}',
    en: 'Use custom relation: {name}',
  },
  'Unité Enquêteuse :': { ar: 'الوحدة المحققة :', en: 'Investigating Unit:' },
  'Magistrat Instructeur :': { ar: 'قاضي التحقيق :', en: 'Instructing Magistrate:' },
  'Juridiction Compétente :': { ar: 'الجهة القضائية المختصة :', en: 'Competent Jurisdiction:' },
  'Wilaya :': { ar: 'الولاية :', en: 'Wilaya:' },
  'Wilaya(s) Rattachée(s) :': { ar: 'الولاية (الولايات) المعنية :', en: 'Associated Wilaya(s):' },
  "Métadonnées de l'affaire enregistrées.": {
    ar: 'تم حفظ البيانات الوصفية للقضية.',
    en: 'Case metadata saved.',
  },
  'Dossier Judiciaire': { ar: 'الملف القضائي', en: 'Judicial Case' },
  "Échec de la mise à jour des métadonnées de l'affaire.": {
    ar: 'فشل تحديث البيانات الوصفية للقضية.',
    en: 'Failed to update case metadata.',
  },
  'Enregistrer': { ar: 'حفظ', en: 'Save' },
  'Déjà présent dans la base : {name}': {
    ar: 'موجود مسبقاً في قاعدة البيانات : {name}',
    en: 'Already present in database: {name}',
  },
  "Finaliser l'analyse (100%)": {
    ar: 'إكمال التحليل (100%)',
    en: 'Complete analysis (100%)',
  },
  'Méta & Images': {
    ar: 'البيانات الوصفية والصور',
    en: 'Meta & Images',
  },
  'Texte & Regex': {
    ar: 'النصوص والمعرفات',
    en: 'Text & Regex',
  },
  'NER & Entités': {
    ar: 'الكيانات والمحلل اللغوي',
    en: 'NER & Entities',
  },
  'Qualification : {status}': {
    ar: 'الصفة القضائية : {status}',
    en: 'Judicial role: {status}',
  },
  'Valider et ajouter au graphe': {
    ar: 'اعتماد وإضافة إلى المخطط',
    en: 'Validate and add to graph',
  },
  'Écarter cet indice': {
    ar: 'استبعاد هذا المؤشر',
    en: 'Discard this clue',
  },
  'Modifier les informations': {
    ar: 'تعديل المعلومات',
    en: 'Edit information',
  },
  'Ajouter un attribut': {
    ar: 'إضافة خاصية',
    en: 'Add attribute',
  },
  'Nom du champ': {
    ar: 'اسم الحقل',
    en: 'Field name',
  },
  'Modifications enregistrées': {
    ar: 'تم حفظ التعديلات',
    en: 'Changes saved',
  },
  'Tout déplier': {
    ar: 'توسيع الكل',
    en: 'Expand all',
  },
  'Tout replier': {
    ar: 'طي الكل',
    en: 'Collapse all',
  },
  'Filtrer par type': {
    ar: 'تصفية حسب النوع',
    en: 'Filter by type',
  },
  'Déjà en base': {
    ar: 'موجود مسبقاً',
    en: 'Already in DB',
  },
  // Dynamic Case Overview KPIs & Geo Cascade Labels
  'Aucun flux financier saisi': {
    ar: 'لا يوجد تدفق مالي مسجل',
    en: 'No financial flow recorded',
  },
  'Transactions financières': {
    ar: 'المعاملات المالية',
    en: 'Financial transactions',
  },
  '{n} plaignant(s)': {
    ar: '{n} شاكي/شاكين',
    en: '{n} complainant(s)',
  },
  'Suspects & Mis en Cause': {
    ar: 'المشتبه بهم والمتورطون',
    en: 'Suspects & Implicated',
  },
  'Acteurs mis en cause': {
    ar: 'الأطراف المشتبه بها',
    en: 'Implicated actors',
  },
  'Aucune wilaya identifiée': {
    ar: 'لم يتم تحديد أي ولاية',
    en: 'No wilaya identified',
  },
  '{n} wilaya(s)': {
    ar: '{n} ولاية',
    en: '{n} wilaya(s)',
  },
  'Aucun objet analysé': {
    ar: 'لا يوجد أي عنصر محلل',
    en: 'No analyzed object',
  },
  '{pct}% SHA-256 vérifiés': {
    ar: '{pct}% تم التحقق منها بـ SHA-256',
    en: '{pct}% SHA-256 verified',
  },
  'À Investiguer & À Valider': {
    ar: 'قيد التحقيق والمصادقة',
    en: 'To Investigate & Validate',
  },
  '{inv} à analyser • {val} à valider': {
    ar: '{inv} للتحليل • {val} للمصادقة',
    en: '{inv} to analyze • {val} to validate',
  },
  'Aucun indice en attente de validation pour ce dossier.': {
    ar: 'لا توجد مؤشرات في انتظار المصادقة لهذا الملف.',
    en: 'No clues pending validation for this case.',
  },
  '{n} relation(s) en attente de validation': {
    ar: '{n} علاقة في انتظار المصادقة',
    en: '{n} relation(s) pending validation',
  },
  'Inspecter': {
    ar: 'فحص',
    en: 'Inspect',
  },
  'Indice versé au dossier judiciaire': {
    ar: 'تم إدراج الدليل في الملف القضائي',
    en: 'Clue added to judicial case',
  },
  'Validation': {
    ar: 'مصادقة',
    en: 'Validation',
  },
  'Échec de la validation': {
    ar: 'فشل في المصادقة',
    en: 'Validation failed',
  },
  'Rejet': {
    ar: 'استبعاد',
    en: 'Dismissed',
  },
  'Échec du rejet': {
    ar: 'فشل في الاستبعاد',
    en: 'Dismissal failed',
  },
  'Localisation Administrative (Wilaya → Daïra → Commune)': {
    ar: 'التحديد الإداري (الولاية ← الدائرة ← البلدية)',
    en: 'Administrative Location (Wilaya → Daïra → Commune)',
  },
  '1. Wilaya (58) *': {
    ar: '1. الولاية (58) *',
    en: '1. Wilaya (58) *',
  },
  'Rechercher code ou nom (ex: 16, Alger)...': {
    ar: 'ابحث بالرمز أو الاسم (مثال: 16، الجزائر)...',
    en: 'Search code or name (e.g. 16, Algiers)...',
  },
  '2. Daïra *': {
    ar: '2. الدائرة *',
    en: '2. Daïra *',
  },
  'Rechercher une daïra...': {
    ar: 'ابحث عن دائرة...',
    en: 'Search daïra...',
  },
  '3. Commune *': {
    ar: '3. البلدية *',
    en: '3. Commune *',
  },
  'Rechercher une commune...': {
    ar: 'ابحث عن بلدية...',
    en: 'Search commune...',
  },
  'Rue, Numéro, Bâtiment / Repère (Optionnel)': {
    ar: 'الشارع، الرقم، المبنى / المعلم (اختياري)',
    en: 'Street, Number, Building / Landmark (Optional)',
  },
  'ex: 14 Rue Didouche Mourad, Zone Industrielle...': {
    ar: 'مثال: 14 شارع ديدوش مراد، المنطقة الصناعية...',
    en: 'e.g. 14 Rue Didouche Mourad, Industrial Zone...',
  },
  'SOCMINT': {
    ar: 'الشبكات الاجتماعية OSINT',
    en: 'SOCMINT',
  },
  'Catégories': {
    ar: 'الفئات',
    en: 'Categories',
  },
  'Types': {
    ar: 'الأنواع',
    en: 'Types',
  },
  'Télécoms & CDR': {
    ar: 'الاتصالات وسجلات المكالمات',
    en: 'Telecoms & CDR',
  },
  'Finances & Virements': {
    ar: 'المالية والتحويلات',
    en: 'Finance & Transfers',
  },
  'Réseaux Sociaux & OSINT': {
    ar: 'الشبكات الاجتماعية والاستخبارات',
    en: 'Social Media & OSINT',
  },
  'Procédure & Justice': {
    ar: 'الإجراءات والقضاء',
    en: 'Procedure & Justice',
  },
  'Relations Générales': {
    ar: 'العلاقات العامة',
    en: 'General Relations',
  },
  '{n} relation(s) écartée(s)': {
    ar: 'تم استبعاد {n} علاقة',
    en: '{n} relation(s) dismissed',
  },
  "Confirmer l'ajout de {n} relation(s) au graphe d'enquête ?": {
    ar: 'تأكيد إضافة {n} علاقة إلى مخطط التحقيق؟',
    en: 'Confirm adding {n} relation(s) to the investigation graph?',
  },
  'Confirmer le rejet de {n} relation(s) ?': {
    ar: 'تأكيد استبعاد {n} علاقة؟',
    en: 'Confirm rejecting {n} relation(s)?',
  },
  'Calque': {
    ar: 'الطبقة',
    en: 'Layer',
  },
  'Promouvoir en VERIFIED': {
    ar: 'ترقية إلى VERIFIED',
    en: 'Promote to VERIFIED',
  },
  'Échec de la mise à jour du calque sur le serveur.': {
    ar: 'فشل تحديث الطبقة على الخادم.',
    en: 'Failed to update layer on server.',
  },
};
