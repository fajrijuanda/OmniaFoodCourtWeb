import type { LucideIcon } from "lucide-react";
import type { PortalPage } from "../../portalTypes";

export type HigherEducationTier = "starter" | "growth" | "pro" | "enterprise";

export type CampusWorkspace = "home" | "lms" | "kkn" | "academic" | "admin";

export type CampusModuleKey =
  | "dashboard"
  | "lms"
  | "courses"
  | "assignments"
  | "attendance"
  | "gradebook"
  | "kkn"
  | "kkn-groups"
  | "kkn-locations"
  | "kkn-logbook"
  | "kkn-reports"
  | "academic-services"
  | "requests"
  | "documents"
  | "approvals"
  | "billing"
  | "analytics"
  | "settings";

export type CampusModule = {
  key: CampusModuleKey;
  name: string;
  caption: string;
  workspace: CampusWorkspace;
  minimumTier: HigherEducationTier;
  icon: LucideIcon;
  route: PortalPage;
};

export type CampusMetric = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
};
