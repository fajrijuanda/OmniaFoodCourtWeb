import type { LucideIcon } from "lucide-react";

export type Tone = "primary" | "slate" | "emerald" | "amber" | "rose" | "orange" | "blue" | "pink";
export type FeatureStatus = "enabled" | "disabled" | "locked" | "hidden" | "upgrade-only";

export type FeatureFlagMap = Record<string, FeatureStatus | boolean>;
export type StatDefinition = {
  label: string;
  value: string | number;
  caption?: string;
  trend?: string;
  tone?: Tone;
  icon?: LucideIcon;
};
export type ActionDefinition = {
  label: string;
  caption?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  onClick?: () => void;
};
export type ModuleDefinition = {
  key: string;
  title: string;
  caption?: string;
  icon?: LucideIcon;
  status?: FeatureStatus;
  badge?: string;
  onOpen?: () => void;
};
