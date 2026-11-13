import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { NodeIcon } from './NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';

const registry = registryDataRaw as unknown as RegistryData;

export const AccessibleListView: React.FC = () => {
  const { nodes, edges, selectedNodeId, selectNode, openContextMenu } = useGraphStore();
  const { tr, label, dir } = useI18n();
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges'>('nodes');

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--text-sm)',
    textAlign: dir === 'rtl' ? 'right' : 'left',
  };

  const thStyle: React.CSSProperties = { padding: 'var(--space-2)' };

  return (
    <div
      role="region"
      aria-label={tr('Tableau des entités et relations')}
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'var(--color-bg-canvas)',
        padding: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'nodes'}
          onClick={() => setActiveTab('nodes')}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: activeTab === 'nodes' ? 'var(--color-accent-primary)' : 'var(--color-bg-surface)',
            color: activeTab === 'nodes' ? 'var(--color-text-on-accent)' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          {tr('Entités')} ({nodes.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'edges'}
          onClick={() => setActiveTab('edges')}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: activeTab === 'edges' ? 'var(--color-accent-primary)' : 'var(--color-bg-surface)',
            color: activeTab === 'edges' ? 'var(--color-text-on-accent)' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          {tr('Relations')} ({edges.length})
        </button>
      </div>

      {activeTab === 'nodes' ? (
        nodes.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{tr('Aucune entité trouvée')}</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-default)', color: 'var(--color-text-muted)' }}>
                <th style={thStyle}>{tr('Type')}</th>
                <th style={thStyle}>{tr('Libellé')}</th>
                <th style={thStyle}>{tr('Couche')}</th>
                <th style={thStyle}>{tr('Confiance')}</th>
                <th style={thStyle}>{tr('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const typeDef = registry.node_types[node.type];
                const layerDef = registry.layers[node.layer];
                return (
                  <tr
                    key={node.id}
                    onClick={() => selectNode(node.id)}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <NodeIcon name={typeDef?.icon || 'help-circle'} size={16} />
                      <span>{label(typeDef, node.type)}</span>
                    </td>
                    <td style={{ padding: 'var(--space-2)', fontWeight: 600 }}>{node.label}</td>
                    <td style={{ padding: 'var(--space-2)' }}>
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-mono)',
                          backgroundColor: 'var(--color-bg-surface)',
                          border: `1px solid ${layerDef?.color || 'var(--color-border-default)'}`,
                          color: layerDef?.color,
                        }}
                      >
                        {label(layerDef, node.layer)}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
                      {node.confidence !== null ? `${Math.round(node.confidence * 100)}%` : '—'}
                    </td>
                    <td style={{ padding: 'var(--space-2)' }}>
                      <button
                        type="button"
                        aria-label={tr('Inspecter {label}', { label: node.label })}
                        onClick={(e) => {
                          e.stopPropagation();
                          openContextMenu(e.clientX || 200, e.clientY || 200, node.id);
                        }}
                        style={{
                          padding: '2px 8px',
                          backgroundColor: 'var(--color-bg-elevated)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {tr('Actions')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      ) : (
        edges.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{tr('Aucune relation trouvée')}</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-default)', color: 'var(--color-text-muted)' }}>
                <th style={thStyle}>{tr('Type Relation')}</th>
                <th style={thStyle}>{tr('Source')}</th>
                <th style={thStyle}>{tr('Cible')}</th>
                <th style={thStyle}>{tr('Couche')}</th>
              </tr>
            </thead>
            <tbody>
              {edges.map((edge) => {
                const srcNode = nodes.find((n) => n.id === edge.source_id);
                const tgtNode = nodes.find((n) => n.id === edge.target_id);
                const relDef = registry.relation_types?.[edge.type];
                const layerDef = registry.layers[edge.layer];
                return (
                  <tr key={edge.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
                      {label(relDef, edge.type)}
                    </td>
                    <td style={{ padding: 'var(--space-2)' }}>{srcNode?.label || edge.source_id}</td>
                    <td style={{ padding: 'var(--space-2)' }}>{tgtNode?.label || edge.target_id}</td>
                    <td style={{ padding: 'var(--space-2)' }}>{label(layerDef, edge.layer)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};
