import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';
import {
  Compass,
  GitBranch,
  ShieldCheck,
  MapPin,
  Clock,
  Fingerprint,
  Wrench,
  X,
  ExternalLink,
} from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

interface InspectorPanelProps {
  onExpand: (hops: number) => void;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ onExpand, onClose }) => {
  const { nodes, edges, selectedNodeId, selectedEdgeId, openLayerChangeModal } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  if (!selectedNode && !selectedEdge) {
    return (
      <aside
        role="complementary"
        aria-label="Inspecteur d'éléments"
        style={{
          width: 'var(--panel-right-width)',
          height: '100%',
          backgroundColor: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        <Fingerprint size={48} style={{ opacity: 0.3, marginBottom: 'var(--space-3)' }} />
        <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
          Sélectionnez un nœud ou une relation dans le graphe pour inspecter ses métadonnées judiciaires et forensiques.
        </p>
      </aside>
    );
  }

  if (selectedNode) {
    const typeDef = registry.node_types[selectedNode.type];
    const layerDef = registry.layers[selectedNode.layer];
    const isGps = typeDef?.is_gps_enabled || (selectedNode.latitude !== null && selectedNode.longitude !== null);
    const proposedTools = typeDef?.proposed_tools || [];

    return (
      <aside
        role="complementary"
        aria-label={`Inspecteur de l'entité ${selectedNode.label}`}
        style={{
          width: 'var(--panel-right-width)',
          height: '100%',
          backgroundColor: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <NodeIcon name={typeDef?.icon || 'help-circle'} size={20} style={{ color: layerDef?.color }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{typeDef?.label_fr || selectedNode.type}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer l'inspecteur"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Main Label */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
              LIBELLÉ IDENTIFICATEUR
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {selectedNode.label}
            </div>
          </div>

          {/* Layer and Status Chips */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: `1px solid ${layerDef?.color || 'var(--color-border-default)'}`,
                color: layerDef?.color,
                fontWeight: 600,
              }}
            >
              COUCHE : {layerDef?.label_fr || selectedNode.layer}
            </span>

            {selectedNode.confidence !== null && (
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                CONFIANCE : {Math.round(selectedNode.confidence * 100)}%
              </span>
            )}
          </div>

          {/* Forensic Actions */}
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-default)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              ACTIONS D&apos;ENQUÊTE
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => onExpand(1)}
                style={actionBtnStyle}
              >
                <Compass size={14} />
                <span>1 bond</span>
              </button>
              <button
                type="button"
                onClick={() => onExpand(2)}
                style={actionBtnStyle}
              >
                <GitBranch size={14} />
                <span>2 bonds</span>
              </button>
            </div>

            {selectedNode.layer !== 'VERIFIED' && (
              <button
                type="button"
                onClick={() => openLayerChangeModal(selectedNode.id, 'VERIFIED')}
                style={{
                  ...actionBtnStyle,
                  borderColor: 'var(--color-layer-1-verified)',
                  color: 'var(--color-layer-1-verified)',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={14} />
                <span>Sceller en Preuve (VERIFIED)</span>
              </button>
            )}
          </div>

          {/* GPS Coordinates if available */}
          {isGps && selectedNode.latitude !== null && selectedNode.longitude !== null && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} />
                <span>COORDONNÉES GÉOGRAPHIQUES (WGS84)</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                {selectedNode.latitude.toFixed(6)}, {selectedNode.longitude.toFixed(6)}
              </div>
            </div>
          )}

          {/* Properties Map */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              PROPRIÉTÉS FORENSIQUES
            </div>
            <div
              style={{
                backgroundColor: 'var(--color-bg-canvas)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                padding: 'var(--space-2)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                maxHeight: '180px',
                overflowY: 'auto',
              }}
            >
              {Object.entries(selectedNode.properties || {}).length === 0 ? (
                <span style={{ color: 'var(--color-text-muted)' }}>Aucune propriété additionnelle</span>
              ) : (
                Object.entries(selectedNode.properties || {}).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{k}:</span>
                    <span style={{ color: 'var(--color-text-primary)', wordBreak: 'break-all', textAlign: 'right' }}>
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contextual Tool Proposals (From Registry) */}
          {proposedTools.length > 0 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wrench size={12} />
                <span>OUTILS D&apos;INVESTIGATION SUGGÉRÉS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {proposedTools.map((tool) => (
                  <div
                    key={tool}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-1) var(--space-2)',
                      backgroundColor: 'var(--color-bg-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span>{tool}</span>
                    <ExternalLink size={12} style={{ opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forensic Provenance & Timestamps */}
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <Clock size={11} />
              <span>Provenance: {selectedNode.provenance}</span>
            </div>
            <div style={{ wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
              UUID: {selectedNode.id}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Edge Inspection
  if (selectedEdge) {
    const srcNode = nodes.find((n) => n.id === selectedEdge.source_id);
    const tgtNode = nodes.find((n) => n.id === selectedEdge.target_id);

    return (
      <aside
        role="complementary"
        aria-label={`Inspecteur de la relation ${selectedEdge.type}`}
        style={{
          width: 'var(--panel-right-width)',
          height: '100%',
          backgroundColor: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>RELATION JUDICIAIRE</span>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-3)' }}>
          {selectedEdge.type}
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
          Source: <strong>{srcNode?.label || selectedEdge.source_id}</strong>
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Cible: <strong>{tgtNode?.label || selectedEdge.target_id}</strong>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          Couche: {selectedEdge.layer} | UUID: {selectedEdge.id}
        </div>
      </aside>
    );
  }

  return null;
};

const actionBtnStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-1)',
  padding: 'var(--space-1) var(--space-2)',
  backgroundColor: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-primary)',
  fontSize: 'var(--text-xs)',
  fontWeight: 600,
  cursor: 'pointer',
};
