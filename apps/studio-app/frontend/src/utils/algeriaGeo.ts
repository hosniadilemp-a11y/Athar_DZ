import algeriaDataRaw from '../data/algeria_administrative.json';

export interface AlgeriaCityRecord {
  id: number;
  commune_name_ascii: string;
  commune_name: string;
  daira_name_ascii: string;
  daira_name: string;
  wilaya_code: string;
  wilaya_name_ascii: string;
  wilaya_name: string;
}

const algeriaRecords = algeriaDataRaw as AlgeriaCityRecord[];

export interface WilayaOption {
  code: string;
  name: string;
  nameAr: string;
  label: string;
}

export interface DairaOption {
  name: string;
  nameAr: string;
  wilayaCode: string;
}

export function normalizeGeoText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const ALGERIA_WILAYAS: WilayaOption[] = (() => {
  const map = new Map<string, WilayaOption>();
  for (const item of algeriaRecords) {
    if (!map.has(item.wilaya_code)) {
      map.set(item.wilaya_code, {
        code: item.wilaya_code,
        name: item.wilaya_name_ascii,
        nameAr: item.wilaya_name,
        label: `${item.wilaya_code} - ${item.wilaya_name_ascii}`,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => Number(a.code) - Number(b.code));
})();

export function getDairaObjectsByWilaya(wilayaCode: string): DairaOption[] {
  const map = new Map<string, DairaOption>();
  for (const item of algeriaRecords) {
    if (item.wilaya_code === wilayaCode && item.daira_name_ascii) {
      const key = item.daira_name_ascii.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: item.daira_name_ascii,
          nameAr: item.daira_name,
          wilayaCode,
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getDairasByWilaya(wilayaCode: string): string[] {
  return getDairaObjectsByWilaya(wilayaCode).map((d) => d.name);
}

export function getCommunesByDaira(wilayaCode: string, dairaName: string): AlgeriaCityRecord[] {
  const target = dairaName.toLowerCase().trim();
  const seen = new Set<string>();
  return algeriaRecords
    .filter((item) => {
      if (item.wilaya_code !== wilayaCode) return false;
      if (item.daira_name_ascii.toLowerCase() !== target) return false;
      const key = item.commune_name_ascii.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.commune_name_ascii.localeCompare(b.commune_name_ascii));
}

export function searchWilayas(query: string): WilayaOption[] {
  const q = normalizeGeoText(query);
  if (!q) return ALGERIA_WILAYAS;
  return ALGERIA_WILAYAS.filter(
    (w) =>
      w.code.includes(q) ||
      normalizeGeoText(w.name).includes(q) ||
      normalizeGeoText(w.label).includes(q) ||
      w.nameAr.includes(query.trim())
  );
}

export function searchDairasByWilaya(wilayaCode: string, query: string): DairaOption[] {
  const list = getDairaObjectsByWilaya(wilayaCode);
  const q = normalizeGeoText(query);
  if (!q) return list;
  return list.filter(
    (d) => normalizeGeoText(d.name).includes(q) || d.nameAr.includes(query.trim())
  );
}

export function searchDairas(wilayaCode: string, query: string): DairaOption[] {
  return searchDairasByWilaya(wilayaCode, query);
}

export function searchCommunesByDaira(
  wilayaCode: string,
  dairaName: string,
  query: string
): AlgeriaCityRecord[] {
  const list = getCommunesByDaira(wilayaCode, dairaName);
  const q = normalizeGeoText(query);
  if (!q) return list;
  return list.filter(
    (c) => normalizeGeoText(c.commune_name_ascii).includes(q) || c.commune_name.includes(query.trim())
  );
}

export function searchCommunes(
  wilayaCode: string,
  dairaName: string,
  query: string
): AlgeriaCityRecord[] {
  return searchCommunesByDaira(wilayaCode, dairaName, query);
}

export function findCommune(wilayaCode: string, communeName: string): AlgeriaCityRecord | undefined {
  return algeriaRecords.find(
    (item) =>
      item.wilaya_code === wilayaCode &&
      item.commune_name_ascii.toLowerCase() === communeName.toLowerCase()
  );
}
