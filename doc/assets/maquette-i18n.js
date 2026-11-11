/**
 * AegisInvestigate — Multilingual Engine & Forensic Workspace Controller
 * Conforms to SPECIFICATION.md, WCAG 2.2 AA, and Nielsen's Heuristics.
 * 62 Tools Inventory across 6 Operational Categories.
 */

const I18N_TRANSLATIONS = {
  "fr": {
    "app_title": "AegisInvestigate",
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
    "menu_osns": "Réseaux Sociaux",
    "menu_police": "Police Judiciaire",
    "menu_view": "Affichage",
    "menu_ai": "Assistant IA",
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
    "m_tool_ioc": "Extracteur d'Indices Textuels (IOC Regex)",
    "m_tool_objectid": "Décodeur MongoDB ObjectId & Timestamp",
    "m_tool_pixel": "Recherche Inversée Meta Pixel & Google Analytics",
    "m_tool_whois": "Historique WHOIS & Enregistrements DNS",
    "m_tool_shodan": "Reconnaissance Hôtes & Certificats (Shodan)",
    "m_tool_breach": "Recherche dans les Fuites & Stealers (DeHashed)",
    "m_tool_all_osint": "Consulter les Briques Web & Infra (12 Outils) ↗",
    "m_tool_telegram": "Résolveur de Comptes & Canaux Telegram",
    "m_tool_whatsapp": "Inspecteur Profils WhatsApp Business",
    "m_tool_fb_page": "Transparence de Page Facebook & Pays",
    "m_tool_meta_ads": "Inspecteur Campagnes Meta Ad Library",
    "m_tool_instagram": "Analyseur Profils Instagram & Toutatis",
    "m_tool_ouedkniss": "Recherche Marchés d'Occasion Ouedkniss",
    "m_tool_all_socmint": "Consulter les Briques Réseaux Sociaux (10 Outils) ↗",
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
    "m_ai_mode_deterministic": "Mode Déterministe Strict (100% Sans LLM - Actif)",
    "m_ai_mode_local_ollama": "Activer Copilot IA Local (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "Passerelle Cloud Sécurisée (LiteLLM)",
    "m_ai_suggest_playbook": "Proposer un Scénario d'Enquête Automatique",
    "m_ai_summarize": "Rédiger Synthèse Chronologique de l'Affaire",
    "m_ai_settings": "Configuration LLM & Paramètres d'Inférence...",
    "modal_properties_title": "Propriétés de l'Affaire Judiciaire",
    "modal_insert_title": "Insérer un Nouvel Indice / Preuve",
    "modal_llm_title": "Configuration du Moteur IA & Copilot LLM",
    "modal_import_title": "Importer des Données & Fichiers d'Enquête",
    "btn_save_changes": "Enregistrer les Modifications",
    "btn_cancel": "Annuler",
    "btn_insert_confirm": "Insérer au Dossier d'Enquête"
  },
  "ar": {
    "app_title": "AegisInvestigate",
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
    "menu_investigation": "ملف القضية",
    "menu_edit": "تعديل",
    "menu_insert": "إدراج",
    "menu_osint": "أدوات OSINT",
    "menu_osns": "شبكات التواصل",
    "menu_police": "الشرطة القضائية",
    "menu_view": "عرض",
    "menu_ai": "المساعد الذكي",
    "m_new_case": "إنشاء قضية جديدة...",
    "m_open_case": "فتح قضية...",
    "m_save": "حفظ",
    "m_save_as": "حفظ باسم...",
    "m_import_clues": "استيراد أدلة ورسائل (CDR)...",
    "m_case_properties": "خصائص ومعلومات القضية...",
    "m_export_report": "تصدير المحضر القضائي (PDF)...",
    "m_undo": "تراجع عن آخر إجراء",
    "m_redo": "إعادة الإجراء",
    "m_cut": "قص",
    "m_copy": "نسخ",
    "m_paste": "لصق",
    "m_merge_clues": "دمج قرينتين متطابقتين",
    "m_select_all": "تحديد كامل المخطط",
    "m_delete_node": "حذف الدليل المحدد",
    "m_insert_clue": "إدراج دليل يدوي جديد...",
    "m_insert_seized": "إدراج حرز قضائي مختوم...",
    "m_insert_witness": "محضر سماع أقوال أو شهادة...",
    "m_insert_web_snap": "توثيق لقطة ويب معتمدة (RFC 3161)...",
    "m_insert_gps": "إحداثيات جغرافية GPS...",
    "m_insert_suspect": "حساب أو هوية مستهدفة...",
    "m_tool_ioc": "مستخرج المؤشرات والأرقام (IOC Regex)",
    "m_tool_objectid": "مفكك شفرات MongoDB ObjectId وتاريخ الإنشاء",
    "m_tool_pixel": "البحث العكسي عن بكسل ميتا وحسابات التتبع",
    "m_tool_whois": "سجل WHOIS وتاريخ ملكية النطاق",
    "m_tool_shodan": "فحص الخوادم والشهادات الرقمية (Shodan)",
    "m_tool_breach": "البحث في قواعد البيانات المسربة (DeHashed)",
    "m_tool_all_osint": "عرض أدوات الويب والبنية التحتية (12 أداة) ↗",
    "m_tool_telegram": "محلل حسابات وقنوات تيليغرام",
    "m_tool_whatsapp": "فاحص حسابات وكتالوجات واتساب للأعمال",
    "m_tool_fb_page": "شفافية صفحة فيسبوك وبلد الإدارة",
    "m_tool_meta_ads": "مكتبة إعلانات ميتا الممولة",
    "m_tool_instagram": "محلل حسابات إنستغرام والتسجيل",
    "m_tool_ouedkniss": "البحث في إعلانات واد كنيس السابقة",
    "m_tool_all_socmint": "عرض أدوات شبكات التواصل (10 أدوات) ↗",
    "m_tool_cdr": "محلل كشوف الاتصالات (CDR Excel)",
    "m_tool_cell_triang": "تحديد نطاق وهوائيات التغطية (BTS)",
    "m_tool_cotravel": "كاشف الهواتف المتلازمة بالتنقل",
    "m_tool_alibi": "كاشف تناقضات ادعاءات المشتبه به",
    "m_tool_alpr": "قراءة لوحات الترقيم الوطنية (LAPI)",
    "m_tool_ccp_mules": "فاحص الحسابات البريدية والحسابات الوسيطة",
    "m_tool_requisitions": "محرر أوامر التسخير القضائي (CPP)",
    "m_tool_all_police": "عرض أدوات التحقيق الجنائي (9 أدوات) ↗",
    "m_view_graph": "مخطط الصلات والقرائن الجنائية",
    "m_view_timeline": "التسلسل الزمني للأحداث",
    "m_view_map": "الخريطة الجغرافية والمسارات",
    "m_view_vault": "خزينة الأحراز الرقمية المشفرة (WORM)",
    "m_view_reset_zoom": "إعادة ضبط التكبير وتوسيط المخطط",
    "m_view_toggle_layers": "إظهار أو إخفاء لوحة الطبقات",
    "m_view_toggle_fullscreen": "ملء الشاشة (F11)",
    "m_view_refresh": "إعادة ترتيب وتوزيع العقد آلياً",
    "m_ai_mode_deterministic": "الوضع الحتمي الصارم (دون ذكاء توليدي - نشط)",
    "m_ai_mode_local_ollama": "تفعيل المساعد المحلي المغلق (Ollama / Qwen-2.5)",
    "m_ai_mode_cloud": "بوابة النماذج السحابية المؤمنة (LiteLLM)",
    "m_ai_suggest_playbook": "اقتراح مسار تحقيق استدلالي آلي",
    "m_ai_summarize": "صياغة التقرير التركيبي للقضية",
    "m_ai_settings": "إعدادات نماذج الذكاء الاصطناعي...",
    "modal_properties_title": "خصائص وبيانات ملف القضية",
    "modal_insert_title": "إدراج دليل أو قرينة جديدة",
    "modal_llm_title": "إعدادات الذكاء الاصطناعي والمساعد الآلي",
    "modal_import_title": "استيراد ملفات ومعطيات التحقيق",
    "btn_save_changes": "حفظ التغييرات",
    "btn_cancel": "إلغاء",
    "btn_insert_confirm": "تثبيت الدليل في ملف القضية"
  },
  "en": {
    "app_title": "AegisInvestigate",
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
    "menu_investigation": "Investigation",
    "menu_edit": "Edit",
    "menu_insert": "Insert",
    "menu_osint": "OSINT Tools",
    "menu_osns": "Social Networks",
    "menu_police": "Criminal Police",
    "menu_view": "View",
    "menu_ai": "AI Copilot",
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
    "m_tool_ioc": "Text Clue Extractor (IOC Regex)",
    "m_tool_objectid": "MongoDB ObjectId & Timestamp Decoder",
    "m_tool_pixel": "Meta Pixel & Analytics Reverse Pivot",
    "m_tool_whois": "WHOIS History & DNS Records",
    "m_tool_shodan": "Host & Port Reconnaissance (Shodan)",
    "m_tool_breach": "Breach & Stealer Hunter (DeHashed)",
    "m_tool_all_osint": "Browse All Web & Infra Tools (12 Tools) ↗",
    "m_tool_telegram": "Telegram Account & Channel Resolver",
    "m_tool_whatsapp": "WhatsApp Business Catalog Inspector",
    "m_tool_fb_page": "Facebook Page Transparency & Country",
    "m_tool_meta_ads": "Meta Ad Library Campaign Inspector",
    "m_tool_instagram": "Instagram OSINT & Account Prober",
    "m_tool_ouedkniss": "Ouedkniss & Classifieds Historical Search",
    "m_tool_all_socmint": "Browse All Social Media Tools (10 Tools) ↗",
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
  auditModalOpen: false
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
    'check': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polyline points="20 6 9 17 4 12"/></svg>`,
    'alert-triangle': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    'x': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`,
    'user': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'phone': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'globe': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    'terminal': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    'scale': `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${c}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
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

// Update all DOM elements with data-i18n
function applyI18n() {
  const dict = I18N_TRANSLATIONS[appState.lang] || I18N_TRANSLATIONS['fr'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (dict[k]) {
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.placeholder = dict[k];
      } else {
        el.textContent = dict[k];
      }
    }
  });

  // Update HTML dir and lang
  const root = document.documentElement;
  root.lang = appState.lang;
  if (appState.lang === 'ar') {
    root.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else {
    root.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  }
}

// Language Switcher
function setLanguage(lang) {
  if (['fr', 'ar', 'en'].includes(lang)) {
    appState.lang = lang;
    applyI18n();
    renderInspector();
    renderSuggestedTools();
  }
}

// Theme Switcher
function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', appState.theme);
  if (appState.theme === 'light') {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
}

// Stealth Toggle
function toggleStealth() {
  appState.stealth = !appState.stealth;
  const badge = document.getElementById('stealth-warning-badge');
  if (badge) {
    badge.style.display = appState.stealth ? 'none' : 'inline-flex';
  }
}

// Top Desktop Menu Dropdown Toggle
function toggleMenu(menuId) {
  if (appState.openMenuId === menuId) {
    closeAllMenus();
  } else {
    closeAllMenus();
    const target = document.getElementById(menuId);
    if (target) {
      target.classList.add('is-open');
      const trigger = document.getElementById(`btn-${menuId}`);
      if (trigger) trigger.classList.add('active');
      appState.openMenuId = menuId;
    }
  }
}

function closeAllMenus() {
  document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('is-open'));
  document.querySelectorAll('.menubar-btn').forEach(b => b.classList.remove('active'));
  appState.openMenuId = null;
}

// Menu Action Dispatcher
function triggerMenuAction(action) {
  closeAllMenus();
  if (action === 'new_case' || action === 'properties') {
    openPropertiesModal();
  } else if (action === 'insert_clue') {
    openInsertModal();
  } else if (action === 'llm_settings') {
    openLLMSettingsModal();
  } else if (action === 'import') {
    openImportModal();
  } else if (action === 'export_report') {
    setScreen(5);
  } else if (action === 'view_graph') {
    setScreen(2); setCanvasView('graph');
  } else if (action === 'view_timeline') {
    setScreen(4); setCanvasView('timeline');
  } else if (action === 'view_map') {
    setScreen(4); setCanvasView('map');
  } else if (action === 'toggle_layers') {
    toggleLeftPanel();
  } else if (action === 'fullscreen') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  } else if (action.startsWith('tool_')) {
    const toolName = action.replace('tool_', '').replace(/_/g, ' ');
    runSimulatedTool(toolName);
  } else {
    showToast(`Action exécutée : ${action}`);
  }
}

// Toggle Panels
function toggleLeftPanel() {
  appState.leftPanelCollapsed = !appState.leftPanelCollapsed;
  const panel = document.getElementById('panel-left');
  if (panel) panel.classList.toggle('collapsed', appState.leftPanelCollapsed);
}

// Modal Handlers
function openPropertiesModal() {
  appState.propertiesModalOpen = true;
  const el = document.getElementById('properties-modal');
  if (el) el.style.display = 'flex';
}
function closePropertiesModal() {
  appState.propertiesModalOpen = false;
  const el = document.getElementById('properties-modal');
  if (el) el.style.display = 'none';
}

function openInsertModal() {
  appState.insertModalOpen = true;
  const el = document.getElementById('insert-modal');
  if (el) el.style.display = 'flex';
}
function closeInsertModal() {
  appState.insertModalOpen = false;
  const el = document.getElementById('insert-modal');
  if (el) el.style.display = 'none';
}

function openLLMSettingsModal() {
  appState.llmModalOpen = true;
  const el = document.getElementById('llm-settings-modal');
  if (el) el.style.display = 'flex';
}
function closeLLMSettingsModal() {
  appState.llmModalOpen = false;
  const el = document.getElementById('llm-settings-modal');
  if (el) el.style.display = 'none';
}

function openImportModal() {
  appState.importModalOpen = true;
  const el = document.getElementById('import-modal');
  if (el) el.style.display = 'flex';
}
function closeImportModal() {
  appState.importModalOpen = false;
  const el = document.getElementById('import-modal');
  if (el) el.style.display = 'none';
}

// Switch focused Screen (1 to 5)
function setScreen(num) {
  appState.activeScreen = num;
  document.querySelectorAll('.screen-pill-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.screen) === num);
  });

  const screenViews = ['view-overview', 'view-graph-canvas', 'view-inbox-review', 'view-timeline-map', 'view-report-export'];
  screenViews.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) {
      if (idx + 1 === num) {
        el.classList.remove('is-hidden');
        if (id === 'view-graph-canvas') el.classList.add('is-flex-flush');
      } else {
        el.classList.add('is-hidden');
        el.classList.remove('is-flex-flush');
      }
    }
  });

  if (num === 2) {
    selectNode('node-suspect');
  }
}

// Global Mode Switcher (Collect | Analyze | Report)
function setAppMode(mode) {
  appState.mode = mode;
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  if (mode === 'report') setScreen(5);
  else if (mode === 'collect') setScreen(3);
  else setScreen(2);
}

// Canvas View Switcher (Graph | Timeline | Map)
function setCanvasView(view) {
  appState.canvasView = view;
  document.querySelectorAll('.canvas-segmented-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  if (view === 'timeline' || view === 'map') {
    setScreen(4);
  } else {
    setScreen(2);
  }
}

// Select Node on Canvas and drive Inspector & Suggested Tools
function selectNode(nodeId) {
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.canvas-node-card').forEach(card => {
    card.classList.toggle('selected', card.id === nodeId);
  });
  renderInspector();
  renderSuggestedTools();
}

// Render Inspector contents based on selected node
function renderInspector() {
  const container = document.getElementById('inspector-content-pane');
  if (!container) return;

  if (!appState.selectedNodeId) {
    container.innerHTML = `
      <div class="empty-inspector-state">
        ${getLucideSvg('search', 32, 'muted-icon')}
        <p class="empty-title">${t('inspector_empty_title')}</p>
        <p class="empty-desc">${t('inspector_empty_desc')}</p>
      </div>
    `;
    return;
  }

  if (appState.selectedNodeId === 'node-suspect') {
    container.innerHTML = `
      <div class="inspector-card candidate-hypothesis-card">
        <div class="candidate-header">
          <span class="hypothesis-badge">${getLucideSvg('sparkles', 14)} ${t('candidate_subject_title')}</span>
          <span class="chip chip-warning">Hypothèse IA • Non vérifié</span>
        </div>
        <div class="judicial-disclaimer-box">
          ${getLucideSvg('alert-triangle', 16, 'text-warning')}
          <p>${t('candidate_presumption_notice')}</p>
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

// Close menus when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menubar-item')) {
    closeAllMenus();
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
  }
});

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
  setScreen(2);
});
