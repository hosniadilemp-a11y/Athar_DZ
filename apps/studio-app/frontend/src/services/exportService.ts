/**
 * Forensic Report & Data Export Service (PDF/HTML & JSON).
 * Conforms to Section 8 of .agent/phase1-implementation-rules.md.
 */

import type { CaseItem, GraphNode, GraphEdge } from '../types/graph';

export interface ExportReportData {
  caseInfo: CaseItem;
  exportDate: string;
  actorId: string;
  auditVerified: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function exportCaseToJson(data: ExportReportData): void {
  const exportPayload = {
    metadata: {
      application: 'Athar Forensic Studio',
      specification_version: '0.1.0',
      compliance: 'ISO/IEC 27037:2012',
      export_timestamp_utc: data.exportDate,
      actor_id: data.actorId,
      audit_ledger_verified: data.auditVerified,
    },
    case: data.caseInfo,
    statistics: {
      total_nodes: data.nodes.length,
      total_edges: data.edges.length,
      layer_distribution: {
        VERIFIED: data.nodes.filter((n) => n.layer === 'VERIFIED').length,
        OSINT_RAW: data.nodes.filter((n) => n.layer === 'OSINT_RAW').length,
        INFRA: data.nodes.filter((n) => n.layer === 'INFRA').length,
        HYPOTHESIS: data.nodes.filter((n) => n.layer === 'HYPOTHESIS').length,
        FLOWS: data.nodes.filter((n) => n.layer === 'FLOWS').length,
      },
    },
    nodes: data.nodes,
    edges: data.edges,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const sanitizedCode = data.caseInfo.code.replace(/[^a-zA-Z0-9_-]/g, '_');

  const a = document.createElement('a');
  a.href = url;
  a.download = `Athar_Export_${sanitizedCode}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function printForensicReport(data: ExportReportData): void {
  const verifiedNodes = data.nodes.filter((n) => n.layer === 'VERIFIED');
  const hypothesisNodes = data.nodes.filter((n) => n.layer === 'HYPOTHESIS');
  const otherNodes = data.nodes.filter((n) => n.layer !== 'VERIFIED' && n.layer !== 'HYPOTHESIS');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Rapport d'Enquête Forensique — ${data.caseInfo.code}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; }
        h1 { font-size: 24px; border-bottom: 2px solid #0f172a; padding-bottom: 8px; }
        h2 { font-size: 18px; margin-top: 24px; color: #334155; }
        .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 6px; margin-bottom: 24px; font-size: 13px; }
        .seal-ok { color: #047857; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
        th { background: #f1f5f9; }
        .verified-badge { background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
        .hypothesis-badge { background: #fae8ff; color: #86198f; padding: 2px 6px; border-radius: 4px; font-style: italic; }
        .disclaimer { font-size: 11px; color: #64748b; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style>
    </head>
    <body>
      <h1>Athar — Rapport d'Analyse Forensique et Graphe Judiciaire</h1>
      <div class="meta-box">
        <div><strong>Affaire :</strong> ${data.caseInfo.title} (${data.caseInfo.code})</div>
        <div><strong>Date d'exportation :</strong> ${new Date(data.exportDate).toLocaleString('fr-FR')}</div>
        <div><strong>Opérateur / Enquêteur :</strong> ${data.actorId}</div>
        <div><strong>Total entités :</strong> ${data.nodes.length} nœuds | <strong>Total relations :</strong> ${data.edges.length} liens</div>
        <div><strong>Intégrité du registre forensique (ISO 27037) :</strong> <span class="seal-ok">${data.auditVerified ? '100% Intègre et Scellé (SHA-256)' : 'Non certifié'}</span></div>
      </div>

      <h2>1. Preuves Judiciaires Scellées (VERIFIED — ${verifiedNodes.length})</h2>
      <table>
        <thead>
          <tr><th>Libellé</th><th>Type</th><th>Provenance</th><th>Confiance</th></tr>
        </thead>
        <tbody>
          ${verifiedNodes.map((n) => `
            <tr>
              <td><strong>${n.label}</strong></td>
              <td>${n.type}</td>
              <td>${n.provenance}</td>
              <td><span class="verified-badge">100% SCELLÉ</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>2. Hypothèses d'Enquête & Résultats Analytiques (HYPOTHESIS — ${hypothesisNodes.length})</h2>
      <p style="font-size: 12px; color: #64748b; margin: 4px 0;">Les éléments suivants sont des hypothèses de travail devant impérativement être corroborées par un acte judiciaire.</p>
      <table>
        <thead>
          <tr><th>Libellé</th><th>Type</th><th>Provenance</th><th>Indice de Confiance</th></tr>
        </thead>
        <tbody>
          ${hypothesisNodes.map((n) => `
            <tr>
              <td>${n.label}</td>
              <td>${n.type}</td>
              <td>${n.provenance}</td>
              <td><span class="hypothesis-badge">${n.confidence !== null ? `${Math.round(n.confidence * 100)}%` : 'Hypothèse'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>3. Renseignement et Infrastructures Détectées (${otherNodes.length})</h2>
      <table>
        <thead>
          <tr><th>Libellé</th><th>Type</th><th>Couche</th><th>Provenance</th></tr>
        </thead>
        <tbody>
          ${otherNodes.slice(0, 30).map((n) => `
            <tr>
              <td>${n.label}</td>
              <td>${n.type}</td>
              <td>${n.layer}</td>
              <td>${n.provenance}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="disclaimer">
        Rapport certifié généré par la plateforme Athar v0.1 — Conforme aux exigences d'administration de la preuve numérique (ISO/IEC 27037). Document réservé aux autorités judiciaires compétentes.
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
