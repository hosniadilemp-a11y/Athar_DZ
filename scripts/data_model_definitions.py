# scripts/data_model_definitions.py
"""
Master Ontological Registry for Athar DZ / AegisInvestigate
Defines all 37 Node Types, their 8 Domains, Polyglot Database Mappings,
and 44+ Directional Relationships.
"""

DOMAINS = {
    "all": {"name": "Tous les Domaines (37 Types de Nœuds)", "color": "#38bdf8", "icon": "🌐"},
    "territory": {"name": "1. Judiciaire & Territoire DZ", "color": "#10b981", "icon": "🏛️"},
    "actors": {"name": "2. Personnes & Entités Morales", "color": "#f43f5e", "icon": "👥"},
    "telecom": {"name": "3. Télécoms & Forensique Mobile", "color": "#f97316", "icon": "📱"},
    "finance": {"name": "4. Finances Criminelles & BaridiMob", "color": "#eab308", "icon": "💳"},
    "socmint": {"name": "5. SOCMINT, Web & Trackers", "color": "#06b6d4", "icon": "🌐"},
    "cyber": {"name": "6. Cyber, Malwares & Forensique", "color": "#22c55e", "icon": "🛡️"},
    "biometrics": {"name": "7. Biométrie Multimodale & Médias", "color": "#a855f7", "icon": "🎙️"},
    "legal": {"name": "8. Chaîne de Preuve & Scellés WORM", "color": "#e11d48", "icon": "⚖️"}
}

DATABASES = {
    "all": {"name": "Tous les Moteurs (6 DBs)", "badge": "Polyglot Tier", "color": "#38bdf8"},
    "neo4j": {"name": "Neo4j 5.20+ Enterprise (Graphe & Relations)", "badge": "Index-Free Adjacency", "color": "#38bdf8"},
    "postgres": {"name": "PostgreSQL 16 + TimescaleDB (ACID & CDRs)", "badge": "Relationnel & Hypertables", "color": "#0ea5e9"},
    "qdrant": {"name": "Qdrant 1.9 Rust (Vecteurs Biométriques)", "badge": "HNSW Vector Cosine", "color": "#a855f7"},
    "minio": {"name": "MinIO Enterprise S3 (Scellés WORM)", "badge": "Object Lock COMPLIANCE", "color": "#f43f5e"},
    "mongodb": {"name": "MongoDB 7.0 WiredTiger (Documents BSON)", "badge": "Schema-Free Snappy", "color": "#10b981"},
    "redis": {"name": "Redis 7.2 Stack (In-Memory Pub/Sub & Cache)", "badge": "RESP3 Latency <0.5ms", "color": "#f59e0b"}
}

NODES = {
    # 1. Judiciaire & Territoire
    "wilaya": {
        "id": "wilaya",
        "domain": "territory",
        "icon": "🏛️",
        "name": "Wilaya (Collectivité Territoriale)",
        "label": "Wilaya",
        "color": "#10b981",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Circonscription administrative et juridictionnelle algérienne (01 à 58), définissant le ressort de compétence territoriale de la brigade et de la cour de justice.",
        "exampleValue": "Wilaya 16 - Alger (Code INSEE DZ: 16000)",
        "storageJustification": "Stocké en table relationnelle PostgreSQL pour le contrôle d'accès multi-wilayas RLS (Row-Level Security) et projeté dans Neo4j comme ancre territoriale macroscopique.",
        "schemaProps": [
            {"name": "code_wilaya", "type": "String (PK, 2 digits '01'..'58')", "required": True, "desc": "Code officiel de la wilaya algérienne"},
            {"name": "nom_ar", "type": "String", "required": True, "desc": "Nom officiel en arabe (الجزائر)"},
            {"name": "nom_fr", "type": "String", "required": True, "desc": "Nom officiel en français (Alger)"},
            {"name": "chef_lieu", "type": "String", "required": True, "desc": "Chef-lieu de wilaya"}
        ],
        "connectedClues": ["Contient des Daïras ([:CONTIENT_DAIRA])", "Territoire d'action criminelle suspect ([:ACTIVE_DANS_WILAYA])"],
        "availableTools": ["Filtrage territorial multi-wilayas", "Cartographie SIG MapLibre", "Calcul de compétence territoriale CPP"]
    },
    "daira": {
        "id": "daira",
        "domain": "territory",
        "icon": "🏘️",
        "name": "Daïra (Sous-Préfecture)",
        "label": "Daira",
        "color": "#10b981",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Subdivision administrative intermédiaire rattachée à une wilaya, regroupant plusieurs communes sous la juridiction d'un tribunal d'arrondissement.",
        "exampleValue": "Daïra de Dar El Beïda (Wilaya 16)",
        "storageJustification": "Table relationnelle avec clé étrangère vers Wilaya, nœud graphe pour les analyses hiérarchiques APOC.",
        "schemaProps": [
            {"name": "id_daira", "type": "String (PK)", "required": True, "desc": "Identifiant unique de la daïra"},
            {"name": "nom_fr", "type": "String", "required": True, "desc": "Nom en français"},
            {"name": "code_wilaya", "type": "String (FK)", "required": True, "desc": "Code de la wilaya parente"}
        ],
        "connectedClues": ["Appartient à une Wilaya ([:APPARTIENT_A])", "Contient des Communes ([:CONTIENT_COMMUNE])"],
        "availableTools": ["Filtrage en cascade /dairas/", "Agrégation de criminalité locale"]
    },
    "commune": {
        "id": "commune",
        "domain": "territory",
        "icon": "📍",
        "name": "Commune (Municipalité)",
        "label": "Commune",
        "color": "#10b981",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Échelon municipal de base en Algérie (1 541 communes). Localisation précise des retraits GAB, des antennes relais et des domiciles des mis en cause.",
        "exampleValue": "Commune de Bab Ezzouar (Code postal: 16311)",
        "storageJustification": "PostgreSQL pour les index géographiques PostGIS et les requêtes spatiales de bornage ; nœud Neo4j pour le calcul de l'attribut dérivé _comune_Activite.",
        "schemaProps": [
            {"name": "id_commune", "type": "String (PK)", "required": True, "desc": "Identifiant officiel commune"},
            {"name": "nom_fr", "type": "String", "required": True, "desc": "Nom de la commune"},
            {"name": "code_postal", "type": "String", "required": True, "desc": "Code postal algérien"},
            {"name": "geopoint", "type": "Point (WGS84)", "required": False, "desc": "Coordonnées GPS de la mairie"}
        ],
        "connectedClues": ["Appartient à une Daïra ([:APPARTIENT_A])", "Abrite des Unités de police ([:SITUEE_DANS])", "Lieu de retraits GAB ([:SITUE_A])"],
        "availableTools": ["Rayon d'action criminel (_comune_Activite)", "Interpolation spatiale de bornage"]
    },
    "unite": {
        "id": "unite",
        "domain": "territory",
        "icon": "🏢",
        "name": "Unité de Police Judiciaire / Brigade",
        "label": "Unite",
        "color": "#10b981",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Service d'enquête opérationnel traitant le dossier : Brigade de Recherche de la Gendarmerie Nationale, Sûreté Urbaine DGSN, ou Service Central Cyber.",
        "exampleValue": "Brigade de Recherches Bab Ezzouar (GN)",
        "storageJustification": "Table ACID pour les habilitations des officiers, l'attribution des scellés et le contrôle strict des accès aux dossiers judiciaires.",
        "schemaProps": [
            {"name": "id_unite", "type": "String (PK)", "required": True, "desc": "Code unité judiciaire"},
            {"name": "nom_unite", "type": "String", "required": True, "desc": "Dénomination officielle"},
            {"name": "corps", "type": "Enum [GN, DGSN, POL_SPEC]", "required": True, "desc": "Corps d'appartenance"},
            {"name": "id_commune", "type": "String (FK)", "required": True, "desc": "Commune d'implantation"}
        ],
        "connectedClues": ["Traite une Affaire ([:TRAITE_AFFAIRE])", "Implantée dans une Commune ([:SITUEE_DANS])", "Comprend des Officiers ([:COMPORTE_OFFICIER])"],
        "availableTools": ["Matrice des rôles RBAC", "Journal d'audit non-répudiable"]
    },
    "affaire": {
        "id": "affaire",
        "domain": "territory",
        "icon": "📁",
        "name": "Affaire Pénale (Dossier d'Instruction)",
        "label": "Affaire",
        "color": "#38bdf8",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16 + Neo4j",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Dossier criminel unifié instruit sous l'autorité du parquet ou du juge d'instruction, regroupant l'intégralité des indices, cibles, scellés et PVs.",
        "exampleValue": "Affaire N° ATHAR-2026-SCAM-089 (Candy Wheels)",
        "storageJustification": "PostgreSQL 16 garantit l'intégrité transactionnelle ACID, le verrouillage de statut légal et le scellement ; Neo4j contient le nœud racine de projection de sous-graphe.",
        "schemaProps": [
            {"name": "id_affaire", "type": "String (PK)", "required": True, "desc": "Numéro d'enregistrement parquet"},
            {"name": "titre", "type": "String", "required": True, "desc": "Intitulé des infractions poursuivies"},
            {"name": "statut_legal", "type": "Enum [ENQUETE_PRELIM, INSTRUCTION, JUGE]", "required": True, "desc": "Phase procédurale CPP"},
            {"name": "prejudice_total_dzd", "type": "Float", "required": False, "desc": "Montant total extorqué en Dinars"}
        ],
        "connectedClues": ["Implique des Personnes ([:IMPLIQUE])", "Comprend des Scellés WORM ([:COMPREND_SCELLE])", "Englobe des Procès-Verbaux ([:CONTIENT_ACTE])"],
        "availableTools": ["Isolation de sous-graphe APOC", "Génération de PV de Synthèse PDF/A-3b", "Recoupement inter-affaires"]
    },
    "magistrat": {
        "id": "magistrat",
        "domain": "territory",
        "icon": "⚖️",
        "name": "Magistrat Instructeur / Procureur",
        "label": "Magistrat",
        "color": "#38bdf8",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL",
        "dbBadge": "PostgreSQL 16 (IAM)",
        "plainMeaning": "Autorité judiciaire ordonnant les réquisitions, délivrant les commissions rogatoires et supervisant la légalité des actes de procédure.",
        "exampleValue": "Mme la Juge d'Instruction (Pôle Pénal Spécialisé Alger)",
        "storageJustification": "PostgreSQL (Casdoor IAM) gère les certificats X.509 de signature électronique qualifiée des ordonnances et réquisitions.",
        "schemaProps": [
            {"name": "id_magistrat", "type": "String (PK)", "required": True, "desc": "Matricule magistrature"},
            {"name": "nom_complet", "type": "String", "required": True, "desc": "Identité du magistrat"},
            {"name": "tribunal", "type": "String", "required": True, "desc": "Juridiction de rattachement"}
        ],
        "connectedClues": ["Supervise l'Affaire ([:SUPERVISE])", "Signe les Réquisitions ([:SIGNE_REQUISITION])"],
        "availableTools": ["Tableau de bord exécutif magistrat", "Validation électronique de réquisitions"]
    },

    # 2. Acteurs & Entités Morales
    "personne": {
        "id": "personne",
        "domain": "actors",
        "icon": "🎯",
        "name": "Personne Physique / Suspect / Complice / Mule",
        "label": "Personne",
        "color": "#f43f5e",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+ Enterprise",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j 5.20+ / PostgreSQL",
        "plainMeaning": "Individu ciblé ou identifié au cours de l'enquête (auteur principal, complice, mule financière, victime ou témoin).",
        "exampleValue": "Walid BOUAZIZ (Alias 'Walid Pneus', Leader présumé)",
        "storageJustification": "Nœud central de Neo4j avec adjacence sans index pour la traversée relationnelle en temps réel ; PostgreSQL conserve la fiche civile confidentielle.",
        "schemaProps": [
            {"name": "id_personne", "type": "String (PK UUID)", "required": True, "desc": "Identifiant unique interne"},
            {"name": "nom_complet", "type": "String", "required": True, "desc": "Nom et prénom officiels"},
            {"name": "nin", "type": "String (18 digits)", "required": False, "desc": "Numéro d'Identification National algérien"},
            {"name": "_class", "type": "Enum ['neutre', 'operationeel', 'soutien', 'leader']", "required": True, "desc": "Rôle pénal calculé par IA/GDS"},
            {"name": "_betweennessCentrality", "type": "Float [0.0..1.0]", "required": True, "desc": "Score de centralité d'intermédiarité GDS"},
            {"name": "_Lvl_of_Implications", "type": "List[Int] [1, 2, 3]", "required": True, "desc": "Degré d'implication multi-sauts"}
        ],
        "connectedClues": ["Utilise un Téléphone ([:UTILISE_TELEPHONE])", "Détient un Compte Bancaire ([:DETIENT_COMPTE])", "Possède un Profil Social ([:POSSEDE_PROFIL])", "Communique avec ([:COMMUNIQUE_AVEC])"],
        "availableTools": ["GDS Brandes Betweenness", "Expansion réseau 2-hops", "Classification pénale automatique", "Profilage territorial"]
    },
    "entreprise": {
        "id": "entreprise",
        "domain": "actors",
        "icon": "🏢",
        "name": "Entreprise / Société Écran / Commerce",
        "label": "Entreprise",
        "color": "#f43f5e",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Entité juridique commerciale utilisée comme paravent pour le blanchiment d'argent, la facturation fictive ou l'enregistrement de sites frauduleux.",
        "exampleValue": "SARL PNEUS EXPRESS ALGERIE (RC: 16/00-98124B)",
        "storageJustification": "Graphe Neo4j pour lier les gérants de paille et les actionnaires réels ; PostgreSQL pour lier aux registres du CNRC.",
        "schemaProps": [
            {"name": "numero_rc", "type": "String (PK)", "required": True, "desc": "Numéro de Registre de Commerce"},
            {"name": "nif", "type": "String", "required": False, "desc": "Numéro d'Identification Fiscale"},
            {"name": "raison_sociale", "type": "String", "required": True, "desc": "Nom de l'entreprise"}
        ],
        "connectedClues": ["Gérée par une Personne ([:GEREE_PAR])", "Titulaire d'un Compte Bancaire ([:TITULAIRE_COMPTE])"],
        "availableTools": ["Détection de prête-noms", "Vérification CNRC automatique"]
    },
    "vehicule": {
        "id": "vehicule",
        "domain": "actors",
        "icon": "🚗",
        "name": "Véhicule / Immatriculation DZ",
        "label": "Vehicule",
        "color": "#8b5cf6",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Véhicule automobile repéré lors de livraisons frauduleuses, de retraits GAB ou identifié par lecture automatisée de plaques (LAPI/ALPR).",
        "exampleValue": "Renault Clio 4 (Immatriculation: 04829-116-16)",
        "storageJustification": "Neo4j relie le véhicule aux personnes et aux lieux de bornage ; PostgreSQL stocke la fiche technique d'immatriculation.",
        "schemaProps": [
            {"name": "immatriculation_dz", "type": "String (PK)", "required": True, "desc": "Matricule format officiel algérien"},
            {"name": "vin_chassis", "type": "String", "required": False, "desc": "Numéro de châssis international"},
            {"name": "marque_modele", "type": "String", "required": True, "desc": "Marque et modèle du véhicule"}
        ],
        "connectedClues": ["Conduit par un Suspect ([:CONDUIT_PAR])", "Photographié sur un Reçu/Scène ([:VISIBLE_SUR_IMAGE])"],
        "availableTools": ["Reconnaissance de plaque ALPR DZ", "Croisement fichiers cartes grises"]
    },

    # 3. Télécoms & Forensique Mobile
    "telephone": {
        "id": "telephone",
        "domain": "telecom",
        "icon": "📱",
        "name": "Numéro de Téléphone (E.164 MSISDN)",
        "label": "Telephone",
        "color": "#f97316",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+ Enterprise",
        "dbTag": "Neo4j + Redis",
        "dbBadge": "Neo4j / Redis 7.2",
        "plainMeaning": "Ligne téléphonique mobile ou fixe utilisée pour les appels d'extorsion, les comptes WhatsApp criminels et la réception d'OTP bancaires.",
        "exampleValue": "+213 555 019 283 (Opérateur: Ooredoo Algérie)",
        "storageJustification": "Index mémoire Neo4j pour la résolution instantanée de liens de co-contact ; Redis stocke les caches de requêtes d'annuaires inversés (Truecaller).",
        "schemaProps": [
            {"name": "numero_e164", "type": "String (PK canonical '+213...')", "required": True, "desc": "Format international strict E.164"},
            {"name": "operateur", "type": "Enum [Mobilis, Djezzy, Ooredoo, Autre]", "required": True, "desc": "Opérateur télécom"},
            {"name": "type_ligne", "type": "Enum [Prepayee, Postpayee]", "required": False, "desc": "Mode de souscription"}
        ],
        "connectedClues": ["Inséré dans une Carte SIM ([:INSEREE_DANS])", "Enregistré sur WhatsApp/Telegram ([:ENREGISTRE_SUR])", "Borne sur une Antenne ([:BORNE_A])", "Associé à BaridiMob ([:NOTIFIE_BARIDIMOB])"],
        "availableTools": ["PhoneInfoga / Truecaller Reverse", "WhatsApp Business Catalog Inspector", "Reconstitution CDRs"]
    },
    "carte_sim": {
        "id": "carte_sim",
        "domain": "telecom",
        "icon": "📶",
        "name": "Carte SIM & Modem GSM 4G DZ",
        "label": "Carte_SIM",
        "color": "#f97316",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Puce physique SIM ou eSIM insérée dans la banque de modems USB ou dans le téléphone du suspect (identifiée par ICCID et IMSI).",
        "exampleValue": "SIM Mobilis (IMSI: 603019812401842 • ICCID: 89213...)",
        "storageJustification": "PostgreSQL gère l'inventaire matériel de la Phone Farm et les quotas de modems ; Neo4j relie la puce aux téléphones et suspects.",
        "schemaProps": [
            {"name": "iccid", "type": "String (PK 19-20 digits)", "required": True, "desc": "Numéro de série de la carte SIM"},
            {"name": "imsi", "type": "String (15 digits)", "required": True, "desc": "Identité internationale de l'abonné mobile"},
            {"name": "port_tty", "type": "String", "required": False, "desc": "Port physique /dev/ttyUSB dans la baie"}
        ],
        "connectedClues": ["Fournit la ligne Téléphone ([:ACTIVE_LIGNE])", "Installée dans un Smartphone ([:LOGEE_DANS])"],
        "availableTools": ["Daemon AT pyserial (Interception OTP <1.5s)", "Rotation dynamique APN 4G"]
    },
    "appareil_mobile": {
        "id": "appareil_mobile",
        "domain": "telecom",
        "icon": "📲",
        "name": "Smartphone / Terminal ReDroid (IMEI)",
        "label": "Appareil_Mobile",
        "color": "#f97316",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Terminal physique ou conteneur ReDroid virtuel identifié par son code IMEI unique, utilisé par le cybercriminel.",
        "exampleValue": "Samsung Galaxy S23 (IMEI: 358912401928471)",
        "storageJustification": "Neo4j relie les changements de cartes SIM sur un même terminal pour démasquer les suspects multi-puces ; PostgreSQL enregistre les scellés matériels.",
        "schemaProps": [
            {"name": "imei", "type": "String (PK 15 digits)", "required": True, "desc": "International Mobile Equipment Identity"},
            {"name": "modele", "type": "String", "required": True, "desc": "Modèle commercial (ex: SM-S911B)"},
            {"name": "fingerprint", "type": "String", "required": False, "desc": "Empreinte logicielle Android"}
        ],
        "connectedClues": ["Contient une Carte SIM ([:LOGE_SIM])", "Utilisé par un Suspect ([:MANIPULE_PAR])"],
        "availableTools": ["Scrcpy WebRTC 60 FPS", "Conteneur ReDroid AOSP 13", "Analyse forensique ALEAPP"]
    },
    "antenne_bts": {
        "id": "antenne_bts",
        "domain": "telecom",
        "icon": "📡",
        "name": "Antenne Relais BTS (Cell Tower)",
        "label": "Antenne_BTS",
        "color": "#f97316",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16 + PostGIS",
        "dbTag": "PostgreSQL + PostGIS",
        "dbBadge": "PostgreSQL 16 (PostGIS)",
        "plainMeaning": "Pylône de télécommunication cellulaire des opérateurs Mobilis, Djezzy ou Ooredoo captant les communications des suspects.",
        "exampleValue": "BTS Ooredoo Bab Ezzouar Ouest (CellID: 41029 • LAC: 1042)",
        "storageJustification": "Indexation spatiale R-Tree PostGIS pour le calcul instantané des zones de couverture (secteurs polygonaux à 120°) et requêtes géographiques.",
        "schemaProps": [
            {"name": "cell_id", "type": "String (PK)", "required": True, "desc": "Identifiant de cellule opérateur"},
            {"name": "lac", "type": "Int", "required": True, "desc": "Location Area Code"},
            {"name": "coordonnees", "type": "Point (WGS84)", "required": True, "desc": "Latitude et Longitude du pylône"},
            {"name": "azimut", "type": "Int [0..360]", "required": True, "desc": "Orientation angulaire du faisceau"}
        ],
        "connectedClues": ["Localisée dans une Commune ([:IMPLANTEE_DANS])", "Enregistre un CDR ([:RECOIT_COMMUNICATION])"],
        "availableTools": ["Calculateur de zone de couverture azimutale", "Recoupement d'alibis spatio-temporels"]
    },
    "telecom_cdr": {
        "id": "telecom_cdr",
        "domain": "telecom",
        "icon": "📊",
        "name": "Listing d'Appel Télécom (CDR Record)",
        "label": "Telecom_CDR",
        "color": "#f97316",
        "primaryDb": "postgres",
        "primaryDbName": "TimescaleDB / PostgreSQL",
        "dbTag": "TimescaleDB",
        "dbBadge": "TimescaleDB (Hyper-tables)",
        "plainMeaning": "Enregistrement d'appel réquisitionné auprès des opérateurs télécoms (qui a appelé qui, quelle antenne BTS, quelle heure, quelle durée).",
        "exampleValue": "Appel sortant vers +213555... (Durée: 142s, BTS 41029, 02/11 14:15)",
        "storageJustification": "TimescaleDB partitionne automatiquement des milliards de lignes par tranche de 24h, garantissant des requêtes chronologiques en <15ms.",
        "schemaProps": [
            {"name": "cdr_id", "type": "BigInt (PK)", "required": True, "desc": "Identifiant séquentiel de communication"},
            {"name": "timestamp_call", "type": "DateTime (Time-Series PK)", "required": True, "desc": "Horodatage milliseconde"},
            {"name": "caller", "type": "String", "required": True, "desc": "Numéro appelant"},
            {"name": "callee", "type": "String", "required": True, "desc": "Numéro appelé"},
            {"name": "duree_sec", "type": "Int", "required": True, "desc": "Durée de la communication en secondes"}
        ],
        "connectedClues": ["Émis depuis un Téléphone ([:EMIS_PAR])", "Reçu par un Téléphone ([:DESTINE_A])", "Relayé par Antenne BTS ([:RELAYE_PAR])"],
        "availableTools": ["Barre temporelle BarScroll.js", "Détection de co-déplacement de téléphones", "Invalidation d'alibis"]
    },

    # 4. Finances Criminelles & BaridiMob
    "compte_bancaire": {
        "id": "compte_bancaire",
        "domain": "finance",
        "icon": "💳",
        "name": "Compte Bancaire / BaridiMob (RIP 20d)",
        "label": "Compte_Bancaire",
        "color": "#eab308",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+ Enterprise",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Compte courant postal (CCP) ou compte bancaire algérien (Relevé d'Identité Postale à 20 chiffres) servant à recevoir les fonds extorqués.",
        "exampleValue": "RIP Algérie Poste: 00799999002481920142",
        "storageJustification": "Graphe Neo4j pour tracer les cascades de blanchiment (comptes mules intermédiaires) ; PostgreSQL pour l'intégrité financière et le rapprochement réquisitions.",
        "schemaProps": [
            {"name": "rip_algerie_poste", "type": "String (PK 20 digits)", "required": True, "desc": "Relevé d'Identité Postale canonique"},
            {"name": "ccp_numero", "type": "String", "required": True, "desc": "Numéro de compte CCP"},
            {"name": "cle_rip", "type": "String (2 digits)", "required": True, "desc": "Clé de contrôle calculée selon l'algorithme officiel"},
            {"name": "titulaire_declare", "type": "String", "required": True, "desc": "Nom du titulaire ou de la mule"}
        ],
        "connectedClues": ["Détenu par une Personne ([:DETENU_PAR])", "Reçoit un Virement ([:RECOIT_VIREMENT])", "Objet de Retrait GAB ([:RETRAIT_EFFECTUE])"],
        "availableTools": ["Vérificateur de RIP Algérie Poste (Luhn DZ)", "Algorithme Dijkstra du plus court chemin de blanchiment", "Détection de mules GDS"]
    },
    "transaction_financiere": {
        "id": "transaction_financiere",
        "domain": "finance",
        "icon": "💸",
        "name": "Virement Bancaire / BaridiMob DZD",
        "label": "Transaction_Financiere",
        "color": "#eab308",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16 (Table ACID)",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Transfert de fonds opéré via l'application BaridiMob, virement de compte à compte ou versement en espèces au guichet de poste.",
        "exampleValue": "Virement BaridiMob de 100 000 DZD (Réf: TX-98412-DZ)",
        "storageJustification": "Table ACID PostgreSQL pour la balance financière exacte et la conformité bancaire ; arête pondérée Neo4j ([:EFFECTUE_VIREMENT {montant}]) pour le flux.",
        "schemaProps": [
            {"name": "tx_id", "type": "String (PK)", "required": True, "desc": "Référence unique de transaction bancaire"},
            {"name": "montant_dzd", "type": "Float", "required": True, "desc": "Montant du virement en Dinars Algériens"},
            {"name": "timestamp_tx", "type": "DateTime", "required": True, "desc": "Date et heure exacte du virement"},
            {"name": "canal", "type": "Enum [BaridiMob, Guichet, GAB]", "required": True, "desc": "Canal d'exécution"}
        ],
        "connectedClues": ["Depuis Compte Source ([:DEPUIS_COMPTE])", "Vers Compte Destination ([:VERS_COMPTE])", "Justifié par un Reçu ([:ATTESTE_PAR_IMAGE])"],
        "availableTools": ["Calculateur de préjudice global affaire", "Détection de schémas de dispersion (Smurfing/Schtroumpfage)"]
    },
    "guichet_gab": {
        "id": "guichet_gab",
        "domain": "finance",
        "icon": "🏧",
        "name": "Guichet GAB / Distributeur ATM",
        "label": "Guichet_GAB",
        "color": "#eab308",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16 + PostGIS",
        "dbTag": "PostgreSQL + PostGIS",
        "dbBadge": "PostgreSQL 16 (PostGIS)",
        "plainMeaning": "Distributeur automatique de billets d'Algérie Poste ou d'une banque où les fonds extorqués ont été retirés physiquement en espèces.",
        "exampleValue": "GAB Algérie Poste - Bureau Central Bab Ezzouar",
        "storageJustification": "PostGIS pour la géolocalisation exacte et le croisement avec les caméras de surveillance de voirie et les bornages télécoms.",
        "schemaProps": [
            {"name": "id_gab", "type": "String (PK)", "required": True, "desc": "Identifiant du distributeur"},
            {"name": "bureau_poste", "type": "String", "required": True, "desc": "Nom de l'agence postale"},
            {"name": "geopoint", "type": "Point (WGS84)", "required": True, "desc": "Coordonnées GPS"}
        ],
        "connectedClues": ["Lieu de Retrait d'un Compte ([:RETRAIT_AU_GAB])", "Implanté dans Commune ([:SITUE_DANS_COMMUNE])"],
        "availableTools": ["Réquisition bandes vidéosurveillance", "Croisement spatio-temporel GAB / Téléphone"]
    },
    "crypto_wallet": {
        "id": "crypto_wallet",
        "domain": "finance",
        "icon": "🪙",
        "name": "Portefeuille Crypto (USDT / BTC / ETH)",
        "label": "Crypto_Wallet",
        "color": "#eab308",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Adresse de portefeuille blockchain (notamment Tron TRC-20 pour les transferts USDT) servant à expatrier les fonds volés hors d'Algérie.",
        "exampleValue": "Tron TRC-20: TLa2f9k...98qZ (Solde: 4 200 USDT)",
        "storageJustification": "Neo4j modélise le graphe bipartite des transferts entre adresses et exchanges (Binance Pay) ; PostgreSQL stocke l'historique de scraping TronScan.",
        "schemaProps": [
            {"name": "adresse_publique", "type": "String (PK)", "required": True, "desc": "Adresse de portefeuille blockchain"},
            {"name": "blockchain", "type": "Enum [TRON_TRC20, ETHEREUM, BITCOIN]", "required": True, "desc": "Réseau blockchain"},
            {"name": "plateforme_identifiee", "type": "String", "required": False, "desc": "Exchange centralisé identifié (ex: Binance)"}
        ],
        "connectedClues": ["Alimenté depuis Compte BaridiMob ([:CONVERTIT_FONDS])", "Transfère vers Wallet ([:TRANSFERT_CRYPTO])"],
        "availableTools": ["TronScan TRC-20 Tracker", "Breadcrumbs / GraphSense Crypto Tracer"]
    },
    "transaction_crypto": {
        "id": "transaction_crypto",
        "domain": "finance",
        "icon": "⛓️",
        "name": "Transaction Blockchain (TX Hash)",
        "label": "Transaction_Crypto",
        "color": "#eab308",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Transfert de cybermonnaie immuable enregistré sur un registre distribué public.",
        "exampleValue": "TX Hash: 0x8f192b4...38a (Montant: 2 500 USDT)",
        "storageJustification": "Table relationnelle pour la vérification des montants et arête Neo4j pour la navigation visuelle dans le mixeur crypto.",
        "schemaProps": [
            {"name": "tx_hash", "type": "String (PK)", "required": True, "desc": "Hachage de la transaction blockchain"},
            {"name": "montant_crypto", "type": "Float", "required": True, "desc": "Quantité de jetons transférés"},
            {"name": "timestamp_block", "type": "DateTime", "required": True, "desc": "Horodatage d'inclusion dans le bloc"}
        ],
        "connectedClues": ["Depuis Wallet ([:DEPUIS_WALLET])", "Vers Wallet ([:VERS_WALLET])"],
        "availableTools": ["Tracer de flux de blanchiment crypto", "Détection d'adresses sous sanctions OFAC"]
    },

    # 5. SOCMINT, Web & Trackers
    "compte_social": {
        "id": "compte_social",
        "domain": "socmint",
        "icon": "👤",
        "name": "Compte de Réseau Social / Messagerie",
        "label": "Compte_Social",
        "color": "#06b6d4",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + MongoDB",
        "dbBadge": "Neo4j / MongoDB 7.0",
        "plainMeaning": "Profil en ligne sur Facebook, Instagram, Telegram, TikTok ou WhatsApp utilisé pour diffuser les arnaques ou appâter les victimes.",
        "exampleValue": "Facebook: fb.com/promo.pneus.dz | Telegram: @walid_boss",
        "storageJustification": "Neo4j modélise le profil comme sommet du graphe relationnel ; MongoDB 7.0 stocke le dump BSON brut de l'ensemble de la bio et des abonnés.",
        "schemaProps": [
            {"name": "id_profil", "type": "String (PK)", "required": True, "desc": "Identifiant numérique permanent ou handle"},
            {"name": "plateforme", "type": "Enum [Facebook, Telegram, TikTok, Instagram, WhatsApp, Ouedkniss]", "required": True, "desc": "Réseau social"},
            {"name": "pseudo_handle", "type": "String", "required": True, "desc": "Nom d'utilisateur affiché (@...)"},
            {"name": "url_profil", "type": "String", "required": True, "desc": "Lien direct vers le profil"}
        ],
        "connectedClues": ["Appartient à une Personne ([:POSSEDE_PROFIL])", "Publie une Annonce ([:PUBLIE_POST])", "Membre d'un Canal ([:MEMBRE_DE])"],
        "availableTools": ["Meta Transparency Tracker", "Telegram MTProto Entity Resolver", "Outil Maigret (2 500+ sites)"]
    },
    "publication_sociale": {
        "id": "publication_sociale",
        "domain": "socmint",
        "icon": "📢",
        "name": "Publication / Annonce Frauduleuse",
        "label": "Publication_Sociale",
        "color": "#06b6d4",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + MinIO + MongoDB",
        "dbBadge": "Neo4j / MinIO / MongoDB",
        "plainMeaning": "Message public, annonce sponsorisée Facebook Ads ou vidéo TikTok constituant le support matériel de l'escroquerie.",
        "exampleValue": "Facebook Ad #981240 ('4 Pneus Michelin 15 pouces à 12 000 DA')",
        "storageJustification": "Neo4j relie la publication aux téléphones et liens cités ; MinIO stocke la capture d'écran scellée WORM ; MongoDB stocke le texte et les métadonnées de diffusion.",
        "schemaProps": [
            {"name": "id_post", "type": "String (PK)", "required": True, "desc": "Identifiant unique du post"},
            {"name": "texte_integral", "type": "String", "required": True, "desc": "Texte exact de l'annonce"},
            {"name": "date_publication", "type": "DateTime", "required": True, "desc": "Date et heure de parution"},
            {"name": "prix_annonce_dzd", "type": "Float", "required": False, "desc": "Tarif frauduleux allégué"}
        ],
        "connectedClues": ["Publiée par un Compte ([:PUBLIEE_PAR])", "Redirige vers Site Web ([:DIFFUSE_LIEN])", "Affiche un Téléphone ([:AFFICHE_TELEPHONE])"],
        "availableTools": ["Extracteur d'IOCs P0", "Meta Ad Library Investigator", "Scellement WORM de page web"]
    },
    "canal_telegram": {
        "id": "canal_telegram",
        "domain": "socmint",
        "icon": "📣",
        "name": "Canal / Groupe Telegram & WhatsApp",
        "label": "Canal_Telegram",
        "color": "#06b6d4",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + MongoDB",
        "dbBadge": "Neo4j / MongoDB 7.0",
        "plainMeaning": "Espace de discussion collectif privé ou public où les escrocs coordonnent leurs actions ou diffusent des catalogues de marchandises fictives.",
        "exampleValue": "Canal Telegram 'Pneus Promo Algérie' (4 800 abonnés)",
        "storageJustification": "Neo4j identifie les membres et administrateurs communs à plusieurs canaux criminels ; MongoDB stocke les dumps d'historique de chat bruts.",
        "schemaProps": [
            {"name": "id_canal", "type": "String (PK)", "required": True, "desc": "ID numérique Telegram / WhatsApp"},
            {"name": "titre_canal", "type": "String", "required": True, "desc": "Nom du groupe"},
            {"name": "nb_membres", "type": "Int", "required": False, "desc": "Nombre d'abonnés au moment de la saisie"}
        ],
        "connectedClues": ["Administré par Compte Social ([:ADMINISTRE_PAR])", "Contient des Messages ([:CONTIENT_MESSAGE])"],
        "availableTools": ["Telegram MTProto Scraper", "Détection de réseaux de propagande criminelle"]
    },
    "message_chat": {
        "id": "message_chat",
        "domain": "socmint",
        "icon": "💬",
        "name": "Message de Chat Instantané",
        "label": "Message_Chat",
        "color": "#06b6d4",
        "primaryDb": "mongodb",
        "primaryDbName": "MongoDB 7.0 WiredTiger",
        "dbTag": "MongoDB + MinIO",
        "dbBadge": "MongoDB 7.0 (BSON Snappy)",
        "plainMeaning": "Message texte ou vocal unitaire échangé sur WhatsApp ou Telegram contenant des aveux, des ordres ou des coordonnées bancaires.",
        "exampleValue": "Message #84102: 'Envoyez l'acompte par BaridiMob sur ce numéro...'",
        "storageJustification": "MongoDB gère la structure sans schéma et les volumes massifs de messages extraits des téléphones saisis avec compression Snappy.",
        "schemaProps": [
            {"name": "message_id", "type": "String (PK)", "required": True, "desc": "Identifiant dans le fil de discussion"},
            {"name": "texte_brut", "type": "String", "required": True, "desc": "Contenu textuel du message"},
            {"name": "horodatage_iso", "type": "DateTime", "required": True, "desc": "Horodatage d'envoi"}
        ],
        "connectedClues": ["Émis dans un Canal ([:DANS_CANAL])", "Embarque un Audio Vocal ([:CONTIENT_AUDIO])", "Attache une Photo ([:CONTIENT_PHOTO])"],
        "availableTools": ["Analyseur de discussions criminelles", "Extracteur automatique d'adresses et RIPs"]
    },
    "adresse_email": {
        "id": "adresse_email",
        "domain": "socmint",
        "icon": "📧",
        "name": "Adresse E-mail",
        "label": "Adresse_Email",
        "color": "#06b6d4",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Adresse de messagerie électronique utilisée pour administrer des sites web, souscrire des hébergements ou enregistrer des comptes sociaux.",
        "exampleValue": "walid.bouaziz.dz@gmail.com",
        "storageJustification": "Neo4j pivote l'adresse pour révéler tous les comptes et sites enregistrés ; PostgreSQL stocke les correspondances avec les bases de fuites de données.",
        "schemaProps": [
            {"name": "email_canonique", "type": "String (PK minuscule)", "required": True, "desc": "Adresse e-mail normalisée"},
            {"name": "domaine_mx", "type": "String", "required": True, "desc": "Fournisseur de messagerie (ex: gmail.com)"}
        ],
        "connectedClues": ["Utilisée par une Personne ([:UTILISE_EMAIL])", "Contact d'un Site Web ([:CONTACT_DE_DOMAINE])"],
        "availableTools": ["Outil GHunt (Analyseur Google Account)", "Interrogateur DeHashed & HaveIBeenPwned"]
    },
    "site_web": {
        "id": "site_web",
        "domain": "socmint",
        "icon": "🌐",
        "name": "Site Web & Boutique Scam (FQDN)",
        "label": "Site_Web",
        "color": "#06b6d4",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + MinIO + MongoDB",
        "dbBadge": "Neo4j / MinIO / MongoDB",
        "plainMeaning": "Site de commerce électronique fictif, fausse plateforme de paiement ou portail d'hameçonnage ciblant les usagers algériens.",
        "exampleValue": "https://promo-pneus-express.shop",
        "storageJustification": "Neo4j modélise le graphe d'infrastructure ; MinIO stocke l'archive WARC complète et certifiée ISO 28500 ; MongoDB stocke les en-têtes HTTP bruts.",
        "schemaProps": [
            {"name": "fqdn_domaine", "type": "String (PK)", "required": True, "desc": "Nom de domaine complet"},
            {"name": "ip_hebergeur", "type": "String", "required": True, "desc": "Adresse IP résolue"},
            {"name": "date_depot_whois", "type": "Date", "required": False, "desc": "Date d'enregistrement du domaine"}
        ],
        "connectedClues": ["Embarque un Tracker ([:EMBARQUE_TRACKER])", "Résolu vers Serveur C2 ([:RESOLU_VERS_IP])", "Distribue un Malware APK ([:DISTRIBUE_APK])"],
        "availableTools": ["ArchiveBox WARC ISO 28500 Snapshotter", "PublicWWW Source Code Hunter", "JARM TLS Fingerprinter"]
    },
    "identifiant_infrastructure": {
        "id": "identifiant_infrastructure",
        "domain": "socmint",
        "icon": "🏷️",
        "name": "Identifiant d'Infrastructure & Tracker (Meta Pixel)",
        "label": "Identifiant_Infrastructure",
        "color": "#06b6d4",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + MongoDB",
        "dbBadge": "Neo4j 5.20+ (Pivot Graphe)",
        "plainMeaning": "Balise technique cachée dans le code source d'un site web (Meta Pixel ID, Google Analytics ID, JARM TLS) partagée par plusieurs sites d'un même escroc.",
        "exampleValue": "Meta Pixel ID: 88419203314 (Partagé sur 3 sites)",
        "storageJustification": "Sommet pivot Neo4j indispensable : une simple requête Cypher à 2 sauts regroupe instantanément toutes les boutiques créées par le même réseau criminel.",
        "schemaProps": [
            {"name": "valeur_id", "type": "String (PK)", "required": True, "desc": "Valeur alphanumérique du pixel ou tracker"},
            {"name": "type_tracker", "type": "Enum [Meta_Pixel, Google_Analytics, Adsense, JARM, GTM]", "required": True, "desc": "Nature de la balise"}
        ],
        "connectedClues": ["Embarqué dans plusieurs Sites Web ([:EMBARQUE_DANS])"],
        "availableTools": ["Pivot d'infrastructure multi-sites", "Détecteur de sites jumeaux (Twin Sites Hunter)"]
    },

    # 6. Cyber, Malwares & Forensique Technique
    "fichier_apk": {
        "id": "fichier_apk",
        "domain": "cyber",
        "icon": "📦",
        "name": "Application Malveillante / Trojan BaridiMob (APK)",
        "label": "Fichier_APK",
        "color": "#22c55e",
        "primaryDb": "minio",
        "primaryDbName": "MinIO S3 WORM",
        "dbTag": "MinIO + MongoDB + Neo4j",
        "dbBadge": "MinIO WORM / MongoDB / Neo4j",
        "plainMeaning": "Fichier d'installation Android (.apk) vérolé usurpant l'identité d'Algérie Poste ou d'un service public pour voler les codes secrets et SMS OTP.",
        "exampleValue": "AutoPneusDZ.apk (SHA-256: 4a12e88...)",
        "storageJustification": "MinIO conserve le binaire exact sous scellé WORM ; MongoDB conserve l'arbre syntaxique (AST) décompilé par Jadx/Ghidra ; Neo4j relie l'APK aux victimes et au C2.",
        "schemaProps": [
            {"name": "sha256_hash", "type": "String (PK 64 hex)", "required": True, "desc": "Empreinte cryptographique du binaire"},
            {"name": "package_name", "type": "String", "required": True, "desc": "Nom du package Android (ex: com.autopneus.dz)"},
            {"name": "certificat_signature", "type": "String", "required": True, "desc": "Empreinte du certificat de signature développeur"}
        ],
        "connectedClues": ["Téléchargé depuis Site Web ([:TELECHARGE_DEPUIS])", "Communique avec Serveur C2 ([:COMMUNIQUE_AVEC_C2])", "Cible l'Appli BaridiMob ([:CIBLE_APPLICATION])"],
        "availableTools": ["Décompilateur Jadx-GUI & Ghidra", "Analyseur de certificats APK", "YARA-X & Capa Malware Scanner"]
    },
    "serveur_c2": {
        "id": "serveur_c2",
        "domain": "cyber",
        "icon": "🖥️",
        "name": "Serveur C2 & Adresse IP (Command & Control)",
        "label": "Serveur_C2",
        "color": "#22c55e",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + PostgreSQL",
        "dbBadge": "Neo4j / PostgreSQL 16",
        "plainMeaning": "Machine distante contrôlée par les cybercriminels recevant les identifiants volés, les SMS interceptés et orchestrant les attaques.",
        "exampleValue": "IP: 185.220.101.42 (Port 8443, Hébergeur: Hetzner)",
        "storageJustification": "Neo4j relie le C2 aux multiples APKs et sites compromis ; PostgreSQL stocke les rapports d'analyse de trafic Wireshark/TShark.",
        "schemaProps": [
            {"name": "ip_address", "type": "String (PK IPv4/IPv6)", "required": True, "desc": "Adresse IP publique"},
            {"name": "port_c2", "type": "Int", "required": False, "desc": "Port d'écoute du serveur de commande"},
            {"name": "asn_pays", "type": "String", "required": True, "desc": "Système autonome et pays d'hébergement"}
        ],
        "connectedClues": ["Reçoit les Données d'un Malware APK ([:PILOTE_MALWARE])", "Héberge un Site Web ([:HEBERGE_SITE])"],
        "availableTools": ["Dissecteur de trafic Wireshark / TShark", "Shodan / Censys Infrastructure Scanner"]
    },
    "certificat_tls": {
        "id": "certificat_tls",
        "domain": "cyber",
        "icon": "🔒",
        "name": "Certificat SSL/TLS & JARM Fingerprint",
        "label": "Certificat_TLS",
        "color": "#22c55e",
        "primaryDb": "neo4j",
        "primaryDbName": "Neo4j 5.20+",
        "dbTag": "Neo4j + MongoDB",
        "dbBadge": "Neo4j / MongoDB 7.0",
        "plainMeaning": "Certificat cryptographique sécurisant un site frauduleux, dont l'empreinte JARM révèle la configuration exacte du serveur sous-jacent.",
        "exampleValue": "JARM: 27d27d27d00027d00042d42d42d42d... (Let's Encrypt)",
        "storageJustification": "Neo4j relie les serveurs partageant la même signature JARM active ; MongoDB stocke le certificat X.509 complet.",
        "schemaProps": [
            {"name": "sha256_cert", "type": "String (PK)", "required": True, "desc": "Empreinte SHA-256 du certificat"},
            {"name": "jarm_hash", "type": "String (62 hex)", "required": True, "desc": "Empreinte TLS JARM active"}
        ],
        "connectedClues": ["Sécurise un Site Web ([:SECURISE_DOMAINE])"],
        "availableTools": ["JARM TLS Prober", "Certificate Transparency Logs Search (crt.sh)"]
    },
    "artefact_dfir": {
        "id": "artefact_dfir",
        "domain": "cyber",
        "icon": "🔬",
        "name": "Artefact Forensique DFIR (Image Disque / Dump RAM)",
        "label": "Artefact_DFIR",
        "color": "#22c55e",
        "primaryDb": "minio",
        "primaryDbName": "MinIO S3 WORM",
        "dbTag": "MinIO + PostgreSQL",
        "dbBadge": "MinIO WORM / PostgreSQL 16",
        "plainMeaning": "Image disque brute (E01/RAW), dump de mémoire vive RAM (Volatility) ou base SQLite chiffrée extraite d'un smartphone saisi.",
        "exampleValue": "Dump RAM Volatility (sha256: 9f81a... • Taille: 16 Go)",
        "storageJustification": "MinIO WORM stocke les volumineuses images médico-légales brutes sous Object Lock ; PostgreSQL indexe les métadonnées de saisie.",
        "schemaProps": [
            {"name": "sha256_artefact", "type": "String (PK)", "required": True, "desc": "Hash cryptographique de l'image"},
            {"name": "format_image", "type": "Enum [E01, RAW, MEM_DUMP, SQLITE_DB]", "required": True, "desc": "Format de fichier médico-légal"},
            {"name": "taille_octets", "type": "BigInt", "required": True, "desc": "Taille exacte du fichier"}
        ],
        "connectedClues": ["Extrait d'un Appareil Mobile ([:EXTRAIT_DE_TERMINAL])", "Scellé dans la Procédure ([:SOUS_SCELLE])"],
        "availableTools": ["Autopsy / SleuthKit", "Volatility 3 RAM Analyzer", "ALEAPP / iLEAPP Artifact Extractors"]
    },

    # 7. Biométrie Multimodale & Médias
    "enregistrement_vocal": {
        "id": "enregistrement_vocal",
        "domain": "biometrics",
        "icon": "🎙️",
        "name": "Enregistrement Vocal / Note Vocale WhatsApp (Darija)",
        "label": "Enregistrement_Vocal",
        "color": "#a855f7",
        "primaryDb": "minio",
        "primaryDbName": "MinIO S3 WORM",
        "dbTag": "MinIO + Qdrant + Neo4j",
        "dbBadge": "MinIO / Qdrant 1.9 / Neo4j",
        "plainMeaning": "Message vocal WhatsApp en dialecte algérien intercepté ou remis par la victime, contenant les instructions d'arnaque et la voix du suspect.",
        "exampleValue": "Audio WhatsApp (34s, ar-DZ, 'Ba3atli 10 mlayen f BaridiMob')",
        "storageJustification": "MinIO stocke l'OPUS original immuable ; Qdrant stocke l'empreinte x-vector 192-d (PyAnnote 3.1) ; Neo4j stocke la transcription textuelle et les entités NER.",
        "schemaProps": [
            {"name": "sha256_audio", "type": "String (PK)", "required": True, "desc": "Hash SHA-256 du fichier audio"},
            {"name": "duree_sec", "type": "Float", "required": True, "desc": "Durée exacte de l'enregistrement"},
            {"name": "transcription_darija", "type": "String", "required": True, "desc": "Texte transcrit par Faster-Whisper ar-DZ"},
            {"name": "qdrant_vector_id", "type": "String (UUID)", "required": True, "desc": "Pointeur vers l'index vectoriel Qdrant"}
        ],
        "connectedClues": ["Attribué à un Suspect par Voix ([:ATTRIBUE_A])", "Inclus dans un Message Chat ([:ATTACHE_A_MESSAGE])", "Scellé sous WORM ([:PROTEGE_PAR_SCELLE])"],
        "availableTools": ["Faster-Whisper Large-v3 (Fine-tuné Darija DZ)", "PyAnnote Audio 3.1 (Diarisation & Speaker Recognition)", "Détecteur Deepfake Vocal ResNet"]
    },
    "empreinte_faciale": {
        "id": "empreinte_faciale",
        "domain": "biometrics",
        "icon": "👤",
        "name": "Empreinte Faciale Biométrique ArcFace 512-d",
        "label": "Empreinte_Faciale",
        "color": "#a855f7",
        "primaryDb": "qdrant",
        "primaryDbName": "Qdrant 1.9 Vector DB (Rust)",
        "dbTag": "Qdrant + MinIO + Neo4j",
        "dbBadge": "Qdrant 1.9 / MinIO / Neo4j",
        "plainMeaning": "Vecteur mathématique compact à 512 dimensions extrait par réseau de neurones convolutif profond (ArcFace) représentant la biométrie d'un visage.",
        "exampleValue": "Vecteur ArcFace 512-d (Similarité cosinus: 0.89 avec suspect)",
        "storageJustification": "Qdrant indexe les vecteurs en mémoire vive via le graphe HNSW pour des recherches 1-to-N en <8ms avec filtrage par dossier pénal.",
        "schemaProps": [
            {"name": "vector_id", "type": "String (PK UUID)", "required": True, "desc": "Identifiant dans la collection Qdrant"},
            {"name": "vecteur_512d", "type": "List[Float] (512 dims)", "required": True, "desc": "Embedding facial normalisé"},
            {"name": "seuil_confiance", "type": "Float [0..1]", "required": True, "desc": "Confiance de détection RetinaFace"}
        ],
        "connectedClues": ["Extrait d'une Image Preuve ([:EXTRAIT_DE_PHOTO])", "Correspond à une Personne ([:IDENTIFIE_SUSPECT])"],
        "availableTools": ["ArcFace DeepFace 512-d Matcher", "Recherche k-NN Qdrant sub-8ms", "Vérificateur d'usurpation de photo de profil"]
    },
    "image_preuve": {
        "id": "image_preuve",
        "domain": "biometrics",
        "icon": "🖼️",
        "name": "Image Preuve / Capture d'Écran / Reçu BaridiMob",
        "label": "Image_Preuve",
        "color": "#a855f7",
        "primaryDb": "minio",
        "primaryDbName": "MinIO S3 WORM",
        "dbTag": "MinIO + Neo4j",
        "dbBadge": "MinIO WORM / Neo4j",
        "plainMeaning": "Photographie d'une pièce d'identité saisie, capture d'écran d'un reçu de virement BaridiMob ou cliché de faux stocks de marchandises.",
        "exampleValue": "Capture Reçu BaridiMob (SHA-256: 8f921... • 1080x1920)",
        "storageJustification": "MinIO WORM protège le fichier contre la falsification ; Neo4j conserve les métadonnées techniques EXIF (appareil, GPS, date).",
        "schemaProps": [
            {"name": "sha256_image", "type": "String (PK)", "required": True, "desc": "Hash cryptographique de l'image"},
            {"name": "phash_perceptuel", "type": "String (64 bits)", "required": True, "desc": "Hachage perceptuel anti-duplication"},
            {"name": "exif_gps", "type": "Point (WGS84)", "required": False, "desc": "Coordonnées GPS extraites par ExifTool"}
        ],
        "connectedClues": ["Donne lieu à Extraction Faciale ([:CONTIENT_VISAGE])", "Montre un Véhicule ([:MONTRE_VEHICULE])", "Justifie un Virement ([:PROUVE_VIREMENT])"],
        "availableTools": ["ExifTool GPS Extractor", "Détecteur de retouches numériques (ELA)", "Perceptual Hashing Image Deduplicator"]
    },

    # 8. Chaîne de Preuve & Scellés WORM
    "document_judiciaire": {
        "id": "document_judiciaire",
        "domain": "legal",
        "icon": "📄",
        "name": "Procès-Verbal Judiciaire (PV Normé CPP)",
        "label": "Document_Judiciaire",
        "color": "#e11d48",
        "primaryDb": "minio",
        "primaryDbName": "MinIO S3 WORM (PDF/A-3b)",
        "dbTag": "MinIO + PostgreSQL",
        "dbBadge": "MinIO / PostgreSQL 16",
        "plainMeaning": "Acte de procédure officiel rédigé par l'officier de police judiciaire : PV d'audition, de constatation, de perquisition ou rapport de synthèse.",
        "exampleValue": "PV de Synthèse N° 142/2026 - Brigade Bab Ezzouar",
        "storageJustification": "MinIO conserve le PDF/A-3b scellé ; PostgreSQL stocke le registre légal d'audit et la signature numérique X.509 de l'enquêteur.",
        "schemaProps": [
            {"name": "numero_pv", "type": "String (PK)", "required": True, "desc": "Numéro officiel de procès-verbal"},
            {"name": "type_acte", "type": "Enum [PV_SYNTHESE, PV_AUDITION, PV_CONSTAT, REQUISITION]", "required": True, "desc": "Nature juridique de l'acte"},
            {"name": "date_redaction", "type": "Date", "required": True, "desc": "Date de signature de l'acte"},
            {"name": "hash_sha256", "type": "String (64 hex)", "required": True, "desc": "Empreinte d'intégrité du document"}
        ],
        "connectedClues": ["Rattaché à l'Affaire ([:ACTE_DE_DOSSIER])", "Scellé sous Référence WORM ([:OBJET_DE_SCELLE])"],
        "availableTools": ["Générateur PDF/A-3b WeasyPrint", "Compilateur de dossier de plaidoirie", "Vérificateur d'intégrité cryptographique"]
    },
    "scelle_numerique": {
        "id": "scelle_numerique",
        "domain": "legal",
        "icon": "🔏",
        "name": "Scellé Numérique WORM (ISO 27037)",
        "label": "Scelle_Numerique",
        "color": "#e11d48",
        "primaryDb": "minio",
        "primaryDbName": "MinIO Enterprise S3 (Object Lock)",
        "dbTag": "MinIO WORM (COMPLIANCE)",
        "dbBadge": "MinIO S3 WORM (Lock)",
        "plainMeaning": "Enveloppe cryptographique inviolable garantissant l'intégrité absolue d'un élément de preuve (vidéo, vocal, WARC, dump de base de données).",
        "exampleValue": "Scellé Parquet N° SC-2026-089-01 (Verrouillé 10 ans)",
        "storageJustification": "MinIO S3 en mode COMPLIANCE strict : interdiction technique absolue d'effacement ou de modification, même par l'administrateur root.",
        "schemaProps": [
            {"name": "evidence_uid", "type": "String (PK UUID)", "required": True, "desc": "Identifiant universel d'indice"},
            {"name": "num_scelle_parquet", "type": "String", "required": True, "desc": "Numéro de scellé attribué par le greffe"},
            {"name": "lock_mode", "type": "String ('COMPLIANCE')", "required": True, "desc": "Mode de verrouillage S3 immuable"},
            {"name": "retention_until", "type": "DateTime", "required": True, "desc": "Date de fin de rétention légale (ex: 2036)"}
        ],
        "connectedClues": ["Protège un Élément de Preuve ([:SCELLE_ELEMENT])", "Ancré dans un Jalon Merkle ([:PROTEGE_PAR_MERKLE])"],
        "availableTools": ["Vérificateur de non-répudiation ISO 27037", "Contrôleur de chaîne de garde CPP Art. 68"]
    },
    "preuve_merkle": {
        "id": "preuve_merkle",
        "domain": "legal",
        "icon": "🌲",
        "name": "Jalon d'Arbre de Merkle & Horodatage RFC 3161",
        "label": "Preuve_Merkle",
        "color": "#e11d48",
        "primaryDb": "postgres",
        "primaryDbName": "PostgreSQL 16 (Ledger Merkle)",
        "dbTag": "PostgreSQL + Neo4j",
        "dbBadge": "PostgreSQL 16 / Neo4j",
        "plainMeaning": "Structure de données cryptographique en arbre de Merkle prouvant mathématiquement qu'aucun indice n'a été inséré ou supprimé a posteriori.",
        "exampleValue": "Racine Merkle: e3b0c44298fc1c149afbf4... (TSA Horodaté)",
        "storageJustification": "PostgreSQL stocke le registre séquentiel d'audit Merkle avec chaînage de hachages ; Neo4j affiche la racine de preuve de l'affaire.",
        "schemaProps": [
            {"name": "merkle_root_sha256", "type": "String (PK)", "required": True, "desc": "Racine de l'arbre de hachage de l'affaire"},
            {"name": "rfc3161_timestamp", "type": "DateTime", "required": True, "desc": "Jeton d'horodatage qualifié d'autorité de confiance (TSA)"},
            {"name": "nb_feuilles_indices", "type": "Int", "required": True, "desc": "Nombre total d'éléments scellés dans l'arbre"}
        ],
        "connectedClues": ["Couvre l'ensemble de l'Affaire ([:CERTIFIE_AFFAIRE])"],
        "availableTools": ["Générateur de preuve de Merkle pour audience", "Vérificateur d'horodatage qualifié RFC 3161"]
    },
    "session_recherche": {
        "id": "session_recherche",
        "domain": "cyber",
        "icon": "⚡",
        "name": "Session d'Investigation & Quota Anti-Ban",
        "label": "Session_Recherche",
        "color": "#f59e0b",
        "primaryDb": "redis",
        "primaryDbName": "Redis 7.2 Stack Engine",
        "dbTag": "Redis 7.2 Stack",
        "dbBadge": "Redis 7.2 (In-Memory RESP3)",
        "plainMeaning": "État temporaire en mémoire vive gérant les verrous distribués Redlock, les quotas de requêtes vers les plateformes (Token-Bucket) et le push WebSockets vers le Studio.",
        "exampleValue": "Session Enquêteur (Token Bucket: 100 req/min sur Ooredoo)",
        "storageJustification": "Redis 7.2 en RAM pure avec latence sub-milliseconde (<0.5ms) et structures de données avancées (Redis Streams, scripts Lua atomiques).",
        "schemaProps": [
            {"name": "session_id", "type": "String (PK)", "required": True, "desc": "Identifiant de session d'enquête"},
            {"name": "token_bucket_dispo", "type": "Int", "required": True, "desc": "Jetons restants avant suspension anti-ban"},
            {"name": "expires_at", "type": "DateTime", "required": True, "desc": "Expiration TTL de session"}
        ],
        "connectedClues": ["Associe l'Enquêteur au Dossier ([:SESSION_ACTIVE])"],
        "availableTools": ["Token Bucket Rate Limiter", "Pub/Sub WebSocket Studio 60 FPS"]
    }
}

RELATIONSHIPS = [
    # 1. Territoire & Hiérarchie Judiciaire
    {"source": "commune", "edge": "APPARTIENT_A_DAIRA", "target": "daira", "cardinality": "N:1", "props": "code_postal", "desc": "Rattachement administratif de la commune à sa daïra"},
    {"source": "daira", "edge": "APPARTIENT_A_WILAYA", "target": "wilaya", "cardinality": "N:1", "props": "ordre_juridique", "desc": "Rattachement administratif de la daïra à sa wilaya"},
    {"source": "unite", "edge": "SITUEE_DANS_COMMUNE", "target": "commune", "cardinality": "N:1", "props": "adresse_caserne", "desc": "Implantation géographique de la brigade ou de la sûreté"},
    {"source": "affaire", "edge": "TRAITEE_PAR_UNITE", "target": "unite", "cardinality": "N:1", "props": "date_saisine, brigade_en_charge", "desc": "Attribution de l'enquête préliminaire à une unité judiciaire"},
    {"source": "affaire", "edge": "INSTRUITE_PAR_MAGISTRAT", "target": "magistrat", "cardinality": "N:1", "props": "num_cabinet, date_ordonnance", "desc": "Supervision du dossier par le juge d'instruction"},

    # 2. Implication des Personnes & Acteurs
    {"source": "affaire", "edge": "IMPLIQUE_SUSPECT", "target": "personne", "cardinality": "1:N", "props": "_class, _Lvl_of_Implications, statut_garde_a_vue", "desc": "Implication directe d'un suspect ou complice dans le dossier"},
    {"source": "personne", "edge": "COMMUNIQUE_AVEC", "target": "personne", "cardinality": "N:M", "props": "nb_appels, total_duree_sec, premier_contact, dernier_contact", "desc": "Lien de communication direct ou co-présence téléphonique"},
    {"source": "personne", "edge": "COMPLICE_DE", "target": "personne", "cardinality": "N:M", "props": "degre_certitude, role_hierarchique", "desc": "Lien pénal de complicité établi par l'instruction"},
    {"source": "personne", "edge": "DIRIGE_ENTREPRISE", "target": "entreprise", "cardinality": "N:M", "props": "parts_sociales, date_nomination", "desc": "Gérance légale ou de fait d'une société commerciale"},
    {"source": "personne", "edge": "PROPRIETAIRE_VEHICULE", "target": "vehicule", "cardinality": "1:N", "props": "date_carte_grise", "desc": "Propriété ou utilisation habituelle d'un véhicule"},

    # 3. Télécoms & Forensique Mobile
    {"source": "personne", "edge": "UTILISE_TELEPHONE", "target": "telephone", "cardinality": "N:M", "props": "date_debut, date_fin, type_usage", "desc": "Utilisation d'une ligne mobile par le suspect"},
    {"source": "telephone", "edge": "INSERE_DANS_SIM", "target": "carte_sim", "cardinality": "1:1", "props": "date_activation", "desc": "Association entre numéro d'appel et puce SIM physique"},
    {"source": "carte_sim", "edge": "LOGEE_DANS_TERMINAL", "target": "appareil_mobile", "cardinality": "N:1", "props": "slot_sim_1_ou_2, date_premiere_detection", "desc": "Insertion de la carte SIM dans un smartphone spécifique"},
    {"source": "telephone", "edge": "BORNE_SUR_ANTENNE", "target": "antenne_bts", "cardinality": "N:M", "props": "timestamp_appel, azimut, duree_sec", "desc": "Bornage d'un appel téléphonique sur un relais cellulaire"},
    {"source": "telecom_cdr", "edge": "TRACE_LIGNE_APPELANTE", "target": "telephone", "cardinality": "N:1", "props": "cdr_id, timestamp", "desc": "Ligne téléphonique à l'origine de l'appel"},
    {"source": "telecom_cdr", "edge": "TRACE_LIGNE_APPELEE", "target": "telephone", "cardinality": "N:1", "props": "cdr_id, timestamp", "desc": "Ligne téléphonique destinataire de l'appel"},
    {"source": "telecom_cdr", "edge": "RELAIS_PAR_ANTENNE", "target": "antenne_bts", "cardinality": "N:1", "props": "cell_id, lac", "desc": "Relais ayant acheminé la communication"},

    # 4. Finances Criminelles & BaridiMob
    {"source": "personne", "edge": "DETIENT_COMPTE_BANCAIRE", "target": "compte_bancaire", "cardinality": "1:N", "props": "date_ouverture, statut_compte (mule/principal)", "desc": "Titularité d'un compte postal BaridiMob ou compte bancaire"},
    {"source": "compte_bancaire", "edge": "EFFECTUE_VIREMENT_VERS", "target": "compte_bancaire", "cardinality": "N:M", "props": "montant_dzd, timestamp, tx_id, canal", "desc": "Virement d'argent entre deux comptes (blanchiment/extorsion)"},
    {"source": "compte_bancaire", "edge": "RETRAIT_ESPECES_GAB", "target": "guichet_gab", "cardinality": "N:M", "props": "montant_dzd, timestamp, carte_utilisée", "desc": "Retrait d'argent liquide sur un automate postal"},
    {"source": "telephone", "edge": "RECOIT_OTP_BARIDIMOB", "target": "compte_bancaire", "cardinality": "N:1", "props": "numero_notification", "desc": "Numéro recevant les SMS OTP de validation des virements"},
    {"source": "compte_bancaire", "edge": "CONVERTIT_EN_CRYPTO", "target": "crypto_wallet", "cardinality": "N:M", "props": "montant_dzd_converti, equivalent_usdt", "desc": "Achat de cryptomonnaie par virement bancaire"},
    {"source": "crypto_wallet", "edge": "TRANSFERT_CRYPTO_VERS", "target": "crypto_wallet", "cardinality": "N:M", "props": "montant_usdt, tx_hash, blockchain", "desc": "Transfert de jetons USDT entre portefeuilles blockchain"},

    # 5. SOCMINT, Web & Infrastructure
    {"source": "personne", "edge": "POSSEDE_PROFIL_SOCIAL", "target": "compte_social", "cardinality": "1:N", "props": "date_liaison, degre_confiance", "desc": "Attribution d'un profil Facebook, Telegram ou TikTok au suspect"},
    {"source": "compte_social", "edge": "PUBLIE_ANNONCE_SCAM", "target": "publication_sociale", "cardinality": "1:N", "props": "date_publication, statut_sponsorise", "desc": "Publication d'une annonce frauduleuse sur un réseau social"},
    {"source": "compte_social", "edge": "ADMINISTRE_CANAL", "target": "canal_telegram", "cardinality": "N:M", "props": "role (admin, createur), date_adhesion", "desc": "Gestion d'un canal ou groupe de vente de contrefaçons"},
    {"source": "canal_telegram", "edge": "HEBERGE_MESSAGES", "target": "message_chat", "cardinality": "1:N", "props": "nb_messages_extraits", "desc": "Contenu des échanges au sein du canal criminel"},
    {"source": "publication_sociale", "edge": "RETOURN_VERS_SITE_WEB", "target": "site_web", "cardinality": "N:1", "props": "url_clic, code_promo", "desc": "Lien de redirection de l'annonce vers la fausse boutique"},
    {"source": "publication_sociale", "edge": "MENTIONNE_TELEPHONE", "target": "telephone", "cardinality": "N:M", "props": "texte_mention (WhatsApp commercial)", "desc": "Numéro de contact affiché publiquement sur l'annonce"},
    {"source": "site_web", "edge": "EMBARQUE_PIXEL_TRACKER", "target": "identifiant_infrastructure", "cardinality": "N:M", "props": "position_code_dom", "desc": "Présence d'un tracker d'audience partagé dans le code du site"},
    {"source": "site_web", "edge": "RESOLU_VERS_IP_C2", "target": "serveur_c2", "cardinality": "N:1", "props": "date_resolution_dns, ttl", "desc": "Résolution DNS du nom de domaine vers son adresse IP d'hébergement"},
    {"source": "site_web", "edge": "UTILISE_CERTIFICAT_TLS", "target": "certificat_tls", "cardinality": "N:1", "props": "validite_certificat", "desc": "Certificat de chiffrement HTTPS déployé sur le site"},

    # 6. Cyber, Malwares & Forensique
    {"source": "site_web", "edge": "DISTRIBUE_APPLICATION_APK", "target": "fichier_apk", "cardinality": "1:N", "props": "url_telechargement, nom_fichier", "desc": "Lien direct poussant la victime à installer le trojan bancaire"},
    {"source": "fichier_apk", "edge": "COMMUNIQUE_AVEC_C2", "target": "serveur_c2", "cardinality": "N:1", "props": "port_ecoute, protocole_c2", "desc": "Exfiltration des SMS et codes secrets vers le serveur criminel"},
    {"source": "fichier_apk", "edge": "CIBLE_COMPTE_BARIDIMOB", "target": "compte_bancaire", "cardinality": "N:M", "props": "fausse_interface_injectee", "desc": "Interception des accès et vol des identifiants BaridiMob"},
    {"source": "appareil_mobile", "edge": "A_PRODUIT_ARTEFACT_DFIR", "target": "artefact_dfir", "cardinality": "1:N", "props": "methode_acquisition (extraction physique)", "desc": "Saisie médico-légale de la mémoire ou du disque du smartphone"},

    # 7. Biométrie Multimodale & Médias
    {"source": "message_chat", "edge": "CONTIENT_ENREGISTREMENT_VOCAL", "target": "enregistrement_vocal", "cardinality": "1:1", "props": "format_codec, taille_octets", "desc": "Note vocale audio attachée à un message WhatsApp"},
    {"source": "enregistrement_vocal", "edge": "ATTRIBUE_A_LOCUTEUR", "target": "personne", "cardinality": "N:1", "props": "score_similarite_vocale (PyAnnote), langue_darija", "desc": "Identification de la voix du suspect par biométrie vocale"},
    {"source": "image_preuve", "edge": "CONTIENT_EMPREINTE_FACIALE", "target": "empreinte_faciale", "cardinality": "1:N", "props": "bbox_visage, certitude_detection", "desc": "Détection d'un visage exploitable sur une photo saisie"},
    {"source": "empreinte_faciale", "edge": "CORRESPOND_A_SUSPECT", "target": "personne", "cardinality": "N:1", "props": "distance_cosinus_arcface (<0.68)", "desc": "Rapprochement facial 1-to-N confirmé avec la fiche du suspect"},
    {"source": "image_preuve", "edge": "MONTRE_VEHICULE_PLAQUE", "target": "vehicule", "cardinality": "N:1", "props": "immatriculation_lapi", "desc": "Reconnaissance de plaque d'immatriculation sur une photo"},

    # 8. Chaîne de Preuve & Scellés Légaux
    {"source": "affaire", "edge": "CONTIENT_PROCES_VERBAL", "target": "document_judiciaire", "cardinality": "1:N", "props": "num_piece_dossier", "desc": "Intégration d'un PV d'audition ou de constatation au dossier pénal"},
    {"source": "document_judiciaire", "edge": "PROTEGE_PAR_SCELLE", "target": "scelle_numerique", "cardinality": "1:1", "props": "date_scellement", "desc": "Verrouillage juridique du rapport sous scellé WORM"},
    {"source": "scelle_numerique", "edge": "VERROUILLE_PREUVE_BINAIRE", "target": "enregistrement_vocal", "cardinality": "1:1", "props": "sha256_conforme", "desc": "Scellement WORM de l'audio original dans MinIO COMPLIANCE"},
    {"source": "scelle_numerique", "edge": "VERROUILLE_PREUVE_IMAGE", "target": "image_preuve", "cardinality": "1:1", "props": "sha256_conforme", "desc": "Scellement WORM de l'image de reçu BaridiMob"},
    {"source": "scelle_numerique", "edge": "VERROUILLE_PREUVE_APK", "target": "fichier_apk", "cardinality": "1:1", "props": "sha256_conforme", "desc": "Scellement WORM du fichier malveillant APK"},
    {"source": "affaire", "edge": "CERTIFIEE_PAR_MERKLE", "target": "preuve_merkle", "cardinality": "1:1", "props": "merkle_root_sha256, rfc3161_timestamp", "desc": "Racine cryptographique garantissant l'intégrité de tous les scellés"}
]

print(f"Loaded master ontology definitions: {len(NODES)} node types, {len(RELATIONSHIPS)} relationships.")
