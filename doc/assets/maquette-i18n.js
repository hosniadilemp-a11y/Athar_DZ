/**
 * Athar DZ (أثر) — Forensic OSINT & Judicial Investigation Studio
 * Multilingual Engine & Forensic Workspace Controller.
 * Conforms to SPECIFICATION.md, WCAG 2.2 AA, and .agent/ui-ux-rules.md.
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
    "btn_show_catalog": "Ouvrir l'Arsenal Complet (76 Outils) ↗",
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
    "cmd_title": "Palette de Commandes (76 Outils Forensiques)",
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
  ,
    "nav_spec_link": "Spécifications (8 Chap.)",
    "node_lbl_post": "Annonce FB",
    "node_lbl_page": "Page FB",
    "node_lbl_phone": "Téléphone",
    "node_lbl_url": "URL Boutique",
    "node_lbl_mongoid": "MongoDB ID",
    "node_lbl_pixel": "Meta Pixel",
    "node_lbl_telegram": "Telegram",
    "node_lbl_suspect": "Sujet Candidat",
    "badge_verified": "Vérifié",
    "badge_infra": "Infra",
    "badge_hypothesis": "Hypothèse",
    "node_post_title": "Post Marketplace #98124",
    "node_post_sub": "Liquidation 4 Pneus Michelin",
    "node_page_sub": "Admin: Algérie • 2.4k j'aime",
    "node_phone_sub": "Ooredoo DZ • Actif",
    "node_pixel_sub": "2 sites jumeaux détectés",
    "node_suspect_sub": "Biométrie ArcFace (92%) • CDR Ooredoo",
    "case_overview_title": "Dossier & Registre d'Enquête",
    "inbox_pending_title": "Boîte d'Arbitrage des Indices",
    "btn_add_graph": "Ajouter au Graphe",
    "btn_dismiss": "Écarter",
    "th_evidence_num": "Pièce N°",
    "th_evidence_name": "Désignation de la Preuve",
    "th_evidence_brick": "Brique / Source OSINT",
    "th_evidence_hash": "Empreinte SHA-256 Certifiée",
    "th_evidence_status": "Statut Légal",
    "report_narrative_text": "Le présent rapport consolide la chaîne de garde cryptographique, les recoupements techniques d'infrastructures, les correspondances biométriques et les réquisitions judiciaires aux opérateurs télécoms (Mobilis, Ooredoo, Djezzy) et à Meta Platforms Inc.",
    "tools_arsenal_count_badge": "76 Outils Forensiques",
    "tools_arsenal_btn": "Ouvrir l'Arsenal Complet (76 Outils) ↗"
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
    "btn_show_catalog": "فتح المستودع الكامل (76 أداة) ↗",
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
    "cmd_title": "لوحة الأوامر والأدوات الجنائية (76 أداة)",
    "cmd_placeholder": "اكتب اسم الأداة أو فئتها أو نوع الدليل المطلوب...",
    "cmd_shortcuts_hint": "↑↓ للتنقل • إدخال للتنفيذ • هروب للإغلاق",
    "catalog_title": "كتالوج الأدوات الجنائية المفتوحة المصدر (76 أداة)",
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
  ,
    "nav_spec_link": "المواصفات (8 فصول)",
    "node_lbl_post": "إعلان فيسبوك",
    "node_lbl_page": "صفحة فيسبوك",
    "node_lbl_phone": "هاتف",
    "node_lbl_url": "رابط المتجر",
    "node_lbl_mongoid": "معرّف MongoDB",
    "node_lbl_pixel": "بيكسل ميتا",
    "node_lbl_telegram": "تيليغرام",
    "node_lbl_suspect": "المشتبه به المرشح",
    "badge_verified": "محقّق",
    "badge_infra": "بنية تحتية",
    "badge_hypothesis": "فرضية",
    "node_post_title": "منشور المتجر #98124",
    "node_post_sub": "تصفية 4 إطارات ميشلان",
    "node_page_sub": "المسؤول: الجزائر • 2.4 ألف إعجاب",
    "node_phone_sub": "أوريدو الجزائر • نشط",
    "node_pixel_sub": "اكتشاف موقعين متطابقين",
    "node_suspect_sub": "بيومترية ArcFace (92%) • سجلات أوريدو",
    "case_overview_title": "ملف القضية وسجل التحقيق",
    "inbox_pending_title": "صندوق تحكيم الأدلة",
    "btn_add_graph": "إضافة إلى الرسم",
    "btn_dismiss": "استبعاد",
    "th_evidence_num": "رقم الدليل",
    "th_evidence_name": "وصف الدليل",
    "th_evidence_brick": "أداة / مصدر OSINT",
    "th_evidence_hash": "بصمة SHA-256 المعتمدة",
    "th_evidence_status": "الوضع القانوني",
    "report_narrative_text": "يوثق هذا التقرير سلسلة الحراسة المشفرة، والتقاطعات التقنية للبنية التحتية، والمطابقات البيومترية والأذونات القضائية الموجهة لمتعاملي الهاتف.",
    "tools_arsenal_count_badge": "76 أداة جنائية",
    "tools_arsenal_btn": "فتح الترسانة الكاملة (76 أداة) ↗"
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
    "btn_insert_confirm": "Insert Evidence into Case",
    "nav_spec_link": "Architecture Specification",
    "node_lbl_post": "Marketplace Listing",
    "node_lbl_page": "Social Media Page",
    "node_lbl_phone": "Telephone Number",
    "node_lbl_url": "Shop URL",
    "node_lbl_mongoid": "MongoDB ObjectId",
    "node_lbl_pixel": "Meta Pixel Tracker",
    "node_lbl_telegram": "Telegram Account",
    "node_lbl_suspect": "Candidate Subject",
    "badge_verified": "Verified Evidence",
    "badge_infra": "Technical Infra",
    "badge_hypothesis": "Hypothesis",
    "node_post_title": "Marketplace Post #98124",
    "node_post_sub": "Clearance 4 Michelin Tyres",
    "node_page_sub": "Admin: Algeria • 2.4k likes",
    "node_phone_sub": "Ooredoo DZ • Active",
    "node_pixel_sub": "2 twin sites detected",
    "node_suspect_sub": "ArcFace Biometrics (92%) • Ooredoo CDR",
    "case_overview_title": "Investigation Case & Ledger",
    "inbox_pending_title": "Clue Arbitration Inbox",
    "btn_add_graph": "Add to Graph",
    "btn_dismiss": "Dismiss",
    "th_evidence_num": "Piece No.",
    "th_evidence_name": "Evidence Designation",
    "th_evidence_brick": "OSINT Tool / Source",
    "th_evidence_hash": "Certified SHA-256 Hash",
    "th_evidence_status": "Legal Status",
    "report_narrative_text": "This report consolidates cryptographic chain of custody, infrastructure technical correlation, biometric matches, and judicial requisitions to telecom operators (Mobilis, Ooredoo, Djezzy) and Meta Platforms Inc.",
    "tools_arsenal_count_badge": "76 Forensic Tools",
    "tools_arsenal_btn": "Open Complete Arsenal (76 Tools) ↗"
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

// ============================================================================
// ATHAR DZ (أثر) — FORENSIC WORKSPACE CONTROLLER
// Complies with SPECIFICATION.md, WCAG 2.2 AA, and .agent/ui-ux-rules.md
// ============================================================================

const ATHAR_CASE_NODES = {
  'node-post': {
    id: 'node-post',
    icon: 'file-text',
    type: 'SocialPost',
    typeLabel: 'Annonce Réseau Social',
    label: 'Post Marketplace #98124',
    subtitle: 'Liquidation 4 Pneus Michelin',
    layer: 1,
    layerName: 'Preuves Scellées (RFC 3161)',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2026-11-01 10:15 UTC',
    confidence: '100% (Preuve Verrouillée WORM)',
    method: 'Capture DOM certifiée ArchiveBox ISO 28500 WARC',
    metadata: {
      'Plateforme': 'Facebook Marketplace & Annonces DZ',
      'Auteur Annonce': 'fb.com/pneus.promo.dz',
      'Contenu Texte': 'Liquidation stock Michelin 205/55R16 - Virement BaridiMob avant expédition',
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/fb_post_98124.warc'
    },
    suggestedTools: ['tool_whois_dns', 'tool_meta_ad_transparency', 'tool_ioc_extractor']
  },
  'node-page': {
    id: 'node-page',
    icon: 'globe',
    type: 'SocialPage',
    typeLabel: 'Page Réseau Social',
    label: 'fb.com/pneus.promo.dz',
    subtitle: "Admin: Algérie • 2.4k j'aime",
    layer: 1,
    layerName: 'Preuves Scellées (RFC 3161)',
    hash: '7d8b2e1a3f5c904e6b12876543210fedcba9876543210fedcba9876543210fed',
    timestamp: '2026-11-01 10:18 UTC',
    confidence: '100% (Identifiant Page Meta Scellé)',
    method: 'Enregistrement de transparence de page et historique des publicités',
    metadata: {
      'Nom Affiché': 'Pneus Promo Algérie - Livraison 58 Wilayas',
      'Date Création': 'Octobre 2026 (Profil Récent)',
      'Gestionnaires': '1 Administrateur localisé en Algérie (Wilaya d\'Alger)',
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/meta_transparency.json'
    },
    suggestedTools: ['tool_meta_ad_transparency', 'tool_meta_pixel', 'tool_social_mapper']
  },
  'node-phone': {
    id: 'node-phone',
    icon: 'phone',
    type: 'PhoneNumber',
    typeLabel: 'Numéro Téléphonique',
    label: '+213 555 019 283',
    subtitle: 'Ooredoo DZ • Actif',
    layer: 2,
    layerName: 'Découvertes OSINT (OSINT_RAW)',
    hash: '3f7a1b5c904e6b12876543210fedcba9876543210fedcba9876543210fedcba9',
    timestamp: '2026-11-01 10:20 UTC',
    confidence: '98% (Format E.164 Valide)',
    method: 'Regex IOC & Parsing HLR opérateur Ooredoo',
    metadata: {
      'Opérateur Télécom': 'Ooredoo Algérie (Wataniya Télécom)',
      'Format International': '+213 555 019 283 (E.164)',
      'Statut Ligne': 'Actif • SMS & Messagerie instantanée',
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/ioc_phone_extract.json'
    },
    suggestedTools: ['tool_whatsapp_inspector', 'tool_telegram_resolver', 'tool_holehe_email']
  },
  'node-url': {
    id: 'node-url',
    icon: 'globe',
    type: 'DomainName',
    typeLabel: 'Nom de Domaine / URL',
    label: 'promo-pneus-express.shop',
    subtitle: 'IP: 185.199.108.153',
    layer: 2,
    layerName: 'Découvertes OSINT (OSINT_RAW)',
    hash: '8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    timestamp: '2026-11-01 10:22 UTC',
    confidence: '95% (Hébergement Actif)',
    method: 'Résolution DNS passive et certificat TLS Let\'s Encrypt',
    metadata: {
      'Registrar': 'Namecheap Inc.',
      'Adresse IP': '185.199.108.153 (ASN 13335 Cloudflare CDN)',
      'Certificat SSL': "Let's Encrypt R3 (Émis 28 Oct 2026)",
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/dns_whois_snap.json'
    },
    suggestedTools: ['tool_whois_dns', 'tool_shodan_censys', 'tool_meta_pixel']
  },
  'node-mongoid': {
    id: 'node-mongoid',
    icon: 'database',
    type: 'DatabaseId',
    typeLabel: 'Identifiant BSON MongoDB',
    label: '672f9a10c8b4a100...',
    subtitle: 'UTC: 01 Nov 2026 14:22',
    layer: 3,
    layerName: 'Infrastructure & Pivots (INFRA)',
    hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: '2026-11-01 14:22 UTC',
    confidence: '100% (Décodage Déterministe)',
    method: 'Décodage des 4 premiers octets UNIX epoch de l\'ObjectId',
    metadata: {
      'Identifiant Complet': '672f9a10c8b4a100129b4412',
      'Horodatage Epoch Extrait': '1731164688 -> 2026-11-01 14:22:40 UTC',
      'Machine Hash': 'c8b4a1',
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/mongo_id_analysis.json'
    },
    suggestedTools: ['tool_mongodb_decoder', 'tool_ioc_extractor', 'tool_shodan_censys']
  },
  'node-pixel': {
    id: 'node-pixel',
    icon: 'layers',
    type: 'TrackerId',
    typeLabel: 'Identifiant Meta Pixel',
    label: 'Pixel #88419203314',
    subtitle: '2 sites jumeaux détectés',
    layer: 3,
    layerName: 'Infrastructure & Pivots (INFRA)',
    hash: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    timestamp: '2026-11-01 14:30 UTC',
    confidence: '99% (Code Source Extrait)',
    method: 'Recherche inversée d\'identifiant de tracking sur PublicWWW',
    metadata: {
      'Identifiant Tracker': 'fbq(\'init\', \'88419203314\')',
      'Sites Partageant ce Pixel': 'promo-pneus-express.shop, discount-auto-alger.dz',
      'Compte Meta Business Lié': 'BM #49102914102',
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/pixel_pivot.json'
    },
    suggestedTools: ['tool_meta_pixel', 'tool_google_analytics', 'tool_whois_dns']
  },
  'node-telegram': {
    id: 'node-telegram',
    icon: 'terminal',
    type: 'MessagingAccount',
    typeLabel: 'Compte Telegram',
    label: '@amine_import',
    subtitle: 'User ID: 519283741',
    layer: 2,
    layerName: 'Découvertes OSINT (OSINT_RAW)',
    hash: '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    timestamp: '2026-11-01 15:10 UTC',
    confidence: '92% (Profil Public Accessible)',
    method: 'Résolution API MTProto via compte pivot d\'enquête',
    metadata: {
      'Pseudonyme': '@amine_import',
      'ID Utilisateur Numérique': '519283741',
      'Prénom Affiché': 'Amine',
      'Bio Publique': 'Import-Export pneumatiques gros et détail • Alger Bab Ezzouar',
      'Emplacement WORM': 's3://aegis-evidence/2026-SCAM-089/tg_profile_519283741.json'
    },
    suggestedTools: ['tool_telegram_resolver', 'tool_whatsapp_inspector', 'tool_social_mapper']
  },
  'node-suspect': {
    id: 'node-suspect',
    icon: 'user',
    type: 'CandidateSuspect',
    typeLabel: 'Sujet Candidat (Identité Physique)',
    label: 'Amine B. (31 ans)',
    subtitle: 'Biométrie ArcFace (92%) • CDR Ooredoo',
    layer: 4,
    layerName: 'Hypothèses & Déductions (HYPOTHESIS)',
    hash: '555544443333222211110000aaaabbbbccccddddeeeeffff0000111122223333',
    timestamp: '2026-11-01 16:45 UTC',
    confidence: 'Score IA : 92% (Hypothèse non certifiée)',
    method: 'Vecteur facial ArcFace 512-d (distance cosinus 0.18) sur avatar WhatsApp recoupé avec fiche abonné Ooredoo',
    metadata: {
      'Nom Présumé': 'Amine B.',
      'Âge Estimé': '31 ans',
      'Wilaya de Résidence': 'Alger (Bab Ezzouar)',
      'Preuve Scientifique': 'Correspondance biométrique faciale 92% confirmée par réquisition opérateur Ooredoo',
      'Statut Judiciaire': 'En attente de validation et signature OPJ (Art. 68 CPP)'
    },
    suggestedTools: ['tool_whatsapp_inspector', 'tool_sna_betweenness', 'tool_dehashed_breach']
  }
};

const ATHAR_INBOX_CLUES = [
  {
    id: 'inbox-1',
    sourceTool: 'brick.socmint.ioc_extractor',
    time: '10:18 UTC',
    title: '+213 555 019 283 (Numéro E.164)',
    details: 'Détecté dans le corps de l\'annonce FB #98124. Confiance: 98%',
    type: 'PhoneNumber',
    added: false
  },
  {
    id: 'inbox-2',
    sourceTool: 'brick.web.dom_db_id_extractor',
    time: '10:20 UTC',
    title: '672f9a10c8b4a100129b4412',
    details: 'MongoDB ObjectId extrait des scripts de promo-pneus-express.shop',
    type: 'DatabaseId',
    added: false
  },
  {
    id: 'inbox-3',
    sourceTool: 'brick.web.meta_pixel',
    time: '10:25 UTC',
    title: 'Pixel #88419203314 (Tracker Meta)',
    details: 'Partagé entre promo-pneus-express.shop et discount-auto-alger.dz',
    type: 'TrackerId',
    added: false
  }
];

let appState = {
  lang: 'fr',
  mode: 'analyze',
  stealth: true,
  theme: 'dark',
  activeCanvasView: 'graph',
  activeScreen: 2,
  selectedNodeId: 'node-suspect',
  menubarActive: false,
  openMenuId: null,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  activeLayerFilter: 'all',
  activeTypeFilter: 'all',
  propertiesModalOpen: false,
  insertModalOpen: false,
  llmModalOpen: false,
  importModalOpen: false,
  commandPaletteOpen: false,
  auditModalOpen: false,
  toolInfoModalOpen: false,
  activeModalToolId: null
};

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
    'user': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'phone': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'globe': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    'database': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    'folder': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
    'chevron-down': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polyline points="6 9 12 15 18 9"/></svg>`
  };
  return icons[name] || icons['shield'];
}

function t(key) {
  const lang = appState.lang;
  if (I18N_TRANSLATIONS[lang] && I18N_TRANSLATIONS[lang][key]) {
    return I18N_TRANSLATIONS[lang][key];
  }
  return (I18N_TRANSLATIONS['fr'] && I18N_TRANSLATIONS['fr'][key]) ? I18N_TRANSLATIONS['fr'][key] : key;
}

function setLanguage(lang) {
  if (!['fr', 'ar', 'en'].includes(lang)) return;
  appState.lang = lang;
  const root = document.getElementById('app-root');
  if (root) {
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
  applyI18n();
  showToast(lang === 'ar' ? 'تم تفعيل اللغة العربية' : lang === 'en' ? 'Switched to English' : 'Langue : Français');
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.hasAttribute('placeholder')) el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });
  if (appState.selectedNodeId) {
    renderNodeInspector(appState.selectedNodeId);
  } else {
    renderEmptyRightPanel();
  }
}

function setAppMode(mode) {
  if (!['collect', 'analyze', 'report'].includes(mode)) return;
  appState.mode = mode;
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
  });
  if (mode === 'report') {
    setScreen(5);
  } else if (mode === 'collect') {
    setScreen(3);
  } else {
    setScreen(2);
  }
}

function setCanvasView(view) {
  if (!['graph', 'timeline', 'map'].includes(view)) return;
  appState.activeCanvasView = view;
  document.querySelectorAll('.canvas-segmented-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    btn.setAttribute('aria-selected', btn.getAttribute('data-view') === view ? 'true' : 'false');
  });
  if (view === 'graph') {
    setScreen(2);
  } else {
    setScreen(4);
  }
}

function setScreen(num) {
  appState.activeScreen = num;
  document.querySelectorAll('.screen-view-pane').forEach(p => p.classList.add('is-hidden'));
  document.querySelectorAll('.screen-pill-btn').forEach(b => b.classList.remove('active'));

  const paneMap = {
    1: 'view-overview',
    2: 'view-graph-canvas',
    3: 'view-inbox-review',
    4: 'view-timeline-map',
    5: 'view-report-export'
  };

  const targetPane = document.getElementById(paneMap[num]);
  if (targetPane) targetPane.classList.remove('is-hidden');

  const targetBtn = document.querySelector(`.screen-pill-btn[data-screen="${num}"]`);
  if (targetBtn) targetBtn.classList.add('active');

  if (num === 2) {
    if (appState.selectedNodeId) {
      renderNodeInspector(appState.selectedNodeId);
    } else {
      renderEmptyRightPanel();
    }
  }
}

function toggleStealth() {
  appState.stealth = !appState.stealth;
  const badge = document.getElementById('stealth-warning-badge');
  if (badge) {
    badge.style.display = appState.stealth ? 'none' : 'inline-flex';
  }
  showToast(appState.stealth ? t('stealth_active') : t('stealth_warning'));
}

function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  const html = document.getElementById('app-root');
  if (html) html.setAttribute('data-theme', appState.theme);
  showToast(appState.theme === 'dark' ? 'Thème Sombre Activé' : "Thème Clair Activé (Mode Salle d'Audience)");
}

// ============================================================================
// MENUBAR CONTROLLER (Native Desktop Paradigm with Hover Switching & Keyboard Nav)
// ============================================================================

function toggleMenu(menuId) {
  const dropdown = document.getElementById(menuId);
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('is-open');

  if (isOpen) {
    closeAllMenus();
  } else {
    openMenu(menuId);
  }
}

function openMenu(menuId) {
  closeAllMenus();
  const dropdown = document.getElementById(menuId);
  if (!dropdown) return;

  dropdown.classList.add('is-open');
  appState.openMenuId = menuId;
  appState.menubarActive = true;

  const btn = document.getElementById(`btn-${menuId}`);
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function closeAllMenus() {
  document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('is-open'));
  document.querySelectorAll('.menubar-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-expanded', 'false');
  });
  appState.openMenuId = null;
  appState.menubarActive = false;
}

function initMenubarEvents() {
  const menubarItems = document.querySelectorAll('.menubar-item');
  const menubarButtons = Array.from(document.querySelectorAll('.menubar-btn'));

  menubarItems.forEach((item, index) => {
    const btn = item.querySelector('.menubar-btn');
    const dropdown = item.querySelector('.menu-dropdown');
    if (!btn || !dropdown) return;

    // Hover-switch when menubar is active
    btn.addEventListener('mouseenter', () => {
      if (appState.menubarActive && appState.openMenuId !== dropdown.id) {
        openMenu(dropdown.id);
      }
    });

    // Menubar button keyboard navigation
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (index + 1) % menubarButtons.length;
        const nextBtn = menubarButtons[nextIndex];
        nextBtn.focus();
        if (appState.menubarActive) {
          const nextDropdown = nextBtn.closest('.menubar-item').querySelector('.menu-dropdown');
          if (nextDropdown) openMenu(nextDropdown.id);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (index - 1 + menubarButtons.length) % menubarButtons.length;
        const prevBtn = menubarButtons[prevIndex];
        prevBtn.focus();
        if (appState.menubarActive) {
          const prevDropdown = prevBtn.closest('.menubar-item').querySelector('.menu-dropdown');
          if (prevDropdown) openMenu(prevDropdown.id);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu(dropdown.id);
        const firstItem = dropdown.querySelector('.menu-dropdown-item');
        if (firstItem) firstItem.focus();
      } else if (e.key === 'Escape') {
        closeAllMenus();
      }
    });

    // Dropdown items keyboard navigation
    const items = Array.from(dropdown.querySelectorAll('.menu-dropdown-item'));
    items.forEach((menuItem, itemIdx) => {
      menuItem.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items[(itemIdx + 1) % items.length];
          if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (itemIdx === 0) {
            btn.focus();
          } else {
            items[itemIdx - 1].focus();
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % menubarButtons.length;
          const nextBtn = menubarButtons[nextIndex];
          const nextDropdown = nextBtn.closest('.menubar-item').querySelector('.menu-dropdown');
          if (nextDropdown) {
            openMenu(nextDropdown.id);
            const first = nextDropdown.querySelector('.menu-dropdown-item');
            if (first) first.focus();
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + menubarButtons.length) % menubarButtons.length;
          const prevBtn = menubarButtons[prevIndex];
          const prevDropdown = prevBtn.closest('.menubar-item').querySelector('.menu-dropdown');
          if (prevDropdown) {
            openMenu(prevDropdown.id);
            const first = prevDropdown.querySelector('.menu-dropdown-item');
            if (first) first.focus();
          }
        } else if (e.key === 'Escape') {
          closeAllMenus();
          btn.focus();
        }
      });
    });
  });
}

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

// ============================================================================
// CONTEXT-DRIVEN RIGHT PANEL CONTROLLER
// No selection = Case Overview + Inbox. Node selected = Inspector + Suggested Tools.
// ============================================================================

function selectNode(nodeId) {
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.canvas-node-circle, .canvas-node-card').forEach(c => {
    c.classList.toggle('selected', c.id === nodeId);
  });
  renderNodeInspector(nodeId);
}

function clearSelection() {
  appState.selectedNodeId = null;
  document.querySelectorAll('.canvas-node-circle, .canvas-node-card').forEach(c => {
    c.classList.remove('selected');
  });
  renderEmptyRightPanel();
}

function renderNodeInspector(nodeId) {
  const node = ATHAR_CASE_NODES[nodeId];
  const container = document.getElementById('inspector-content-pane');
  const chipEl = document.getElementById('inspector-node-chip');
  if (!container || !node) return;

  if (chipEl) chipEl.textContent = `Node #${nodeId.replace('node-', '')}`;

  let metaRows = '';
  if (node.metadata) {
    for (const [k, v] of Object.entries(node.metadata)) {
      metaRows += `<div class="meta-row"><span class="meta-key">${k} :</span><span class="meta-val font-mono">${v}</span></div>`;
    }
  }

  let layerBadgeClass = 'chip-emerald';
  if (node.layer === 2) layerBadgeClass = 'chip-cyan';
  else if (node.layer === 3) layerBadgeClass = 'chip-neutral';
  else if (node.layer === 4) layerBadgeClass = 'chip-purple';

  let actionButtonsHtml = '';
  if (node.layer === 4) {
    actionButtonsHtml = `
      <div class="mt-2">
        <button type="button" class="btn btn-secondary w-full" onclick="openAuditModal('promote')">
          ${getLucideSvg('check', 14)} <span>Promouvoir en Preuve Certifiée (Art. 68 CPP)</span>
        </button>
      </div>
    `;
  } else {
    actionButtonsHtml = `
      <div class="mt-2">
        <button type="button" class="btn btn-secondary btn-sm w-full" onclick="showToast('Empreinte SHA-256 scellée et enregistrée')">
          ${getLucideSvg('lock', 12)} <span>Certifier l'Empreinte (SHA-256 RFC 3161)</span>
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-card candidate-hypothesis-card">
      <div class="candidate-header">
        <span class="hypothesis-badge">${getLucideSvg(node.icon, 14)} ${node.typeLabel}</span>
        <span class="chip ${layerBadgeClass} text-xs">${node.layerName}</span>
      </div>
      <h3 class="text-md font-bold text-light mt-1">${node.label}</h3>
      <p class="text-xs text-muted mt-0-5">${node.subtitle}</p>
      
      <div class="metadata-table mt-2">
        <div class="meta-row"><span class="meta-key">Empreinte SHA-256 :</span><span class="meta-val font-mono">${node.hash.substring(0, 18)}...</span></div>
        <div class="meta-row"><span class="meta-key">Horodatage :</span><span class="meta-val font-mono">${node.timestamp}</span></div>
        <div class="meta-row"><span class="meta-key">Méthode de calcul :</span><span class="meta-val">${node.method}</span></div>
        ${metaRows}
      </div>

      ${actionButtonsHtml}
    </div>
  `;

  renderSuggestedTools(node.suggestedTools);
}

function renderEmptyRightPanel() {
  const container = document.getElementById('inspector-content-pane');
  const chipEl = document.getElementById('inspector-node-chip');
  if (!container) return;

  if (chipEl) chipEl.textContent = 'Vue d\'ensemble';

  let cluesListHtml = ATHAR_INBOX_CLUES.map(c => `
    <div class="inbox-clue-card active mt-1">
      <div class="node-header-row">
        <span class="chip chip-cyan font-mono text-xs">${c.sourceTool}</span>
        <span class="text-xs text-muted font-mono">${c.time}</span>
      </div>
      <div class="text-sm font-semibold text-light">${c.title}</div>
      <div class="text-xs text-muted">${c.details}</div>
      <div class="candidate-actions mt-1">
        <button type="button" class="btn btn-secondary btn-sm" onclick="showToast(t('toast_clue_added'))">
          ${getLucideSvg('check', 12)} <span>${t('btn_add_graph')}</span>
        </button>
        <button type="button" class="btn btn-ghost btn-sm text-danger" onclick="showToast(t('toast_clue_dismissed'))">
          ${getLucideSvg('x', 12)} <span>${t('btn_dismiss')}</span>
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="case-overview-panel-widget">
      <div class="candidate-header">
        <span class="chip chip-emerald text-xs">${t('case_id')}</span>
        <span class="chip chip-neutral font-mono text-xs">Section Recherches</span>
      </div>
      <h3 class="text-md font-bold text-light mt-1">${t('case_name')}</h3>
      <p class="text-xs text-muted mt-0-5">${t('case_profile')}</p>

      <div class="metadata-table mt-2">
        <div class="meta-row"><span class="meta-key">Préjudice Déclaré :</span><span class="meta-val font-mono font-bold text-warning">1 450 000 DZD</span></div>
        <div class="meta-row"><span class="meta-key">Victimes Directes :</span><span class="meta-val font-mono">6 (Alger, Oran, Blida)</span></div>
        <div class="meta-row"><span class="meta-key">Preuves Scellées :</span><span class="meta-val font-mono text-success">12 Éléments (100% WORM)</span></div>
        <div class="meta-row"><span class="meta-key">Taux de Rapprochement :</span><span class="meta-val font-mono text-info">94%</span></div>
      </div>

      <div class="panel-section-title mt-3">
        <span>${t('inbox_pending_title')}</span>
        <span class="chip chip-warning font-mono text-xs">3 en attente</span>
      </div>

      <div class="inbox-items-scroll mt-1">
        ${cluesListHtml}
      </div>
    </div>
  `;

  renderSuggestedTools(['tool_ioc_extractor', 'tool_whois_dns', 'tool_telegram_resolver']);
}

function renderSuggestedTools(toolKeys = []) {
  const container = document.getElementById('suggested-tools-container');
  if (!container) return;

  const defaultKeys = ['tool_whois_dns', 'tool_meta_pixel', 'tool_whatsapp_inspector'];
  const keysToRender = (toolKeys && toolKeys.length > 0) ? toolKeys : defaultKeys;

  let html = '';
  keysToRender.forEach(k => {
    const spec = TOOL_SPECS[k];
    if (spec) {
      html += `
        <div class="suggested-tool-item" onclick="showToolInfo('${k}')">
          <div class="suggested-tool-header">
            <span class="suggested-tool-title">${spec.name}</span>
            <span class="chip chip-cyan font-mono text-xs">${spec.score || '98%'}</span>
          </div>
          <div class="suggested-tool-reason">${spec.reason}</div>
          <div class="suggested-tool-footer">
            <span class="suggested-tool-req">${getLucideSvg('terminal', 12)} ${spec.category}</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation();runSimulatedTool('${spec.name}')">
              ${getLucideSvg('play', 12)} <span>Exécuter</span>
            </button>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
}

// ============================================================================
// MODALS & ACTIONS CONTROLLERS
// ============================================================================

function openPropertiesModal() {
  const modal = document.getElementById('properties-modal');
  if (modal) modal.style.display = 'flex';
}
function closePropertiesModal() {
  const modal = document.getElementById('properties-modal');
  if (modal) modal.style.display = 'none';
}

function openInsertModal() {
  const modal = document.getElementById('insert-modal');
  if (modal) modal.style.display = 'flex';
}
function closeInsertModal() {
  const modal = document.getElementById('insert-modal');
  if (modal) modal.style.display = 'none';
}

function openLLMSettingsModal() {
  const modal = document.getElementById('llm-settings-modal');
  if (modal) modal.style.display = 'flex';
}
function closeLLMSettingsModal() {
  const modal = document.getElementById('llm-settings-modal');
  if (modal) modal.style.display = 'none';
}

function openImportModal() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'flex';
}
function closeImportModal() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'none';
}

function showToolInfo(toolId) {
  const spec = TOOL_SPECS[toolId];
  if (!spec) return;

  const titleEl = document.getElementById('tool-info-name');
  const catEl = document.getElementById('tool-info-cat');
  const modeEl = document.getElementById('tool-info-mode');
  const descEl = document.getElementById('tool-info-desc');
  const inputsEl = document.getElementById('tool-info-inputs-val');
  const outputsEl = document.getElementById('tool-info-outputs-val');
  const storageEl = document.getElementById('tool-info-storage-val');
  const resourcesEl = document.getElementById('tool-info-resources-val');
  const complianceEl = document.getElementById('tool-info-compliance-val');

  if (titleEl) titleEl.textContent = spec.name;
  if (catEl) catEl.textContent = spec.category;
  if (modeEl) modeEl.textContent = spec.mode;
  if (descEl) descEl.textContent = spec.reason;
  if (inputsEl) inputsEl.textContent = spec.inputs;
  if (outputsEl) outputsEl.textContent = spec.outputs;
  if (storageEl) storageEl.textContent = spec.storage;
  if (resourcesEl) resourcesEl.textContent = spec.resources;
  if (complianceEl) complianceEl.textContent = spec.compliance;

  const modal = document.getElementById('tool-info-modal');
  if (modal) modal.style.display = 'flex';
}

function closeToolInfoModal() {
  const modal = document.getElementById('tool-info-modal');
  if (modal) modal.style.display = 'none';
}

function runToolFromModal() {
  const titleEl = document.getElementById('tool-info-name');
  const name = titleEl ? titleEl.textContent : 'Outil';
  closeToolInfoModal();
  runSimulatedTool(name);
}

function addToolToPlaybook() {
  closeToolInfoModal();
  showToast('Brique intégrée au Playbook d\'enquête DAG');
}

function toggleLeftPanel() {
  appState.leftPanelCollapsed = !appState.leftPanelCollapsed;
  const panel = document.getElementById('panel-left');
  if (panel) {
    panel.style.width = appState.leftPanelCollapsed ? '0px' : 'var(--panel-left-width)';
    panel.style.padding = appState.leftPanelCollapsed ? '0' : '';
  }
}

function runSimulatedTool(toolName) {
  showToast(`Exécution de [${toolName}] en cours... Découvertes envoyées à la boîte d'arbitrage`);
}

function showToast(msg) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
}

function openAuditModal(action) {
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'flex';
}
function closeAuditModal() {
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'none';
}
function confirmAuditAction() {
  closeAuditModal();
  showToast('Action validée et inscrite au registre forensique inaltérable');
}

function openCommandPalette() {
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
  const modal = document.getElementById('command-palette-modal');
  if (modal) modal.style.display = 'none';
}

function filterCommandPalette(query) {
  const list = document.getElementById('cmd-results-list');
  if (!list) return;
  const q = (query || '').toLowerCase().trim();

  const entries = Object.entries(TOOL_SPECS);
  const filtered = entries.filter(([k, v]) => {
    return v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q) || v.reason.toLowerCase().includes(q);
  });

  list.innerHTML = filtered.map(([k, v]) => `
    <div class="cmd-result-item" onclick="selectCommandTool('${v.name}')">
      <div class="cmd-result-title">${v.name}</div>
      <div class="cmd-result-desc">${v.category} • ${v.reason}</div>
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

// Initialize on DOM Ready

// ============================================================================
// ACCORDION MENU CONTROLLER (PANEL-LEFT)
// ============================================================================
function toggleAccordion(sectionId) {
  const btn = document.getElementById(`acc-btn-${sectionId}`);
  const panel = document.getElementById(`acc-panel-${sectionId}`);
  if (!btn || !panel) return;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !isExpanded);
  panel.classList.toggle('is-open', !isExpanded);
}

function filterToolboxDomain(domainKey) {
  document.querySelectorAll('.toolbox-domain-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-toolbox-domain') === domainKey);
  });
  let visibleCount = 0;
  document.querySelectorAll('.node-drag-item').forEach(item => {
    const d = item.getAttribute('data-domain');
    const matches = (domainKey === 'all') || (d === domainKey);
    item.style.display = matches ? 'flex' : 'none';
    if (matches) visibleCount++;
  });
  const label = document.getElementById('toolbox-count-label');
  if (label) label.textContent = `${visibleCount} types`;
}

// ============================================================================
// DRAG & DROP NODE CREATION CONTROLLER
// ============================================================================
function handleNodeDragStart(event, nodeType) {
  event.dataTransfer.setData('text/plain', nodeType);
  event.dataTransfer.effectAllowed = 'copy';
}

function initCanvasDropZone() {
  const canvas = document.getElementById('canvas-svg-container');
  if (!canvas) return;

  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    canvas.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', (e) => {
    if (e.target === canvas) {
      canvas.classList.remove('drag-over');
    }
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    const nodeType = e.dataTransfer.getData('text/plain');
    if (!nodeType) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 80, e.clientX - rect.left - 28));
    const y = Math.max(40, Math.min(rect.height - 100, e.clientY - rect.top - 28));

    openCreateNodeModal(nodeType, x, y);
  });
}

const NODE_LABELS_FR = {
  wilaya: "Wilaya (Collectivité)",
  daira: "Daïra (Circonscription)",
  commune: "Commune d'Algérie",
  unite: "Unité d'Enquête (Brigade/PJ)",
  affaire: "Affaire Judiciaire",
  magistrat: "Magistrat Instructeur",
  personne: "Personne (Suspect/Contact)",
  entreprise: "Entreprise / Société Écran",
  vehicule: "Véhicule Suspect",
  telephone: "Téléphone (MSISDN +213)",
  carte_sim: "Carte SIM (IMSI)",
  appareil_mobile: "Appareil Mobile (IMEI)",
  antenne_bts: "Antenne-Relais Télécom (BTS)",
  telecom_cdr: "Journal d'Appels (CDR)",
  compte_bancaire: "Compte Bancaire / RIP",
  transaction_financiere: "Virement BaridiMob",
  guichet_gab: "Guichet Automatique (GAB)",
  crypto_wallet: "Portefeuille Crypto",
  transaction_crypto: "Transaction Blockchain",
  compte_social: "Compte Réseau Social",
  publication_sociale: "Publication / Annonce",
  canal_telegram: "Canal Telegram",
  message_chat: "Message Instantané",
  adresse_email: "Adresse Email",
  site_web: "Site Web / Fausse Boutique",
  identifiant_infrastructure: "Tracker / Pixel Meta",
  fichier_apk: "Binaire APK Malveillant",
  serveur_c2: "Serveur C2 Pirate",
  certificat_tls: "Certificat TLS/SSL",
  artefact_dfir: "Fichier Registre DFIR",
  session_recherche: "Session de Recherche",
  enregistrement_vocal: "Note Vocale Darija",
  empreinte_faciale: "Empreinte Faciale 512-d",
  image_preuve: "Cliché de Surveillance",
  document_judiciaire: "Procès-Verbal Judiciaire",
  scelle_numerique: "Scellé Numérique WORM",
  preuve_merkle: "Preuve Cryptographique"
};

const NODE_ICONS_LUCIDE = {
  wilaya: 'landmark', daira: 'map-pin', commune: 'map', unite: 'shield', affaire: 'folder-archive', magistrat: 'scale',
  personne: 'user', entreprise: 'building-2', vehicule: 'car', telephone: 'phone', carte_sim: 'credit-card', appareil_mobile: 'smartphone',
  antenne_bts: 'radio', telecom_cdr: 'activity', compte_bancaire: 'wallet', transaction_financiere: 'arrow-right-left', guichet_gab: 'banknote',
  crypto_wallet: 'boxes', transaction_crypto: 'git-commit', compte_social: 'at-sign', publication_sociale: 'message-square',
  canal_telegram: 'send', message_chat: 'message-circle', adresse_email: 'mail', site_web: 'globe', identifiant_infrastructure: 'hash',
  fichier_apk: 'file-code', serveur_c2: 'server', certificat_tls: 'key', artefact_dfir: 'hard-drive', session_recherche: 'search',
  enregistrement_vocal: 'mic', empreinte_faciale: 'scan-face', image_preuve: 'image', document_judiciaire: 'file-text',
  scelle_numerique: 'lock', preuve_merkle: 'binary'
};

function openCreateNodeModal(nodeType, x, y) {
  const modal = document.getElementById('modal-create-node');
  if (!modal) return;
  document.getElementById('new-node-type').value = nodeType;
  document.getElementById('new-node-pos-x').value = Math.round(x);
  document.getElementById('new-node-pos-y').value = Math.round(y);
  
  const displayEl = document.getElementById('new-node-type-display');
  const valInput = document.getElementById('new-node-value');
  const lblInput = document.getElementById('new-node-label');
  
  const typeName = NODE_LABELS_FR[nodeType] || nodeType.toUpperCase();
  if (displayEl) displayEl.textContent = typeName;
  if (valInput) {
    valInput.value = '';
    valInput.placeholder = "Saisir la valeur de l'entité (" + typeName + ")...";
  }
  if (lblInput) lblInput.value = '';

  modal.style.display = 'flex';
  if (valInput) valInput.focus();
}

function closeCreateNodeModal() {
  const modal = document.getElementById('modal-create-node');
  if (modal) modal.style.display = 'none';
}

let customNodeIndex = 1;
function confirmCreateNode(event) {
  if (event) event.preventDefault();
  const nodeType = document.getElementById('new-node-type').value;
  const posX = parseInt(document.getElementById('new-node-pos-x').value, 10) || 200;
  const posY = parseInt(document.getElementById('new-node-pos-y').value, 10) || 150;
  const val = document.getElementById('new-node-value').value.trim();
  const label = document.getElementById('new-node-label').value.trim() || val;
  const layerStr = document.getElementById('new-node-layer').value;
  const layerNum = parseInt(layerStr.replace('layer-', ''), 10) || 2;

  if (!val) {
    showToast("Erreur : La valeur de l'entité est requise");
    return;
  }

  const newNodeId = `node-custom-${customNodeIndex++}`;
  
  // Register in ATHAR_CASE_NODES
  ATHAR_CASE_NODES[newNodeId] = {
    id: newNodeId,
    type: nodeType,
    typeLabel: NODE_LABELS_FR[nodeType] || nodeType,
    name: val,
    layer: layerNum,
    certitude: layerNum === 1 ? '100% Scellé RFC 3161' : (layerNum === 4 ? 'Hypothèse IA' : '90% OSINT'),
    hash: 'sha256:' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    date: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    officer: 'Insp. Benali (Création Manuelle)',
    desc: "Entité créée manuellement pour enrichir l'instruction judiciaire du dossier #2026-SCAM-089.",
    metadata: {
      'Type Canonique': nodeType,
      'Identifiant': val,
      'Mode Création': 'Glisser-Déposer Manuel',
      'Horodatage': new Date().toLocaleTimeString()
    }
  };

  // Build DOM button
  const canvas = document.getElementById('canvas-svg-container');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `canvas-node-circle ${layerStr}`;
  btn.id = newNodeId;
  btn.style.left = `${posX}px`;
  btn.style.top = `${posY}px`;
  btn.setAttribute('aria-label', `${label} : ${val}`);
  btn.onclick = () => handleCanvasNodeClick(newNodeId);

  // Status badge dot
  let badgeClass = 'badge-dot-osint';
  let badgeText = '●';
  if (layerNum === 1) { badgeClass = 'badge-dot-verified'; badgeText = '✓'; }
  else if (layerNum === 3) { badgeClass = 'badge-dot-infra'; badgeText = '⚙'; }
  else if (layerNum === 4) { badgeClass = 'badge-dot-hypothesis'; badgeText = '✦'; }

  // Lucide icon
  const iconName = NODE_ICONS_LUCIDE[nodeType] || 'shield';
  const iconSvg = getLucideSvg(iconName, 22);

  btn.innerHTML = `
    <span class="node-circle-badge-dot ${badgeClass}">${badgeText}</span>
    <div class="node-circle-icon">${iconSvg}</div>
    <div class="node-circle-label-wrap">
      <span class="node-circle-title">${val}</span>
      <span class="node-circle-sub">${label}</span>
    </div>
  `;

  canvas.appendChild(btn);
  closeCreateNodeModal();
  selectNode(newNodeId);
  showToast(`Nœud (${val}) ajouté au dossier d'enquête`);
}

// ============================================================================
// MANUAL LINK CREATION CONTROLLER
// ============================================================================
let linkCreationState = {
  active: false,
  sourceNodeId: null,
  targetNodeId: null
};

function toggleLinkCreationMode() {
  linkCreationState.active = !linkCreationState.active;
  linkCreationState.sourceNodeId = null;
  linkCreationState.targetNodeId = null;
  
  const btn = document.getElementById('btn-toggle-link-mode');
  const banner = document.getElementById('canvas-connection-banner');
  const textEl = document.getElementById('canvas-connection-text');
  
  if (btn) btn.classList.toggle('active', linkCreationState.active);
  if (banner) banner.classList.toggle('is-visible', linkCreationState.active);
  if (textEl) textEl.innerHTML = '<strong>Mode Liaison Actif :</strong> Cliquez sur le premier nœud (Source)...';
  
  document.querySelectorAll('.canvas-node-circle').forEach(c => {
    c.classList.remove('connecting-source', 'connecting-target');
  });

  if (linkCreationState.active) {
    showToast('Mode Liaison activé : Cliquez sur le premier nœud');
  }
}

function cancelLinkCreation() {
  linkCreationState.active = false;
  linkCreationState.sourceNodeId = null;
  linkCreationState.targetNodeId = null;
  const btn = document.getElementById('btn-toggle-link-mode');
  const banner = document.getElementById('canvas-connection-banner');
  if (btn) btn.classList.remove('active');
  if (banner) banner.classList.remove('is-visible');
  document.querySelectorAll('.canvas-node-circle').forEach(c => {
    c.classList.remove('connecting-source', 'connecting-target');
  });
}

function handleCanvasNodeClick(nodeId) {
  if (!linkCreationState.active) {
    selectNode(nodeId);
    return;
  }

  // Link mode is active
  if (!linkCreationState.sourceNodeId) {
    linkCreationState.sourceNodeId = nodeId;
    const nodeEl = document.getElementById(nodeId);
    if (nodeEl) nodeEl.classList.add('connecting-source');
    const textEl = document.getElementById('canvas-connection-text');
    const srcNode = ATHAR_CASE_NODES[nodeId];
    const srcName = srcNode ? (srcNode.name || srcNode.typeLabel) : nodeId;
    if (textEl) textEl.innerHTML = `<strong>Source :</strong> ${srcName} &rarr; Cliquez sur le second nœud (Cible)...`;
  } else if (linkCreationState.sourceNodeId === nodeId) {
    showToast('Veuillez sélectionner un nœud cible distinct');
  } else {
    linkCreationState.targetNodeId = nodeId;
    const nodeEl = document.getElementById(nodeId);
    if (nodeEl) nodeEl.classList.add('connecting-target');
    openCreateEdgeModal(linkCreationState.sourceNodeId, nodeId);
  }
}

function openCreateEdgeModal(srcId, tgtId) {
  const modal = document.getElementById('modal-create-edge');
  if (!modal) return;
  document.getElementById('edge-source-id').value = srcId;
  document.getElementById('edge-target-id').value = tgtId;
  
  const srcNode = ATHAR_CASE_NODES[srcId];
  const tgtNode = ATHAR_CASE_NODES[tgtId];
  
  const srcNameEl = document.getElementById('edge-source-name');
  const tgtNameEl = document.getElementById('edge-target-name');
  if (srcNameEl) srcNameEl.textContent = srcNode ? (srcNode.name || srcNode.typeLabel) : srcId;
  if (tgtNameEl) tgtNameEl.textContent = tgtNode ? (tgtNode.name || tgtNode.typeLabel) : tgtId;

  modal.style.display = 'flex';
}

function closeCreateEdgeModal() {
  const modal = document.getElementById('modal-create-edge');
  if (modal) modal.style.display = 'none';
  cancelLinkCreation();
}

function confirmCreateEdge(event) {
  if (event) event.preventDefault();
  const srcId = document.getElementById('edge-source-id').value;
  const tgtId = document.getElementById('edge-target-id').value;
  const relType = document.getElementById('new-edge-type').value;
  const weight = parseFloat(document.getElementById('new-edge-weight').value) || 0.8;

  const srcEl = document.getElementById(srcId);
  const tgtEl = document.getElementById(tgtId);
  if (!srcEl || !tgtEl) return;

  const svg = document.getElementById('canvas-edges-layer');
  if (svg) {
    const x1 = srcEl.offsetLeft + srcEl.offsetWidth / 2;
    const y1 = srcEl.offsetTop + srcEl.offsetHeight / 2;
    const x2 = tgtEl.offsetLeft + tgtEl.offsetWidth / 2;
    const y2 = tgtEl.offsetTop + tgtEl.offsetHeight / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', weight < 0.6 ? 'canvas-edge-line dashed' : 'canvas-edge-line');
    line.setAttribute('marker-end', weight < 0.6 ? 'url(#arrow-hypothesis)' : 'url(#arrow-solid)');
    
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `[:${relType}] (Poids: ${weight * 100}%)`;
    line.appendChild(title);
    
    svg.appendChild(line);
  }

  closeCreateEdgeModal();
  showToast(`Liaison [:${relType}] établie entre les deux entités`);
}

function runSimulatedQuery(queryText) {
  showToast(`Exécution de la requête : "${queryText}"`);
  selectNode('node-phone');
}


// ============================================================================
// SLIDABLE & ADJUSTABLE (RESIZABLE) PANELS CONTROLLER
// ============================================================================
function togglePanelCollapse(side) {
  const panel = document.getElementById(side === 'left' ? 'panel-left' : 'panel-right');
  const btn = document.getElementById(side === 'left' ? 'btn-collapse-left' : 'btn-collapse-right');
  if (!panel) return;
  const isCollapsed = panel.classList.toggle('collapsed');
  if (btn) {
    btn.setAttribute('aria-expanded', !isCollapsed);
    if (side === 'left') {
      btn.innerHTML = isCollapsed
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    } else {
      btn.innerHTML = isCollapsed
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
    }
  }
  try {
    localStorage.setItem('athar_panel_' + side + '_collapsed', isCollapsed ? '1' : '0');
  } catch (e) {}
}

function initPanelResizers() {
  const leftPanel = document.getElementById('panel-left');
  const rightPanel = document.getElementById('panel-right');
  const leftResizer = document.getElementById('resizer-left');
  const rightResizer = document.getElementById('resizer-right');

  // Restore saved widths & collapse states
  try {
    const savedLeftW = localStorage.getItem('athar_panel_left_width');
    const savedRightW = localStorage.getItem('athar_panel_right_width');
    if (savedLeftW && leftPanel) {
      leftPanel.style.width = savedLeftW + 'px';
      leftPanel.style.minWidth = savedLeftW + 'px';
    }
    if (savedRightW && rightPanel) {
      rightPanel.style.width = savedRightW + 'px';
      rightPanel.style.minWidth = savedRightW + 'px';
    }
    if (localStorage.getItem('athar_panel_left_collapsed') === '1') togglePanelCollapse('left');
    if (localStorage.getItem('athar_panel_right_collapsed') === '1') togglePanelCollapse('right');
  } catch (e) {}

  let activeSide = null;
  let startX = 0;
  let startWidth = 0;

  function onMouseDown(side, e) {
    if (e.target.closest('.panel-collapse-trigger')) return;
    e.preventDefault();
    activeSide = side;
    startX = e.clientX;
    const panel = side === 'left' ? leftPanel : rightPanel;
    if (!panel || panel.classList.contains('collapsed')) return;
    startWidth = panel.getBoundingClientRect().width;
    (side === 'left' ? leftResizer : rightResizer).classList.add('is-resizing');
    document.body.style.cursor = 'col-resize';
  }

  if (leftResizer) leftResizer.addEventListener('mousedown', (e) => onMouseDown('left', e));
  if (rightResizer) rightResizer.addEventListener('mousedown', (e) => onMouseDown('right', e));

  document.addEventListener('mousemove', (e) => {
    if (!activeSide) return;
    const isRtl = document.documentElement.dir === 'rtl';
    const delta = e.clientX - startX;
    const maxCanvasSafe = window.innerWidth * 0.45;

    if (activeSide === 'left' && leftPanel) {
      let newW = startWidth + (isRtl ? -delta : delta);
      newW = Math.max(200, Math.min(400, Math.min(maxCanvasSafe, newW)));
      leftPanel.style.width = newW + 'px';
      leftPanel.style.minWidth = newW + 'px';
    } else if (activeSide === 'right' && rightPanel) {
      let newW = startWidth + (isRtl ? delta : -delta);
      newW = Math.max(260, Math.min(520, Math.min(maxCanvasSafe, newW)));
      rightPanel.style.width = newW + 'px';
      rightPanel.style.minWidth = newW + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (!activeSide) return;
    const panel = activeSide === 'left' ? leftPanel : rightPanel;
    const resizer = activeSide === 'left' ? leftResizer : rightResizer;
    if (resizer) resizer.classList.remove('is-resizing');
    document.body.style.cursor = '';
    if (panel) {
      try {
        localStorage.setItem('athar_panel_' + activeSide + '_width', Math.round(panel.getBoundingClientRect().width));
      } catch (e) {}
    }
    activeSide = null;
  });

  // Keyboard shortcuts [ and ] to slide left/right panels
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (e.key === '[') togglePanelCollapse('left');
    else if (e.key === ']') togglePanelCollapse('right');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
  initMenubarEvents();
  initCanvasDropZone();
  initPanelResizers();
  setScreen(2);
  if (appState.selectedNodeId) {
    renderNodeInspector(appState.selectedNodeId);
  } else {
    renderEmptyRightPanel();
  }
});
