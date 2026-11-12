import json
import sys
sys.path.append('doc')
import update_i18n

# Read base generate_i18n.py
with open('doc/generate_i18n.py', 'r', encoding='utf-8') as f:
    orig_code = f.read()

# Extract translations and tools_catalog
namespace = {}
exec(orig_code.split("js_content = f\"\"\"")[0], namespace)

translations = namespace['translations']
tools_catalog = namespace['tools_catalog']

# Merge menu keys into translations
translations['fr'].update(update_i18n.menu_keys_fr)
translations['ar'].update(update_i18n.menu_keys_ar)
translations['en'].update(update_i18n.menu_keys_en)

# Detailed tool specifications registry
tool_specs = {
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
}

# Generate updated maquette-i18n.js
js_body = f"""/**
 * Athar DZ (أثر) — Forensic OSINT & Judicial Investigation Studio
 * Multilingual Engine & Forensic Workspace Controller.
 * Conforms to SPECIFICATION.md, WCAG 2.2 AA, and Nielsen's Heuristics.
 */

const I18N_TRANSLATIONS = {json.dumps(translations, indent=2, ensure_ascii=False)};
const TOOLS_CATALOG = {json.dumps(tools_catalog, indent=2, ensure_ascii=False)};
const TOOL_SPECS = {json.dumps(tool_specs, indent=2, ensure_ascii=False)};

// Application State
const appState = {{
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
}};

// Lucide SVG Icons Library (Zero Emojis)
function getLucideSvg(name, size = 16, className = '') {{
  const s = size;
  const c = className ? `class="${{className}}"` : '';
  const icons = {{
    'shield': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    'search': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    'network': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
    'calendar': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    'lock': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    'file-text': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    'layers': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    'filter': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    'terminal': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    'check': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polyline points="20 6 9 17 4 12"/></svg>`,
    'x': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`,
    'play': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    'eye': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    'eye-off': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    'moon': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    'history': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
    'sparkles': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
    'database': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    'credit-card': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    'plus': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    'chevron-down': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polyline points="6 9 12 15 18 9"/></svg>`,
    'sliders': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>`,
    'cpu': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="1" y2="4"/><line x1="15" x2="15" y1="1" y2="4"/><line x1="9" x2="9" y1="20" y2="23"/><line x1="15" x2="15" y1="20" y2="23"/><line x1="20" x2="23" y1="9" y2="9"/><line x1="20" x2="23" y1="14" y2="14"/><line x1="1" x2="4" y1="9" y2="9"/><line x1="1" x2="4" y1="14" y2="14"/></svg>`
  }};
  return icons[name] || icons['shield'];
}}

// Helper for i18n lookup
function t(key) {{
  const dict = I18N_TRANSLATIONS[appState.lang] || I18N_TRANSLATIONS['fr'];
  return dict[key] || key;
}}

// Language Switcher with RTL / LTR direction handler
function setLanguage(lang) {{
  if (!['fr', 'ar', 'en'].includes(lang)) return;
  appState.lang = lang;

  const html = document.getElementById('app-root');
  if (html) {{
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }}

  applyI18n();
  renderInspector();
  renderSuggestedTools();
  showToast(lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : (lang === 'en' ? 'Language set to English' : 'Langue changée en Français'));
}}

// Apply i18n data bindings across the document
function applyI18n() {{
  document.querySelectorAll('[data-i18n]').forEach(el => {{
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) {{
      el.textContent = val;
    }}
  }});

  document.querySelectorAll('[data-i18n-title]').forEach(el => {{
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (val) el.setAttribute('title', val);
  }});

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {{
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.setAttribute('placeholder', val);
  }});
}}

// Global Mode Switcher (Collect | Analyze | Report)
function setAppMode(mode) {{
  appState.mode = mode;
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {{
    const isActive = btn.getAttribute('data-mode') === mode;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  }});

  if (mode === 'collect') {{
    setScreen(3); // Review Queue / Inbox
    showToast(t('mode_collect') + ' : ' + t('inbox_title'));
  }} else if (mode === 'analyze') {{
    setScreen(2); // Graph Canvas with suggested tools
    showToast(t('mode_analyze') + ' : ' + t('canvas_graph_title'));
  }} else if (mode === 'report') {{
    setScreen(5); // Certified Report
    showToast(t('mode_report') + ' : ' + t('screen_5_title'));
  }}
}}

// Canvas View Switcher (Graph | Timeline | Map)
function setCanvasView(view) {{
  appState.canvasView = view;
  document.querySelectorAll('.view-tab-btn').forEach(btn => {{
    const isActive = btn.getAttribute('data-view') === view;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  }});

  if (view === 'graph') setScreen(2);
  else if (view === 'timeline' || view === 'map') setScreen(4);
}}

// Screen Switcher (1 to 5)
function setScreen(num) {{
  appState.activeScreen = num;
  const viewMap = {{
    1: 'view-overview',
    2: 'view-graph-canvas',
    3: 'view-inbox-review',
    4: 'view-timeline-map',
    5: 'view-report-export'
  }};
  for (let i = 1; i <= 5; i++) {{
    const el = document.getElementById(viewMap[i]) || document.getElementById(`screen-${{i}}`);
    if (el) {{
      if (i === num) {{
        el.classList.remove('is-hidden');
        el.classList.add('active-screen');
      }} else {{
        el.classList.add('is-hidden');
        el.classList.remove('active-screen');
      }}
    }}
  }}

  // Update Canvas view tabs
  const viewTabs = document.querySelectorAll('.view-tab-btn');
  viewTabs.forEach(b => b.classList.remove('active'));
  if (num === 2) {{
    const b = document.querySelector('.view-tab-btn[data-view="graph"]');
    if (b) b.classList.add('active');
  }} else if (num === 4) {{
    const b = document.querySelector('.view-tab-btn[data-view="timeline"]');
    if (b) b.classList.add('active');
  }}

  renderInspector();
  renderSuggestedTools();
}}

// Stealth Mode Toggle
function toggleStealth() {{
  appState.stealth = !appState.stealth;
  const alertBadge = document.getElementById('stealth-warning-badge');
  if (alertBadge) {{
    alertBadge.style.display = appState.stealth ? 'none' : 'inline-flex';
  }}
  showToast(appState.stealth ? t('stealth_badge_on') : t('stealth_badge_off'));
}}

// Theme Toggle (Dark / Light)
function toggleTheme() {{
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  const html = document.getElementById('app-root');
  if (html) html.setAttribute('data-theme', appState.theme);
  showToast(appState.theme === 'dark' ? 'Thème Sombre Activé' : "Thème Clair Activé (Mode Salle d'Audience)");
}}

// Menubar Dropdown Logic
function toggleMenu(menuId) {{
  const dropdown = document.getElementById(menuId);
  if (!dropdown) return;

  const isOpen = dropdown.classList.contains('is-open');
  closeAllMenus();

  if (!isOpen) {{
    dropdown.classList.add('is-open');
    appState.openMenuId = menuId;
    const btn = document.getElementById(`btn-${{menuId}}`);
    if (btn) {{
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }}
  }}
}}

function closeAllMenus() {{
  document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('is-open'));
  document.querySelectorAll('.menubar-btn').forEach(b => {{
    b.classList.remove('active');
    b.setAttribute('aria-expanded', 'false');
  }});
  appState.openMenuId = null;
}}

// Generic Menu Actions Trigger
function triggerMenuAction(action) {{
  closeAllMenus();
  if (action === 'new_case' || action === 'case_props') {{
    openPropertiesModal();
  }} else if (action === 'insert_clue') {{
    openInsertModal();
  }} else if (action === 'llm_settings') {{
    openLLMSettingsModal();
  }} else if (action === 'import') {{
    openImportModal();
  }} else if (action === 'save_case') {{
    showToast(t('m_save') + ' : ' + t('case_id'));
  }} else if (action === 'save_as') {{
    showToast(t('m_save_as') + ' #2026-SCAM-089-COPIE');
  }} else if (action === 'export_report') {{
    setScreen(5);
    showToast(t('m_export_report'));
  }} else if (action === 'view_graph') {{
    setCanvasView('graph');
  }} else if (action === 'view_timeline') {{
    setCanvasView('timeline');
  }} else if (action === 'view_map') {{
    setCanvasView('map');
  }} else if (action === 'toggle_layers') {{
    toggleLeftPanel();
  }} else if (action === 'fullscreen') {{
    if (!document.fullscreenElement) {{
      document.documentElement.requestFullscreen().catch(() => {{}});
      showToast(t('m_view_toggle_fullscreen'));
    }} else {{
      document.exitFullscreen();
    }}
  }} else {{
    runSimulatedTool(action);
  }}
}}

// Modals Controller
function openPropertiesModal() {{
  appState.propertiesModalOpen = true;
  const modal = document.getElementById('properties-modal');
  if (modal) modal.style.display = 'flex';
}}

function closePropertiesModal() {{
  appState.propertiesModalOpen = false;
  const modal = document.getElementById('properties-modal');
  if (modal) modal.style.display = 'none';
}}

function openInsertModal() {{
  appState.insertModalOpen = true;
  const modal = document.getElementById('insert-modal');
  if (modal) modal.style.display = 'flex';
}}

function closeInsertModal() {{
  appState.insertModalOpen = false;
  const modal = document.getElementById('insert-modal');
  if (modal) modal.style.display = 'none';
}}

function openLLMSettingsModal() {{
  appState.llmModalOpen = true;
  const modal = document.getElementById('llm-settings-modal');
  if (modal) modal.style.display = 'flex';
}}

function closeLLMSettingsModal() {{
  appState.llmModalOpen = false;
  const modal = document.getElementById('llm-settings-modal');
  if (modal) modal.style.display = 'none';
}}

function openImportModal() {{
  appState.importModalOpen = true;
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'flex';
}}

function closeImportModal() {{
  appState.importModalOpen = false;
  const modal = document.getElementById('import-modal');
  if (modal) modal.style.display = 'none';
}}

// Tool Information Modal
function showToolInfo(toolId) {{
  closeAllMenus();
  const tool = TOOL_SPECS[toolId] || TOOLS_CATALOG.find(t => t.id === toolId || t.name === toolId) || {{
    name: toolId,
    cat: t('menu_osint'),
    badge: 'P1 • Déterministe',
    mode: 'Review-Run (Validation Requise)',
    desc: 'Outil d\\'investigation judiciaire et forensique spécialisé.',
    inputs: 'Indice sélectionné (Texte, URL ou Fichier)',
    outputs: 'Nouveaux nœuds et arêtes créés dans le graphe d\\'enquête',
    storage: 'Neo4j 5.x & MinIO S3 (Chaîne de garde WORM)',
    resources: 'Processus local sécurisé • Zéro fuite réseau',
    compliance: 'ISO 27037 / RFC 3161'
  }};

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
}}

function closeToolInfoModal() {{
  appState.toolInfoModalOpen = false;
  appState.activeModalToolId = null;
  const modal = document.getElementById('tool-info-modal');
  if (modal) modal.style.display = 'none';
}}

function runToolFromModal() {{
  const toolId = appState.activeModalToolId;
  closeToolInfoModal();
  if (toolId) {{
    const tool = TOOL_SPECS[toolId];
    const name = tool ? tool.name : toolId;
    runSimulatedTool(name);
  }}
}}

function addToolToPlaybook() {{
  closeToolInfoModal();
  showToast(t('tool_info_playbook_btn') + ' : ' + (appState.activeModalToolId || 'Outil'));
}}

// Left Panel Collapse Toggle
function toggleLeftPanel() {{
  appState.leftPanelCollapsed = !appState.leftPanelCollapsed;
  const panel = document.getElementById('panel-left');
  if (panel) panel.classList.toggle('collapsed', appState.leftPanelCollapsed);
}}

// Node Selection Handler
function selectNode(nodeId) {{
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.graph-node').forEach(n => {{
    n.classList.toggle('selected', n.id === nodeId);
  }});
  renderInspector();
  renderSuggestedTools();
}}

// Inspector Rendering Logic
function renderInspector() {{
  const container = document.getElementById('inspector-content-container');
  if (!container) return;

  if (appState.selectedNodeId === 'node-suspect') {{
    container.innerHTML = `
      <div class="candidate-subject-card">
        <div class="candidate-subject-badge">
          <span class="chip chip-purple">${{getLucideSvg('sparkles', 13)}} ${{t('candidate_subject_title')}}</span>
          <span class="chip chip-neutral font-mono text-xs">${{t('candidate_status_hypothesis')}}</span>
        </div>
        <div class="judicial-warning-box">
          ${{getLucideSvg('shield', 14)}}
          <span class="judicial-warning-text">${{t('judicial_safety_notice')}}</span>
        </div>
        <div class="metric-score-breakdown">
          <div class="metric-row">
            <span class="metric-name">${{t('candidate_biometrics_label')}}</span>
            <span class="metric-value font-mono">89%</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">${{t('candidate_voice_label')}}</span>
            <span class="metric-value font-mono">94%</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">${{t('candidate_centrality_label')}}</span>
            <span class="metric-value font-mono">0.89</span>
          </div>
        </div>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${{t('prop_identifier')}}</span><span class="meta-val font-mono">Amine B. (31 ans, Oran)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_layer')}}</span><span class="meta-val chip chip-purple">Calque 4 (Hypothèse)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_hash')}}</span><span class="meta-val font-mono">3b4f...a891</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_source')}}</span><span class="meta-val">Entity Resolution Engine</span></div>
        </div>
        <div class="candidate-actions">
          <button class="btn btn-secondary" onclick="openAuditModal('promote')">${{getLucideSvg('check', 14)}} ${{t('btn_promote_verified')}}</button>
          <button class="btn btn-ghost text-danger" onclick="openAuditModal('discard')">${{getLucideSvg('x', 14)}} ${{t('btn_discard_hypothesis')}}</button>
        </div>
      </div>
    `;
  }} else if (appState.selectedNodeId === 'node-phone') {{
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="chip chip-cyan">${{getLucideSvg('phone', 14)}} Téléphone E.164</span>
          <span class="font-mono text-muted">Node #03</span>
        </div>
        <h4 class="inspector-entity-title font-mono">+213 555 019 283</h4>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${{t('prop_entity_type')}}</span><span class="meta-val">Ligne Mobile (Ooredoo Algérie)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_layer')}}</span><span class="meta-val chip chip-cyan">Calque 2 (OSINT Brut)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_hash')}}</span><span class="meta-val font-mono">7f1a...c209</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_timestamp')}}</span><span class="meta-val">10 Nov 2026 • 10:18 UTC</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_confidence')}}</span><span class="meta-val chip chip-success">98% (Vérifié)</span></div>
        </div>
      </div>
    `;
  }} else {{
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="chip chip-emerald">${{getLucideSvg('lock', 14)}} Annonce Marché</span>
          <span class="font-mono text-muted">Node #01</span>
        </div>
        <h4 class="inspector-entity-title">Annonce FB Marketplace #98124</h4>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${{t('prop_layer')}}</span><span class="meta-val chip chip-emerald">Calque 1 (Preuve Scellée)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_hash')}}</span><span class="meta-val font-mono">e3b0...b855 (RFC 3161)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_timestamp')}}</span><span class="meta-val">10 Nov 2026 • 10:15 UTC</span></div>
        </div>
      </div>
    `;
  }}
}}

// Render Suggested Tools based on selected node
function renderSuggestedTools() {{
  const container = document.getElementById('suggested-tools-container');
  if (!container) return;

  let compatibleTools = [];
  if (appState.selectedNodeId === 'node-phone') {{
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('PhoneNumber')).slice(0, 4);
  }} else if (appState.selectedNodeId === 'node-suspect') {{
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('CandidateSubject')).slice(0, 4);
  }} else {{
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('SocialPost') || t.inputs.includes('URL')).slice(0, 4);
  }}

  container.innerHTML = compatibleTools.map(tool => `
    <div class="suggested-tool-item">
      <div class="tool-item-info">
        <div class="tool-title-row">
          <span class="tool-name">${{tool.name}}</span>
          <span class="chip chip-neutral">${{tool.req === 'offline' ? 'Docker Local' : (tool.req === 'free_key' ? 'Clé API' : 'Session Infiltrée')}}</span>
        </div>
        <p class="tool-desc">${{tool.desc}}</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="runSimulatedTool('${{tool.name}}')">
        ${{getLucideSvg('play', 12)}} ${{t('btn_run_brick')}}
      </button>
    </div>
  `).join('');
}}

// Run simulated tool and dispatch to arbitration inbox
function runSimulatedTool(toolName) {{
  showToast(`${{t('toast_tool_success')}} (${{toolName}})`);
  const badge = document.getElementById('inbox-pending-counter');
  if (badge) badge.textContent = '4';
}}

// Toast helper
function showToast(msg) {{
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3200);
}}

// Audit modal (Promote / Discard)
function openAuditModal(action) {{
  appState.auditModalOpen = true;
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'flex';
}}

function closeAuditModal() {{
  appState.auditModalOpen = false;
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'none';
}}

function confirmAuditAction() {{
  closeAuditModal();
  showToast(t('toast_clue_added'));
  setScreen(5);
}}

// Command Palette
function openCommandPalette() {{
  appState.commandPaletteOpen = true;
  const modal = document.getElementById('command-palette-modal');
  if (modal) {{
    modal.style.display = 'flex';
    const input = document.getElementById('cmd-input');
    if (input) {{
      input.value = '';
      input.focus();
      filterCommandPalette('');
    }}
  }}
}}

function closeCommandPalette() {{
  appState.commandPaletteOpen = false;
  const modal = document.getElementById('command-palette-modal');
  if (modal) modal.style.display = 'none';
}}

function filterCommandPalette(query) {{
  const container = document.getElementById('cmd-results-list');
  if (!container) return;
  const q = query.toLowerCase().trim();
  const filtered = TOOLS_CATALOG.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.cat.includes(q));

  container.innerHTML = filtered.slice(0, 8).map(tool => `
    <div class="cmd-result-item" onclick="selectCommandTool('${{tool.name}}')">
      <div class="cmd-icon-box">${{getLucideSvg('terminal', 16)}}</div>
      <div class="cmd-text-box">
        <div class="cmd-name">${{tool.name}}</div>
        <div class="cmd-desc">${{tool.desc}}</div>
      </div>
      <span class="chip chip-neutral font-mono text-xs">${{tool.req}}</span>
    </div>
  `).join('');
}}

function selectCommandTool(toolName) {{
  closeCommandPalette();
  runSimulatedTool(toolName);
}}

// Close menus and modals when clicking outside
document.addEventListener('click', (e) => {{
  if (!e.target.closest('.menubar-item')) {{
    closeAllMenus();
  }}
  if (e.target.classList && (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop'))) {{
    closePropertiesModal();
    closeInsertModal();
    closeLLMSettingsModal();
    closeImportModal();
    closeToolInfoModal();
    closeAuditModal();
    closeCommandPalette();
  }}
}});

// Keyboard Shortcuts Listener
document.addEventListener('keydown', (e) => {{
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {{
    e.preventDefault();
    openCommandPalette();
  }} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {{
    e.preventDefault();
    openPropertiesModal();
  }} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {{
    e.preventDefault();
    showToast(t('m_save') + ' : ' + t('case_id'));
  }} else if (e.key === 'Escape') {{
    closeAllMenus();
    closeCommandPalette();
    closeAuditModal();
    closePropertiesModal();
    closeInsertModal();
    closeLLMSettingsModal();
    closeImportModal();
    closeToolInfoModal();
  }}
}});

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {{
  applyI18n();
  setScreen(2);
}});
"""

with open('doc/assets/maquette-i18n.js', 'w', encoding='utf-8') as f:
    f.write(js_body)

print("Updated maquette-i18n.js written successfully, length:", len(js_body))
