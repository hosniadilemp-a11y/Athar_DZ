import React, { useState, useMemo } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, AlertCircle } from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

const LAYER_COLORS: Record<LayerId, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

export const MapView: React.FC = () => {
  const { nodes, selectedNodeId, selectNode } = useGraphStore();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Filter GPS-valid nodes
  const { gpsNodes, skippedCount, bounds } = useMemo(() => {
    const valid: typeof nodes = [];
    let skipped = 0;

    let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;

    nodes.forEach((n) => {
      if (
        n.latitude !== null &&
        n.longitude !== null &&
        n.latitude >= -90 &&
        n.latitude <= 90 &&
        n.longitude >= -180 &&
        n.longitude <= 180
      ) {
        valid.push(n);
        if (n.latitude < minLat) minLat = n.latitude;
        if (n.latitude > maxLat) maxLat = n.latitude;
        if (n.longitude < minLon) minLon = n.longitude;
        if (n.longitude > maxLon) maxLon = n.longitude;
      } else {
        skipped++;
      }
    });

    if (valid.length === 0) {
      // Default to Algiers center
      minLat = 36.7;
      maxLat = 36.8;
      minLon = 3.0;
      maxLon = 3.1;
    }

    return {
      gpsNodes: valid,
      skippedCount: skipped,
      bounds: { minLat, maxLat, minLon, maxLon },
    };
  }, [nodes]);

  // Project lat/lon to canvas X/Y (Equirectangular projection)
  const project = (lat: number, lon: number, width: number, height: number) => {
    const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.05);
    const lonSpan = Math.max(bounds.maxLon - bounds.minLon, 0.05);

    // Padding 80px
    const pad = 80;
    const availWidth = width - pad * 2;
    const availHeight = height - pad * 2;

    const x = pad + ((lon - bounds.minLon) / lonSpan) * availWidth;
    const y = pad + ((bounds.maxLat - lat) / latSpan) * availHeight;
    return { x, y };
  };

  const canvasWidth = 1000;
  const canvasHeight = 650;

  return (
    <div
      role="region"
      aria-label="Vue cartographique géographique des entités"
      style={{
        position: 'relative',
        width: '100%',
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
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        setZoom((prev) => Math.min(Math.max(prev * factor, 0.5), 4.0));
      }}
    >
      {/* Top Banner: GPS Statistics (Section 7 requirement) */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          fontSize: 'var(--text-xs)',
          zIndex: 10,
        }}
      >
        <MapPin size={16} style={{ color: 'var(--color-accent-text)' }} />
        <span>
          <strong>{gpsNodes.length}</strong> entités géolocalisées
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>|</span>
        <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={14} style={{ color: 'var(--color-status-warning)' }} />
          {skippedCount} entités ignorées (sans coordonnées GPS)
        </span>
      </div>

      {/* Map Controls */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          display: 'flex',
          gap: '4px',
          backgroundColor: 'var(--color-bg-surface)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-default)',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          aria-label="Zoom avant"
          onClick={() => setZoom((z) => Math.min(z * 1.2, 4.0))}
          style={ctrlBtnStyle}
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          aria-label="Zoom arrière"
          onClick={() => setZoom((z) => Math.max(z * 0.8, 0.5))}
          style={ctrlBtnStyle}
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          aria-label="Réinitialiser"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          style={ctrlBtnStyle}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Map Canvas Layer */}
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
          {/* Grid lines */}
          <defs>
            <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--color-border-subtle)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={canvasWidth} height={canvasHeight} fill="url(#map-grid)" />

          {/* Coordinate markers */}
          {gpsNodes.map((node) => {
            if (node.latitude === null || node.longitude === null) return null;
            const { x, y } = project(node.latitude, node.longitude, canvasWidth, canvasHeight);
            const isSelected = selectedNodeId === node.id;
            const typeDef = registry.node_types[node.type];
            const color = LAYER_COLORS[node.layer] || 'var(--color-accent-primary)';

            return (
              <g
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectNode(node.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring for selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r={22} fill="none" stroke="var(--color-accent-primary)" strokeWidth={2} opacity={0.6} />
                )}
                {/* Marker background */}
                <circle cx={x} cy={y} r={16} fill="var(--color-bg-surface)" stroke={color} strokeWidth={isSelected ? 3 : 2} />
                {/* Center icon */}
                <foreignObject x={x - 8} y={y - 8} width={16} height={16} style={{ pointerEvents: 'none' }}>
                  <NodeIcon name={typeDef?.icon || 'map-pin'} size={16} style={{ color }} />
                </foreignObject>
                {/* Label */}
                <text
                  x={x}
                  y={y + 26}
                  textAnchor="middle"
                  fontSize="10px"
                  fontFamily="var(--font-sans)"
                  fontWeight={isSelected ? 700 : 500}
                  fill={isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
                >
                  {node.label}
                </text>
                {/* Lat/Lon subtitle */}
                <text
                  x={x}
                  y={y + 37}
                  textAnchor="middle"
                  fontSize="9px"
                  fontFamily="var(--font-mono)"
                  fill="var(--color-text-muted)"
                >
                  {node.latitude.toFixed(3)}, {node.longitude.toFixed(3)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const ctrlBtnStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
};
