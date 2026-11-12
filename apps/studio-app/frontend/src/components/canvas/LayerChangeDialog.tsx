import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface LayerChangeDialogProps {
  caseId: string;
}

export const LayerChangeDialog: React.FC<LayerChangeDialogProps> = ({ caseId }) => {
  const { layerChangeModal, closeLayerChangeModal, nodes, executeCommand, setGraphData } = useGraphStore();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!layerChangeModal.isOpen || !layerChangeModal.nodeId || !layerChangeModal.targetLayer) {
    return null;
  }

  const targetNode = nodes.find((n) => n.id === layerChangeModal.nodeId);
  const targetLayer = layerChangeModal.targetLayer;
  const isVerifiedPromotion = targetLayer === 'VERIFIED';

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setErrorMsg('Une justification explicite et non vide est obligatoire pour cette action forensique.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/v1/cases/${caseId}/nodes/${layerChangeModal.nodeId}/layer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          layer: targetLayer,
          reason: reason.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Erreur serveur (${res.status})`);
      }

      const updatedNode = await res.json();
      const previousLayer = targetNode?.layer;

      // Update local node state with reversible command
      executeCommand({
        id: `layer-${updatedNode.id}-${Date.now()}`,
        description: `Promotion de ${updatedNode.label} en ${targetLayer}`,
        undo: () => {
          if (previousLayer) {
            fetch(`/api/v1/cases/${caseId}/nodes/${updatedNode.id}/layer`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ layer: previousLayer, reason: 'Annulation (Undo) utilisateur' }),
            }).then(() => {
              // Refresh graph
              fetch(`/api/v1/cases/${caseId}/graph`)
                .then((r) => r.json())
                .then(setGraphData);
            });
          }
        },
        redo: () => {
          fetch(`/api/v1/cases/${caseId}/nodes/${updatedNode.id}/layer`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ layer: targetLayer, reason: reason.trim() }),
          }).then(() => {
            fetch(`/api/v1/cases/${caseId}/graph`)
              .then((r) => r.json())
              .then(setGraphData);
          });
        },
      });

      // Update in store
      useGraphStore.setState((state) => ({
        nodes: state.nodes.map((n) => (n.id === updatedNode.id ? { ...n, layer: targetLayer } : n)),
      }));

      closeLayerChangeModal();
      setReason('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue lors du changement de couche');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="layer-dialog-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLayerChangeModal();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          width: '480px',
          maxWidth: '90vw',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <ShieldCheck size={24} style={{ color: 'var(--color-layer-1-verified)' }} />
          <h2 id="layer-dialog-title" style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>
            {isVerifiedPromotion ? 'Promotion vers VERIFIED (Scellé judiciaire)' : `Changement de couche vers ${targetLayer}`}
          </h2>
        </div>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Nœud ciblé : <strong>{targetNode?.label}</strong> ({targetNode?.type}).
          {isVerifiedPromotion &&
            ' Conformément à la norme ISO 27037, le classement en preuve judiciaire scellée est irréversible sans contre-expertise et doit être rigoureusement motivé.'}
        </p>

        {errorMsg && (
          <div
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-status-danger)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-status-danger)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <label
          htmlFor="layer-reason-input"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Motivation judiciaire / Justification forensique *
        </label>
        <textarea
          id="layer-reason-input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: PV d'audition n°24/2026, réquisition bancaire confirmée, correspondance ADN..."
          rows={4}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-bg-canvas)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-2)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-sans)',
            resize: 'vertical',
            marginBottom: 'var(--space-6)',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button
            type="button"
            onClick={closeLayerChangeModal}
            disabled={isSubmitting}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
            }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim()}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              backgroundColor: reason.trim() ? 'var(--color-accent-primary)' : 'var(--color-bg-subtle)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
            }}
          >
            {isSubmitting ? 'Enregistrement...' : 'Confirmer et Sceller au Registre'}
          </button>
        </div>
      </div>
    </div>
  );
};
