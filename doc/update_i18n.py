import json

with open('doc/generate_i18n.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect what dictionary keys we need to add to fr, ar, en
menu_keys_fr = {
    # Menu Headers
    "menu_investigation": "Dossier",
    "menu_edit": "Édition",
    "menu_insert": "Insérer",
    "menu_osint": "Outils OSINT",
    "menu_osns": "Réseaux Sociaux",
    "menu_police": "Police Judiciaire",
    "menu_view": "Affichage",
    "menu_ai": "Assistant IA",

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

    # OSINT Tools Menu Items
    "m_tool_ioc": "Extracteur d'Indices Textuels (IOC Regex)",
    "m_tool_objectid": "Décodeur MongoDB ObjectId & Timestamp",
    "m_tool_pixel": "Recherche Inversée Meta Pixel & Google Analytics",
    "m_tool_whois": "Historique WHOIS & Enregistrements DNS",
    "m_tool_shodan": "Reconnaissance Hôtes & Certificats (Shodan)",
    "m_tool_breach": "Recherche dans les Fuites & Stealers (DeHashed)",
    "m_tool_all_osint": "Consulter les Briques Web & Infra (12 Outils) ↗",

    # Social Networks (OSNS) Menu Items
    "m_tool_telegram": "Résolveur de Comptes & Canaux Telegram",
    "m_tool_whatsapp": "Inspecteur Profils WhatsApp Business",
    "m_tool_fb_page": "Transparence de Page Facebook & Pays",
    "m_tool_meta_ads": "Inspecteur Campagnes Meta Ad Library",
    "m_tool_instagram": "Analyseur Profils Instagram & Toutatis",
    "m_tool_ouedkniss": "Recherche Marchés d'Occasion Ouedkniss",
    "m_tool_all_socmint": "Consulter les Briques Réseaux Sociaux (10 Outils) ↗",

    # Police & Criminal Investigation Menu Items
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
    "m_ai_mode_deterministic": "Mode Déterministe Strict (100% Sans LLM - Actif)",
    "m_ai_mode_local_ollama": "Activer Copilot IA Local (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "Passerelle Cloud Sécurisée (LiteLLM)",
    "m_ai_suggest_playbook": "Proposer un Scénario d'Enquête Automatique",
    "m_ai_summarize": "Rédiger Synthèse Chronologique de l'Affaire",
    "m_ai_settings": "Configuration LLM & Paramètres d'Inférence...",

    # Modals
    "modal_properties_title": "Propriétés de l'Affaire Judiciaire",
    "modal_insert_title": "Insérer un Nouvel Indice / Preuve",
    "modal_llm_title": "Configuration du Moteur IA & Copilot LLM",
    "modal_import_title": "Importer des Données & Fichiers d'Enquête",
    "btn_save_changes": "Enregistrer les Modifications",
    "btn_cancel": "Annuler",
    "btn_insert_confirm": "Insérer au Dossier d'Enquête"
}

menu_keys_ar = {
    # Menu Headers
    "menu_investigation": "ملف القضية",
    "menu_edit": "تعديل",
    "menu_insert": "إدراج",
    "menu_osint": "أدوات OSINT",
    "menu_osns": "شبكات التواصل",
    "menu_police": "الشرطة القضائية",
    "menu_view": "عرض",
    "menu_ai": "المساعد الذكي",

    # Investigation Menu Items
    "m_new_case": "إنشاء قضية جديدة...",
    "m_open_case": "فتح قضية...",
    "m_save": "حفظ",
    "m_save_as": "حفظ باسم...",
    "m_import_clues": "استيراد أدلة ورسائل (CDR)...",
    "m_case_properties": "خصائص ومعلومات القضية...",
    "m_export_report": "تصدير المحضر القضائي (PDF)...",

    # Edit Menu Items
    "m_undo": "تراجع عن آخر إجراء",
    "m_redo": "إعادة الإجراء",
    "m_cut": "قص",
    "m_copy": "نسخ",
    "m_paste": "لصق",
    "m_merge_clues": "دمج قرينتين متطابقتين",
    "m_select_all": "تحديد كامل المخطط",
    "m_delete_node": "حذف الدليل المحدد",

    # Insert Menu Items
    "m_insert_clue": "إدراج دليل يدوي جديد...",
    "m_insert_seized": "إدراج حرز قضائي مختوم...",
    "m_insert_witness": "محضر سماع أقوال أو شهادة...",
    "m_insert_web_snap": "توثيق لقطة ويب معتمدة (RFC 3161)...",
    "m_insert_gps": "إحداثيات جغرافية GPS...",
    "m_insert_suspect": "حساب أو هوية مستهدفة...",

    # OSINT Tools Menu Items
    "m_tool_ioc": "مستخرج المؤشرات والأرقام (IOC Regex)",
    "m_tool_objectid": "مفكك شفرات MongoDB ObjectId وتاريخ الإنشاء",
    "m_tool_pixel": "البحث العكسي عن بكسل ميتا وحسابات التتبع",
    "m_tool_whois": "سجل WHOIS وتاريخ ملكية النطاق",
    "m_tool_shodan": "فحص الخوادم والشهادات الرقمية (Shodan)",
    "m_tool_breach": "البحث في قواعد البيانات المسربة (DeHashed)",
    "m_tool_all_osint": "عرض أدوات الويب والبنية التحتية (12 أداة) ↗",

    # Social Networks (OSNS) Menu Items
    "m_tool_telegram": "محلل حسابات وقنوات تيليغرام",
    "m_tool_whatsapp": "فاحص حسابات وكتالوجات واتساب للأعمال",
    "m_tool_fb_page": "شفافية صفحة فيسبوك وبلد الإدارة",
    "m_tool_meta_ads": "مكتبة إعلانات ميتا الممولة",
    "m_tool_instagram": "محلل حسابات إنستغرام والتسجيل",
    "m_tool_ouedkniss": "البحث في إعلانات واد كنيس السابقة",
    "m_tool_all_socmint": "عرض أدوات شبكات التواصل (10 أدوات) ↗",

    # Police & Criminal Investigation Menu Items
    "m_tool_cdr": "محلل كشوف الاتصالات (CDR Excel)",
    "m_tool_cell_triang": "تحديد نطاق وهوائيات التغطية (BTS)",
    "m_tool_cotravel": "كاشف الهواتف المتلازمة بالتنقل",
    "m_tool_alibi": "كاشف تناقضات ادعاءات المشتبه به",
    "m_tool_alpr": "قراءة لوحات الترقيم الوطنية (LAPI)",
    "m_tool_ccp_mules": "فاحص الحسابات البريدية والحسابات الوسيطة",
    "m_tool_requisitions": "محرر أوامر التسخير القضائي (CPP)",
    "m_tool_all_police": "عرض أدوات التحقيق الجنائي (9 أدوات) ↗",

    # View Menu Items
    "m_view_graph": "مخطط الصلات والقرائن الجنائية",
    "m_view_timeline": "التسلسل الزمني للأحداث",
    "m_view_map": "الخريطة الجغرافية والمسارات",
    "m_view_vault": "خزينة الأحراز الرقمية المشفرة (WORM)",
    "m_view_reset_zoom": "إعادة ضبط التكبير وتوسيط المخطط",
    "m_view_toggle_layers": "إظهار أو إخفاء لوحة الطبقات",
    "m_view_toggle_fullscreen": "ملء الشاشة (F11)",
    "m_view_refresh": "إعادة ترتيب وتوزيع العقد آلياً",

    # AI & LLM Menu Items
    "m_ai_mode_deterministic": "الوضع الحتمي الصارم (دون ذكاء توليدي - نشط)",
    "m_ai_mode_local_ollama": "تفعيل المساعد المحلي المغلق (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "بوابة النماذج السحابية المؤمنة (LiteLLM)",
    "m_ai_suggest_playbook": "اقتراح مسار تحقيق استدلالي آلي",
    "m_ai_summarize": "صياغة التقرير التركيبي للقضية",
    "m_ai_settings": "إعدادات نماذج الذكاء الاصطناعي...",

    # Modals
    "modal_properties_title": "خصائص وبيانات ملف القضية",
    "modal_insert_title": "إدراج دليل أو قرينة جديدة",
    "modal_llm_title": "إعدادات الذكاء الاصطناعي والمساعد الآلي",
    "modal_import_title": "استيراد ملفات ومعطيات التحقيق",
    "btn_save_changes": "حفظ التغييرات",
    "btn_cancel": "إلغاء",
    "btn_insert_confirm": "تثبيت الدليل في ملف القضية"
}

menu_keys_en = {
    # Menu Headers
    "menu_investigation": "Investigation",
    "menu_edit": "Edit",
    "menu_insert": "Insert",
    "menu_osint": "OSINT Tools",
    "menu_osns": "Social Networks",
    "menu_police": "Criminal Police",
    "menu_view": "View",
    "menu_ai": "AI Copilot",

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

    # OSINT Tools Menu Items
    "m_tool_ioc": "Text Clue Extractor (IOC Regex)",
    "m_tool_objectid": "MongoDB ObjectId & Timestamp Decoder",
    "m_tool_pixel": "Meta Pixel & Analytics Reverse Pivot",
    "m_tool_whois": "WHOIS History & DNS Records",
    "m_tool_shodan": "Host & Port Reconnaissance (Shodan)",
    "m_tool_breach": "Breach & Stealer Hunter (DeHashed)",
    "m_tool_all_osint": "Browse All Web & Infra Tools (12 Tools) ↗",

    # Social Networks (OSNS) Menu Items
    "m_tool_telegram": "Telegram Account & Channel Resolver",
    "m_tool_whatsapp": "WhatsApp Business Catalog Inspector",
    "m_tool_fb_page": "Facebook Page Transparency & Country",
    "m_tool_meta_ads": "Meta Ad Library Campaign Inspector",
    "m_tool_instagram": "Instagram OSINT & Account Prober",
    "m_tool_ouedkniss": "Ouedkniss & Classifieds Historical Search",
    "m_tool_all_socmint": "Browse All Social Media Tools (10 Tools) ↗",

    # Police & Criminal Investigation Menu Items
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
