# Audit of Open-Source GitHub Repositories for Criminal & OSINT Investigations

This document audits **48 open-source GitHub repositories** across starter platforms, OSINT orchestrators, graph visualizers, and specialized forensic tools, detailing how they can be forked, combined, or wrapped as containerized **Bricks** inside **AegisInvestigate**.

---

## 1. Executive Recommendation: The 5 Starter Repositories to Combine

Rather than building every component from scratch, **AegisInvestigate** combines the strongest architectural patterns from five proven open-source projects:

1. **[`jerlendds/osintbuddy`](https://github.com/jerlendds/osintbuddy)** — *Visual Node-Transform & Plugin Pattern*
   - **Why it matters**: Open-source Maltego alternative built with React + Python FastAPI. Uses clean Python decorators to define entity types and context-menu transforms.
   - **What we adopt**: The entity transform UX and lightweight Python plugin ergonomics.
   - **What we upgrade**: Add Photoshop-style **Layers** (`Verified` vs. `Raw OSINT` vs. `Infra` vs. `Hypothesis`), Neo4j persistence, and multi-hop automated Playbooks.

2. **[`intelowlproject/IntelOwl`](https://github.com/intelowlproject/IntelOwl)** — *Containerized Analyzer & Playbook Runner*
   - **Why it matters**: Orchestrates 200+ heterogeneous analyzers via Python, Celery, and Docker containers with unified API key and job management.
   - **What we adopt**: The containerized worker execution model (`Brick` containers) and analyzer manifest structure.

3. **[`blacklanternsecurity/bbot`](https://github.com/blacklanternsecurity/bbot)** — *Deterministic Event-Driven OSINT Chaining*
   - **Why it matters**: Modern async Python successor to SpiderFoot where each module declares `watched_events` (e.g., `URL`, `PHONE`, `EMAIL`, `IP_ADDRESS`) and `produced_events`, enabling automatic multi-hop discovery without requiring an LLM.
   - **What we adopt**: The exact pub/sub `watched_events -> produced_events` capability graph for our **Non-LLM Deterministic Engine**.

4. **[`OpenCTI-Platform/opencti`](https://github.com/OpenCTI-Platform/opencti) & [`yeti-platform/yeti`](https://github.com/yeti-platform/yeti)** — *Graph Provenance & STIX 2.1 Modeling*
   - **Why it matters**: Mature graph relationship schemas with confidence scores, temporal validity (`first_seen`, `last_seen`), and source citations.
   - **What we adopt**: Provenance metadata on every Neo4j node and edge.

5. **[`google/timesketch`](https://github.com/google/timesketch) & [`alephdata/followthemoney`](https://github.com/alephdata/followthemoney)** — *Forensic Timelines & Anti-Corruption/Crime Ontology*
   - **Why it matters**: `Timesketch` is the gold standard for collaborative forensic timeline analysis; `FollowTheMoney` (by OCCRP) provides rich entity schemas for people, companies, bank accounts, vehicles, and court records.
   - **What we adopt**: Merge `FollowTheMoney` schemas with our SOCMINT/Web ontology and synchronize a `Timesketch`-style timeline beneath the graph canvas.

---

## 2. Master Audit Table of 48 GitHub Repositories

### Category A: Full OSINT & Investigation Platforms (Starters)
| # | Repository | Stack | Core Strengths | Role in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 1 | [`jerlendds/osintbuddy`](https://github.com/jerlendds/osintbuddy) | Python, FastAPI, React | Visual graph link analysis & Python transform plugins | UI & plugin decorator reference |
| 2 | [`intelowlproject/IntelOwl`](https://github.com/intelowlproject/IntelOwl) | Python, Django, Celery, Docker | 200+ containerized analyzers & playbook orchestration | Plane 4 Brick Worker execution blueprint |
| 3 | [`blacklanternsecurity/bbot`](https://github.com/blacklanternsecurity/bbot) | Python (Asyncio) | Recursive event-driven `watched -> produced` OSINT pipeline | Non-LLM Deterministic Chaining Engine model |
| 4 | [`smicallef/spiderfoot`](https://github.com/smicallef/spiderfoot) | Python | 200+ OSINT modules with automatic target profiling | Source of passive recon module logic |
| 5 | [`OpenCTI-Platform/opencti`](https://github.com/OpenCTI-Platform/opencti) | Node.js, GraphQL, Python | STIX 2.1 knowledge graph, confidence scoring, connectors | Provenance & confidence schema reference |
| 6 | [`yeti-platform/yeti`](https://github.com/yeti-platform/yeti) | Python, FastAPI, ArangoDB, Vue | Clean FastAPI + Graph observable enrichment & analytics | FastAPI + Graph REST API pattern |
| 7 | [`TheHive-Project/TheHive`](https://github.com/TheHive-Project/TheHive) | Scala, Python (Cortex) | Collaborative case management, tasks, and Cortex responders | Case management & task workflow model |
| 8 | [`alephdata/aleph`](https://github.com/alephdata/aleph) | Python, Postgres, React | Investigative journalism document/entity cross-referencing | Document ingestion & cross-case search model |
| 9 | [`google/timesketch`](https://github.com/google/timesketch) | Python, OpenSearch, Vue | Collaborative forensic timeline correlation | Synchronized Chronological Timeline design |
| 10 | [`be0vlk/owlculus`](https://github.com/be0vlk/owlculus) | Python, FastAPI, React | OSINT case tracking + browser extension evidence capture | Investigator Web Clipper browser extension |

### Category B: Phone Number, Email & Identity Pivot Tools (Bricks)
| # | Repository | Stack | Input $\rightarrow$ Output | Brick ID in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 11 | [`sundowndev/phoneinfoga`](https://github.com/sundowndev/phoneinfoga) | Go | `PhoneNumber` $\rightarrow$ `Carrier`, `Region`, `SearchFootprints` | `brick.identity.phoneinfoga` |
| 12 | [`megadose/ignorant`](https://github.com/megadose/ignorant) | Python | `PhoneNumber` $\rightarrow$ `SocialAccount (IG, Snapchat, Amazon)` | `brick.identity.ignorant` |
| 13 | [`megadose/holehe`](https://github.com/megadose/holehe) | Python | `Email` $\rightarrow$ `SocialAccount (120+ sites)`, `MaskedPhone` | `brick.identity.holehe` |
| 14 | [`soxoj/maigret`](https://github.com/soxoj/maigret) | Python | `Username` $\rightarrow$ `SocialAccount (2500+ sites)`, `LinkedIDs` | `brick.identity.maigret` |
| 15 | [`sherlock-project/sherlock`](https://github.com/sherlock-project/sherlock) | Python | `Username` $\rightarrow$ `SocialAccount (400+ sites)` | `brick.identity.sherlock` |
| 16 | [`p1ngul1n0/blackbird`](https://github.com/p1ngul1n0/blackbird) | Python | `Username/Email` $\rightarrow$ `SocialAccount (600+ sites)` | `brick.identity.blackbird` |
| 17 | [`mxrch/GHunt`](https://github.com/mxrch/GHunt) | Python | `Email (Gmail)` $\rightarrow$ `GaiaID`, `MapsReviews`, `Photos` | `brick.identity.ghunt_google` |
| 18 | [`khast3x/h8mail`](https://github.com/khast3x/h8mail) | Python | `Email/Phone/Username` $\rightarrow$ `BreachRecord`, `IPAddress` | `brick.identity.h8mail_breach` |

### Category C: Social Media (SOCMINT) & Forensic Archiving (Bricks)
| # | Repository | Stack | Input $\rightarrow$ Output | Brick ID in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 19 | [`ArchiveBox/ArchiveBox`](https://github.com/ArchiveBox/ArchiveBox) | Python, Playwright | `URL/SocialPost` $\rightarrow$ `WARCArchive`, `DOMSnapshot`, `PNG` | `brick.socmint.post_archiver` |
| 20 | [`LonamiWebs/Telethon`](https://github.com/LonamiWebs/Telethon) | Python | `PhoneNumber/Username` $\rightarrow$ `TelegramID`, `Avatar`, `Messages` | `brick.socmint.telegram_lookup` |
| 21 | [`instaloader/instaloader`](https://github.com/instaloader/instaloader) | Python | `InstagramAccount` $\rightarrow$ `Posts`, `Geotags`, `Comments` | `brick.socmint.instagram_osint` |
| 22 | [`Datalux/Osintgram`](https://github.com/Datalux/Osintgram) | Python | `InstagramAccount` $\rightarrow$ `TaggedUsers`, `Locations` | `brick.socmint.instagram_osint` |
| 23 | [`megadose/toutatis`](https://github.com/megadose/toutatis) | Python | `InstagramAccount` $\rightarrow$ `NumericID`, `ObfuscatedPhone/Email` | `brick.socmint.toutatis_ig` |
| 24 | [`Greenwolf/social_mapper`](https://github.com/Greenwolf/social_mapper) | Python, Selenium | `PersonName + FaceImage` $\rightarrow$ `MatchedOSNProfiles` | `brick.socmint.cross_platform_face_pivot` |
| 25 | [`yt-dlp/yt-dlp`](https://github.com/yt-dlp/yt-dlp) | Python | `SocialPost/VideoURL` $\rightarrow$ `VideoArtifact`, `MetadataJSON` | `brick.socmint.video_archiver` |

### Category D: Web, Links, Database/Tracker IDs & Infrastructure (Bricks)
| # | Repository | Stack | Input $\rightarrow$ Output | Brick ID in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 26 | [`projectdiscovery/httpx`](https://github.com/projectdiscovery/httpx) | Go | `URL/Domain` $\rightarrow$ `TechStack`, `FaviconHash`, `JARM`, `TLSCert` | `brick.web.httpx_fingerprint` |
| 27 | [`projectdiscovery/katana`](https://github.com/projectdiscovery/katana) | Go | `URL` $\rightarrow$ `JSBundles`, `APIEndpoints`, `DatabaseIDs` | `brick.web.katana_js_secrets` |
| 28 | [`projectdiscovery/subfinder`](https://github.com/projectdiscovery/subfinder) | Go | `Domain` $\rightarrow$ `Subdomains`, `IPAddress` | `brick.web.subfinder_amass` |
| 29 | [`owasp-amass/amass`](https://github.com/owasp-amass/amass) | Go | `Domain/ASN` $\rightarrow$ `Subdomains`, `ASNGraph`, `Whois` | `brick.web.subfinder_amass` |
| 30 | [`projectdiscovery/nuclei`](https://github.com/projectdiscovery/nuclei) | Go | `URL` $\rightarrow$ `ExposedEnv/Git/DBMisconfigurations` | `brick.web.exposure_scanner` |
| 31 | [`trufflesecurity/trufflehog`](https://github.com/trufflesecurity/trufflehog) | Go | `URL/JSBundle` $\rightarrow$ `LeakedAPIKeys`, `TelegramBotTokens` | `brick.web.secret_extractor` |
| 32 | [`laramies/theHarvester`](https://github.com/laramies/theHarvester) | Python | `Domain` $\rightarrow$ `Email`, `PersonName`, `HostIP` | `brick.web.theharvester` |
| 33 | [`sensepost/gowitness`](https://github.com/sensepost/gowitness) | Go | `URL` $\rightarrow$ `ScreenshotPNG`, `NetworkHeaders` | `brick.web.gowitness_capture` |

### Category E: Digital Media Forensics, Biometrics & GEOINT (Bricks)
| # | Repository | Stack | Input $\rightarrow$ Output | Brick ID in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 34 | [`GuidoBartoli/sherloq`](https://github.com/GuidoBartoli/sherloq) | Python, OpenCV | `Image` $\rightarrow$ `ELAHeatmap`, `CloneTamperMask`, `Noiseprint` | `brick.media.sherloq_forensics` |
| 35 | [`exiftool/exiftool`](https://github.com/exiftool/exiftool) | Perl | `Image/Video/PDF` $\rightarrow$ `GPS`, `CameraSerial`, `EditHistory` | `brick.media.exiftool_deep` |
| 36 | [`serengil/deepface`](https://github.com/serengil/deepface) | Python, PyTorch | `Image (Face)` $\rightarrow$ `512dArcFaceVector`, `MatchedAvatars` | `brick.media.deepface_biometrics` |
| 37 | [`VicenteVivan/geo-clip`](https://github.com/VicenteVivan/geo-clip) | Python, PyTorch | `Image (Outdoor)` $\rightarrow$ `GPSProbabilityHeatmap` | `brick.media.geoclip_locator` |
| 38 | [`bellingcat/ShadowFinder`](https://github.com/bellingcat/ShadowFinder) | Python | `Image + ShadowAngle` $\rightarrow$ `Chronolocation & Lat/Lon Band` | `brick.media.shadow_suncalc` |
| 39 | [`exadel-inc/CompreFace`](https://github.com/exadel-inc/CompreFace) | Docker, Java/Python | `Image (Face)` $\rightarrow$ `RestAPIFaceClusterMatch` | `brick.media.compreface_service` |
| 40 | [`SYSTRAN/faster-whisper`](https://github.com/SYSTRAN/faster-whisper) | Python, CTranslate2 | `Audio/Video` $\rightarrow$ `MultilingualTranscript`, `Timestamps` | `brick.media.audio_whisper_diarize` |

### Category F: Financial, Corporate, Sanctions & Crypto (Bricks)
| # | Repository | Stack | Input $\rightarrow$ Output | Brick ID in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 41 | [`graphsense/graphsense-dashboard`](https://github.com/graphsense/graphsense-dashboard) | Python, TypeScript | `CryptoWallet/Tx` $\rightarrow$ `CoSpendCluster`, `ExchangeAttribution` | `brick.finance.graphsense_crypto` |
| 42 | [`opensanctions/yente`](https://github.com/opensanctions/yente) | Python, FastAPI | `Person/Company/Wallet` $\rightarrow$ `Interpol/Sanctions/PEPMatch` | `brick.finance.opensanctions_pep` |
| 43 | [`alephdata/followthemoney`](https://github.com/alephdata/followthemoney) | Python | Financial & corporate entity ontology | Core backend entity schema |
| 44 | [`mdomke/schwifty`](https://github.com/mdomke/schwifty) | Python | `IBAN/RIB/BIC` $\rightarrow$ `BankName`, `BranchCode`, `Country` | `brick.finance.iban_ccp_analyzer` |

### Category G: Traditional DFIR & Graph Rendering Engines
| # | Repository | Stack | Core Capability | Role in AegisInvestigate |
| :- | :--- | :--- | :--- | :--- |
| 45 | [`cytoscape/cytoscape.js`](https://github.com/cytoscape/cytoscape.js) | TypeScript | Interactive compound graph canvas & pathfinding | Primary interactive Knowledge Graph canvas |
| 46 | [`jacomyal/sigma.js`](https://github.com/jacomyal/sigma.js) | TypeScript, WebGL | 60 FPS WebGL rendering for 50,000+ node graphs | High-density CDR & crypto graph renderer |
| 47 | [`sleuthkit/autopsy`](https://github.com/sleuthkit/autopsy) | Java, Python | Disk, smartphone, SQLite & deleted file forensics | DFIR artifact import connector |
| 48 | [`Velocidex/velociraptor`](https://github.com/Velocidex/velociraptor) | Go, VQL | Endpoint forensic artifact collection via VQL | Live endpoint triage importer |
