import type { AuthUser } from "./api";

export type FrontendScope = "portal" | "hris" | "cafe";

export function getFrontendScope(): FrontendScope {
  return "cafe";
}

export function getScopeHomePath(user?: Pick<AuthUser, "role">): string {
  return `/portal/fnb/cafe?role=${user?.role === "employee" ? "employee" : "owner"}`;
}
