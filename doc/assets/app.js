// Interactive Controller for AegisInvestigate Documentation Portal & Tool Menu Explorer
// Uses 100% Plain Investigative Language & Icons for Non-CS Users

const SCAM_CASE_NODES = {
  fb_account: {
    id: 'fb_account',
    icon: '👤',
    type: 'Facebook Profile',
    label: 'fb.com/pneus.promo.dz',
    layer: 'verified',
    stage: 1,
    x: 35,
    y: 65,
    proof: '📸 Certified Snapshot Saved (Tamper-Proof)',
    confidence: '100% (Verified Case Clue)',
    metadata: {
      'Platform': 'Facebook Page & Marketplace Seller',
      'Display Name': 'Pneus Promo Algérie - Livraison 58 Wilayas',
      'Account Created': 'October 2026 (Recently Created Profile)',
      'Page Managers': '1 Manager located in Algiers'
    },
    standard_actions: [
      { icon: '📸', name: 'Freeze & Certify Online Page', desc: 'Saves a permanent, court-ready copy and screenshot of this Facebook profile before the scammer can delete it.', mode: 'Automatic' },
      { icon: '🔎', name: 'Search Username Across 500+ Social Networks', desc: 'Checks if the name "pneus.promo.dz" is used on Instagram, TikTok, Telegram, or classified ad sites.', mode: '1-Click Run' },
      { icon: '📢', name: 'Check Paid Sponsored Ads History', desc: 'Looks up all active and past advertisements paid for by this Facebook page.', mode: 'Automatic' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Smart Scam Pattern Check', desc: 'Recognizes typical advance-payment tyre fraud phrasing and automatically checks page manager country & ad history.', mode: 'Suggested Workflow (3 Steps)' }
    ]
  },
  fb_post: {
    id: 'fb_post',
    icon: '📢',
    type: 'Scam Advertisement Post',
    label: 'FB Post #98124 ("4 Michelin Tyres -60%")',
    layer: 'verified',
    stage: 1,
    x: 35,
    y: 230,
    proof: '📸 Certified Snapshot Saved (Tamper-Proof)',
    confidence: '100% (Verified Case Clue)',
    metadata: {
      'Announcement Text': '"Liquidation stock pneus Michelin! Commandez sur promo-pneus-express.shop ou WhatsApp +213 555 019 283. Acompte CCP requis."',
      'Attached Photos': '3 Photos of Tyre Warehouse',
      'Posted On': '08 Nov 2026 at 19:42'
    },
    standard_actions: [
      { icon: '🔍', name: 'Extract Phone Numbers, Links & Bank Accounts', desc: 'Automatically pulls out every phone number, website address, and payment account written inside the post.', mode: 'Automatic' },
      { icon: '🖼️', name: 'Check if Tyre Photos Are Stolen or Edited', desc: 'Searches the internet to see if the seller stole these tyre warehouse photos from another website.', mode: 'Automatic' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Text & Comment Clue Reader', desc: 'Reads the post and comments (in French, Arabic, or Darija) to find hidden phone numbers, CCP deposit requests, and victim complaints.', mode: 'Suggested Workflow (4 Steps)' }
    ]
  },
  scam_url: {
    id: 'scam_url',
    icon: '🌐',
    type: 'Website Link',
    label: 'promo-pneus-express.shop/order...',
    layer: 'osint',
    stage: 2,
    x: 280,
    y: 70,
    proof: '📸 Full Website Copy Preserved',
    confidence: '98% (Found Inside Scam Post)',
    metadata: {
      'Website Address': 'promo-pneus-express.shop',
      'Page Type': 'Fake Online Tyre Order Form',
      'Website Created': '01 Nov 2026 (7 days before scam post)',
      'Hidden Clues Found': 'Contains Hidden Creation Timestamp & Ad Tracker ID'
    },
    standard_actions: [
      { icon: '🏷️', name: 'Uncover Hidden Website Codes & Timestamps', desc: 'Inspects the web link and page behind the scenes to find hidden reference codes, creation timestamps, and tracking numbers.', mode: 'Automatic' },
      { icon: '🖥️', name: 'Identify Website Owner & Hosting Server', desc: 'Finds the server address hosting this website and checks when and where the domain name was registered.', mode: 'Automatic' },
      { icon: '🔗', name: 'Scan Website for Hidden Admin Pages', desc: 'Safely checks if the scammer accidentally left an open order list or control panel visible.', mode: '1-Click Run' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Website Code Inspector', desc: 'Inspects the order form and discovers that customer orders are automatically forwarded to a private Telegram account.', mode: 'Suggested Workflow (3 Steps)' }
    ]
  },
  phone_num: {
    id: 'phone_num',
    icon: '📱',
    type: 'Phone Number',
    label: '+213 555 019 283 (Ooredoo)',
    layer: 'osint',
    stage: 2,
    x: 280,
    y: 220,
    proof: '🔗 Extracted from Certified Post #98124',
    confidence: '99% (Found Inside Scam Post)',
    metadata: {
      'Phone Number': '+213 555 019 283 (0555 01 92 83)',
      'Telecom Operator': 'Ooredoo Algeria (Mobile Line)',
      'WhatsApp Status': 'Active Business Account Found',
      'Telegram Status': 'Active Personal Account Found'
    },
    standard_actions: [
      { icon: '💬', name: 'Find Linked WhatsApp, Telegram & Instagram Accounts', desc: 'Checks which social media and messaging apps were registered using this exact phone number.', mode: '1-Click Run' },
      { icon: '📇', name: 'Look Up Caller ID & Community Spam Reports', desc: 'Checks how other people have saved this number in their phones (Caller ID names & fraud warnings).', mode: '1-Click Run' },
      { icon: '🛒', name: 'Search Number Across Classified Ad Sites', desc: 'Searches Ouedkniss, Facebook Groups, and Avito for older ads posted with this phone number.', mode: 'Automatic' },
      { icon: '🚔', name: 'Check Police Prior Complaints & Call Records', desc: 'Cross-checks this number against prior fraud complaints and telecom call logs in the station.', mode: 'Automatic' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Smart Number Variations Search', desc: 'Searches online for spelled-out or spaced variations of the number (e.g. "05 55 01 92 83") across local marketplaces.', mode: 'Suggested Workflow (4 Steps)' }
    ]
  },
  clue_voice_darija: {
    id: 'clue_voice_darija',
    icon: '🎙️',
    type: 'WhatsApp Voice Note (Darija)',
    label: 'Voice Note (50,000 DZD BaridiMob Advance)',
    layer: 'osint',
    stage: 2,
    x: 280,
    y: 370,
    proof: '🔊 Audio Forensics + Faster-Whisper + PyAnnote Diarization',
    confidence: '97% (Direct Victim Audio Recording)',
    metadata: {
      'Audio Duration': '00:42 (WhatsApp Opus Codec - 16kHz)',
      'Transcription (Darija)': '"Khouya b3atli 50 000 DZD BaridiMob acompte w les pneus yewslouk l ghedwa l Kouba."',
      'French Translation': '"Mon frère, envoie-moi un acompte de 50 000 DZD par BaridiMob et les pneus t\'arriveront demain à Kouba."',
      'Speaker Diarization': 'Locuteur 01 (Suspect Homme, ~30 ans) / Locuteur 02 (Victime)',
      'Extracted Entities': 'Montant: 50 000 DZD | Canal: BaridiMob | Wilaya: Alger (Kouba)'
    },
    standard_actions: [
      { icon: '🎙️', name: 'Transcribe Algerian Darija (Offline Faster-Whisper)', desc: 'Transcribes Algerian dialect voice notes offline with zero cloud audio leakage.', mode: 'Automatic' },
      { icon: '👥', name: 'Separate Speakers & Voiceprint (PyAnnote Diarization)', desc: 'Isolates suspect speech and computes biometric pitch and acoustic embedding.', mode: 'Automatic' },
      { icon: '💳', name: 'Cross-Match BaridiMob Transaction with Post Office Records', desc: 'Queries judicial postal registry for the 50,000 DZD destination RIP.', mode: '1-Click Run' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Voiceprint & Modus Operandi Cross-Matcher', desc: 'Finds identical acoustic voice profile and advance pitch across 4 prior complaints in Blida and Algiers.', mode: 'Suggested Workflow (3 Steps)' }
    ]
  },
  db_id_node: {
    id: 'db_id_node',
    icon: '🏷️',
    type: 'Hidden Website Code & Tracker',
    label: 'Order Code #672f9a... & Ad ID #8841920',
    layer: 'infra',
    stage: 3,
    x: 530,
    y: 50,
    proof: '🔍 Extracted from Website Link & Page Source',
    confidence: '96% (Technical Clue Match)',
    metadata: {
      'What This Means': 'The website link contained an internal code (672f9a10c8b4a100129b4412) and an advertising tracker (#88419203314).',
      'Exact Creation Time Revealed': '01 Nov 2026 at 14:22:08 (Decoded from the order code)',
      'Computer Fingerprint': 'Server #c8b4a1',
      'Why It Matters': 'This exact same Ad Tracker ID is used on 2 other fake auto-parts websites!'
    },
    standard_actions: [
      { icon: '🕒', name: 'Decode Exact Creation Date from Reference Code', desc: 'Reads the hidden creation date and computer serial number embedded inside the website order reference.', mode: 'Automatic' },
      { icon: '🌐', name: 'Find All Other Websites Using This Same Tracker', desc: 'Searches the internet for any other website using Ad Tracker #88419203314 to uncover the scammer\'s other fake shops.', mode: '1-Click Run' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Scam Network Linker', desc: 'Connects 3 separate fake tyre and car-parts websites to the same creator based on their shared tracking codes.', mode: 'Suggested Workflow (2 Steps)' }
    ]
  },
  ip_node: {
    id: 'ip_node',
    icon: '🖥️',
    type: 'Website Hosting Server',
    label: 'Server 185.199.108.153 (3 Scam Sites)',
    layer: 'infra',
    stage: 3,
    x: 530,
    y: 160,
    proof: '🌐 Network Lookup Verified',
    confidence: '95% (Verified Server Link)',
    metadata: {
      'Server Address (IP)': '185.199.108.153',
      'Hosting Provider': 'European Cloud Hosting',
      'Other Sites on Same Server': 'pneus-dz-promo.shop, pieces-auto-express.com',
      'Registration Email Hint': 'am***94@gmail.com'
    },
    standard_actions: [
      { icon: '🏘️', name: 'List All Websites Hosted on This Server', desc: 'Finds other websites running on the exact same server computer.', mode: 'Automatic' },
      { icon: '📜', name: 'Look Up Website Registration History', desc: 'Finds the email address, billing clues, and date used when purchasing the website name.', mode: '1-Click Run' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Hosting & Domain Correlator', desc: 'Compares registration dates and website templates to prove the same person built all 3 sites.', mode: 'Suggested Workflow (2 Steps)' }
    ]
  },
  osn_accounts: {
    id: 'osn_accounts',
    icon: '💬',
    type: 'Linked Social Media Accounts',
    label: 'Telegram: @amine_import | IG: @auto_pieces_pro',
    layer: 'osint',
    stage: 3,
    x: 530,
    y: 270,
    proof: '📱 Matched via Phone Number +213 555 019 283',
    confidence: '94% (Direct Phone & Photo Match)',
    metadata: {
      'Telegram Account': '@amine_import (Permanent Account ID: 519283741)',
      'Instagram Account': '@auto_pieces_pro (Linked to same phone number)',
      'Older Ouedkniss Account': '"Amine Pièces Auto" (Used same phone in 2025)',
      'Profile Photo Comparison': '89% Face & Logo Match across Telegram and Instagram'
    },
    standard_actions: [
      { icon: '👤', name: 'Compare Faces & Profile Photos Across Accounts', desc: 'Checks if the profile picture on Telegram matches the person shown on Instagram or Facebook.', mode: 'Automatic' },
      { icon: '💬', name: 'Search Public Telegram Groups for Past Messages', desc: 'Finds public buy/sell groups where @amine_import posted messages in the past.', mode: '1-Click Run' },
      { icon: '📧', name: 'Find Accounts Linked to Email (am***94@gmail.com)', desc: 'Checks 120+ websites to see where the recovered email address is registered.', mode: '1-Click Run' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Suspect Profile Builder', desc: 'Combines the Telegram account, Instagram page, and older 2025 Ouedkniss ad into a single Suspect Identity.', mode: 'Suggested Workflow (3 Steps)' }
    ]
  },
  suspect_hypothesis: {
    id: 'suspect_hypothesis',
    icon: '🎯',
    type: 'Suspect Identity Summary',
    label: 'Suspect: "Amine B." (94% Match)',
    layer: 'hypothesis',
    stage: 4,
    x: 530,
    y: 380,
    proof: '🧩 Linked by Phone + Audio Darija + Telegram + BaridiMob',
    confidence: '94% (Ready for Magistrate Indictment)',
    metadata: {
      'Matching Clues': 'Phone +213 555 019 283 + Vocal Darija Kouba + Telegram @amine_import + BaridiMob RIP + 3 Scam Websites',
      'Estimated Total Damage': '1 450 000 DZD across 6 linked complaints',
      'Prior Police Records': '2 Previous Fraud Complaints Linked to Same Phone/CCP',
      'Recommended Legal Step': 'Issue Official Requisition for Ooredoo, Algérie Poste (CCP/BaridiMob) & Meta'
    },
    standard_actions: [
      { icon: '✅', name: 'Confirm & Lock as Verified Case Evidence', desc: 'Moves this suspect profile from the "Theories" layer to the locked "Verified Facts" layer.', mode: 'Investigator Action' },
      { icon: '📄', name: 'Generate Official Court & Operator Report (PDF)', desc: 'Creates a clean, illustrated judicial report with all screenshots, timeline dates, and official operator request letters.', mode: 'Investigator Action' }
    ],
    ai_actions: [
      { icon: '🤖', name: 'AI Draft Chronological Case Summary', desc: 'Writes a clear, plain-language summary of how the investigation connected the Facebook post to Suspect Amine B.', mode: '1-Click Run' }
    ]
  }
};

const SCAM_CASE_EDGES = [
  { from: 'fb_account', to: 'fb_post', label: 'Posted Ad', stage: 1 },
  { from: 'fb_post', to: 'scam_url', label: 'Contains Link', stage: 2 },
  { from: 'fb_post', to: 'phone_num', label: 'Contains Phone', stage: 2 },
  { from: 'phone_num', to: 'clue_voice_darija', label: 'Audio Sent on WhatsApp', stage: 2 },
  { from: 'scam_url', to: 'db_id_node', label: 'Reveals Code & Date', stage: 3 },
  { from: 'scam_url', to: 'ip_node', label: 'Hosted On Server', stage: 3 },
  { from: 'phone_num', to: 'osn_accounts', label: 'Registered On', stage: 3 },
  { from: 'osn_accounts', to: 'suspect_hypothesis', label: 'Identifies Suspect', stage: 4 },
  { from: 'clue_voice_darija', to: 'suspect_hypothesis', label: 'Voice & BaridiMob Match', stage: 4 },
  { from: 'db_id_node', to: 'suspect_hypothesis', label: 'Links Scam Sites', stage: 4 }
];

const STUDIO_CANDIDATE_CLUES = [
  {
    id: 'cand_baridimob',
    icon: '💳',
    title: 'Compte BaridiMob / CCP Découvert',
    source: 'Message WhatsApp extrait',
    details: 'RIP: 007 99999 0019283452 48 - Titulaire: B. Amine',
    confidence: '98%',
    added: false
  },
  {
    id: 'cand_voice_note',
    icon: '🎙️',
    title: 'Vocal WhatsApp (Darija Algérienne)',
    source: 'WhatsApp +213 555 019 283',
    details: 'Demande d\'acompte 50 000 DZD - Locuteur Homme Kouba',
    confidence: '97%',
    added: true
  },
  {
    id: 'cand_second_site',
    icon: '🌐',
    title: 'Site Miroir: pieces-auto-express.com',
    source: 'Même Ad Tracker #88419203314',
    details: 'Hébergé sur 185.199.108.153 - Domaine créé Oct 2026',
    confidence: '95%',
    added: false
  },
  {
    id: 'cand_ip_algerie_telecom',
    icon: '🌍',
    title: 'Connexion IP 4G Ooredoo (Kouba)',
    source: 'Logs Serveur Web Apache',
    details: 'Connexion admin sur promo-pneus-express.shop à 14:22',
    confidence: '91%',
    added: false
  },
  {
    id: 'cand_git_dev',
    icon: '💻',
    title: 'Fuite .git & Compte GitHub Développeur',
    source: 'promo-pneus-express.shop/.git/config',
    details: 'Auteur: Sofiane K. (sofiane.devbox99@gmail.com) • Repo: soficoder-alger/dz-shop-template',
    confidence: '99%',
    added: true
  },
  {
    id: 'cand_discord_c2',
    icon: '💬',
    title: 'Serveur Discord Clandestin « DZ-Dev & Ops Hub »',
    source: 'Webhook fuité dans commit GitHub',
    details: 'Salon #commandes-scripts : SofianeDev, ElHadj_99 et 3 Lieutenants',
    confidence: '98%',
    added: true
  },
  {
    id: 'cand_audio_boss',
    icon: '🎙️',
    title: 'Vocal Telegram VIP du Boss « El-Hadj »',
    source: 'Canal t.me/+Hd99_Management_C2',
    details: 'Ordre de fermer les 3 pages de pneus et blanchir 4M DZD en USDT P2P',
    confidence: '96%',
    added: true
  },
  {
    id: 'cand_multi_scams',
    icon: '🌐',
    title: 'Preuve Multi-Scams (Visas Schengen & Électro DZ)',
    source: 'Rapports audio Lieutenants Nadia & Farid',
    details: 'Préjudice total consolidé: 33 500 000 DZD (~140 000 USDT Tron)',
    confidence: '97%',
    added: true
  }
];

let studioState = {
  selectedNode: 'fb_post',
  engineMode: 'deterministic',
  runPolicy: 'review',
  currentStage: 4,
  currentTab: 'inspector',
  clarityMode: 'simple',
  activeView: 'board',
  layers: {
    verified: true,
    osint: true,
    infra: true,
    hypothesis: true
  }
};

function initStudioDemo() {
  const stageEl = document.getElementById('studio-graph-stage');
  if (!stageEl) return;
  renderStudio();
}

function setEngineMode(mode) {
  studioState.engineMode = mode;
  document.querySelectorAll('[data-engine-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-engine-btn') === mode);
  });
  renderInspector();
}

function setRunPolicy(policy) {
  studioState.runPolicy = policy;
  document.querySelectorAll('[data-policy-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-policy-btn') === policy);
  });
  renderInspector();
}

function setInvestigationStage(stage) {
  studioState.currentStage = stage;
  document.querySelectorAll('[data-stage-btn]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-stage-btn'), 10) === stage);
  });
  renderStudio();
}

function toggleLayer(layerName, checked) {
  studioState.layers[layerName] = checked;
  renderStudio();
}

function selectGraphNode(nodeId) {
  studioState.selectedNode = nodeId;
  studioState.currentTab = 'inspector';
  renderStudio();
}

function switchStudioRightTab(tabId) {
  studioState.currentTab = tabId;
  renderInspector();
}

function toggleClarityModeStudio() {
  studioState.clarityMode = (studioState.clarityMode === 'simple') ? 'expert' : 'simple';
  const btn = document.getElementById('btn-clarity-mode');
  if (btn) {
    btn.textContent = (studioState.clarityMode === 'simple')
      ? 'Curseur: Mode OPJ (Simple)'
      : 'Curseur: Mode Cyber (Expert)';
    btn.classList.toggle('btn-primary', studioState.clarityMode === 'expert');
  }
  renderInspector();
}

function addCandidateClueToStudio(candId) {
  const item = STUDIO_CANDIDATE_CLUES.find(c => c.id === candId);
  if (!item) return;
  item.added = true;
  alert(`Indice validé : "${item.title}" a été ajouté au dossier judiciaire et certifié.`);
  renderInspector();
}

function openSuspectDossierModal() {
  const modal = document.getElementById('studio-suspect-modal');
  if (modal) modal.style.display = 'flex';
}

function closeSuspectDossierModal() {
  const modal = document.getElementById('studio-suspect-modal');
  if (modal) modal.style.display = 'none';
}

function switchStudioView(view) {
  studioState.activeView = view;
  const stageEl = document.getElementById('studio-graph-stage');
  const storyEl = document.getElementById('studio-storyboard-stage');
  const btnBoard = document.getElementById('btn-studio-view-board');
  const btnStory = document.getElementById('btn-studio-view-story');

  if (view === 'board') {
    if (stageEl) stageEl.style.display = 'block';
    if (storyEl) storyEl.style.display = 'none';
    if (btnBoard) btnBoard.classList.add('active');
    if (btnStory) btnStory.classList.remove('active');
    renderStudio();
  } else {
    if (stageEl) stageEl.style.display = 'none';
    if (storyEl) storyEl.style.display = 'block';
    if (btnBoard) btnBoard.classList.remove('active');
    if (btnStory) btnStory.classList.add('active');
  }
}

function renderStudio() {
  const stageEl = document.getElementById('studio-graph-stage');
  if (!stageEl || studioState.activeView !== 'board') return;

  let svgLines = `<svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;">`;
  SCAM_CASE_EDGES.forEach(edge => {
    const n1 = SCAM_CASE_NODES[edge.from];
    const n2 = SCAM_CASE_NODES[edge.to];
    if (!n1 || !n2) return;
    if (edge.stage > studioState.currentStage) return;
    if (!studioState.layers[n1.layer] || !studioState.layers[n2.layer]) return;

    const x1 = n1.x + 95;
    const y1 = n1.y + 30;
    const x2 = n2.x + 95;
    const y2 = n2.y + 30;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const isDashed = (n2.layer === 'hypothesis') ? 'stroke-dasharray="6,4"' : '';
    const strokeColor = (n2.layer === 'hypothesis') ? '#8b5cf6' : '#3b82f6';

    svgLines += `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="2.2" ${isDashed} opacity="0.8" />
      <rect x="${mx - 62}" y="${my - 10}" width="124" height="20" rx="5" fill="#0b0f17" stroke="#2a364f" stroke-width="1"/>
      <text x="${mx}" y="${my + 4}" fill="#cbd5e1" font-size="9" font-family="sans-serif" font-weight="600" text-anchor="middle">${edge.label}</text>
    `;
  });
  svgLines += `</svg>`;

  let nodesHtml = '';
  Object.values(SCAM_CASE_NODES).forEach(node => {
    if (node.stage > studioState.currentStage) return;
    if (!studioState.layers[node.layer]) return;

    const layerClass = {
      verified: 'node-verified',
      osint: 'node-osint',
      infra: 'node-infra',
      hypothesis: 'node-hypothesis'
    }[node.layer] || '';

    const selectedClass = (studioState.selectedNode === node.id) ? 'selected' : '';

    nodesHtml += `
      <div class="graph-node ${layerClass} ${selectedClass}"
           style="left:${node.x}px; top:${node.y}px;"
           onclick="selectGraphNode('${node.id}')">
        <span class="node-type"><span>${node.icon}</span> <span>${node.type}</span></span>
        <div class="node-label">${node.label}</div>
      </div>
    `;
  });

  stageEl.innerHTML = svgLines + nodesHtml;
  renderInspector();
}

function renderInspector() {
  const inspectorEl = document.getElementById('studio-inspector');
  if (!inspectorEl) return;

  const activeTab = studioState.currentTab || 'inspector';

  const tabHeaderHtml = `
    <div style="display:flex;gap:0.3rem;margin-bottom:0.75rem;border-bottom:1px solid var(--border-color);padding-bottom:0.4rem;">
      <button class="btn ${activeTab === 'inspector' ? 'active' : ''}" style="flex:1;font-size:0.74rem;padding:0.35rem;" onclick="switchStudioRightTab('inspector')">
        🔍 Détails
      </button>
      <button class="btn ${activeTab === 'inbox' ? 'active' : ''}" style="flex:1;font-size:0.74rem;padding:0.35rem;" onclick="switchStudioRightTab('inbox')">
        📥 Indices (${STUDIO_CANDIDATE_CLUES.filter(c => !c.added).length})
      </button>
      <button class="btn ${activeTab === 'comparator' ? 'active' : ''}" style="flex:1;font-size:0.74rem;padding:0.35rem;" onclick="switchStudioRightTab('comparator')">
        ⚖️ Comparateur
      </button>
    </div>
  `;

  if (activeTab === 'inbox') {
    let inboxItemsHtml = '';
    STUDIO_CANDIDATE_CLUES.forEach(cand => {
      inboxItemsHtml += `
        <div style="background:var(--bg-card);border:1px solid ${cand.added ? 'var(--accent-emerald)' : 'var(--border-color)'};border-radius:8px;padding:0.65rem;margin-bottom:0.6rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
            <strong style="font-size:0.82rem;color:#93c5fd;">${cand.icon} ${cand.title}</strong>
            <span class="badge ${cand.added ? 'badge-emerald' : 'badge-amber'}" style="font-size:0.65rem;">
              ${cand.added ? '✅ Intégré' : '⏳ En attente'}
            </span>
          </div>
          <div style="font-size:0.74rem;color:var(--text-muted);margin-bottom:0.25rem;">Source: ${cand.source} | Fiabilité: ${cand.confidence}</div>
          <p style="font-size:0.77rem;color:var(--text-secondary);margin-bottom:0.45rem;">${cand.details}</p>
          ${!cand.added ? `
            <button class="btn btn-emerald" style="width:100%;justify-content:center;font-size:0.74rem;padding:0.35rem;" onclick="addCandidateClueToStudio('${cand.id}')">
              ➕ Intégrer au Graphe de Preuve
            </button>
          ` : `
            <div style="font-size:0.72rem;color:var(--accent-emerald);text-align:center;">✓ Preuve scellée dans le scellé judiciaire</div>
          `}
        </div>
      `;
    });

    inspectorEl.innerHTML = `
      ${tabHeaderHtml}
      <div class="dock-heading">
        <span>Boîte de Réception des Indices</span>
        <span class="badge badge-amber">Automatisé</span>
      </div>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.65rem;">
        Les outils d'investigation en arrière-plan ont détecté ces nouveaux éléments. Examinez-les avant de les intégrer au graphe officiel :
      </p>
      ${inboxItemsHtml}
    `;
    return;
  }

  if (activeTab === 'comparator') {
    inspectorEl.innerHTML = `
      ${tabHeaderHtml}
      <div class="dock-heading">
        <span>Comparateur de Concordance (Split-Screen)</span>
      </div>
      <p style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.65rem;">
        Confrontation directe entre la pièce initiale et les découvertes pour valider l'accusation :
      </p>
      <div style="display:flex;flex-direction:column;gap:0.6rem;">
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;padding:0.65rem;">
          <strong style="font-size:0.78rem;color:var(--accent-blue);">📢 Preuve A : Annonce FB Initiale</strong>
          <div style="font-size:0.74rem;color:var(--text-muted);margin:0.25rem 0;">"4 pneus Michelin -60%, acompte BaridiMob requis"</div>
          <div style="font-size:0.74rem;color:var(--text-secondary);">Téléphone affiché : <code>0555 01 92 83</code></div>
        </div>

        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;padding:0.65rem;">
          <strong style="font-size:0.78rem;color:var(--accent-emerald);">💳 Preuve B : Reçu BaridiMob Victime & Vocal</strong>
          <div style="font-size:0.74rem;color:var(--text-muted);margin:0.25rem 0;">Virement: 50 000 DZD vers RIP ...19283452 48 (B. Amine)</div>
          <div style="font-size:0.74rem;color:var(--text-secondary);">Vocal WhatsApp : Même locuteur Kouba</div>
        </div>

        <div style="background:rgba(16,185,129,0.08);border:1px solid var(--accent-emerald);border-radius:8px;padding:0.65rem;font-size:0.75rem;">
          <strong style="color:var(--accent-emerald);">⚖️ Concordance Judiciaire : 97.4%</strong>
          <div style="margin-top:0.3rem;color:var(--text-secondary);">
            &bull; Identité du titulaire du compte CCP concordante avec le pseudonyme Telegram (@amine_import).<br/>
            &bull; Numéro de téléphone strictement identique.<br/>
            &bull; Vocal confirmant la commande des pneus.
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Active tab: 'inspector'
  const node = SCAM_CASE_NODES[studioState.selectedNode];
  if (!node) return;

  let metaRows = '';
  Object.entries(node.metadata).forEach(([k, v]) => {
    metaRows += `
      <div style="margin-bottom:0.45rem;font-size:0.79rem;">
        <span style="color:var(--text-muted);font-weight:600;">${k}:</span>
        <span style="color:var(--text-primary);margin-left:0.25rem;">${v}</span>
      </div>
    `;
  });

  if (studioState.clarityMode === 'expert') {
    metaRows += `
      <div style="margin-top:0.6rem;padding-top:0.6rem;border-top:1px dashed var(--border-color);font-size:0.72rem;color:var(--text-muted);">
        <div><strong>SHA-256 Seal:</strong> <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4...</code></div>
        <div><strong>Gremlin Query:</strong> <code>g.V().has('clueId', '${node.id}').outE()</code></div>
      </div>
    `;
  }

  const actionsList = (studioState.engineMode === 'deterministic')
    ? node.standard_actions
    : [...node.ai_actions, ...node.standard_actions];

  let actionsHtml = '';
  actionsList.forEach(a => {
    const isAi = a.icon === '🤖';
    const badgeClass = isAi ? 'badge-purple' : 'badge-cyan';
    const buttonText = (studioState.runPolicy === 'auto' && a.mode.includes('Automatic'))
      ? '✓ Exécuté Automatiquement'
      : '▶ Lancer cet Outil';

    actionsHtml += `
      <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;padding:0.7rem;margin-bottom:0.6rem;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.3rem;gap:0.4rem;">
          <strong style="font-size:0.82rem;color:#93c5fd;">${a.icon} ${a.name}</strong>
          <span class="badge ${badgeClass}" style="font-size:0.65rem;white-space:nowrap;">${a.mode}</span>
        </div>
        <p style="font-size:0.77rem;color:var(--text-secondary);margin-bottom:0.5rem;">${a.desc}</p>
        <button class="btn ${buttonText.includes('Exécuté') ? 'btn-emerald' : ''}" style="width:100%;justify-content:center;font-size:0.75rem;padding:0.35rem 0.5rem;">
          ${buttonText}
        </button>
      </div>
    `;
  });

  inspectorEl.innerHTML = `
    ${tabHeaderHtml}
    <div>
      <div class="dock-heading">
        <span>Fiche de l'Indice Sélectionné</span>
        <span class="badge badge-blue">${node.icon} ${node.type}</span>
      </div>
      <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;padding:0.8rem;margin-bottom:1rem;">
        <div style="font-weight:700;font-size:0.92rem;margin-bottom:0.35rem;color:#fff;">${node.icon} ${node.label}</div>
        <div style="font-size:0.74rem;color:var(--accent-emerald);margin-bottom:0.65rem;background:rgba(16,185,129,0.1);padding:0.35rem 0.5rem;border-radius:6px;">
          <strong>Fiabilité:</strong> ${node.confidence}<br/>
          <strong>Preuve Judiciaire:</strong> ${node.proof}
        </div>
        ${metaRows}
      </div>

      <div class="dock-heading">
        <span>Outils Suggérés (${studioState.engineMode === 'deterministic' ? 'Mode Standard' : 'Assistant IA'})</span>
      </div>
      <div style="font-size:0.74rem;color:var(--text-secondary);margin-bottom:0.65rem;">
        Exécution: <strong style="color:var(--accent-cyan);">${studioState.runPolicy === 'auto' ? 'Automatique pour outils passifs' : 'Confirmation manuelle 1-clic'}</strong>
      </div>
      ${actionsHtml}
    </div>
  `;
}

// ============================================================================
// INTERACTIVE TOOL MENU EXPLORER (For bricks-and-automation.html)
// ============================================================================
const INVESTIGATION_TOOLS_CATALOG = [
  // Category 1: Social Media & Online Marketplaces
  {
    id: 'tool_post_archiver',
    cat: 'socmint',
    icon: '📸',
    title: 'Freeze & Certify Online Post or Page',
    subtitle: 'Saves a permanent legal copy of a Facebook post, profile, or ad before it gets deleted',
    startClue: '📢 Social Media Post or 🌐 Website Link',
    discovers: '🗄️ Tamper-Proof Screenshot, Full Page Copy, Date/Time Stamp, Attached Photos',
    howItWorks: [
      'Opens the Facebook post, Marketplace ad, or webpage through an anonymous investigation browser.',
      'Captures a full-screen visual photo, all comments, and the complete underlying webpage files.',
      'Seals the saved file with a digital legal timestamp so the defense cannot claim the screenshot was faked.'
    ],
    exampleCase: 'In the Tyre Scam case, the scammer deleted their Facebook Marketplace ad 4 hours after receiving the victim\'s deposit. Because this tool ran automatically first, the investigator kept the complete certified post and photos.',
    techEngine: 'ArchiveBox + Playwright Headless + RFC 3161 Legal Timestamp',
    mode: 'Automatic (Runs immediately when a link/post is added)'
  },
  {
    id: 'tool_text_clue_finder',
    cat: 'socmint',
    icon: '🔍',
    title: 'Extract Clues from Post, Chat, or Document',
    subtitle: 'Automatically pulls out phone numbers, links, bank/CCP accounts, and names from text',
    startClue: '📢 Social Post, 💬 Chat Log, or 📄 Police Report',
    discovers: '📱 Phone Numbers, 🌐 Website Links, 💳 Bank/CCP Numbers, 📧 Emails, 📍 Locations',
    howItWorks: [
      'Scans the text of the announcement, comments, or uploaded PDF report.',
      'Recognizes phone numbers even if written with spaces, dashes, or local formats (e.g., 0555 01 92 83 -> +213 555 019 283).',
      'Places each discovered phone number, website link, or bank account directly onto the Case Board as a new connected clue.'
    ],
    exampleCase: 'Reads the Tyre Scam Facebook announcement and automatically places two new clues on the board: the link "promo-pneus-express.shop" and the phone number "+213 555 019 283".',
    techEngine: 'Deterministic Pattern Rules + Optional Multilingual AI Reader (French/Arabic/Darija)',
    mode: 'Automatic (Offline & Instant)'
  },
  {
    id: 'tool_telegram_whatsapp',
    cat: 'socmint',
    icon: '💬',
    title: 'WhatsApp & Telegram Account Finder',
    subtitle: 'Checks if a phone number or username is active on WhatsApp Business or Telegram',
    startClue: '📱 Phone Number or 👤 Username',
    discovers: '💬 Telegram Username & Permanent ID, 🖼️ Profile Picture, 🏪 WhatsApp Business Catalog & Bio',
    howItWorks: [
      'Uses the platform\'s protected covert investigation accounts (so the investigator\'s personal phone is never exposed).',
      'Checks if the suspect\'s phone number is registered on WhatsApp and Telegram.',
      'Retrieves the suspect\'s display name, profile photo, "last seen" status, and permanent account ID number (which stays the same even if the suspect changes their username later).'
    ],
    exampleCase: 'Taking the scammer\'s phone number (+213 555 019 283), this tool uncovers their personal Telegram account "@amine_import" and retrieves their profile photo.',
    techEngine: 'Telethon + WhatsApp Web Worker via Covert Account Vault',
    mode: '1-Click Investigator Approval'
  },
  {
    id: 'tool_fb_ad_transparency',
    cat: 'socmint',
    icon: '📢',
    title: 'Facebook Page Manager & Sponsored Ad Inspector',
    subtitle: 'Reveals which country manages a Facebook Page and lists all paid ads it ran',
    startClue: '👤 Facebook Page or Profile',
    discovers: '🌍 Country of Page Administrators, 📅 Former Page Names, 💳 Active & Past Paid Ads',
    howItWorks: [
      'Queries Facebook Page Transparency records to see if the page changed its name recently (e.g., a gaming page renamed to a Tyre Shop).',
      'Checks the countries where the page administrators are located.',
      'Retrieves all sponsored advertisements paid for by this page from the Meta Ad Library.'
    ],
    exampleCase: 'Shows that "Pneus Promo Algérie" was created in October 2026 and ran 4 sponsored ads targeting car owners.',
    techEngine: 'Meta Ad Library Connector + Page Transparency Inspector',
    mode: 'Automatic (Passive)'
  },
  {
    id: 'tool_marketplace_search',
    cat: 'socmint',
    icon: '🛒',
    title: 'Classifieds & Marketplace Cross-Searcher',
    subtitle: 'Searches Ouedkniss, Facebook Marketplace, Avito & LeBonCoin for matching ads',
    startClue: '📱 Phone Number, 🏷️ Ad Title, or 🖼️ Product Photo',
    discovers: '🛒 Older Seller Listings, 👤 Linked Seller Accounts, 📍 City/Wilaya Locations',
    howItWorks: [
      'Searches local and regional classified ad websites for the same phone number, ad text, or product photos.',
      'Finds older archived listings where the scammer may have used their real name or sold personal items before starting the scam.'
    ],
    exampleCase: 'Finds an older 2025 Ouedkniss listing where the same phone number was used under the seller name "Amine Pièces Auto".',
    techEngine: 'Multi-Marketplace Scraper (FB Marketplace, Ouedkniss, Avito)',
    mode: '1-Click Investigator Approval'
  },

  // Category 2: Phone, Email & Identity Lookup
  {
    id: 'tool_phone_osn_check',
    cat: 'phone_id',
    icon: '📱',
    title: 'Phone-to-Social-Media Account Scanner',
    subtitle: 'Checks over 100 apps (Instagram, Snapchat, Amazon, TikTok) to see where a phone is registered',
    startClue: '📱 Phone Number',
    discovers: '📸 Instagram Account, 👻 Snapchat Account, 🛍️ E-Commerce Accounts, 📧 Partial Recovery Email',
    howItWorks: [
      'Validates the telecom operator (Ooredoo, Mobilis, Djezzy, Orange, etc.) and line type.',
      'Silently checks sign-in and account-check pages across major apps without sending any SMS to the suspect\'s phone.',
      'Confirms which social networks have an account tied to that phone number.'
    ],
    exampleCase: 'Confirms that +213 555 019 283 is linked to an active Instagram account (@auto_pieces_pro) and reveals a partial recovery email (am***94@gmail.com).',
    techEngine: 'PhoneInfoga + Ignorant + Toutatis',
    mode: '1-Click Investigator Approval'
  },
  {
    id: 'tool_username_2500',
    cat: 'phone_id',
    icon: '🆔',
    title: 'Username Global Footprint Finder (2,500+ Sites)',
    subtitle: 'Finds every social network, forum, or gaming site where a specific username is used',
    startClue: '👤 Username / Alias (e.g., "amine_import")',
    discovers: '🌐 All Matching Social Profiles, 🖼️ Profile Avatars, 🔗 Links in Bios',
    howItWorks: [
      'Takes a username discovered on Telegram, Instagram, or a forum and searches for that exact handle across 2,500+ websites.',
      'Extracts profile photos, biography text, and links from every matching profile.',
      'Automatically compares the profile photos so you only see accounts belonging to the same person.'
    ],
    exampleCase: 'Searching "@amine_import" finds matching accounts on TikTok, Telegram, and an auto-parts forum.',
    techEngine: 'Maigret + Sherlock + Blackbird',
    mode: '1-Click Investigator Approval'
  },
  {
    id: 'tool_email_checker',
    cat: 'phone_id',
    icon: '📧',
    title: 'Email Registration & Google Maps Reviewer',
    subtitle: 'Finds which websites an email is registered on and locates the owner\'s Google Maps reviews',
    startClue: '📧 Email Address',
    discovers: '🌐 Registered Websites (120+ platforms), 📍 Google Maps Restaurant/Shop Reviews, 🖼️ Google Account Photo',
    howItWorks: [
      'Checks 120+ online services to see where the email address has an active account.',
      'If it is a Gmail address, looks up public Google Maps reviews left by that account—showing the exact neighborhoods, cafés, and shops the suspect visits in real life!'
    ],
    exampleCase: 'A suspect\'s Gmail address reveals 14 Google Maps reviews concentrated in a single neighborhood, narrowing down their home area.',
    techEngine: 'Holehe + GHunt v2',
    mode: '1-Click Investigator Approval'
  },
  {
    id: 'tool_leaked_breach',
    cat: 'phone_id',
    icon: '🔓',
    title: 'Leaked Data Breach & Historical Record Search',
    subtitle: 'Checks if an email, phone, or username appeared in past website data leaks',
    startClue: '📧 Email, 📱 Phone Number, or 👤 Username',
    discovers: '👤 Real Name, 🏠 Past Delivery Address, 🖥️ Past IP Addresses, 🔗 Linked Emails',
    howItWorks: [
      'Searches indexed historical data breaches and leaked customer databases.',
      'Connects an anonymous username or email to a real phone number, full name, or home address recorded years ago.'
    ],
    exampleCase: 'Links an anonymous email address to a phone number used in a 2023 e-commerce data leak.',
    techEngine: 'h8mail + Local Indexed Breach Archive',
    mode: 'Automatic (Internal Database)'
  },

  // Category 3: Websites, Hidden Codes & Servers
  {
    id: 'tool_website_hidden_codes',
    cat: 'web_infra',
    icon: '🏷️',
    title: 'Website Hidden Code, Timestamp & Tracker Extractor',
    subtitle: 'Uncovers internal order codes, exact creation dates, and advertising trackers inside a website',
    startClue: '🌐 Website Link (URL)',
    discovers: '🕒 Exact Creation Timestamp, 🏷️ Ad Tracker Codes (Facebook Pixel / Google ID), 🔗 Hidden Messaging Bots',
    howItWorks: [
      'Inspects the website address and internal page code behind the scenes.',
      'Decodes internal reference numbers (for example, turning code "672f9a10..." into the exact date and second it was created: Nov 1, 2026 at 14:22:08).',
      'Extracts advertising tracker numbers (like Facebook Pixel or Google Analytics IDs) and hardcoded Telegram Bot keys used by scammers to receive stolen orders.'
    ],
    exampleCase: 'From "promo-pneus-express.shop/order?uid=672f9a10...", it reveals the listing was created Nov 1 at 14:22 and contains Facebook Ad Tracker #88419203314.',
    techEngine: 'Page Code Inspector + Timestamp Decoder + TruffleHog Secret Finder',
    mode: 'Automatic (Anonymous Proxy)'
  },
  {
    id: 'tool_twin_websites',
    cat: 'web_infra',
    icon: '🕸️',
    title: 'Find Twin Scam Websites (Shared Tracker & Server Search)',
    subtitle: 'Finds all other websites on the internet built by the same person or sharing the same tracker',
    startClue: '🏷️ Ad Tracker Code or 🖥️ Server Address',
    discovers: '🌐 Other Fake Websites Run by the Same Scammer',
    howItWorks: [
      'Scammers often create 5 or 10 fake shop websites using the exact same template, server, or Facebook/Google advertising tracker.',
      'This tool searches global website indexes for any other domain using that same tracker code or server fingerprint.',
      'Places all discovered "twin websites" onto the Case Board.'
    ],
    exampleCase: 'Using Tracker #88419203314 from the tyre website, it immediately uncovers two other scam sites: "pneus-dz-promo.shop" and "pieces-auto-express.com".',
    techEngine: 'URLScan + PublicWWW + Shodan Host Lookup + httpx',
    mode: 'Automatic (Passive)'
  },

  // Category 4: Photos, Video, Faces & Location (GEOINT)
  {
    id: 'tool_photo_forensics',
    cat: 'media_geoint',
    icon: '🖼️',
    title: 'Photo Camera Details, Forgery & Reverse Image Check',
    subtitle: 'Checks when/where a photo was taken, whether it was edited, or if it was stolen from the web',
    startClue: '🖼️ Photo or 📄 Scanned Document',
    discovers: '📍 GPS Coordinates, 📱 Phone/Camera Model, 🎨 Edited/Fake Receipt Highlight, 🌐 Original Web Source',
    howItWorks: [
      'Checks the hidden camera file information (date taken, GPS coordinates, iPhone/Samsung model).',
      'Runs an image tampering test (Error Level Analysis) that lights up if numbers on a payment receipt or ID card were digitally altered.',
      'Searches Google, Yandex, and TinEye to see if the photo was stolen from an older website.'
    ],
    exampleCase: 'Proves the 3 tyre warehouse photos in the scammer\'s post were stolen from a European wholesaler\'s website in 2023.',
    techEngine: 'ExifTool + Sherloq Image Forensics + Reverse Image Search',
    mode: 'Automatic (Offline + Web)'
  },
  {
    id: 'tool_face_matcher',
    cat: 'media_geoint',
    icon: '👤',
    title: 'Face Comparison Across Photos & Social Profiles',
    subtitle: 'Compares faces across profile pictures, ID cards, and CCTV snapshots',
    startClue: '🖼️ Photo Containing a Face',
    discovers: '🎯 Matching Social Media Profiles or Suspect Photos (% Similarity Score)',
    howItWorks: [
      'Detects faces in any uploaded photo or scraped social media profile picture.',
      'Compares facial features against all other photos in your current case (or past fraud cases in your department).',
      'Highlights matches with a clear percentage confidence score.'
    ],
    exampleCase: 'Matches the person in the Telegram profile photo (@amine_import) with the owner photo on the Instagram account (@auto_pieces_pro) at 89% similarity.',
    techEngine: 'DeepFace (ArcFace / RetinaFace) + Local Biometric Search',
    mode: 'Automatic (100% Offline & Private)'
  },
  {
    id: 'tool_outdoor_locator',
    cat: 'media_geoint',
    icon: '🗺️',
    title: 'Photo Street & Sun-Shadow Location Finder',
    subtitle: 'Estimates the city, neighborhood, and time of day of an outdoor photo even without GPS data',
    startClue: '🖼️ Outdoor Photo or Video Frame',
    discovers: '🗺️ Map Probability Heatmap, ☀️ Time-of-Day Window from Shadows',
    howItWorks: [
      'Analyzes architecture, road signs, vegetation, and terrain in an outdoor photo to predict likely locations on the map.',
      'Measures shadow angles to calculate the time of day the photo was captured.'
    ],
    exampleCase: 'Helps locate the street where a ransom video or stolen vehicle photo was taken.',
    techEngine: 'GeoCLIP Visual Locator + Bellingcat ShadowFinder',
    mode: '1-Click Investigator Approval'
  },
  {
    id: 'tool_voice_transcriber',
    cat: 'media_geoint',
    icon: '🎙️',
    title: 'Voice Note Transcriber & Speaker Matcher',
    subtitle: 'Converts WhatsApp/Telegram voice messages into searchable text and compares speaker voices',
    startClue: '🎙️ Audio Recording or Video',
    discovers: '📝 Full Text Transcript, 🔍 Mentioned Names/Phones, 🗣️ Same-Speaker Voice Match',
    howItWorks: [
      'Transcribes voice messages and calls offline (supporting Arabic, French, Darija, and English).',
      'Automatically extracts any phone numbers, meeting places, or names spoken in the audio.',
      'Compares voice characteristics across two different voice notes to tell if the same person is speaking.'
    ],
    exampleCase: 'Transcribes a WhatsApp voice note sent by the tyre scammer and matches their voice to a voice note from an earlier case.',
    techEngine: 'Faster-Whisper + Pyannote Speaker Verification',
    mode: 'Automatic (100% Offline)'
  },

  // Category 5: Police Fieldwork, Telecom & Vehicles
  {
    id: 'tool_telecom_cdr',
    cat: 'police_forensics',
    icon: '📡',
    title: 'Telecom Call Records (CDR) & Cell-Tower Mapper',
    subtitle: 'Maps a phone\'s movements via cell towers and finds who they called most frequently',
    startClue: '📄 Operator Call Log File (Excel/CSV)',
    discovers: '🗺️ Suspect Movement Map, 📞 Top Contacts Network, 👥 Phones Traveling Together',
    howItWorks: [
      'Imports official call detail records (CDR) received from Ooredoo, Mobilis, or Djezzy.',
      'Plots every cell tower the phone connected to on the Map and Timeline.',
      'Automatically highlights "co-travelers" (two phones connecting to the same cell towers at the same times) and the most frequent contacts.'
    ],
    exampleCase: 'Shows which cell tower the scammer\'s phone connected to at the exact moment they posted the Facebook ad.',
    techEngine: 'Telecom CDR Graph Analyzer + Cell Sector Map Engine',
    mode: 'Automatic (100% Offline)'
  },
  {
    id: 'tool_alibi_checker',
    cat: 'police_forensics',
    icon: '⏱️',
    title: 'Timeline & Alibi Contradiction Detector',
    subtitle: 'Spots impossible travel times or contradictions between witness statements and digital clues',
    startClue: '📅 Case Timeline Events & Statements',
    discovers: '⚠️ Impossible Travel Alerts, ❌ Statement vs. Digital Proof Contradictions',
    howItWorks: [
      'Compares the time and location of every clue on the timeline (cell tower pings, bank withdrawals, website logins, witness statements).',
      'Calculates real driving distances and flags any physical impossibility or contradiction.'
    ],
    exampleCase: 'Flags when a suspect claims their phone was stolen on Nov 9, while showing the same Telegram account continued logging in from their home Wi-Fi on Nov 10.',
    techEngine: 'Road-Network Time Solver + Timeline Verifier',
    mode: 'Automatic (100% Offline)'
  },

  // Category 6: Bank, CCP & Crypto Tracing
  {
    id: 'tool_bank_ccp_lookup',
    cat: 'finance_crypto',
    icon: '💳',
    title: 'Bank / CCP Account & Payment Handle Checker',
    subtitle: 'Validates CCP, RIB, IBAN, BaridiMob, or Wise details and checks prior fraud complaints',
    startClue: '💳 CCP / Bank Account Number or Payment Handle',
    discovers: '🏦 Bank Branch Details, 🚨 Linked Victim Complaints, 👤 Account Holder Clues',
    howItWorks: [
      'Validates the structure and branch code of CCP, RIB, or IBAN numbers requested by scammers.',
      'Cross-checks the account number against all prior fraud reports in the database to see if multiple victims paid into the same "money mule" account.',
      'Prepares a ready-to-print official requisition letter for Algérie Poste or the bank.'
    ],
    exampleCase: 'Connects the CCP account requested in the Tyre Scam to 2 previous victims who reported fraud last month.',
    techEngine: 'Banking/CCP Validator + Cross-Case Fraud Ledger',
    mode: 'Automatic (100% Offline)'
  },
  {
    id: 'tool_crypto_tracer',
    cat: 'finance_crypto',
    icon: '🪙',
    title: 'Cryptocurrency Wallet & Exchange Cash-Out Tracer',
    subtitle: 'Follows USDT, Bitcoin, or Ethereum transfers until they reach an identifiable exchange',
    startClue: '🪙 Crypto Wallet Address (USDT / BTC / ETH)',
    discovers: '🏦 Exchange Cash-Out Point (e.g., Binance, Bybit), 🔗 Linked Wallet Cluster',
    howItWorks: [
      'Traces incoming and outgoing cryptocurrency transfers across the blockchain.',
      'Groups wallets controlled by the same person and follows the money until it enters a regulated exchange (like Binance) where police can request KYC identity records.'
    ],
    exampleCase: 'Follows USDT payments from a fake investment scam through 3 wallets directly into a Binance deposit address.',
    techEngine: 'GraphSense Blockchain Tracer',
    mode: 'Automatic (Passive)'
  }
];

let currentToolCat = 'socmint';
let currentToolId = 'tool_post_archiver';

function initToolExplorer() {
  const container = document.getElementById('interactive-tool-explorer');
  if (!container) return;
  renderToolExplorer();
}

let currentToolPrereq = 'ALL';

function filterToolsByPrereq(prereq) {
  currentToolPrereq = prereq;
  renderToolExplorer();
}

function toggleToolActiveInExplorer(toolId, event) {
  if (event) event.stopPropagation();
  if (typeof FULL_TOOLS_INVENTORY !== 'undefined') {
    const t = FULL_TOOLS_INVENTORY.find(item => item.id === toolId);
    if (t) {
      t.active = !t.active;
      renderToolExplorer();
    }
  }
}

function selectToolCategory(cat) {
  currentToolCat = cat;
  if (typeof FULL_TOOLS_INVENTORY !== 'undefined') {
    const firstInCat = FULL_TOOLS_INVENTORY.find(t => (cat === 'all' || t.category === cat) && (currentToolPrereq === 'ALL' || t.req === currentToolPrereq));
    if (firstInCat) currentToolId = firstInCat.id;
  } else {
    const firstInCat = INVESTIGATION_TOOLS_CATALOG.find(t => cat === 'all' || t.cat === cat);
    if (firstInCat) currentToolId = firstInCat.id;
  }
  renderToolExplorer();
}

function selectToolItem(toolId) {
  currentToolId = toolId;
  renderToolExplorer();
}

function renderToolExplorer() {
  const listEl = document.getElementById('tool-explorer-list');
  const detailEl = document.getElementById('tool-explorer-detail');
  if (!listEl || !detailEl) return;

  document.querySelectorAll('[data-tool-cat]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tool-cat') === currentToolCat);
  });

  const useFullInventory = (typeof FULL_TOOLS_INVENTORY !== 'undefined' && FULL_TOOLS_INVENTORY.length > 0);

  if (useFullInventory) {
    const filtered = FULL_TOOLS_INVENTORY.filter(t => {
      const catMatch = (currentToolCat === 'all' || t.category === currentToolCat);
      const reqMatch = (currentToolPrereq === 'ALL' || t.req === currentToolPrereq);
      return catMatch && reqMatch;
    });

    let listHtml = '';
    filtered.forEach(t => {
      const activeClass = (t.id === currentToolId) ? 'active' : '';
      const reqColor = {
        'DIRECT': 'var(--accent-emerald)',
        'FREE_API': 'var(--accent-amber)',
        'ACCOUNT': '#f97316',
        'PAID': '#ef4444'
      }[t.req] || 'var(--text-muted)';

      listHtml += `
        <div class="tool-item-card ${activeClass}" onclick="selectToolItem('${t.id}')">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.25rem;">
            <div style="display:flex;align-items:center;gap:0.45rem;">
              <input type="checkbox" ${t.active ? 'checked' : ''} onclick="toggleToolActiveInExplorer('${t.id}', event)" style="cursor:pointer;" />
              <strong style="font-size:0.84rem;color:#fff;">${t.name}</strong>
            </div>
            <span style="font-size:0.65rem;color:${reqColor};font-weight:700;white-space:nowrap;">${t.reqLabel}</span>
          </div>
          <p style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.35rem;line-height:1.35;">${t.desc}</p>
          <div style="font-size:0.68rem;color:var(--accent-cyan);">Départ : <strong>${t.startClue}</strong></div>
        </div>
      `;
    });
    listEl.innerHTML = listHtml || '<div style="padding:1rem;color:var(--text-muted);font-size:0.8rem;">Aucun outil ne correspond à ce filtre.</div>';

    const tool = FULL_TOOLS_INVENTORY.find(t => t.id === currentToolId) || filtered[0] || FULL_TOOLS_INVENTORY[0];
    if (!tool) return;

    const storageDest = (typeof getToolStorageDestination === 'function') ? getToolStorageDestination(tool) : 'Neo4j 5.x & MinIO S3 WORM';
    const hardwareRes = tool.resources || '0.5 Core CPU • 512 Mo RAM • Conteneur Docker Rootless';

    detailEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color);">
        <div>
          <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:0.2rem;">${tool.catName}</div>
          <h3 style="font-size:1.25rem;color:#fff;margin-bottom:0.25rem;">${tool.name}</h3>
          <p style="font-size:0.86rem;color:var(--text-secondary);margin:0;">${tool.desc}</p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem;">
          <span class="badge ${tool.active ? 'badge-emerald' : 'badge-amber'}">${tool.active ? '✅ Outil Activé' : '⏸️ Désactivé'}</span>
          <span style="font-size:0.72rem;color:var(--text-muted);">${tool.reqLabel}</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.75rem;margin-bottom:1.25rem;">
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;padding:0.85rem;">
          <div style="font-size:0.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:0.3rem;">📥 Indice de Départ (Entrée)</div>
          <div style="font-size:0.86rem;font-weight:700;color:var(--accent-cyan);">${tool.startClue}</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;padding:0.85rem;">
          <div style="font-size:0.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:0.3rem;">📤 Nouveaux Indices (Sortie)</div>
          <div style="font-size:0.86rem;font-weight:700;color:var(--accent-emerald);">${tool.discovers}</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;padding:0.85rem;">
          <div style="font-size:0.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:0.3rem;">🗄️ Destination de Stockage</div>
          <div style="font-size:0.82rem;font-weight:600;color:#f59e0b;">${storageDest}</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;padding:0.85rem;">
          <div style="font-size:0.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:0.3rem;">💻 Ressources &amp; Isolation</div>
          <div style="font-size:0.8rem;font-weight:600;color:#cbd5e1;">${hardwareRes}</div>
        </div>
      </div>

      <h4 style="font-size:0.95rem;color:#fff;margin-bottom:0.5rem;">⚙️ Moteur Technique &amp; Intégration Open Source</h4>
      <div style="background:rgba(11,15,23,0.7);border:1px solid var(--border-color);border-radius:8px;padding:0.85rem;margin-bottom:1rem;font-size:0.8rem;line-height:1.5;">
        <div><strong>Moteur Sous-jacent :</strong> <code style="color:var(--accent-cyan);">${tool.engine}</code></div>
        <div style="margin-top:0.4rem;color:var(--text-secondary);">
          Cet outil opère de manière isolée dans le conteneur sandbox AegisInvestigate avec capture automatique de scellé légal (RFC 3161 + SHA-256).
        </div>
      </div>

      <div class="callout callout-emerald" style="margin-top:1.25rem;">
        <div class="callout-title">💡 Cas d'Usage Typique en Enquête</div>
        <p style="font-size:0.86rem;color:var(--text-primary);margin:0;">
          Utilisé pour extraire les preuves matérielles dès qu'un indice de type <strong>${tool.startClue}</strong> est versé au dossier, sans nécessiter de compétences techniques par l'OPJ.
        </p>
      </div>

      <div style="margin-top:1rem;padding:0.65rem 0.9rem;background:#080b11;border:1px solid var(--border-color);border-radius:8px;font-size:0.76rem;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;">
        <span><strong>Identifiant Système :</strong> <code>${tool.id}</code></span>
        <span><strong>Garantie Judiciaire :</strong> Horodatage Scellé &bull; Zéro Jargon</span>
      </div>
    `;
    return;
  }

  // Fallback to INVESTIGATION_TOOLS_CATALOG if FULL_TOOLS_INVENTORY not present
  const filtered = INVESTIGATION_TOOLS_CATALOG.filter(t => currentToolCat === 'all' || t.cat === currentToolCat);
  let listHtml = '';
  filtered.forEach(t => {
    const activeClass = (t.id === currentToolId) ? 'active' : '';
    listHtml += `
      <div class="tool-item-card ${activeClass}" onclick="selectToolItem('${t.id}')">
        <div style="display:flex;align-items:center;gap:0.55rem;margin-bottom:0.25rem;">
          <span style="font-size:1.2rem;">${t.icon}</span>
          <strong style="font-size:0.86rem;color:#fff;">${t.title}</strong>
        </div>
        <p style="font-size:0.76rem;color:var(--text-secondary);margin-bottom:0.35rem;">${t.subtitle}</p>
        <div style="font-size:0.7rem;color:var(--accent-cyan);">Starts with: <strong>${t.startClue}</strong></div>
      </div>
    `;
  });
  listEl.innerHTML = listHtml;

  const tool = INVESTIGATION_TOOLS_CATALOG.find(t => t.id === currentToolId) || filtered[0];
  if (!tool) return;

  let stepsHtml = '';
  tool.howItWorks.forEach((step, idx) => {
    stepsHtml += `
      <div class="flow-step">
        <span class="flow-step-num">Step ${idx + 1}</span>
        <p style="font-size:0.83rem;color:var(--text-primary);margin:0;">${step}</p>
      </div>
    `;
  });

  detailEl.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color);">
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div style="font-size:2.2rem;background:var(--bg-card);width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-color);">
          ${tool.icon}
        </div>
        <div>
          <h3 style="font-size:1.25rem;color:#fff;margin-bottom:0.2rem;">${tool.title}</h3>
          <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;">${tool.subtitle}</p>
        </div>
      </div>
      <span class="badge badge-emerald">${tool.mode}</span>
    </div>

    <div class="grid-2" style="margin-bottom:1.25rem;">
      <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;padding:0.9rem;">
        <div style="font-size:0.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:0.3rem;">📥 Clue You Start With</div>
        <div style="font-size:0.92rem;font-weight:700;color:var(--accent-cyan);">${tool.startClue}</div>
      </div>
      <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:10px;padding:0.9rem;">
        <div style="font-size:0.72rem;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:0.3rem;">📤 New Clues Discovered Automatically</div>
        <div style="font-size:0.9rem;font-weight:700;color:var(--accent-emerald);">${tool.discovers}</div>
      </div>
    </div>

    <h4 style="font-size:0.95rem;color:#fff;margin-bottom:0.5rem;">⚙️ How This Tool Extracts Information (Step-by-Step)</h4>
    <div class="extraction-flow-box">
      ${stepsHtml}
    </div>

    <div class="callout callout-emerald" style="margin-top:1.25rem;">
      <div class="callout-title">💡 Real Investigation Example (Tyre Scam Case)</div>
      <p style="font-size:0.86rem;color:var(--text-primary);margin:0;">${tool.exampleCase}</p>
    </div>

    <div style="margin-top:1rem;padding:0.65rem 0.9rem;background:#080b11;border:1px solid var(--border-color);border-radius:8px;font-size:0.76rem;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;">
      <span><strong>🔧 Technical Engine (Hidden from Non-CS Users):</strong> <code>${tool.techEngine}</code></span>
      <span><strong>🛡️ Legal Proof:</strong> Automatic Snapshot &amp; Audit Log</span>
    </div>
  `;
}

// ============================================================================
// VISUAL ONTOLOGY EXPLORER (For data-model.html)
// ============================================================================
const ONTOLOGY_ENTITIES = {
  person: {
    icon: '🎯',
    name: 'Suspect / Person',
    color: '#a78bfa',
    plainMeaning: 'A real-world individual (suspect, victim, witness, or page owner) that the investigation is trying to identify or locate.',
    exampleValue: 'Suspect "Amine B." (Born 1994, Algiers)',
    connectedClues: ['📱 Uses Phone Number', '💬 Owns Social Media Account', '💳 Holds Bank/CCP Account', '🚗 Drives Vehicle'],
    availableTools: ['Compare Faces Across Photos', 'Check Prior Police Records', 'Generate Judicial Court Report']
  },
  social_account: {
    icon: '👤',
    name: 'Social Media or Messaging Account',
    color: '#60a5fa',
    plainMeaning: 'Any online profile on Facebook, Instagram, Telegram, WhatsApp, TikTok, or classified ad sites like Ouedkniss.',
    exampleValue: 'Facebook: fb.com/pneus.promo.dz | Telegram: @amine_import',
    connectedClues: ['📢 Published Scam Post', '📱 Registered with Phone Number', '🖼️ Uses Profile Picture'],
    availableTools: ['Freeze & Certify Online Profile', 'Search Username Across 2,500+ Sites', 'Check Facebook Page Transparency']
  },
  social_post: {
    icon: '📢',
    name: 'Online Post, Ad, or Message',
    color: '#34d399',
    plainMeaning: 'A specific marketplace announcement, comment, video post, or chat message where the crime or scam took place.',
    exampleValue: 'Facebook Marketplace Ad #98124 ("4 Michelin Tyres -60%")',
    connectedClues: ['🌐 Contains Website Link', '📱 Mentions Phone Number', '🖼️ Attaches Product Photos'],
    availableTools: ['Extract Phone Numbers & Links from Text', 'Freeze & Certify Post Before Deletion', 'Check if Attached Photos Are Stolen']
  },
  phone: {
    icon: '📱',
    name: 'Phone Number',
    color: '#22d3ee',
    plainMeaning: 'A mobile or landline telephone number used to contact victims, receive WhatsApp messages, or register social media accounts.',
    exampleValue: '+213 555 019 283 (Ooredoo Algeria)',
    connectedClues: ['💬 Linked to WhatsApp / Telegram / Instagram', '📡 Connects to Cell Towers (CDR)', '🛒 Listed in Older Marketplace Ads'],
    availableTools: ['Find Linked WhatsApp, Telegram & Instagram', 'Look Up Caller ID & Spam Reports', 'Map Cell Tower Movements (CDR)']
  },
  website: {
    icon: '🌐',
    name: 'Website Link & Domain',
    color: '#fbbf24',
    plainMeaning: 'An external website, fake online shop, or phishing link sent to victims.',
    exampleValue: 'https://promo-pneus-express.shop/order?uid=672f9a...',
    connectedClues: ['🏷️ Contains Hidden Creation Code & Ad Tracker', '🖥️ Hosted on Server (IP)', '📧 Registered by Email'],
    availableTools: ['Uncover Hidden Website Codes & Creation Date', 'Find Twin Scam Websites Sharing Same Tracker', 'Identify Website Hosting Server']
  },
  hidden_code: {
    icon: '🏷️',
    name: 'Hidden Website Code & Ad Tracker',
    color: '#f43f5e',
    plainMeaning: 'Behind-the-scenes reference numbers and advertising pixels inside a website that reveal when it was built and link sibling scam sites together.',
    exampleValue: 'Order Code #672f9a... (Created Nov 1, 14:22) & Ad Tracker #8841920',
    connectedClues: ['🌐 Embedded Inside Scam Website', '🕸️ Shared Across 3 Twin Scam Websites'],
    availableTools: ['Decode Exact Creation Date from Code', 'Find All Other Websites Using This Same Tracker']
  }
};

function selectOntologyEntity(key) {
  const box = document.getElementById('ontology-detail-box');
  if (!box || !ONTOLOGY_ENTITIES[key]) return;
  const e = ONTOLOGY_ENTITIES[key];

  document.querySelectorAll('[data-onto-node]').forEach(el => {
    el.style.strokeWidth = (el.getAttribute('data-onto-node') === key) ? '4' : '2';
  });

  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
      <span style="font-size:2rem;">${e.icon}</span>
      <div>
        <h3 style="font-size:1.15rem;color:${e.color};margin:0;">${e.name}</h3>
        <div style="font-size:0.78rem;color:var(--text-muted);">Example: <strong>${e.exampleValue}</strong></div>
      </div>
    </div>
    <p style="font-size:0.9rem;color:var(--text-primary);margin-bottom:0.9rem;">${e.plainMeaning}</p>
    <div class="grid-2" style="margin-bottom:0;">
      <div style="background:#0b0f17;padding:0.75rem;border-radius:8px;border:1px solid var(--border-color);">
        <strong style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-cyan);display:block;margin-bottom:0.35rem;">🔗 How It Connects on the Case Board</strong>
        <ul style="padding-left:1.1rem;font-size:0.82rem;color:var(--text-secondary);">
          ${e.connectedClues.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      <div style="background:#0b0f17;padding:0.75rem;border-radius:8px;border:1px solid var(--border-color);">
        <strong style="font-size:0.75rem;text-transform:uppercase;color:var(--accent-emerald);display:block;margin-bottom:0.35rem;">🧰 Automatic Tools Suggested for This Clue</strong>
        <ul style="padding-left:1.1rem;font-size:0.82rem;color:var(--text-secondary);">
          ${e.availableTools.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Generic Table Filter
function filterTable(inputId, tableId, categoryFilterId) {
  const input = document.getElementById(inputId);
  const categorySelect = categoryFilterId ? document.getElementById(categoryFilterId) : null;
  const table = document.getElementById(tableId);
  if (!table) return;

  const query = input ? input.value.toLowerCase().trim() : '';
  const category = categorySelect ? categorySelect.value.toLowerCase().trim() : 'all';

  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    const rowCat = (row.getAttribute('data-category') || '').toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesCat = (category === 'all' || !category) || rowCat.includes(category);
    row.style.display = (matchesQuery && matchesCat) ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initStudioDemo();
  initToolExplorer();
  selectOntologyEntity('social_post');
});
