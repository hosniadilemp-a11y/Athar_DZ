import React, { useState, useMemo } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import { Calendar, Clock, Filter } from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

const LAYER_COLORS: Record<LayerId, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

export const TimelineView: React.FC = () => {
  const { nodes, selectedNodeId, selectNode } = useGraphStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');

  // Sort nodes chronologically
  const sortedEvents = useMemo(() => {
    return [...nodes]
      .filter((n) => {
        if (selectedLayer !== 'ALL' && n.layer !== selectedLayer) return false;
        if (searchTerm && !n.label.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tA - tB;
      });
  }, [nodes, selectedLayer, searchTerm]);

  return (
    <div
      role="region"
      aria-label="Vue chronologique temporelle de l'enquête"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg-canvas)',
        overflow: 'hidden',
      }}
    >
      {/* Top Filter Bar */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Calendar size={18} style={{ color: 'var(--color-accent-text)' }} />
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Chronologie Judiciaire</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({sortedEvents.length} événements)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginLeft: 'auto' }}>
          <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
            }}
          >
            <option value="ALL">Toutes les couches</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="OSINT_RAW">OSINT_RAW</option>
            <option value="INFRA">INFRA</option>
            <option value="HYPOTHESIS">HYPOTHESIS</option>
            <option value="FLOWS">FLOWS</option>
          </select>

          <input
            type="text"
            placeholder="Filtrer par libellé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              width: '180px',
            }}
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Vertical Timeline Axis Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '24px',
              width: '2px',
              backgroundColor: 'var(--color-border-default)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {sortedEvents.map((event, idx) => {
              const isSelected = selectedNodeId === event.id;
              const typeDef = registry.node_types[event.type];
              const color = LAYER_COLORS[event.layer] || 'var(--color-border-default)';
              const formattedDate = event.created_at
                ? new Date(event.created_at).toLocaleString('fr-FR', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  })
                : `Événement séquentiel #${idx + 1}`;

              return (
                <div
                  key={event.id}
                  onClick={() => selectNode(event.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-4)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Timeline Node Point */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: `3px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      marginTop: '4px',
                      boxShadow: isSelected ? '0 0 0 3px var(--color-accent-subtle)' : undefined,
                    }}
                  />

                  {/* Event Card */}
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-bg-surface)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-3)',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <NodeIcon name={typeDef?.icon || 'help-circle'} size={16} style={{ color }} />
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                          {event.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-elevated)',
                          color: color,
                          border: `1px solid ${color}`,
                        }}
                      >
                        {event.layer}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} />
                        {formattedDate}
                      </span>
                      <span>Type: {typeDef?.label_fr || event.type}</span>
                      <span>Provenance: {event.provenance}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
