import React, { useEffect, useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { API_BASE } from '../../config';
import type { LayerId } from '../../types/registry';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const LAYER_OPTIONS: Array<{ id: LayerId; label: string }> = [
  { id: 'VERIFIED', label: '1. Preuve Vérifiée (VERIFIED)' },
  { id: 'OSINT_RAW', label: '2. Renseignement OSINT (OSINT_RAW)' },
  { id: 'INFRA', label: '3. Infrastructures & Forensique (INFRA)' },
  { id: 'HYPOTHESIS', label: '4. Hypothèse Analytique (HYPOTHESIS)' },
  { id: 'FLOWS', label: '5. Flux Financiers & Télécoms (FLOWS)' },
];

interface LayerChangeDialogProps {
  caseId: string;
}

export const LayerChangeDialog: React.FC<LayerChangeDialogProps> = ({ caseId }) => {
  const { layerChangeModal, closeLayerChangeModal, nodes, executeCommand, setGraphData } = useGraphStore();
  const [selectedLayer, setSelectedLayer] = useState<LayerId>('VERIFIED');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const targetNode = nodes.find((n) => n.id === layerChangeModal.nodeId);

  useEffect(() => {
    if (!layerChangeModal.isOpen) return;
    const requested = layerChangeModal.targetLayer;
    if (requested && targetNode && requested !== targetNode.layer) {
      setSelectedLayer(requested);
    } else if (targetNode) {
      setSelectedLayer(targetNode.layer === 'VERIFIED' ? 'HYPOTHESIS' : 'VERIFIED');
    } else if (requested) {
      setSelectedLayer(requested);
    }
    setErrorMsg(null);
  }, [layerChangeModal.isOpen, layerChangeModal.nodeId, layerChangeModal.targetLayer, targetNode]);

  if (!layerChangeModal.isOpen || !layerChangeModal.nodeId || !layerChangeModal.targetLayer) {
    return null;
  }

  const targetLayer = selectedLayer;
  const isVerifiedPromotion = targetLayer === 'VERIFIED';
  const isSameLayer = Boolean(targetNode && targetLayer === targetNode.layer);

  const handleConfirm = async () => {
    if (isSameLayer) {
      setErrorMsg('Veuillez choisir un calque différent du calque actuel du nœud.');
      return;
    }
    if (reason.trim().length < 5) {
      setErrorMsg('Une justification explicite (au moins 5 caractères) est obligatoire pour cette action forensique.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/nodes/${layerChangeModal.nodeId}/layer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          new_layer: targetLayer,
          reason: reason.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg =
          errData?.detail?.message ||
          errData?.error?.message ||
          (typeof errData?.detail === 'string' ? errData.detail : null) ||
          `Erreur serveur (${res.status})`;
        throw new Error(msg);
      }

      const updatedNode = await res.json();
      const previousLayer = targetNode?.layer;
      const savedReason = reason.trim();

      // Update local node state with reversible command
      executeCommand({
        id: `layer-${updatedNode.id}-${Date.now()}`,
        description: `Changement de calque de ${updatedNode.label} vers ${targetLayer}`,
        undo: () => {
          if (previousLayer) {
            fetch(`${API_BASE}/api/v1/cases/${caseId}/nodes/${updatedNode.id}/layer`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-Actor-Id': 'investigator_front',
              },
              body: JSON.stringify({ new_layer: previousLayer, reason: 'Annulation (Undo) utilisateur' }),
            }).then(() => {
              fetch(`${API_BASE}/api/v1/cases/${caseId}/graph`)
                .then((r) => r.json())
                .then(setGraphData);
            });
          }
        },
        redo: () => {
          fetch(`${API_BASE}/api/v1/cases/${caseId}/nodes/${updatedNode.id}/layer`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Actor-Id': 'investigator_front',
            },
            body: JSON.stringify({ new_layer: targetLayer, reason: savedReason }),
          }).then(() => {
            fetch(`${API_BASE}/api/v1/cases/${caseId}/graph`)
              .then((r) => r.json())
              .then(setGraphData);
          });
        },
      });

      // Update node layer everywhere in store and ensure target layer is visible
      useGraphStore.setState((state) => {
        const nextLayers = new Set(state.activeLayers);
        nextLayers.add(targetLayer);
        return {
          nodes: state.nodes.map((n) => (n.id === updatedNode.id ? { ...n, layer: targetLayer } : n)),
          activeLayers: nextLayers,
        };
      });

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
          Nœud ciblé : <strong>{targetNode?.label}</strong> ({targetNode?.type}) — Calque actuel :{' '}
          <strong className="font-mono">{targetNode?.layer}</strong>.
          {isVerifiedPromotion &&
            ' Conformément à la norme ISO 27037, le classement en preuve judiciaire scellée est irréversible sans contre-expertise et doit être rigoureusement motivé.'}
        </p>

        <label
          htmlFor="layer-target-select"
          style={{
            display: 'block',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Nouveau calque cible *
        </label>
        <select
          id="layer-target-select"
          className="select"
          value={selectedLayer}
          onChange={(e) => {
            setSelectedLayer(e.target.value as LayerId);
            setErrorMsg(null);
          }}
          style={{
            width: '100%',
            marginBottom: 'var(--space-4)',
          }}
        >
          {LAYER_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id} disabled={opt.id === targetNode?.layer}>
              {opt.label}{opt.id === targetNode?.layer ? ' (actuel)' : ''}
            </option>
          ))}
        </select>

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
            disabled={isSubmitting || isSameLayer || reason.trim().length < 5}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              backgroundColor:
                !isSameLayer && reason.trim().length >= 5
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-bg-subtle)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-on-accent)',
              cursor: !isSameLayer && reason.trim().length >= 5 ? 'pointer' : 'not-allowed',
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
