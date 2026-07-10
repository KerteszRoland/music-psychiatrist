import type { LabelCategory } from "@/lib/types";

export const EARLY_MALADAPTIVE_SCHEMAS = [
  "Abandonment",
  "Mistrust/Abuse",
  "Emotional Deprivation",
  "Defectiveness/Shame",
  "Social Isolation",
  "Dependence/Incompetence",
  "Vulnerability to Harm",
  "Enmeshment",
  "Failure",
  "Entitlement",
  "Insufficient Self-Control",
  "Subjugation",
  "Self-Sacrifice",
  "Approval-Seeking",
  "Negativity/Pessimism",
  "Emotional Inhibition",
  "Unrelenting Standards",
  "Punitiveness",
] as const;

export const SCHEMA_MODES = [
  "Vulnerable Child",
  "Angry Child",
  "Impulsive/Undisciplined Child",
  "Happy Child",
  "Compliant Surrenderer",
  "Detached Protector",
  "Overcompensator",
  "Bully/Attack",
  "Punitive Parent",
  "Demanding Parent",
  "Healthy Adult",
] as const;

export const COPING_STYLES = [
  "Surrender",
  "Avoidance",
  "Overcompensation",
] as const;

export const THERAPEUTIC_SIGNALS = [
  "Self-criticism",
  "Hopelessness",
  "Rumination",
  "Emotional dysregulation",
  "Idealization",
  "Devaluation",
  "Hypervigilance",
  "Dissociation/numbing",
  "People-pleasing",
  "Rebellion/defiance",
  "Perfectionism",
  "Guilt/shame",
  "Loneliness/isolation",
  "Anger/hostility",
  "Nostalgia/longing",
  "Identity confusion",
  "Attachment seeking",
  "Emotional validation seeking",
] as const;

export const ALL_LABELS = [
  ...EARLY_MALADAPTIVE_SCHEMAS,
  ...SCHEMA_MODES,
  ...COPING_STYLES,
  ...THERAPEUTIC_SIGNALS,
] as const;

export type SchemaLabel = (typeof ALL_LABELS)[number];

export function labelCategory(label: string): LabelCategory {
  if ((EARLY_MALADAPTIVE_SCHEMAS as readonly string[]).includes(label)) {
    return "early_maladaptive_schema";
  }
  if ((SCHEMA_MODES as readonly string[]).includes(label)) {
    return "schema_mode";
  }
  if ((COPING_STYLES as readonly string[]).includes(label)) {
    return "coping_style";
  }
  return "signal";
}

export const CATEGORY_LABELS: Record<LabelCategory, string> = {
  early_maladaptive_schema: "Early Maladaptive Schema",
  schema_mode: "Schema Mode",
  coping_style: "Coping Style",
  signal: "Therapeutic Signal",
};
