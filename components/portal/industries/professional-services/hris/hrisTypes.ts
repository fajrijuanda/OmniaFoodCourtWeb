import type { LucideIcon } from "lucide-react";
import type { PortalPage } from "../../../portalTypes";

export type LeaveRequest = {
  id: string;
  employee: string;
  type: string;
  dates: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type HrisModuleKey = "employees" | "attendance" | "leave" | "payroll" | "payslip" | "reimbursement" | "loans" | "field-report" | "advanced-payroll" | "dashboard" | "performance" | "recruitment";
export type HrisTier = "starter" | "growth" | "pro" | "enterprise";

export type HrisCatalogModule = {
  key: string;
  name: string;
  caption: string;
  category: string;
  minimumTier: HrisTier;
  icon: LucideIcon;
  route?: PortalPage;
};

export type HrisStatTuple = [string, string, LucideIcon];
