# Athar DZ (أثر) — Plateforme Forensique d'Investigation Criminelle & OSINT
> **"Photoshop for Criminal & OSINT Investigations" — Conçu pour les enquêteurs de terrain, magistrats et analystes (Zéro Jargon Informatique).**

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Status: Specification & Interactive Simulation](https://img.shields.io/badge/Status-Complete_Spec_%26_Live_Simulator-emerald.svg)]()
[![Interface: French / Arabic / English](https://img.shields.io/badge/Languages-FR_%7C_AR_%7C_EN-blue.svg)]()
[![Tools: 76 Modules](https://img.shields.io/badge/Tools_Inventory-76_Modules-purple.svg)]()

---

## 🌟 Présentation Générale

**Athar DZ (أثر)** est un cadre applicatif unifié d'investigation criminelle numérique et d'OSINT conçu pour assister les officiers de police judiciaire (OPJ), détectives et magistrats instructeurs dans la résolution d'infractions complexes (escroqueries en ligne, trafics, blanchiment, cybercriminalité).

À la manière d'un logiciel de retouche d'image (comme Photoshop) qui gère des **calques non destructifs**, **Athar DZ** organise l'ensemble des éléments d'une enquête sous forme de **calques de travail synchronisés** sur un plateau visuel :
1. **Calque 1 — Preuves Vérifiées (Scellés Judiciaires)** : Éléments confirmés, horodatés et scellés avec valeur probante légale (SHA-256 + RFC 3161 TSA).
2. **Calque 2 — Découvertes OSINT Brutes** : Résultats extraits automatiquement des recherches en ligne en attente de validation par l'enquêteur.
3. **Calque 3 — Infrastructure & Télécoms** : Connexions réseau (adresses IP, Cell-ID d'antennes 4G, trackers web publicitaires, serveurs).
4. **Calque 4 — Hypothèses Criminelles & Rapprochements** : Pistes de suspects, modélisations de réseaux et déductions générées par les règles expertes ou l'IA d'assistance.

---

## 🚀 Portails & Simulateurs Interactifs (Dossier `doc/`)

La spécification complète est accompagnée d'une suite de démonstrateurs HTML interactifs immédiatement exécutables dans tout navigateur :

| Portail / Simulateur | Description & Contenu | Fichier Local |
| :--- | :--- | :--- |
| **🖥️ Maquette Applicative Haute Densité** | Simulation interactive complète du poste d'enquêteur (style Palantir / Maltego) en français et arabe avec boîte de nouveaux indices à droite, inspecteur judiciaire, comparateur split-screen et export de procès-verbal. | [`doc/maquette.html`](doc/maquette.html) |
| **🏠 Portail Exécutif & Synthèse** | Vue d'ensemble stratégique avec tableau de bord interactif de l'affaire de référence (*"Escroquerie aux Pneus Michelin sur Facebook"*), KPIs du préjudice et fiche suspect. | [`doc/index.html`](doc/index.html) |
| **🏗️ Schéma d'Architecture Logicielle 6 Couches** | Diagramme interactif de génie logiciel avec inspecteur en direct des microservices, protocoles (gRPC, WSS, SQL, Gremlin, S3), latences SLA et résilience. | [`doc/architecture.html`](doc/architecture.html) |
| **🧰 Catalogue & Menu des 76 Outils** | Inventaire complet de 76 outils d'investigation et OSINT classés par catégorie et par prérequis (58 directs & gratuits, 11 clés API, 6 comptes dédiés, 1 payant). | [`doc/bricks-and-automation.html`](doc/bricks-and-automation.html) |
| **🕸️ Ontologie du Graphe & Spécification UI** | Modèle de données formel (nœuds, arêtes, provenance légale) et conception ergonomique du studio de travail. | [`doc/data-model.html`](doc/data-model.html) |
| **🚀 6 Phases de Développement Incrémentales** | Feuille de route technique où **chaque phase fournit une application exécutable et utilisable sur le terrain**. | [`doc/roadmap-phases.html`](doc/roadmap-phases.html) |
| **📦 Audit de 48 Dépôts GitHub** | Benchmark comparatif des frameworks et bibliothèques open source intégrables (OSINTBuddy, PhoneInfoga, Maigret, ArchiveBox, InsightFace...). | [`doc/github-repos-audit.html`](doc/github-repos-audit.html) |
| **📋 Inventaire Maître des Outils & Modèles** | Inventaire complet des outils OSINT, SNA, Forensique, conteneurs Docker et modèles IA calibrés pour serveur 1 GPU + 32 Go RAM (Win/Linux CPU/GPU). | [`TOOLS_INVENTORY.md`](TOOLS_INVENTORY.md) |

---

## ⚖️ Les 5 Innovations Ergonomiques Judiciaires

Afin d'éviter tout vocabulaire technique rébarbatif aux enquêteurs de terrain :

1. **Bandeau Supérieur des KPIs d'Enquête** : Répond d'un coup d'œil aux questions clés du magistrat : **Préjudice Total (1 450 000 DZD)**, **Nombre de Plaintes Liées (6)**, **Wilayas Impactées (Alger, Oran, Blida)** et **Taux de Preuve Scellée (94%)**.
2. **Bouton 1-Clic `[👤 Fiche Suspect]`** : Ouvre instantanément le dossier judiciaire synthétique du suspect principal (Amine B.) avec photo rapprochée par biométrie faciale (89%), compte BaridiMob/CCP, téléphone pivot Ooredoo et réquisitions pré-remplies.
3. **Curseur de Clarté Judiciaire** : Bascule active entre le **Mode OPJ (Simple)** (langage policier clair, 3 gros boutons d'action suggérés) et le **Mode Cyber (Expert)** (détails cryptographiques SHA-256, requêtes de graphe Gremlin et JSON brut).
4. **Comparateur d'Indices Split-Screen** : Confrontation visuelle côte-à-côte de l'annonce originale et de la preuve découverte (ex: reçu de virement postal BaridiMob et note vocale WhatsApp) pour certifier la concordance avant versement au dossier.
5. **Mode Récit Chronologique d'Audience (Storyboard)** : Convertit la toile complexe de relations en un rapport narratif séquentiel en 5 actes prêt à être déposé devant le procureur de la République.

---

## 🎙️ Spécificités Locales : Traitement Vocal Darija & BaridiMob

- **Transcription de la Darija Algérienne Hors-Ligne** : Module basé sur *Faster-Whisper fine-tuné* pour transcrire les vocaux WhatsApp échangés en arabe dialectal sans aucune fuite vers le cloud.
- **Diarisation des Locuteurs (PyAnnote)** : Séparation acoustique entre la voix de la victime et celle de l'escroc avec extraction automatique des montants (ex: *50 000 DZD d'acompte*) et lieux de rendez-vous (*Kouba, Alger*).
- **Rapprochement BaridiMob / Algérie Poste** : Croisement automatisé des RIP et numéros CCP avec le registre judiciaire des plaintes antérieures.
- **Analyse des Réseaux Sociaux (SNA)** : Algorithmes de graphe (PageRank, centralité d'intermédiarité, détection de communautés Louvain) pour identifier les têtes de réseau et intermédiaires financiers (mules bancaires).

---

## 📂 Structure du Répertoire

```text
Athar_DZ/
├── AGENTS.md                       # Gouvernance unifiée des agents IA
├── DECISIONS.md                    # Journal des décisions architecturales (D1 à D20 approuvées)
├── README.md                       # Présentation du projet, architecture et guide d'accès
├── docker-compose.yml              # Orchestration multi-tiers (Backend, Frontend, Neo4j, PG16/PostGIS, Redis)
├── .agent/                         # Règles d'ingénierie, sécurité ISO 27037, UI/UX et validation (D19/D20)
│   ├── README.md                   # Hub d'orchestration des règles agents
│   ├── investigation-validation-rules.md # Règles d'extraction, validation isolée & liaisons (D19/D20)
│   ├── ui-ux-rules.md              # Design tokens, WCAG 2.2 AA, KPIs réels (§16) & isolation modale (§17)
│   ├── security-rules.md           # Conformité ISO 27037, WORM & requêtes paramétrées
│   └── ...                         # Spécifications Phase 1, globale & anti-hallucination
├── apps/studio-app/                # Application opérationnelle (FastAPI + React 19 / TypeScript)
│   ├── backend/                    # API REST `/api/v1`, registre (37 nœuds / 50 relations), 16 SNA, extraction PDF/HTML/NER GPU
│   └── frontend/                   # Canevas circulaire, onglets Actor Sphere, inspecteur dual-mode, ModalPortal `inert`
├── shared/generated/registry.json  # Export canonique unique (SSOT) partagé backend → frontend
└── doc/                            # Suite documentaire, spécifications & maquettes interactives
    ├── index.html                  # Synthèse exécutive & tableau de bord
    ├── maquette.html               # Maquette applicative forensique complète
    ├── architecture.html           # Architecture système visuelle en 6 couches
    ├── interfaces-roles.html       # Postes de travail, RBAC & spécification ergonomie Studio
    ├── bricks-and-automation.html  # Catalogue interactif des 76 outils
    ├── data-model.html             # Ontologie du graphe de connaissances (37 nœuds, 50 relations)
    ├── roadmap-phases.html         # 6 phases de développement incrémentales (Phase 1 + 2A livrées)
    ├── github-repos-audit.html     # Audit de 48 dépôts open source
    ├── tools-cache-inventory.html  # Répertoire des outils & modèles hors-ligne (.athar-tools/)
    ├── SPECIFICATION.md            # Spécification technique et fonctionnelle détaillée
    ├── EXTRACTION_LOGIC.md         # Logique détaillée d'extraction PDF/HTML, CAMeL & WikiNEuRal NER GPU
    ├── GITHUB_AUDIT.md             # Benchmark textuel des dépôts open source
    └── assets/                     # Contrôleurs JS, styles CSS et moteurs visuels
        ├── app.js                  # Contrôleur interactif du portail
        ├── maquette-i18n.js        # Moteur de simulation bilingue (FR/AR) de la maquette
        ├── architecture-interactive.js # Inspecteur de microservices en direct
        ├── tools-catalog.js        # Base de données des 76 outils d'investigation
        └── style.css               # Feuille de styles forensiques sombre (Palantir/Maltego)
```

---

## 🚀 Athar v0.1 — Studio Applicatif Forensique (Phase 1)

L'application **Athar Studio App (v0.1)** est entièrement opérationnelle en architecture microservices conteneurisée :

### 🏗️ Architecture Technique (2 Tiers / 5 Services Docker)

- **Frontend** : React 19, TypeScript 5.6, Vite 5.4, Lucide Icons, pure store React 19 (`useSyncExternalStore`), Zero Emojis, Design Tokens stricts (`tokens.css`, Dark default / Light accessible).
- **Backend** : Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0 (async), Neo4j Async Driver, Pure Python SNA Engine.
- **Base Graphe** : Neo4j 5.20 Community (`bolt://localhost:7687`, HTTP `7474`).
- **Base Relationnelle & Spatiale** : TimescaleDB HA PostgreSQL 16 + PostGIS 3.4 (`timescale/timescaledb-ha:pg16`, port `5432`).
- **Cache & Message Broker** : Redis 7.2 Alpine (`port 6379`).

---

### 📦 Démarrage Rapide

```bash
# 1. Copier les variables d'environnement
cp .env.example .env

# 2. Lancer la pile complète
docker compose up -d --build

# 3. Vérifier la santé des services
curl http://127.0.0.1:8000/health
# {"status":"ok","app_name":"Athar","services":{"neo4j":{"status":"ok"},"postgres":{"status":"ok"},"redis":{"status":"ok"}}}
```

L'application est accessible sur :
- **Studio Web** : [http://localhost:5173](http://localhost:5173)
- **API REST & Swagger Docs** : [http://localhost:8000/docs](http://localhost:8000/docs)
- **Interface Neo4j Browser** : [http://localhost:7474](http://localhost:7474)

---

### 🧪 Suites de Tests & Assurance Qualité

```bash
# Tests Backend (60 tests unitaires : API, registre, SNA, extraction PDF/HTML, NER GPU CAMeL/WikiNEuRal, audit SHA-256)
docker exec athar-backend pytest -v

# Linter & Analyse Statique Backend
docker exec -u root athar-backend ruff check app tests
docker exec -u root athar-backend mypy app

# Tests Frontend (99 tests unitaires sur 14 suites : store, layouts, onglets, métriques dynamiques, ingestion, traductions, validation, export)
docker exec athar-frontend npm test -- --run

# Typecheck & Linter Frontend
docker exec athar-frontend npm run typecheck
docker exec athar-frontend npm run lint

# Compilation de Production Frontend
docker exec athar-frontend npm run build
```

---

### 🛡️ Matrice des Jalons Livrés (Phase 1 — App v0.1)

| Jalon | Intitulé | Statut | Vérification |
| :--- | :--- | :---: | :--- |
| **1A** | Foundation (Docker, Health, Shells, `tokens.css`) | **LIVRÉ** | 2/2 tests health passing, multi-tier compose opérationnel |
| **Opt A**| Migration PostgreSQL vers TimescaleDB HA PG16 | **LIVRÉ** | `timescale/timescaledb-ha:pg16` actif et persistant |
| **1B** | Data (Ontologie 37 types, 50 relations, Seed 100 nœuds) | **LIVRÉ** | 10/10 tests registre/schéma passing, cas *Candy Wheels* idempotent |
| **1C** | Graph API (CRUD, Expand 1/2 hops, Filtre Impact, Audit) | **LIVRÉ** | 7/7 tests API graph passing, registre Merkle SHA-256 vérifié |
| **1D** | Canvas (GraphCanvasAdapter, Nœuds circulaires, 5 calques, Inspecteur) | **LIVRÉ** | Interface adaptateur stricte, store réversible Undo/Redo |
| **1E** | SNA (16 algorithmes de graphe, Allowlist, Panneau SNA) | **LIVRÉ** | 13/13 tests SNA passing, exécution pure Python rapide (`< 100 ms`) |
| **1F** | Views (Carte SIG 8 types GPS, Chronologie, Registre, Export PDF/JSON) | **LIVRÉ** | Multi-vues interactives, export conforme ISO 27037 |
| **1G** | Hardening (Audit sécurité, isolation modale `inert`, KPI dynamiques, ergonomie D19) | **LIVRÉ** | 159/159 tests cumulés passing (`60` backend + `99` frontend), 0 erreurs `ruff`/`mypy`/`tsc`/`eslint` |
| **2A** | Extraction PDF/HTML & Validation Isolée (PyMuPDF + CAMeL + WikiNEuRal + BS4) | **LIVRÉ** | Staging PostgreSQL, `CandidateValidationPanel` filtré par catégorie, 3 relations (`EXTRAIT_DE`, `UTILISE_EMAIL`, `IMPLIQUE_TRANSACTION`), CRUD arêtes `PATCH`/`DELETE`, D16–D20 |

### 🔍 Synthèse des Évolutions Récentes (Phase 1 Clôturée & Phase 2A — Décisions D16–D20)

- **Extraction PDF/HTML Hors-Ligne & NER Bilingue GPU ([`doc/EXTRACTION_LOGIC.md`](doc/EXTRACTION_LOGIC.md))** :
  - Extraction statique PDF (Modes 1 & 2 en 3 étapes via `PyMuPDF` + `pdfplumber`) et HTML 100 % hors-ligne (`BeautifulSoup4` + `lxml`, zéro requête réseau, aperçu `<iframe sandbox="">`).
  - Double moteur NER GPU local (`CAMeL-Lab` arabe + `Babelscape/wikineural-multilingual-ner` français/anglais/latin), enrichissement territorial `wilaya`/`commune` en attributs sans nœuds isolés (D18) et unification RIP BaridiMob / CCP.
- **Validation Isolée, Confiance & Liens Forensiques (Décisions D19 & D20)** :
  - Les candidats en attente et leurs prévisualisations ne s'affichent **que dans les onglets isolés (`actor_sphere`)** de la pièce déposée (jamais dans `Dossier Général`), avec filtrage par catégorie d'entité (`Acteurs`, `Télécoms`, `Finances`, etc.) et gestion CRUD des relations sémantiques.
  - Tout nouveau nœud ou entité validée conserve ses coordonnées exactes avant/après validation et réagit directement à la simulation physique; la confiance affichée par défaut est **100 %** tant que l'enquêteur ne l'a pas modifiée (`entityConfidence.ts`).
  - Seules les entités extraites et les relations sémantiques inter-entités exigent une validation humaine : `EXTRAIT_DE` vers la pièce source glissée et les liaisons créées manuellement sont directement créées à **100 % (`VERIFIED`)**; tout passage à `100 %` sélectionne `VERIFIED` automatiquement et les changements de calque sont directs sans modale bloquante tout en écrivant dans le journal d'audit ISO 27037.
- **KPI Réels du Dossier, Cascade Géographique & Isolation Modale (`.agent/ui-ux-rules.md` §§16–17)** :
  - Suppression de toute métrique fictive figée : la **Synthèse de l'Affaire** et la **Boîte d'Arbitrage des Indices** calculent en direct (`computeCaseOverviewMetrics`) le préjudice estimé (DZD), victimes/plaintes, suspects, wilayas, objets analysés / à investiguer / à valider.
  - Sélecteur administratif responsive `Wilaya → Daïra → Commune` (`.geo-cascade-grid`).
  - Isolation modale complète via `ModalPortal` + attribut `inert` sur `.studio-shell`, verrouillage de focus (`Tab`), garde `hasOpenModal()` sur les raccourcis clavier/molette du canevas, et confirmation par touche `Entrée` sur la modale de suppression (`DeleteNodesModal`).

---

## 📜 Licence

Ce projet est publié sous licence **Apache-2.0**.
Conçu pour la recherche académique, la formation et la modernisation des capacités d'enquête numérique.
