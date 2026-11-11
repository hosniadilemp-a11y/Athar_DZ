// Athar DZ Mock Case Data — 100 Forensic Nodes
window.CASE_CANDY_WHEELS = {
  "case_id": "ATHAR-2026-SCAM-089",
  "case_code": "CANDY-WHEELS-DZ",
  "case_name": "Opération CANDY WHEELS — Réseau Multi-Scam Cybercriminalité",
  "case_profile": "Cyber-Escroquerie Commerciale en Bande Organisée & Blanchiment Crypto",
  "jurisdiction": "Pôle Pénal Spécialisé TIC • Alger / Oran / Blida",
  "status": "CHARGES_FILED_WARRANTS_ISSUED",
  "opened_at": "2026-11-10T10:15:00Z",
  "sealed_ledger_hash": "c4f8209e86a117d3b5b9e02c9147d3328e340a1b89efbc99304a298f24419aa7",
  "kpis": {
    "loss_initial_dzd": 232000,
    "loss_total_dzd": 33500000,
    "loss_usdt_estimate": 140000,
    "victims_count_direct": 3,
    "victims_count_total_c2": 285,
    "wilayas_impacted": [
      "Alger",
      "Oran",
      "Blida",
      "Constantine",
      "Sétif",
      "Annaba"
    ],
    "sealed_evidence_count": 12,
    "evidence_integrity_rate": "100% RFC 3161 Certified"
  },
  "victims": [
    {
      "id": "vic_01",
      "name": "Karim Zerrouki",
      "age": 38,
      "profession": "Chauffeur VTC / Taxi",
      "phone": "+213 661 44 12 89",
      "operator": "Mobilis",
      "wilaya": "Alger (Bab Ezzouar)",
      "loss_dzd": 64000,
      "product": "4 Pneus Michelin Primacy 4 205/55 R16",
      "payment_method": "BaridiMob",
      "rip_recipient": "00799999002148593214",
      "txn_id": "TXN-20261108-994102",
      "complaint_date": "2026-11-10T10:15:00Z",
      "evidence_provided": [
        "Screenshot conversation WhatsApp",
        "Note vocale Darija promettant livraison Yalidine",
        "Reçu officiel BaridiMob débité"
      ]
    },
    {
      "id": "vic_02",
      "name": "Meriem Benali",
      "age": 29,
      "profession": "Enseignante de lycée",
      "phone": "+213 770 82 91 30",
      "operator": "Djezzy",
      "wilaya": "Oran (Bir El Djir)",
      "loss_dzd": 48000,
      "product": "Acompte 50% sur 4 Pneus Michelin Energy Saver",
      "payment_method": "BaridiMob",
      "rip_recipient": "00799999002148593214",
      "txn_id": "TXN-20261108-994145",
      "complaint_date": "2026-11-10T11:30:00Z",
      "evidence_provided": [
        "Faux bon de commande PDF 'SARL Ouest Pneumatiques'",
        "Captures d'écran profil Facebook 'Pneus Promo Algérie'",
        "Reçu BaridiMob de 48 000 DZD"
      ]
    },
    {
      "id": "vic_03",
      "name": "Djamel Eddine Mansouri",
      "age": 52,
      "profession": "Gérant de flotte de camionnettes",
      "phone": "+213 550 19 63 74",
      "operator": "Ooredoo",
      "wilaya": "Blida (Ouled Yaïch)",
      "loss_dzd": 120000,
      "product": "8 Pneus utilitaires Michelin Agilis",
      "payment_method": "Application Android AutoPneusDZ (2 débits de 60k)",
      "rip_recipient": "00799999002148593214 & 00799999008812450192",
      "txn_id": "TXN-20261109-110294 / 110295",
      "complaint_date": "2026-11-10T14:00:00Z",
      "evidence_provided": [
        "Fichier APK AutoPneusDZ téléchargé",
        "Double notification de débit BaridiMob",
        "Historique SMS de contact avec lien de tracking"
      ]
    }
  ],
  "starting_evidence": {
    "facebook_pages": [
      {
        "name": "Pneus Promo Algérie",
        "url": "fb.com/pneus.promo.dz",
        "created": "2026-10-12",
        "likes": 2400
      },
      {
        "name": "Pneus Express Discount DZ",
        "url": "fb.com/michelin.express.livraison",
        "created": "2026-10-24"
      },
      {
        "name": "Auto Déstockage Pneumatiques",
        "url": "fb.com/auto.destockage.blida",
        "created": "2026-11-02"
      }
    ],
    "facebook_posts": [
      {
        "id": "post_98124",
        "text": "Vente Flash 4 Pneus Michelin -60% Déstockage Douane",
        "reach": 18400
      },
      {
        "id": "post_98177",
        "text": "Liquidation Stock Tourisme et Utilitaire - Livraison 58 Wilayas"
      },
      {
        "id": "post_98205",
        "text": "Offre Spéciale Flottes et Artisans - Acompte requis"
      }
    ],
    "scammer_phone": {
      "number": "+213 555 019 283",
      "operator": "Ooredoo DZ",
      "whatsapp_name": "Service Commercial Pneus DZ",
      "cell_tower": "Es Senia (Oran)"
    },
    "scam_links": [
      "https://promo-pneus-express.shop/order",
      "https://destockage-auto-dz.online/",
      "https://cdn.dz-services-cloud.com/apps/AutoPneusDZ.apk"
    ]
  },
  "osint_discoveries": {
    "developer_leak": {
      "origin": "promo-pneus-express.shop/.git/config",
      "git_author": "Sofiane K. <sofiane.devbox99@gmail.com>",
      "github_profile": "github.com/soficoder-alger",
      "apk_keystore_fingerprint": "CN=Sofiane K., OU=DevAlger, O=FreelanceDZ",
      "shared_meta_pixel": "88419203314"
    },
    "discord_hub": {
      "server_name": "DZ-Dev & Ops Hub",
      "guild_id": "119830129480192840",
      "discovery_vector": "Leaked Discord webhook in GitHub commit 7a8f1b2c",
      "members": [
        {
          "handle": "ElHadj_99#0001",
          "role": "Owner / Le Boss (Tarek H.)"
        },
        {
          "handle": "SofianeDev#4401",
          "role": "Developer (Sofiane K.)"
        },
        {
          "handle": "Jo_Blida#1982",
          "role": "Lieutenant Pneus (Youcef R.)"
        },
        {
          "handle": "Dina_Consult#3310",
          "role": "Lieutenante Visas (Nadia M.)"
        },
        {
          "handle": "Kika_Annaba#7721",
          "role": "Lieutenant Électro (Farid T.)"
        }
      ]
    },
    "telegram_network": {
      "channels": [
        {
          "name": "Comité Direction C2 (VIP)",
          "invite": "t.me/+Hd99_Management_C2",
          "members": [
            "El-Hadj (Boss)",
            "Sofiane (Dev)",
            "Youcef (LT)",
            "Nadia (LT)",
            "Farid (LT)"
          ],
          "purpose": "Consolidation financière & blanchiment USDT"
        },
        {
          "name": "Pneus DZ — Équipe Vente",
          "invite": "t.me/+Ab91k_PneuOps",
          "leader": "Youcef R. (@jo_pneus)",
          "operators": [
            "Amine B. (@amine_import)",
            "Bilel S.",
            "Hamza K."
          ],
          "purpose": "Gestion des faux bons de commande et blocage des victimes"
        },
        {
          "name": "Visa Schengen Express — Traitement",
          "invite": "t.me/+Vz82k_VisaOps",
          "leader": "Nadia M. (@dina_visas)",
          "operators": [
            "Fares K.",
            "Sarah T.",
            "2 automated bot leads"
          ],
          "purpose": "Fausses réservations TLSContact et faux contrats de travail"
        },
        {
          "name": "Électro & Gold Liquidation",
          "invite": "t.me/+Lx44k_ElectroOps",
          "leader": "Farid T. (@kika_electro)",
          "operators": [
            "Mourad Z.",
            "Lyès B.",
            "Riad M."
          ],
          "purpose": "Faux déstockages multimédia & TV"
        }
      ]
    }
  },
  "evidentiary_recordings_and_texts": [
    {
      "id": "EVID-A01",
      "type": "AUDIO_RECORDING",
      "label": "Vocal WhatsApp Amine B. à Karim Zerrouki",
      "file": "AUDIO_EVID_WA_20261108_AMINE_KARIM.ogg",
      "sha256": "a9f3b7c841e2d93e15f40192b0c39a8e23f18b27091283c01928419203910283",
      "speaker": "Amine B. (+213 555 019 283)",
      "acoustic_match_rate": 0.96,
      "language": "Darija algéroise",
      "transcript_original": "Khouya Karim, salam alaykoum. Les quatre pneus Michelin rahoum réservés b'smitek fel dépôt taâ Boufarik. Bessah la promo hadhi fiha demande kbira. Versi les 64 000 da f'had le compte BaridiMob li b'ath'toulak, w b'athli le reçu f'WhatsApp...",
      "judicial_translation": "Frère Karim, salam alaykoum. Les quatre pneus Michelin sont réservés à ton nom au dépôt de Boufarik. Mais cette promo a une forte demande. Verse les 64 000 DZD sur le compte BaridiMob communiqué et transmets le reçu sur WhatsApp..."
    },
    {
      "id": "EVID-T01",
      "type": "CHAT_LOG",
      "label": "Directive Telegram Youcef R. (Lieutenant Pneus)",
      "file": "TELEGRAM_LOG_PNEU_20261108.json",
      "sha256": "3c7b91f0e21a8d94c1b2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
      "channel": "t.me/+Ab91k_PneuOps",
      "timestamp": "2026-11-08T20:05:00Z",
      "speaker": "Youcef R. (@jo_pneus)",
      "transcript_original": "@amine_import @bilel Yaâtikoum essaheha el-youm. Amine, le client taxi taâ Bab Ezzouar li b'ath 64k w bent Oran li b'athet 48k, bloquihoum men WhatsApp direct. Ma t'jawbouhoumch fel téléphone...",
      "judicial_translation": "Bravo pour aujourd'hui. Amine, le chauffeur de taxi de Bab Ezzouar qui a versé 64k et la fille d'Oran qui a versé 48k, bloque-les directement sur WhatsApp. Ne leur réponds plus au téléphone..."
    },
    {
      "id": "EVID-A02",
      "type": "AUDIO_RECORDING",
      "label": "Vocal Telegram Le Boss 'El-Hadj' à Youcef R.",
      "file": "AUDIO_EVID_TG_BOSS_TO_YOUCEF.ogg",
      "sha256": "5d829fa18c0e2274b123985fe612ab7451908234109283419028341902834190",
      "speaker": "Tarek H. ('El-Hadj')",
      "channel": "t.me/+Hd99_Management_C2",
      "timestamp": "2026-11-09T23:30:00Z",
      "transcript_original": "Youcef, smaâni mlih. La cellule pneus rahi t'dirlna 600 000 da par jour had la semaine, c’est bien bessah les plaintes b'daw y'kethrou f'Facebook. Ghleq les trois pages ghedwa s'bah, w khéli Sofiane y'lansi les trois nouveaux sites...",
      "judicial_translation": "Youcef, écoute-moi bien. La cellule pneus nous fait 600 000 DZD par jour cette semaine, c'est bien mais les plaintes s'accumulent sur Facebook. Ferme les 3 pages demain matin et laisse Sofiane lancer les 3 nouveaux sites..."
    },
    {
      "id": "EVID-D01",
      "type": "CHAT_LOG",
      "label": "Logs Discord Développeur Sofiane K. <-> Boss ElHadj",
      "file": "DISCORD_SCRAPED_CHANNEL_DEV_C2.txt",
      "sha256": "1f8e2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
      "channel": "DZ-Dev & Ops Hub (#commandes-scripts)",
      "transcript_original": "[SofianeDev] @ElHadj_99 C'est bon, script PHP mis à jour... [ElHadj_99] Parfait. Et le clone TLSContact pour la cellule de Nadia ? [SofianeDev] Build terminé : https://cdn.dz-services-cloud.com/apps/VisaExpressDZ.apk...",
      "judicial_translation": "Échange technique certifiant la livraison continue d'applications de phishing par Sofiane K. pour le compte du syndicat criminel."
    },
    {
      "id": "EVID-A03",
      "type": "AUDIO_RECORDING",
      "label": "Vocal Telegram Lieutenante Nadia (Cellule Visas)",
      "file": "AUDIO_EVID_TG_NADIA_REPORT.ogg",
      "sha256": "98e4c194b15672d1f90081c7e92384a801928341902834190283419028341902",
      "speaker": "Nadia M. (@dina_visas)",
      "channel": "t.me/+Hd99_Management_C2",
      "timestamp": "2026-11-10T11:15:00Z",
      "transcript_original": "Boss, el-hamdullah le nouveau script taâ Sofiane pour les rendez-vous TLS rah yemchi 10/10. Les opérateurs diali f'Constantine jawbou plus de 80 clients had sbeh. Derna 2,4 millions de dinars d'acomptes...",
      "judicial_translation": "Boss, le nouveau script de Sofiane pour les rendez-vous TLS fonctionne à 100%. Mes opérateurs à Constantine ont traité plus de 80 dossiers ce matin. Nous avons cumulé 2,4 millions de dinars d'acomptes..."
    }
  ],
  "syndicate_hierarchy": {
    "boss": {
      "name": "Tarek H.",
      "alias": "El-Hadj / Scorpion",
      "age": 44,
      "residence": "Hydra (Alger) / Alicante (Espagne)",
      "role": "Commanditaire en Chef, Recruteur des Lieutenants, Blanchisseur USDT",
      "crypto_wallet_trc20": "TJv89XbM42wLkK3e9Q7pNrTzC1mKq92",
      "binance_account": "Binance P2P Merchant #DZ-VIP-99"
    },
    "developer": {
      "name": "Sofiane K.",
      "alias": "Sofi-Dev",
      "age": 28,
      "residence": "Bab Ezzouar (Alger)",
      "role": "Architecte Technique (APKs Android, Sites clones, Scripts C2, Bots)",
      "github": "@soficoder-alger",
      "email": "sofiane.devbox99@gmail.com",
      "commission": "15% sur chaque encaissement"
    },
    "cashier_mules": {
      "name": "Kamel V.",
      "alias": "Le Caissier",
      "age": 36,
      "role": "Recruteur de mules BaridiMob et gestionnaire des retraits physiques aux GAB",
      "cards_seized": 18
    },
    "lieutenants": [
      {
        "name": "Youcef R.",
        "alias": "Jo_Blida",
        "cell": "Cellule Pneus & Pièces Auto",
        "wilaya": "Blida",
        "operators": [
          "Amine B. (+213 555 019 283)",
          "Bilel S.",
          "Hamza K."
        ],
        "turnover_dzd": 4500000
      },
      {
        "name": "Nadia M.",
        "alias": "Dina_Consult",
        "cell": "Cellule Visas Schengen & Contrats Espagne",
        "wilaya": "Constantine",
        "operators": [
          "Fares K.",
          "Sarah T.",
          "2 opérateurs supplémentaires"
        ],
        "turnover_dzd": 18000000
      },
      {
        "name": "Farid T.",
        "alias": "Kika_Annaba",
        "cell": "Cellule Électroménager & Or Déstockage",
        "wilaya": "Sétif / Annaba",
        "operators": [
          "Mourad Z.",
          "Lyès B.",
          "Riad M."
        ],
        "turnover_dzd": 11000000
      }
    ]
  },
  "graph_representation": {
    "total_nodes": 100,
    "total_edges": 129,
    "nodes": [
      {
        "id": "vic_01_karim",
        "label": "Karim Zerrouki (64k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 60,
        "icon": "👤",
        "subtitle": "Chauffeur Taxi • Bab Ezzouar",
        "meta": {
          "phone": "+213 661 44 12 89",
          "loss": 64000,
          "item": "4 Pneus Michelin",
          "wilaya": "Alger"
        }
      },
      {
        "id": "vic_02_meriem",
        "label": "Meriem Benali (48k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 150,
        "icon": "👤",
        "subtitle": "Enseignante • Bir El Djir",
        "meta": {
          "phone": "+213 770 82 91 30",
          "loss": 48000,
          "item": "4 Pneus Michelin Energy",
          "wilaya": "Oran"
        }
      },
      {
        "id": "vic_03_djamel",
        "label": "Djamel E. Mansouri (120k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 240,
        "icon": "👤",
        "subtitle": "Flotte Utilitaires • Ouled Yaïch",
        "meta": {
          "phone": "+213 550 19 63 74",
          "loss": 120000,
          "item": "8 Pneus Agilis",
          "wilaya": "Blida"
        }
      },
      {
        "id": "vic_04_salim",
        "label": "Salim Kheddam (150k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 330,
        "icon": "👤",
        "subtitle": "Commerçant • Constantine",
        "meta": {
          "phone": "+213 662 11 90 45",
          "loss": 150000,
          "item": "Faux Visa Espagne",
          "wilaya": "Constantine"
        }
      },
      {
        "id": "vic_05_amina",
        "label": "Amina Taleb (85k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 420,
        "icon": "👤",
        "subtitle": "Cadre Banque • Kouba",
        "meta": {
          "phone": "+213 774 29 80 11",
          "loss": 85000,
          "item": "RDV TLSContact France",
          "wilaya": "Alger"
        }
      },
      {
        "id": "vic_06_rachid",
        "label": "Rachid Bouzid (190k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 510,
        "icon": "👤",
        "subtitle": "Artisan • Sétif",
        "meta": {
          "phone": "+213 551 77 40 22",
          "loss": 190000,
          "item": "iPhone 16 Pro Max",
          "wilaya": "Sétif"
        }
      },
      {
        "id": "vic_07_tahar",
        "label": "Tahar Mebarki (220k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 600,
        "icon": "👤",
        "subtitle": "Entrepreneur • Annaba",
        "meta": {
          "phone": "+213 668 55 12 30",
          "loss": 220000,
          "item": "Pack TV 4K Déstockage",
          "wilaya": "Annaba"
        }
      },
      {
        "id": "vic_08_mourad",
        "label": "Mourad Belhadj (75k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 690,
        "icon": "👤",
        "subtitle": "Agriculteur • Sig",
        "meta": {
          "phone": "+213 770 14 55 90",
          "loss": 75000,
          "item": "Pneus Tracteur/Van",
          "wilaya": "Mascara/Oran"
        }
      },
      {
        "id": "vic_09_fatima",
        "label": "Fatima Z. Cherif (110k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 780,
        "icon": "👤",
        "subtitle": "Infirmière • Tlemcen",
        "meta": {
          "phone": "+213 558 90 23 44",
          "loss": 110000,
          "item": "Contrat Saisonnier",
          "wilaya": "Tlemcen"
        }
      },
      {
        "id": "vic_10_omar",
        "label": "Omar Latreche (95k DZD)",
        "type": "VICTIM",
        "layer": 1,
        "x": 60,
        "y": 870,
        "icon": "👤",
        "subtitle": "Retraité • Batna",
        "meta": {
          "phone": "+213 661 80 44 19",
          "loss": 95000,
          "item": "Lingotin Or Déstockage",
          "wilaya": "Batna"
        }
      },
      {
        "id": "proc_pv_alger",
        "label": "PV Plainte Alger #089-A",
        "type": "PROC_VERBAL",
        "layer": 1,
        "x": 60,
        "y": 960,
        "icon": "⚖️",
        "subtitle": "Saisine Parquet Alger TIC",
        "meta": {
          "date": "2026-11-10",
          "opj": "Insp. Benali"
        }
      },
      {
        "id": "proc_pv_oran",
        "label": "PV Plainte Oran #089-B",
        "type": "PROC_VERBAL",
        "layer": 1,
        "x": 60,
        "y": 1050,
        "icon": "⚖️",
        "subtitle": "Section Recherches Oran",
        "meta": {
          "date": "2026-11-10",
          "opj": "Capitaine Belkacem"
        }
      },
      {
        "id": "proc_pv_blida",
        "label": "PV Plainte Blida #089-C",
        "type": "PROC_VERBAL",
        "layer": 1,
        "x": 60,
        "y": 1140,
        "icon": "⚖️",
        "subtitle": "Brigade Cyb Blida",
        "meta": {
          "date": "2026-11-10",
          "opj": "Lt. Meziane"
        }
      },
      {
        "id": "proc_pv_const",
        "label": "PV Plainte Const #089-D",
        "type": "PROC_VERBAL",
        "layer": 1,
        "x": 60,
        "y": 1230,
        "icon": "⚖️",
        "subtitle": "Section Recherches Est",
        "meta": {
          "date": "2026-11-10",
          "opj": "Lt. Hamdi"
        }
      },
      {
        "id": "proc_pv_setif",
        "label": "PV Plainte Sétif #089-E",
        "type": "PROC_VERBAL",
        "layer": 1,
        "x": 60,
        "y": 1320,
        "icon": "⚖️",
        "subtitle": "Brigade Financière Sétif",
        "meta": {
          "date": "2026-11-10",
          "opj": "Insp. Saadi"
        }
      },
      {
        "id": "evid_audio_a01",
        "label": "Pièce A-01 (Vocal WhatsApp)",
        "type": "AUDIO_RECORDING",
        "layer": 1,
        "x": 360,
        "y": 60,
        "icon": "🎙️",
        "subtitle": "Amine -> Karim (96% voix)",
        "meta": {
          "sha256": "a9f3b7c841e2d93e15f40192b0c39a8e",
          "lang": "Darija",
          "sec": 42
        }
      },
      {
        "id": "evid_audio_a02",
        "label": "Pièce A-02 (Vocal Telegram)",
        "type": "AUDIO_RECORDING",
        "layer": 1,
        "x": 360,
        "y": 150,
        "icon": "🎙️",
        "subtitle": "Boss El-Hadj -> Youcef",
        "meta": {
          "sha256": "5d829fa18c0e2274b123985fe612ab74",
          "lang": "Darija",
          "sec": 58
        }
      },
      {
        "id": "evid_audio_a03",
        "label": "Pièce A-03 (Vocal Telegram)",
        "type": "AUDIO_RECORDING",
        "layer": 1,
        "x": 360,
        "y": 240,
        "icon": "🎙️",
        "subtitle": "Nadia -> Boss (Faux Visas)",
        "meta": {
          "sha256": "98e4c194b15672d1f90081c7e92384a8",
          "lang": "Darija",
          "sec": 35
        }
      },
      {
        "id": "evid_audio_a04",
        "label": "Pièce A-04 (Vocal Telegram)",
        "type": "AUDIO_RECORDING",
        "layer": 1,
        "x": 360,
        "y": 330,
        "icon": "🎙️",
        "subtitle": "Farid -> Boss (Électro)",
        "meta": {
          "sha256": "b1e9c8a74102938475618293a4b5c6d7",
          "lang": "Darija",
          "sec": 48
        }
      },
      {
        "id": "evid_text_t01",
        "label": "Pièce T-01 (Chat Telegram)",
        "type": "CHAT_LOG",
        "layer": 1,
        "x": 360,
        "y": 420,
        "icon": "💬",
        "subtitle": "Directive Youcef (Blocage)",
        "meta": {
          "sha256": "3c7b91f0e21a8d94c1b2e3f4a5b6c7d8",
          "channel": "t.me/+Ab91k_PneuOps"
        }
      },
      {
        "id": "evid_text_d01",
        "label": "Pièce D-01 (Log Discord)",
        "type": "CHAT_LOG",
        "layer": 1,
        "x": 360,
        "y": 510,
        "icon": "💬",
        "subtitle": "Commandes APK Sofiane/Boss",
        "meta": {
          "sha256": "1f8e2a3b4c5d6e7f8a9b0c1d2e3f4a5b",
          "channel": "DZ-Dev #commandes"
        }
      },
      {
        "id": "evid_apk_pneu",
        "label": "AutoPneusDZ.apk (Binaire)",
        "type": "MALWARE_APK",
        "layer": 1,
        "x": 360,
        "y": 600,
        "icon": "📦",
        "subtitle": "Package Trojan BaridiMob",
        "meta": {
          "sha256": "4a7c8e9b01d2e3f4a5b6c7d8e9f0a1b2",
          "pkg": "com.devstudio.dz.autopneus"
        }
      },
      {
        "id": "evid_apk_visa",
        "label": "VisaExpressDZ.apk (Binaire)",
        "type": "MALWARE_APK",
        "layer": 1,
        "x": 360,
        "y": 690,
        "icon": "📦",
        "subtitle": "Clone Phishing TLSContact",
        "meta": {
          "sha256": "7c8e9b01d2e3f4a5b6c7d8e9f0a1b2c3",
          "pkg": "com.devstudio.dz.visaexpress"
        }
      },
      {
        "id": "evid_bon_commande_pdf",
        "label": "Faux Bon Commande PDF",
        "type": "DOCUMENT",
        "layer": 1,
        "x": 360,
        "y": 780,
        "icon": "📄",
        "subtitle": "SARL Ouest Pneumatiques",
        "meta": {
          "sha256": "d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3",
          "source": "WhatsApp Meriem"
        }
      },
      {
        "id": "evid_baridimob_slip",
        "label": "Récépissé BaridiMob TXN",
        "type": "BANK_RECORD",
        "layer": 1,
        "x": 360,
        "y": 870,
        "icon": "🧾",
        "subtitle": "TXN-20261108-994102",
        "meta": {
          "amount": 64000,
          "rip": "00799999002148593214"
        }
      },
      {
        "id": "fb_page_pneus_promo",
        "label": "fb.com/pneus.promo.dz",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 60,
        "icon": "📢",
        "subtitle": "Pneus Promo DZ (2.4k j'aime)",
        "meta": {
          "admin": "Algérie",
          "created": "2026-10-12"
        }
      },
      {
        "id": "fb_page_michelin_exp",
        "label": "fb.com/michelin.express",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 150,
        "icon": "📢",
        "subtitle": "Pneus Express Livraison",
        "meta": {
          "created": "2026-10-24"
        }
      },
      {
        "id": "fb_page_destock_blida",
        "label": "fb.com/auto.destock.blida",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 240,
        "icon": "📢",
        "subtitle": "Auto Déstockage Pneumatiques",
        "meta": {
          "created": "2026-11-02"
        }
      },
      {
        "id": "fb_page_visas_express",
        "label": "fb.com/visa.schengen.exp",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 330,
        "icon": "📢",
        "subtitle": "Visa Schengen Express DZ",
        "meta": {
          "followers": 5800
        }
      },
      {
        "id": "fb_page_tls_appointments",
        "label": "fb.com/rdv.consulat.dz",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 420,
        "icon": "📢",
        "subtitle": "Créneaux TLS/VFS Garantis",
        "meta": {
          "followers": 3200
        }
      },
      {
        "id": "fb_page_destock_electro",
        "label": "fb.com/destock.electro.dz",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 510,
        "icon": "📢",
        "subtitle": "Déstockage Électroménager",
        "meta": {
          "followers": 4100
        }
      },
      {
        "id": "fb_page_gold_algerie",
        "label": "fb.com/or.douane.liquidation",
        "type": "FB_PAGE",
        "layer": 2,
        "x": 680,
        "y": 600,
        "icon": "📢",
        "subtitle": "Or & Bijoux Saisie Douane",
        "meta": {
          "followers": 1900
        }
      },
      {
        "id": "ig_auto_pieces_pro",
        "label": "@auto_pieces_pro (IG)",
        "type": "INSTAGRAM",
        "layer": 2,
        "x": 680,
        "y": 690,
        "icon": "📷",
        "subtitle": "Instagram relié à +213555...",
        "meta": {
          "posts": 34
        }
      },
      {
        "id": "ig_visa_dz_officiel",
        "label": "@visa_espagne_dz (IG)",
        "type": "INSTAGRAM",
        "layer": 2,
        "x": 680,
        "y": 780,
        "icon": "📷",
        "subtitle": "Instagram fausses offres visa",
        "meta": {
          "posts": 51
        }
      },
      {
        "id": "ouedkniss_amine_2025",
        "label": "Ouedkniss 'Amine Pièces'",
        "type": "CLASSIFIED_AD",
        "layer": 2,
        "x": 680,
        "y": 870,
        "icon": "🛒",
        "subtitle": "Compte vendeur Ouedkniss 2025",
        "meta": {
          "last_active": "2025-12"
        }
      },
      {
        "id": "fb_post_pneus_98124",
        "label": "Post FB #98124 (Michelin)",
        "type": "FB_POST",
        "layer": 2,
        "x": 680,
        "y": 960,
        "icon": "📰",
        "subtitle": "Michelin -60% Déstockage",
        "meta": {
          "reach": 18400,
          "date": "08 Nov"
        }
      },
      {
        "id": "fb_post_pneus_98177",
        "label": "Post FB #98177 (Saisie Douane)",
        "type": "FB_POST",
        "layer": 2,
        "x": 680,
        "y": 1050,
        "icon": "📰",
        "subtitle": "Liquidation Pneus Tourisme",
        "meta": {
          "reach": 9200
        }
      },
      {
        "id": "fb_post_visa_44102",
        "label": "Post FB #44102 (RDV TLS)",
        "type": "FB_POST",
        "layer": 2,
        "x": 680,
        "y": 1140,
        "icon": "📰",
        "subtitle": "Rendez-vous Espagne 48h",
        "meta": {
          "reach": 24000
        }
      },
      {
        "id": "fb_post_visa_44189",
        "label": "Post FB #44189 (Contrat Esp)",
        "type": "FB_POST",
        "layer": 2,
        "x": 680,
        "y": 1230,
        "icon": "📰",
        "subtitle": "Contrat Agricole Murcie",
        "meta": {
          "reach": 31000
        }
      },
      {
        "id": "fb_post_electro_7712",
        "label": "Post FB #7712 (iPhone 16)",
        "type": "FB_POST",
        "layer": 2,
        "x": 680,
        "y": 1320,
        "icon": "📰",
        "subtitle": "iPhone 16 Pro 115k DZD",
        "meta": {
          "reach": 15600
        }
      },
      {
        "id": "fb_post_tv_7745",
        "label": "Post FB #7745 (TV Samsung 4K)",
        "type": "FB_POST",
        "layer": 2,
        "x": 680,
        "y": 1410,
        "icon": "📰",
        "subtitle": "Pack Smart TV 65 pouces",
        "meta": {
          "reach": 12800
        }
      },
      {
        "id": "phone_front_amine",
        "label": "+213 555 019 283",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 60,
        "icon": "📱",
        "subtitle": "Ooredoo • Opérateur Amine",
        "meta": {
          "cell": "Es Senia (Oran)",
          "active": true
        }
      },
      {
        "id": "phone_front_bilel",
        "label": "+213 551 88 42 10",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 150,
        "icon": "📱",
        "subtitle": "Ooredoo • Opérateur Bilel",
        "meta": {
          "cell": "Blida Centre",
          "active": true
        }
      },
      {
        "id": "phone_front_fares",
        "label": "+213 772 10 33 99",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 240,
        "icon": "📱",
        "subtitle": "Djezzy • Opérateur Fares",
        "meta": {
          "cell": "Constantine",
          "active": true
        }
      },
      {
        "id": "phone_front_sarah",
        "label": "+213 779 55 12 04",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 330,
        "icon": "📱",
        "subtitle": "Djezzy • Opératrice Sarah",
        "meta": {
          "cell": "Bab Ezzouar",
          "active": true
        }
      },
      {
        "id": "phone_front_mourad",
        "label": "+213 663 90 14 77",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 420,
        "icon": "📱",
        "subtitle": "Mobilis • Opérateur Mourad",
        "meta": {
          "cell": "Sétif",
          "active": true
        }
      },
      {
        "id": "phone_lt_youcef",
        "label": "+213 550 44 91 22",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 510,
        "icon": "📱",
        "subtitle": "Ooredoo • Lt. Youcef R.",
        "meta": {
          "role": "Chef Cellule Pneus"
        }
      },
      {
        "id": "phone_lt_nadia",
        "label": "+213 771 88 50 16",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 600,
        "icon": "📱",
        "subtitle": "Djezzy • Lt. Nadia M.",
        "meta": {
          "role": "Chef Cellule Visas"
        }
      },
      {
        "id": "phone_lt_farid",
        "label": "+213 660 12 34 88",
        "type": "PHONE_NUMBER",
        "layer": 2,
        "x": 1000,
        "y": 690,
        "icon": "📱",
        "subtitle": "Mobilis • Lt. Farid T.",
        "meta": {
          "role": "Chef Cellule Électro"
        }
      },
      {
        "id": "discord_guild_c2",
        "label": "DZ-Dev & Ops Hub",
        "type": "DISCORD_SERVER",
        "layer": 2,
        "x": 1000,
        "y": 780,
        "icon": "💬",
        "subtitle": "Discord ID 119830129480192840",
        "meta": {
          "members": 6,
          "auth": "Webhook Leak"
        }
      },
      {
        "id": "discord_ch_commandes",
        "label": "Discord #commandes-scripts",
        "type": "DISCORD_CHANNEL",
        "layer": 2,
        "x": 1000,
        "y": 870,
        "icon": "💬",
        "subtitle": "Salon Livraison Clones APK",
        "meta": {
          "proof": "Pièce D-01"
        }
      },
      {
        "id": "tg_group_c2_vip",
        "label": "t.me/+Hd99_Management_C2",
        "type": "TELEGRAM_GROUP",
        "layer": 2,
        "x": 1000,
        "y": 960,
        "icon": "💬",
        "subtitle": "VIP Direction C2 (Le Boss)",
        "meta": {
          "members": 5,
          "proof": "Pièce A-02/A-03"
        }
      },
      {
        "id": "tg_group_pneus_ops",
        "label": "t.me/+Ab91k_PneuOps",
        "type": "TELEGRAM_GROUP",
        "layer": 2,
        "x": 1000,
        "y": 1050,
        "icon": "💬",
        "subtitle": "Pneus DZ Équipe Ventes",
        "meta": {
          "members": 6,
          "leader": "Youcef R."
        }
      },
      {
        "id": "tg_group_visas_ops",
        "label": "t.me/+Vz82k_VisaOps",
        "type": "TELEGRAM_GROUP",
        "layer": 2,
        "x": 1000,
        "y": 1140,
        "icon": "💬",
        "subtitle": "Visas Schengen Traitement",
        "meta": {
          "members": 7,
          "leader": "Nadia M."
        }
      },
      {
        "id": "tg_group_electro_ops",
        "label": "t.me/+Lx44k_ElectroOps",
        "type": "TELEGRAM_GROUP",
        "layer": 2,
        "x": 1000,
        "y": 1230,
        "icon": "💬",
        "subtitle": "Électro & Or Liquidation",
        "meta": {
          "members": 5,
          "leader": "Farid T."
        }
      },
      {
        "id": "domain_pneus_express",
        "label": "promo-pneus-express.shop",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 60,
        "icon": "🌐",
        "subtitle": "Boutique Phishing Pneus",
        "meta": {
          "ip": "185.199.108.153"
        }
      },
      {
        "id": "domain_destock_auto",
        "label": "destockage-auto-dz.online",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 150,
        "icon": "🌐",
        "subtitle": "Site Miroir Pneus",
        "meta": {
          "ip": "185.199.108.153"
        }
      },
      {
        "id": "domain_pneus_rapide",
        "label": "livraison-pneus-dz.com",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 240,
        "icon": "🌐",
        "subtitle": "Domaine de Réserve Pneus",
        "meta": {
          "created": "2026-11-01"
        }
      },
      {
        "id": "domain_visa_schengen",
        "label": "tls-appointment-booking-dz.com",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 330,
        "icon": "🌐",
        "subtitle": "Faux Portail TLSContact",
        "meta": {
          "ip": "194.26.29.84"
        }
      },
      {
        "id": "domain_visa_espana",
        "label": "contrat-travail-espagne.site",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 420,
        "icon": "🌐",
        "subtitle": "Faux Contrats Consulaires",
        "meta": {
          "ip": "194.26.29.84"
        }
      },
      {
        "id": "domain_destock_electro",
        "label": "flash-electro-algerie.shop",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 510,
        "icon": "🌐",
        "subtitle": "Fausse Boutique Électro",
        "meta": {
          "ip": "185.199.108.153"
        }
      },
      {
        "id": "domain_gold_express",
        "label": "or-douane-liquidation.online",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 600,
        "icon": "🌐",
        "subtitle": "Fausse Vente Or/Bijoux",
        "meta": {
          "ip": "185.199.108.153"
        }
      },
      {
        "id": "cdn_apps_server",
        "label": "cdn.dz-services-cloud.com",
        "type": "WEBSITE",
        "layer": 3,
        "x": 1340,
        "y": 690,
        "icon": "🌐",
        "subtitle": "CDN Hébergement APKs",
        "meta": {
          "ssl": "Let's Encrypt"
        }
      },
      {
        "id": "ip_server_web_1",
        "label": "185.199.108.153 (Nginx)",
        "type": "HOSTING_IP",
        "layer": 3,
        "x": 1340,
        "y": 780,
        "icon": "🖥️",
        "subtitle": "Serveur Web Pneus & Électro",
        "meta": {
          "asn": "AS49505"
        }
      },
      {
        "id": "ip_server_web_2",
        "label": "194.26.29.84 (Apache)",
        "type": "HOSTING_IP",
        "layer": 3,
        "x": 1340,
        "y": 870,
        "icon": "🖥️",
        "subtitle": "Serveur Web Faux Visas",
        "meta": {
          "asn": "AS200019"
        }
      },
      {
        "id": "ip_server_c2_api",
        "label": "api.gateway-central-dz.xyz",
        "type": "C2_SERVER",
        "layer": 3,
        "x": 1340,
        "y": 960,
        "icon": "⚙️",
        "subtitle": "API Backend C2 & Webhooks",
        "meta": {
          "role": "Centraliseur Leads"
        }
      },
      {
        "id": "mongodb_cluster",
        "label": "MongoDB 672f9a10c8b...",
        "type": "DATABASE",
        "layer": 3,
        "x": 1340,
        "y": 1050,
        "icon": "🗄️",
        "subtitle": "BSON Leads Multi-Tenant",
        "meta": {
          "time": "01 Nov 14:22"
        }
      },
      {
        "id": "meta_pixel_tracker",
        "label": "Meta Pixel #88419203314",
        "type": "AD_TRACKER",
        "layer": 3,
        "x": 1340,
        "y": 1140,
        "icon": "📊",
        "subtitle": "Tracker commun 3 boutiques",
        "meta": {
          "matches": 3
        }
      },
      {
        "id": "bts_oran_senia",
        "label": "BTS Ooredoo Es Senia (48921)",
        "type": "TELECOM_CELL",
        "layer": 3,
        "x": 1340,
        "y": 1230,
        "icon": "📡",
        "subtitle": "Azimut 120° • Oran",
        "meta": {
          "msisdn": "+213555019283"
        }
      },
      {
        "id": "bts_alger_kouba",
        "label": "BTS Mobilis Kouba (12044)",
        "type": "TELECOM_CELL",
        "layer": 3,
        "x": 1340,
        "y": 1320,
        "icon": "📡",
        "subtitle": "Azimut 240° • Alger",
        "meta": {
          "suspect": "Amine B."
        }
      },
      {
        "id": "bts_blida_centre",
        "label": "BTS Ooredoo Blida (33819)",
        "type": "TELECOM_CELL",
        "layer": 3,
        "x": 1340,
        "y": 1410,
        "icon": "📡",
        "subtitle": "Azimut 090° • Blida",
        "meta": {
          "suspect": "Youcef R."
        }
      },
      {
        "id": "bts_const_univ",
        "label": "BTS Djezzy Univ Const (61092)",
        "type": "TELECOM_CELL",
        "layer": 3,
        "x": 1340,
        "y": 1500,
        "icon": "📡",
        "subtitle": "Azimut 180° • Constantine",
        "meta": {
          "suspect": "Nadia M."
        }
      },
      {
        "id": "git_repo_public",
        "label": "github/soficoder-alger",
        "type": "CODE_REPO",
        "layer": 3,
        "x": 1680,
        "y": 60,
        "icon": "💻",
        "subtitle": "Dépôt dz-shop-template",
        "meta": {
          "author": "Sofiane K."
        }
      },
      {
        "id": "git_commit_webhook",
        "label": "Commit Git #7a8f1b2c",
        "type": "CODE_COMMIT",
        "layer": 3,
        "x": 1680,
        "y": 150,
        "icon": "🔍",
        "subtitle": "Fuite Webhook Discord",
        "meta": {
          "author_email": "sofiane.devbox99@gmail.com"
        }
      },
      {
        "id": "keystore_apk_signature",
        "label": "Keystore CN=Sofiane K.",
        "type": "CERTIFICATE",
        "layer": 3,
        "x": 1680,
        "y": 240,
        "icon": "🔐",
        "subtitle": "Signature binaire APKs",
        "meta": {
          "ou": "DevAlger"
        }
      },
      {
        "id": "bot_telegram_leads",
        "label": "@syndicate_leads_bot",
        "type": "BOT_API",
        "layer": 3,
        "x": 1680,
        "y": 330,
        "icon": "🤖",
        "subtitle": "Bot Exfiltration Paiements",
        "meta": {
          "token": "7418920194:AAF..."
        }
      },
      {
        "id": "rip_baridimob_mule1",
        "label": "RIP 00799999002148593214",
        "type": "BANK_ACCOUNT",
        "layer": 3,
        "x": 1680,
        "y": 420,
        "icon": "💳",
        "subtitle": "Compte BaridiMob Mule #1",
        "meta": {
          "titulaire": "Akram L. (Alger)"
        }
      },
      {
        "id": "rip_baridimob_mule2",
        "label": "RIP 00799999008812450192",
        "type": "BANK_ACCOUNT",
        "layer": 3,
        "x": 1680,
        "y": 510,
        "icon": "💳",
        "subtitle": "Compte BaridiMob Mule #2",
        "meta": {
          "titulaire": "Walid M. (Oran)"
        }
      },
      {
        "id": "rip_baridimob_mule3",
        "label": "RIP 00799999005541908233",
        "type": "BANK_ACCOUNT",
        "layer": 3,
        "x": 1680,
        "y": 600,
        "icon": "💳",
        "subtitle": "Compte BaridiMob Mule #3",
        "meta": {
          "titulaire": "Samir B. (Blida)"
        }
      },
      {
        "id": "crypto_wallet_trc20",
        "label": "Wallet USDT: TJv89XbM...Kq92",
        "type": "CRYPTO_WALLET",
        "layer": 3,
        "x": 1680,
        "y": 690,
        "icon": "🪙",
        "subtitle": "USDT TRC-20 Tron",
        "meta": {
          "balance_usdt": 140000,
          "owner": "Tarek H."
        }
      },
      {
        "id": "suspect_boss_tarek",
        "label": "Tarek H. « El-Hadj » (Boss)",
        "type": "KINGPIN",
        "layer": 4,
        "x": 2020,
        "y": 60,
        "icon": "👑",
        "subtitle": "44 ans • Hydra / Dubaï",
        "meta": {
          "role": "Commanditaire en chef & Blanchisseur USDT",
          "charges": "Association malfaiteurs, escroquerie, blanchiment"
        }
      },
      {
        "id": "suspect_dev_sofiane",
        "label": "Sofiane K. « Sofi-Dev »",
        "type": "DEVELOPER",
        "layer": 4,
        "x": 2020,
        "y": 160,
        "icon": "💻",
        "subtitle": "28 ans • Bab Ezzouar (Alger)",
        "meta": {
          "role": "Développeur Logiciel & Webmaster (15%)",
          "email": "sofiane.devbox99@gmail.com"
        }
      },
      {
        "id": "suspect_cashier_kamel",
        "label": "Kamel V. « Le Caissier »",
        "type": "SUSPECT",
        "layer": 4,
        "x": 2020,
        "y": 260,
        "icon": "💼",
        "subtitle": "36 ans • Alger Centre",
        "meta": {
          "role": "Gestionnaire 18 Mules & Retraits GAB",
          "seizures": "18 cartes Edahabia"
        }
      },
      {
        "id": "suspect_lt_youcef",
        "label": "Youcef R. « Jo_Blida » (LT Pneus)",
        "type": "LIEUTENANT",
        "layer": 4,
        "x": 2020,
        "y": 360,
        "icon": "⭐",
        "subtitle": "34 ans • Blida",
        "meta": {
          "cell": "Pneumatiques",
          "turnover": 4500000
        }
      },
      {
        "id": "suspect_lt_nadia",
        "label": "Nadia M. « Dina » (LT Visas)",
        "type": "LIEUTENANT",
        "layer": 4,
        "x": 2020,
        "y": 460,
        "icon": "⭐",
        "subtitle": "31 ans • Constantine",
        "meta": {
          "cell": "Visas Schengen & Contrats",
          "turnover": 18000000
        }
      },
      {
        "id": "suspect_lt_farid",
        "label": "Farid T. « Kika » (LT Électro)",
        "type": "LIEUTENANT",
        "layer": 4,
        "x": 2020,
        "y": 560,
        "icon": "⭐",
        "subtitle": "36 ans • Sétif / Annaba",
        "meta": {
          "cell": "Électro & Or",
          "turnover": 11000000
        }
      },
      {
        "id": "suspect_op_amine",
        "label": "Amine B. « Amine Import »",
        "type": "OPERATOR",
        "layer": 4,
        "x": 2020,
        "y": 660,
        "icon": "🎯",
        "subtitle": "24 ans • Oran (Es Senia)",
        "meta": {
          "role": "Opérateur Pneus WhatsApp",
          "voice_match": 0.96
        }
      },
      {
        "id": "suspect_op_bilel",
        "label": "Bilel S. (Opérateur Pneus)",
        "type": "OPERATOR",
        "layer": 4,
        "x": 2020,
        "y": 750,
        "icon": "🎯",
        "subtitle": "22 ans • Blida",
        "meta": {
          "role": "Opérateur Pneus Messenger"
        }
      },
      {
        "id": "suspect_op_fares",
        "label": "Fares K. (Opérateur Visas)",
        "type": "OPERATOR",
        "layer": 4,
        "x": 2020,
        "y": 840,
        "icon": "🎯",
        "subtitle": "26 ans • Constantine",
        "meta": {
          "role": "Opérateur Faux RDV TLS"
        }
      },
      {
        "id": "suspect_op_sarah",
        "label": "Sarah T. (Opératrice Visas)",
        "type": "OPERATOR",
        "layer": 4,
        "x": 2020,
        "y": 930,
        "icon": "🎯",
        "subtitle": "25 ans • Alger",
        "meta": {
          "role": "Opératrice Faux Contrats Espagne"
        }
      },
      {
        "id": "suspect_op_mourad",
        "label": "Mourad Z. (Opérateur Électro)",
        "type": "OPERATOR",
        "layer": 4,
        "x": 2020,
        "y": 1020,
        "icon": "🎯",
        "subtitle": "27 ans • Sétif",
        "meta": {
          "role": "Opérateur iPhones Déstockés"
        }
      },
      {
        "id": "suspect_op_lyes",
        "label": "Lyès B. (Opérateur Or)",
        "type": "OPERATOR",
        "layer": 4,
        "x": 2020,
        "y": 1110,
        "icon": "🎯",
        "subtitle": "29 ans • Annaba",
        "meta": {
          "role": "Opérateur Faux Lingotins"
        }
      },
      {
        "id": "mule_etudiant_1",
        "label": "Akram L. (Mule BaridiMob)",
        "type": "MULE",
        "layer": 4,
        "x": 2020,
        "y": 1200,
        "icon": "👤",
        "subtitle": "Étudiant USTHB Alger (15k/mois)",
        "meta": {
          "rip": "00799999002148593214"
        }
      },
      {
        "id": "mule_etudiant_2",
        "label": "Walid M. (Mule BaridiMob)",
        "type": "MULE",
        "layer": 4,
        "x": 2020,
        "y": 1290,
        "icon": "👤",
        "subtitle": "Étudiant USTO Oran (15k/mois)",
        "meta": {
          "rip": "00799999008812450192"
        }
      },
      {
        "id": "mule_interimaire",
        "label": "Samir B. (Mule BaridiMob)",
        "type": "MULE",
        "layer": 4,
        "x": 2020,
        "y": 1380,
        "icon": "👤",
        "subtitle": "Intérimaire Blida (15k/mois)",
        "meta": {
          "rip": "00799999005541908233"
        }
      },
      {
        "id": "mule_etudiante_3",
        "label": "Yasmine D. (Mule BaridiMob)",
        "type": "MULE",
        "layer": 4,
        "x": 2020,
        "y": 1470,
        "icon": "👤",
        "subtitle": "Étudiante Constantine",
        "meta": {
          "role": "Compte récepteur Visas"
        }
      },
      {
        "id": "shell_societe_ouest",
        "label": "SARL Ouest Pneumatiques (Écran)",
        "type": "SHELL_COMPANY",
        "layer": 4,
        "x": 2020,
        "y": 1560,
        "icon": "🏢",
        "subtitle": "Société Fictive (Registre Faux)",
        "meta": {
          "used_by": "Cellule Pneus"
        }
      },
      {
        "id": "shell_agence_voyage",
        "label": "Horizon Visas Consulting (Écran)",
        "type": "SHELL_COMPANY",
        "layer": 4,
        "x": 2020,
        "y": 1650,
        "icon": "🏢",
        "subtitle": "Agence Voyage Fictive",
        "meta": {
          "used_by": "Cellule Visas"
        }
      },
      {
        "id": "binance_p2p_account",
        "label": "Binance P2P #DZ-VIP-99",
        "type": "CRYPTO_EXCHANGE",
        "layer": 4,
        "x": 2020,
        "y": 1740,
        "icon": "🔄",
        "subtitle": "Comptoir Achat USDT Clandestin",
        "meta": {
          "volume_monthly": "25 000 USDT"
        }
      },
      {
        "id": "syndicate_entity_global",
        "label": "SYNDICAT CANDY WHEELS (33.5M DZD)",
        "type": "ORGANIZATION",
        "layer": 4,
        "x": 2020,
        "y": 1830,
        "icon": "🚨",
        "subtitle": "Réseau Cybercriminalité National",
        "meta": {
          "total_damage": 33500000,
          "status": "DÉMANTELÉ"
        }
      }
    ],
    "edges": [
      {
        "from": "vic_01_karim",
        "to": "fb_post_pneus_98124",
        "label": "CLICKED_AD"
      },
      {
        "from": "vic_02_meriem",
        "to": "fb_page_pneus_promo",
        "label": "CONTACTED_PAGE"
      },
      {
        "from": "vic_03_djamel",
        "to": "evid_apk_pneu",
        "label": "INSTALLED_APK"
      },
      {
        "from": "vic_04_salim",
        "to": "fb_post_visa_44102",
        "label": "ORDERED_VISA"
      },
      {
        "from": "vic_05_amina",
        "to": "fb_page_tls_appointments",
        "label": "PAID_SLOT"
      },
      {
        "from": "vic_06_rachid",
        "to": "fb_post_electro_7712",
        "label": "ORDERED_PHONE"
      },
      {
        "from": "vic_07_tahar",
        "to": "fb_post_tv_7745",
        "label": "ORDERED_TV"
      },
      {
        "from": "vic_08_mourad",
        "to": "fb_post_pneus_98177",
        "label": "ORDERED_TYRES"
      },
      {
        "from": "vic_09_fatima",
        "to": "fb_post_visa_44189",
        "label": "ORDERED_CONTRACT"
      },
      {
        "from": "vic_10_omar",
        "to": "fb_page_gold_algerie",
        "label": "ORDERED_GOLD"
      },
      {
        "from": "vic_01_karim",
        "to": "proc_pv_alger",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_02_meriem",
        "to": "proc_pv_oran",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_03_djamel",
        "to": "proc_pv_blida",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_04_salim",
        "to": "proc_pv_const",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_05_amina",
        "to": "proc_pv_alger",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_06_rachid",
        "to": "proc_pv_setif",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_07_tahar",
        "to": "proc_pv_const",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_08_mourad",
        "to": "proc_pv_oran",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_09_fatima",
        "to": "proc_pv_oran",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_10_omar",
        "to": "proc_pv_setif",
        "label": "FILED_COMPLAINT"
      },
      {
        "from": "vic_01_karim",
        "to": "evid_audio_a01",
        "label": "RECEIVED_VOICE"
      },
      {
        "from": "vic_01_karim",
        "to": "evid_baridimob_slip",
        "label": "PRODUCED_RECEIPT"
      },
      {
        "from": "vic_02_meriem",
        "to": "evid_bon_commande_pdf",
        "label": "RECEIVED_ORDER_FORM"
      },
      {
        "from": "fb_post_pneus_98124",
        "to": "fb_page_pneus_promo",
        "label": "PUBLISHED_BY"
      },
      {
        "from": "fb_post_pneus_98177",
        "to": "fb_page_michelin_exp",
        "label": "PUBLISHED_BY"
      },
      {
        "from": "fb_post_visa_44102",
        "to": "fb_page_visas_express",
        "label": "PUBLISHED_BY"
      },
      {
        "from": "fb_post_visa_44189",
        "to": "fb_page_visas_express",
        "label": "PUBLISHED_BY"
      },
      {
        "from": "fb_post_electro_7712",
        "to": "fb_page_destock_electro",
        "label": "PUBLISHED_BY"
      },
      {
        "from": "fb_post_tv_7745",
        "to": "fb_page_destock_electro",
        "label": "PUBLISHED_BY"
      },
      {
        "from": "fb_post_pneus_98124",
        "to": "phone_front_amine",
        "label": "CALL_TO_ACTION"
      },
      {
        "from": "fb_page_pneus_promo",
        "to": "phone_front_amine",
        "label": "CONTACT_PHONE"
      },
      {
        "from": "fb_page_michelin_exp",
        "to": "phone_front_bilel",
        "label": "CONTACT_PHONE"
      },
      {
        "from": "fb_page_visas_express",
        "to": "phone_front_fares",
        "label": "CONTACT_PHONE"
      },
      {
        "from": "fb_page_tls_appointments",
        "to": "phone_front_sarah",
        "label": "CONTACT_PHONE"
      },
      {
        "from": "fb_page_destock_electro",
        "to": "phone_front_mourad",
        "label": "CONTACT_PHONE"
      },
      {
        "from": "phone_front_amine",
        "to": "suspect_op_amine",
        "label": "USED_BY_OPERATOR"
      },
      {
        "from": "phone_front_bilel",
        "to": "suspect_op_bilel",
        "label": "USED_BY_OPERATOR"
      },
      {
        "from": "phone_front_fares",
        "to": "suspect_op_fares",
        "label": "USED_BY_OPERATOR"
      },
      {
        "from": "phone_front_sarah",
        "to": "suspect_op_sarah",
        "label": "USED_BY_OPERATOR"
      },
      {
        "from": "phone_front_mourad",
        "to": "suspect_op_mourad",
        "label": "USED_BY_OPERATOR"
      },
      {
        "from": "phone_front_amine",
        "to": "bts_oran_senia",
        "label": "CONNECTED_BTS"
      },
      {
        "from": "phone_front_sarah",
        "to": "bts_alger_kouba",
        "label": "CONNECTED_BTS"
      },
      {
        "from": "phone_lt_youcef",
        "to": "bts_blida_centre",
        "label": "CONNECTED_BTS"
      },
      {
        "from": "phone_lt_nadia",
        "to": "bts_const_univ",
        "label": "CONNECTED_BTS"
      },
      {
        "from": "phone_front_amine",
        "to": "ig_auto_pieces_pro",
        "label": "LINKED_INSTAGRAM"
      },
      {
        "from": "phone_front_amine",
        "to": "ouedkniss_amine_2025",
        "label": "LINKED_OUEDKNISS"
      },
      {
        "from": "phone_front_fares",
        "to": "ig_visa_dz_officiel",
        "label": "LINKED_INSTAGRAM"
      },
      {
        "from": "fb_post_pneus_98124",
        "to": "domain_pneus_express",
        "label": "EMBEDS_URL"
      },
      {
        "from": "fb_post_pneus_98177",
        "to": "domain_destock_auto",
        "label": "EMBEDS_URL"
      },
      {
        "from": "fb_post_visa_44102",
        "to": "domain_visa_schengen",
        "label": "EMBEDS_URL"
      },
      {
        "from": "fb_post_visa_44189",
        "to": "domain_visa_espana",
        "label": "EMBEDS_URL"
      },
      {
        "from": "fb_post_electro_7712",
        "to": "domain_destock_electro",
        "label": "EMBEDS_URL"
      },
      {
        "from": "fb_post_tv_7745",
        "to": "domain_gold_express",
        "label": "EMBEDS_URL"
      },
      {
        "from": "domain_pneus_express",
        "to": "ip_server_web_1",
        "label": "HOSTED_ON"
      },
      {
        "from": "domain_destock_auto",
        "to": "ip_server_web_1",
        "label": "HOSTED_ON"
      },
      {
        "from": "domain_destock_electro",
        "to": "ip_server_web_1",
        "label": "HOSTED_ON"
      },
      {
        "from": "domain_gold_express",
        "to": "ip_server_web_1",
        "label": "HOSTED_ON"
      },
      {
        "from": "domain_visa_schengen",
        "to": "ip_server_web_2",
        "label": "HOSTED_ON"
      },
      {
        "from": "domain_visa_espana",
        "to": "ip_server_web_2",
        "label": "HOSTED_ON"
      },
      {
        "from": "domain_pneus_express",
        "to": "meta_pixel_tracker",
        "label": "INJECTS_PIXEL"
      },
      {
        "from": "domain_destock_auto",
        "to": "meta_pixel_tracker",
        "label": "INJECTS_PIXEL"
      },
      {
        "from": "domain_destock_electro",
        "to": "meta_pixel_tracker",
        "label": "INJECTS_PIXEL"
      },
      {
        "from": "domain_pneus_express",
        "to": "mongodb_cluster",
        "label": "LOGS_LEADS_TO"
      },
      {
        "from": "domain_destock_auto",
        "to": "mongodb_cluster",
        "label": "LOGS_LEADS_TO"
      },
      {
        "from": "domain_pneus_express",
        "to": "cdn_apps_server",
        "label": "HOSTS_DOWNLOAD_ON"
      },
      {
        "from": "domain_visa_schengen",
        "to": "cdn_apps_server",
        "label": "HOSTS_DOWNLOAD_ON"
      },
      {
        "from": "cdn_apps_server",
        "to": "evid_apk_pneu",
        "label": "DELIVERS_BINARY"
      },
      {
        "from": "cdn_apps_server",
        "to": "evid_apk_visa",
        "label": "DELIVERS_BINARY"
      },
      {
        "from": "evid_apk_pneu",
        "to": "keystore_apk_signature",
        "label": "SIGNED_BY"
      },
      {
        "from": "evid_apk_visa",
        "to": "keystore_apk_signature",
        "label": "SIGNED_BY"
      },
      {
        "from": "keystore_apk_signature",
        "to": "suspect_dev_sofiane",
        "label": "BELONGS_TO_DEV"
      },
      {
        "from": "domain_pneus_express",
        "to": "git_repo_public",
        "label": "EXPOSED_GIT_DIR"
      },
      {
        "from": "git_repo_public",
        "to": "git_commit_webhook",
        "label": "CONTAINED_IN_COMMIT"
      },
      {
        "from": "git_commit_webhook",
        "to": "suspect_dev_sofiane",
        "label": "COMMITTED_BY"
      },
      {
        "from": "git_commit_webhook",
        "to": "discord_guild_c2",
        "label": "LEAKED_WEBHOOK_TO"
      },
      {
        "from": "discord_guild_c2",
        "to": "discord_ch_commandes",
        "label": "HAS_CHANNEL"
      },
      {
        "from": "discord_ch_commandes",
        "to": "evid_text_d01",
        "label": "CONTAINS_EVIDENCE"
      },
      {
        "from": "discord_ch_commandes",
        "to": "suspect_dev_sofiane",
        "label": "DEV_POSTS_BUILDS"
      },
      {
        "from": "discord_ch_commandes",
        "to": "suspect_boss_tarek",
        "label": "BOSS_ORDERS_CLONES"
      },
      {
        "from": "ip_server_c2_api",
        "to": "bot_telegram_leads",
        "label": "DISPATCHES_TO_BOT"
      },
      {
        "from": "discord_guild_c2",
        "to": "tg_group_c2_vip",
        "label": "SHARED_VIP_INVITE"
      },
      {
        "from": "discord_guild_c2",
        "to": "tg_group_pneus_ops",
        "label": "SHARED_PNEU_INVITE"
      },
      {
        "from": "discord_guild_c2",
        "to": "tg_group_visas_ops",
        "label": "SHARED_VISA_INVITE"
      },
      {
        "from": "discord_guild_c2",
        "to": "tg_group_electro_ops",
        "label": "SHARED_ELECTRO_INVITE"
      },
      {
        "from": "tg_group_c2_vip",
        "to": "evid_audio_a02",
        "label": "AUDIO_LEAK_BOSS"
      },
      {
        "from": "tg_group_c2_vip",
        "to": "evid_audio_a03",
        "label": "AUDIO_LEAK_NADIA"
      },
      {
        "from": "tg_group_c2_vip",
        "to": "evid_audio_a04",
        "label": "AUDIO_LEAK_FARID"
      },
      {
        "from": "tg_group_pneus_ops",
        "to": "evid_text_t01",
        "label": "CONTAINS_DIRECTIVE"
      },
      {
        "from": "suspect_op_amine",
        "to": "evid_audio_a01",
        "label": "RECORDED_SPEECH"
      },
      {
        "from": "suspect_lt_youcef",
        "to": "tg_group_pneus_ops",
        "label": "LEADS_CELL"
      },
      {
        "from": "suspect_lt_nadia",
        "to": "tg_group_visas_ops",
        "label": "LEADS_CELL"
      },
      {
        "from": "suspect_lt_farid",
        "to": "tg_group_electro_ops",
        "label": "LEADS_CELL"
      },
      {
        "from": "suspect_op_amine",
        "to": "tg_group_pneus_ops",
        "label": "OPERATOR_IN_GROUP"
      },
      {
        "from": "suspect_op_bilel",
        "to": "tg_group_pneus_ops",
        "label": "OPERATOR_IN_GROUP"
      },
      {
        "from": "suspect_op_fares",
        "to": "tg_group_visas_ops",
        "label": "OPERATOR_IN_GROUP"
      },
      {
        "from": "suspect_op_sarah",
        "to": "tg_group_visas_ops",
        "label": "OPERATOR_IN_GROUP"
      },
      {
        "from": "suspect_op_mourad",
        "to": "tg_group_electro_ops",
        "label": "OPERATOR_IN_GROUP"
      },
      {
        "from": "suspect_op_lyes",
        "to": "tg_group_electro_ops",
        "label": "OPERATOR_IN_GROUP"
      },
      {
        "from": "suspect_op_amine",
        "to": "suspect_lt_youcef",
        "label": "REPORTS_TO_LT"
      },
      {
        "from": "suspect_op_bilel",
        "to": "suspect_lt_youcef",
        "label": "REPORTS_TO_LT"
      },
      {
        "from": "suspect_op_fares",
        "to": "suspect_lt_nadia",
        "label": "REPORTS_TO_LT"
      },
      {
        "from": "suspect_op_sarah",
        "to": "suspect_lt_nadia",
        "label": "REPORTS_TO_LT"
      },
      {
        "from": "suspect_op_mourad",
        "to": "suspect_lt_farid",
        "label": "REPORTS_TO_LT"
      },
      {
        "from": "suspect_op_lyes",
        "to": "suspect_lt_farid",
        "label": "REPORTS_TO_LT"
      },
      {
        "from": "suspect_lt_youcef",
        "to": "suspect_boss_tarek",
        "label": "REPORTS_TO_BOSS"
      },
      {
        "from": "suspect_lt_nadia",
        "to": "suspect_boss_tarek",
        "label": "REPORTS_TO_BOSS"
      },
      {
        "from": "suspect_lt_farid",
        "to": "suspect_boss_tarek",
        "label": "REPORTS_TO_BOSS"
      },
      {
        "from": "suspect_dev_sofiane",
        "to": "suspect_boss_tarek",
        "label": "CONTRACTED_BY_BOSS"
      },
      {
        "from": "mule_etudiant_1",
        "to": "rip_baridimob_mule1",
        "label": "ACCOUNT_HOLDER"
      },
      {
        "from": "mule_etudiant_2",
        "to": "rip_baridimob_mule2",
        "label": "ACCOUNT_HOLDER"
      },
      {
        "from": "mule_interimaire",
        "to": "rip_baridimob_mule3",
        "label": "ACCOUNT_HOLDER"
      },
      {
        "from": "mule_etudiante_3",
        "to": "rip_baridimob_mule1",
        "label": "RENTED_CARD"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "mule_etudiant_1",
        "label": "RENTS_CARD_FOR_15K"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "mule_etudiant_2",
        "label": "RENTS_CARD_FOR_15K"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "mule_interimaire",
        "label": "RENTS_CARD_FOR_15K"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "mule_etudiante_3",
        "label": "RENTS_CARD_FOR_15K"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "rip_baridimob_mule1",
        "label": "DRAWS_CASH_FROM_ATM"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "rip_baridimob_mule2",
        "label": "DRAWS_CASH_FROM_ATM"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "rip_baridimob_mule3",
        "label": "DRAWS_CASH_FROM_ATM"
      },
      {
        "from": "suspect_cashier_kamel",
        "to": "binance_p2p_account",
        "label": "DELIVERS_CASH_FOR_USDT"
      },
      {
        "from": "binance_p2p_account",
        "to": "crypto_wallet_trc20",
        "label": "TRANSFERS_USDT_TRC20"
      },
      {
        "from": "suspect_boss_tarek",
        "to": "crypto_wallet_trc20",
        "label": "CONTROLS_PRIVATE_KEY"
      },
      {
        "from": "suspect_boss_tarek",
        "to": "binance_p2p_account",
        "label": "MANAGES_P2P_MERCHANT"
      },
      {
        "from": "suspect_lt_youcef",
        "to": "shell_societe_ouest",
        "label": "OPERATES_FAKE_CORP"
      },
      {
        "from": "suspect_lt_nadia",
        "to": "shell_agence_voyage",
        "label": "OPERATES_FAKE_AGENCY"
      },
      {
        "from": "suspect_boss_tarek",
        "to": "syndicate_entity_global",
        "label": "HEADS_CRIME_SYNDICATE"
      },
      {
        "from": "suspect_lt_youcef",
        "to": "syndicate_entity_global",
        "label": "BRANCH_HEAD_PNEUS"
      },
      {
        "from": "suspect_lt_nadia",
        "to": "syndicate_entity_global",
        "label": "BRANCH_HEAD_VISAS"
      },
      {
        "from": "suspect_lt_farid",
        "to": "syndicate_entity_global",
        "label": "BRANCH_HEAD_ELECTRO"
      }
    ]
  }
};
