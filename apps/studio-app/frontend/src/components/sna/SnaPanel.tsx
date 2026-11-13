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
  Sparkles,
  Link2,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

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

// Judicial/Operational Mapping for Non-CS Investigators
const JUDICIAL_ALGO_META: Record<
  string,
  { titleFr: string; titleAr: string; titleEn: string; descFr: string; roleLabelFr: string }
> = {
  betweenness: {
    titleFr: 'Pivots & Intermédiaires Clés',
    titleAr: 'الوسطاء والمحاور الرئيسية',
    titleEn: 'Key Pivots & Brokers',
    descFr: 'Identifie les coordinateurs indispensables reliant des cellules ou branches distinctes du réseau.',
    roleLabelFr: 'Indice de passerelle',
  },
  pagerank: {
    titleFr: 'Têtes de Réseau & Commanditaires',
    titleAr: 'رؤوس الشبكة والآمرون',
    titleEn: 'Network Leaders & Kingpins',
    descFr: 'Dégage la hiérarchie d’autorité et les donneurs d’ordres les plus influents du dossier.',
    roleLabelFr: 'Rang d’autorité',
  },
  personalized_pagerank: {
    titleFr: 'Entourage Direct d’une Cible',
    titleAr: 'الدائرة المقربة للهدف',
    titleEn: 'Target Close Circle',
    descFr: 'Mesure la proximité criminelle et les relais directs gravitant autour d’un suspect pivot désigné.',
    roleLabelFr: 'Proximité cible',
  },
  degree_centrality: {
    titleFr: 'Volume Global de Contacts',
    titleAr: 'حجم الاتصالات الإجمالي',
    titleEn: 'Total Contact Volume',
    descFr: 'Repère les entités concentrant le plus d’interactions directes (télécoms, transactions ou physiques).',
    roleLabelFr: 'Nombre de liens',
  },
  closeness_eigenvector: {
    titleFr: 'Rapidité d’Alerte & Influence',
    titleAr: 'سرعة الإنذار والتأثير',
    titleEn: 'Alert Speed & Network Reach',
    descFr: 'Détecte les acteurs capables de propager une consigne ou d’alerter l’ensemble de l’organisation.',
    roleLabelFr: 'Accessibilité globale',
  },
  louvain: {
    titleFr: 'Cartographie des Cellules & Clans',
    titleAr: 'تفكيك الخلايا والعصابات',
    titleEn: 'Clans & Gangs Detection',
    descFr: 'Isole automatiquement les sous-groupes conspiratifs ou équipes opérationnelles étanches.',
    roleLabelFr: 'Cellule assignée',
  },
  label_propagation: {
    titleFr: 'Propagation de la Suspicion',
    titleAr: 'انتشار الشبهة',
    titleEn: 'Suspicion Contagion',
    descFr: 'Diffuse le niveau d’alerte des suspects avérés vers les cibles secondaires fréquentes.',
    roleLabelFr: 'Niveau de suspicion',
  },
  k_core: {
    titleFr: 'Noyau Dur Criminel (Cœur de Réseau)',
    titleAr: 'النواة الصلبة للشبكة',
    titleEn: 'Core Criminal Network',
    descFr: 'Élimine les exécutants périphériques pour ne conserver que la structure de direction compacte.',
    roleLabelFr: 'Profondeur de noyau',
  },
  articulation_points: {
    titleFr: 'Points de Rupture & Goulots',
    titleAr: 'نقاط الكسر وعنق الزجاجة',
    titleEn: 'Vulnerability & Break Points',
    descFr: 'Met en évidence les cibles dont l’interpellation isole ou scinde définitivement le réseau criminel.',
    roleLabelFr: 'Point névralgique',
  },
  shortest_path_dijkstra: {
    titleFr: 'Chaîne de Liaison Directe',
    titleAr: 'سلسلة الاتصال المباشرة',
    titleEn: 'Direct Connection Chain',
    descFr: 'Reconstitue la filière d’intermédiaires la plus courte reliant deux cibles sous enquête.',
    roleLabelFr: 'Distance / Échelons',
  },
  jaccard: {
    titleFr: 'Détection de Complices Probables',
    titleAr: 'كشف الشركاء المحتملين',
    titleEn: 'Probable Accomplices',
    descFr: 'Propose des liaisons criminelles probables entre cibles partageant des contacts identiques.',
    roleLabelFr: 'Indice de complicité',
  },
  adamic_adar: {
    titleFr: 'Canaux Clandestins Partagés',
    titleAr: 'قنوات التواصل المشتركة النادرة',
    titleEn: 'Shared Rare Channels',
    descFr: 'Pondère les présomptions de complicité par la rareté et la discrétion des relais communs.',
    roleLabelFr: 'Score de discrétion',
  },
  node_classification: {
    titleFr: 'Profilage par Rôle Judiciaire',
    titleAr: 'تصنيف الأدوار القضائية',
    titleEn: 'Judicial Role Profiling',
    descFr: 'Catégorise les suspects selon leur comportement criminel (Mule financière, Donneur d’ordre, Guetteur).',
    roleLabelFr: 'Rôle détecté',
  },
  threshold_expand: {
    titleFr: 'Filtrage par Seuil de Preuve',
    titleAr: 'التصفية حسب درجة الإثبات',
    titleEn: 'Evidence Threshold Filtering',
    descFr: 'Sélectionne uniquement les éléments attestés par un degré de confiance probatoire suffisant.',
    roleLabelFr: 'Certitude probatoire',
  },
  temporal_subgraph: {
    titleFr: 'Séquence Chronologique des Faits',
    titleAr: 'التسلسل الزمني للوقائع',
    titleEn: 'Temporal Incident Window',
    descFr: 'Restreint les liaisons aux actes commis dans la fenêtre temporelle ordonnée par le magistrat.',
    roleLabelFr: 'Période active',
  },
  activity_sector: {
    titleFr: 'Canaux Opérationnels & Financiers',
    titleAr: 'القنوات المالية والعملياتية',
    titleEn: 'Operational & Financial Channels',
    descFr: 'Distingue les flux bancaires, les bornages téléphoniques, les adresses crypto et le terrain.',
    roleLabelFr: 'Secteur vecteur',
  },
};

const JUDICIAL_CATEGORIES: Record<string, { labelFr: string; labelAr: string; labelEn: string }> = {
  centrality: {
    labelFr: 'Rôles & Cibles Clés (Centralité)',
    labelAr: 'الأدوار والأهداف المحورية',
    labelEn: 'Key Roles & Target Centrality',
  },
  community: {
    labelFr: 'Cellules & Clans Détectés',
    labelAr: 'الخلايا والعصابات المستقلة',
    labelEn: 'Cells & Gangs Detection',
  },
  topology: {
    labelFr: 'Points de Vulnérabilité du Réseau',
    labelAr: 'نقاط هشاشة الشبكة',
    labelEn: 'Network Vulnerabilities',
  },
  link_prediction: {
    labelFr: 'Liaisons Suspectes Non Documentées',
    labelAr: 'الروابط المشبوهة الخفية',
    labelEn: 'Undocumented Suspicious Links',
  },
  classification: {
    labelFr: 'Typologie & Profilage des Rôles',
    labelAr: 'تصنيف وتوصيف الأدوار',
    labelEn: 'Role Profiling & Typology',
  },
  filtering: {
    labelFr: 'Filtrage Probatoire & Temporel',
    labelAr: 'التصفية الإثباتية والزمنية',
    labelEn: 'Evidentiary & Temporal Filtering',
  },
  spatial: {
    labelFr: 'Canaux Géographiques & Télécoms',
    labelAr: 'القنوات الجغرافية والاتصالات',
    labelEn: 'Geographic & Telecom Channels',
  },
};

export const SnaPanel: React.FC<SnaPanelProps> = () => {
  const { activeCase, selectedNodeId, selectNode, nodes } = useGraphStore();
  const { locale, tr } = useI18n();
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
  const meta = JUDICIAL_ALGO_META[selectedAlgoKey] || {
    titleFr: activeAlgo?.label_fr || selectedAlgoKey,
    titleAr: activeAlgo?.label_ar || selectedAlgoKey,
    titleEn: activeAlgo?.label_en || selectedAlgoKey,
    descFr: activeAlgo?.description_fr || '',
    roleLabelFr: 'Score',
  };

  const getAlgoTitle = (key: string, fallback: string) => {
    const item = JUDICIAL_ALGO_META[key];
    if (!item) return fallback;
    if (locale === 'ar') return item.titleAr;
    if (locale === 'en') return item.titleEn;
    return item.titleFr;
  };

  const getCategoryTitle = (catKey: string) => {
    const cat = JUDICIAL_CATEGORIES[catKey];
    if (!cat) return catKey;
    if (locale === 'ar') return cat.labelAr;
    if (locale === 'en') return cat.labelEn;
    return cat.labelFr;
  };

  // Initialize default params when algorithm changes
  useEffect(() => {
    if (!activeAlgo) return;
    const defaults: Record<string, unknown> = {};
    activeAlgo.params.forEach((p) => {
      defaults[p.name] = p.default;
    });
    // Auto-fill selectedNodeId for target-based algorithms if available
    if ((activeAlgo.key === 'personalized_pagerank' || activeAlgo.key === 'shortest_path_dijkstra') && selectedNodeId) {
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

  // Render metric values cleanly without raw JSON
  const renderMetricValue = (val: unknown) => {
    if (val === null || val === undefined) return <span className="text-muted">-</span>;

    if (typeof val === 'number') {
      // Percentage or clean score
      if (val >= 0 && val <= 1) {
        return (
          <span className="chip chip-neutral font-mono" style={{ fontSize: 'var(--text-xs)' }}>
            {Math.round(val * 100)}%
          </span>
        );
      }
      return <span className="font-mono font-bold text-accent">{val.toLocaleString()}</span>;
    }

    if (typeof val === 'string' || typeof val === 'boolean') {
      return (
        <span className="chip chip-neutral" style={{ fontSize: 'var(--text-xs)' }}>
          {String(val)}
        </span>
      );
    }

    if (typeof val === 'object') {
      // Deconstruct object into readable chips instead of JSON.stringify
      const entries = Object.entries(val as Record<string, unknown>);
      return (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {entries.map(([k, v]) => {
            const labelClean = k.replace(/_/g, ' ');
            const valClean = typeof v === 'number' && v <= 1 && v >= 0 ? `${Math.round(v * 100)}%` : String(v);
            return (
              <span
                key={k}
                className="chip chip-neutral"
                style={{ fontSize: '11px', padding: '1px 5px', textTransform: 'capitalize' }}
              >
                <strong>{labelClean} :</strong> {valClean}
              </span>
            );
          })}
        </div>
      );
    }

    return <span>{String(val)}</span>;
  };

  return (
    <div
      role="region"
      aria-label="Analyses Forensiques des Réseaux Criminels"
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
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <BrainCircuit size={18} style={{ color: 'var(--color-accent-text)' }} />
        <span style={{ fontWeight: 600 }}>
          {locale === 'ar'
            ? 'التحليل الجنائي للشبكات الإجرامية (16 أداة تحقيق)'
            : 'Analyses Forensiques des Réseaux Criminels (16 Outils)'}
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left List of Algorithms grouped by judicial category */}
        <div
          style={{
            width: '260px',
            borderRight: '1px solid var(--color-border-subtle)',
            overflowY: 'auto',
            padding: 'var(--space-2)',
          }}
        >
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
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {expandedCategories[catKey] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span>
                  {getCategoryTitle(catKey)} ({algos.length})
                </span>
              </button>

              {expandedCategories[catKey] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  {algos.map((algo) => {
                    const isSelected = selectedAlgoKey === algo.key;
                    const algoTitle = getAlgoTitle(algo.key, algo.label_fr);
                    return (
                      <button
                        key={algo.key}
                        type="button"
                        onClick={() => setSelectedAlgoKey(algo.key)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--color-accent-primary)' : 'transparent',
                          color: isSelected ? 'var(--color-text-on-accent)' : 'var(--color-text-secondary)',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        <span style={{ fontWeight: isSelected ? 600 : 500 }}>{algoTitle}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Details & Execution */}
        <div
          style={{
            flex: 1,
            padding: 'var(--space-4)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          {activeAlgo && (
            <>
              {/* Method Card */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 600 }}>
                    {getAlgoTitle(activeAlgo.key, activeAlgo.label_fr)}
                  </h3>
                  <span className="chip chip-neutral font-mono text-xs">
                    {activeAlgo.key}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 'var(--space-2) 0 0', lineHeight: 1.5 }}>
                  {meta.descFr || activeAlgo.description_fr}
                </p>
              </div>

              {/* Dynamic Parameter Inputs (Investigator Friendly) */}
              {activeAlgo.params.length > 0 && (
                <div
                  style={{
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    {tr("PARAMÈTRES D'EXÉCUTION")}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {activeAlgo.params.map((p) => {
                      const isNodeSelector = p.name.includes('node_id') || p.type === 'uuid';
                      return (
                        <div key={p.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
                            <span style={{ fontWeight: 500 }}>{p.description_fr}</span>
                            {!isNodeSelector && (
                              <span style={{ fontFamily: 'var(--font-mono)' }}>
                                {String(paramValues[p.name] ?? '')}
                              </span>
                            )}
                          </div>

                          {/* Node Selector: Dropdown of actual entities instead of typing UUID */}
                          {isNodeSelector ? (
                            <select
                              value={String(paramValues[p.name] ?? '')}
                              onChange={(e) => setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                              style={{
                                padding: '6px 8px',
                                fontSize: '12px',
                                backgroundColor: 'var(--color-bg-canvas)',
                                border: '1px solid var(--color-border-default)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              <option value="">-- Choisir une entité du dossier --</option>
                              {nodes.map((n) => (
                                <option key={n.id} value={n.id}>
                                  {n.label} ({n.type})
                                </option>
                              ))}
                            </select>
                          ) : p.type === 'float' ? (
                            <input
                              type="range"
                              min={p.min_val ?? 0}
                              max={p.max_val ?? 1}
                              step={0.05}
                              value={Number(paramValues[p.name] ?? p.default)}
                              onChange={(e) =>
                                setParamValues((prev) => ({ ...prev, [p.name]: parseFloat(e.target.value) }))
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              value={String(paramValues[p.name] ?? '')}
                              onChange={(e) => setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
                              style={{
                                padding: '4px 8px',
                                fontSize: '12px',
                                backgroundColor: 'var(--color-bg-canvas)',
                                border: '1px solid var(--color-border-default)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--color-text-primary)',
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
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
                <span>{isRunning ? tr('Calcul en cours...') : tr("Lancer l'analyse")}</span>
              </button>

              {errorMsg && (
                <div
                  style={{
                    padding: 'var(--space-2)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--color-status-danger)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-status-danger)',
                    fontSize: '12px',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Results View */}
              {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {/* Judicial Disclaimer Alert */}
                  <div
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid var(--color-status-warning)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-status-warning)',
                      fontSize: 'var(--text-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span>{result.method_disclaimer}</span>
                  </div>

                  {/* Summary & Timing */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      Temps d&apos;exécution : {result.execution_time_ms} ms
                    </span>
                    <span>Entités analysées : {result.node_metrics.length}</span>
                  </div>

                  {/* Top Node Metrics Clean Table */}
                  {result.node_metrics.length > 0 && (
                    <div
                      style={{
                        maxHeight: '260px',
                        overflowY: 'auto',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr
                            style={{
                              borderBottom: '1px solid var(--color-border-subtle)',
                              backgroundColor: 'var(--color-bg-elevated)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <th style={{ padding: '6px 8px', textAlign: 'left' }}>Entité Cible</th>
                            <th style={{ padding: '6px 8px', textAlign: 'left' }}>Couche</th>
                            <th style={{ padding: '6px 8px', textAlign: 'right' }}>
                              {meta.roleLabelFr || 'Score'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.node_metrics.slice(0, 25).map((m) => {
                            const isSelected = selectedNodeId === m.node_id;
                            return (
                              <tr
                                key={m.node_id}
                                onClick={() => selectNode(m.node_id)}
                                style={{
                                  borderBottom: '1px solid var(--color-border-subtle)',
                                  backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
                                  cursor: 'pointer',
                                }}
                              >
                                <td style={{ padding: '6px 8px', fontWeight: 600 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sparkles size={12} className="text-accent" />
                                    <span>{m.node_label}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '6px 8px', color: 'var(--color-text-muted)' }}>
                                  <span className="chip chip-neutral" style={{ fontSize: '10px' }}>
                                    {m.layer}
                                  </span>
                                </td>
                                <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                                  {renderMetricValue(m.value)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Suggested Edges */}
                  {result.suggested_edges.length > 0 && (
                    <div
                      style={{
                        padding: 'var(--space-3)',
                        backgroundColor: 'var(--color-bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          color: 'var(--color-layer-4-hypothesis)',
                          marginBottom: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Link2 size={13} />
                        <span>
                          LIENS COMPLICES SUGGÉRÉS (HYPOTHÈSES : {result.suggested_edges.length})
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 'var(--text-xs)' }}>
                        {result.suggested_edges.slice(0, 6).map((e, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '4px',
                              backgroundColor: 'var(--color-bg-canvas)',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>
                              {e.source_label} ↔ {e.target_label}
                            </span>
                            <span className="chip chip-neutral font-mono" style={{ fontSize: '11px' }}>
                              Score : {Math.round(e.score * 100)}%
                            </span>
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
