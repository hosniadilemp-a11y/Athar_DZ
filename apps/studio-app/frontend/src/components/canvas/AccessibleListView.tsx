import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from './NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';

const registry = registryDataRaw as unknown as RegistryData;

export const AccessibleListView: React.FC = () => {
  const { nodes, edges, selectedNodeId, selectNode, openContextMenu } = useGraphStore();
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges'>('nodes');

  return (
    <div
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
          onClick={() => setActiveTab('nodes')}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: activeTab === 'nodes' ? 'var(--color-accent-primary)' : 'var(--color-bg-surface)',
            color: activeTab === 'nodes' ? '#ffffff' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          Nœuds ({nodes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('edges')}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            backgroundColor: activeTab === 'edges' ? 'var(--color-accent-primary)' : 'var(--color-bg-surface)',
            color: activeTab === 'edges' ? '#ffffff' : 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          Relations ({edges.length})
        </button>
      </div>

      {activeTab === 'nodes' ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-sm)',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-default)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: 'var(--space-2)' }}>Type</th>
              <th style={{ padding: 'var(--space-2)' }}>Libellé</th>
              <th style={{ padding: 'var(--space-2)' }}>Couche</th>
              <th style={{ padding: 'var(--space-2)' }}>Confiance</th>
              <th style={{ padding: 'var(--space-2)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const typeDef = registry.node_types[node.type];
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
                    <span>{typeDef?.label_fr || node.type}</span>
                  </td>
                  <td style={{ padding: 'var(--space-2)', fontWeight: 600 }}>{node.label}</td>
                  <td style={{ padding: 'var(--space-2)' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-default)',
                      }}
                    >
                      {node.layer}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
                    {node.confidence !== null ? `${Math.round(node.confidence * 100)}%` : '—'}
                  </td>
                  <td style={{ padding: 'var(--space-2)' }}>
                    <button
                      type="button"
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
                        fontSize: '12px',
                      }}
                    >
                      Actions
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'var(--text-sm)',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-default)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: 'var(--space-2)' }}>Type Relation</th>
              <th style={{ padding: 'var(--space-2)' }}>Source</th>
              <th style={{ padding: 'var(--space-2)' }}>Cible</th>
              <th style={{ padding: 'var(--space-2)' }}>Couche</th>
            </tr>
          </thead>
          <tbody>
            {edges.map((edge) => {
              const srcNode = nodes.find((n) => n.id === edge.source_id);
              const tgtNode = nodes.find((n) => n.id === edge.target_id);
              return (
                <tr key={edge.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>{edge.type}</td>
                  <td style={{ padding: 'var(--space-2)' }}>{srcNode?.label || edge.source_id}</td>
                  <td style={{ padding: 'var(--space-2)' }}>{tgtNode?.label || edge.target_id}</td>
                  <td style={{ padding: 'var(--space-2)' }}>{edge.layer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
