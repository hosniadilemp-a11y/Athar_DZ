import { describe, it, expect, vi } from 'vitest';
import { exportCaseToJson } from '../services/exportService';
import type { ExportReportData } from '../services/exportService';

describe('exportService', () => {
  it('should generate valid JSON export structure with case and metadata', () => {
    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectURLMock = vi.fn();

    // Setup browser mocks in Node environment
    (globalThis as unknown as { document: unknown }).document = {
      createElement: vi.fn().mockReturnValue(mockAnchor),
    };
    (globalThis as unknown as { URL: unknown }).URL = {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    };

    const mockData: ExportReportData = {
      caseInfo: {
        id: 'case-123',
        code: 'TEST-CASE-2026',
        title: 'Affaire Test',
        description: 'Test description',
        status: 'OPEN',
        created_at: '2026-11-12T10:00:00Z',
        updated_at: '2026-11-12T10:00:00Z',
        nodes_count: 1,
        edges_count: 0,
      },
      exportDate: '2026-11-12T15:00:00Z',
      actorId: 'investigator_test',
      auditVerified: true,
      nodes: [
        {
          id: 'node-1',
          case_id: 'case-123',
          type: 'SUSPECT',
          label: 'Suspect Alpha',
          layer: 'VERIFIED',
          confidence: 0.95,
          provenance: 'POLICE_REPORT',
          latitude: 36.75,
          longitude: 3.05,
          x: 100,
          y: 100,
          created_at: '2026-11-12T10:00:00Z',
          updated_at: '2026-11-12T10:00:00Z',
          properties: {},
        },
      ],
      edges: [],
    };

    exportCaseToJson(mockData);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(mockAnchor.download).toContain('Athar_Export_TEST-CASE-2026');
    expect(mockAnchor.download).toContain('.json');
    expect(mockAnchor.click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledTimes(1);
  });
});
