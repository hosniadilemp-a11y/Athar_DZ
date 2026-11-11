# Complete multilingual dictionary additions for Menubar, Tool Modals, Categories, and Topbar
# Supports French (FR), Arabic RTL (AR), and English (EN) with 100% parity

menu_keys_fr = {
    # Brand & Headers
    "app_title": "Athar DZ",
    "menu_investigation": "Dossier",
    "menu_edit": "Édition",
    "menu_insert": "Insérer",
    "menu_osint": "Outils OSINT",
    "menu_osns": "Réseaux Sociaux (OSNA)",
    "menu_police": "Police Judiciaire",
    "menu_view": "Affichage",
    "menu_ai": "Assistant IA",

    # Categories
    "cat_web_infra": "Web & Infrastructure Réseau",
    "cat_tech_metadata": "Métadonnées & Analyse Technique",
    "cat_ad_tracking": "Pivots Publicitaires & Traçage",
    "cat_breach_identity": "Fuites de Données & Identifiants",
    "cat_socmint": "Profilage Plateformes Sociales (SOCMINT)",
    "cat_sna": "Analyse de Réseau Social (Graph SNA)",

    # Topbar & Search
    "topbar_search_placeholder": "Rechercher un indice, numéro, suspect ou lancer un outil... (Ctrl+K)",
    "info_chip": "Détails",

    # Tool Info Modal Labels
    "tool_info_title": "Fiche Technique & Spécification Forensique",
    "tool_info_inputs": "Données d'Entrée (Inputs)",
    "tool_info_outputs": "Données de Sortie (Outputs & Nœuds)",
    "tool_info_storage": "Persistance & Stockage Judiciaire",
    "tool_info_resources": "Ressources & Mode d'Exécution",
    "tool_info_compliance": "Chaîne de Garde & Traçabilité WORM",
    "tool_info_run_btn": "Exécuter sur l'Indice Actif",
    "tool_info_playbook_btn": "Ajouter au Playbook DAG",
    "tool_info_close_btn": "Fermer",

    # Investigation Menu Items
    "m_new_case": "Nouveau Dossier d'Enquête...",
    "m_open_case": "Ouvrir un Dossier...",
    "m_save": "Enregistrer",
    "m_save_as": "Enregistrer sous...",
    "m_import_clues": "Importer des Indices (CDR, Photos)...",
    "m_case_properties": "Propriétés de l'Enquête...",
    "m_export_report": "Exporter Rapport Judiciaire (PDF)...",

    # Edit Menu Items
    "m_undo": "Annuler Dernière Action",
    "m_redo": "Rétablir",
    "m_cut": "Couper",
    "m_copy": "Copier",
    "m_paste": "Coller",
    "m_merge_clues": "Fusionner Deux Indices Identiques",
    "m_select_all": "Sélectionner Tout le Graphe",
    "m_delete_node": "Supprimer l'Indice Sélectionné",

    # Insert Menu Items
    "m_insert_clue": "Nouvel Indice Manuel...",
    "m_insert_seized": "Pièce à Conviction Scellée (WORM)...",
    "m_insert_witness": "Déposition / Audition de Témoin...",
    "m_insert_web_snap": "Capture Web Certifiée (RFC 3161)...",
    "m_insert_gps": "Coordonnées GPS / Point de Bornage...",
    "m_insert_suspect": "Profil / Compte Suspect Cible...",

    # OSINT Tools
    "m_tool_ioc": "Extracteur d'IOCs & Entités Forensiques",
    "m_tool_objectid": "Décodeur MongoDB ObjectId & Timestamp",
    "m_tool_mongo": "Décodeur MongoDB ObjectId & Timestamp",
    "m_tool_pixel": "Pivot Inverse Meta Pixel & ID Tracker",
    "m_tool_whois": "Historique WHOIS & Enregistrements DNS",
    "m_tool_shodan": "Scanner de Ports Shodan & Censys",
    "m_tool_breach": "Recherche de Fuites d'Identifiants (DeHashed)",
    "m_tool_ssl": "Certificats SSL & Certificate Transparency (crt.sh)",
    "m_tool_exif": "Analyseur ExifTool (GPS & Métadonnées Médias)",
    "m_tool_google_analytics": "Traçage Reverse Google Analytics / AdSense",
    "m_tool_holehe": "Vérificateur d'Email sur 120+ Services (Holehe)",
    "m_tool_all_osint": "Consulter les 16 Briques OSINT du Catalogue ↗",

    # Social Networks (OSNA) Tools
    "m_tool_telegram": "Résolveur & Pivot Telegram (UID fixe, canaux)",
    "m_tool_whatsapp": "Inspecteur WhatsApp Business & VCard",
    "m_tool_meta_ad": "Transparence Pages Facebook & Meta Ad Library",
    "m_tool_fb_page": "Transparence Pages Facebook & Meta Ad Library",
    "m_tool_meta_ads": "Transparence Pages Facebook & Meta Ad Library",
    "m_tool_instagram": "Analyseur Profils Instagram / Toutatis",
    "m_tool_ouedkniss": "Scraper d'Annonces Algériennes Ouedkniss",
    "m_tool_social_mapper": "Corrélateur Visuel Multi-Plateformes (Social Mapper)",
    "m_tool_sna_betweenness": "Centralité d'Intermédiarité (Betweenness Centrality)",
    "m_tool_sna_louvain": "Détection de Communautés (Algorithme de Louvain)",
    "m_tool_sna_pagerank": "Détection de Prête-Noms & Mules (PageRank Bipartite)",
    "m_tool_sna_link_pred": "Prédiction de Liens Cachés (Adamic-Adar / Jaccard)",
    "m_tool_all_socmint": "Consulter les 12 Outils de Réseaux Sociaux & SNA ↗",

    # Police & Telecom Tools
    "m_tool_cdr": "Analyseur de Relevés Télécoms (CDR Excel)",
    "m_tool_cell_triang": "Bornage & Azimuts BTS Relais (OpenCellID)",
    "m_tool_cotravel": "Détecteur de Téléphones Jumeaux (Co-Déplacement)",
    "m_tool_alibi": "Contrôleur de Contradictions d'Alibis",
    "m_tool_alpr": "Reconnaissance de Plaques LAPI (Matricules DZ)",
    "m_tool_ccp_mules": "Validateur CCP BaridiMob & Registre des Mules",
    "m_tool_requisitions": "Générateur Réquisitions CPP (Docx/PDF)",
    "m_tool_all_police": "Consulter les Briques Enquête Policière (9 Outils) ↗",

    # View Menu Items
    "m_view_graph": "Tableau des Indices (Graphe Visuel)",
    "m_view_timeline": "Chronologie Temporelle Forensique",
    "m_view_map": "Carte Géographique des Bornages & SIG",
    "m_view_vault": "Coffre-fort des Preuves Certifiées (WORM)",
    "m_view_reset_zoom": "Réinitialiser le Zoom & Centrer la Vue",
    "m_view_toggle_layers": "Afficher / Masquer Panneau des Calques",
    "m_view_toggle_fullscreen": "Plein Écran (F11)",
    "m_view_refresh": "Réorganiser la Disposition Automatique",

    # AI & LLM Menu Items
    "m_ai_mode_deterministic": "Mode Déterministe Strict (Sans LLM - Actif)",
    "m_ai_mode_local_ollama": "Activer Copilot IA Local (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "Passerelle Cloud Sécurisée (LiteLLM)",
    "m_ai_suggest_playbook": "Proposer un Scénario d'Enquête Automatique",
    "m_ai_summarize": "Rédiger Synthèse Chronologique de l'Affaire",
    "m_ai_settings": "Configuration LLM & Paramètres d'Inférence...",

    # Modals
    "modal_properties_title": "Propriétés du Dossier d'Investigation",
    "modal_insert_title": "Insérer un Nouvel Indice / Preuve",
    "modal_llm_title": "Configuration du Copilot IA & Moteur LLM",
    "modal_import_title": "Importer des Fichiers & Preuves Forensiques",
    "btn_save_changes": "Enregistrer les Modifications",
    "btn_cancel": "Annuler",
    "btn_insert_confirm": "Ajouter l'Indice au Dossier"
}

menu_keys_ar = {
    # Brand & Headers
    "app_title": "أثر (Athar DZ)",
    "menu_investigation": "الملف",
    "menu_edit": "تعديل",
    "menu_insert": "إدراج",
    "menu_osint": "أدوات OSINT",
    "menu_osns": "الشبكات الاجتماعية (OSNA)",
    "menu_police": "الشرطة القضائية",
    "menu_view": "عرض",
    "menu_ai": "مساعد الذكاء الاصطناعي",

    # Categories
    "cat_web_infra": "الويب والبنية التحتية",
    "cat_tech_metadata": "البيانات الوصفية والتحليل التقني",
    "cat_ad_tracking": "التتبع والإعلانات الرقمية",
    "cat_breach_identity": "تسريبات البيانات والهويات",
    "cat_socmint": "استخبارات المنصات الاجتماعية (SOCMINT)",
    "cat_sna": "تحليل الشبكات الاجتماعية (Graph SNA)",

    # Topbar & Search
    "topbar_search_placeholder": "بحث عن دليل، رقم هاتف، مشتبه به أو تشغيل أداة... (Ctrl+K)",
    "info_chip": "بطاقة تقنية",

    # Tool Info Modal Labels
    "tool_info_title": "البطاقة التقنية والمواصفات الجنائية",
    "tool_info_inputs": "بيانات الدخل (Inputs)",
    "tool_info_outputs": "بيانات الخرج والعقد المنشأة (Outputs)",
    "tool_info_storage": "التخزين والحفظ القضائي",
    "tool_info_resources": "الموارد ونمط التشغيل",
    "tool_info_compliance": "سلسلة الحراسة والتتبع القانوني WORM",
    "tool_info_run_btn": "تشغيل على الدليل المحدد",
    "tool_info_playbook_btn": "إضافة إلى سيناريو التحقيق DAG",
    "tool_info_close_btn": "إغلاق",

    # Investigation Menu Items
    "m_new_case": "ملف تحقيق جديد...",
    "m_open_case": "فتح ملف تحقيق...",
    "m_save": "حفظ",
    "m_save_as": "حفظ باسم...",
    "m_import_clues": "استيراد أدلة (سجلات هاتف، صور)...",
    "m_case_properties": "خصائص القضية...",
    "m_export_report": "تصدير تقرير قضائي (PDF)...",

    # Edit Menu Items
    "m_undo": "تراجع عن آخر إجراء",
    "m_redo": "إعادة",
    "m_cut": "قص",
    "m_copy": "نسخ",
    "m_paste": "لصق",
    "m_merge_clues": "دمج دليلين متطابقين",
    "m_select_all": "تحديد كل الرسم البياني",
    "m_delete_node": "حذف الدليل المحدد",

    # Insert Menu Items
    "m_insert_clue": "دليل يدوي جديد...",
    "m_insert_seized": "حريزة رقمية مشفرة (WORM)...",
    "m_insert_witness": "محضر سماع شاهد / إفادة...",
    "m_insert_web_snap": "توثيق ويب موثوق (RFC 3161)...",
    "m_insert_gps": "إحداثيات جغرافية / نقطة تموضع...",
    "m_insert_suspect": "حساب / هوية المشتبه به المستهدف...",

    # OSINT Tools
    "m_tool_ioc": "مستخرج مؤشرات الاختراق والكيانات",
    "m_tool_objectid": "مفكك طوابع وقت معرفات مونغو",
    "m_tool_mongo": "مفكك طوابع وقت معرفات مونغو",
    "m_tool_pixel": "التتبع العكسي لبيكسل ميتا ومعرفات التتبع",
    "m_tool_whois": "سجل أسماء النطاقات وبيانات WHOIS",
    "m_tool_shodan": "ماسح المنافذ شودان وسنسيس",
    "m_tool_breach": "البحث في تسريبات الحسابات (DeHashed)",
    "m_tool_ssl": "شهادات التشفير وسجلات الشفافية (crt.sh)",
    "m_tool_exif": "محلل البيانات الوصفية للصور وإحداثيات GPS",
    "m_tool_google_analytics": "تتبع معرفات غوغل أناليتكس وأدسنس",
    "m_tool_holehe": "فاحص البريد الإلكتروني عبر أكثر من 120 موقع",
    "m_tool_all_osint": "استعراض 16 أداة OSINT في الفهرس ↗",

    # Social Networks (OSNA) Tools
    "m_tool_telegram": "كاشف حسابات وقنوات تيليغرام (UID)",
    "m_tool_whatsapp": "فاحص حسابات واتساب للأعمال والبطاقات",
    "m_tool_meta_ad": "شفافية صفحات فيسبوك ومكتبة الإعلانات",
    "m_tool_fb_page": "شفافية صفحات فيسبوك ومكتبة الإعلانات",
    "m_tool_meta_ads": "شفافية صفحات فيسبوك ومكتبة الإعلانات",
    "m_tool_instagram": "محلل ملفات إنستغرام عبر توتاتيس",
    "m_tool_ouedkniss": "كاشط إعلانات واد كنيس الجزائرية",
    "m_tool_social_mapper": "المطابق البصري عبر المنصات الاجتماعية",
    "m_tool_sna_betweenness": "مركزية الوساطة لتحديد المنسقين",
    "m_tool_sna_louvain": "كشف المجتمعات وخلايا الجريمة (لوفان)",
    "m_tool_sna_pagerank": "كشف واجهات الأموال والحسابات الوهمية",
    "m_tool_sna_link_pred": "التنبؤ بالروابط والعلاقات الخفية",
    "m_tool_all_socmint": "استعراض 12 أداة للشبكات الاجتماعية و SNA ↗",

    # Police & Telecom Tools
    "m_tool_cdr": "محلل سجلات المكالمات الهاتفية (CDR)",
    "m_tool_cell_triang": "تحديد المواقع وزوايا الأبراج (OpenCellID)",
    "m_tool_cotravel": "كاشف الهواتف المرافقة (التنقل المتزامن)",
    "m_tool_alibi": "التحقق من تناقضات حجة الغياب",
    "m_tool_alpr": "التعرف الآلي على لوحات السيارات (LAPI الجزائر)",
    "m_tool_ccp_mules": "مدقق حسابات بريدي موب والواجهات المالية",
    "m_tool_requisitions": "منشئ الإنابات والأوامر القضائية (ق.إ.ج)",
    "m_tool_all_police": "استعراض أدوات التحقيق الجنائي والاتصالات (9 أدوات) ↗",

    # View Menu Items
    "m_view_graph": "لوحة الأدلة (الرسم البياني المرئي)",
    "m_view_timeline": "المخطط الزمني الجنائي",
    "m_view_map": "خريطة المواقع الجغرافية والأبراج",
    "m_view_vault": "خزينة الأدلة الرقمية المشفرة (WORM)",
    "m_view_reset_zoom": "إعادة ضبط التكبير وتوسيط العرض",
    "m_view_toggle_layers": "إظهار / إخفاء لوحة الطبقات",
    "m_view_toggle_fullscreen": "ملء الشاشة (F11)",
    "m_view_refresh": "إعادة تنظيم التوزيع الآلي",

    # AI & LLM Menu Items
    "m_ai_mode_deterministic": "النمط القطعي الصارم (بدون LLM - نشط)",
    "m_ai_mode_local_ollama": "تفعيل المساعد الذكي المحلي (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "البوابة السحابية المؤمنة (LiteLLM)",
    "m_ai_suggest_playbook": "اقتراح سيناريو تحقيق آلي (Playbook DAG)",
    "m_ai_summarize": "صياغة خلاصة كرونولوجية للقضية",
    "m_ai_settings": "إعدادات نماذج الذكاء الاصطناعي والاستدلال...",

    # Modals
    "modal_properties_title": "خصائص ملف التحقيق القضائي",
    "modal_insert_title": "إدراج دليل أو حريزة جديدة",
    "modal_llm_title": "إعدادات المساعد الذكي ومحرك النماذج اللغوية",
    "modal_import_title": "استيراد ملفات وأدلة جنائية",
    "btn_save_changes": "حفظ التغييرات",
    "btn_cancel": "إلغاء",
    "btn_insert_confirm": "إدراج الدليل في القضية"
}

menu_keys_en = {
    # Brand & Headers
    "app_title": "Athar DZ",
    "menu_investigation": "Case",
    "menu_edit": "Edit",
    "menu_insert": "Insert",
    "menu_osint": "OSINT Tools",
    "menu_osns": "Social Networks (OSNA)",
    "menu_police": "Criminal Investigation",
    "menu_view": "View",
    "menu_ai": "AI Assistant",

    # Categories
    "cat_web_infra": "Web & Infrastructure",
    "cat_tech_metadata": "Technical Metadata & IOCs",
    "cat_ad_tracking": "Ad Tracking & ID Pivots",
    "cat_breach_identity": "Data Breaches & Credentials",
    "cat_socmint": "Social Platform Intelligence (SOCMINT)",
    "cat_sna": "Social Network Analysis (Graph SNA)",

    # Topbar & Search
    "topbar_search_placeholder": "Search clue, phone, suspect or launch tool... (Ctrl+K)",
    "info_chip": "Spec Info",

    # Tool Info Modal Labels
    "tool_info_title": "Forensic Tool Technical Specification",
    "tool_info_inputs": "Input Data (Inputs)",
    "tool_info_outputs": "Output Data & Created Nodes (Outputs)",
    "tool_info_storage": "Forensic Storage & Legal Custody",
    "tool_info_resources": "Resources & Execution Footprint",
    "tool_info_compliance": "Chain of Custody & WORM Compliance",
    "tool_info_run_btn": "Run on Selected Clue",
    "tool_info_playbook_btn": "Add to Playbook DAG",
    "tool_info_close_btn": "Close",

    # Investigation Menu Items
    "m_new_case": "New Investigation Case...",
    "m_open_case": "Open Case...",
    "m_save": "Save",
    "m_save_as": "Save As...",
    "m_import_clues": "Import Clues (CDR, Photos)...",
    "m_case_properties": "Investigation Properties...",
    "m_export_report": "Export Court Report (PDF)...",

    # Edit Menu Items
    "m_undo": "Undo Last Action",
    "m_redo": "Redo",
    "m_cut": "Cut",
    "m_copy": "Copy",
    "m_paste": "Paste",
    "m_merge_clues": "Merge Duplicate Clues",
    "m_select_all": "Select All Graph Nodes",
    "m_delete_node": "Delete Selected Clue",

    # Insert Menu Items
    "m_insert_clue": "New Manual Clue...",
    "m_insert_seized": "Seized Forensic Evidence (WORM)...",
    "m_insert_witness": "Witness Statement / Deposition...",
    "m_insert_web_snap": "Certified Web Snapshot (RFC 3161)...",
    "m_insert_gps": "GPS Coordinates / Location Point...",
    "m_insert_suspect": "Suspect Target Profile / Handle...",

    # OSINT Tools
    "m_tool_ioc": "IOC & Entity Forensic Extractor",
    "m_tool_objectid": "MongoDB ObjectId & Timestamp Decoder",
    "m_tool_mongo": "MongoDB ObjectId & Timestamp Decoder",
    "m_tool_pixel": "Reverse Meta Pixel & ID Tracker Hunter",
    "m_tool_whois": "WHOIS History & DNS Records",
    "m_tool_shodan": "Shodan & Censys Port Scanner",
    "m_tool_breach": "Credential Leak Search (DeHashed)",
    "m_tool_ssl": "SSL Certificates & Transparency (crt.sh)",
    "m_tool_exif": "ExifTool Media & GPS Metadata Analyzer",
    "m_tool_google_analytics": "Reverse Google Analytics / AdSense Tracker",
    "m_tool_holehe": "Email Account Checker on 120+ Services",
    "m_tool_all_osint": "Explore All 16 OSINT Catalog Tools ↗",

    # Social Networks (OSNA) Tools
    "m_tool_telegram": "Telegram Resolver & Channel Pivot (UID)",
    "m_tool_whatsapp": "WhatsApp Business Profile & VCard Inspector",
    "m_tool_meta_ad": "Facebook Page Transparency & Meta Ad Library",
    "m_tool_fb_page": "Facebook Page Transparency & Meta Ad Library",
    "m_tool_meta_ads": "Facebook Page Transparency & Meta Ad Library",
    "m_tool_instagram": "Instagram Profile Analyzer / Toutatis",
    "m_tool_ouedkniss": "Ouedkniss Algerian Marketplace Scraper",
    "m_tool_social_mapper": "Cross-Platform Visual Correlator (Social Mapper)",
    "m_tool_sna_betweenness": "Betweenness Centrality (Coordinator Detection)",
    "m_tool_sna_louvain": "Community Detection (Louvain Algorithm)",
    "m_tool_sna_pagerank": "Money Mule Detection (Bipartite PageRank)",
    "m_tool_sna_link_pred": "Hidden Link Prediction (Adamic-Adar / Jaccard)",
    "m_tool_all_socmint": "Explore All 12 Social Networks & SNA Tools ↗",

    # Police & Telecom Tools
    "m_tool_cdr": "Telecom CDR Excel Parser",
    "m_tool_cell_triang": "Cell Tower Triangulation & Azimuths",
    "m_tool_cotravel": "Co-Traveler Twin Phone Detector",
    "m_tool_alibi": "Alibi Contradiction Verification",
    "m_tool_alpr": "Algerian License Plate OCR (LAPI)",
    "m_tool_ccp_mules": "BaridiMob CCP & Money Mules Registry",
    "m_tool_requisitions": "CPP Judicial Requisition Generator",
    "m_tool_all_police": "Browse All Police & Telecom Tools (9 Tools) ↗",

    # View Menu Items
    "m_view_graph": "Clue Board (Graph Canvas)",
    "m_view_timeline": "Forensic Chronological Timeline",
    "m_view_map": "GEOINT Map & Cell Tower Sectors",
    "m_view_vault": "Sealed Evidence Locker (MinIO WORM)",
    "m_view_reset_zoom": "Reset Zoom & Center View",
    "m_view_toggle_layers": "Toggle Layers Panel",
    "m_view_toggle_fullscreen": "Toggle Fullscreen (F11)",
    "m_view_refresh": "Refresh & Reorganize Layout",

    # AI & LLM Menu Items
    "m_ai_mode_deterministic": "Strict Deterministic Mode (100% No LLM - Active)",
    "m_ai_mode_local_ollama": "Enable Local Offline Copilot (Ollama/Qwen-2.5)",
    "m_ai_mode_cloud": "Secure Cloud Gateway (LiteLLM)",
    "m_ai_suggest_playbook": "Synthesize Investigation DAG Playbook",
    "m_ai_summarize": "Draft Chronological Case Summary",
    "m_ai_settings": "LLM Engine & Model Settings...",

    # Modals
    "modal_properties_title": "Investigation Case Properties",
    "modal_insert_title": "Insert New Clue / Evidence",
    "modal_llm_title": "AI Copilot & LLM Engine Settings",
    "modal_import_title": "Import Investigation Files & Data",
    "btn_save_changes": "Save Changes",
    "btn_cancel": "Cancel",
    "btn_insert_confirm": "Insert Evidence into Case"
}

print('Menu keys defined: FR', len(menu_keys_fr), 'AR', len(menu_keys_ar), 'EN', len(menu_keys_en))
