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
  Eye,
  EyeOff,
  Search,
  Tag,
  Upload,
} from 'lucide-react';
import { getEdgeCategory, EDGE_CATEGORY_LABELS, type EdgeCategory } from '../../i18n/phrases/relations';
import { computeTabScopedGraph } from '../../utils/tabScope';

export type ActiveViewMode = 'graph' | 'map' | 'timeline' | 'table' | 'audit';

interface ToolbarProps {
  activeView: ActiveViewMode;
  onChangeView: (mode: ActiveViewMode) => void;
  section?: 'header' | 'graph_subbar' | 'all';
  isSnaOpen?: boolean;
  onToggleSna?: () => void;
  onOpenExport?: () => void;
  onToggleImpactView: () => void;
  onRunRecommendedScenario?: () => void;
  onImportFiles?: (files: FileList) => void;
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
  section = 'all',
  onOpenExport,
  onToggleImpactView,
  onRunRecommendedScenario,
  onImportFiles,
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
    edges,
    activeLayers,
    tabs,
    activeTabId,
    totalCaseNodes,
    isLiveSimulationActive,
    toggleLiveSimulation,
    graphCustomization,
    setGraphCustomization,
    resetGraphCustomization,
    visibleNodeLabelTypes,
    forcedVisibleNodeLabelIds,
    forcedHiddenNodeLabelIds,
    edgeLabelMode,
    edgeLabelConnectedNodeTypes,
    hiddenEdgeCategories,
    toggleVisibleNodeLabelType,
    setNodeLabelPreset,
    toggleForcedNodeLabelId,
    setEdgeLabelMode,
    toggleEdgeLabelConnectedNodeType,
    toggleHiddenEdgeCategory,
    isPersonOnlyGraph,
    expandedHiddenNodeIds,
    togglePersonOnlyGraph,
    setPersonOnlyGraph,
    viewport,
    setViewport,
  } = useGraphStore();
  const { tr } = useI18n();

  const activeTab = React.useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );

  const { baseNodes, scopedNodes, scopedEdges } = React.useMemo(
    () => computeTabScopedGraph(nodes, edges, activeTab, activeLayers, isImpactView),
    [nodes, edges, activeTab, activeLayers, isImpactView]
  );

  const tabTotalCount =
    activeTab?.kind === 'actor_sphere'
      ? baseNodes.length
      : totalCaseNodes || baseNodes.length;

  const [isDisplayPopoverOpen, setIsDisplayPopoverOpen] = useState(false);
  const [displayTab, setDisplayTab] = useState<'style' | 'nodes' | 'edges'>('style');
  const [nodeSearchTerm, setNodeSearchTerm] = useState('');
  const [popoverRect, setPopoverRect] = useState<{ top: number; left: number; maxHeight: number } | null>(null);
  const displayPopoverRef = useRef<HTMLDivElement>(null);
  const displayTriggerRef = useRef<HTMLButtonElement>(null);
  const rawFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const updatePopoverPosition = () => {
      if (typeof window === 'undefined' || !displayTriggerRef.current) return;
      const rect = displayTriggerRef.current.getBoundingClientRect();
      const popW = Math.min(404, window.innerWidth - 24);
      const isRtl = document.documentElement.dir === 'rtl';
      const preferredLeft = isRtl ? rect.right - popW : rect.left;
      const clampedLeft = Math.round(Math.min(Math.max(preferredLeft, 12), window.innerWidth - popW - 12));
      const top = Math.round(Math.min(rect.bottom + 6, Math.max(12, window.innerHeight - 260)));
      const maxHeight = Math.max(240, window.innerHeight - top - 16);
      setPopoverRect({ top, left: clampedLeft, maxHeight });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (displayPopoverRef.current && !displayPopoverRef.current.contains(e.target as Node)) {
        setIsDisplayPopoverOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDisplayPopoverOpen(false);
      }
    };
    if (isDisplayPopoverOpen) {
      updatePopoverPosition();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', updatePopoverPosition);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePopoverPosition);
    };
  }, [isDisplayPopoverOpen]);

  // Compute edge count per category for visibility panel (scoped to active tab)
  const countPerEdgeCategory = React.useMemo(() => {
    const counts: Record<EdgeCategory, number> = {
      telecom: 0,
      finance: 0,
      socmint: 0,
      legal: 0,
      general: 0,
    };
    scopedEdges.forEach((e) => {
      const cat = getEdgeCategory(e.type);
      if (counts[cat] !== undefined) counts[cat]++;
    });
    return counts;
  }, [scopedEdges]);

  // Filtered nodes and type summary for the visibility manager table (scoped to active tab)
  const { displayedNodesInTable, availableNodeTypes, visibleNodeLabelCount } = React.useMemo(() => {
    const typeSet = new Set<string>();
    let visCount = 0;
    scopedNodes.forEach((n) => {
      typeSet.add(n.type);
      const isPerson = n.type === 'personne';
      const statusJud = (n.properties?.status_judiciaire as string) || (n.properties?.role_judiciaire as string);
      const isKey = Boolean(
        statusJud?.toUpperCase().includes('MANDAT') || statusJud?.toUpperCase().includes('SUSPECT')
      );
      const isForcedVis = forcedVisibleNodeLabelIds.has(n.id);
      const isForcedHid = forcedHiddenNodeLabelIds.has(n.id);
      const isTypeVis = visibleNodeLabelTypes.has(n.type);
      if (isForcedVis || (!isForcedHid && (isPerson || isKey || isTypeVis))) {
        visCount++;
      }
    });

    const term = nodeSearchTerm.trim().toLowerCase();
    const filtered = !term
      ? scopedNodes
      : scopedNodes.filter(
          (n) =>
            n.label.toLowerCase().includes(term) ||
            n.type.toLowerCase().includes(term) ||
            (n.properties?.status_judiciaire as string)?.toLowerCase().includes(term)
        );

    return {
      displayedNodesInTable: filtered,
      availableNodeTypes: Array.from(typeSet),
      visibleNodeLabelCount: visCount,
    };
  }, [scopedNodes, nodeSearchTerm, forcedVisibleNodeLabelIds, forcedHiddenNodeLabelIds, visibleNodeLabelTypes]);

  const showHeader = section === 'all' || section === 'header';
  const showGraphSubbar = (section === 'all' || section === 'graph_subbar') && activeView === 'graph';

  return (
    <div className="canvas-sub-header-container">
      {showHeader && (
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

        {/* 2. Sub-Header Actions & Impact Badge (Scoped to Selected Tab) */}
        <div className="canvas-sub-header-actions">
          {/* Impact View Toggle Button */}
          <button
            type="button"
            className={`btn btn-ghost btn-sm toolbar-impact-btn ${isImpactView ? 'active' : ''}`}
            onClick={onToggleImpactView}
            title={tr("Basculer entre la vue d'ensemble et la vue restreinte de préjudice pour l'onglet actif")}
            aria-pressed={isImpactView}
            aria-label={tr('Vue Impact : {n} sur {total} nœuds', { n: scopedNodes.length, total: tabTotalCount })}
          >
            <Sparkles size={13} className={isImpactView ? 'text-accent' : 'text-muted'} />
            <span className="font-mono text-xs">
              {tr('Vue Impact : {n} / {total} nœuds', { n: scopedNodes.length, total: tabTotalCount })}
            </span>
          </button>

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
            <span className="play-scenario-label">{tr('Lancer le Scénario Recommandé')}</span>
            <span className="chip chip-neutral font-mono text-xs">Review-Run</span>
          </button>

          {/* Accessible Raw File Drop Alternative (No Drag-Only Feature) */}
          {onImportFiles && (
            <>
              <input
                ref={rawFileInputRef}
                type="file"
                multiple
                className="visually-hidden-file-input"
                aria-label={tr('Importer un fichier brut comme scellé numérique')}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onImportFiles(e.target.files);
                  }
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm toolbar-import-file-btn"
                onClick={() => rawFileInputRef.current?.click()}
                title={tr('Importer un ou plusieurs fichiers bruts (calcul SHA-256 pré-scellage)')}
                aria-label={tr('Importer fichier')}
              >
                <Upload size={13} aria-hidden="true" />
                <span>{tr('Importer fichier')}</span>
              </button>
            </>
          )}

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
      )}

      {/* 3. Contextual Graph Layout Sub-Bar (Visible strictly when in Graph view) */}
      {showGraphSubbar && (
        <div
          className={isDisplayPopoverOpen ? 'graph-sub-toolbar is-popover-open' : 'graph-sub-toolbar'}
          role="toolbar"
          aria-label={tr('Dispositions du graphe')}
        >
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

          {/* Unified Display & Visibility Popover */}
          <div className="graph-customization-wrapper" ref={displayPopoverRef}>
            <button
              ref={displayTriggerRef}
              type="button"
              className={`btn btn-xs graph-display-trigger ${isDisplayPopoverOpen ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setIsDisplayPopoverOpen((prev) => !prev)}
              title={tr("Personnaliser l'affichage et la visibilité du graphe")}
              aria-label={tr('Affichage & Visibilité')}
              aria-expanded={isDisplayPopoverOpen}
            >
              <SlidersHorizontal size={12} />
              <span>{tr('Affichage & Visibilité')}</span>
            </button>

            {isDisplayPopoverOpen && (
              <div
                className="graph-customization-popover graph-display-popover"
                role="dialog"
                aria-label={tr("Personnaliser l'affichage et la visibilité du graphe")}
                style={
                  popoverRect
                    ? {
                        top: `${popoverRect.top}px`,
                        left: `${popoverRect.left}px`,
                        maxHeight: `${popoverRect.maxHeight}px`,
                      }
                    : undefined
                }
              >
                {/* Header */}
                <div className="graph-display-popover-header">
                  <div className="graph-display-popover-title">
                    <SlidersHorizontal size={13} className="text-accent" />
                    <span>{tr('Affichage & Visibilité')}</span>
                  </div>
                  <button
                    type="button"
                    className="graph-display-close-btn"
                    onClick={() => setIsDisplayPopoverOpen(false)}
                    aria-label={tr('Fermer')}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* 3 Unified Tabs: Style & Tailles | Étiquettes Nœuds | Liaisons & Arêtes */}
                <div className="graph-display-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={displayTab === 'style'}
                    className={`graph-display-tab-btn ${displayTab === 'style' ? 'is-active' : ''}`}
                    onClick={() => setDisplayTab('style')}
                  >
                    <Palette size={12} />
                    <span>{tr('Style & Tailles')}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={displayTab === 'nodes'}
                    className={`graph-display-tab-btn ${displayTab === 'nodes' ? 'is-active' : ''}`}
                    onClick={() => setDisplayTab('nodes')}
                  >
                    <Tag size={12} />
                    <span>{tr('Étiquettes Nœuds')}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={displayTab === 'edges'}
                    className={`graph-display-tab-btn ${displayTab === 'edges' ? 'is-active' : ''}`}
                    onClick={() => setDisplayTab('edges')}
                  >
                    <Network size={12} />
                    <span>{tr('Liaisons & Arêtes')}</span>
                  </button>
                </div>

                <div className="graph-display-body">
                  {/* TAB 1: Style & Tailles */}
                  {displayTab === 'style' && (
                    <div className="graph-display-panel">
                      <div>
                        <div className="graph-display-section-label">
                          <Palette size={12} />
                          <span>{tr('Codage couleur des nœuds :')}</span>
                        </div>
                        <div className="graph-color-encoding-card">
                          <div className="graph-color-encoding-row">
                            <span className="graph-color-swatch-fill" aria-hidden="true" />
                            <div className="graph-color-encoding-text">
                              <span className="graph-color-encoding-key">{tr('Intérieur (remplissage)')}</span>
                              <span className="graph-color-encoding-val">{tr('8 Catégories Métiers')}</span>
                            </div>
                          </div>
                          <div className="graph-color-encoding-row">
                            <span className="graph-color-swatch-border" aria-hidden="true" />
                            <div className="graph-color-encoding-text">
                              <span className="graph-color-encoding-key">{tr('Bordure (contour)')}</span>
                              <span className="graph-color-encoding-val">{tr('5 Calques Judiciaires')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <label className="graph-display-checkbox-row">
                        <input
                          type="checkbox"
                          checked={graphCustomization.showNodePhotos}
                          onChange={(e) => setGraphCustomization({ showNodePhotos: e.target.checked })}
                        />
                        <ImageIcon size={12} className="text-accent" />
                        <span>{tr('Afficher les portraits / scellés sur les nœuds')}</span>
                      </label>

                      <div className="graph-display-divider" />

                      <div className="graph-display-sliders">
                        <div>
                          <div className="graph-display-slider-row">
                            <span>{tr('Échelle du graphe (Zoom) :')}</span>
                            <span className="font-mono">{Math.round((viewport?.zoom || 1) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            className="graph-display-range"
                            min={10}
                            max={1000}
                            step={5}
                            value={Math.min(Math.max(Math.round((viewport?.zoom || 1) * 100), 10), 1000)}
                            onChange={(e) => {
                              const nextZoom = Number((Number(e.target.value) / 100).toFixed(2));
                              const currentZoom = Math.max(viewport?.zoom || 1, 0.01);
                              const ratio = nextZoom / currentZoom;
                              const rect =
                                typeof document !== 'undefined'
                                  ? document.querySelector('.canvas-viewport-stage')?.getBoundingClientRect()
                                  : null;
                              const cx = rect ? rect.width / 2 : 400;
                              const cy = rect ? rect.height / 2 : 300;
                              const nextPanX = cx - (cx - (viewport?.panX || 0)) * ratio;
                              const nextPanY = cy - (cy - (viewport?.panY || 0)) * ratio;
                              setViewport(nextPanX, nextPanY, nextZoom);
                            }}
                          />
                        </div>

                        <div>
                          <div className="graph-display-slider-row">
                            <span>{tr('Diamètre des Nœuds :')}</span>
                            <span className="font-mono">{graphCustomization.nodeSize}px</span>
                          </div>
                          <input
                            type="range"
                            className="graph-display-range"
                            min={44}
                            max={96}
                            step={2}
                            value={graphCustomization.nodeSize}
                            onChange={(e) => setGraphCustomization({ nodeSize: Number(e.target.value) })}
                          />
                        </div>

                        <div>
                          <div className="graph-display-slider-row">
                            <span>{tr('Libellés des Nœuds :')}</span>
                            <span className="font-mono">{graphCustomization.nodeLabelSize}px</span>
                          </div>
                          <input
                            type="range"
                            className="graph-display-range"
                            min={10}
                            max={18}
                            step={0.5}
                            value={graphCustomization.nodeLabelSize}
                            onChange={(e) => setGraphCustomization({ nodeLabelSize: Number(e.target.value) })}
                          />
                        </div>

                        <div>
                          <div className="graph-display-slider-row">
                            <span>{tr('Épaisseur des Liens :')}</span>
                            <span className="font-mono">{graphCustomization.edgeThickness}px</span>
                          </div>
                          <input
                            type="range"
                            className="graph-display-range"
                            min={1}
                            max={6}
                            step={0.5}
                            value={graphCustomization.edgeThickness}
                            onChange={(e) => setGraphCustomization({ edgeThickness: Number(e.target.value) })}
                          />
                        </div>

                        <div>
                          <div className="graph-display-slider-row">
                            <span>{tr('Libellés des Liens :')}</span>
                            <span className="font-mono">{graphCustomization.edgeLabelSize}px</span>
                          </div>
                          <input
                            type="range"
                            className="graph-display-range"
                            min={9}
                            max={16}
                            step={1}
                            value={graphCustomization.edgeLabelSize}
                            onChange={(e) => setGraphCustomization({ edgeLabelSize: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="graph-display-footer">
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={resetGraphCustomization}
                        >
                          <RotateCcw size={11} />
                          <span>{tr('Réinitialiser par défaut')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Étiquettes Nœuds */}
                  {displayTab === 'nodes' && (
                    <div className="graph-display-panel">
                      <div className="graph-display-presets-header">
                        <div className="graph-display-presets">
                          <button
                            type="button"
                            className="btn btn-secondary btn-xs"
                            onClick={() => setNodeLabelPreset('personne_only')}
                            title={tr('Afficher uniquement les étiquettes des personnes')}
                          >
                            {tr('Personnes')}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setNodeLabelPreset('targets')}
                            title={tr('Afficher personnes et entités judiciaires majeures')}
                          >
                            {tr('Cibles')}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setNodeLabelPreset('all')}
                            title={tr('Afficher toutes les étiquettes')}
                          >
                            {tr('Tout')}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setNodeLabelPreset('none')}
                            title={tr('Masquer toutes les étiquettes (visible au survol)')}
                          >
                            {tr('Aucun')}
                          </button>
                        </div>
                        <span className="chip chip-neutral font-mono text-xs">
                          {tr('{n} / {total} visibles', { n: visibleNodeLabelCount, total: scopedNodes.length })}
                        </span>
                      </div>

                      {availableNodeTypes.length > 0 && (
                        <div>
                          <div className="graph-display-section-label">
                            <span>{tr('Visibilité par type :')}</span>
                          </div>
                          <div className="graph-display-type-chips">
                            {availableNodeTypes.map((typeKey) => {
                              const isActiveType = visibleNodeLabelTypes.has(typeKey);
                              return (
                                <button
                                  key={typeKey}
                                  type="button"
                                  className={`graph-display-type-chip font-mono ${isActiveType ? 'is-active' : ''}`}
                                  onClick={() => toggleVisibleNodeLabelType(typeKey)}
                                >
                                  {typeKey}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="graph-display-search-wrap">
                        <Search size={12} className="graph-display-search-icon" />
                        <input
                          type="text"
                          className="input input-xs graph-display-search-input"
                          value={nodeSearchTerm}
                          onChange={(e) => setNodeSearchTerm(e.target.value)}
                          placeholder={tr('Filtrer les entités...')}
                        />
                      </div>

                      <div className="graph-display-node-list">
                        {displayedNodesInTable.length === 0 ? (
                          <div className="graph-display-empty">{tr('Aucun nœud correspondant')}</div>
                        ) : (
                          displayedNodesInTable.map((n) => {
                            const isPerson = n.type === 'personne';
                            const statusJud = (n.properties?.status_judiciaire as string) || (n.properties?.role_judiciaire as string);
                            const isKey = Boolean(
                              statusJud?.toUpperCase().includes('MANDAT') || statusJud?.toUpperCase().includes('SUSPECT')
                            );
                            const isForcedVis = forcedVisibleNodeLabelIds.has(n.id);
                            const isForcedHid = forcedHiddenNodeLabelIds.has(n.id);
                            const isTypeVis = visibleNodeLabelTypes.has(n.type);
                            const isVisible = isForcedVis || (!isForcedHid && (isPerson || isKey || isTypeVis));

                            return (
                              <label key={n.id} className="graph-display-node-row">
                                <input
                                  type="checkbox"
                                  checked={isVisible}
                                  onChange={() => toggleForcedNodeLabelId(n.id)}
                                  title={isVisible ? tr('Masquer le libellé') : tr('Afficher le libellé')}
                                />
                                <span className={`graph-display-node-name ${isVisible ? 'is-visible' : ''}`} title={n.label}>
                                  {n.label}
                                </span>
                                {isPerson && (
                                  <span className="chip chip-neutral font-mono text-xs">{tr('Personne')}</span>
                                )}
                                <span className="font-mono text-xs text-muted">{n.type}</span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Liaisons & Arêtes */}
                  {displayTab === 'edges' && (
                    <div className="graph-display-panel">
                      <div>
                        <div className="graph-display-section-label">
                          <span>{tr('Mode étiquettes des relations :')}</span>
                        </div>
                        <div className="graph-display-edge-modes">
                          {(['hover', 'always', 'none'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              className={`graph-display-tab-btn ${edgeLabelMode === mode ? 'is-active' : ''}`}
                              onClick={() => {
                                setEdgeLabelMode(mode);
                                setGraphCustomization({ showEdgeLabels: mode === 'always' });
                              }}
                            >
                              {mode === 'hover' ? tr('Au survol') : mode === 'always' ? tr('Toujours') : tr('Masquées')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="graph-display-connected-box">
                        <div className="graph-display-section-label">
                          <span>{tr('Étiquettes des liens reliés aux types :')}</span>
                        </div>
                        <div className="graph-display-connected-grid">
                          {[
                            { key: 'personne', label: tr('Personnes') },
                            { key: 'telephone', label: tr('Téléphones') },
                            { key: 'compte_bancaire', label: tr('Comptes') },
                            { key: 'vehicule', label: tr('Véhicules') },
                          ].map(({ key, label }) => (
                            <label key={key} className="graph-display-checkbox-row">
                              <input
                                type="checkbox"
                                checked={edgeLabelConnectedNodeTypes.has(key)}
                                onChange={() => toggleEdgeLabelConnectedNodeType(key)}
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="graph-display-section-label">
                          <span>{tr('Familles de liaisons sur le canevas :')}</span>
                        </div>
                        <div className="graph-display-family-list">
                          {(['telecom', 'finance', 'socmint', 'legal', 'general'] as EdgeCategory[]).map((cat) => {
                            const def = EDGE_CATEGORY_LABELS[cat];
                            const isHidden = hiddenEdgeCategories.has(cat);
                            const count = countPerEdgeCategory[cat] || 0;
                            return (
                              <div key={cat} className={`graph-display-family-row ${isHidden ? 'is-hidden' : ''}`}>
                                <button
                                  type="button"
                                  className="graph-display-family-btn"
                                  onClick={() => toggleHiddenEdgeCategory(cat)}
                                >
                                  {isHidden ? <EyeOff size={12} className="text-muted" /> : <Eye size={12} className="text-secondary" />}
                                  <span className="graph-display-family-dot" style={{ backgroundColor: def.color }} />
                                  <span>{def.fr}</span>
                                </button>
                                <span className="font-mono text-xs text-muted">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Expand Full Graph / Person-Centric Projection Toggle Button (Next to Visibilité & Étiquettes) */}
          <div className="graph-sub-toolbar-group">
            <button
              type="button"
              className={`btn btn-xs ${!isPersonOnlyGraph ? 'btn-primary' : 'btn-secondary'}`}
              onClick={togglePersonOnlyGraph}
              title={
                isPersonOnlyGraph
                  ? tr('Déplier tout le graphe pour afficher l\'ensemble des entités et relations intermédiaires')
                  : tr('Replier le graphe pour afficher uniquement les Personnes et leurs relations directes ou médiées')
              }
            >
              <Network size={12} />
              <span>
                {isPersonOnlyGraph
                  ? tr('Déplier tout le graphe')
                  : tr('Vue Personnes (Replier)')}
              </span>
            </button>

            {isPersonOnlyGraph && expandedHiddenNodeIds.size > 0 && (
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => setPersonOnlyGraph(true)}
                title={tr('Refermer les {n} entités intermédiaires dépliées', {
                  n: expandedHiddenNodeIds.size,
                })}
              >
                <RotateCcw size={11} />
                <span>
                  {tr('Replier ({n})', { n: expandedHiddenNodeIds.size })}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
