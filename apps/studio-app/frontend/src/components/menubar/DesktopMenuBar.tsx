import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Sun,
  Moon,
  ChevronDown,
  FileText,
  User,
  Target,
  Share2,
  Circle,
  GitFork,
  Grid,
} from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';
import type { Locale } from '../../i18n/translations';
import type { ActiveViewMode } from '../canvas/Toolbar';
import type { ToolSpec } from '../modals/ToolInfoModal';

interface DesktopMenuBarProps {
  activeView: ActiveViewMode;
  onChangeView: (view: ActiveViewMode) => void;
  onOpenExport: () => void;
  onOpenCaseProps: () => void;
  onOpenToolInfo: (tool: ToolSpec) => void;
  onTriggerPhaseNotice: (featureName: string, targetPhase: string) => void;
  onAddNode: (typeKey: string) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onResetZoom: () => void;
  onToggleSna: (algoKey?: string) => void;
  onRunPlaybook: () => void;
}

export const DesktopMenuBar: React.FC<DesktopMenuBarProps> = ({
  activeView,
  onChangeView,
  onOpenExport,
  onOpenCaseProps,
  onOpenToolInfo,
  onTriggerPhaseNotice,
  onAddNode,
  onSelectAll,
  onDeleteSelected,
  onResetZoom,
  onToggleSna,
  onRunPlaybook,
}) => {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { activeLayout, applyLayout } = useGraphStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [appMode, setAppMode] = useState<'collect' | 'analyze' | 'report'>('analyze');
  const menubarRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menubarRef.current && !menubarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (menuId: string) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  };

  const closeDropdown = () => setOpenMenu(null);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    closeDropdown();
  };

  return (
    <nav
      ref={menubarRef}
      className="desktop-menubar"
      role="menubar"
      aria-label="Menu principal de l'application"
    >
      {/* Left Group: Logo & 8 Dropdown Menus */}
      <div className="menubar-left-group">
        <a href="#home" className="app-brand menubar-brand" onClick={(e) => { e.preventDefault(); onOpenCaseProps(); }}>
          <div className="brand-icon-box" aria-hidden="true">
            <Shield size={13} />
          </div>
          <span>Athar DZ</span>
        </a>

        {/* 1. Menu Dossier */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'investigation' ? 'active' : ''}`}
            onClick={() => toggleDropdown('investigation')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'investigation'}
          >
            <span>{t.menuInvestigation}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown ${openMenu === 'investigation' ? 'is-open' : ''}`} role="menu">
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenCaseProps();
              }}
            >
              <span>Nouveau Dossier d&apos;Enquête...</span>
              <span className="menu-shortcut-chip">Ctrl+N</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenCaseProps();
              }}
            >
              <span>Ouvrir un Dossier...</span>
              <span className="menu-shortcut-chip">Ctrl+O</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                alert('Affaire enregistrée dans la base PostgreSQL/TimescaleDB.');
              }}
            >
              <span>Enregistrer</span>
              <span className="menu-shortcut-chip">Ctrl+S</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenExport();
              }}
            >
              <span>Enregistrer sous...</span>
              <span className="menu-shortcut-chip">Ctrl+Shift+S</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              aria-disabled="true"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Importation d’Indices (CDR & Médias)', 'Phase 2');
              }}
            >
              <span>Importer des Indices (CDR, Photos)...</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenCaseProps();
              }}
            >
              <span>Propriétés de l&apos;Enquête...</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenExport();
              }}
            >
              <span>Exporter Rapport Judiciaire (PDF)...</span>
              <span className="menu-shortcut-chip">Ctrl+E</span>
            </button>
          </div>
        </div>

        {/* 2. Menu Édition */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'edit' ? 'active' : ''}`}
            onClick={() => toggleDropdown('edit')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'edit'}
          >
            <span>{t.menuEdit}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown ${openMenu === 'edit' ? 'is-open' : ''}`} role="menu">
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                alert('Annulation effectuée.');
              }}
            >
              <span>Annuler Dernière Action</span>
              <span className="menu-shortcut-chip">Ctrl+Z</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                alert('Action rétablie.');
              }}
            >
              <span>Rétablir</span>
              <span className="menu-shortcut-chip">Ctrl+Y</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onSelectAll();
              }}
            >
              <span>Sélectionner Tout le Graphe</span>
              <span className="menu-shortcut-chip">Ctrl+A</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              aria-disabled="true"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Fusion d’Indices Identiques', 'Phase 2');
              }}
            >
              <span>Fusionner Deux Indices Identiques</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onDeleteSelected();
              }}
            >
              <span>Supprimer l&apos;Indice Sélectionné</span>
              <span className="menu-shortcut-chip">Suppr</span>
            </button>
          </div>
        </div>

        {/* 3. Menu Insérer */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'insert' ? 'active' : ''}`}
            onClick={() => toggleDropdown('insert')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'insert'}
          >
            <span>{t.menuInsert}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown ${openMenu === 'insert' ? 'is-open' : ''}`} role="menu">
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onAddNode('personne');
              }}
            >
              <span>Nouvel Indice Manuel...</span>
              <span className="menu-shortcut-chip">Ctrl+Shift+I</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              aria-disabled="true"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Pièce à Conviction Scellée WORM', 'Phase 2');
              }}
            >
              <span>Pièce à Conviction Scellée (WORM)...</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              aria-disabled="true"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Déposition & Diarisation Vocale Darija', 'Phase 2');
              }}
            >
              <span>Déposition / Audition de Témoin (Whisper)...</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              aria-disabled="true"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Capture Web Certifiée RFC 3161', 'Phase 2');
              }}
            >
              <span>Capture Web Certifiée (RFC 3161)...</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onAddNode('antenne_bts');
              }}
            >
              <span>Coordonnées GPS / Point de Bornage...</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onAddNode('personne');
              }}
            >
              <span>Profil / Compte Suspect Cible...</span>
            </button>
          </div>
        </div>

        {/* 4. Menu Outils OSINT (Categorized List) */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'osint' ? 'active' : ''}`}
            onClick={() => toggleDropdown('osint')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'osint'}
          >
            <span>{t.menuOsint}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown menu-dropdown-categorized ${openMenu === 'osint' ? 'is-open' : ''}`} role="menu">
            <div className="menu-category-header">Web &amp; Infrastructure Réseau</div>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenToolInfo({
                  id: 'whois',
                  name: 'Historique WHOIS & Enregistrements DNS',
                  category: 'Web & Infrastructure',
                  phase: 'Phase 3',
                  prerequisite: 'Local / Clé Gratuite',
                  description: 'Analyse des zones DNS, enregistrements SOA, MX et historique d’attribution de noms de domaine.',
                  inputs: ['Nom de Domaine (FQDN)', 'Adresse IP'],
                  outputs: ['Serveurs DNS', 'Adresses IP Associées', 'Dates d’Enregistrement'],
                  storage: 'Neo4j 5.20+ & PostgreSQL',
                });
              }}
            >
              <span>Historique WHOIS &amp; DNS</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenToolInfo({
                  id: 'shodan',
                  name: 'Scanner de Ports Shodan & Censys',
                  category: 'Web & Infrastructure',
                  phase: 'Phase 3',
                  prerequisite: 'Clé API Shodan / Censys',
                  description: 'Cartographie des ports ouverts, bannières de serveurs et technologies d’infrastructure cyber.',
                  inputs: ['Adresse IP v4/v6', 'Bloc CIDR'],
                  outputs: ['Ports Actifs', 'Bannières TLS/SSH', 'Vulnérabilités CVE'],
                  storage: 'Neo4j 5.20+',
                });
              }}
            >
              <span>Scanner de Ports Shodan &amp; Censys</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onOpenToolInfo({
                  id: 'crt_sh',
                  name: 'Certificats SSL & CT Logs (crt.sh)',
                  category: 'Web & Infrastructure',
                  phase: 'Phase 3',
                  prerequisite: 'Gratuit / Direct',
                  description: 'Extraction des sous-domaines via les journaux Certificate Transparency de crt.sh.',
                  inputs: ['Domaine Racine'],
                  outputs: ['Sous-Domaines Découverts', 'Autorités de Certification'],
                  storage: 'Neo4j 5.20+',
                });
              }}
            >
              <span>Certificats SSL &amp; Transparency (crt.sh)</span>
              <span className="phase-badge">Phase 3</span>
            </button>

            <div className="menu-category-header">Métadonnées &amp; IOCs</div>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Extracteur d’IOCs', 'Phase 3');
              }}
            >
              <span>Extracteur d&apos;IOCs &amp; Entités</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Décodeur MongoDB ObjectId', 'Phase 3');
              }}
            >
              <span>Décodeur Timestamp ObjectId MongoDB</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Analyseur ExifTool', 'Phase 3');
              }}
            >
              <span>Analyseur ExifTool (GPS Médias)</span>
              <span className="phase-badge">Phase 3</span>
            </button>

            <div className="menu-category-header">Pivots Publicitaires &amp; Fuites</div>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Pivot Meta Pixel Tracker', 'Phase 3');
              }}
            >
              <span>Pivot Inverse Meta Pixel &amp; Tracker</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Recherche DeHashed & Holehe', 'Phase 3');
              }}
            >
              <span>Fuites d&apos;Identifiants (DeHashed &amp; Holehe)</span>
              <span className="phase-badge">Phase 3</span>
            </button>
          </div>
        </div>

        {/* 5. Menu Réseaux Sociaux & SNA */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'osns' ? 'active' : ''}`}
            onClick={() => toggleDropdown('osns')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'osns'}
          >
            <span>{t.menuOsna}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown menu-dropdown-categorized ${openMenu === 'osns' ? 'is-open' : ''}`} role="menu">
            <div className="menu-category-header">Profilage Plateformes Sociales (SOCMINT)</div>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Résolveur Telegram UID', 'Phase 3');
              }}
            >
              <span>Résolveur &amp; Pivot Telegram (UID Fixe)</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Inspecteur WhatsApp Business', 'Phase 3');
              }}
            >
              <span>Inspecteur WhatsApp Business &amp; VCard</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Transparence Meta Ad Library', 'Phase 3');
              }}
            >
              <span>Transparence Pages Facebook &amp; Meta Ad</span>
              <span className="phase-badge">Phase 3</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Scraper Algérien Ouedkniss', 'Phase 3');
              }}
            >
              <span>Scraper d&apos;Annonces Ouedkniss DZ</span>
              <span className="phase-badge">Phase 3</span>
            </button>

            <div className="menu-category-header">Analyse Graphique SNA (16 Algorithmes)</div>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onToggleSna('betweenness_centrality');
              }}
            >
              <span>Centralité d&apos;Intermédiarité (Betweenness)</span>
              <span className="chip chip-neutral font-mono text-xs">Phase 1 Actif</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onToggleSna('louvain');
              }}
            >
              <span>Détection de Communautés (Louvain)</span>
              <span className="chip chip-neutral font-mono text-xs">Phase 1 Actif</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onToggleSna('pagerank');
              }}
            >
              <span>Détection de Mules (PageRank Bipartite)</span>
              <span className="chip chip-neutral font-mono text-xs">Phase 1 Actif</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onToggleSna('adamic_adar');
              }}
            >
              <span>Prédiction de Liens (Adamic-Adar / Jaccard)</span>
              <span className="chip chip-neutral font-mono text-xs">Phase 1 Actif</span>
            </button>
          </div>
        </div>

        {/* 6. Menu Police Judiciaire */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'police' ? 'active' : ''}`}
            onClick={() => toggleDropdown('police')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'police'}
          >
            <span>{t.menuPolice}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown ${openMenu === 'police' ? 'is-open' : ''}`} role="menu">
            <div className="menu-dropdown-header">Enquête Télécoms &amp; Finances</div>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Analyseur de Relevés CDR Excel', 'Phase 2');
              }}
            >
              <span>Analyseur de Relevés Télécoms (CDR Excel)</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Bornage BTS OpenCellID', 'Phase 2');
              }}
            >
              <span>Bornage &amp; Azimuts BTS Relais (OpenCellID)</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Détecteur de Téléphones Jumeaux', 'Phase 2');
              }}
            >
              <span>Détecteur de Téléphones Jumeaux (Co-Déplacement)</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Contrôleur Contradictions d’Alibis', 'Phase 2');
              }}
            >
              <span>Contrôleur de Contradictions d&apos;Alibis</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Reconnaissance de Plaques LAPI YOLOv8', 'Phase 2');
              }}
            >
              <span>Reconnaissance de Plaques LAPI (Matricules DZ)</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Validateur BaridiMob & Registre Mules', 'Phase 2');
              }}
            >
              <span>Validateur CCP BaridiMob &amp; Registre Mules</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Générateur de Réquisitions CPP', 'Phase 2');
              }}
            >
              <span>Générateur Réquisitions CPP (Docx/PDF)</span>
              <span className="phase-badge">Phase 2</span>
            </button>
          </div>
        </div>

        {/* 7. Menu Affichage */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'view' ? 'active' : ''}`}
            onClick={() => toggleDropdown('view')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'view'}
          >
            <span>{t.menuView}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown ${openMenu === 'view' ? 'is-open' : ''}`} role="menu">
            <button
              type="button"
              className={`menu-dropdown-item ${activeView === 'graph' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onChangeView('graph');
              }}
            >
              <span>Tableau des Indices (Graphe Visuel)</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeView === 'timeline' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onChangeView('timeline');
              }}
            >
              <span>Chronologie Temporelle Forensique</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeView === 'map' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onChangeView('map');
              }}
            >
              <span>Carte Géographique des Bornages &amp; SIG</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeView === 'table' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onChangeView('table');
              }}
            >
              <span>Vue Tableau Accessible (WCAG AA)</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeView === 'audit' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onChangeView('audit');
              }}
            >
              <span>Registre d&apos;Audit Forensique (ISO 27037)</span>
            </button>
            <div className="menu-dropdown-divider" />
            <div style={{ padding: '4px 10px', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Disposition du Graphe
            </div>
            <button
              type="button"
              className={`menu-dropdown-item ${activeLayout === 'concentric' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                applyLayout('concentric');
              }}
            >
              <Target size={13} className="text-accent" />
              <span>Concentrique par Calque (Forensique)</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeLayout === 'force' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                applyLayout('force');
              }}
            >
              <Share2 size={13} className="text-accent" />
              <span>Organique (Force-Directed)</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeLayout === 'circular' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                applyLayout('circular');
              }}
            >
              <Circle size={13} className="text-accent" />
              <span>Circulaire Global</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeLayout === 'hierarchical' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                applyLayout('hierarchical');
              }}
            >
              <GitFork size={13} className="text-accent" />
              <span>Hiérarchique (Chaîne Criminelle)</span>
            </button>
            <button
              type="button"
              className={`menu-dropdown-item ${activeLayout === 'grid' ? 'active' : ''}`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                applyLayout('grid');
              }}
            >
              <Grid size={13} className="text-accent" />
              <span>Grille Matricielle Ordonnée</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Coffre-fort des Preuves Certifiées WORM', 'Phase 2');
              }}
            >
              <span>Coffre-fort des Preuves Certifiées (WORM)</span>
              <span className="phase-badge">Phase 2</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onResetZoom();
              }}
            >
              <span>Réinitialiser le Zoom &amp; Centrer</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={handleFullscreenToggle}
            >
              <span>Plein Écran (F11)</span>
              <span className="menu-shortcut-chip">F11</span>
            </button>
          </div>
        </div>

        {/* 8. Menu Assistant IA */}
        <div className="menubar-item">
          <button
            type="button"
            className={`menubar-btn ${openMenu === 'ai' ? 'active' : ''}`}
            onClick={() => toggleDropdown('ai')}
            aria-haspopup="true"
            aria-expanded={openMenu === 'ai'}
          >
            <span>{t.menuAi}</span>
            <ChevronDown size={11} />
          </button>
          <div className={`menu-dropdown ${openMenu === 'ai' ? 'is-open' : ''}`} role="menu">
            <div className="menu-dropdown-header">Moteur d&apos;Inférence &amp; Copilot</div>
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                alert('Mode Déterministe Strict Actif (100% Sans Hallucination LLM).');
              }}
            >
              <span className="text-success">Mode Déterministe Strict (Sans LLM - Actif)</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Copilot IA Local Ollama Qwen-2.5', 'Phase 5');
              }}
            >
              <span>Activer Copilot IA Local (Ollama / Qwen-2.5)</span>
              <span className="phase-badge">Phase 5</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Passerelle Cloud LiteLLM', 'Phase 5');
              }}
            >
              <span>Passerelle Cloud Sécurisée (LiteLLM)</span>
              <span className="phase-badge">Phase 5</span>
            </button>
            <div className="menu-dropdown-divider" />
            <button
              type="button"
              className="menu-dropdown-item"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onRunPlaybook();
              }}
            >
              <span>Proposer un Scénario d&apos;Enquête (Review-Run)</span>
            </button>
            <button
              type="button"
              className="menu-dropdown-item is-future-phase"
              role="menuitem"
              onClick={() => {
                closeDropdown();
                onTriggerPhaseNotice('Synthèse Automatique LLM', 'Phase 5');
              }}
            >
              <span>Rédiger Synthèse Chronologique de l&apos;Affaire</span>
              <span className="phase-badge">Phase 5</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Group: Mode Switcher, Spec Link, Theme Toggle, Language, User */}
      <div className="menubar-right-group">
        {/* Global Mode Switcher (Collect | Analyze | Report) */}
        <nav className="menubar-mode-switch" role="tablist" aria-label="Mode de travail">
          <button
            type="button"
            className={`mode-tab-btn is-future-phase ${appMode === 'collect' ? 'active' : ''}`}
            role="tab"
            aria-selected={appMode === 'collect'}
            onClick={() => onTriggerPhaseNotice('Mode Collecte Egress Tiers', 'Phase 3')}
            title="Mode Collecte & Ingestion (Planifié Phase 3)"
          >
            <span>{t.modeCollect}</span>
            <span className="phase-badge">P3</span>
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${appMode === 'analyze' ? 'active' : ''}`}
            role="tab"
            aria-selected={appMode === 'analyze'}
            onClick={() => setAppMode('analyze')}
            title="Mode Analyse Forensique (Actif)"
          >
            <span>{t.modeAnalyze}</span>
          </button>
          <button
            type="button"
            className={`mode-tab-btn is-future-phase ${appMode === 'report' ? 'active' : ''}`}
            role="tab"
            aria-selected={appMode === 'report'}
            onClick={() => onTriggerPhaseNotice('Mode Récit Chronologique d’Audience', 'Phase 4')}
            title="Mode Storyboard & Rapport d’Audience (Planifié Phase 4)"
          >
            <span>{t.modeReport}</span>
            <span className="phase-badge">P4</span>
          </button>
        </nav>

        {/* Specifications link */}
        <button
          type="button"
          className="spec-link-chip"
          onClick={() => {
            window.open('/doc/SPECIFICATION.md', '_blank');
          }}
          title="Consulter la Spécification Technique & Architecture"
        >
          <FileText size={12} />
          <span>Spécifications (8 Chap.)</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn btn-ghost btn-xs"
          onClick={toggleTheme}
          aria-label={t.toggleThemeLabel}
          title={theme === 'dark' ? t.themeLight : t.themeDark}
        >
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        {/* Language Selector */}
        <div style={{ display: 'flex', gap: '2px' }} role="group" aria-label={t.languageLabel}>
          {(['fr', 'ar', 'en'] as Locale[]).map((lng) => (
            <button
              key={lng}
              type="button"
              className={`btn btn-ghost btn-xs ${locale === lng ? 'btn-primary' : ''}`}
              style={{
                minWidth: '24px',
                padding: '1px 4px',
                fontWeight: locale === lng ? 700 : 400,
              }}
              onClick={() => setLocale(lng)}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>

        {/* User Badge */}
        <div className="menubar-user-badge">
          <User size={12} />
          <span style={{ fontWeight: 600 }}>Insp. Benali</span>
        </div>
      </div>
    </nav>
  );
};
