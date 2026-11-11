#!/usr/bin/env python3
"""
Updates doc/data-model.html to incorporate:
1. Algerian Administrative & Judicial Hierarchy:
   (w:Wilaya) <--[:appartient]-- (d:Daira) <--[:appartient]-- (c:Commune) <--[:situer]-- (u:Unite) <--[:Traiter]-- (a:Affaire)
2. Forensic Entity Styling Specification (config_style.json, diameter, icon, colors)
3. Derived Criminal Intelligence Attributes (_Lvl_of_Implications, _class, _betweennessCentrality, _comune_Activite, etc.)
4. Full metadata and relations visual SVG graph
5. 8-chapter sidebar navigation
"""

import sys
import re

with open("doc/data-model.html", "r", encoding="utf-8") as f:
    content = f.read()

# Update sidebar
OLD_SIDEBAR = """    <div class="nav-section">Specification Portal</div>
    <ul class="nav-links">
      <li><a href="index.html"><span>🏠 01. Executive Summary</span><span class="nav-badge">Overview</span></a></li>
      <li><a href="architecture.html"><span>🏗️ 02. Visual Architecture</span><span class="nav-badge">6 Layers</span></a></li>
      <li><a href="bricks-and-automation.html"><span>🧰 03. Investigation Tools Menu</span><span class="nav-badge">60+ Tools</span></a></li>
      <li><a href="data-model.html" class="active"><span>🕸️ 04. Visual Graph & UI Spec</span><span class="nav-badge">Ontology</span></a></li>
      <li><a href="roadmap-phases.html"><span>🚀 05. Development Phases</span><span class="nav-badge">6 Releases</span></a></li>
      <li><a href="github-repos-audit.html"><span>📦 06. GitHub Repos Audit</span><span class="nav-badge">48 Repos</span></a></li>
      <li><a href="maquette.html" class="maquette-cta"><span>🖥️ Launch App Maquette</span><span class="nav-badge">Live Sim</span></a></li>
    </ul>"""

NEW_SIDEBAR = """    <div class="nav-section">Specification Portal</div>
    <ul class="nav-links">
      <li><a href="index.html"><span>🏠 01. Framework Summary &amp; Objective</span><span class="nav-badge">Overview</span></a></li>
      <li><a href="architecture.html"><span>🏗️ 02. Six-Layer Visual Architecture</span><span class="nav-badge">6 Layers</span></a></li>
      <li><a href="interfaces-roles.html"><span>👥 03. Interfaces &amp; Roles</span><span class="nav-badge">4 Views</span></a></li>
      <li><a href="data-model.html" class="active"><span>🕸️ 04. Data Model &amp; Metadata Graph</span><span class="nav-badge">Ontology</span></a></li>
      <li><a href="osint-arsenal.html"><span>🧰 05. OSINT Investigation Arsenal</span><span class="nav-badge">76 Tools</span></a></li>
      <li><a href="forensics-sna.html"><span>🚔 06. Forensics (DFIR) &amp; SNA Functions</span><span class="nav-badge">SOTA Funcs</span></a></li>
      <li><a href="roadmap-phases.html"><span>🚀 07. Incremental Development Phases</span><span class="nav-badge">6 Releases</span></a></li>
      <li><a href="maquette.html" class="maquette-cta"><span>🖥️ 08. Interactive Application Mock</span><span class="nav-badge">Live Studio</span></a></li>
    </ul>"""

if OLD_SIDEBAR in content:
    content = content.replace(OLD_SIDEBAR, NEW_SIDEBAR)

# Add Section 5: Algerian Administrative Hierarchy, Entity Styling, and Derived Intelligence Attributes
SECTION_5 = """
    <!-- 5. Algerian Administrative Hierarchy & Forensic Graph Metadata (Verified PIC-main & frontend-master) -->
    <section>
      <h2 class="section-title">5. Hiérarchie Territoriale Algérienne &amp; Attributs d'Intelligence Criminelle Dérivés</h2>
      <p class="section-subtitle">
        Modélisation formelle de l'ancrage territorial judiciaire algérien (Wilaya, Daïra, Commune, Unité, Affaire) et des attributs calculés en temps réel par les algorithmes de <code>PIC-main</code> et visualisés dans <code>frontend-master</code>.
      </p>

      <!-- 5.1 Algerian Administrative & Judicial Hierarchy Ontological Subgraph -->
      <div class="card" style="border-left:4px solid var(--accent-emerald);margin-bottom:1.5rem;">
        <div class="card-title"><span>🇩🇿</span> 5.1 Sous-Graphe Ontologique de l'Organisation Judiciaire Algérienne</div>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
          Chaque dossier criminel (<code>Affaire</code>) est obligatoirement ancré dans l'arborescence juridictionnelle et administrative algérienne, permettant le filtrage territorial en cascade (<code>/all_wilaya</code>, <code>/dairas/</code>, <code>/communes/</code>, <code>/all_affaire_types/</code>) et le respect de la compétence territoriale du Code de Procédure Pénale :
        </p>

        <!-- SVG Administrative Hierarchy -->
        <div style="background:#090d16;padding:1rem;border-radius:8px;margin-bottom:0.75rem;overflow-x:auto;">
          <svg viewBox="0 0 850 110" style="min-width:750px;width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
              </marker>
            </defs>

            <!-- Node Wilaya -->
            <rect x="20" y="25" width="130" height="60" rx="8" fill="#061c14" stroke="#10b981" stroke-width="2"/>
            <text x="85" y="50" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">(w:Wilaya)</text>
            <text x="85" y="68" fill="#86efac" font-size="8.5" text-anchor="middle">58 Wilayas DZ</text>

            <path d="M 180 55 L 155 55" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)"/>
            <text x="168" y="47" fill="#86efac" font-size="7.5" font-family="monospace" text-anchor="middle">[:appartient]</text>

            <!-- Node Daira -->
            <rect x="190" y="25" width="130" height="60" rx="8" fill="#061c14" stroke="#10b981" stroke-width="1.5"/>
            <text x="255" y="50" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">(d:Daira)</text>
            <text x="255" y="68" fill="#86efac" font-size="8.5" text-anchor="middle">Daïra de rattachement</text>

            <path d="M 350 55 L 325 55" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)"/>
            <text x="338" y="47" fill="#86efac" font-size="7.5" font-family="monospace" text-anchor="middle">[:appartient]</text>

            <!-- Node Commune -->
            <rect x="360" y="25" width="130" height="60" rx="8" fill="#061c14" stroke="#10b981" stroke-width="1.5"/>
            <text x="425" y="50" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">(c:Commune)</text>
            <text x="425" y="68" fill="#86efac" font-size="8.5" text-anchor="middle">1541 Communes DZ</text>

            <path d="M 520 55 L 495 55" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)"/>
            <text x="508" y="47" fill="#86efac" font-size="7.5" font-family="monospace" text-anchor="middle">[:situer]</text>

            <!-- Node Unite -->
            <rect x="530" y="25" width="140" height="60" rx="8" fill="#0c1929" stroke="#38bdf8" stroke-width="2"/>
            <text x="600" y="50" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">(u:Unite)</text>
            <text x="600" y="68" fill="#7dd3fc" font-size="8.5" text-anchor="middle">Brigade GN / BMPJ / Sûreté</text>

            <path d="M 695 55 L 675 55" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)"/>
            <text x="685" y="47" fill="#7dd3fc" font-size="7.5" font-family="monospace" text-anchor="middle">[:Traiter]</text>

            <!-- Node Affaire -->
            <rect x="705" y="25" width="125" height="60" rx="8" fill="#201124" stroke="#ec4899" stroke-width="2"/>
            <text x="767" y="50" fill="#ec4899" font-size="11" font-weight="bold" text-anchor="middle">(a:Affaire)</text>
            <text x="767" y="68" fill="#f472b6" font-size="8.5" text-anchor="middle">Dossier d'Enquête</text>
          </svg>
        </div>

        <div style="background:#090d16;padding:0.85rem;border-radius:6px;font-size:0.8rem;color:#cbd5e1;line-height:1.5;">
          <strong style="color:#10b981;">Propriétés Canoniques Enregistrées sur les Nœuds Territoriaux :</strong>
          <ul style="margin:0.4rem 0 0 1.25rem;padding:0;">
            <li><code>nom_francais</code> &bull; <code>nom_arabe</code> : Bilinguisme officiel strict (ex: <em>Alger / الجزائر</em>, <em>Bab El Oued / باب الوادي</em>).</li>
            <li><code>code_postal</code> &bull; <code>code_wilaya</code> : Numérotation officielle de 01 à 58.</li>
            <li><code>type_unite</code> : <code>Gendarmerie_Nationale</code>, <code>Surete_Nationale_DGSN</code>, ou <code>Pole_Penal_Specialise</code>.</li>
            <li><code>type_affaire</code> : Qualification pénale (<em>Escroquerie Numérique</em>, <em>Usurpation d'Identité</em>, <em>Blanchiment</em>, <em>Faux et Usage de Faux</em>).</li>
          </ul>
        </div>
      </div>

      <!-- 5.2 Forensic Entity Styling Specification (config_style.json) -->
      <div class="card" style="border-left:4px solid var(--accent-blue);margin-bottom:1.5rem;">
        <div class="card-title"><span>🎨</span> 5.2 Spécification du Style Visuel &amp; Icônes Forensiques (config_style.json)</div>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
          Conformément à l'implémentation de <code>frontend-master</code> (<code>VisualisationModule/Parser.js</code>, <code>NodeConfigForm.js</code>) et l'API backend <code>/api/node-config/</code>, chaque type d'entité possède une configuration graphique stricte :
        </p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Type d'Entité</th>
                <th>Couleur de Remplissage</th>
                <th>Diamètre Standard</th>
                <th>Chemin d'Icône (/public/icon/)</th>
                <th>Clé d'Affichage Principale (labelKey)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Personne / Suspect</strong></td>
                <td><span style="color:#f43f5e;font-weight:700;">#f43f5e (Rose / Rouge)</span></td>
                <td><code>130px - 140px</code></td>
                <td><code>/icon/Personne.png</code></td>
                <td><code>nom_complet</code> ou <code>alias</code></td>
              </tr>
              <tr>
                <td><strong>Numéro Téléphone</strong></td>
                <td><span style="color:#f97316;font-weight:700;">#f97316 (Orange)</span></td>
                <td><code>110px</code></td>
                <td><code>/icon/Telephone.png</code></td>
                <td><code>numero_e164</code> (ex: +213555...)</td>
              </tr>
              <tr>
                <td><strong>Compte Bancaire / BaridiMob</strong></td>
                <td><span style="color:#eab308;font-weight:700;">#eab308 (Or / Ambre)</span></td>
                <td><code>115px</code></td>
                <td><code>/icon/BaridiMob.png</code></td>
                <td><code>rip_algerie_poste</code></td>
              </tr>
              <tr>
                <td><strong>Compte Réseau Social</strong></td>
                <td><span style="color:#0ea5e9;font-weight:700;">#0ea5e9 (Cyan / Bleu)</span></td>
                <td><code>105px</code></td>
                <td><code>/icon/Social.png</code></td>
                <td><code>pseudo_reseau</code> (@...)</td>
              </tr>
              <tr>
                <td><strong>Note Vocale / Audio</strong></td>
                <td><span style="color:#10b981;font-weight:700;">#10b981 (Émeraude)</span></td>
                <td><code>100px</code></td>
                <td><code>/icon/Audio.png</code></td>
                <td><code>duree_et_locuteur</code></td>
              </tr>
              <tr>
                <td><strong>Véhicule</strong></td>
                <td><span style="color:#8b5cf6;font-weight:700;">#8b5cf6 (Violet)</span></td>
                <td><code>110px</code></td>
                <td><code>/icon/Vehicule.png</code></td>
                <td><code>immatriculation_dz</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5.3 Derived Criminal Intelligence Attributes -->
      <div class="card" style="border-left:4px solid var(--accent-purple);">
        <div class="card-title"><span>🏷️</span> 5.3 Attributs Dérivés d'Intelligence Criminelle (Calculés en Temps Réel)</div>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
          Le moteur analytique <code>PIC-main</code> (<code>graph/analyse/view.py</code>) calcule et écrit directement sur les nœuds du graphe des attributs d'aide à la décision judiciaire, affichés sous forme de badges sur le canvas NVL :
        </p>

        <div style="background:#090d16;padding:1rem;border-radius:8px;font-size:0.8rem;color:#cbd5e1;line-height:1.6;">
          <ul style="padding-left:1.2rem;margin:0;">
            <li><code style="color:#a855f7;">_Lvl_of_Implications</code> : Tableau d'entiers <code>[1, 2, 3]</code> mesurant le niveau d'implication directe ou indirecte du suspect à travers les sauts de graphe de l'affaire.</li>
            <li><code style="color:#a855f7;">_class</code> : Tableau de classification pénale automatique : <code>['neutre']</code>, <code>['operationeel']</code> (homme de main/opérateur terrain), <code>['soutien']</code> (fournisseur logistique, puces SIM, prête-nom), ou <code>['leader']</code> (cerveau / donneur d'ordre).</li>
            <li><code style="color:#a855f7;">_betweennessCentrality</code> : Valeur flottante normalisée entre <code>0.0</code> et <code>1.0</code> via GDS Brandes. Détecte les pivots indispensables au fonctionnement du syndicat.</li>
            <li><code style="color:#a855f7;">_comune_Activite</code>, <code style="color:#a855f7;">_daira_activiti</code>, <code style="color:#a855f7;">_wiliya_Activiti</code> : Rayon d'action géographique calculé automatiquement par projection spatio-temporelle des bornages télécoms et retraits GAB du suspect.</li>
          </ul>
        </div>
      </div>
    </section>
"""

# Insert SECTION_5 before </main>
if "</main>" in content:
    content = content.replace("</main>", SECTION_5 + "\n  </main>")

with open("doc/data-model.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated doc/data-model.html with Algerian Administrative Hierarchy and Derived Intelligence Attributes!")
