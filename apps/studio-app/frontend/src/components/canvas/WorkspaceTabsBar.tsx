import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Globe, User, FileText, X, GitFork, ChevronDown } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { computeActorSphere } from '../../utils/actorSphere';

interface WorkspaceTabsBarProps {
  onTriggerPhaseNotice: (name: string, phase: string) => void;
}

export const WorkspaceTabsBar: React.FC<WorkspaceTabsBarProps> = ({
  onTriggerPhaseNotice,
}) => {
  const {
    nodes,
    edges,
    totalCaseNodes,
    tabs,
    activeTabId,
    switchTab,
    closeTab,
    candidatesByNodeId,
  } = useGraphStore();
  const { tr, trLabel } = useI18n();

  const tabListRef = useRef<HTMLDivElement>(null);
  const overflowWrapRef = useRef<HTMLDivElement>(null);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Compute node counts for each tab deterministically (include pending extracted candidates on focal evidence nodes)
  const tabCounts = useMemo(() => {
    const counts = new Map<string, number>();
    tabs.forEach((tab) => {
      if (tab.kind === 'master') {
        counts.set(tab.id, totalCaseNodes || nodes.length);
      } else if (tab.focalNodeId) {
        const res = computeActorSphere(nodes, edges, tab.focalNodeId);
        const pendingCandidatesCount = (candidatesByNodeId[tab.focalNodeId] ?? []).filter(
          (c) => c.validation_status === 'PENDING'
        ).length;
        counts.set(tab.id, res.nodeIds.size + pendingCandidatesCount);
      }
    });
    return counts;
  }, [tabs, nodes, edges, totalCaseNodes, candidatesByNodeId]);

  // Detect horizontal overflow when panel narrows or multiple tabs are open
  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth + 2);
    };

    checkOverflow();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [tabs.length]);

  useEffect(() => {
    if (!isOverflowOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (overflowWrapRef.current && !overflowWrapRef.current.contains(e.target as Node)) {
        setIsOverflowOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOverflowOpen(false);
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOverflowOpen]);

  const handleTabListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const tabButtons = Array.from(
      tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    );
    if (tabButtons.length === 0) return;

    const currentIdx = tabButtons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIdx === -1) return;

    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (currentIdx + delta + tabButtons.length) % tabButtons.length;
    const nextBtn = tabButtons[nextIdx];
    nextBtn?.focus();
    nextBtn?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const showOverflowTrigger = hasOverflow || tabs.length > 2;

  return (
    <div className="workspace-tabs-bar">
      <div
        ref={tabListRef}
        role="tablist"
        className="workspace-tabs-list"
        aria-label={tr("Onglets d'enquête et sous-graphes")}
        onKeyDown={handleTabListKeyDown}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const count = tabCounts.get(tab.id) ?? 0;
          const displayTitle =
            tab.kind === 'master' ? tr('Dossier Général') : trLabel(tab.title);
          const focalNode = tab.focalNodeId
            ? nodes.find((n) => n.id === tab.focalNodeId)
            : undefined;
          const isDocFocal = Boolean(
            focalNode &&
              (focalNode.type === 'document_judiciaire' ||
                focalNode.type === 'scelle_numerique' ||
                focalNode.type === 'piece_a_conviction' ||
                focalNode.properties?.is_raw_evidence)
          );

          return (
            <div
              key={tab.id}
              className={`workspace-tab-item-wrap ${isActive ? 'is-active' : ''} ${
                tab.kind === 'actor_sphere' ? 'is-actor-tab' : ''
              }`}
            >
              <button
                type="button"
                role="tab"
                id={`workspace-tab-${tab.id}`}
                aria-selected={isActive}
                className="workspace-tab-btn"
                onClick={() => switchTab(tab.id)}
                title={
                  tab.kind === 'actor_sphere'
                    ? `${displayTitle} — ${tr("Sous-graphe isolé selon l'algorithme Actor Sphere")}`
                    : `${displayTitle} — ${tr("Vue d'ensemble complète du dossier")}`
                }
              >
                {tab.kind === 'master' ? (
                  <Globe size={13} className="workspace-tab-icon" />
                ) : isDocFocal ? (
                  <FileText size={13} className="workspace-tab-icon is-actor" />
                ) : (
                  <User size={13} className="workspace-tab-icon is-actor" />
                )}
                <span className="workspace-tab-title">{displayTitle}</span>
                <span
                  className={`chip font-mono workspace-tab-count ${
                    tab.kind === 'actor_sphere' ? 'is-sphere' : 'chip-neutral'
                  }`}
                >
                  {count}
                </span>
              </button>

              {tab.closable && (
                <button
                  type="button"
                  className="workspace-tab-close-btn"
                  aria-label={tr("Fermer l'onglet {title}", { title: displayTitle })}
                  title={tr("Fermer l'onglet")}
                  onClick={() => closeTab(tab.id)}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Responsive All-Tabs Overflow Switcher & Phase 3 Hook */}
      <div className="workspace-tabs-actions">
        {showOverflowTrigger && (
          <div className="workspace-tabs-overflow-wrap" ref={overflowWrapRef}>
            <button
              type="button"
              className={`btn btn-ghost btn-xs workspace-tabs-overflow-btn ${
                isOverflowOpen ? 'active' : ''
              }`}
              aria-expanded={isOverflowOpen}
              aria-label={tr('Tous les onglets ({n})', { n: tabs.length })}
              title={tr('Afficher tous les onglets ouverts ({n})', { n: tabs.length })}
              onClick={() => setIsOverflowOpen((prev) => !prev)}
            >
              <span className="font-mono">{tabs.length}</span>
              <ChevronDown size={12} />
            </button>

            {isOverflowOpen && (
              <div
                className="workspace-tabs-overflow-menu"
                role="menu"
                aria-label={tr('Onglets ouverts')}
              >
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  const count = tabCounts.get(tab.id) ?? 0;
                  const displayTitle =
                    tab.kind === 'master' ? tr('Dossier Général') : trLabel(tab.title);
                  return (
                    <div
                      key={tab.id}
                      className={`workspace-tabs-overflow-item ${isActive ? 'is-active' : ''}`}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        className="workspace-tabs-overflow-select"
                        onClick={() => {
                          switchTab(tab.id);
                          setIsOverflowOpen(false);
                        }}
                      >
                        {tab.kind === 'master' ? (
                          <Globe size={12} className="workspace-tab-icon" />
                        ) : (
                          <User size={12} className="workspace-tab-icon is-actor" />
                        )}
                        <span className="workspace-tabs-overflow-label">{displayTitle}</span>
                        <span className="chip chip-neutral font-mono">{count}</span>
                      </button>
                      {tab.closable && (
                        <button
                          type="button"
                          className="workspace-tab-close-btn"
                          aria-label={tr("Fermer l'onglet {title}", { title: displayTitle })}
                          onClick={() => closeTab(tab.id)}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab?.kind === 'actor_sphere' && (
          <button
            type="button"
            className="btn btn-ghost btn-xs is-future-phase workspace-tab-phase-hook"
            aria-disabled="true"
            onClick={() =>
              onTriggerPhaseNotice(
                tr("Arbre des Processus & Bassin d'Indices Non-Inclus"),
                'Phase 3'
              )
            }
            title={tr("Supervision de l'arbre des processus EDA et des indices en attente (Phase 3)")}
          >
            <GitFork size={12} />
            <span>{tr('Processus & Bassin')}</span>
            <span className="phase-badge">{tr('Phase {n}', { n: 3 })}</span>
          </button>
        )}
      </div>
    </div>
  );
};
