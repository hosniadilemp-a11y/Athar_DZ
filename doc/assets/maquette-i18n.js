// AegisInvestigate — Multilingual Engine & Interactive Maquette Controller
// Supports 🇫🇷 Français, 🇸🇦 العربية (RTL), and 🇬🇧 English

const I18N_TRANSLATIONS = {
  fr: {
    menu_file: "Dossier",
    m_new_case: "Nouveau Dossier d'Enquête...",
    m_open_case: "Ouvrir un Dossier...",
    m_save: "Enregistrer",
    m_save_as: "Enregistrer sous...",
    m_import: "Importer Indices (CDR, Photos, Liens)",
    m_export_pdf: "Exporter Rapport Judiciaire (PDF)",
    menu_edit: "Édition",
    m_undo: "Annuler Dernière Action",
    m_redo: "Rétablir",
    m_merge: "Fusionner Deux Indices Identiques",
    m_select_all: "Sélectionner Tout le Graphe",
    m_delete: "Supprimer l'Indice Sélectionné",
    menu_tools: "Outils d'Enquête",
    cat_socmint: "📢 Réseaux Sociaux & Annonces",
    t_freeze: "Geler & Certifier la Page (ArchiveBox)",
    t_extract: "Extraire Téléphones & Liens du Texte",
    t_fb_ads: "Inspecter Publicités & Pays Gestionnaire FB",
    t_marketplaces: "Rechercher Annonces Antérieures (Ouedkniss/Avito)",
    cat_phone: "📱 Téléphone, E-mails & Identités",
    t_phone_osn: "Scanner Téléphone sur 100+ Applications",
    t_whatsapp_tg: "Comptes WhatsApp & Telegram Associés",
    t_maigret: "Recherche de Pseudonyme sur 2 500+ Sites (Maigret)",
    t_breach: "Historique de Fuites & Mots de Passe Dérobés",
    cat_web: "🌐 Sites Web & Serveurs",
    t_hidden_code: "Décoder Codes Cachés & Date de Création",
    t_twin_sites: "Trouver les Sites Jumeaux (Même Pixel / Serveur)",
    t_ip_whois: "Identifier Serveur d'Hébergement & WHOIS",
    cat_media: "🖼️ Médias, Visages & Audio",
    t_sherloq: "Détecter Retouches & Falsification (Sherloq)",
    t_faces: "Comparaison Faciale Biométrique (ArcFace 512-d)",
    t_voice: "Transcrire Message Vocal Hors-Ligne (Whisper)",
    cat_police: "🚔 Enquête Policière & Télécoms",
    t_cdr: "Analyser Relevé d'Appels Opérateur (CDR Excel)",
    t_alibi: "Détecter Contradictions d'Alibis & Déplacements",
    menu_view: "Affichage",
    v_graph: "Tableau des Indices (Graphe Visuel)",
    v_timeline: "Chronologie Temporelle",
    v_map: "Carte Géographique des Bornages",
    v_vault: "Coffre-fort des Preuves Certifiées",
    v_dossier: "Rapport Judiciaire Officiel (Procès-Verbal)",
    v_reset: "Réinitialiser Zoom & Centrer",
    menu_layers: "Calques",
    l_verified: "Calque 1 : Faits Vérifiés & Saisies",
    l_osint: "Calque 2 : Pistes & Découvertes Web",
    l_infra: "Calque 3 : Réseau, Serveurs & Pixels",
    l_hypothesis: "Calque 4 : Hypothèses & Suspects",
    menu_ai: "Assistant IA",
    ai_mode_std: "Mode Standard (Règles Sans IA)",
    ai_mode_copilot: "Activer Copilot IA Local (Ollama / Qwen-2.5)",
    ai_suggest_playbook: "Proposer Scénario d'Enquête Automatique",
    ai_summarize: "Rédiger Synthèse Chronologique de l'Affaire",
    case_ref: "Affaire #2026-PNEUS-089 : Escroquerie aux Pneus Michelin",
    case_active: "DOSSIER ACTIF",
    tab_graph: "Tableau d'Affaire",
    tab_timeline: "Chronologie",
    tab_map: "Bornages & Carte",
    tab_vault: "Coffre-fort Preuves (3)",
    tab_dossier: "Procès-Verbal Judiciaire",
    stealth_active: "Mode Furtif : <strong>Actif (IP Protégée)</strong>",
    btn_auto_investigate: "⚡ Enquête Automatique",
    btn_doc: "Doc ↗",
    layers_heading: "Calques d'Investigation",
    show_all: "Tous",
    layer_1: "Faits Vérifiés & Saisies",
    layer_2: "Pistes Découvertes (Web)",
    layer_3: "Serveurs, Pixels & Liens",
    layer_4: "Hypothèses & Suspects",
    quick_tools: "Outils Rapides (60+ Outils)",
    inbox_heading: "Nouveaux Indices Découverts",
    inbox_badge: "7 En Attente",
    inbox_sub: "Indices détectés automatiquement par les briques OSINT en attente de validation.",
    btn_add_graph: "➕ Ajouter au Graphe",
    btn_dismiss: "✕ Écarter (Non pertinent)",
    btn_close: "Fermer",
    clue_added_tag: "✅ Ajouté au Graphe",
    clue_dismissed_tag: "✕ Écarté",
    clue_pending_tag: "⏳ En attente",
    open_full_catalog: "Gérer & Activer les 62 Outils (Arsenal Complet) ↗",
    clue_modal_title: "Arbitrage Judiciaire de l'Indice Découvert",
    clue_source_label: "Outil Source & Détection :",
    clue_proof_label: "Preuve Brute & Empreinte :",
    clue_confidence_label: "Degré de Certitude :",
    clue_action_question: "Validez-vous l'intégration de cet indice au tableau d'enquête judiciaire ?",
    cat_socmint_sub: "10 Outils — Réseaux Sociaux & Annonces",
    cat_phone_sub: "11 Outils — Téléphone, E-mails & Identités",
    cat_web_sub: "12 Outils — Sites Web & Infrastructure",
    cat_media_sub: "11 Outils — Photos, Visages, Audio & SIG",
    cat_police_sub: "9 Outils — Police, CDR & Véhicules",
    cat_finance_sub: "9 Outils — Banques, CCP & Crypto",
    cat_sna: "🕸️ Graphes & Réseaux Criminels (SNA)",
    cat_sna_sub: "5 Outils — Réseaux Criminels & SNA",
    catalog_link: "Catalogue ↗",
    t_freeze_short: "Geler & Certifier la Page",
    t_phone_short: "Scanner Téléphone sur Apps",
    t_web_short: "Décoder Codes & Date Web",
    t_face_short: "Comparer Visages Profils",
    t_twin_short: "Découvrir Sites Jumeaux",
    history_heading: "Journal des Actions",
    actions_count: "4 Actions",
    h1_title: "10:15 • Annonce FB Enregistrée",
    h1_desc: "Post Marketplace #98124 ajouté au tableau",
    h2_title: "10:16 • Extraction Automatique",
    h2_desc: "Numéro +213 555 019 283 et Lien découverts",
    h3_title: "10:18 • Scan Téléphonique OSINT",
    h3_desc: "Comptes Telegram @amine_import et IG associés",
    h4_title: "10:22 • Suspect Identifié",
    h4_desc: "Profil Amine B. rattaché avec 92% de confiance",
    step_progression: "Étapes d'Enquête :",
    step_1: "1. Post FB",
    step_2: "2. Lien & Tél.",
    step_3: "3. Code Web & Réseaux",
    step_4: "4. Suspect Identifié",
    conf_filter: "Seuil de Certitude :",
    timeline_title: "Chronologie des Événements & Preuves",
    timeline_subtitle: "Reconstitution minutieuse de la création de la page Facebook, du site de commande, de la publication de l'annonce et des connexions.",
    time_e1_date: "OCTOBRE 2026",
    time_e1_title: "Création de la Page Facebook \"Pneus Promo\"",
    time_e1_desc: "Enregistrée par un profil administrateur localisé à Alger.",
    time_e2_date: "01 NOV 2026 • 14:22:08 UTC",
    time_e2_title: "Création du Bon de Commande sur le Site Frauduleux",
    time_e2_desc: "Génération du code 672f9a10c8b4a100129b4412 sur le domaine promo-pneus-express.shop.",
    time_e3_date: "08 NOV 2026 • 19:42:00 UTC",
    time_e3_title: "Publication de l'Annonce #98124 (Liquidation Michelin)",
    time_e3_desc: "L'escroc publie l'offre avec demande d'acompte CCP et contact WhatsApp +213 555 019 283.",
    time_e4_date: "10 NOV 2026 • 10:15:00 UTC",
    time_e4_title: "Identification Complète du Suspect Amine B.",
    time_e4_desc: "Rapprochement avec le compte Telegram @amine_import et deux plaintes d'escroquerie antérieures.",
    map_title: "Carte SIG des Bornages & Localisations",
    map_desc: "Visualisation des antennes relais Ooredoo connectées et des avis Google Maps laissés par l'adresse e-mail rattachée.",
    map_hotspot: "📍 Secteur Prioritaire : <strong>Bab Ezzouar / Alger (3 Éléments Liés)</strong>",
    map_m1: "Antenne Ooredoo #DZ-ALG-049 (Bab Ezzouar)",
    map_m1_sub: "Ligne active lors de la publication le 8 nov",
    map_m2: "Avis Google Maps (Magasin Pièces Auto)",
    map_m2_sub: "Avis public laissé par le compte Gmail lié",
    vault_title: "Coffre-fort des Preuves Certifiées (Inaltérable WORM)",
    vault_desc: "Toutes les captures d'annonces, pages web et photos sont scellées avec une empreinte cryptographique. Même en cas de suppression en ligne, vos pièces sont conservées intactes pour le tribunal.",
    v_p1_title: "Capture Post FB #98124",
    v_p1_desc: "Capture d'écran intégrale et archive WARC figées le 10 nov 2026 à 10:15 UTC.",
    v_status: "État : Scellé Inaltérable",
    v_btn_view: "Consulter la Capture Figée",
    v_p2_title: "Copie du Site Frauduleux",
    v_p2_desc: "Code source HTML, formulaires de commande et scripts de promo-pneus-express.shop.",
    v_btn_web: "Explorer la Copie Hors-Ligne",
    v_p3_title: "3 Photos de Pneus en Entrepôt",
    v_p3_desc: "Photos JPEG publiées par l'escroc avec métadonnées EXIF et correspondances d'images volées.",
    v_p3_match: "Photos Volées Détectées (100%)",
    v_btn_photo: "Examiner Métadonnées EXIF",
    rep_header: "RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE",
    rep_sub: "MINISTÈRE DE LA JUSTICE • SECTION CYBERCRIMINALITÉ",
    rep_doc_title: "PROCÈS-VERBAL DE SYNTHÈSE JUDICIAIRE",
    rep_ref: "DOSSIER :",
    rep_date: "DATE :",
    rep_s1_h: "1. EXPOSÉ DES FAITS & INFRACTION DÉNONCÉE",
    rep_s1_body: "Enquête relative à une escroquerie par moyen électronique (vente fictive de pneumatiques Michelin) commise via Facebook Marketplace. À partir de l'annonce frauduleuse #98124, les investigations numériques ont permis d'extraire la ligne mobile +213 555 019 283 et le site de commande promo-pneus-express.shop.",
    rep_s2_h: "2. ÉLÉMENTS DE CHARGE & ATTRIBUTION DE L'IDENTITÉ",
    rep_s2_body: "L'exploitation OSINT a établi que cette ligne téléphonique est rattachée au compte Telegram @amine_import (Identifiant numérique 519283741) et au compte Instagram @auto_pieces_pro. La comparaison biométrique faciale a confirmé une concordance de 89% entre les photographies de profil. De plus, le code interne du site web révèle une mise en service le 1er novembre 2026 à 14h22 UTC avec partage du traceur publicitaire #88419203314 sur deux autres sites d'escroquerie.",
    rep_act_h: "PROPOSITIONS DE MESURES JUDICIAIRES :",
    rep_act_list: `
      <li>Réquisition judiciaire auprès de l'opérateur Ooredoo pour identification du titulaire de la ligne +213 555 019 283.</li>
      <li>Réquisition auprès d'Algérie Poste pour gel et identification du compte CCP communiqué pour le versement de l'acompte.</li>
      <li>Demande de préservation et d'adresses IP de connexion auprès de Meta Platforms pour la page #1000894120551.</li>
    `,
    rep_sig: "L'Officier de Police Judiciaire Enquêteur : <strong>Adel M.</strong>",
    rep_seal: "Scellé Numérique RFC 3161 : <code>CERTIFIÉ CONFORME</code>",
    status_ready: "Système prêt • 8 Indices chargés sur le tableau • Prêt pour vos actions d'enquête",
    status_sim: "Simulation : <strong>Affaire Arnaque Pneus</strong>",
    status_badge: "Maquette Active",
    modal_confirm: "Confirmer & Intégrer au Tableau",
    run_tool: "▶ Lancer l'Outil d'Investigation"
  },

  ar: {
    menu_file: "ملف القضية",
    m_new_case: "قضية تحقيق جديدة...",
    m_open_case: "فتح قضية سابقة...",
    m_save: "حفظ القضية",
    m_save_as: "حفظ باسم...",
    m_import: "استيراد أدلة (سجلات هاتف، صور، روابط)",
    m_export_pdf: "تصدير التقرير القضائي (PDF)",
    menu_edit: "تحرير",
    m_undo: "تراجع عن آخر إجراء",
    m_redo: "إعادة",
    m_merge: "دمج دليلين متطابقين",
    m_select_all: "تحديد كل المخطط",
    m_delete: "حذف الدليل المحدد",
    menu_tools: "أدوات التحقيق",
    cat_socmint: "📢 شبكات التواصل والإعلانات",
    t_freeze: "تجميد وتوثيق الصفحة قانونياً (ArchiveBox)",
    t_extract: "استخراج الأرقام والروابط تلقائياً من المنشور",
    t_fb_ads: "فحص الإعلانات الممولة وبلد مدير الصفحة",
    t_marketplaces: "البحث في إعلانات واد كنيس وأفيتو السابقة",
    cat_phone: "📱 الهاتف، البريد والهوية",
    t_phone_osn: "فحص تسجيل الهاتف في أكثر من 100 تطبيق",
    t_whatsapp_tg: "كشف حسابات واتساب وتلغرام المرتبطة",
    t_maigret: "البحث عن الاسم المستعار في 2500+ موقع (Maigret)",
    t_breach: "البحث في التسريبات وقواعد البيانات المخترقة",
    cat_web: "🌐 المواقع، الرموز والخوادم",
    t_hidden_code: "فك الرموز المخفية وتاريخ إنشاء الموقع",
    t_twin_sites: "كشف المواقع الاحتيالية التوأم (نفس كود التتبع)",
    t_ip_whois: "تحديد خادم الاستضافة وعناوين IP وسجلات WHOIS",
    cat_media: "🖼️ الصور، الوجوه والصوتيات",
    t_sherloq: "فحص تزوير وتعديل الصور والإيصالات (Sherloq)",
    t_faces: "مقارنة الوجوه بيومترياً بين الحسابات (ArcFace)",
    t_voice: "تفريغ التسجيلات الصوتية محلياً دون إنترنت (Whisper)",
    cat_police: "🚔 التحقيق الميداني والاتصالات",
    t_cdr: "تحليل كشف المكالمات الهاتفية (ملف إكسل CDR)",
    t_alibi: "كشف تناقضات حجة الغياب ومسارات التنقل",
    menu_view: "عرض",
    v_graph: "مخطط الأدلة المرئي (الرسم البياني)",
    v_timeline: "الخط الزمني للأحداث",
    v_map: "الخريطة الجغرافية وهوائيات الاتصال",
    v_vault: "خزينة الأدلة الرقمية الموثقة",
    v_dossier: "محضر التحقيق القضائي الرسمي",
    v_reset: "إعادة ضبط التكبير والمركز",
    menu_layers: "الطبقات",
    l_verified: "الطبقة 1: أدلة مؤكدة ومحجوزات رسمية",
    l_osint: "الطبقة 2: خيوط واستخبارات الإنترنت (OSINT)",
    l_infra: "الطبقة 3: الخوادم، الرموز وأكواد التتبع",
    l_hypothesis: "الطبقة 4: فرضيات المشتبه بهم",
    menu_ai: "المساعد الذكي (AI)",
    ai_mode_std: "النمط القياسي (قواعد منطقية دون ذكاء اصطناعي)",
    ai_mode_copilot: "تفعيل المساعد الذكي المحلي (Ollama / Qwen-2.5)",
    ai_suggest_playbook: "اقتراح خطة تحقيق متسلسلة تلقائياً",
    ai_summarize: "كتابة ملخص زمني شامل للقضية",
    case_ref: "قضية رقم #2026-عجلات-089: احتيال بيع إطارات ميشلان",
    case_active: "قضية جارية",
    tab_graph: "مخطط الأدلة",
    tab_timeline: "الخط الزمني",
    tab_map: "الخريطة وهوائيات البث",
    tab_vault: "خزينة الأدلة (3)",
    tab_dossier: "المحضر القضائي",
    stealth_active: "وضع التخفي: <strong>مفعل (عنوان IP محمي)</strong>",
    btn_auto_investigate: "⚡ التحقيق التلقائي الشامل",
    btn_doc: "الوثائق ↗",
    layers_heading: "طبقات التحقيق",
    show_all: "عرض الكل",
    layer_1: "الأدلة المؤكدة والمحجوزات",
    layer_2: "الخيوط المكتشفة من الويب",
    layer_3: "الخوادم وأكواد التتبع والروابط",
    layer_4: "فرضيات وهوية المشتبه به",
    quick_tools: "أدوات التحقيق السريعة (60+ أداة)",
    inbox_heading: "الأدلة الجديدة المكتشفة",
    inbox_badge: "7 قيد المعاينة",
    inbox_sub: "خيوط استخرجتها الأدوات الآلية وتنتظر مصادقة ضابط التحقيق لإضافتها للمخطط.",
    btn_add_graph: "➕ إضافة إلى المخطط",
    btn_dismiss: "✕ استبعاد (غير ذي صلة)",
    btn_close: "إغلاق",
    clue_added_tag: "✅ تمت الإضافة للمخطط",
    clue_dismissed_tag: "✕ مستبعد",
    clue_pending_tag: "⏳ قيد المعاينة",
    open_full_catalog: "إدارة وتفعيل 62 أداة (الترسانة الكاملة) ↗",
    clue_modal_title: "المصادقة القضائية على الدليل المكتشف",
    clue_source_label: "أداة الاستخراج والتوقيت:",
    clue_proof_label: "الدليل التقني الخام والبيانات:",
    clue_confidence_label: "نسبة اليقين المقدرة:",
    clue_action_question: "هل تصادق على إدراج هذا العنصر في مخطط التحقيق القضائي الرسمي؟",
    cat_socmint_sub: "10 أدوات — شبكات التواصل والإعلانات",
    cat_phone_sub: "11 أداة — الهاتف، البريد والهوية",
    cat_web_sub: "12 أداة — المواقع، الرموز والخوادم",
    cat_media_sub: "11 أداة — الصور، الوجوه والصوتيات",
    cat_police_sub: "9 أدوات — التحقيق الميداني والاتصالات والمركبات",
    cat_finance_sub: "9 أدوات — البنوك، البريد والعملات الرقمية",
    cat_sna: "🕸️ تحليل الشبكات الاجتماعية والمخططات الجنائية (SNA)",
    cat_sna_sub: "5 أدوات — تحليل الشبكات الإجرامية وتحديد الرؤوس المدبرة",
    catalog_link: "دليل الأدوات ↗",
    t_freeze_short: "تجميد وتوثيق الصفحة",
    t_phone_short: "فحص الهاتف في التطبيقات",
    t_web_short: "فك رموز وتاريخ الموقع",
    t_face_short: "مقارنة وجوه الحسابات",
    t_twin_short: "كشف المواقع التوأم",
    history_heading: "سجل إجراءات التحقيق",
    actions_count: "4 إجراءات",
    h1_title: "10:15 • تسجيل إعلان فيسبوك",
    h1_desc: "إضافة منشور البيع #98124 إلى المخطط",
    h2_title: "10:16 • استخراج تلقائي للأدلة",
    h2_desc: "استخراج الهاتف +213 555 019 283 والرابط",
    h3_title: "10:18 • مسح استخباراتي للهاتف",
    h3_desc: "ربط حساب تلغرام @amine_import وإنستغرام",
    h4_title: "10:22 • تحديد هوية المشتبه به",
    h4_desc: "تطابق المشتبه به أمين ب. بنسبة يقين 92%",
    step_progression: "مراحل تقدم التحقيق:",
    step_1: "1. منشور فيسبوك",
    step_2: "2. الرابط والهاتف",
    step_3: "3. رموز الموقع والحسابات",
    step_4: "4. تحديد المشتبه به",
    conf_filter: "مستوى اليقين المطلوب:",
    timeline_title: "الخط الزمني لتسلسل الوقائع والأدلة",
    timeline_subtitle: "إعادة بناء دقيقة لتاريخ إنشاء صفحة فيسبوك، وموقع الطلب، ونشر الإعلان، والاتصالات الهاتفية.",
    time_e1_date: "أكتوبر 2026",
    time_e1_title: "إنشاء صفحة فيسبوك \"Pneus Promo\"",
    time_e1_desc: "تم تسجيل الصفحة بواسطة حساب مسؤول يتواجد في ولاية الجزائر.",
    time_e2_date: "01 نوفمبر 2026 • 14:22:08 UTC",
    time_e2_title: "إنشاء استمارة الطلب على الموقع الاحتيالي",
    time_e2_desc: "توليد كود الطلب 672f9a10c8b4a100129b4412 على النطاق promo-pneus-express.shop.",
    time_e3_date: "08 نوفمبر 2026 • 19:42:00 UTC",
    time_e3_title: "نشر إعلان البيع الاحتيالي #98124 (تخفيضات ميشلان)",
    time_e3_desc: "نشر الإعلان مع اشتراط دفع عربون عبر الحساب البريدي الجاري CCP ورقم الواتساب +213 555 019 283.",
    time_e4_date: "10 نوفمبر 2026 • 10:15:00 UTC",
    time_e4_title: "تحديد هوية المشتبه به أمين ب. بالكامل",
    time_e4_desc: "ربط الرقم بحساب تلغرام @amine_import وشكويين سابقتين في النصب والاحتيال.",
    map_title: "خريطة نظم المعلومات الجغرافية وهوائيات البث",
    map_desc: "تحديد مواقع وهوائيات شبكة أوريدو المتصلة والمراجعات المنشورة عبر خرائط جوجل من البريد المرتبط.",
    map_hotspot: "📍 المنطقة ذات الأولوية: <strong>باب الزوار / الجزائر العاصمة (3 أدلة مرتبطة)</strong>",
    map_m1: "هوائي أوريدو #DZ-ALG-049 (باب الزوار)",
    map_m1_sub: "الخط كان نشطاً أثناء نشر الإعلان يوم 8 نوفمبر",
    map_m2: "مراجعة خرائط جوجل (محل قطع غيار)",
    map_m2_sub: "مراجعة عامة تركها حساب الجيميل المرتبط",
    vault_title: "خزينة الأدلة الرقمية الموثقة (قفل قانوني WORM)",
    vault_desc: "جميع لقطات الإعلانات وصفحات الويب والصور مختومة ببصمة رقمية مشفرة. حتى لو قام المحتال بحذفها من الإنترنت، ستبقى أدلتك سليمة تماماً أمام المحكمة.",
    v_p1_title: "توثيق منشور فيسبوك #98124",
    v_p1_desc: "لقطة شاشة كاملة مع أرشيف WARC تم تجميدها يوم 10 نوفمبر 2026 في تمام 10:15 UTC.",
    v_status: "الحالة: دليل موثق غير قابل للتعديل",
    v_btn_view: "معاينة اللقطة الموثقة",
    v_p2_title: "نسخة من الموقع الاحتيالي",
    v_p2_desc: "الكود المصدري واستمارات الطلب والبرمجيات الخاصة بـ promo-pneus-express.shop.",
    v_btn_web: "تصفح النسخة المحفوظة دون إنترنت",
    v_p3_title: "3 صور لإطارات داخل مستودع",
    v_p3_desc: "صور نشرها المحتال مع بيانات الكاميرا EXIF وإثبات سرقتها من موقع أجنبي.",
    v_p3_match: "تم تأكيد سرقة الصور (تطابق 100%)",
    v_btn_photo: "فحص بيانات الكاميرا EXIF",
    rep_header: "الجمهورية الجزائرية الديمقراطية الشعبية",
    rep_sub: "وزارة العدل • مصلحة مكافحة الجريمة الإلكترونية والسيبرانية",
    rep_doc_title: "محضر نهاية التحقيق والتحريات القضائية",
    rep_ref: "ملف قضية رقم:",
    rep_date: "التاريخ:",
    rep_s1_h: "1. عرض الوقائع والجريمة المنسوبة",
    rep_s1_body: "في إطار معالجة قضية نصب واحتيال باستعمال تكنولوجيات الإعلام والاتصال (بيع وهمي لإطارات سيارات ميشلان) عبر فيسبوك ماركت بليس. انطلاقاً من المنشور رقم #98124، أسفرت التحريات الرقمية عن استخراج رقم الهاتف النقال +213 555 019 283 وموقع الطلب الاحتيالي promo-pneus-express.shop.",
    rep_s2_h: "2. عناصر الإدانة وتحديد هوية المشتبه به",
    rep_s2_body: "أثبتت التحريات الاستخباراتية مفتوحة المصدر أن رقم الهاتف مرتبط بحساب تلغرام @amine_import وحساب إنستغرام @auto_pieces_pro. كما أكدت المقارنة البيومترية تطابق ملامح الوجه بنسبة 89% بين الصور. وأظهر الفحص التقني للموقع أنه أُنشئ يوم 1 نوفمبر 2026 ويشترك في نفس كود التتبع الإعلاني #88419203314 مع موقعين احتياليين آخرين.",
    rep_act_h: "الإجراءات القضائية المقترحة على النيابة العامة:",
    rep_act_list: `
      <li>تسخير قضائي لمتعامل الهاتف النقال أوريدو لتحديد هوية صاحب الشريحة رقم +213 555 019 283.</li>
      <li>تسخير بريد الجزائر لتجميد الحساب البريدي الجاري وتحديد هوية المستفيد من العربون.</li>
      <li>طلب الحفظ وتحديد عناوين الـ IP الخاصة بمدير صفحة فيسبوك #1000894120551 عبر القنوات المعتمدة.</li>
    `,
    rep_sig: "ضابط الشرطة القضائية المحقق: <strong>عادل م.</strong>",
    rep_seal: "الختم الرقمي المشفر RFC 3161: <code>مطابق للأصل وصحيح</code>",
    status_ready: "النظام جاهز • 8 أدلة محملة على المخطط • بانتظار إجراءات المحقق",
    status_sim: "محاكاة جارية: <strong>قضية احتيال الإطارات</strong>",
    status_badge: "المحاكاة نشطة",
    modal_confirm: "تأكيد وإدراج الدليل في المخطط",
    run_tool: "▶ تشغيل أداة التحقيق"
  },

  en: {
    menu_file: "Case File",
    m_new_case: "New Case Investigation...",
    m_open_case: "Open Existing Case...",
    m_save: "Save Case",
    m_save_as: "Save As...",
    m_import: "Import Clues (CDR, Photos, Links)",
    m_export_pdf: "Export Court Report (PDF)",
    menu_edit: "Edit",
    m_undo: "Undo Last Action",
    m_redo: "Redo",
    m_merge: "Merge Duplicate Clues",
    m_select_all: "Select Entire Graph",
    m_delete: "Delete Selected Clue",
    menu_tools: "Investigation Tools",
    cat_socmint: "📢 Social Media & Ads",
    t_freeze: "Freeze & Certify Page (ArchiveBox)",
    t_extract: "Extract Phone Numbers & Links from Text",
    t_fb_ads: "Inspect Facebook Ads & Manager Country",
    t_marketplaces: "Search Prior Listings (Ouedkniss/Avito)",
    cat_phone: "📱 Phone, Email & Identity",
    t_phone_osn: "Scan Phone Across 100+ Applications",
    t_whatsapp_tg: "Associated WhatsApp & Telegram Profiles",
    t_maigret: "Username Search on 2,500+ Sites (Maigret)",
    t_breach: "Historical Breaches & Leaked Credentials",
    cat_web: "🌐 Websites & Servers",
    t_hidden_code: "Decode Hidden Codes & Creation Date",
    t_twin_sites: "Find Twin Scam Websites (Shared Pixel)",
    t_ip_whois: "Identify Hosting Server & WHOIS",
    cat_media: "🖼️ Media, Faces & Audio",
    t_sherloq: "Detect Tampering & Forgery (Sherloq)",
    t_faces: "Biometric Face Comparison (ArcFace 512-d)",
    t_voice: "Transcribe Voice Note Offline (Whisper)",
    cat_police: "🚔 Police Fieldwork & Telecom",
    t_cdr: "Analyze Operator Call Sheet (CDR Excel)",
    t_alibi: "Detect Alibi & Movement Contradictions",
    menu_view: "View",
    v_graph: "Case Board (Visual Graph)",
    v_timeline: "Chronological Timeline",
    v_map: "Geospatial & Cell Tower Map",
    v_vault: "Certified Evidence Safe",
    v_dossier: "Official Judicial Police Report",
    v_reset: "Reset Zoom & Center",
    menu_layers: "Layers",
    l_verified: "Layer 1: Verified Facts & Evidence",
    l_osint: "Layer 2: Online Discoveries (OSINT)",
    l_infra: "Layer 3: Network, Servers & Pixels",
    l_hypothesis: "Layer 4: Suspect Theories & Hypotheses",
    menu_ai: "AI Copilot",
    ai_mode_std: "Standard Mode (Rules Without AI)",
    ai_mode_copilot: "Activate Local AI Copilot (Ollama / Qwen-2.5)",
    ai_suggest_playbook: "Propose Automated Investigation Playbook",
    ai_summarize: "Draft Chronological Case Summary",
    case_ref: "Case #2026-TYRES-089: Michelin Tyre Advance-Fee Fraud",
    case_active: "ACTIVE CASE",
    tab_graph: "Case Board",
    tab_timeline: "Timeline",
    tab_map: "Cell Towers & Map",
    tab_vault: "Evidence Safe (3)",
    tab_dossier: "Court Police Report",
    stealth_active: "Stealth Mode: <strong>Active (Protected IP)</strong>",
    btn_auto_investigate: "⚡ Auto-Investigate",
    btn_doc: "Doc ↗",
    layers_heading: "Investigation Layers",
    show_all: "Show All",
    layer_1: "Verified Facts & Evidence",
    layer_2: "Online Discoveries (Web)",
    layer_3: "Servers, Pixels & Links",
    layer_4: "Suspect Theories & Hypotheses",
    quick_tools: "Quick Tools (60+ Tools)",
    inbox_heading: "Discovered Clues Inbox",
    inbox_badge: "7 Pending Review",
    inbox_sub: "Clues surfaced by background tools awaiting investigator arbitration and board placement.",
    btn_add_graph: "➕ Add to Graph",
    btn_dismiss: "✕ Dismiss (Irrelevant)",
    btn_close: "Close",
    clue_added_tag: "✅ Added to Board",
    clue_dismissed_tag: "✕ Dismissed",
    clue_pending_tag: "⏳ Pending",
    open_full_catalog: "Manage & Enable 62 Tools (Full Arsenal) ↗",
    clue_modal_title: "Investigator Review of Discovered Clue",
    clue_source_label: "Detection Tool & Timestamp:",
    clue_proof_label: "Raw Evidentiary Artifact & Hash:",
    clue_confidence_label: "Estimated Confidence:",
    clue_action_question: "Do you approve placing this evidentiary item onto the judicial investigation board?",
    cat_socmint_sub: "10 Tools — Social Media & Listings",
    cat_phone_sub: "11 Tools — Phone, Email & Identities",
    cat_web_sub: "12 Tools — Websites & Infrastructure",
    cat_media_sub: "11 Tools — Photos, Faces, Audio & GIS",
    cat_police_sub: "9 Tools — Police, CDR & Vehicles",
    cat_finance_sub: "9 Tools — Banking, CCP & Crypto",
    cat_sna: "🕸️ Criminal Social Network Analysis (SNA)",
    cat_sna_sub: "5 Tools — Criminal Networks & SNA Masterminds",
    catalog_link: "Catalog ↗",
    t_freeze_short: "Freeze & Certify Page",
    t_phone_short: "Scan Phone Across Apps",
    t_web_short: "Decode Web Codes & Date",
    t_face_short: "Compare Profile Faces",
    t_twin_short: "Discover Twin Websites",
    history_heading: "Action History",
    actions_count: "4 Actions",
    h1_title: "10:15 • Facebook Post Logged",
    h1_desc: "Marketplace ad #98124 added to board",
    h2_title: "10:16 • Automatic Clue Extraction",
    h2_desc: "Extracted phone +213 555 019 283 & link",
    h3_title: "10:18 • Phone OSINT Scan",
    h3_desc: "Linked Telegram @amine_import & Instagram",
    h4_title: "10:22 • Suspect Attributed",
    h4_desc: "Suspect Amine B. matched with 92% confidence",
    step_progression: "Investigation Steps:",
    step_1: "1. FB Post",
    step_2: "2. Link & Phone",
    step_3: "3. Web Code & Socials",
    step_4: "4. Identified Suspect",
    conf_filter: "Confidence Threshold:",
    timeline_title: "Timeline of Events & Evidence",
    timeline_subtitle: "Detailed reconstruction of Facebook page creation, order checkout website, post publication, and phone calls.",
    time_e1_date: "OCTOBER 2026",
    time_e1_title: "Creation of Facebook Page \"Pneus Promo\"",
    time_e1_desc: "Registered by administrator account located in Algiers.",
    time_e2_date: "01 NOV 2026 • 14:22:08 UTC",
    time_e2_title: "Creation of Order Form on Scam Website",
    time_e2_desc: "Generated code 672f9a10c8b4a100129b4412 on promo-pneus-express.shop.",
    time_e3_date: "08 NOV 2026 • 19:42:00 UTC",
    time_e3_title: "Publication of Marketplace Ad #98124 (Michelin Tyres)",
    time_e3_desc: "Fraudster published ad demanding advance deposit via Algérie Poste (CCP) and WhatsApp +213 555 019 283.",
    time_e4_date: "10 NOV 2026 • 10:15:00 UTC",
    time_e4_title: "Full Attribution of Suspect Amine B.",
    time_e4_desc: "Correlated phone with Telegram account @amine_import and 2 previous fraud complaints.",
    map_title: "GIS Cell Tower & Geolocation Map",
    map_desc: "Visualization of Ooredoo cell towers and public Google Maps reviews left by linked email account.",
    map_hotspot: "📍 Priority Hotspot: <strong>Bab Ezzouar / Algiers (3 Correlated Clues)</strong>",
    map_m1: "Ooredoo Cell Tower #DZ-ALG-049 (Bab Ezzouar)",
    map_m1_sub: "Phone active during ad publication on Nov 8",
    map_m2: "Google Maps Review (Auto Parts Shop)",
    map_m2_sub: "Public review left by linked Gmail account",
    vault_title: "Certified Evidence Safe (Immutable WORM Storage)",
    vault_desc: "All announcements, web captures, and photos are sealed with a cryptographic digest. Even if deleted online, your copies remain intact for court.",
    v_p1_title: "FB Post #98124 Snapshot",
    v_p1_desc: "Full-page screenshot & WARC archive captured on 10 Nov 2026 at 10:15 UTC.",
    v_status: "Status: Sealed & Immutable",
    v_btn_view: "Inspect Frozen Screenshot",
    v_p2_title: "Copy of Fraudulent Website",
    v_p2_desc: "HTML source code, order forms, and scripts of promo-pneus-express.shop.",
    v_btn_web: "Browse Offline Copy",
    v_p3_title: "3 Warehouse Tyre Photos",
    v_p3_desc: "JPEG photos published by scammer with camera EXIF and stolen image matches.",
    v_p3_match: "Stolen Photos Detected (100% Match)",
    v_btn_photo: "Inspect Camera EXIF Metadata",
    rep_header: "PEOPLE'S DEMOCRATIC REPUBLIC OF ALGERIA",
    rep_sub: "MINISTRY OF JUSTICE • CYBERCRIME INVESTIGATION DIVISION",
    rep_doc_title: "JUDICIAL POLICE INVESTIGATION SUMMARY REPORT",
    rep_ref: "CASE FILE:",
    rep_date: "DATE:",
    rep_s1_h: "1. STATEMENT OF FACTS & ALLEGED OFFENSE",
    rep_s1_body: "Investigation into an advance-fee fraud scheme selling non-existent Michelin tyres on Facebook Marketplace. Starting from Announcement #98124, digital forensics extracted mobile number +213 555 019 283 and fake shop website promo-pneus-express.shop.",
    rep_s2_h: "2. EVIDENTIARY GROUNDS & SUSPECT ATTRIBUTION",
    rep_s2_body: "OSINT intelligence confirmed that this mobile number is linked to Telegram user @amine_import (ID 519283741) and Instagram account @auto_pieces_pro. Biometric facial comparison confirmed an 89% feature match between profile photos. Internal website code revealed creation on 01 Nov 2026 at 14:22 UTC with Ad Tracker #88419203314 shared with two other scam sites.",
    rep_act_h: "PROPOSED JUDICIAL ACTIONS TO THE PROSECUTOR:",
    rep_act_list: `
      <li>Judicial requisition to telecom operator Ooredoo for subscriber details of line +213 555 019 283.</li>
      <li>Judicial requisition to Algérie Poste to freeze and identify the CCP account holder.</li>
      <li>Preservation order to Meta Platforms Inc. for IP login history of Page #1000894120551.</li>
    `,
    rep_sig: "Investigating Judicial Police Officer: <strong>Adel M.</strong>",
    rep_seal: "RFC 3161 Digital Seal: <code>CERTIFIED CONFORMING COPY</code>",
    status_ready: "System ready • 8 Clues on Case Board • Ready for investigator actions",
    status_sim: "Simulation: <strong>Tyre Scam Investigation</strong>",
    status_badge: "Simulation Active",
    modal_confirm: "Confirm & Place Clue on Board",
    run_tool: "▶ Run Investigation Tool"
  }
};

let currentAppLang = 'fr';
let currentMaquetteNode = 'fb_post';
let maquetteStage = 4;
let maquetteLayers = { verified: true, osint: true, infra: true, hypothesis: true };


// =========================================================================
// CANDIDATE INBOX CLUES (7 Discovered Clues for Non-CS Investigator Review)
// =========================================================================
const CANDIDATE_INBOX_CLUES = [
  {
    id: 'clue_voice_darija',
    nodeId: 'voice_darija_node',
    icon: '🎙️',
    layer: 'verified',
    sourceTool: 'Faster-Whisper Darija + Diarisation Vocale',
    sourceToolAr: 'أداة تفريغ الدارجة الجزائرية وتقسيم المتحدثين',
    sourceToolEn: 'Algerian Darija STT + Speaker Diarization',
    confidence: 96,
    status: 'pending',
    parentNode: 'phone_num',
    edgeLabel: { fr: 'Vocal WhatsApp (Darija)', ar: 'تسجيل صوتي بالدارجة', en: 'WhatsApp Voice (Darija)' },
    x: 290,
    y: 360,
    i18n: {
      fr: {
        type: 'Note Vocale WhatsApp Transcrite',
        title: 'Note Vocale Darija (Acompte 10k DA)',
        subtitle: 'Diarisation 2 Voix • Rdv Bab Ezzouar',
        summary: 'Message vocal WhatsApp de 34 secondes échangé entre l\'acheteur et l\'escroc en dialecte algérien (Darija).',
        proof: 'Extrait audio transcrit: "Salam khoya, kayen 4 pneus jdod 48 000 DA l\'ensemble. Abaatli l\'acompte 10 000 DA f BaridiMob wala CCP w njibouhomlek l Bab Ezzouar ghedwa."',
        details: {
          'Langue Détectée': 'Arabe Dialectal Algérien (Darija - 98%)',
          'Locuteurs Identifiés': 'Locuteur 1 (Victime) & Locuteur 2 (Escroc)',
          'Montant Exigé': '10 000 DZD (Acompte sur 48 000 DZD total)',
          'Moyen de Paiement': 'BaridiMob / Compte CCP Algérie Poste',
          'Lieu de Livraison Fictif': 'Bab Ezzouar, Alger',
          'Concordance Vocale': 'Empreinte vocale identique à 94% à la plainte #2026-ESC-041'
        }
      },
      ar: {
        type: 'تسجيل صوتي مفرغ بالدارجة',
        title: 'تسجيل واتساب بالدارجة (عربون 10 آلاف دج)',
        subtitle: 'فصل صوتين • موعد التسليم باب الزوار',
        summary: 'تسجيل صوتي عبر واتساب مدته 34 ثانية متبادل بين الضحية والمحتال بالدارجة الجزائرية.',
        proof: 'النص المفرغ صوتياً: "سلام خويا، كاين 4 بنوات جدد 48 ألف دينار... ابعثلي العربون 10 آلاف دج في بريدي موب ولا CCP ونجيبوهملك لباب الزوار غدوة إن شاء الله."',
        details: {
          'اللهجة المكتشفة': 'الدارجة الجزائرية (بنسبة دقة 98%)',
          'المتحدثون': 'المتحدث 1 (الضحية) والمتحدث 2 (المشتبه به)',
          'المبلغ المطلوب': '10,000 دج كعربون من إجمالي 48,000 دج',
          'طريقة الدفع': 'تطبيق بريدي موب أو حساب CCP',
          'مكان التسليم الوهمي': 'باب الزوار، ولاية الجزائر',
          'البصمة الصوتية': 'تطابق نبرة الصوت بنسبة 94% مع قضية احتيال سابقة'
        }
      },
      en: {
        type: 'Transcribed WhatsApp Voice Note',
        title: 'Darija Voice Note (10k DZD Deposit)',
        subtitle: '2 Speakers Diarized • Bab Ezzouar delivery',
        summary: 'A 34-second WhatsApp voice recording between victim and scammer spoken in Algerian Darija.',
        proof: 'Speech Transcript: "Salam bro, 4 new tyres for 48,000 DA. Send me 10,000 DA deposit on BaridiMob or CCP and we\'ll deliver to Bab Ezzouar tomorrow."',
        details: {
          'Detected Dialect': 'Algerian Darija (98% confidence)',
          'Identified Speakers': 'Speaker 1 (Victim) & Speaker 2 (Suspect)',
          'Demanded Amount': '10,000 DZD advance fee (48,000 DZD total)',
          'Payment Channel': 'BaridiMob / Algeria Post CCP',
          'Stated Meeting Point': 'Bab Ezzouar, Algiers',
          'Acoustic Match': 'Voiceprint matches prior complaint #2026-ESC-041 at 94%'
        }
      }
    }
  },
  {
    id: 'clue_gps_photo',
    nodeId: 'gps_photo_node',
    icon: '📍',
    layer: 'infra',
    sourceTool: 'ExifTool (Métadonnées Photo)',
    sourceToolAr: 'أداة ExifTool (بيانات الصورة الوصفية)',
    sourceToolEn: 'ExifTool (Photo Metadata)',
    confidence: 98,
    status: 'pending',
    parentNode: 'fb_post',
    edgeLabel: { fr: 'GPS extrait photo', ar: 'إحداثيات من الصورة', en: 'GPS from photo' },
    x: 40,
    y: 360,
    i18n: {
      fr: {
        type: 'Coordonnées GPS Photo',
        title: 'Entrepôt Bab Ezzouar (GPS)',
        subtitle: '36.7538° N, 3.0588° E • Alger',
        summary: 'Coordonnées géographiques précises découvertes dans les métadonnées EXIF de la 2ème photo de pneu.',
        proof: 'Tags EXIF: GPSLatitude: 36.753821, GPSLongitude: 3.058814, Camera: Samsung SM-G998B',
        details: {
          'Localisation': 'Bab Ezzouar, Wilaya d\'Alger',
          'Coordonnées': '36.7538° N, 3.0588° E',
          'Appareil Photo': 'Samsung Galaxy S21 Ultra (SM-G998B)',
          'Date de Prise': '08 Nov 2026 à 16:11:42 (3h avant publication)',
          'Pertinence': 'Prouve que les pneus ont été photographiés depuis Bab Ezzouar.'
        }
      },
      ar: {
        type: 'إحداثيات GPS من الصورة',
        title: 'مستودع باب الزوار (GPS)',
        subtitle: '36.7538° شمالاً، 3.0588° شرقاً',
        summary: 'إحداثيات جغرافية دقيقة استخرجت من البيانات الوصفية EXIF للصورة الثانية لإطارات العجلات.',
        proof: 'بيانات EXIF: GPSLatitude: 36.753821, GPSLongitude: 3.058814، هاتف Samsung SM-G998B',
        details: {
          'الموقع': 'باب الزوار، ولاية الجزائر',
          'الإحداثيات': '36.7538° شمالاً، 3.0588° شرقاً',
          'جهاز التصوير': 'Samsung Galaxy S21 Ultra',
          'تاريخ الالتقاط': '08 نوفمبر 2026 الساعة 16:11:42 (قبل النشر بثلاث ساعات)',
          'الأهمية': 'يؤكد أن ملتقط الصورة كان متواجداً في باب الزوار.'
        }
      },
      en: {
        type: 'Photo GPS Coordinates',
        title: 'Bab Ezzouar Warehouse (GPS)',
        subtitle: '36.7538° N, 3.0588° E • Algiers',
        summary: 'Precise geo-coordinates extracted from EXIF tags of tyre photo #2.',
        proof: 'EXIF Tags: GPSLatitude: 36.753821, GPSLongitude: 3.058814, Camera: Samsung SM-G998B',
        details: {
          'Location': 'Bab Ezzouar, Algiers',
          'Coordinates': '36.7538° N, 3.0588° E',
          'Camera Model': 'Samsung Galaxy S21 Ultra',
          'Capture Time': '08 Nov 2026 16:11:42 (3h before post)',
          'Investigative Value': 'Confirms tyre photo was captured in Bab Ezzouar.'
        }
      }
    }
  },
  {
    id: 'clue_truecaller_name',
    nodeId: 'caller_id_node',
    icon: '🆔',
    layer: 'osint',
    sourceTool: 'Caller-ID / Truecaller Sync',
    sourceToolAr: 'دليل المتصلين Truecaller',
    sourceToolEn: 'Caller-ID / Truecaller Sync',
    confidence: 94,
    status: 'pending',
    parentNode: 'phone_num',
    edgeLabel: { fr: 'Annuaire inversé', ar: 'دليل الأسماء', en: 'Reverse directory' },
    x: 290,
    y: 500,
    i18n: {
      fr: {
        type: 'Identité Annuaire Inversé',
        title: 'Amine Pneus Import DZ',
        subtitle: 'Signalé commerce pièces auto',
        summary: 'Nom d\'usage rattaché au numéro +213 555 019 283 dans les bases d\'annuaires communautaires.',
        proof: 'Requête API Caller-ID: Nom enregistré "Amine Pneus Import DZ", Catégorie "Automobile / Pièces"',
        details: {
          'Nom Enregistré': 'Amine Pneus Import DZ',
          'Numéro Associé': '+213 555 019 283',
          'Signalements': '3 signalements pour acomptes encaissés sans livraison',
          'Opérateur': 'Ooredoo Algérie'
        }
      },
      ar: {
        type: 'اسم من الدليل الهاتفي',
        title: 'Amine Pneus Import DZ',
        subtitle: 'مسجل كتاجر قطع غيار سيارات',
        summary: 'الاسم المرتبط بالرقم +213 555 019 283 في قواعد بيانات أدلة الهواتف الجماعية.',
        proof: 'استعلام Caller-ID: الاسم المسجل "Amine Pneus Import DZ"، الفئة "قطع غيار السيارات"',
        details: {
          'الاسم المسجل': 'Amine Pneus Import DZ',
          'الرقم المرتبط': '+213 555 019 283',
          'البلاغات': '3 بلاغات احتيال حول عربون لم يتم تسليم بضاعته',
          'المتعامل': 'أوريدو الجزائر'
        }
      },
      en: {
        type: 'Reverse Directory Identity',
        title: 'Amine Pneus Import DZ',
        subtitle: 'Flagged as auto parts dealer',
        summary: 'Display name linked to phone +213 555 019 283 across crowdsourced directories.',
        proof: 'Caller-ID Query: Registered Name "Amine Pneus Import DZ", Category "Auto / Parts"',
        details: {
          'Registered Name': 'Amine Pneus Import DZ',
          'Linked Number': '+213 555 019 283',
          'Spam Reports': '3 reports for unfulfilled deposits',
          'Telco Operator': 'Ooredoo Algeria'
        }
      }
    }
  },
  {
    id: 'clue_ccp_account',
    nodeId: 'ccp_account_node',
    icon: '💳',
    layer: 'verified',
    sourceTool: 'Validateur CCP Algérie Poste',
    sourceToolAr: 'مدقق حسابات بريد الجزائر (CCP)',
    sourceToolEn: 'Algeria Post CCP Validator',
    confidence: 99,
    status: 'pending',
    parentNode: 'fb_post',
    edgeLabel: { fr: 'Compte acompte', ar: 'حساب استلام العربون', en: 'Deposit account' },
    x: 40,
    y: 500,
    i18n: {
      fr: {
        type: 'Compte Postal & Clé RIP',
        title: 'CCP 0021389274 Clé 45',
        subtitle: 'Titulaire : B. Amine (BaridiMob)',
        summary: 'Compte postal courant extrait du message d\'acompte. Algorithme modulo-100 validé à 100%.',
        proof: 'Formule officielle: 0021389274 Clé 45 -> RIP: 00799999002138927445. Titulaire certifié BaridiMob: Amine B.',
        details: {
          'Numéro CCP': '0021389274 Clé 45',
          'Code RIP': '007 99999 0021389274 45',
          'Établissement': 'Algérie Poste (Centre d\'Alger)',
          'Statut Légal': 'Compte actif utilisé pour recevoir les virements des victimes'
        }
      },
      ar: {
        type: 'حساب بريدي جارٍ ومفتاح RIP',
        title: 'CCP 0021389274 مفتاح 45',
        subtitle: 'صاحب الحساب: ب. أمين (بريدي موب)',
        summary: 'حساب بريدي مستخرج من رسائل طلب العربون. تم التحقق من صحة المفتاح خوارزمياً بنسبة 100%.',
        proof: 'المعادلة الرسمية: 0021389274 مفتاح 45 -> RIP: 00799999002138927445. اسم الحساب في بريدي موب: أمين ب.',
        details: {
          'رقم الحساب الجاري': '0021389274 مفتاح 45',
          'رمز RIP': '007 99999 0021389274 45',
          'المؤسسة': 'بريد الجزائر (مركز بريد الجزائر)',
          'الحالة': 'حساب نشط يستقبل مبالغ الاحتيال من الضحايا'
        }
      },
      en: {
        type: 'Postal Account & RIP Key',
        title: 'CCP 0021389274 Key 45',
        subtitle: 'Account holder: B. Amine (BaridiMob)',
        summary: 'Postal checking account extracted from scam deposit request. Modulo-100 checksum verified 100%.',
        proof: 'Algorithm check: 0021389274 Key 45 -> RIP 00799999002138927445. BaridiMob verified holder: Amine B.',
        details: {
          'CCP Number': '0021389274 Key 45',
          'Full RIP Code': '007 99999 0021389274 45',
          'Institution': 'Algeria Post (Algiers Center)',
          'Status': 'Active account used for receiving victim deposits'
        }
      }
    }
  },
  {
    id: 'clue_twin_site',
    nodeId: 'twin_site_node',
    icon: '🌐',
    layer: 'infra',
    sourceTool: 'Recherche Inversée Pixel Google Analytics',
    sourceToolAr: 'البحث العكسي عن أكواد تتبع جوجل وميتا',
    sourceToolEn: 'Reverse Analytics Pixel Hunter',
    confidence: 92,
    status: 'pending',
    parentNode: 'db_id_node',
    edgeLabel: { fr: 'Même traceur', ar: 'نفس كود التتبع', en: 'Shared tracker' },
    x: 540,
    y: 440,
    i18n: {
      fr: {
        type: 'Site Miroir Frauduleux',
        title: 'promo-pneus-dz.shop',
        subtitle: 'Même Pixel Google G-884192033',
        summary: 'Site jumeau utilisant exactement le même compte Google Analytics et le même serveur IP.',
        proof: 'Traceur partagé: G-88419203314 sur promo-pneus-express.shop et promo-pneus-dz.shop.',
        details: {
          'Nom de Domaine': 'promo-pneus-dz.shop',
          'Identifiant Partagé': 'Google Analytics G-88419203314',
          'Serveur IP': '185.199.108.153 (Même machine)',
          'Objet': 'Boutique jumelle créée pour contourner les signalements'
        }
      },
      ar: {
        type: 'موقع احتيالي توأم',
        title: 'promo-pneus-dz.shop',
        subtitle: 'نفس كود جوجل G-884192033',
        summary: 'موقع احتيالي مطابق يستخدم نفس حساب تحليلات جوجل ونفس خادم الاستضافة تماماً.',
        proof: 'رمز التتبع المشترك: G-88419203314 في كلا الموقعين',
        details: {
          'اسم النطاق': 'promo-pneus-dz.shop',
          'المعرف المشترك': 'Google Analytics G-88419203314',
          'خادم الاستضافة': '185.199.108.153 (نفس السيرفر)',
          'الغرض': 'متجر بديل أُنشئ للالتفاف على بلاغات النصب'
        }
      },
      en: {
        type: 'Twin Scam Website',
        title: 'promo-pneus-dz.shop',
        subtitle: 'Shared Google Tag G-884192033',
        summary: 'Clone website utilizing the exact same Google Analytics tracker and shared IP server.',
        proof: 'Shared tracker: G-88419203314 on promo-pneus-express.shop and promo-pneus-dz.shop.',
        details: {
          'Domain Name': 'promo-pneus-dz.shop',
          'Shared ID': 'Google Analytics G-88419203314',
          'IP Address': '185.199.108.153 (Identical server)',
          'Purpose': 'Backup store created to evade domain takedowns'
        }
      }
    }
  },
  {
    id: 'clue_insta_account',
    nodeId: 'insta_account_node',
    icon: '👤',
    layer: 'osint',
    sourceTool: 'Scan Ignorant + Maigret (Réseaux Sociaux)',
    sourceToolAr: 'أداتي Ignorant و Maigret للشبكات',
    sourceToolEn: 'Ignorant + Maigret Social Scanner',
    confidence: 88,
    status: 'pending',
    parentNode: 'phone_num',
    edgeLabel: { fr: 'Même bio & avatar', ar: 'نفس الصورة والوصف', en: 'Same avatar & bio' },
    x: 540,
    y: 580,
    i18n: {
      fr: {
        type: 'Profil Instagram Découvert',
        title: '@amine_luxury_wheels',
        subtitle: '1 420 Abonnés • Vente jantes',
        summary: 'Compte Instagram professionnel identifié via le numéro de téléphone et la photo de profil correspondante.',
        proof: 'Corrélation faciale 89% avec le profil Telegram et confirmation de synchronisation du carnet d\'adresses.',
        details: {
          'Handle Instagram': '@amine_luxury_wheels',
          'Nom Affiché': 'Amine Vente Pneumatiques & Jantes',
          'Nombre d\'Abonnés': '1 420 followers',
          'Lien en Bio': 'Lien vers le site frauduleux promo-pneus-express.shop'
        }
      },
      ar: {
        type: 'حساب إنستغرام مكتشف',
        title: '@amine_luxury_wheels',
        subtitle: '1420 متابع • بيع العجلات الفاخرة',
        summary: 'حساب إنستغرام تجاري تم كشفه عبر رقم الهاتف وتطابق صورة الملف الشخصي.',
        proof: 'تطابق بيومتري للوجه بنسبة 89% مع حساب تلغرام وتأكيد مزامنة جهات الاتصال.',
        details: {
          'معرف إنستغرام': '@amine_luxury_wheels',
          'الاسم الظاهر': 'Amine Vente Pneumatiques & Jantes',
          'عدد المتابعين': '1420 متابع',
          'الرابط في السيرة': 'يحتوي على رابط الموقع الاحتيالي promo-pneus-express.shop'
        }
      },
      en: {
        type: 'Discovered Instagram Profile',
        title: '@amine_luxury_wheels',
        subtitle: '1,420 Followers • Wheel sales',
        summary: 'Commercial Instagram account tied to the suspect phone and matching profile photo.',
        proof: '89% ArcFace match with Telegram avatar and address-book sync confirmation.',
        details: {
          'Instagram Handle': '@amine_luxury_wheels',
          'Display Name': 'Amine Vente Pneumatiques & Jantes',
          'Follower Count': '1,420 followers',
          'Bio Link': 'Direct link to fraudulent store promo-pneus-express.shop'
        }
      }
    }
  },
  {
    id: 'clue_vehicle_plate',
    nodeId: 'vehicle_plate_node',
    icon: '🚗',
    layer: 'infra',
    sourceTool: 'Reconnaissance de Plaques LAPI (OpenALPR)',
    sourceToolAr: 'قارئ لوحات الترقيم الآلي (LAPI)',
    sourceToolEn: 'LAPI / ANPR Automatic Plate Reader',
    confidence: 95,
    status: 'pending',
    parentNode: 'fb_post',
    edgeLabel: { fr: 'Plaque repérée', ar: 'لوحة الترقيم', en: 'Plate spotted' },
    x: 40,
    y: 640,
    i18n: {
      fr: {
        type: 'Véhicule & Plaque d\'Immatriculation',
        title: 'Fourgon Renault 04829-116-16',
        subtitle: 'Wilaya d\'Alger (16) • Blanc',
        summary: 'Plaque d\'immatriculation algérienne détectée automatiquement à l\'arrière-plan de la photo d\'entrepôt.',
        proof: 'OpenALPR OCR: Numéro "04829 116 16", Modèle: Renault Master Blanc, Année 2016',
        details: {
          'Immatriculation': '04829-116-16',
          'Type Véhicule': 'Fourgon tôlé utilitaire (Renault Master)',
          'Wilaya d\'Immatriculation': 'Alger (16)',
          'Contexte': 'Utilisé pour transporter les quelques lots de pneus exhibés sur les vidéos'
        }
      },
      ar: {
        type: 'مركبة ورقم ترقيم',
        title: 'شاحنة رونو 04829-116-16',
        subtitle: 'ولاية الجزائر (16) • بيضاء اللون',
        summary: 'لوحة ترقيم جزائرية تم التعرف عليها تلقائياً في خلفية إحدى صور الإطارات المنشورة.',
        proof: 'مسح LAPI: رقم اللوحة "04829 116 16"، طراز رونو ماستر أبيض، سنة 2016',
        details: {
          'رقم الترقيم': '04829-116-16',
          'نوع المركبة': 'شاحنة نفعية Renault Master',
          'ولاية الترقيم': 'الجزائر (16)',
          'السياق': 'تُستخدم لنقل عينات الإطارات المصورة في مقاطع الفيديو الاحتيالية'
        }
      },
      en: {
        type: 'Vehicle & License Plate',
        title: 'Renault Van 04829-116-16',
        subtitle: 'Algiers Wilaya (16) • White',
        summary: 'Algerian license plate detected in background of warehouse photo #3 via ANPR OCR.',
        proof: 'OpenALPR OCR: "04829 116 16", Model: Renault Master White, Year 2016',
        details: {
          'Plate Number': '04829-116-16',
          'Vehicle Model': 'Utility cargo van (Renault Master)',
          'Registration Wilaya': 'Algiers (16)',
          'Context': 'Vehicle used to showcase tyre stock in promo clips'
        }
      }
    }
  },
  {
    id: 'clue_cnrc_company',
    nodeId: 'cnrc_company_node',
    icon: '🏢',
    layer: 'hypothesis',
    sourceTool: 'Registre National du Commerce (CNRC)',
    sourceToolAr: 'السجل التجاري الجزائري (CNRC)',
    sourceToolEn: 'National Trade Registry (CNRC)',
    confidence: 85,
    status: 'pending',
    parentNode: 'suspect_hypothesis',
    edgeLabel: { fr: 'Gérant de société', ar: 'مسير الشركة', en: 'Company manager' },
    x: 790,
    y: 340,
    i18n: {
      fr: {
        type: 'Société au Registre du Commerce',
        title: 'SARL PNEUS MEDITERRANEE',
        subtitle: 'Radiée en 2024 • Gérant B. Amine',
        summary: 'Société de négoce de pneumatiques enregistrée au CNRC dont le gérant statutaire est le suspect identifié.',
        proof: 'Extrait CNRC: N° 16/00-0982143B19, Activité: Commerce de gros de pneumatiques, Radiée pour litiges.',
        details: {
          'Dénomination': 'SARL PNEUS MEDITERRANEE',
          'N° Registre Commerce': '16/00-0982143B19',
          'Gérant': 'Amine B.',
          'Siège': 'Zone d\'activité Bab Ezzouar, Alger',
          'Situation': 'Cessation d\'activité après litiges commerciaux'
        }
      },
      ar: {
        type: 'شركة في السجل التجاري',
        title: 'ش.ذ.م.م إطارات البحر الأبيض المتوسط',
        subtitle: 'مشطوبة سنة 2024 • المسير: ب. أمين',
        summary: 'شركة تجارة عجلات مسجلة في السجل التجاري الجزائري كان يديرها نفس المشتبه به قبل شطبها.',
        proof: 'مستخرج CNRC: رقم 16/00-0982143B19، النشاط: بيع العجلات بالجملة، مشطوبة بسبب ديون.',
        details: {
          'اسم الشركة': 'SARL PNEUS MEDITERRANEE',
          'رقم السجل التجاري': '16/00-0982143B19',
          'المسير القانوني': 'أمين ب.',
          'المقر': 'المنطقة الصناعية باب الزوار، الجزائر',
          'الوضعية': 'توقف عن النشاط بعد نزاعات تجارية وقضائية'
        }
      },
      en: {
        type: 'Trade Registry Company',
        title: 'SARL PNEUS MEDITERRANEE',
        subtitle: 'Dissolved 2024 • Manager B. Amine',
        summary: 'Tyre wholesaling company in the National Trade Register where the suspect was primary manager.',
        proof: 'CNRC Record: #16/00-0982143B19, Activity: Tyre wholesaling, Struck off for bad debts.',
        details: {
          'Company Name': 'SARL PNEUS MEDITERRANEE',
          'Registry Number': '16/00-0982143B19',
          'Managing Partner': 'Amine B.',
          'Address': 'Industrial Zone Bab Ezzouar, Algiers',
          'Current State': 'Dissolved after unpaid supplier disputes'
        }
      }
    }
  }
];

// Multilingual Node Definitions for the Canvas
const MULTILINGUAL_NODES = {
  fb_account: {
    id: 'fb_account',
    icon: '👤',
    layer: 'verified',
    stage: 1,
    x: 40,
    y: 60,
    confidence: 100,
    i18n: {
      fr: {
        type: 'Profil Facebook',
        title: 'Pneus Promo Algérie',
        subtitle: 'fb.com/pneus.promo.dz',
        proof: '📸 Capture Certifiée Inaltérable (MinIO)',
        details: {
          'Nom Affiché': 'Pneus Promo Algérie - Livraison 58 Wilayas',
          'ID Page': '1000894120551',
          'Date Création': 'Octobre 2026 (Compte Récent)',
          'Localisation': '1 Administrateur localisé à Alger'
        },
        tools: [
          { icon: '📸', name: 'Geler & Certifier la Page', desc: 'Archive WARC et capture d\'écran certifiée avant suppression.' },
          { icon: '🔎', name: 'Recherche d\'Alias sur 2 500+ Sites', desc: 'Vérifie où le pseudonyme est utilisé ailleurs.' },
          { icon: '📢', name: 'Historique des Publicités Meta', desc: 'Extrait les campagnes sponsorisées payées par cette page.' }
        ]
      },
      ar: {
        type: 'صفحة فيسبوك',
        title: 'Pneus Promo Algérie',
        subtitle: 'fb.com/pneus.promo.dz',
        proof: '📸 توثيق رسمي غير قابل للتعديل (MinIO)',
        details: {
          'اسم العرض': 'Pneus Promo Algérie - توصيل 58 ولاية',
          'معرف الصفحة': '1000894120551',
          'تاريخ الإنشاء': 'أكتوبر 2026 (حساب حديث)',
          'الموقع الجغرافي': 'مسؤول واحد متواجد في ولاية الجزائر'
        },
        tools: [
          { icon: '📸', name: 'تجميد وتوثيق الصفحة قانونياً', desc: 'حفظ أرشيف WARC ولقطة شاشة موثقة قبل حذفها.' },
          { icon: '🔎', name: 'البحث عن الاسم في 2500+ موقع', desc: 'معرفة الحسابات الأخرى التي تستخدم نفس الاسم.' },
          { icon: '📢', name: 'سجل إعلانات ميتا الممولة', desc: 'استخراج جميع الحملات الإعلانية المدفوعة لهذه الصفحة.' }
        ]
      },
      en: {
        type: 'Facebook Profile',
        title: 'Pneus Promo Algérie',
        subtitle: 'fb.com/pneus.promo.dz',
        proof: '📸 Tamper-Proof Certified Snapshot (MinIO)',
        details: {
          'Display Name': 'Pneus Promo Algérie - Delivery 58 Wilayas',
          'Page ID': '1000894120551',
          'Created At': 'October 2026 (New Profile)',
          'Manager Location': '1 Administrator located in Algiers'
        },
        tools: [
          { icon: '📸', name: 'Freeze & Certify Page', desc: 'Saves court-admissible WARC archive and snapshot.' },
          { icon: '🔎', name: 'Username Search on 2,500+ Sites', desc: 'Checks where the username is used across social apps.' },
          { icon: '📢', name: 'Check Meta Sponsored Ads', desc: 'Extracts paid campaigns from Meta Ad Library.' }
        ]
      }
    }
  },
  fb_post: {
    id: 'fb_post',
    icon: '📢',
    layer: 'verified',
    stage: 1,
    x: 40,
    y: 200,
    confidence: 100,
    i18n: {
      fr: {
        type: 'Annonce Marketplace',
        title: 'Post #98124 (Michelin -60%)',
        subtitle: 'Demande acompte CCP obligatoire',
        proof: '📸 Capture Certifiée Inaltérable (MinIO)',
        details: {
          'Texte de l\'offre': '"Liquidation stock pneus Michelin! Commandez sur promo-pneus-express.shop ou WhatsApp +213 555 019 283. Acompte CCP requis."',
          'Date de Publication': '08 Nov 2026 à 19:42 UTC',
          'Photos Jointes': '3 Photos d\'Entrepôt de Pneus (Images Volées)'
        },
        tools: [
          { icon: '🔍', name: 'Extraire Numéros & Liens du Texte', desc: 'Extrait automatiquement l\'URL, le téléphone et le CCP.' },
          { icon: '🖼️', name: 'Vérifier si Photos Sont Volées', desc: 'Recherche inversée pour prouver la réutilisation de photos du web.' }
        ]
      },
      ar: {
        type: 'إعلان فيسبوك ماركت بليس',
        title: 'إعلان #98124 (ميشلان -60%)',
        subtitle: 'يشترط دفع عربون عبر بريد الجزائر CCP',
        proof: '📸 توثيق رسمي غير قابل للتعديل (MinIO)',
        details: {
          'نص الإعلان': '"تصفية مخزون إطارات ميشلان! اطلب عبر promo-pneus-express.shop أو واتساب +213 555 019 283. دفع عربون CCP إلزامي."',
          'تاريخ النشر': '08 نوفمبر 2026 في تمام 19:42 UTC',
          'الصور المرفقة': '3 صور لمستودع إطارات (صور مسروقة من الإنترنت)'
        },
        tools: [
          { icon: '🔍', name: 'استخراج الأرقام والروابط تلقائياً', desc: 'سحب رقم الهاتف، الرابط وحساب الـ CCP من النص.' },
          { icon: '🖼️', name: 'التحقق من سرقة وتعديل الصور', desc: 'بحث عكسي لإثبات أن صور المستودع مأخوذة من موقع آخر.' }
        ]
      },
      en: {
        type: 'Marketplace Announcement',
        title: 'Post #98124 (Michelin -60%)',
        subtitle: 'Demands advance CCP deposit',
        proof: '📸 Tamper-Proof Certified Snapshot (MinIO)',
        details: {
          'Post Text': '"Liquidation stock pneus Michelin! Order on promo-pneus-express.shop or WhatsApp +213 555 019 283. Deposit required."',
          'Posted At': '08 Nov 2026 at 19:42 UTC',
          'Attached Photos': '3 Warehouse Photos (Stolen Stock Images)'
        },
        tools: [
          { icon: '🔍', name: 'Extract Phone Numbers & Links', desc: 'Automatically extracts URLs, phone numbers, and CCP bank numbers.' },
          { icon: '🖼️', name: 'Check if Photos Are Stolen or Edited', desc: 'Reverse image search proving stock warehouse photo reuse.' }
        ]
      }
    }
  },
  scam_url: {
    id: 'scam_url',
    icon: '🌐',
    layer: 'osint',
    stage: 2,
    x: 290,
    y: 60,
    confidence: 98,
    i18n: {
      fr: {
        type: 'Faux Site de Commande',
        title: 'promo-pneus-express.shop',
        subtitle: 'Formulaire de commande frauduleux',
        proof: '🌐 Copie Intégrale Sauvegardée',
        details: {
          'Lien Complet': 'https://promo-pneus-express.shop/order?uid=672f9a10...',
          'Date Enregistrement': '01 Nov 2026',
          'Indices Cachés': 'Identifiant ObjectId et Pixel Meta #88419203314'
        },
        tools: [
          { icon: '🏷️', name: 'Décoder Code Caché & Date Exacte', desc: 'Décode l\'identifiant en horodatage : 1er nov à 14h22 UTC.' },
          { icon: '🕸️', name: 'Trouver les Sites Jumeaux', desc: 'Trouve d\'autres sites utilisant ce même Pixel Meta.' }
        ]
      },
      ar: {
        type: 'موقع طلب احتيالي',
        title: 'promo-pneus-express.shop',
        subtitle: 'استمارة طلب وهمية لسرقة الضحايا',
        proof: '🌐 تم حفظ نسخة كاملة من الموقع',
        details: {
          'الرابط الكامل': 'https://promo-pneus-express.shop/order?uid=672f9a10...',
          'تاريخ التسجيل': '01 نوفمبر 2026',
          'الرموز المخفية': 'كود ObjectId وكود تتبع فيسبوك بيكسل #88419203314'
        },
        tools: [
          { icon: '🏷️', name: 'فك الرمز وتاريخ الإنشاء الدقيق', desc: 'يحول الكود إلى تاريخ إنشاء دقيق: 1 نوفمبر في 14:22 UTC.' },
          { icon: '🕸️', name: 'كشف المواقع الاحتيالية التوأم', desc: 'البحث عن مواقع أخرى تستخدم نفس كود فيسبوك بيكسل.' }
        ]
      },
      en: {
        type: 'Fake Shop Website',
        title: 'promo-pneus-express.shop',
        subtitle: 'Fake order checkout form',
        proof: '🌐 Full Website Snapshot Preserved',
        details: {
          'Full Link': 'https://promo-pneus-express.shop/order?uid=672f9a10...',
          'Registered On': '01 Nov 2026',
          'Embedded Clues': 'MongoDB ObjectId & Meta Pixel ID #88419203314'
        },
        tools: [
          { icon: '🏷️', name: 'Decode Hidden Code & Exact Date', desc: 'Decodes reference number into creation timestamp: Nov 1, 14:22 UTC.' },
          { icon: '🕸️', name: 'Find Twin Scam Websites', desc: 'Finds other websites sharing this exact Meta Pixel ID.' }
        ]
      }
    }
  },
  phone_num: {
    id: 'phone_num',
    icon: '📱',
    layer: 'osint',
    stage: 2,
    x: 290,
    y: 200,
    confidence: 99,
    i18n: {
      fr: {
        type: 'Numéro de Téléphone',
        title: '+213 555 019 283',
        subtitle: 'Ligne Mobile Ooredoo Algérie',
        proof: '🔗 Extrait de l\'Annonce Certifiée #98124',
        details: {
          'Numéro Normalisé': '+213 555 019 283 (0555 01 92 83)',
          'Opérateur': 'Ooredoo Algérie (Mobile)',
          'Statut WhatsApp': 'Profil Professionnel Actif Détecté',
          'Statut Telegram': 'Compte Personnel Actif Détecté'
        },
        tools: [
          { icon: '💬', name: 'Découvrir WhatsApp & Telegram Liés', desc: 'Récupère la photo et le pseudo @amine_import via coffre sécurisé.' },
          { icon: '📸', name: 'Vérifier Instagram & Snapchat', desc: 'Confirme la présence sur Instagram (@auto_pieces_pro).' },
          { icon: '🚔', name: 'Vérifier Antécédents Judiciaires', desc: '2 plaintes antérieures trouvées dans la base cybercriminalité.' }
        ]
      },
      ar: {
        type: 'رقم هاتف محمول',
        title: '+213 555 019 283',
        subtitle: 'شريحة متعامل أوريدو الجزائر',
        proof: '🔗 تم استخراجه من الإعلان الموثق #98124',
        details: {
          'الرقم بالصيغة المحلية': '+213 555 019 283 (0555 01 92 83)',
          'متعامل الهاتف': 'أوريدو الجزائر (شريحة هاتف نقال)',
          'واتساب': 'تم العثور على حساب تجاري نشط',
          'تلغرام': 'تم العثور على حساب شخصي نشط'
        },
        tools: [
          { icon: '💬', name: 'كشف حسابات واتساب وتلغرام', desc: 'استرجاع الصورة والاسم @amine_import عبر حسابات التحقيق.' },
          { icon: '📸', name: 'فحص إنستغرام وسناب شات', desc: 'تأكيد تسجيل الرقم على إنستغرام (@auto_pieces_pro).' },
          { icon: '🚔', name: 'فحص الشكاوى السابقة في الشرطة', desc: 'العثور على شكويين سابقتين في النصب بنفس الرقم.' }
        ]
      },
      en: {
        type: 'Phone Number',
        title: '+213 555 019 283',
        subtitle: 'Ooredoo Algeria Mobile Line',
        proof: '🔗 Extracted from Certified Post #98124',
        details: {
          'Formatted Number': '+213 555 019 283 (0555 01 92 83)',
          'Carrier': 'Ooredoo Algeria (Mobile)',
          'WhatsApp Status': 'Active Business Profile Found',
          'Telegram Status': 'Active Account Found'
        },
        tools: [
          { icon: '💬', name: 'Find Linked WhatsApp & Telegram', desc: 'Retrieves avatar and username @amine_import via covert vault.' },
          { icon: '📸', name: 'Check Instagram & Snapchat Registration', desc: 'Confirms account exists on Instagram (@auto_pieces_pro).' },
          { icon: '🚔', name: 'Check Prior Police Fraud Complaints', desc: 'Finds 2 linked reports in National Cybercrime Database.' }
        ]
      }
    }
  },
  db_id_node: {
    id: 'db_id_node',
    icon: '🏷️',
    layer: 'infra',
    stage: 3,
    x: 540,
    y: 60,
    confidence: 96,
    i18n: {
      fr: {
        type: 'Code Caché & Traceur',
        title: 'Bon #672f9a... & Pixel Meta',
        subtitle: 'Créé le : 01 Nov à 14:22 UTC',
        proof: '🔍 Décodé des Paramètres du Lien Web',
        details: {
          'Horodatage Décodé': '01 Nov 2026 à 14:22:08 UTC',
          'Traceur Publicitaire': 'Meta Pixel #88419203314',
          'Boutiques Sœurs': 'pneus-dz-promo.shop, pieces-auto-express.com'
        },
        tools: [
          { icon: '🌐', name: 'Pivoter sur les Domaines Sœurs', desc: 'Relie 3 faux magasins à la même infrastructure d\'escroquerie.' }
        ]
      },
      ar: {
        type: 'رمز مخفي وكود تتبع',
        title: 'طلب #672f9a... وفيسبوك بيكسل',
        subtitle: 'تاريخ الإنشاء: 01 نوفمبر 14:22 UTC',
        proof: '🔍 تم فكه من كود رابط الموقع',
        details: {
          'تاريخ الإنشاء الدقيق': '01 نوفمبر 2026 في 14:22:08 UTC',
          'كود التتبع الإعلاني': 'فيسبوك بيكسل #88419203314',
          'المواقع المرتبطة': 'pneus-dz-promo.shop, pieces-auto-express.com'
        },
        tools: [
          { icon: '🌐', name: 'الربط مع المواقع الشقيقة', desc: 'ربط 3 متاجر احتيالية بنفس الشخص الذي أنشأ الكود.' }
        ]
      },
      en: {
        type: 'Hidden Website Code',
        title: 'Order Code #672f9a... & Pixel',
        subtitle: 'Created: 01 Nov 14:22 UTC',
        proof: '🔍 Decoded from Website Link Parameters',
        details: {
          'Embedded Timestamp': '01 Nov 2026 at 14:22:08 UTC',
          'Ad Tracker ID': 'Meta Pixel #88419203314',
          'Sibling Scam Sites': 'pneus-dz-promo.shop, pieces-auto-express.com'
        },
        tools: [
          { icon: '🌐', name: 'Pivot Across Twin Scam Domains', desc: 'Attributed 3 separate fake stores to the exact same phishing kit.' }
        ]
      }
    }
  },
  ip_node: {
    id: 'ip_node',
    icon: '🖥️',
    layer: 'infra',
    stage: 3,
    x: 540,
    y: 180,
    confidence: 95,
    i18n: {
      fr: {
        type: 'Serveur d\'Hébergement',
        title: 'Serveur 185.199.108.153',
        subtitle: 'Héberge 3 faux sites de vente',
        proof: '🌐 Résolution Réseau Confirmée',
        details: {
          'Hébergeur': 'Cloud Européen',
          'Domaines Co-Hébergés': '3 boutiques frauduleuses',
          'Indice E-mail Découvert': 'am***94@gmail.com'
        },
        tools: [
          { icon: '📜', name: 'Historique WHOIS du Nom de Domaine', desc: 'Trouve l\'adresse e-mail et les dates de renouvellement.' }
        ]
      },
      ar: {
        type: 'خادم الاستضافة (IP)',
        title: 'الخادم 185.199.108.153',
        subtitle: 'يستضيف 3 مواقع احتيالية لبيع قطع الغيار',
        proof: '🌐 تم تأكيد الاتصال بالشبكة',
        details: {
          'مزود الاستضافة': 'خدمات سحابية أوروبية',
          'المواقع المستضافة معاً': '3 مواقع احتيالية بنفس الخادم',
          'البريد المسترجع': 'am***94@gmail.com'
        },
        tools: [
          { icon: '📜', name: 'سجل ملكية النطاق WHOIS', desc: 'كشف البريد الإلكتروني وتواريخ حجز اسم الموقع.' }
        ]
      },
      en: {
        type: 'Hosting Server',
        title: 'Server 185.199.108.153',
        subtitle: 'Hosts 3 fake tyre websites',
        proof: '🌐 Network Resolution Confirmed',
        details: {
          'Hosting Provider': 'European Cloud Hosting',
          'Domains on Server': '3 co-hosted scam shops',
          'Registrant Email Hint': 'am***94@gmail.com'
        },
        tools: [
          { icon: '📜', name: 'Lookup WHOIS Registration History', desc: 'Finds email address and registration dates.' }
        ]
      }
    }
  },
  osn_accounts: {
    id: 'osn_accounts',
    icon: '💬',
    layer: 'osint',
    stage: 3,
    x: 540,
    y: 300,
    confidence: 94,
    i18n: {
      fr: {
        type: 'Réseaux Sociaux Associés',
        title: 'Telegram & Instagram',
        subtitle: '@amine_import & @auto_pieces_pro',
        proof: '📱 Rapproché via le Tél. +213 555 019 283',
        details: {
          'Compte Telegram': '@amine_import (ID Permanent: 519283741)',
          'Compte Instagram': '@auto_pieces_pro (Lié au même numéro)',
          'Test Biométrique Visage': '89% de similarité entre les photos de profil'
        },
        tools: [
          { icon: '👤', name: 'Comparer Visages des Profils', desc: 'Confirmation faciale à 89% rattachant les deux comptes au même suspect.' }
        ]
      },
      ar: {
        type: 'حسابات التواصل المرتبطة',
        title: 'تلغرام وإنستغرام',
        subtitle: '@amine_import و @auto_pieces_pro',
        proof: '📱 تم الربط برقم الهاتف +213 555 019 283',
        details: {
          'حساب تلغرام': '@amine_import (المعرف الدائم: 519283741)',
          'حساب إنستغرام': '@auto_pieces_pro (مرتبط بنفس الهاتف)',
          'تطابق ملامح الوجه': '89% تطابق بيومتري بين الصورتين الشخصيتين'
        },
        tools: [
          { icon: '👤', name: 'مقارنة الوجه بيومترياً', desc: 'تأكيد التطابق بنسبة 89% وإثبات أن الحسابين لشخص واحد.' }
        ]
      },
      en: {
        type: 'Linked Social Media',
        title: 'Telegram & Instagram',
        subtitle: '@amine_import & @auto_pieces_pro',
        proof: '📱 Matched via Phone +213 555 019 283',
        details: {
          'Telegram': '@amine_import (User ID: 519283741)',
          'Instagram': '@auto_pieces_pro (Linked to phone number)',
          'Face Match': '89% Facial Feature Match between profile photos'
        },
        tools: [
          { icon: '👤', name: 'Compare Profile Faces', desc: 'Biometric 89% confirmation linking accounts to single suspect.' }
        ]
      }
    }
  },
  suspect_hypothesis: {
    id: 'suspect_hypothesis',
    icon: '🎯',
    layer: 'hypothesis',
    stage: 4,
    x: 790,
    y: 180,
    confidence: 92,
    i18n: {
      fr: {
        type: 'Candidat Suspect',
        title: 'Suspect "Amine B."',
        subtitle: '92% de Concordance Établie',
        proof: '🧩 Lié par Téléphone + Telegram + Pixel + 2 Plaintes',
        details: {
          'Identifiants Réunis': 'Tél +213555019283 + TG ID 519283741 + Pixel #8841920',
          'Plaintes Antérieures': '2 Dépositions enregistrées à Alger et Oran',
          'Mesure Proposée': 'Réquisition Ooredoo + Blocage Compte CCP'
        },
        tools: [
          { icon: '✅', name: 'Verrouiller comme Fait Vérifié', desc: 'Passe le suspect du calque hypothèse au calque des preuves scellées.' },
          { icon: '📄', name: 'Générer Procès-Verbal Judiciaire (PDF)', desc: 'Imprime le dossier complet illustré pour le procureur.' }
        ]
      },
      ar: {
        type: 'المشتبه به المستهدف',
        title: 'المشتبه به "أمين ب."',
        subtitle: 'نسبة تطابق الأدلة: 92%',
        proof: '🧩 مرتبط بالهاتف + تلغرام + كود التتبع + شكويين سابقتين',
        details: {
          'المعرفات المتطابقة': 'الهاتف +213555019283 + معرف تلغرام 519283741 + البيكسل #8841920',
          'الشكاوى السابقة': 'شكويان مسجلتان لدى مصالح الأمن بالجزائر ووهران',
          'الإجراء المقترح': 'تسخير أوريدو + تجميد الحساب البريدي الجاري CCP'
        },
        tools: [
          { icon: '✅', name: 'تثبيت كدليل رسمي مؤكد', desc: 'نقل المشتبه به من طبقة الفرضيات إلى طبقة الأدلة الثابتة.' },
          { icon: '📄', name: 'توليد محضر التحقيق القضائي (PDF)', desc: 'استخراج التقرير القضائي الكامل لتقديمه للنيابة العامة.' }
        ]
      },
      en: {
        type: 'Suspect Candidate',
        title: 'Suspect "Amine B."',
        subtitle: '92% Attributed Match',
        proof: '🧩 Linked by Phone + Telegram + Tracker + 2 Complaints',
        details: {
          'Full Identifiers': 'Phone +213555019283 + TG ID 519283741 + Pixel #8841920',
          'Prior Complaints': '2 Victim depositions filed in Algiers & Oran',
          'Recommended Action': 'Requisition to Ooredoo + CCP Account Freeze'
        },
        tools: [
          { icon: '✅', name: 'Lock as Court-Verified Fact', desc: 'Promotes candidate to verified evidentiary layer.' },
          { icon: '📄', name: 'Generate Official Court Report (PDF)', desc: 'Prints complete illustrated judicial dossier.' }
        ]
      }
    }
  }
};

const MULTILINGUAL_EDGES = [
  { from: 'fb_account', to: 'fb_post', stage: 1, labels: { fr: 'Publication Post', ar: 'نشر الإعلان', en: 'Published Post' } },
  { from: 'fb_post', to: 'scam_url', stage: 2, labels: { fr: 'Contient le Lien', ar: 'يحتوي على رابط', en: 'Contains Link' } },
  { from: 'fb_post', to: 'phone_num', stage: 2, labels: { fr: 'Mentionne le Tél.', ar: 'يذكر رقم هاتف', en: 'Mentions Phone' } },
  { from: 'scam_url', to: 'db_id_node', stage: 3, labels: { fr: 'Révèle Code & Date', ar: 'يكشف الكود والتاريخ', en: 'Reveals Code' } },
  { from: 'scam_url', to: 'ip_node', stage: 3, labels: { fr: 'Hébergé sur Serveur', ar: 'مستضاف على خادم', en: 'Hosted On' } },
  { from: 'phone_num', to: 'osn_accounts', stage: 3, labels: { fr: 'Enregistré sur Apps', ar: 'مسجل في التطبيقات', en: 'Registered On' } },
  { from: 'osn_accounts', to: 'suspect_hypothesis', stage: 4, labels: { fr: 'Identifie Suspect', ar: 'يحدد هوية المشتبه به', en: 'Identifies Suspect' } },
  { from: 'db_id_node', to: 'suspect_hypothesis', stage: 4, labels: { fr: 'Relie 3 Faux Sites', ar: 'يربط 3 مواقع وهمية', en: 'Links 3 Scam Sites' } }
];

// Language Switcher Function
function setLanguage(lang) {
  currentAppLang = lang;
  const root = document.getElementById('app-html-root');

  if (lang === 'ar') {
    root.setAttribute('dir', 'rtl');
    root.setAttribute('lang', 'ar');
    document.getElementById('current-lang-icon').innerText = '🇸🇦';
    document.getElementById('current-lang-label').innerText = 'العربية';
  } else if (lang === 'en') {
    root.setAttribute('dir', 'ltr');
    root.setAttribute('lang', 'en');
    document.getElementById('current-lang-icon').innerText = '🇬🇧';
    document.getElementById('current-lang-label').innerText = 'English';
  } else {
    root.setAttribute('dir', 'ltr');
    root.setAttribute('lang', 'fr');
    document.getElementById('current-lang-icon').innerText = '🇫🇷';
    document.getElementById('current-lang-label').innerText = 'Français';
  }

  // Update all [data-i18n] tags in the DOM
  const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.fr;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  closeAllDropdowns();
  renderMaquette();
}

// Dropdown Menu Toggling
function toggleDropdown(menuId) {
  const target = document.getElementById(menuId);
  const isShown = target.classList.contains('show');
  closeAllDropdowns();
  if (!isShown) {
    target.classList.add('show');
    const trigger = target.previousElementSibling;
    if (trigger) trigger.classList.add('active');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
  document.querySelectorAll('.menu-trigger-btn').forEach(b => b.classList.remove('active'));
}

window.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-item-dropdown')) {
    closeAllDropdowns();
  }
});

function renderMaquette() {
  const container = document.getElementById('m-nodes-container');
  const svg = document.getElementById('m-svg-canvas');
  if (!container || !svg) return;

  const lang = currentAppLang;

  // Render SVG connection lines
  let svgHtml = '';
  MULTILINGUAL_EDGES.forEach(edge => {
    const n1 = MULTILINGUAL_NODES[edge.from];
    const n2 = MULTILINGUAL_NODES[edge.to];
    if (!n1 || !n2) return;
    if (edge.stage > maquetteStage) return;
    if (!maquetteLayers[n1.layer] || !maquetteLayers[n2.layer]) return;

    const x1 = n1.x + 95;
    const y1 = n1.y + 32;
    const x2 = n2.x + 95;
    const y2 = n2.y + 32;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const isDashed = (n2.layer === 'hypothesis') ? 'stroke-dasharray="6,4"' : '';
    const color = (n2.layer === 'hypothesis') ? '#8b5cf6' : '#3b82f6';
    const label = edge.labels[lang] || edge.labels.fr;

    svgHtml += `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.2" ${isDashed} opacity="0.8" />
      <rect x="${mx - 54}" y="${my - 10}" width="108" height="20" rx="5" fill="#090e17" stroke="#222f46" stroke-width="1" />
      <text x="${mx}" y="${my + 4}" fill="#cbd5e1" font-size="9.5" font-family="sans-serif" font-weight="600" text-anchor="middle">${label}</text>
    `;
  });
  svg.innerHTML = svgHtml;

  // Render Clue Cards
  let nodesHtml = '';
  Object.values(MULTILINGUAL_NODES).forEach(node => {
    if (node.stage > maquetteStage) return;
    if (!maquetteLayers[node.layer]) return;

    // Type Category Filtering
    if (activeNodeTypeFilter === 'phone' && node.id !== 'phone_num' && node.id !== 'clue_truecaller_name') return;
    if (activeNodeTypeFilter === 'bank' && node.id !== 'clue_ccp_account') return;
    if (activeNodeTypeFilter === 'social' && !['fb_account', 'fb_post', 'osn_accounts', 'clue_insta_account'].includes(node.id)) return;
    if (activeNodeTypeFilter === 'web' && !['scam_url', 'db_id_node', 'ip_node', 'clue_twin_site'].includes(node.id)) return;
    if (activeNodeTypeFilter === 'audio' && node.id !== 'voice_darija_node') return;

    const nData = node.i18n[lang] || node.i18n.fr;
    const isSelected = (node.id === currentMaquetteNode) ? 'selected' : '';

    nodesHtml += `
      <div class="canvas-node ${node.layer} ${isSelected}" style="left:${node.x}px; top:${node.y}px;" onclick="selectMaquetteNode('${node.id}')">
        <div class="node-header-tag">
          <span>${node.icon}</span>
          <span>${nData.type}</span>
        </div>
        <div class="node-title-text">${nData.title}</div>
        <div class="node-sub-text">${nData.subtitle}</div>
      </div>
    `;
  });
  container.innerHTML = nodesHtml;

  renderInspector();
  renderInboxClues();
}

function selectMaquetteNode(nodeId) {
  currentMaquetteNode = nodeId;
  renderMaquette();
  const nData = MULTILINGUAL_NODES[nodeId].i18n[currentAppLang] || MULTILINGUAL_NODES[nodeId].i18n.fr;
  updateTerminalLog(`Sélection : ${nData.title} (${nData.type})`);
}


// =========================================================================
// INBOX & CLUE ARBITRATION CONTROLLER
// =========================================================================
let currentSelectedInboxClue = null;

function renderInboxClues() {
  const container = document.getElementById('m-inbox-list');
  const badge = document.getElementById('inbox-pending-badge');
  if (!container) return;

  const pendingCount = CANDIDATE_INBOX_CLUES.filter(c => c.status === 'pending').length;
  if (badge) {
    if (currentAppLang === 'ar') badge.innerText = `${pendingCount} قيد المعاينة`;
    else if (currentAppLang === 'en') badge.innerText = `${pendingCount} Pending`;
    else badge.innerText = `${pendingCount} En Attente`;
  }

  let html = '';
  CANDIDATE_INBOX_CLUES.forEach(clue => {
    const data = clue.i18n[currentAppLang] || clue.i18n.fr;
    const src = (currentAppLang === 'ar') ? clue.sourceToolAr : ((currentAppLang === 'en') ? clue.sourceToolEn : clue.sourceTool);
    let statusBadge = '';
    if (clue.status === 'added') {
      statusBadge = `<span class="badge badge-emerald" style="font-size:0.65rem;">${currentAppLang === 'ar' ? '✅ في المخطط' : (currentAppLang === 'en' ? '✅ On Board' : '✅ Ajouté')}</span>`;
    } else if (clue.status === 'dismissed') {
      statusBadge = `<span class="badge" style="background:#262626;color:#a3a3a3;font-size:0.65rem;">${currentAppLang === 'ar' ? '✕ مستبعد' : (currentAppLang === 'en' ? '✕ Dismissed' : '✕ Écarté')}</span>`;
    } else {
      statusBadge = `<span class="badge badge-amber" style="font-size:0.65rem;">${clue.confidence}%</span>`;
    }

    html += `
      <div class="inbox-item-card ${clue.status}" onclick="openClueDetail('${clue.id}')">
        <div class="inbox-item-top">
          <div class="inbox-item-title">
            <span>${clue.icon}</span>
            <span>${data.title}</span>
          </div>
          ${statusBadge}
        </div>
        <div class="inbox-item-src">⚡ ${src}</div>
        <div class="inbox-item-preview">${data.subtitle}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function openClueDetail(clueId) {
  const clue = CANDIDATE_INBOX_CLUES.find(c => c.id === clueId);
  if (!clue) return;
  currentSelectedInboxClue = clue;

  const data = clue.i18n[currentAppLang] || clue.i18n.fr;
  const dict = I18N_TRANSLATIONS[currentAppLang] || I18N_TRANSLATIONS.fr;
  const src = (currentAppLang === 'ar') ? clue.sourceToolAr : ((currentAppLang === 'en') ? clue.sourceToolEn : clue.sourceTool);

  const titleEl = document.getElementById('modal-clue-title');
  const typeEl = document.getElementById('modal-clue-type');
  const srcEl = document.getElementById('modal-clue-src');
  const summaryEl = document.getElementById('modal-clue-summary');
  const proofEl = document.getElementById('modal-clue-proof');
  const confEl = document.getElementById('modal-clue-conf');
  const confBarEl = document.getElementById('modal-clue-conf-bar');
  const iconEl = document.getElementById('modal-clue-icon');

  if (titleEl) titleEl.innerText = data.title;
  if (typeEl) typeEl.innerText = data.type;
  if (iconEl) iconEl.innerText = clue.icon;
  if (srcEl) srcEl.innerText = src;
  if (summaryEl) summaryEl.innerText = data.summary;
  if (proofEl) proofEl.innerText = data.proof;
  if (confEl) confEl.innerText = `${clue.confidence}%`;
  if (confBarEl) confBarEl.style.width = `${clue.confidence}%`;

  // Build table of details
  let detailRows = '';
  for (const [k, v] of Object.entries(data.details)) {
    detailRows += `
      <tr>
        <td style="color:#94a3b8;width:38%;padding:0.35rem 0.5rem;border-bottom:1px solid #1e293b;font-weight:600;">${k}</td>
        <td style="color:#f1f5f9;padding:0.35rem 0.5rem;border-bottom:1px solid #1e293b;">${v}</td>
      </tr>
    `;
  }
  const tableBody = document.getElementById('modal-clue-table-body');
  if (tableBody) tableBody.innerHTML = detailRows;

  // Action button states
  const btnAdd = document.getElementById('btn-modal-add-graph');
  const btnDismiss = document.getElementById('btn-modal-dismiss');
  if (btnAdd && btnDismiss) {
    if (clue.status === 'added') {
      btnAdd.disabled = true;
      btnAdd.innerHTML = dict.clue_added_tag || '✅ Déjà sur le Graphe';
      btnDismiss.style.display = 'none';
    } else if (clue.status === 'dismissed') {
      btnAdd.disabled = false;
      btnAdd.innerHTML = dict.btn_add_graph || '➕ Ajouter au Graphe';
      btnDismiss.disabled = true;
      btnDismiss.innerHTML = dict.clue_dismissed_tag || '✕ Déjà Écarté';
      btnDismiss.style.display = 'inline-flex';
    } else {
      btnAdd.disabled = false;
      btnAdd.innerHTML = dict.btn_add_graph || '➕ Ajouter au Graphe';
      btnDismiss.disabled = false;
      btnDismiss.innerHTML = dict.btn_dismiss || '✕ Écarter (Non pertinent)';
      btnDismiss.style.display = 'inline-flex';
    }
  }

  const modal = document.getElementById('clue-detail-modal');
  if (modal) modal.classList.add('active');
}

function closeClueModal() {
  const modal = document.getElementById('clue-detail-modal');
  if (modal) modal.classList.remove('active');
}

function addClueToGraphFromModal() {
  if (!currentSelectedInboxClue) return;
  const clue = currentSelectedInboxClue;
  clue.status = 'added';

  // Inject into MULTILINGUAL_NODES if not present
  if (!MULTILINGUAL_NODES[clue.nodeId]) {
    MULTILINGUAL_NODES[clue.nodeId] = {
      id: clue.nodeId,
      icon: clue.icon,
      layer: clue.layer,
      stage: 1, // Always visible
      x: clue.x,
      y: clue.y,
      confidence: clue.confidence,
      i18n: clue.i18n
    };
  }

  // Inject edge into MULTILINGUAL_EDGES
  const existingEdge = MULTILINGUAL_EDGES.find(e => e.from === clue.parentNode && e.to === clue.nodeId);
  if (!existingEdge) {
    MULTILINGUAL_EDGES.push({
      from: clue.parentNode,
      to: clue.nodeId,
      stage: 1,
      labels: clue.edgeLabel
    });
  }

  currentMaquetteNode = clue.nodeId;

  // Add Action Log entry
  const data = clue.i18n[currentAppLang] || clue.i18n.fr;
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const logMsg = (currentAppLang === 'ar')
    ? `${timeNow} • تم التحقق من دليل جديد: ${data.title} (${data.type}) وأضيف إلى مخطط التحقيق`
    : `${timeNow} • Indice validé : ${data.title} (${data.type}) ajouté au graphe judiciaire`;
  updateTerminalLog(logMsg);

  // Prepend to action journal DOM
  const historyList = document.getElementById('m-history-list');
  if (historyList) {
    const itemDiv = document.createElement('div');
    itemDiv.style.cssText = 'padding:0.35rem 0.5rem;background:#131c2d;border-radius:5px;border-left:2px solid #10b981;color:#cbd5e1;';
    itemDiv.innerHTML = `
      <div style="font-weight:600;">${timeNow} • ${data.title}</div>
      <div style="color:#94a3b8;font-size:0.68rem;">${data.type} &bull; ${clue.sourceTool}</div>
    `;
    historyList.prepend(itemDiv);
  }

  closeClueModal();
  renderMaquette();
  renderInboxClues();
}

function dismissClueFromModal() {
  if (!currentSelectedInboxClue) return;
  const clue = currentSelectedInboxClue;
  clue.status = 'dismissed';

  const data = clue.i18n[currentAppLang] || clue.i18n.fr;
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  updateTerminalLog(`${timeNow} • Indice écarté : ${data.title} (Marqué non pertinent par l'enquêteur)`);

  closeClueModal();
  renderInboxClues();
}

let currentClarityMode = 'simple';
let currentRightTab = 'inbox';
let activeNodeTypeFilter = 'all';

function toggleClarityMode() {
  currentClarityMode = (currentClarityMode === 'simple') ? 'expert' : 'simple';
  const btn = document.getElementById('btn-clarity-mode');
  const icon = document.getElementById('clarity-icon');
  const text = document.getElementById('clarity-text');
  if (btn) {
    if (currentClarityMode === 'expert') {
      btn.classList.add('expert-mode');
      if (icon) icon.innerText = '⚙️';
      if (text) text.innerText = (currentAppLang === 'ar') ? 'وضع الخبير التقني' : ((currentAppLang === 'en') ? 'Cyber Expert Mode' : 'Mode Cyber (Expert)');
      updateTerminalLog('Basculement : Mode Cyber Expert (Affichage des hachages SHA-256, requêtes Gremlin et détails réseau)');
    } else {
      btn.classList.remove('expert-mode');
      if (icon) icon.innerText = '👁️';
      if (text) text.innerText = (currentAppLang === 'ar') ? 'وضع المحقق المبسط' : ((currentAppLang === 'en') ? 'Simple Detective Mode' : 'Mode OPJ (Simple)');
      updateTerminalLog('Basculement : Mode OPJ Simple (Vocabulaire judiciaire clair, zéro jargon technique)');
    }
  }
  renderInspector();
}

function switchRightTab(tabId) {
  currentRightTab = tabId;
  const tabs = ['inbox', 'inspector', 'comparator'];
  tabs.forEach(t => {
    const btn = document.getElementById(`rtab-${t}`);
    const panel = document.getElementById(`rpanel-${t}`);
    if (btn) btn.classList.toggle('active', t === tabId);
    if (panel) panel.style.display = (t === tabId) ? 'flex' : 'none';
  });
  if (tabId === 'inspector') renderInspector();
  else if (tabId === 'inbox') renderInboxClues();
}

function openSuspectDossier() {
  const modal = document.getElementById('suspect-dossier-modal');
  if (modal) modal.style.display = 'flex';
  updateTerminalLog('Ouverture : Fiche Judiciaire Express du Suspect Principal (Amine B.)');
}

function closeSuspectDossier() {
  const modal = document.getElementById('suspect-dossier-modal');
  if (modal) modal.style.display = 'none';
}

function addAllPendingClues() {
  CANDIDATE_INBOX_CLUES.forEach(clue => {
    if (clue.status === 'pending') {
      clue.status = 'added';
      if (!MULTILINGUAL_NODES[clue.nodeId]) {
        MULTILINGUAL_NODES[clue.nodeId] = {
          id: clue.nodeId,
          icon: clue.icon,
          layer: clue.layer,
          stage: 1,
          x: clue.x,
          y: clue.y,
          confidence: clue.confidence,
          i18n: clue.i18n
        };
      }
    }
  });
  renderMaquette();
  renderInboxClues();
  updateTerminalLog('Tous les indices en attente ont été validés et intégrés au tableau d\'enquête.');
}

function filterNodesByType(type) {
  activeNodeTypeFilter = type;
  document.querySelectorAll('[id^="fbtn-"]').forEach(btn => {
    btn.classList.toggle('active', btn.id === `fbtn-${type}`);
  });
  renderMaquette();
  updateTerminalLog(`Filtrage du tableau par type d'élément : ${type.toUpperCase()}`);
}

function renderInspector() {
  const pane = document.getElementById('m-inspector-pane');
  const node = MULTILINGUAL_NODES[currentMaquetteNode];
  if (!pane || !node) return;

  const lang = currentAppLang;
  const nData = node.i18n[lang] || node.i18n.fr;
  const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.fr;

  let detailsHtml = '';
  Object.entries(nData.details).forEach(([k, v]) => {
    detailsHtml += `
      <div style="margin-bottom:0.4rem;font-size:0.75rem;">
        <span style="color:#64748b;font-weight:600;">${k}:</span>
        <span style="color:#f1f5f9;margin-left:0.25rem;">${v}</span>
      </div>
    `;
  });

  // Expert Mode Technical Block
  let expertBlockHtml = '';
  if (currentClarityMode === 'expert') {
    expertBlockHtml = `
      <div style="background:#090d16;border:1px solid #1e293b;border-radius:6px;padding:0.6rem;margin-bottom:0.75rem;font-family:var(--font-mono);font-size:0.68rem;">
        <div style="color:#8b5cf6;font-weight:700;margin-bottom:0.25rem;">⚙️ MÉTADONNÉES FORENSIQUES EXPERT :</div>
        <div style="color:#94a3b8;">NODE_ID: <code>${node.id}</code> &bull; LAYER: <code>${node.layer}</code></div>
        <div style="color:#94a3b8;">SHA-256: <code>4a12e88b90123f81...771c</code></div>
        <div style="color:#94a3b8;">GREMLIN: <code>g.V().has('nodeId', '${node.id}').bothE()</code></div>
      </div>
    `;
  }

  let toolsHtml = '';
  nData.tools.forEach(t => {
    toolsHtml += `
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:6px;padding:0.55rem;margin-bottom:0.45rem;">
        <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.2rem;">
          <span>${t.icon}</span>
          <strong style="color:#93c5fd;font-size:0.77rem;">${t.name}</strong>
        </div>
        <p style="font-size:0.71rem;color:#94a3b8;margin:0 0 0.35rem;line-height:1.3;">${t.desc}</p>
        <button class="btn btn-emerald" style="width:100%;justify-content:center;font-size:0.71rem;padding:0.25rem;" onclick="triggerSimulatedTool('${t.name}')">
          ${dict.run_tool}
        </button>
      </div>
    `;
  });

  pane.innerHTML = `
    <div style="padding:0.25rem 0;">
      <div class="dock-heading" style="margin-bottom:0.5rem;display:flex;align-items:center;justify-content:space-between;">
        <span>${lang === 'ar' ? 'تفاصيل الدليل المحدد' : (lang === 'en' ? 'Selected Clue Details' : 'Détails de l\'Indice Sélectionné')}</span>
        <span class="badge badge-blue" style="font-size:0.65rem;">${node.icon} ${nData.type}</span>
      </div>

      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:0.75rem;margin-bottom:0.75rem;">
        <h3 style="font-size:0.9rem;color:#fff;margin:0 0 0.25rem;">${node.icon} ${nData.title}</h3>
        <div style="font-size:0.71rem;color:#10b981;background:rgba(16,185,129,0.1);padding:0.3rem 0.5rem;border-radius:5px;margin-bottom:0.55rem;">
          <strong>${lang === 'ar' ? 'اليقين :' : (lang === 'en' ? 'Reliability :' : 'Fiabilité :')}</strong> ${node.confidence}% &bull;
          <strong>${lang === 'ar' ? 'الإثبات :' : (lang === 'en' ? 'Proof :' : 'Preuve :')}</strong> ${nData.proof}
        </div>
        ${detailsHtml}
      </div>

      ${expertBlockHtml}

      <div class="dock-heading" style="margin-bottom:0.4rem;">
        <span>${lang === 'ar' ? 'الإجراءات المقترحة لهذا الدليل' : (lang === 'en' ? 'Recommended Investigation Actions' : 'Actions d\'Enquête Recommandées')}</span>
      </div>
      <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:0.5rem;">
        ${lang === 'ar' ? 'تتوافق هذه الأدوات مع نوع الدليل المحدد:' : (lang === 'en' ? 'Tools matched to your selected clue:' : 'Briques d\'investigation prêtes à être exécutées :')}
      </div>
      ${toolsHtml}
    </div>
  `;
}

function jumpToStep(step) {
  maquetteStage = step;
  document.querySelectorAll('[id^="m-step-"]').forEach((btn, idx) => {
    btn.classList.toggle('active', (idx + 1) === step);
  });
  renderMaquette();
  updateTerminalLog(`Étape d'enquête changée : Étape ${step}`);
}

function toggleMaquetteLayer(layerName, checked) {
  maquetteLayers[layerName] = checked;
  renderMaquette();
}

function toggleLayerFromMenu(layerName) {
  maquetteLayers[layerName] = !maquetteLayers[layerName];
  const checkbox = document.getElementById(`m-layer-${layerName}`);
  if (checkbox) checkbox.checked = maquetteLayers[layerName];
  renderMaquette();
  closeAllDropdowns();
}

function resetAllLayers() {
  maquetteLayers = { verified: true, osint: true, infra: true, hypothesis: true };
  document.getElementById('m-layer-verified').checked = true;
  document.getElementById('m-layer-osint').checked = true;
  document.getElementById('m-layer-infra').checked = true;
  document.getElementById('m-layer-hypothesis').checked = true;
  renderMaquette();
}

function updateConfidenceThreshold(val) {
  document.getElementById('m-conf-val').innerText = `${val}%`;
  updateTerminalLog(`Filtrage des indices dont la certitude est inférieure à ${val}%`);
}

function switchMainView(viewName) {
  const views = ['graph', 'timeline', 'map', 'vault', 'storyboard', 'dossier'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    const btn = document.getElementById(`tab-${v}`);
    if (el) el.style.display = (v === viewName) ? (v === 'graph' ? 'flex' : 'block') : 'none';
    if (btn) btn.classList.toggle('active', v === viewName);
  });
  closeAllDropdowns();
  updateTerminalLog(`Vue de travail active : ${viewName.toUpperCase()}`);
}

function updateTerminalLog(msg) {
  const el = document.getElementById('m-terminal-text');
  if (el) el.innerText = msg;
}

function triggerSimulatedTool(toolName) {
  const modal = document.getElementById('sim-modal');
  const title = document.getElementById('sim-modal-title');
  const log = document.getElementById('sim-modal-log');
  if (!modal || !title || !log) return;

  title.innerText = `${currentAppLang === 'ar' ? 'تشغيل الأداة: ' : 'Exécution : '} ${toolName}`;
  log.innerHTML = `
    [10:24:01] Spawning isolated anonymous container...<br/>
    [10:24:02] Routing query through residential proxy circuit...<br/>
    [10:24:04] Target responded: 200 OK &bull; Extracting clues...<br/>
    [10:24:05] <span style="color:#10b981;">✓ ${currentAppLang === 'ar' ? 'تمت العملية بنجاح وحفظت الأدلة بالخزينة' : 'Succès : 2 nouveaux indices découverts et scellés'}</span>
  `;
  modal.style.display = 'flex';
  updateTerminalLog(`Exécution de l'outil : ${toolName}`);
}

function closeSimModal() {
  document.getElementById('sim-modal').style.display = 'none';
}

function runQuickTool(type) {
  if (type === 'phone') triggerSimulatedTool(currentAppLang === 'ar' ? 'مسح الهاتف عبر التطبيقات (+213 555 019 283)' : 'Scanner Téléphone sur 100+ Applications (+213 555 019 283)');
  else if (type === 'website') triggerSimulatedTool(currentAppLang === 'ar' ? 'فك رموز وتاريخ الموقع' : 'Décoder Codes Cachés & Date Web');
  else if (type === 'faces') triggerSimulatedTool(currentAppLang === 'ar' ? 'مقارنة الوجه بيومترياً (ArcFace)' : 'Comparaison Faciale Biométrique ArcFace');
  else if (type === 'twin') triggerSimulatedTool(currentAppLang === 'ar' ? 'البحث عن المواقع التوأم' : 'Découvrir Sites Jumeaux (Même Pixel)');
  else triggerSimulatedTool(currentAppLang === 'ar' ? 'تجميد وتوثيق الصفحة (ArchiveBox)' : 'Geler & Certifier la Page (ArchiveBox)');
}

function runToolFromMenu(toolKey) {
  closeAllDropdowns();
  const names = {
    freeze: 'Geler & Certifier la Page (ArchiveBox)',
    extract_ioc: 'Extraire Téléphones & Liens du Texte',
    fb_ads: 'Inspecter Publicités & Pays Gestionnaire FB',
    marketplaces: 'Rechercher Annonces Antérieures',
    phone_osn: 'Scanner Téléphone sur 100+ Applications',
    whatsapp_tg: 'Comptes WhatsApp & Telegram Associés',
    maigret: 'Recherche de Pseudonyme sur 2 500+ Sites',
    breach: 'Historique de Fuites & Mots de Passe',
    hidden_code: 'Décoder Codes Cachés & Date Web',
    twin_sites: 'Trouver les Sites Jumeaux',
    ip_whois: 'Identifier Serveur d\'Hébergement & WHOIS',
    sherloq: 'Détecter Retouches & Falsification (Sherloq)',
    faces: 'Comparaison Faciale Biométrique (ArcFace)',
    voice: 'Transcrire Message Vocal Hors-Ligne (Whisper)',
    cdr: 'Analyser Relevé d\'Appels Opérateur (CDR)',
    alibi: 'Détecter Contradictions d\'Alibis'
  };
  triggerSimulatedTool(names[toolKey] || toolKey);
}

function triggerMenuAction(action) {
  closeAllDropdowns();
  if (action === 'new_case') alert('Création d\'un nouveau dossier d\'enquête');
  else if (action === 'save_case') updateTerminalLog('Dossier d\'enquête sauvegardé avec succès.');
  else if (action === 'undo') updateTerminalLog('Action annulée.');
  else if (action === 'redo') updateTerminalLog('Action rétablie.');
  else if (action === 'ai_playbook') simulateFullAutoRun();
  else if (action === 'ai_summary') switchMainView('dossier');
  else updateTerminalLog(`Action : ${action}`);
}

function simulateFullAutoRun() {
  jumpToStep(1);
  updateTerminalLog('⚡ Lancement du Scénario d\'Enquête Automatique...');
  setTimeout(() => jumpToStep(2), 700);
  setTimeout(() => jumpToStep(3), 1500);
  setTimeout(() => {
    jumpToStep(4);
    updateTerminalLog('✓ Scénario Terminé : Suspect Amine B. Identifié avec 92% de Confiance !');
  }, 2300);
}

document.addEventListener('DOMContentLoaded', () => {
  renderMaquette();
});
