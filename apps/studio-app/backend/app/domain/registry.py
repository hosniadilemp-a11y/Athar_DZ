"""Athar Ontological Registry — Single Source of Truth.

Defines the 37 canonical node types, their 5 operational layers,
GPS capabilities, and the 47 permitted relational edge schemas.
Exportable to JSON for client consumption and verification.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from enum import Enum
from pathlib import Path
from typing import Any


class LayerId(str, Enum):
    """The 5 functional investigation layers."""

    VERIFIED = "VERIFIED"  # Layer 1: Judicial, Evidence, Territory (11 types)
    OSINT_RAW = "OSINT_RAW"  # Layer 2: Open Source, Social, Web (8 types)
    INFRA = "INFRA"  # Layer 3: Tech Infrastructure & DFIR (8 types)
    HYPOTHESIS = "HYPOTHESIS"  # Layer 4: Target Entities & Analysis (4 types)
    FLOWS = "FLOWS"  # Layer 5: Financial Transactions & Telecom CDRs (6 types)


@dataclass(frozen=True)
class LayerDefinition:
    """Metadata describing a graph layer."""

    id: int
    key: LayerId
    color: str
    border_style: str
    label_fr: str
    label_en: str
    label_ar: str
    description_fr: str


@dataclass(frozen=True)
class NodeTypeDefinition:
    """Specification of an entity node type."""

    key: str
    layer: LayerId
    cypher_label: str
    label_fr: str
    label_en: str
    label_ar: str
    icon: str
    has_gps: bool
    storage_engine: str
    description_fr: str
    canonical_attributes: list[str]


@dataclass(frozen=True)
class RelationTypeDefinition:
    """Specification of a directed relation type between node classes."""

    name: str
    label_fr: str
    label_en: str
    label_ar: str
    allowed_sources: list[str]
    allowed_targets: list[str]
    cardinality: str
    is_directed: bool = True
    description_fr: str = ""


# ==============================================================================
# 1. LAYERS DEFINITION (5 Layers)
# ==============================================================================

LAYERS: dict[LayerId, LayerDefinition] = {
    LayerId.VERIFIED: LayerDefinition(
        id=1,
        key=LayerId.VERIFIED,
        color="#10b981",  # Emerald / Forest Green
        border_style="solid",
        label_fr="Preuves Judiciaires & Territoire",
        label_en="Judicial Evidence & Territory",
        label_ar="أدلة قضائية وإقليمية",
        description_fr="Données certifiées, scellées ou administratives immuables.",
    ),
    LayerId.OSINT_RAW: LayerDefinition(
        id=2,
        key=LayerId.OSINT_RAW,
        color="#06b6d4",  # Cyan
        border_style="solid",
        label_fr="Renseignement OSINT & Web",
        label_en="OSINT & Web Intelligence",
        label_ar="استخبارات المصادر المفتوحة والويب",
        description_fr="Traces collectées en source ouverte (pages, annonces, messages).",
    ),
    LayerId.INFRA: LayerDefinition(
        id=3,
        key=LayerId.INFRA,
        color="#8b5cf6",  # Violet
        border_style="solid",
        label_fr="Infrastructures & Forensique",
        label_en="Infrastructure & Forensics",
        label_ar="بنية تحتية وجنائيات رقمية",
        description_fr="Matériels, serveurs d'attaque, malwares APK et traces d'analyse DFIR.",
    ),
    LayerId.HYPOTHESIS: LayerDefinition(
        id=4,
        key=LayerId.HYPOTHESIS,
        color="#f43f5e",  # Rose / Crimson
        border_style="dashed",
        label_fr="Hypothèses & Criminels Clés",
        label_en="Hypotheses & Key Targets",
        label_ar="فرضيات ومشبوهون رئيسيون",
        description_fr="Personnes physiques, entreprises et véhicules sous statut de suspicion.",
    ),
    LayerId.FLOWS: LayerDefinition(
        id=5,
        key=LayerId.FLOWS,
        color="#f59e0b",  # Amber / Gold
        border_style="solid",
        label_fr="Flux Financiers & Télécoms",
        label_en="Financial & Telecom Flows",
        label_ar="تدفقات مالية واتصالات",
        description_fr=(
            "CDRs d'appels, comptes bancaires/BaridiMob, " "wallets et mouvements financiers."
        ),
    ),
}


# ==============================================================================
# 2. NODE TYPES DEFINITION (37 Types across 5 Layers)
# ==============================================================================

NODE_TYPES: dict[str, NodeTypeDefinition] = {
    # --- Layer 1: VERIFIED (11 types) ---
    "wilaya": NodeTypeDefinition(
        key="wilaya",
        layer=LayerId.VERIFIED,
        cypher_label="Wilaya",
        label_fr="Wilaya",
        label_en="Province (Wilaya)",
        label_ar="ولاية",
        icon="landmark",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Circonscription administrative et juridictionnelle algérienne (01 à 58).",
        canonical_attributes=["code_wilaya", "nom_fr", "nom_ar"],
    ),
    "daira": NodeTypeDefinition(
        key="daira",
        layer=LayerId.VERIFIED,
        cypher_label="Daira",
        label_fr="Daïra",
        label_en="District (Daira)",
        label_ar="دائرة",
        icon="building",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Subdivision administrative intermédiaire rattachée à une wilaya.",
        canonical_attributes=["id_daira", "nom_fr", "code_wilaya"],
    ),
    "commune": NodeTypeDefinition(
        key="commune",
        layer=LayerId.VERIFIED,
        cypher_label="Commune",
        label_fr="Commune",
        label_en="Municipality (Commune)",
        label_ar="بلدية",
        icon="map-pin",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Échelon municipal de base en " "Algérie (1 541 communes). Localisation précise."
        ),
        canonical_attributes=["id_commune", "nom_fr", "code_postal", "latitude", "longitude"],
    ),
    "unite": NodeTypeDefinition(
        key="unite",
        layer=LayerId.VERIFIED,
        cypher_label="Unite",
        label_fr="Unité Enquêteuse",
        label_en="Investigative Unit",
        label_ar="وحدة التحقيق",
        icon="shield",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr="Brigade de recherches ou division de lutte contre la cybercriminalité.",
        canonical_attributes=["code_unite", "nom_unite", "corps_securite", "latitude", "longitude"],
    ),
    "affaire": NodeTypeDefinition(
        key="affaire",
        layer=LayerId.VERIFIED,
        cypher_label="Affaire",
        label_fr="Dossier d'Affaire",
        label_en="Case File",
        label_ar="ملف القضية",
        icon="folder-kanban",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Dossier d'information judiciaire instruit sous un numéro de parquet.",
        canonical_attributes=["numero_parquet", "intitule", "date_ouverture", "statut"],
    ),
    "magistrat": NodeTypeDefinition(
        key="magistrat",
        layer=LayerId.VERIFIED,
        cypher_label="Magistrat",
        label_fr="Magistrat Instructeur",
        label_en="Investigating Magistrate",
        label_ar="قاضي التحقيق",
        icon="scale",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Juge d'instruction ou procureur de la "
            "République près le pôle judiciaire spécialisé."
        ),
        canonical_attributes=["matricule_magistrat", "nom", "prenom", "juridiction"],
    ),
    "document_judiciaire": NodeTypeDefinition(
        key="document_judiciaire",
        layer=LayerId.VERIFIED,
        cypher_label="Document_Judiciaire",
        label_fr="Procès-Verbal / Acte Judiciaire",
        label_en="Judicial Document",
        label_ar="محضر قضائي رسمي",
        icon="file-text",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Acte de procédure légale dressé par un OPJ (PV de saisie, PV d'audition).",
        canonical_attributes=["numero_pv", "type_acte", "date_redaction", "hash_sha256"],
    ),
    "scelle_numerique": NodeTypeDefinition(
        key="scelle_numerique",
        layer=LayerId.VERIFIED,
        cypher_label="Scelle_Numerique",
        label_fr="Scellé Numérique WORM",
        label_en="Digital Sealed Evidence",
        label_ar="حرز رقمي محمي",
        icon="lock",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Conteneur cryptographique immuable garantissant " "l'intégrité probatoire de l'indice."
        ),
        canonical_attributes=["numero_scelle", "hash_sha256", "horodatage_rfc3161"],
    ),
    "preuve_merkle": NodeTypeDefinition(
        key="preuve_merkle",
        layer=LayerId.VERIFIED,
        cypher_label="Preuve_Merkle",
        label_fr="Preuve Cryptographique Merkle",
        label_en="Merkle Cryptographic Proof",
        label_ar="دليل ميركل المشفر",
        icon="git-commit",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Feuille d'arbre binaire de Merkle " "ancrée dans le registre d'audit append-only."
        ),
        canonical_attributes=["merkle_root", "index_feuille", "hash_parent"],
    ),
    "image_preuve": NodeTypeDefinition(
        key="image_preuve",
        layer=LayerId.VERIFIED,
        cypher_label="Image_Preuve",
        label_fr="Photographie Preuve / Saisie",
        label_en="Seized Evidence Photo",
        label_ar="صورة حرز / إثبات",
        icon="image",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Cliché photographique forensique sous " "scellé (véhicule, lieu, faux documents)."
        ),
        canonical_attributes=["hash_sha256", "date_cliche", "latitude", "longitude", "resolution"],
    ),
    "enregistrement_vocal": NodeTypeDefinition(
        key="enregistrement_vocal",
        layer=LayerId.VERIFIED,
        cypher_label="Enregistrement_Vocal",
        label_fr="Enregistrement Vocal / Écoute",
        label_en="Voice Recording",
        label_ar="تسجيل صوتي جنائي",
        icon="mic",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Fichier audio intercepté légalement " "ou extrait d'une messagerie instantanée."
        ),
        canonical_attributes=["hash_sha256", "duree_secondes", "langue_predom", "format_audio"],
    ),
    # --- Layer 2: OSINT_RAW (8 types) ---
    "telephone": NodeTypeDefinition(
        key="telephone",
        layer=LayerId.OSINT_RAW,
        cypher_label="Telephone",
        label_fr="Numéro Téléphonique",
        label_en="Phone Number",
        label_ar="رقم هاتف",
        icon="phone",
        has_gps=False,
        storage_engine="neo4j,postgres,redis",
        description_fr="Ligne d'appel MSISDN identifiée lors des investigations.",
        canonical_attributes=["msisdn", "operateur", "statut_ligne"],
    ),
    "compte_social": NodeTypeDefinition(
        key="compte_social",
        layer=LayerId.OSINT_RAW,
        cypher_label="Compte_Social",
        label_fr="Compte Réseau Social",
        label_en="Social Media Account",
        label_ar="حساب تواصل اجتماعي",
        icon="user-check",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Profil utilisateur sur plateforme " "en ligne (Facebook, Telegram, Instagram)."
        ),
        canonical_attributes=["plateforme", "identifiant_unique", "nom_profil", "url_profil"],
    ),
    "publication_sociale": NodeTypeDefinition(
        key="publication_sociale",
        layer=LayerId.OSINT_RAW,
        cypher_label="Publication_Sociale",
        label_fr="Publication / Annonce Scam",
        label_en="Social Post / Scam Ad",
        label_ar="منشور أو إعلان احتيالي",
        icon="megaphone",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Message ou annonce publique de vente frauduleuse ou hameçonnage.",
        canonical_attributes=["id_publication", "date_publication", "contenu_texte", "url_capture"],
    ),
    "canal_telegram": NodeTypeDefinition(
        key="canal_telegram",
        layer=LayerId.OSINT_RAW,
        cypher_label="Canal_Telegram",
        label_fr="Canal / Groupe Telegram",
        label_en="Telegram Channel/Group",
        label_ar="قناة أو مجموعة تيليغرام",
        icon="send",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Espace de discussion de diffusion " "d'offres frauduleuses ou de coordination."
        ),
        canonical_attributes=["id_telegram", "nom_canal", "lien_invitation", "nb_abonnes"],
    ),
    "message_chat": NodeTypeDefinition(
        key="message_chat",
        layer=LayerId.OSINT_RAW,
        cypher_label="Message_Chat",
        label_fr="Message de Discussion Instantanée",
        label_en="Chat Message",
        label_ar="رسالة محادثة فورية",
        icon="message-square",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Contenu textuel horodaté échangé entre victimes et escrocs.",
        canonical_attributes=["id_message", "horodatage_envoi", "texte_message", "expediteur_id"],
    ),
    "adresse_email": NodeTypeDefinition(
        key="adresse_email",
        layer=LayerId.OSINT_RAW,
        cypher_label="Adresse_Email",
        label_fr="Adresse E-mail",
        label_en="Email Address",
        label_ar="عنوان بريد إلكتروني",
        icon="mail",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Compte de messagerie électronique relevé dans les métadonnées.",
        canonical_attributes=["adresse_email", "nom_domaine", "date_premiere_observation"],
    ),
    "site_web": NodeTypeDefinition(
        key="site_web",
        layer=LayerId.OSINT_RAW,
        cypher_label="Site_Web",
        label_fr="Site Web / Boutique Scam",
        label_en="Website / Phishing Domain",
        label_ar="موقع إلكتروني احتيالي",
        icon="globe",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Nom de domaine ou URL servant d'hameçon pour les escroqueries.",
        canonical_attributes=["nom_domaine", "url_complete", "date_enregistrement_whois"],
    ),
    "session_recherche": NodeTypeDefinition(
        key="session_recherche",
        layer=LayerId.OSINT_RAW,
        cypher_label="Session_Recherche",
        label_fr="Session d'Investigation OSINT",
        label_en="OSINT Research Session",
        label_ar="جلسة بحث واستخبارات مفتوحة",
        icon="search",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Traçabilité de requêtes OSINT et d'empreintes de collecte par l'enquêteur.",
        canonical_attributes=["id_session", "mots_cles", "date_session", "outils_utilises"],
    ),
    # --- Layer 3: INFRA (8 types) ---
    "carte_sim": NodeTypeDefinition(
        key="carte_sim",
        layer=LayerId.INFRA,
        cypher_label="Carte_SIM",
        label_fr="Carte SIM",
        label_en="SIM Card",
        label_ar="شريحة SIM",
        icon="cpu",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Puce physique télécom caractérisée par son ICCID et son IMSI.",
        canonical_attributes=["iccid", "imsi", "operateur_reseau"],
    ),
    "appareil_mobile": NodeTypeDefinition(
        key="appareil_mobile",
        layer=LayerId.INFRA,
        cypher_label="Appareil_Mobile",
        label_fr="Terminal Téléphonique / IMEI",
        label_en="Mobile Device (IMEI)",
        label_ar="جهاز هاتف محمول (IMEI)",
        icon="smartphone",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Téléphone portable ou smartphone physique saisi ou identifié par son IMEI.",
        canonical_attributes=["numero_imei", "marque", "modele", "systeme_exploitation"],
    ),
    "antenne_bts": NodeTypeDefinition(
        key="antenne_bts",
        layer=LayerId.INFRA,
        cypher_label="Antenne_BTS",
        label_fr="Antenne Relais Télécom BTS",
        label_en="Telecom BTS Tower",
        label_ar="برج وهوائي اتصالات BTS",
        icon="radio",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr="Station de base GSM/UMTS/LTE avec coordonnées GPS et azimut de couverture.",
        canonical_attributes=["cell_id", "lac", "operateur", "latitude", "longitude", "azimut"],
    ),
    "identifiant_infrastructure": NodeTypeDefinition(
        key="identifiant_infrastructure",
        layer=LayerId.INFRA,
        cypher_label="Identifiant_Infrastructure",
        label_fr="Tracker Web / Pixel d'Analyse",
        label_en="Infrastructure / Web Tracker",
        label_ar="معرف تتبع وبنية تقنية",
        icon="tag",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Identifiant technique (Meta Pixel ID, Google Analytics, Adsense ID).",
        canonical_attributes=["type_tracker", "valeur_identifiant", "fournisseur"],
    ),
    "fichier_apk": NodeTypeDefinition(
        key="fichier_apk",
        layer=LayerId.INFRA,
        cypher_label="Fichier_APK",
        label_fr="Application Android Malware / APK",
        label_en="Malware APK Package",
        label_ar="حزمة تطبيق أندرويد خبيثة APK",
        icon="box",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Fichier package d'application mobile malveillante "
            "distribué pour intercepter les OTP."
        ),
        canonical_attributes=["nom_paquet", "hash_sha256", "version", "permissions_critiques"],
    ),
    "serveur_c2": NodeTypeDefinition(
        key="serveur_c2",
        layer=LayerId.INFRA,
        cypher_label="Serveur_C2",
        label_fr="Serveur C2 / Adresse IP Hôte",
        label_en="C2 Server / Host IP",
        label_ar="خادم قيادة وسيطرة C2 / عنوان IP",
        icon="server",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Machine hôte contrôlant les botnets ou recevant les identifiants volés.",
        canonical_attributes=["adresse_ip", "port_ecoute", "pays_hebergement", "fournisseur_as"],
    ),
    "certificat_tls": NodeTypeDefinition(
        key="certificat_tls",
        layer=LayerId.INFRA,
        cypher_label="Certificat_TLS",
        label_fr="Certificat Cryptographique TLS",
        label_en="TLS/SSL Certificate",
        label_ar="شهادة أمان TLS رقمية",
        icon="shield-check",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Empreinte cryptographique de sécurité protégeant les faux sites.",
        canonical_attributes=["empreinte_sha256", "autorite_emission", "date_validite"],
    ),
    "artefact_dfir": NodeTypeDefinition(
        key="artefact_dfir",
        layer=LayerId.INFRA,
        cypher_label="Artefact_DFIR",
        label_fr="Artefact Forensique / DFIR",
        label_en="DFIR Digital Artifact",
        label_ar="أثر فني واستخراج جنائي DFIR",
        icon="binary",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Trace bas niveau extraite lors de l'acquisition forensique du terminal.",
        canonical_attributes=["cle_registre", "chemin_fichier", "signature_binaire"],
    ),
    # --- Layer 4: HYPOTHESIS (4 types) ---
    "personne": NodeTypeDefinition(
        key="personne",
        layer=LayerId.HYPOTHESIS,
        cypher_label="Personne",
        label_fr="Personne Physique / Suspect",
        label_en="Person / Suspect Target",
        label_ar="شخص طبيعي / مشتبه فيه",
        icon="user",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Individu mis en cause, complice présumé, " "titulaire de compte mule ou victime."
        ),
        canonical_attributes=[
            "nin_algerien",
            "nom",
            "prenom",
            "date_naissance",
            "latitude",
            "longitude",
        ],
    ),
    "entreprise": NodeTypeDefinition(
        key="entreprise",
        layer=LayerId.HYPOTHESIS,
        cypher_label="Entreprise",
        label_fr="Entreprise / Société Écran",
        label_en="Company / Shell Corp",
        label_ar="شركة / مؤسسة وهمية",
        icon="briefcase",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Entité morale immatriculée ou usurpée " "servant de façade pour les escroqueries."
        ),
        canonical_attributes=["registre_commerce", "nif", "raison_sociale"],
    ),
    "vehicule": NodeTypeDefinition(
        key="vehicule",
        layer=LayerId.HYPOTHESIS,
        cypher_label="Vehicule",
        label_fr="Véhicule Suspect",
        label_en="Vehicle",
        label_ar="مركبة مشتبه فيها",
        icon="car",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr="Moyen de transport motorisé utilisé lors des retraits GAB ou repérages.",
        canonical_attributes=[
            "numero_immatriculation",
            "marque",
            "modele",
            "couleur",
            "latitude",
            "longitude",
        ],
    ),
    "empreinte_faciale": NodeTypeDefinition(
        key="empreinte_faciale",
        layer=LayerId.HYPOTHESIS,
        cypher_label="Empreinte_Faciale",
        label_fr="Empreinte Faciale Biométrique",
        label_en="Facial Biometric Vector",
        label_ar="بصمة وجه بيومترية",
        icon="scan-face",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Vecteur de plongement facial (512 dimensions) extrait par ArcFace.",
        canonical_attributes=["modele_vecteur", "dimension", "qualite_image"],
    ),
    # --- Layer 5: FLOWS (6 types) ---
    "telecom_cdr": NodeTypeDefinition(
        key="telecom_cdr",
        layer=LayerId.FLOWS,
        cypher_label="Telecom_CDR",
        label_fr="Enregistrement d'Appel / CDR",
        label_en="Call Detail Record (CDR)",
        label_ar="سجل تفاصيل المكالمات CDR",
        icon="activity",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr="Relevé technique d'une communication voix ou session data horodatée.",
        canonical_attributes=[
            "horodatage_appel",
            "duree_secondes",
            "type_evenement",
            "latitude",
            "longitude",
        ],
    ),
    "compte_bancaire": NodeTypeDefinition(
        key="compte_bancaire",
        layer=LayerId.FLOWS,
        cypher_label="Compte_Bancaire",
        label_fr="Compte Bancaire / BaridiMob (RIP)",
        label_en="Bank Account / BaridiMob (RIP)",
        label_ar="حساب بنكي / بريدي موب (RIP)",
        icon="credit-card",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Relevé d'identité postale ou compte " "bancaire utilisé pour réceptionner les fonds."
        ),
        canonical_attributes=["numero_rip_rib", "banque_ou_poste", "intitule_titulaire"],
    ),
    "transaction_financiere": NodeTypeDefinition(
        key="transaction_financiere",
        layer=LayerId.FLOWS,
        cypher_label="Transaction_Financiere",
        label_fr="Transaction Financière DZD",
        label_en="Financial Transaction (DZD)",
        label_ar="معاملة مالية بالدينار الجزائري",
        icon="banknote",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Mouvement de fonds en dinars algériens " "opéré par virement BaridiMob ou chèque."
        ),
        canonical_attributes=[
            "reference_operation",
            "montant_dzd",
            "date_operation",
            "canal_virement",
        ],
    ),
    "guichet_gab": NodeTypeDefinition(
        key="guichet_gab",
        layer=LayerId.FLOWS,
        cypher_label="Guichet_GAB",
        label_fr="Guichet Automatique GAB / ATM",
        label_en="Automated Teller Machine (ATM/GAB)",
        label_ar="صراف آلي GAB",
        icon="landmark",
        has_gps=True,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Distributeur de billets d'Algérie Poste ou d'une " "banque où a eu lieu le retrait."
        ),
        canonical_attributes=[
            "code_gab",
            "nom_agence",
            "adresse_physique",
            "latitude",
            "longitude",
        ],
    ),
    "crypto_wallet": NodeTypeDefinition(
        key="crypto_wallet",
        layer=LayerId.FLOWS,
        cypher_label="Crypto_Wallet",
        label_fr="Portefeuille Crypto-Monnaies",
        label_en="Cryptocurrency Wallet",
        label_ar="محفظة عملات مشفرة",
        icon="coins",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr="Adresse de compte public blockchain (TRON USDT TRC-20, Bitcoin, Ethereum).",
        canonical_attributes=["adresse_publique", "blockchain", "solde_estime"],
    ),
    "transaction_crypto": NodeTypeDefinition(
        key="transaction_crypto",
        layer=LayerId.FLOWS,
        cypher_label="Transaction_Crypto",
        label_fr="Transfert Blockchain Crypto",
        label_en="Blockchain Transfer",
        label_ar="تحويل عملات مشفرة عبر البلوكشين",
        icon="arrow-right-left",
        has_gps=False,
        storage_engine="neo4j,postgres",
        description_fr=(
            "Enregistrement immuable sur le registre " "distribué d'un transfert d'USDT ou BTC."
        ),
        canonical_attributes=["hash_transaction_txid", "montant_crypto", "frais_reseau"],
    ),
}


# ==============================================================================
# 3. RELATION TYPES DEFINITION (47 Canonical Directed Relations)
# ==============================================================================

RELATION_TYPES: dict[str, RelationTypeDefinition] = {
    # 1-6: Territoire & Judiciaire
    "APPARTIENT_A_DAIRA": RelationTypeDefinition(
        name="APPARTIENT_A_DAIRA",
        label_fr="Appartient à la Daïra",
        label_en="Belongs to District",
        label_ar="ينتمي إلى الدائرة",
        allowed_sources=["commune"],
        allowed_targets=["daira"],
        cardinality="N:1",
        description_fr="Rattachement administratif d'une commune à sa daïra.",
    ),
    "APPARTIENT_A_WILAYA": RelationTypeDefinition(
        name="APPARTIENT_A_WILAYA",
        label_fr="Appartient à la Wilaya",
        label_en="Belongs to Province",
        label_ar="ينتمي إلى الولاية",
        allowed_sources=["daira"],
        allowed_targets=["wilaya"],
        cardinality="N:1",
        description_fr="Rattachement administratif d'une daïra à sa wilaya de tutelle.",
    ),
    "SITUEE_DANS_COMMUNE": RelationTypeDefinition(
        name="SITUEE_DANS_COMMUNE",
        label_fr="Située dans la Commune",
        label_en="Located in Municipality",
        label_ar="تقع في البلدية",
        allowed_sources=["unite"],
        allowed_targets=["commune"],
        cardinality="N:1",
        description_fr="Implantation territoriale du siège de l'unité d'enquête.",
    ),
    "TRAITEE_PAR_UNITE": RelationTypeDefinition(
        name="TRAITEE_PAR_UNITE",
        label_fr="Traitée par l'Unité",
        label_en="Handled by Unit",
        label_ar="معالجة من طرف الوحدة",
        allowed_sources=["affaire"],
        allowed_targets=["unite"],
        cardinality="N:1",
        description_fr="Délégation d'enquête confiée à la brigade spécialisée.",
    ),
    "INSTRUITE_PAR_MAGISTRAT": RelationTypeDefinition(
        name="INSTRUITE_PAR_MAGISTRAT",
        label_fr="Instruite par le Magistrat",
        label_en="Investigated by Magistrate",
        label_ar="تحت إشراف قاضي التحقيق",
        allowed_sources=["affaire"],
        allowed_targets=["magistrat"],
        cardinality="N:1",
        description_fr="Supervision judiciaire du dossier par le magistrat instructeur.",
    ),
    "IMPLIQUE_SUSPECT": RelationTypeDefinition(
        name="IMPLIQUE_SUSPECT",
        label_fr="Implique le Suspect",
        label_en="Involves Suspect",
        label_ar="يشمل المشتبه فيه",
        allowed_sources=["affaire"],
        allowed_targets=["personne"],
        cardinality="1:N",
        description_fr="Mise en cause formelle d'une personne dans la procédure.",
    ),
    # 7-11: Relations Inter-Personnes & Entités
    "COMMUNIQUE_AVEC": RelationTypeDefinition(
        name="COMMUNIQUE_AVEC",
        label_fr="Communique avec",
        label_en="Communicates with",
        label_ar="يتواصل مع",
        allowed_sources=["personne"],
        allowed_targets=["personne"],
        cardinality="N:M",
        description_fr="Échange direct verbal ou textuel établi entre deux individus.",
    ),
    "COMPLICE_DE": RelationTypeDefinition(
        name="COMPLICE_DE",
        label_fr="Complice présumé de",
        label_en="Accomplice of",
        label_ar="شريك في الجريمة مع",
        allowed_sources=["personne"],
        allowed_targets=["personne"],
        cardinality="N:M",
        description_fr="Lien de complicité ou concertation criminelle caractérisé.",
    ),
    "DIRIGE_ENTREPRISE": RelationTypeDefinition(
        name="DIRIGE_ENTREPRISE",
        label_fr="Dirige l'Entreprise",
        label_en="Directs Company",
        label_ar="يدير الشركة",
        allowed_sources=["personne"],
        allowed_targets=["entreprise"],
        cardinality="N:M",
        description_fr="Gérance de droit ou contrôle de fait d'une personne morale.",
    ),
    "PROPRIETAIRE_VEHICULE": RelationTypeDefinition(
        name="PROPRIETAIRE_VEHICULE",
        label_fr="Propriétaire du Véhicule",
        label_en="Owns Vehicle",
        label_ar="مالك المركبة",
        allowed_sources=["personne"],
        allowed_targets=["vehicule"],
        cardinality="1:N",
        description_fr="Titularité de la carte grise ou possession usuelle d'une voiture.",
    ),
    "UTILISE_TELEPHONE": RelationTypeDefinition(
        name="UTILISE_TELEPHONE",
        label_fr="Utilise le Téléphone",
        label_en="Uses Phone Line",
        label_ar="يستخدم خط الهاتف",
        allowed_sources=["personne"],
        allowed_targets=["telephone"],
        cardinality="N:M",
        description_fr="Usage effectif ou souscription d'une ligne d'appel.",
    ),
    # 12-17: Télécoms & BTS
    "INSERE_DANS_SIM": RelationTypeDefinition(
        name="INSERE_DANS_SIM",
        label_fr="Inséré dans la SIM",
        label_en="Inserted in SIM",
        label_ar="مدرج في شريحة SIM",
        allowed_sources=["telephone"],
        allowed_targets=["carte_sim"],
        cardinality="1:1",
        description_fr="Attribution de la ligne MSISDN à une puce physique SIM.",
    ),
    "LOGEE_DANS_TERMINAL": RelationTypeDefinition(
        name="LOGEE_DANS_TERMINAL",
        label_fr="Logée dans le Terminal",
        label_en="Housed in Device",
        label_ar="موجودة داخل الجهاز المحمول",
        allowed_sources=["carte_sim"],
        allowed_targets=["appareil_mobile"],
        cardinality="N:1",
        description_fr="Insertion physique de la carte SIM dans un appareil mobile (IMEI).",
    ),
    "BORNE_SUR_ANTENNE": RelationTypeDefinition(
        name="BORNE_SUR_ANTENNE",
        label_fr="Borne sur l'Antenne",
        label_en="Connected to BTS Cell",
        label_ar="متصل ببرج الاتصالات",
        allowed_sources=["telephone"],
        allowed_targets=["antenne_bts"],
        cardinality="N:M",
        description_fr="Accrochage radio d'une ligne téléphonique à une station relais.",
    ),
    "TRACE_LIGNE_APPELANTE": RelationTypeDefinition(
        name="TRACE_LIGNE_APPELANTE",
        label_fr="Trace la Ligne Appelante",
        label_en="Traces Calling Line",
        label_ar="يتتبع الخط المتصل",
        allowed_sources=["telecom_cdr"],
        allowed_targets=["telephone"],
        cardinality="N:1",
        description_fr="Numéro source à l'origine de l'appel ou du message.",
    ),
    "TRACE_LIGNE_APPELEE": RelationTypeDefinition(
        name="TRACE_LIGNE_APPELEE",
        label_fr="Trace la Ligne Appelée",
        label_en="Traces Called Line",
        label_ar="يتتبع الخط المستقبل",
        allowed_sources=["telecom_cdr"],
        allowed_targets=["telephone"],
        cardinality="N:1",
        description_fr="Numéro destinataire récepteur de la communication.",
    ),
    "RELAIS_PAR_ANTENNE": RelationTypeDefinition(
        name="RELAIS_PAR_ANTENNE",
        label_fr="Relayé par l'Antenne",
        label_en="Relayed by BTS Cell",
        label_ar="تم تحويله عبر البرج",
        allowed_sources=["telecom_cdr"],
        allowed_targets=["antenne_bts"],
        cardinality="N:1",
        description_fr="Antenne BTS ayant relayé l'événement de communication.",
    ),
    # 18-23: Finances & BaridiMob & Crypto
    "DETIENT_COMPTE_BANCAIRE": RelationTypeDefinition(
        name="DETIENT_COMPTE_BANCAIRE",
        label_fr="Détient le Compte Bancaire",
        label_en="Holds Bank Account",
        label_ar="يمتلك الحساب البنكي / البريدي",
        allowed_sources=["personne"],
        allowed_targets=["compte_bancaire"],
        cardinality="1:N",
        description_fr="Titularité légale ou prête-nom d'un compte financier.",
    ),
    "EFFECTUE_VIREMENT_VERS": RelationTypeDefinition(
        name="EFFECTUE_VIREMENT_VERS",
        label_fr="Effectue Virement vers",
        label_en="Transfers Money to",
        label_ar="يقوم بتحويل مالي إلى",
        allowed_sources=["compte_bancaire"],
        allowed_targets=["compte_bancaire"],
        cardinality="N:M",
        description_fr="Virement direct de compte à compte (BaridiMob ou bancaire).",
    ),
    "RETRAIT_ESPECES_GAB": RelationTypeDefinition(
        name="RETRAIT_ESPECES_GAB",
        label_fr="Retrait Espèces au GAB",
        label_en="Cash Withdrawal at ATM",
        label_ar="سحب نقدي من الصراف الآلي",
        allowed_sources=["compte_bancaire"],
        allowed_targets=["guichet_gab"],
        cardinality="N:M",
        description_fr="Retrait physique de billets de banque par carte de paiement.",
    ),
    "RECOIT_OTP_BARIDIMOB": RelationTypeDefinition(
        name="RECOIT_OTP_BARIDIMOB",
        label_fr="Reçoit le Code OTP BaridiMob",
        label_en="Receives BaridiMob OTP",
        label_ar="يستقبل رمز التحقق BaridiMob",
        allowed_sources=["telephone"],
        allowed_targets=["compte_bancaire"],
        cardinality="N:1",
        description_fr="Réception par SMS du code à usage unique de validation financière.",
    ),
    "CONVERTIT_EN_CRYPTO": RelationTypeDefinition(
        name="CONVERTIT_EN_CRYPTO",
        label_fr="Convertit en Crypto-Monnaies",
        label_en="Converts to Crypto",
        label_ar="يحول إلى عملات مشفرة",
        allowed_sources=["compte_bancaire"],
        allowed_targets=["crypto_wallet"],
        cardinality="N:M",
        description_fr="Achat de crypto-actifs (P2P USDT) depuis un compte en dinars.",
    ),
    "TRANSFERT_CRYPTO_VERS": RelationTypeDefinition(
        name="TRANSFERT_CRYPTO_VERS",
        label_fr="Transfert Crypto vers",
        label_en="Transfers Crypto to",
        label_ar="تحويل كريبتو إلى",
        allowed_sources=["crypto_wallet"],
        allowed_targets=["crypto_wallet"],
        cardinality="N:M",
        description_fr="Transaction sur réseau blockchain vers une autre adresse de wallet.",
    ),
    # 24-29: SOCMINT & Annonces Scam
    "POSSEDE_PROFIL_SOCIAL": RelationTypeDefinition(
        name="POSSEDE_PROFIL_SOCIAL",
        label_fr="Possède le Profil Social",
        label_en="Owns Social Profile",
        label_ar="يمتلك الحساب على التواصل",
        allowed_sources=["personne"],
        allowed_targets=["compte_social"],
        cardinality="1:N",
        description_fr="Gestion ou création d'une page ou compte social par un suspect.",
    ),
    "PUBLIE_ANNONCE_SCAM": RelationTypeDefinition(
        name="PUBLIE_ANNONCE_SCAM",
        label_fr="Publie l'Annonce Scam",
        label_en="Publishes Scam Ad",
        label_ar="ينشر الإعلان الاحتيالي",
        allowed_sources=["compte_social"],
        allowed_targets=["publication_sociale"],
        cardinality="1:N",
        description_fr="Diffusion publique d'une fausse offre promotionnelle frauduleuse.",
    ),
    "ADMINISTRE_CANAL": RelationTypeDefinition(
        name="ADMINISTRE_CANAL",
        label_fr="Administre le Canal Telegram",
        label_en="Administers Telegram Channel",
        label_ar="يدير قناة التيليغرام",
        allowed_sources=["compte_social"],
        allowed_targets=["canal_telegram"],
        cardinality="N:M",
        description_fr="Droits de modération ou propriété d'un canal de diffusion.",
    ),
    "HEBERGE_MESSAGES": RelationTypeDefinition(
        name="HEBERGE_MESSAGES",
        label_fr="Héberge les Messages",
        label_en="Hosts Messages",
        label_ar="يحتوي على الرسائل",
        allowed_sources=["canal_telegram"],
        allowed_targets=["message_chat"],
        cardinality="1:N",
        description_fr="Fils de discussion contenus dans le canal ou groupe.",
    ),
    "RETOURN_VERS_SITE_WEB": RelationTypeDefinition(
        name="RETOURN_VERS_SITE_WEB",
        label_fr="Redirige vers le Site Web",
        label_en="Redirects to Website",
        label_ar="يعيد التوجيه إلى الموقع",
        allowed_sources=["publication_sociale"],
        allowed_targets=["site_web"],
        cardinality="N:1",
        description_fr="Lien URL hypertexte incitant la victime à visiter la fausse boutique.",
    ),
    "MENTIONNE_TELEPHONE": RelationTypeDefinition(
        name="MENTIONNE_TELEPHONE",
        label_fr="Mentionne le Téléphone",
        label_en="Mentions Phone Number",
        label_ar="يذكر رقم الهاتف",
        allowed_sources=["publication_sociale"],
        allowed_targets=["telephone"],
        cardinality="N:M",
        description_fr="Numéro d'appel commercial affiché dans le corps de l'annonce.",
    ),
    # 30-36: Cyber, Infrastructure C2 & DFIR
    "EMBARQUE_PIXEL_TRACKER": RelationTypeDefinition(
        name="EMBARQUE_PIXEL_TRACKER",
        label_fr="Embarque le Tracker Pixel",
        label_en="Embeds Tracking Pixel",
        label_ar="يتضمن معرف التتبع",
        allowed_sources=["site_web"],
        allowed_targets=["identifiant_infrastructure"],
        cardinality="N:M",
        description_fr="Code JavaScript tiers inséré pour monitorer l'audience du scam.",
    ),
    "RESOLU_VERS_IP_C2": RelationTypeDefinition(
        name="RESOLU_VERS_IP_C2",
        label_fr="Résolu vers l'IP / C2",
        label_en="Resolved to IP / C2 Server",
        label_ar="يرتبط بعنوان IP الخادم",
        allowed_sources=["site_web"],
        allowed_targets=["serveur_c2"],
        cardinality="N:1",
        description_fr="Résolution DNS faisant pointer le domaine vers le serveur d'attaque.",
    ),
    "UTILISE_CERTIFICAT_TLS": RelationTypeDefinition(
        name="UTILISE_CERTIFICAT_TLS",
        label_fr="Utilise le Certificat TLS",
        label_en="Uses TLS Certificate",
        label_ar="يستخدم شهادة الأمان TLS",
        allowed_sources=["site_web"],
        allowed_targets=["certificat_tls"],
        cardinality="N:1",
        description_fr="Certificat HTTPS liant cryptographiquement l'hôte du site web.",
    ),
    "DISTRIBUE_APPLICATION_APK": RelationTypeDefinition(
        name="DISTRIBUE_APPLICATION_APK",
        label_fr="Distribue l'Application APK",
        label_en="Distributes APK App",
        label_ar="يوزع التطبيق الخبيث APK",
        allowed_sources=["site_web"],
        allowed_targets=["fichier_apk"],
        cardinality="1:N",
        description_fr="Téléchargement forcé ou proposé d'une application frauduleuse.",
    ),
    "COMMUNIQUE_AVEC_C2": RelationTypeDefinition(
        name="COMMUNIQUE_AVEC_C2",
        label_fr="Communique avec le Serveur C2",
        label_en="Communicates with C2 Server",
        label_ar="يتصل بخادم القيادة C2",
        allowed_sources=["fichier_apk"],
        allowed_targets=["serveur_c2"],
        cardinality="N:1",
        description_fr="Exfiltration de SMS ou commandes à distance émises par le malware.",
    ),
    "CIBLE_COMPTE_BARIDIMOB": RelationTypeDefinition(
        name="CIBLE_COMPTE_BARIDIMOB",
        label_fr="Cible le Compte BaridiMob",
        label_en="Targets BaridiMob Account",
        label_ar="يستهدف حساب بريدي موب",
        allowed_sources=["fichier_apk"],
        allowed_targets=["compte_bancaire"],
        cardinality="N:M",
        description_fr="Tentatives d'usurpation des identifiants et détournement de fonds.",
    ),
    "A_PRODUIT_ARTEFACT_DFIR": RelationTypeDefinition(
        name="A_PRODUIT_ARTEFACT_DFIR",
        label_fr="A produit l'Artefact DFIR",
        label_en="Produced DFIR Artifact",
        label_ar="أنتج أثراً رقمياً جنائياً",
        allowed_sources=["appareil_mobile"],
        allowed_targets=["artefact_dfir"],
        cardinality="1:N",
        description_fr="Données forensiques extraites de la mémoire physique du téléphone.",
    ),
    # 37-41: Biométrie & Preuves Multimodales
    "CONTIENT_ENREGISTREMENT_VOCAL": RelationTypeDefinition(
        name="CONTIENT_ENREGISTREMENT_VOCAL",
        label_fr="Contient l'Enregistrement Vocal",
        label_en="Contains Voice Recording",
        label_ar="يحتوي على تسجيل صوتي",
        allowed_sources=["message_chat"],
        allowed_targets=["enregistrement_vocal"],
        cardinality="1:1",
        description_fr="Note vocale jointe à la conversation instantanée.",
    ),
    "ATTRIBUE_A_LOCUTEUR": RelationTypeDefinition(
        name="ATTRIBUE_A_LOCUTEUR",
        label_fr="Attribué au Locuteur / Suspect",
        label_en="Attributed to Speaker",
        label_ar="منسوب إلى المتحدث المشتبه فيه",
        allowed_sources=["enregistrement_vocal"],
        allowed_targets=["personne"],
        cardinality="N:1",
        description_fr="Correspondance biométrique vocale identifiant le suspect auteur.",
    ),
    "CONTIENT_EMPREINTE_FACIALE": RelationTypeDefinition(
        name="CONTIENT_EMPREINTE_FACIALE",
        label_fr="Contient l'Empreinte Faciale",
        label_en="Contains Facial Embedding",
        label_ar="يتضمن بصمة وجه",
        allowed_sources=["image_preuve"],
        allowed_targets=["empreinte_faciale"],
        cardinality="1:N",
        description_fr="Détection et vectorisation d'un visage présent sur la photographie.",
    ),
    "CORRESPOND_A_SUSPECT": RelationTypeDefinition(
        name="CORRESPOND_A_SUSPECT",
        label_fr="Correspond au Suspect",
        label_en="Matches Suspect",
        label_ar="يطابق المشتبه فيه",
        allowed_sources=["empreinte_faciale"],
        allowed_targets=["personne"],
        cardinality="N:1",
        description_fr="Score de similarité cosinus positif reliant le visage à l'individu.",
    ),
    "MONTRE_VEHICULE_PLAQUE": RelationTypeDefinition(
        name="MONTRE_VEHICULE_PLAQUE",
        label_fr="Montre la Plaque du Véhicule",
        label_en="Shows Vehicle Plate",
        label_ar="يظهر لوحة ترقيم المركبة",
        allowed_sources=["image_preuve"],
        allowed_targets=["vehicule"],
        cardinality="N:1",
        description_fr="Cliché de vidéosurveillance ou photo saisie identifiant la voiture.",
    ),
    # 42-47: Procédure, Scellés WORM & Merkle
    "CONTIENT_PROCES_VERBAL": RelationTypeDefinition(
        name="CONTIENT_PROCES_VERBAL",
        label_fr="Contient le Procès-Verbal",
        label_en="Contains Police Report",
        label_ar="يتضمن المحضر القضائي",
        allowed_sources=["affaire"],
        allowed_targets=["document_judiciaire"],
        cardinality="1:N",
        description_fr="Dossier d'instruction intégrant le procès-verbal d'audition ou de saisie.",
    ),
    "PROTEGE_PAR_SCELLE": RelationTypeDefinition(
        name="PROTEGE_PAR_SCELLE",
        label_fr="Protégé par le Scellé Numérique",
        label_en="Protected by Sealed Evidence",
        label_ar="محمي بالحرز الرقمي المشفر",
        allowed_sources=["document_judiciaire"],
        allowed_targets=["scelle_numerique"],
        cardinality="1:1",
        description_fr="Garantie d'intégrité scellant l'acte de procédure officiel.",
    ),
    "VERROUILLE_PREUVE_BINAIRE": RelationTypeDefinition(
        name="VERROUILLE_PREUVE_BINAIRE",
        label_fr="Verrouille la Preuve Audio",
        label_en="Locks Audio Evidence",
        label_ar="يقفل الحرز الصوتي",
        allowed_sources=["scelle_numerique"],
        allowed_targets=["enregistrement_vocal"],
        cardinality="1:1",
        description_fr="Empreinte cryptographique scellant le fichier vocal brut.",
    ),
    "VERROUILLE_PREUVE_IMAGE": RelationTypeDefinition(
        name="VERROUILLE_PREUVE_IMAGE",
        label_fr="Verrouille la Preuve Image",
        label_en="Locks Image Evidence",
        label_ar="يقفل الحرز المصور",
        allowed_sources=["scelle_numerique"],
        allowed_targets=["image_preuve"],
        cardinality="1:1",
        description_fr="Empreinte cryptographique scellant le cliché photographique saisi.",
    ),
    "VERROUILLE_PREUVE_APK": RelationTypeDefinition(
        name="VERROUILLE_PREUVE_APK",
        label_fr="Verrouille le Fichier APK",
        label_en="Locks APK Binary Evidence",
        label_ar="يقفل حرز حزمة APK",
        allowed_sources=["scelle_numerique"],
        allowed_targets=["fichier_apk"],
        cardinality="1:1",
        description_fr="Empreinte cryptographique scellant le paquet malware saisi.",
    ),
    "CERTIFIEE_PAR_MERKLE": RelationTypeDefinition(
        name="CERTIFIEE_PAR_MERKLE",
        label_fr="Certifiée par la Preuve Merkle",
        label_en="Certified by Merkle Proof",
        label_ar="معتمدة بدليل ميركل المشفر",
        allowed_sources=["affaire"],
        allowed_targets=["preuve_merkle"],
        cardinality="1:1",
        description_fr="Ancrage de l'ensemble du dossier dans l'arbre d'audit infalsifiable.",
    ),
}


# ==============================================================================
# 4. REGISTRY HELPER FUNCTIONS & EXPORT
# ==============================================================================


def get_node_type(key: str) -> NodeTypeDefinition:
    """Retrieve node type definition by unique key. Raises KeyError if unknown."""
    if key not in NODE_TYPES:
        raise KeyError(f"Unknown node type: '{key}'. Must be one of: {sorted(NODE_TYPES.keys())}")
    return NODE_TYPES[key]


def get_relation_type(name: str) -> RelationTypeDefinition:
    """Retrieve relation type definition by uppercase name. Raises KeyError if unknown."""
    if name not in RELATION_TYPES:
        raise KeyError(
            f"Unknown relation type: '{name}'. Must be one of: {sorted(RELATION_TYPES.keys())}"
        )
    return RELATION_TYPES[name]


def validate_relation(
    source_type: str,
    relation_name: str,
    target_type: str,
) -> tuple[bool, str]:
    """Validate whether an edge between source and target is permitted by ontology."""
    if source_type not in NODE_TYPES:
        return False, f"Invalid source node type: '{source_type}'"
    if target_type not in NODE_TYPES:
        return False, f"Invalid target node type: '{target_type}'"
    if relation_name not in RELATION_TYPES:
        return False, f"Invalid relation type: '{relation_name}'"

    rel = RELATION_TYPES[relation_name]
    if source_type not in rel.allowed_sources:
        return (
            False,
            f"Source type '{source_type}' not permitted for relation '{relation_name}' "
            f"(allowed: {rel.allowed_sources})",
        )
    if target_type not in rel.allowed_targets:
        return (
            False,
            f"Target type '{target_type}' not permitted for relation '{relation_name}' "
            f"(allowed: {rel.allowed_targets})",
        )

    return True, "Valid"


def export_registry_dict() -> dict[str, Any]:
    """Export complete registry structure as a JSON-serializable dictionary."""
    return {
        "metadata": {
            "app_name": "Athar",
            "version": "0.1.0",
            "total_layers": len(LAYERS),
            "total_node_types": len(NODE_TYPES),
            "total_relation_types": len(RELATION_TYPES),
            "gps_enabled_count": sum(1 for n in NODE_TYPES.values() if n.has_gps),
            "layer_counts": {
                layer.value: sum(1 for n in NODE_TYPES.values() if n.layer == layer)
                for layer in LayerId
            },
        },
        "layers": {k.value: asdict(v) for k, v in LAYERS.items()},
        "node_types": {k: asdict(v) for k, v in NODE_TYPES.items()},
        "relation_types": {k: asdict(v) for k, v in RELATION_TYPES.items()},
    }


def export_registry_json(target_path: Path | None = None) -> str:
    """Serialize registry to JSON string and optionally save to disk."""
    data = export_registry_dict()
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    if target_path:
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(payload, encoding="utf-8")
    return payload
