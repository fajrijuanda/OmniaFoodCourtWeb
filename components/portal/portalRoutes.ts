import type { PortalPage } from "./portalTypes";

export const portalRouteMap: Record<string, PortalPage> = {
  apps: "apps",

  "professional-services/hris": "hris",
  "jasa-profesional/hris": "hris",
  "professional-services/hris/employees": "hris-employees",
  "professional-services/hris/attendance": "hris-attendance",
  "professional-services/hris/leave": "hris-leave",
  "professional-services/hris/payroll": "hris-payroll",
  "professional-services/hris/payslip": "hris-payslip",
  "professional-services/hris/dashboard": "hris-dashboard",
  "professional-services/hris/advanced-payroll": "hris-advanced-payroll",
  "professional-services/hris/reimbursement": "hris-reimbursement",
  "professional-services/hris/loans": "hris-loans",
  "professional-services/hris/field-report": "hris-field-report",
  "professional-services/hris/performance": "hris-performance",
  "professional-services/hris/recruitment": "hris-recruitment",
  "professional-services/hris/settings": "hris-settings",

  "internal-operations/hris": "hris",
  "internal-operations/hris/employees": "hris-employees",
  "internal-operations/hris/attendance": "hris-attendance",
  "internal-operations/hris/leave": "hris-leave",
  "internal-operations/hris/payroll": "hris-payroll",
  "internal-operations/hris/payslip": "hris-payslip",
  "internal-operations/hris/dashboard": "hris-dashboard",
  "internal-operations/hris/advanced-payroll": "hris-advanced-payroll",
  "internal-operations/hris/reimbursement": "hris-reimbursement",
  "internal-operations/hris/loans": "hris-loans",
  "internal-operations/hris/field-report": "hris-field-report",
  "internal-operations/hris/performance": "hris-performance",
  "internal-operations/hris/recruitment": "hris-recruitment",
  "internal-operations/hris/settings": "hris-settings",
  hris: "hris",
  "hris/employees": "hris-employees",
  "hris/attendance": "hris-attendance",
  "hris/leave": "hris-leave",
  "hris/payroll": "hris-payroll",
  "hris/payslip": "hris-payslip",
  "hris/dashboard": "hris-dashboard",
  "hris/advanced-payroll": "hris-advanced-payroll",
  "hris/reimbursement": "hris-reimbursement",
  "hris/loans": "hris-loans",
  "hris/field-report": "hris-field-report",
  "hris/performance": "hris-performance",
  "hris/recruitment": "hris-recruitment",
  "hris/settings": "hris-settings",

  fnb: "fnb",
  "food-and-beverage": "fnb",
  "fb-kuliner": "fnb",
  "fnb/pos": "fnb-pos",
  "fnb/menu": "fnb-menu",
  "fnb/kds": "fnb-kds",
  "fnb/inventory": "fnb-inventory",
  "fnb/sales": "fnb-sales",
  "fnb/settings": "fnb-settings",
  "fnb/table-order": "fnb-table-order",
  "fnb/reservation": "fnb-reservation",
  "fnb/restaurant": "fnb-restaurant",
  "fnb/restoran": "fnb-restaurant",
  "fnb/cafe": "fnb-cafe",
  "fnb/bakery": "fnb-bakery",
  "fnb/cloud-kitchen": "fnb-cloud-kitchen",
  "fnb/food-court": "fnb-food-court",

  "public-services/church": "church-dashboard",
  "layanan-publik/church": "church-dashboard",
  "public-services/church/jemaat": "church-jemaat",
  "public-services/church/komsel": "church-komsel",
  "public-services/church/ibadah": "church-ibadah",
  "public-services/church/pelayanan": "church-pelayanan",
  "public-services/church/keuangan": "church-keuangan",
  "public-services/church/aset": "church-aset",
  "public-services/church/dashboard": "church-dashboard",
  "public-services/church/settings": "church-settings",

  "healthcare/clinic": "clinic-dashboard",
  "kesehatan/clinic": "clinic-dashboard",
  "kesehatan/klinik": "clinic-dashboard",
  clinic: "clinic-dashboard",

  "ecommerce-and-marketplaces/social-commerce-intelligence": "social-commerce-intelligence",
  "e-commerce-and-marketplace/social-commerce-intelligence": "social-commerce-intelligence",
  "ecommerce/social-commerce-intelligence": "social-commerce-intelligence",
  "social-commerce-intelligence": "social-commerce-intelligence",

  "education-and-courses/education": "education-school-dashboard",
  "pendidikan-and-kursus/education": "education-school-dashboard",
  "education/education": "education-school-dashboard",
  "education": "education-school-dashboard",

  reports: "reports",
  notifications: "notifications",
  billing: "billing",
  access: "access",
  settings: "settings",
  "settings/security": "settings-security",
  profile: "profile",
  faq: "faq"
};

const fnbSubIndustries = ["restaurant", "restoran", "cafe", "bakery", "cloud-kitchen", "food-court"] as const;

const fnbModuleRoutes: Record<string, PortalPage> = {
  pos: "fnb-pos",
  "order-history": "fnb-order-history",
  menu: "fnb-menu",
  "table-order": "fnb-table-order",
  reservation: "fnb-reservation",
  kds: "fnb-kds",
  inventory: "fnb-inventory",
  sales: "fnb-sales",
  settings: "fnb-settings",
  "split-bill": "fnb-split-bill",
  loyalty: "fnb-loyalty",
  "shift-closing": "fnb-shift-closing",
  "pre-order": "fnb-pre-order",
  wholesale: "fnb-wholesale",
  "batch-stock": "fnb-batch-stock",
  "waste-report": "fnb-waste-report",
  "order-hub": "fnb-order-hub",
  "multi-brand": "fnb-multi-brand",
  "delivery-integration": "fnb-delivery-integration",
  "delivery-status": "fnb-delivery-status",
  "tenant-management": "fnb-tenant-management",
  "tenant-settlement": "fnb-tenant-settlement",
  "promo-rules": "fnb-promo-rules",
  "admin-tenant-dashboard": "fnb-admin-tenant-dashboard"
};

const clinicModuleRoutes: Record<string, PortalPage> = {
  dashboard: "clinic-dashboard",
  analytics: "clinic-analytics",
  patients: "clinic-patients",
  appointments: "clinic-appointments",
  queue: "clinic-queue",
  "nurse-station": "clinic-nurse-station",
  visits: "clinic-visits",
  prescriptions: "clinic-prescriptions",
  pharmacy: "clinic-pharmacy",
  cashier: "clinic-cashier",
  finance: "clinic-finance",
  integrations: "clinic-integrations",
  settings: "clinic-settings"
};

const socialCommerceModuleRoutes: Record<string, PortalPage> = {
  dashboard: "social-intel-dashboard",
  setup: "social-intel-setup",
  "guided-setup": "social-intel-setup",
  "product-radar": "social-intel-product-radar",
  "creator-intelligence": "social-intel-creator-intelligence",
  "competitor-watchlist": "social-intel-competitor-watchlist",
  "live-cockpit": "social-intel-live-cockpit",
  "live-commerce-cockpit": "social-intel-live-cockpit",
  "ad-radar": "social-intel-ad-radar",
  "ad-creative-radar": "social-intel-ad-radar",
  "campaign-planner": "social-intel-campaign-planner",
  "experiment-board": "social-intel-experiment-board",
  reports: "social-intel-reports",
  alerts: "social-intel-alerts",
  connectors: "social-intel-connectors",
  settings: "social-intel-settings"
};

const educationModuleRoutes: Record<string, PortalPage> = {
  // School / Campus
  dashboard: "education-school-dashboard",
  enrollment: "education-school-enrollment",
  classes: "education-school-classes",
  grades: "education-school-grades",
  attendance: "education-school-attendance",
  // Bootcamp
  lms: "education-bootcamp-lms",
  projects: "education-bootcamp-projects",
  cohorts: "education-bootcamp-cohorts",
  mentorship: "education-bootcamp-mentorship",
  // Tutoring
  schedules: "education-tutoring-schedules",
  invoicing: "education-tutoring-invoicing",
  reports: "education-tutoring-reports",
  // Language Course
  exams: "education-language-exams",
  certificates: "education-language-certificates",
  // Training Center
  trainings: "education-training-trainings",
  trainees: "education-training-trainees",
  "skill-tracking": "education-training-skill-tracking",
  // General
  settings: "education-settings"
};

export function resolvePortalRoute(slug: string[]): PortalPage {
  const route = slug.join("/");
  const directPage = portalRouteMap[route];
  if (directPage) return directPage;

  const [, fnbSubIndustry, fnbModule] = route.match(/^fnb\/([^/]+)\/([^/]+)$/) ?? [];
  if (fnbSubIndustry && fnbModule && fnbSubIndustries.includes(fnbSubIndustry as (typeof fnbSubIndustries)[number])) {
    return fnbModuleRoutes[fnbModule] ?? "home";
  }

  const [, clinicModule] = route.match(/^(?:healthcare\/clinic|clinic)\/([^/]+)$/) ?? [];
  if (clinicModule) return clinicModuleRoutes[clinicModule] ?? "home";

  const [, socialModule] = route.match(/^(?:ecommerce-and-marketplaces|e-commerce-and-marketplace|ecommerce)\/social-commerce-intelligence\/([^/]+)$/) ?? [];
  if (socialModule) return socialCommerceModuleRoutes[socialModule] ?? "social-commerce-intelligence";

  const [, standaloneSocialModule] = route.match(/^social-commerce-intelligence\/([^/]+)$/) ?? [];
  if (standaloneSocialModule) return socialCommerceModuleRoutes[standaloneSocialModule] ?? "social-commerce-intelligence";

  const educationSubIndustrySlugs = ["school-campus", "bootcamp", "tutoring", "language-course", "training-center"] as const;
  const educationPrefix = /^(?:education-and-courses|pendidikan-and-kursus|education)\/([^/]+(?:\/.+)?)$/.exec(route);
  if (educationPrefix?.[1]) {
    const matched = educationPrefix[1];
    if ((educationSubIndustrySlugs as readonly string[]).includes(matched)) {
      return `education-${matched}` as PortalPage;
    }
    const [subIndustry, module] = matched.split('/');
    if (subIndustry && module) {
      return educationModuleRoutes[module] ?? "education-school-dashboard";
    }
    return educationModuleRoutes[matched] ?? "education-school-dashboard";
  }

  const standaloneEducationModule = /^(?:school-campus|bootcamp|tutoring|language-course|training-center)\/(.+)$/.exec(route);
  if (standaloneEducationModule?.[1]) return educationModuleRoutes[standaloneEducationModule[1]] ?? "education-school-dashboard";

  if (slug.length === 1) return "industry";
  if (slug.length === 2) return "sub-industry";
  return "home";
}
