import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeGraphLayout,
  computePersonGraphProjection,
  computeGraphFitViewport,
  stepLiveForcePhysics,
  analyzeBulkNodeDeletion,
  type GraphLayoutType,
} from '../utils/graphLayouts';
import { useGraphStore } from '../store/useGraphStore';
import type { GraphNode, GraphEdge } from '../types/graph';
import { getAvailableRelationsForNodes, getRelationLabel } from '../i18n/phrases/relations';
import { ALGERIA_WILAYAS, searchWilayas, searchDairasByWilaya, searchCommunesByDaira } from '../utils/algeriaGeo';

describe('Graph Layout Algorithms & Edge Cases', () => {
  const createMockNode = (id: string, layer: GraphNode['layer'] = 'VERIFIED', type: string = 'personne'): GraphNode => ({
    id,
    case_id: 'case-layouts',
    type,
    layer,
    label: `Node ${id}`,
    confidence: 1.0,
    provenance: 'TEST',
    properties: {},
    latitude: null,
    longitude: null,
  });

  const createMockEdge = (source: string, target: string): GraphEdge => ({
    id: `edge-${source}-${target}`,
    case_id: 'case-layouts',
    source_id: source,
    target_id: target,
    type: 'CONNECTED_TO',
    layer: 'VERIFIED',
    confidence: 1.0,
    provenance: 'TEST',
    properties: {},
  });

  beforeEach(() => {
    useGraphStore.setState({
      nodes: [],
      edges: [],
      activeLayout: 'force',
      undoStack: [],
      redoStack: [],
    });
  });

  describe('Special Boundary Cases', () => {
    it('handles empty node list gracefully (0 nodes)', () => {
      const layouts: GraphLayoutType[] = ['circular', 'concentric', 'force', 'hierarchical', 'grid'];
      layouts.forEach((layout) => {
        const result = computeGraphLayout([], [], layout);
        expect(result).toEqual([]);
      });
    });

    it('handles single node by placing it at exact center (1 node)', () => {
      const single = createMockNode('solo');
      const layouts: GraphLayoutType[] = ['circular', 'concentric', 'force', 'hierarchical', 'grid'];
      layouts.forEach((layout) => {
        const result = computeGraphLayout([single], [], layout, { centerX: 500, centerY: 400 });
        expect(result).toHaveLength(1);
        expect(result[0]?.x).toBe(500);
        expect(result[0]?.y).toBe(400);
      });
    });

    it('handles exactly two nodes with symmetric spacing (2 nodes)', () => {
      const n1 = createMockNode('n1');
      const n2 = createMockNode('n2');
      const result = computeGraphLayout([n1, n2], [], 'circular', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(2);
      expect(result[0]?.x).toBe(460); // 600 - 140
      expect(result[1]?.x).toBe(740); // 600 + 140
      expect(result[0]?.y).toBe(450);
      expect(result[1]?.y).toBe(450);
    });
  });

  describe('Concentric Layout (Evidence Layer Stratification)', () => {
    it('places nodes into separate concentric rings based on evidence layer', () => {
      const nodes: GraphNode[] = [
        createMockNode('l1', 'VERIFIED'),
        createMockNode('l2', 'OSINT_RAW'),
        createMockNode('l3', 'INFRA'),
        createMockNode('l4', 'HYPOTHESIS'),
        createMockNode('l5', 'FLOWS'),
      ];

      const result = computeGraphLayout(nodes, [], 'concentric', { centerX: 500, centerY: 500 });
      expect(result).toHaveLength(5);

      // Verify that distance to center strictly increases across layers
      const dists = result.map((n) => {
        const dx = (n.x ?? 0) - 500;
        const dy = (n.y ?? 0) - 500;
        return Math.round(Math.sqrt(dx * dx + dy * dy));
      });

      // L1 < L2 < L3 < L4 < L5
      expect(dists).toHaveLength(5);
      const [d0 = 0, d1 = 0, d2 = 0, d3 = 0, d4 = 0] = dists;
      expect(d0).toBeLessThan(d1);
      expect(d1).toBeLessThan(d2);
      expect(d2).toBeLessThan(d3);
      expect(d3).toBeLessThan(d4);
    });

    it('handles missing intermediate layers without crashing', () => {
      // Only L1 (Verified) and L5 (Flows) present
      const nodes: GraphNode[] = [
        createMockNode('v1', 'VERIFIED'),
        createMockNode('v2', 'VERIFIED'),
        createMockNode('f1', 'FLOWS'),
        createMockNode('f2', 'FLOWS'),
      ];

      const result = computeGraphLayout(nodes, [], 'concentric', { centerX: 500, centerY: 500 });
      expect(result).toHaveLength(4);
      result.forEach((n) => {
        expect(Number.isFinite(n.x)).toBe(true);
        expect(Number.isFinite(n.y)).toBe(true);
      });
    });
  });

  describe('Organic Force-Directed Layout', () => {
    it('positions connected nodes near each other and clusters cliques', () => {
      // Triangle clique A-B-C and disconnected node D
      const nodes: GraphNode[] = [
        createMockNode('a'),
        createMockNode('b'),
        createMockNode('c'),
        createMockNode('d'),
      ];
      const edges: GraphEdge[] = [
        createMockEdge('a', 'b'),
        createMockEdge('b', 'c'),
        createMockEdge('c', 'a'),
      ];

      const result = computeGraphLayout(nodes, edges, 'force', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(4);
      result.forEach((n) => {
        expect(Number.isFinite(n.x)).toBe(true);
        expect(Number.isFinite(n.y)).toBe(true);
      });
    });

    it('handles completely disconnected graphs (0 edges)', () => {
      const nodes = Array.from({ length: 12 }, (_, i) => createMockNode(`iso-${i}`));
      const result = computeGraphLayout(nodes, [], 'force', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(12);

      // Verify no two nodes occupy the exact same coordinate
      const coordSet = new Set(result.map((n) => `${n.x},${n.y}`));
      expect(coordSet.size).toBe(12);
    });
  });

  describe('Hierarchical Layout (Investigative Pipeline)', () => {
    it('stratifies entities vertically into causality tiers', () => {
      const nodes: GraphNode[] = [
        createMockNode('admin', 'VERIFIED', 'wilaya'),
        createMockNode('target', 'HYPOTHESIS', 'personne'),
        createMockNode('phone', 'FLOWS', 'telephone'),
        createMockNode('c2', 'INFRA', 'serveur_c2'),
        createMockNode('bank', 'FLOWS', 'compte_bancaire'),
      ];

      const result = computeGraphLayout(nodes, [], 'hierarchical', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(5);

      const yMap = new Map(result.map((n) => [n.id, n.y ?? 0]));
      const getY = (id: string): number => {
        const val = yMap.get(id);
        expect(val).toBeDefined();
        return val ?? Number.NaN;
      };
      // Wilaya (tier 0) is higher than target (tier 1), higher than phone (tier 2), etc.
      expect(getY('admin')).toBeLessThan(getY('target'));
      expect(getY('target')).toBeLessThan(getY('phone'));
      expect(getY('phone')).toBeLessThan(getY('c2'));
      expect(getY('c2')).toBeLessThan(getY('bank'));
    });
  });

  describe('Grid Layout (Compact Matrix)', () => {
    it('arranges nodes in an orderly 2D matrix', () => {
      const nodes = Array.from({ length: 16 }, (_, i) => createMockNode(`grid-${i}`));
      const result = computeGraphLayout(nodes, [], 'grid', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(16);

      // Verify distinct coordinate grid
      const xs = new Set(result.map((n) => n.x));
      const ys = new Set(result.map((n) => n.y));
      expect(xs.size).toBeGreaterThan(1);
      expect(ys.size).toBeGreaterThan(1);
    });
  });

  describe('Store Integration & Reversible Layout History', () => {
    it('applies layout to active store graph and allows full undo/redo', () => {
      const nodes = [
        createMockNode('n1', 'VERIFIED'),
        createMockNode('n2', 'HYPOTHESIS'),
        createMockNode('n3', 'FLOWS'),
      ];

      useGraphStore.setState({ nodes, activeLayout: 'circular' });

      // Apply concentric layout
      useGraphStore.getState().applyLayout('concentric');
      expect(useGraphStore.getState().activeLayout).toBe('concentric');
      const concentricX = useGraphStore.getState().nodes[0]?.x;
      expect(useGraphStore.getState().undoStack).toHaveLength(1);

      // Apply grid layout
      useGraphStore.getState().applyLayout('grid');
      expect(useGraphStore.getState().activeLayout).toBe('grid');
      expect(useGraphStore.getState().undoStack).toHaveLength(2);

      // Undo -> restores concentric layout
      useGraphStore.getState().undo();
      expect(useGraphStore.getState().activeLayout).toBe('concentric');
      expect(useGraphStore.getState().nodes[0]?.x).toBe(concentricX);

      // Redo -> reapplies grid layout
      useGraphStore.getState().redo();
      expect(useGraphStore.getState().activeLayout).toBe('grid');
    });
  });

  describe('Person-Centric Graph Projection & Edge Confidence/Confidentiality', () => {
    it('projects only Person nodes with aggregated mediated link and expands intermediate entities on demand', () => {
      const p1 = createMockNode('p1', 'VERIFIED', 'personne');
      const p2 = createMockNode('p2', 'HYPOTHESIS', 'personne');
      const callNode = createMockNode('voice1', 'FLOWS', 'enregistrement_vocal');
      const phoneNode = createMockNode('tel1', 'FLOWS', 'telephone');

      const edges: GraphEdge[] = [
        createMockEdge('p1', 'voice1'),
        createMockEdge('voice1', 'p2'),
        createMockEdge('p1', 'tel1'),
        createMockEdge('tel1', 'p2'),
      ];

      // 1. Default folded Person view (Option A)
      const folded = computePersonGraphProjection(
        [p1, p2, callNode, phoneNode],
        edges,
        true,
        new Set()
      );
      expect(folded.visibleNodes.map((n) => n.id)).toEqual(['p1', 'p2']);
      expect(folded.visibleEdges).toHaveLength(1);
      expect(folded.visibleEdges[0]?.id).toBe('mediated__p1__p2');
      expect(folded.visibleEdges[0]?.properties?.is_mediated).toBe(true);
      expect(folded.visibleEdges[0]?.properties?.mediated_count).toBe(2);
      expect(folded.hiddenNeighborCountByNode.get('p1')).toBe(2);

      // 2. Expand mediated relation -> intermediate nodes become visible
      const expanded = computePersonGraphProjection(
        [p1, p2, callNode, phoneNode],
        edges,
        true,
        new Set(['voice1', 'tel1'])
      );
      expect(expanded.visibleNodes).toHaveLength(4);
      expect(expanded.visibleEdges).toHaveLength(4);
    });

    it('correctly handles multi-hop intermediate folding and multi-pair mediated links (Case DOS-2026-2158)', () => {
      // Setup: Ahmed and Hamoudi connected via 3 intermediate nodes, plus Omar connected to node2
      const ahmed = createMockNode('ahmed', 'VERIFIED', 'personne');
      ahmed.label = 'Ahmed';
      const hamoudi = createMockNode('hamoudi', 'VERIFIED', 'personne');
      hamoudi.label = 'Hamoudi';
      const omar = createMockNode('omar', 'VERIFIED', 'personne');
      omar.label = 'Omar';

      const n1 = createMockNode('node1', 'INFRA', 'telephone');
      const n2 = createMockNode('node2', 'INFRA', 'telecom_cdr');
      const n3 = createMockNode('node3', 'INFRA', 'telephone');

      const edges: GraphEdge[] = [
        createMockEdge('ahmed', 'node1'),
        createMockEdge('node1', 'node2'),
        createMockEdge('node2', 'node3'),
        createMockEdge('node3', 'hamoudi'),
        createMockEdge('omar', 'node2'),
      ];

      // Folded state (isPersonOnlyGraph = true, expandedHiddenNodeIds = empty)
      const folded = computePersonGraphProjection(
        [ahmed, hamoudi, omar, n1, n2, n3],
        edges,
        true,
        new Set()
      );

      // Only the 3 persons are visible
      expect(folded.visibleNodes.map((n) => n.id).sort()).toEqual(['ahmed', 'hamoudi', 'omar']);

      // Mediated edges exist between all connected person pairs
      const edgeIds = folded.visibleEdges.map((e) => e.id);
      expect(edgeIds).toContain('mediated__ahmed__hamoudi');
      expect(edgeIds).toContain('mediated__ahmed__omar');
      expect(edgeIds).toContain('mediated__hamoudi__omar');

      const ahmedHamoudiEdge = folded.visibleEdges.find((e) => e.id === 'mediated__ahmed__hamoudi');
      expect(ahmedHamoudiEdge?.properties?.mediated_count).toBe(3);
      expect(ahmedHamoudiEdge?.properties?.summary_label).toBe('Liaison médiée (3 nœuds)');

      // Multi-hop store toggle test: collapsing/expanding from Hamoudi traverses all 3 intermediate nodes
      useGraphStore.setState({
        nodes: [ahmed, hamoudi, omar, n1, n2, n3],
        edges,
        isPersonOnlyGraph: true,
        expandedHiddenNodeIds: new Set(),
      });

      // Expand from Hamoudi
      useGraphStore.getState().toggleExpandNodeConnections('hamoudi');
      const expandedSet = useGraphStore.getState().expandedHiddenNodeIds;
      expect(expandedSet.has('node1')).toBe(true);
      expect(expandedSet.has('node2')).toBe(true);
      expect(expandedSet.has('node3')).toBe(true);

      // Replier (collapse) from Hamoudi
      useGraphStore.getState().toggleExpandNodeConnections('hamoudi');
      const collapsedSet = useGraphStore.getState().expandedHiddenNodeIds;
      expect(collapsedSet.size).toBe(0);
    });

    it('updates both confidence and judicial confidentiality level on an edge', () => {
      const e1 = createMockEdge('p1', 'p2');
      useGraphStore.setState({ edges: [e1] });

      useGraphStore.getState().updateEdgeDetails(e1.id, {
        confidence: 0.96,
        confidentiality_level: 'SECRET_JUDICIAIRE',
        layer: 'VERIFIED',
      });

      const updated = useGraphStore.getState().edges[0];
      expect(updated?.confidence).toBe(0.96);
      expect(updated?.layer).toBe('VERIFIED');
      expect(updated?.properties?.confidentiality_level).toBe('SECRET_JUDICIAIRE');
    });

    it('preserves pinned node positions across graph layout calculations', () => {
      const n1 = { ...createMockNode('n1'), x: 123, y: 456 };
      const n2 = { ...createMockNode('n2'), x: 0, y: 0 };
      const n3 = { ...createMockNode('n3'), x: 0, y: 0 };
      const edges = [createMockEdge('n1', 'n2'), createMockEdge('n2', 'n3')];

      const pinned = new Set(['n1']);
      const layouts: GraphLayoutType[] = ['circular', 'concentric', 'force', 'hierarchical', 'grid'];

      layouts.forEach((layout) => {
        const result = computeGraphLayout([n1, n2, n3], edges, layout, undefined, pinned);
        const pinnedNode = result.find((n) => n.id === 'n1');
        expect(pinnedNode?.x).toBe(123);
        expect(pinnedNode?.y).toBe(456);
      });
    });

    it('keeps pinned node stationary during live force physics simulation ticks', () => {
      const n1 = { ...createMockNode('n1'), x: 100, y: 200 };
      const n2 = { ...createMockNode('n2'), x: 120, y: 210 };
      const edges = [createMockEdge('n1', 'n2')];
      const pinned = new Set(['n1']);

      const stepMap = stepLiveForcePhysics([n1, n2], edges, 600, 450, null, pinned);
      const posN1 = stepMap.get('n1');
      expect(posN1?.x).toBe(100);
      expect(posN1?.y).toBe(200);

      // Meanwhile unpinned n2 is moved by physics
      const posN2 = stepMap.get('n2');
      expect(posN2).toBeDefined();
    });

    it('manages pinnedNodeIds in store and ensures newly added non-person nodes are visible', () => {
      const store = useGraphStore.getState();
      expect(store.pinnedNodeIds.has('node-x')).toBe(false);

      // Pin node
      store.togglePinNode('node-x');
      expect(useGraphStore.getState().pinnedNodeIds.has('node-x')).toBe(true);

      // Unpin node
      store.togglePinNode('node-x');
      expect(useGraphStore.getState().pinnedNodeIds.has('node-x')).toBe(false);

      // Explicit set
      store.setNodePinned('node-y', true);
      expect(useGraphStore.getState().pinnedNodeIds.has('node-y')).toBe(true);
      store.setNodePinned('node-y', false);
      expect(useGraphStore.getState().pinnedNodeIds.has('node-y')).toBe(false);

      // Non-person node visibility on addition
      const carNode = createMockNode('veh-1', 'HYPOTHESIS', 'vehicule');
      useGraphStore.getState().mergeExpandedNodes([carNode], []);
      expect(useGraphStore.getState().expandedHiddenNodeIds.has('veh-1')).toBe(true);
    });

    it('correctly calculates direct non-person neighbor count for a node (Fatima direct connections = 2)', () => {
      // Setup: Fatima connected to 2 direct non-person nodes (account, phone),
      // which in turn connect to a wide chain of 10 other non-person nodes.
      const fatima = createMockNode('fatima', 'HYPOTHESIS', 'personne');
      fatima.label = 'Fatima Z. Cherif';

      const account = createMockNode('acc-1', 'FLOWS', 'compte_bancaire');
      const phone = createMockNode('phone-1', 'FLOWS', 'telephone');

      // Extended chain that should NOT inflate Fatima's direct badge count
      const distantNodes = Array.from({ length: 10 }, (_, i) =>
        createMockNode(`dist-${i}`, 'INFRA', 'adresse_ip')
      );

      const edges: GraphEdge[] = [
        createMockEdge('fatima', 'acc-1'),
        createMockEdge('fatima', 'phone-1'),
        createMockEdge('acc-1', 'dist-0'),
        ...distantNodes.slice(0, -1).flatMap((n, i) => {
          const next = distantNodes[i + 1];
          return next ? [createMockEdge(n.id, next.id)] : [];
        }),
      ];

      const projection = computePersonGraphProjection(
        [fatima, account, phone, ...distantNodes],
        edges,
        true,
        new Set()
      );

      // Direct non-person neighbor count must be exactly 2, not 12
      expect(projection.hiddenNeighborCountByNode.get('fatima')).toBe(2);
      expect(projection.expandedNeighborCountByNode.get('fatima')).toBe(0);
    });

    it('partitions multi-hop mediated paths when an intermediate node is expanded (A -> B -> C -> D -> E)', () => {
      // Setup: A (Person) -> B (Phone) -> C (Account) -> D (Phone) -> E (Person)
      const nodeA = createMockNode('nodeA', 'VERIFIED', 'personne');
      const nodeB = createMockNode('nodeB', 'FLOWS', 'telephone');
      const nodeC = createMockNode('nodeC', 'FLOWS', 'compte_bancaire');
      const nodeD = createMockNode('nodeD', 'FLOWS', 'telephone');
      const nodeE = createMockNode('nodeE', 'VERIFIED', 'personne');

      const edges: GraphEdge[] = [
        createMockEdge('nodeA', 'nodeB'),
        createMockEdge('nodeB', 'nodeC'),
        createMockEdge('nodeC', 'nodeD'),
        createMockEdge('nodeD', 'nodeE'),
      ];

      // 1. When B, C, D are all hidden, only A and E are visible:
      // Expect 1 mediated edge A ---- (3) ----> E
      const allFolded = computePersonGraphProjection(
        [nodeA, nodeB, nodeC, nodeD, nodeE],
        edges,
        true,
        new Set()
      );

      expect(allFolded.visibleNodes.map((n) => n.id).sort()).toEqual(['nodeA', 'nodeE']);
      expect(allFolded.visibleEdges).toHaveLength(1);
      expect(allFolded.visibleEdges[0]?.id).toBe('mediated__nodeA__nodeE');
      expect(allFolded.visibleEdges[0]?.properties?.mediated_count).toBe(3);

      // 2. When C is visualised (expanded into visibleNodes):
      // Visible nodes are A, C, E.
      // Mediated paths:
      // A -> B -> C creates mediated edge A -- (1) --> C
      // C -> D -> E creates mediated edge C -- (1) --> E
      // NO shortcut edge A ------> E must exist!
      const cExpanded = computePersonGraphProjection(
        [nodeA, nodeB, nodeC, nodeD, nodeE],
        edges,
        true,
        new Set(['nodeC'])
      );

      const visibleIds = cExpanded.visibleNodes.map((n) => n.id).sort();
      expect(visibleIds).toEqual(['nodeA', 'nodeC', 'nodeE']);

      const edgeIds = cExpanded.visibleEdges.map((e) => e.id);
      expect(edgeIds).toContain('mediated__nodeA__nodeC');
      expect(edgeIds).toContain('mediated__nodeC__nodeE');
      // Crucial: A -> E shortcut must NOT exist!
      expect(edgeIds).not.toContain('mediated__nodeA__nodeE');

      const aToCEdge = cExpanded.visibleEdges.find((e) => e.id === 'mediated__nodeA__nodeC');
      expect(aToCEdge?.properties?.mediated_count).toBe(1);

      const cToEEdge = cExpanded.visibleEdges.find((e) => e.id === 'mediated__nodeC__nodeE');
      expect(cToEEdge?.properties?.mediated_count).toBe(1);
    });

    it('provides transverse cross-entity relation recommendations and neutral judicial terminology', () => {
      // 1. Photo ↔ Social account
      const photoSocial = getAvailableRelationsForNodes('photo', 'compte_facebook');
      const photoSocialKeys = photoSocial.map((r) => r.key);
      expect(photoSocialKeys).toContain('PHOTO_DE_PROFIL_DE');
      expect(photoSocialKeys).toContain('PUBLIEE_PAR_COMPTE');
      expect(photoSocialKeys).toContain('EXTRAITE_DU_PROFIL');
      expect(photoSocialKeys).toContain('IDENTIFIE_SUR_CLICHE');
      expect(photoSocial[0]?.isRecommended).toBe(true);

      // 2. Photo ↔ Person
      const photoPerson = getAvailableRelationsForNodes('photo', 'personne');
      const photoPersonKeys = photoPerson.map((r) => r.key);
      expect(photoPersonKeys).toContain('REPRESENTE_PERSONNE');
      expect(photoPersonKeys).toContain('CORRESPONDANCE_FACIALE');

      // 3. Social account ↔ Bank account
      const socialBank = getAvailableRelationsForNodes('compte_telegram', 'compte_bancaire');
      const socialBankKeys = socialBank.map((r) => r.key);
      expect(socialBankKeys).toContain('MENTIONNE_COORDONNEES_RIB');

      // 4. Fallback generic relations include neutral relations
      expect(socialBankKeys).toContain('RELIE_A');
      expect(socialBankKeys).toContain('RAPPROCHEMENT_PROBATOIRE');

      // 5. Localization check for neutral terminology
      expect(getRelationLabel('PHOTO_DE_PROFIL_DE', 'fr')).toBe('Photo de profil du compte');
      expect(getRelationLabel('PUBLIE_ANNONCE', 'fr')).toBe('Publie l’annonce commerciale');
      expect(getRelationLabel('COMPTE_BENEFICIAIRE', 'fr')).toBe('Compte bancaire / postal bénéficiaire');
    });
  });

  describe('Auto-Fit Graph Viewport', () => {
    it('returns default viewport when graph is empty', () => {
      expect(computeGraphFitViewport([], 800, 600)).toEqual({ panX: 0, panY: 0, zoom: 1 });
    });

    it('zooms out and centers wide concentric layouts inside smaller viewports', () => {
      const nodes = Array.from({ length: 40 }, (_, i) =>
        createMockNode(`fit-${i}`, i % 2 === 0 ? 'FLOWS' : 'VERIFIED')
      );
      const layouted = computeGraphLayout(nodes, [], 'concentric');
      const fit = computeGraphFitViewport(layouted, 760, 560, 56);

      expect(fit.zoom).toBeGreaterThanOrEqual(0.35);
      expect(fit.zoom).toBeLessThanOrEqual(1.35);
      expect(Number.isFinite(fit.panX)).toBe(true);
      expect(Number.isFinite(fit.panY)).toBe(true);
    });

    it('frames compact person subgraphs closer than 100% by default', () => {
      const nodes: GraphNode[] = Array.from({ length: 5 }, (_, i) => ({
        ...createMockNode(`compact-${i}`, 'VERIFIED'),
        x: 520 + (i % 3) * 110,
        y: 380 + Math.floor(i / 3) * 110,
      }));
      const fit = computeGraphFitViewport(nodes, 1000, 720, 56);

      expect(fit.zoom).toBeGreaterThan(1.0);
      expect(fit.zoom).toBeLessThanOrEqual(1.35);
    });

    it('keeps disconnected 14-node force layouts compact without exploding outward', () => {
      const nodes = Array.from({ length: 14 }, (_, i) =>
        createMockNode(`disc-${i}`, 'VERIFIED', 'scelle_numerique')
      );
      const layouted = computeGraphLayout(nodes, [], 'force');
      const xs = layouted.map((n) => n.x ?? 0);
      const ys = layouted.map((n) => n.y ?? 0);
      const spanX = Math.max(...xs) - Math.min(...xs);
      const spanY = Math.max(...ys) - Math.min(...ys);

      expect(spanX).toBeLessThanOrEqual(700);
      expect(spanY).toBeLessThanOrEqual(700);
    });

    it('displays the full graph automatically when an investigation has no person entities', () => {
      const nodes = [
        createMockNode('file-1', 'VERIFIED', 'scelle_numerique'),
        createMockNode('file-2', 'VERIFIED', 'image_preuve'),
      ];
      const edges = [createMockEdge('file-1', 'file-2')];
      const projection = computePersonGraphProjection(nodes, edges, true, new Set());

      expect(projection.visibleNodes).toHaveLength(2);
      expect(projection.visibleEdges).toHaveLength(1);
    });
  });

  describe('Bulk Node Deletion Safety Analysis', () => {
    it('deletes only explicitly selected nodes in full-graph mode', () => {
      const a = createMockNode('a', 'VERIFIED', 'personne');
      const b = createMockNode('b', 'VERIFIED', 'personne');
      const m = createMockNode('m', 'FLOWS', 'telephone');
      const edges = [createMockEdge('a', 'm'), createMockEdge('m', 'b')];

      const analysis = analyzeBulkNodeDeletion(['a', 'b'], [a, b, m], edges, false, new Set());
      expect(analysis.status).toBe('ready');
      expect(analysis.primaryNodes.map((n) => n.id)).toEqual(['a', 'b']);
      expect(analysis.intermediateNodes).toHaveLength(0);
      expect(analysis.allNodeIdsToDelete).toEqual(['a', 'b']);
      expect(analysis.affectedEdgeCount).toBe(2);
    });

    it('includes exclusive hidden intermediate entities when deleting a pair in compacted mode', () => {
      const a = createMockNode('a', 'VERIFIED', 'personne');
      const b = createMockNode('b', 'VERIFIED', 'personne');
      const m = createMockNode('m', 'FLOWS', 'telephone');
      const edges = [createMockEdge('a', 'm'), createMockEdge('m', 'b')];

      const analysis = analyzeBulkNodeDeletion(['a', 'b'], [a, b, m], edges, true, new Set());
      expect(analysis.status).toBe('ready');
      expect(analysis.primaryNodes.map((n) => n.id)).toEqual(['a', 'b']);
      expect(analysis.intermediateNodes.map((n) => n.id)).toEqual(['m']);
      expect(analysis.allNodeIdsToDelete.sort()).toEqual(['a', 'b', 'm']);
      expect(analysis.blockingThirdParties).toHaveLength(0);
    });

    it('blocks compacted pair deletion when an intermediate entity implicates a third unselected person', () => {
      const a = createMockNode('a', 'VERIFIED', 'personne');
      const b = createMockNode('b', 'VERIFIED', 'personne');
      const c = createMockNode('c', 'HYPOTHESIS', 'personne');
      const m = createMockNode('m', 'FLOWS', 'compte_bancaire');
      const edges = [
        createMockEdge('a', 'm'),
        createMockEdge('m', 'b'),
        createMockEdge('m', 'c'),
      ];

      const analysis = analyzeBulkNodeDeletion(['a', 'b'], [a, b, c, m], edges, true, new Set());
      expect(analysis.status).toBe('blocked_third_party');
      expect(analysis.blockingThirdParties).toHaveLength(1);
      expect(analysis.blockingThirdParties[0]?.person.id).toBe('c');
      expect(analysis.blockingThirdParties[0]?.viaIntermediates.map((n) => n.id)).toEqual(['m']);
      expect(analysis.allNodeIdsToDelete.sort()).toEqual(['a', 'b', 'm']);
      expect(analysis.allNodeIdsToDelete).not.toContain('c');
    });
  });

  describe('Algeria Geo Suggestions & Bidirectional Entity-Pair Relations', () => {
    it('supports accent-insensitive wilaya suggestions and guided Wilaya -> Daïra -> Commune cascade', () => {
      expect(ALGERIA_WILAYAS.length).toBe(58);
      const algiers = searchWilayas('alger');
      expect(algiers.some((w) => w.code === '16')).toBe(true);

      const dairas = searchDairasByWilaya('16', 'sidi');
      expect(dairas.some((d) => d.name.toLowerCase().includes("sidi m'hamed"))).toBe(true);

      const communes = searchCommunesByDaira('16', "Sidi M'Hamed", 'alger');
      expect(communes.some((c) => c.commune_name_ascii === 'Alger Centre')).toBe(true);
    });

    it('returns phone-person relations in both directions (telephone -> personne and personne -> telephone)', () => {
      const pToT = getAvailableRelationsForNodes('personne', 'telephone').map((r) => r.key);
      const tToP = getAvailableRelationsForNodes('telephone', 'personne').map((r) => r.key);

      expect(pToT).toContain('UTILISE_TELEPHONE');
      expect(tToP).toContain('UTILISE_TELEPHONE');
      expect(tToP).toContain('TITULAIRE_LIGNE_SIM');
    });
  });
});
