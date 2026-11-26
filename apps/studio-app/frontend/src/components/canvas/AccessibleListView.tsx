import React, { useMemo, useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { computeTabScopedGraph } from '../../utils/tabScope';
import { useI18n } from '../../context/I18nContext';
import { getRelationLabel } from '../../i18n/phrases/relations';
import { getDisplayedEntityConfidence } from '../../utils/entityConfidence';
import { NodeIcon } from './NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';

const registry = registryDataRaw as unknown as RegistryData;

export const AccessibleListView: React.FC = () => {
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
  const { tr, trLabel, label, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges'>('nodes');

  const currentWorkspaceTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );

  const { scopedNodes: nodes, scopedEdges: edges } = useMemo(
    () => computeTabScopedGraph(allNodes, allEdges, currentWorkspaceTab, activeLayers, isImpactView),
    [allNodes, allEdges, currentWorkspaceTab, activeLayers, isImpactView]
  );

  return (
    <div
      className="accessible-list-shell"
      role="region"
      aria-label={tr('Tableau des entités et relations')}
    >
      <div className="accessible-list-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'nodes'}
          className={`btn btn-sm ${activeTab === 'nodes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('nodes')}
        >
          {tr('Entités')} ({nodes.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'edges'}
          className={`btn btn-sm ${activeTab === 'edges' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('edges')}
        >
          {tr('Relations')} ({edges.length})
        </button>
      </div>

      <div className="accessible-list-scroll">
        {activeTab === 'nodes' ? (
          nodes.length === 0 ? (
            <p className="accessible-list-empty">{tr('Aucune entité trouvée')}</p>
          ) : (
            <table className="accessible-list-table">
              <thead>
                <tr>
                  <th>{tr('Type')}</th>
                  <th>{tr('Libellé')}</th>
                  <th>{tr('Couche')}</th>
                  <th>{tr('Confiance')}</th>
                  <th>{tr('Actions')}</th>
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
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectNode(node.id);
                        openContextMenu(e.clientX, e.clientY, node.id);
                      }}
                      className={isSelected ? 'is-selected' : ''}
                    >
                      <td>
                        <div className="accessible-list-type-cell">
                          <NodeIcon name={typeDef?.icon || 'help-circle'} size={15} />
                          <span>{label(typeDef, node.type)}</span>
                        </div>
                      </td>
                      <td className="accessible-list-label-cell">{trLabel(node.label)}</td>
                      <td>
                        <span
                          className="accessible-list-layer-badge font-mono"
                          style={{
                            borderColor: layerDef?.color || 'var(--color-border-default)',
                            color: layerDef?.color,
                          }}
                        >
                          {label(layerDef, node.layer)}
                        </span>
                      </td>
                      <td className="font-mono">
                        {`${Math.round(getDisplayedEntityConfidence(node) * 100)}%`}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          aria-label={tr('Inspecter {label}', { label: trLabel(node.label) })}
                          onClick={(e) => {
                            e.stopPropagation();
                            openContextMenu(e.clientX || 200, e.clientY || 200, node.id);
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
        ) : edges.length === 0 ? (
          <p className="accessible-list-empty">{tr('Aucune relation trouvée')}</p>
        ) : (
          <table className="accessible-list-table">
            <thead>
              <tr>
                <th>{tr('Type Relation')}</th>
                <th>{tr('Source')}</th>
                <th>{tr('Cible')}</th>
                <th>{tr('Couche')}</th>
              </tr>
            </thead>
            <tbody>
              {edges.map((edge) => {
                const srcNode = nodes.find((n) => n.id === edge.source_id);
                const tgtNode = nodes.find((n) => n.id === edge.target_id);
                const relDef = registry.relation_types?.[edge.type];
                const layerDef = registry.layers[edge.layer];
                return (
                  <tr key={edge.id}>
                    <td>{getRelationLabel(edge.type, locale) || label(relDef, edge.type)}</td>
                    <td>{srcNode ? trLabel(srcNode.label) : edge.source_id}</td>
                    <td>{tgtNode ? trLabel(tgtNode.label) : edge.target_id}</td>
                    <td>{label(layerDef, edge.layer)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
