import json
import os
import hashlib

SEED_PATH = os.path.abspath(r"C:\Users\adel\Documents\IC\Athar_DZ\apps\studio-app\backend\app\db\seed_data\mock-case-candy-wheels.json")
AUDIO_DIR = os.path.abspath(r"C:\Users\adel\Documents\IC\Athar_DZ\apps\studio-app\frontend\public\audio")

def get_file_sha256(filepath):
    if not os.path.exists(filepath):
        return "c4f8209e86a117d3b5b9e02c9147d3328e340a1b89efbc99304a298f24419aa7"
    with open(filepath, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

with open(SEED_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

nodes = data["graph_representation"]["nodes"]

# Audio hashes
h_a01 = get_file_sha256(os.path.join(AUDIO_DIR, "evid_a01.wav"))
h_a02 = get_file_sha256(os.path.join(AUDIO_DIR, "evid_a02.wav"))
h_a03 = get_file_sha256(os.path.join(AUDIO_DIR, "evid_a03.wav"))
h_a04 = get_file_sha256(os.path.join(AUDIO_DIR, "evid_a04.wav"))

for n in nodes:
    nid = n["id"]
    ntype = n["type"]
    label = n["label"]
    meta = n.setdefault("meta", {})

    # 1. KINGPIN & LIEUTENANTS & SUSPECTS
    if nid == "suspect_boss_tarek":
        meta["photo_url"] = "/images/evidence/suspect_tarek_hadj.jpg"
        meta["full_name"] = "Tarek Hadj-Ali"
        meta["alias"] = "El-Hadj / The Ghost"
        meta["nin"] = "197816010049281042"
        meta["date_of_birth"] = "14/05/1978 (48 ans)"
        meta["birth_place"] = "Alger-Centre, Wilaya d'Alger"
        meta["procedural_status"] = "MANDAT D'ARRÊT INTERNATIONAL — NOTICE ROUGE INTERPOL"
        meta["role_judicial"] = "Commanditaire & Tête de Réseau Présumé"
        meta["charges"] = "Escroquerie en bande organisée, blanchiment d'argent illicite, faux et usage de faux dans les transactions électroniques (Art. 372 du Code Pénal, Loi 09-04 relative aux TIC)"
        meta["mandate_ref"] = "MANDAT-INTERPOL-DZ-2026-089-R"
        meta["risk_level"] = "TRÈS ÉLEVÉ — SUSPECT EN FUITE"
        meta["seized_assets"] = "3 comptes BaridiMob (33,5M DZD), 1 wallet crypto (140 000 USDT)"

    elif nid == "suspect_lt_youcef":
        meta["photo_url"] = "/images/evidence/suspect_youcef_hacker.jpg"
        meta["full_name"] = "Youcef Rahmani"
        meta["alias"] = "Jo_Blida / Jo-Pneus"
        meta["nin"] = "199209020084729103"
        meta["date_of_birth"] = "03/11/1992 (34 ans)"
        meta["birth_place"] = "Boufarik, Wilaya de Blida"
        meta["procedural_status"] = "DÉTENTION PROVISOIRE — CENTRE PÉNITENTIAIRE DE BLIDA"
        meta["role_judicial"] = "Lieutenant Opérationnel — Responsable Faux Pneus"
        meta["charges"] = "Supervision de la fausse logistique, création de faux bons de commande SARL Ouest Pneumatiques, encaissement frauduleux"
        meta["pv_reference"] = "PV N° 412/2026 — Brigade de Recherches de la Gendarmerie de Bab Ezzouar"

    elif nid == "suspect_lt_nadia":
        meta["photo_url"] = "/images/evidence/suspect_nadia_dina.jpg"
        meta["full_name"] = "Nadia Mansour"
        meta["alias"] = "Dina / Nadia-Visas"
        meta["nin"] = "199516040019284729"
        meta["date_of_birth"] = "22/02/1995 (31 ans)"
        meta["birth_place"] = "Hussein Dey, Wilaya d'Alger"
        meta["procedural_status"] = "SOUS CONTRÔLE JUDICIAIRE — INTERDICTION DE SORTIE DU TERRITOIRE (ISTN)"
        meta["role_judicial"] = "Lieutenante Opérationnelle — Responsable Faux Visas & TLSContact"
        meta["charges"] = "Faux et usage de faux documents administratifs, usurpation de portails diplomatiques, extorsion d'acomptes"

    elif nid == "suspect_dev_sofiane":
        meta["photo_url"] = "/images/evidence/suspect_youcef_hacker.jpg"
        meta["full_name"] = "Sofiane Khelifi"
        meta["alias"] = "Sofi-Dev / RootDZ"
        meta["nin"] = "199725010078392019"
        meta["date_of_birth"] = "18/09/1997 (29 ans)"
        meta["birth_place"] = "Constantine"
        meta["procedural_status"] = "GARDE À VUE 48H — CENTRE CYBERCRIMINALITÉ ALGER"
        meta["role_judicial"] = "Concepteur Technique & Développeur Malware APK"
        meta["charges"] = "Développement et diffusion de l'application espionne 'AutoPneusDZ.apk', interception de flux bancaires"

    elif nid == "suspect_cashier_kamel":
        meta["photo_url"] = "/images/evidence/suspect_tarek_hadj.jpg"
        meta["full_name"] = "Kamel V. dit Le Caissier"
        meta["nin"] = "198516020055219018"
        meta["procedural_status"] = "GARDE À VUE 48H — CCO ALGER"
        meta["role_judicial"] = "Coordinateur des Mules & Retraits BaridiMob"
        meta["charges"] = "Association de malfaiteurs, organisation de retraits fractionnés d'argent liquide"

    # 2. VICTIMS
    elif ntype == "VICTIM":
        meta["procedural_status"] = "PARTIE CIVILE — PLAINTE ENREGISTRÉE AU PARQUET"
        if nid == "vic_01_karim" or "karim" in nid.lower():
            meta["photo_url"] = "/images/evidence/victim_karim_zerrouki.jpg"
            meta["profession"] = "Chauffeur Taxi / VTC (Bab Ezzouar)"
            meta["prejudice"] = "64 000 DZD (Reçu BaridiMob n° TXN-20261108-994102)"
            meta["scellé_audio"] = "Pièce A-01 (Vocal WhatsApp reçu d'Amine B.)"
            meta["pv_audition"] = "PV d'audition n° 108/2026 — Sûreté de Daïra Bab Ezzouar"
        elif nid == "vic_02_meriem" or "meriem" in nid.lower():
            meta["photo_url"] = "/images/evidence/suspect_nadia_dina.jpg"
            meta["profession"] = "Enseignante de Lycée (Bir El Djir, Oran)"
            meta["prejudice"] = "48 000 DZD (Acompte 50% Michelin Energy)"
            meta["pv_audition"] = "PV n° 88/2026 — 4ème Sûreté Urbaine Bir El Djir"
        elif nid == "vic_03_djamel" or "djamel" in nid.lower():
            meta["profession"] = "Gérant Flotte Utilitaires (Ouled Yaïch, Blida)"
            meta["prejudice"] = "120 000 DZD (Débit double via AutoPneusDZ.apk)"
            meta["pv_audition"] = "PV n° 312/2026 — Brigade Économique & Financière Blida"
        else:
            meta["profession"] = "Commerçant / Particulier victime de cyber-escroquerie"
            meta["pv_audition"] = f"PV de plainte versé au dossier CANDY-WHEELS-DZ"

    # 3. AUDIO RECORDINGS
    elif ntype == "AUDIO_RECORDING":
        if nid == "evid_audio_a01" or "a01" in nid:
            meta["audio_url"] = "/audio/evid_a01.wav"
            meta["audio_duration"] = "0:42"
            meta["hash_sha256"] = h_a01
            meta["intercept_speaker"] = "Amine B. (Opérateur Commercial)"
            meta["intercept_target"] = "Karim Zerrouki (+213 661 44 12 89)"
            meta["intercept_channel"] = "WhatsApp Audio / AMR-NB"
            meta["voiceprint_match"] = "96.2%"
            meta["transcript_darija"] = "Khouya Karim, salam alaykoum. Les quatre pneus Michelin rahoum réservés b'smitek fel dépôt taâ Boufarik. Bessah la promo hadhi fiha demande kbira. Versi les 64 000 da f'had le compte BaridiMob li b'ath'toulak, w b'athli le reçu f'WhatsApp..."
            meta["transcript_french"] = "Frère Karim, salam alaykoum. Les 4 pneus Michelin sont réservés à ton nom au dépôt de Boufarik. Mais la promo a une forte demande. Verse les 64 000 DZD sur le compte BaridiMob et transmets le reçu..."
        elif nid == "evid_audio_a02" or "a02" in nid:
            meta["audio_url"] = "/audio/evid_a02.wav"
            meta["audio_duration"] = "0:35"
            meta["hash_sha256"] = h_a02
            meta["intercept_speaker"] = "Tarek H. (« El-Hadj »)"
            meta["intercept_target"] = "Youcef R. (Lieutenant Pneus)"
            meta["intercept_channel"] = "Telegram Call / Interception CCO"
            meta["voiceprint_match"] = "98.7%"
            meta["transcript_darija"] = "Youcef, smaâni mlih. La cellule pneus rahi t'dirlna 600 000 da par jour had la semaine, c’est bien bessah les plaintes b'daw y'kethrou f'Facebook. Ghleq les trois pages ghedwa s'bah, w khéli Sofiane y'lansi les trois nouveaux sites..."
            meta["transcript_french"] = "Youcef, écoute-moi bien. La cellule pneus rapporte 600 000 DZD/jour mais les plaintes s'accumulent sur Facebook. Ferme les 3 pages demain matin et laisse Sofiane lancer les 3 nouveaux sites..."
        elif nid == "evid_audio_a03" or "a03" in nid:
            meta["audio_url"] = "/audio/evid_a03.wav"
            meta["audio_duration"] = "0:29"
            meta["hash_sha256"] = h_a03
            meta["intercept_speaker"] = "Nadia M. (« Dina »)"
            meta["intercept_target"] = "Comité C2 Direction"
            meta["intercept_channel"] = "Telegram Vocal Chiffré"
            meta["voiceprint_match"] = "95.1%"
            meta["transcript_darija"] = "Boss, el-hamdullah le nouveau script taâ Sofiane pour les rendez-vous TLS rah yemchi 10/10. Les opérateurs diali f'Constantine jawbou plus de 80 clients had sbeh. Derna 2,4 millions de dinars d'acomptes..."
            meta["transcript_french"] = "Boss, le nouveau script de Sofiane pour les rendez-vous TLS marche à 100%. Mes opérateurs à Constantine ont répondu à 80 clients ce matin. Nous avons cumulé 2,4 millions de dinars d'acomptes..."
        else:
            meta["audio_url"] = "/audio/evid_a04.wav"
            meta["audio_duration"] = "0:24"
            meta["hash_sha256"] = h_a04
            meta["intercept_speaker"] = "Interception Ligne Coordination"
            meta["intercept_target"] = "Kamel V. (Le Caissier)"
            meta["intercept_channel"] = "Réseau Mobile Djezzy"
            meta["voiceprint_match"] = "94.0%"
            meta["transcript_darija"] = "Allô Kamel, l'argent taâ Oran dkhoul fel BaridiMob... Jebed 200 000 da men la poste taâ Bab El Oued w khéli le reste pour Sofiane..."
            meta["transcript_french"] = "Allô Kamel, l'argent d'Oran est arrivé sur BaridiMob... Retire 200 000 DZD au bureau de poste de Bab El Oued et laisse le reste pour Sofiane..."

    # 4. BANK ACCOUNTS
    elif ntype == "BANK_ACCOUNT":
        meta["photo_url"] = "/images/evidence/baridimob_edahabia_card.jpg"
        meta["type_support"] = "Carte Edahabia Or EMV — Algérie Poste"
        meta["rip"] = meta.get("rip", "00799999002148593214")
        meta["status_judiciaire"] = "GEL AML CONSERVATOIRE — ALGÉRIE POSTE & CELLULE CTRF"
        meta["total_credits"] = "18 420 000 DZD en 21 jours"
        meta["retraits_guichet"] = "Bureaux de Poste : Bab El Oued, Boufarik, Bir El Djir"

    # 5. VEHICULES
    elif ntype == "vehicule" or "vehicule" in nid.lower() or "peugeot" in label.lower():
        meta["photo_url"] = "/images/evidence/suspect_car_peugeot208.jpg"
        meta["matricule"] = "12345 126 16"
        meta["brand_model"] = "Peugeot 208 Active Blanche"
        meta["owner"] = "Kamel V. (Prête-nom)"
        meta["vin"] = "VF3CCHMZ6ET109284"
        meta["status_recherche"] = "AVIS DE RECHERCHE & SAISIE CONSERVATOIRE"

    # 6. PHONES & BTS
    elif ntype == "PHONE_NUMBER":
        meta["intercept_order"] = "RÉQUISITION TÉLÉCOM ART. 65 CODE PROCÉDURE PÉNALE"
        meta["operator"] = "Mobilis" if "661" in label else "Djezzy" if "770" in label else "Ooredoo"
        meta["status"] = "SURVEILLANCE ACTIVE & GÉOLOCALISATION TRI-CELLULAIRE"
    elif ntype == "TELECOM_CELL":
        meta["cell_type"] = "Station BTS / NodeB 4G LTE"
        meta["couverture_radius"] = "1.2 km à 2.5 km"
        meta["releve_bornage"] = "Correspondance temporelle avec appels de scam confirmée"

with open(SEED_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully enriched {len(nodes)} nodes with realistic forensic Algerian data!")
