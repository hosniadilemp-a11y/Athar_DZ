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
// VISUAL ONTOLOGY EXPLORER (For data-model.html) - 37 NODES FULL REGISTRY
const ONTOLOGY_ENTITIES = {
  "wilaya": {
    icon: "\ud83c\udfdb\ufe0f",
    name: "Wilaya (Collectivit\u00e9 Territoriale)",
    domain: "territory",
    domainName: "1. Judiciaire & Territoire DZ",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#10b981",
    plainMeaning: "Circonscription administrative et juridictionnelle alg\u00e9rienne (01 \u00e0 58), d\u00e9finissant le ressort de comp\u00e9tence territoriale de la brigade et de la cour de justice.",
    exampleValue: "Wilaya 16 - Alger (Code INSEE DZ: 16000)",
    storageJustification: "Stock\u00e9 en table relationnelle PostgreSQL pour le contr\u00f4le d'acc\u00e8s multi-wilayas RLS (Row-Level Security) et projet\u00e9 dans Neo4j comme ancre territoriale macroscopique.",
    schemaProps: [{"name": "code_wilaya", "type": "String (PK, 2 digits '01'..'58')", "required": true, "desc": "Code officiel de la wilaya alg\u00e9rienne"}, {"name": "nom_ar", "type": "String", "required": true, "desc": "Nom officiel en arabe (\u0627\u0644\u062c\u0632\u0627\u0626\u0631)"}, {"name": "nom_fr", "type": "String", "required": true, "desc": "Nom officiel en fran\u00e7ais (Alger)"}, {"name": "chef_lieu", "type": "String", "required": true, "desc": "Chef-lieu de wilaya"}],
    connectedClues: ["Contient des Da\u00efras ([:CONTIENT_DAIRA])", "Territoire d'action criminelle suspect ([:ACTIVE_DANS_WILAYA])"],
    availableTools: ["Filtrage territorial multi-wilayas", "Cartographie SIG MapLibre", "Calcul de comp\u00e9tence territoriale CPP"]
  },
  "daira": {
    icon: "\ud83c\udfd8\ufe0f",
    name: "Da\u00efra (Sous-Pr\u00e9fecture)",
    domain: "territory",
    domainName: "1. Judiciaire & Territoire DZ",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#10b981",
    plainMeaning: "Subdivision administrative interm\u00e9diaire rattach\u00e9e \u00e0 une wilaya, regroupant plusieurs communes sous la juridiction d'un tribunal d'arrondissement.",
    exampleValue: "Da\u00efra de Dar El Be\u00efda (Wilaya 16)",
    storageJustification: "Table relationnelle avec cl\u00e9 \u00e9trang\u00e8re vers Wilaya, n\u0153ud graphe pour les analyses hi\u00e9rarchiques APOC.",
    schemaProps: [{"name": "id_daira", "type": "String (PK)", "required": true, "desc": "Identifiant unique de la da\u00efra"}, {"name": "nom_fr", "type": "String", "required": true, "desc": "Nom en fran\u00e7ais"}, {"name": "code_wilaya", "type": "String (FK)", "required": true, "desc": "Code de la wilaya parente"}],
    connectedClues: ["Appartient \u00e0 une Wilaya ([:APPARTIENT_A])", "Contient des Communes ([:CONTIENT_COMMUNE])"],
    availableTools: ["Filtrage en cascade /dairas/", "Agr\u00e9gation de criminalit\u00e9 locale"]
  },
  "commune": {
    icon: "\ud83d\udccd",
    name: "Commune (Municipalit\u00e9)",
    domain: "territory",
    domainName: "1. Judiciaire & Territoire DZ",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#10b981",
    plainMeaning: "\u00c9chelon municipal de base en Alg\u00e9rie (1 541 communes). Localisation pr\u00e9cise des retraits GAB, des antennes relais et des domiciles des mis en cause.",
    exampleValue: "Commune de Bab Ezzouar (Code postal: 16311)",
    storageJustification: "PostgreSQL pour les index g\u00e9ographiques PostGIS et les requ\u00eates spatiales de bornage ; n\u0153ud Neo4j pour le calcul de l'attribut d\u00e9riv\u00e9 _comune_Activite.",
    schemaProps: [{"name": "id_commune", "type": "String (PK)", "required": true, "desc": "Identifiant officiel commune"}, {"name": "nom_fr", "type": "String", "required": true, "desc": "Nom de la commune"}, {"name": "code_postal", "type": "String", "required": true, "desc": "Code postal alg\u00e9rien"}, {"name": "geopoint", "type": "Point (WGS84)", "required": false, "desc": "Coordonn\u00e9es GPS de la mairie"}],
    connectedClues: ["Appartient \u00e0 une Da\u00efra ([:APPARTIENT_A])", "Abrite des Unit\u00e9s de police ([:SITUEE_DANS])", "Lieu de retraits GAB ([:SITUE_A])"],
    availableTools: ["Rayon d'action criminel (_comune_Activite)", "Interpolation spatiale de bornage"]
  },
  "unite": {
    icon: "\ud83c\udfe2",
    name: "Unit\u00e9 de Police Judiciaire / Brigade",
    domain: "territory",
    domainName: "1. Judiciaire & Territoire DZ",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#10b981",
    plainMeaning: "Service d'enqu\u00eate op\u00e9rationnel traitant le dossier : Brigade de Recherche de la Gendarmerie Nationale, S\u00fbret\u00e9 Urbaine DGSN, ou Service Central Cyber.",
    exampleValue: "Brigade de Recherches Bab Ezzouar (GN)",
    storageJustification: "Table ACID pour les habilitations des officiers, l'attribution des scell\u00e9s et le contr\u00f4le strict des acc\u00e8s aux dossiers judiciaires.",
    schemaProps: [{"name": "id_unite", "type": "String (PK)", "required": true, "desc": "Code unit\u00e9 judiciaire"}, {"name": "nom_unite", "type": "String", "required": true, "desc": "D\u00e9nomination officielle"}, {"name": "corps", "type": "Enum [GN, DGSN, POL_SPEC]", "required": true, "desc": "Corps d'appartenance"}, {"name": "id_commune", "type": "String (FK)", "required": true, "desc": "Commune d'implantation"}],
    connectedClues: ["Traite une Affaire ([:TRAITE_AFFAIRE])", "Implant\u00e9e dans une Commune ([:SITUEE_DANS])", "Comprend des Officiers ([:COMPORTE_OFFICIER])"],
    availableTools: ["Matrice des r\u00f4les RBAC", "Journal d'audit non-r\u00e9pudiable"]
  },
  "affaire": {
    icon: "\ud83d\udcc1",
    name: "Affaire P\u00e9nale (Dossier d'Instruction)",
    domain: "territory",
    domainName: "1. Judiciaire & Territoire DZ",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16 + Neo4j",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#38bdf8",
    plainMeaning: "Dossier criminel unifi\u00e9 instruit sous l'autorit\u00e9 du parquet ou du juge d'instruction, regroupant l'int\u00e9gralit\u00e9 des indices, cibles, scell\u00e9s et PVs.",
    exampleValue: "Affaire N\u00b0 ATHAR-2026-SCAM-089 (Candy Wheels)",
    storageJustification: "PostgreSQL 16 garantit l'int\u00e9grit\u00e9 transactionnelle ACID, le verrouillage de statut l\u00e9gal et le scellement ; Neo4j contient le n\u0153ud racine de projection de sous-graphe.",
    schemaProps: [{"name": "id_affaire", "type": "String (PK)", "required": true, "desc": "Num\u00e9ro d'enregistrement parquet"}, {"name": "titre", "type": "String", "required": true, "desc": "Intitul\u00e9 des infractions poursuivies"}, {"name": "statut_legal", "type": "Enum [ENQUETE_PRELIM, INSTRUCTION, JUGE]", "required": true, "desc": "Phase proc\u00e9durale CPP"}, {"name": "prejudice_total_dzd", "type": "Float", "required": false, "desc": "Montant total extorqu\u00e9 en Dinars"}],
    connectedClues: ["Implique des Personnes ([:IMPLIQUE])", "Comprend des Scell\u00e9s WORM ([:COMPREND_SCELLE])", "Englobe des Proc\u00e8s-Verbaux ([:CONTIENT_ACTE])"],
    availableTools: ["Isolation de sous-graphe APOC", "G\u00e9n\u00e9ration de PV de Synth\u00e8se PDF/A-3b", "Recoupement inter-affaires"]
  },
  "magistrat": {
    icon: "\u2696\ufe0f",
    name: "Magistrat Instructeur / Procureur",
    domain: "territory",
    domainName: "1. Judiciaire & Territoire DZ",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL",
    dbBadge: "PostgreSQL 16 (IAM)",
    color: "#38bdf8",
    plainMeaning: "Autorit\u00e9 judiciaire ordonnant les r\u00e9quisitions, d\u00e9livrant les commissions rogatoires et supervisant la l\u00e9galit\u00e9 des actes de proc\u00e9dure.",
    exampleValue: "Mme la Juge d'Instruction (P\u00f4le P\u00e9nal Sp\u00e9cialis\u00e9 Alger)",
    storageJustification: "PostgreSQL (Casdoor IAM) g\u00e8re les certificats X.509 de signature \u00e9lectronique qualifi\u00e9e des ordonnances et r\u00e9quisitions.",
    schemaProps: [{"name": "id_magistrat", "type": "String (PK)", "required": true, "desc": "Matricule magistrature"}, {"name": "nom_complet", "type": "String", "required": true, "desc": "Identit\u00e9 du magistrat"}, {"name": "tribunal", "type": "String", "required": true, "desc": "Juridiction de rattachement"}],
    connectedClues: ["Supervise l'Affaire ([:SUPERVISE])", "Signe les R\u00e9quisitions ([:SIGNE_REQUISITION])"],
    availableTools: ["Tableau de bord ex\u00e9cutif magistrat", "Validation \u00e9lectronique de r\u00e9quisitions"]
  },
  "personne": {
    icon: "\ud83c\udfaf",
    name: "Personne Physique / Suspect / Complice / Mule",
    domain: "actors",
    domainName: "2. Personnes & Entit\u00e9s Morales",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+ Enterprise",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j 5.20+ / PostgreSQL",
    color: "#f43f5e",
    plainMeaning: "Individu cibl\u00e9 ou identifi\u00e9 au cours de l'enqu\u00eate (auteur principal, complice, mule financi\u00e8re, victime ou t\u00e9moin).",
    exampleValue: "Walid BOUAZIZ (Alias 'Walid Pneus', Leader pr\u00e9sum\u00e9)",
    storageJustification: "N\u0153ud central de Neo4j avec adjacence sans index pour la travers\u00e9e relationnelle en temps r\u00e9el ; PostgreSQL conserve la fiche civile confidentielle.",
    schemaProps: [{"name": "id_personne", "type": "String (PK UUID)", "required": true, "desc": "Identifiant unique interne"}, {"name": "nom_complet", "type": "String", "required": true, "desc": "Nom et pr\u00e9nom officiels"}, {"name": "nin", "type": "String (18 digits)", "required": false, "desc": "Num\u00e9ro d'Identification National alg\u00e9rien"}, {"name": "_class", "type": "Enum ['neutre', 'operationeel', 'soutien', 'leader']", "required": true, "desc": "R\u00f4le p\u00e9nal calcul\u00e9 par IA/GDS"}, {"name": "_betweennessCentrality", "type": "Float [0.0..1.0]", "required": true, "desc": "Score de centralit\u00e9 d'interm\u00e9diarit\u00e9 GDS"}, {"name": "_Lvl_of_Implications", "type": "List[Int] [1, 2, 3]", "required": true, "desc": "Degr\u00e9 d'implication multi-sauts"}],
    connectedClues: ["Utilise un T\u00e9l\u00e9phone ([:UTILISE_TELEPHONE])", "D\u00e9tient un Compte Bancaire ([:DETIENT_COMPTE])", "Poss\u00e8de un Profil Social ([:POSSEDE_PROFIL])", "Communique avec ([:COMMUNIQUE_AVEC])"],
    availableTools: ["GDS Brandes Betweenness", "Expansion r\u00e9seau 2-hops", "Classification p\u00e9nale automatique", "Profilage territorial"]
  },
  "entreprise": {
    icon: "\ud83c\udfe2",
    name: "Entreprise / Soci\u00e9t\u00e9 \u00c9cran / Commerce",
    domain: "actors",
    domainName: "2. Personnes & Entit\u00e9s Morales",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#f43f5e",
    plainMeaning: "Entit\u00e9 juridique commerciale utilis\u00e9e comme paravent pour le blanchiment d'argent, la facturation fictive ou l'enregistrement de sites frauduleux.",
    exampleValue: "SARL PNEUS EXPRESS ALGERIE (RC: 16/00-98124B)",
    storageJustification: "Graphe Neo4j pour lier les g\u00e9rants de paille et les actionnaires r\u00e9els ; PostgreSQL pour lier aux registres du CNRC.",
    schemaProps: [{"name": "numero_rc", "type": "String (PK)", "required": true, "desc": "Num\u00e9ro de Registre de Commerce"}, {"name": "nif", "type": "String", "required": false, "desc": "Num\u00e9ro d'Identification Fiscale"}, {"name": "raison_sociale", "type": "String", "required": true, "desc": "Nom de l'entreprise"}],
    connectedClues: ["G\u00e9r\u00e9e par une Personne ([:GEREE_PAR])", "Titulaire d'un Compte Bancaire ([:TITULAIRE_COMPTE])"],
    availableTools: ["D\u00e9tection de pr\u00eate-noms", "V\u00e9rification CNRC automatique"]
  },
  "vehicule": {
    icon: "\ud83d\ude97",
    name: "V\u00e9hicule / Immatriculation DZ",
    domain: "actors",
    domainName: "2. Personnes & Entit\u00e9s Morales",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#8b5cf6",
    plainMeaning: "V\u00e9hicule automobile rep\u00e9r\u00e9 lors de livraisons frauduleuses, de retraits GAB ou identifi\u00e9 par lecture automatis\u00e9e de plaques (LAPI/ALPR).",
    exampleValue: "Renault Clio 4 (Immatriculation: 04829-116-16)",
    storageJustification: "Neo4j relie le v\u00e9hicule aux personnes et aux lieux de bornage ; PostgreSQL stocke la fiche technique d'immatriculation.",
    schemaProps: [{"name": "immatriculation_dz", "type": "String (PK)", "required": true, "desc": "Matricule format officiel alg\u00e9rien"}, {"name": "vin_chassis", "type": "String", "required": false, "desc": "Num\u00e9ro de ch\u00e2ssis international"}, {"name": "marque_modele", "type": "String", "required": true, "desc": "Marque et mod\u00e8le du v\u00e9hicule"}],
    connectedClues: ["Conduit par un Suspect ([:CONDUIT_PAR])", "Photographi\u00e9 sur un Re\u00e7u/Sc\u00e8ne ([:VISIBLE_SUR_IMAGE])"],
    availableTools: ["Reconnaissance de plaque ALPR DZ", "Croisement fichiers cartes grises"]
  },
  "telephone": {
    icon: "\ud83d\udcf1",
    name: "Num\u00e9ro de T\u00e9l\u00e9phone (E.164 MSISDN)",
    domain: "telecom",
    domainName: "3. T\u00e9l\u00e9coms & Forensique Mobile",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+ Enterprise",
    dbTag: "Neo4j + Redis",
    dbBadge: "Neo4j / Redis 7.2",
    color: "#f97316",
    plainMeaning: "Ligne t\u00e9l\u00e9phonique mobile ou fixe utilis\u00e9e pour les appels d'extorsion, les comptes WhatsApp criminels et la r\u00e9ception d'OTP bancaires.",
    exampleValue: "+213 555 019 283 (Op\u00e9rateur: Ooredoo Alg\u00e9rie)",
    storageJustification: "Index m\u00e9moire Neo4j pour la r\u00e9solution instantan\u00e9e de liens de co-contact ; Redis stocke les caches de requ\u00eates d'annuaires invers\u00e9s (Truecaller).",
    schemaProps: [{"name": "numero_e164", "type": "String (PK canonical '+213...')", "required": true, "desc": "Format international strict E.164"}, {"name": "operateur", "type": "Enum [Mobilis, Djezzy, Ooredoo, Autre]", "required": true, "desc": "Op\u00e9rateur t\u00e9l\u00e9com"}, {"name": "type_ligne", "type": "Enum [Prepayee, Postpayee]", "required": false, "desc": "Mode de souscription"}],
    connectedClues: ["Ins\u00e9r\u00e9 dans une Carte SIM ([:INSEREE_DANS])", "Enregistr\u00e9 sur WhatsApp/Telegram ([:ENREGISTRE_SUR])", "Borne sur une Antenne ([:BORNE_A])", "Associ\u00e9 \u00e0 BaridiMob ([:NOTIFIE_BARIDIMOB])"],
    availableTools: ["PhoneInfoga / Truecaller Reverse", "WhatsApp Business Catalog Inspector", "Reconstitution CDRs"]
  },
  "carte_sim": {
    icon: "\ud83d\udcf6",
    name: "Carte SIM & Modem GSM 4G DZ",
    domain: "telecom",
    domainName: "3. T\u00e9l\u00e9coms & Forensique Mobile",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#f97316",
    plainMeaning: "Puce physique SIM ou eSIM ins\u00e9r\u00e9e dans la banque de modems USB ou dans le t\u00e9l\u00e9phone du suspect (identifi\u00e9e par ICCID et IMSI).",
    exampleValue: "SIM Mobilis (IMSI: 603019812401842 \u2022 ICCID: 89213...)",
    storageJustification: "PostgreSQL g\u00e8re l'inventaire mat\u00e9riel de la Phone Farm et les quotas de modems ; Neo4j relie la puce aux t\u00e9l\u00e9phones et suspects.",
    schemaProps: [{"name": "iccid", "type": "String (PK 19-20 digits)", "required": true, "desc": "Num\u00e9ro de s\u00e9rie de la carte SIM"}, {"name": "imsi", "type": "String (15 digits)", "required": true, "desc": "Identit\u00e9 internationale de l'abonn\u00e9 mobile"}, {"name": "port_tty", "type": "String", "required": false, "desc": "Port physique /dev/ttyUSB dans la baie"}],
    connectedClues: ["Fournit la ligne T\u00e9l\u00e9phone ([:ACTIVE_LIGNE])", "Install\u00e9e dans un Smartphone ([:LOGEE_DANS])"],
    availableTools: ["Daemon AT pyserial (Interception OTP <1.5s)", "Rotation dynamique APN 4G"]
  },
  "appareil_mobile": {
    icon: "\ud83d\udcf2",
    name: "Smartphone / Terminal ReDroid (IMEI)",
    domain: "telecom",
    domainName: "3. T\u00e9l\u00e9coms & Forensique Mobile",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#f97316",
    plainMeaning: "Terminal physique ou conteneur ReDroid virtuel identifi\u00e9 par son code IMEI unique, utilis\u00e9 par le cybercriminel.",
    exampleValue: "Samsung Galaxy S23 (IMEI: 358912401928471)",
    storageJustification: "Neo4j relie les changements de cartes SIM sur un m\u00eame terminal pour d\u00e9masquer les suspects multi-puces ; PostgreSQL enregistre les scell\u00e9s mat\u00e9riels.",
    schemaProps: [{"name": "imei", "type": "String (PK 15 digits)", "required": true, "desc": "International Mobile Equipment Identity"}, {"name": "modele", "type": "String", "required": true, "desc": "Mod\u00e8le commercial (ex: SM-S911B)"}, {"name": "fingerprint", "type": "String", "required": false, "desc": "Empreinte logicielle Android"}],
    connectedClues: ["Contient une Carte SIM ([:LOGE_SIM])", "Utilis\u00e9 par un Suspect ([:MANIPULE_PAR])"],
    availableTools: ["Scrcpy WebRTC 60 FPS", "Conteneur ReDroid AOSP 13", "Analyse forensique ALEAPP"]
  },
  "antenne_bts": {
    icon: "\ud83d\udce1",
    name: "Antenne Relais BTS (Cell Tower)",
    domain: "telecom",
    domainName: "3. T\u00e9l\u00e9coms & Forensique Mobile",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16 + PostGIS",
    dbTag: "PostgreSQL + PostGIS",
    dbBadge: "PostgreSQL 16 (PostGIS)",
    color: "#f97316",
    plainMeaning: "Pyl\u00f4ne de t\u00e9l\u00e9communication cellulaire des op\u00e9rateurs Mobilis, Djezzy ou Ooredoo captant les communications des suspects.",
    exampleValue: "BTS Ooredoo Bab Ezzouar Ouest (CellID: 41029 \u2022 LAC: 1042)",
    storageJustification: "Indexation spatiale R-Tree PostGIS pour le calcul instantan\u00e9 des zones de couverture (secteurs polygonaux \u00e0 120\u00b0) et requ\u00eates g\u00e9ographiques.",
    schemaProps: [{"name": "cell_id", "type": "String (PK)", "required": true, "desc": "Identifiant de cellule op\u00e9rateur"}, {"name": "lac", "type": "Int", "required": true, "desc": "Location Area Code"}, {"name": "coordonnees", "type": "Point (WGS84)", "required": true, "desc": "Latitude et Longitude du pyl\u00f4ne"}, {"name": "azimut", "type": "Int [0..360]", "required": true, "desc": "Orientation angulaire du faisceau"}],
    connectedClues: ["Localis\u00e9e dans une Commune ([:IMPLANTEE_DANS])", "Enregistre un CDR ([:RECOIT_COMMUNICATION])"],
    availableTools: ["Calculateur de zone de couverture azimutale", "Recoupement d'alibis spatio-temporels"]
  },
  "telecom_cdr": {
    icon: "\ud83d\udcca",
    name: "Listing d'Appel T\u00e9l\u00e9com (CDR Record)",
    domain: "telecom",
    domainName: "3. T\u00e9l\u00e9coms & Forensique Mobile",
    primaryDb: "postgres",
    primaryDbName: "TimescaleDB / PostgreSQL",
    dbTag: "TimescaleDB",
    dbBadge: "TimescaleDB (Hyper-tables)",
    color: "#f97316",
    plainMeaning: "Enregistrement d'appel r\u00e9quisitionn\u00e9 aupr\u00e8s des op\u00e9rateurs t\u00e9l\u00e9coms (qui a appel\u00e9 qui, quelle antenne BTS, quelle heure, quelle dur\u00e9e).",
    exampleValue: "Appel sortant vers +213555... (Dur\u00e9e: 142s, BTS 41029, 02/11 14:15)",
    storageJustification: "TimescaleDB partitionne automatiquement des milliards de lignes par tranche de 24h, garantissant des requ\u00eates chronologiques en <15ms.",
    schemaProps: [{"name": "cdr_id", "type": "BigInt (PK)", "required": true, "desc": "Identifiant s\u00e9quentiel de communication"}, {"name": "timestamp_call", "type": "DateTime (Time-Series PK)", "required": true, "desc": "Horodatage milliseconde"}, {"name": "caller", "type": "String", "required": true, "desc": "Num\u00e9ro appelant"}, {"name": "callee", "type": "String", "required": true, "desc": "Num\u00e9ro appel\u00e9"}, {"name": "duree_sec", "type": "Int", "required": true, "desc": "Dur\u00e9e de la communication en secondes"}],
    connectedClues: ["\u00c9mis depuis un T\u00e9l\u00e9phone ([:EMIS_PAR])", "Re\u00e7u par un T\u00e9l\u00e9phone ([:DESTINE_A])", "Relay\u00e9 par Antenne BTS ([:RELAYE_PAR])"],
    availableTools: ["Barre temporelle BarScroll.js", "D\u00e9tection de co-d\u00e9placement de t\u00e9l\u00e9phones", "Invalidation d'alibis"]
  },
  "compte_bancaire": {
    icon: "\ud83d\udcb3",
    name: "Compte Bancaire / BaridiMob (RIP 20d)",
    domain: "finance",
    domainName: "4. Finances Criminelles & BaridiMob",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+ Enterprise",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#eab308",
    plainMeaning: "Compte courant postal (CCP) ou compte bancaire alg\u00e9rien (Relev\u00e9 d'Identit\u00e9 Postale \u00e0 20 chiffres) servant \u00e0 recevoir les fonds extorqu\u00e9s.",
    exampleValue: "RIP Alg\u00e9rie Poste: 00799999002481920142",
    storageJustification: "Graphe Neo4j pour tracer les cascades de blanchiment (comptes mules interm\u00e9diaires) ; PostgreSQL pour l'int\u00e9grit\u00e9 financi\u00e8re et le rapprochement r\u00e9quisitions.",
    schemaProps: [{"name": "rip_algerie_poste", "type": "String (PK 20 digits)", "required": true, "desc": "Relev\u00e9 d'Identit\u00e9 Postale canonique"}, {"name": "ccp_numero", "type": "String", "required": true, "desc": "Num\u00e9ro de compte CCP"}, {"name": "cle_rip", "type": "String (2 digits)", "required": true, "desc": "Cl\u00e9 de contr\u00f4le calcul\u00e9e selon l'algorithme officiel"}, {"name": "titulaire_declare", "type": "String", "required": true, "desc": "Nom du titulaire ou de la mule"}],
    connectedClues: ["D\u00e9tenu par une Personne ([:DETENU_PAR])", "Re\u00e7oit un Virement ([:RECOIT_VIREMENT])", "Objet de Retrait GAB ([:RETRAIT_EFFECTUE])"],
    availableTools: ["V\u00e9rificateur de RIP Alg\u00e9rie Poste (Luhn DZ)", "Algorithme Dijkstra du plus court chemin de blanchiment", "D\u00e9tection de mules GDS"]
  },
  "transaction_financiere": {
    icon: "\ud83d\udcb8",
    name: "Virement Bancaire / BaridiMob DZD",
    domain: "finance",
    domainName: "4. Finances Criminelles & BaridiMob",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16 (Table ACID)",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#eab308",
    plainMeaning: "Transfert de fonds op\u00e9r\u00e9 via l'application BaridiMob, virement de compte \u00e0 compte ou versement en esp\u00e8ces au guichet de poste.",
    exampleValue: "Virement BaridiMob de 100 000 DZD (R\u00e9f: TX-98412-DZ)",
    storageJustification: "Table ACID PostgreSQL pour la balance financi\u00e8re exacte et la conformit\u00e9 bancaire ; ar\u00eate pond\u00e9r\u00e9e Neo4j ([:EFFECTUE_VIREMENT {montant}]) pour le flux.",
    schemaProps: [{"name": "tx_id", "type": "String (PK)", "required": true, "desc": "R\u00e9f\u00e9rence unique de transaction bancaire"}, {"name": "montant_dzd", "type": "Float", "required": true, "desc": "Montant du virement en Dinars Alg\u00e9riens"}, {"name": "timestamp_tx", "type": "DateTime", "required": true, "desc": "Date et heure exacte du virement"}, {"name": "canal", "type": "Enum [BaridiMob, Guichet, GAB]", "required": true, "desc": "Canal d'ex\u00e9cution"}],
    connectedClues: ["Depuis Compte Source ([:DEPUIS_COMPTE])", "Vers Compte Destination ([:VERS_COMPTE])", "Justifi\u00e9 par un Re\u00e7u ([:ATTESTE_PAR_IMAGE])"],
    availableTools: ["Calculateur de pr\u00e9judice global affaire", "D\u00e9tection de sch\u00e9mas de dispersion (Smurfing/Schtroumpfage)"]
  },
  "guichet_gab": {
    icon: "\ud83c\udfe7",
    name: "Guichet GAB / Distributeur ATM",
    domain: "finance",
    domainName: "4. Finances Criminelles & BaridiMob",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16 + PostGIS",
    dbTag: "PostgreSQL + PostGIS",
    dbBadge: "PostgreSQL 16 (PostGIS)",
    color: "#eab308",
    plainMeaning: "Distributeur automatique de billets d'Alg\u00e9rie Poste ou d'une banque o\u00f9 les fonds extorqu\u00e9s ont \u00e9t\u00e9 retir\u00e9s physiquement en esp\u00e8ces.",
    exampleValue: "GAB Alg\u00e9rie Poste - Bureau Central Bab Ezzouar",
    storageJustification: "PostGIS pour la g\u00e9olocalisation exacte et le croisement avec les cam\u00e9ras de surveillance de voirie et les bornages t\u00e9l\u00e9coms.",
    schemaProps: [{"name": "id_gab", "type": "String (PK)", "required": true, "desc": "Identifiant du distributeur"}, {"name": "bureau_poste", "type": "String", "required": true, "desc": "Nom de l'agence postale"}, {"name": "geopoint", "type": "Point (WGS84)", "required": true, "desc": "Coordonn\u00e9es GPS"}],
    connectedClues: ["Lieu de Retrait d'un Compte ([:RETRAIT_AU_GAB])", "Implant\u00e9 dans Commune ([:SITUE_DANS_COMMUNE])"],
    availableTools: ["R\u00e9quisition bandes vid\u00e9osurveillance", "Croisement spatio-temporel GAB / T\u00e9l\u00e9phone"]
  },
  "crypto_wallet": {
    icon: "\ud83e\ude99",
    name: "Portefeuille Crypto (USDT / BTC / ETH)",
    domain: "finance",
    domainName: "4. Finances Criminelles & BaridiMob",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#eab308",
    plainMeaning: "Adresse de portefeuille blockchain (notamment Tron TRC-20 pour les transferts USDT) servant \u00e0 expatrier les fonds vol\u00e9s hors d'Alg\u00e9rie.",
    exampleValue: "Tron TRC-20: TLa2f9k...98qZ (Solde: 4 200 USDT)",
    storageJustification: "Neo4j mod\u00e9lise le graphe bipartite des transferts entre adresses et exchanges (Binance Pay) ; PostgreSQL stocke l'historique de scraping TronScan.",
    schemaProps: [{"name": "adresse_publique", "type": "String (PK)", "required": true, "desc": "Adresse de portefeuille blockchain"}, {"name": "blockchain", "type": "Enum [TRON_TRC20, ETHEREUM, BITCOIN]", "required": true, "desc": "R\u00e9seau blockchain"}, {"name": "plateforme_identifiee", "type": "String", "required": false, "desc": "Exchange centralis\u00e9 identifi\u00e9 (ex: Binance)"}],
    connectedClues: ["Aliment\u00e9 depuis Compte BaridiMob ([:CONVERTIT_FONDS])", "Transf\u00e8re vers Wallet ([:TRANSFERT_CRYPTO])"],
    availableTools: ["TronScan TRC-20 Tracker", "Breadcrumbs / GraphSense Crypto Tracer"]
  },
  "transaction_crypto": {
    icon: "\u26d3\ufe0f",
    name: "Transaction Blockchain (TX Hash)",
    domain: "finance",
    domainName: "4. Finances Criminelles & BaridiMob",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#eab308",
    plainMeaning: "Transfert de cybermonnaie immuable enregistr\u00e9 sur un registre distribu\u00e9 public.",
    exampleValue: "TX Hash: 0x8f192b4...38a (Montant: 2 500 USDT)",
    storageJustification: "Table relationnelle pour la v\u00e9rification des montants et ar\u00eate Neo4j pour la navigation visuelle dans le mixeur crypto.",
    schemaProps: [{"name": "tx_hash", "type": "String (PK)", "required": true, "desc": "Hachage de la transaction blockchain"}, {"name": "montant_crypto", "type": "Float", "required": true, "desc": "Quantit\u00e9 de jetons transf\u00e9r\u00e9s"}, {"name": "timestamp_block", "type": "DateTime", "required": true, "desc": "Horodatage d'inclusion dans le bloc"}],
    connectedClues: ["Depuis Wallet ([:DEPUIS_WALLET])", "Vers Wallet ([:VERS_WALLET])"],
    availableTools: ["Tracer de flux de blanchiment crypto", "D\u00e9tection d'adresses sous sanctions OFAC"]
  },
  "compte_social": {
    icon: "\ud83d\udc64",
    name: "Compte de R\u00e9seau Social / Messagerie",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + MongoDB",
    dbBadge: "Neo4j / MongoDB 7.0",
    color: "#06b6d4",
    plainMeaning: "Profil en ligne sur Facebook, Instagram, Telegram, TikTok ou WhatsApp utilis\u00e9 pour diffuser les arnaques ou app\u00e2ter les victimes.",
    exampleValue: "Facebook: fb.com/promo.pneus.dz | Telegram: @walid_boss",
    storageJustification: "Neo4j mod\u00e9lise le profil comme sommet du graphe relationnel ; MongoDB 7.0 stocke le dump BSON brut de l'ensemble de la bio et des abonn\u00e9s.",
    schemaProps: [{"name": "id_profil", "type": "String (PK)", "required": true, "desc": "Identifiant num\u00e9rique permanent ou handle"}, {"name": "plateforme", "type": "Enum [Facebook, Telegram, TikTok, Instagram, WhatsApp, Ouedkniss]", "required": true, "desc": "R\u00e9seau social"}, {"name": "pseudo_handle", "type": "String", "required": true, "desc": "Nom d'utilisateur affich\u00e9 (@...)"}, {"name": "url_profil", "type": "String", "required": true, "desc": "Lien direct vers le profil"}],
    connectedClues: ["Appartient \u00e0 une Personne ([:POSSEDE_PROFIL])", "Publie une Annonce ([:PUBLIE_POST])", "Membre d'un Canal ([:MEMBRE_DE])"],
    availableTools: ["Meta Transparency Tracker", "Telegram MTProto Entity Resolver", "Outil Maigret (2 500+ sites)"]
  },
  "publication_sociale": {
    icon: "\ud83d\udce2",
    name: "Publication / Annonce Frauduleuse",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + MinIO + MongoDB",
    dbBadge: "Neo4j / MinIO / MongoDB",
    color: "#06b6d4",
    plainMeaning: "Message public, annonce sponsoris\u00e9e Facebook Ads ou vid\u00e9o TikTok constituant le support mat\u00e9riel de l'escroquerie.",
    exampleValue: "Facebook Ad #981240 ('4 Pneus Michelin 15 pouces \u00e0 12 000 DA')",
    storageJustification: "Neo4j relie la publication aux t\u00e9l\u00e9phones et liens cit\u00e9s ; MinIO stocke la capture d'\u00e9cran scell\u00e9e WORM ; MongoDB stocke le texte et les m\u00e9tadonn\u00e9es de diffusion.",
    schemaProps: [{"name": "id_post", "type": "String (PK)", "required": true, "desc": "Identifiant unique du post"}, {"name": "texte_integral", "type": "String", "required": true, "desc": "Texte exact de l'annonce"}, {"name": "date_publication", "type": "DateTime", "required": true, "desc": "Date et heure de parution"}, {"name": "prix_annonce_dzd", "type": "Float", "required": false, "desc": "Tarif frauduleux all\u00e9gu\u00e9"}],
    connectedClues: ["Publi\u00e9e par un Compte ([:PUBLIEE_PAR])", "Redirige vers Site Web ([:DIFFUSE_LIEN])", "Affiche un T\u00e9l\u00e9phone ([:AFFICHE_TELEPHONE])"],
    availableTools: ["Extracteur d'IOCs P0", "Meta Ad Library Investigator", "Scellement WORM de page web"]
  },
  "canal_telegram": {
    icon: "\ud83d\udce3",
    name: "Canal / Groupe Telegram & WhatsApp",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + MongoDB",
    dbBadge: "Neo4j / MongoDB 7.0",
    color: "#06b6d4",
    plainMeaning: "Espace de discussion collectif priv\u00e9 ou public o\u00f9 les escrocs coordonnent leurs actions ou diffusent des catalogues de marchandises fictives.",
    exampleValue: "Canal Telegram 'Pneus Promo Alg\u00e9rie' (4 800 abonn\u00e9s)",
    storageJustification: "Neo4j identifie les membres et administrateurs communs \u00e0 plusieurs canaux criminels ; MongoDB stocke les dumps d'historique de chat bruts.",
    schemaProps: [{"name": "id_canal", "type": "String (PK)", "required": true, "desc": "ID num\u00e9rique Telegram / WhatsApp"}, {"name": "titre_canal", "type": "String", "required": true, "desc": "Nom du groupe"}, {"name": "nb_membres", "type": "Int", "required": false, "desc": "Nombre d'abonn\u00e9s au moment de la saisie"}],
    connectedClues: ["Administr\u00e9 par Compte Social ([:ADMINISTRE_PAR])", "Contient des Messages ([:CONTIENT_MESSAGE])"],
    availableTools: ["Telegram MTProto Scraper", "D\u00e9tection de r\u00e9seaux de propagande criminelle"]
  },
  "message_chat": {
    icon: "\ud83d\udcac",
    name: "Message de Chat Instantan\u00e9",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "mongodb",
    primaryDbName: "MongoDB 7.0 WiredTiger",
    dbTag: "MongoDB + MinIO",
    dbBadge: "MongoDB 7.0 (BSON Snappy)",
    color: "#06b6d4",
    plainMeaning: "Message texte ou vocal unitaire \u00e9chang\u00e9 sur WhatsApp ou Telegram contenant des aveux, des ordres ou des coordonn\u00e9es bancaires.",
    exampleValue: "Message #84102: 'Envoyez l'acompte par BaridiMob sur ce num\u00e9ro...'",
    storageJustification: "MongoDB g\u00e8re la structure sans sch\u00e9ma et les volumes massifs de messages extraits des t\u00e9l\u00e9phones saisis avec compression Snappy.",
    schemaProps: [{"name": "message_id", "type": "String (PK)", "required": true, "desc": "Identifiant dans le fil de discussion"}, {"name": "texte_brut", "type": "String", "required": true, "desc": "Contenu textuel du message"}, {"name": "horodatage_iso", "type": "DateTime", "required": true, "desc": "Horodatage d'envoi"}],
    connectedClues: ["\u00c9mis dans un Canal ([:DANS_CANAL])", "Embarque un Audio Vocal ([:CONTIENT_AUDIO])", "Attache une Photo ([:CONTIENT_PHOTO])"],
    availableTools: ["Analyseur de discussions criminelles", "Extracteur automatique d'adresses et RIPs"]
  },
  "adresse_email": {
    icon: "\ud83d\udce7",
    name: "Adresse E-mail",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#06b6d4",
    plainMeaning: "Adresse de messagerie \u00e9lectronique utilis\u00e9e pour administrer des sites web, souscrire des h\u00e9bergements ou enregistrer des comptes sociaux.",
    exampleValue: "walid.bouaziz.dz@gmail.com",
    storageJustification: "Neo4j pivote l'adresse pour r\u00e9v\u00e9ler tous les comptes et sites enregistr\u00e9s ; PostgreSQL stocke les correspondances avec les bases de fuites de donn\u00e9es.",
    schemaProps: [{"name": "email_canonique", "type": "String (PK minuscule)", "required": true, "desc": "Adresse e-mail normalis\u00e9e"}, {"name": "domaine_mx", "type": "String", "required": true, "desc": "Fournisseur de messagerie (ex: gmail.com)"}],
    connectedClues: ["Utilis\u00e9e par une Personne ([:UTILISE_EMAIL])", "Contact d'un Site Web ([:CONTACT_DE_DOMAINE])"],
    availableTools: ["Outil GHunt (Analyseur Google Account)", "Interrogateur DeHashed & HaveIBeenPwned"]
  },
  "site_web": {
    icon: "\ud83c\udf10",
    name: "Site Web & Boutique Scam (FQDN)",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + MinIO + MongoDB",
    dbBadge: "Neo4j / MinIO / MongoDB",
    color: "#06b6d4",
    plainMeaning: "Site de commerce \u00e9lectronique fictif, fausse plateforme de paiement ou portail d'hame\u00e7onnage ciblant les usagers alg\u00e9riens.",
    exampleValue: "https://promo-pneus-express.shop",
    storageJustification: "Neo4j mod\u00e9lise le graphe d'infrastructure ; MinIO stocke l'archive WARC compl\u00e8te et certifi\u00e9e ISO 28500 ; MongoDB stocke les en-t\u00eates HTTP bruts.",
    schemaProps: [{"name": "fqdn_domaine", "type": "String (PK)", "required": true, "desc": "Nom de domaine complet"}, {"name": "ip_hebergeur", "type": "String", "required": true, "desc": "Adresse IP r\u00e9solue"}, {"name": "date_depot_whois", "type": "Date", "required": false, "desc": "Date d'enregistrement du domaine"}],
    connectedClues: ["Embarque un Tracker ([:EMBARQUE_TRACKER])", "R\u00e9solu vers Serveur C2 ([:RESOLU_VERS_IP])", "Distribue un Malware APK ([:DISTRIBUE_APK])"],
    availableTools: ["ArchiveBox WARC ISO 28500 Snapshotter", "PublicWWW Source Code Hunter", "JARM TLS Fingerprinter"]
  },
  "identifiant_infrastructure": {
    icon: "\ud83c\udff7\ufe0f",
    name: "Identifiant d'Infrastructure & Tracker (Meta Pixel)",
    domain: "socmint",
    domainName: "5. SOCMINT, Web & Trackers",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + MongoDB",
    dbBadge: "Neo4j 5.20+ (Pivot Graphe)",
    color: "#06b6d4",
    plainMeaning: "Balise technique cach\u00e9e dans le code source d'un site web (Meta Pixel ID, Google Analytics ID, JARM TLS) partag\u00e9e par plusieurs sites d'un m\u00eame escroc.",
    exampleValue: "Meta Pixel ID: 88419203314 (Partag\u00e9 sur 3 sites)",
    storageJustification: "Sommet pivot Neo4j indispensable : une simple requ\u00eate Cypher \u00e0 2 sauts regroupe instantan\u00e9ment toutes les boutiques cr\u00e9\u00e9es par le m\u00eame r\u00e9seau criminel.",
    schemaProps: [{"name": "valeur_id", "type": "String (PK)", "required": true, "desc": "Valeur alphanum\u00e9rique du pixel ou tracker"}, {"name": "type_tracker", "type": "Enum [Meta_Pixel, Google_Analytics, Adsense, JARM, GTM]", "required": true, "desc": "Nature de la balise"}],
    connectedClues: ["Embarqu\u00e9 dans plusieurs Sites Web ([:EMBARQUE_DANS])"],
    availableTools: ["Pivot d'infrastructure multi-sites", "D\u00e9tecteur de sites jumeaux (Twin Sites Hunter)"]
  },
  "fichier_apk": {
    icon: "\ud83d\udce6",
    name: "Application Malveillante / Trojan BaridiMob (APK)",
    domain: "cyber",
    domainName: "6. Cyber, Malwares & Forensique",
    primaryDb: "minio",
    primaryDbName: "MinIO S3 WORM",
    dbTag: "MinIO + MongoDB + Neo4j",
    dbBadge: "MinIO WORM / MongoDB / Neo4j",
    color: "#22c55e",
    plainMeaning: "Fichier d'installation Android (.apk) v\u00e9rol\u00e9 usurpant l'identit\u00e9 d'Alg\u00e9rie Poste ou d'un service public pour voler les codes secrets et SMS OTP.",
    exampleValue: "AutoPneusDZ.apk (SHA-256: 4a12e88...)",
    storageJustification: "MinIO conserve le binaire exact sous scell\u00e9 WORM ; MongoDB conserve l'arbre syntaxique (AST) d\u00e9compil\u00e9 par Jadx/Ghidra ; Neo4j relie l'APK aux victimes et au C2.",
    schemaProps: [{"name": "sha256_hash", "type": "String (PK 64 hex)", "required": true, "desc": "Empreinte cryptographique du binaire"}, {"name": "package_name", "type": "String", "required": true, "desc": "Nom du package Android (ex: com.autopneus.dz)"}, {"name": "certificat_signature", "type": "String", "required": true, "desc": "Empreinte du certificat de signature d\u00e9veloppeur"}],
    connectedClues: ["T\u00e9l\u00e9charg\u00e9 depuis Site Web ([:TELECHARGE_DEPUIS])", "Communique avec Serveur C2 ([:COMMUNIQUE_AVEC_C2])", "Cible l'Appli BaridiMob ([:CIBLE_APPLICATION])"],
    availableTools: ["D\u00e9compilateur Jadx-GUI & Ghidra", "Analyseur de certificats APK", "YARA-X & Capa Malware Scanner"]
  },
  "serveur_c2": {
    icon: "\ud83d\udda5\ufe0f",
    name: "Serveur C2 & Adresse IP (Command & Control)",
    domain: "cyber",
    domainName: "6. Cyber, Malwares & Forensique",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + PostgreSQL",
    dbBadge: "Neo4j / PostgreSQL 16",
    color: "#22c55e",
    plainMeaning: "Machine distante contr\u00f4l\u00e9e par les cybercriminels recevant les identifiants vol\u00e9s, les SMS intercept\u00e9s et orchestrant les attaques.",
    exampleValue: "IP: 185.220.101.42 (Port 8443, H\u00e9bergeur: Hetzner)",
    storageJustification: "Neo4j relie le C2 aux multiples APKs et sites compromis ; PostgreSQL stocke les rapports d'analyse de trafic Wireshark/TShark.",
    schemaProps: [{"name": "ip_address", "type": "String (PK IPv4/IPv6)", "required": true, "desc": "Adresse IP publique"}, {"name": "port_c2", "type": "Int", "required": false, "desc": "Port d'\u00e9coute du serveur de commande"}, {"name": "asn_pays", "type": "String", "required": true, "desc": "Syst\u00e8me autonome et pays d'h\u00e9bergement"}],
    connectedClues: ["Re\u00e7oit les Donn\u00e9es d'un Malware APK ([:PILOTE_MALWARE])", "H\u00e9berge un Site Web ([:HEBERGE_SITE])"],
    availableTools: ["Dissecteur de trafic Wireshark / TShark", "Shodan / Censys Infrastructure Scanner"]
  },
  "certificat_tls": {
    icon: "\ud83d\udd12",
    name: "Certificat SSL/TLS & JARM Fingerprint",
    domain: "cyber",
    domainName: "6. Cyber, Malwares & Forensique",
    primaryDb: "neo4j",
    primaryDbName: "Neo4j 5.20+",
    dbTag: "Neo4j + MongoDB",
    dbBadge: "Neo4j / MongoDB 7.0",
    color: "#22c55e",
    plainMeaning: "Certificat cryptographique s\u00e9curisant un site frauduleux, dont l'empreinte JARM r\u00e9v\u00e8le la configuration exacte du serveur sous-jacent.",
    exampleValue: "JARM: 27d27d27d00027d00042d42d42d42d... (Let's Encrypt)",
    storageJustification: "Neo4j relie les serveurs partageant la m\u00eame signature JARM active ; MongoDB stocke le certificat X.509 complet.",
    schemaProps: [{"name": "sha256_cert", "type": "String (PK)", "required": true, "desc": "Empreinte SHA-256 du certificat"}, {"name": "jarm_hash", "type": "String (62 hex)", "required": true, "desc": "Empreinte TLS JARM active"}],
    connectedClues: ["S\u00e9curise un Site Web ([:SECURISE_DOMAINE])"],
    availableTools: ["JARM TLS Prober", "Certificate Transparency Logs Search (crt.sh)"]
  },
  "artefact_dfir": {
    icon: "\ud83d\udd2c",
    name: "Artefact Forensique DFIR (Image Disque / Dump RAM)",
    domain: "cyber",
    domainName: "6. Cyber, Malwares & Forensique",
    primaryDb: "minio",
    primaryDbName: "MinIO S3 WORM",
    dbTag: "MinIO + PostgreSQL",
    dbBadge: "MinIO WORM / PostgreSQL 16",
    color: "#22c55e",
    plainMeaning: "Image disque brute (E01/RAW), dump de m\u00e9moire vive RAM (Volatility) ou base SQLite chiffr\u00e9e extraite d'un smartphone saisi.",
    exampleValue: "Dump RAM Volatility (sha256: 9f81a... \u2022 Taille: 16 Go)",
    storageJustification: "MinIO WORM stocke les volumineuses images m\u00e9dico-l\u00e9gales brutes sous Object Lock ; PostgreSQL indexe les m\u00e9tadonn\u00e9es de saisie.",
    schemaProps: [{"name": "sha256_artefact", "type": "String (PK)", "required": true, "desc": "Hash cryptographique de l'image"}, {"name": "format_image", "type": "Enum [E01, RAW, MEM_DUMP, SQLITE_DB]", "required": true, "desc": "Format de fichier m\u00e9dico-l\u00e9gal"}, {"name": "taille_octets", "type": "BigInt", "required": true, "desc": "Taille exacte du fichier"}],
    connectedClues: ["Extrait d'un Appareil Mobile ([:EXTRAIT_DE_TERMINAL])", "Scell\u00e9 dans la Proc\u00e9dure ([:SOUS_SCELLE])"],
    availableTools: ["Autopsy / SleuthKit", "Volatility 3 RAM Analyzer", "ALEAPP / iLEAPP Artifact Extractors"]
  },
  "enregistrement_vocal": {
    icon: "\ud83c\udf99\ufe0f",
    name: "Enregistrement Vocal / Note Vocale WhatsApp (Darija)",
    domain: "biometrics",
    domainName: "7. Biom\u00e9trie Multimodale & M\u00e9dias",
    primaryDb: "minio",
    primaryDbName: "MinIO S3 WORM",
    dbTag: "MinIO + Qdrant + Neo4j",
    dbBadge: "MinIO / Qdrant 1.9 / Neo4j",
    color: "#a855f7",
    plainMeaning: "Message vocal WhatsApp en dialecte alg\u00e9rien intercept\u00e9 ou remis par la victime, contenant les instructions d'arnaque et la voix du suspect.",
    exampleValue: "Audio WhatsApp (34s, ar-DZ, 'Ba3atli 10 mlayen f BaridiMob')",
    storageJustification: "MinIO stocke l'OPUS original immuable ; Qdrant stocke l'empreinte x-vector 192-d (PyAnnote 3.1) ; Neo4j stocke la transcription textuelle et les entit\u00e9s NER.",
    schemaProps: [{"name": "sha256_audio", "type": "String (PK)", "required": true, "desc": "Hash SHA-256 du fichier audio"}, {"name": "duree_sec", "type": "Float", "required": true, "desc": "Dur\u00e9e exacte de l'enregistrement"}, {"name": "transcription_darija", "type": "String", "required": true, "desc": "Texte transcrit par Faster-Whisper ar-DZ"}, {"name": "qdrant_vector_id", "type": "String (UUID)", "required": true, "desc": "Pointeur vers l'index vectoriel Qdrant"}],
    connectedClues: ["Attribu\u00e9 \u00e0 un Suspect par Voix ([:ATTRIBUE_A])", "Inclus dans un Message Chat ([:ATTACHE_A_MESSAGE])", "Scell\u00e9 sous WORM ([:PROTEGE_PAR_SCELLE])"],
    availableTools: ["Faster-Whisper Large-v3 (Fine-tun\u00e9 Darija DZ)", "PyAnnote Audio 3.1 (Diarisation & Speaker Recognition)", "D\u00e9tecteur Deepfake Vocal ResNet"]
  },
  "empreinte_faciale": {
    icon: "\ud83d\udc64",
    name: "Empreinte Faciale Biom\u00e9trique ArcFace 512-d",
    domain: "biometrics",
    domainName: "7. Biom\u00e9trie Multimodale & M\u00e9dias",
    primaryDb: "qdrant",
    primaryDbName: "Qdrant 1.9 Vector DB (Rust)",
    dbTag: "Qdrant + MinIO + Neo4j",
    dbBadge: "Qdrant 1.9 / MinIO / Neo4j",
    color: "#a855f7",
    plainMeaning: "Vecteur math\u00e9matique compact \u00e0 512 dimensions extrait par r\u00e9seau de neurones convolutif profond (ArcFace) repr\u00e9sentant la biom\u00e9trie d'un visage.",
    exampleValue: "Vecteur ArcFace 512-d (Similarit\u00e9 cosinus: 0.89 avec suspect)",
    storageJustification: "Qdrant indexe les vecteurs en m\u00e9moire vive via le graphe HNSW pour des recherches 1-to-N en <8ms avec filtrage par dossier p\u00e9nal.",
    schemaProps: [{"name": "vector_id", "type": "String (PK UUID)", "required": true, "desc": "Identifiant dans la collection Qdrant"}, {"name": "vecteur_512d", "type": "List[Float] (512 dims)", "required": true, "desc": "Embedding facial normalis\u00e9"}, {"name": "seuil_confiance", "type": "Float [0..1]", "required": true, "desc": "Confiance de d\u00e9tection RetinaFace"}],
    connectedClues: ["Extrait d'une Image Preuve ([:EXTRAIT_DE_PHOTO])", "Correspond \u00e0 une Personne ([:IDENTIFIE_SUSPECT])"],
    availableTools: ["ArcFace DeepFace 512-d Matcher", "Recherche k-NN Qdrant sub-8ms", "V\u00e9rificateur d'usurpation de photo de profil"]
  },
  "image_preuve": {
    icon: "\ud83d\uddbc\ufe0f",
    name: "Image Preuve / Capture d'\u00c9cran / Re\u00e7u BaridiMob",
    domain: "biometrics",
    domainName: "7. Biom\u00e9trie Multimodale & M\u00e9dias",
    primaryDb: "minio",
    primaryDbName: "MinIO S3 WORM",
    dbTag: "MinIO + Neo4j",
    dbBadge: "MinIO WORM / Neo4j",
    color: "#a855f7",
    plainMeaning: "Photographie d'une pi\u00e8ce d'identit\u00e9 saisie, capture d'\u00e9cran d'un re\u00e7u de virement BaridiMob ou clich\u00e9 de faux stocks de marchandises.",
    exampleValue: "Capture Re\u00e7u BaridiMob (SHA-256: 8f921... \u2022 1080x1920)",
    storageJustification: "MinIO WORM prot\u00e8ge le fichier contre la falsification ; Neo4j conserve les m\u00e9tadonn\u00e9es techniques EXIF (appareil, GPS, date).",
    schemaProps: [{"name": "sha256_image", "type": "String (PK)", "required": true, "desc": "Hash cryptographique de l'image"}, {"name": "phash_perceptuel", "type": "String (64 bits)", "required": true, "desc": "Hachage perceptuel anti-duplication"}, {"name": "exif_gps", "type": "Point (WGS84)", "required": false, "desc": "Coordonn\u00e9es GPS extraites par ExifTool"}],
    connectedClues: ["Donne lieu \u00e0 Extraction Faciale ([:CONTIENT_VISAGE])", "Montre un V\u00e9hicule ([:MONTRE_VEHICULE])", "Justifie un Virement ([:PROUVE_VIREMENT])"],
    availableTools: ["ExifTool GPS Extractor", "D\u00e9tecteur de retouches num\u00e9riques (ELA)", "Perceptual Hashing Image Deduplicator"]
  },
  "document_judiciaire": {
    icon: "\ud83d\udcc4",
    name: "Proc\u00e8s-Verbal Judiciaire (PV Norm\u00e9 CPP)",
    domain: "legal",
    domainName: "8. Cha\u00eene de Preuve & Scell\u00e9s WORM",
    primaryDb: "minio",
    primaryDbName: "MinIO S3 WORM (PDF/A-3b)",
    dbTag: "MinIO + PostgreSQL",
    dbBadge: "MinIO / PostgreSQL 16",
    color: "#e11d48",
    plainMeaning: "Acte de proc\u00e9dure officiel r\u00e9dig\u00e9 par l'officier de police judiciaire : PV d'audition, de constatation, de perquisition ou rapport de synth\u00e8se.",
    exampleValue: "PV de Synth\u00e8se N\u00b0 142/2026 - Brigade Bab Ezzouar",
    storageJustification: "MinIO conserve le PDF/A-3b scell\u00e9 ; PostgreSQL stocke le registre l\u00e9gal d'audit et la signature num\u00e9rique X.509 de l'enqu\u00eateur.",
    schemaProps: [{"name": "numero_pv", "type": "String (PK)", "required": true, "desc": "Num\u00e9ro officiel de proc\u00e8s-verbal"}, {"name": "type_acte", "type": "Enum [PV_SYNTHESE, PV_AUDITION, PV_CONSTAT, REQUISITION]", "required": true, "desc": "Nature juridique de l'acte"}, {"name": "date_redaction", "type": "Date", "required": true, "desc": "Date de signature de l'acte"}, {"name": "hash_sha256", "type": "String (64 hex)", "required": true, "desc": "Empreinte d'int\u00e9grit\u00e9 du document"}],
    connectedClues: ["Rattach\u00e9 \u00e0 l'Affaire ([:ACTE_DE_DOSSIER])", "Scell\u00e9 sous R\u00e9f\u00e9rence WORM ([:OBJET_DE_SCELLE])"],
    availableTools: ["G\u00e9n\u00e9rateur PDF/A-3b WeasyPrint", "Compilateur de dossier de plaidoirie", "V\u00e9rificateur d'int\u00e9grit\u00e9 cryptographique"]
  },
  "scelle_numerique": {
    icon: "\ud83d\udd0f",
    name: "Scell\u00e9 Num\u00e9rique WORM (ISO 27037)",
    domain: "legal",
    domainName: "8. Cha\u00eene de Preuve & Scell\u00e9s WORM",
    primaryDb: "minio",
    primaryDbName: "MinIO Enterprise S3 (Object Lock)",
    dbTag: "MinIO WORM (COMPLIANCE)",
    dbBadge: "MinIO S3 WORM (Lock)",
    color: "#e11d48",
    plainMeaning: "Enveloppe cryptographique inviolable garantissant l'int\u00e9grit\u00e9 absolue d'un \u00e9l\u00e9ment de preuve (vid\u00e9o, vocal, WARC, dump de base de donn\u00e9es).",
    exampleValue: "Scell\u00e9 Parquet N\u00b0 SC-2026-089-01 (Verrouill\u00e9 10 ans)",
    storageJustification: "MinIO S3 en mode COMPLIANCE strict : interdiction technique absolue d'effacement ou de modification, m\u00eame par l'administrateur root.",
    schemaProps: [{"name": "evidence_uid", "type": "String (PK UUID)", "required": true, "desc": "Identifiant universel d'indice"}, {"name": "num_scelle_parquet", "type": "String", "required": true, "desc": "Num\u00e9ro de scell\u00e9 attribu\u00e9 par le greffe"}, {"name": "lock_mode", "type": "String ('COMPLIANCE')", "required": true, "desc": "Mode de verrouillage S3 immuable"}, {"name": "retention_until", "type": "DateTime", "required": true, "desc": "Date de fin de r\u00e9tention l\u00e9gale (ex: 2036)"}],
    connectedClues: ["Prot\u00e8ge un \u00c9l\u00e9ment de Preuve ([:SCELLE_ELEMENT])", "Ancr\u00e9 dans un Jalon Merkle ([:PROTEGE_PAR_MERKLE])"],
    availableTools: ["V\u00e9rificateur de non-r\u00e9pudiation ISO 27037", "Contr\u00f4leur de cha\u00eene de garde CPP Art. 68"]
  },
  "preuve_merkle": {
    icon: "\ud83c\udf32",
    name: "Jalon d'Arbre de Merkle & Horodatage RFC 3161",
    domain: "legal",
    domainName: "8. Cha\u00eene de Preuve & Scell\u00e9s WORM",
    primaryDb: "postgres",
    primaryDbName: "PostgreSQL 16 (Ledger Merkle)",
    dbTag: "PostgreSQL + Neo4j",
    dbBadge: "PostgreSQL 16 / Neo4j",
    color: "#e11d48",
    plainMeaning: "Structure de donn\u00e9es cryptographique en arbre de Merkle prouvant math\u00e9matiquement qu'aucun indice n'a \u00e9t\u00e9 ins\u00e9r\u00e9 ou supprim\u00e9 a posteriori.",
    exampleValue: "Racine Merkle: e3b0c44298fc1c149afbf4... (TSA Horodat\u00e9)",
    storageJustification: "PostgreSQL stocke le registre s\u00e9quentiel d'audit Merkle avec cha\u00eenage de hachages ; Neo4j affiche la racine de preuve de l'affaire.",
    schemaProps: [{"name": "merkle_root_sha256", "type": "String (PK)", "required": true, "desc": "Racine de l'arbre de hachage de l'affaire"}, {"name": "rfc3161_timestamp", "type": "DateTime", "required": true, "desc": "Jeton d'horodatage qualifi\u00e9 d'autorit\u00e9 de confiance (TSA)"}, {"name": "nb_feuilles_indices", "type": "Int", "required": true, "desc": "Nombre total d'\u00e9l\u00e9ments scell\u00e9s dans l'arbre"}],
    connectedClues: ["Couvre l'ensemble de l'Affaire ([:CERTIFIE_AFFAIRE])"],
    availableTools: ["G\u00e9n\u00e9rateur de preuve de Merkle pour audience", "V\u00e9rificateur d'horodatage qualifi\u00e9 RFC 3161"]
  },
  "session_recherche": {
    icon: "\u26a1",
    name: "Session d'Investigation & Quota Anti-Ban",
    domain: "cyber",
    domainName: "6. Cyber, Malwares & Forensique",
    primaryDb: "redis",
    primaryDbName: "Redis 7.2 Stack Engine",
    dbTag: "Redis 7.2 Stack",
    dbBadge: "Redis 7.2 (In-Memory RESP3)",
    color: "#f59e0b",
    plainMeaning: "\u00c9tat temporaire en m\u00e9moire vive g\u00e9rant les verrous distribu\u00e9s Redlock, les quotas de requ\u00eates vers les plateformes (Token-Bucket) et le push WebSockets vers le Studio.",
    exampleValue: "Session Enqu\u00eateur (Token Bucket: 100 req/min sur Ooredoo)",
    storageJustification: "Redis 7.2 en RAM pure avec latence sub-milliseconde (<0.5ms) et structures de donn\u00e9es avanc\u00e9es (Redis Streams, scripts Lua atomiques).",
    schemaProps: [{"name": "session_id", "type": "String (PK)", "required": true, "desc": "Identifiant de session d'enqu\u00eate"}, {"name": "token_bucket_dispo", "type": "Int", "required": true, "desc": "Jetons restants avant suspension anti-ban"}, {"name": "expires_at", "type": "DateTime", "required": true, "desc": "Expiration TTL de session"}],
    connectedClues: ["Associe l'Enqu\u00eateur au Dossier ([:SESSION_ACTIVE])"],
    availableTools: ["Token Bucket Rate Limiter", "Pub/Sub WebSocket Studio 60 FPS"]
  }
};

let currentOntoDomainFilter = 'all';
let currentOntoDbFilter = 'all';

function selectOntologyEntity(key) {
  const box = document.getElementById('ontology-detail-box');
  if (!box || !ONTOLOGY_ENTITIES[key]) return;
  const e = ONTOLOGY_ENTITIES[key];

  // Highlight selected SVG node
  document.querySelectorAll('.onto-node-g').forEach(el => {
    const isSelected = el.getAttribute('data-node') === key;
    const rect = el.querySelector('rect.onto-node-rect');
    if (rect) {
      rect.style.strokeWidth = isSelected ? '3.5' : '1.5';
      rect.style.filter = isSelected ? 'drop-shadow(0 0 10px ' + e.color + ')' : 'none';
    }
  });

  const propsRows = (e.schemaProps || []).map(p => `
    <tr>
      <td style="color:#38bdf8;font-family:monospace;font-size:0.75rem;padding:0.35rem 0.6rem;">${p.name}</td>
      <td style="color:#fbbf24;font-size:0.72rem;padding:0.35rem 0.6rem;">${p.type}</td>
      <td style="font-size:0.72rem;padding:0.35rem 0.6rem;">${p.required ? '<span style="color:#ef4444;font-weight:700;">Requis</span>' : '<span style="color:#94a3b8;">Optionnel</span>'}</td>
      <td style="color:#cbd5e1;font-size:0.75rem;padding:0.35rem 0.6rem;">${p.desc}</td>
    </tr>
  `).join('');

  box.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.75rem;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <span style="font-size:2.2rem;background:#141f36;padding:0.4rem 0.6rem;border-radius:10px;border:1px solid #23344d;">${e.icon}</span>
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">
            <span class="badge" style="background:rgba(255,255,255,0.08);color:${e.color};border:1px solid ${e.color};font-size:0.7rem;">${e.domainName}</span>
            <span class="badge" style="background:#090d16;color:#38bdf8;border:1px solid #0284c7;font-size:0.7rem;font-family:monospace;">🗄️ ${e.dbBadge}</span>
          </div>
          <h3 style="font-size:1.25rem;color:${e.color};margin:0;font-weight:800;">${e.name}</h3>
          <div style="font-size:0.8rem;color:#94a3b8;margin-top:0.2rem;">Exemple Concret (Affaire Athar) : <strong style="color:#f1f5f9;">${e.exampleValue}</strong></div>
        </div>
      </div>
      <div style="text-align:right;">
        <span class="badge badge-emerald" style="font-size:0.72rem;">● Modèle Conforme GFPG</span>
      </div>
    </div>

    <!-- Legal & Forensic Plain Meaning -->
    <div style="background:#0c1322;border:1px solid #1e293b;border-radius:8px;padding:0.85rem 1rem;margin-bottom:1rem;">
      <strong style="color:#38bdf8;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:0.35rem;">🎯 Rôle dans l'Instruction Judiciaire :</strong>
      <p style="font-size:0.85rem;color:#cbd5e1;line-height:1.55;margin:0;">${e.plainMeaning}</p>
    </div>

    <!-- Storage Architecture Rationale -->
    <div style="background:linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(244, 63, 94, 0.06));border:1px solid #0284c7;border-left:4px solid #38bdf8;border-radius:8px;padding:0.85rem 1rem;margin-bottom:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
        <strong style="color:#38bdf8;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">🗄️ Justification du Stockage Polyglotte (${e.dbTag}) :</strong>
        <span style="font-family:monospace;font-size:0.7rem;color:#94a3b8;">Moteur : ${e.primaryDbName}</span>
      </div>
      <p style="font-size:0.82rem;color:#e2e8f0;line-height:1.5;margin:0;">${e.storageJustification}</p>
    </div>

    <!-- Schema Properties Table -->
    <div style="margin-bottom:1rem;">
      <strong style="color:#94a3b8;font-size:0.76rem;text-transform:uppercase;display:block;margin-bottom:0.4rem;">📐 Attributs Canoniques &amp; Schéma de Données :</strong>
      <div style="background:#090d16;border:1px solid #1e293b;border-radius:6px;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.78rem;">
          <thead>
            <tr style="background:#111a2e;color:#cbd5e1;text-align:left;border-bottom:1px solid #1e293b;">
              <th style="padding:0.4rem 0.6rem;">Propriété</th>
              <th style="padding:0.4rem 0.6rem;">Type</th>
              <th style="padding:0.4rem 0.6rem;">Statut</th>
              <th style="padding:0.4rem 0.6rem;">Description</th>
            </tr>
          </thead>
          <tbody>
            ${propsRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Connections & Tools Grid -->
    <div class="grid-2" style="margin-bottom:0;gap:0.75rem;">
      <div style="background:#090d16;padding:0.85rem;border-radius:8px;border:1px solid #1e293b;">
        <strong style="font-size:0.74rem;text-transform:uppercase;color:#38bdf8;display:block;margin-bottom:0.4rem;">🔗 Relations dans le Graphe d'Enquête</strong>
        <ul style="padding-left:1.1rem;font-size:0.78rem;color:#cbd5e1;margin:0;line-height:1.5;">
          ${(e.connectedClues || []).map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      <div style="background:#090d16;padding:0.85rem;border-radius:8px;border:1px solid #1e293b;">
        <strong style="font-size:0.74rem;text-transform:uppercase;color:#10b981;display:block;margin-bottom:0.4rem;">🧰 Outils &amp; Algorithmes Déclenchés</strong>
        <ul style="padding-left:1.1rem;font-size:0.78rem;color:#cbd5e1;margin:0;line-height:1.5;">
          ${(e.availableTools || []).map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function filterOntoDomain(domainKey) {
  currentOntoDomainFilter = domainKey;
  applyOntoFilters();
}

function filterOntoDatabase(dbKey) {
  currentOntoDbFilter = dbKey;
  applyOntoFilters();
}

function applyOntoFilters() {
  // Update button states
  document.querySelectorAll('.onto-domain-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-domain') === currentOntoDomainFilter);
  });
  document.querySelectorAll('.onto-db-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-db') === currentOntoDbFilter);
  });

  // Filter SVG nodes
  let visibleCount = 0;
  document.querySelectorAll('.onto-node-g').forEach(el => {
    const dom = el.getAttribute('data-domain');
    const db = el.getAttribute('data-db');
    const matchDom = (currentOntoDomainFilter === 'all') || (dom === currentOntoDomainFilter);
    const matchDb = (currentOntoDbFilter === 'all') || (db === currentOntoDbFilter);
    const visible = matchDom && matchDb;
    el.style.opacity = visible ? '1' : '0.15';
    el.style.pointerEvents = visible ? 'auto' : 'none';
    if (visible) visibleCount++;
  });

  // Filter SVG edges
  document.querySelectorAll('.onto-edge-g').forEach(el => {
    const src = el.getAttribute('data-src');
    const tgt = el.getAttribute('data-tgt');
    const srcNode = ONTOLOGY_ENTITIES[src];
    const tgtNode = ONTOLOGY_ENTITIES[tgt];
    if (!srcNode || !tgtNode) return;

    const srcMatchDom = (currentOntoDomainFilter === 'all') || (srcNode.domain === currentOntoDomainFilter);
    const tgtMatchDom = (currentOntoDomainFilter === 'all') || (tgtNode.domain === currentOntoDomainFilter);
    const matchDom = srcMatchDom && tgtMatchDom;

    const srcMatchDb = (currentOntoDbFilter === 'all') || (srcNode.primaryDb === currentOntoDbFilter);
    const tgtMatchDb = (currentOntoDbFilter === 'all') || (tgtNode.primaryDb === currentOntoDbFilter);
    const matchDb = srcMatchDb || tgtMatchDb;

    el.style.opacity = (matchDom && matchDb) ? '0.6' : '0.08';
  });

  // Update status banner
  const banner = document.getElementById('onto-filter-banner');
  if (banner) {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;">
        <span style="color:#cbd5e1;">Filtre Actif : 
          <strong style="color:#38bdf8;">Domaine = ${currentOntoDomainFilter.toUpperCase()}</strong> | 
          <strong style="color:#10b981;">Base de Données = ${currentOntoDbFilter.toUpperCase()}</strong>
        </span>
        <span class="badge badge-blue" style="font-size:0.72rem;">${visibleCount} Nœud(s) Visible(s) sur 37</span>
      </div>
    `;
  }
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
  if (typeof selectOntologyEntity === 'function') {
    selectOntologyEntity('personne');
  }
});
