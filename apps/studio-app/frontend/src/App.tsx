import { useEffect, useState, useCallback } from 'react';
import { Shield, Moon, Sun, Activity, Database } from 'lucide-react';
import { useI18n } from './context/I18nContext';
import { useTheme } from './context/ThemeContext';
import type { Locale } from './i18n/translations';
import { useGraphStore } from './store/useGraphStore';
import { GraphCanvasAdapter } from './components/canvas/GraphCanvasAdapter';
import { Toolbar, type ActiveViewMode } from './components/canvas/Toolbar';
import { ContextMenu } from './components/canvas/ContextMenu';
import { LayerChangeDialog } from './components/canvas/LayerChangeDialog';
import { AccessibleListView } from './components/canvas/AccessibleListView';
import { InspectorPanel } from './components/inspector/InspectorPanel';
import { LeftAccordion } from './components/toolbox/LeftAccordion';
import { SnaPanel } from './components/sna/SnaPanel';
import { MapView } from './components/views/MapView';
import { TimelineView } from './components/views/TimelineView';
import { AuditChainViewer } from './components/views/AuditChainViewer';
import { ExportDialog } from './components/views/ExportDialog';
import type { CaseItem, GraphResponse } from './types/graph';
import { API_BASE } from './config';

export function App() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const {
    nodes,
    edges,
    activeCase,
    activeLayers,
    selectedNodeId,
    selectedNodeIds,
    selectedEdgeId,
    viewport,
    isImpactView,
    isLoading,
    setActiveCase,
    setGraphData,
    mergeExpandedNodes,
    setLoading,
    setError,
    selectNode,
    selectEdge,
    clearSelection,
    setViewport,
    updateNodePosition,
    openContextMenu,
  } = useGraphStore();

  const [healthStatus, setHealthStatus] = useState<'ok' | 'degraded' | 'error'>('ok');
  const [activeView, setActiveView] = useState<ActiveViewMode>('graph');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isSnaOpen, setIsSnaOpen] = useState(false);

  // Load cases and initial graph
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    // 1. Health check
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((data) => {
        if (isSubscribed) setHealthStatus(data.status === 'ok' ? 'ok' : 'degraded');
      })
      .catch(() => {
        if (isSubscribed) setHealthStatus('error');
      });

    // 2. Fetch cases
    fetch(`${API_BASE}/api/v1/cases`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((cases: CaseItem[]) => {
        if (!isSubscribed) return;
        if (cases.length > 0) {
          const mainCase = cases.find((c) => c.code.includes('CANDY') || c.code.includes('ATHAR')) ?? cases[0] ?? null;
          if (mainCase) {
            setActiveCase(mainCase);

            // 3. Fetch initial full graph
            return fetch(`${API_BASE}/api/v1/cases/${mainCase.id}/graph?impact_only=false`)
              .then((r) => r.json())
              .then((graphRes: GraphResponse) => {
                if (isSubscribed) {
                  setGraphData(graphRes);
                }
              });
          }
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Erreur de chargement');
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [setActiveCase, setGraphData, setError, setLoading]);

  // Handle Impact View Toggle
  const handleToggleImpactView = useCallback(() => {
    if (!activeCase) return;
    const targetImpact = !isImpactView;
    setLoading(true);

    fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/graph?impact_only=${targetImpact}`)
      .then((r) => r.json())
      .then((graphRes: GraphResponse) => {
        setGraphData(graphRes);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Erreur de bascule Impact');
      });
  }, [activeCase, isImpactView, setGraphData, setError, setLoading]);

  // Handle 1-hop or 2-hop Expansion
  const handleExpand = useCallback(
    (hops: number) => {
      if (!activeCase || !selectedNodeId) return;
      setLoading(true);

      fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/graph/expand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node_ids: [selectedNodeId],
          hops: hops,
        }),
      })
        .then((r) => r.json())
        .then((expandedData: GraphResponse) => {
          mergeExpandedNodes(expandedData.nodes, expandedData.edges);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Erreur d'expansion");
          setLoading(false);
        });
    },
    [activeCase, selectedNodeId, mergeExpandedNodes, setError, setLoading]
  );

  // Handle Add Node at Center
  const handleAddNodeAtCenter = useCallback(
    (typeKey: string) => {
      if (!activeCase) return;
      const label = `Nouveau ${typeKey} ${nodes.length + 1}`;

      fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          type: typeKey,
          label: label,
          confidence: 0.85,
          provenance: 'INVESTIGATOR_MANUAL',
          properties: {},
        }),
      })
        .then((r) => r.json())
        .then((createdNode) => {
          mergeExpandedNodes([createdNode], []);
          selectNode(createdNode.id);
        })
        .catch((err) => {
          alert(`Erreur création: ${err.message}`);
        });
    },
    [activeCase, nodes.length, mergeExpandedNodes, selectNode]
  );

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Application Bar */}
      <header className="top-bar" style={{ flexShrink: 0, height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-4)', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Shield size={22} style={{ color: 'var(--color-accent-text)' }} />
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Athar
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-accent-text)',
            }}
          >
            v0.1 Forensic Studio
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* Health indicator */}
          <div
            title="État des services backend (PostgreSQL, Neo4j, Redis)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-xs)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              color: healthStatus === 'ok' ? 'var(--color-status-success)' : 'var(--color-status-danger)',
            }}
          >
            <Activity size={14} />
            <span>{healthStatus === 'ok' ? 'Services Opérationnels' : 'Dégradé'}</span>
          </div>

          {/* Language selector */}
          <select
            id="locale-select"
            className="select-control"
            aria-label={t.languageLabel}
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
            }}
          >
            <option value="fr">Français</option>
            <option value="ar">العربية (RTL)</option>
            <option value="en">English</option>
          </select>

          {/* Theme toggle */}
          <button
            type="button"
            className="btn-control"
            onClick={toggleTheme}
            aria-label={t.toggleThemeLabel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: '4px 8px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === 'dark' ? t.themeLight : t.themeDark}</span>
          </button>
        </div>
      </header>

      {/* Main 3-tier Workstation Workspace */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Left Toolbox and Layers Accordion */}
        <LeftAccordion onAddNodeAtCenter={handleAddNodeAtCenter} />

        {/* Center Canvas Area */}
        <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
          <Toolbar
            activeView={activeView}
            onChangeView={setActiveView}
            isSnaOpen={isSnaOpen}
            onToggleSna={() => setIsSnaOpen((prev) => !prev)}
            onOpenExport={() => setIsExportOpen(true)}
            onToggleImpactView={handleToggleImpactView}
          />

          {isSnaOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Panneau Social Network Analysis"
              style={{
                position: 'absolute',
                top: '56px',
                left: 'var(--space-4)',
                right: 'var(--space-4)',
                bottom: 'var(--space-4)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: 'var(--space-1) var(--space-2)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsSnaOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Fermer [Esc]
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SnaPanel onClose={() => setIsSnaOpen(false)} />
              </div>
            </div>
          )}

          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 'var(--space-12)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                zIndex: 50,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Activity size={14} className="animate-spin" />
              <span>Chargement du graphe forensique...</span>
            </div>
          )}

          {activeView === 'table' ? (
            <AccessibleListView />
          ) : activeView === 'map' ? (
            <MapView />
          ) : activeView === 'timeline' ? (
            <TimelineView />
          ) : activeView === 'audit' ? (
            <AuditChainViewer />
          ) : (
            <GraphCanvasAdapter
              nodes={nodes}
              edges={edges}
              activeLayers={activeLayers}
              selectedNodeId={selectedNodeId}
              selectedNodeIds={selectedNodeIds}
              selectedEdgeId={selectedEdgeId}
              viewport={viewport}
              onSelectNode={(id, isMulti) => {
                selectNode(id, isMulti);
                setIsInspectorOpen(true);
              }}
              onSelectEdge={(id) => {
                selectEdge(id);
                setIsInspectorOpen(true);
              }}
              onClearSelection={clearSelection}
              onNodeContextMenu={(e, nodeId) => {
                const clientX = 'clientX' in e ? e.clientX : 300;
                const clientY = 'clientY' in e ? e.clientY : 200;
                openContextMenu(clientX, clientY, nodeId);
                selectNode(nodeId, false);
              }}
              onNodeDragEnd={(nodeId, x, y) => updateNodePosition(nodeId, x, y, true)}
              onViewportChange={(panX, panY, zoom) => setViewport(panX, panY, zoom)}
            />
          )}

          {/* Context Menu Modal / Popover */}
          <ContextMenu
            onExpand={handleExpand}
            onInspect={() => setIsInspectorOpen(true)}
          />

          {/* Forensic Layer Change Modal */}
          {activeCase && <LayerChangeDialog caseId={activeCase.id} />}

          {/* Forensic Case Export Dialog (JSON / PDF) */}
          <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
        </div>

        {/* Right Inspector Panel */}
        {isInspectorOpen && (
          <InspectorPanel
            onExpand={handleExpand}
            onClose={() => setIsInspectorOpen(false)}
          />
        )}
      </main>

      {/* Forensic Audit Status Bar */}
      <footer
        className="status-bar"
        style={{
          flexShrink: 0,
          height: 'var(--statusbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-4)',
          backgroundColor: 'var(--color-bg-surface)',
          borderTop: '1px solid var(--color-border-default)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span>Affaire: {activeCase?.code || '—'}</span>
          <span>Nœuds affichés: {nodes.length}</span>
          <span>Relations: {edges.length}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Database size={12} style={{ color: 'var(--color-status-success)' }} />
            <span>TimescaleDB + Neo4j + Redis Intègres</span>
          </span>
          <span style={{ color: 'var(--color-layer-1-verified)' }}>Scellé ISO 27037 Actif</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
