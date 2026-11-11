#!/usr/bin/env python3
"""
Generate Complete 100-Node Forensic Graph for Athar DZ Mock
Operation: CANDY WHEELS (Case #2026-SCAM-089)
"""

import json
import os
import subprocess
import shutil

print("[*] Building 100-Node Forensic Case Dataset...")

# -----------------------------------------------------------------------------
# 1. DEFINE 100 NODES ACROSS 4 FORENSIC LAYERS
# -----------------------------------------------------------------------------
NODES = []

def add_node(nid, label, ntype, layer, x, y, icon, subtitle, meta=None):
    NODES.append({
        "id": nid,
        "label": label,
        "type": ntype,
        "layer": layer, # 1: verified, 2: osint, 3: infra, 4: hypothesis
        "x": x,
        "y": y,
        "icon": icon,
        "subtitle": subtitle,
        "meta": meta or {}
    })

# --- LAYER 1: Preuves Vérifiées / Scellés Judiciaires (Nodes 1 to 25) ---
# Victimes (1..10)
add_node("vic_01_karim", "Karim Zerrouki (64k DZD)", "VICTIM", 1, 60, 60, "👤", "Chauffeur Taxi • Bab Ezzouar", {"phone": "+213 661 44 12 89", "loss": 64000, "item": "4 Pneus Michelin", "wilaya": "Alger"})
add_node("vic_02_meriem", "Meriem Benali (48k DZD)", "VICTIM", 1, 60, 150, "👤", "Enseignante • Bir El Djir", {"phone": "+213 770 82 91 30", "loss": 48000, "item": "4 Pneus Michelin Energy", "wilaya": "Oran"})
add_node("vic_03_djamel", "Djamel E. Mansouri (120k DZD)", "VICTIM", 1, 60, 240, "👤", "Flotte Utilitaires • Ouled Yaïch", {"phone": "+213 550 19 63 74", "loss": 120000, "item": "8 Pneus Agilis", "wilaya": "Blida"})
add_node("vic_04_salim", "Salim Kheddam (150k DZD)", "VICTIM", 1, 60, 330, "👤", "Commerçant • Constantine", {"phone": "+213 662 11 90 45", "loss": 150000, "item": "Faux Visa Espagne", "wilaya": "Constantine"})
add_node("vic_05_amina", "Amina Taleb (85k DZD)", "VICTIM", 1, 60, 420, "👤", "Cadre Banque • Kouba", {"phone": "+213 774 29 80 11", "loss": 85000, "item": "RDV TLSContact France", "wilaya": "Alger"})
add_node("vic_06_rachid", "Rachid Bouzid (190k DZD)", "VICTIM", 1, 60, 510, "👤", "Artisan • Sétif", {"phone": "+213 551 77 40 22", "loss": 190000, "item": "iPhone 16 Pro Max", "wilaya": "Sétif"})
add_node("vic_07_tahar", "Tahar Mebarki (220k DZD)", "VICTIM", 1, 60, 600, "👤", "Entrepreneur • Annaba", {"phone": "+213 668 55 12 30", "loss": 220000, "item": "Pack TV 4K Déstockage", "wilaya": "Annaba"})
add_node("vic_08_mourad", "Mourad Belhadj (75k DZD)", "VICTIM", 1, 60, 690, "👤", "Agriculteur • Sig", {"phone": "+213 770 14 55 90", "loss": 75000, "item": "Pneus Tracteur/Van", "wilaya": "Mascara/Oran"})
add_node("vic_09_fatima", "Fatima Z. Cherif (110k DZD)", "VICTIM", 1, 60, 780, "👤", "Infirmière • Tlemcen", {"phone": "+213 558 90 23 44", "loss": 110000, "item": "Contrat Saisonnier", "wilaya": "Tlemcen"})
add_node("vic_10_omar", "Omar Latreche (95k DZD)", "VICTIM", 1, 60, 870, "👤", "Retraité • Batna", {"phone": "+213 661 80 44 19", "loss": 95000, "item": "Lingotin Or Déstockage", "wilaya": "Batna"})

# Plaintes & Registres Judiciaires (11..15)
add_node("proc_pv_alger", "PV Plainte Alger #089-A", "PROC_VERBAL", 1, 60, 960, "⚖️", "Saisine Parquet Alger TIC", {"date": "2026-11-10", "opj": "Insp. Benali"})
add_node("proc_pv_oran", "PV Plainte Oran #089-B", "PROC_VERBAL", 1, 60, 1050, "⚖️", "Section Recherches Oran", {"date": "2026-11-10", "opj": "Capitaine Belkacem"})
add_node("proc_pv_blida", "PV Plainte Blida #089-C", "PROC_VERBAL", 1, 60, 1140, "⚖️", "Brigade Cyb Blida", {"date": "2026-11-10", "opj": "Lt. Meziane"})
add_node("proc_pv_const", "PV Plainte Const #089-D", "PROC_VERBAL", 1, 60, 1230, "⚖️", "Section Recherches Est", {"date": "2026-11-10", "opj": "Lt. Hamdi"})
add_node("proc_pv_setif", "PV Plainte Sétif #089-E", "PROC_VERBAL", 1, 60, 1320, "⚖️", "Brigade Financière Sétif", {"date": "2026-11-10", "opj": "Insp. Saadi"})

# Preuves Matérielles Audio & Fichiers Scellés (16..25)
add_node("evid_audio_a01", "Pièce A-01 (Vocal WhatsApp)", "AUDIO_RECORDING", 1, 360, 60, "🎙️", "Amine -> Karim (96% voix)", {"sha256": "a9f3b7c841e2d93e15f40192b0c39a8e", "lang": "Darija", "sec": 42})
add_node("evid_audio_a02", "Pièce A-02 (Vocal Telegram)", "AUDIO_RECORDING", 1, 360, 150, "🎙️", "Boss El-Hadj -> Youcef", {"sha256": "5d829fa18c0e2274b123985fe612ab74", "lang": "Darija", "sec": 58})
add_node("evid_audio_a03", "Pièce A-03 (Vocal Telegram)", "AUDIO_RECORDING", 1, 360, 240, "🎙️", "Nadia -> Boss (Faux Visas)", {"sha256": "98e4c194b15672d1f90081c7e92384a8", "lang": "Darija", "sec": 35})
add_node("evid_audio_a04", "Pièce A-04 (Vocal Telegram)", "AUDIO_RECORDING", 1, 360, 330, "🎙️", "Farid -> Boss (Électro)", {"sha256": "b1e9c8a74102938475618293a4b5c6d7", "lang": "Darija", "sec": 48})
add_node("evid_text_t01", "Pièce T-01 (Chat Telegram)", "CHAT_LOG", 1, 360, 420, "💬", "Directive Youcef (Blocage)", {"sha256": "3c7b91f0e21a8d94c1b2e3f4a5b6c7d8", "channel": "t.me/+Ab91k_PneuOps"})
add_node("evid_text_d01", "Pièce D-01 (Log Discord)", "CHAT_LOG", 1, 360, 510, "💬", "Commandes APK Sofiane/Boss", {"sha256": "1f8e2a3b4c5d6e7f8a9b0c1d2e3f4a5b", "channel": "DZ-Dev #commandes"})
add_node("evid_apk_pneu", "AutoPneusDZ.apk (Binaire)", "MALWARE_APK", 1, 360, 600, "📦", "Package Trojan BaridiMob", {"sha256": "4a7c8e9b01d2e3f4a5b6c7d8e9f0a1b2", "pkg": "com.devstudio.dz.autopneus"})
add_node("evid_apk_visa", "VisaExpressDZ.apk (Binaire)", "MALWARE_APK", 1, 360, 690, "📦", "Clone Phishing TLSContact", {"sha256": "7c8e9b01d2e3f4a5b6c7d8e9f0a1b2c3", "pkg": "com.devstudio.dz.visaexpress"})
add_node("evid_bon_commande_pdf", "Faux Bon Commande PDF", "DOCUMENT", 1, 360, 780, "📄", "SARL Ouest Pneumatiques", {"sha256": "d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3", "source": "WhatsApp Meriem"})
add_node("evid_baridimob_slip", "Récépissé BaridiMob TXN", "BANK_RECORD", 1, 360, 870, "🧾", "TXN-20261108-994102", {"amount": 64000, "rip": "00799999002148593214"})

# --- LAYER 2: Découvertes OSINT Brutes (Nodes 26 to 55) ---
# Pages & Profils Réseaux Sociaux (26..35)
add_node("fb_page_pneus_promo", "fb.com/pneus.promo.dz", "FB_PAGE", 2, 680, 60, "📢", "Pneus Promo DZ (2.4k j'aime)", {"admin": "Algérie", "created": "2026-10-12"})
add_node("fb_page_michelin_exp", "fb.com/michelin.express", "FB_PAGE", 2, 680, 150, "📢", "Pneus Express Livraison", {"created": "2026-10-24"})
add_node("fb_page_destock_blida", "fb.com/auto.destock.blida", "FB_PAGE", 2, 680, 240, "📢", "Auto Déstockage Pneumatiques", {"created": "2026-11-02"})
add_node("fb_page_visas_express", "fb.com/visa.schengen.exp", "FB_PAGE", 2, 680, 330, "📢", "Visa Schengen Express DZ", {"followers": 5800})
add_node("fb_page_tls_appointments", "fb.com/rdv.consulat.dz", "FB_PAGE", 2, 680, 420, "📢", "Créneaux TLS/VFS Garantis", {"followers": 3200})
add_node("fb_page_destock_electro", "fb.com/destock.electro.dz", "FB_PAGE", 2, 680, 510, "📢", "Déstockage Électroménager", {"followers": 4100})
add_node("fb_page_gold_algerie", "fb.com/or.douane.liquidation", "FB_PAGE", 2, 680, 600, "📢", "Or & Bijoux Saisie Douane", {"followers": 1900})
add_node("ig_auto_pieces_pro", "@auto_pieces_pro (IG)", "INSTAGRAM", 2, 680, 690, "📷", "Instagram relié à +213555...", {"posts": 34})
add_node("ig_visa_dz_officiel", "@visa_espagne_dz (IG)", "INSTAGRAM", 2, 680, 780, "📷", "Instagram fausses offres visa", {"posts": 51})
add_node("ouedkniss_amine_2025", "Ouedkniss 'Amine Pièces'", "CLASSIFIED_AD", 2, 680, 870, "🛒", "Compte vendeur Ouedkniss 2025", {"last_active": "2025-12"})

# Publications & Posts Frauduleux (36..41)
add_node("fb_post_pneus_98124", "Post FB #98124 (Michelin)", "FB_POST", 2, 680, 960, "📰", "Michelin -60% Déstockage", {"reach": 18400, "date": "08 Nov"})
add_node("fb_post_pneus_98177", "Post FB #98177 (Saisie Douane)", "FB_POST", 2, 680, 1050, "📰", "Liquidation Pneus Tourisme", {"reach": 9200})
add_node("fb_post_visa_44102", "Post FB #44102 (RDV TLS)", "FB_POST", 2, 680, 1140, "📰", "Rendez-vous Espagne 48h", {"reach": 24000})
add_node("fb_post_visa_44189", "Post FB #44189 (Contrat Esp)", "FB_POST", 2, 680, 1230, "📰", "Contrat Agricole Murcie", {"reach": 31000})
add_node("fb_post_electro_7712", "Post FB #7712 (iPhone 16)", "FB_POST", 2, 680, 1320, "📰", "iPhone 16 Pro 115k DZD", {"reach": 15600})
add_node("fb_post_tv_7745", "Post FB #7745 (TV Samsung 4K)", "FB_POST", 2, 680, 1410, "📰", "Pack Smart TV 65 pouces", {"reach": 12800})

# Lignes Téléphoniques E.164 Clandestines (42..49)
add_node("phone_front_amine", "+213 555 019 283", "PHONE_NUMBER", 2, 1000, 60, "📱", "Ooredoo • Opérateur Amine", {"cell": "Es Senia (Oran)", "active": True})
add_node("phone_front_bilel", "+213 551 88 42 10", "PHONE_NUMBER", 2, 1000, 150, "📱", "Ooredoo • Opérateur Bilel", {"cell": "Blida Centre", "active": True})
add_node("phone_front_fares", "+213 772 10 33 99", "PHONE_NUMBER", 2, 1000, 240, "📱", "Djezzy • Opérateur Fares", {"cell": "Constantine", "active": True})
add_node("phone_front_sarah", "+213 779 55 12 04", "PHONE_NUMBER", 2, 1000, 330, "📱", "Djezzy • Opératrice Sarah", {"cell": "Bab Ezzouar", "active": True})
add_node("phone_front_mourad", "+213 663 90 14 77", "PHONE_NUMBER", 2, 1000, 420, "📱", "Mobilis • Opérateur Mourad", {"cell": "Sétif", "active": True})
add_node("phone_lt_youcef", "+213 550 44 91 22", "PHONE_NUMBER", 2, 1000, 510, "📱", "Ooredoo • Lt. Youcef R.", {"role": "Chef Cellule Pneus"})
add_node("phone_lt_nadia", "+213 771 88 50 16", "PHONE_NUMBER", 2, 1000, 600, "📱", "Djezzy • Lt. Nadia M.", {"role": "Chef Cellule Visas"})
add_node("phone_lt_farid", "+213 660 12 34 88", "PHONE_NUMBER", 2, 1000, 690, "📱", "Mobilis • Lt. Farid T.", {"role": "Chef Cellule Électro"})

# Canaux Discord & Telegram Infiltrés (50..55)
add_node("discord_guild_c2", "DZ-Dev & Ops Hub", "DISCORD_SERVER", 2, 1000, 780, "💬", "Discord ID 119830129480192840", {"members": 6, "auth": "Webhook Leak"})
add_node("discord_ch_commandes", "Discord #commandes-scripts", "DISCORD_CHANNEL", 2, 1000, 870, "💬", "Salon Livraison Clones APK", {"proof": "Pièce D-01"})
add_node("tg_group_c2_vip", "t.me/+Hd99_Management_C2", "TELEGRAM_GROUP", 2, 1000, 960, "💬", "VIP Direction C2 (Le Boss)", {"members": 5, "proof": "Pièce A-02/A-03"})
add_node("tg_group_pneus_ops", "t.me/+Ab91k_PneuOps", "TELEGRAM_GROUP", 2, 1000, 1050, "💬", "Pneus DZ Équipe Ventes", {"members": 6, "leader": "Youcef R."})
add_node("tg_group_visas_ops", "t.me/+Vz82k_VisaOps", "TELEGRAM_GROUP", 2, 1000, 1140, "💬", "Visas Schengen Traitement", {"members": 7, "leader": "Nadia M."})
add_node("tg_group_electro_ops", "t.me/+Lx44k_ElectroOps", "TELEGRAM_GROUP", 2, 1000, 1230, "💬", "Électro & Or Liquidation", {"members": 5, "leader": "Farid T."})

# --- LAYER 3: Infrastructure, Télécoms & Code (Nodes 56 to 80) ---
# Domaines & URLs (56..63)
add_node("domain_pneus_express", "promo-pneus-express.shop", "WEBSITE", 3, 1340, 60, "🌐", "Boutique Phishing Pneus", {"ip": "185.199.108.153"})
add_node("domain_destock_auto", "destockage-auto-dz.online", "WEBSITE", 3, 1340, 150, "🌐", "Site Miroir Pneus", {"ip": "185.199.108.153"})
add_node("domain_pneus_rapide", "livraison-pneus-dz.com", "WEBSITE", 3, 1340, 240, "🌐", "Domaine de Réserve Pneus", {"created": "2026-11-01"})
add_node("domain_visa_schengen", "tls-appointment-booking-dz.com", "WEBSITE", 3, 1340, 330, "🌐", "Faux Portail TLSContact", {"ip": "194.26.29.84"})
add_node("domain_visa_espana", "contrat-travail-espagne.site", "WEBSITE", 3, 1340, 420, "🌐", "Faux Contrats Consulaires", {"ip": "194.26.29.84"})
add_node("domain_destock_electro", "flash-electro-algerie.shop", "WEBSITE", 3, 1340, 510, "🌐", "Fausse Boutique Électro", {"ip": "185.199.108.153"})
add_node("domain_gold_express", "or-douane-liquidation.online", "WEBSITE", 3, 1340, 600, "🌐", "Fausse Vente Or/Bijoux", {"ip": "185.199.108.153"})
add_node("cdn_apps_server", "cdn.dz-services-cloud.com", "WEBSITE", 3, 1340, 690, "🌐", "CDN Hébergement APKs", {"ssl": "Let's Encrypt"})

# Serveurs Web & C2 (64..68)
add_node("ip_server_web_1", "185.199.108.153 (Nginx)", "HOSTING_IP", 3, 1340, 780, "🖥️", "Serveur Web Pneus & Électro", {"asn": "AS49505"})
add_node("ip_server_web_2", "194.26.29.84 (Apache)", "HOSTING_IP", 3, 1340, 870, "🖥️", "Serveur Web Faux Visas", {"asn": "AS200019"})
add_node("ip_server_c2_api", "api.gateway-central-dz.xyz", "C2_SERVER", 3, 1340, 960, "⚙️", "API Backend C2 & Webhooks", {"role": "Centraliseur Leads"})
add_node("mongodb_cluster", "MongoDB 672f9a10c8b...", "DATABASE", 3, 1340, 1050, "🗄️", "BSON Leads Multi-Tenant", {"time": "01 Nov 14:22"})
add_node("meta_pixel_tracker", "Meta Pixel #88419203314", "AD_TRACKER", 3, 1340, 1140, "📊", "Tracker commun 3 boutiques", {"matches": 3})

# Relais BTS (69..72)
add_node("bts_oran_senia", "BTS Ooredoo Es Senia (48921)", "TELECOM_CELL", 3, 1340, 1230, "📡", "Azimut 120° • Oran", {"msisdn": "+213555019283"})
add_node("bts_alger_kouba", "BTS Mobilis Kouba (12044)", "TELECOM_CELL", 3, 1340, 1320, "📡", "Azimut 240° • Alger", {"suspect": "Amine B."})
add_node("bts_blida_centre", "BTS Ooredoo Blida (33819)", "TELECOM_CELL", 3, 1340, 1410, "📡", "Azimut 090° • Blida", {"suspect": "Youcef R."})
add_node("bts_const_univ", "BTS Djezzy Univ Const (61092)", "TELECOM_CELL", 3, 1340, 1500, "📡", "Azimut 180° • Constantine", {"suspect": "Nadia M."})

# Code & Git (73..76)
add_node("git_repo_public", "github/soficoder-alger", "CODE_REPO", 3, 1680, 60, "💻", "Dépôt dz-shop-template", {"author": "Sofiane K."})
add_node("git_commit_webhook", "Commit Git #7a8f1b2c", "CODE_COMMIT", 3, 1680, 150, "🔍", "Fuite Webhook Discord", {"author_email": "sofiane.devbox99@gmail.com"})
add_node("keystore_apk_signature", "Keystore CN=Sofiane K.", "CERTIFICATE", 3, 1680, 240, "🔐", "Signature binaire APKs", {"ou": "DevAlger"})
add_node("bot_telegram_leads", "@syndicate_leads_bot", "BOT_API", 3, 1680, 330, "🤖", "Bot Exfiltration Paiements", {"token": "7418920194:AAF..."})

# Fintech BaridiMob & Crypto (77..80)
add_node("rip_baridimob_mule1", "RIP 00799999002148593214", "BANK_ACCOUNT", 3, 1680, 420, "💳", "Compte BaridiMob Mule #1", {"titulaire": "Akram L. (Alger)"})
add_node("rip_baridimob_mule2", "RIP 00799999008812450192", "BANK_ACCOUNT", 3, 1680, 510, "💳", "Compte BaridiMob Mule #2", {"titulaire": "Walid M. (Oran)"})
add_node("rip_baridimob_mule3", "RIP 00799999005541908233", "BANK_ACCOUNT", 3, 1680, 600, "💳", "Compte BaridiMob Mule #3", {"titulaire": "Samir B. (Blida)"})
add_node("crypto_wallet_trc20", "Wallet USDT: TJv89XbM...Kq92", "CRYPTO_WALLET", 3, 1680, 690, "🪙", "USDT TRC-20 Tron", {"balance_usdt": 140000, "owner": "Tarek H."})

# --- LAYER 4: Hypothèses Judiciaires & Réseau Criminel (Nodes 81 to 100) ---
# Tête de réseau (81..83)
add_node("suspect_boss_tarek", "Tarek H. « El-Hadj » (Boss)", "KINGPIN", 4, 2020, 60, "👑", "44 ans • Hydra / Dubaï", {"role": "Commanditaire en chef & Blanchisseur USDT", "charges": "Association malfaiteurs, escroquerie, blanchiment"})
add_node("suspect_dev_sofiane", "Sofiane K. « Sofi-Dev »", "DEVELOPER", 4, 2020, 160, "💻", "28 ans • Bab Ezzouar (Alger)", {"role": "Développeur Logiciel & Webmaster (15%)", "email": "sofiane.devbox99@gmail.com"})
add_node("suspect_cashier_kamel", "Kamel V. « Le Caissier »", "SUSPECT", 4, 2020, 260, "💼", "36 ans • Alger Centre", {"role": "Gestionnaire 18 Mules & Retraits GAB", "seizures": "18 cartes Edahabia"})

# Lieutenants (84..86)
add_node("suspect_lt_youcef", "Youcef R. « Jo_Blida » (LT Pneus)", "LIEUTENANT", 4, 2020, 360, "⭐", "34 ans • Blida", {"cell": "Pneumatiques", "turnover": 4500000})
add_node("suspect_lt_nadia", "Nadia M. « Dina » (LT Visas)", "LIEUTENANT", 4, 2020, 460, "⭐", "31 ans • Constantine", {"cell": "Visas Schengen & Contrats", "turnover": 18000000})
add_node("suspect_lt_farid", "Farid T. « Kika » (LT Électro)", "LIEUTENANT", 4, 2020, 560, "⭐", "36 ans • Sétif / Annaba", {"cell": "Électro & Or", "turnover": 11000000})

# Opérateurs Front-line (87..92)
add_node("suspect_op_amine", "Amine B. « Amine Import »", "OPERATOR", 4, 2020, 660, "🎯", "24 ans • Oran (Es Senia)", {"role": "Opérateur Pneus WhatsApp", "voice_match": 0.96})
add_node("suspect_op_bilel", "Bilel S. (Opérateur Pneus)", "OPERATOR", 4, 2020, 750, "🎯", "22 ans • Blida", {"role": "Opérateur Pneus Messenger"})
add_node("suspect_op_fares", "Fares K. (Opérateur Visas)", "OPERATOR", 4, 2020, 840, "🎯", "26 ans • Constantine", {"role": "Opérateur Faux RDV TLS"})
add_node("suspect_op_sarah", "Sarah T. (Opératrice Visas)", "OPERATOR", 4, 2020, 930, "🎯", "25 ans • Alger", {"role": "Opératrice Faux Contrats Espagne"})
add_node("suspect_op_mourad", "Mourad Z. (Opérateur Électro)", "OPERATOR", 4, 2020, 1020, "🎯", "27 ans • Sétif", {"role": "Opérateur iPhones Déstockés"})
add_node("suspect_op_lyes", "Lyès B. (Opérateur Or)", "OPERATOR", 4, 2020, 1110, "🎯", "29 ans • Annaba", {"role": "Opérateur Faux Lingotins"})

# Mules Financières (93..96)
add_node("mule_etudiant_1", "Akram L. (Mule BaridiMob)", "MULE", 4, 2020, 1200, "👤", "Étudiant USTHB Alger (15k/mois)", {"rip": "00799999002148593214"})
add_node("mule_etudiant_2", "Walid M. (Mule BaridiMob)", "MULE", 4, 2020, 1290, "👤", "Étudiant USTO Oran (15k/mois)", {"rip": "00799999008812450192"})
add_node("mule_interimaire", "Samir B. (Mule BaridiMob)", "MULE", 4, 2020, 1380, "👤", "Intérimaire Blida (15k/mois)", {"rip": "00799999005541908233"})
add_node("mule_etudiante_3", "Yasmine D. (Mule BaridiMob)", "MULE", 4, 2020, 1470, "👤", "Étudiante Constantine", {"role": "Compte récepteur Visas"})

# Sociétés Écrans & Blanchiment Final (97..100)
add_node("shell_societe_ouest", "SARL Ouest Pneumatiques (Écran)", "SHELL_COMPANY", 4, 2020, 1560, "🏢", "Société Fictive (Registre Faux)", {"used_by": "Cellule Pneus"})
add_node("shell_agence_voyage", "Horizon Visas Consulting (Écran)", "SHELL_COMPANY", 4, 2020, 1650, "🏢", "Agence Voyage Fictive", {"used_by": "Cellule Visas"})
add_node("binance_p2p_account", "Binance P2P #DZ-VIP-99", "CRYPTO_EXCHANGE", 4, 2020, 1740, "🔄", "Comptoir Achat USDT Clandestin", {"volume_monthly": "25 000 USDT"})
add_node("syndicate_entity_global", "SYNDICAT CANDY WHEELS (33.5M DZD)", "ORGANIZATION", 4, 2020, 1830, "🚨", "Réseau Cybercriminalité National", {"total_damage": 33500000, "status": "DÉMANTELÉ"})

print(f"[+] Exactly {len(NODES)} nodes successfully defined.")

# -----------------------------------------------------------------------------
# 2. DEFINE ~160 REALISTIC FORENSIC EDGES CONNECTING THE 100 NODES
# -----------------------------------------------------------------------------
EDGES = [
    # Victims -> Posts & Ads
    {"from": "vic_01_karim", "to": "fb_post_pneus_98124", "label": "CLICKED_AD"},
    {"from": "vic_02_meriem", "to": "fb_page_pneus_promo", "label": "CONTACTED_PAGE"},
    {"from": "vic_03_djamel", "to": "evid_apk_pneu", "label": "INSTALLED_APK"},
    {"from": "vic_04_salim", "to": "fb_post_visa_44102", "label": "ORDERED_VISA"},
    {"from": "vic_05_amina", "to": "fb_page_tls_appointments", "label": "PAID_SLOT"},
    {"from": "vic_06_rachid", "to": "fb_post_electro_7712", "label": "ORDERED_PHONE"},
    {"from": "vic_07_tahar", "to": "fb_post_tv_7745", "label": "ORDERED_TV"},
    {"from": "vic_08_mourad", "to": "fb_post_pneus_98177", "label": "ORDERED_TYRES"},
    {"from": "vic_09_fatima", "to": "fb_post_visa_44189", "label": "ORDERED_CONTRACT"},
    {"from": "vic_10_omar", "to": "fb_page_gold_algerie", "label": "ORDERED_GOLD"},

    # Victims -> PVs
    {"from": "vic_01_karim", "to": "proc_pv_alger", "label": "FILED_COMPLAINT"},
    {"from": "vic_02_meriem", "to": "proc_pv_oran", "label": "FILED_COMPLAINT"},
    {"from": "vic_03_djamel", "to": "proc_pv_blida", "label": "FILED_COMPLAINT"},
    {"from": "vic_04_salim", "to": "proc_pv_const", "label": "FILED_COMPLAINT"},
    {"from": "vic_05_amina", "to": "proc_pv_alger", "label": "FILED_COMPLAINT"},
    {"from": "vic_06_rachid", "to": "proc_pv_setif", "label": "FILED_COMPLAINT"},
    {"from": "vic_07_tahar", "to": "proc_pv_const", "label": "FILED_COMPLAINT"},
    {"from": "vic_08_mourad", "to": "proc_pv_oran", "label": "FILED_COMPLAINT"},
    {"from": "vic_09_fatima", "to": "proc_pv_oran", "label": "FILED_COMPLAINT"},
    {"from": "vic_10_omar", "to": "proc_pv_setif", "label": "FILED_COMPLAINT"},

    # Victims -> Audio Evidence & Receipts
    {"from": "vic_01_karim", "to": "evid_audio_a01", "label": "RECEIVED_VOICE"},
    {"from": "vic_01_karim", "to": "evid_baridimob_slip", "label": "PRODUCED_RECEIPT"},
    {"from": "vic_02_meriem", "to": "evid_bon_commande_pdf", "label": "RECEIVED_ORDER_FORM"},

    # Posts -> Pages
    {"from": "fb_post_pneus_98124", "to": "fb_page_pneus_promo", "label": "PUBLISHED_BY"},
    {"from": "fb_post_pneus_98177", "to": "fb_page_michelin_exp", "label": "PUBLISHED_BY"},
    {"from": "fb_post_visa_44102", "to": "fb_page_visas_express", "label": "PUBLISHED_BY"},
    {"from": "fb_post_visa_44189", "to": "fb_page_visas_express", "label": "PUBLISHED_BY"},
    {"from": "fb_post_electro_7712", "to": "fb_page_destock_electro", "label": "PUBLISHED_BY"},
    {"from": "fb_post_tv_7745", "to": "fb_page_destock_electro", "label": "PUBLISHED_BY"},

    # Posts & Pages -> Phones
    {"from": "fb_post_pneus_98124", "to": "phone_front_amine", "label": "CALL_TO_ACTION"},
    {"from": "fb_page_pneus_promo", "to": "phone_front_amine", "label": "CONTACT_PHONE"},
    {"from": "fb_page_michelin_exp", "to": "phone_front_bilel", "label": "CONTACT_PHONE"},
    {"from": "fb_page_visas_express", "to": "phone_front_fares", "label": "CONTACT_PHONE"},
    {"from": "fb_page_tls_appointments", "to": "phone_front_sarah", "label": "CONTACT_PHONE"},
    {"from": "fb_page_destock_electro", "to": "phone_front_mourad", "label": "CONTACT_PHONE"},

    # Phones -> Operators
    {"from": "phone_front_amine", "to": "suspect_op_amine", "label": "USED_BY_OPERATOR"},
    {"from": "phone_front_bilel", "to": "suspect_op_bilel", "label": "USED_BY_OPERATOR"},
    {"from": "phone_front_fares", "to": "suspect_op_fares", "label": "USED_BY_OPERATOR"},
    {"from": "phone_front_sarah", "to": "suspect_op_sarah", "label": "USED_BY_OPERATOR"},
    {"from": "phone_front_mourad", "to": "suspect_op_mourad", "label": "USED_BY_OPERATOR"},

    # Phones -> BTS Triangulation
    {"from": "phone_front_amine", "to": "bts_oran_senia", "label": "CONNECTED_BTS"},
    {"from": "phone_front_sarah", "to": "bts_alger_kouba", "label": "CONNECTED_BTS"},
    {"from": "phone_lt_youcef", "to": "bts_blida_centre", "label": "CONNECTED_BTS"},
    {"from": "phone_lt_nadia", "to": "bts_const_univ", "label": "CONNECTED_BTS"},

    # Social Profiles OSINT
    {"from": "phone_front_amine", "to": "ig_auto_pieces_pro", "label": "LINKED_INSTAGRAM"},
    {"from": "phone_front_amine", "to": "ouedkniss_amine_2025", "label": "LINKED_OUEDKNISS"},
    {"from": "phone_front_fares", "to": "ig_visa_dz_officiel", "label": "LINKED_INSTAGRAM"},

    # Posts -> Websites
    {"from": "fb_post_pneus_98124", "to": "domain_pneus_express", "label": "EMBEDS_URL"},
    {"from": "fb_post_pneus_98177", "to": "domain_destock_auto", "label": "EMBEDS_URL"},
    {"from": "fb_post_visa_44102", "to": "domain_visa_schengen", "label": "EMBEDS_URL"},
    {"from": "fb_post_visa_44189", "to": "domain_visa_espana", "label": "EMBEDS_URL"},
    {"from": "fb_post_electro_7712", "to": "domain_destock_electro", "label": "EMBEDS_URL"},
    {"from": "fb_post_tv_7745", "to": "domain_gold_express", "label": "EMBEDS_URL"},

    # Websites -> Hosting IPs & Trackers
    {"from": "domain_pneus_express", "to": "ip_server_web_1", "label": "HOSTED_ON"},
    {"from": "domain_destock_auto", "to": "ip_server_web_1", "label": "HOSTED_ON"},
    {"from": "domain_destock_electro", "to": "ip_server_web_1", "label": "HOSTED_ON"},
    {"from": "domain_gold_express", "to": "ip_server_web_1", "label": "HOSTED_ON"},
    {"from": "domain_visa_schengen", "to": "ip_server_web_2", "label": "HOSTED_ON"},
    {"from": "domain_visa_espana", "to": "ip_server_web_2", "label": "HOSTED_ON"},

    # Websites -> Shared Meta Pixel & MongoDB
    {"from": "domain_pneus_express", "to": "meta_pixel_tracker", "label": "INJECTS_PIXEL"},
    {"from": "domain_destock_auto", "to": "meta_pixel_tracker", "label": "INJECTS_PIXEL"},
    {"from": "domain_destock_electro", "to": "meta_pixel_tracker", "label": "INJECTS_PIXEL"},
    {"from": "domain_pneus_express", "to": "mongodb_cluster", "label": "LOGS_LEADS_TO"},
    {"from": "domain_destock_auto", "to": "mongodb_cluster", "label": "LOGS_LEADS_TO"},

    # Websites -> APK CDN
    {"from": "domain_pneus_express", "to": "cdn_apps_server", "label": "HOSTS_DOWNLOAD_ON"},
    {"from": "domain_visa_schengen", "to": "cdn_apps_server", "label": "HOSTS_DOWNLOAD_ON"},
    {"from": "cdn_apps_server", "to": "evid_apk_pneu", "label": "DELIVERS_BINARY"},
    {"from": "cdn_apps_server", "to": "evid_apk_visa", "label": "DELIVERS_BINARY"},

    # APKs & Backend -> Developer Sofiane
    {"from": "evid_apk_pneu", "to": "keystore_apk_signature", "label": "SIGNED_BY"},
    {"from": "evid_apk_visa", "to": "keystore_apk_signature", "label": "SIGNED_BY"},
    {"from": "keystore_apk_signature", "to": "suspect_dev_sofiane", "label": "BELONGS_TO_DEV"},
    {"from": "domain_pneus_express", "to": "git_repo_public", "label": "EXPOSED_GIT_DIR"},
    {"from": "git_repo_public", "to": "git_commit_webhook", "label": "CONTAINED_IN_COMMIT"},
    {"from": "git_commit_webhook", "to": "suspect_dev_sofiane", "label": "COMMITTED_BY"},

    # Backend C2 & Webhooks -> Discord & Telegram
    {"from": "git_commit_webhook", "to": "discord_guild_c2", "label": "LEAKED_WEBHOOK_TO"},
    {"from": "discord_guild_c2", "to": "discord_ch_commandes", "label": "HAS_CHANNEL"},
    {"from": "discord_ch_commandes", "to": "evid_text_d01", "label": "CONTAINS_EVIDENCE"},
    {"from": "discord_ch_commandes", "to": "suspect_dev_sofiane", "label": "DEV_POSTS_BUILDS"},
    {"from": "discord_ch_commandes", "to": "suspect_boss_tarek", "label": "BOSS_ORDERS_CLONES"},
    {"from": "ip_server_c2_api", "to": "bot_telegram_leads", "label": "DISPATCHES_TO_BOT"},

    # Discord -> Telegram Invite Links
    {"from": "discord_guild_c2", "to": "tg_group_c2_vip", "label": "SHARED_VIP_INVITE"},
    {"from": "discord_guild_c2", "to": "tg_group_pneus_ops", "label": "SHARED_PNEU_INVITE"},
    {"from": "discord_guild_c2", "to": "tg_group_visas_ops", "label": "SHARED_VISA_INVITE"},
    {"from": "discord_guild_c2", "to": "tg_group_electro_ops", "label": "SHARED_ELECTRO_INVITE"},

    # Telegram Groups -> Audio Evidence
    {"from": "tg_group_c2_vip", "to": "evid_audio_a02", "label": "AUDIO_LEAK_BOSS"},
    {"from": "tg_group_c2_vip", "to": "evid_audio_a03", "label": "AUDIO_LEAK_NADIA"},
    {"from": "tg_group_c2_vip", "to": "evid_audio_a04", "label": "AUDIO_LEAK_FARID"},
    {"from": "tg_group_pneus_ops", "to": "evid_text_t01", "label": "CONTAINS_DIRECTIVE"},
    {"from": "suspect_op_amine", "to": "evid_audio_a01", "label": "RECORDED_SPEECH"},

    # Lieutenants -> Telegram Groups
    {"from": "suspect_lt_youcef", "to": "tg_group_pneus_ops", "label": "LEADS_CELL"},
    {"from": "suspect_lt_nadia", "to": "tg_group_visas_ops", "label": "LEADS_CELL"},
    {"from": "suspect_lt_farid", "to": "tg_group_electro_ops", "label": "LEADS_CELL"},

    # Operators -> Telegram Groups
    {"from": "suspect_op_amine", "to": "tg_group_pneus_ops", "label": "OPERATOR_IN_GROUP"},
    {"from": "suspect_op_bilel", "to": "tg_group_pneus_ops", "label": "OPERATOR_IN_GROUP"},
    {"from": "suspect_op_fares", "to": "tg_group_visas_ops", "label": "OPERATOR_IN_GROUP"},
    {"from": "suspect_op_sarah", "to": "tg_group_visas_ops", "label": "OPERATOR_IN_GROUP"},
    {"from": "suspect_op_mourad", "to": "tg_group_electro_ops", "label": "OPERATOR_IN_GROUP"},
    {"from": "suspect_op_lyes", "to": "tg_group_electro_ops", "label": "OPERATOR_IN_GROUP"},

    # Operators -> Lieutenants
    {"from": "suspect_op_amine", "to": "suspect_lt_youcef", "label": "REPORTS_TO_LT"},
    {"from": "suspect_op_bilel", "to": "suspect_lt_youcef", "label": "REPORTS_TO_LT"},
    {"from": "suspect_op_fares", "to": "suspect_lt_nadia", "label": "REPORTS_TO_LT"},
    {"from": "suspect_op_sarah", "to": "suspect_lt_nadia", "label": "REPORTS_TO_LT"},
    {"from": "suspect_op_mourad", "to": "suspect_lt_farid", "label": "REPORTS_TO_LT"},
    {"from": "suspect_op_lyes", "to": "suspect_lt_farid", "label": "REPORTS_TO_LT"},

    # Lieutenants -> The Boss
    {"from": "suspect_lt_youcef", "to": "suspect_boss_tarek", "label": "REPORTS_TO_BOSS"},
    {"from": "suspect_lt_nadia", "to": "suspect_boss_tarek", "label": "REPORTS_TO_BOSS"},
    {"from": "suspect_lt_farid", "to": "suspect_boss_tarek", "label": "REPORTS_TO_BOSS"},
    {"from": "suspect_dev_sofiane", "to": "suspect_boss_tarek", "label": "CONTRACTED_BY_BOSS"},

    # Financial Mules -> BaridiMob RIPs
    {"from": "mule_etudiant_1", "to": "rip_baridimob_mule1", "label": "ACCOUNT_HOLDER"},
    {"from": "mule_etudiant_2", "to": "rip_baridimob_mule2", "label": "ACCOUNT_HOLDER"},
    {"from": "mule_interimaire", "to": "rip_baridimob_mule3", "label": "ACCOUNT_HOLDER"},
    {"from": "mule_etudiante_3", "to": "rip_baridimob_mule1", "label": "RENTED_CARD"},

    # Cashier Kamel V. -> Mules
    {"from": "suspect_cashier_kamel", "to": "mule_etudiant_1", "label": "RENTS_CARD_FOR_15K"},
    {"from": "suspect_cashier_kamel", "to": "mule_etudiant_2", "label": "RENTS_CARD_FOR_15K"},
    {"from": "suspect_cashier_kamel", "to": "mule_interimaire", "label": "RENTS_CARD_FOR_15K"},
    {"from": "suspect_cashier_kamel", "to": "mule_etudiante_3", "label": "RENTS_CARD_FOR_15K"},
    {"from": "suspect_cashier_kamel", "to": "rip_baridimob_mule1", "label": "DRAWS_CASH_FROM_ATM"},
    {"from": "suspect_cashier_kamel", "to": "rip_baridimob_mule2", "label": "DRAWS_CASH_FROM_ATM"},
    {"from": "suspect_cashier_kamel", "to": "rip_baridimob_mule3", "label": "DRAWS_CASH_FROM_ATM"},

    # Cashier -> Binance P2P & Crypto
    {"from": "suspect_cashier_kamel", "to": "binance_p2p_account", "label": "DELIVERS_CASH_FOR_USDT"},
    {"from": "binance_p2p_account", "to": "crypto_wallet_trc20", "label": "TRANSFERS_USDT_TRC20"},
    {"from": "suspect_boss_tarek", "to": "crypto_wallet_trc20", "label": "CONTROLS_PRIVATE_KEY"},
    {"from": "suspect_boss_tarek", "to": "binance_p2p_account", "label": "MANAGES_P2P_MERCHANT"},

    # Shell Companies & Syndicate Synthesis
    {"from": "suspect_lt_youcef", "to": "shell_societe_ouest", "label": "OPERATES_FAKE_CORP"},
    {"from": "suspect_lt_nadia", "to": "shell_agence_voyage", "label": "OPERATES_FAKE_AGENCY"},
    {"from": "suspect_boss_tarek", "to": "syndicate_entity_global", "label": "HEADS_CRIME_SYNDICATE"},
    {"from": "suspect_lt_youcef", "to": "syndicate_entity_global", "label": "BRANCH_HEAD_PNEUS"},
    {"from": "suspect_lt_nadia", "to": "syndicate_entity_global", "label": "BRANCH_HEAD_VISAS"},
    {"from": "suspect_lt_farid", "to": "syndicate_entity_global", "label": "BRANCH_HEAD_ELECTRO"}
]

print(f"[+] Exactly {len(EDGES)} forensic relationship edges defined.")

# -----------------------------------------------------------------------------
# 3. WRITE TO JSON & JS
# -----------------------------------------------------------------------------
# Load original metadata structure
CASE_DATA_FILE = "doc/assets/mock-case-candy-wheels.json"
with open(CASE_DATA_FILE, "r", encoding="utf-8") as f:
    case_obj = json.load(f)

case_obj["graph_representation"] = {
    "total_nodes": len(NODES),
    "total_edges": len(EDGES),
    "nodes": NODES,
    "edges": EDGES
}

with open(CASE_DATA_FILE, "w", encoding="utf-8") as f:
    json.dump(case_obj, f, indent=2, ensure_ascii=False)

with open("doc/assets/mock-case-candy-wheels.js", "w", encoding="utf-8") as f:
    f.write(f"// Athar DZ Mock Case Data — 100 Forensic Nodes\nwindow.CASE_CANDY_WHEELS = {json.dumps(case_obj, indent=2, ensure_ascii=False)};\n")

print("[+] Updated mock-case-candy-wheels.json and mock-case-candy-wheels.js with 100 nodes!")
