import type { GraphNode } from '../types/graph';
import type { ExtractedCandidate } from '../types/ingestion';

const MATCH_ATTR_KEYS = [
  'msisdn',
  'numero',
  'numero_e164',
  'rip',
  'numero_rip_rib',
  'ccp',
  'email',
  'adresse_email',
  'url',
  'url_site',
  'url_profil',
  'nom_domaine',
  'handle',
  'identifiant',
  'identifiant_compte',
  'identifiant_unique',
  'immatriculation',
  'plaque',
  'imei',
  'ip_address',
  'adresse_ip',
  'raison_sociale',
  'nom_fr',
  'code_gab',
  'adresse_wallet',
  'adresse_crypto',
] as const;

export function normalizeMatchToken(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  let token = String(raw)
    .trim()
    .toLowerCase()
    .replace(/[\s\u00a0\-_.]/g, '');
  if (!token) return '';
  if (/^0[567]\d{8}$/.test(token)) {
    token = `+213${token.slice(1)}`;
  } else if (/^00213[567]\d{8}$/.test(token)) {
    token = `+213${token.slice(5)}`;
  } else if (/^213[567]\d{8}$/.test(token)) {
    token = `+${token}`;
  }
  return token;
}

export function collectCandidateTokens(cand: ExtractedCandidate): string[] {
  const tokens = new Set<string>();
  const add = (value: unknown) => {
    const token = normalizeMatchToken(value);
    if (token.length >= 3) {
      tokens.add(token);
    }
  };
  add(cand.normalized_value);
  add(cand.label);
  if (cand.attributes) {
    for (const key of MATCH_ATTR_KEYS) {
      add(cand.attributes[key]);
    }
  }
  return Array.from(tokens);
}

/**
 * Resolve whether an extracted candidate matches an existing node in the case graph,
 * preferring the backend match ID and falling back to normalized client-side matching.
 */
export function findMatchedExistingNode(
  cand: ExtractedCandidate,
  nodes: GraphNode[]
): GraphNode | null {
  if (cand.matched_existing_node_id) {
    const direct = nodes.find((n) => n.id === cand.matched_existing_node_id);
    if (direct) return direct;
  }

  const candTokens = new Set(collectCandidateTokens(cand));
  if (candTokens.size === 0) return null;

  for (const node of nodes) {
    if (node.id === cand.source_node_id) continue;
    const nodeTokens = new Set<string>();
    const addNodeToken = (value: unknown) => {
      const token = normalizeMatchToken(value);
      if (token.length >= 3) {
        nodeTokens.add(token);
      }
    };
    addNodeToken(node.label);
    if (node.properties) {
      for (const key of MATCH_ATTR_KEYS) {
        addNodeToken(node.properties[key]);
      }
    }
    for (const token of candTokens) {
      if (nodeTokens.has(token)) {
        return node;
      }
    }
  }
  return null;
}
