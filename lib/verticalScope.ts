import type { AuthUser } from "./api";

export type FrontendScope = "portal" | "hris" | "cafe" | "retail";

export function getFrontendScope(): FrontendScope {
  const scope = process.env.NEXT_PUBLIC_OMNIA_FRONTEND_SCOPE;
  return scope === "hris" || scope === "cafe" || scope === "retail" ? scope : "portal";
}

function employeeSubscriptionPath(user?: AuthUser) {
  const memberships = user?.tenants?.filter((tenant) => tenant.role === "employee") ?? [];
  const subscriptions = memberships.flatMap((tenant) => tenant.subscriptions ?? []).filter((subscription) => !["canceled", "cancelled"].includes(subscription.status));
  for (const subscription of subscriptions) {
    const subIndustry = subscription.subIndustry?.slug ?? "";
    const industry = subscription.subIndustry?.industry?.slug ?? "";
    if (subIndustry === "retail-store" || industry === "retail-and-stores") return "/portal/retail-and-stores/retail-store?role=employee";
    if (subIndustry === "cafe" || industry === "fnb") return "/portal/fnb/cafe?role=employee";
    if (subIndustry === "hris" || industry === "professional-services" || industry === "internal-operations") return "/portal/professional-services/hris?role=employee";
  }
  return "/portal/professional-services/hris?role=employee";
}

export function getScopeHomePath(user?: AuthUser): string {
  const scope = getFrontendScope();
  if (scope === "hris") {
    return `/portal/professional-services/hris?role=${user?.role === "employee" ? "employee" : "owner"}`;
  }
  if (scope === "cafe") return `/portal/fnb/cafe?role=${user?.role === "employee" ? "employee" : "owner"}`;
  if (scope === "retail") return `/portal/retail-and-stores/retail-store?role=${user?.role === "employee" ? "employee" : "owner"}`;
  if (user?.role === "employee") return employeeSubscriptionPath(user);
  return "/portal?role=owner";
}
