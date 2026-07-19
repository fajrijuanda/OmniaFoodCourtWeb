import { PortalAppShell } from "@/components/portal/layout/PortalAppShell";
import { KdsStandalonePage } from "@/components/portal/industries/fnb/kds/KdsStandalonePage";
import { PosStandalonePage } from "@/components/portal/industries/fnb/pos/PosStandalonePage";
import { resolvePortalRoute } from "@/components/portal/portalRoutes";

export default async function PortalNestedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const route = slug.join("/");
  const posMatch = route.match(/^fnb\/(?:(cafe|restaurant|restoran|bakery|cloud-kitchen|food-court)\/)?pos$/);
  const kdsMatch = route.match(/^fnb\/(?:(cafe|restaurant|restoran|bakery|cloud-kitchen|food-court)\/)?kds$/);

  if (posMatch) {
    return <PosStandalonePage subIndustrySlug={posMatch[1] === "restaurant" ? "restoran" : posMatch[1] ?? "cafe"} />;
  }

  if (kdsMatch) {
    return <KdsStandalonePage subIndustrySlug={kdsMatch[1] === "restaurant" ? "restoran" : kdsMatch[1] ?? "cafe"} />;
  }

  const page = resolvePortalRoute(slug);
  const isCatalogPage = page === "industry" || page === "sub-industry";

  return (
    <PortalAppShell
      initialPage={page}
      routeIndustrySlug={isCatalogPage ? slug[0] : null}
      routeSubIndustrySlug={page === "sub-industry" ? slug[1] : null}
    />
  );
}


import { portalRouteMap } from "@/components/portal/portalRoutes";
import { portalPagePaths } from "@/components/portal/portalTypes";

export function generateStaticParams() {
  // Generate all known portal routes so static export creates HTML files for each.
  // Without this, Capacitor falls back to index.html (which redirects to /login).
  const slugs = new Set<string>();
  slugs.add("dashboard");
  for (const route of Object.keys(portalRouteMap)) {
    slugs.add(route);
  }
  for (const path of Object.values(portalPagePaths)) {
    if (path.startsWith("/portal/")) slugs.add(path.slice("/portal/".length));
  }

  const fnbModules = ["pos", "order-history", "menu", "table-order", "reservation", "kds", "inventory", "sales", "settings", "split-bill", "loyalty", "shift-closing", "pre-order", "wholesale", "batch-stock", "waste-report", "order-hub", "multi-brand", "delivery-integration", "delivery-status", "tenant-management", "tenant-settlement", "promo-rules", "admin-tenant-dashboard"];
  for (const subIndustry of ["cafe", "restaurant", "restoran", "bakery", "cloud-kitchen", "food-court"]) {
    for (const moduleSlug of fnbModules) slugs.add(`fnb/${subIndustry}/${moduleSlug}`);
  }

  const educationModules = ["dashboard", "courses", "assignments", "attendance", "gradebook", "groups", "locations", "logbook", "reports", "requests", "documents", "approvals", "billing", "settings"];
  for (const subIndustry of ["lms", "kkn", "academic"]) {
    for (const moduleSlug of educationModules) slugs.add(`education-and-courses/${subIndustry}/${moduleSlug}`);
  }
  
  // Add all known base industry paths and sub-industries that might not be in portalRouteMap
  const extraPaths = [
    "fnb", "food-and-beverage", "professional-services", "internal-operations",
    "public-services", "layanan-publik", "ecommerce-and-marketplaces", "ecommerce",
    "education-and-courses", "pendidikan-and-kursus", "retail-and-franchise",
    "automotive", "manufacturing", "healthcare", "real-estate", "events-and-communities",
    // Common sub-industries
    "retail-and-franchise/apparel", "retail-and-franchise/furniture", "retail-and-franchise/printing",
    "retail-and-franchise/packaged-food", "retail-and-franchise/laundry",
    "automotive/workshop", "automotive/spareparts", "automotive/dealership",
    "real-estate/developer", "real-estate/broker", "real-estate/boarding-house",
    "real-estate/apartment", "real-estate/property-management",
    "events-and-communities/seminar", "events-and-communities/workshop-event",
    "events-and-communities/expo", "events-and-communities/community",
    "public-services/village", "public-services/sub-district", "public-services/foundation",
    "public-services/cooperative", "public-services/church",
    "manufacturing/factory", "manufacturing/warehouse",
    "ecommerce-and-marketplaces/social-commerce-intelligence"
  ];
  
  for (const path of extraPaths) {
    slugs.add(path);
  }
  
  return Array.from(slugs).map((route) => ({ slug: route.split("/") }));
}
