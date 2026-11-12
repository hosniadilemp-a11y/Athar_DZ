/**
 * Canonical registry TypeScript definitions matching shared/generated/registry.json
 */

export type LayerId = 'VERIFIED' | 'OSINT_RAW' | 'INFRA' | 'HYPOTHESIS' | 'FLOWS';

export interface LayerDefinition {
  id: number;
  key: LayerId;
  color: string;
  border_style: 'solid' | 'dashed';
  label_fr: string;
  label_en: string;
  label_ar: string;
  description_fr: string;
}

export interface NodeTypeDefinition {
  key: string;
  layer: LayerId;
  label_fr: string;
  label_en: string;
  label_ar: string;
  icon: string;
  default_properties: Record<string, unknown>;
  allowed_relations: string[];
  proposed_tools: string[];
  is_gps_enabled: boolean;
}

export interface RelationTypeDefinition {
  key: string;
  label_fr: string;
  label_en: string;
  label_ar: string;
  layer: LayerId;
  source_types: string[];
  target_types: string[];
  directed: boolean;
}

export interface RegistryData {
  metadata: {
    app_name: string;
    version: string;
    total_layers: number;
    total_node_types: number;
    total_relation_types: number;
    gps_enabled_count: number;
    layer_counts: Record<LayerId, number>;
  };
  layers: Record<LayerId, LayerDefinition>;
  node_types: Record<string, NodeTypeDefinition>;
  relation_types: Record<string, RelationTypeDefinition>;
  gps_enabled_node_types: string[];
}
