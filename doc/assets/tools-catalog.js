// AegisInvestigate — Exhaustive Catalog of 62 Criminal Investigation & OSINT Tools
// Tracks tool details, categories, prerequisites, starting clues, discovered clues, and activation toggles.

const FULL_TOOLS_INVENTORY = [
  // =========================================================================
  // CATEGORY 1: RÉSEAUX SOCIAUX & ANNONCES (SOCMINT) - 10 Outils
  // =========================================================================
  {
    id: 'tool_soc_freeze',
    name: 'Geler & Certifier la Page ou Annonce Web',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📢 Post Réseau Social ou 🌐 Lien Web',
    discovers: '🗄️ Capture d\'écran pleine page, Archive WARC ISO, Empreinte SHA-256',
    engine: 'ArchiveBox + Playwright + Scellé RFC 3161',
    desc: 'Capture immédiatement une copie intégrale inaltérable d\'une page ou annonce avant suppression par l\'escroc.',
    active: true
  },
  {
    id: 'tool_soc_extract_ioc',
    name: 'Extracteur Automatique d\'Indices Textuels (IOCs)',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📢 Texte de Post, 💬 Chat ou 📄 Déposition',
    discovers: '📱 Téléphones E.164, 🌐 Liens Web, 💳 Numéros CCP/IBAN, 📧 E-mails',
    engine: 'Google phonenumbers + Parsers d\'expressions régulières compilées',
    desc: 'Lit automatiquement le texte d\'un message ou rapport pour extraire les numéros de téléphone et liens sur le tableau.',
    active: true
  },
  {
    id: 'tool_soc_fb_transparency',
    name: 'Transparence de Page Facebook & Pays Gestionnaire',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Page Facebook',
    discovers: '🌍 Pays et wilayas des administrateurs, 📅 Historique des changements de nom',
    engine: 'Meta Page Transparency Public Scraper',
    desc: 'Révèle si une page prétendant vendre des pneus en Algérie est en réalité gérée depuis un autre pays.',
    active: true
  },
  {
    id: 'tool_soc_fb_ad_library',
    name: 'Inspecteur des Publicités Payées Meta Ad Library',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '👤 Page Facebook ou 🏷️ Mot-clé de vente',
    discovers: '📢 Toutes les publicités sponsorisées actives et passées, 💳 Montants dépensés',
    engine: 'Meta Ad Library API (Clé développeur gratuite)',
    desc: 'Retrouve toutes les campagnes publicitaires payées par l\'escroc pour cibler des victimes sur Facebook et Instagram.',
    active: true
  },
  {
    id: 'tool_soc_telegram_user',
    name: 'Résolveur de Comptes & Groupes Telegram',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'ACCOUNT',
    reqLabel: '👤 Compte Infiltration Requis',
    startClue: '📱 Numéro de Téléphone ou 👤 Nom d\'utilisateur',
    discovers: '💬 Identifiant numérique fixe (ID), 🖼️ Photo de profil, 🕒 Statut de présence',
    engine: 'Telethon MTProto + Coffre de sessions sécurisé',
    desc: 'Retrouve l\'identifiant Telegram permanent et la photo d\'un suspect à partir de son numéro sans révéler l\'enquêteur.',
    active: true
  },
  {
    id: 'tool_soc_whatsapp_business',
    name: 'Inspecteur de Profils & Catalogues WhatsApp',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'ACCOUNT',
    reqLabel: '👤 Compte Infiltration Requis',
    startClue: '📱 Numéro de Téléphone',
    discovers: '🏪 Catalogue commercial WhatsApp Business, 🖼️ Photo avatar, 📝 Description',
    engine: 'WhatsApp Web Headless Worker via Coffre Sécurisé',
    desc: 'Récupère la photo de profil et la liste des articles proposés dans le catalogue WhatsApp d\'un escroc.',
    active: true
  },
  {
    id: 'tool_soc_instagram_osint',
    name: 'Analyseur de Profils & Mentions Instagram',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'ACCOUNT',
    reqLabel: '👤 Compte Infiltration Requis',
    startClue: '👤 Compte Instagram ou 📱 Numéro Téléphone',
    discovers: '📸 Publications, 📍 Lieux géomarqués, 👥 Personnes taguées, 📧 E-mail masqué',
    engine: 'Instaloader + Toutatis via Compte d\'enquête',
    desc: 'Télécharge les publications et métadonnées d\'un compte Instagram et vérifie la correspondance de l\'e-mail masqué.',
    active: true
  },
  {
    id: 'tool_soc_marketplaces',
    name: 'Recherche Croisée d\'Annonces (Ouedkniss, Avito, FB)',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📱 Numéro Téléphone ou 🏷️ Titre de l\'annonce',
    discovers: '🛒 Anciennes annonces de vente, 📍 Ville/Wilaya déclarée, 👤 Pseudonyme vendeur',
    engine: 'Scrapy / Playwright multi-marketplaces algériennes',
    desc: 'Recherche les annonces publiées par le même numéro sur Ouedkniss ou Facebook Marketplace au cours des années précédentes.',
    active: true
  },
  {
    id: 'tool_soc_social_mapper',
    name: 'Corrélateur Visuel Multi-Plateformes (Social Mapper)',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'ACCOUNT',
    reqLabel: '👤 Compte Infiltration Requis',
    startClue: '👤 Nom du Suspect + 🖼️ Photo de Visage',
    discovers: '🌐 Profils correspondants sur Facebook, Instagram, LinkedIn et Twitter',
    engine: 'Social Mapper + Moteur de reconnaissance faciale',
    desc: 'Retrouve automatiquement les profils d\'une personne sur plusieurs réseaux sociaux en comparant son visage.',
    active: true
  },
  {
    id: 'tool_soc_video_archiver',
    name: 'Téléchargeur & Découpeur de Vidéos Réseaux Sociaux',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Lien de Vidéo (TikTok, YouTube, Facebook)',
    discovers: '🎥 Fichier vidéo source, 🎵 Piste audio MP3 isolée, 📝 Sous-titres et métadonnées',
    engine: 'yt-dlp + FFmpeg local',
    desc: 'Télécharge et fige une vidéo TikTok ou Facebook avec extraction de la piste audio pour analyse vocale.',
    active: true
  },

  // =========================================================================
  // CATEGORY 2: TÉLÉPHONE, E-MAILS & IDENTITÉS (11 Outils)
  // =========================================================================
  {
    id: 'tool_id_phoneinfoga',
    name: 'Reconnaissance Opérateur & Plan de Numérotation',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📱 Numéro de Téléphone',
    discovers: '🏢 Opérateur (Ooredoo, Mobilis, Djezzy), 🌍 Pays/Région, 🔍 Empreintes Google',
    engine: 'PhoneInfoga v2 (Moteur Go natif)',
    desc: 'Identifie le type de ligne (mobile ou fixe), l\'opérateur télécom et génère les requêtes dork de recherche.',
    active: true
  },
  {
    id: 'tool_id_ignorant',
    name: 'Scanner Téléphone sur 100+ Applications (Ignorant)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📱 Numéro de Téléphone',
    discovers: '📸 Compte Instagram, 👻 Snapchat, 🛍️ Amazon, 🎵 TikTok rattachés au numéro',
    engine: 'megadose/ignorant (requêtes HTTP asynchrones)',
    desc: 'Vérifie silencieusement si un numéro est inscrit sur Instagram, Snapchat ou Amazon sans envoyer de SMS d\'alerte.',
    active: true
  },
  {
    id: 'tool_id_caller_id',
    name: 'Annuaire Inversé & Signalements Spam (Caller ID)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '📱 Numéro de Téléphone',
    discovers: '👤 Nom d\'enregistrement communautaire (Caller ID), 🚨 Signalements arnaque',
    engine: 'Connecteurs d\'annuaires inversés publics (Truecaller / Eyecon)',
    desc: 'Découvre sous quel nom le numéro est enregistré dans les répertoires téléphoniques d\'autres utilisateurs.',
    active: true
  },
  {
    id: 'tool_id_maigret',
    name: 'Recherche de Pseudonyme sur 2 500+ Sites (Maigret)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Pseudonyme / Nom d\'utilisateur',
    discovers: '🌐 Comptes sur forums, jeux, réseaux sociaux, 🖼️ Avatars et biographies',
    engine: 'soxoj/maigret (Module Python asynchrone)',
    desc: 'Dresse le dossier numérique complet d\'un pseudonyme en scannant plus de 2500 plateformes sur le web.',
    active: true
  },
  {
    id: 'tool_id_sherlock',
    name: 'Balayage Rapide de Nom d\'Utilisateur (Sherlock)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Pseudonyme / Nom d\'utilisateur',
    discovers: '🌐 Liste des profils actifs sur les 400 plus grands réseaux sociaux mondiaux',
    engine: 'sherlock-project/sherlock (Moteur Python)',
    desc: 'Vérification ultrarapide de la présence d\'un pseudo sur les principaux réseaux sociaux.',
    active: true
  },
  {
    id: 'tool_id_blackbird',
    name: 'Chasseur de Pseudonymes & E-mails (Blackbird)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Pseudonyme ou 📧 Adresse E-mail',
    discovers: '🌐 Profils correspondants sur 600+ plateformes avec métadonnées JSON',
    engine: 'p1ngul1n0/blackbird',
    desc: 'Recherche rapide d\'alias et d\'adresses e-mail avec validation rigoureuse des faux positifs.',
    active: true
  },
  {
    id: 'tool_id_holehe',
    name: 'Énumération de Comptes E-mail (Holehe)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📧 Adresse E-mail',
    discovers: '🌐 Services où l\'e-mail est inscrit (120+ sites), 📱 Indice de numéro de récupération',
    engine: 'megadose/holehe',
    desc: 'Interroge les formulaires d\'oubli de mot de passe de 120 sites pour savoir où l\'e-mail est utilisé.',
    active: true
  },
  {
    id: 'tool_id_ghunt',
    name: 'Enquête sur Compte Google & Avis Maps (GHunt v2)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'ACCOUNT',
    reqLabel: '👤 Compte Infiltration Requis',
    startClue: '📧 Adresse Gmail ou Identifiant Gaia ID',
    discovers: '📍 Avis Google Maps et lieux fréquentés, 🖼️ Photo du compte, 📺 Chaîne YouTube',
    engine: 'mxrch/GHunt v2',
    desc: 'Permet de géolocaliser les quartiers et commerces fréquentés par un suspect grâce à ses avis Google Maps publics.',
    active: true
  },
  {
    id: 'tool_id_h8mail',
    name: 'Recherche dans les Fuites de Données & Stealers (h8mail)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📧 E-mail, 📱 Numéro Téléphone ou 👤 Pseudo',
    discovers: '🔑 Mots de passe dérobés, 🖥️ Anciennes adresses IP de connexion, 👤 Vrais noms',
    engine: 'khast3x/h8mail + Base DuckDB locale',
    desc: 'Recherche si l\'e-mail ou le téléphone est apparu dans d\'anciennes fuites de données de sites web.',
    active: true
  },
  {
    id: 'tool_id_dehashed',
    name: 'Requêteur de Bases de Données Compromises (DeHashed)',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '📧 E-mail, 👤 Pseudo ou 📱 Téléphone',
    discovers: '🏠 Anciennes adresses postales de livraison, 🖥️ Historiques d\'IP',
    engine: 'API DeHashed / LeakCheck',
    desc: 'Permet de croiser un pseudonyme avec des données de livraison physiques issues de failles de sites e-commerce.',
    active: true
  },
  {
    id: 'tool_id_e164_norm',
    name: 'Normaliseur & Validateur International de Téléphones',
    category: 'phone_id',
    catName: '📱 Téléphone, E-mails & Identités',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📱 Chaîne de caractères de numéro brute',
    discovers: '📱 Format international strict (+213...), 📱 Format local (05...), Validité',
    engine: 'Google libphonenumber',
    desc: 'Normalise toute variante de numéro saisie par les victimes pour assurer une recherche sans doublons.',
    active: true
  },

  // =========================================================================
  // CATEGORY 3: SITES WEB, CODES & SERVEURS (12 Outils)
  // =========================================================================
  {
    id: 'tool_web_objectid_decode',
    name: 'Décodeur d\'Identifiants Web (MongoDB & UUIDv1)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🏷️ Code interne d\'URL ou d\'annonce (24 hex)',
    discovers: '🕒 Horodatage exact de création (à la seconde près), 🖥️ Empreinte du serveur hôte',
    engine: 'Décodeur déterministe d\'ObjectId & UUID',
    desc: 'Convertit un code comme 672f9a10... en date exacte de mise en service du faux produit par l\'escroc.',
    active: true
  },
  {
    id: 'tool_web_reverse_pixel',
    name: 'Recherche Inversée de Pixel Meta & Google Analytics',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🏷️ Identifiant de traceur (Pixel Meta / GA)',
    discovers: '🌐 Tous les autres sites web utilisant exactement le même identifiant',
    engine: 'PublicWWW + URLScan.io API',
    desc: 'Découvre toutes les boutiques frauduleuses créées par le même individu partageant son compte publicitaire.',
    active: true
  },
  {
    id: 'tool_web_httpx',
    name: 'Empreinte Technique HTTP, Favicon & JARM (httpx)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Lien de Site Web ou Nom de Domaine',
    discovers: '🏷️ Hachage Favicon MurmurHash3, 🔒 Empreinte TLS JARM, 🖥️ Technologies',
    engine: 'projectdiscovery/httpx (Moteur Go)',
    desc: 'Identifie le kit de phishing utilisé en calculant l\'empreinte de son icône et de son certificat TLS.',
    active: true
  },
  {
    id: 'tool_web_katana',
    name: 'Explorateur Web & Analyseur de Scripts JS (Katana)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Lien de Site Web',
    discovers: '🔗 Pages cachées /admin, 🔑 Clés d\'API ou tokens de bots Telegram codés en dur',
    engine: 'projectdiscovery/katana (Crawler headless)',
    desc: 'Analyse le code source de la fausse boutique pour trouver où les commandes des victimes sont envoyées.',
    active: true
  },
  {
    id: 'tool_web_subfinder',
    name: 'Découverte Passive de Sous-Domaines (Subfinder)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🌐 Nom de Domaine',
    discovers: '🌐 Sous-domaines (ex: api.promo-pneus.shop, admin.promo-pneus.shop)',
    engine: 'projectdiscovery/subfinder',
    desc: 'Retrouve les portails d\'administration ou de test masqués sur l\'infrastructure de l\'escroc.',
    active: true
  },
  {
    id: 'tool_web_amass',
    name: 'Cartographie Complète d\'Infrastructure Réseau (Amass)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Nom de Domaine ou Numéro d\'ASN',
    discovers: '🕸️ Graphe complet des serveurs, blocs d\'IP et routages BGP associés',
    engine: 'OWASP Amass (Moteur Go)',
    desc: 'Cartographie les réseaux criminels étendus opérant sur plusieurs plages d\'adresses IP.',
    active: true
  },
  {
    id: 'tool_web_shodan',
    name: 'Reconnaissance d\'Adresses IP & Ports Ouverts (Shodan)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🖥️ Adresse IP',
    discovers: '🚪 Ports ouverts, 🏷️ Logiciels serveurs (Node.js, Express, Nginx), 🌍 Ville hébergeur',
    engine: 'Shodan API',
    desc: 'Inspecte le serveur physique hébergeant le faux site web sans envoyer de paquets intrusifs.',
    active: true
  },
  {
    id: 'tool_web_censys',
    name: 'Recherche de Certificats & Hôtes (Censys)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🖥️ Adresse IP ou 🔒 Certificat TLS',
    discovers: '🔒 Historique des certificats SSL/TLS, autres noms de domaines rattachés',
    engine: 'Censys Search API',
    desc: 'Retrouve les autres sites web partageant le même certificat HTTPS que l\'escroc.',
    active: true
  },
  {
    id: 'tool_web_whois_history',
    name: 'Historique WHOIS & Propriétaires de Domaines',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🌐 Nom de Domaine',
    discovers: '📧 E-mail du déclarant initial, 🏢 Bureau d\'enregistrement (Registrar), 📅 Dates',
    engine: 'SecurityTrails / Whoxy API',
    desc: 'Retrouve l\'e-mail utilisé avant que le criminel n\'active le masque d\'anonymisation WHOIS.',
    active: true
  },
  {
    id: 'tool_web_dnsx',
    name: 'Résolveur DNS Haute Vitesse & Enregistrements A/MX',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Nom de Domaine',
    discovers: '🖥️ Adresse IP actuelle, 📧 Serveurs de messagerie MX, Enregistrements TXT',
    engine: 'projectdiscovery/dnsx',
    desc: 'Résout instantanément tous les enregistrements DNS d\'un site pour trouver le vrai serveur hôte.',
    active: true
  },
  {
    id: 'tool_web_trufflehog',
    name: 'Chasseur de Mots de Passe & Clés d\'API (TruffleHog)',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Page Web ou Fichier JS',
    discovers: '🤖 Clés de Bot Telegram, Mots de passe de base de données, Clés Firebase',
    engine: 'trufflesecurity/trufflehog (Moteur Go)',
    desc: 'Extrait les clés de bots Telegram souvent oubliées dans le code JavaScript de fausses boutiques.',
    active: true
  },
  {
    id: 'tool_web_gowitness',
    name: 'Générateur de Captures Visuelles & Aperçus DOM',
    category: 'web_infra',
    catName: '🌐 Sites Web & Serveurs',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🌐 Lien de Site Web ou IP',
    discovers: '🖼️ Vignette visuelle de la page pour la fiche du graphe, En-têtes HTTP',
    engine: 'sensepost/gowitness (Chromium headless)',
    desc: 'Génère automatiquement une image d\'aperçu du site qui s\'affiche sur la carte du tableau d\'enquête.',
    active: true
  },

  // =========================================================================
  // CATEGORY 4: MÉDIAS, VISAGES, AUDIO & SIG (11 Outils)
  // =========================================================================
  {
    id: 'tool_media_exiftool',
    name: 'Lecteur Avancé de Métadonnées Photo/Vidéo (ExifTool)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Fichier Image, Vidéo ou PDF',
    discovers: '📍 Coordonnées GPS, 📱 Modèle de smartphone/caméra, 🕒 Date/Heure de prise de vue',
    engine: 'Phil Harvey ExifTool (Exécution 100% locale)',
    desc: 'Extrait les métadonnées cachées des photos transmises par les victimes ou les suspects.',
    active: true
  },
  {
    id: 'tool_media_sherloq',
    name: 'Détecteur de Retouches & Falsification (Sherloq ELA)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Image de Reçu, Facture ou Document',
    discovers: '🎨 Carte thermique des zones modifiées (Error Level Analysis), Détection copier-coller',
    engine: 'GuidoBartoli/sherloq (OpenCV / Python)',
    desc: 'Prouve scientifiquement si le montant d\'un reçu de virement CCP ou d\'une facture a été retouché.',
    active: true
  },
  {
    id: 'tool_media_reverse_image',
    name: 'Recherche Inversée d\'Images Multi-Moteurs',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Photo de Produit ou d\'Objet',
    discovers: '🌐 Sites web d\'origine où la photo a été volée, 📅 Date de première parution',
    engine: 'Google Lens + Yandex Images + TinEye Scrapers',
    desc: 'Prouve que les photos de pneus utilisées dans l\'annonce proviennent en réalité d\'un catalogue étranger.',
    active: true
  },
  {
    id: 'tool_media_deepface',
    name: 'Comparaison Faciale Biométrique ArcFace (512-d)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Deux photos contenant des visages',
    discovers: '🎯 Score de similarité biométrique en %, Confirmation qu\'il s\'agit de la même personne',
    engine: 'serengil/deepface (Modèle ArcFace 512 dimensions hors-ligne)',
    desc: 'Compare les photos de profil Telegram et Instagram pour certifier qu\'elles appartiennent au même individu.',
    active: true
  },
  {
    id: 'tool_media_pimeyes',
    name: 'Recherche Faciale Globale sur le Web (PimEyes)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'PAID',
    reqLabel: '💳 Abonnement Commercial Requis',
    startClue: '🖼️ Photo nette d\'un visage',
    discovers: '🌐 Liens vers tous les sites internet publics où ce visage apparaît',
    engine: 'PimEyes API Commerciale',
    desc: 'Permet de retrouver un suspect inconnu à partir d\'une simple capture de vidéosurveillance.',
    active: false
  },
  {
    id: 'tool_media_geoclip',
    name: 'Localisateur Visuel par IA (GeoCLIP)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Photo Extérieure sans GPS',
    discovers: '🗺️ Carte de probabilité des coordonnées géographiques probables',
    engine: 'VicenteVivan/geo-clip (Modèle PyTorch local)',
    desc: 'Estime le lieu de prise d\'une photo extérieure grâce à l\'architecture, la végétation et le relief.',
    active: true
  },
  {
    id: 'tool_media_shadowfinder',
    name: 'Chronolocalisation par les Ombres (ShadowFinder)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Photo avec ombre visible + Angle mesuré',
    discovers: '☀️ Créneau horaire de la prise de vue, 🗺️ Bande de latitude géographique',
    engine: 'Bellingcat ShadowFinder + Éphémérides astronomiques',
    desc: 'Calcule l\'heure exacte de capture d\'une photo en mesurant la longueur et l\'orientation de ses ombres.',
    active: true
  },
  {
    id: 'tool_media_faster_whisper',
    name: 'Transcription Vocale Hors-Ligne (Faster-Whisper)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🎙️ Message Vocal WhatsApp/Telegram ou Vidéo',
    discovers: '📝 Transcription textuelle complète en arabe/darija/français, 📱 Entités citées',
    engine: 'SYSTRAN/faster-whisper (CTranslate2 local)',
    desc: 'Transcrit les messages vocaux de l\'escroc et en extrait les numéros ou adresses mentionnés oralement.',
    active: true
  },
  {
    id: 'tool_media_pyannote_speaker',
    name: 'Diarisation & Correspondance Vocale du Locuteur',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🎙️ Deux enregistrements vocaux distincts',
    discovers: '🗣️ Confirmation biométrique que la même personne parle dans les deux enregistrements',
    engine: 'pyannote.audio (Empreinte vocale locale)',
    desc: 'Vérifie si la voix d\'un message vocal récent correspond à celle d\'un suspect dans une affaire antérieure.',
    active: true
  },
  {
    id: 'tool_media_deepfake_audio',
    name: 'Détecteur de Voix Synthétisée / Clonée par IA',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🎙️ Enregistrement audio suspect',
    discovers: '🚨 Score de probabilité de voix clonée par IA vs voix humaine naturelle',
    engine: 'Modèle spectral de détection de synthèse vocale',
    desc: 'Alerte l\'enquêteur si un message de rançon ou d\'appel d\'urgence est généré par un synthétiseur d\'IA.',
    active: true
  },
  {
    id: 'tool_media_overpass_osm',
    name: 'Géocodeur Visuel d\'Éléments (Overpass Turbo)',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📍 Combinaison d\'indices (ex: pharmacie + rond-point + mosquée)',
    discovers: '🗺️ Emplacements exacts sur la carte correspondant à cette configuration',
    engine: 'Overpass Turbo API (OpenStreetMap)',
    desc: 'Retrouve l\'intersection exacte visible en arrière-plan d\'une vidéo ou d\'une photo.',
    active: true
  },

  // =========================================================================
  // CATEGORY 5: ENQUÊTE POLICIÈRE, CDR & VÉHICULES (9 Outils)
  // =========================================================================
  {
    id: 'tool_pol_cdr_parser',
    name: 'Analyseur de Relevés Télécoms Opérateurs (CDR)',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📄 Fichier Excel/CSV de réquisition Ooredoo/Mobilis/Djezzy',
    discovers: '📞 Graphe des correspondants fréquents, 📱 Numéros IMEI/IMSI utilisés',
    engine: 'Parser CDR judiciaire interne (Algorithme Python)',
    desc: 'Importe et structure en secondes les milliers de lignes d\'appels téléphoniques d\'un suspect.',
    active: true
  },
  {
    id: 'tool_pol_cell_triangulation',
    name: 'Bornage & Cartographie des Antennes Relais',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📡 Identifiants Cell ID + Date/Heure',
    discovers: '🗺️ Secteur de couverture de l\'antenne relais, Trajectoire de déplacement',
    engine: 'Modélisateur Voronoi d\'antennes cellulaires locales',
    desc: 'Trace les déplacements du suspect sur la carte en reliant les antennes téléphoniques déclenchées.',
    active: true
  },
  {
    id: 'tool_pol_cotravelers',
    name: 'Détecteur de Téléphones Jumeaux (Co-Déplacement)',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📄 Relevés CDR de plusieurs lignes téléphoniques',
    discovers: '👥 Paires de téléphones bornant ensemble aux mêmes horaires et trajets',
    engine: 'Algorithme spatio-temporel de détection de convoi',
    desc: 'Démasque les complices se déplaçant dans le même véhicule lors de la commission d\'une infraction.',
    active: true
  },
  {
    id: 'tool_pol_alibi_checker',
    name: 'Contrôleur de Contradictions d\'Alibi & Vitesse',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📅 Déclarations de témoins + Bornages techniques',
    discovers: '⚠️ Alertes d\'impossibilité physique de déplacement (vitesse excessive requise)',
    engine: 'Moteur routier OSRM + Solveur de contraintes temporelles',
    desc: 'Vérifie si un suspect pouvait matériellement se trouver au lieu du délit au moment des faits.',
    active: true
  },
  {
    id: 'tool_pol_alpr_plate',
    name: 'Reconnaissance de Plaques d\'Immatriculation (ALPR)',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Photo ou Vidéo de Véhicule',
    discovers: '🚗 Numéro de plaque minéralogique, Modèle et couleur du véhicule',
    engine: 'OpenALPR / PlateRecognizer conteneurisé',
    desc: 'Lit les plaques d\'immatriculation sur les photos ou vidéos de surveillance.',
    active: true
  },
  {
    id: 'tool_pol_vin_decoder',
    name: 'Décodeur de Numéro de Châssis (VIN) & Fichier Auto',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🚗 Numéro VIN à 17 caractères',
    discovers: '🏭 Usine de fabrication, Année modèle, Caractéristiques techniques d\'origine',
    engine: 'Décodeur ISO 3779 VIN',
    desc: 'Vérifie si le véhicule utilisé lors de la livraison des faux pneus n\'a pas un châssis maquillé.',
    active: true
  },
  {
    id: 'tool_pol_prior_cases',
    name: 'Rapprochement avec Plaintes Antérieures & Récidive',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📱 Téléphone, 💳 Compte CCP ou 🏷️ Mode opératoire',
    discovers: '🚨 Affaires antérieures de la brigade présentant les mêmes éléments',
    engine: 'Recherche de sous-graphes Neo4j + similarité vectorielle',
    desc: 'Alerte l\'officier si le même numéro de téléphone a déjà fait l\'objet d\'un dépôt de plainte le mois dernier.',
    active: true
  },
  {
    id: 'tool_pol_requisition_gen',
    name: 'Rédacteur Automatique de Réquisitions Judiciaires',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🎯 Fiche d\'indice (Ligne Téléphone, Compte CCP, Page FB)',
    discovers: '📄 Document officiel de réquisition prêt à signer (Word / PDF)',
    engine: 'Générateur de formulaires juridiques conformes au CPP',
    desc: 'Génère en quelques secondes la réquisition pour Ooredoo, Mobilis, Algérie Poste ou Meta.',
    active: true
  },
  {
    id: 'tool_pol_trocr_handwriting',
    name: 'Numérisation de Dépositions Manuscrites (OCR)',
    category: 'police_forensics',
    catName: '🚔 Enquête Policière & Télécoms',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📄 Scan de déposition ou PV rédigé à la main',
    discovers: '📝 Texte numérique cherchable en arabe et français, Noms et dates indexés',
    engine: 'Tesseract OCR + TrOCR pour écriture manuscrite',
    desc: 'Permet de rendre les dossiers papiers scannés interrogeables sur le tableau d\'enquête.',
    active: true
  },

  // =========================================================================
  // CATEGORY 6: BANQUES, CCP & CRYPTO (9 Outils)
  // =========================================================================
  {
    id: 'tool_fin_ccp_validator',
    name: 'Validateur de Compte CCP & Clé (Algérie Poste)',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '💳 Numéro de compte CCP brut ou demande d\'acompte',
    discovers: '🏦 Calcul et vérification de la Clé CCP, Centre de chèques postaux de rattachement',
    engine: 'Algorithme officiel de contrôle de clé Algérie Poste',
    desc: 'Valide l\'authenticité d\'un compte postal demandé aux victimes pour verser l\'acompte.',
    active: true
  },
  {
    id: 'tool_fin_iban_bic',
    name: 'Résolveur de RIB Bancaire & Code Swift/BIC (Schwifty)',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '💳 RIB ou IBAN Bancaire',
    discovers: '🏦 Établissement bancaire (BNA, BEA, CPA, Al Baraka), Code agence et agence locale',
    engine: 'mdomke/schwifty (Bibliothèque Python hors-ligne)',
    desc: 'Identifie instantanément la banque et l\'agence où le compte de l\'escroc est domicilié.',
    active: true
  },
  {
    id: 'tool_fin_baridimob',
    name: 'Vérificateur d\'Identifiants BaridiMob & RIP',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '💳 Numéro RIP ou alias BaridiMob',
    discovers: '🏦 Structure de compte certifiée, Alerte si compte répertorié dans des affaires de mule',
    engine: 'Validateur d\'identifiant BaridiMob local',
    desc: 'Contrôle les comptes mobiles de paiement rapide utilisés pour disperser les acomptes volés.',
    active: true
  },
  {
    id: 'tool_fin_mule_ledger',
    name: 'Registre des Comptes Mules & Récidive Financière',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '💳 Numéro CCP ou RIB',
    discovers: '🚨 Signalements de multiples victimes ayant versé de l\'argent au même destinataire',
    engine: 'Base interne relationnelle des signalements financiers',
    desc: 'Prouve le caractère organisé de l\'escroquerie en montrant que 5 victimes ont versé des acomptes au même CCP.',
    active: true
  },
  {
    id: 'tool_fin_graphsense',
    name: 'Traçage de Portefeuilles Crypto (GraphSense)',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🪙 Adresse de portefeuille (USDT-TRC20, BTC, ETH)',
    discovers: '🔗 Regroupement de portefeuilles appartenant au même suspect, 🏦 Plateformes d\'encaissement (Binance)',
    engine: 'graphsense/graphsense-lib (Moteur open-source local)',
    desc: 'Suit les transferts de crypto-monnaies d\'escroqueries d\'investissement jusqu\'aux plateformes de retrait d\'argent.',
    active: true
  },
  {
    id: 'tool_fin_blockchain_rpc',
    name: 'Explorateur de Transactions Blockchain Public',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🪙 Hachage de transaction ou Adresse publique',
    discovers: '💰 Montant exact transféré en USD, Date et heure précises, Frais de réseau',
    engine: 'Nœuds RPC publics / TronScan / Etherscan API',
    desc: 'Certifie le transfert effectif des fonds dérobés sur le registre blockchain public.',
    active: true
  },
  {
    id: 'tool_fin_mixer_taint',
    name: 'Calculateur de Contamination par Mixeurs (Taint Score)',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🪙 Portefeuille Crypto',
    discovers: '🚨 Pourcentage de fonds provenant de services de blanchiment (Tornado Cash, ChipMixer)',
    engine: 'Algorithme d\'analyse de contamination UTXO/Token',
    desc: 'Alerte l\'enquêteur si l\'escroc tente de blanchir les fonds en les passant dans un mixeur.',
    active: true
  },
  {
    id: 'tool_fin_opencorporates',
    name: 'Registre des Entreprises & Bénéficiaires Effectifs',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'KEY_FREE',
    reqLabel: '🔑 Clé API Gratuite',
    startClue: '🏢 Nom d\'Entreprise ou Nom de Gérant',
    discovers: '👤 Dirigeants officiels, 🏠 Siège social légal, 📅 Date de constitution',
    engine: 'OpenCorporates API + Connecteurs de registres de commerce',
    desc: 'Vérifie si la société de vente de pneus existe légalement au registre du commerce ou s\'il s\'agit d\'une coquille vide.',
    active: true
  },
  {
    id: 'tool_fin_opensanctions',
    name: 'Criblage Sanctions Internationales & Interpol (Yente)',
    category: 'finance_crypto',
    catName: '💳 Banques, CCP & Crypto',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Nom de Personne ou 🏢 Société',
    discovers: '🚨 Notices Rouges Interpol, Listes de sanctions internationales (ONU, UE, OFAC)',
    engine: 'opensanctions/yente (Conteneur local FollowTheMoney)',
    desc: 'Contrôle instantané pour savoir si un suspect fait l\'objet d\'un mandat d\'arrêt international.',
    active: true
  }
,
  // =========================================================================
  // TRAITEMENT VOCAL SPÉCIALISÉ: DARIJA ALGÉRIENNE
  // =========================================================================
  {
    id: 'tool_audio_darija_algeria',
    name: 'Traitement Vocal & Transcription de la Darija Algérienne',
    category: 'media_geoint',
    catName: '🖼️ Photos, Visages, Audio & SIG',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🎙️ Note Vocale WhatsApp / Audio (.ogg, .opus, .mp3, .m4a)',
    discovers: '📝 Transcription bilingue Darija phonétique + Traduction, Diarisation locuteurs, Surlignage montants DZD & points de rdv',
    engine: 'Faster-Whisper (modèle fine-tuné Maghreb) + PyAnnote Audio 3.1 + Regex IOCs',
    desc: 'Transcrit et analyse les notes vocales WhatsApp échangées en arabe dialectal algérien (Darija), séparant les voix et détectant automatiquement les montants en dinars et les rendez-vous.',
    active: true
  },

  // =========================================================================
  // CATEGORY 7: ANALYSE DES RÉSEAUX SOCIAUX & GRAPHES CRIMINELS (SNA) - 5 Outils
  // =========================================================================
  {
    id: 'tool_sna_louvain_communities',
    name: 'Détection de Communautés & Cellules Criminelles (Louvain / Leiden)',
    category: 'sna_graph',
    catName: '🕸️ Graphes & Réseaux Criminels (SNA)',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🕸️ Graphe de Relations ou Relevés d\'Appels (CDR)',
    discovers: '👥 Découpage automatique en cellules étanches, sous-groupes et bandes organisées',
    engine: 'NetworkX + CDlib (Communautés de Louvain / Algorithme de Leiden)',
    desc: 'Partitionne mathématiquement les centaines de contacts pour faire émerger visuellement les sous-groupes criminels opérant ensemble.',
    active: true
  },
  {
    id: 'tool_sna_betweenness_centrality',
    name: 'Identification de la Tête de Réseau & Cerveau (Betweenness & PageRank)',
    category: 'sna_graph',
    catName: '🕸️ Graphes & Réseaux Criminels (SNA)',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🕸️ Graphe des Communications et Flux Financiers',
    discovers: '👑 Score d\'Intermédiarité : Identification du cerveau / donneur d\'ordres caché vs mules',
    engine: 'NetworkX / igraph Centrality Algorithms',
    desc: 'Distingue mathématiquement le chef de réseau (le donneur d\'ordres caché) des simples complices et comptes mules.',
    active: true
  },
  {
    id: 'tool_sna_ego_network',
    name: 'Extraction du Réseau d\'Égo & Nœuds Passerelles (Ego-Network)',
    category: 'sna_graph',
    catName: '🕸️ Graphes & Réseaux Criminels (SNA)',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Nœud d\'un Suspect Identifié',
    discovers: '🌉 Nœuds passerelles uniques et entourage immédiat (1er et 2nd degré)',
    engine: 'NetworkX Ego-Graph Filter & Bridge Node Finder',
    desc: 'Isole un suspect central pour identifier ses contacts pivots indispensables au fonctionnement du réseau.',
    active: true
  },
  {
    id: 'tool_sna_link_prediction',
    name: 'Prédiction de Liens Cachés & Complices Probables (Link Prediction)',
    category: 'sna_graph',
    catName: '🕸️ Graphes & Réseaux Criminels (SNA)',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👥 Deux Suspects ou Groupes Distincts',
    discovers: '🔗 Score de probabilité de complicité non encore observée (Adamic-Adar / Jaccard)',
    engine: 'Scikit-Network Link Predictor',
    desc: 'Révèle des connexions secrètes probables entre suspects partageant des complices, des bornes ou des horaires identiques.',
    active: true
  },
  {
    id: 'tool_sna_temporal_evolution',
    name: 'Évolution Temporelle du Réseau Criminel (Dynamic Network Timeline)',
    category: 'sna_graph',
    catName: '🕸️ Graphes & Réseaux Criminels (SNA)',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📅 Horodatages des Premiers Contacts, Appels & Virements',
    discovers: '📈 Chronologie animée de l\'expansion du gang et du recrutement des mules au fil des mois',
    engine: 'D3.js Time-Indexed Graph Animator + NetworkX Temporal',
    desc: 'Visualise étape par étape comment le réseau criminel s\'est constitué et étendu au cours des mois.',
    active: true
  },

  // =========================================================================
  // CATEGORY 8: NOUVEAUX OUTILS MODERNES GITHUB & FORENSICS AVANCÉS - 8 Outils
  // =========================================================================
  {
    id: 'tool_bellingcat_auto_archiver',
    name: 'Bellingcat Auto-Archiver Multi-Plateforme',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📢 URLs de Post (FB, TikTok, Telegram, Twitter, YouTube)',
    discovers: '🗄️ Capture vidéo HD, snapshots Wayback/Archive.today, métadonnées JSON complètes',
    engine: 'GitHub: bellingcat/auto-archiver (Python + Playwright + yt-dlp)',
    desc: 'Archivage forensique automatisé développé par Bellingcat préservant l\'intégrité des médias avant suppression par les suspects.',
    active: true
  },
  {
    id: 'tool_osint_maigret',
    name: 'Maigret — Recherche de Profils & Dossier d\'Identité Numérique',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '👤 Pseudonyme, Alias ou Identifiant Unique',
    discovers: '🌐 Présence confirmée sur 3 000+ plateformes, photos associées, tags, liens croisés',
    engine: 'GitHub: soxoj/maigret (Successeur de Sherlock avec extraction de métadonnées)',
    desc: 'Explore plus de 3 000 sites, forums et réseaux pour reconstituer la présence en ligne d\'un alias et extraire les informations de profil.',
    active: true
  },
  {
    id: 'tool_telegram_telepath',
    name: 'Telepath — Renseignement Criminel sur Canaux & Groupes Telegram',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'ACCOUNT',
    reqLabel: '🟡 Compte Dédié (Session Telegram)',
    startClue: '💬 Canal, Groupe de Vente ou Identifiant Telegram',
    discovers: '📥 Historique des messages, fichiers audio/vocaux, liste des membres, messages transférés',
    engine: 'GitHub: telepath-osint / Telethon API Scraper',
    desc: 'Surveille et archive les groupes de revente illégale et d\'escroqueries sur Telegram, téléchargeant les vocaux et messages effacés.',
    active: true
  },
  {
    id: 'tool_google_ghunt_v2',
    name: 'GHunt v2 — Renseignement sur Compte Google & Avis Google Maps',
    category: 'tel_email',
    catName: '📱 Téléphone, E-mail & Identité',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📧 Adresse Gmail ou Identifiant Gaia ID',
    discovers: '📍 Avis Google Maps laissés (lieux fréquentés), Albums photos Google, Marque d\'appareils',
    engine: 'GitHub: mxrch/GHunt v2.0',
    desc: 'Révèle les traces physiques d\'un suspect à partir de son compte Gmail : avis laissés sur des commerces, photos publiques et localisation.',
    active: true
  },
  {
    id: 'tool_instagram_toutatis',
    name: 'Toutatis — Extraction d\'Identifiants Masqués Instagram',
    category: 'socmint',
    catName: '📢 Réseaux Sociaux & Annonces',
    req: 'ACCOUNT',
    reqLabel: '🟡 Compte Dédié (Session Instagram)',
    startClue: '📷 Nom d\'utilisateur Instagram',
    discovers: '📱 Fragments de numéro de téléphone (+213 ••• •• 283), E-mail de récupération masqué, ID numérique',
    engine: 'GitHub: megadose/toutatis',
    desc: 'Interroge les points d\'authentification Instagram pour révéler les terminaisons de numéros et adresses mails associés au profil commercial.',
    active: true
  },
  {
    id: 'tool_cyberchef_engine',
    name: 'CyberChef Engine — Décodage Forensique & Hachage Cryptographique',
    category: 'web_infra',
    catName: '🌐 Sites Web & Infrastructure',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📄 Chaîne encodée, URL masquée, QR code ou Fichier suspect',
    discovers: '🔓 Décodage Base64/Hex, Extraction Regex de RIB/CCP, Empreintes SHA-256/MD5',
    engine: 'GitHub: gchq/CyberChef (Moteur d\'analyse cryptographique et forensique)',
    desc: 'La "boîte à outils universelle" pour décoder instantanément les liens obfusqués, extraire les comptes CCP via regex et vérifier les hachages.',
    active: true
  },
  {
    id: 'tool_facial_insightface',
    name: 'InsightFace / ArcFace — Regroupement & Comparaison Faciale SOTA',
    category: 'photo_geo',
    catName: '🖼️ Photos, Visages & Géolocalisation',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '🖼️ Deux ou plusieurs visages découverts sur les réseaux',
    discovers: '👤 Vecteur facial 512-D, Score de similitude biométrique, Regroupement d\'identités',
    engine: 'GitHub: deepinsight/insightface + ONNX Runtime (ArcFace ResNet-100)',
    desc: 'Modèle biométrique de référence permettant de comparer les photos de profil Facebook, WhatsApp et pièces d\'identité avec haute précision.',
    active: true
  },
  {
    id: 'tool_metadata_mat2',
    name: 'MAT2 & ExifTool Pro — Analyse Forensique Complète des Métadonnées',
    category: 'photo_geo',
    catName: '🖼️ Photos, Visages & Géolocalisation',
    req: 'DIRECT',
    reqLabel: '🟢 Direct & Gratuit (Local)',
    startClue: '📸 Fichier Image ou Document PDF original',
    discovers: '📍 Coordonnées GPS précises, Numéro de série d\'appareil photo, Logiciel d\'édition (Photoshop détecté)',
    engine: 'GitHub: jvoisin/mat2 + Phil Harvey ExifTool',
    desc: 'Audit approfondi de la structure binaire des images pour détecter si une facture ou un reçu de virement a été falsifié sous Photoshop.',
    active: true
  }
];

let activeCategoryFilter = 'all';

function renderToolsInventory() {
  const tbody = document.getElementById('tools-tbody');
  if (!tbody) return;

  const searchEl = document.getElementById('tool-search-input'); const searchQuery = (searchEl && searchEl.value ? searchEl.value : '').toLowerCase().trim();
  const reqEl = document.getElementById('req-filter-select'); const reqFilter = (reqEl && reqEl.value ? reqEl.value : 'all');

  let filtered = FULL_TOOLS_INVENTORY.filter(tool => {
    const matchesCat = (activeCategoryFilter === 'all' || tool.category === activeCategoryFilter);
    const matchesReq = (reqFilter === 'all' || tool.req === reqFilter);
    const textCorpus = `${tool.name} ${tool.desc} ${tool.startClue} ${tool.discovers} ${tool.engine}`.toLowerCase();
    const matchesSearch = !searchQuery || textCorpus.includes(searchQuery);
    return matchesCat && matchesReq && matchesSearch;
  });

  let html = '';
  filtered.forEach(tool => {
    let reqBadgeClass = 'req-direct';
    if (tool.req === 'KEY_FREE') reqBadgeClass = 'req-key-free';
    else if (tool.req === 'ACCOUNT') reqBadgeClass = 'req-account';
    else if (tool.req === 'PAID') reqBadgeClass = 'req-paid';

    html += `
      <tr>
        <td style="text-align:center;">
          <label class="switch-toggle">
            <input type="checkbox" ${tool.active ? 'checked' : ''} onchange="toggleToolActivation('${tool.id}', this.checked)" />
            <span class="slider-toggle"></span>
          </label>
        </td>
        <td>
          <strong style="color:#f1f5f9;font-size:0.92rem;display:block;margin-bottom:0.25rem;">${tool.name}</strong>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin:0;">${tool.desc}</p>
        </td>
        <td><span class="badge badge-blue" style="white-space:nowrap;">${tool.catName}</span></td>
        <td style="font-size:0.82rem;">
          <div style="color:var(--accent-cyan);margin-bottom:0.3rem;"><strong>Départ :</strong> ${tool.startClue}</div>
          <div style="color:var(--accent-emerald);"><strong>Résultat :</strong> ${tool.discovers}</div>
        </td>
        <td>
          <span class="req-badge ${reqBadgeClass}">${tool.reqLabel}</span>
        </td>
        <td>
          <code style="font-size:0.75rem;color:#94a3b8;">${tool.engine}</code>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  updateInventoryCounts();
}

function filterByCategory(cat) {
  activeCategoryFilter = cat;
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${cat}'`));
  });
  renderToolsInventory();
}

function filterToolsInventory() {
  renderToolsInventory();
}

function toggleToolActivation(toolId, isChecked) {
  const t = FULL_TOOLS_INVENTORY.find(item => item.id === toolId);
  if (t) {
    t.active = isChecked;
    updateInventoryCounts();
  }
}

function updateInventoryCounts() {
  const direct = FULL_TOOLS_INVENTORY.filter(t => t.req === 'DIRECT').length;
  const keyFree = FULL_TOOLS_INVENTORY.filter(t => t.req === 'KEY_FREE').length;
  const account = FULL_TOOLS_INVENTORY.filter(t => t.req === 'ACCOUNT').length;
  const paid = FULL_TOOLS_INVENTORY.filter(t => t.req === 'PAID').length;

  if (document.getElementById('count-direct')) document.getElementById('count-direct').innerText = direct;
  if (document.getElementById('count-key')) document.getElementById('count-key').innerText = keyFree;
  if (document.getElementById('count-account')) document.getElementById('count-account').innerText = account;
  if (document.getElementById('count-paid')) document.getElementById('count-paid').innerText = paid;
}


function activateAllTools(enable) {
  FULL_TOOLS_INVENTORY.forEach(function(t) { t.active = enable; });
  renderToolsInventory();
}

function activateDirectOnly() {
  FULL_TOOLS_INVENTORY.forEach(function(t) {
    t.active = (t.req === 'DIRECT');
  });
  renderToolsInventory();
}

function exportToolsConfig() {
  var activeTools = FULL_TOOLS_INVENTORY.filter(function(t) { return t.active; }).map(function(t) {
    return {
      id: t.id,
      name: t.name,
      category: t.category,
      req: t.req,
      engine: t.engine
    };
  });

  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeTools, null, 2));
  var dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "aegis_investigate_arsenal_config.json");
  dlAnchorElem.click();
}

document.addEventListener('DOMContentLoaded', () => {
  renderToolsInventory();
});
