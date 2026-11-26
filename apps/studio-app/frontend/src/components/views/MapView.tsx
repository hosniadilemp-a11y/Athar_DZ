import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGraphStore, NODE_TYPE_TO_CATEGORY, ONTOLOGY_CATEGORY_COLORS } from '../../store/useGraphStore';
import { computeTabScopedGraph } from '../../utils/tabScope';
import { useI18n } from '../../context/I18nContext';
import { getRelationLabel } from '../../i18n/phrases/relations';
import { NodeIcon } from '../canvas/NodeIcon';

// Silence Firefox mozPressure / mozInputSource deprecation notices emitted by Leaflet
if (typeof window !== 'undefined' && window.MouseEvent) {
  try {
    const proto = window.MouseEvent.prototype;
    if ('mozPressure' in proto) {
      Object.defineProperty(proto, 'mozPressure', { get: () => 0, configurable: true });
    }
    if ('mozInputSource' in proto) {
      Object.defineProperty(proto, 'mozInputSource', { get: () => 0, configurable: true });
    }
  } catch {
    // Ignore in non-configurable environments
  }
}
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import type { GraphNode } from '../../types/graph';

type GpsGraphNode = GraphNode & { latitude: number; longitude: number };
import {
  MapPin,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Crosshair,
  Map as MapIcon,
  Eye,
  EyeOff,
} from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

const LAYER_COLORS: Record<LayerId, string> = {
  VERIFIED: '#10b981',
  OSINT_RAW: '#3b82f6',
  INFRA: '#06b6d4',
  HYPOTHESIS: '#ef4444',
  FLOWS: '#f59e0b',
};

const OSM_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  label: 'Rues OSM',
};

export const MapView: React.FC = () => {
  const { t, tr, trLabel, locale } = useI18n();
  const {
    nodes: allNodes,
    edges: allEdges,
    activeLayers,
    tabs,
    activeTabId,
    isImpactView,
    selectedNodeId,
    selectNode,
    openContextMenu,
  } = useGraphStore();

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );

  const { scopedNodes: nodes, scopedEdges: edges } = useMemo(
    () => computeTabScopedGraph(allNodes, allEdges, activeTab, activeLayers, isImpactView),
    [allNodes, allEdges, activeTab, activeLayers, isImpactView]
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const linesGroupRef = useRef<L.LayerGroup | null>(null);
  const posMapRef = useRef<Map<string, [number, number]>>(new Map());

  const [showGeographicLinks, setShowGeographicLinks] = useState(true);
  const [currentZoom, setCurrentZoom] = useState<number>(6);

  // Tree panel state
  const [isTreeOpen, setIsTreeOpen] = useState(true);
  const [treeSearch, setTreeSearch] = useState('');
  const [selectedWilayaFilter, setSelectedWilayaFilter] = useState<string>('ALL');
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    root_algeria: true,
    'wilaya_Alger': true,
    'wilaya_Oran': true,
    'wilaya_Blida': true,
    'wilaya_Constantine': true,
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
    });
    setExpandedBranches(all);
  };

  const collapseAllBranches = () => {
    setExpandedBranches({ root_algeria: false, skipped_root: false });
  };

  // Separate GPS-valid and non-geolocated nodes
  const { gpsNodes, skippedNodes } = useMemo(() => {
    const valid: GpsGraphNode[] = [];
    const skipped: GraphNode[] = [];

    nodes.forEach((n) => {
      if (
        n.latitude !== null &&
        n.longitude !== null &&
        !isNaN(n.latitude) &&
        !isNaN(n.longitude) &&
        n.latitude >= 18.0 &&
        n.latitude <= 38.0 &&
        n.longitude >= -9.0 &&
        n.longitude <= 13.0
      ) {
        valid.push({ ...n, latitude: n.latitude, longitude: n.longitude });
      } else {
        skipped.push(n);
      }
    });

    return { gpsNodes: valid, skippedNodes: skipped };
  }, [nodes]);

  // Determine wilaya of a node
  const getNodeWilaya = useCallback((node: GraphNode): string => {
    let w = (node.properties?.wilaya as string) || (node.properties?.wilaya_activity as string) || '';
    if (!w) {
      if (node.latitude && node.longitude) {
        if (node.latitude > 36.5 && node.longitude < 3.5) w = 'Alger';
        else if (node.longitude < 0.5) w = 'Oran';
        else if (node.longitude > 6.0) w = 'Constantine';
        else w = 'Alger';
      } else {
        w = 'Alger';
      }
    }
    return w;
  }, []);

  // Filtered nodes
  const filteredGpsNodes = useMemo(() => {
    return gpsNodes.filter((node) => {
      if (selectedWilayaFilter !== 'ALL') {
        const w = getNodeWilaya(node);
        if (w !== selectedWilayaFilter) return false;
      }

      if (treeSearch.trim()) {
        const q = treeSearch.toLowerCase();
        if (!node.label.toLowerCase().includes(q) && !node.type.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [gpsNodes, selectedWilayaFilter, treeSearch, getNodeWilaya]);

  // Unique wilayas for tree sidebar
  const availableWilayas = useMemo(() => {
    const map = new Map<string, number>();
    gpsNodes.forEach((n) => {
      const w = getNodeWilaya(n);
      map.set(w, (map.get(w) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [gpsNodes, getNodeWilaya]);

  // 1. Initialize Leaflet Map (Runs once on mount)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Centered on Algeria: Alger [36.75, 3.05], default view [35.2, 3.2], zoom 6
    const map = L.map(mapContainerRef.current, {
      center: [35.5, 3.2],
      zoom: 6,
      minZoom: 4,
      maxZoom: 19,
      zoomControl: false,
    });

    // Add zoom controls to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial Street Tile Layer (Rues OpenStreetMap only)
    L.tileLayer(OSM_TILE_LAYER.url, {
      attribution: OSM_TILE_LAYER.attribution,
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const linesGroup = L.layerGroup().addTo(map);

    // Track dynamic zoom to toggle between regional clusters and street-level individual markers
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapRef.current = map;
    markersGroupRef.current = markersGroup;
    linesGroupRef.current = linesGroup;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 3. Render Leaflet Markers & Forensic Polylines
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current || !linesGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    const linesGroup = linesGroupRef.current;

    markersGroup.clearLayers();
    linesGroup.clearLayers();

    const zoomLevel = mapRef.current ? mapRef.current.getZoom() : currentZoom;
    const isClusteredMode = zoomLevel <= 11;

    // Helper to render an individual forensic node marker
    const renderNodeMarker = (node: GpsGraphNode, lat: number, lon: number) => {
      const isSelected = selectedNodeId === node.id;
      const typeDef = registry.node_types[node.type];
      const category = NODE_TYPE_TO_CATEGORY[node.type] || 'acteurs';
      const categoryColor = ONTOLOGY_CATEGORY_COLORS[category] || '#3b82f6';
      const layerColor = LAYER_COLORS[node.layer as LayerId] || '#3b82f6';
      const photoUrl = (node.properties?.photo_url as string) || (node.properties?.photo as string);
      const statusJudiciaire = (node.properties?.status_judiciaire as string) || '';

      const markerHtml = `
        <div class="sig-leaflet-marker ${isSelected ? 'is-selected' : ''}" style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0f172a;
          border: 2.5px solid ${isSelected ? '#3b82f6' : layerColor};
          box-shadow: 0 3px 10px rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        ">
          ${isSelected ? `
            <div style="
              position: absolute;
              inset: -7px;
              border-radius: 50%;
              border: 2px solid #3b82f6;
              animation: sigPulse 1.6s infinite ease-out;
            "></div>
          ` : ''}

          ${photoUrl ? `
            <img src="${photoUrl}" style="
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            " />
          ` : `
            <div style="color: ${categoryColor}; font-size: 13px; font-weight: 700;">
              ${(node.label || 'N').charAt(0).toUpperCase()}
            </div>
          `}

          <!-- Category Dot -->
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: ${categoryColor};
            border: 1.5px solid #0f172a;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'sig-custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([lat, lon], { icon: customIcon });

      marker.on('click', () => {
        selectNode(node.id);
      });

      marker.on('contextmenu', (e: L.LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
        selectNode(node.id);
        openContextMenu(e.originalEvent.clientX, e.originalEvent.clientY, node.id);
      });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 11.5px; color: #f8fafc; min-width: 180px;">
          <div style="font-weight: 700; font-size: 12.5px; color: #ffffff; margin-bottom: 2px;">
            ${node.label}
          </div>
          <div style="color: ${categoryColor}; font-size: 10.5px; font-weight: 600; text-transform: uppercase;">
            ${typeDef?.label_fr || node.type}
          </div>
          <div style="font-size: 10.5px; color: #94a3b8; margin: 4px 0;">
            Wilaya: <strong>${getNodeWilaya(node)}</strong>
          </div>
          ${statusJudiciaire ? `
            <div style="
              display: inline-block;
              font-size: 9.5px;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: 10px;
              background: #dc262622;
              color: #ef4444;
              border: 1px solid #dc262644;
            ">
              ${statusJudiciaire}
            </div>
          ` : ''}
          <div style="font-size: 9.5px; color: #64748b; font-family: monospace; margin-top: 4px;">
            GPS: ${node.latitude.toFixed(4)}°, ${node.longitude.toFixed(4)}°
          </div>
        </div>
      `;

      marker.bindTooltip(popupHtml, {
        direction: 'top',
        className: 'sig-leaflet-tooltip',
      });

      markersGroup.addLayer(marker);
    };

    // Mode A: Clustered Mode when Zoomed Out (zoom <= 11)
    if (isClusteredMode) {
      const wilayaClusters = new Map<string, { lat: number; lon: number; nodes: GpsGraphNode[]; wilaya: string }>();

      filteredGpsNodes.forEach((node) => {
        const w = getNodeWilaya(node);
        let cluster = wilayaClusters.get(w);
        if (!cluster) {
          cluster = {
            lat: node.latitude,
            lon: node.longitude,
            nodes: [],
            wilaya: w,
          };
          wilayaClusters.set(w, cluster);
        }
        cluster.nodes.push(node);
      });

      wilayaClusters.forEach((cluster) => {
        const count = cluster.nodes.length;
        if (count >= 2) {
          const clusterHtml = `
            <div class="sig-leaflet-cluster-badge" style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: radial-gradient(circle, #2563eb 0%, #1e3a8a 100%);
              border: 3px solid #60a5fa;
              box-shadow: 0 0 16px rgba(37, 99, 235, 0.6), 0 4px 12px rgba(0,0,0,0.5);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-family: var(--font-mono, monospace);
              cursor: pointer;
              transition: transform 0.15s ease;
            ">
              <span style="font-weight: 800; font-size: 14px; line-height: 1;">${count}</span>
              <span style="font-size: 8px; text-transform: uppercase; font-weight: 700; opacity: 0.9;">Entités</span>
            </div>
          `;

          const clusterIcon = L.divIcon({
            html: clusterHtml,
            className: 'sig-custom-div-icon',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -22],
          });

          const clusterMarker = L.marker([cluster.lat, cluster.lon], { icon: clusterIcon });
          clusterMarker.on('click', () => {
            if (mapRef.current) {
              mapRef.current.flyTo([cluster.lat, cluster.lon], 13, { duration: 1.0 });
            }
          });

          clusterMarker.bindTooltip(
            `<div style="font-family: inherit; font-size: 11.5px; color: #ffffff; min-width: 150px;">
              <div style="font-weight: 700; font-size: 12px; margin-bottom: 2px;">
                Wilaya de ${cluster.wilaya}
              </div>
              <div style="color: #60a5fa; font-weight: 600; font-size: 11px;">
                ${count} entités judiciaires actives
              </div>
              <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">
                Cliquer pour zoomer au niveau des rues
              </div>
            </div>`,
            { direction: 'top', className: 'sig-leaflet-tooltip' }
          );

          markersGroup.addLayer(clusterMarker);
        } else if (count === 1) {
          const n = cluster.nodes[0];
          if (n) {
            renderNodeMarker(n, n.latitude, n.longitude);
          }
        }
      });
      return;
    }

    // Mode B: Detailed Street Zoom (zoom >= 12) - Render individual markers & polylines
    const clusterMap = new Map<string, GpsGraphNode[]>();
    filteredGpsNodes.forEach((node) => {
      const lat = node.latitude;
      const lon = node.longitude;
      const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
      let bucket = clusterMap.get(key);
      if (!bucket) {
        bucket = [];
        clusterMap.set(key, bucket);
      }
      bucket.push(node);
    });

    const posMap = new Map<string, [number, number]>();
    clusterMap.forEach((clusterNodes) => {
      const first = clusterNodes[0];
      if (!first) return;
      if (clusterNodes.length === 1) {
        posMap.set(first.id, [first.latitude, first.longitude]);
      } else {
        const centerLat = first.latitude;
        const centerLon = first.longitude;
        const count = clusterNodes.length;
        const spreadRadius = 0.0022;

        clusterNodes.forEach((n, idx) => {
          const angle = (2 * Math.PI * idx) / count;
          const latShift = spreadRadius * Math.cos(angle);
          const lonShift = (spreadRadius * Math.sin(angle)) / Math.cos((centerLat * Math.PI) / 180);
          posMap.set(n.id, [centerLat + latShift, centerLon + lonShift]);
        });
      }
    });

    posMapRef.current = posMap;

    filteredGpsNodes.forEach((node) => {
      const coords = posMap.get(node.id) || [node.latitude, node.longitude];
      renderNodeMarker(node, coords[0], coords[1]);
    });

    // Render Forensic Polylines Connecting Geolocated Nodes
    if (showGeographicLinks) {
      edges.forEach((edge) => {
        const srcPos = posMap.get(edge.source_id);
        const tgtPos = posMap.get(edge.target_id);
        if (!srcPos || !tgtPos) return;

        const isConnected = selectedNodeId === edge.source_id || selectedNodeId === edge.target_id;
        const layerColor = LAYER_COLORS[edge.layer as LayerId] || '#3b82f6';
        const color = isConnected ? '#3b82f6' : layerColor;

        const polyline = L.polyline([srcPos, tgtPos], {
          color,
          weight: isConnected ? 3.5 : 2.2,
          dashArray: edge.layer === 'HYPOTHESIS' ? '6, 6' : undefined,
          opacity: isConnected ? 1.0 : 0.75,
        });

        const humanLabel = getRelationLabel(edge.type, locale);
        const confText = typeof edge.confidence === 'number' ? ` · ${Math.round(edge.confidence * 100)}%` : '';
        polyline.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px; font-weight: 600; color: #ffffff; background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155;">
            ${humanLabel}${confText}
          </div>`,
          { sticky: true, className: 'sig-leaflet-tooltip' }
        );

        polyline.on('click', () => {
          selectNode(edge.source_id);
        });

        linesGroup.addLayer(polyline);
      });
    }
  }, [filteredGpsNodes, edges, selectedNodeId, selectNode, openContextMenu, showGeographicLinks, getNodeWilaya, locale, currentZoom]);

  // Center / FlyTo Node
  const handleFocusNode = useCallback((node: GraphNode) => {
    selectNode(node.id);
    const coords = posMapRef.current.get(node.id) || (node.latitude !== null && node.longitude !== null ? [node.latitude, node.longitude] : null);
    if (coords && mapRef.current) {
      mapRef.current.flyTo(coords as [number, number], 16, {
        duration: 1.2,
      });
    }
  }, [selectNode]);

  // Reset to National Algerian Overview
  const handleResetNational = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([35.5, 3.2], 6, { duration: 1.0 });
      setSelectedWilayaFilter('ALL');
    }
  };

  return (
    <div className="map-view-shell" role="region" aria-label="Vue cartographique géographique judiciaire des entités">
      {/* 1. Left Hierarchical Tree Sidebar */}
      <aside
        className="map-tree-sidebar"
        style={{
          width: isTreeOpen ? '240px' : '36px',
          minWidth: isTreeOpen ? '240px' : '36px',
        }}
        aria-label="Arborescence territoriale et classification des entités"
      >
        {isTreeOpen ? (
          <>
            {/* Tree Header */}
            <div className="map-tree-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  <ChevronLeft size={13} />
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
            <div className="map-tree-scroll" role="region" aria-label="Arborescence territoriale des entités">
              {availableWilayas.map(([wilayaName, count]) => {
                const isSelected = selectedWilayaFilter === wilayaName;
                const wilayaKey = `wilaya_${wilayaName}`;
                const isExpanded = expandedBranches[wilayaKey] ?? true;
                const nodesInWilaya = gpsNodes.filter((n) => getNodeWilaya(n) === wilayaName);

                return (
                  <div key={wilayaKey} style={{ marginBottom: '2px' }}>
                    <button
                      type="button"
                      className={`map-tree-node-branch ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedWilayaFilter(isSelected ? 'ALL' : wilayaName);
                        toggleBranch(wilayaKey);
                        if (nodesInWilaya[0]?.latitude && nodesInWilaya[0]?.longitude && mapRef.current) {
                          mapRef.current.flyTo([nodesInWilaya[0].latitude, nodesInWilaya[0].longitude], 13);
                        }
                      }}
                      style={{
                        paddingLeft: 'var(--space-2)',
                        backgroundColor: isSelected ? 'var(--color-accent-subtle)' : undefined,
                        borderInlineStart: isSelected ? '3px solid var(--color-accent-primary)' : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        <span style={{ fontWeight: 600 }}>{tr('Wilaya de {name}', { name: trLabel(wilayaName) })}</span>
                      </div>
                      <span className="chip chip-neutral font-mono text-xs">{count}</span>
                    </button>

                    {isExpanded && (
                      <div style={{ paddingLeft: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {nodesInWilaya.map((node) => {
                          const isNodeSelected = selectedNodeId === node.id;
                          const typeDef = registry.node_types[node.type];
                          const catColor = ONTOLOGY_CATEGORY_COLORS[NODE_TYPE_TO_CATEGORY[node.type] || 'acteurs'];

                          return (
                            <button
                              type="button"
                              key={node.id}
                              className={`map-tree-leaf-item ${isNodeSelected ? 'selected' : ''}`}
                              onClick={() => handleFocusNode(node)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                selectNode(node.id);
                                openContextMenu(e.clientX, e.clientY, node.id);
                              }}
                              title={`${trLabel(node.label)} (${node.latitude?.toFixed(4)}, ${node.longitude?.toFixed(4)})`}
                            >
                              <NodeIcon name={typeDef?.icon || 'map-pin'} size={12} style={{ color: catColor }} />
                              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }}>
                                <span>{trLabel(node.label)}</span>
                              </div>
                              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
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

              {/* Non-Geolocated Entities */}
              {skippedNodes.length > 0 && (
                <div>
                  <button
                    type="button"
                    className="map-tree-node-branch"
                    onClick={() => toggleBranch('skipped_root')}
                    style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-secondary)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {expandedBranches['skipped_root'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <AlertCircle size={12} className="text-warning" />
                      <span>{t.mapSkippedNodes}</span>
                    </div>
                    <span className="chip chip-neutral font-mono text-xs">{skippedNodes.length}</span>
                  </button>

                  {expandedBranches['skipped_root'] && (
                    <div style={{ paddingLeft: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {skippedNodes.map((node) => (
                        <button
                          key={node.id}
                          type="button"
                          className="map-tree-leaf-item"
                          onClick={() => selectNode(node.id)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectNode(node.id);
                            openContextMenu(e.clientX, e.clientY, node.id);
                          }}
                          style={{ opacity: 0.7 }}
                        >
                          <NodeIcon name={registry.node_types[node.type]?.icon || 'help-circle'} size={12} />
                          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'start' }}>
                            <span>{trLabel(node.label)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setIsTreeOpen(true)}
            title={tr("Ouvrir l'arborescence territoriale")}
            aria-label={tr("Ouvrir l'arborescence territoriale")}
            style={{ width: '100%', height: '36px', padding: 0 }}
          >
            <ChevronRight size={13} />
          </button>
        )}
      </aside>

      {/* 2. Main OpenStreetMap Street View Container */}
      <div style={{ flex: 1, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Floating Map Controls (Top Right — Rues OSM Exclusif) */}
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 1000,
          }}
        >
          {/* Rues OSM Active Badge + Quick Actions Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
              gap: '4px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span
              className="btn btn-primary btn-xs"
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'default' }}
              title={tr('Fond cartographique routier OpenStreetMap')}
            >
              <MapIcon size={12} />
              <span>{tr('Rues OSM')}</span>
            </span>

            {/* Center on Algeria */}
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={handleResetNational}
              title={tr("Recentrer sur l'Algérie entière")}
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Crosshair size={12} />
              <span>{tr('Algérie')}</span>
            </button>

            {/* Toggle Polylines */}
            <button
              type="button"
              className={`btn btn-xs ${showGeographicLinks ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setShowGeographicLinks((v) => !v)}
              title={tr("Afficher/masquer les liens d'enquête entre les coordonnées")}
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {showGeographicLinks ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>{tr('Liens')}</span>
            </button>
          </div>
        </div>

        {/* Bottom Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 'var(--space-3)',
            left: 'var(--space-3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            fontSize: '10.5px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>{filteredGpsNodes.length}</span> {t.mapGeolocatedCount}
          <span style={{ opacity: 0.4 }}>|</span>
          <span>{tr("Zoom routier jusqu'aux rues (Niveau 19)")}</span>
        </div>
      </div>
    </div>
  );
};
