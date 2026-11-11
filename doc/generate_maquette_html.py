# Generator for pristine doc/maquette.html with all user requirements

with open('doc/maquette.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx_main = text.find('<main class="app-workspace">')
idx_toast = text.find('<!-- Toast Notification -->')
assert idx_main != -1 and idx_toast != -1, "Sections not found"

workspace_and_modals = text[idx_main:idx_toast].replace('style="text-decoration:none;display:inline-flex;align-items:center;gap:0.4rem;" ', '')
tail_html = text[idx_toast:]

header_html = """    <!-- Top Desktop Native Menu Bar (Photoshop / Maltego Forensic Style - 32px Height) -->
    <nav class="desktop-menubar" role="menubar" aria-label="Menu principal de l'application">

      <!-- Left Group: Brand Logo & 8 Native Menus -->
      <div class="menubar-left-group">
        <!-- Athar App Brand: Logo next to Dossier to the left -->
        <a href="index.html" class="app-brand menubar-brand" aria-label="Athar DZ Accueil">
          <div class="brand-icon-box" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span data-i18n="app_title">Athar DZ</span>
        </a>

        <!-- 1. Menu Dossier / Investigation -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-investigation" onclick="toggleMenu('menu-investigation')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_investigation">Dossier</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown" id="menu-investigation" role="menu">
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('new_case')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span data-i18n="m_new_case">Nouveau Dossier d'Enquête...</span>
              <span class="menu-shortcut-chip">Ctrl+N</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('open_case')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
              <span data-i18n="m_open_case">Ouvrir un Dossier...</span>
              <span class="menu-shortcut-chip">Ctrl+O</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('save_case')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span data-i18n="m_save">Enregistrer</span>
              <span class="menu-shortcut-chip">Ctrl+S</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('save_as')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span data-i18n="m_save_as">Enregistrer sous...</span>
              <span class="menu-shortcut-chip">Ctrl+Shift+S</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('import')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              <span data-i18n="m_import_clues">Importer des Indices (CDR, Photos)...</span>
              <span class="menu-shortcut-chip">Ctrl+I</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('case_props')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span data-i18n="m_case_properties">Propriétés de l'Enquête...</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('export_report')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              <span data-i18n="m_export_report">Exporter Rapport Judiciaire (PDF)...</span>
              <span class="menu-shortcut-chip">Ctrl+E</span>
            </button>
          </div>
        </div>

        <!-- 2. Menu Édition -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-edit" onclick="toggleMenu('menu-edit')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_edit">Édition</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown" id="menu-edit" role="menu">
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Annulation effectuée')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              <span data-i18n="m_undo">Annuler Dernière Action</span>
              <span class="menu-shortcut-chip">Ctrl+Z</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Action rétablie')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
              <span data-i18n="m_redo">Rétablir</span>
              <span class="menu-shortcut-chip">Ctrl+Y</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Élément coupé')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>
              <span data-i18n="m_cut">Couper</span>
              <span class="menu-shortcut-chip">Ctrl+X</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Élément copié')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span data-i18n="m_copy">Copier</span>
              <span class="menu-shortcut-chip">Ctrl+C</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Élément collé')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
              <span data-i18n="m_paste">Coller</span>
              <span class="menu-shortcut-chip">Ctrl+V</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Entités fusionnées')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6 4-4 4 4"/><path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22"/><path d="m20 22-5-5"/></svg>
              <span data-i18n="m_merge_clues">Fusionner Deux Indices Identiques</span>
              <span class="menu-shortcut-chip">Ctrl+M</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Tout le graphe sélectionné')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="2 2"/></svg>
              <span data-i18n="m_select_all">Sélectionner Tout le Graphe</span>
              <span class="menu-shortcut-chip">Ctrl+A</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Indice supprimé de la vue')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <span data-i18n="m_delete_node">Supprimer l'Indice Sélectionné</span>
              <span class="menu-shortcut-chip">Suppr</span>
            </button>
          </div>
        </div>

        <!-- 3. Menu Insérer -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-insert" onclick="toggleMenu('menu-insert')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_insert">Insérer</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown" id="menu-insert" role="menu">
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('insert_clue')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
              <span data-i18n="m_insert_clue">Nouvel Indice Manuel...</span>
              <span class="menu-shortcut-chip">Ctrl+Shift+I</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('insert_clue')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span data-i18n="m_insert_seized">Pièce à Conviction Scellée (WORM)...</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('insert_clue')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/></svg>
              <span data-i18n="m_insert_witness">Déposition / Audition de Témoin...</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_exiftool_metadata')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span data-i18n="m_insert_web_snap">Capture Web Certifiée (RFC 3161)...</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('insert_clue')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span data-i18n="m_insert_gps">Coordonnées GPS / Point de Bornage...</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('insert_clue')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span data-i18n="m_insert_suspect">Profil / Compte Suspect Cible...</span>
            </button>
          </div>
        </div>

        <!-- 4. Menu Outils OSINT (Categorized List with Tool Info Modal on Click) -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-osint" onclick="toggleMenu('menu-osint')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_osint">Outils OSINT</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown menu-dropdown-categorized" id="menu-osint" role="menu">
            
            <!-- Category 1: Web & Infrastructure -->
            <div class="menu-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span data-i18n="cat_web_infra">Web & Infrastructure Réseau</span>
            </div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_whois_dns')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span data-i18n="m_tool_whois">Historique WHOIS & Enregistrements DNS</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_shodan_censys')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
              <span data-i18n="m_tool_shodan">Scanner de Ports Shodan & Censys</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_ssl_crt')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span data-i18n="m_tool_ssl">Certificats SSL & Certificate Transparency (crt.sh)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>

            <!-- Category 2: Metadata & IOCs -->
            <div class="menu-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span data-i18n="cat_tech_metadata">Métadonnées & Analyse Technique</span>
            </div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_ioc_extractor')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span data-i18n="m_tool_ioc">Extracteur d'IOCs & Entités Forensiques</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_mongodb_decoder')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
              <span data-i18n="m_tool_mongo">Décodeur Timestamp ObjectId MongoDB</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_exiftool_metadata')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span data-i18n="m_tool_exif">Analyseur ExifTool (GPS & Métadonnées Médias)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>

            <!-- Category 3: Ad Tracking & Pivots -->
            <div class="menu-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/></svg>
              <span data-i18n="cat_ad_tracking">Pivots Publicitaires & Traçage</span>
            </div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_meta_pixel')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/></svg>
              <span data-i18n="m_tool_pixel">Pivot Inverse Meta Pixel & ID Tracker</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_google_analytics')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
              <span data-i18n="m_tool_google_analytics">Traçage Reverse Google Analytics / AdSense</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>

            <!-- Category 4: Data Breaches & Identity -->
            <div class="menu-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span data-i18n="cat_breach_identity">Fuites de Données & Identifiants</span>
            </div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_dehashed_breach')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span data-i18n="m_tool_breach">Recherche de Fuites d'Identifiants (DeHashed)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_holehe_email')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span data-i18n="m_tool_holehe">Vérificateur d'Email sur 120+ Services (Holehe)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>

            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="openCommandPalette()">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              <span data-i18n="m_tool_all_osint">Consulter les 16 Briques OSINT du Catalogue ↗</span>
            </button>
          </div>
        </div>

        <!-- 5. Menu Réseaux Sociaux / OSNA (Online Social Network Analysis) -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-osns" onclick="toggleMenu('menu-osns')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_osns">Réseaux Sociaux (OSNA)</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown menu-dropdown-categorized" id="menu-osns" role="menu">
            
            <!-- Category 1: Social Platform Intelligence (SOCMINT) -->
            <div class="menu-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span data-i18n="cat_socmint">Profilage Plateformes Sociales (SOCMINT)</span>
            </div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_telegram_resolver')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              <span data-i18n="m_tool_telegram">Résolveur & Pivot Telegram (UID fixe, canaux)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_whatsapp_inspector')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span data-i18n="m_tool_whatsapp">Inspecteur WhatsApp Business & VCard</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_meta_ad_transparency')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <span data-i18n="m_tool_meta_ad">Transparence Pages Facebook & Meta Ad Library</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_instagram_toutatis')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span data-i18n="m_tool_instagram">Analyseur Profils Instagram / Toutatis</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_ouedkniss_scraper')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span data-i18n="m_tool_ouedkniss">Scraper d'Annonces Algériennes Ouedkniss</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_social_mapper')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
              <span data-i18n="m_tool_social_mapper">Corrélateur Visuel Multi-Plateformes (Social Mapper)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>

            <!-- Category 2: Social Network Analysis (Graph SNA) -->
            <div class="menu-category-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
              <span data-i18n="cat_sna">Analyse de Réseau Social (Graph SNA)</span>
            </div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_sna_betweenness')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="18" x2="18.01" y1="18" y2="18"/><path d="m15 9-6 6"/><circle cx="12" cy="12" r="2"/></svg>
              <span data-i18n="m_tool_sna_betweenness">Centralité d'Intermédiarité (Betweenness Centrality)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_sna_louvain')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/></svg>
              <span data-i18n="m_tool_sna_louvain">Détection de Communautés (Algorithme de Louvain)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_sna_pagerank')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              <span data-i18n="m_tool_sna_pagerank">Détection de Prête-Noms & Mules (PageRank Bipartite)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToolInfo('tool_sna_link_pred')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span data-i18n="m_tool_sna_link_pred">Prédiction de Liens Cachés (Adamic-Adar / Jaccard)</span>
              <span class="menu-info-chip" data-i18n="info_chip">Détails</span>
            </button>

            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="openCommandPalette()">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              <span data-i18n="m_tool_all_socmint">Consulter les 12 Outils de Réseaux Sociaux & SNA ↗</span>
            </button>
          </div>
        </div>

        <!-- 6. Menu Police Judiciaire -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-police" onclick="toggleMenu('menu-police')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_police">Police Judiciaire</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown" id="menu-police" role="menu">
            <div class="menu-dropdown-header">Enquête Télécoms & Finances</div>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('Telecom CDR Excel Parser')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/></svg>
              <span data-i18n="m_tool_cdr">Analyseur de Relevés Télécoms (CDR Excel)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('OpenCellID Triangulation')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span data-i18n="m_tool_cell_triang">Bornage & Azimuts BTS Relais (OpenCellID)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('Co-Traveler Twin Phone Detector')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span data-i18n="m_tool_cotravel">Détecteur de Téléphones Jumeaux (Co-Déplacement)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('Alibi Contradiction Engine')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              <span data-i18n="m_tool_alibi">Contrôleur de Contradictions d'Alibis</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('YOLOv8 Plate Reader')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="7" cy="12" r="1"/><circle cx="17" cy="12" r="1"/></svg>
              <span data-i18n="m_tool_alpr">Reconnaissance de Plaques LAPI (Matricules DZ)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('BaridiMob Mules Ledger')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              <span data-i18n="m_tool_ccp_mules">Validateur CCP BaridiMob & Registre des Mules</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('CPP Requisition Generator')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
              <span data-i18n="m_tool_requisitions">Générateur Réquisitions CPP (Docx/PDF)</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="openCommandPalette()">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              <span data-i18n="m_tool_all_police">Consulter les Briques Enquête Policière (9 Outils) ↗</span>
            </button>
          </div>
        </div>

        <!-- 7. Menu Affichage -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-view" onclick="toggleMenu('menu-view')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_view">Affichage</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown" id="menu-view" role="menu">
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('view_graph')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
              <span data-i18n="m_view_graph">Tableau des Indices (Graphe Visuel)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('view_timeline')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span data-i18n="m_view_timeline">Chronologie Temporelle Forensique</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('view_map')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span data-i18n="m_view_map">Carte Géographique des Bornages & SIG</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('import')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span data-i18n="m_view_vault">Coffre-fort des Preuves Certifiées (WORM)</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Zoom réinitialisé')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><polyline points="21 15 21 21 15 21"/><polyline points="3 9 3 3 9 3"/></svg>
              <span data-i18n="m_view_reset_zoom">Réinitialiser le Zoom & Centrer la Vue</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('toggle_layers')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <span data-i18n="m_view_toggle_layers">Afficher / Masquer Panneau des Calques</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('fullscreen')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><polyline points="21 15 21 21 15 21"/><polyline points="3 9 3 3 9 3"/></svg>
              <span data-i18n="m_view_toggle_fullscreen">Plein Écran (F11)</span>
              <span class="menu-shortcut-chip">F11</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Disposition du graphe réorganisée')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              <span data-i18n="m_view_refresh">Réorganiser la Disposition Automatique</span>
            </button>
          </div>
        </div>

        <!-- 8. Menu Assistant IA -->
        <div class="menubar-item">
          <button class="menubar-btn" id="btn-menu-ai" onclick="toggleMenu('menu-ai')" aria-haspopup="true" aria-expanded="false">
            <span data-i18n="menu_ai">Assistant IA</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="menu-dropdown" id="menu-ai" role="menu">
            <div class="menu-dropdown-header">Moteur d'Inférence & Copilot</div>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Mode Déterministe Strict Actif (100% Sans LLM)')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              <span data-i18n="m_ai_mode_deterministic">Mode Déterministe Strict (Sans LLM - Actif)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Ollama Local Activé (Qwen-2.5-32B)')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="1" y2="4"/><line x1="15" x2="15" y1="1" y2="4"/></svg>
              <span data-i18n="m_ai_mode_local_ollama">Activer Copilot IA Local (Ollama / Qwen-2.5)</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="showToast('Passerelle Cloud LiteLLM Connectée')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
              <span data-i18n="m_ai_mode_cloud">Passerelle Cloud Sécurisée (LiteLLM)</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="runSimulatedTool('Playbook Déterministe Escroquerie Web')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span data-i18n="m_ai_suggest_playbook">Proposer un Scénario d'Enquête Automatique</span>
            </button>
            <button class="menu-dropdown-item" role="menuitem" onclick="setScreen(5)">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
              <span data-i18n="m_ai_summarize">Rédiger Synthèse Chronologique de l'Affaire</span>
            </button>
            <div class="menu-dropdown-divider"></div>
            <button class="menu-dropdown-item" role="menuitem" onclick="triggerMenuAction('llm_settings')">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/></svg>
              <span data-i18n="m_ai_settings">Configuration LLM & Paramètres d'Inférence...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Group: Mode Switcher, Language Switcher, Theme Toggle, User Profile (Brought UP to Menubar) -->
      <div class="menubar-right-group">
        <!-- Global Mode Switch: Segmented Control (Collect | Analyze | Report) -->
        <nav class="mode-segmented-control menubar-mode-switch" role="tablist" aria-label="Mode de travail">
          <button class="mode-tab-btn" data-mode="collect" role="tab" aria-selected="false" onclick="setAppMode('collect')">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            <span data-i18n="mode_collect">Collecter</span>
          </button>
          <button class="mode-tab-btn active" data-mode="analyze" role="tab" aria-selected="true" onclick="setAppMode('analyze')">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
            <span data-i18n="mode_analyze">Analyser</span>
          </button>
          <button class="mode-tab-btn" data-mode="report" role="tab" aria-selected="false" onclick="setAppMode('report')">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            <span data-i18n="mode_report">Rapporter</span>
          </button>
        </nav>

        <!-- Theme Toggle (Light / Dark) -->
        <button class="btn btn-ghost btn-xs" onclick="toggleTheme()" aria-label="Changer de thème">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </button>

        <!-- Language Switcher -->
        <div class="lang-selector-group" role="group" aria-label="Sélectionner la langue">
          <button class="btn btn-ghost btn-xs" onclick="setLanguage('fr')" aria-label="Langue Française">FR</button>
          <button class="btn btn-ghost btn-xs" onclick="setLanguage('ar')" aria-label="اللغة العربية">AR</button>
          <button class="btn btn-ghost btn-xs" onclick="setLanguage('en')" aria-label="English Language">EN</button>
        </div>

        <!-- User Identity -->
        <div class="user-profile-badge menubar-user-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="font-semibold" data-i18n="user_name">Insp. Benali</span>
        </div>
      </div>
    </nav>

    <!-- Sub-Bar (Second Level under Menu: Case Switcher on Left, Search Bar on Right - 44px Height) -->
    <header class="app-subbar" role="banner">
      <div class="subbar-left">
        <!-- Case Selector -->
        <button class="case-selector-btn" aria-label="Sélectionner le dossier d'enquête" onclick="openPropertiesModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
          <span class="font-mono text-xs font-semibold" data-i18n="case_id">Dossier #2026-SCAM-089</span>
          <span class="chip chip-neutral" data-i18n="case_profile">Cyber-Escroquerie Commerciale</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <!-- Stealth Warning (Shown ONLY when stealth is OFF) -->
        <button id="stealth-warning-badge" class="stealth-alert-badge" onclick="toggleStealth()" aria-label="Avertissement mode furtif">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
          <span data-i18n="stealth_warning">ALERTE : Mode Furtif Inactif</span>
        </button>
      </div>

      <div class="subbar-right">
        <!-- Search Bar to the right in the second level -->
        <div class="subbar-search-container">
          <button class="topbar-search-bar" onclick="openCommandPalette()" aria-label="Rechercher des indices, suspects ou lancer un outil (Ctrl+K)">
            <div class="search-bar-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span data-i18n="topbar_search_placeholder">Rechercher un indice, numéro, suspect ou lancer un outil... (Ctrl+K)</span>
            </div>
            <span class="cmd-kbd-shortcut">Ctrl+K</span>
          </button>
        </div>
      </div>
    </header>
"""

modal_7_html = """  <!-- MODAL 7: Tool Technical Specification Modal (Rich Forensic Details) -->
  <div class="modal-overlay" id="tool-info-modal" role="dialog" aria-modal="true" aria-label="Fiche Technique Forensique">
    <div class="command-palette-card tool-info-modal-card">
      <div class="tool-info-header">
        <div>
          <div class="modal-title-flex">
            <div class="brand-icon-box" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="text-md font-bold text-light" id="tool-info-name">Extracteur d'IOCs & Entités Forensiques</h3>
          </div>
          <div class="tool-info-header-meta">
            <span class="chip chip-cyan" id="tool-info-cat">Métadonnées & Analyse Technique</span>
            <span class="chip chip-purple" id="tool-info-badge">P0 • Indispensable</span>
            <span class="chip chip-neutral font-mono text-xs" id="tool-info-mode">100% Déterministe • Review-Run</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="closeToolInfoModal()" aria-label="Fermer la fiche">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="tool-info-desc-box">
        <strong data-i18n="tool_info_title">Fiche Technique & Spécification Forensique :</strong>
        <p id="tool-info-desc" class="text-xs text-muted mt-1">Extraction automatisée d'identifiants et de traces numériques.</p>
      </div>

      <div class="tool-info-grid">
        <div class="tool-info-box">
          <div class="tool-info-box-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            <span data-i18n="tool_info_inputs">Données d'Entrée (Inputs)</span>
          </div>
          <div class="tool-info-box-content font-mono" id="tool-info-inputs-val">Texte brut, dump Telegram/WhatsApp, PDF</div>
        </div>

        <div class="tool-info-box">
          <div class="tool-info-box-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            <span data-i18n="tool_info_outputs">Données de Sortie (Outputs & Nœuds)</span>
          </div>
          <div class="tool-info-box-content font-mono" id="tool-info-outputs-val">Adresses IP, numéros E.164, comptes CCP, hashes SHA-256</div>
        </div>

        <div class="tool-info-box">
          <div class="tool-info-box-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
            <span data-i18n="tool_info_storage">Persistance & Stockage Judiciaire</span>
          </div>
          <div class="tool-info-box-content" id="tool-info-storage-val">Neo4j 5.x • PostgreSQL 16 • MinIO S3 (WORM)</div>
        </div>

        <div class="tool-info-box">
          <div class="tool-info-box-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
            <span data-i18n="tool_info_resources">Ressources & Mode d'Exécution</span>
          </div>
          <div class="tool-info-box-content" id="tool-info-resources-val">Moteur Python déterministe • Empreinte mémoire &lt; 64 Mo • Furtif</div>
        </div>
      </div>

      <div class="tool-info-box">
        <div class="tool-info-box-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span data-i18n="tool_info_compliance">Chaîne de Garde & Traçabilité WORM</span>
        </div>
        <div class="tool-info-box-content" id="tool-info-compliance-val">Scellé numérique ISO 27037 • Validation par checksum Luhn et clé CCP • Traçabilité immuable</div>
      </div>

      <div class="tool-info-actions">
        <button class="btn btn-ghost" onclick="closeToolInfoModal()" data-i18n="tool_info_close_btn">Fermer</button>
        <button class="btn btn-secondary" onclick="addToolToPlaybook()">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span data-i18n="tool_info_playbook_btn">Ajouter au Playbook DAG</span>
        </button>
        <button class="btn btn-primary" onclick="runToolFromModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span data-i18n="tool_info_run_btn">Exécuter sur l'Indice Actif</span>
        </button>
      </div>
    </div>
  </div>
"""

full_output = f"""<!DOCTYPE html>
<html lang="fr" dir="ltr" data-theme="dark" id="app-root">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Athar DZ — Forensic OSINT & Judicial Investigation Studio</title>
  <link rel="stylesheet" href="assets/tokens.css" />
  <link rel="stylesheet" href="assets/maquette.css" />
</head>
<body>

  <!-- Full Desktop Application Shell -->
  <div class="app-container">

{header_html}

{workspace_and_modals}
{modal_7_html}
{tail_html}
"""

with open('doc/maquette.html', 'w', encoding='utf-8') as f:
    f.write(full_output)

print("doc/maquette.html composed and written successfully, length:", len(full_output))
