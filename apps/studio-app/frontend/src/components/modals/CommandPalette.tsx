import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Layers, Activity, Wrench, Database } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import type { ActiveViewMode } from '../canvas/Toolbar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ActiveViewMode) => void;
  onTriggerTool: (toolId: string) => void;
  onTriggerPhaseNotice: (name: string, phase: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: 'node' | 'tool' | 'view' | 'action';
  phase?: string;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onTriggerTool,
  onTriggerPhaseNotice,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { nodes, selectNode } = useGraphStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [
      // Views
      {
        id: 'view-graph',
        title: 'Affichage : Tableau des Indices (Graphe)',
        category: 'view',
        action: () => {
          onSelectView('graph');
          onClose();
        },
      },
      {
        id: 'view-timeline',
        title: 'Affichage : Chronologie Temporelle Forensique',
        category: 'view',
        action: () => {
          onSelectView('timeline');
          onClose();
        },
      },
      {
        id: 'view-map',
        title: 'Affichage : Carte SIG des Bornages & Territoires',
        category: 'view',
        action: () => {
          onSelectView('map');
          onClose();
        },
      },
      {
        id: 'view-table',
        title: 'Affichage : Liste Accessible WCAG AA',
        category: 'view',
        action: () => {
          onSelectView('table');
          onClose();
        },
      },
      {
        id: 'view-audit',
        title: 'Affichage : Registre d’Audit Immuable (ISO 27037)',
        category: 'view',
        action: () => {
          onSelectView('audit');
          onClose();
        },
      },

      // Phase 1 SNA Tools
      {
        id: 'tool-betweenness',
        title: 'SNA : Centralité d’Intermédiarité (Betweenness)',
        category: 'tool',
        phase: 'Phase 1',
        action: () => {
          onTriggerTool('betweenness_centrality');
          onClose();
        },
      },
      {
        id: 'tool-louvain',
        title: 'SNA : Détection de Communautés (Louvain)',
        category: 'tool',
        phase: 'Phase 1',
        action: () => {
          onTriggerTool('louvain');
          onClose();
        },
      },
      {
        id: 'tool-pagerank',
        title: 'SNA : Détection de Mules (PageRank Bipartite)',
        category: 'tool',
        phase: 'Phase 1',
        action: () => {
          onTriggerTool('pagerank');
          onClose();
        },
      },
      {
        id: 'tool-adamic',
        title: 'SNA : Prédiction de Liens (Adamic-Adar)',
        category: 'tool',
        phase: 'Phase 1',
        action: () => {
          onTriggerTool('adamic_adar');
          onClose();
        },
      },

      // Phase 2 / 3 Tools (Phase Gated)
      {
        id: 'tool-whois',
        title: 'OSINT : Historique WHOIS & Enregistrements DNS',
        category: 'tool',
        phase: 'Phase 3',
        action: () => {
          onTriggerPhaseNotice('Historique WHOIS & DNS', 'Phase 3');
          onClose();
        },
      },
      {
        id: 'tool-shodan',
        title: 'OSINT : Scanner de Ports Shodan & Censys',
        category: 'tool',
        phase: 'Phase 3',
        action: () => {
          onTriggerPhaseNotice('Scanner Shodan & Censys', 'Phase 3');
          onClose();
        },
      },
      {
        id: 'tool-cdr',
        title: 'Police : Analyseur de Relevés Télécoms (CDR Excel)',
        category: 'tool',
        phase: 'Phase 2',
        action: () => {
          onTriggerPhaseNotice('Analyseur CDR Excel', 'Phase 2');
          onClose();
        },
      },
      {
        id: 'tool-alpr',
        title: 'Police : Reconnaissance LAPI (Matricules DZ)',
        category: 'tool',
        phase: 'Phase 2',
        action: () => {
          onTriggerPhaseNotice('Reconnaissance LAPI YOLOv8', 'Phase 2');
          onClose();
        },
      },
    ];

    // Add nodes from the current graph
    nodes.slice(0, 30).forEach((node) => {
      list.push({
        id: `node-${node.id}`,
        title: `Nœud : ${node.label} (${node.type})`,
        category: 'node',
        action: () => {
          selectNode(node.id, false);
          onSelectView('graph');
          onClose();
        },
      });
    });

    if (!query.trim()) return list;

    const q = query.toLowerCase();
    return list.filter((item) => item.title.toLowerCase().includes(q));
  }, [query, nodes, onSelectView, onTriggerTool, onTriggerPhaseNotice, selectNode, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Palette de commandes"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{ maxWidth: '640px', padding: 0 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-default)',
            backgroundColor: 'var(--color-bg-elevated)',
          }}
        >
          <Search size={18} style={{ color: 'var(--color-text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher un indice, outil, vue ou commande... (Échap pour fermer)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
              fontSize: 'var(--text-sm)',
              outline: 'none',
            }}
          />
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: 'var(--space-1) 0' }}>
          {items.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
              Aucun résultat correspondant à &quot;{query}&quot;
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isFuture = item.phase && item.phase !== 'Phase 1';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`menu-dropdown-item ${isFuture ? 'is-future-phase' : ''}`}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-accent-primary)' : 'transparent',
                    color: isSelected ? 'var(--color-text-on-accent)' : 'var(--color-text-primary)',
                    padding: 'var(--space-2) var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, overflow: 'hidden' }}>
                    {item.category === 'view' && <Layers size={14} />}
                    {item.category === 'tool' && <Wrench size={14} />}
                    {item.category === 'node' && <Database size={14} />}
                    {item.category === 'action' && <Activity size={14} />}
                    <span style={{ fontSize: 'var(--text-xs)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </span>
                  </div>

                  {item.phase && (
                    <span
                      className="phase-badge"
                      style={{
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-subtle)',
                        color: isSelected ? 'var(--color-text-on-accent)' : 'var(--color-text-muted)',
                      }}
                    >
                      {item.phase}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div
          style={{
            padding: 'var(--space-2) var(--space-4)',
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-canvas)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>↑↓ pour naviguer • Entrée pour sélectionner</span>
          <span>Échap pour fermer</span>
        </div>
      </div>
    </div>
  );
};
