import React, { useState, useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';
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
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';

const registry = registryDataRaw as unknown as RegistryData;

interface InspectorPanelProps {
  onExpand: (hops: number) => void;
  onClose: () => void;
  onTriggerTool?: (toolId: string) => void;
  onTriggerPhaseNotice?: (name: string, phase: string) => void;
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
  style,
}) => {
  const { t, tr, label } = useI18n();
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    openLayerChangeModal,
    mergeExpandedNodes,
    deleteNode,
    selectNode,
    updateNodeDetails,
  } = useGraphStore();

  const toast = useToast();
  const [copiedHash, setCopiedHash] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [copiedDarija, setCopiedDarija] = useState(false);
  const [copiedFrench, setCopiedFrench] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [editConfidence, setEditConfidence] = useState(0.85);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

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

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
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
                      {clue.title}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {clue.value}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {tr('Source : {src} • Confiance : {pct}%', {
                        src: clue.provenance,
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
    const dummyHash = `sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`;

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

    // Procedural Status and Details
    const lbl = selectedNode.label.toLowerCase();
    const isBoss = lbl.includes('tarek') || lbl.includes('hadj');
    const isLt = lbl.includes('youcef') || lbl.includes('nadia') || lbl.includes('farid') || lbl.includes('kamel') || lbl.includes('sofiane');
    const isVictim = lbl.includes('karim') || lbl.includes('meriem') || lbl.includes('djamel') || lbl.includes('rachid') || lbl.includes('tahar') || lbl.includes('mourad');

    const proceduralStatus = isBoss
      ? 'MANDAT D\'ARRÊT INTERPOL — RED NOTICE'
      : isLt
      ? 'GARDE À VUE 48H — CCO ALGER'
      : isVictim
      ? 'PARTIE CIVILE — PLAINTE DÉPOSÉE'
      : selectedNode.type === 'compte_bancaire'
      ? 'GEL AML CONSERVATOIRE — ALGÉRIE POSTE'
      : selectedNode.type === 'vehicule'
      ? 'VÉHICULE EN FUITE — AVIS DE RECHERCHE'
      : 'SCIS-TIC / SOUS SURVEILLANCE';

    // Authentic Darija audio intercepts matching Candy Wheels case (Strictly connected entities)
    const getDarijaWiretap = () => {
      const props = (selectedNode.properties || {}) as Record<string, unknown>;
      const explicitAudio = (props.audio_url || props.audioFile || props.audio) as string | undefined;

      // 1. Direct audio evidence node or node with explicit audio URL
      if (explicitAudio || selectedNode.type === 'enregistrement_vocal') {
        const rawId = (props.raw_id || props.id || selectedNode.label || '') as string;
        const lowRaw = rawId.toLowerCase();
        const lowLbl = lbl.toLowerCase();
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
      }

      // 2. Interlocutors mapped when selected in graph
      if (lbl.includes('karim') || lbl.includes('zerrouki') || lbl.includes('amine') || lbl.includes('555 019')) {
        return {
          id: 'EVID-A01',
          audioFile: '/audio/evid_a01.wav',
          speaker: 'Amine B. (Opérateur Commercial)',
          target: 'Karim Zerrouki (+213 661 44 12 89)',
          channel: 'WhatsApp Audio / AMR-NB',
          time: '0:42',
          darija: "Khouya Karim, salam alaykoum. Les quatre pneus Michelin rahoum réservés b'smitek fel dépôt taâ Boufarik. Bessah la promo hadhi fiha demande kbira. Versi les 64 000 da f'had le compte BaridiMob li b'ath'toulak, w b'athli le reçu f'WhatsApp...",
          french: "Frère Karim, salam alaykoum. Les 4 pneus Michelin sont réservés à ton nom au dépôt de Boufarik. Mais la promo a une forte demande. Verse les 64 000 DZD sur le compte BaridiMob et transmets le reçu...",
          match: '96.2%',
          sha256: 'be9f4b192ae92f0f57ab7263bdb781458c935e1f6277793d29241220a9da6996',
        };
      }
      if (isBoss || lbl.includes('tarek') || lbl.includes('hadj') || lbl.includes('youcef')) {
        return {
          id: 'EVID-A02',
          audioFile: '/audio/evid_a02.wav',
          speaker: "Tarek H. (« El-Hadj »)",
          target: "Youcef R. (Lieutenant Pneus)",
          channel: 'Telegram Call / Interception CCO',
          time: '0:35',
          darija: "Youcef, smaâni mlih. La cellule pneus rahi t'dirlna 600 000 da par jour had la semaine, c’est bien bessah les plaintes b'daw y'kethrou f'Facebook. Ghleq les trois pages ghedwa s'bah, w khéli Sofiane y'lansi les trois nouveaux sites...",
          french: "Youcef, écoute-moi bien. La cellule pneus rapporte 600 000 DZD/jour mais les plaintes s'accumulent sur Facebook. Ferme les 3 pages demain matin et laisse Sofiane lancer les 3 nouveaux sites...",
          match: '98.7%',
          sha256: '350e7515324415d0982afa0314d6b6dea2de59871b70c6ff719fdca953f57552',
        };
      }
      if (lbl.includes('nadia') || lbl.includes('dina') || lbl.includes('meriem') || lbl.includes('sofiane')) {
        return {
          id: 'EVID-A03',
          audioFile: '/audio/evid_a03.wav',
          speaker: "Nadia M. (« Dina »)",
          target: "Comité C2 Direction",
          channel: 'Telegram Voice / Scellé S-03',
          time: '0:29',
          darija: "Boss, el-hamdullah le nouveau script taâ Sofiane pour les rendez-vous TLS rah yemchi 10/10. Les opérateurs diali f'Constantine jawbou plus de 80 clients had sbeh. Derna 2,4 millions de dinars d'acomptes...",
          french: "Boss, le nouveau script de Sofiane pour les rendez-vous TLS marche à 100%. Mes opérateurs à Constantine ont répondu à 80 clients ce matin. Nous avons cumulé 2,4 millions de dinars d'acomptes...",
          match: '95.1%',
          sha256: '72c3d102eef519234857bdf82109283745a19283746192837461928374619283',
        };
      }
      if (lbl.includes('kamel') || lbl.includes('oran') || lbl.includes('bab el oued')) {
        return {
          id: 'EVID-A04',
          audioFile: '/audio/evid_a04.wav',
          speaker: 'Interception Ligne Coordination',
          target: "Kamel V. (« Le Caissier »)",
          channel: 'Interception Réseau CCO Algérie',
          time: '0:24',
          darija: "Allô Kamel, l'argent taâ Oran dkhoul fel BaridiMob... Jebed 200 000 da men la poste taâ Bab El Oued w khéli le reste pour Sofiane...",
          french: "Allô Kamel, l'argent d'Oran est arrivé sur BaridiMob... Retire 200 000 DZD au bureau de poste de Bab El Oued et laisse le reste pour Sofiane...",
          match: '94.0%',
          sha256: '992a76b192837465910283746519283746519283746519283746519283746519',
        };
      }
      // Strictly null for all other entities (cars, ips, bts, accounts, etc.)
      return null;
    };

    const wiretap = getDarijaWiretap();
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
          {/* 1. Procedural Forensic Identity Card (Portrait & Legal Details) */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {/* SVG Forensic Avatar */}
            {selectedNode.type === 'personne' ? (
              <svg width="68" height="68" viewBox="0 0 100 100" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', background: '#1e293b', flexShrink: 0 }}>
                <line x1="8" y1="20" x2="92" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="8" y1="35" x2="92" y2="35" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="8" y1="50" x2="92" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                <text x="90" y="23" fill="#64748b" fontSize="6" textAnchor="end">185cm</text>
                <text x="90" y="38" fill="#64748b" fontSize="6" textAnchor="end">175cm</text>
                <text x="90" y="53" fill="#64748b" fontSize="6" textAnchor="end">165cm</text>
                <path d="M20,95 Q20,70 50,70 Q80,70 80,95 Z" fill={isVictim ? '#2563eb' : '#dc2626'} opacity="0.85" />
                <rect x="44" y="55" width="12" height="18" fill="#cbd5e1" />
                <ellipse cx="50" cy="42" rx="16" ry="20" fill="#f1f5f9" />
                <path d="M32,38 Q35,22 50,22 Q65,22 68,38 Q60,26 50,26 Q40,26 32,38 Z" fill="#1e293b" />
                <circle cx="44" cy="42" r="2.2" fill="#0f172a" />
                <circle cx="56" cy="42" r="2.2" fill="#0f172a" />
                <line x1="50" y1="44" x2="50" y2="49" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="46" y1="53" x2="54" y2="53" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="10" y="83" width="80" height="13" rx="2" fill="rgba(15, 23, 42, 0.95)" />
                <text x="50" y="92" fill={isVictim ? '#60a5fa' : '#ef4444'} fontSize="6.5" fontWeight="bold" textAnchor="middle">
                  {isVictim ? 'VICTIME' : 'SUSPECT'}
                </text>
              </svg>
            ) : selectedNode.type === 'vehicule' ? (
              <svg width="68" height="68" viewBox="0 0 100 100" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', background: '#0f172a', flexShrink: 0 }}>
                <path d="M15,62 L25,44 Q35,30 50,30 L68,30 Q78,44 85,62 Z" fill="#2563eb" opacity="0.9" />
                <rect x="12" y="60" width="76" height="15" rx="3" fill="#1e293b" />
                <circle cx="30" cy="75" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="70" cy="75" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                <rect x="34" y="65" width="32" height="8" rx="1" fill="#f8fafc" />
                <text x="50" y="71" fill="#0f172a" fontSize="5" fontWeight="bold" textAnchor="middle">12345 126 16</text>
              </svg>
            ) : selectedNode.type === 'compte_bancaire' ? (
              <svg width="68" height="68" viewBox="0 0 100 100" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', background: 'linear-gradient(135deg, #b45309, #78350f)', flexShrink: 0 }}>
                <rect x="10" y="20" width="80" height="60" rx="6" fill="#b45309" stroke="#fef3c7" strokeWidth="1" />
                <rect x="20" y="32" width="16" height="13" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                <text x="20" y="64" fill="#fef3c7" fontSize="6.5" fontWeight="bold" fontFamily="monospace">00799999...</text>
                <text x="75" y="32" fill="#fff" fontSize="6" fontWeight="bold">BaridiMob</text>
              </svg>
            ) : selectedNode.type === 'telephone' ? (
              <svg width="68" height="68" viewBox="0 0 100 100" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', background: '#1e293b', flexShrink: 0 }}>
                <rect x="30" y="15" width="40" height="70" rx="5" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                <rect x="34" y="23" width="32" height="50" rx="2" fill="#0f172a" />
                <circle cx="50" cy="78" r="2.5" fill="#94a3b8" />
                <line x1="45" y1="18" x2="55" y2="18" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <path d="M42,40 Q50,33 58,40" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
                <path d="M38,45 Q50,35 62,45" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
              </svg>
            ) : (
              <svg width="68" height="68" viewBox="0 0 100 100" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', background: '#1e293b', flexShrink: 0 }}>
                <circle cx="50" cy="50" r="28" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <text x="50" y="55" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle">DZ</text>
              </svg>
            )}

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedNode.label}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="chip" style={{ fontSize: '10px', padding: '1px 5px', backgroundColor: isVictim ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isVictim ? '#3b82f6' : '#ef4444', fontWeight: 600 }}>
                  {proceduralStatus}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                {selectedNode.type === 'personne'
                  ? 'NIN 1982 1601 0023 4851 22'
                  : selectedNode.type === 'compte_bancaire'
                  ? 'RIP 00799999002148593214'
                  : selectedNode.type === 'vehicule'
                  ? 'Plaque : 12345 126 16'
                  : selectedNode.type === 'telephone'
                  ? 'MSISDN +213 555 019 283 • Ooredoo DZ'
                  : selectedNode.id}
              </div>
            </div>
          </div>

          {/* 2. Official SNA Forensic Qualification Ribbon */}
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
                    Qualification Réseau SNA Validée
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {String(snaRole)}
                  </div>
                </div>
              </div>
              {snaScore !== undefined && (
                <span className="chip chip-neutral font-mono text-xs">
                  Score : {typeof snaScore === 'number' ? Math.round(snaScore * 100) + '%' : String(snaScore)}
                </span>
              )}
            </div>
          )}

          {/* 3. Layer and Confidence Badges */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span
              className="chip"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: layerDef?.color || 'var(--color-border-default)',
                color: layerDef?.color,
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
              }}
            >
              {tr('COUCHE : {layer}', { layer: label(layerDef, selectedNode.layer) })}
            </span>

            {selectedNode.confidence !== null && (
              <span
                className="chip chip-neutral font-mono"
                style={{ fontSize: 'var(--text-xs)' }}
                title={tr('Confiance analytique calculée par l\'algorithme ou l\'enquêteur')}
              >
                {tr('CONFIANCE : {pct}%', { pct: Math.round(selectedNode.confidence * 100) })}
              </span>
            )}
          </div>

          {/* 3b. Quick Interactive Entity Editor (Label, Status, Notes, Confidence) */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                <Edit3 size={12} style={{ color: 'var(--color-accent-text)' }} />
                <span>{tr('Édition Fiche Entité')}</span>
              </div>
              <span className="chip chip-neutral font-mono text-xs">OPJ / Procédure</span>
            </div>

            {/* Libellé */}
            <div>
              <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                {tr('Nom / Libellé de l\'entité :')}
              </label>
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '4px 8px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Statut Judiciaire / Procédural */}
            <div>
              <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                {tr('Statut Judiciaire / Mandat :')}
              </label>
              <input
                type="text"
                value={editStatus}
                placeholder="ex: Mandat d'arrêt Interpol, Garde à vue 48h, Scellé sous main de justice..."
                onChange={(e) => setEditStatus(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '11.5px',
                  padding: '4px 8px',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Confiance Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                <span>{tr('Certitude Probatoire :')}</span>
                <span className="font-mono">{Math.round(editConfidence * 100)}%</span>
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

            {/* Notes d'enquête */}
            <div>
              <label style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                {tr('Notes Judiciaires & Observations :')}
              </label>
              <textarea
                rows={2}
                value={editNotes}
                placeholder="Observations des services d'enquête, pièces de procédure..."
                onChange={(e) => setEditNotes(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '11.5px',
                  padding: '4px 8px',
                  backgroundColor: 'var(--color-bg-surface)',
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
              style={{ gap: '6px', justifyContent: 'center', marginTop: '2px' }}
            >
              <Save size={12} />
              <span>{isSaving ? tr('Enregistrement...') : tr('Enregistrer dans le Dossier')}</span>
            </button>
          </div>

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
                    Scellé Audio &amp; Interception ({wiretap.id})
                  </span>
                </div>
                <span className="chip font-mono" style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-status-success)' }}>
                  {wiretap.match} Concordance
                </span>
              </div>

              {/* Interlocutors and channel */}
              <div style={{ padding: '6px 8px', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Locuteur :</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{wiretap.speaker}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cible / Destinataire :</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{wiretap.target}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Canal d'interception :</span>
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
                    title={isPlayingAudio ? 'Mettre en pause' : 'Écouter l\'interception'}
                  >
                    {isPlayingAudio ? <Pause size={13} /> : <Play size={13} />}
                  </button>

                  {/* Replay */}
                  <button
                    type="button"
                    className="btn btn-neutral btn-xs"
                    onClick={handleRestartAudio}
                    style={{ width: '26px', height: '26px', padding: 0, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title="Recommencer depuis le début"
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
                      title="Naviguer dans la bande son"
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
                    title="Télécharger la pièce à conviction audio originale (WAV)"
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
                        title={`Sauter à ${formatAudioTime((i / totalBars) * (audioDuration || 35))}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Darija Transcript Card with Copy */}
              <div style={{ padding: '8px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-accent-text)' }}>
                    Transcription Originale (Darija algéroise) :
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
                    title="Copier la transcription"
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
              <div style={{ padding: '8px', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    Traduction Judiciaire Assermentée (OPJ) :
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
                    title="Copier la traduction"
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

          {/* 5. Direct Incident Relationships Table (Interactive Graph Navigation) */}
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitBranch size={13} style={{ color: 'var(--color-accent-text)' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Liaisons Directes ({incidentEdges.length})
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                Cliquer pour inspecter
              </span>
            </div>

            {incidentEdges.length === 0 ? (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-2)' }}>
                Aucune liaison directe incidente.
              </div>
            ) : (
              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {incidentEdges.map(({ edge, direction, neighborId, neighbor }) => (
                  <button
                    key={edge.id}
                    type="button"
                    onClick={() => selectNode(neighborId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-canvas)',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '11px',
                    }}
                    title={`Inspecter ${neighbor?.label || neighborId}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                      {direction === 'out' ? (
                        <ArrowUpRight size={12} style={{ color: 'var(--color-accent-text)', flexShrink: 0 }} />
                      ) : (
                        <ArrowDownLeft size={12} style={{ color: 'var(--color-status-success)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {neighbor?.label || neighborId}
                      </span>
                    </div>

                    <span className="chip chip-neutral font-mono" style={{ fontSize: '9.5px', padding: '1px 4px' }}>
                      {edge.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. SHA-256 Hash Chip with Copy */}
          <div
            style={{
              padding: 'var(--space-2)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                {tr('Empreinte Scellée (SHA-256)')}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-layer-1-verified)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {dummyHash}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => handleCopyHash(dummyHash)}
              title={tr('Copier l\'empreinte SHA-256')}
            >
              {copiedHash ? <Check size={13} style={{ color: 'var(--color-status-success)' }} /> : <Copy size={13} />}
            </button>
          </div>

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

          {/* 8. Specific Metadata Attributes Table */}
          {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>
                {tr('Métadonnées Spécifiques')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                  maxHeight: '140px',
                  overflowY: 'auto',
                }}
              >
                {Object.entries(selectedNode.properties).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-xs)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      paddingBottom: '2px',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{k}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. Core Procedural Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => openLayerChangeModal(selectedNode.id, selectedNode.layer)}
              style={{ width: '100%' }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--color-layer-1-verified)' }} />
              <span>{tr('Changer de Calque (Justification Obligatoire)')}</span>
            </button>

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
              onClick={() => deleteNode(selectedNode.id)}
              style={{ width: '100%' }}
            >
              <Trash2 size={13} />
              <span>{tr('Supprimer ce nœud du graphe')}</span>
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

  // 3. Edge Inspector Mode
  if (selectedEdge) {
    const relTypeDef = registry.relation_types?.[selectedEdge.type];
    const layerDef = registry.layers[selectedEdge.layer];
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
              {label(relTypeDef, selectedEdge.type)}
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

        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>
              {tr('Type de relation : {type}', { type: label(relTypeDef, selectedEdge.type) })}
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {selectedEdge.type}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span
              className="chip"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: layerDef?.color || 'var(--color-border-default)',
                color: layerDef?.color,
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
              }}
            >
              {tr('COUCHE : {layer}', { layer: label(layerDef, selectedEdge.layer) })}
            </span>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>{tr('De : {src}', { src: '' })}</span>
              <span className="font-mono">{selectedEdge.source_id}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>{tr('Vers : {dst}', { dst: '' })}</span>
              <span className="font-mono">{selectedEdge.target_id}</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
