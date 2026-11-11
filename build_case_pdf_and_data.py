#!/usr/bin/env python3
"""
Script to generate:
1. Rapport_Investigation_ATHAR-2026-SCAM-089.pdf (Official Judicial Police Synthesis Report)
2. doc/assets/mock-case-candy-wheels.json (Full machine-readable mock case dataset)
3. doc/assets/mock-case-candy-wheels.js (Client-side JS module for Athar DZ mock)
"""

import os
import sys
import json
import shutil
import subprocess

REPORT_HTML_PATH = "Rapport/rapport_investigation_ATHAR-2026-SCAM-089.html"
REPORT_PDF_PATH = "Rapport/Rapport_Investigation_ATHAR-2026-SCAM-089.pdf"
DOC_ASSETS_PDF = "doc/assets/Rapport_Investigation_ATHAR-2026-SCAM-089.pdf"
MOCK_JSON_PATH = "doc/assets/mock-case-candy-wheels.json"
MOCK_JS_PATH = "doc/assets/mock-case-candy-wheels.js"

# -------------------------------------------------------------------------
# 1. HTML REPORT DEFINITION
# -------------------------------------------------------------------------
HTML_REPORT = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Procès-Verbal de Synthèse d'Investigation — Dossier #2026-SCAM-089</title>
<style>
  @page {
    size: A4 portrait;
    margin: 12mm 15mm 15mm 15mm;
  }
  @page :left {
    @bottom-left {
      content: "Dossier #2026-SCAM-089 • CONFIDENTIEL JUDICIAIRE";
      font-size: 8pt;
      font-family: sans-serif;
      color: #64748b;
    }
    @bottom-right {
      content: "Page " counter(page);
      font-size: 8pt;
      font-family: sans-serif;
      color: #64748b;
    }
  }
  @page :right {
    @bottom-left {
      content: "Dossier #2026-SCAM-089 • CONFIDENTIEL JUDICIAIRE";
      font-size: 8pt;
      font-family: sans-serif;
      color: #64748b;
    }
    @bottom-right {
      content: "Page " counter(page);
      font-size: 8pt;
      font-family: sans-serif;
      color: #64748b;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Liberation Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    font-size: 9.5pt;
    line-height: 1.45;
    margin: 0;
    padding: 0;
  }

  /* Header official banner */
  .official-header {
    text-align: center;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 8px;
    margin-bottom: 14px;
  }
  .rep-title {
    font-size: 11pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #0f172a;
    margin: 0 0 2px 0;
  }
  .rep-sub {
    font-size: 8.5pt;
    font-weight: 600;
    color: #334155;
    margin: 1px 0;
  }
  .rep-dept {
    font-size: 8pt;
    color: #64748b;
    margin: 1px 0;
  }

  /* Case Header Box */
  .case-banner {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 5px solid #0284c7;
    border-radius: 4px;
    padding: 10px 14px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .case-title {
    font-size: 13pt;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 3px 0;
  }
  .case-meta {
    font-size: 8.5pt;
    color: #475569;
  }
  .stamp-box {
    text-align: right;
  }
  .badge {
    display: inline-block;
    padding: 3px 7px;
    border-radius: 3px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .badge-danger { background: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
  .badge-success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
  .badge-info { background: #e0f2fe; color: #075985; border: 1px solid #7dd3fc; }
  .badge-purple { background: #f3e8ff; color: #6b21a8; border: 1px solid #d8b4fe; }

  /* Headings */
  h2.sec-heading {
    font-size: 10.5pt;
    font-weight: 800;
    text-transform: uppercase;
    color: #0f172a;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 3px;
    margin-top: 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  h2.sec-heading .sec-num {
    background: #0f172a;
    color: #fff;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 8.5pt;
  }
  h3.subsec-heading {
    font-size: 9.5pt;
    font-weight: 700;
    color: #1e293b;
    margin: 8px 0 4px 0;
  }

  p {
    margin: 0 0 6px 0;
    text-align: justify;
  }

  /* Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin: 6px 0 10px 0;
  }
  table.data-table th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    text-align: left;
    padding: 5px 8px;
    border: 1px solid #0f172a;
  }
  table.data-table td {
    padding: 4px 8px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }
  table.data-table tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* Monospace snippet */
  .mono {
    font-family: 'Liberation Mono', 'Courier New', monospace;
    font-size: 7.8pt;
  }

  /* Callout & Evidences */
  .evidence-box {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #3b82f6;
    border-radius: 4px;
    padding: 8px 10px;
    margin: 6px 0 10px 0;
    page-break-inside: avoid;
  }
  .evidence-box.voice {
    border-left-color: #10b981;
    background: #f0fdf4;
  }
  .evidence-box.discord {
    border-left-color: #6366f1;
    background: #eef2ff;
  }
  .evidence-header {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    font-size: 8.5pt;
    margin-bottom: 4px;
    color: #0f172a;
  }
  .transcript-quote {
    font-style: italic;
    background: #ffffff;
    border: 1px dashed #cbd5e1;
    padding: 6px 8px;
    border-radius: 3px;
    margin: 4px 0;
    font-size: 8.5pt;
  }
  .translation-quote {
    font-size: 8.5pt;
    color: #334155;
    margin: 3px 0;
  }

  /* Hierarchy chart */
  .hierarchy-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 8px 0;
    page-break-inside: avoid;
  }
  .card-node {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 8pt;
  }
  .card-node.boss {
    grid-column: span 3;
    background: #fef2f2;
    border: 1.5px solid #dc2626;
  }
  .card-node.dev {
    grid-column: span 3;
    background: #f5f3ff;
    border: 1.5px solid #7c3aed;
  }
  .card-node.lt {
    background: #eff6ff;
    border: 1px solid #3b82f6;
  }

  .kpi-row {
    display: flex;
    gap: 8px;
    margin: 8px 0;
  }
  .kpi-pill {
    flex: 1;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 6px;
    text-align: center;
  }
  .kpi-pill .val {
    font-size: 12pt;
    font-weight: 800;
    color: #0f172a;
  }
  .kpi-pill .lbl {
    font-size: 7pt;
    color: #64748b;
    text-transform: uppercase;
  }

  .signature-block {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    page-break-inside: avoid;
  }
  .sig-col {
    width: 45%;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 8pt;
    background: #fafafa;
  }
  .sig-space {
    height: 45px;
    border-bottom: 1px dashed #94a3b8;
    margin-bottom: 4px;
  }

  .page-break {
    page-break-after: always;
  }
</style>
</head>
<body>

  <!-- Official Republic Header -->
  <div class="official-header">
    <div class="rep-title">République Algérienne Démocratique et Populaire</div>
    <div class="rep-sub">Ministère de la Justice • Cour d'Alger</div>
    <div class="rep-sub">Pôle Pénal Spécialisé de Lutte Contre la Cybercriminalité et les Infractions Liées aux TIC</div>
    <div class="rep-dept">Division des Enquêtes Criminelles Numériques & Plateforme Forensique Athar DZ (أثر)</div>
  </div>

  <!-- Case Header Banner -->
  <div class="case-banner">
    <div>
      <div class="case-title">PROCÈS-VERBAL DE SYNTHÈSE D'ENQUÊTE NUMÉRIQUE & OSINT</div>
      <div class="case-meta">
        <strong>Affaire :</strong> Opération « CANDY WHEELS » (Réseau Multi-Scam Algérie) • 
        <strong>Réf. Parquet :</strong> N° 2026/PPN-TIC/089<br>
        <strong>Registre des Scellés Numériques :</strong> #ATHAR-2026-SCAM-089-LOK • 
        <strong>Horodatage TSA :</strong> 10 Nov 2026 15:45:00 UTC
      </div>
    </div>
    <div class="stamp-box">
      <span class="badge badge-danger">CONFIDENTIEL JUDICIAIRE</span><br>
      <span class="badge badge-success" style="margin-top:4px;">PREUVES SCELLÉES RFC 3161</span>
    </div>
  </div>

  <!-- KPIs Overview -->
  <div class="kpi-row">
    <div class="kpi-pill">
      <div class="val">33 500 000 DZD</div>
      <div class="lbl">Préjudice Global Constaté</div>
    </div>
    <div class="kpi-pill">
      <div class="val">285+</div>
      <div class="lbl">Victimes Recensées (Serveur C2)</div>
    </div>
    <div class="kpi-pill">
      <div class="val">3 Cellules</div>
      <div class="lbl">Pneus • Visas • Électro</div>
    </div>
    <div class="kpi-pill">
      <div class="val">100% OSINT</div>
      <div class="lbl">Méthode de Résolution</div>
    </div>
  </div>

  <!-- SECTION 1 -->
  <h2 class="sec-heading"><span class="sec-num">I</span> Cadre Légal et Saisine du Pôle Judiciaire</h2>
  <p>
    En date du 10 novembre 2026, agissant en vertu des articles 12, 17 et 68 du Code de Procédure Pénale, ainsi que des dispositions spécifiques de la <strong>Loi n° 09-04 du 5 août 2009</strong> portant règles particulières relatives à la prévention et à la lutte contre les infractions liées aux technologies de l'information et de la communication, et des <strong>articles 372 et 394 bis à sexies du Code Pénal</strong> (escroquerie en bande organisée, atteintes aux STAD, faux et usage de faux numériques), la brigade spécialisée a diligenté une enquête préliminaire numérique suite à la convergence de multiples plaintes de citoyens victimes d'offres frauduleuses de vente de pneumatiques de marque Michelin sur les réseaux sociaux.
  </p>

  <!-- SECTION 2 -->
  <h2 class="sec-heading"><span class="sec-num">II</span> Recueil et Audition des 3 Victimes Déclarantes</h2>
  <p>Trois victimes principales ont initié la saisine par dépôts de plaintes numériques circonstanciées, accompagnées de l'ensemble de leurs archives de communication :</p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Victime</th>
        <th>Wilaya</th>
        <th>Profession</th>
        <th>Préjudice</th>
        <th>Moyen de Contact &amp; Mode Opératoire</th>
        <th>Justificatif BaridiMob</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Karim Zerrouki</strong><br><span class="mono">+213 661 44 12 89</span></td>
        <td>Bab Ezzouar (Alger)</td>
        <td>Chauffeur VTC / Taxi</td>
        <td><strong>64 000 DZD</strong><br>(4 pneus Michelin 205/55 R16)</td>
        <td>Annonce Facebook Marketplace #98124. Contact WhatsApp avec le numéro <span class="mono">+213 555 019 283</span>. Envoi d'une note vocale en Darija certifiant une livraison express par Yalidine à domicile.</td>
        <td>Virement BaridiMob N° <span class="mono">TXN-20261108-994102</span> vers le compte CCP/RIP <span class="mono">00799999002148593214</span>. Bloqué après envoi du reçu.</td>
      </tr>
      <tr>
        <td><strong>Meriem Benali</strong><br><span class="mono">+213 770 82 91 30</span></td>
        <td>Bir El Djir (Oran)</td>
        <td>Enseignante de lycée</td>
        <td><strong>48 000 DZD</strong><br>(Acompte 50% Michelin Energy)</td>
        <td>Page Facebook « Pneus Promo Algérie ». Réception d'un faux bon de commande PDF à en-tête d'une société fictive « SARL Ouest Pneumatiques » et messages audio WhatsApp rassurants.</td>
        <td>Virement BaridiMob N° <span class="mono">TXN-20261108-994145</span> vers le même RIP. Numéro bloqué dès confirmation.</td>
      </tr>
      <tr>
        <td><strong>Djamel E. Mansouri</strong><br><span class="mono">+213 550 19 63 74</span></td>
        <td>Ouled Yaïch (Blida)</td>
        <td>Gérant de micro-flotte</td>
        <td><strong>120 000 DZD</strong><br>(8 pneus utilitaires Agilis)</td>
        <td>Incitations via SMS à installer l'application mobile Android <span class="mono">AutoPneusDZ.apk</span> pour bénéficier du « Tarif Entreprise ». Faux portail de paiement BaridiMob intégré.</td>
        <td>Deux débits successifs de 60 000 DZD vers deux comptes BaridiMob distincts générés dynamiquement par l'application.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h2 class="sec-heading"><span class="sec-num">III</span> Inventaire des Scellés Numériques d'Origine</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>Scellé</th>
        <th>Désignation de la Preuve</th>
        <th>Source / Localisation</th>
        <th>Empreinte SHA-256 Certifiée</th>
        <th>Statut Chaîne de Garde</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="mono">P-01</td>
        <td>Archive snapshot Annonce FB #98124</td>
        <td>fb.com/pneus.promo.dz</td>
        <td class="mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</td>
        <td><span class="badge badge-success">Scellé RFC 3161</span></td>
      </tr>
      <tr>
        <td class="mono">P-02</td>
        <td>Archive snapshot Pages FB satellites</td>
        <td>fb.com/michelin.express.livraison</td>
        <td class="mono">8a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890</td>
        <td><span class="badge badge-success">Scellé RFC 3161</span></td>
      </tr>
      <tr>
        <td class="mono">P-03</td>
        <td>Extraction Ligne Télécom Pivot</td>
        <td>WhatsApp / MSISDN +213 555 019 283</td>
        <td class="mono">7f1a3b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a</td>
        <td><span class="badge badge-success">Scellé RFC 3161</span></td>
      </tr>
      <tr>
        <td class="mono">P-04</td>
        <td>Code binaire APK AutoPneusDZ</td>
        <td>cdn.dz-services-cloud.com/apps</td>
        <td class="mono">4a7c8e9b01d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8</td>
        <td><span class="badge badge-success">Scellé RFC 3161</span></td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECTION 4 -->
  <h2 class="sec-heading"><span class="sec-num">IV</span> Enquête 100% OSINT : La Chaîne des Découvertes Numériques</h2>
  <p>
    La résolution de l'ensemble de l'affaire a été conduite <strong>sans aucune intervention physique préalable</strong>, par l'exploitation des failles de sécurité opérationnelle (OPSEC) et des traces publiques laissées par les criminels :
  </p>

  <h3 class="subsec-heading">1. Découverte du Développeur via la Fuite Git du Serveur Web</h3>
  <p>
    L'analyse de l'infrastructure web hébergeant la boutique frauduleuse <span class="mono">promo-pneus-express.shop</span> a révélé la présence d'un répertoire <span class="mono">/.git</span> laissé publiquement indexable. La reconstruction des fichiers de configuration (<span class="mono">/.git/config</span>) a mis en évidence le dépôt distant GitHub d'origine et l'auteur des commits :
  </p>
  <ul>
    <li><strong>Identité du Développeur :</strong> Sofiane K. (28 ans, Bab Ezzouar, Alger).</li>
    <li><strong>E-mail Git &amp; Compte Développeur :</strong> <span class="mono">sofiane.devbox99@gmail.com</span> • Profil GitHub : <span class="mono">github.com/soficoder-alger</span>.</li>
    <li><strong>Keystore APK :</strong> L'analyse du paquet <span class="mono">AutoPneusDZ.apk</span> confirme la signature numérique avec le certificat <span class="mono">CN=Sofiane K., OU=DevAlger</span>.</li>
  </ul>

  <h3 class="subsec-heading">2. Détection du Webhook Discord et Infiltration du Hub Technique</h3>
  <p>
    Dans le dépôt GitHub public du développeur (<span class="mono">soficoder-alger/dz-shop-template</span>), l'inspection de l'historique des commits a permis d'isoler un webhook Discord accidentellement commis. Ce webhook a servi de vecteur pour localiser le serveur privé Discord de supervision technique :
  </p>
  <ul>
    <li><strong>Serveur Discord Infiltré :</strong> <span class="mono">« DZ-Dev &amp; Ops Hub »</span> (ID: <span class="mono">119830129480192840</span>).</li>
    <li><strong>Intervenants Identifiés :</strong> Le Développeur (<span class="mono">SofianeDev#4401</span>), Le Cerveau (<span class="mono">ElHadj_99#0001</span>), et les 3 Lieutenants de cellule (<span class="mono">Jo_Blida</span>, <span class="mono">Dina_Consult</span>, <span class="mono">Kika_Annaba</span>).</li>
    <li><strong>Rôle du Serveur :</strong> Commande et livraison des builds d'APKs, centralisation des alertes de victimes et distribution des comptes BaridiMob des mules financières.</li>
  </ul>

  <h3 class="subsec-heading">3. Des Salons Discord vers les 4 Groupes Clandestins Telegram</h3>
  <p>
    La surveillance passive des canaux de coordination a permis de capturer des liens d'invitation privés révoquables menant directement aux espaces de discussion opérationnels sur Telegram :
  </p>
  <ul>
    <li><strong>Canal VIP Direction C2 (<span class="mono">t.me/+Hd99_Management_C2</span>) :</strong> Réunit exclusivement le Boss (« El-Hadj »), les 3 Lieutenants et le Développeur. Arbitrage financier et blanchiment.</li>
    <li><strong>Groupe Opérationnel Pneus (<span class="mono">t.me/+Ab91k_PneuOps</span>) :</strong> Dirigé par Youcef R. alias « Jo_Blida ». C'est ici que l'opérateur Amine B. (<span class="mono">@amine_import</span>) rendait compte du démarchage des 3 victimes (Karim, Meriem, Djamel).</li>
    <li><strong>Groupe Opérationnel Visas (<span class="mono">t.me/+Vz82k_VisaOps</span>) :</strong> Dirigé par Nadia M. alias « Dina_Consult » (escroquerie aux rendez-vous consulaires TLSContact/VFS).</li>
    <li><strong>Groupe Opérationnel Électro &amp; Or (<span class="mono">t.me/+Lx44k_ElectroOps</span>) :</strong> Dirigé par Farid T. alias « Kika_Annaba » (escroquerie au déstockage multimédia).</li>
  </ul>

  <!-- SECTION 5 -->
  <h2 class="sec-heading"><span class="sec-num">V</span> Preuves Matérielles Scellées : Textes &amp; Enregistrements Vocaux</h2>

  <!-- Piece A-01 -->
  <div class="evidence-box voice">
    <div class="evidence-header">
      <span>🎙️ PIÈCE A-01 : Note Vocale WhatsApp — Amine B. (Opérateur) à la Victime Karim Zerrouki</span>
      <span class="badge badge-success">Biométrie Vocale : 96%</span>
    </div>
    <div class="mono" style="font-size:7.5pt;color:#64748b;margin-bottom:3px;">
      Fichier: AUDIO_EVID_WA_20261108_AMINE_KARIM.ogg • SHA-256: a9f3b7c841e2d93e15f40192b0c39a8e23f18b27...
    </div>
    <div class="transcript-quote">
      « Khouya Karim, salam alaykoum. Les quatre pneus Michelin rahoum réservés b'smitek fel dépôt taâ Boufarik. Bessah la promo hadhi fiha demande kbira. Versi les 64 000 da f'had le compte BaridiMob li b'ath'toulak, w b'athli le reçu f'WhatsApp. Ghedwa à 10h le livreur Yalidine ykoun 3andek f'Bab Ezzouar ywerilek le bon w y'hathafelek. Mat’khafch khouya, kolch garanti b'la facture. »
    </div>
    <div class="translation-quote">
      <strong>Traduction Assermentée :</strong> <em>« Frère Karim, salut à toi. Les 4 pneus Michelin sont réservés à ton nom au dépôt de Boufarik. Mais la promo a une forte demande. Verse les 64 000 DZD sur le compte BaridiMob communiqué et transmets le reçu par WhatsApp. Demain à 10h le livreur Yalidine sera chez toi à Bab Ezzouar avec le bon de livraison. Ne crains rien, tout est garanti avec facture légale. »</em>
    </div>
  </div>

  <!-- Piece T-01 -->
  <div class="evidence-box">
    <div class="evidence-header">
      <span>💬 PIÈCE T-01 : Directive du Lieutenant Youcef R. dans le Groupe Telegram « Pneus DZ »</span>
      <span class="badge badge-info">Scellé Numérique</span>
    </div>
    <div class="mono" style="font-size:7.5pt;color:#64748b;margin-bottom:3px;">
      Fichier: TELEGRAM_LOG_PNEU_20261108.json • Canal: t.me/+Ab91k_PneuOps • 08/11/2026 à 20h05 UTC
    </div>
    <div class="transcript-quote">
      « @amine_import @bilel Yaâtikoum essaheha el-youm. Amine, le client taxi taâ Bab Ezzouar li b'ath 64k w bent Oran li b'athet 48k, bloquihoum men WhatsApp direct. Ma t'jawbouhoumch fel téléphone. Goullelhoum "le camion raho en panne f'l'autoroute" après blocage. Khelliw les reçus f'le drive taâ Kamel bech y'vidi les cartes fel GAB qbel 23h. »
    </div>
    <div class="translation-quote">
      <strong>Traduction Assermentée :</strong> <em>« Bon travail aujourd'hui. Amine, le chauffeur de taxi de Bab Ezzouar qui a versé 64k et la cliente d'Oran qui a versé 48k, bloque-les immédiatement sur WhatsApp. Ne leur réponds plus. Dis-leur "le camion est tombé en panne sur l'autoroute" puis procède au blocage. Déposez les reçus sur le drive de Kamel afin qu'il vide les cartes aux distributeurs avant 23h. »</em>
    </div>
  </div>

  <!-- Piece A-02 -->
  <div class="evidence-box voice">
    <div class="evidence-header">
      <span>🎙️ PIÈCE A-02 : Note Vocale du Boss « El-Hadj » au Lieutenant Youcef (Comité Direction Telegram)</span>
      <span class="badge badge-danger">Ordre de Blanchiment USDT</span>
    </div>
    <div class="mono" style="font-size:7.5pt;color:#64748b;margin-bottom:3px;">
      Fichier: AUDIO_EVID_TG_BOSS_TO_YOUCEF.ogg • SHA-256: 5d829fa18c0e2274b123985fe612ab7451...
    </div>
    <div class="transcript-quote">
      « Youcef, smaâni mlih. La cellule pneus rahi t'dirlna 600 000 da par jour had la semaine, c’est bien bessah les plaintes b'daw y'kethrou f'Facebook. Ghleq les trois pages ghedwa s'bah, w khéli Sofiane y'lansi les trois nouveaux sites w les nouvelles pages li wadjadhoum. Kamel rah sayé converti les 4 millions de dinars taâ el-bareh en USDT f'Binance P2P. Nadia f'la cellule Visa rahi fatetkoum, daret 1,8 million el-youm bark. Zidou le rythme w beddlou les RIP BaridiMob koul 48 heures ! »
    </div>
    <div class="translation-quote">
      <strong>Traduction Assermentée :</strong> <em>« Youcef, écoute bien. La cellule pneus rapporte 600 000 DZD/jour, mais les signalements s'accumulent sur Facebook. Ferme les 3 pages demain matin et dis à Sofiane de mettre en ligne les nouveaux sites et pages prêts. Kamel a déjà converti les 4 millions de dinars d'hier en USDT sur Binance P2P. Nadia dans la cellule Visa vous dépasse avec 1,8 million aujourd'hui. Accélérez le rythme et changez les RIP BaridiMob toutes les 48h ! »</em>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- Piece D-01 -->
  <div class="evidence-box discord">
    <div class="evidence-header">
      <span>💬 PIÈCE D-01 : Log Authentifié Discord — Développeur Sofiane K. &amp; Boss « ElHadj_99 »</span>
      <span class="badge badge-purple">Salon #commandes-scripts</span>
    </div>
    <div class="mono" style="font-size:7.5pt;color:#64748b;margin-bottom:3px;">
      Serveur: DZ-Dev &amp; Ops Hub (ID: 119830129480192840) • Date: 07/11/2026
    </div>
    <div class="transcript-quote mono" style="font-style:normal;">
      <strong>[SofianeDev] :</strong> @ElHadj_99 C'est bon, script PHP mis à jour sur destockage-auto-dz.online. Dès que le client clique sur "Payer par BaridiMob", faux numéro d'autorisation et envoi immédiat des identifiants au bot Telegram @syndicate_leads_bot.<br>
      <strong>[ElHadj_99] :</strong> Parfait. Et le clone TLSContact pour la cellule de Nadia ? Les demandeurs de visas Espagne s'impatientent.<br>
      <strong>[SofianeDev] :</strong> Build terminé et signé : https://cdn.dz-services-cloud.com/apps/VisaExpressDZ.apk. Mon wallet USDT TRC-20 est envoyé pour mes 15%.
    </div>
  </div>

  <!-- Piece A-03 -->
  <div class="evidence-box voice">
    <div class="evidence-header">
      <span>🎙️ PIÈCE A-03 : Note Vocale de Lieutenante Nadia (« Dina ») — Preuve du Réseau Multi-Escroqueries</span>
      <span class="badge badge-success">Cellule Visas Schengen</span>
    </div>
    <div class="mono" style="font-size:7.5pt;color:#64748b;margin-bottom:3px;">
      Fichier: AUDIO_EVID_TG_NADIA_REPORT.ogg • SHA-256: 98e4c194b15672d1f90081c7e92384a80...
    </div>
    <div class="transcript-quote">
      « Boss, el-hamdullah le nouveau script taâ Sofiane pour les rendez-vous TLS rah yemchi 10/10. Les opérateurs diali f'Constantine jawbou plus de 80 clients had sbeh. Derna 2,4 millions de dinars d'acomptes pour les visas Espagne et France. Kolch rah f'les comptes BaridiMob taâ les étudiants. B'athli le feu vert bech Kamel y'sshabhoum. »
    </div>
    <div class="translation-quote">
      <strong>Traduction Assermentée :</strong> <em>« Boss, le nouveau script de Sofiane pour les rendez-vous TLS fonctionne à 100%. Mes opérateurs à Constantine ont traité plus de 80 dossiers ce matin. Nous avons cumulé 2,4 millions de dinars d'acomptes pour les visas Espagne et France. Tout est sur les comptes BaridiMob des étudiants. Donne le feu vert pour que Kamel effectue les retraits. »</em>
    </div>
  </div>

  <!-- SECTION 6 -->
  <h2 class="sec-heading"><span class="sec-num">VI</span> Cartographie Structurée du Syndicat Cybercriminel</h2>

  <div class="hierarchy-grid">
    <div class="card-node boss">
      <strong>👑 LE COMMANDITAIRE &amp; BLANCHISSEUR (LE BOSS) : Tarek H. alias « El-Hadj » (44 ans, Hydra / Dubaï)</strong><br>
      <span class="mono">Discord: ElHadj_99#0001 • Telegram: @elhadj_vip • Wallet USDT: TJv89XbM42wLkK3e9Q7pNrTzC1mKq92</span><br>
      Financement exclusif des infrastructures d'hébergement, achat des lots de cartes SIM clandestines, recrutement des lieutenants, réception des fonds et conversion intégrale en USDT sur Binance P2P.
    </div>

    <div class="card-node dev">
      <strong>💻 LE DÉVELOPPEUR EN CHEF : Sofiane K. alias « Sofi-Dev » (28 ans, Bab Ezzouar, Alger)</strong><br>
      <span class="mono">GitHub: @soficoder-alger • E-mail: sofiane.devbox99@gmail.com • Discord: SofianeDev#4401</span><br>
      Concepteur technique unique : développe les fausses applications Android (APKs), les formulaires web de capture de données bancaires, les bots Telegram d'alerte et les générateurs de faux reçus BaridiMob. Commission : 15%.
    </div>

    <div class="card-node lt">
      <strong>LIEUTENANT CELLULE PNEUS</strong><br>
      <strong>Youcef R. alias « Jo_Blida »</strong><br>
      <span class="mono">Blida • TG: @jo_pneus</span><br>
      Supervise la fraude pneumatiques. Gère 3 rabatteurs : <strong>Amine B.</strong> (<span class="mono">+213 555 019 283</span>), Bilel S., Hamza K.
    </div>

    <div class="card-node lt">
      <strong>LIEUTENANTE CELLULE VISAS</strong><br>
      <strong>Nadia M. alias « Dina »</strong><br>
      <span class="mono">Constantine • TG: @dina_visas</span><br>
      Supervise les fausses prises de RDV consulaires TLSContact/VFS et faux contrats Espagne. Gère 4 opérateurs de chat.
    </div>

    <div class="card-node lt">
      <strong>LIEUTENANT CELLULE ÉLECTRO</strong><br>
      <strong>Farid T. alias « Kika »</strong><br>
      <span class="mono">Sétif / Annaba • TG: @kika_electro</span><br>
      Supervise les faux déstockages d'électroménager, téléviseurs 4K et lingotins d'or. Gère 3 opérateurs de vente.
    </div>
  </div>

  <!-- SECTION 7 -->
  <h2 class="sec-heading"><span class="sec-num">VII</span> Bilan Financier et Révélation du Système Multi-Escroqueries</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th>Branche Criminelle</th>
        <th>Marque &amp; Cibles</th>
        <th>Volume Victimes</th>
        <th>Préjudice Estimé</th>
        <th>Destination des Fonds</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Branche A : Pneumatiques</strong></td>
        <td>Michelin Promo DZ (Chauffeurs, Taxis)</td>
        <td>62 victimes déclarées</td>
        <td><strong>4 500 000 DZD</strong></td>
        <td>Retraits GAB par Kamel V. → Achat USDT P2P</td>
      </tr>
      <tr>
        <td><strong>Branche B : Visas &amp; Contrats</strong></td>
        <td>Visa Express (Demandeurs de visas Schengen)</td>
        <td>144 victimes déclarées</td>
        <td><strong>18 000 000 DZD</strong></td>
        <td>Mules étudiantes → Retraits GAB → USDT P2P</td>
      </tr>
      <tr>
        <td><strong>Branche C : Électro &amp; Or</strong></td>
        <td>Déstockage Frontière (Particuliers)</td>
        <td>79 victimes déclarées</td>
        <td><strong>11 000 000 DZD</strong></td>
        <td>Comptes BaridiMob loués → Achat USDT P2P</td>
      </tr>
      <tr style="background:#f1f5f9;font-weight:700;">
        <td colspan="2">TOTAL CONSOLIDÉ DU SYNDICAT</td>
        <td>285+ victimes</td>
        <td><strong>33 500 000 DZD</strong></td>
        <td><strong>~140 000 USDT (Tron Network)</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 8 -->
  <h2 class="sec-heading"><span class="sec-num">VIII</span> Matrice d'Analyse Topologique du Graphe Forensique des 100 Nœuds</h2>
  <p>
    La modélisation formelle de l'ensemble de l'affaire dans la plateforme <strong>Athar DZ</strong> consolide un graphe orienté de <strong>100 nœuds d'entités</strong> reliés par <strong>129 relations de preuve vérifiées</strong> :
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th>Calque de Travail Forensique</th>
        <th>Nombre de Nœuds</th>
        <th>Entités Représentées</th>
        <th>Valeur Probante &amp; Statut Légal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Calque 1 : Preuves &amp; Victimes</strong></td>
        <td><strong>25 Nœuds</strong></td>
        <td>10 Victimes (Karim, Meriem, Djamel...), 5 PVs de plainte, 4 Vocaux scellés (A-01 à A-04), APKs binaire, reçus BaridiMob.</td>
        <td><span class="badge badge-success">Scellé RFC 3161 TSA</span> • Force probante pénale pleine</td>
      </tr>
      <tr>
        <td><strong>Calque 2 : Découvertes OSINT Brutes</strong></td>
        <td><strong>30 Nœuds</strong></td>
        <td>10 Pages et comptes sociaux (FB, IG, Ouedkniss), 6 Annonces/Posts sponsorisés, 8 Téléphones E.164, 6 Salons Discord &amp; TG.</td>
        <td><span class="badge badge-info">OSINT Validé</span> • Rapprochements multi-plateformes</td>
      </tr>
      <tr>
        <td><strong>Calque 3 : Infrastructure &amp; Code</strong></td>
        <td><strong>25 Nœuds</strong></td>
        <td>8 Domaines web phishing, 5 Serveurs &amp; IPs C2, 4 Relais BTS Cell-ID, 4 Repos/Keystores Git, 4 Comptes BaridiMob &amp; Crypto.</td>
        <td><span class="badge badge-purple">Infra Technique</span> • Audit binaire et logs réseau</td>
      </tr>
      <tr>
        <td><strong>Calque 4 : Réseau Criminel</strong></td>
        <td><strong>20 Nœuds</strong></td>
        <td>Le Boss (Tarek H.), Développeur (Sofiane K.), Caissier (Kamel V.), 3 Lieutenants (Youcef, Nadia, Farid), 6 Opérateurs, 4 Mules, 2 Sociétés écrans, 1 Compte Binance P2P.</td>
        <td><span class="badge badge-danger">Cible Judiciaire</span> • Mandats d'arrêt et de blocage requis</td>
      </tr>
      <tr style="background:#f8fafc;font-weight:700;">
        <td>TOTAL CONSOLIDÉ DU MODÈLE</td>
        <td><strong>100 Nœuds</strong></td>
        <td colspan="2">129 Arêtes orientées • Modularité Louvain Q = 0.74 (3 cellules étanches) • Centralité d'intermédiarité pointant sur le Développeur</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 9 -->
  <h2 class="sec-heading"><span class="sec-num">IX</span> Réquisitions Judiciaires &amp; Mandats Recommandés</h2>
  <ol style="margin:4px 0 10px 18px;padding:0;font-size:8.5pt;">
    <li><strong>Mandats d'Arrêt et de Dépôt :</strong> À l'encontre de Tarek H. (Le Boss), Sofiane K. (Développeur), Youcef R., Nadia M., Farid T. (Lieutenants) et Amine B. (Opérateur).</li>
    <li><strong>Réquisitions Bancaires et Postales (Algérie Poste) :</strong> Blocage immédiat de 18 comptes RIP/CCP BaridiMob identifiés au registre des mules financières.</li>
    <li><strong>Réquisitions Opérateurs Télécoms (Mobilis, Djezzy, Ooredoo) :</strong> Gel des cartes SIM et transmission des données d'abonnés et d'identifiants IMEI.</li>
    <li><strong>Demandes d'Entraide Judiciaire Internationale (MLAT) :</strong>
      <ul>
        <li>À l'attention de <em>Binance Ltd</em> : Blocage conservatoire du portefeuille USDT <span class="mono">TJv89XbM42wLkK3e9Q7pNrTzC1mKq92</span>.</li>
        <li>À l'attention de <em>Meta Platforms Inc.</em>, <em>Discord Inc.</em> et <em>Telegram Messenger Inc.</em> : Préservation et saisie des serveurs et canaux incriminés.</li>
      </ul>
    </li>
  </ol>

  <!-- Signatures -->
  <div class="signature-block">
    <div class="sig-col">
      <strong>L'Officier de Police Judiciaire (OPJ)</strong><br>
      Division Cybercriminalité &amp; OSINT<br>
      <em>Capitaine M. Belkacem</em>
      <div class="sig-space"></div>
      <span class="mono" style="font-size:7pt;">Signature certifiée &bull; Sceau Police Judiciaire</span>
    </div>
    <div class="sig-col">
      <strong>Vu et Transmis au Procureur de la République</strong><br>
      Pôle Pénal Spécialisé TIC — Cour d'Alger<br>
      <em>Magistrat Instructeur</em>
      <div class="sig-space"></div>
      <span class="mono" style="font-size:7pt;">Registre Scellés : #ATHAR-2026-SCAM-089-LOK</span>
    </div>
  </div>

</body>
</html>
"""

# -------------------------------------------------------------------------
# 2. MOCK DATA JSON DEFINITION
# -------------------------------------------------------------------------
MOCK_DATA = {
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
        "wilayas_impacted": ["Alger", "Oran", "Blida", "Constantine", "Sétif", "Annaba"],
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
            { "name": "Pneus Promo Algérie", "url": "fb.com/pneus.promo.dz", "created": "2026-10-12", "likes": 2400 },
            { "name": "Pneus Express Discount DZ", "url": "fb.com/michelin.express.livraison", "created": "2026-10-24" },
            { "name": "Auto Déstockage Pneumatiques", "url": "fb.com/auto.destockage.blida", "created": "2026-11-02" }
        ],
        "facebook_posts": [
            { "id": "post_98124", "text": "Vente Flash 4 Pneus Michelin -60% Déstockage Douane", "reach": 18400 },
            { "id": "post_98177", "text": "Liquidation Stock Tourisme et Utilitaire - Livraison 58 Wilayas" },
            { "id": "post_98205", "text": "Offre Spéciale Flottes et Artisans - Acompte requis" }
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
                { "handle": "ElHadj_99#0001", "role": "Owner / Le Boss (Tarek H.)" },
                { "handle": "SofianeDev#4401", "role": "Developer (Sofiane K.)" },
                { "handle": "Jo_Blida#1982", "role": "Lieutenant Pneus (Youcef R.)" },
                { "handle": "Dina_Consult#3310", "role": "Lieutenante Visas (Nadia M.)" },
                { "handle": "Kika_Annaba#7721", "role": "Lieutenant Électro (Farid T.)" }
            ]
        },
        "telegram_network": {
            "channels": [
                {
                    "name": "Comité Direction C2 (VIP)",
                    "invite": "t.me/+Hd99_Management_C2",
                    "members": ["El-Hadj (Boss)", "Sofiane (Dev)", "Youcef (LT)", "Nadia (LT)", "Farid (LT)"],
                    "purpose": "Consolidation financière & blanchiment USDT"
                },
                {
                    "name": "Pneus DZ — Équipe Vente",
                    "invite": "t.me/+Ab91k_PneuOps",
                    "leader": "Youcef R. (@jo_pneus)",
                    "operators": ["Amine B. (@amine_import)", "Bilel S.", "Hamza K."],
                    "purpose": "Gestion des faux bons de commande et blocage des victimes"
                },
                {
                    "name": "Visa Schengen Express — Traitement",
                    "invite": "t.me/+Vz82k_VisaOps",
                    "leader": "Nadia M. (@dina_visas)",
                    "operators": ["Fares K.", "Sarah T.", "2 automated bot leads"],
                    "purpose": "Fausses réservations TLSContact et faux contrats de travail"
                },
                {
                    "name": "Électro & Gold Liquidation",
                    "invite": "t.me/+Lx44k_ElectroOps",
                    "leader": "Farid T. (@kika_electro)",
                    "operators": ["Mourad Z.", "Lyès B.", "Riad M."],
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
                "operators": ["Amine B. (+213 555 019 283)", "Bilel S.", "Hamza K."],
                "turnover_dzd": 4500000
            },
            {
                "name": "Nadia M.",
                "alias": "Dina_Consult",
                "cell": "Cellule Visas Schengen & Contrats Espagne",
                "wilaya": "Constantine",
                "operators": ["Fares K.", "Sarah T.", "2 opérateurs supplémentaires"],
                "turnover_dzd": 18000000
            },
            {
                "name": "Farid T.",
                "alias": "Kika_Annaba",
                "cell": "Cellule Électroménager & Or Déstockage",
                "wilaya": "Sétif / Annaba",
                "operators": ["Mourad Z.", "Lyès B.", "Riad M."],
                "turnover_dzd": 11000000
            }
        ]
    },
    "graph_representation": {
        "nodes": [
            { "id": "vic_karim", "type": "VICTIM", "layer": 1, "label": "Karim Zerrouki (Alger)", "loss": 64000 },
            { "id": "vic_meriem", "type": "VICTIM", "layer": 1, "label": "Meriem Benali (Oran)", "loss": 48000 },
            { "id": "vic_djamel", "type": "VICTIM", "layer": 1, "label": "Djamel Mansouri (Blida)", "loss": 120000 },
            { "id": "post_fb_98124", "type": "FB_POST", "layer": 1, "label": "Post FB #98124 (Michelin -60%)" },
            { "id": "page_fb_pneus", "type": "FB_PAGE", "layer": 1, "label": "fb.com/pneus.promo.dz" },
            { "id": "phone_scammer_front", "type": "PHONE", "layer": 2, "label": "+213 555 019 283 (Ooredoo)" },
            { "id": "apk_autopneus", "type": "MALWARE_APK", "layer": 2, "label": "AutoPneusDZ.apk" },
            { "id": "github_dev_leak", "type": "CODE_REPO", "layer": 2, "label": "github.com/soficoder-alger" },
            { "id": "dev_sofiane", "type": "DEVELOPER", "layer": 3, "label": "Sofiane K. (Sofi-Dev)" },
            { "id": "discord_server_ops", "type": "DISCORD_SERVER", "layer": 3, "label": "Discord « DZ-Dev & Ops Hub »" },
            { "id": "tg_management", "type": "TELEGRAM_GROUP", "layer": 3, "label": "TG VIP « Comité Direction C2 »" },
            { "id": "tg_cell_pneus", "type": "TELEGRAM_GROUP", "layer": 3, "label": "TG « Pneus DZ — Ventes »" },
            { "id": "tg_cell_visas", "type": "TELEGRAM_GROUP", "layer": 3, "label": "TG « Visas Express DZ »" },
            { "id": "tg_cell_electro", "type": "TELEGRAM_GROUP", "layer": 3, "label": "TG « Électro & Or DZ »" },
            { "id": "operator_amine", "type": "SUSPECT", "layer": 3, "label": "Amine B. (@amine_import)" },
            { "id": "lt_youcef", "type": "LIEUTENANT", "layer": 4, "label": "Youcef R. (Chef Pneus)" },
            { "id": "lt_nadia", "type": "LIEUTENANT", "layer": 4, "label": "Nadia M. (Chef Visas)" },
            { "id": "lt_farid", "type": "LIEUTENANT", "layer": 4, "label": "Farid T. (Chef Électro)" },
            { "id": "boss_tarek", "type": "KINGPIN", "layer": 4, "label": "Tarek H. (« El-Hadj » / Le Boss)" },
            { "id": "wallet_usdt_boss", "type": "CRYPTO_WALLET", "layer": 4, "label": "USDT TRC-20: TJv89X...Kq92" }
        ],
        "edges": [
            { "source": "vic_karim", "target": "post_fb_98124", "label": "CLICKED_AD" },
            { "source": "vic_meriem", "target": "page_fb_pneus", "label": "CONTACTED_PAGE" },
            { "source": "vic_djamel", "target": "apk_autopneus", "label": "DOWNLOADED_APP" },
            { "source": "post_fb_98124", "target": "phone_scammer_front", "label": "ROUTES_TO_WHATSAPP" },
            { "source": "operator_amine", "target": "phone_scammer_front", "label": "OPERATES_LINE" },
            { "source": "page_fb_pneus", "target": "github_dev_leak", "label": "EXPOSED_GIT_ORIGIN" },
            { "source": "apk_autopneus", "target": "dev_sofiane", "label": "SIGNED_BY_KEYSTORE" },
            { "source": "github_dev_leak", "target": "discord_server_ops", "label": "LEAKED_WEBHOOK" },
            { "source": "dev_sofiane", "target": "discord_server_ops", "label": "DEPLOYS_TO_DISCORD" },
            { "source": "discord_server_ops", "target": "tg_management", "label": "SHARED_INVITE_VIP" },
            { "source": "discord_server_ops", "target": "tg_cell_pneus", "label": "SHARED_INVITE_PNEUS" },
            { "source": "discord_server_ops", "target": "tg_cell_visas", "label": "SHARED_INVITE_VISAS" },
            { "source": "discord_server_ops", "target": "tg_cell_electro", "label": "SHARED_INVITE_ELECTRO" },
            { "source": "operator_amine", "target": "tg_cell_pneus", "label": "MEMBER_OF_CELL" },
            { "source": "lt_youcef", "target": "tg_cell_pneus", "label": "MANAGES_CELL" },
            { "source": "lt_nadia", "target": "tg_cell_visas", "label": "MANAGES_CELL" },
            { "source": "lt_farid", "target": "tg_cell_electro", "label": "MANAGES_CELL" },
            { "source": "lt_youcef", "target": "tg_management", "label": "REPORTS_TO_BOSS" },
            { "source": "lt_nadia", "target": "tg_management", "label": "REPORTS_TO_BOSS" },
            { "source": "lt_farid", "target": "tg_management", "label": "REPORTS_TO_BOSS" },
            { "source": "boss_tarek", "target": "tg_management", "label": "COMMANDS_SYNDICATE" },
            { "source": "boss_tarek", "target": "wallet_usdt_boss", "label": "LAUNDERS_FUNDS_TO_CRYPTO" }
        ]
    }
}

# -------------------------------------------------------------------------
# 3. WRITE ASSETS TO DISK & GENERATE PDF
# -------------------------------------------------------------------------
def main():
    print(f"[*] Writing HTML report to {REPORT_HTML_PATH}...")
    with open(REPORT_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(HTML_REPORT)

    print(f"[*] Writing JSON mock data to {MOCK_JSON_PATH}...")
    with open(MOCK_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(MOCK_DATA, f, indent=2, ensure_ascii=False)

    print(f"[*] Writing JS mock module to {MOCK_JS_PATH}...")
    js_content = f"// Athar DZ Mock Case Data — Candy Wheels Multi-Scam\nwindow.CASE_CANDY_WHEELS = {json.dumps(MOCK_DATA, indent=2, ensure_ascii=False)};\n"
    with open(MOCK_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"[*] Compiling PDF via Google Chrome Headless to {REPORT_PDF_PATH}...")
    chrome_cmd = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={os.path.abspath(REPORT_PDF_PATH)}",
        os.path.abspath(REPORT_HTML_PATH)
    ]
    res = subprocess.run(chrome_cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[!] Error generating PDF: {res.stderr}")
        sys.exit(1)

    print(f"[+] PDF generated successfully! ({os.path.getsize(REPORT_PDF_PATH)} bytes)")

    # Copy to doc/assets/ for instant browser access / download button in mock
    print(f"[*] Copying PDF to {DOC_ASSETS_PDF}...")
    shutil.copyfile(REPORT_PDF_PATH, DOC_ASSETS_PDF)

    print("[+] All deliverables successfully generated!")

if __name__ == "__main__":
    main()
