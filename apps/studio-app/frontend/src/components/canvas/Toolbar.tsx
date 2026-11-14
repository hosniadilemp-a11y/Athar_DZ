import React, { useState, useRef, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import type { GraphLayoutType } from '../../utils/graphLayouts';
import { useI18n } from '../../context/I18nContext';
import {
  Network,
  Calendar,
  MapPin,
  Table,
  ShieldCheck,
  Undo2,
  Redo2,
  Play,
  Pause,
  FileDown,
  Target,
  Share2,
  Circle,
  GitFork,
  Grid,
  Sparkles,
  SlidersHorizontal,
  X,
  RotateCcw,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

export type ActiveViewMode = 'graph' | 'map' | 'timeline' | 'table' | 'audit';

interface ToolbarProps {
  activeView: ActiveViewMode;
  onChangeView: (mode: ActiveViewMode) => void;
  isSnaOpen?: boolean;
  onToggleSna?: () => void;
  onOpenExport?: () => void;
  onToggleImpactView: () => void;
  onRunRecommendedScenario?: () => void;
}

type LayoutOptionDef = {
  key: GraphLayoutType;
  labelFr: string;
  shortNameFr: string;
  tooltipFr: string;
  icon: React.ReactNode;
};

const LAYOUT_OPTIONS: LayoutOptionDef[] = [
  {
    key: 'concentric',
    labelFr: 'Concentrique par Calque',
    shortNameFr: 'Concentrique',
    tooltipFr: "Disposition Concentrique : Stratification en anneaux orbitaux par calque de preuve judiciaire (recommandé pour l'enquête)",
    icon: <Target size={13} />,
  },
  {
    key: 'force',
    labelFr: 'Organique (Forces)',
    shortNameFr: 'Organique',
    tooltipFr: 'Disposition Organique (Forces F-R) : Rapprochement physique des entités fortement connectées pour faire émerger les cellules',
    icon: <Share2 size={13} />,
  },
  {
    key: 'circular',
    labelFr: 'Circulaire Global',
    shortNameFr: 'Circulaire',
    tooltipFr: 'Disposition Circulaire : Placement équiangulaire sur un anneau unique pour analyser les flux transversaux',
    icon: <Circle size={13} />,
  },
  {
    key: 'hierarchical',
    labelFr: 'Hiérarchique',
    shortNameFr: 'Hiérarchique',
    tooltipFr: 'Disposition Hiérarchique : Arborescence par niveau de causalité (Territoire ➔ Cibles ➔ Vecteurs ➔ Flux)',
    icon: <GitFork size={13} />,
  },
  {
    key: 'grid',
    labelFr: 'Matrice en Grille',
    shortNameFr: 'Grille',
    tooltipFr: "Disposition en Grille : Alignement cartésien compact ordonné par calque de scellé pour l'inventaire méthodique",
    icon: <Grid size={13} />,
  },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeView,
  onChangeView,
  onOpenExport,
  onToggleImpactView,
  onRunRecommendedScenario,
}) => {
  const {
    undo,
    redo,
    undoStack,
    redoStack,
    activeLayout,
    applyLayout,
    isImpactView,
    nodes,
    totalCaseNodes,
    isLiveSimulationActive,
    toggleLiveSimulation,
    graphCustomization,
    setGraphCustomization,
    resetGraphCustomization,
  } = useGraphStore();
  const { tr } = useI18n();

  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsCustomizationOpen(false);
      }
    };
    if (isCustomizationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomizationOpen]);

  return (
    <div className="canvas-sub-header-container">
      <header className="canvas-sub-header" role="region" aria-label={tr('Sous-barre de sélection de vue et actions de canevas')}>
        {/* 1. Segmented View Switcher */}
        <div className="canvas-segmented-tabs" role="tablist" aria-label={tr('Vues analytiques')}>
          <button
            type="button"
            className={`canvas-segmented-btn ${activeView === 'graph' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeView === 'graph'}
            onClick={() => onChangeView('graph')}
            title={tr('Vue Graphe de Rapprochement [Alt+1]')}
          >
            <Network size={13} />
            <span>{tr('Graphe')}</span>
          </button>

          <button
            type="button"
            className={`canvas-segmented-btn ${activeView === 'map' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeView === 'map'}
            onClick={() => onChangeView('map')}
            title={tr('Vue Cartographie SIG (8 types géolocalisés sur le territoire algérien) [Alt+3]')}
          >
            <MapPin size={13} />
            <span>{tr('Carte SIG')}</span>
          </button>

          <button
            type="button"
            className={`canvas-segmented-btn ${activeView === 'timeline' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeView === 'timeline'}
            onClick={() => onChangeView('timeline')}
            title={tr('Vue Chronologie Temporelle des Faits [Alt+2]')}
          >
            <Calendar size={13} />
            <span>{tr('Chronologie')}</span>
          </button>

          <button
            type="button"
            className={`canvas-segmented-btn ${activeView === 'table' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeView === 'table'}
            onClick={() => onChangeView('table')}
            title={tr('Vue Tableau Accessible (WCAG AA) [Alt+4]')}
          >
            <Table size={13} />
            <span>{tr('Tableau')}</span>
          </button>

          <button
            type="button"
            className={`canvas-segmented-btn ${activeView === 'audit' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeView === 'audit'}
            onClick={() => onChangeView('audit')}
            title={tr("Vue Registre d'Audit Forensique ISO 27037 [Alt+5]")}
          >
            <ShieldCheck size={13} />
            <span>{tr("Registre d'Audit")}</span>
          </button>
        </div>

        {/* 2. Sub-Header Actions & Impact Badge */}
        <div className="canvas-sub-header-actions">
          {/* Impact View Toggle Button */}
          {activeView === 'graph' && (
            <button
              type="button"
              className={`btn btn-ghost btn-sm toolbar-impact-btn ${isImpactView ? 'active' : ''}`}
              onClick={onToggleImpactView}
              title={tr("Basculer entre la vue d'ensemble (100 nœuds) et la vue restreinte de préjudice (35 nœuds)")}
              aria-label={tr('Vue Impact : {n} sur {total} nœuds', { n: nodes.length, total: totalCaseNodes || 100 })}
            >
              <Sparkles size={13} className={isImpactView ? 'text-accent' : 'text-muted'} />
              <span className="font-mono text-xs">
                {tr('Vue Impact : {n} / {total} nœuds', { n: nodes.length, total: totalCaseNodes || 100 })}
              </span>
            </button>
          )}

          {/* Undo / Redo */}
          <div className="canvas-history-group" role="group" aria-label={tr('Historique des actions')}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={undo}
              disabled={undoStack.length === 0}
              title={tr('Annuler la dernière action ({n}) [Ctrl+Z]', { n: undoStack.length })}
              aria-label={tr('Annuler la dernière action')}
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={redo}
              disabled={redoStack.length === 0}
              title={tr("Rétablir l'action ({n}) [Ctrl+Y]", { n: redoStack.length })}
              aria-label={tr('Rétablir la dernière action')}
            >
              <Redo2 size={13} />
            </button>
          </div>

          {/* Recommended Playbook CTA (Review-Run) */}
          <button
            type="button"
            className="btn btn-secondary btn-sm play-scenario-btn"
            onClick={onRunRecommendedScenario}
            title={tr("Lancer le scénario d'enquête déterministe recommandé pour l'affaire en cours")}
            aria-label={tr('Lancer le Scénario Recommandé (Review-Run)')}
          >
            <Play size={13} className="text-accent" />
            <span>{tr('Lancer le Scénario Recommandé')}</span>
            <span className="chip chip-neutral font-mono text-xs">Review-Run</span>
          </button>

          {/* Case Export */}
          {onOpenExport && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onOpenExport}
              title={tr('Exporter le dossier judiciaire en PDF ou archive JSON conforme')}
              aria-label={tr('Exporter le Dossier Judiciaire')}
            >
              <FileDown size={13} />
              <span>{tr('Exporter')}</span>
            </button>
          )}
        </div>
      </header>

      {/* 3. Contextual Graph Layout Sub-Bar (Visible strictly when in Graph view) */}
      {activeView === 'graph' && (
        <div className="graph-sub-toolbar" role="toolbar" aria-label={tr('Dispositions du graphe')}>
          <div className="graph-sub-toolbar-group">
            <span className="graph-sub-toolbar-label">{tr('Dispositions :')}</span>
            <div className="toolbar-layouts-pills">
              {LAYOUT_OPTIONS.map((layout) => {
                const isCurrent = activeLayout === layout.key;
                return (
                  <button
                    key={layout.key}
                    type="button"
                    className={`toolbar-layout-pill ${isCurrent ? 'active' : ''}`}
                    onClick={() => applyLayout(layout.key)}
                    title={tr(layout.tooltipFr)}
                    aria-label={tr(layout.labelFr) || layout.labelFr}
                    aria-pressed={isCurrent}
                  >
                    <span className="toolbar-layout-icon">{layout.icon}</span>
                    <span className="toolbar-layout-pill-name">{tr(layout.shortNameFr)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="graph-sub-toolbar-separator" />

          {/* Live Force Physics Simulation Toggle */}
          <button
            type="button"
            className={`btn btn-xs graph-live-sim-btn ${isLiveSimulationActive ? 'active' : ''}`}
            onClick={toggleLiveSimulation}
            title={
              isLiveSimulationActive
                ? tr('Figer la simulation physique en direct')
                : tr('Activer la simulation organique des forces en temps réel')
            }
            aria-pressed={isLiveSimulationActive}
          >
            <span className={`graph-live-sim-dot ${isLiveSimulationActive ? 'pulse' : ''}`} />
            {isLiveSimulationActive ? <Pause size={12} /> : <Play size={12} />}
            <span>{isLiveSimulationActive ? tr('Simulation Active (Figer)') : tr('Simulation en Direct')}</span>
          </button>

          <div className="graph-sub-toolbar-separator" />

          {/* Graph Customization & Sliders Popover */}
          <div className="graph-customization-wrapper" ref={popoverRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={`btn btn-xs ${isCustomizationOpen ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setIsCustomizationOpen((prev) => !prev)}
              title={tr('Personnaliser le canevas : Tailles des nœuds, arêtes, libellés, photos et mode de coloration')}
              aria-label={tr('Personnaliser le canevas')}
              aria-expanded={isCustomizationOpen}
              style={{ gap: '5px', paddingInline: '8px' }}
            >
              <SlidersHorizontal size={12} />
              <span>{tr('Tailles & Affichage')}</span>
            </button>

            {isCustomizationOpen && (
              <div
                className="graph-customization-popover"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  insetInlineEnd: 0,
                  width: '320px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: 'var(--space-3)',
                  zIndex: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
                role="dialog"
                aria-label={tr('Panneau de personnalisation du graphe')}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '12px', color: 'var(--color-text-primary)' }}>
                    <SlidersHorizontal size={13} style={{ color: 'var(--color-accent-text)' }} />
                    <span>{tr('Personnalisation Visuelle')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomizationOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '2px' }}
                    aria-label="Fermer le panneau"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* 1. Mode de Coloration */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Palette size={11} />
                    <span>{tr('Mode de Coloration des Nœuds :')}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      className={`btn btn-xs ${graphCustomization.colorMode === 'category' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, fontSize: '10.5px' }}
                      onClick={() => setGraphCustomization({ colorMode: 'category' })}
                    >
                      {tr('8 Catégories Métiers')}
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs ${graphCustomization.colorMode === 'layer' ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, fontSize: '10.5px' }}
                      onClick={() => setGraphCustomization({ colorMode: 'layer' })}
                    >
                      {tr('5 Calques Judiciaires')}
                    </button>
                  </div>
                  <div style={{ fontSize: '9.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {tr('Note : La bordure respecte toujours le Calque de preuve')}
                  </div>
                </div>

                {/* 2. Photo Display Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: 'var(--color-text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={graphCustomization.showNodePhotos}
                    onChange={(e) => setGraphCustomization({ showNodePhotos: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ImageIcon size={12} style={{ color: 'var(--color-accent-text)' }} />
                    <span>{tr('Afficher les portraits / scellés sur les nœuds')}</span>
                  </div>
                </label>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)' }} />

                {/* 3. Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Node Size */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                      <span>{tr('Diamètre des Nœuds :')}</span>
                      <span className="font-mono">{graphCustomization.nodeSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={44}
                      max={96}
                      step={2}
                      value={graphCustomization.nodeSize}
                      onChange={(e) => setGraphCustomization({ nodeSize: Number(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)' }}
                    />
                  </div>

                  {/* Node Label Size */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                      <span>{tr('Libellés des Nœuds :')}</span>
                      <span className="font-mono">{graphCustomization.nodeLabelSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={18}
                      step={0.5}
                      value={graphCustomization.nodeLabelSize}
                      onChange={(e) => setGraphCustomization({ nodeLabelSize: Number(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)' }}
                    />
                  </div>

                  {/* Edge Thickness */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                      <span>{tr('Épaisseur des Liens :')}</span>
                      <span className="font-mono">{graphCustomization.edgeThickness}px</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={0.5}
                      value={graphCustomization.edgeThickness}
                      onChange={(e) => setGraphCustomization({ edgeThickness: Number(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)' }}
                    />
                  </div>

                  {/* Edge Label Size */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                      <span>{tr('Libellés des Liens :')}</span>
                      <span className="font-mono">{graphCustomization.edgeLabelSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={9}
                      max={16}
                      step={1}
                      value={graphCustomization.edgeLabelSize}
                      onChange={(e) => setGraphCustomization({ edgeLabelSize: Number(e.target.value) })}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)' }}
                    />
                  </div>

                  {/* Show Edge Labels Toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: 'var(--color-text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={graphCustomization.showEdgeLabels}
                      onChange={(e) => setGraphCustomization({ showEdgeLabels: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{tr('Afficher les libellés sur les liens')}</span>
                  </label>
                </div>

                {/* Footer / Reset */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={resetGraphCustomization}
                    style={{ gap: '4px', fontSize: '10.5px' }}
                  >
                    <RotateCcw size={11} />
                    <span>{tr('Réinitialiser par défaut')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
