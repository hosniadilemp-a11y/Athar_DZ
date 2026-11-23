import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { GraphNode, GraphEdge } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { CircularNode } from './CircularNode';
import { EdgeLine } from './EdgeLine';
import { CanvasFloatingPalette } from './CanvasFloatingPalette';
import { CanvasMinimap } from './CanvasMinimap';
import { CreateRelationModal } from '../modals/CreateRelationModal';
import { useGraphStore } from '../../store/useGraphStore';
import { stepLiveForcePhysics, computePersonGraphProjection } from '../../utils/graphLayouts';
import { Link2, Sparkles, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { getEdgeCategory } from '../../i18n/phrases/relations';

export interface Viewport {
  panX: number;
  panY: number;
  zoom: number;
}

export interface GraphCanvasAdapterProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeLayers?: Set<LayerId>;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeId: string | null;
  viewport: Viewport;
  onSelectNode: (id: string, isMulti: boolean) => void;
  onSelectEdge: (id: string) => void;
  onClearSelection: () => void;
  onNodeContextMenu: (e: React.MouseEvent | React.KeyboardEvent, nodeId: string) => void;
  onNodeDragEnd?: (nodeId: string, x: number, y: number) => void;
  onViewportChange: (panX: number, panY: number, zoom: number) => void;
  onToggleImpactView: () => void;
  onToggleSna?: () => void;
  isSnaOpen?: boolean;
  onAddNodeAtPosition?: (typeKey: string, x: number, y: number) => void;
}

export const GraphCanvasAdapter: React.FC<GraphCanvasAdapterProps> = ({
  nodes,
  edges,
  activeLayers,
  selectedNodeId,
  selectedNodeIds,
  selectedEdgeId,
  viewport,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onNodeContextMenu,
  onNodeDragEnd,
  onViewportChange,
  onToggleImpactView,
  onToggleSna,
  isSnaOpen = false,
  onAddNodeAtPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tr } = useI18n();
  const {
    isLinkMode,
    linkSourceNodeId,
    setLinkMode,
    setLinkSourceNodeId,
    createManualEdge,
    snaVisualOverlay,
    clearSnaVisualOverlay,
    isLiveSimulationActive,
  } = useGraphStore();

  // Pan dragging state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [livePositions, setLivePositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const dragPosRef = useRef<{ id: string; x: number; y: number } | null>(null);

  // Canvas Drag & Drop State (Feature 1)
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

  // Mouse position in canvas space for link preview
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pendingLink, setPendingLink] = useState<{ sourceId: string; targetId: string } | null>(null);

  // Container dimensions for minimap
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Real-time Live Force Simulation Loop
  useEffect(() => {
    if (!isLiveSimulationActive || nodes.length === 0) return;

    let animId: number;
    const tick = () => {
      const currentNodes = useGraphStore.getState().nodes;
      const currentEdges = useGraphStore.getState().edges;
      const pinnedNodeIds = useGraphStore.getState().pinnedNodeIds;
      const cx = containerSize.w > 100 ? containerSize.w / 2 : 600;
      const cy = containerSize.h > 100 ? containerSize.h / 2 : 450;
      const stepMap = stepLiveForcePhysics(currentNodes, currentEdges, cx, cy, draggingNodeId, pinnedNodeIds);

      useGraphStore.setState((state) => ({
        nodes: state.nodes.map((n) => {
          const pos = stepMap.get(n.id);
          return pos ? { ...n, x: pos.x, y: pos.y } : n;
        }),
      }));

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isLiveSimulationActive, nodes.length, draggingNodeId, containerSize.w, containerSize.h]);

  // Handle Node Click (Selection or Link Creation Mode)
  const handleNodeClick = useCallback(
    (nodeId: string, isMulti: boolean) => {
      if (isLinkMode) {
        if (!linkSourceNodeId) {
          setLinkSourceNodeId(nodeId);
        } else if (linkSourceNodeId !== nodeId) {
          // Open the relation qualifier modal to let the investigator choose relation type
          setPendingLink({ sourceId: linkSourceNodeId, targetId: nodeId });
        }
        return;
      }
      onSelectNode(nodeId, isMulti);
    },
    [isLinkMode, linkSourceNodeId, setLinkSourceNodeId, onSelectNode]
  );

  // Fast node lookup for edge rendering
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => {
      const live = livePositions.get(n.id);
      map.set(n.id, live ? { ...n, x: live.x, y: live.y } : n);
    });
    return map;
  }, [nodes, livePositions]);

  // Filter nodes by active layer first
  const layerFilteredNodes = React.useMemo(() => {
    if (!activeLayers) return nodes;
    return nodes.filter((n) => activeLayers.has(n.layer));
  }, [nodes, activeLayers]);

  // Person-Centric Projection & Granular Node/Relation Expansion
  const isPersonOnlyGraph = useGraphStore((s) => s.isPersonOnlyGraph);
  const expandedHiddenNodeIds = useGraphStore((s) => s.expandedHiddenNodeIds);
  const mediatedEdgeOverrides = useGraphStore((s) => s.mediatedEdgeOverrides);
  const hiddenEdgeCategories = useGraphStore((s) => s.hiddenEdgeCategories);

  const {
    visibleNodes,
    visibleEdges: projectedEdges,
    hiddenNeighborCountByNode,
    expandedNeighborCountByNode,
  } = React.useMemo(() => {
    return computePersonGraphProjection(
      layerFilteredNodes,
      edges,
      isPersonOnlyGraph,
      expandedHiddenNodeIds,
      mediatedEdgeOverrides
    );
  }, [layerFilteredNodes, edges, isPersonOnlyGraph, expandedHiddenNodeIds, mediatedEdgeOverrides]);

  // Filter visible edges by user edge category visibility
  const visibleEdges = React.useMemo(() => {
    return projectedEdges.filter((e) => {
      if (hiddenEdgeCategories && hiddenEdgeCategories.size > 0) {
        if (hiddenEdgeCategories.has(e.type)) return false;
        const cat = getEdgeCategory(e.type);
        if (hiddenEdgeCategories.has(cat)) return false;
      }
      return true;
    });
  }, [projectedEdges, hiddenEdgeCategories]);

  // Native Non-Passive Wheel Listener (strictly prevents browser zoom / page scrolling)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentZoom = viewport.zoom;
      const nextZoom = Math.min(Math.max(currentZoom * factor, 0.2), 3.5);
      const ratio = nextZoom / currentZoom;

      const nextPanX = mouseX - (mouseX - viewport.panX) * ratio;
      const nextPanY = mouseY - (mouseY - viewport.panY) * ratio;

      onViewportChange(nextPanX, nextPanY, nextZoom);
    };

    el.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onNativeWheel);
    };
  }, [viewport, onViewportChange]);

  // Handle Drag Over for Entity Drop (Feature 1)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOverCanvas(true);
  }, []);

  // Handle Drag Enter
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(true);
  }, []);

  // Handle Drag Leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container boundaries
    if (e.currentTarget === e.target) {
      setIsDragOverCanvas(false);
    }
  }, []);

  // Handle Entity Drop onto Canvas (Feature 1)
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverCanvas(false);

      let typeKey = e.dataTransfer.getData('athar/node-type') || e.dataTransfer.getData('text/plain');
      if (!typeKey) {
        try {
          const json = e.dataTransfer.getData('application/json');
          if (json) {
            const parsed = JSON.parse(json);
            typeKey = parsed.type;
          }
        } catch {
          // ignore
        }
      }
      if (!typeKey || !onAddNodeAtPosition) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const canvasX = Math.round((mouseX - viewport.panX) / viewport.zoom);
      const canvasY = Math.round((mouseY - viewport.panY) / viewport.zoom);

      onAddNodeAtPosition(typeKey, canvasX, canvasY);
    },
    [viewport, onAddNodeAtPosition]
  );

  // Track canvas mouse position for interactive rubber-band link line
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isLinkMode || !linkSourceNodeId) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setMouseCanvasPos({
        x: Math.round((mouseX - viewport.panX) / viewport.zoom),
        y: Math.round((mouseY - viewport.panY) / viewport.zoom),
      });
    },
    [isLinkMode, linkSourceNodeId, viewport]
  );

  // Handle Pan Start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && !draggingNodeId) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.panX, y: e.clientY - viewport.panY });
    }
  }, [draggingNodeId, viewport]);

  // Handle Node Drag Start
  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodeMap.get(nodeId);
    if (!node) return;
    setDraggingNodeId(nodeId);
    dragPosRef.current = { id: nodeId, x: node.x ?? 0, y: node.y ?? 0 };
    setDragOffset({
      x: e.clientX - (node.x ?? 0) * viewport.zoom - viewport.panX,
      y: e.clientY - (node.y ?? 0) * viewport.zoom - viewport.panY,
    });
  }, [nodeMap, viewport]);

  // Global Mouse Move and Up for Pan and Node Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        onViewportChange(e.clientX - panStart.x, e.clientY - panStart.y, viewport.zoom);
      } else if (draggingNodeId) {
        const newX = Math.round((e.clientX - viewport.panX - dragOffset.x) / viewport.zoom);
        const newY = Math.round((e.clientY - viewport.panY - dragOffset.y) / viewport.zoom);
        dragPosRef.current = { id: draggingNodeId, x: newX, y: newY };
        setLivePositions((prev) => {
          const next = new Map(prev);
          next.set(draggingNodeId, { x: newX, y: newY });
          return next;
        });
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
      }
      if (draggingNodeId) {
        const latest = dragPosRef.current;
        if (latest && latest.id === draggingNodeId && onNodeDragEnd) {
          onNodeDragEnd(draggingNodeId, latest.x, latest.y);
        }
        setLivePositions((prev) => {
          const next = new Map(prev);
          next.delete(draggingNodeId);
          return next;
        });
        dragPosRef.current = null;
        setDraggingNodeId(null);
      }
    };

    if (isPanning || draggingNodeId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, panStart, draggingNodeId, dragOffset, viewport, onViewportChange, onNodeDragEnd]);

  // Keyboard navigation on canvas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 80 : 30;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onViewportChange(viewport.panX + step, viewport.panY, viewport.zoom);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onViewportChange(viewport.panX - step, viewport.panY, viewport.zoom);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onViewportChange(viewport.panX, viewport.panY + step, viewport.zoom);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onViewportChange(viewport.panX, viewport.panY - step, viewport.zoom);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      onViewportChange(viewport.panX, viewport.panY, Math.min(viewport.zoom * 1.15, 3.0));
    } else if (e.key === '-') {
      e.preventDefault();
      onViewportChange(viewport.panX, viewport.panY, Math.max(viewport.zoom * 0.85, 0.2));
    } else if (e.key === '0') {
      e.preventDefault();
      onViewportChange(0, 0, 1.0);
    } else if (e.key === 'Escape') {
      onClearSelection();
    }
  };

  const linkSourceNode = linkSourceNodeId ? nodeMap.get(linkSourceNodeId) : null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Zone du graphe visuel d'investigation. Utilisez la souris pour déplacer ou les touches fléchées pour naviguer."
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-canvas)',
        cursor: isPanning ? 'grabbing' : isLinkMode ? 'crosshair' : 'default',
        outline: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onClick={onClearSelection}
    >
      {/* Background Subtle Grid Pattern */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.15,
        }}
      >
        <defs>
          <pattern id="canvas-grid" width={40 * viewport.zoom} height={40 * viewport.zoom} patternUnits="userSpaceOnUse">
            <circle cx={2} cy={2} r={1} fill="var(--color-text-muted)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#canvas-grid)" />
      </svg>

      {/* Feature 1: Luminous Active Drop Zone Overlay */}
      {isDragOverCanvas && (
        <div
          className="canvas-drop-zone-overlay"
          style={{
            position: 'absolute',
            inset: '12px',
            border: '2px dashed var(--color-accent-primary)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            boxShadow: 'inset 0 0 24px rgba(37, 99, 235, 0.25)',
            pointerEvents: 'none',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--color-accent-text)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          <Sparkles size={18} className="text-accent" />
          <span>{tr('Déposer l\'entité ici pour la positionner sur le graphe')}</span>
        </div>
      )}

      {/* Transformed Content Layer */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* SVG Layer for Edges and Arrow Markers */}
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '10000px',
            height: '10000px',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <defs>
            <marker id="arrow-VERIFIED" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-1-verified)" />
            </marker>
            <marker id="arrow-OSINT_RAW" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-2-osint)" />
            </marker>
            <marker id="arrow-INFRA" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-3-infra)" />
            </marker>
            <marker id="arrow-HYPOTHESIS" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-4-hypothesis)" />
            </marker>
            <marker id="arrow-FLOWS" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-5-flows)" />
            </marker>
          </defs>

          {visibleEdges.map((edge) => (
            <EdgeLine
              key={edge.id}
              edge={edge}
              sourceNode={nodeMap.get(edge.source_id)}
              targetNode={nodeMap.get(edge.target_id)}
              isSelected={selectedEdgeId === edge.id}
              zoom={viewport.zoom}
              onSelect={onSelectEdge}
            />
          ))}

          {/* Dynamic rubber-band guide line during link creation */}
          {isLinkMode && linkSourceNode && (
            <line
              x1={linkSourceNode.x ?? 0}
              y1={linkSourceNode.y ?? 0}
              x2={mouseCanvasPos.x}
              y2={mouseCanvasPos.y}
              stroke="var(--color-status-warning)"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              pointerEvents="none"
              opacity={0.85}
            />
          )}
        </svg>

        {/* DOM Layer for Circular Nodes */}
        {visibleNodes.map((node) => {
          const live = livePositions.get(node.id);
          const effectiveNode = live ? { ...node, x: live.x, y: live.y } : node;
          const isSelected = selectedNodeId === node.id || selectedNodeIds.includes(node.id);

          return (
            <CircularNode
              key={node.id}
              node={effectiveNode}
              isSelected={isSelected}
              isLinkSource={linkSourceNodeId === node.id}
              isDragging={draggingNodeId === node.id}
              zoom={viewport.zoom}
              hiddenNeighborsCount={hiddenNeighborCountByNode.get(node.id) || 0}
              expandedNeighborsCount={expandedNeighborCountByNode.get(node.id) || 0}
              onSelect={handleNodeClick}
              onContextMenu={onNodeContextMenu}
              onDragStart={handleNodeDragStart}
            />
          );
        })}
      </div>

      {/* Feature 4: Floating SNA Visual Overlay Legend */}
      {snaVisualOverlay && (
        <div
          className="canvas-sna-legend-card"
          role="region"
          aria-label="Légende de l'analyse visuelle SNA"
        >
          <div className="canvas-sna-legend-header">
            <div className="canvas-sna-legend-title">
              <Sparkles size={13} className="text-accent" />
              <span>{snaVisualOverlay.algoTitle}</span>
            </div>
            <button
              type="button"
              className="canvas-sna-legend-close"
              onClick={clearSnaVisualOverlay}
              title={tr('Effacer l\'analyse visuelle')}
              aria-label="Fermer la visualisation SNA"
            >
              <X size={12} />
            </button>
          </div>
          <div className="canvas-sna-legend-items">
            {snaVisualOverlay.legend.map((item, idx) => (
              <div key={idx} className="canvas-sna-legend-item">
                <span
                  className="canvas-sna-legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="canvas-sna-legend-text">{item.label}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs canvas-sna-legend-reset-btn"
            onClick={clearSnaVisualOverlay}
          >
            {tr('Réinitialiser l\'affichage')}
          </button>
        </div>
      )}

      {/* Active Link Creation Mode Banner */}
      {isLinkMode && (
        <div className="canvas-connection-banner is-visible" role="status" aria-live="polite">
          <Link2 size={15} className="text-warning" />
          <span id="canvas-connection-text">
            <strong>{tr('Mode Liaison Actif :')}</strong>{' '}
            {linkSourceNodeId ? (
              <span>
                {tr('Premier nœud sélectionné ({name}). Cliquez sur le nœud cible pour créer la liaison...', {
                  name: nodes.find((n) => n.id === linkSourceNodeId)?.label || linkSourceNodeId,
                })}
              </span>
            ) : (
              <span>{tr('Cliquez sur le premier nœud de la liaison...')}</span>
            )}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-xs banner-cancel-btn"
            onClick={() => setLinkMode(false)}
          >
            {tr('Annuler')}
          </button>
        </div>
      )}

      {/* Feature 6: Interactive Canvas Minimap (Bottom-Right) */}
      <CanvasMinimap
        nodes={visibleNodes}
        viewport={viewport}
        onViewportChange={onViewportChange}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {/* Floating Canvas Tool Palette (Bottom-Left) */}
      <CanvasFloatingPalette
        onToggleImpactView={onToggleImpactView}
        onToggleSna={onToggleSna}
        isSnaOpen={isSnaOpen}
      />

      {/* Modal to Choose Relation Type between Two Nodes */}
      {pendingLink && (
        <CreateRelationModal
          isOpen={Boolean(pendingLink)}
          sourceId={pendingLink.sourceId}
          targetId={pendingLink.targetId}
          onClose={() => {
            setPendingLink(null);
            setLinkSourceNodeId(null);
          }}
          onConfirm={(relationType, layer, confidence, notes) => {
            createManualEdge(pendingLink.sourceId, pendingLink.targetId, relationType, layer, confidence, notes);
            setPendingLink(null);
            setLinkSourceNodeId(null);
          }}
        />
      )}
    </div>
  );
};
