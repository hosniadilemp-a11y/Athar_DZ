import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { GraphNode, GraphEdge } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { CircularNode } from './CircularNode';
import { EdgeLine } from './EdgeLine';

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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan dragging state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [livePositions, setLivePositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  // Fast node lookup for edge rendering
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => {
      const live = livePositions.get(n.id);
      map.set(n.id, live ? { ...n, x: live.x, y: live.y } : n);
    });
    return map;
  }, [nodes, livePositions]);

  // Filter visible nodes by active layer
  const visibleNodes = React.useMemo(() => {
    if (!activeLayers) return nodes;
    return nodes.filter((n) => activeLayers.has(n.layer));
  }, [nodes, activeLayers]);

  // Filter visible edges (both endpoints must be visible)
  const visibleEdges = React.useMemo(() => {
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    return edges.filter((e) => visibleIds.has(e.source_id) && visibleIds.has(e.target_id));
  }, [edges, visibleNodes]);

  // Handle Wheel Zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const nextZoom = Math.min(Math.max(viewport.zoom * factor, 0.2), 3.0);
    onViewportChange(viewport.panX, viewport.panY, nextZoom);
  }, [viewport, onViewportChange]);

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
        const finalPos = livePositions.get(draggingNodeId);
        if (finalPos && onNodeDragEnd) {
          onNodeDragEnd(draggingNodeId, finalPos.x, finalPos.y);
        }
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
  }, [isPanning, panStart, draggingNodeId, dragOffset, viewport, livePositions, onViewportChange, onNodeDragEnd]);

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
        cursor: isPanning ? 'grabbing' : 'default',
        outline: 'none',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
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
            <marker id="arrow-VERIFIED" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-layer-1-verified)" />
            </marker>
            <marker id="arrow-OSINT_RAW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-layer-2-osint)" />
            </marker>
            <marker id="arrow-INFRA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-layer-3-infra)" />
            </marker>
            <marker id="arrow-HYPOTHESIS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-layer-4-hypothesis)" />
            </marker>
            <marker id="arrow-FLOWS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--color-layer-5-flows)" />
            </marker>
          </defs>

          {visibleEdges.map((edge) => (
            <EdgeLine
              key={edge.id}
              edge={edge}
              sourceNode={nodeMap.get(edge.source_id)}
              targetNode={nodeMap.get(edge.target_id)}
              isSelected={selectedEdgeId === edge.id}
              onSelect={onSelectEdge}
            />
          ))}
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
              onSelect={onSelectNode}
              onContextMenu={onNodeContextMenu}
              onDragStart={handleNodeDragStart}
            />
          );
        })}
      </div>
    </div>
  );
};
