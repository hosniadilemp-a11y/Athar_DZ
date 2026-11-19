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

export function getDairasByWilaya(wilayaCode: string): string[] {
  const set = new Set<string>();
  for (const item of algeriaRecords) {
    if (item.wilaya_code === wilayaCode && item.daira_name_ascii) {
      set.add(item.daira_name_ascii);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getCommunesByDaira(wilayaCode: string, dairaName: string): AlgeriaCityRecord[] {
  return algeriaRecords
    .filter(
      (item) =>
        item.wilaya_code === wilayaCode &&
        item.daira_name_ascii.toLowerCase() === dairaName.toLowerCase()
    )
    .sort((a, b) => a.commune_name_ascii.localeCompare(b.commune_name_ascii));
}

export function findCommune(wilayaCode: string, communeName: string): AlgeriaCityRecord | undefined {
  return algeriaRecords.find(
    (item) =>
      item.wilaya_code === wilayaCode &&
      item.commune_name_ascii.toLowerCase() === communeName.toLowerCase()
  );
}
