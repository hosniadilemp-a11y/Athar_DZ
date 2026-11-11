# scripts/arch_panel_layer5.py
"""
Tab 6: Layer 5 - IA Souveraine Locale, LLM & Biométrie Multimodale
Detailed architecture SVG and technical specifications.
"""

def get_panel_layer5():
    return '''    <!-- ====================================================================
         TAB 6: LAYER 5 - IA SOUVERAINE & BIOMÉTRIE MULTIMODALE
         ==================================================================== -->
    <div id="panel-arch-layer5" class="arch-tab-panel">
      <section>
        <h2 class="section-title">6. Layer 5 : IA Souveraine Locale, LLM &amp; Biométrie Multimodale</h2>
        <p class="section-subtitle">
          Inférence 100% locale sans fuite vers le cloud : transcription phonétique de la Darija algérienne, diarisation multi-locuteurs, reconnaissance faciale ArcFace et génération sécurisée Text-to-Cypher.
        </p>

        <div class="card" style="border-left:4px solid #38bdf8;margin-bottom:1.5rem;">
          <h3 style="color:#38bdf8;margin-bottom:0.5rem;">🎯 Impératif Absolu de Souveraineté &amp; Secret de l'Instruction</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Les enregistrements vocaux interceptés sur WhatsApp, les photographies de suspects et les pièces d'identité saisies relèvent du <strong>secret absolu de l'instruction pénale</strong> (Article 11 du Code de Procédure Pénale algérien). L'envoi de ces données vers des APIs cloud étrangères (OpenAI, Google Cloud, AWS) constitue une infraction pénale grave et compromet l'intégrité de l'enquête d'État. Layer 5 exécute l'ensemble de ses modèles d'IA sur des serveurs GPU physiques sur site (On-Premise), isolés d'Internet (Air-Gapped), avec zéro transmission externe.
          </p>
        </div>

        <!-- Layer 5 Specific High-Resolution Architecture SVG -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 940 450" xmlns="http://www.w3.org/2000/svg" style="min-width:880px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-l5-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
              </marker>
              <marker id="arr-l5-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
              </marker>
            </defs>

            <!-- SUB-BLOCK 1: OLLAMA TEXT-TO-CYPHER -->
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#0d1b2a" stroke="#38bdf8" stroke-width="1.8"/>
              <text x="15" y="24" fill="#38bdf8" font-size="11.5" font-weight="bold">1. COPILOT TEXT-TO-CYPHER</text>
              <text x="15" y="40" fill="#7dd3fc" font-size="8.5">• Ollama Local Engine (Serveur Port 11434)</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Modèle : DavidLanz/text2cypher-gemma-2-9b</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Injection dynamique de l'ontologie du graphe</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Traduction requêtes françaises/arabes en Cypher</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#162c46" stroke="#38bdf8" stroke-width="0.8"/>
              <text x="22" y="122" fill="#bae6fd" font-size="8.5" font-weight="bold">🛡️ Boucle de Sécurité validate_query</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Rejet strict des clauses WRITE (DELETE, SET, DROP)</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Analyse de l'AST (Abstract Syntax Tree) Cypher</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Auto-correction en 3 tentatives si erreur syntaxe</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Temps d'inférence moyen : &lt;450ms sur RTX 4090</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#10253d"/>
              <text x="22" y="221" fill="#38bdf8" font-size="8" font-family="monospace">REST API Port 11434 • 8 Go VRAM</text>
            </g>

            <!-- SUB-BLOCK 2: FASTER-WHISPER DARIJA -->
            <g transform="translate(330, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#102422" stroke="#10b981" stroke-width="1.8"/>
              <text x="15" y="24" fill="#10b981" font-size="11.5" font-weight="bold">2. AUDIO DARIJA ALGÉRIENNE</text>
              <text x="15" y="40" fill="#a7f3d0" font-size="8.5">• Faster-Whisper Large-v3 (CTranslate2)</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Fine-tuning dialecte algérien (ar-DZ-darija)</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Gestion du code-switching (Arabe / Français)</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Découpage VAD (Voice Activity Detection)</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#173832" stroke="#10b981" stroke-width="0.8"/>
              <text x="22" y="122" fill="#bbf7d0" font-size="8.5" font-weight="bold">💰 Extraction d'Entités Criminelles (NER)</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Montants DZD (Mlayen, Dourou), RIP, Wilayas</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• PyAnnote Audio 3.1 : Diarisation 2+ locuteurs</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Extraction empreinte vocale x-vector 192-d</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Détection deepfake vocal &amp; anti-spoofing CQCC</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#112c27"/>
              <text x="22" y="221" fill="#10b981" font-size="8" font-family="monospace">CTranslate2 FP16 • 4 Go VRAM</text>
            </g>

            <!-- SUB-BLOCK 3: ARCFACE FACE RECOGNITION -->
            <g transform="translate(640, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#17122b" stroke="#a855f7" stroke-width="1.8"/>
              <text x="15" y="24" fill="#a855f7" font-size="11.5" font-weight="bold">3. BIOMÉTRIE FACIALE ARCFACE</text>
              <text x="15" y="40" fill="#d8b4fe" font-size="8.5">• ArcFace DeepFace (ResNet-100 Backbone)</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Détection et alignement rétinien RetinaFace</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Vecteur d'empreinte faciale compacte 512-d</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Résistance aux variations d'éclairage et d'angle</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
              <text x="22" y="122" fill="#e9d5ff" font-size="8.5" font-weight="bold">🎯 Indexation &amp; Rapprochement Qdrant</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Recherche 1-to-N sub-8ms sur 2M visages</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Seuil de similarité cosinus calibré &gt; 0.68</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Taux de faux positifs FAR &lt; 0.001% certifié</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Extraction sur flux vidéo WhatsApp / ReDroid</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#211336"/>
              <text x="22" y="221" fill="#a855f7" font-size="8" font-family="monospace">PyTorch TensorRT • 2 Go VRAM</text>
            </g>

            <!-- SUB-BLOCK 4: GPU VRAM ALLOCATION ARCHITECTURE -->
            <g transform="translate(20, 280)">
              <rect x="0" y="0" width="900" height="145" rx="8" fill="#0f1929" stroke="#38bdf8" stroke-width="2"/>
              <text x="15" y="25" fill="#38bdf8" font-size="12" font-weight="bold">4. RÉPARTITION MATÉRIELLE DE LA VRAM SUR SERVEUR GPU LOCAL (NVIDIA RTX 4090 24 GO)</text>
              <text x="15" y="42" fill="#7dd3fc" font-size="9">Partitionnement étanche de la mémoire vidéo GPU garantissant la cohabitation fluide de tous les modèles sans contention ni crash OOM.</text>

              <!-- Slice 1: Ollama -->
              <g transform="translate(15, 55)">
                <rect x="0" y="0" width="210" height="75" rx="5" fill="#162c46" stroke="#38bdf8" stroke-width="1.2"/>
                <text x="12" y="20" fill="#38bdf8" font-size="10" font-weight="bold">Ollama Copilot (Gemma-2)</text>
                <text x="12" y="36" fill="#cbd5e1" font-size="8.5">Poids Q4_K_M : 8.2 Go VRAM</text>
                <text x="12" y="52" fill="#94a3b8" font-size="7.5">Contexte 8k tokens • Text-to-Cypher</text>
                <text x="12" y="68" fill="#34d399" font-size="7.5">● Réservé en permanence</text>
              </g>

              <!-- Slice 2: Whisper -->
              <g transform="translate(240, 55)">
                <rect x="0" y="0" width="210" height="75" rx="5" fill="#173832" stroke="#10b981" stroke-width="1.2"/>
                <text x="12" y="20" fill="#10b981" font-size="10" font-weight="bold">Faster-Whisper Large-v3</text>
                <text x="12" y="36" fill="#cbd5e1" font-size="8.5">Poids FP16 : 4.4 Go VRAM</text>
                <text x="12" y="52" fill="#94a3b8" font-size="7.5">Acoustique Darija • Chunk 30s</text>
                <text x="12" y="68" fill="#34d399" font-size="7.5">● Inférence batch streaming</text>
              </g>

              <!-- Slice 3: PyAnnote -->
              <g transform="translate(465, 55)">
                <rect x="0" y="0" width="210" height="75" rx="5" fill="#291a42" stroke="#a855f7" stroke-width="1.2"/>
                <text x="12" y="20" fill="#a855f7" font-size="10" font-weight="bold">PyAnnote Audio 3.1</text>
                <text x="12" y="36" fill="#cbd5e1" font-size="8.5">Modèle x-vector : 2.1 Go VRAM</text>
                <text x="12" y="52" fill="#94a3b8" font-size="7.5">Segmentation locuteurs • VAD</text>
                <text x="12" y="68" fill="#34d399" font-size="7.5">● Déclenchement sur nouvel audio</text>
              </g>

              <!-- Slice 4: ArcFace & Marge -->
              <g transform="translate(690, 55)">
                <rect x="0" y="0" width="195" height="75" rx="5" fill="#1f1833" stroke="#c084fc" stroke-width="1.2"/>
                <text x="12" y="20" fill="#c084fc" font-size="10" font-weight="bold">ArcFace &amp; Tampon Sécurité</text>
                <text x="12" y="36" fill="#cbd5e1" font-size="8.5">DeepFace : 2.0 Go + Marge 7.3 Go</text>
                <text x="12" y="52" fill="#94a3b8" font-size="7.5">ResNet-100 • Alignement RetinaFace</text>
                <text x="12" y="68" fill="#34d399" font-size="7.5">● Marge anti-OOM (24 Go total)</text>
              </g>
            </g>

            <!-- Inter-block Connectors -->
            <path d="M 300 135 L 330 135" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-l5-cyan)"/>
            <path d="M 610 135 L 640 135" stroke="#10b981" stroke-width="2" marker-end="url(#arr-l5-emerald)"/>
            <path d="M 470 255 L 470 280" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-l5-cyan)"/>
          </svg>
        </div>

        <!-- Tech Stack Evaluation Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Composants Technologiques de Layer 5 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie / Modèle</th>
              <th>Version / Taille</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ollama (Text-to-Cypher)</strong></td>
              <td><span class="badge-ver">DavidLanz/gemma-2-9b (Q4)</span></td>
              <td>Traduction automatique des questions judiciaires en requêtes Cypher exécutables</td>
              <td>
                <ul class="pros-list">
                  <li>Fine-tuné spécifiquement sur la syntaxe Cypher Neo4j</li>
                  <li>Fonctionne entièrement en local sans appel API externe</li>
                  <li>Précision supérieure à 91% sur les requêtes d'investigation complexes</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Risque de génération de requêtes supprimant des données (DELETE)</li>
                  <li>Mitigation : intercepteur AST <code>validate_query</code> rejetant toute écriture</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Faster-Whisper (Darija DZ)</strong></td>
              <td><span class="badge-ver">Large-v3 (CTranslate2 FP16)</span></td>
              <td>Transcription phonétique de vocaux WhatsApp en arabe algérien parlé</td>
              <td>
                <ul class="pros-list">
                  <li>Vitesse d'inférence 4x plus rapide que l'implémentation standard Whisper</li>
                  <li>Compréhension des expressions algériennes courantes (flous, barid, mlayen)</li>
                  <li>Consommation VRAM optimisée (4.4 Go contre 10 Go sur le modèle OpenAI)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Difficulté sur les vocaux très bruités enregistrés en extérieur</li>
                  <li>Mitigation : filtre de débruitage spectral RNNoise en amont de la transcription</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>PyAnnote Audio</strong></td>
              <td><span class="badge-ver">v3.1.x (HuggingFace local)</span></td>
              <td>Séparation des locuteurs (qui a parlé quand) et extraction d'empreinte vocale</td>
              <td>
                <ul class="pros-list">
                  <li>Diarisation neuronale de pointe avec taux d'erreur DER &lt; 8%</li>
                  <li>Extraction d'embeddings vocaux 192-d comparables dans Qdrant</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Sensible aux chevauchements de voix lors de disputes téléphoniques</li>
                  <li>Mitigation : seuil VAD dynamique et pondération de confiance par segment</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>ArcFace (DeepFace)</strong></td>
              <td><span class="badge-ver">ResNet-100 (512-d)</span></td>
              <td>Reconnaissance faciale et comparaison biométrique de profils et pièces d'identité</td>
              <td>
                <ul class="pros-list">
                  <li>Marge angulaire additive (ArcFace) offrant la meilleure discrimination faciale SOTA</li>
                  <li>Tolérance élevée aux poses inclinées, lunettes et mauvaise résolution</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Temps de calcul élevé si le visage n'est pas bien cadré</li>
                  <li>Mitigation : pipeline d'alignement ultra-rapide basé sur RetinaFace MobileNet</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
