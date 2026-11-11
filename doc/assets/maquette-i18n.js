/**
 * Athar DZ (أثر) — Forensic OSINT & Judicial Investigation Studio
 * Multilingual Engine & Forensic Workspace Controller.
 * Conforms to SPECIFICATION.md, WCAG 2.2 AA, and Nielsen's Heuristics.
 */

const I18N_TRANSLATIONS = {
  "fr": {
    "app_title": "Athar DZ",
    "app_subtitle": "Studio d'Enquête Judiciaire & Forensique OSINT",
    "fictional_data_notice": "Données d'exercice fictives",
    "case_id": "Dossier #2026-SCAM-089",
    "case_name": "Escroquerie aux Pneus Michelin",
    "case_profile": "Cyber-Escroquerie Commerciale",
    "case_created": "Ouvert le 10 Nov 2026",
    "case_jurisdiction": "Section de Recherches • Alger / Oran",
    "mode_collect": "Collecter",
    "mode_analyze": "Analyser",
    "mode_report": "Rapporter",
    "search_cmd_hint": "Rechercher ou lancer un outil (Ctrl+K)...",
    "stealth_active": "Furtivité Active (WireGuard)",
    "stealth_warning": "ALERTE : Mode Furtif Inactif — IP Réelle Exposée !",
    "lang_fr": "Français",
    "lang_ar": "العربية (RTL)",
    "lang_en": "English",
    "user_name": "Insp. Benali",
    "user_role": "OPJ Cybercriminalité",
    "nav_layers_title": "Calques d'Investigation",
    "layer_1_verified": "Calque 1 : Preuves Scellées (RFC 3161)",
    "layer_2_osint": "Calque 2 : Découvertes Brutes (OSINT)",
    "layer_3_infra": "Calque 3 : Infrastructure & Pivot Technique",
    "layer_4_hypothesis": "Calque 4 : Hypothèses & Déductions IA",
    "nav_filters_title": "Filtres par Nature",
    "filter_all": "Tous les types",
    "filter_phone": "Téléphonie (E.164)",
    "filter_social": "Réseaux Sociaux",
    "filter_web": "Domaines & Serveurs",
    "filter_financial": "CCP / BaridiMob",
    "filter_media": "Médias & Biométrie",
    "filter_person": "Sujets & Identités",
    "nav_history_btn": "Registre d'Audit Forensique",
    "view_graph": "Graphe",
    "view_timeline": "Chronologie",
    "view_map": "Carte SIG",
    "screen_1_tab": "1. Vue d'Affaire",
    "screen_2_tab": "2. Graphe & Outils",
    "screen_3_tab": "3. Arbitrage Indices",
    "screen_4_tab": "4. Chronologie & SIG",
    "screen_5_tab": "5. Rapport & PV",
    "btn_run_playbook": "Lancer le Scénario Recommandé",
    "playbook_disclaimer": "Mode Review-Run : les résultats sont dirigés vers la boîte d'arbitrage pour validation humaine.",
    "inspector_title": "Inspecteur d'Entité",
    "inspector_empty_title": "Aucun élément sélectionné",
    "inspector_empty_desc": "Sélectionnez un nœud sur le canevas ou un indice dans la boîte de réception pour afficher ses propriétés forensiques et les briques recommandées.",
    "prop_entity_type": "Nature de l'entité",
    "prop_identifier": "Valeur / Identifiant",
    "prop_layer": "Calque d'affectation",
    "prop_hash": "Empreinte SHA-256",
    "prop_timestamp": "Horodatage certifié",
    "prop_confidence": "Degré de certitude",
    "prop_source": "Outil d'acquisition",
    "suggested_tools_title": "Outils Recommandés (Scoring de Capacités)",
    "suggested_tools_desc": "Proposés selon le type d'entité et le profil de l'affaire.",
    "btn_run_brick": "Lancer l'Outil (Review-Run)",
    "btn_show_catalog": "Ouvrir l'Arsenal Complet (62 Outils) ↗",
    "candidate_subject_title": "Sujet Candidat (Hypothèse d'Enquête)",
    "candidate_presumption_notice": "Avertissement : Cette attribution constitue une hypothèse d'enquête soumise à la présomption d'innocence. Elle ne peut être versée comme preuve sans vérification humaine formelle.",
    "candidate_biometrics_label": "Similarité Faciale ArcFace 512-d",
    "candidate_voice_label": "Diarisation Vocale Faster-Whisper",
    "candidate_centrality_label": "Indice de Centralité de Réseau",
    "btn_promote_verified": "Valider & Promouvoir en Preuve (Calque 1)",
    "btn_discard_hypothesis": "Écarter l'Hypothèse",
    "inbox_title": "Boîte d'Arbitrage des Indices",
    "inbox_badge": "3 en attente",
    "inbox_desc": "Indices détectés par les outils de collecte nécessitant une décision humaine avant versement au dossier.",
    "btn_add_graph": "Ajouter au Graphe",
    "btn_dismiss": "Écarter",
    "status_queue": "File d'attente : 0 tâche",
    "status_sync": "MinIO WORM : Synchronisé",
    "status_ledger": "Registre Forensique : #2026-SCAM-089-LOK",
    "cmd_title": "Palette de Commandes (62 Outils Forensiques)",
    "cmd_placeholder": "Rechercher une brique, une commande ou un type d'indice...",
    "cmd_shortcuts_hint": "↑↓ pour naviguer • Entrée pour exécuter • Échap pour fermer",
    "catalog_title": "Catalogue des 62 Briques Forensiques & OSINT",
    "catalog_category_all": "Toutes les Catégories",
    "req_offline": "Local Hors-Ligne",
    "req_free_key": "Clé API Gratuite",
    "req_sock_puppet": "Session d'Infiltration",
    "req_paid": "Abonnement Optionnel",
    "kpi_loss": "Préjudice Estimé",
    "kpi_victims": "Plaintes Rattachées",
    "kpi_locations": "Wilayas Impliquées",
    "kpi_evidence": "Preuves Scellées",
    "kpi_loss_val": "1 450 000 DZD",
    "kpi_victims_val": "6 Victimes",
    "kpi_locations_val": "Alger, Oran, Blida",
    "kpi_evidence_val": "100% SHA-256",
    "report_title": "Procès-Verbal de Synthèse Forensique",
    "report_court_ref": "Tribunal d'Oran • Pôle Pénal Spécialisé Cybercriminalité",
    "report_generate_pdf": "Exporter Dossier Conforme CPP (PDF)",
    "report_requisitions": "Générer Réquisitions Télécoms & Bancaires",
    "history_title": "Journal d'Audit Immuable (Hash-Chain)",
    "btn_toggle_theme": "Changer le Thème (Clair/Sombre)",
    "btn_collapse_panel": "Réduire le panneau",
    "btn_expand_panel": "Agrandir le panneau",
    "compare_modal_title": "Comparateur Forensique d'Entités",
    "compare_entity_a": "Entité A : Annonce FB #98124",
    "compare_entity_b": "Entité B : Chaîne Telegram @amine_import",
    "compare_similarity_score": "Score de Corrélation Multi-Sources : 92% (Hypothèse)",
    "toast_tool_success": "Brique exécutée. Nouvel indice transmis à la boîte d'arbitrage.",
    "toast_clue_added": "Indice validé et rattaché au graphe avec horodatage scellé.",
    "toast_clue_dismissed": "Indice écarté. Décision archivée au registre d'audit.",
    "menu_investigation": "Dossier",
    "menu_edit": "Édition",
    "menu_insert": "Insérer",
    "menu_osint": "Outils OSINT",
    "menu_osns": "Réseaux Sociaux (OSNA)",
    "menu_police": "Police Judiciaire",
    "menu_view": "Affichage",
    "menu_ai": "Assistant IA",
    "cat_web_infra": "Web & Infrastructure Réseau",
    "cat_tech_metadata": "Métadonnées & Analyse Technique",
    "cat_ad_tracking": "Pivots Publicitaires & Traçage",
    "cat_breach_identity": "Fuites de Données & Identifiants",
    "cat_socmint": "Profilage Plateformes Sociales (SOCMINT)",
    "cat_sna": "Analyse de Réseau Social (Graph SNA)",
    "topbar_search_placeholder": "Rechercher un indice, numéro, suspect ou lancer un outil... (Ctrl+K)",
    "info_chip": "Détails",
    "tool_info_title": "Fiche Technique & Spécification Forensique",
    "tool_info_inputs": "Données d'Entrée (Inputs)",
    "tool_info_outputs": "Données de Sortie (Outputs & Nœuds)",
    "tool_info_storage": "Persistance & Stockage Judiciaire",
    "tool_info_resources": "Ressources & Mode d'Exécution",
    "tool_info_compliance": "Chaîne de Garde & Traçabilité WORM",
    "tool_info_run_btn": "Exécuter sur l'Indice Actif",
    "tool_info_playbook_btn": "Ajouter au Playbook DAG",
    "tool_info_close_btn": "Fermer",
    "m_new_case": "Nouveau Dossier d'Enquête...",
    "m_open_case": "Ouvrir un Dossier...",
    "m_save": "Enregistrer",
    "m_save_as": "Enregistrer sous...",
    "m_import_clues": "Importer des Indices (CDR, Photos)...",
    "m_case_properties": "Propriétés de l'Enquête...",
    "m_export_report": "Exporter Rapport Judiciaire (PDF)...",
    "m_undo": "Annuler Dernière Action",
    "m_redo": "Rétablir",
    "m_cut": "Couper",
    "m_copy": "Copier",
    "m_paste": "Coller",
    "m_merge_clues": "Fusionner Deux Indices Identiques",
    "m_select_all": "Sélectionner Tout le Graphe",
    "m_delete_node": "Supprimer l'Indice Sélectionné",
    "m_insert_clue": "Nouvel Indice Manuel...",
    "m_insert_seized": "Pièce à Conviction Scellée (WORM)...",
    "m_insert_witness": "Déposition / Audition de Témoin...",
    "m_insert_web_snap": "Capture Web Certifiée (RFC 3161)...",
    "m_insert_gps": "Coordonnées GPS / Point de Bornage...",
    "m_insert_suspect": "Profil / Compte Suspect Cible...",
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
    "m_tool_cdr": "Analyseur de Relevés Télécoms (CDR Excel)",
    "m_tool_cell_triang": "Bornage & Azimuts BTS Relais (OpenCellID)",
    "m_tool_cotravel": "Détecteur de Téléphones Jumeaux (Co-Déplacement)",
    "m_tool_alibi": "Contrôleur de Contradictions d'Alibis",
    "m_tool_alpr": "Reconnaissance de Plaques LAPI (Matricules DZ)",
    "m_tool_ccp_mules": "Validateur CCP BaridiMob & Registre des Mules",
    "m_tool_requisitions": "Générateur Réquisitions CPP (Docx/PDF)",
    "m_tool_all_police": "Consulter les Briques Enquête Policière (9 Outils) ↗",
    "m_view_graph": "Tableau des Indices (Graphe Visuel)",
    "m_view_timeline": "Chronologie Temporelle Forensique",
    "m_view_map": "Carte Géographique des Bornages & SIG",
    "m_view_vault": "Coffre-fort des Preuves Certifiées (WORM)",
    "m_view_reset_zoom": "Réinitialiser le Zoom & Centrer la Vue",
    "m_view_toggle_layers": "Afficher / Masquer Panneau des Calques",
    "m_view_toggle_fullscreen": "Plein Écran (F11)",
    "m_view_refresh": "Réorganiser la Disposition Automatique",
    "m_ai_mode_deterministic": "Mode Déterministe Strict (Sans LLM - Actif)",
    "m_ai_mode_local_ollama": "Activer Copilot IA Local (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "Passerelle Cloud Sécurisée (LiteLLM)",
    "m_ai_suggest_playbook": "Proposer un Scénario d'Enquête Automatique",
    "m_ai_summarize": "Rédiger Synthèse Chronologique de l'Affaire",
    "m_ai_settings": "Configuration LLM & Paramètres d'Inférence...",
    "modal_properties_title": "Propriétés du Dossier d'Investigation",
    "modal_insert_title": "Insérer un Nouvel Indice / Preuve",
    "modal_llm_title": "Configuration du Copilot IA & Moteur LLM",
    "modal_import_title": "Importer des Fichiers & Preuves Forensiques",
    "btn_save_changes": "Enregistrer les Modifications",
    "btn_cancel": "Annuler",
    "btn_insert_confirm": "Ajouter l'Indice au Dossier"
  },
  "ar": {
    "app_title": "أثر (Athar DZ)",
    "app_subtitle": "استوديو التحقيق الجنائي والأدلة الرقمية مفتوحة المصدر",
    "fictional_data_notice": "بيانات تمرين افتراضية",
    "case_id": "القضية #2026-SCAM-089",
    "case_name": "الاحتيال التجاري لإطارات ميشلان",
    "case_profile": "احتيال تجاري إلكتروني",
    "case_created": "تاريخ الفتح: 10 نوفمبر 2026",
    "case_jurisdiction": "مصلحة الأبحاث • الجزائر / وهران",
    "mode_collect": "جمع الأدلة",
    "mode_analyze": "تحليل واستدلال",
    "mode_report": "إعداد المحاضر",
    "search_cmd_hint": "البحث عن دليل أو أداة جنائية (Ctrl+K)...",
    "stealth_active": "التخفي نشط (WireGuard)",
    "stealth_warning": "تحذير: وضع التخفي معطل — العنوان الرقمي الحقيقي مكشوف!",
    "lang_fr": "Français",
    "lang_ar": "العربية (RTL)",
    "lang_en": "English",
    "user_name": "المحقق بن علي",
    "user_role": "ضابط شرطة قضائية (مكافحة الجرائم الإلكترونية)",
    "nav_layers_title": "طبقات التحقيق الجنائي",
    "layer_1_verified": "الطبقة 1: أدلة قطعية موثقة (RFC 3161)",
    "layer_2_osint": "الطبقة 2: استكشافات رقمية أولية (OSINT)",
    "layer_3_infra": "الطبقة 3: البنية التقنية ومسارات الربط",
    "layer_4_hypothesis": "الطبقة 4: فرضيات واستنتاجات ذكية",
    "nav_filters_title": "تصفية حسب طبيعة الدليل",
    "filter_all": "جميع الأنواع",
    "filter_phone": "الاتصالات والهواتف (E.164)",
    "filter_social": "حسابات التواصل الاجتماعي",
    "filter_web": "المواقع والخوادم",
    "filter_financial": "الحسابات البريدية والبنكية",
    "filter_media": "الوسائط والبصمات البيومترية",
    "filter_person": "الأشخاص والهويات المستهدفة",
    "nav_history_btn": "سجل التدقيق الجنائي غير القابل للتعديل",
    "view_graph": "مخطط الصلات",
    "view_timeline": "التسلسل الزمني",
    "view_map": "الخريطة الجغرافية",
    "screen_1_tab": "1. نظرة عامة",
    "screen_2_tab": "2. المخطط والأدوات",
    "screen_3_tab": "3. تدقيق الأدلة",
    "screen_4_tab": "4. التسلسل والخريطة",
    "screen_5_tab": "5. المحضر القضائي",
    "btn_run_playbook": "تشغيل مسار التحقيق المقترح",
    "playbook_disclaimer": "وضع التحقق البشري: توجه النتائج آلياً لصندوق الفحص والاعتماد.",
    "inspector_title": "فاحص العناصر الجنائية",
    "inspector_empty_title": "لم يتم تحديد أي عنصر",
    "inspector_empty_desc": "حدد عقدة من المخطط أو دليلاً من صندوق الوارد لعرض بياناته الجنائية وقائمة الأدوات المقترحة.",
    "prop_entity_type": "طبيعة العنصر",
    "prop_identifier": "المعرف / القيمة",
    "prop_layer": "الطبقة الجنائية",
    "prop_hash": "البصمة المشفرة SHA-256",
    "prop_timestamp": "التوثيق الزمني المعتمد",
    "prop_confidence": "نسبة الدقة والترجيح",
    "prop_source": "أداة الالتقاط والتثبيت",
    "suggested_tools_title": "الأدوات المقترحة (محرك القدرات الجنائية)",
    "suggested_tools_desc": "مقترحة حصراً وفق طبيعة العنصر ونمط القضية.",
    "btn_run_brick": "تشغيل الأداة (باعتماد بشري)",
    "btn_show_catalog": "فتح المستودع الكامل (62 أداة) ↗",
    "candidate_subject_title": "المشتبه به المحتمل (فرضية تحقيق)",
    "candidate_presumption_notice": "تنبيه قضائي: هذا الربط يمثل فرضية استدلالية وتخضع لقرينة البراءة. لا يُعتد بها كإدانة دون تحقق إجرائي رسمي.",
    "candidate_biometrics_label": "مطابقة الوجه البيومترية ArcFace 512-d",
    "candidate_voice_label": "البصمة الصوتية Faster-Whisper",
    "candidate_centrality_label": "مؤشر المحورية في الشبكة الجرمية",
    "btn_promote_verified": "اعتماد وترقية إلى دليل رسمي (الطبقة 1)",
    "btn_discard_hypothesis": "استبعاد الفرضية الجنائية",
    "inbox_title": "صندوق تدقيق وقبول الأدلة الواردة",
    "inbox_badge": "3 في الانتظار",
    "inbox_desc": "أدلة التقطتها أدوات البحث وتحتاج لقرار ضابط التحقيق قبل إدراجها بالقضية.",
    "btn_add_graph": "إدراج بالمخطط",
    "btn_dismiss": "استبعاد",
    "status_queue": "قائمة المهام: 0 نشطة",
    "status_sync": "تخزين MinIO WORM: مؤمن وموثق",
    "status_ledger": "سجل التدقيق: #2026-SCAM-089-LOK",
    "cmd_title": "لوحة الأوامر والأدوات الجنائية (62 أداة)",
    "cmd_placeholder": "اكتب اسم الأداة أو فئتها أو نوع الدليل المطلوب...",
    "cmd_shortcuts_hint": "↑↓ للتنقل • إدخال للتنفيذ • هروب للإغلاق",
    "catalog_title": "كتالوج الأدوات الجنائية المفتوحة المصدر (62 أداة)",
    "catalog_category_all": "كافة الفئات",
    "req_offline": "حاوية محلية دون اتصال",
    "req_free_key": "مفتاح API مجاني",
    "req_sock_puppet": "حساب اختراق آمن",
    "req_paid": "اشتراك اختياري",
    "kpi_loss": "إجمالي الضرر المالي",
    "kpi_victims": "الشكاوى المرتبطة",
    "kpi_locations": "الولايات المعنية",
    "kpi_evidence": "الأدلة المشفرة",
    "kpi_loss_val": "1 450 000 دج",
    "kpi_victims_val": "6 ضحايا",
    "kpi_locations_val": "الجزائر، وهران، البليدة",
    "kpi_evidence_val": "100% SHA-256",
    "report_title": "محضر التحري والضبط الجنائي الرقمي",
    "report_court_ref": "محكمة وهران • القطب الجزائي المتخصص في مكافحة الجريمة السيبرانية",
    "report_generate_pdf": "تصدير المحضر الرسمي القانوني (PDF)",
    "report_requisitions": "إصدار أوامر التسخير للاتصالات والبنوك",
    "history_title": "سجل التتبع والتدقيق الجنائي المشفر",
    "btn_toggle_theme": "تبديل المظهر (فاتح / داكن)",
    "btn_collapse_panel": "طي اللوحة",
    "btn_expand_panel": "توسيع اللوحة",
    "compare_modal_title": "المقارن الجنائي بين عنصرين",
    "compare_entity_a": "العنصر أ: إعلان فيسبوك #98124",
    "compare_entity_b": "العنصر ب: قناة تيليغرام @amine_import",
    "compare_similarity_score": "نسبة الارتباط متعدد المصادر: 92% (فرضية)",
    "toast_tool_success": "تم تشغيل الأداة بنجاح، ووجهت النتائج لصندوق التدقيق.",
    "toast_clue_added": "تم اعتماد الدليل وتثبيته في المخطط الجنائي بختم زمني مشفر.",
    "toast_clue_dismissed": "تم استبعاد الدليل وتوثيق سبب الرفض في سجل التدقيق.",
    "menu_investigation": "الملف",
    "menu_edit": "تعديل",
    "menu_insert": "إدراج",
    "menu_osint": "أدوات OSINT",
    "menu_osns": "الشبكات الاجتماعية (OSNA)",
    "menu_police": "الشرطة القضائية",
    "menu_view": "عرض",
    "menu_ai": "مساعد الذكاء الاصطناعي",
    "cat_web_infra": "الويب والبنية التحتية",
    "cat_tech_metadata": "البيانات الوصفية والتحليل التقني",
    "cat_ad_tracking": "التتبع والإعلانات الرقمية",
    "cat_breach_identity": "تسريبات البيانات والهويات",
    "cat_socmint": "استخبارات المنصات الاجتماعية (SOCMINT)",
    "cat_sna": "تحليل الشبكات الاجتماعية (Graph SNA)",
    "topbar_search_placeholder": "بحث عن دليل، رقم هاتف، مشتبه به أو تشغيل أداة... (Ctrl+K)",
    "info_chip": "بطاقة تقنية",
    "tool_info_title": "البطاقة التقنية والمواصفات الجنائية",
    "tool_info_inputs": "بيانات الدخل (Inputs)",
    "tool_info_outputs": "بيانات الخرج والعقد المنشأة (Outputs)",
    "tool_info_storage": "التخزين والحفظ القضائي",
    "tool_info_resources": "الموارد ونمط التشغيل",
    "tool_info_compliance": "سلسلة الحراسة والتتبع القانوني WORM",
    "tool_info_run_btn": "تشغيل على الدليل المحدد",
    "tool_info_playbook_btn": "إضافة إلى سيناريو التحقيق DAG",
    "tool_info_close_btn": "إغلاق",
    "m_new_case": "ملف تحقيق جديد...",
    "m_open_case": "فتح ملف تحقيق...",
    "m_save": "حفظ",
    "m_save_as": "حفظ باسم...",
    "m_import_clues": "استيراد أدلة (سجلات هاتف، صور)...",
    "m_case_properties": "خصائص القضية...",
    "m_export_report": "تصدير تقرير قضائي (PDF)...",
    "m_undo": "تراجع عن آخر إجراء",
    "m_redo": "إعادة",
    "m_cut": "قص",
    "m_copy": "نسخ",
    "m_paste": "لصق",
    "m_merge_clues": "دمج دليلين متطابقين",
    "m_select_all": "تحديد كل الرسم البياني",
    "m_delete_node": "حذف الدليل المحدد",
    "m_insert_clue": "دليل يدوي جديد...",
    "m_insert_seized": "حريزة رقمية مشفرة (WORM)...",
    "m_insert_witness": "محضر سماع شاهد / إفادة...",
    "m_insert_web_snap": "توثيق ويب موثوق (RFC 3161)...",
    "m_insert_gps": "إحداثيات جغرافية / نقطة تموضع...",
    "m_insert_suspect": "حساب / هوية المشتبه به المستهدف...",
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
    "m_tool_cdr": "محلل سجلات المكالمات الهاتفية (CDR)",
    "m_tool_cell_triang": "تحديد المواقع وزوايا الأبراج (OpenCellID)",
    "m_tool_cotravel": "كاشف الهواتف المرافقة (التنقل المتزامن)",
    "m_tool_alibi": "التحقق من تناقضات حجة الغياب",
    "m_tool_alpr": "التعرف الآلي على لوحات السيارات (LAPI الجزائر)",
    "m_tool_ccp_mules": "مدقق حسابات بريدي موب والواجهات المالية",
    "m_tool_requisitions": "منشئ الإنابات والأوامر القضائية (ق.إ.ج)",
    "m_tool_all_police": "استعراض أدوات التحقيق الجنائي والاتصالات (9 أدوات) ↗",
    "m_view_graph": "لوحة الأدلة (الرسم البياني المرئي)",
    "m_view_timeline": "المخطط الزمني الجنائي",
    "m_view_map": "خريطة المواقع الجغرافية والأبراج",
    "m_view_vault": "خزينة الأدلة الرقمية المشفرة (WORM)",
    "m_view_reset_zoom": "إعادة ضبط التكبير وتوسيط العرض",
    "m_view_toggle_layers": "إظهار / إخفاء لوحة الطبقات",
    "m_view_toggle_fullscreen": "ملء الشاشة (F11)",
    "m_view_refresh": "إعادة تنظيم التوزيع الآلي",
    "m_ai_mode_deterministic": "النمط القطعي الصارم (بدون LLM - نشط)",
    "m_ai_mode_local_ollama": "تفعيل المساعد الذكي المحلي (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "البوابة السحابية المؤمنة (LiteLLM)",
    "m_ai_suggest_playbook": "اقتراح سيناريو تحقيق آلي (Playbook DAG)",
    "m_ai_summarize": "صياغة خلاصة كرونولوجية للقضية",
    "m_ai_settings": "إعدادات نماذج الذكاء الاصطناعي والاستدلال...",
    "modal_properties_title": "خصائص ملف التحقيق القضائي",
    "modal_insert_title": "إدراج دليل أو حريزة جديدة",
    "modal_llm_title": "إعدادات المساعد الذكي ومحرك النماذج اللغوية",
    "modal_import_title": "استيراد ملفات وأدلة جنائية",
    "btn_save_changes": "حفظ التغييرات",
    "btn_cancel": "إلغاء",
    "btn_insert_confirm": "إدراج الدليل في القضية"
  },
  "en": {
    "app_title": "Athar DZ",
    "app_subtitle": "Judicial & Digital Forensics OSINT Studio",
    "fictional_data_notice": "Fictional Exercise Data",
    "case_id": "Case #2026-SCAM-089",
    "case_name": "Michelin Tyre Marketplace Scam",
    "case_profile": "Online E-Commerce Fraud",
    "case_created": "Opened Nov 10, 2026",
    "case_jurisdiction": "Forensic Investigation Section • Algiers / Oran",
    "mode_collect": "Collect",
    "mode_analyze": "Analyze",
    "mode_report": "Report",
    "search_cmd_hint": "Search clues or launch tools (Ctrl+K)...",
    "stealth_active": "Stealth Mode Active (WireGuard)",
    "stealth_warning": "WARNING: Stealth Mode Inactive — Origin IP Exposed!",
    "lang_fr": "Français",
    "lang_ar": "العربية (RTL)",
    "lang_en": "English",
    "user_name": "Det. Benali",
    "user_role": "Cybercrime Investigator",
    "nav_layers_title": "Investigation Layers",
    "layer_1_verified": "Layer 1: Verified Evidence (RFC 3161)",
    "layer_2_osint": "Layer 2: Raw OSINT Discovery",
    "layer_3_infra": "Layer 3: Infrastructure & Technical Pivots",
    "layer_4_hypothesis": "Layer 4: Hypotheses & AI Inferences",
    "nav_filters_title": "Filter by Entity Type",
    "filter_all": "All Entities",
    "filter_phone": "Telecom & Phones (E.164)",
    "filter_social": "Social Media Accounts",
    "filter_web": "Domains & Web Servers",
    "filter_financial": "Bank & Postal Accounts",
    "filter_media": "Media & Biometrics",
    "filter_person": "Subjects & Identities",
    "nav_history_btn": "Forensic Audit Ledger",
    "view_graph": "Graph Canvas",
    "view_timeline": "Timeline",
    "view_map": "GEOINT Map",
    "screen_1_tab": "1. Case Overview",
    "screen_2_tab": "2. Graph & Tools",
    "screen_3_tab": "3. Clue Inbox",
    "screen_4_tab": "4. Timeline & Map",
    "screen_5_tab": "5. Court Report",
    "btn_run_playbook": "Run Suggested Playbook",
    "playbook_disclaimer": "Review-Run mode: All discovered outputs are routed to the arbitration inbox for human triage.",
    "inspector_title": "Entity Inspector",
    "inspector_empty_title": "No Entity Selected",
    "inspector_empty_desc": "Select a node on the canvas or an inbox clue to inspect forensic properties and recommended tools.",
    "prop_entity_type": "Entity Nature",
    "prop_identifier": "Value / Identifier",
    "prop_layer": "Assigned Layer",
    "prop_hash": "SHA-256 Digest",
    "prop_timestamp": "Certified Timestamp",
    "prop_confidence": "Confidence Score",
    "prop_source": "Acquisition Tool",
    "suggested_tools_title": "Recommended Tools (Capability Engine)",
    "suggested_tools_desc": "Ranked strictly by node type compatibility and case profile relevance.",
    "btn_run_brick": "Run Tool (Review-Run)",
    "btn_show_catalog": "Browse All 62 Tools in Catalog ↗",
    "candidate_subject_title": "Candidate Subject (Hypothesis)",
    "candidate_presumption_notice": "Forensic Warning: This attribution represents an investigatory hypothesis subject to presumption of innocence. Formal human review is mandatory before legal submission.",
    "candidate_biometrics_label": "ArcFace 512-d Biometric Match",
    "candidate_voice_label": "Faster-Whisper Speaker Diarization",
    "candidate_centrality_label": "Network Centrality (Betweenness)",
    "btn_promote_verified": "Promote to Verified Evidence (Layer 1)",
    "btn_discard_hypothesis": "Discard Hypothesis",
    "inbox_title": "Clue Arbitration Inbox",
    "inbox_badge": "3 Pending",
    "inbox_desc": "Clues discovered by automated bricks awaiting human triage before entry into the judicial case.",
    "btn_add_graph": "Add to Graph",
    "btn_dismiss": "Discard",
    "status_queue": "Task Queue: 0 active",
    "status_sync": "MinIO WORM: Sealed",
    "status_ledger": "Audit Ledger: #2026-SCAM-089-LOK",
    "cmd_title": "Command Palette & Forensic Arsenal (62 Tools)",
    "cmd_placeholder": "Search a forensic tool, command, or clue type...",
    "cmd_shortcuts_hint": "↑↓ navigate • Enter execute • Esc close",
    "catalog_title": "Complete 62-Tool Forensic & OSINT Catalog",
    "catalog_category_all": "All Categories",
    "req_offline": "Local Offline Docker",
    "req_free_key": "Free API Key",
    "req_sock_puppet": "Covert Session Vault",
    "req_paid": "Optional Commercial",
    "kpi_loss": "Estimated Loss",
    "kpi_victims": "Linked Complaints",
    "kpi_locations": "Target Wilayas",
    "kpi_evidence": "Sealed Evidence",
    "kpi_loss_val": "1,450,000 DZD",
    "kpi_victims_val": "6 Victims",
    "kpi_locations_val": "Algiers, Oran, Blida",
    "kpi_evidence_val": "100% SHA-256",
    "report_title": "Forensic Summary & Requisition Dossier",
    "report_court_ref": "Court of Oran • Specialized Cybercrime Judicial Unit",
    "report_generate_pdf": "Export Court-Ready PDF Dossier",
    "report_requisitions": "Generate Carrier & Banking Requisitions",
    "history_title": "Immutable Forensic Audit Trail",
    "btn_toggle_theme": "Toggle Light/Dark Theme",
    "btn_collapse_panel": "Collapse panel",
    "btn_expand_panel": "Expand panel",
    "compare_modal_title": "Forensic Entity Comparator",
    "compare_entity_a": "Entity A: FB Marketplace Ad #98124",
    "compare_entity_b": "Entity B: Telegram Channel @amine_import",
    "compare_similarity_score": "Multi-Source Correlation Score: 92% (Hypothesis)",
    "toast_tool_success": "Tool executed. Findings routed to clue arbitration inbox.",
    "toast_clue_added": "Clue validated and added to investigation graph with sealed timestamp.",
    "toast_clue_dismissed": "Clue discarded. Rationale recorded in immutable audit log.",
    "menu_investigation": "Case",
    "menu_edit": "Edit",
    "menu_insert": "Insert",
    "menu_osint": "OSINT Tools",
    "menu_osns": "Social Networks (OSNA)",
    "menu_police": "Criminal Investigation",
    "menu_view": "View",
    "menu_ai": "AI Assistant",
    "cat_web_infra": "Web & Infrastructure",
    "cat_tech_metadata": "Technical Metadata & IOCs",
    "cat_ad_tracking": "Ad Tracking & ID Pivots",
    "cat_breach_identity": "Data Breaches & Credentials",
    "cat_socmint": "Social Platform Intelligence (SOCMINT)",
    "cat_sna": "Social Network Analysis (Graph SNA)",
    "topbar_search_placeholder": "Search clue, phone, suspect or launch tool... (Ctrl+K)",
    "info_chip": "Spec Info",
    "tool_info_title": "Forensic Tool Technical Specification",
    "tool_info_inputs": "Input Data (Inputs)",
    "tool_info_outputs": "Output Data & Created Nodes (Outputs)",
    "tool_info_storage": "Forensic Storage & Legal Custody",
    "tool_info_resources": "Resources & Execution Footprint",
    "tool_info_compliance": "Chain of Custody & WORM Compliance",
    "tool_info_run_btn": "Run on Selected Clue",
    "tool_info_playbook_btn": "Add to Playbook DAG",
    "tool_info_close_btn": "Close",
    "m_new_case": "New Investigation Case...",
    "m_open_case": "Open Case...",
    "m_save": "Save",
    "m_save_as": "Save As...",
    "m_import_clues": "Import Clues (CDR, Photos)...",
    "m_case_properties": "Investigation Properties...",
    "m_export_report": "Export Court Report (PDF)...",
    "m_undo": "Undo Last Action",
    "m_redo": "Redo",
    "m_cut": "Cut",
    "m_copy": "Copy",
    "m_paste": "Paste",
    "m_merge_clues": "Merge Duplicate Clues",
    "m_select_all": "Select All Graph Nodes",
    "m_delete_node": "Delete Selected Clue",
    "m_insert_clue": "New Manual Clue...",
    "m_insert_seized": "Seized Forensic Evidence (WORM)...",
    "m_insert_witness": "Witness Statement / Deposition...",
    "m_insert_web_snap": "Certified Web Snapshot (RFC 3161)...",
    "m_insert_gps": "GPS Coordinates / Location Point...",
    "m_insert_suspect": "Suspect Target Profile / Handle...",
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
    "m_tool_cdr": "Telecom CDR Excel Parser",
    "m_tool_cell_triang": "Cell Tower Triangulation & Azimuths",
    "m_tool_cotravel": "Co-Traveler Twin Phone Detector",
    "m_tool_alibi": "Alibi Contradiction Verification",
    "m_tool_alpr": "Algerian License Plate OCR (LAPI)",
    "m_tool_ccp_mules": "BaridiMob CCP & Money Mules Registry",
    "m_tool_requisitions": "CPP Judicial Requisition Generator",
    "m_tool_all_police": "Browse All Police & Telecom Tools (9 Tools) ↗",
    "m_view_graph": "Clue Board (Graph Canvas)",
    "m_view_timeline": "Forensic Chronological Timeline",
    "m_view_map": "GEOINT Map & Cell Tower Sectors",
    "m_view_vault": "Sealed Evidence Locker (MinIO WORM)",
    "m_view_reset_zoom": "Reset Zoom & Center View",
    "m_view_toggle_layers": "Toggle Layers Panel",
    "m_view_toggle_fullscreen": "Toggle Fullscreen (F11)",
    "m_view_refresh": "Refresh & Reorganize Layout",
    "m_ai_mode_deterministic": "Strict Deterministic Mode (100% No LLM - Active)",
    "m_ai_mode_local_ollama": "Enable Local Offline Copilot (Ollama/Qwen-2.5)",
    "m_ai_mode_cloud": "Secure Cloud Gateway (LiteLLM)",
    "m_ai_suggest_playbook": "Synthesize Investigation DAG Playbook",
    "m_ai_summarize": "Draft Chronological Case Summary",
    "m_ai_settings": "LLM Engine & Model Settings...",
    "modal_properties_title": "Investigation Case Properties",
    "modal_insert_title": "Insert New Clue / Evidence",
    "modal_llm_title": "AI Copilot & LLM Engine Settings",
    "modal_import_title": "Import Investigation Files & Data",
    "btn_save_changes": "Save Changes",
    "btn_cancel": "Cancel",
    "btn_insert_confirm": "Insert Evidence into Case"
  }
};
const TOOLS_CATALOG = [
  {
    "id": "tool_soc_freeze",
    "cat": "socmint",
    "name": "ArchiveBox Web Freezer",
    "desc": "WORM certified WARC and DOM snapshot (RFC 3161)",
    "req": "offline",
    "inputs": [
      "URL",
      "SocialPost"
    ]
  },
  {
    "id": "tool_soc_extract_ioc",
    "cat": "socmint",
    "name": "IOC Text Clue Extractor",
    "desc": "Deterministic regex and AST parser for phones, IBAN, and links",
    "req": "offline",
    "inputs": [
      "SocialPost",
      "WebText"
    ]
  },
  {
    "id": "tool_soc_fb_transparency",
    "cat": "socmint",
    "name": "Facebook Page Transparency",
    "desc": "Retrieves primary administrator country and manager history",
    "req": "offline",
    "inputs": [
      "SocialAccount"
    ]
  },
  {
    "id": "tool_soc_fb_ad_library",
    "cat": "socmint",
    "name": "Meta Ad Library Inspector",
    "desc": "Discovers all sponsored campaigns and linked payment identities",
    "req": "free_key",
    "inputs": [
      "SocialAccount",
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_soc_telegram_user",
    "cat": "socmint",
    "name": "Telegram Account Resolver",
    "desc": "Resolves user IDs, avatars, and linked fraud broadcast channels",
    "req": "sock_puppet",
    "inputs": [
      "PhoneNumber",
      "Username"
    ]
  },
  {
    "id": "tool_soc_whatsapp_biz",
    "cat": "socmint",
    "name": "WhatsApp Business Inspector",
    "desc": "Extracts merchant profile catalog, business description and avatar",
    "req": "sock_puppet",
    "inputs": [
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_soc_instagram",
    "cat": "socmint",
    "name": "Instagram OSINT Analyzer",
    "desc": "Masked phone recovery check and profile story metadata",
    "req": "sock_puppet",
    "inputs": [
      "SocialAccount",
      "Username"
    ]
  },
  {
    "id": "tool_soc_marketplaces",
    "cat": "socmint",
    "name": "Ouedkniss & Classifieds Search",
    "desc": "Historical classifieds search across Algerian e-commerce portals",
    "req": "offline",
    "inputs": [
      "PhoneNumber",
      "Keyword"
    ]
  },
  {
    "id": "tool_soc_social_mapper",
    "cat": "socmint",
    "name": "Social Mapper ArcFace Correlator",
    "desc": "Automated facial recognition cross-matcher across 8 platforms",
    "req": "sock_puppet",
    "inputs": [
      "Image",
      "PersonName"
    ]
  },
  {
    "id": "tool_soc_video_archiver",
    "cat": "socmint",
    "name": "Forensic Video Archiver",
    "desc": "Lossless video stream downloader and keyframe splitter",
    "req": "offline",
    "inputs": [
      "URL"
    ]
  },
  {
    "id": "tool_id_phoneinfoga",
    "cat": "phone_id",
    "name": "PhoneInfoga E.164 Analyzer",
    "desc": "Carrier identification, line validity and international dialing plan",
    "req": "offline",
    "inputs": [
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_id_ignorant",
    "cat": "phone_id",
    "name": "Ignorant 100+ App Scanner",
    "desc": "Checks registration presence across 100+ social and messaging endpoints",
    "req": "offline",
    "inputs": [
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_id_caller_id",
    "cat": "phone_id",
    "name": "Truecaller & Sync Reverse Lookup",
    "desc": "Queries crowd-sourced name listings and spam reports",
    "req": "free_key",
    "inputs": [
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_id_maigret",
    "cat": "phone_id",
    "name": "Maigret 2,500+ Site Scan",
    "desc": "Deep dossier builder searching usernames across thousands of forums",
    "req": "offline",
    "inputs": [
      "Username"
    ]
  },
  {
    "id": "tool_id_sherlock",
    "cat": "phone_id",
    "name": "Sherlock Fast Handle Scanner",
    "desc": "Rapid triage scanner across major online platforms",
    "req": "offline",
    "inputs": [
      "Username"
    ]
  },
  {
    "id": "tool_id_blackbird",
    "cat": "phone_id",
    "name": "Blackbird Fast Enumerator",
    "desc": "Correlates accounts and emails using OSINT signatures",
    "req": "offline",
    "inputs": [
      "Email",
      "Username"
    ]
  },
  {
    "id": "tool_id_holehe",
    "cat": "phone_id",
    "name": "Holehe Password Recovery Scanner",
    "desc": "Checks if an email is registered without alerting target",
    "req": "offline",
    "inputs": [
      "Email"
    ]
  },
  {
    "id": "tool_id_ghunt",
    "cat": "phone_id",
    "name": "GHunt v2 Google Account Investigator",
    "desc": "Extracts Google ID, review history, coordinates and photo albums",
    "req": "sock_puppet",
    "inputs": [
      "Email"
    ]
  },
  {
    "id": "tool_id_h8mail",
    "cat": "phone_id",
    "name": "h8mail Breach & Stealer Hunter",
    "desc": "Searches plaintext breach credentials and malware stealer dumps",
    "req": "free_key",
    "inputs": [
      "Email",
      "Username"
    ]
  },
  {
    "id": "tool_id_dehashed",
    "cat": "phone_id",
    "name": "DeHashed Breach Query Engine",
    "desc": "Cross-references leaked passwords, addresses, and IP histories",
    "req": "free_key",
    "inputs": [
      "Email",
      "PhoneNumber",
      "Username"
    ]
  },
  {
    "id": "tool_id_norm_e164",
    "cat": "phone_id",
    "name": "E.164 International Normalizer",
    "desc": "Canonicalizes raw phone strings to strict telecommunication standards",
    "req": "offline",
    "inputs": [
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_web_objectid",
    "cat": "web_infra",
    "name": "MongoDB ObjectId & UUID Decoder",
    "desc": "Extracts exact UTC server timestamp and machine process fingerprint",
    "req": "offline",
    "inputs": [
      "DatabaseID",
      "URL"
    ]
  },
  {
    "id": "tool_web_reverse_pixel",
    "cat": "web_infra",
    "name": "Meta Pixel & GA Reverse Hunter",
    "desc": "Discovers sibling scam domains sharing identical tracker IDs",
    "req": "free_key",
    "inputs": [
      "TrackerID",
      "Domain"
    ]
  },
  {
    "id": "tool_web_httpx",
    "cat": "web_infra",
    "name": "httpx Fingerprint & JARM Scanner",
    "desc": "Computes TLS JARM, HTTP headers, and favicon MurmurHash",
    "req": "offline",
    "inputs": [
      "Domain",
      "IP"
    ]
  },
  {
    "id": "tool_web_katana",
    "cat": "web_infra",
    "name": "Katana Web Spider & JS Analyzer",
    "desc": "Parses hidden endpoints, credentials, and Supabase tokens in JS",
    "req": "offline",
    "inputs": [
      "URL"
    ]
  },
  {
    "id": "tool_web_subfinder",
    "cat": "web_infra",
    "name": "Subfinder Passive Discovery",
    "desc": "Enumerates passive subdomains via certificate transparency logs",
    "req": "free_key",
    "inputs": [
      "Domain"
    ]
  },
  {
    "id": "tool_web_amass",
    "cat": "web_infra",
    "name": "OWASP Amass Network Mapper",
    "desc": "Active and passive mapping of ASN infrastructure and prefixes",
    "req": "offline",
    "inputs": [
      "Domain",
      "IP"
    ]
  },
  {
    "id": "tool_web_shodan",
    "cat": "web_infra",
    "name": "Shodan Host & Open Ports Query",
    "desc": "Identifies running daemons, vulnerability banners, and origin servers",
    "req": "free_key",
    "inputs": [
      "IP",
      "Domain"
    ]
  },
  {
    "id": "tool_web_censys",
    "cat": "web_infra",
    "name": "Censys SSL/TLS Certificate Search",
    "desc": "Pivots across certificates exposing true backend origins",
    "req": "free_key",
    "inputs": [
      "IP",
      "Domain"
    ]
  },
  {
    "id": "tool_web_whois",
    "cat": "web_infra",
    "name": "WHOIS Registrar & History",
    "desc": "Historical domain registration records and privacy proxy pivots",
    "req": "free_key",
    "inputs": [
      "Domain"
    ]
  },
  {
    "id": "tool_web_dnsx",
    "cat": "web_infra",
    "name": "dnsx High-Speed Resolver",
    "desc": "Fast multi-record DNS resolution (A, AAAA, MX, TXT)",
    "req": "offline",
    "inputs": [
      "Domain"
    ]
  },
  {
    "id": "tool_web_trufflehog",
    "cat": "web_infra",
    "name": "TruffleHog Secret Scanner",
    "desc": "Detects high-entropy keys, AWS tokens, and database passwords",
    "req": "offline",
    "inputs": [
      "URL",
      "WebText"
    ]
  },
  {
    "id": "tool_web_gowitness",
    "cat": "web_infra",
    "name": "GoWitness Web Archiver",
    "desc": "Captures forensic screenshots and DOM trees across URL clusters",
    "req": "offline",
    "inputs": [
      "URL"
    ]
  },
  {
    "id": "tool_media_exiftool",
    "cat": "media_geo",
    "name": "ExifTool Metadata Extractor",
    "desc": "Extracts GPS coordinates, camera serial numbers, and EXIF timestamps",
    "req": "offline",
    "inputs": [
      "Image",
      "Video"
    ]
  },
  {
    "id": "tool_media_sherloq",
    "cat": "media_geo",
    "name": "Sherloq Photo Tampering & ELA",
    "desc": "Error Level Analysis and noise consistency verification",
    "req": "offline",
    "inputs": [
      "Image"
    ]
  },
  {
    "id": "tool_media_reverse_img",
    "cat": "media_geo",
    "name": "Reverse Image Search Engine",
    "desc": "Checks if stock or stolen imagery was re-used in fake ads",
    "req": "offline",
    "inputs": [
      "Image"
    ]
  },
  {
    "id": "tool_media_deepface",
    "cat": "media_geo",
    "name": "ArcFace 512-d Biometric Matcher",
    "desc": "Deep facial embedding comparison with cosine similarity threshold",
    "req": "offline",
    "inputs": [
      "Image",
      "CandidateSubject"
    ]
  },
  {
    "id": "tool_media_pimeyes",
    "cat": "media_geo",
    "name": "PimEyes Web Facial Indexer",
    "desc": "Global face cross-referencer across public indexed websites",
    "req": "paid",
    "inputs": [
      "Image"
    ]
  },
  {
    "id": "tool_media_geoclip",
    "cat": "media_geo",
    "name": "GeoCLIP AI Visual Locator",
    "desc": "Estimates geographic coordinates from visual landmark features",
    "req": "offline",
    "inputs": [
      "Image"
    ]
  },
  {
    "id": "tool_media_shadowfinder",
    "cat": "media_geo",
    "name": "ShadowFinder Chronolocation",
    "desc": "Estimates capture time and date based on sun azimuth shadows",
    "req": "offline",
    "inputs": [
      "Image"
    ]
  },
  {
    "id": "tool_media_whisper",
    "cat": "media_geo",
    "name": "Faster-Whisper Large-v3 STT",
    "desc": "Local speech-to-text supporting French, English, and Algerian Darija",
    "req": "offline",
    "inputs": [
      "Audio"
    ]
  },
  {
    "id": "tool_media_pyannote",
    "cat": "media_geo",
    "name": "PyAnnote 3.1 Speaker Diarization",
    "desc": "Isolates distinct vocal tracks and verifies acoustic signatures",
    "req": "offline",
    "inputs": [
      "Audio",
      "CandidateSubject"
    ]
  },
  {
    "id": "tool_media_deepfake_aud",
    "cat": "media_geo",
    "name": "Voice Clone & Deepfake Detector",
    "desc": "Spectrogram feature analyzer for synthetic voice fraud detection",
    "req": "offline",
    "inputs": [
      "Audio"
    ]
  },
  {
    "id": "tool_media_overpass",
    "cat": "media_geo",
    "name": "OpenStreetMap Overpass Engine",
    "desc": "Queries geospatial features, building polygons, and road networks",
    "req": "offline",
    "inputs": [
      "Coordinates"
    ]
  },
  {
    "id": "tool_pol_cdr_parser",
    "cat": "police_cdr",
    "name": "Telecom CDR Parser (DZ Operators)",
    "desc": "Parses Mobilis, Djezzy, and Ooredoo Excel call detail records",
    "req": "offline",
    "inputs": [
      "CDR_File",
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_pol_cell_triang",
    "cat": "police_cdr",
    "name": "OpenCellID Cell Tower Triangulator",
    "desc": "Renders BTS coverage azimuth cones and device intersection zones",
    "req": "offline",
    "inputs": [
      "CellTower",
      "Coordinates"
    ]
  },
  {
    "id": "tool_pol_cotravelers",
    "cat": "police_cdr",
    "name": "Co-Traveler Spatio-Temporal Detector",
    "desc": "Detects burner devices consistently co-moving with a primary line",
    "req": "offline",
    "inputs": [
      "CDR_File"
    ]
  },
  {
    "id": "tool_pol_alibi",
    "cat": "police_cdr",
    "name": "Alibi Contradiction Engine",
    "desc": "Validates suspect statements against immutable CDR and GPS records",
    "req": "offline",
    "inputs": [
      "CandidateSubject",
      "Coordinates"
    ]
  },
  {
    "id": "tool_pol_alpr",
    "cat": "police_cdr",
    "name": "YOLOv8 Algerian License Plate Reader",
    "desc": "Transcribes national vehicle registration plates (e.g., 04829-116-16)",
    "req": "offline",
    "inputs": [
      "Image",
      "Video"
    ]
  },
  {
    "id": "tool_pol_vin",
    "cat": "police_cdr",
    "name": "Vehicle VIN & Registry Decoder",
    "desc": "Decodes manufacturer details and queries national vehicle databases",
    "req": "free_key",
    "inputs": [
      "VIN_Code"
    ]
  },
  {
    "id": "tool_pol_priors",
    "cat": "police_cdr",
    "name": "Prior Complaints Cross-Matcher",
    "desc": "Identifies linked complaints sharing identical phone or bank details",
    "req": "offline",
    "inputs": [
      "PhoneNumber",
      "DatabaseID"
    ]
  },
  {
    "id": "tool_pol_requisitions",
    "cat": "police_cdr",
    "name": "CPP Judicial Requisition Generator",
    "desc": "Generates court orders for telecom subscriber identity and bank freeze",
    "req": "offline",
    "inputs": [
      "CandidateSubject",
      "PhoneNumber"
    ]
  },
  {
    "id": "tool_pol_trocr",
    "cat": "police_cdr",
    "name": "TrOCR Handwritten Deposition Scanner",
    "desc": "OCR model for handwritten police logs and victim depositions",
    "req": "offline",
    "inputs": [
      "Image"
    ]
  },
  {
    "id": "tool_fin_ccp",
    "cat": "finance_crypto",
    "name": "Algérie Poste CCP & Clé Validator",
    "desc": "Validates postal account checksums and identifies account branches",
    "req": "offline",
    "inputs": [
      "CCP_Account"
    ]
  },
  {
    "id": "tool_fin_iban",
    "cat": "finance_crypto",
    "name": "Schwifty IBAN & BIC Resolver",
    "desc": "Validates bank routing numbers and financial institution SWIFT codes",
    "req": "offline",
    "inputs": [
      "IBAN_Code"
    ]
  },
  {
    "id": "tool_fin_baridimob",
    "cat": "finance_crypto",
    "name": "BaridiMob RIP Routing Verifier",
    "desc": "Checks Algerian postal RIP structure and recipient account integrity",
    "req": "free_key",
    "inputs": [
      "CCP_Account"
    ]
  },
  {
    "id": "tool_fin_mules",
    "cat": "finance_crypto",
    "name": "Money Mule Recidivism Ledger",
    "desc": "Flags accounts previously identified as commercial conduits in fraud cases",
    "req": "offline",
    "inputs": [
      "CCP_Account",
      "CandidateSubject"
    ]
  },
  {
    "id": "tool_fin_graphsense",
    "cat": "finance_crypto",
    "name": "GraphSense Crypto Wallet Tracer",
    "desc": "Follows blockchain hops, clustering addresses across Bitcoin/USDT",
    "req": "offline",
    "inputs": [
      "CryptoAddress"
    ]
  },
  {
    "id": "tool_fin_blockchain",
    "cat": "finance_crypto",
    "name": "Public Blockchain RPC Explorer",
    "desc": "Inspects smart contract calls, ERC-20 token transfers and balances",
    "req": "offline",
    "inputs": [
      "CryptoAddress"
    ]
  },
  {
    "id": "tool_fin_mixer",
    "cat": "finance_crypto",
    "name": "Crypto Mixer Taint Scorer",
    "desc": "Calculates taint scores for funds routed through Tornado/ChipMixer",
    "req": "offline",
    "inputs": [
      "CryptoAddress"
    ]
  },
  {
    "id": "tool_fin_opencorp",
    "cat": "finance_crypto",
    "name": "OpenCorporates Beneficial Ownership",
    "desc": "Maps corporate directors and registered shell commercial entities",
    "req": "free_key",
    "inputs": [
      "PersonName",
      "Domain"
    ]
  },
  {
    "id": "tool_fin_sanctions",
    "cat": "finance_crypto",
    "name": "Yente International Sanctions Screening",
    "desc": "Screens entities against Interpol Red Notices, OFAC, and UN lists",
    "req": "offline",
    "inputs": [
      "PersonName",
      "Domain"
    ]
  }
];
const TOOL_SPECS = {
  "tool_ioc_extractor": {
    "id": "tool_ioc_extractor",
    "name": "Extracteur d'IOCs & Entités Forensiques",
    "cat": "Métadonnées & Analyse Technique",
    "badge": "P0 • Indispensable",
    "mode": "100% Déterministe • Review-Run",
    "inputs": "Texte brut, dump Telegram/WhatsApp, document PDF, extraction HTML, logs de chat",
    "outputs": "Adresses IPv4/IPv6, numéros E.164 (+213...), comptes CCP/BaridiMob, hashes SHA-256, FQDN",
    "storage": "Neo4j 5.x (Nouveaux nœuds d'indices) • PostgreSQL 16 (Table forensic_iocs) • MinIO S3 (Archive texte brute WORM)",
    "resources": "Moteur Python déterministe • Empreinte mémoire < 64 Mo • Mode Review-Run • Furtif",
    "compliance": "Scellé ISO 27037 • Validation syntaxique stricte avec checksums (Luhn CB, clé CCP Algérie Poste)",
    "desc": "Extraction automatisée d'identifiants et de traces numériques enfouies dans des textes non structurés. Valide mathématiquement les numéros de compte CCP et cartes bancaires avant injection dans le graphe relationnel pour éviter toute fausse corrélation."
  },
  "tool_mongodb_decoder": {
    "id": "tool_mongodb_decoder",
    "name": "Décodeur Timestamp ObjectId MongoDB",
    "cat": "Métadonnées & Analyse Technique",
    "badge": "P0 • Horodatage Garanti",
    "mode": "Instantané • Zéro Empreinte Réseau",
    "inputs": "Identifiant hexadécimal 24 caractères BSON (ex: 65cb48f192b4...) extrait d'une URL ou API",
    "outputs": "Horodatage UNIX exact à la seconde, numéro de machine (3 octets), PID processus (2 octets), compteur séquentiel",
    "storage": "TimescaleDB (Événement de timeline forensique) • Neo4j (Attribut created_at validé)",
    "resources": "Calcul binaire local déterministe • Durée: 0.01 ms • Aucune requête sortante",
    "compliance": "Spécification BSON v1.1 • Preuve d'antériorité certifiée",
    "desc": "Fournit la preuve temporelle irréfutable du moment exact de création d'une annonce ou d'un compte sur une plateforme sans requêter le serveur distant. Révèle également l'identifiant machine (machine identifier) permettant de relier deux annonces postées depuis le même serveur."
  },
  "tool_exiftool_metadata": {
    "id": "tool_exiftool_metadata",
    "name": "Analyseur ExifTool (GPS & Métadonnées Médias)",
    "cat": "Métadonnées & Analyse Technique",
    "badge": "P0 • Géolocalisation Forensique",
    "mode": "Extraction Binaire Locale",
    "inputs": "Fichier image (JPEG, PNG, HEIC), vidéo (MP4, MOV), document PDF saisi",
    "outputs": "Coordonnées géographiques GPS (Latitude/Longitude/Altitude), horodatage boîtier appareil, marque et numéro de série d'appareil (Exif:SerialNumber)",
    "storage": "Neo4j (Nœud Coordonnées_GPS et Appareil_Photo) • MapLibre GL (Point de localisation SIG)",
    "resources": "Processus local ultra-léger (< 15 Mo RAM) • Exécution immédiate",
    "compliance": "Garantie de non-altération du fichier média original (lecture seule)",
    "desc": "Extrait les métadonnées cachées dans les photos de faux pneus ou bordereaux postaux publiées par les escrocs. Lorsque l'image n'a pas été nettoyée par la plateforme, elle révèle l'endroit physique exact où la photo a été prise."
  },
  "tool_whois_dns": {
    "id": "tool_whois_dns",
    "name": "Historique WHOIS & Enregistrements DNS",
    "cat": "Web & Infrastructure Réseau",
    "badge": "P1 • Reconnaissance d'Infrastructure",
    "mode": "Requêtage RDAP & Zones DNS",
    "inputs": "Nom de domaine FQDN (ex: algerie-pneus-express.com), adresse IP",
    "outputs": "Registrar, historique des contacts administratifs (avant Privacy Protection), NS, MX, TXT, enregistrements A/AAAA",
    "storage": "PostgreSQL 16 (Historique versions DNS) • Neo4j (Nœud Domaine et relation [:REGISTERED_BY])",
    "resources": "Requêtes RDAP / DNS directes • Cache Redis 7 jours pour furtivité",
    "compliance": "RFC 7480 (RDAP) • Empreinte DNS horodatée",
    "desc": "Identification des coordonnées initiales du déposant, changements de serveurs d'hébergement et pivots sur l'adresse email ou le numéro de téléphone utilisé lors de l'enregistrement initial avant l'activation du masquage WhoisGuard."
  },
  "tool_shodan_censys": {
    "id": "tool_shodan_censys",
    "name": "Scanner de Ports Shodan & Censys",
    "cat": "Web & Infrastructure Réseau",
    "badge": "P1 • Démasquage d'Origine IP",
    "mode": "Consultation Passive d'Index",
    "inputs": "Adresse IP, sous-réseau CIDR, hash de certificat SSL (JA3 / JARM)",
    "outputs": "Ports ouverts (SSH, RDP, Webmin), bannières de services, vulnérabilités CVE, empreinte de serveur backend",
    "storage": "MongoDB 7.x (Bannières brutes BSON) • Neo4j (Nœuds IP, Services et Vulnérabilités)",
    "resources": "Consultation d'index passifs (Zéro contact avec l'infrastructure du suspect)",
    "compliance": "Scan passif non intrusif conforme aux réquisitions judiciaires",
    "desc": "Permet de contourner les proxys de protection (Cloudflare, DDoS-Guard) en découvrant le véritable serveur backend d'origine via les empreintes de certificats TLS et bannières de serveurs exposés publiquement."
  },
  "tool_ssl_crt": {
    "id": "tool_ssl_crt",
    "name": "Certificats SSL & Certificate Transparency (crt.sh)",
    "cat": "Web & Infrastructure Réseau",
    "badge": "P1 • Découverte de Sous-Domaines",
    "mode": "Interrogation des Logs Publics CT",
    "inputs": "Nom de domaine racine (ex: pneus-dz.com)",
    "outputs": "Liste complète des sous-domaines (api., admin., cpanel., staging.), dates d'émission, autorité de certification",
    "storage": "Neo4j 5.x (Nœuds Sous-Domaines et Certificats)",
    "resources": "Appels HTTPS vers les journaux publics RFC 6962 • Instantané",
    "compliance": "Journaux publics immuables de transparence",
    "desc": "Les journaux de transparence de certificats sont obligatoires et immuables. Dès qu'un escroc génère un certificat SSL pour son serveur d'administration caché ou son API de paiement frauduleux, il est indexé publiquement et repéré par cet outil."
  },
  "tool_meta_pixel": {
    "id": "tool_meta_pixel",
    "name": "Pivot Inverse Meta Pixel & ID Tracker",
    "cat": "Pivots Publicitaires & Traçage",
    "badge": "P0 • Preuve d'Attribution",
    "mode": "Analyse de Graphe de Propriété",
    "inputs": "Code source de page web, Pixel ID Facebook (ex: 8841920391), Tag Google Analytics (UA-/G-), AdSense (pub-)",
    "outputs": "Ensemble des sites web et domaines partageant le même compte publicitaire Meta/Google Business",
    "storage": "Neo4j 5.x (Arêtes [:OWNS_TRACKER] reliant plusieurs domaines à un même compte annonceur)",
    "resources": "Requêtage PublicWWW & BuiltWith • Analyse de signatures balises HTML",
    "compliance": "Horodatage RFC 3161 • Capture des balises scripts certifiée WARC",
    "desc": "Les escrocs créent souvent de multiples sites aux noms différents pour contourner les signalements, mais réutilisent le même identifiant Pixel Facebook ou Google Analytics pour suivre leurs conversions payantes. Cet outil pivote sur cet ID pour démasquer l'intégralité du réseau d'escroquerie."
  },
  "tool_google_analytics": {
    "id": "tool_google_analytics",
    "name": "Traçage Reverse Google Analytics / AdSense",
    "cat": "Pivots Publicitaires & Traçage",
    "badge": "P1 • Corrélation Monétaire",
    "mode": "Recherche d'Index Inversé",
    "inputs": "Code de suivi Google UA-XXXXX, G-XXXXX ou compte éditeur pub-XXXXX",
    "outputs": "Tous les sites générant des revenus publicitaires pour le même titulaire",
    "storage": "Neo4j (Relation [:MONETIZED_BY] vers le même compte bancaire / portefeuille)",
    "resources": "Moteur SpyOnWeb & Reverse-Analytics",
    "compliance": "Horodatage RFC 3161 • Chaîne de garde S3",
    "desc": "Relie les sites d'escroquerie aux blogs et sites vitrines légitimes de l'escroc où il monétise du trafic, fournissant une passerelle immédiate vers son compte bancaire de paiement Google AdSense."
  },
  "tool_dehashed_breach": {
    "id": "tool_dehashed_breach",
    "name": "Recherche de Fuites d'Identifiants (DeHashed)",
    "cat": "Fuites de Données & Identifiants",
    "badge": "P0 • Désanonymisation Directe",
    "mode": "Recherche d'Index Dé-dupliqué",
    "inputs": "Adresse e-mail, pseudonyme, numéro de téléphone, nom de domaine",
    "outputs": "Mots de passe fuités (clairs ou hashes bcrypt/MD5), noms d'utilisateurs associés, date et nom de la fuite",
    "storage": "PostgreSQL (Table chiffrée credentials_breaches) • Neo4j (Nœuds Person et Identités)",
    "resources": "Recherche passive dans les index de brèches dé-dupliquées • Chiffrement au repos",
    "compliance": "Conservation chiffrée AES-256 avec journalisation d'accès de l'officier de police judiciaire",
    "desc": "Rapproche un pseudonyme d'escroc ou un faux profil Facebook d'une adresse email personnelle oubliée dans une brèche ancienne (ex: Canva, LinkedIn, forums algériens), permettant de révéler le véritable nom et patronyme du suspect."
  },
  "tool_holehe_email": {
    "id": "tool_holehe_email",
    "name": "Vérificateur d'Email sur 120+ Services (Holehe)",
    "cat": "Fuites de Données & Identifiants",
    "badge": "P1 • Empreinte Numérique",
    "mode": "Sondage Furtif de Mot de Passe Perdu",
    "inputs": "Adresse email suspectée (ex: a.benali.investigation@gmail.com)",
    "outputs": "Liste des plateformes où le compte existe (Twitter/X, Discord, Netflix, Spotify, GitHub, Deliveroo)",
    "storage": "Neo4j (Nœuds Comptes_Services et relations [:REGISTERED_ON])",
    "resources": "Moteur Holehe Python • Sondage sans notification envoyée à la cible",
    "compliance": "Reconnaissance passive respectant les protocoles de réinitialisation sans altération",
    "desc": "Détermine précisément sur quelles plateformes grand public l'adresse email de l'escroc est enregistrée, guidant l'Officier de Police Judiciaire pour la rédaction des réquisitions judiciaires ciblées."
  },
  "tool_telegram_resolver": {
    "id": "tool_telegram_resolver",
    "name": "Résolveur & Pivot Telegram (UID fixe, canaux)",
    "cat": "Profilage Plateformes Sociales (SOCMINT)",
    "badge": "P0 • Identifiant Immuable",
    "mode": "Client MTProto Furtif",
    "inputs": "Handle Telegram (@vendeur_pneus_dz), numéro de téléphone E.164, lien t.me/...",
    "outputs": "Telegram User ID immuable (ex: 519283741), photo de profil haute résolution, nom affiché, canaux administrés, bio historique",
    "storage": "Neo4j (Nœud Telegram_Account avec propriété telegram_id) • MinIO S3 (Archive des médias)",
    "resources": "Passerelle MTProto via proxy rotatif • Zéro fuite IP enquêteur",
    "compliance": "Horodatage RFC 3161 de la session MTProto",
    "desc": "Alors que les pseudonymes et numéros de téléphone peuvent être changés à volonté par les criminels, le Telegram User ID numérique reste strictement identique à vie. Cet outil extrait cette ancre d'identité permanente pour relier le suspect à tous ses canaux de vente criminels passés et futurs."
  },
  "tool_whatsapp_inspector": {
    "id": "tool_whatsapp_inspector",
    "name": "Inspecteur WhatsApp Business & VCard",
    "cat": "Profilage Plateformes Sociales (SOCMINT)",
    "badge": "P0 • Catalogue Commercial & Preuves",
    "mode": "Inspection de Profils API",
    "inputs": "Numéro de téléphone (+213...), contact VCard, lien wa.me/...",
    "outputs": "Nom commercial officiel, description d'activité, adresse postale déclarée, catalogue de produits frauduleux avec prix et photos, horaires",
    "storage": "MinIO S3 (Preuve WARC scellée) • PostgreSQL (Extraction du catalogue produits)",
    "resources": "Conteneur d'isolation headless • Capture d'écran certifiée",
    "compliance": "Scellé numérique WORM ISO 27037",
    "desc": "Capture l'intégralité du catalogue d'articles frauduleux configuré sur le compte WhatsApp Business du suspect, constituant la preuve matérielle de l'offre commerciale trompeuse et documentant les prix demandés aux victimes."
  },
  "tool_meta_ad_transparency": {
    "id": "tool_meta_ad_transparency",
    "name": "Transparence Pages Facebook & Meta Ad Library",
    "cat": "Profilage Plateformes Sociales (SOCMINT)",
    "badge": "P0 • Localisation Gestionnaires & Annonces",
    "mode": "Requêtage Meta Graph API & Ad Library",
    "inputs": "URL de page Facebook (ex: facebook.com/pneus.algerie.promo), ID de page",
    "outputs": "Pays de résidence des administrateurs, historique des modifications de nom, annonces publicitaires sponsorisées actives, dépenses estimées",
    "storage": "Neo4j (Nœuds Page_FB, Emplacement_Admin, Annonce_Publicitaire) • MinIO S3",
    "resources": "Appels d'API officielles de transparence publicitaire",
    "compliance": "Certificat d'extraction horodaté",
    "desc": "Démontre aux magistrats instructeurs que la page se présentant comme un magasin officiel à Alger est en réalité administrée par des comptes situés dans une wilaya distincte, et recense toutes les annonces payées ayant appâté les victimes."
  },
  "tool_instagram_toutatis": {
    "id": "tool_instagram_toutatis",
    "name": "Analyseur Profils Instagram / Toutatis",
    "cat": "Profilage Plateformes Sociales (SOCMINT)",
    "badge": "P0 • Révélation Données Masquées",
    "mode": "Exploitation Canaux de Récupération",
    "inputs": "Nom d'utilisateur Instagram (@pneus_import_dz)",
    "outputs": "ID numérique fixe Instagram, numéro de téléphone masqué (+213 55***83), adresse email masquée (a***l@g***.com), bio complète, date création",
    "storage": "Neo4j (Nœud Instagram_Profile avec données partielles) • PostgreSQL (Table unmasking_attempts)",
    "resources": "Moteur Toutatis Python • Respect des seuils de temporisation",
    "compliance": "Extraction passive sans tentative de connexion non autorisée",
    "desc": "Interroge les protocoles de récupération de compte d'Instagram pour extraire les fragments d'email et les 4 derniers chiffres du numéro de téléphone de l'administrateur, permettant de corroborer immédiatement un suspect identifié dans les listings CDR."
  },
  "tool_ouedkniss_scraper": {
    "id": "tool_ouedkniss_scraper",
    "name": "Scraper d'Annonces Algériennes Ouedkniss",
    "cat": "Profilage Plateformes Sociales (SOCMINT)",
    "badge": "P0 • Marché Local Algérien",
    "mode": "Scraper Headless Spécialisé DZ",
    "inputs": "Lien d'annonce Ouedkniss, pseudo de store, numéro de téléphone algérien",
    "outputs": "Wilaya et commune du vendeur, date exacte de parution, numéro de téléphone, ensemble des annonces actives et archivées du même vendeur",
    "storage": "MongoDB (Document BSON structuré) • Neo4j (Nœuds Annonce, Vendeur, Wilaya)",
    "resources": "Playwright headless avec proxies algériens • Rotation de sessions",
    "compliance": "Capture WARC certifiée de chaque annonce archivée",
    "desc": "Recherche toutes les annonces publiées par le même vendeur sur Ouedkniss. Très souvent, les escrocs publient des annonces d'arnaque mais ont aussi publié des annonces personnelles légitimes (vente de véhicule, location) révélant leur véritable commune et identité."
  },
  "tool_social_mapper": {
    "id": "tool_social_mapper",
    "name": "Corrélateur Visuel Multi-Plateformes (Social Mapper)",
    "cat": "Profilage Plateformes Sociales (SOCMINT)",
    "badge": "P1 • Reconnaissance Faciale OSINT",
    "mode": "Recherche Visuelle Biométrique",
    "inputs": "Photo de profil suspecte ou visage extrait d'une vidéo/pièce d'identité",
    "outputs": "Profils correspondants sur Facebook, Instagram, LinkedIn, VK, Twitter avec score de similarité faciale",
    "storage": "Milvus / pgvector (Vecteurs de visages ArcFace 512d) • Neo4j (Relation [:SAME_PERSON_AS])",
    "resources": "Réseau de neurones ArcFace / InsightFace • Accélération GPU/CPU",
    "compliance": "Score de similarité purement indicatif exigeant une validation formelle par l'enquêteur",
    "desc": "Scanne les réseaux sociaux à grande échelle pour retrouver le visage du suspect sur d'autres comptes personnels ou familiaux, brisant ainsi les identités fictives utilisées dans les arnaques."
  },
  "tool_sna_betweenness": {
    "id": "tool_sna_betweenness",
    "name": "Centralité d'Intermédiarité (Betweenness Centrality)",
    "cat": "Analyse de Réseau Social (Graph SNA)",
    "badge": "P0 • Algorithme GDS Graph Science",
    "mode": "Calcul Matriciel Topologique Local",
    "inputs": "Sous-graphe des communications téléphoniques (CDR) et flux financiers (BaridiMob)",
    "outputs": "Score d'intermédiarité normalisé [0.0 - 1.0] pour chaque individu du réseau criminel",
    "storage": "Neo4j 5.x GDS (Graph Data Science) • Attribut betweenness_score sur les nœuds Person",
    "resources": "Calcul vectoriel multi-threadé en mémoire vive • Durée < 1.5 s pour 10 000 arêtes",
    "compliance": "Algorithme mathématique formel déterministe (sans IA générative ni risque d'hallucination)",
    "desc": "Identifie les nœuds qui agissent comme des ponts obligatoires entre différents groupes (ex: le contact qui fait le lien entre les démarcheurs téléphoniques et le cerveau de l'arnaque). Ces individus ont une valeur tactique majeure pour les interpellations."
  },
  "tool_sna_louvain": {
    "id": "tool_sna_louvain",
    "name": "Détection de Communautés (Algorithme de Louvain)",
    "cat": "Analyse de Réseau Social (Graph SNA)",
    "badge": "P0 • Partitionnement de Réseau",
    "mode": "Maximisation de la Modularité Graph",
    "inputs": "Graphe pondéré des interactions criminelles (nombre d'appels, montants financiers transférés)",
    "outputs": "Découpage optimal en sous-groupes étanches (communautés), coefficient de modularité Q",
    "storage": "Neo4j GDS • Attribut community_id et coloration automatique des calques dans le canvas",
    "resources": "Moteur Neo4j GDS Louvain • Traitement parallèle CPU",
    "compliance": "Rapport de modularité exportable avec preuve d'étanchéité des cellules",
    "desc": "Segmente automatiquement une vaste organisation criminelle en cellules opérationnelles : équipe de création d'annonces, équipe de phoning, réseau de mules financières chargées des retraits d'espèces en wilayas."
  },
  "tool_sna_pagerank": {
    "id": "tool_sna_pagerank",
    "name": "Détection de Prête-Noms & Mules (PageRank Bipartite)",
    "cat": "Analyse de Réseau Social (Graph SNA)",
    "badge": "P0 • Révélation des Mules Financières",
    "mode": "PageRank Personnalisé Pondéré",
    "inputs": "Graphe orienté des flux financiers Victimes -> Comptes CCP -> Retraits DAB",
    "outputs": "Score de centralité d'absorption de flux (Fan-in élevé, temps de rétention court)",
    "storage": "PostgreSQL (Table flag_mules) • Neo4j (Attribut is_money_mule_candidate)",
    "resources": "Calcul GDS PageRank • Détection des cycles de transit rapide",
    "compliance": "Conforme aux directives de lutte contre le blanchiment d'argent et l'escroquerie en bande organisée",
    "desc": "Distingue mathématiquement un compte bancaire de commerçant honnête (qui conserve des soldes) d'un compte de mule financière (qui reçoit de multiples petits virements de victimes et les retire immédiatement au distributeur)."
  },
  "tool_sna_link_pred": {
    "id": "tool_sna_link_pred",
    "name": "Prédiction de Liens Cachés (Adamic-Adar / Jaccard)",
    "cat": "Analyse de Réseau Social (Graph SNA)",
    "badge": "P1 • Hypothèse de Connexité",
    "mode": "Indice de Similarité Topologique",
    "inputs": "Graphe des contacts téléphoniques et des proximités géographiques de bornage BTS",
    "outputs": "Liste de paires de suspects avec un score élevé de connexion probable mais non encore observée directement",
    "storage": "Neo4j (Arêtes virtuelles en pointillés [:SUSPECTED_AFFILIATION])",
    "resources": "Algorithme GDS Adamic-Adar • Filtrage par seuil de confiance > 0.75",
    "compliance": "Présenté sous forme de simple hypothèse d'investigation nécessitant vérification légale",
    "desc": "Calcule la probabilité que deux suspects se connaissent et se coordonnent même s'ils évitent de s'appeler directement (utilisation d'intermédiaires communs ou présence simultanée répétée sous les mêmes antennes relais)."
  }
};

// Application State
const appState = {
  lang: 'fr',
  theme: 'dark',
  mode: 'analyze', // 'collect' | 'analyze' | 'report'
  canvasView: 'graph', // 'graph' | 'timeline' | 'map'
  activeScreen: 2, // 1 to 5
  stealth: true,
  selectedNodeId: 'node-suspect',
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  activeLayerFilter: 'all',
  activeTypeFilter: 'all',
  openMenuId: null,
  propertiesModalOpen: false,
  insertModalOpen: false,
  llmModalOpen: false,
  importModalOpen: false,
  commandPaletteOpen: false,
  auditModalOpen: false,
  toolInfoModalOpen: false,
  activeModalToolId: null
};

// Lucide SVG Icons Library (Zero Emojis)
function getLucideSvg(name, size = 16, className = '') {
  const s = size;
  const c = className ? `class="${className}"` : '';
  const icons = {
    'shield': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    'search': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    'network': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
    'calendar': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    'lock': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    'file-text': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    'layers': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    'filter': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    'terminal': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    'check': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polyline points="20 6 9 17 4 12"/></svg>`,
    'x': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`,
    'play': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    'eye': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    'eye-off': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    'moon': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    'history': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
    'sparkles': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
    'database': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    'credit-card': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    'plus': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    'chevron-down': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polyline points="6 9 12 15 18 9"/></svg>`,
    'sliders': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>`,
    'cpu': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="1" y2="4"/><line x1="15" x2="15" y1="1" y2="4"/><line x1="9" x2="9" y1="20" y2="23"/><line x1="15" x2="15" y1="20" y2="23"/><line x1="20" x2="23" y1="9" y2="9"/><line x1="20" x2="23" y1="14" y2="14"/><line x1="1" x2="4" y1="9" y2="9"/><line x1="1" x2="4" y1="14" y2="14"/></svg>`
  };
  return icons[name] || icons['shield'];
}

// Helper for i18n lookup
function t(key) {
  const dict = I18N_TRANSLATIONS[appState.lang] || I18N_TRANSLATIONS['fr'];
  return dict[key] || key;
}

// Language Switcher with RTL / LTR direction handler
function setLanguage(lang) {
  if (!['fr', 'ar', 'en'].includes(lang)) return;
  appState.lang = lang;

  const html = document.getElementById('app-root');
  if (html) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  applyI18n();
  renderInspector();
  renderSuggestedTools();
  showToast(lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : (lang === 'en' ? 'Language set to English' : 'Langue changée en Français'));
}

// Apply i18n data bindings across the document
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) {
      el.textContent = val;
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (val) el.setAttribute('title', val);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.setAttribute('placeholder', val);
  });
}

// Global Mode Switcher (Collect | Analyze | Report)
function setAppMode(mode) {
  appState.mode = mode;
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-mode') === mode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (mode === 'collect') {
    setScreen(3); // Review Queue / Inbox
    showToast(t('mode_collect') + ' : ' + t('inbox_title'));
  } else if (mode === 'analyze') {
    setScreen(2); // Graph Canvas with suggested tools
    showToast(t('mode_analyze') + ' : ' + t('canvas_graph_title'));
  } else if (mode === 'report') {
    setScreen(5); // Certified Report
    showToast(t('mode_report') + ' : ' + t('screen_5_title'));
  }
}

// Canvas View Switcher (Graph | Timeline | Map)
function setCanvasView(view) {
  appState.canvasView = view;
  document.querySelectorAll('.view-tab-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (view === 'graph') setScreen(2);
  else if (view === 'timeline' || view === 'map') setScreen(4);
}

// Screen Switcher (1 to 5)
function setScreen(num) {
  appState.activeScreen = num;
  const viewMap = {
    1: 'view-overview',
    2: 'view-graph-canvas',
    3: 'view-inbox-review',
    4: 'view-timeline-map',
    5: 'view-report-export'
  };
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(viewMap[i]) || document.getElementById(`screen-${i}`);
    if (el) {
      if (i === num) {
        el.classList.remove('is-hidden');
        el.classList.add('active-screen');
      } else {
        el.classList.add('is-hidden');
        el.classList.remove('active-screen');
      }
    }
  }

  // Update Canvas view tabs
  const viewTabs = document.querySelectorAll('.view-tab-btn');
  viewTabs.forEach(b => b.classList.remove('active'));
  if (num === 2) {
    const b = document.querySelector('.view-tab-btn[data-view="graph"]');
    if (b) b.classList.add('active');
  } else if (num === 4) {
    const b = document.querySelector('.view-tab-btn[data-view="timeline"]');
    if (b) b.classList.add('active');
  }

  renderInspector();
  renderSuggestedTools();
}

// Stealth Mode Toggle
function toggleStealth() {
  appState.stealth = !appState.stealth;
  const alertBadge = document.getElementById('stealth-warning-badge');
  if (alertBadge) {
    alertBadge.style.display = appState.stealth ? 'none' : 'inline-flex';
  }
  showToast(appState.stealth ? t('stealth_badge_on') : t('stealth_badge_off'));
}

// Theme Toggle (Dark / Light)
function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  const html = document.getElementById('app-root');
  if (html) html.setAttribute('data-theme', appState.theme);
  showToast(appState.theme === 'dark' ? 'Thème Sombre Activé' : "Thème Clair Activé (Mode Salle d'Audience)");
}

// Menubar Dropdown Logic
function toggleMenu(menuId) {
  const dropdown = document.getElementById(menuId);
  if (!dropdown) return;

  const isOpen = dropdown.classList.contains('is-open');
  closeAllMenus();

  if (!isOpen) {
    dropdown.classList.add('is-open');
    appState.openMenuId = menuId;
    const btn = document.getElementById(`btn-${menuId}`);
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  }
}

function closeAllMenus() {
  document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('is-open'));
  document.querySelectorAll('.menubar-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-expanded', 'false');
  });
  appState.openMenuId = null;
}

// Generic Menu Actions Trigger
function triggerMenuAction(action) {
  closeAllMenus();
  if (action === 'new_case' || action === 'case_props') {
    openPropertiesModal();
  } else if (action === 'insert_clue') {
    openInsertModal();
  } else if (action === 'llm_settings') {
    openLLMSettingsModal();
  } else if (action === 'import') {
    openImportModal();
  } else if (action === 'save_case') {
    showToast(t('m_save') + ' : ' + t('case_id'));
  } else if (action === 'save_as') {
    showToast(t('m_save_as') + ' #2026-SCAM-089-COPIE');
  } else if (action === 'export_report') {
    setScreen(5);
    showToast(t('m_export_report'));
  } else if (action === 'view_graph') {
    setCanvasView('graph');
  } else if (action === 'view_timeline') {
    setCanvasView('timeline');
  } else if (action === 'view_map') {
    setCanvasView('map');
  } else if (action === 'toggle_layers') {
    toggleLeftPanel();
  } else if (action === 'fullscreen') {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      showToast(t('m_view_toggle_fullscreen'));
    } else {
      document.exitFullscreen();
    }
  } else {
    runSimulatedTool(action);
  }
}

// Modals Controller
function openPropertiesModal() {
  appState.propertiesModalOpen = true;
  const modal = document.getElementById('properties-modal');
  if (modal) modal.style.display = 'flex';
}

function closePropertiesModal() {
  appState.propertiesModalOpen = false;
  const modal = document.getElementById('properties-modal');
  if (modal) modal.style.display = 'none';
}

function openInsertModal() {
  appState.insertModalOpen = true;
  const modal = document.getElementById('insert-modal');
  if (modal) modal.style.display = 'flex';
}

function closeInsertModal() {
  appState.insertModalOpen = false;
  const modal = document.getElementById('insert-modal');
  if (modal) modal.style.display = 'none';
}

function openLLMSettingsModal() {
  appState.llmModalOpen = true;
  const modal = document.getElementById('llm-settings-modal');
  if (modal) modal.style.display = 'flex';
}

function closeLLMSettingsModal() {
  appState.llmModalOpen = false;
  const modal = document.getElementById('llm-settings-modal');
  if (modal) modal.style.display = 'none';
}

function openImportModal() {
  appState.importModalOpen = true;
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'flex';
}

function closeImportModal() {
  appState.importModalOpen = false;
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'none';
}

// Tool Information Modal
function showToolInfo(toolId) {
  closeAllMenus();
  const tool = TOOL_SPECS[toolId] || TOOLS_CATALOG.find(t => t.id === toolId || t.name === toolId) || {
    name: toolId,
    cat: t('menu_osint'),
    badge: 'P1 • Déterministe',
    mode: 'Review-Run (Validation Requise)',
    desc: 'Outil d\'investigation judiciaire et forensique spécialisé.',
    inputs: 'Indice sélectionné (Texte, URL ou Fichier)',
    outputs: 'Nouveaux nœuds et arêtes créés dans le graphe d\'enquête',
    storage: 'Neo4j 5.x & MinIO S3 (Chaîne de garde WORM)',
    resources: 'Processus local sécurisé • Zéro fuite réseau',
    compliance: 'ISO 27037 / RFC 3161'
  };

  appState.activeModalToolId = toolId;
  appState.toolInfoModalOpen = true;

  const nameEl = document.getElementById('tool-info-name');
  if (nameEl) nameEl.textContent = tool.name;
  const catEl = document.getElementById('tool-info-cat');
  if (catEl) catEl.textContent = tool.cat;
  const badgeEl = document.getElementById('tool-info-badge');
  if (badgeEl) badgeEl.textContent = tool.badge;
  const modeEl = document.getElementById('tool-info-mode');
  if (modeEl) modeEl.textContent = tool.mode;
  const descEl = document.getElementById('tool-info-desc');
  if (descEl) descEl.textContent = tool.desc;
  const inputsEl = document.getElementById('tool-info-inputs-val');
  if (inputsEl) inputsEl.textContent = tool.inputs;
  const outputsEl = document.getElementById('tool-info-outputs-val');
  if (outputsEl) outputsEl.textContent = tool.outputs;
  const storageEl = document.getElementById('tool-info-storage-val');
  if (storageEl) storageEl.textContent = tool.storage;
  const resourcesEl = document.getElementById('tool-info-resources-val');
  if (resourcesEl) resourcesEl.textContent = tool.resources;
  const complianceEl = document.getElementById('tool-info-compliance-val');
  if (complianceEl) complianceEl.textContent = tool.compliance;

  const modal = document.getElementById('tool-info-modal');
  if (modal) modal.style.display = 'flex';
}

function closeToolInfoModal() {
  appState.toolInfoModalOpen = false;
  appState.activeModalToolId = null;
  const modal = document.getElementById('tool-info-modal');
  if (modal) modal.style.display = 'none';
}

function runToolFromModal() {
  const toolId = appState.activeModalToolId;
  closeToolInfoModal();
  if (toolId) {
    const tool = TOOL_SPECS[toolId];
    const name = tool ? tool.name : toolId;
    runSimulatedTool(name);
  }
}

function addToolToPlaybook() {
  closeToolInfoModal();
  showToast(t('tool_info_playbook_btn') + ' : ' + (appState.activeModalToolId || 'Outil'));
}

// Left Panel Collapse Toggle
function toggleLeftPanel() {
  appState.leftPanelCollapsed = !appState.leftPanelCollapsed;
  const panel = document.getElementById('panel-left');
  if (panel) panel.classList.toggle('collapsed', appState.leftPanelCollapsed);
}

// Node Selection Handler
function selectNode(nodeId) {
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.graph-node').forEach(n => {
    n.classList.toggle('selected', n.id === nodeId);
  });
  renderInspector();
  renderSuggestedTools();
}

// Inspector Rendering Logic
function renderInspector() {
  const container = document.getElementById('inspector-content-container');
  if (!container) return;

  if (appState.selectedNodeId === 'node-suspect') {
    container.innerHTML = `
      <div class="candidate-subject-card">
        <div class="candidate-subject-badge">
          <span class="chip chip-purple">${getLucideSvg('sparkles', 13)} ${t('candidate_subject_title')}</span>
          <span class="chip chip-neutral font-mono text-xs">${t('candidate_status_hypothesis')}</span>
        </div>
        <div class="judicial-warning-box">
          ${getLucideSvg('shield', 14)}
          <span class="judicial-warning-text">${t('judicial_safety_notice')}</span>
        </div>
        <div class="metric-score-breakdown">
          <div class="metric-row">
            <span class="metric-name">${t('candidate_biometrics_label')}</span>
            <span class="metric-value font-mono">89%</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">${t('candidate_voice_label')}</span>
            <span class="metric-value font-mono">94%</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">${t('candidate_centrality_label')}</span>
            <span class="metric-value font-mono">0.89</span>
          </div>
        </div>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${t('prop_identifier')}</span><span class="meta-val font-mono">Amine B. (31 ans, Oran)</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_layer')}</span><span class="meta-val chip chip-purple">Calque 4 (Hypothèse)</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_hash')}</span><span class="meta-val font-mono">3b4f...a891</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_source')}</span><span class="meta-val">Entity Resolution Engine</span></div>
        </div>
        <div class="candidate-actions">
          <button class="btn btn-secondary" onclick="openAuditModal('promote')">${getLucideSvg('check', 14)} ${t('btn_promote_verified')}</button>
          <button class="btn btn-ghost text-danger" onclick="openAuditModal('discard')">${getLucideSvg('x', 14)} ${t('btn_discard_hypothesis')}</button>
        </div>
      </div>
    `;
  } else if (appState.selectedNodeId === 'node-phone') {
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="chip chip-cyan">${getLucideSvg('phone', 14)} Téléphone E.164</span>
          <span class="font-mono text-muted">Node #03</span>
        </div>
        <h4 class="inspector-entity-title font-mono">+213 555 019 283</h4>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${t('prop_entity_type')}</span><span class="meta-val">Ligne Mobile (Ooredoo Algérie)</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_layer')}</span><span class="meta-val chip chip-cyan">Calque 2 (OSINT Brut)</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_hash')}</span><span class="meta-val font-mono">7f1a...c209</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_timestamp')}</span><span class="meta-val">10 Nov 2026 • 10:18 UTC</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_confidence')}</span><span class="meta-val chip chip-success">98% (Vérifié)</span></div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="chip chip-emerald">${getLucideSvg('lock', 14)} Annonce Marché</span>
          <span class="font-mono text-muted">Node #01</span>
        </div>
        <h4 class="inspector-entity-title">Annonce FB Marketplace #98124</h4>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${t('prop_layer')}</span><span class="meta-val chip chip-emerald">Calque 1 (Preuve Scellée)</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_hash')}</span><span class="meta-val font-mono">e3b0...b855 (RFC 3161)</span></div>
          <div class="meta-row"><span class="meta-key">${t('prop_timestamp')}</span><span class="meta-val">10 Nov 2026 • 10:15 UTC</span></div>
        </div>
      </div>
    `;
  }
}

// Render Suggested Tools based on selected node
function renderSuggestedTools() {
  const container = document.getElementById('suggested-tools-container');
  if (!container) return;

  let compatibleTools = [];
  if (appState.selectedNodeId === 'node-phone') {
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('PhoneNumber')).slice(0, 4);
  } else if (appState.selectedNodeId === 'node-suspect') {
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('CandidateSubject')).slice(0, 4);
  } else {
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('SocialPost') || t.inputs.includes('URL')).slice(0, 4);
  }

  container.innerHTML = compatibleTools.map(tool => `
    <div class="suggested-tool-item">
      <div class="tool-item-info">
        <div class="tool-title-row">
          <span class="tool-name">${tool.name}</span>
          <span class="chip chip-neutral">${tool.req === 'offline' ? 'Docker Local' : (tool.req === 'free_key' ? 'Clé API' : 'Session Infiltrée')}</span>
        </div>
        <p class="tool-desc">${tool.desc}</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="runSimulatedTool('${tool.name}')">
        ${getLucideSvg('play', 12)} ${t('btn_run_brick')}
      </button>
    </div>
  `).join('');
}

// Run simulated tool and dispatch to arbitration inbox
function runSimulatedTool(toolName) {
  showToast(`${t('toast_tool_success')} (${toolName})`);
  const badge = document.getElementById('inbox-pending-counter');
  if (badge) badge.textContent = '4';
}

// Toast helper
function showToast(msg) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3200);
}

// Audit modal (Promote / Discard)
function openAuditModal(action) {
  appState.auditModalOpen = true;
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'flex';
}

function closeAuditModal() {
  appState.auditModalOpen = false;
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'none';
}

function confirmAuditAction() {
  closeAuditModal();
  showToast(t('toast_clue_added'));
  setScreen(5);
}

// Command Palette
function openCommandPalette() {
  appState.commandPaletteOpen = true;
  const modal = document.getElementById('command-palette-modal');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('cmd-input');
    if (input) {
      input.value = '';
      input.focus();
      filterCommandPalette('');
    }
  }
}

function closeCommandPalette() {
  appState.commandPaletteOpen = false;
  const modal = document.getElementById('command-palette-modal');
  if (modal) modal.style.display = 'none';
}

function filterCommandPalette(query) {
  const container = document.getElementById('cmd-results-list');
  if (!container) return;
  const q = query.toLowerCase().trim();
  const filtered = TOOLS_CATALOG.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.cat.includes(q));

  container.innerHTML = filtered.slice(0, 8).map(tool => `
    <div class="cmd-result-item" onclick="selectCommandTool('${tool.name}')">
      <div class="cmd-icon-box">${getLucideSvg('terminal', 16)}</div>
      <div class="cmd-text-box">
        <div class="cmd-name">${tool.name}</div>
        <div class="cmd-desc">${tool.desc}</div>
      </div>
      <span class="chip chip-neutral font-mono text-xs">${tool.req}</span>
    </div>
  `).join('');
}

function selectCommandTool(toolName) {
  closeCommandPalette();
  runSimulatedTool(toolName);
}

// Close menus and modals when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menubar-item')) {
    closeAllMenus();
  }
  if (e.target.classList && (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop'))) {
    closePropertiesModal();
    closeInsertModal();
    closeLLMSettingsModal();
    closeImportModal();
    closeToolInfoModal();
    closeAuditModal();
    closeCommandPalette();
  }
});

// Keyboard Shortcuts Listener
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openCommandPalette();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
    e.preventDefault();
    openPropertiesModal();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    showToast(t('m_save') + ' : ' + t('case_id'));
  } else if (e.key === 'Escape') {
    closeAllMenus();
    closeCommandPalette();
    closeAuditModal();
    closePropertiesModal();
    closeInsertModal();
    closeLLMSettingsModal();
    closeImportModal();
    closeToolInfoModal();
  }
});

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
  setScreen(2);
});

// ============================================================================
// 100-NODE FORENSIC GRAPH CONTROLLER FOR ATHAR DZ (CASE #2026-SCAM-089)
// ============================================================================

let graph100State = {
  selectedNodeId: 'suspect_boss_tarek',
  searchQuery: '',
  activeBranch: 'all', // all | pneus | visas | electro | audio | finance
  layerFilters: {
    1: true, // Preuves & Victimes
    2: true, // OSINT Brut
    3: true, // Infrastructure & Code
    4: true  // Réseau Criminel
  }
};

function init100NodeCanvas() {
  const container = document.getElementById('canvas-svg-container');
  if (!container || !window.CASE_CANDY_WHEELS) return;

  const graph = window.CASE_CANDY_WHEELS.graph_representation;
  if (!graph || !graph.nodes) return;

  // Build the Filter Toolbar Header
  const filterToolbarHtml = `
    <div class="graph-100-toolbar" style="position:sticky;top:0;left:0;right:0;z-index:30;background:rgba(15,23,42,0.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--border-color);padding:0.45rem 0.8rem;display:flex;align-items:center;justify-content:space-between;gap:0.6rem;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <span class="chip chip-warning font-mono" id="graph-node-counter" style="font-weight:700;">100 / 100 Nœuds Visibles</span>
        <div class="btn-group" role="group" aria-label="Filtres Calques">
          <button class="btn btn-sm btn-layer-1" id="btn-layer-1" onclick="toggleLayer100(1)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(16,185,129,0.15);color:#10b981;border:1px solid #10b981;">✓ Calque 1 : Preuves (25)</button>
          <button class="btn btn-sm btn-layer-2" id="btn-layer-2" onclick="toggleLayer100(2)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid #38bdf8;">✓ Calque 2 : OSINT (30)</button>
          <button class="btn btn-sm btn-layer-3" id="btn-layer-3" onclick="toggleLayer100(3)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(148,163,184,0.15);color:#cbd5e1;border:1px solid #64748b;">✓ Calque 3 : Infra (25)</button>
          <button class="btn btn-sm btn-layer-4" id="btn-layer-4" onclick="toggleLayer100(4)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid #a855f7;">✓ Calque 4 : Réseau (20)</button>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <div style="display:flex;gap:0.25rem;">
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('all')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">Tous</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('pneus')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🚗 Pneus</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('visas')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🇪🇺 Visas</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('electro')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">📱 Électro</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('audio')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🎙️ Vocaux</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('finance')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🪙 Finances</button>
        </div>
        <input type="text" id="graph-search-100" placeholder="🔍 Filtrer les 100 nœuds..." oninput="handleSearch100(this.value)" style="background:#0f172a;border:1px solid var(--border-color);color:#f8fafc;padding:0.25rem 0.55rem;border-radius:4px;font-size:0.74rem;width:170px;" />
      </div>
    </div>
  `;

  // Render SVG Canvas wrapper
  let svgContent = `<svg id="svg-edges-100" class="canvas-edges-layer" style="min-width:2350px;min-height:2000px;position:absolute;top:0;left:0;pointer-events:none;z-index:5;" aria-hidden="true">`;
  
  // Build lookup map for coordinates
  const nodeMap = {};
  graph.nodes.forEach(n => { nodeMap[n.id] = n; });

  // Render Lines
  graph.edges.forEach(e => {
    const fromN = nodeMap[e.from];
    const toN = nodeMap[e.to];
    if (fromN && toN) {
      const x1 = fromN.x + 115;
      const y1 = fromN.y + 40;
      const x2 = toN.x + 115;
      const y2 = toN.y + 40;
      const isDashed = (fromN.layer === 4 || toN.layer === 4) ? 'stroke-dasharray="4,4"' : '';
      const color = fromN.layer === 1 ? '#10b981' : fromN.layer === 2 ? '#38bdf8' : fromN.layer === 3 ? '#64748b' : '#a855f7';
      svgContent += `<line id="edge-${e.from}-${e.to}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.6" opacity="0.45" ${isDashed} class="edge-line-100" data-from="${e.from}" data-to="${e.to}" />`;
    }
  });
  svgContent += `</svg>`;

  // Render 100 Node Cards
  let nodesHtml = `<div id="nodes-layer-100" style="position:relative;min-width:2350px;min-height:2000px;z-index:10;padding-top:40px;">`;
  
  graph.nodes.forEach(n => {
    const layerClass = n.layer === 1 ? 'layer-1' : n.layer === 2 ? 'layer-2' : n.layer === 3 ? 'layer-3' : 'layer-4';
    const chipColor = n.layer === 1 ? 'chip-emerald' : n.layer === 2 ? 'chip-cyan' : n.layer === 3 ? 'chip-neutral' : 'chip-purple';
    const layerName = n.layer === 1 ? 'Preuve Scellée' : n.layer === 2 ? 'OSINT' : n.layer === 3 ? 'Infra/Code' : 'Hypothèse';
    
    nodesHtml += `
      <div class="canvas-node-card ${layerClass} node-card-100"
           id="node-100-${n.id}"
           data-id="${n.id}"
           data-layer="${n.layer}"
           data-label="${n.label.toLowerCase()}"
           data-subtitle="${n.subtitle.toLowerCase()}"
           style="position:absolute;left:${n.x}px;top:${n.y + 45}px;width:230px;cursor:pointer;transition:transform 0.15s, box-shadow 0.15s;"
           onclick="select100Node('${n.id}')">
        <div class="node-header-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
          <span class="node-type-label" style="font-size:0.7rem;display:flex;align-items:center;gap:0.3rem;">
            <span>${n.icon}</span> <span>${n.type}</span>
          </span>
          <span class="chip ${chipColor} text-xs font-mono" style="padding:1px 4px;font-size:0.65rem;">${layerName}</span>
        </div>
        <div class="node-title-text" style="font-weight:700;font-size:0.78rem;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${n.label}
        </div>
        <div class="node-subtitle-text" style="font-size:0.68rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">
          ${n.subtitle}
        </div>
      </div>
    `;
  });
  nodesHtml += `</div>`;

  container.innerHTML = filterToolbarHtml + svgContent + nodesHtml;

  // Auto-select Kingpin Boss by default
  select100Node('suspect_boss_tarek');
}

function select100Node(nid) {
  graph100State.selectedNodeId = nid;

  // Highlight selected node
  document.querySelectorAll('.node-card-100').forEach(c => {
    const isSelected = c.getAttribute('data-id') === nid;
    c.classList.toggle('selected', isSelected);
    c.style.borderColor = isSelected ? '#f59e0b' : '';
    c.style.transform = isSelected ? 'scale(1.04)' : 'scale(1)';
    c.style.zIndex = isSelected ? '25' : '10';
  });

  // Highlight connected edges
  document.querySelectorAll('.edge-line-100').forEach(l => {
    const from = l.getAttribute('data-from');
    const to = l.getAttribute('data-to');
    if (from === nid || to === nid) {
      l.setAttribute('stroke-width', '3.2');
      l.setAttribute('opacity', '1');
      l.setAttribute('stroke', '#f59e0b');
    } else {
      l.setAttribute('stroke-width', '1.4');
      l.setAttribute('opacity', '0.25');
    }
  });

  render100Inspector(nid);
}

function render100Inspector(nid) {
  const container = document.getElementById('inspector-content-pane') || document.getElementById('inspector-content-container');
  if (!container || !window.CASE_CANDY_WHEELS) return;

  const graph = window.CASE_CANDY_WHEELS.graph_representation;
  const node = graph.nodes.find(n => n.id === nid);
  if (!node) return;

  const layerBadge = node.layer === 1 
    ? '<span class="chip chip-emerald">Calque 1 • Preuve Scellée RFC 3161</span>' 
    : node.layer === 2 
    ? '<span class="chip chip-cyan">Calque 2 • Découverte OSINT Brute</span>' 
    : node.layer === 3 
    ? '<span class="chip chip-neutral">Calque 3 • Infrastructure & Télécoms</span>' 
    : '<span class="chip chip-danger">Calque 4 • Hypothèse Judiciaire</span>';

  let metaRows = '';
  Object.entries(node.meta).forEach(([k, v]) => {
    metaRows += `<div class="meta-row"><span class="meta-key">${k} :</span><span class="meta-val font-mono">${v}</span></div>`;
  });

  // Action buttons tailored to entity type
  let actionButtonsHtml = '';
  if (node.type === 'AUDIO_RECORDING') {
    actionButtonsHtml = `
      <div style="background:rgba(16,185,129,0.1);border:1px solid #10b981;border-radius:6px;padding:0.6rem;margin-top:0.6rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.3rem;">
          <span style="font-size:0.74rem;font-weight:700;color:#10b981;">▶ Lecteur Forensique Audio Darija</span>
          <span class="font-mono text-xs">Biométrie: 96%</span>
        </div>
        <div style="font-size:0.72rem;color:#cbd5e1;font-style:italic;margin-bottom:0.4rem;">
          "Khouya Karim, salam alaykoum. Les 4 pneus Michelin rahoum réservés..."
        </div>
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Lecture en cours de la note vocale scellée...')">
          🔊 Réécouter l'Enregistrement Original
        </button>
      </div>
    `;
  } else if (node.type === 'KINGPIN' || node.type === 'LIEUTENANT') {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;display:flex;flex-direction:column;gap:0.35rem;">
        <button class="btn btn-primary btn-sm w-full" onclick="showToast('Mandat d\\'arrêt international généré pour le parquet')">
          ⚖️ Délivrer Mandat d'Arrêt & Dépôt
        </button>
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Réquisition transmise à Binance et Cellule FIU')">
          🪙 Ordonner Gel Compte & Portefeuille USDT
        </button>
      </div>
    `;
  } else if (node.type === 'BANK_ACCOUNT' || node.type === 'MULE') {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;">
        <button class="btn btn-primary btn-sm w-full" onclick="showToast('Réquisition transmise à Algérie Poste BaridiMob')">
          🚫 Bloquer Compte BaridiMob & Saisie Solde
        </button>
      </div>
    `;
  } else if (node.type === 'MALWARE_APK' || node.type === 'CODE_REPO') {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;">
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Décompilation binaire & rapport de signatures extrait')">
          🔍 Inspecter Code Décompilé (JADX-GUI)
        </button>
      </div>
    `;
  } else {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;">
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Entité versée au registre des scellés')">
          🔒 Figer et Certifier l'Empreinte (SHA-256)
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-card candidate-hypothesis-card" style="padding:0.75rem;">
      <div class="candidate-header" style="margin-bottom:0.5rem;">
        <span class="hypothesis-badge">${node.icon} ${node.type}</span>
        ${layerBadge}
      </div>
      <h3 style="font-size:0.95rem;font-weight:800;color:#f8fafc;margin:0 0 0.2rem 0;">${node.label}</h3>
      <p style="font-size:0.75rem;color:#94a3b8;margin:0 0 0.6rem 0;">${node.subtitle}</p>
      
      <div class="metadata-table">
        <div class="meta-row"><span class="meta-key">Identifiant Nœud :</span><span class="meta-val font-mono">${node.id}</span></div>
        <div class="meta-row"><span class="meta-key">Position Canvas :</span><span class="meta-val font-mono">X: ${node.x}px • Y: ${node.y}px</span></div>
        ${metaRows}
      </div>

      ${actionButtonsHtml}
    </div>
  `;
}

function toggleLayer100(layerNum) {
  graph100State.layerFilters[layerNum] = !graph100State.layerFilters[layerNum];
  const btn = document.getElementById(`btn-layer-${layerNum}`);
  if (btn) {
    btn.style.opacity = graph100State.layerFilters[layerNum] ? '1' : '0.4';
  }
  applyFilters100();
}

function setBranch100(branch) {
  graph100State.activeBranch = branch;
  applyFilters100();
  showToast(`Filtre activé : ${branch.toUpperCase()}`);
}

function handleSearch100(val) {
  graph100State.searchQuery = (val || '').toLowerCase().trim();
  applyFilters100();
}

function applyFilters100() {
  let visibleCount = 0;
  const q = graph100State.searchQuery;
  const br = graph100State.activeBranch;

  document.querySelectorAll('.node-card-100').forEach(c => {
    const l = parseInt(c.getAttribute('data-layer'), 10);
    const lbl = c.getAttribute('data-label') || '';
    const sub = c.getAttribute('data-subtitle') || '';
    const nid = c.getAttribute('data-id') || '';

    // Layer check
    let passLayer = graph100State.layerFilters[l];

    // Branch check
    let passBranch = true;
    if (br === 'pneus') passBranch = lbl.includes('pneu') || sub.includes('pneu') || nid.includes('pneu') || nid.includes('amine') || nid.includes('youcef');
    else if (br === 'visas') passBranch = lbl.includes('visa') || sub.includes('visa') || nid.includes('visa') || nid.includes('nadia') || nid.includes('tls');
    else if (br === 'electro') passBranch = lbl.includes('electro') || lbl.includes('tv') || lbl.includes('iphone') || nid.includes('farid') || nid.includes('gold');
    else if (br === 'audio') passBranch = nid.includes('audio') || lbl.includes('vocal');
    else if (br === 'finance') passBranch = nid.includes('rip') || nid.includes('baridimob') || nid.includes('wallet') || nid.includes('binance') || nid.includes('cashier');

    // Search query check
    let passQuery = true;
    if (q) {
      passQuery = lbl.includes(q) || sub.includes(q) || nid.includes(q);
    }

    const show = passLayer && passBranch && passQuery;
    c.style.display = show ? 'block' : 'none';
    if (show) visibleCount++;
  });

  // Update edges visibility
  document.querySelectorAll('.edge-line-100').forEach(l => {
    const from = l.getAttribute('data-from');
    const to = l.getAttribute('data-to');
    const fromEl = document.getElementById(`node-100-${from}`);
    const toEl = document.getElementById(`node-100-${to}`);
    const showEdge = fromEl && toEl && fromEl.style.display !== 'none' && toEl.style.display !== 'none';
    l.style.display = showEdge ? 'block' : 'none';
  });

  const counterEl = document.getElementById('graph-node-counter');
  if (counterEl) {
    counterEl.textContent = `${visibleCount} / 100 Nœuds Visibles`;
  }
}

// Hook into maquette screen switcher
const originalSetScreen = window.setScreen;
window.setScreen = function(num) {
  if (typeof originalSetScreen === 'function') {
    originalSetScreen(num);
  }
  if (num === 2) {
    setTimeout(init100NodeCanvas, 50);
  }
};

// Also trigger on load if screen 2 is active
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    init100NodeCanvas();
  }, 120);
});
