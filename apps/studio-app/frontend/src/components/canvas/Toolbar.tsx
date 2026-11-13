import React from 'react';
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
  FileDown,
  Target,
  Share2,
  Circle,
  GitFork,
  Grid,
  Sparkles,
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
  } = useGraphStore();
  const { tr } = useI18n();

  return (
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

      {/* 2. Graph Layout Switcher (Visible when in Graph view) */}
      {activeView === 'graph' && (
        <div className="toolbar-layouts-bar" role="group" aria-label={tr('Dispositions du graphe') || 'Graph layouts'}>
          <span className="toolbar-layouts-label">{tr('Disposition :')}</span>
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
      )}

      {/* 3. Sub-Header Actions & Impact Badge */}
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
  );
};
