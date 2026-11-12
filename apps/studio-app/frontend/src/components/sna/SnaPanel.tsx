import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { API_BASE } from '../../config';
import {
  BrainCircuit,
  Play,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface SnaAlgorithmItem {
  key: string;
  label_fr: string;
  label_en: string;
  label_ar: string;
  description_fr: string;
  complexity: string;
  category: string;
  params: Array<{
    name: string;
    type: string;
    default: unknown;
    description_fr: string;
    min_val?: number;
    max_val?: number;
    required?: boolean;
  }>;
}

interface SnaResultData {
  algorithm_key: string;
  algorithm_name: string;
  category: string;
  execution_time_ms: number;
  parameters_used: Record<string, unknown>;
  method_disclaimer: string;
  summary: Record<string, unknown>;
  node_metrics: Array<{
    node_id: string;
    node_label: string;
    node_type: string;
    layer: string;
    value: unknown;
  }>;
  suggested_edges: Array<{
    source_id: string;
    target_id: string;
    source_label: string;
    target_label: string;
    type: string;
    layer: string;
    score: number;
    confidence: number;
  }>;
  subgraph_nodes: string[];
  subgraph_edges: string[];
  skipped_nodes_count: number;
}

interface SnaPanelProps {
  onClose?: () => void;
}

export const SnaPanel: React.FC<SnaPanelProps> = () => {
  const { activeCase, selectedNodeId, selectNode } = useGraphStore();
  const [algorithms, setAlgorithms] = useState<SnaAlgorithmItem[]>([]);
  const [selectedAlgoKey, setSelectedAlgoKey] = useState<string>('betweenness');
  const [paramValues, setParamValues] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SnaResultData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    centrality: true,
    community: true,
    topology: true,
    link_prediction: true,
    classification: true,
    filtering: true,
    spatial: true,
  });

  // Load algorithm registry from API
  useEffect(() => {
    if (!activeCase) return;
    fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/sna`)
      .then((r) => r.json())
      .then((data: SnaAlgorithmItem[]) => {
        setAlgorithms(data);
        if (data.length > 0 && !selectedAlgoKey) {
          setSelectedAlgoKey(data[0]?.key || 'betweenness');
        }
      })
      .catch(() => {});
  }, [activeCase, selectedAlgoKey]);

  const activeAlgo = algorithms.find((a) => a.key === selectedAlgoKey);

  // Initialize default params when algorithm changes
  useEffect(() => {
    if (!activeAlgo) return;
    const defaults: Record<string, unknown> = {};
    activeAlgo.params.forEach((p) => {
      defaults[p.name] = p.default;
    });
    // Auto-fill selectedNodeId for PPR if available
    if (activeAlgo.key === 'personalized_pagerank' && selectedNodeId) {
      defaults['source_node_id'] = selectedNodeId;
    }
    setParamValues(defaults);
    setResult(null);
    setErrorMsg(null);
  }, [activeAlgo, selectedNodeId]);

  const handleRunAlgorithm = async () => {
    if (!activeCase || !activeAlgo) return;
    setIsRunning(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/sna/${activeAlgo.key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: paramValues }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur exécution (${res.status})`);
      }

      const resData: SnaResultData = await res.json();
      setResult(resData);

      // If Betweenness or PageRank, dynamically update node focal radii in store
      if (activeAlgo.key === 'betweenness' || activeAlgo.key === 'pagerank') {
        const topIds = new Set(resData.node_metrics.slice(0, 15).map((m) => m.node_id));
        useGraphStore.setState((state) => ({
          nodes: state.nodes.map((n) => ({
            ...n,
            radius: topIds.has(n.id) ? 34 : 28,
          })),
        }));
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsRunning(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Group algorithms by category
  const categories: Record<string, SnaAlgorithmItem[]> = {};
  algorithms.forEach((algo) => {
    if (!categories[algo.category]) categories[algo.category] = [];
    categories[algo.category]?.push(algo);
  });

  return (
    <div
      role="region"
      aria-label="Panneau d'analyse de réseaux sociaux (SNA)"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-primary)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <BrainCircuit size={18} style={{ color: 'var(--color-accent-text)' }} />
        <span style={{ fontWeight: 600 }}>Social Network Analysis (16 Outils)</span>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left List of Algorithms */}
        <div style={{ width: '220px', borderRight: '1px solid var(--color-border-subtle)', overflowY: 'auto', padding: 'var(--space-2)' }}>
          {Object.entries(categories).map(([catKey, algos]) => (
            <div key={catKey} style={{ marginBottom: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => toggleCategory(catKey)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                {expandedCategories[catKey] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span>{catKey} ({algos.length})</span>
              </button>

              {expandedCategories[catKey] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  {algos.map((algo) => (
                    <button
                      key={algo.key}
                      type="button"
                      onClick={() => setSelectedAlgoKey(algo.key)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: selectedAlgoKey === algo.key ? 'var(--color-accent-primary)' : 'transparent',
                        color: selectedAlgoKey === algo.key ? 'var(--color-text-on-accent)' : 'var(--color-text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {algo.label_fr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Details & Execution */}
        <div style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activeAlgo && (
            <>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 600 }}>{activeAlgo.label_fr}</h3>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  Complexité : {activeAlgo.complexity} | Identifiant : {activeAlgo.key}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 'var(--space-2) 0' }}>
                  {activeAlgo.description_fr}
                </p>
              </div>

              {/* Dynamic Parameter Inputs */}
              {activeAlgo.params.length > 0 && (
                <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>PARAMÈTRES D&apos;EXÉCUTION</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {activeAlgo.params.map((p) => (
                      <div key={p.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span>{p.description_fr}</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{String(paramValues[p.name] ?? '')}</span>
                        </div>
                        {p.type === 'float' && (
                          <input
                            type="range"
                            min={p.min_val ?? 0}
                            max={p.max_val ?? 1}
                            step={0.05}
                            value={Number(paramValues[p.name] ?? p.default)}
                            onChange={(e) => setParamValues((prev) => ({ ...prev, [p.name]: parseFloat(e.target.value) }))}
                          />
                        )}
                        {p.type === 'uuid' && (
                          <input
                            type="text"
                            placeholder="UUID du nœud pivot..."
                            value={String(paramValues[p.name] ?? '')}
                            onChange={(e) => setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                            style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: 'var(--color-bg-canvas)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Run Action */}
              <button
                type="button"
                onClick={handleRunAlgorithm}
                disabled={isRunning}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  backgroundColor: 'var(--color-accent-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-on-accent)',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                }}
              >
                <Play size={16} />
                <span>{isRunning ? 'Calcul en cours...' : "Lancer l'analyse algorithmique"}</span>
              </button>

              {errorMsg && (
                <div style={{ padding: 'var(--space-2)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-status-danger)', borderRadius: 'var(--radius-sm)', color: 'var(--color-status-danger)', fontSize: '12px' }}>
                  {errorMsg}
                </div>
              )}

              {/* Results View */}
              {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {/* Judicial Disclaimer Alert */}
                  <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--color-status-warning)', borderRadius: 'var(--radius-sm)', color: 'var(--color-status-warning)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span>{result.method_disclaimer}</span>
                  </div>

                  {/* Summary & Timing */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      Temps d&apos;exécution : {result.execution_time_ms} ms
                    </span>
                    <span>Entités traitées : {result.node_metrics.length}</span>
                  </div>

                  {/* Top Node Metrics */}
                  {result.node_metrics.length > 0 && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>
                            <th style={{ padding: '4px 8px', textAlign: 'left' }}>Entité</th>
                            <th style={{ padding: '4px 8px', textAlign: 'left' }}>Type</th>
                            <th style={{ padding: '4px 8px', textAlign: 'right' }}>Score / Rôle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.node_metrics.slice(0, 20).map((m) => (
                            <tr
                              key={m.node_id}
                              onClick={() => selectNode(m.node_id)}
                              style={{ borderBottom: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}
                            >
                              <td style={{ padding: '4px 8px', fontWeight: 600 }}>{m.node_label}</td>
                              <td style={{ padding: '4px 8px', color: 'var(--color-text-muted)' }}>{m.node_type}</td>
                              <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                {typeof m.value === 'object' ? JSON.stringify(m.value) : String(m.value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Suggested Edges */}
                  {result.suggested_edges.length > 0 && (
                    <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-layer-4-hypothesis)', marginBottom: '4px' }}>
                        LIENS COLLABORATEURS SUGGÉRÉS (HYPOTHESIS : {result.suggested_edges.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                        {result.suggested_edges.slice(0, 5).map((e, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                            <span>{e.source_label} ↔ {e.target_label}</span>
                            <span>Score: {e.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
