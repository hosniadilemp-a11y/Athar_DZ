import React, { useState, useEffect, useRef } from 'react';
import {
  useGraphStore,
  ONTOLOGY_CATEGORY_COLORS,
  NODE_TYPE_TO_CATEGORY,
} from '../../store/useGraphStore';
import { computePersonGraphProjection } from '../../utils/graphLayouts';
import { API_BASE } from '../../config';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import {
  GitBranch,
  ShieldCheck,
  MapPin,
  Wrench,
  X,
  Copy,
  Check,
  Plus,
  Trash2,
  TrendingUp,
  Inbox,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Save,
  Edit3,
  Camera,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import { getRelationLabel } from '../../i18n/phrases/relations';
import { IngestionInspectorSection } from './IngestionInspectorSection';
import { CandidateValidationPanel } from './CandidateValidationPanel';
import { isIngestionModeLive } from '../../utils/fileIngestion';
import type { LocalFileEntry } from '../../utils/localFileStore';

const registry = registryDataRaw as unknown as RegistryData;

const TYPE_EDITABLE_FIELDS: Record<string, Array<{ key: string; label: string; placeholder: string }>> = {
  personne: [
    { key: 'prenom', label: 'Prénom', placeholder: 'ex: Mohamed, Karim...' },
    { key: 'nom', label: 'Nom de famille', placeholder: 'ex: Zerrouki, Hadj...' },
    { key: 'pseudonyme', label: 'Alias / Surnom', placeholder: 'ex: El-Hadj, Lieutenant Pneus...' },
    { key: 'role', label: 'Rôle opérationnel', placeholder: 'ex: Cerveau, Recruteur, Mule...' },
  ],
  vehicule: [
    { key: 'plaque', label: 'Immatriculation', placeholder: 'ex: 01234-116-16...' },
    { key: 'marque', label: 'Marque', placeholder: 'ex: Renault, Dacia, Toyota...' },
    { key: 'modele', label: 'Modèle', placeholder: 'ex: Clio 4, Hilux, Logan...' },
    { key: 'couleur', label: 'Couleur', placeholder: 'ex: Gris métallisé, Blanc, Noir...' },
  ],
  compte_bancaire: [
    { key: 'rip', label: 'Numéro RIP / CCP', placeholder: 'ex: 00799999002345678912...' },
    { key: 'banque', label: 'Établissement bancaire', placeholder: 'ex: Algérie Poste (CCP), BNA, BEA...' },
    { key: 'titulaire', label: 'Nom du titulaire', placeholder: 'ex: Nom et prénom du titulaire...' },
  ],
  telephone: [
    { key: 'numero', label: 'Numéro de ligne', placeholder: 'ex: +213 661 44 12 89...' },
    { key: 'operateur', label: 'Opérateur télécom', placeholder: 'ex: Djezzy, Mobilis, Ooredoo...' },
    { key: 'imei', label: 'Code IMEI terminal', placeholder: 'ex: 864521048291034...' },
  ],
  carte_sim: [
    { key: 'imsi', label: 'Numéro IMSI', placeholder: 'ex: 603010123456789...' },
    { key: 'msisdn', label: 'Numéro MSISDN', placeholder: 'ex: +213 555 12 34 56...' },
    { key: 'operateur', label: 'Opérateur télécom', placeholder: 'ex: Mobilis, Djezzy, Ooredoo...' },
  ],
  compte_social: [
    { key: 'plateforme', label: 'Plateforme réseau', placeholder: 'ex: Facebook, Telegram, WhatsApp...' },
    { key: 'identifiant', label: 'Identifiant / URL', placeholder: 'ex: @amine_pneus_dz...' },
  ],
  adresse_email: [
    { key: 'email', label: 'Adresse courriel', placeholder: 'ex: contact@example.com...' },
    { key: 'fournisseur', label: 'Fournisseur', placeholder: 'ex: Gmail, ProtonMail...' },
  ],
  serveur_c2: [
    { key: 'ip', label: 'Adresse IP', placeholder: 'ex: 185.220.101.5...' },
    { key: 'port', label: 'Port de communication', placeholder: 'ex: 443, 8443...' },
    { key: 'hebergement', label: 'Hébergeur / ASN', placeholder: 'ex: OVH, DigitalOcean...' },
  ],
  wilaya: [
    { key: 'code_wilaya', label: 'Code Wilaya', placeholder: 'ex: 16...' },
    { key: 'nom_fr', label: 'Nom (FR)', placeholder: 'ex: Alger...' },
    { key: 'nom_ar', label: 'Nom (AR)', placeholder: 'ex: الجزائر...' },
  ],
  daira: [
    { key: 'wilaya', label: 'Wilaya de rattachement', placeholder: 'ex: Alger...' },
    { key: 'nom_fr', label: 'Nom Daïra', placeholder: "ex: Sidi M'Hamed..." },
  ],
  commune: [
    { key: 'wilaya', label: 'Wilaya', placeholder: 'ex: Alger...' },
    { key: 'daira', label: 'Daïra', placeholder: "ex: Sidi M'Hamed..." },
    { key: 'nom_fr', label: 'Commune', placeholder: 'ex: Alger Centre...' },
  ],
};

interface InspectorPanelProps {
  onExpand: (hops: number) => void;
  onClose: () => void;
  onTriggerTool?: (toolId: string) => void;
  onTriggerPhaseNotice?: (name: string, phase: string) => void;
  onPreviewFile?: (entry: LocalFileEntry) => void;
  style?: React.CSSProperties;
}

interface InboxClue {
  id: string;
  title: string;
  type: string;
  value: string;
  provenance: string;
  layer: 'OSINT_RAW' | 'INFRA' | 'HYPOTHESIS';
  confidence: number;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  onExpand,
  onClose,
  onTriggerTool,
  onTriggerPhaseNotice,
  onPreviewFile,
  style,
}) => {
  const { t, tr, trLabel, label, locale } = useI18n();
  const {
    activeCase,
    nodes,
    edges,
    activeLayers,
    selectedNodeId,
    selectedNodeIds,
    selectedEdgeId,
    openLayerChangeModal,
    mergeExpandedNodes,
    requestDeleteNodes,
    selectNode,
    updateNodeDetails,
    isPersonOnlyGraph,
    expandedHiddenNodeIds,
    mediatedEdgeOverrides,
    toggleExpandNodeConnections,
    expandMediatedEdgeNodes,
    updateEdgeDetails,
    openIngestionPopover,
    triggerNodeInvestigation,
    runPdfExtraction,
    openActorTab,
    tabs,
    activeTabId,
  } = useGraphStore();

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;
  const isolatedFocalNodeId =
    activeTab?.kind === 'actor_sphere' && activeTab.focalNodeId ? activeTab.focalNodeId : null;

  const toast = useToast();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [copiedDarija, setCopiedDarija] = useState(false);
  const [copiedFrench, setCopiedFrench] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [editConfidence, setEditConfidence] = useState(0.85);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editProps, setEditProps] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(true);

  // Inspector Search & Filter + Accordion Sections
  const [linkSearchTerm, setLinkSearchTerm] = useState('');
  const [linkTypeFilter, setLinkTypeFilter] = useState('ALL');
  const [openInspectorSections, setOpenInspectorSections] = useState({
    identity: true,
    relations: true,
    audio: true,
    metadata: true,
    tools: true,
  });

  const toggleInspectorSection = (section: 'identity' | 'relations' | 'audio' | 'metadata' | 'tools') => {
    setOpenInspectorSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setLinkSearchTerm('');
    setLinkTypeFilter('ALL');
  }, [selectedNodeId]);

  // Edge editing state (Confidence + Judicial Confidentiality + Layer + Notes)
  const [editEdgeConfidence, setEditEdgeConfidence] = useState<number>(0.85);
  const [editEdgeConfidentiality, setEditEdgeConfidentiality] = useState<string>('RESTREINT_ENQUETE');
  const [editEdgeLayer, setEditEdgeLayer] = useState<LayerId>('FLOWS');
  const [editEdgeNotes, setEditEdgeNotes] = useState<string>('');
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const [inboxClues, setInboxClues] = useState<InboxClue[]>([
    {
      id: 'clue-1',
      title: 'Compte BaridiMob Détecté',
      type: 'compte_bancaire',
      value: 'RIP 00799999002345678912',
      provenance: 'Détection de Mules BaridiMob',
      layer: 'INFRA',
      confidence: 0.92,
    },
    {
      id: 'clue-2',
      title: 'Profil Facebook Suspect',
      type: 'compte_social',
      value: 'Amine Import Michelin DZ',
      provenance: 'OSINT Social Media',
      layer: 'OSINT_RAW',
      confidence: 0.88,
    },
    {
      id: 'clue-3',
      title: 'Serveur C2 Localisé',
      type: 'serveur_c2',
      value: '185.220.101.5 (Port 8443)',
      provenance: 'Shodan / Pivots IP',
      layer: 'INFRA',
      confidence: 0.95,
    },
  ]);

  const projection = React.useMemo(() => {
    const layerNodes = activeLayers ? nodes.filter((n) => activeLayers.has(n.layer)) : nodes;
    return computePersonGraphProjection(
      layerNodes,
      edges,
      isPersonOnlyGraph,
      expandedHiddenNodeIds,
      mediatedEdgeOverrides
    );
  }, [nodes, edges, activeLayers, isPersonOnlyGraph, expandedHiddenNodeIds, mediatedEdgeOverrides]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge =
    edges.find((e) => e.id === selectedEdgeId) ||
    projection.visibleEdges.find((e) => e.id === selectedEdgeId);

  // Sync editing fields with selected edge
  useEffect(() => {
    if (selectedEdge) {
      setEditEdgeConfidence(
        typeof selectedEdge.confidence === 'number' ? selectedEdge.confidence : 0.85
      );
      setEditEdgeConfidentiality(
        (selectedEdge.properties?.confidentiality_level as string) || 'RESTREINT_ENQUETE'
      );
      setEditEdgeLayer(selectedEdge.layer);
      setEditEdgeNotes((selectedEdge.properties?.notes as string) || '');
    }
  }, [selectedEdgeId, selectedEdge]);

  // Sync editing fields with selected node and pause audio on node switch
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
      setAudioDuration(0);
    }
    if (selectedNode) {
      setEditLabel(selectedNode.label || '');
      setEditConfidence(selectedNode.confidence ?? 0.85);
      const initialStatus =
        (selectedNode.properties?.status_judiciaire as string) ||
        (selectedNode.properties?.role_judiciaire as string) ||
        '';
      setEditStatus(initialStatus);
      setEditNotes(
        (selectedNode.properties?.notes as string) ||
        (selectedNode.properties?.description as string) ||
        ''
      );
      const props = (selectedNode.properties || {}) as Record<string, unknown>;
      const pMap: Record<string, string> = {};
      Object.entries(props).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          pMap[k] = String(v);
        }
      });
      setEditProps(pMap);
    }
  }, [selectedNodeId, selectedNode]);

  const handleToggleAudio = (audioFile: string) => {
    if (isPlayingAudio) {
      audioPlayerRef.current?.pause();
      setIsPlayingAudio(false);
    } else {
      if (!audioPlayerRef.current || !audioPlayerRef.current.src.endsWith(audioFile)) {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        const audio = new Audio(audioFile);
        audioPlayerRef.current = audio;
        audio.ontimeupdate = () => {
          setAudioCurrentTime(audio.currentTime);
        };
        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration)) {
            setAudioDuration(audio.duration);
          }
        };
        audio.onended = () => {
          setIsPlayingAudio(false);
          setAudioCurrentTime(0);
        };
      }
      audioPlayerRef.current.play().catch((err) => {
        console.warn('Audio playback error:', err);
      });
      setIsPlayingAudio(true);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
    }
  };

  const handleRestartAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
      setAudioCurrentTime(0);
      audioPlayerRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  const formatAudioTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSaveNodeEdits = async () => {
    if (!selectedNode) return;
    setIsSaving(true);
    try {
      await updateNodeDetails(selectedNode.id, {
        label: editLabel.trim() || selectedNode.label,
        confidence: editConfidence,
        properties: {
          ...selectedNode.properties,
          ...editProps,
          status_judiciaire: editStatus,
          role_judiciaire: editStatus,
          notes: editNotes,
        },
      });
      toast.success(tr('Fiche de l\'entité mise à jour dans le dossier judiciaire'), tr('Enregistrement OPJ'));
    } catch {
      toast.error(tr('Échec de la mise à jour des informations'), tr('Erreur'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClueToGraph = (clue: InboxClue) => {
    const newNode = {
      id: `inbox-promoted-${Date.now()}`,
      case_id: 'active',
      type: clue.type,
      layer: clue.layer,
      label: clue.value,
      confidence: clue.confidence,
      provenance: clue.provenance,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      properties: { source_title: clue.title },
      latitude: null,
      longitude: null,
    };
    mergeExpandedNodes([newNode], []);
    selectNode(newNode.id, false);
    setInboxClues((prev) => prev.filter((c) => c.id !== clue.id));
  };

  const handleDismissClue = (clueId: string) => {
    setInboxClues((prev) => prev.filter((c) => c.id !== clueId));
  };

  // 1. Dual Mode: When nothing is selected, render Case Overview KPIs & Clues Inbox
  if (!selectedNode && !selectedEdge) {
    return (
      <aside
        className="panel-right"
        style={style}
        role="complementary"
        aria-label={tr('Synthèse de l\'affaire et boîte des indices')}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-accent-text)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {t.caseOverviewTitle}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer l\'inspecteur')}
          >
            <X size={15} />
          </button>
        </div>

        {/* Phase 2A: Isolated PDF Extracted Candidates Validation (visible even with no node clicked) */}
        {isolatedFocalNodeId && (
          <div style={{ padding: 'var(--space-3)' }}>
            <CandidateValidationPanel sourceNodeId={isolatedFocalNodeId} />
          </div>
        )}

        {/* 4 KPIs Grid matching doc/maquette.html */}
        <div className="overview-kpis-grid">
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiLoss}</span>
            <span className="kpi-value font-mono">{t.kpiLossVal}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiVictims}</span>
            <span className="kpi-value font-mono">{t.kpiVictimsVal}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiLocations}</span>
            <span className="kpi-value font-mono" style={{ fontSize: 'var(--text-xs)' }}>
              {t.kpiLocationsVal}
            </span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiEvidence}</span>
            <span className="kpi-value font-mono text-success">{t.kpiEvidenceVal}</span>
          </div>
        </div>

        {/* Boite d'Arbitrage des Indices (Inbox) */}
        <div className="inbox-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Inbox size={15} style={{ color: 'var(--color-accent-text)' }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {t.inboxTitle}
              </span>
            </div>
            <span className="chip chip-neutral font-mono" style={{ fontSize: 'var(--text-xs)', padding: '1px 5px' }}>
              {tr('{n} en attente', { n: inboxClues.length })}
            </span>
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            {tr('Indices détectés par les outils de collecte nécessitant une décision humaine avant versement au dossier (Review-Run).')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {inboxClues.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-4)',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {tr('Tous les indices ont été arbitrés.')}
              </div>
            ) : (
              inboxClues.map((clue) => (
                <div key={clue.id} className="inbox-item">
                  <div className="inbox-item-meta">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>
                      {trLabel(clue.title)}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {trLabel(clue.value)}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {tr('Source : {src} • Confiance : {pct}%', {
                        src: tr(clue.provenance),
                        pct: Math.round(clue.confidence * 100),
                      })}
                    </span>
                  </div>

                  <div className="inbox-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => handleAddClueToGraph(clue)}
                      style={{ flex: 1 }}
                    >
                      <Plus size={11} />
                      <span>{t.inboxAddToGraph}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDismissClue(clue.id)}
                    >
                      <Trash2 size={11} />
                      <span>{t.inboxDismiss}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            padding: 'var(--space-3)',
            borderTop: '1px solid var(--color-border-subtle)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}
        >
          {tr('Sélectionnez un nœud sur le canevas pour inspecter ses métadonnées forensiques détaillées.')}
        </div>
      </aside>
    );
  }

  // 2. Node Inspector Mode
  if (selectedNode) {
    const typeDef = registry.node_types[selectedNode.type];
    const layerDef = registry.layers[selectedNode.layer];
    const isGps = typeDef?.is_gps_enabled || (selectedNode.latitude !== null && selectedNode.longitude !== null);
    const proposedTools = typeDef?.proposed_tools || [];
    // Dynamic Connections of selected node (Interactive network table)
    const incidentEdges = [
      ...edges
        .filter((e) => e.target_id === selectedNode.id)
        .map((e) => ({
          edge: e,
          direction: 'in' as const,
          neighborId: e.source_id,
          neighbor: nodes.find((n) => n.id === e.source_id),
        })),
      ...edges
        .filter((e) => e.source_id === selectedNode.id)
        .map((e) => ({
          edge: e,
          direction: 'out' as const,
          neighborId: e.target_id,
          neighbor: nodes.find((n) => n.id === e.target_id),
        })),
    ];

    const connectedTypes = Array.from(
      new Set(incidentEdges.map((ie) => ie.neighbor?.type).filter(Boolean) as string[])
    ).sort();

    const filteredIncidentEdges = incidentEdges.filter(({ neighbor, edge }) => {
      if (linkTypeFilter !== 'ALL' && neighbor?.type !== linkTypeFilter) {
        return false;
      }
      if (linkSearchTerm.trim()) {
        const q = linkSearchTerm.toLowerCase().trim();
        const nLabel = (neighbor?.label ? trLabel(neighbor.label) : '').toLowerCase();
        const relLabel = getRelationLabel(edge.type, locale).toLowerCase();
        if (!nLabel.includes(q) && !relLabel.includes(q)) {
          return false;
        }
      }
      return true;
    });

    // Procedural Status and Details (clean, non-hallucinated, strictly evidentiary)
    const isExhibit =
      selectedNode.type === 'enregistrement_vocal' ||
      selectedNode.type === 'document_judiciaire' ||
      selectedNode.type === 'artefact_dfir' ||
      selectedNode.type === 'fichier_apk' ||
      selectedNode.type === 'message_chat';

    const customJudicialStatus =
      (selectedNode.properties?.status_judiciaire as string) ||
      (selectedNode.properties?.role_judiciaire as string) ||
      '';

    const proceduralStatus = customJudicialStatus
      ? trLabel(customJudicialStatus)
      : isExhibit
      ? tr('PIÈCE À CONVICTION SCELLÉE — ISO 27037')
      : null;

    // Clean contextual subtitle (never displays raw UUIDs!)
    const rawSubtitle = (selectedNode.properties?.subtitle as string) || '';
    const locationParts = [
      selectedNode.properties?.commune,
      selectedNode.properties?.wilaya,
    ]
      .filter(Boolean)
      .map((x) => trLabel(String(x)));
    const cleanSubtitle = rawSubtitle
      ? trLabel(rawSubtitle)
      : selectedNode.properties?.rip
      ? `RIP ${String(selectedNode.properties.rip)}`
      : locationParts.length > 0
      ? locationParts.join(' • ')
      : label(typeDef, selectedNode.type);

    // Authentic Darija audio intercepts strictly for audio evidence pieces or nodes with explicit audio
    const getDarijaWiretap = () => {
      const props = (selectedNode.properties || {}) as Record<string, unknown>;
      const explicitAudio = (props.audio_url || props.audioFile || props.audio) as string | undefined;

      // Strictly null if node is not an audio evidence item and has no audio attached
      if (!explicitAudio && selectedNode.type !== 'enregistrement_vocal') {
        return null;
      }

      const rawId = (props.raw_id || props.id || selectedNode.label || '') as string;
      const lowRaw = rawId.toLowerCase();
      const lowLbl = selectedNode.label.toLowerCase();
      let pieceId = 'EVID-A01';
      let defaultAudio = '/audio/evid_a01.wav';

      if (lowRaw.includes('a02') || lowLbl.includes('a-02') || lowLbl.includes('a02') || (explicitAudio && explicitAudio.includes('a02'))) {
        pieceId = 'EVID-A02';
        defaultAudio = '/audio/evid_a02.wav';
      } else if (lowRaw.includes('a03') || lowLbl.includes('a-03') || lowLbl.includes('a03') || (explicitAudio && explicitAudio.includes('a03'))) {
        pieceId = 'EVID-A03';
        defaultAudio = '/audio/evid_a03.wav';
      } else if (lowRaw.includes('a04') || lowLbl.includes('a-04') || lowLbl.includes('a04') || (explicitAudio && explicitAudio.includes('a04'))) {
        pieceId = 'EVID-A04';
        defaultAudio = '/audio/evid_a04.wav';
      } else {
        pieceId = 'EVID-A01';
        defaultAudio = '/audio/evid_a01.wav';
      }

      return {
        id: pieceId,
        audioFile: explicitAudio || defaultAudio,
        speaker: (props.intercept_speaker as string) || (props.speaker as string) || (
          pieceId === 'EVID-A01' ? 'Amine B. (Opérateur Commercial)' :
          pieceId === 'EVID-A02' ? "Tarek H. (« El-Hadj »)" :
          pieceId === 'EVID-A03' ? "Nadia M. (« Dina »)" :
          'Interception Ligne Coordination'
        ),
        target: (props.intercept_target as string) || (props.target as string) || (
          pieceId === 'EVID-A01' ? 'Karim Zerrouki (Victime)' :
          pieceId === 'EVID-A02' ? 'Youcef R. (Lieutenant Pneus)' :
          pieceId === 'EVID-A03' ? 'Comité C2 Direction' :
          'Kamel V. (« Le Caissier »)'
        ),
        channel: (props.intercept_channel as string) || (
          pieceId === 'EVID-A01' ? 'WhatsApp Audio / AMR-NB' :
          pieceId === 'EVID-A02' ? 'Telegram Call / Interception CCO' :
          pieceId === 'EVID-A03' ? 'Telegram Voice / Scellé S-03' :
          'Interception Réseau CCO Algérie'
        ),
        time: (props.audio_duration as string) || (
          pieceId === 'EVID-A01' ? '0:42' :
          pieceId === 'EVID-A02' ? '0:35' :
          pieceId === 'EVID-A03' ? '0:29' :
          '0:24'
        ),
        darija: (props.transcript_darija as string) || (
          pieceId === 'EVID-A01' ? "Khouya Karim, salam alaykoum. Les quatre pneus Michelin rahoum réservés b'smitek fel dépôt taâ Boufarik. Bessah la promo hadhi fiha demande kbira. Versi les 64 000 da f'had le compte BaridiMob li b'ath'toulak, w b'athli le reçu f'WhatsApp..." :
          pieceId === 'EVID-A02' ? "Youcef, smaâni mlih. La cellule pneus rahi t'dirlna 600 000 da par jour had la semaine, c’est bien bessah les plaintes b'daw y'kethrou f'Facebook. Ghleq les trois pages ghedwa s'bah, w khéli Sofiane y'lansi les trois nouveaux sites..." :
          pieceId === 'EVID-A03' ? "Boss, el-hamdullah le nouveau script taâ Sofiane pour les rendez-vous TLS rah yemchi 10/10. Les opérateurs diali f'Constantine jawbou plus de 80 clients had sbeh. Derna 2,4 millions de dinars d'acomptes..." :
          "Allô Kamel, l'argent taâ Oran dkhoul fel BaridiMob... Jebed 200 000 da men la poste taâ Bab El Oued w khéli le reste pour Sofiane..."
        ),
        french: (props.transcript_french as string) || (
          pieceId === 'EVID-A01' ? "Frère Karim, salam alaykoum. Les 4 pneus Michelin sont réservés à ton nom au dépôt de Boufarik. Mais la promo a une forte demande. Verse les 64 000 DZD sur le compte BaridiMob et transmets le reçu..." :
          pieceId === 'EVID-A02' ? "Youcef, écoute-moi bien. La cellule pneus rapporte 600 000 DZD/jour mais les plaintes s'accumulent sur Facebook. Ferme les 3 pages demain matin et laisse Sofiane lancer les 3 nouveaux sites..." :
          pieceId === 'EVID-A03' ? "Boss, le nouveau script de Sofiane pour les rendez-vous TLS marche à 100%. Mes opérateurs à Constantine ont répondu à 80 clients ce matin. Nous avons cumulé 2,4 millions de dinars d'acomptes..." :
          "Allô Kamel, l'argent d'Oran est arrivé sur BaridiMob... Retire 200 000 DZD au bureau de poste de Bab El Oued et laisse le reste pour Sofiane..."
        ),
        match: (props.voiceprint_match as string) || (
          pieceId === 'EVID-A01' ? '96.2%' :
          pieceId === 'EVID-A02' ? '98.7%' :
          pieceId === 'EVID-A03' ? '95.1%' :
          '94.0%'
        ),
        sha256: (props.hash_sha256 as string) || (props.sha256 as string) || (
          pieceId === 'EVID-A01' ? 'be9f4b192ae92f0f57ab7263bdb781458c935e1f6277793d29241220a9da6996' :
          pieceId === 'EVID-A02' ? '350e7515324415d0982afa0314d6b6dea2de59871b70c6ff719fdca953f57552' :
          pieceId === 'EVID-A03' ? '72c3d102eef519234857bdf82109283745a19283746192837461928374619283' :
          '992a76b192837465910283746519283746519283746519283746519283746519'
        ),
      };
    };

    const wiretap = getDarijaWiretap();
    const evidencePhoto =
      (selectedNode.properties?.photo_url as string) ||
      (selectedNode.properties?.photo as string) ||
      (selectedNode.properties?.image_url as string) ||
      null;
    const snaRole = selectedNode.properties?.sna_role;
    const snaScore = selectedNode.properties?.sna_score;

    return (
      <aside
        className="panel-right"
        style={style}
        role="complementary"
        aria-label={tr('Inspecteur de l\'entité {label}', { label: selectedNode.label })}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <NodeIcon name={typeDef?.icon || 'help-circle'} size={18} style={{ color: layerDef?.color }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {label(typeDef, selectedNode.type)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer l\'inspecteur')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* 1. Clean Forensic Identity Card (Consistent, No Raw UUIDs, No Cartoon SVGs) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {evidencePhoto ? (
              <img
                src={evidencePhoto}
                alt={trLabel(selectedNode.label)}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${layerDef?.color || 'var(--color-border-default)'}`,
                  objectFit: 'cover',
                  background: 'var(--color-bg-surface)',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-xs)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: `1.5px solid ${layerDef?.color || 'var(--color-border-default)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: layerDef?.color || 'var(--color-accent-text)',
                  flexShrink: 0,
                }}
              >
                <NodeIcon name={typeDef?.icon || 'help-circle'} size={22} />
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={trLabel(selectedNode.label)}
              >
                {trLabel(selectedNode.label)}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {proceduralStatus ? (
                  <span
                    className="chip"
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      backgroundColor: isExhibit ? 'rgba(16, 185, 129, 0.14)' : 'rgba(59, 130, 246, 0.14)',
                      color: isExhibit ? 'var(--color-status-success)' : 'var(--color-accent-text)',
                      fontWeight: 600,
                    }}
                  >
                    {proceduralStatus}
                  </span>
                ) : (
                  <span
                    className="chip"
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      backgroundColor: 'var(--color-bg-canvas)',
                      borderColor: layerDef?.color || 'var(--color-border-default)',
                      color: layerDef?.color || 'var(--color-text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {label(layerDef, selectedNode.layer)}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={cleanSubtitle}
              >
                {cleanSubtitle}
              </div>
            </div>
          </div>

          {/* Demarcation Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '2px 0' }} />

          {/* Option B: Raw File Ingestion & Analysis Mode Controls */}
          <IngestionInspectorSection
            node={selectedNode}
            onLaunchMode={(nodeId, mode, stageLabel, selectedPlugins) => {
              const fileName = String(selectedNode.properties?.file_name || selectedNode.label || '');
              const mimeType = String(selectedNode.properties?.mime_type || '');
              if (isIngestionModeLive(mode, fileName, mimeType) && (mode === 'quick' || mode === 'step_by_step')) {
                void runPdfExtraction(nodeId, mode, selectedPlugins).catch((err) => {
                  toast.error(err instanceof Error ? err.message : tr('Erreur extraction'), tr('Extraction'));
                });
                return;
              }
              void triggerNodeInvestigation(nodeId, mode, stageLabel);
            }}
            onIsolateNode={(nodeId) => openActorTab(nodeId)}
            onOpenPopover={openIngestionPopover}
            onPreviewFile={onPreviewFile}
            onTriggerPhaseNotice={onTriggerPhaseNotice}
          />

          {/* Phase 2A: Isolated PDF Extracted Candidates Validation */}
          {isolatedFocalNodeId && <CandidateValidationPanel sourceNodeId={isolatedFocalNodeId} />}

          {/* Section 1: Informations & Attributs Modifiables (Priorité Enquêteur) */}
          <div
            className="accordion-group"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <button
              type="button"
              className="accordion-header-btn"
              onClick={() => setIsEditFormOpen((prev) => !prev)}
              aria-expanded={isEditFormOpen}
              style={{
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={13} style={{ color: 'var(--color-accent-text)' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
                  {tr('Informations Modifiables')}
                </span>
              </div>
              <ChevronDown
                size={12}
                style={{
                  transform: isEditFormOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                  color: 'var(--color-text-muted)',
                }}
              />
            </button>

            {isEditFormOpen && (
              <div
                style={{
                  padding: '10px',
                  borderTop: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Libellé */}
                <div>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    {tr("Nom / Libellé de l'entité :")}
                  </label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      padding: '5px 8px',
                      backgroundColor: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Statut Procédural / Rôle Judiciaire */}
                <div>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    {tr('Statut Procédural / Rôle Judiciaire :')}
                  </label>
                  {selectedNode.type === 'personne' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '5px' }}>
                      {['Suspect', 'Victime', 'Témoin', 'Complice', 'Prête-nom / Mule', 'Plaignant'].map((preset) => {
                        const active = editStatus.toLowerCase() === preset.toLowerCase();
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setEditStatus(preset)}
                            style={{
                              fontSize: '10px',
                              padding: '2px 7px',
                              borderRadius: '10px',
                              border: active
                                ? '1px solid var(--color-accent-primary)'
                                : '1px solid var(--color-border-subtle)',
                              backgroundColor: active
                                ? 'var(--color-accent-subtle)'
                                : 'var(--color-bg-canvas)',
                              color: active
                                ? 'var(--color-accent-text)'
                                : 'var(--color-text-muted)',
                              cursor: 'pointer',
                              fontWeight: active ? 700 : 500,
                            }}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <input
                    type="text"
                    value={editStatus}
                    placeholder={tr("ex: Suspect, Témoin assisté, Partie civile...")}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11.5px',
                      padding: '5px 8px',
                      backgroundColor: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Calque Probatoire — Sélecteur unique (ISO 27037 : ouvre la justification vers le calque choisi) */}
                <div>
                  <label
                    htmlFor="inspector-node-layer-select"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <span>{tr('Calque Probatoire :')}</span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--color-text-muted)',
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: layerDef?.color || 'var(--color-text-muted)',
                          border: selectedNode.layer === 'HYPOTHESIS' ? '1px dashed var(--color-layer-4-hypothesis)' : 'none',
                          display: 'inline-block',
                        }}
                      />
                      <span className="font-mono">{selectedNode.layer}</span>
                    </span>
                  </label>
                  <select
                    id="inspector-node-layer-select"
                    className="select select-xs"
                    value={selectedNode.layer}
                    onChange={async (e) => {
                      const nextLayer = e.target.value as LayerId;
                      if (nextLayer === selectedNode.layer) return;

                      // Rule 3 (ISO 27037): Promoting evidence to VERIFIED requires human justification
                      if (nextLayer === 'VERIFIED') {
                        openLayerChangeModal(selectedNode.id, 'VERIFIED');
                        return;
                      }

                      const prevLayer = selectedNode.layer;
                      // Immediate local update across Graph, Timeline, Map, Minimap, Table, and LeftAccordion
                      useGraphStore.setState((state) => {
                        const nextLayers = new Set(state.activeLayers);
                        nextLayers.add(nextLayer);
                        return {
                          nodes: state.nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, layer: nextLayer } : n
                          ),
                          activeLayers: nextLayers,
                        };
                      });

                      if (!activeCase) return;
                      try {
                        const res = await fetch(
                          `${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${selectedNode.id}/layer`,
                          {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-Actor-Id': 'investigator_front',
                            },
                            body: JSON.stringify({
                              new_layer: nextLayer,
                              reason: `Reclassification directe vers ${nextLayer} par l'enquêteur`,
                            }),
                          }
                        );
                        if (!res.ok) {
                          throw new Error(`HTTP ${res.status}`);
                        }
                      } catch {
                        // Revert on server failure
                        useGraphStore.setState((state) => ({
                          nodes: state.nodes.map((n) =>
                            n.id === selectedNode.id ? { ...n, layer: prevLayer } : n
                          ),
                        }));
                        toast.error(tr('Échec de la mise à jour du calque sur le serveur.'));
                      }
                    }}
                    style={{
                      width: '100%',
                      borderColor: layerDef?.color || 'var(--color-border-default)',
                      borderStyle: selectedNode.layer === 'HYPOTHESIS' ? 'dashed' : 'solid',
                    }}
                  >
                    <option value="VERIFIED">{tr('1. Preuve Vérifiée (VERIFIED)')}</option>
                    <option value="OSINT_RAW">{tr('2. Renseignement OSINT (OSINT_RAW)')}</option>
                    <option value="INFRA">{tr('3. Infrastructures & Forensique (INFRA)')}</option>
                    <option value="HYPOTHESIS">{tr('4. Hypothèse Analytique (HYPOTHESIS)')}</option>
                    <option value="FLOWS">{tr('5. Flux Financiers & Télécoms (FLOWS)')}</option>
                  </select>
                </div>

                {/* Certitude Probatoire Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--color-text-secondary)', marginBottom: '2px', fontWeight: 600 }}>
                    <span>{tr('Certitude Probatoire :')}</span>
                    <span className="font-mono" style={{ color: 'var(--color-accent-text)' }}>{Math.round(editConfidence * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={editConfidence}
                    onChange={(e) => setEditConfidence(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)' }}
                  />
                </div>

                {/* Type-Specific Editable Fields (Visible even if not yet populated) */}
                {(TYPE_EDITABLE_FIELDS[selectedNode.type] || []).map((field) => (
                  <div key={field.key}>
                    <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                      {tr(field.label)} :
                    </label>
                    <input
                      type="text"
                      value={editProps[field.key] || ''}
                      placeholder={tr(field.placeholder)}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditProps((prev) => ({ ...prev, [field.key]: val }));
                      }}
                      style={{
                        width: '100%',
                        fontSize: '11.5px',
                        padding: '5px 8px',
                        backgroundColor: 'var(--color-bg-canvas)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-primary)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                {/* Notes d'enquête & Observations */}
                <div>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
                    {tr('Notes Judiciaires & Observations :')}
                  </label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    placeholder={tr("Observations de l'enquêteur, PV d'audition, pièces de procédure...")}
                    onChange={(e) => setEditNotes(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11.5px',
                      padding: '5px 8px',
                      backgroundColor: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Bouton Sauvegarder */}
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  disabled={isSaving}
                  onClick={handleSaveNodeEdits}
                  style={{ gap: '6px', justifyContent: 'center', marginTop: '4px', padding: '6px 12px' }}
                >
                  <Save size={12} />
                  <span>{isSaving ? tr('Enregistrement...') : tr('Enregistrer les modifications')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Official SNA Forensic Qualification Ribbon */}
          {Boolean(snaRole) && (
            <div
              style={{
                padding: 'var(--space-2) var(--space-3)',
                backgroundColor: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid #eab308',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: '#eab308', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#ca8a04', fontWeight: 700 }}>
                    {tr('Qualification Réseau SNA Validée')}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {trLabel(String(snaRole))}
                  </div>
                </div>
              </div>
              {snaScore !== undefined && (
                <span className="chip chip-neutral font-mono text-xs">
                  {typeof snaScore === 'number' ? Math.round(snaScore * 100) + '%' : String(snaScore)}
                </span>
              )}
            </div>
          )}

          {/* Demarcation Divider before Exhibits (Rendered only if Photo or Audio exists) */}
          {Boolean(evidencePhoto || wiretap) && (
            <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '2px 0' }} />
          )}

          {/* Photographic Evidence Exhibit Card */}
          {evidencePhoto && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: 'var(--space-2) var(--space-3)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Camera size={13} style={{ color: 'var(--color-accent-text)' }} />
                  {tr('Cliché & Pièce Photographique Scellée')}
                </span>
                <span className="chip chip-success" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                  {tr('Certifié ISO 27037')}
                </span>
              </div>
              <div style={{ width: '100%', maxHeight: '160px', overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                <img
                  src={evidencePhoto}
                  alt={trLabel(selectedNode.label)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{evidencePhoto.split('/').pop()}</span>
                <a
                  href={evidencePhoto}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--color-accent-text)', textDecoration: 'underline' }}
                >
                  {tr('Agrandir plein écran')}
                </a>
              </div>
            </div>
          )}

          {/* 4. Audio Scellé Intercept Player with Darija Wiretap (Rendered ONLY if audio evidence attached) */}
          {wiretap && (
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={14} style={{ color: 'var(--color-accent-text)' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    {tr('Scellé Audio & Interception')} ({wiretap.id})
                  </span>
                </div>
                <span className="chip font-mono" style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-status-success)' }}>
                  {wiretap.match} {tr('Concordance')}
                </span>
              </div>

              {/* Interlocutors and channel */}
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{tr('Locuteur :')}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{trLabel(wiretap.speaker)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{tr('Cible / Destinataire :')}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{trLabel(wiretap.target)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{tr("Canal d'interception :")}</span>
                  <span style={{ color: 'var(--color-accent-text)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{wiretap.channel}</span>
                </div>
              </div>

              {/* Audio Interactive Player Bar */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '8px',
                  backgroundColor: 'var(--color-bg-canvas)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Play / Pause */}
                  <button
                    type="button"
                    className="btn btn-primary btn-xs"
                    onClick={() => handleToggleAudio(wiretap.audioFile)}
                    style={{ width: '28px', height: '28px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title={isPlayingAudio ? tr('Mettre en pause') : tr("Écouter l'interception")}
                  >
                    {isPlayingAudio ? <Pause size={13} /> : <Play size={13} />}
                  </button>

                  {/* Replay */}
                  <button
                    type="button"
                    className="btn btn-neutral btn-xs"
                    onClick={handleRestartAudio}
                    style={{ width: '26px', height: '26px', padding: 0, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title={tr('Recommencer depuis le début')}
                  >
                    <RotateCcw size={12} />
                  </button>

                  {/* Interactive Seek Bar */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <input
                      type="range"
                      min={0}
                      max={audioDuration > 0 ? audioDuration : 35}
                      step={0.1}
                      value={audioCurrentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        accentColor: 'var(--color-accent-primary)',
                        height: '4px',
                      }}
                      title={tr('Naviguer dans la bande son')}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      <span>{formatAudioTime(audioCurrentTime)}</span>
                      <span>{audioDuration > 0 ? formatAudioTime(audioDuration) : wiretap.time}</span>
                    </div>
                  </div>

                  {/* Download Scellé WAV */}
                  <a
                    href={wiretap.audioFile}
                    download={wiretap.audioFile.split('/').pop()}
                    className="btn btn-neutral btn-xs"
                    style={{ padding: '2px 6px', fontSize: '10.5px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
                    title={tr('Télécharger la pièce à conviction audio originale (WAV)')}
                  >
                    <Download size={11} />
                    <span>WAV</span>
                  </a>
                </div>

                {/* Animated Waveform Bars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '22px', padding: '2px 0' }}>
                  {[6, 12, 18, 10, 16, 8, 20, 14, 9, 17, 11, 15, 7, 19, 13, 8, 16, 11, 18, 14, 10, 16, 12, 8, 15, 11, 7, 14].map((h, i) => {
                    const totalBars = 28;
                    const progressRatio = (audioDuration > 0 ? audioCurrentTime / audioDuration : audioCurrentTime / 35);
                    const isPlayed = (i / totalBars) <= progressRatio;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          const targetTime = ((i / totalBars) * (audioDuration || 35));
                          handleSeek(targetTime);
                        }}
                        style={{
                          flex: 1,
                          height: isPlayingAudio ? `${Math.max(4, (h * (1 + 0.3 * Math.sin(Date.now() / 150 + i)))) % 22}px` : `${h}px`,
                          backgroundColor: isPlayed ? 'var(--color-accent-primary)' : 'var(--color-border-strong)',
                          borderRadius: '1px',
                          cursor: 'pointer',
                          transition: 'height 0.1s ease, background-color 0.15s ease',
                        }}
                        title={`${formatAudioTime((i / totalBars) * (audioDuration || 35))}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Darija Transcript Card with Copy */}
              <div style={{ padding: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-accent-text)' }}>
                    {tr('Transcription Originale (Darija algéroise) :')}
                  </div>
                  <button
                    type="button"
                    className="btn btn-neutral btn-xs"
                    style={{ padding: '1px 5px', fontSize: '10px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(wiretap.darija);
                      setCopiedDarija(true);
                      setTimeout(() => setCopiedDarija(false), 2000);
                      toast.info(tr('Transcription Darija copiée'));
                    }}
                    title={tr('Copier')}
                  >
                    {copiedDarija ? <Check size={10} style={{ color: 'var(--color-status-success)' }} /> : <Copy size={10} />}
                    <span>{copiedDarija ? tr('Copié') : tr('Copier')}</span>
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-text-primary)', fontStyle: 'italic', lineHeight: 1.45 }}>
                  &ldquo;{wiretap.darija}&rdquo;
                </p>
              </div>

              {/* French Judicial Translation with Copy */}
              <div style={{ padding: '8px', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    {tr('Traduction Judiciaire Assermentée (OPJ) :')}
                  </div>
                  <button
                    type="button"
                    className="btn btn-neutral btn-xs"
                    style={{ padding: '1px 5px', fontSize: '10px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(wiretap.french);
                      setCopiedFrench(true);
                      setTimeout(() => setCopiedFrench(false), 2000);
                      toast.info(tr('Traduction assermentée copiée'));
                    }}
                    title={tr('Copier')}
                  >
                    {copiedFrench ? <Check size={10} style={{ color: 'var(--color-status-success)' }} /> : <Copy size={10} />}
                    <span>{copiedFrench ? tr('Copié') : tr('Copier')}</span>
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  &ldquo;{wiretap.french}&rdquo;
                </p>
              </div>

              {/* Integrity Seal Fingerprint */}
              {wiretap.sha256 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9.5px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden' }}>
                  <ShieldCheck size={11} style={{ color: 'var(--color-status-success)', flexShrink: 0 }} />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    SHA-256 : {wiretap.sha256}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Demarcation Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '2px 0' }} />

          {/* 5. Direct Incident Relationships Table (Accordion Group matching Left Menu) */}
          <div className="accordion-group" style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <button
              type="button"
              className="accordion-header-btn"
              onClick={() => toggleInspectorSection('relations')}
              aria-expanded={openInspectorSections.relations}
              style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div className="accordion-title-left" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitBranch size={13} style={{ color: 'var(--color-accent-text)' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
                  {tr('Liaisons Directes')}
                </span>
              </div>
              <div className="accordion-header-right" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="chip chip-neutral font-mono" style={{ fontSize: '10px', padding: '1px 6px' }}>
                  {incidentEdges.length}
                </span>
                <ChevronDown
                  size={12}
                  className={`accordion-chevron ${openInspectorSections.relations ? 'is-open' : ''}`}
                  style={{ transform: openInspectorSections.relations ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--color-text-muted)' }}
                />
              </div>
            </button>

            {openInspectorSections.relations && (
              <div className="accordion-panel-content" style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--color-border-subtle)' }}>
                {incidentEdges.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* Search bar */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Search size={12} style={{ position: 'absolute', left: '8px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        value={linkSearchTerm}
                        onChange={(e) => setLinkSearchTerm(e.target.value)}
                        placeholder={tr('Filtrer par nom ou liaison...')}
                        style={{
                          width: '100%',
                          fontSize: '11px',
                          padding: '4px 6px 4px 24px',
                          backgroundColor: 'var(--color-bg-canvas)',
                          border: '1px solid var(--color-border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                      {linkSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setLinkSearchTerm('')}
                          style={{ position: 'absolute', right: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px' }}
                          title={tr('Effacer')}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    {/* Type Filter Selector with Full Labels & Ontology Colors */}
                    {connectedTypes.length > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', padding: '2px 0' }}>
                        <button
                          type="button"
                          className={`btn btn-xs ${linkTypeFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setLinkTypeFilter('ALL')}
                          style={{ padding: '2px 8px', fontSize: '10px' }}
                        >
                          {tr('Tous')} ({incidentEdges.length})
                        </button>
                        {connectedTypes.map((tKey) => {
                          const tDef = registry.node_types[tKey];
                          const count = incidentEdges.filter((ie) => ie.neighbor?.type === tKey).length;
                          const cat = NODE_TYPE_TO_CATEGORY[tKey];
                          const color = cat ? ONTOLOGY_CATEGORY_COLORS[cat] : 'var(--color-accent-text)';
                          const isSelected = linkTypeFilter === tKey;
                          return (
                            <button
                              key={tKey}
                              type="button"
                              className={`btn btn-xs ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                              onClick={() => setLinkTypeFilter(tKey)}
                              style={{
                                padding: '2px 8px',
                                fontSize: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                borderLeft: `3px solid ${color}`,
                              }}
                            >
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: color,
                                  display: 'inline-block',
                                }}
                              />
                              <span>{tDef?.label_fr || tKey}</span>
                              <span style={{ opacity: 0.8 }}>({count})</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Filter count indicator if filtered */}
                {(linkSearchTerm || linkTypeFilter !== 'ALL') && (
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{tr('Résultats filtrés :')} {filteredIncidentEdges.length} / {incidentEdges.length}</span>
                    <button
                      type="button"
                      onClick={() => { setLinkSearchTerm(''); setLinkTypeFilter('ALL'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent-text)', fontSize: '10px', padding: 0 }}
                    >
                      {tr('Réinitialiser')}
                    </button>
                  </div>
                )}

                {/* Relationships list */}
                {filteredIncidentEdges.length === 0 ? (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-2)' }}>
                    {incidentEdges.length === 0
                      ? tr('Aucune liaison directe incidente.')
                      : tr('Aucune liaison ne correspond au filtre.')}
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {filteredIncidentEdges.map(({ edge, direction, neighborId, neighbor }) => {
                      const neighborDisplay = neighbor?.label ? trLabel(neighbor.label) : tr('Entité');
                      const nType = neighbor?.type || '';
                      const nCat = NODE_TYPE_TO_CATEGORY[nType];
                      const nColor = nCat ? ONTOLOGY_CATEGORY_COLORS[nCat] : 'var(--color-text-muted)';
                      return (
                        <button
                          key={edge.id}
                          type="button"
                          onClick={() => {
                            const store = useGraphStore.getState();
                            // If neighbor is currently hidden in person-only graph, unhide it!
                            if (store.isPersonOnlyGraph && !store.expandedHiddenNodeIds.has(neighborId)) {
                              const nextExpanded = new Set(store.expandedHiddenNodeIds);
                              nextExpanded.add(neighborId);
                              useGraphStore.setState({ expandedHiddenNodeIds: nextExpanded });
                            }
                            // Ensure neighbor's layer is active so it's not hidden
                            if (neighbor && !store.activeLayers.has(neighbor.layer)) {
                              const nextLayers = new Set(store.activeLayers);
                              nextLayers.add(neighbor.layer);
                              useGraphStore.setState({ activeLayers: nextLayers });
                            }
                            selectNode(neighborId);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px',
                            padding: '4px 6px',
                            backgroundColor: 'var(--color-bg-canvas)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '11px',
                          }}
                          title={tr('Inspecter et révéler {label}', { label: neighborDisplay })}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', minWidth: 0 }}>
                            {direction === 'out' ? (
                              <ArrowUpRight size={12} style={{ color: 'var(--color-accent-text)', flexShrink: 0 }} />
                            ) : (
                              <ArrowDownLeft size={12} style={{ color: 'var(--color-status-success)', flexShrink: 0 }} />
                            )}
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: nColor,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              title={neighborDisplay}
                              style={{ fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {neighborDisplay}
                            </span>
                          </div>

                          <span className="chip chip-neutral" style={{ fontSize: '9.5px', padding: '1px 5px', flexShrink: 0 }}>
                            {getRelationLabel(edge.type, locale)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Demarcation Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '2px 0' }} />

          {/* 7. Provenance & GPS Coordinates */}
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>{tr('Provenance : ')}</span>
              <span className="font-mono">{selectedNode.provenance}</span>
            </div>
            {isGps && selectedNode.latitude !== null && selectedNode.longitude !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} style={{ color: 'var(--color-status-info)' }} />
                <span className="font-mono" style={{ fontSize: '11px' }}>
                  {selectedNode.latitude.toFixed(2)}N, {selectedNode.longitude.toFixed(2)}E
                </span>
              </div>
            )}
          </div>

          {/* 8. Specific Metadata Attributes Table (Filtered & Localized) */}
          {(() => {
            const HIDDEN_PROP_KEYS = new Set([
              'raw_id',
              'raw_type',
              'icon',
              'subtitle',
              'photo_url',
              'photo',
              'image_url',
              'audio_url',
              'audioFile',
              'audio',
              'transcript_darija',
              'transcript_french',
              'intercept_speaker',
              'intercept_target',
              'intercept_channel',
              'hash_sha256',
              'sha256',
              'voiceprint_match',
              'audio_duration',
              'sna_role',
              'sna_score',
            ]);
            const PROP_KEY_LABELS: Record<string, string> = {
              wilaya: tr('Wilaya'),
              daira: tr('Daïra'),
              commune: tr('Commune'),
              commune_activity: tr("Commune d'activité"),
              daira_activity: tr("Daïra d'activité"),
              wilaya_activity: tr("Wilaya d'activité"),
              role: tr('Rôle opérationnel'),
              role_judiciaire: tr('Rôle judiciaire'),
              status_judiciaire: tr('Statut judiciaire'),
              implication_level: tr("Niveau d'implication"),
              betweenness_centrality: tr('Centralité (Betweenness)'),
              rip: tr('Compte RIP / CCP'),
              cell: tr('Cellule'),
              turnover: tr("Flux estimé (DZD)"),
              volume_monthly: tr('Volume mensuel'),
              total_damage: tr('Préjudice total (DZD)'),
              status: tr('Statut'),
              used_by: tr('Utilisé par'),
              voice_match: tr('Concordance vocale'),
              notes: tr('Notes'),
              source_title: tr("Source de l'indice"),
            };
            const visibleEntries = Object.entries(selectedNode.properties || {}).filter(
              ([k, v]) => !HIDDEN_PROP_KEYS.has(k) && v !== null && v !== undefined && String(v).trim() !== ''
            );
            if (visibleEntries.length === 0) return null;

            return (
              <div className="accordion-group" style={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  className="accordion-header-btn"
                  onClick={() => toggleInspectorSection('metadata')}
                  aria-expanded={openInspectorSections.metadata}
                  style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="accordion-title-left" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={13} style={{ color: 'var(--color-accent-text)' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
                      {tr('Métadonnées Spécifiques')}
                    </span>
                  </div>
                  <div className="accordion-header-right" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="chip chip-neutral font-mono" style={{ fontSize: '10px', padding: '1px 6px' }}>
                      {visibleEntries.length}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`accordion-chevron ${openInspectorSections.metadata ? 'is-open' : ''}`}
                      style={{ transform: openInspectorSections.metadata ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--color-text-muted)' }}
                    />
                  </div>
                </button>

                {openInspectorSections.metadata && (
                  <div
                    className="accordion-panel-content"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '8px 10px',
                      borderTop: '1px solid var(--color-border-subtle)',
                      maxHeight: '180px',
                      overflowY: 'auto',
                    }}
                  >
                    {visibleEntries.map(([k, v]) => {
                      const displayKey = PROP_KEY_LABELS[k] || k.replace(/_/g, ' ');
                      const displayVal =
                        typeof v === 'number'
                          ? k === 'voice_match' && v <= 1
                            ? `${Math.round(v * 100)}%`
                            : v.toLocaleString()
                          : typeof v === 'object'
                          ? JSON.stringify(v)
                          : trLabel(String(v));
                      return (
                        <div
                          key={k}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-xs)',
                            borderBottom: '1px solid var(--color-border-subtle)',
                            paddingBottom: '3px',
                          }}
                        >
                          <span style={{ color: 'var(--color-text-muted)' }}>{displayKey}</span>
                          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, textAlign: 'right' }} title={String(displayVal)}>
                            {displayVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Demarcation Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '2px 0' }} />

          {/* 9. Core Procedural Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {/* Granular Hidden Entities Expansion Button for this Node */}
            {isPersonOnlyGraph &&
              ((projection.hiddenNeighborCountByNode.get(selectedNode.id) || 0) > 0 ||
                (projection.expandedNeighborCountByNode.get(selectedNode.id) || 0) > 0) && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => toggleExpandNodeConnections(selectedNode.id)}
                  style={{ width: '100%' }}
                >
                  <GitBranch size={13} />
                  <span>
                    {(projection.hiddenNeighborCountByNode.get(selectedNode.id) || 0) > 0
                      ? tr('Déplier toutes ses connexions cachées (+{n})', {
                          n: projection.hiddenNeighborCountByNode.get(selectedNode.id) || 0,
                        })
                      : tr('Replier ses connexions intermédiaires ({n})', {
                          n: projection.expandedNeighborCountByNode.get(selectedNode.id) || 0,
                        })}
                  </span>
                </button>
              )}

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onExpand(1)}
                style={{ flex: 1 }}
              >
                <GitBranch size={13} />
                <span>{tr('Développer 1-hop')}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onExpand(2)}
                style={{ flex: 1 }}
              >
                <GitBranch size={13} />
                <span>{tr('Développer 2-hops')}</span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                const targetIds =
                  selectedNodeIds.includes(selectedNode.id) && selectedNodeIds.length > 1
                    ? selectedNodeIds
                    : [selectedNode.id];
                requestDeleteNodes(targetIds);
              }}
              style={{ width: '100%' }}
            >
              <Trash2 size={13} />
              <span>
                {selectedNodeIds.includes(selectedNode.id) && selectedNodeIds.length > 1
                  ? tr('Supprimer la sélection ({n})', { n: selectedNodeIds.length })
                  : tr('Supprimer ce nœud du graphe')}
              </span>
            </button>
          </div>

          {/* 10. Suggested Forensic Tools */}
          {proposedTools.length > 0 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>
                {tr('Outils OSINT Proposés')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {proposedTools.map((tName) => {
                  const isPhase1 = tName.toLowerCase().includes('betweenness') || tName.toLowerCase().includes('louvain') || tName.toLowerCase().includes('sna');
                  const phaseLabel = isPhase1 ? '1' : '3';

                  return (
                    <button
                      key={tName}
                      type="button"
                      className={`btn btn-secondary btn-xs ${!isPhase1 ? 'is-future-phase' : ''}`}
                      style={{ justifyContent: 'space-between', width: '100%' }}
                      onClick={() => {
                        if (isPhase1) {
                          onTriggerTool?.(tName);
                        } else {
                          onTriggerPhaseNotice?.(tName, `Phase ${phaseLabel}`);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Wrench size={12} style={{ color: isPhase1 ? 'var(--color-accent-text)' : 'var(--color-text-muted)' }} />
                        <span>{tName}</span>
                      </div>
                      <span className="phase-badge">{tr('Phase {n}', { n: phaseLabel })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 3. Edge Inspector Mode (Direct & Mediated Relations + Confidence & Judicial Confidentiality Update)
  if (selectedEdge) {
    const isMediated = Boolean(selectedEdge.properties?.is_mediated);
    const intermediateNodes =
      (selectedEdge.properties?.intermediate_nodes as Array<{
        id: string;
        label: string;
        type: string;
        layer: LayerId;
      }>) || [];
    const intermediateNodeIds =
      (selectedEdge.properties?.intermediate_node_ids as string[]) || [];
    const relTypeDef = registry.relation_types?.[selectedEdge.type];
    const layerDef = registry.layers[editEdgeLayer] || registry.layers[selectedEdge.layer];
    const sourceNode = nodes.find((n) => n.id === selectedEdge.source_id);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target_id);

    const handleSaveEdgeUpdates = () => {
      updateEdgeDetails(selectedEdge.id, {
        confidence: editEdgeConfidence,
        confidentiality_level: editEdgeConfidentiality,
        layer: editEdgeLayer,
        notes: editEdgeNotes,
      });
      toast.success(
        tr('Confiance ({pct}%) et confidentialité de la liaison enregistrées', {
          pct: Math.round(editEdgeConfidence * 100),
        }),
        tr('Qualification de Liaison')
      );
    };

    return (
      <aside
        className="panel-right"
        style={style}
        role="complementary"
        aria-label={tr('Relation sélectionnée')}
      >
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <GitBranch size={16} style={{ color: layerDef?.color }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {isMediated
                ? trLabel((selectedEdge.properties?.summary_label as string) || tr('Relation Médiée'))
                : getRelationLabel(selectedEdge.type, locale) || label(relTypeDef, selectedEdge.type)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer l\'inspecteur de relation')}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            overflowY: 'auto',
          }}
        >
          {/* Endpoints Card */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2) var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
              fontSize: 'var(--text-xs)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">{tr('Source :')}</span>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => sourceNode && selectNode(sourceNode.id, false)}
              >
                <span style={{ fontWeight: 600 }}>{sourceNode ? trLabel(sourceNode.label) : tr('Entité')}</span>
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">{tr('Cible :')}</span>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => targetNode && selectNode(targetNode.id, false)}
              >
                <span style={{ fontWeight: 600 }}>{targetNode ? trLabel(targetNode.label) : tr('Entité')}</span>
              </button>
            </div>
          </div>

          {/* If Mediated Link: List Intermediate Hidden Entities & Expand Relation Button */}
          {isMediated && intermediateNodes.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-accent-border)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent-text)' }}>
                {tr('Entités intermédiaires repliées ({n})', { n: intermediateNodes.length })}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {intermediateNodes.map((inNode) => {
                  const tDef = registry.node_types[inNode.type];
                  return (
                    <div
                      key={inNode.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 6px',
                        backgroundColor: 'var(--color-bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-subtle)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <NodeIcon name={tDef?.icon || 'help-circle'} size={13} />
                        <span style={{ fontWeight: 600 }}>{trLabel(inNode.label)}</span>
                      </div>
                      <span className="chip chip-neutral font-mono text-xs">
                        {label(tDef, inNode.type)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => expandMediatedEdgeNodes(intermediateNodeIds)}
                style={{ width: '100%' }}
              >
                <GitBranch size={13} />
                <span>
                  {tr('Déplier cette relation ({n} entités)', { n: intermediateNodes.length })}
                </span>
              </button>
            </div>
          )}

          {/* 1. Edge Confidence Score (0% - 100%) */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                {tr('Score de Confiance du Lien')}
              </span>
              <span className="chip chip-neutral font-mono text-xs">
                {Math.round(editEdgeConfidence * 100)}%
              </span>
            </div>
            <input
              type="range"
              className="timeline-range-input"
              min={0}
              max={100}
              step={1}
              value={Math.round(editEdgeConfidence * 100)}
              onChange={(e) => setEditEdgeConfidence(Number(e.target.value) / 100)}
              aria-label={tr('Modifier le score de confiance du lien')}
            />
            <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'space-between' }}>
              {[0.25, 0.5, 0.75, 0.9, 1.0].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`btn btn-xs ${
                    Math.abs(editEdgeConfidence - preset) < 0.02 ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => setEditEdgeConfidence(preset)}
                  style={{ flex: 1 }}
                >
                  {Math.round(preset * 100)}%
                </button>
              ))}
            </div>
          </div>

          {/* 2. Judicial Confidentiality Level & Forensic Layer */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <span>{tr('Niveau de Confidentialité Judiciaire')}</span>
              <select
                className="select select-xs"
                value={editEdgeConfidentiality}
                onChange={(e) => setEditEdgeConfidentiality(e.target.value)}
              >
                <option value="PUBLIC_OSINT">{tr('Public / Source Ouverte (OSINT)')}</option>
                <option value="RESTREINT_ENQUETE">{tr('Restreint Enquête (Police Judiciaire)')}</option>
                <option value="CONFIDENTIEL_INSTRUCTION">{tr('Confidentiel Instruction (Magistrat)')}</option>
                <option value="SECRET_JUDICIAIRE">{tr('Secret Judiciaire Scellé (ISO 27037)')}</option>
              </select>
            </label>

            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <span>{tr('Calque Probatoire de la Relation')}</span>
              <select
                className="select select-xs"
                value={editEdgeLayer}
                onChange={(e) => setEditEdgeLayer(e.target.value as LayerId)}
              >
                <option value="VERIFIED">{tr('1. Preuve Vérifiée (VERIFIED)')}</option>
                <option value="OSINT_RAW">{tr('2. Renseignement OSINT (OSINT_RAW)')}</option>
                <option value="INFRA">{tr('3. Infrastructures & Forensique (INFRA)')}</option>
                <option value="HYPOTHESIS">{tr('4. Hypothèse Analytique (HYPOTHESIS)')}</option>
                <option value="FLOWS">{tr('5. Flux Financiers & Télécoms (FLOWS)')}</option>
              </select>
            </label>

            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
              }}
            >
              <span>{tr('Notes & Justification Probatoire')}</span>
              <input
                type="text"
                className="input input-xs"
                placeholder={tr('Motif ou référence de pièce...')}
                value={editEdgeNotes}
                onChange={(e) => setEditEdgeNotes(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSaveEdgeUpdates}
              style={{ width: '100%', marginTop: 'var(--space-1)' }}
            >
              <Save size={13} />
              <span>{tr('Enregistrer Confiance & Confidentialité')}</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
