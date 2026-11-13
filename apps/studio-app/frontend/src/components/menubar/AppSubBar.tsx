import React from 'react';
import { FolderLock, ShieldAlert, Search, ChevronDown } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import type { CaseItem } from '../../types/graph';

interface AppSubBarProps {
  activeCase: CaseItem | null;
  onOpenCaseProps: () => void;
  onOpenCommandPalette: () => void;
  onTriggerPhaseNotice: (name: string, phase: string) => void;
}

export const AppSubBar: React.FC<AppSubBarProps> = ({
  activeCase,
  onOpenCaseProps,
  onOpenCommandPalette,
  onTriggerPhaseNotice,
}) => {
  const { t } = useI18n();

  return (
    <header className="app-subbar" role="banner">
      <div className="subbar-left">
        {/* Case Selector Button */}
        <button
          type="button"
          className="case-selector-btn"
          onClick={onOpenCaseProps}
          aria-label={t.caseSelectorTitle}
        >
          <FolderLock size={14} style={{ color: 'var(--color-accent-text)' }} />
          <span className="font-mono text-xs" style={{ fontWeight: 600 }}>
            {activeCase?.code || 'Dossier #2026-SCAM-089'}
          </span>
          <span className="chip chip-neutral" style={{ fontSize: 'var(--text-xs)', padding: '1px 6px' }}>
            {activeCase?.title || 'Cyber-Escroquerie Commerciale'}
          </span>
          <ChevronDown size={12} style={{ color: 'var(--color-text-muted)' }} />
        </button>

        {/* Stealth Warning Badge (Phase 3 Egress Tiers) */}
        <button
          type="button"
          className="stealth-alert-badge is-future-phase"
          onClick={() => onTriggerPhaseNotice('Mode Furtif & Egress WireGuard', 'Phase 3')}
          title="Protection Anti-Ban / Stealth OPSEC (Planifié Phase 3)"
        >
          <ShieldAlert size={13} />
          <span>{t.stealthWarning}</span>
          <span className="phase-badge">Phase 3</span>
        </button>
      </div>

      <div className="subbar-right">
        {/* Command Palette Trigger Search Bar */}
        <div className="subbar-search-container">
          <button
            type="button"
            className="topbar-search-bar"
            onClick={onOpenCommandPalette}
            aria-label="Rechercher des indices, suspects ou lancer un outil (Ctrl+K)"
          >
            <div className="search-bar-inner">
              <Search size={13} style={{ color: 'var(--color-text-muted)' }} />
              <span>{t.searchPlaceholder}</span>
            </div>
            <span className="cmd-kbd-shortcut">Ctrl+K</span>
          </button>
        </div>
      </div>
    </header>
  );
};
