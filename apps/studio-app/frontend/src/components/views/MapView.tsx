import React, { useState, useMemo, useCallback } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import type { GraphNode } from '../../types/graph';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Crosshair,
  Compass,
} from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

const LAYER_COLORS: Record<LayerId, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

// Bounding box for Algerian territory
const ALGERIA_BOUNDS = {
  minLon: -8.8,
  maxLon: 12.2,
  minLat: 18.8,
  maxLat: 37.3,
};

// Canonical polygon vertices for Algerian national borders
const ALGERIA_BORDER_GEO: [number, number][] = [
  // North Coastline: West to East
  [35.08, -2.21], // Marsa Ben M'hidi
  [35.10, -1.86], // Ghazaouet
  [35.30, -1.38], // Beni Saf
  [35.77, -0.79], // Cap Falcon / Oran
  [35.85, -0.31], // Arzew
  [35.93, 0.09],  // Mostaganem
  [36.51, 1.30],  // Tenes
  [36.60, 2.19],  // Cherchell
  [36.59, 2.44],  // Tipaza
  [36.77, 3.06],  // Alger
  [36.91, 3.91],  // Dellys
  [36.76, 5.08],  // Bejaia
  [36.82, 5.76],  // Jijel
  [37.01, 6.57],  // Collo
  [36.88, 6.91],  // Skikda
  [36.90, 7.77],  // Annaba
  [36.90, 8.44],  // El Kala / Cap Rosa
  // Tunisia Border
  [36.50, 8.40],
  [36.28, 8.35],
  [35.40, 8.30],
  [34.30, 8.10],
  [34.00, 8.30],
  [33.15, 8.80],
  [30.25, 9.60],  // Tripoint Tunisia-Libya-Algeria (Ghadames)
  // Libya Border
  [28.00, 9.80],
  [26.00, 9.60],
  [25.00, 10.20], // Ghat / Djanet border
  [23.50, 11.99], // Tripoint Libya-Niger-Algeria
  // Niger Border
  [21.50, 8.50],
  [19.57, 5.77],  // In Guezzam
  // Mali Border
  [19.95, 2.97],  // Tin Zaouatine
  [20.50, 1.50],
  [21.33, 0.95],  // Bordj Badji Mokhtar
  [23.00, -1.50],
  [25.00, -4.83], // Chenachane
  // Mauritania Border
  [25.80, -5.90],
  [27.30, -8.67], // Tripoint Mauritania-Western Sahara-Algeria
  // Western Sahara Border
  [27.67, -8.67], // Tindouf border
  // Morocco Border
  [28.50, -8.67],
  [29.50, -5.00],
  [30.50, -4.00],
  [31.60, -2.20], // Bechar border
  [32.10, -1.25], // Beni Ounif / Figuig
  [33.50, -1.50],
  [34.85, -1.85], // Maghnia / Oujda
  [35.08, -2.21], // Return to Marsa Ben M'hidi
];

// Major Algerian reference cities and wilaya hubs
const MAJOR_WILAYA_HUBS = [
  { name: 'Alger (16)', lat: 36.7538, lon: 3.0588, isCapitale: true },
  { name: 'Oran (31)', lat: 35.6987, lon: -0.6349 },
  { name: 'Constantine (25)', lat: 36.3650, lon: 6.6147 },
  { name: 'Annaba (23)', lat: 36.9000, lon: 7.7667 },
  { name: 'Blida (09)', lat: 36.4700, lon: 2.8300 },
  { name: 'Sétif (19)', lat: 36.1911, lon: 5.4137 },
  { name: 'Batna (05)', lat: 35.5559, lon: 6.1741 },
  { name: 'Tlemcen (13)', lat: 34.8783, lon: -1.3150 },
  { name: 'Mascara (29)', lat: 35.3964, lon: 0.1403 },
  { name: 'Ouargla (30)', lat: 31.9530, lon: 5.3340 },
  { name: 'Ghardaïa (47)', lat: 32.4909, lon: 3.6735 },
  { name: 'Béchar (08)', lat: 31.6167, lon: -2.2167 },
  { name: 'Tamanrasset (11)', lat: 22.7850, lon: 5.5228 },
];

export const MapView: React.FC = () => {
  const { t } = useI18n();
  const { nodes, edges, selectedNodeId, selectNode } = useGraphStore();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Tree panel state
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [treeSearch, setTreeSearch] = useState('');
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    root_algeria: true,
    'wilaya_16_Alger': true,
    'wilaya_31_Oran': true,
    'wilaya_09_Blida': true,
    'wilaya_25_Constantine': true,
    skipped_root: false,
  });

  const toggleBranch = (key: string) => {
    setExpandedBranches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllBranches = () => {
    const all: Record<string, boolean> = { root_algeria: true, skipped_root: true };
    nodes.forEach((n) => {
      const w = (n.properties?.wilaya as string) || 'Alger';
      all[`wilaya_${w}`] = true;
      all[`cat_${w}_${n.type}`] = true;
    });
    setExpandedBranches(all);
  };

  const collapseAllBranches = () => {
    setExpandedBranches({ root_algeria: false, skipped_root: false });
  };

  // Canvas dimensions
  const canvasWidth = 1100;
  const canvasHeight = 850;

  // Project geographic coordinates to SVG canvas space (Equirectangular)
  const projectGeo = useCallback((lat: number, lon: number, pad = 60) => {
    const availW = canvasWidth - pad * 2;
    const availH = canvasHeight - pad * 2;
    const lonSpan = ALGERIA_BOUNDS.maxLon - ALGERIA_BOUNDS.minLon;
    const latSpan = ALGERIA_BOUNDS.maxLat - ALGERIA_BOUNDS.minLat;

    const x = pad + ((lon - ALGERIA_BOUNDS.minLon) / lonSpan) * availW;
    const y = pad + ((ALGERIA_BOUNDS.maxLat - lat) / latSpan) * availH;
    return { x, y };
  }, [canvasWidth, canvasHeight]);

  // Separate GPS-valid and skipped nodes
  const { gpsNodes, skippedNodes } = useMemo(() => {
    const valid: GraphNode[] = [];
    const skipped: GraphNode[] = [];

    nodes.forEach((n) => {
      if (
        n.latitude !== null &&
        n.longitude !== null &&
        !isNaN(n.latitude) &&
        !isNaN(n.longitude) &&
        n.latitude >= -90 &&
        n.latitude <= 90 &&
        n.longitude >= -180 &&
        n.longitude <= 180
      ) {
        valid.push(n);
      } else {
        skipped.push(n);
      }
    });

    return { gpsNodes: valid, skippedNodes: skipped };
  }, [nodes]);

  // Node position map with overlap offset (radial fan for identical coordinates)
  const nodePositionMap = useMemo(() => {
    const coordGroups = new Map<string, GraphNode[]>();
    gpsNodes.forEach((node) => {
      const key = `${node.latitude!.toFixed(3)}_${node.longitude!.toFixed(3)}`;
      const list = coordGroups.get(key) || [];
      list.push(node);
      coordGroups.set(key, list);
    });

    const positions = new Map<string, { x: number; y: number }>();

    coordGroups.forEach((group) => {
      const first = group[0];
      if (!first || first.latitude === null || first.longitude === null) return;
      const baseLat = first.latitude;
      const baseLon = first.longitude;
      const basePos = projectGeo(baseLat, baseLon);

      if (group.length === 1) {
        positions.set(first.id, basePos);
      } else {
        // Distribute overlapping nodes radially around centroid
        group.forEach((node, idx) => {
          const angle = (idx / group.length) * 2 * Math.PI;
          const radius = 24 + Math.floor(idx / 8) * 16;
          positions.set(node.id, {
            x: basePos.x + Math.cos(angle) * radius,
            y: basePos.y + Math.sin(angle) * radius,
          });
        });
      }
    });

    return positions;
  }, [gpsNodes, projectGeo]);

  // Filter edges connecting two geolocated nodes
  const gpsEdges = useMemo(() => {
    const validIds = new Set(gpsNodes.map((n) => n.id));
    return edges.filter((e) => validIds.has(e.source_id) && validIds.has(e.target_id));
  }, [edges, gpsNodes]);

  // Hierarchical Tree Data grouped by Wilaya and Category
  const wilayaGroups = useMemo(() => {
    const groups: Record<string, Record<string, GraphNode[]>> = {};

    gpsNodes.forEach((node) => {
      // Find wilaya from properties or closest hub
      let wilaya = (node.properties?.wilaya as string) || (node.properties?.wilaya_activity as string) || '';
      if (!wilaya) {
        if (node.latitude && node.longitude) {
          if (node.latitude > 36.5 && node.longitude < 3.5) wilaya = 'Alger';
          else if (node.longitude < 0.5) wilaya = 'Oran';
          else if (node.longitude > 6.0) wilaya = 'Constantine';
          else wilaya = 'Alger';
        } else {
          wilaya = 'Alger';
        }
      }

      // Group category
      let category = 'Divers';
      if (node.type === 'antenne_bts' || node.type === 'telephone' || node.type === 'carte_sim') {
        category = 'Télécoms & BTS';
      } else if (node.type === 'personne') {
        category = "Personnes d'Intérêt";
      } else if (node.type === 'entreprise' || node.type === 'adresse_physique' || node.type === 'vehicule') {
        category = 'Sociétés & Biens';
      } else if (node.type === 'compte_bancaire' || node.type === 'transaction_financiere' || node.type === 'crypto_wallet') {
        category = 'Finances & Flux';
      } else if (node.type === 'serveur_c2' || node.type === 'site_web' || node.type === 'compte_social') {
        category = 'OSINT & Cyber';
      } else {
        category = 'Scellés & Pièces';
      }

      if (!groups[wilaya]) groups[wilaya] = {};
      const currentWilaya = groups[wilaya];
      if (currentWilaya) {
        if (!currentWilaya[category]) currentWilaya[category] = [];
        const currentCategory = currentWilaya[category];
        if (currentCategory) {
          currentCategory.push(node);
        }
      }
    });

    return groups;
  }, [gpsNodes]);

  // Center view on a specific node
  const handleFocusNode = useCallback((node: GraphNode) => {
    selectNode(node.id);
    const pos = nodePositionMap.get(node.id);
    if (pos) {
      setZoom(1.8);
      setPan({
        x: canvasWidth / 2 - pos.x * 1.8,
        y: canvasHeight / 2 - pos.y * 1.8,
      });
    }
  }, [nodePositionMap, selectNode, canvasWidth, canvasHeight]);

  // Reset view to entire Algeria
  const handleResetToAlgeria = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Precomputed SVG border path of Algeria
  const algeriaBorderPath = useMemo(() => {
    return ALGERIA_BORDER_GEO.map(([lat, lon], idx) => {
      const pt = projectGeo(lat, lon);
      return `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    }).join(' ') + ' Z';
  }, [projectGeo]);

  // Filtered tree nodes by search term
  const matchesSearch = (str: string) => {
    if (!treeSearch.trim()) return true;
    return str.toLowerCase().includes(treeSearch.toLowerCase().trim());
  };

  return (
    <div className="map-view-shell" role="region" aria-label="Vue cartographique géographique judiciaire des entités">
      {/* 1. Left Hierarchical Tree Sidebar (Arborescence Territoriale) */}
      <aside
        className="map-tree-sidebar"
        style={{
          width: isTreeOpen ? '300px' : '36px',
          minWidth: isTreeOpen ? '300px' : '36px',
        }}
        aria-label="Arborescence territoriale et classification des entités"
      >
        {isTreeOpen ? (
          <>
            {/* Tree Header with Search & Controls */}
            <div className="map-tree-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} className="text-accent" />
                  <span>{t.mapTreeTitle}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setIsTreeOpen(false)}
                  title="Réduire l'arborescence"
                  aria-label="Réduire l'arborescence"
                >
                  ◀
                </button>
              </div>

              {/* Search filter input */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="map-tree-search-input"
                  placeholder={t.mapFilterPlaceholder}
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                />
                <Search size={12} style={{ position: 'absolute', right: '8px', top: '8px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              </div>

              {/* Expand / Collapse all actions */}
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: 'var(--text-xs)', height: '22px', padding: '0 6px' }}
                  onClick={expandAllBranches}
                >
                  {t.mapExpandAll}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: 'var(--text-xs)', height: '22px', padding: '0 6px' }}
                  onClick={collapseAllBranches}
                >
                  {t.mapCollapseAll}
                </button>
              </div>
            </div>

            {/* Tree Content Branches */}
            <div className="map-tree-scroll" role="tree" aria-label="Arborescence territoriale des entités">
              {/* Root Branch: Algérie */}
              <button
                type="button"
                className="map-tree-node-branch"
                onClick={() => toggleBranch('root_algeria')}
                aria-expanded={expandedBranches['root_algeria']}
                style={{ fontWeight: 'var(--font-weight-semibold)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {expandedBranches['root_algeria'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>{t.mapNationalTerritory}</span>
                </div>
                <span className="chip chip-accent font-mono text-xs">{gpsNodes.length}</span>
              </button>

              {expandedBranches['root_algeria'] && (
                <div style={{ paddingLeft: 'var(--space-2)' }}>
                  {Object.entries(wilayaGroups).map(([wilayaName, categories]) => {
                    const wilayaKey = `wilaya_${wilayaName}`;
                    const isWilayaExpanded = expandedBranches[wilayaKey] ?? true;
                    const totalInWilaya = Object.values(categories).reduce((sum, list) => sum + list.length, 0);

                    return (
                      <div key={wilayaKey} style={{ marginBottom: '2px' }}>
                        {/* Wilaya Branch */}
                        <button
                          type="button"
                          className="map-tree-node-branch"
                          onClick={() => toggleBranch(wilayaKey)}
                          aria-expanded={isWilayaExpanded}
                          style={{ paddingLeft: 'var(--space-2)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isWilayaExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>Wilaya de {wilayaName}</span>
                          </div>
                          <span className="chip chip-neutral font-mono text-xs">{totalInWilaya}</span>
                        </button>

                        {/* Category Sub-Branches */}
                        {isWilayaExpanded && (
                          <div style={{ paddingLeft: 'var(--space-3)' }}>
                            {Object.entries(categories).map(([catName, nodeList]) => {
                              const catKey = `cat_${wilayaName}_${catName}`;
                              const isCatExpanded = expandedBranches[catKey] ?? true;
                              const filteredNodes = nodeList.filter((n) => matchesSearch(n.label) || matchesSearch(wilayaName) || matchesSearch(catName));
                              if (filteredNodes.length === 0) return null;

                              return (
                                <div key={catKey} style={{ marginBottom: '2px' }}>
                                  <button
                                    type="button"
                                    className="map-tree-node-branch"
                                    onClick={() => toggleBranch(catKey)}
                                    aria-expanded={isCatExpanded}
                                    style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', padding: '3px 6px' }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      {isCatExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                                      <span>{catName}</span>
                                    </div>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>({filteredNodes.length})</span>
                                  </button>

                                  {/* Leaf Items */}
                                  {isCatExpanded && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                      {filteredNodes.map((node) => {
                                        const isSelected = selectedNodeId === node.id;
                                        const typeDef = registry.node_types[node.type];
                                        return (
                                          <button
                                            type="button"
                                            key={node.id}
                                            className={`map-tree-leaf-item ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleFocusNode(node)}
                                            aria-label={`Centrer sur ${node.label} (${node.latitude?.toFixed(4)}, ${node.longitude?.toFixed(4)})`}
                                            title={`Cliquer pour centrer sur la carte : ${node.label} (${node.latitude?.toFixed(4)}, ${node.longitude?.toFixed(4)})`}
                                          >
                                            <NodeIcon name={typeDef?.icon || 'map-pin'} size={13} style={{ color: LAYER_COLORS[node.layer as LayerId] || 'var(--color-accent-primary)' }} />
                                            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }}>
                                              <span>{node.label}</span>
                                            </div>
                                            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                                              {node.latitude?.toFixed(2)}°
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Branch: Entités Hors-Carte */}
              <button
                type="button"
                className="map-tree-node-branch"
                onClick={() => toggleBranch('skipped_root')}
                aria-expanded={expandedBranches['skipped_root']}
                style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-secondary)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {expandedBranches['skipped_root'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <AlertCircle size={13} style={{ color: 'var(--color-status-warning)' }} />
                  <span>{t.mapSkippedNodes}</span>
                </div>
                <span className="chip chip-neutral font-mono text-xs">{skippedNodes.length}</span>
              </button>

              {expandedBranches['skipped_root'] && (
                <div style={{ paddingLeft: 'var(--space-3)' }}>
                  {skippedNodes
                    .filter((n) => matchesSearch(n.label) || matchesSearch(n.type))
                    .slice(0, 30)
                    .map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      const typeDef = registry.node_types[node.type];
                      return (
                        <button
                          type="button"
                          key={node.id}
                          className={`map-tree-leaf-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => selectNode(node.id)}
                          aria-label={`Inspecter l'entité non géolocalisée ${node.label}`}
                          title={`Entité non géolocalisée : ${node.label} (Cliquer pour inspecter)`}
                        >
                          <NodeIcon name={typeDef?.icon || 'help-circle'} size={13} style={{ color: 'var(--color-text-muted)' }} />
                          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }}>
                            <span>{node.label}</span>
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-status-warning)' }}>Sans GPS</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => setIsTreeOpen(true)}
              title="Ouvrir l'arborescence territoriale"
              aria-label="Ouvrir l'arborescence territoriale"
            >
              ▶
            </button>
            <button
              type="button"
              style={{
                writingMode: 'vertical-rl',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                letterSpacing: '2px',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 'var(--space-2)',
              }}
              onClick={() => setIsTreeOpen(true)}
              aria-label="Ouvrir l'arborescence SIG"
            >
              ARBORESCENCE SIG
            </button>
          </div>
        )}
      </aside>

      {/* 2. Interactive Algerian Vector Map Area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--color-bg-canvas)',
          userSelect: 'none',
        }}
        onMouseDown={(e) => {
          if (e.button === 0) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
          }
        }}
        onMouseMove={(e) => {
          if (isPanning) {
            setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
          }
        }}
        onMouseUp={() => setIsPanning(false)}
        onWheel={(e) => {
          e.preventDefault();
          const factor = e.deltaY < 0 ? 1.15 : 0.87;
          setZoom((prev) => Math.min(Math.max(prev * factor, 0.4), 5.0));
        }}
      >
        {/* Map Canvas with SVG Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '50% 50%',
            cursor: isPanning ? 'grabbing' : 'grab',
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
            <defs>
              {/* Judicial Background Grid */}
              <pattern id="sig-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--color-border-subtle)" strokeWidth="0.5" opacity="0.3" />
              </pattern>

              {/* Mediterranean Sea gradient */}
              <linearGradient id="mediterranean-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#081426" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
              </linearGradient>

              {/* Algeria land gradient */}
              <linearGradient id="algeria-land-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
              </linearGradient>

              {/* Glow filter for active nodes */}
              <filter id="sig-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Canvas Base Grid */}
            <rect width={canvasWidth} height={canvasHeight} fill="url(#sig-grid)" />

            {/* Northern Maritime Zone (Mer Méditerranée) */}
            <rect x="0" y="0" width={canvasWidth} height="130" fill="url(#mediterranean-grad)" />
            <text
              x={canvasWidth / 2 + 60}
              y="40"
              fill="var(--color-text-muted)"
              opacity="0.35"
              fontSize="13px"
              fontWeight="600"
              letterSpacing="6px"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              MER MÉDITERRANÉE
            </text>

            {/* Graticule Latitude Lines (36°N, 32°N, 28°N, 24°N) */}
            {[36, 32, 28, 24, 20].map((lat) => {
              const pt = projectGeo(lat, 0);
              return (
                <g key={`lat-${lat}`}>
                  <line x1="20" y1={pt.y} x2={canvasWidth - 20} y2={pt.y} stroke="var(--color-border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                  <text x="30" y={pt.y - 4} fontSize="12px" fill="var(--color-text-muted)" opacity="0.5" fontFamily="var(--font-mono)">
                    {lat}°00' N
                  </text>
                </g>
              );
            })}

            {/* Graticule Longitude Lines (-4°W, 0°, 4°E, 8°E) */}
            {[-4, 0, 4, 8].map((lon) => {
              const pt = projectGeo(28, lon);
              return (
                <g key={`lon-${lon}`}>
                  <line x1={pt.x} y1="20" x2={pt.x} y2={canvasHeight - 20} stroke="var(--color-border-subtle)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
                  <text x={pt.x + 4} y={canvasHeight - 30} fontSize="12px" fill="var(--color-text-muted)" opacity="0.5" fontFamily="var(--font-mono)">
                    {lon >= 0 ? `${lon}°00' E` : `${Math.abs(lon)}°00' O`}
                  </text>
                </g>
              );
            })}

            {/* Algeria Sovereign National Border Polygon */}
            <path
              d={algeriaBorderPath}
              fill="url(#algeria-land-grad)"
              stroke="var(--color-border-strong)"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            {/* Inner Border Glow */}
            <path
              d={algeriaBorderPath}
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="0.8"
              opacity="0.25"
            />

            {/* Major Wilaya Reference Hubs on Map */}
            {MAJOR_WILAYA_HUBS.map((hub) => {
              const pt = projectGeo(hub.lat, hub.lon);
              return (
                <g key={hub.name} opacity="0.6">
                  <circle cx={pt.x} cy={pt.y} r={hub.isCapitale ? 3.5 : 2} fill={hub.isCapitale ? 'var(--color-accent-text)' : 'var(--color-text-muted)'} />
                  <text
                    x={pt.x}
                    y={pt.y - 6}
                    textAnchor="middle"
                    fontSize="12px"
                    fontFamily="var(--font-sans)"
                    fontWeight={hub.isCapitale ? 600 : 400}
                    fill={hub.isCapitale ? 'var(--color-accent-text)' : 'var(--color-text-muted)'}
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}

            {/* Forensic Links between geolocated nodes */}
            {gpsEdges.map((edge) => {
              const srcPos = nodePositionMap.get(edge.source_id);
              const tgtPos = nodePositionMap.get(edge.target_id);
              if (!srcPos || !tgtPos) return null;

              const isConnectedToSelected = selectedNodeId === edge.source_id || selectedNodeId === edge.target_id;

              return (
                <g key={edge.id}>
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={isConnectedToSelected ? 'var(--color-accent-primary)' : 'var(--color-border-default)'}
                    strokeWidth={isConnectedToSelected ? 2.2 : 1.2}
                    strokeDasharray={isConnectedToSelected ? 'none' : '4 3'}
                    opacity={isConnectedToSelected ? 0.9 : 0.45}
                  />
                </g>
              );
            })}

            {/* Geolocated Node Markers */}
            {gpsNodes.map((node) => {
              const pos = nodePositionMap.get(node.id);
              if (!pos) return null;

              const isSelected = selectedNodeId === node.id;
              const typeDef = registry.node_types[node.type];
              const color = LAYER_COLORS[node.layer as LayerId] || 'var(--color-accent-primary)';

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectNode(node.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Selection Pulse Ring */}
                  {isSelected && (
                    <>
                      <circle r={26} fill="none" stroke="var(--color-accent-primary)" strokeWidth={2} opacity={0.4} filter="url(#sig-glow)" />
                      <circle r={20} fill="none" stroke="var(--color-accent-primary)" strokeWidth={1.5} opacity={0.8} />
                    </>
                  )}

                  {/* Marker Circle Outer & Inner */}
                  <circle
                    r={15}
                    fill="var(--color-bg-surface)"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                    filter={isSelected ? 'url(#sig-glow)' : undefined}
                  />

                  {/* Icon */}
                  <foreignObject x={-8} y={-8} width={16} height={16} style={{ pointerEvents: 'none' }}>
                    <NodeIcon name={typeDef?.icon || 'map-pin'} size={16} style={{ color }} />
                  </foreignObject>

                  {/* Label Pill Backdrop */}
                  <rect
                    x={-((node.label.length * 6.5) / 2) - 6}
                    y={18}
                    width={node.label.length * 6.5 + 12}
                    height={16}
                    rx={3}
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={isSelected ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)'}
                    strokeWidth={isSelected ? 1 : 0.5}
                  />

                  {/* Label Text */}
                  <text
                    x={0}
                    y={30}
                    textAnchor="middle"
                    fontSize="12px"
                    fontFamily="var(--font-sans)"
                    fontWeight={isSelected ? 600 : 500}
                    fill={isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
                  >
                    {node.label}
                  </text>

                  {/* Lat/Lon coordinates */}
                  <text
                    x={0}
                    y={44}
                    textAnchor="middle"
                    fontSize="12px"
                    fontFamily="var(--font-mono)"
                    fill="var(--color-text-muted)"
                  >
                    {node.latitude!.toFixed(3)}°, {node.longitude!.toFixed(3)}°
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map Floating Controls (Top-Right) */}
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-default)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 10,
          }}
        >
          <button
            type="button"
            aria-label="Zoom avant"
            title="Zoom avant"
            onClick={() => setZoom((z) => Math.min(z * 1.25, 5.0))}
            style={ctrlBtnStyle}
          >
            <ZoomIn size={15} />
          </button>
          <button
            type="button"
            aria-label="Zoom arrière"
            title="Zoom arrière"
            onClick={() => setZoom((z) => Math.max(z * 0.8, 0.4))}
            style={ctrlBtnStyle}
          >
            <ZoomOut size={15} />
          </button>
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '2px 0' }} />
          <button
            type="button"
            aria-label="Recadrer sur l'Algérie entière"
            title="Recadrer sur l'Algérie entière"
            onClick={handleResetToAlgeria}
            style={ctrlBtnStyle}
          >
            <RotateCcw size={15} />
          </button>
          {selectedNodeId && (
            <button
              type="button"
              aria-label="Centrer sur l'entité sélectionnée"
              title="Centrer sur l'entité sélectionnée"
              onClick={() => {
                const target = gpsNodes.find((n) => n.id === selectedNodeId);
                if (target) handleFocusNode(target);
              }}
              style={ctrlBtnStyle}
            >
              <Crosshair size={15} style={{ color: 'var(--color-accent-text)' }} />
            </button>
          )}
        </div>

        {/* Compass / Orientation Indicator (Top-Left inside Canvas) */}
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            left: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            zIndex: 5,
            pointerEvents: 'none',
          }}
        >
          <Compass size={13} className="text-accent" />
          <span>N 0° (Nord Vrai)</span>
        </div>

        {/* Non-Blocking Floating Status Pill (Bottom-Left) */}
        <div className="map-floating-status">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-text)' }}>
            <MapPin size={13} />
            <strong>{gpsNodes.length}</strong> {t.mapGeolocatedCount}
          </span>
          <span style={{ color: 'var(--color-border-default)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
            <AlertCircle size={13} style={{ color: 'var(--color-status-warning)' }} />
            <span>{skippedNodes.length} {t.mapSkippedNodes}</span>
          </span>
          <span style={{ color: 'var(--color-border-default)' }}>|</span>
          <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {t.mapWgs84}
          </span>
        </div>
      </div>
    </div>
  );
};

const ctrlBtnStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
};
