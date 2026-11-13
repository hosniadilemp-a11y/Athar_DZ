import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer,
  Hand,
  Link2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  BrainCircuit,
  LayoutGrid,
  Target,
  Circle,
  Share2,
  GitFork,
  Grid,
  Check,
} from 'lucide-react';
import { useGraphStore, type GraphLayoutType } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';

interface CanvasFloatingPaletteProps {
  onToggleImpactView: () => void;
  onToggleSna?: () => void;
  isSnaOpen?: boolean;
}

interface LayoutItem {
  key: GraphLayoutType;
  labelFr: string;
  descFr: string;
  icon: React.ReactNode;
}

const LAYOUT_OPTIONS: LayoutItem[] = [
  {
    key: 'concentric',
    labelFr: 'Concentrique par Calque',
    descFr: 'Anneaux stratifiés selon les 5 calques de preuve',
    icon: <Target size={13} />,
  },
  {
    key: 'force',
    labelFr: 'Organique (Forces)',
    descFr: 'Regroupement physique par connexions et clusters',
    icon: <Share2 size={13} />,
  },
  {
    key: 'circular',
    labelFr: 'Circulaire Global',
    descFr: 'Disposition orbitale régulière sur grand cercle',
    icon: <Circle size={13} />,
  },
  {
    key: 'hierarchical',
    labelFr: 'Hiérarchique',
    descFr: 'Arborescence par niveau (Territoire -> Cibles -> Flux)',
    icon: <GitFork size={13} />,
  },
  {
    key: 'grid',
    labelFr: 'Grille Compacte',
    descFr: 'Matrice ordonnée par type et statut de scellé',
    icon: <Grid size={13} />,
  },
];

export const CanvasFloatingPalette: React.FC<CanvasFloatingPaletteProps> = ({
  onToggleImpactView,
  onToggleSna,
  isSnaOpen = false,
}) => {
  const { tr } = useI18n();
  const {
    zoomBy,
    resetViewport,
    isLinkMode,
    setLinkMode,
    isImpactView,
    nodes,
    totalCaseNodes,
    activeLayout,
    applyLayout,
  } = useGraphStore();

  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLayoutMenuOpen(false);
      }
    };
    if (isLayoutMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLayoutMenuOpen]);

  const activeLayoutItem = LAYOUT_OPTIONS.find((l) => l.key === activeLayout);
  const activeLayoutLabel = activeLayoutItem ? tr(activeLayoutItem.labelFr) : activeLayout;

  return (
    <nav
      className="canvas-floating-palette"
      role="toolbar"
      aria-label={tr('Outils de navigation et manipulation du canevas')}
    >
      {/* Pointer / Selection */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm ${!isLinkMode ? 'active' : ''}`}
        onClick={() => setLinkMode(false)}
        aria-label={tr('Mode Sélection (Pointeur)')}
        title={tr('Mode Sélection (Pointeur) [V]')}
      >
        <MousePointer size={14} />
      </button>

      {/* Pan / Move */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => resetViewport()}
        aria-label={tr('Déplacer le canevas (Pan)')}
        title={tr('Déplacer le canevas (Glisser avec clic gauche) [H]')}
      >
        <Hand size={14} />
      </button>

      {/* Link Mode */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm ${isLinkMode ? 'active text-accent' : ''}`}
        onClick={() => setLinkMode(!isLinkMode)}
        aria-pressed={isLinkMode}
        aria-label={tr('Mode Création de Liaison')}
        title={tr('Mode Création de Liaison (Relier 2 nœuds) [L]')}
      >
        <Link2 size={14} />
      </button>

      <div className="palette-divider" role="separator" />

      {/* Graph Layout Selector Trigger */}
      <div className="palette-layout-wrapper" ref={dropdownRef}>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${isLayoutMenuOpen ? 'active' : ''}`}
          onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
          aria-haspopup="true"
          aria-expanded={isLayoutMenuOpen}
          aria-label={tr('Choisir la disposition du graphe')}
          title={tr('Changer la disposition du graphe (Actif : {layout})', { layout: activeLayoutLabel })}
        >
          <LayoutGrid size={14} className="text-accent" />
        </button>

        {isLayoutMenuOpen && (
          <div className="palette-layout-dropdown" role="menu" aria-label={tr('Dispositions du graphe')}>
            <div className="palette-layout-header">
              <span>{tr('Disposition du Graphe')}</span>
            </div>
            {LAYOUT_OPTIONS.map((opt) => {
              const isCurrent = activeLayout === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  className={`palette-layout-item ${isCurrent ? 'active' : ''}`}
                  role="menuitem"
                  onClick={() => {
                    applyLayout(opt.key);
                    setIsLayoutMenuOpen(false);
                  }}
                >
                  <span className="palette-layout-icon">{opt.icon}</span>
                  <div className="palette-layout-text">
                    <span className="palette-layout-title">{tr(opt.labelFr)}</span>
                    <span className="palette-layout-desc">{tr(opt.descFr)}</span>
                  </div>
                  {isCurrent && <Check size={12} className="text-accent" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="palette-divider" role="separator" />

      {/* Zoom In */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => zoomBy(1.2)}
        aria-label={tr('Zoom avant')}
        title={tr('Zoom avant (+)')}
      >
        <ZoomIn size={14} />
      </button>

      {/* Zoom Out */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => zoomBy(0.8)}
        aria-label={tr('Zoom arrière')}
        title={tr('Zoom arrière (-)')}
      >
        <ZoomOut size={14} />
      </button>

      {/* Fit / Reset */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => resetViewport()}
        aria-label={tr('Ajuster la vue (Centrer)')}
        title={tr('Ajuster la vue (Centrer) [0]')}
      >
        <Maximize2 size={14} />
      </button>

      <div className="palette-divider" role="separator" />

      {/* Impact View Toggle */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm palette-chip-btn ${isImpactView ? 'active' : ''}`}
        onClick={onToggleImpactView}
        aria-pressed={isImpactView}
        aria-label={tr('Vue Impact : {n} sur {total} nœuds', { n: nodes.length, total: totalCaseNodes || 100 })}
        title={tr('Basculer entre la vue d\'ensemble (100 nœuds) et la vue restreinte de préjudice (35 nœuds)')}
      >
        <Sparkles size={14} className={isImpactView ? 'text-accent' : 'text-muted'} />
        <span className="font-mono text-xs">
          {nodes.length}/{totalCaseNodes || 100}
        </span>
      </button>

      {/* SNA Launcher */}
      {onToggleSna && (
        <button
          type="button"
          className={`btn btn-ghost btn-sm palette-chip-btn ${isSnaOpen ? 'active' : ''}`}
          onClick={onToggleSna}
          aria-pressed={isSnaOpen}
          aria-label={tr('Analyse Réseau SNA (16 algorithmes graphiques)')}
          title={tr('Ouvrir le panneau d\'analyse de centralité et détection de communautés (SNA)')}
        >
          <BrainCircuit size={14} className={isSnaOpen ? 'text-accent' : 'text-muted'} />
          <span className="text-xs">SNA</span>
        </button>
      )}
    </nav>
  );
};
