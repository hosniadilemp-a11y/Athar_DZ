import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { API_BASE } from '../../config';
import type { CaseItem } from '../../types/graph';
import { FolderOpen, X, Search, Check } from 'lucide-react';

interface OpenCaseModalProps {
  isOpen: boolean;
  activeCaseId?: string;
  onClose: () => void;
  onSelectCase: (caseItem: CaseItem) => void;
}

export const OpenCaseModal: React.FC<OpenCaseModalProps> = ({
  isOpen,
  activeCaseId,
  onClose,
  onSelectCase,
}) => {
  const { tr, locale } = useI18n();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/v1/cases`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: CaseItem[]) => {
        setCases(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[OpenCaseModal] Fetch error:', err);
        setError(tr('Impossible de récupérer la liste des dossiers depuis le serveur backend.'));
        setIsLoading(false);
      });
  }, [isOpen, tr]);

  if (!isOpen) return null;

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const dateLocale = locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-GB' : 'fr-FR';

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="open-case-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '640px',
          maxWidth: '92vw',
          maxHeight: '85vh',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg-elevated)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-text)',
              }}
            >
              <FolderOpen size={16} />
            </div>
            <div>
              <h2
                id="open-case-modal-title"
                style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}
              >
                {tr('Ouvrir un Dossier Judiciaire')}
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {tr('Sélectionner une affaire enregistrée dans la base PostgreSQL / TimescaleDB')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer')}
            style={{ padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-base)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={tr('Rechercher par code, intitulé d’opération ou mots-clés...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                fontSize: '12.5px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
              }}
            />
            <Search size={14} style={{ position: 'absolute', insetInlineStart: '10px', top: '9px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Cases List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3) var(--space-4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              {tr('Chargement des affaires en cours...')}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-status-danger)', fontSize: '12px' }}>
              {error}
            </div>
          ) : filteredCases.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)', fontSize: '12px' }}>
              {tr('Aucun dossier ne correspond à votre recherche.')}
            </div>
          ) : (
            filteredCases.map((c) => {
              const isActive = activeCaseId === c.id;
              const formattedDate = c.created_at
                ? new Date(c.created_at).toLocaleDateString(dateLocale, { dateStyle: 'medium' })
                : '';

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCase(c);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--color-accent-subtle)' : 'var(--color-bg-elevated)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingInlineEnd: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-surface)',
                          border: '1px solid var(--color-border-default)',
                          color: 'var(--color-accent-text)',
                          fontWeight: 600,
                        }}
                      >
                        {c.code}
                      </span>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {c.title}
                      </span>
                      {isActive && (
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-accent-primary)',
                            color: '#ffffff',
                            fontWeight: 600,
                          }}
                        >
                          {tr('Actif')}
                        </span>
                      )}
                    </div>

                    {c.description && (
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {c.description}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      <span>
                        <strong style={{ color: 'var(--color-text-secondary)' }}>{c.nodes_count ?? 0}</strong> {tr('nœuds')}
                      </span>
                      <span>
                        <strong style={{ color: 'var(--color-text-secondary)' }}>{c.edges_count ?? 0}</strong> {tr('liens')}
                      </span>
                      {formattedDate && <span>{formattedDate}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      style={{ gap: '4px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c);
                        onClose();
                      }}
                    >
                      <Check size={12} />
                      <span>{isActive ? tr('Recharger') : tr('Ouvrir')}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg-elevated)',
            borderTop: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            {tr('{n} dossiers répertoriés', { n: filteredCases.length })}
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            {tr('Fermer')}
          </button>
        </div>
      </div>
    </div>
  );
};
