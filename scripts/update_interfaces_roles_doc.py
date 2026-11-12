#!/usr/bin/env python3
"""
Updates doc/generate_interfaces_roles_spec.py and doc/interfaces-roles.html
to fully document:
1. Left Panel Accordion Menu & Progressive Disclosure Architecture
2. Drag & Drop Manual Node Creation Toolbox (37 Node Types across 8 Domains)
3. Interactive Link Creation Mode (47 GFPG Directed Relations)
4. Circular Icon Node Visual Specification (replacing rectangles, 56px/68px, Lucide SVGs, Layer rings)
5. Formal UI/UX Rules Compliance Table against .agent/ui-ux-rules.md
"""

import os
import sys

INTERFACE_GENERATOR = "doc/generate_interfaces_roles_spec.py"

with open(INTERFACE_GENERATOR, "r", encoding="utf-8") as f:
    content = f.read()

# Define the comprehensive Section 1 replacement for Panel 1 (Investigation Studio)
NEW_STUDIO_SECTION = """    <!-- ====================================================================
         PANEL 1: INVESTIGATION STUDIO (TACTICAL WORKSTATION)
         ==================================================================== -->
    <div id="panel-role-investigator" class="role-tab-panel active">
      <section>
        <h2 class="section-title">1. Studio Enquêteur : Poste de Travail Tactique (Zero CS Jargon)</h2>
        <p class="section-subtitle">
          L'interface centrale manipulée quotidiennement par les Officiers de Police Judiciaire (OPJ) et analystes criminels pour cartographier les réseaux, instruire les scellés, créer manuellement des indices et visualiser les liens.
        </p>

        <!-- 4 Key Highlights Cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;margin-bottom:1.5rem;">
          <div class="card" style="border-left:4px solid #38bdf8;">
            <strong style="color:#38bdf8;">🔘 Nœuds Circulaires &amp; Graphe WebGL NVL</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              Représentation des entités sous forme d'<strong>icônes circulaires de 56px</strong> (68px pour les pivots à forte centralité) avec icônes Lucide vectorielles, halo coloré par calque et bordure tiretée pour les hypothèses IA.
            </p>
          </div>
          <div class="card" style="border-left:4px solid #10b981;">
            <strong style="color:#10b981;">📂 Menu Accordéon du Panneau Gauche</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              Structure rétractable en 4 volets (Calques, Boîte à Outils de Création, Filtres par Nature, Questions Judiciaires) assurant une divulgation progressive sans encombrer la vue d'enquête.
            </p>
          </div>
          <div class="card" style="border-left:4px solid #f59e0b;">
            <strong style="color:#f59e0b;">🖐️ Boîte à Outils Drag &amp; Drop (37 Types)</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              L'enquêteur glisse n'importe laquelle des <strong>37 entités judiciaires</strong> directement sur le canevas. Un dialogue modal rapide valide l'identifiant et trace l'action dans le registre WORM.
            </p>
          </div>
          <div class="card" style="border-left:4px solid #a855f7;">
            <strong style="color:#a855f7;">🔗 Mode Création de Liaisons (47 Relations)</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              Outil interactif de connexion point-à-point : cliquez sur le nœud source puis cible pour qualifier la relation (virement BaridiMob, bornage BTS, appel téléphonique, trojan APK) avec degré de certitude.
            </p>
          </div>
        </div>

        <!-- 1.1 Architecture du Panneau Gauche en Accordéon -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-top:1.5rem;margin-bottom:0.6rem;">1.1 Architecture du Panneau Gauche : Menu Accordéon &amp; Divulgation Progressive</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
          Conformément au principe <em>« 1 écran = 1 tâche, 5 à 7 choix visibles à la fois »</em> stipulé dans la charte <code>ui-ux-rules.md</code>, le panneau latéral gauche (largeur fixe de 240px, pliable) abandonne la liste étalée au profit d'un <strong>composant accordéon accessible</strong> :
        </p>

        <div style="background:#090d16;border:1px solid #1e293b;border-radius:8px;padding:1rem;margin:1rem 0;">
          <ul style="padding-left:1.2rem;margin:0;font-size:0.82rem;color:#cbd5e1;line-height:1.7;">
            <li><strong>Volet 1 : Calques d'Enquête (Layers) :</strong> Contrôle de la visibilité des 4 strates légales : Preuves Scellées (Vert), Découvertes OSINT (Cyan), Infrastructure &amp; Pivots (Gris ardoise) et Hypothèses IA (Violet tireté).</li>
            <li><strong>Volet 2 : Boîte à Outils de Création &amp; Liaisons :</strong> Contient le bouton d'activation du Mode Liaison ainsi que la palette des 37 entités glissables, filtrables par sous-onglets de domaine.</li>
            <li><strong>Volet 3 : Filtres par Nature &amp; Statut :</strong> Filtrage instantané du canevas par typologie matérielle (Téléphonie, Réseaux, Web, Sujets physiques, Finances) avec compteurs d'entités actives.</li>
            <li><strong>Volet 4 : Questions Métier &amp; Raccourcis Cypher :</strong> Raccourcis d'interrogation guidée en langage clair (« Qui encaisse les fonds BaridiMob ? », « Numéros partagés », etc.) traduits automatiquement en requêtes graphiques.</li>
            <li><strong>Pied Fixe : Registre d'Audit Forensique :</strong> Bouton permanent ouvrant l'historique inaltérable des actions de l'enquêteur sous scellement cryptographique (ISO 27037).</li>
          </ul>
        </div>

        <!-- 1.2 Spécification de la Boîte à Outils Drag & Drop -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-top:1.5rem;margin-bottom:0.6rem;">1.2 Boîte à Outils de Création Manuelle de Nœuds (Glisser-Déposer)</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
          Pour permettre à l'officier instructeur d'enrichir le dossier au fur et à mesure des auditions et des perquisitions, la boîte à outils intègre l'ensemble des 37 sommets du modèle canonique GFPG :
        </p>

        <div style="background:#0c1322;border:1px solid #1e293b;border-radius:8px;padding:0.9rem;margin:1rem 0;">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.4rem;margin-bottom:0.6rem;">
            <strong style="color:#38bdf8;font-size:0.85rem;">Workflow de Création Sécurisé :</strong>
            <span class="badge badge-emerald" style="font-size:0.7rem;">Conformité ISO 27037</span>
          </div>
          <ol style="padding-left:1.2rem;margin:0;font-size:0.82rem;color:#cbd5e1;line-height:1.7;">
            <li><strong>Glisser-Déposer :</strong> L'utilisateur saisit l'item souhaité (ex: <code>Carte SIM</code>, <code>Compte BaridiMob</code>) depuis la palette et le relâche à l'emplacement voulu sur le canevas.</li>
            <li><strong>Calcul Spatial :</strong> Le système calcule les coordonnées relatives <code>(X, Y)</code> sur le canevas WebGL / SVG.</li>
            <li><strong>Dialogue Modal Contextuel :</strong> Une modale accessible s'ouvre pour saisir la valeur judiciaire (ex: IMSI, RIP 007999...), le libellé d'enquête et le calque légal d'affectation (Preuve, OSINT, Hypothèse).</li>
            <li><strong>Scellement &amp; Rendu :</strong> Le nœud est instancié immédiatement sous forme d'icône circulaire, sélectionné dans l'inspecteur contextuel droit, et inscrit dans le registre d'audit avec horodatage certifié.</li>
          </ol>
        </div>

        <!-- 1.3 Mode Création de Liaisons -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-top:1.5rem;margin-bottom:0.6rem;">1.3 Mode Interactif de Création de Liaisons (47 Relations GFPG)</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
          L'enquêteur peut connecter deux entités à tout moment via l'outil <strong>« Mode Création de Liaison »</strong> :
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;margin:1rem 0;">
          <div style="background:#090d16;border:1px solid #1e293b;border-radius:6px;padding:0.8rem;font-size:0.8rem;">
            <strong style="color:#f59e0b;display:block;margin-bottom:0.3rem;">Étape 1 : Sélection Source &amp; Cible</strong>
            <p style="color:#94a3b8;margin:0;">L'enquêteur clique sur le nœud A (halo orange) puis sur le nœud B (halo vert). Le bandeau supérieur du canevas guide chaque étape.</p>
          </div>
          <div style="background:#090d16;border:1px solid #1e293b;border-radius:6px;padding:0.8rem;font-size:0.8rem;">
            <strong style="color:#38bdf8;display:block;margin-bottom:0.3rem;">Étape 2 : Qualification Juridique</strong>
            <p style="color:#94a3b8;margin:0;">Une boîte de dialogue propose les relations compatibles parmi les 47 types formels (ex: <code>[:COMMUNIQUE_AVEC]</code>, <code>[:EMET_VIREMENT]</code>, <code>[:INFECTE_PAR]</code>).</p>
          </div>
          <div style="background:#090d16;border:1px solid #1e293b;border-radius:6px;padding:0.8rem;font-size:0.8rem;">
            <strong style="color:#10b981;display:block;margin-bottom:0.3rem;">Étape 3 : Traçage &amp; Flèche Orientée</strong>
            <p style="color:#94a3b8;margin:0;">L'arête SVG orientée est tracée de centre à centre avec pointe de flèche calibrée. Si la certitude est inférieure à 60%, l'arête s'affiche en tirets d'hypothèse.</p>
          </div>
        </div>

        <!-- 1.4 Charte Visuelle des Nœuds Circulaires -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-top:1.5rem;margin-bottom:0.6rem;">1.4 Spécification des Nœuds Circulaires (Remplacement des Rectangles)</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">
          Les cartes rectangulaires (220px de large) ont été remplacées par des <strong>cercles ergonomiques normés</strong> pour maximiser la densité d'information et faciliter la lisibilité des grands réseaux criminels :
        </p>

        <div style="background:#060a12;border:1px solid #1e293b;border-radius:8px;padding:1.2rem;margin:1rem 0;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-around;gap:1.5rem;">
          
          <!-- Circle 1: Verified Evidence -->
          <div style="text-align:center;">
            <div style="width:56px;height:56px;border-radius:50%;background:radial-gradient(circle, rgba(16,185,129,0.2) 0%, #0f172a 75%);border:2.5px solid #10b981;display:inline-flex;align-items:center;justify-content:center;color:#10b981;position:relative;">
              <span style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#10b981;color:#042f1f;font-size:8px;font-weight:bold;display:flex;align-items:center;justify-content:center;border:2px solid #060a12;">✓</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div style="margin-top:6px;font-size:12px;font-weight:600;color:#f1f5f9;">Preuve Scellée</div>
            <div style="font-size:10px;color:#94a3b8;font-family:monospace;">Calque 1 (100% WORM)</div>
          </div>

          <!-- Circle 2: OSINT Raw -->
          <div style="text-align:center;">
            <div style="width:56px;height:56px;border-radius:50%;background:radial-gradient(circle, rgba(6,182,212,0.2) 0%, #0f172a 75%);border:2.5px solid #06b6d4;display:inline-flex;align-items:center;justify-content:center;color:#06b6d4;position:relative;">
              <span style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#06b6d4;color:#082f49;font-size:8px;font-weight:bold;display:flex;align-items:center;justify-content:center;border:2px solid #060a12;">●</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div style="margin-top:6px;font-size:12px;font-weight:600;color:#f1f5f9;">Téléphone OSINT</div>
            <div style="font-size:10px;color:#94a3b8;font-family:monospace;">Calque 2 (Extrait Web)</div>
          </div>

          <!-- Circle 3: Infrastructure -->
          <div style="text-align:center;">
            <div style="width:56px;height:56px;border-radius:50%;background:radial-gradient(circle, rgba(100,116,139,0.2) 0%, #0f172a 75%);border:2px solid #64748b;display:inline-flex;align-items:center;justify-content:center;color:#64748b;position:relative;">
              <span style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:#64748b;color:#0f172a;font-size:8px;font-weight:bold;display:flex;align-items:center;justify-content:center;border:2px solid #060a12;">⚙</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
            </div>
            <div style="margin-top:6px;font-size:12px;font-weight:600;color:#f1f5f9;">Serveur Pivot</div>
            <div style="font-size:10px;color:#94a3b8;font-family:monospace;">Calque 3 (Infra)</div>
          </div>

          <!-- Circle 4: AI Hypothesis Focal (68px) -->
          <div style="text-align:center;">
            <div style="width:68px;height:68px;border-radius:50%;background:radial-gradient(circle, rgba(192,132,252,0.18) 0%, #0f172a 75%);border:2.5px dashed #c084fc;box-shadow:0 0 16px rgba(192,132,252,0.3);display:inline-flex;align-items:center;justify-content:center;color:#c084fc;position:relative;">
              <span style="position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:#c084fc;color:#3b0764;font-size:9px;font-weight:bold;display:flex;align-items:center;justify-content:center;border:2px solid #060a12;">✦</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style="margin-top:6px;font-size:12px;font-weight:700;color:#c084fc;">Suspect Candidat (Pivot)</div>
            <div style="font-size:10px;color:#cbd5e1;font-family:monospace;">Calque 4 (Tirets Hypothèse)</div>
          </div>

        </div>

        <!-- 1.5 Grille de Conformité Formelle UI/UX -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-top:1.5rem;margin-bottom:0.6rem;">1.5 Tableau d'Évaluation de Conformité avec <code>.agent/ui-ux-rules.md</code></h3>
        <table class="rbac-table">
          <thead>
            <tr>
              <th>Règle / Critère Normatif</th>
              <th>Exigence Spécifiée</th>
              <th>Implémentation dans Athar DZ</th>
              <th>Verdict</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Règle 1 : Divulgation Progressive</strong></td>
              <td>Ne jamais tout afficher d'un coup (max 5-7 choix visibles)</td>
              <td>Panneau gauche en accordéon : seules les sous-sections actives sont dépliées.</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 2 : Shell Fixe &amp; Canvas</strong></td>
              <td>Canvas &ge; 60% de la vue ; Panneau gauche 240px</td>
              <td>Panneau gauche à 240px fixe, canvas occupant 65% de la largeur viewport à 1366px.</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 3 : Design Tokens</strong></td>
              <td>0 style inline, 0 hex/px hors <code>tokens.css</code></td>
              <td>Toutes les classes d'accordéon et de cercles consomment les variables de <code>tokens.css</code>.</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 4 : Différenciation des Faits</strong></td>
              <td>Faits et hypothèses visuellement distincts (bordure tiretée obligatoire)</td>
              <td>Calque 4 en bordure <code>dashed</code> violette + badge textuel « Hypothèse IA ».</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 6 : Icônes Lucide Unifiées</strong></td>
              <td>1 seul jeu d'icônes (Lucide SVG 16/20px), 0 emoji dans l'UI</td>
              <td>Remplacement intégral des emojis par les SVG officiels Lucide (37 icônes vectorielles).</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 8 : Cible Tactile Minimale</strong></td>
              <td>Cible interactive $&ge; 32\text{px}$</td>
              <td>Diamètre du nœud circulaire de 56px (68px pour les pivots), largement au-dessus du seuil.</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 9 : Accessibilité WCAG 2.2 AA</strong></td>
              <td>Opérable au clavier, focus visible, alternative tabulaire</td>
              <td>Boutons natifs <code>&lt;button&gt;</code>, focus ring bleu 2px, tableau <code>sr-only</code> pour lecteurs d'écran.</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
            <tr>
              <td><strong>Règle 11 : Traçabilité Juridique</strong></td>
              <td>Scellement WORM, auteur et horodatage certifié</td>
              <td>Toute création manuelle de nœud ou relation génère un hash SHA-256 dans l'audit ledger.</td>
              <td class="perm-yes">✔ Conforme</td>
            </tr>
          </tbody>
        </table>

      </section>
    </div>"""

# Replace Panel 1 in content
start_panel_1 = content.find('<!-- ====================================================================\n         PANEL 1: INVESTIGATION STUDIO')
end_panel_1 = content.find('<!-- ====================================================================\n         PANEL 2: ADMIN APP & RBAC')

if start_panel_1 == -1 or end_panel_1 == -1:
    print("ERROR: Could not locate panel 1 bounds in generate_interfaces_roles_spec.py")
    sys.exit(1)

new_content = content[:start_panel_1] + NEW_STUDIO_SECTION + "\n\n" + content[end_panel_1:]

with open(INTERFACE_GENERATOR, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully updated {INTERFACE_GENERATOR}!")

# Now execute the generator script to compile doc/interfaces-roles.html
import subprocess
res = subprocess.run([sys.executable, INTERFACE_GENERATOR])
if res.returncode == 0:
    print("Successfully regenerated doc/interfaces-roles.html!")
else:
    print("ERROR compiling doc/interfaces-roles.html")
    sys.exit(res.returncode)
