# scripts/arch_panel_layer1.py
"""
Tab 2: Layer 1 - Acquisition Forensique, Baie Modems SIM & Phone Farm Android
Detailed architecture SVG and technical specifications.
"""

def get_panel_layer1():
    return '''    <!-- ====================================================================
         TAB 2: LAYER 1 - ACQUISITION FORENSIQUE & PHONE FARM ANDROID
         ==================================================================== -->
    <div id="panel-arch-layer1" class="arch-tab-panel">
      <section>
        <h2 class="section-title">2. Layer 1 : Acquisition Forensique, Baie Modems SIM &amp; Phone Farm Android</h2>
        <p class="section-subtitle">
          Infiltration sécurisée des écosystèmes mobiles fermés (WhatsApp, Telegram, BaridiMob, TikTok), interception matérielle des cartes SIM algériennes et préservation légale des scellés WORM.
        </p>

        <div class="card" style="border-left:4px solid #f97316;margin-bottom:1.5rem;">
          <h3 style="color:#f97316;margin-bottom:0.5rem;">🎯 Mission Opérationnelle du Layer 1</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Les réseaux criminels modernes (notamment en Algérie) évitent le web statique pour communiquer exclusivement via des messageries chiffrées de bout en bout sur smartphone. Layer 1 fournit l'infrastructure matérielle et conteneurisée permettant aux enquêteurs de piloter des instances Android 13 réelles, d'intercepter les SMS de validation OTP des opérateurs nationaux (Mobilis, Djezzy, Ooredoo) en <strong>&lt;1.5 seconde</strong> et de capturer des flux vidéo WebRTC à 60 FPS sans latence perceptible (&lt;30ms). <strong>Rôle d'ingestion périphérique :</strong> Layer 1 ne stocke pas de données applicatives : il transmet les flux vers <strong>Layer 2</strong> pour normalisation et scelle les preuves brutes directement dans <strong>MinIO WORM (Layer 3)</strong>.
          </p>
        </div>

        <!-- Layer 1 Specific High-Resolution Architecture SVG -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 940 430" xmlns="http://www.w3.org/2000/svg" style="min-width:880px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-l1-orange" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f97316"/>
              </marker>
              <marker id="arr-l1-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
              </marker>
              <marker id="arr-l1-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
              </marker>
            </defs>

            <!-- SUB-BLOCK 1: HARDWARE MODEM POOL -->
            <g transform="translate(20, 25)">
              <rect x="0" y="0" width="275" height="255" rx="8" fill="#140f0a" stroke="#f97316" stroke-width="1.8"/>
              <text x="15" y="25" fill="#f97316" font-size="11.5" font-weight="bold">1. BANQUE MODEMS GSM USB 4G DZ</text>
              <text x="15" y="42" fill="#fed7aa" font-size="8.5">• Racks USB SIM800C &amp; SIM7600G-H</text>
              <text x="15" y="58" fill="#fed7aa" font-size="8.5">• Puces SIM Mobilis, Djezzy, Ooredoo</text>
              <text x="15" y="74" fill="#fed7aa" font-size="8.5">• Kernel Linux /dev/ttyUSB0..31</text>
              <text x="15" y="90" fill="#fed7aa" font-size="8.5">• Daemon AT Commands (pyserial async)</text>

              <rect x="15" y="105" width="245" height="42" rx="4" fill="#2c1f14" stroke="#f97316" stroke-width="0.8"/>
              <text x="22" y="122" fill="#fdba74" font-size="8.5" font-weight="bold">⚡ Interception SMS OTP en &lt;1.5s</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Push asynchrone direct vers Redis Streams</text>

              <text x="15" y="165" fill="#fed7aa" font-size="8.5">• Rotation dynamique APN 4G opérateur</text>
              <text x="15" y="181" fill="#fed7aa" font-size="8.5">• Émulation IMEI &amp; IMSI conforme</text>
              <text x="15" y="197" fill="#fed7aa" font-size="8.5">• Monitoring force signal RSSI (-65 dBm)</text>
              <rect x="15" y="212" width="245" height="28" rx="4" fill="#1e150e"/>
              <text x="22" y="230" fill="#f97316" font-size="8" font-family="monospace">Driver: pyserial-asyncio (Port ttyUSB)</text>
            </g>

            <!-- SUB-BLOCK 2: REDROID ANDROID 13 FARM -->
            <g transform="translate(325, 25)">
              <rect x="0" y="0" width="290" height="255" rx="8" fill="#1a140d" stroke="#f97316" stroke-width="1.8"/>
              <text x="15" y="25" fill="#f97316" font-size="11.5" font-weight="bold">2. FERME CONTENEURS ANDROID 13</text>
              <text x="15" y="42" fill="#fed7aa" font-size="8.5">• ReDroid AOSP Android 13 (Docker Engine)</text>
              <text x="15" y="58" fill="#fed7aa" font-size="8.5">• GPU Passthrough accélération virgl / mesa</text>
              <text x="15" y="74" fill="#fed7aa" font-size="8.5">• Masquage Root : Magisk 26 + Zygisk</text>
              <text x="15" y="90" fill="#fed7aa" font-size="8.5">• Évasion détection Play Integrity / SafetyNet</text>

              <rect x="15" y="105" width="260" height="42" rx="4" fill="#2c1f14" stroke="#f97316" stroke-width="0.8"/>
              <text x="22" y="122" fill="#fdba74" font-size="8.5" font-weight="bold">🛡️ Profiling d'Application Criminelle</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">BaridiMob cloné, WhatsApp Business, Telegram</text>

              <text x="15" y="165" fill="#fed7aa" font-size="8.5">• Pont réseau isolé avec KillSwitch VPN</text>
              <text x="15" y="181" fill="#fed7aa" font-size="8.5">• ADB over TCP (Port 5555)</text>
              <text x="15" y="197" fill="#fed7aa" font-size="8.5">• Appium WebDriver 2.x pour injection tactile</text>
              <rect x="15" y="212" width="260" height="28" rx="4" fill="#1e150e"/>
              <text x="22" y="230" fill="#f97316" font-size="8" font-family="monospace">Orchestrateur: Celery + Docker SDK</text>
            </g>

            <!-- SUB-BLOCK 3: SCRCPY WEBRTC STREAMING -->
            <g transform="translate(645, 25)">
              <rect x="0" y="0" width="275" height="255" rx="8" fill="#141a24" stroke="#38bdf8" stroke-width="1.8"/>
              <text x="15" y="25" fill="#38bdf8" font-size="11.5" font-weight="bold">3. STREAMING SCRCPY WEBRTC 60 FPS</text>
              <text x="15" y="42" fill="#7dd3fc" font-size="8.5">• Serveur scrcpy injecté dans ReDroid</text>
              <text x="15" y="58" fill="#7dd3fc" font-size="8.5">• Encodage H.264 matériel ultra-faible latence</text>
              <text x="15" y="74" fill="#7dd3fc" font-size="8.5">• Passerelle WebRTC vers navigateur enquêteur</text>
              <text x="15" y="90" fill="#7dd3fc" font-size="8.5">• Latence verre-à-verre &lt;30 millisecondes</text>

              <rect x="15" y="105" width="245" height="42" rx="4" fill="#162a40" stroke="#38bdf8" stroke-width="0.8"/>
              <text x="22" y="122" fill="#bae6fd" font-size="8.5" font-weight="bold">🎮 Contrôle Interactif Transparent</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Navigation tactile, clavier, presse-papier</text>

              <text x="15" y="165" fill="#7dd3fc" font-size="8.5">• Enregistrement continu de session (MP4)</text>
              <text x="15" y="181" fill="#7dd3fc" font-size="8.5">• Capture d'écran horodatée en 1 clic</text>
              <text x="15" y="197" fill="#7dd3fc" font-size="8.5">• Scellement automatique dans MinIO WORM</text>
              <rect x="15" y="212" width="245" height="28" rx="4" fill="#0f1f33"/>
              <text x="22" y="230" fill="#38bdf8" font-size="8" font-family="monospace">Flux: WSS / WebRTC Video RFC 8825</text>
            </g>

            <!-- SUB-BLOCK 4: MITMPROXY & FORENSICS -->
            <g transform="translate(20, 295)">
              <rect x="0" y="0" width="900" height="115" rx="8" fill="#101c18" stroke="#10b981" stroke-width="1.8"/>
              <text x="15" y="24" fill="#10b981" font-size="12" font-weight="bold">4. INTERCEPTION RÉSEAU TLS 1.3, RÉTRO-INGÉNIERIE APK &amp; CAPTURE WEB WORM</text>
              <text x="15" y="42" fill="#a7f3d0" font-size="9">• Mitmproxy 10.3 avec certificat CA injecté au niveau système Android (/system/etc/security/cacerts/)</text>

              <g transform="translate(15, 52)">
                <rect x="0" y="0" width="275" height="50" rx="4" fill="#143026" stroke="#10b981" stroke-width="0.8"/>
                <text x="10" y="18" fill="#bbf7d0" font-size="8.5" font-weight="bold">💉 Frida 16.x Script Injection</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">Contournement du SSL Pinning WhatsApp &amp; apps bancaires</text>
                <text x="10" y="44" fill="#6ee7b7" font-size="7">Hook OkHttp, TrustManager, NetworkSecurityConfig</text>
              </g>

              <g transform="translate(305, 52)">
                <rect x="0" y="0" width="275" height="50" rx="4" fill="#143026" stroke="#10b981" stroke-width="0.8"/>
                <text x="10" y="18" fill="#bbf7d0" font-size="8.5" font-weight="bold">🔍 Jadx-GUI &amp; Ghidra Sandbox</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">Décompilation d'APKs malveillantes (ex: AutoPneusDZ.apk)</text>
                <text x="10" y="44" fill="#6ee7b7" font-size="7">Extraction serveurs C2, permissions et clés volées</text>
              </g>

              <g transform="translate(595, 52)">
                <rect x="0" y="0" width="290" height="50" rx="4" fill="#143026" stroke="#10b981" stroke-width="0.8"/>
                <text x="10" y="18" fill="#bbf7d0" font-size="8.5" font-weight="bold">📸 ArchiveBox WARC Snapshot (ISO 28500)</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">Glace les fausses boutiques et profils réseaux sociaux</text>
                <text x="10" y="44" fill="#6ee7b7" font-size="7">Dépôt scellé direct dans MinIO WORM S3</text>
              </g>
            </g>

            <!-- Connectors Between Sub-Blocks -->
            <path d="M 295 140 L 325 140" stroke="#f97316" stroke-width="2" marker-end="url(#arr-l1-orange)"/>
            <text x="298" y="132" fill="#fdba74" font-size="7.5" font-family="monospace">SMS OTP</text>

            <path d="M 615 140 L 645 140" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-l1-cyan)"/>
            <text x="618" y="132" fill="#7dd3fc" font-size="7.5" font-family="monospace">H.264 Raw</text>

            <path d="M 470 280 L 470 295" stroke="#10b981" stroke-width="2" marker-end="url(#arr-l1-green)"/>
          </svg>
        </div>

        <!-- Technical Deep-Dive Narrative -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Spécifications d'Ingénierie &amp; Procédures de Cloaking du Layer 1</h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.55;">
          L'infiltration judiciaire requiert une imperméabilité totale face aux protections anti-fraude déployées par les éditeurs d'applications :
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;margin-bottom:1.5rem;">
          <div style="background:#0c1322;border:1px solid #1e293b;border-radius:6px;padding:0.9rem;">
            <h4 style="color:#f97316;margin:0 0 0.4rem;font-size:0.9rem;">1. Masquage Zygisk &amp; Émulation Matérielle</h4>
            <p style="color:#cbd5e1;font-size:0.78rem;line-height:1.45;margin:0;">
              Chaque conteneur ReDroid charge un module <code>Zygisk-Next</code> qui intercepte les appels système <code>stat()</code> et <code>access()</code> pour masquer la présence des fichiers suspects (<code>/system/bin/su</code>, <code>/system/xbin/daemonsu</code>). Le <code>build.prop</code> est forgé avec l'empreinte d'un Samsung Galaxy S23 officiel algérien (SM-S911B) avec certificat de sécurité conforme.
            </p>
          </div>
          <div style="background:#0c1322;border:1px solid #1e293b;border-radius:6px;padding:0.9rem;">
            <h4 style="color:#38bdf8;margin:0 0 0.4rem;font-size:0.9rem;">2. Interception AT des SMS OTP en &lt;1.5s</h4>
            <p style="color:#cbd5e1;font-size:0.78rem;line-height:1.45;margin:0;">
              Les modems SIM800C/7600 sont pilotés en mode <code>AT+CNMI=2,2,0,0,0</code>, ce qui déclenche un événement <code>+CMT:</code> immédiat dès la réception d'un SMS sans attendre l'écriture sur la puce SIM. Une tâche Celery extrait le code 6 chiffres par expression régulière et le pousse instantanément dans Redis Streams pour valider WhatsApp ou BaridiMob.
            </p>
          </div>
          <div style="background:#0c1322;border:1px solid #1e293b;border-radius:6px;padding:0.9rem;">
            <h4 style="color:#10b981;margin:0 0 0.4rem;font-size:0.9rem;">3. Préservation Cryptographique WORM ISO 28500</h4>
            <p style="color:#cbd5e1;font-size:0.78rem;line-height:1.45;margin:0;">
              Dès qu'une page frauduleuse ou un canal Telegram est aspiré, ArchiveBox compile l'ensemble des requêtes HTTP brutes, certificats TLS et captures d'écran dans une archive WARC. Le hash SHA-256 de ce fichier est immédiatement scellé dans <strong>MinIO S3 (Mode COMPLIANCE)</strong> avec horodatage RFC 3161, rendant la preuve recevable devant la juridiction de jugement.
            </p>
          </div>
        </div>

        <!-- Tech Stack Evaluation Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 1 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ReDroid</strong></td>
              <td><span class="badge-ver">Android 13 AOSP</span></td>
              <td>Exécution isolée d'applications Android sur serveur hôte Linux avec accélération GPU</td>
              <td>
                <ul class="pros-list">
                  <li>Démarrage d'une instance complète en &lt;8 secondes</li>
                  <li>Densité de conteneurs élevée (jusqu'à 16 smartphones virtuels par serveur 64 Go RAM)</li>
                  <li>Compatibilité totale avec l'écosystème ARM via libndk_translation</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Certaines applications bancaires détectent les hyperviseurs</li>
                  <li>Mitigation : cloaking Zygisk + MagiskHidePropsConf</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Scrcpy WebRTC</strong></td>
              <td><span class="badge-ver">v2.4 / WebRTC</span></td>
              <td>Miroir d'écran haute fluidité et commande tactile interactive dans le navigateur</td>
              <td>
                <ul class="pros-list">
                  <li>Fréquence 60 FPS sans à-coups avec latence inférieure à 30 ms</li>
                  <li>Aucune application cliente requise : rendu HTML5 Canvas WebRTC standard</li>
                  <li>Faible consommation de bande passante réseau (&lt;2.5 Mbps en H.264)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Consommation GPU sur encodage vidéo simultané de 10+ flux</li>
                  <li>Mitigation : carte d'accélération Nvidia NVENC dédiée aux conteneurs</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Mitmproxy</strong></td>
              <td><span class="badge-ver">v10.3.0</span></td>
              <td>Interception et déchiffrement des flux HTTPS/WebSockets des cibles mobiles</td>
              <td>
                <ul class="pros-list">
                  <li>Inspection transparente de toutes les requêtes REST et WebSockets des APKs</li>
                  <li>Scripting Python natif pour extraire les tokens de session et numéros CCP</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Bloqué par le SSL Certificate Pinning dans les versions récentes</li>
                  <li>Mitigation : script Frida universel injecté au démarrage du conteneur</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Jadx / Ghidra</strong></td>
              <td><span class="badge-ver">Jadx 1.5.0 / Ghidra 11.1</span></td>
              <td>Décompilation statique et analyse dynamique des malwares financiers ciblant l'Algérie</td>
              <td>
                <ul class="pros-list">
                  <li>Reconstitution quasi-parfaite du code Java/Kotlin et extraction des URLs C2</li>
                  <li>Désassemblage natif des bibliothèques C++ (.so) obfusquées par les criminels</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Les malwares récents utilisent des packers commerciaux (ex: Bangcle, DexGuard)</li>
                  <li>Mitigation : dump mémoire dynamique via Frida lors de l'exécution ReDroid</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
