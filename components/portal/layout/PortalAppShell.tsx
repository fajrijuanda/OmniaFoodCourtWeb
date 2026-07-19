"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  CreditCard,
  Database,
  Download,
  FileText,
  FileCheck2,
  Filter,
  Factory,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Home,
  Landmark,
  Layers3,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Network,
  Pill,
  Plus,
  Radar,
  RadioTower,
  RefreshCcw,
  ReceiptText,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Save,
  Store,
  Stethoscope,
  Truck,
  UserRound,
  Users,
  UserPlus,
  UserSearch,
  UsersRound,
  Wand2,
  WalletCards,
  X,
  XCircle,
  MapPin,
  NotebookTabs,
  PenLine,
  Receipt,
  Target,
  Trash2,
  FlaskConical
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiFetch, isSuperAdminUser, type AuthUser, type PortalSummary, type TenantContextResponse } from "@/lib/api";
import { buildVerticalHandoffUrl, resolveVerticalTarget } from "@/lib/verticalHandoff";
import { PricingPlanModal, type PricingTier } from "@/components/PricingPlanModal";
import { buildPlans } from "@/components/showcase/pricing";
import { isPortalThemeKey, PORTAL_THEME_STORAGE_KEY, type PortalThemeKey } from "../settings/ThemeCustomizer";
import { getIndustryColor, getIndustryIcon, ownerPurchasedSegments, industryColorHex, landingIndustryIconMap, type PortalCatalogIndustry } from "../portalCatalog";
import { PortalDataTable } from "@/components/portal/ui";
import {
  clearAuthSession,
  getStoredActiveBranchId,
  getStoredActiveTenantId,
  getStoredDemoRole,
  getStoredHrisTier,
  getStoredUser,
  isPortalLoaded,
  persistAuthSession,
  setPortalLoaded,
  setStoredDemoRole,
  setStoredHrisTier,
  setStoredTenantContext
} from "@/lib/mobile/session";
import { PageShell, Panel, PortalLoadingScreen, RoundedSelect } from "@/components/portal/ui";
import { PortalDashboardHome } from "../pages/PortalDashboardHome";
import { PortalAppsPage } from "../pages/PortalAppsPage";
import { SecuritySettingsPage } from "../pages/SecuritySettingsPage";
import { GenericIndustryPage, GenericSubIndustryPage } from "../pages/GenericIndustryPages";
import { HrisFeaturePage, HrisOverviewPage } from "../industries/professional-services/hris/HrisPortal";
import type { HrisTier } from "../industries/professional-services/hris/HrisPortal";
import { HrisSettingsPage as LiveHrisSettingsPage } from "../industries/professional-services/hris/HrisSettingsPage";
import { PortalLayout } from "../layout/PortalLayout";
import { FnbPortal } from "../industries/fnb/FnbPortal";
import { FnbIndustryPage } from "../industries/fnb/pages/FnbIndustryPage";
import { ChurchPortal } from "../industries/public-services/church/ChurchPortal";
import { ClinicOpsPortal } from "../industries/healthcare/clinic/ClinicOpsPortal";
import { SocialCommerceFeaturePage, SocialCommerceOverviewPage } from "../industries/ecommerce-and-marketplaces/social-commerce-intelligence/SocialCommercePortal";
import { BranchManagementPanel } from "../shared/BranchManagementPanel";
import { fnbSubIndustries } from "../industries/fnb/config/subIndustries";
import { educationSubIndustries } from "../industries/education-and-courses/config/educationSubIndustries";
import { LmsPortal } from "../industries/education-and-courses/e-learning-lms/LmsPortal";
import { KknPortal } from "../industries/education-and-courses/kkn-and-fieldwork/KknPortal";
import { AcademicPortal } from "../industries/education-and-courses/layanan-akademik/AcademicPortal";
import { SchoolPortal } from "../industries/education-and-courses/school/SchoolPortal";
import { BootcampPortal } from "../industries/education-and-courses/bootcamp/BootcampPortal";
import { TutoringPortal } from "../industries/education-and-courses/tutoring/TutoringPortal";
import { LanguageCoursePortal } from "../industries/education-and-courses/language-course/LanguageCoursePortal";
import { TrainingCenterPortal } from "../industries/education-and-courses/training-center/TrainingCenterPortal";
import {
  churchContextPages,
  clinicContextPages,
  fnbModulePages,
  globalPortalPages,
  hrisModulePages,
  hrisContextPages,
  educationContextPages,
  educationModulePages,
  portalPagePaths,
  portalPageTitles,
  socialCommerceContextPages,
  type PortalPage,
  type PortalRole
} from "../portalTypes";

export type { PortalPage } from "../portalTypes";

const baseSidebarItems: Array<{ icon: LucideIcon; label: string; page: PortalPage; roles: PortalRole[] }> = [
  { icon: Home, label: "Home", page: "home", roles: ["developer", "owner"] },
  { icon: LayoutDashboard, label: "Apps", page: "apps", roles: ["developer", "owner"] },
  { icon: BarChart3, label: "Reports", page: "reports", roles: ["developer", "owner", "employee"] },
  { icon: WalletCards, label: "Billing", page: "billing", roles: ["owner"] },
  { icon: ShieldCheck, label: "Access", page: "access", roles: ["developer"] },
  { icon: Settings, label: "Settings", page: "settings", roles: ["developer", "owner", "employee"] }
];

const employeeHrisSidebarItems: Array<{ icon: LucideIcon; label: string; page: PortalPage }> = [
  { icon: UsersRound, label: "Employees", page: "hris-employees" },
  { icon: CalendarCheck2, label: "Attendance", page: "hris-attendance" },
  { icon: ShieldCheck, label: "Leave", page: "hris-leave" },
  { icon: WalletCards, label: "Payroll", page: "hris-payroll" },
  { icon: FileText, label: "Payslip", page: "hris-payslip" },
  { icon: ReceiptText, label: "Adv. Payroll", page: "hris-advanced-payroll" as PortalPage },
  { icon: Receipt, label: "Reimburse", page: "hris-reimbursement" as PortalPage },
  { icon: HandCoins, label: "Kasbon", page: "hris-loans" as PortalPage },
  { icon: MapPin, label: "Field Report", page: "hris-field-report" as PortalPage },
  { icon: BarChart3, label: "Dashboard", page: "hris-dashboard" as PortalPage },
  { icon: Target, label: "Performance", page: "hris-performance" as PortalPage },
  { icon: UserSearch, label: "Recruitment", page: "hris-recruitment" as PortalPage }
];

const fnbSubIndustryPages: Partial<Record<PortalPage, string>> = {
  "fnb-cafe": "cafe",
  "fnb-restaurant": "restaurant",
  "fnb-bakery": "bakery",
  "fnb-cloud-kitchen": "cloud-kitchen",
  "fnb-food-court": "food-court"
};

const fnbModulePageById: Record<string, PortalPage> = {
  "sales-dashboard": "fnb-sales",
  "order-history": "fnb-order-history",
  pos: "fnb-pos",
  "menu-settings": "fnb-menu",
  "table-order": "fnb-table-order",
  reservation: "fnb-reservation",
  kds: "fnb-kds",
  inventory: "fnb-inventory",
  "pre-order": "fnb-pre-order",
  wholesale: "fnb-wholesale",
  loyalty: "fnb-loyalty",
  "shift-closing": "fnb-shift-closing",
  "split-bill": "fnb-split-bill",
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

const fnbRouteSlugByPage: Partial<Record<PortalPage, string>> = {
  "fnb-order-history": "order-history",
  "fnb-pos": "pos",
  "fnb-menu": "menu",
  "fnb-table-order": "table-order",
  "fnb-reservation": "reservation",
  "fnb-kds": "kds",
  "fnb-inventory": "inventory",
  "fnb-sales": "sales",
  "fnb-pre-order": "pre-order",
  "fnb-wholesale": "wholesale",
  "fnb-loyalty": "loyalty",
  "fnb-shift-closing": "shift-closing",
  "fnb-split-bill": "split-bill",
  "fnb-batch-stock": "batch-stock",
  "fnb-waste-report": "waste-report",
  "fnb-order-hub": "order-hub",
  "fnb-multi-brand": "multi-brand",
  "fnb-delivery-integration": "delivery-integration",
  "fnb-delivery-status": "delivery-status",
  "fnb-tenant-management": "tenant-management",
  "fnb-tenant-settlement": "tenant-settlement",
  "fnb-promo-rules": "promo-rules",
  "fnb-admin-tenant-dashboard": "admin-tenant-dashboard",
  "fnb-settings": "settings"
};

function getFnbSubIndustrySlug(pathname: string, page: PortalPage) {
  const pathMatch = pathname.match(/^\/portal\/fnb\/([^/]+)/);
  const pathSlug = pathMatch?.[1];
  if (pathSlug === "restaurant") return "restoran";
  if (pathSlug && fnbSubIndustries[pathSlug]) return pathSlug;
  return fnbSubIndustryPages[page] ?? "cafe";
}

function getFnbPath(page: PortalPage, subIndustrySlug: string) {
  if (fnbSubIndustryPages[page]) return `/portal/fnb/${fnbSubIndustryPages[page]}`;
  const routeSlug = fnbRouteSlugByPage[page];
  return routeSlug ? `/portal/fnb/${subIndustrySlug}/${routeSlug}` : portalPagePaths[page];
}

const educationSubIndustryPages: Partial<Record<PortalPage, string>> = {
  "education-school-campus": "school-campus",
  "education-bootcamp": "bootcamp",
  "education-tutoring": "tutoring",
  "education-language-course": "language-course",
  "education-training-center": "training-center"
};

const educationModulePageById: Record<string, PortalPage> = {
  "dashboard": "education-school-dashboard",
  "enrollment": "education-school-enrollment",
  "classes": "education-school-classes",
  "grades": "education-school-grades",
  "attendance": "education-school-attendance",
  "lms": "education-bootcamp-lms",
  "projects": "education-bootcamp-projects",
  "cohorts": "education-bootcamp-cohorts",
  "mentorship": "education-bootcamp-mentorship",
  "schedules": "education-tutoring-schedules",
  "invoicing": "education-tutoring-invoicing",
  "reports": "education-tutoring-reports",
  "exams": "education-language-exams",
  "certificates": "education-language-certificates",
  "trainings": "education-training-trainings",
  "trainees": "education-training-trainees",
  "skill-tracking": "education-training-skill-tracking"
};

const educationRouteSlugByPage: Partial<Record<PortalPage, string>> = {
  "education-school-dashboard": "dashboard",
  "education-school-enrollment": "enrollment",
  "education-school-classes": "classes",
  "education-school-grades": "grades",
  "education-school-attendance": "attendance",
  "education-bootcamp-dashboard": "dashboard",
  "education-bootcamp-lms": "lms",
  "education-bootcamp-projects": "projects",
  "education-bootcamp-cohorts": "cohorts",
  "education-bootcamp-mentorship": "mentorship",
  "education-tutoring-dashboard": "dashboard",
  "education-tutoring-schedules": "schedules",
  "education-tutoring-attendance": "attendance",
  "education-tutoring-invoicing": "invoicing",
  "education-tutoring-reports": "reports",
  "education-language-dashboard": "dashboard",
  "education-language-classes": "classes",
  "education-language-attendance": "attendance",
  "education-language-exams": "exams",
  "education-language-certificates": "certificates",
  "education-training-dashboard": "dashboard",
  "education-training-trainings": "trainings",
  "education-training-trainees": "trainees",
  "education-training-certificates": "certificates",
  "education-training-skill-tracking": "skill-tracking",
  "education-settings": "settings"
};

function getEducationSubIndustrySlug(pathname: string, page: PortalPage) {
  const pathMatch = pathname.match(/^\/portal\/education-and-courses\/([^/]+)/);
  const pathSlug = pathMatch?.[1];
  if (pathSlug && educationSubIndustries[pathSlug]) return pathSlug;
  return educationSubIndustryPages[page] ?? "school-campus";
}

function getEducationPath(page: PortalPage, subIndustrySlug: string) {
  if (educationSubIndustryPages[page]) return `/portal/education-and-courses/${educationSubIndustryPages[page]}`;
  const routeSlug = educationRouteSlugByPage[page];
  return routeSlug ? `/portal/education-and-courses/${subIndustrySlug}/${routeSlug}` : portalPagePaths[page];
}

function portalTenantTierRank(tenant: TenantContextResponse["tenants"][number] | undefined) {
  const text = tenant?.subscriptions?.map((subscription) => `${subscription.tier?.slug ?? ""} ${subscription.tier?.name ?? ""}`).join(" ").toLowerCase() ?? "";
  if (text.includes("enterprise")) return 4;
  if (text.includes("business") || text.includes("pro")) return 3;
  if (text.includes("growth")) return 2;
  if (text.includes("starter")) return 1;
  return 1;
}

function canUseAllBranchScope(tenant: TenantContextResponse["tenants"][number] | undefined, role: PortalRole) {
  return Boolean((role === "developer" || tenant?.role === "owner" || tenant?.role === "admin") && portalTenantTierRank(tenant) >= 2);
}

function allowedBranchesForTenant(tenant: TenantContextResponse["tenants"][number] | undefined) {
  if (!tenant) return [];
  const allowedIds = tenant.allowedBranchIds?.length ? tenant.allowedBranchIds : tenant.branches.map((branch) => branch.id);
  return tenant.branches.filter((branch) => allowedIds.includes(branch.id));
}

function initialsFromName(value: string) {
  const normalized = value.trim();
  if (!normalized) return "OM";
  const source = normalized.includes("@") ? normalized.split("@")[0] : normalized;
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)).toUpperCase();
}

const hrisModuleIcons = [UsersRound, CalendarCheck2, ShieldCheck, WalletCards, Database, Activity, BarChart3, Lock];

type LeaveRequest = {
  id: string;
  employee: string;
  type: string;
  dates: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};

type PortalNotification = {
  id: string;
  title: string;
  body: string;
  category: string;
  time: string;
  status: "Unread" | "Read";
  priority: "High" | "Normal" | "Low";
};

const industrySlugAliases: Record<string, string[]> = {
  "food-and-beverage": ["food-and-beverage", "fb-kuliner", "fnb"],
  fnb: ["food-and-beverage", "fb-kuliner", "fnb"],
  "fb-kuliner": ["food-and-beverage", "fb-kuliner", "fnb"],
  "professional-services": ["professional-services", "jasa-profesional"],
  "jasa-profesional": ["professional-services", "jasa-profesional"],
  "ecommerce-and-marketplaces": ["ecommerce-and-marketplaces", "e-commerce-and-marketplace", "ecommerce"],
  ecommerce: ["ecommerce-and-marketplaces", "e-commerce-and-marketplace", "ecommerce"],
  "public-services": ["public-services", "layanan-publik"],
  "layanan-publik": ["public-services", "layanan-publik"],
  healthcare: ["healthcare", "kesehatan", "kesehatan-klinik"],
  kesehatan: ["healthcare", "kesehatan", "kesehatan-klinik"],
  "education-and-courses": ["education-and-courses", "pendidikan-and-kursus", "education"],
  "pendidikan-and-kursus": ["education-and-courses", "pendidikan-and-kursus", "education"],
  education: ["education-and-courses", "pendidikan-and-kursus", "education"]
};

function findCatalogIndustry(industries: PortalCatalogIndustry[], slug: string | null) {
  if (!slug) return null;
  const candidates = industrySlugAliases[slug] ?? [slug];
  return industries.find((industry) => candidates.includes(industry.slug))
    ?? (slug === "fnb" ? industries.find((industry) => industry.slug.startsWith("fb-") || industry.name.toLowerCase().includes("f&b")) : null)
    ?? (slug === "public-services" ? industries.find((industry) => industry.slug.includes("layanan-publik")) : null)
    ?? (slug === "professional-services" ? industries.find((industry) => industry.slug === "jasa-profesional") : null)
    ?? (slug === "ecommerce-and-marketplaces" ? industries.find((industry) => industry.slug.includes("commerce") || industry.slug.includes("marketplace")) : null)
    ?? (slug === "education-and-courses" ? industries.find((industry) => industry.slug.includes("education") || industry.slug.includes("pendidikan")) : null)
    ?? null;
}

export function PortalAppShell({
  initialPage = "home",
  routeIndustrySlug = null,
  routeSubIndustrySlug = null
}: {
  initialPage?: PortalPage;
  routeIndustrySlug?: string | null;
  routeSubIndustrySlug?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<PortalRole>("owner");
  const [account, setAccount] = useState<AuthUser | null>(null);
  const [themeKey, setThemeKeyState] = useState<PortalThemeKey>("omni");
  const [activePage, setActivePage] = useState<PortalPage>(initialPage);
  const [activeHrisTier, setActiveHrisTier] = useState<HrisTier>("growth");
  const [contentLoading, setContentLoading] = useState(false);
  const contentLoadingTimer = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const target = resolveVerticalTarget(pathname);
    if (!target) return;
    window.location.replace(buildVerticalHandoffUrl(target.vertical, `${target.path}${window.location.search}`));
  }, [pathname]);

  useEffect(() => {
    // Prevent hydration mismatches by reading client storage after hydration
    const storedTheme = window.localStorage.getItem(PORTAL_THEME_STORAGE_KEY);
    if (isPortalThemeKey(storedTheme)) setThemeKeyState(storedTheme);

    const storedTier = getStoredHrisTier() as HrisTier;
    if (["starter", "growth", "pro", "enterprise"].includes(storedTier)) {
      setActiveHrisTier(storedTier);
    }

    const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    const isLoaded = isPortalLoaded();
    
    if (isReload || !isLoaded) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  const [catalogIndustries, setCatalogIndustries] = useState<PortalCatalogIndustry[]>([]);
  const [tenantContext, setTenantContext] = useState<TenantContextResponse | null>(null);
  const lastSidebarRef = useRef<Array<{ icon: LucideIcon; label: string; page: PortalPage }>>([]);

  useEffect(() => {
    apiFetch<PortalCatalogIndustry[]>("/portal/catalog")
      .then((data) => setCatalogIndustries(data))
      .catch((err) => console.error("Failed to load catalog", err));
  }, []);

  useEffect(() => {
    apiFetch<TenantContextResponse>("/tenant/context")
      .then((context) => {
        setTenantContext(context);
        const activeTenantId = getStoredActiveTenantId() ?? context.activeTenantId ?? context.tenants[0]?.id;
        const activeTenant = context.tenants.find((tenant) => tenant.id === activeTenantId) ?? context.tenants[0];
        const visibleBranches = allowedBranchesForTenant(activeTenant);
        const storedBranchId = getStoredActiveBranchId();
        const canUseAll = canUseAllBranchScope(activeTenant, role);
        const nextBranchScope = canUseAll ? "all" : "single";
        const activeBranchId = nextBranchScope === "all"
          ? null
          : (storedBranchId && visibleBranches.some((branch) => branch.id === storedBranchId) ? storedBranchId : context.activeBranchId ?? visibleBranches[0]?.id ?? null);
        setStoredTenantContext({ tenantId: activeTenant?.id ?? null, branchId: activeBranchId, branchScope: nextBranchScope });
      })
      .catch((err) => console.error("Failed to load tenant context", err));
  }, [role]);
  
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = getStoredHrisTier() as HrisTier;
      if (["starter", "growth", "pro", "enterprise"].includes(stored)) {
        setActiveHrisTier(stored);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const setThemeKey = (nextTheme: PortalThemeKey) => {
    setThemeKeyState(nextTheme);
    window.localStorage.setItem(PORTAL_THEME_STORAGE_KEY, nextTheme);
    document.documentElement.dataset.portalTheme = nextTheme;
    document.body.dataset.portalTheme = nextTheme;
  };

  const handleTierActivated = useCallback((tier: HrisTier) => {
    setActiveHrisTier(tier);
    setStoredHrisTier(tier);
  }, []);

  const activeCatalogIndustry = findCatalogIndustry(catalogIndustries, routeIndustrySlug);
  const activeCatalogSubIndustry = activeCatalogIndustry && routeSubIndustrySlug
    ? activeCatalogIndustry.subIndustries.find((subIndustry) => subIndustry.slug === routeSubIndustrySlug) ?? null
    : null;

  const goToPath = (path: string) => {
    if (contentLoadingTimer.current) {
      window.clearTimeout(contentLoadingTimer.current);
    }
    setContentLoading(true);
    if (path.startsWith("http://") || path.startsWith("https://")) {
      window.location.href = path;
      return;
    }
    router.push(path);
    contentLoadingTimer.current = window.setTimeout(() => {
      setContentLoading(false);
      contentLoadingTimer.current = null;
    }, 620);
  };

  const goToPage = (page: PortalPage) => {
    if (page === activePage) {
      return;
    }
    // SSO Handoff is handled by resolveVerticalTarget in a useEffect listening to pathname changes

    if (contentLoadingTimer.current) {
      window.clearTimeout(contentLoadingTimer.current);
    }
    setContentLoading(true);
    setActivePage(page);
    const match = page.match(/^hris-(starter|growth|business|enterprise)$/);
    if (match) {
      const newTier = match[1] as HrisTier;
      setActiveHrisTier(newTier);
      setStoredHrisTier(newTier);
    }
    const nextPath = page.startsWith("fnb-") 
      ? getFnbPath(page, getFnbSubIndustrySlug(pathname, page)) 
      : page.startsWith("education-") 
        ? getEducationPath(page, getEducationSubIndustrySlug(pathname, page)) 
        : portalPagePaths[page];
        
    const isGlobalTarget = globalPortalPages.includes(page as (typeof globalPortalPages)[number]);
    const context = isGlobalTarget && !globalPortalPages.includes(pageForContext as (typeof globalPortalPages)[number]) ? pageForContext : searchParams.get("context");
    
    const finalPath = context ? `${nextPath}?context=${encodeURIComponent(context)}` : nextPath;
    if (finalPath.startsWith("http://") || finalPath.startsWith("https://")) {
      window.location.href = finalPath;
      return;
    }
    
    router.push(finalPath);
    contentLoadingTimer.current = window.setTimeout(() => {
      setContentLoading(false);
      contentLoadingTimer.current = null;
    }, 620);
  };

  useEffect(() => {
    const parsedAccount = getStoredUser<AuthUser>();
    const storedAccountRole: AuthUser["role"] | null = parsedAccount?.role ?? null;
    if (parsedAccount) setAccount(parsedAccount);
    else setAccount(null);
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get("role");
    const storedRole = getStoredDemoRole();
    const isSuperAdminAccount = isSuperAdminUser(parsedAccount);
    const accountRole: PortalRole | null = isSuperAdminAccount || storedAccountRole === "super_admin"
      ? "developer"
      : storedAccountRole === "owner" || storedAccountRole === "employee"
        ? storedAccountRole
        : null;
    const nextRole: PortalRole = accountRole === "developer"
      ? "developer"
      : urlRole === "developer" || urlRole === "owner" || urlRole === "employee"
        ? urlRole
        : accountRole ?? (
        storedRole === "developer" || storedRole === "owner" || storedRole === "employee"
          ? storedRole
          : "owner"
      );
    setRole(nextRole);
    if (nextRole === "developer") {
      setActiveHrisTier("enterprise");
      setStoredHrisTier("enterprise");
    }
    const nextPage = nextRole === "employee" && (initialPage === "home" || initialPage === "apps" || initialPage === "education-school-campus" || initialPage === "hris-employees")
      ? "hris-attendance"
      : initialPage;
    setActivePage(nextPage);
    setStoredDemoRole(nextRole);
    document.body.dataset.portalTheme = themeKey;
    if (nextPage !== initialPage) {
      router.replace(portalPagePaths[nextPage]);
    }
    const timer = window.setTimeout(() => {
      setPortalLoaded(true);
      setIsLoading(false);
    }, 620);
    return () => window.clearTimeout(timer);
  }, [initialPage, router, themeKey]);

  useEffect(() => {
    return () => {
      if (contentLoadingTimer.current) {
        window.clearTimeout(contentLoadingTimer.current);
      }
    };
  }, []);

  const isGlobalPage = globalPortalPages.includes(activePage as (typeof globalPortalPages)[number]);
  const queryContext = searchParams.get("context") as PortalPage | null;
  const pageForContext = isGlobalPage && queryContext ? queryContext : activePage;
  const isHrisModulePage = hrisModulePages.includes(pageForContext as (typeof hrisModulePages)[number]);
  const isHrisContextPage = hrisContextPages.includes(pageForContext as (typeof hrisContextPages)[number]);
  const isChurchContextPage = churchContextPages.includes(pageForContext as (typeof churchContextPages)[number]);
  const isClinicContextPage = clinicContextPages.includes(pageForContext as (typeof clinicContextPages)[number]);
  const isFnbModulePage = fnbModulePages.includes(pageForContext as (typeof fnbModulePages)[number]);
  const isSocialCommerceContextPage = socialCommerceContextPages.includes(pageForContext as (typeof socialCommerceContextPages)[number]);
  const isEducationContextPage = educationContextPages.includes(pageForContext as (typeof educationContextPages)[number]);
  const isEducationModulePage = educationModulePages.includes(pageForContext as (typeof educationModulePages)[number]);
  const fnbSubIndustrySlug = getFnbSubIndustrySlug(pathname, pageForContext);
  const fnbSubIndustry = fnbSubIndustries[fnbSubIndustrySlug] ?? fnbSubIndustries.cafe;
  const fnbDashboardPage = (Object.entries(fnbSubIndustryPages).find(([, slug]) => slug === fnbSubIndustrySlug)?.[0] ?? "fnb-cafe") as PortalPage;
  
  const educationSubIndustrySlug = getEducationSubIndustrySlug(pathname, pageForContext);
  const eduSubIndustry = educationSubIndustries[educationSubIndustrySlug] ?? educationSubIndustries["school-campus"];
  const eduDashboardPage = (Object.entries(educationSubIndustryPages).find(([, slug]) => slug === educationSubIndustrySlug)?.[0] ?? "education-school-campus") as PortalPage;
  
  const hrisTierRank = { starter: 1, growth: 2, pro: 3, enterprise: 4 };
  const hrisItemMinTier = (page: string) => {
    if (page === "hris-advanced-payroll" || page === "hris-reimbursement" || page === "hris-loans" || page === "hris-field-report") return 2; // growth
    if (page === "hris-dashboard" || page === "hris-performance") return 3; // business
    if (page === "hris-recruitment") return 4; // enterprise
    return 1; // starter (employees, attendance, leave, payroll, payslip)
  };
  const effectiveHrisTier: HrisTier = role === "developer" ? "enterprise" : activeHrisTier;
  const activeTenantForTier = tenantContext?.tenants.find((tenant) => tenant.id === getStoredActiveTenantId()) ?? tenantContext?.tenants[0];
  const clinicSubscriptionTier = activeTenantForTier?.subscriptions?.find((subscription) => {
    const slug = `${subscription.subIndustry?.slug ?? ""} ${subscription.subIndustry?.industry?.slug ?? ""} ${subscription.subIndustry?.name ?? ""}`.toLowerCase();
    return slug.includes("clinic") || slug.includes("klinik") || slug.includes("health") || slug.includes("kesehatan");
  })?.tier?.slug?.toLowerCase();
  const effectiveClinicTier = role === "developer"
    ? "enterprise"
    : clinicSubscriptionTier?.includes("enterprise")
      ? "enterprise"
      : clinicSubscriptionTier?.includes("pro")
        ? "pro"
        : clinicSubscriptionTier?.includes("growth")
          ? "growth"
          : clinicSubscriptionTier?.includes("starter")
            ? "starter"
            : effectiveHrisTier;
  const currentTierRank = hrisTierRank[effectiveHrisTier];
  const hasPortalPermission = (permission: string) => {
    const permissions = account?.permissions ?? [];
    if (role !== "employee") return true;
    if (permissions.includes("*") || permissions.includes(permission)) return true;
    const parts = permission.split(".");
    for (let index = parts.length - 1; index > 0; index -= 1) {
      if (permissions.includes(`${parts.slice(0, index).join(".")}.*`)) return true;
    }
    return false;
  };
  const employeePagePermission = (page: PortalPage) => {
    if (["hris-employees", "hris-attendance", "hris-leave", "hris-payslip"].includes(page)) return "hris.self.read";
    if (page === "hris-loans") return "hris.loan.request";
    if (page === "hris-payroll" || page === "hris-advanced-payroll") return "hris.payroll.read";
    if (page === "hris-settings") return "hris.settings.manage";
    return "hris.*";
  };

  const moduleSidebarItems = [
    ...(role === "employee" ? [] : [{ icon: LayoutDashboard, label: "Overview", page: "hris" as PortalPage }]),
    ...employeeHrisSidebarItems.filter(item => {
      if (role === "employee" && item.page === "hris-employees") return false;
      const minTier = hrisItemMinTier(item.page);
      if (minTier > currentTierRank) return false;
      if (role === "employee" && !hasPortalPermission(employeePagePermission(item.page))) return false;
      // Jika Adv. Payroll (tier >= 2) tersedia, sembunyikan Payroll basic
      if (item.page === "hris-payroll" && currentTierRank >= 2) return false;
      return true;
    }),
    ...(role === "employee" && !hasPortalPermission("hris.settings.manage") ? [] : [{ icon: Settings, label: "Settings", page: "hris-settings" as PortalPage }])
  ];
  const contextualFnbSidebarItems = [
    { icon: Store, label: "Overview", page: fnbDashboardPage },
    ...fnbSubIndustry.modules
      .map((item) => {
        const page = fnbModulePageById[item.id];
        return page ? { icon: item.icon as LucideIcon, label: item.label, page } : null;
      })
      .filter((item): item is { icon: LucideIcon; label: string; page: PortalPage } => Boolean(item)),
    { icon: Settings, label: "Settings", page: "fnb-settings" as PortalPage },
    { icon: ArrowLeft, label: "Back to Portal", page: "home" as PortalPage }
  ];
  const churchSidebarItems = [
    { icon: LayoutDashboard, label: "Overview", page: "church-dashboard" as PortalPage },
    { icon: Users, label: "Jemaat", page: "church-jemaat" as PortalPage },
    { icon: UsersRound, label: "Komsel", page: "church-komsel" as PortalPage },
    { icon: CalendarDays, label: "Ibadah", page: "church-ibadah" as PortalPage },
    { icon: Briefcase, label: "Pelayanan", page: "church-pelayanan" as PortalPage },
    { icon: HandCoins, label: "Keuangan", page: "church-keuangan" as PortalPage },
    { icon: Building2, label: "Aset", page: "church-aset" as PortalPage },
    { icon: Settings, label: "Settings", page: "church-settings" as PortalPage },
    { icon: ArrowLeft, label: "Back to Portal", page: "home" as PortalPage }
  ];
  const clinicSidebarItems = [
    { icon: LayoutDashboard, label: "Overview", page: "clinic-dashboard" as PortalPage },
    { icon: Activity, label: "Analytics", page: "clinic-analytics" as PortalPage },
    { icon: Users, label: "Patients", page: "clinic-patients" as PortalPage },
    { icon: CalendarCheck2, label: "Appointment", page: "clinic-appointments" as PortalPage },
    { icon: ListChecks, label: "Queue", page: "clinic-queue" as PortalPage },
    { icon: HeartPulse, label: "Nurse", page: "clinic-nurse-station" as PortalPage },
    { icon: Stethoscope, label: "Visits", page: "clinic-visits" as PortalPage },
    { icon: Pill, label: "E-Resep", page: "clinic-prescriptions" as PortalPage },
    { icon: FlaskConical, label: "Farmasi", page: "clinic-pharmacy" as PortalPage },
    { icon: CreditCard, label: "Kasir", page: "clinic-cashier" as PortalPage },
    { icon: WalletCards, label: "Finance", page: "clinic-finance" as PortalPage },
    { icon: Network, label: "Integrasi", page: "clinic-integrations" as PortalPage },
    { icon: Settings, label: "Settings", page: "clinic-settings" as PortalPage },
    { icon: ArrowLeft, label: "Back to Portal", page: "home" as PortalPage }
  ];
  const socialCommerceSidebarItems = [
    { icon: LayoutDashboard, label: "Overview", page: "social-commerce-intelligence" as PortalPage },
    { icon: BarChart3, label: "Dashboard", page: "social-intel-dashboard" as PortalPage },
    { icon: Wand2, label: "Setup", page: "social-intel-setup" as PortalPage },
    { icon: Radar, label: "Products", page: "social-intel-product-radar" as PortalPage },
    { icon: Users, label: "Creators", page: "social-intel-creator-intelligence" as PortalPage },
    { icon: Store, label: "Watchlist", page: "social-intel-competitor-watchlist" as PortalPage },
    { icon: RadioTower, label: "Live", page: "social-intel-live-cockpit" as PortalPage },
    { icon: Sparkles, label: "Ads", page: "social-intel-ad-radar" as PortalPage },
    { icon: Target, label: "Campaign", page: "social-intel-campaign-planner" as PortalPage },
    { icon: ClipboardList, label: "Experiments", page: "social-intel-experiment-board" as PortalPage },
    { icon: FileText, label: "Reports", page: "social-intel-reports" as PortalPage },
    { icon: Bell, label: "Alerts", page: "social-intel-alerts" as PortalPage },
    { icon: Network, label: "Connectors", page: "social-intel-connectors" as PortalPage },
    { icon: Settings, label: "Settings", page: "social-intel-settings" as PortalPage },
    { icon: ArrowLeft, label: "Back to Portal", page: "home" as PortalPage }
  ];
  const educationSidebarItems = [
    { icon: LayoutDashboard, label: "Overview", page: eduDashboardPage },
    ...eduSubIndustry.modules
      .map((item) => {
        const page = educationModulePageById[item.id];
        return page ? { icon: item.icon as LucideIcon, label: item.label, page } : null;
      })
      .filter((item): item is { icon: LucideIcon; label: string; page: PortalPage } => Boolean(item)),
    { icon: Settings, label: "Settings", page: "education-settings" as PortalPage },
    { icon: ArrowLeft, label: "Back to Portal", page: "home" as PortalPage }
  ];

  const computedSidebarItems = isFnbModulePage
    ? contextualFnbSidebarItems
    : isClinicContextPage
      ? clinicSidebarItems
    : isSocialCommerceContextPage
      ? socialCommerceSidebarItems
    : isEducationContextPage
      ? educationSidebarItems
    : isChurchContextPage
      ? churchSidebarItems
      : (role === "employee" || isHrisContextPage)
        ? moduleSidebarItems
        : baseSidebarItems.filter((item) => item.roles.includes(role));

  if (!isGlobalPage || lastSidebarRef.current.length === 0) {
    lastSidebarRef.current = computedSidebarItems;
  }
  const sidebarItems = isGlobalPage ? lastSidebarRef.current : computedSidebarItems;
  const fallbackProfile = {
    developer: { initials: "DV", name: "Developer Omnia", email: "dev@omnia.demo", label: "Superadmin" },
    owner: { initials: "OW", name: "Owner Tenant", email: "owner@omnia.demo", label: "Owner Tenant" },
    employee: { initials: "EM", name: "Employee", email: "employee@omnia.demo", label: "Employee" }
  }[role];
  const profile = {
    initials: initialsFromName(account?.name ?? account?.email ?? fallbackProfile.name),
    name: account?.name ?? fallbackProfile.name,
    email: account?.email ?? fallbackProfile.email,
    label: role === "developer"
      ? "Superadmin"
      : account?.tenantRole === "admin"
        ? "Admin Tenant"
        : account?.tenantRole === "employee" || role === "employee"
          ? "Employee"
          : "Owner Tenant"
  };

  const pageTitle = activePage === "industry"
    ? activeCatalogIndustry?.name ?? "Industri"
    : activePage === "sub-industry"
      ? activeCatalogSubIndustry?.name ?? "Sub-industri"
      : portalPageTitles[activePage] ?? "Portal";
  const trialLocked = Boolean(account?.trialExpired || account?.effectiveSubscriptionStatus === "unsubscribed");
  const trialSubIndustry = account?.trialSubIndustry?.name ?? "sub-industri pilihan";
  const trialTier = account?.trialTier?.name ?? "Tier Starter";
  const isTrialFeaturePage = activePage === "professional-services" || activePage === "hris" || activePage.startsWith("hris-") || isEducationContextPage;

  return (
    <PortalLayout
      activePage={activePage}
      role={role}
      pageTitle={pageTitle}
      profile={profile}
      tenantContext={tenantContext}
      onTenantContextChange={(tenantId, branchId, branchScope) => {
        setStoredTenantContext({ tenantId, branchId, branchScope });
        window.location.reload();
      }}
      sidebarItems={sidebarItems}
      isHrisContextPage={isHrisContextPage}
      isFnbModulePage={isFnbModulePage}
      isChurchContextPage={isChurchContextPage}
      isClinicContextPage={isClinicContextPage}
      isSocialCommerceContextPage={isSocialCommerceContextPage}
      isEducationContextPage={isEducationContextPage}
      isLoading={isLoading}
      themeKey={themeKey}
      setThemeKey={setThemeKey}
      goToPage={goToPage}
      goToPath={goToPath}
      industries={catalogIndustries}
      activeIndustrySlug={routeIndustrySlug}
      onOpenProfile={() => goToPage("profile")}
      onSignOutConfirm={() => {
        clearAuthSession();
        router.push("/login");
      }}
    >
      {account?.subscriptionStatus === "trial" ? (
        <div className={`mb-4 rounded-[22px] border p-4 shadow-sm ${trialLocked ? "border-rose-100 bg-rose-50 text-rose-700" : "border-orange-100 bg-orange-50 text-orange-700"}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em]">{trialLocked ? "Belum berlangganan" : "Trial aktif"}</p>
              <p className="mt-1 text-sm font-bold">
                {trialLocked
                  ? `Trial ${trialTier} untuk ${trialSubIndustry} sudah berakhir. Fitur Starter dinonaktifkan sampai berlangganan.`
                  : `Trial ${trialTier} untuk ${trialSubIndustry} aktif sampai ${account.trialEndsAt ? new Date(account.trialEndsAt).toLocaleDateString("id-ID") : "3 hari"}.`}
              </p>
            </div>
            <button onClick={() => setUpgradeOpen(true)} className="w-fit rounded-full bg-[#111111] px-4 py-2 text-xs font-black text-white" type="button">
              Berlangganan
            </button>
          </div>
        </div>
      ) : null}
      {account?.mustChangePassword ? (
        <ForcedPasswordChangeModal
          onChanged={(session) => {
            void persistAuthSession(session);
            setAccount(session.user);
          }}
        />
      ) : null}
      <AnimatePresence mode="wait">
        {contentLoading ? (
          <PortalLoadingScreen label="Memuat halaman" />
        ) : (
          <>
            {trialLocked && isTrialFeaturePage ? <PageShell key="trial-locked"><TrialLockedPage subIndustry={trialSubIndustry} tier={trialTier} onUpgrade={() => setUpgradeOpen(true)} /></PageShell> : null}
            {activePage === "home" ? <PageShell key="home"><PortalDashboardHome setActivePage={goToPage} role={role} industries={catalogIndustries} /></PageShell> : null}
            {activePage === "apps" ? <PageShell key="apps"><PortalAppsPage industries={catalogIndustries} /></PageShell> : null}
            {activePage === "industry" ? <PageShell key={`industry-${routeIndustrySlug ?? "missing"}`}><GenericIndustryPage industry={activeCatalogIndustry} role={role} /></PageShell> : null}
            {activePage === "sub-industry" ? <PageShell key={`sub-industry-${routeIndustrySlug ?? "missing"}-${routeSubIndustrySlug ?? "missing"}`}><GenericSubIndustryPage industry={activeCatalogIndustry} subIndustry={activeCatalogSubIndustry} role={role} /></PageShell> : null}
            {!trialLocked && activePage === "professional-services" ? <PageShell key="professional-services"><GenericIndustryPage industry={findCatalogIndustry(catalogIndustries, "professional-services")} role={role} /></PageShell> : null}
            {!trialLocked && activePage === "hris" ? <PageShell key="hris"><HrisOverviewPage role={role} setActivePage={goToPage} onLockedModule={() => setUpgradeOpen(true)} tier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && activePage === "hris-employees" && role !== "employee" ? <PageShell key="hris-employees"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="employees" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-attendance" ? <PageShell key="hris-attendance"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="attendance" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-leave" ? <PageShell key="hris-leave"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="leave" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-payroll" ? <PageShell key="hris-payroll"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="payroll" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-payslip" ? <PageShell key="hris-payslip"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="payslip" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-dashboard" ? <PageShell key="hris-dashboard"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="dashboard" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-advanced-payroll" ? <PageShell key="hris-advanced-payroll"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="advanced-payroll" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-reimbursement" ? <PageShell key="hris-reimbursement"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="reimbursement" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-loans" ? <PageShell key="hris-loans"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="loans" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-field-report" ? <PageShell key="hris-field-report"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="field-report" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-performance" ? <PageShell key="hris-performance"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="performance" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-recruitment" ? <PageShell key="hris-recruitment"><HrisFeaturePage role={role} tier={effectiveHrisTier} feature="recruitment" onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && activePage === "hris-settings" ? <PageShell key="hris-settings"><LiveHrisSettingsPage tier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && activePage === "fnb" ? <PageShell key="fnb"><FnbIndustryPage role={role} setActivePage={goToPage} industry={findCatalogIndustry(catalogIndustries, "fnb")} /></PageShell> : null}
            {!trialLocked && isFnbModulePage && !isGlobalPage ? <PageShell key={activePage}><FnbPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && isClinicContextPage && !isGlobalPage ? <PageShell key={activePage}><ClinicOpsPortal activePage={activePage} currentTier={effectiveClinicTier} /></PageShell> : null}
            {!trialLocked && isChurchContextPage && !isGlobalPage ? <PageShell key={activePage}><ChurchPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && activePage === "social-commerce-intelligence" ? <PageShell key="social-commerce-intelligence"><SocialCommerceOverviewPage role={role} tier={effectiveHrisTier} setActivePage={goToPage} onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && isSocialCommerceContextPage && !isGlobalPage && activePage !== "social-commerce-intelligence" ? <PageShell key={activePage}><SocialCommerceFeaturePage activePage={activePage} currentTier={effectiveHrisTier} role={role} onLockedModule={() => setUpgradeOpen(true)} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "school" && !isGlobalPage ? <PageShell key={activePage}><SchoolPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "bootcamp" && !isGlobalPage ? <PageShell key={activePage}><BootcampPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "tutoring" && !isGlobalPage ? <PageShell key={activePage}><TutoringPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "language-course" && !isGlobalPage ? <PageShell key={activePage}><LanguageCoursePortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "training-center" && !isGlobalPage ? <PageShell key={activePage}><TrainingCenterPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "lms" && !isGlobalPage ? <PageShell key={activePage}><LmsPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "kkn" && !isGlobalPage ? <PageShell key={activePage}><KknPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {!trialLocked && routeIndustrySlug === "education-and-courses" && routeSubIndustrySlug === "academic" && !isGlobalPage ? <PageShell key={activePage}><AcademicPortal activePage={activePage} currentTier={effectiveHrisTier} /></PageShell> : null}
            {activePage === "reports" ? <PageShell key="reports"><ReportsPage /></PageShell> : null}
            {activePage === "notifications" ? <PageShell key="notifications"><NotificationsPage /></PageShell> : null}
            {activePage === "billing" ? <PageShell key="billing"><BillingPage currentTier={effectiveHrisTier} industries={catalogIndustries} onTierActivated={handleTierActivated} /></PageShell> : null}
            {activePage === "access" ? <PageShell key="access"><AccessManagementPage industries={catalogIndustries} /></PageShell> : null}
            {activePage === "settings" ? <PageShell key="settings"><SettingsPage themeKey={themeKey} setThemeKey={setThemeKey} role={role} account={account} /></PageShell> : null}
            {activePage === "settings-security" ? <PageShell key="settings-security"><SecuritySettingsPage account={account} /></PageShell> : null}
            {activePage === "profile" ? <PageShell key="profile"><AccountProfilePage role={role} account={account} profile={profile} /></PageShell> : null}
            {activePage === "faq" ? <PageShell key="faq"><FaqPage /></PageShell> : null}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {upgradeOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Upgrade tier</p>
              <h2 className="mt-3 text-3xl font-black text-[#172033]">{isEducationContextPage ? "Modul kampus ini belum termasuk tier aktif." : "Modul ini belum termasuk Growth."}</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
                {isEducationContextPage
                  ? "Upgrade ke Business atau Enterprise untuk membuka laporan, billing, integrasi, dan modul lainnya."
                  : "Upgrade ke Business untuk membuka overtime advanced, HR dashboard, audit log, export, dan integrasi accounting."}
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setUpgradeOpen(false)} className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm font-black" type="button">
                  Nanti
                </button>
                <button onClick={() => setUpgradeOpen(false)} className="flex-1 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
                  Request Upgrade
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PortalLayout>
  );
}

function ReportsPage() {
  const [summary, setSummary] = useState<PortalSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<PortalSummary>("/portal/summary")
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setSummary({ reports: [], quickAccess: [], activity: [], reportCharts: [], hrisModules: [], access: { employees: 0, activeSubscriptions: 0 } });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const maxChartValue = Math.max(1, ...((summary?.reportCharts ?? []).flatMap((chart) => chart.values)));

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
        {(summary?.reports ?? []).map(({ value, label, caption }) => {
          let Icon = Activity;
          const labelLower = label.toLowerCase();
          if (labelLower.includes("tenant")) Icon = Building2;
          else if (labelLower.includes("subscription")) Icon = CheckCircle2;
          else if (labelLower.includes("mrr") || labelLower.includes("revenue")) Icon = HandCoins;
          else if (labelLower.includes("user")) Icon = Users;

          return (
            <Panel key={label} className="flex min-w-0 flex-col justify-between p-4 lg:p-5">
              <div className="flex items-start justify-between gap-2 lg:gap-3">
                <p className="min-w-0 flex-1 truncate text-xl lg:text-3xl font-black text-[var(--portal-primary)]" title={value}>{value}</p>
                <span className="grid h-8 w-8 lg:h-10 lg:w-10 shrink-0 place-items-center rounded-[10px] lg:rounded-[12px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                </span>
              </div>
              <div className="mt-3 lg:mt-4 min-w-0">
                <p className="truncate text-xs lg:text-sm font-black text-[#172033]">{label}</p>
                <p className="mt-0.5 truncate text-[10px] lg:text-xs font-bold leading-tight text-slate-500">{caption}</p>
              </div>
            </Panel>
          );
        })}
      </div>
      <Panel className="p-4 lg:p-6">
        <div className="mb-4 lg:mb-6 flex items-center justify-between border-b border-slate-100 pb-4 lg:pb-5">
          <h1 className="text-xl lg:text-3xl font-black text-[#172033]">Portal Analytics</h1>
          <ReceiptText className="h-5 w-5 lg:h-7 lg:w-7 text-[var(--portal-primary)]" />
        </div>
        <div className="grid gap-3 lg:gap-4 lg:grid-cols-3">
          {(summary?.reportCharts ?? []).map((chart) => (
            <div key={chart.title} className="rounded-[18px] lg:rounded-[22px] bg-slate-50 p-4 lg:p-5">
              <p className="text-[13px] lg:text-base font-black text-[#172033]">{chart.title}</p>
              <div className="mt-5 lg:mt-8 flex h-24 lg:h-32 items-end gap-1.5 lg:gap-2">
                {chart.values.map((value, barIndex) => (
                  <span key={barIndex} className="flex-1 rounded-t-full bg-[var(--portal-primary)] opacity-80" style={{ height: `${Math.max(8, (value / maxChartValue) * 100)}%` }} />
                ))}
              </div>
            </div>
          ))}
          {summary && summary.reportCharts.length === 0 ? <p className="text-[11px] lg:text-sm font-bold text-slate-400">Belum ada data analytics dari database.</p> : null}
        </div>
      </Panel>
    </div>
  );
}

function NotificationsPage() {
  const [items, setItems] = useState<PortalNotification[]>([]);
  const [summaryData, setSummaryData] = useState<{ total: number; unread: number; highPriority: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { apiFetch } = await import("@/lib/api");
        const [apiItems, apiSummary] = await Promise.all([
          apiFetch<Array<{ id: string; title: string; body: string; category: string; priority: string; status: string; createdAt: string }>>("/notifications"),
          apiFetch<{ total: number; unread: number; highPriority: number }>("/notifications/summary")
        ]);
        if (cancelled) return;
        setItems((apiItems ?? []).map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            category: n.category,
            time: new Date(n.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            status: n.status === "unread" ? "Unread" as const : "Read" as const,
            priority: n.priority === "high" ? "High" as const : n.priority === "low" ? "Low" as const : "Normal" as const
        })));
        if (apiSummary) setSummaryData(apiSummary);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const unreadCount = summaryData?.unread ?? items.filter((item) => item.status === "Unread").length;
  const highPriorityCount = summaryData?.highPriority ?? items.filter((item) => item.priority === "High").length;
  const totalCount = summaryData?.total ?? items.length;

  const markAllRead = async () => {
    setItems((current) => current.map((item) => ({ ...item, status: "Read" as const })));
    setSummaryData((prev) => prev ? { ...prev, unread: 0 } : null);
    try {
      const { apiFetch } = await import("@/lib/api");
      await apiFetch("/notifications/read-all", { method: "PATCH" });
    } catch { /* silent */ }
  };

  const markRead = async (id: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: "Read" as const } : item)));
    setSummaryData((prev) => prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : null);
    try {
      const { apiFetch } = await import("@/lib/api");
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
    } catch { /* silent */ }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <Panel className="p-4 lg:p-6">
        <div className="grid gap-3 lg:gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.22em] text-[var(--portal-primary)]">Notification center</p>
            <h1 className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-black text-[#172033]">Notifikasi portal</h1>
            <p className="mt-1.5 lg:mt-2 max-w-2xl text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">
              Pantau payroll, approval, attendance sync, entitlement, dan reminder data karyawan dari satu halaman.
            </p>
          </div>
          <div className="mt-2 lg:mt-0 flex items-center gap-2 lg:gap-3">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 lg:px-3 lg:py-1.5 text-[9px] lg:text-[10px] font-black text-emerald-600">Live</span>
            <button onClick={markAllRead} className="w-fit rounded-full bg-[var(--portal-primary)] px-4 py-2 lg:px-5 lg:py-3 text-[11px] lg:text-sm font-black text-[var(--portal-on-primary)]" type="button">
              Mark all read
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
        {([
          [String(totalCount), "Total notifikasi", Bell, "+0", "vs minggu lalu"],
          [String(unreadCount), "Belum dibaca", MessageSquare, unreadCount > 0 ? unreadCount + " baru" : "Terbaca", "saat ini"],
          [String(highPriorityCount), "Prioritas tinggi", ShieldCheck, highPriorityCount > 0 ? "Perhatian" : "Aman", "hari ini"],
          [String(items.filter((item) => { try { return new Date(item.time).toDateString() === new Date().toDateString(); } catch { return false; } }).length), "Hari ini", Clock3, "Live", "real-time"],
        ] as Array<[string, string, typeof Bell, string, string]>).map(([value, label, Icon, delta, caption]) => (
          <article key={label} className="relative min-h-[90px] lg:min-h-[150px] rounded-[16px] lg:rounded-[24px] border border-slate-100 bg-white p-3 lg:p-6 shadow-sm">
            <p className="text-[9px] sm:text-[11px] lg:text-sm font-black text-slate-500 line-clamp-1 pr-6 lg:pr-0">{label}</p>
            <span className="absolute right-2.5 top-2.5 lg:right-5 lg:top-5 grid h-6 w-6 lg:h-11 lg:w-11 place-items-center rounded-[8px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <Icon className="h-3 w-3 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-3 sm:mt-5 lg:mt-8 text-base sm:text-lg lg:text-3xl font-black text-[#07142d] truncate">{value}</p>
            <div className="mt-1.5 sm:mt-2 lg:mt-3 flex flex-wrap items-center gap-1 lg:gap-2">
              <span className={`rounded-full px-1.5 py-0.5 lg:px-3 lg:py-1 text-[8px] lg:text-xs font-black ${delta === "Perhatian" ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="text-[8px] lg:text-xs font-bold text-slate-400 hidden lg:inline">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <Panel className="p-4 lg:p-6">
        <div className="mb-4 lg:mb-5 flex flex-col gap-2 lg:gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg lg:text-xl font-black text-[#172033] sm:text-2xl">Inbox operasional</h2>
            <p className="mt-0.5 lg:mt-1 text-[11px] lg:text-xs font-bold text-slate-500 sm:text-sm">Klik Read untuk menandai notifikasi sudah diproses.</p>
          </div>
          <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-[var(--portal-primary)]">
            {unreadCount} unread
          </span>
        </div>
        <PortalDataTable
          rows={items}
          rowKey={(item) => item.id}
          searchPlaceholder="Cari judul, kategori, prioritas..."
          getSearchText={(item) => `${item.id} ${item.title} ${item.body} ${item.category} ${item.status} ${item.priority}`}
          gridTemplateColumns="1.3fr 0.7fr 0.7fr 0.7fr 0.8fr"
          columns={[
            {
              label: "Notification",
              render: (item) => (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-black text-[#172033] sm:text-base">{item.title}</p>
                    {item.status === "Unread" ? <span className="h-2 w-2 rounded-full bg-rose-500" /> : null}
                  </div>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm">{item.body}</p>
                </div>
              )
            },
            { label: "Category", render: (item) => <span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">{item.category}</span> },
            { label: "Priority", render: (item) => <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${item.priority === "High" ? "bg-rose-50 text-rose-600" : item.priority === "Low" ? "bg-slate-50 text-slate-500" : "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]"}`}>{item.priority}</span> },
            { label: "Time", render: (item) => <p className="text-xs font-bold text-slate-500 sm:text-sm">{item.time}</p> },
            {
              label: "Action",
              render: (item) => item.status === "Unread" ? (
                <button onClick={() => markRead(item.id)} className="rounded-full bg-[var(--portal-primary)] px-3 py-1.5 text-xs font-black text-[var(--portal-on-primary)]" type="button">
                  Read
                </button>
              ) : <span className="text-xs font-bold text-slate-400">Read</span>
            }
          ]}
        />
        {items.length === 0 ? <p className="mt-4 text-sm font-bold text-slate-400">Belum ada notifikasi dari database.</p> : null}
      </Panel>
    </div>
  );
}

type BillingSummary = {
  status: string;
  tier: HrisTier;
  tierName: string;
  subIndustry: string;
  planDurationDays: number;
  remainingDays: number;
  startedAt: string | null;
  currentPeriodEnd: string | null;
  price: string;
  paymentMethod: string | null;
  invoices: Array<{ id: string; period: string; amount: string; status: string }>;
};

type BillingAddOn = {
  id: string;
  slug: string;
  name: string;
  category: string;
  complexity: string;
  price: string;
  amount: number;
  cadence: string;
  description: string;
  bestFor: string;
  recommendedFor: string[];
  sourceApp?: string | null;
  active: boolean;
};

type PortalCheckoutType = "add_app" | "upgrade" | "renew";

function parsePlanPrice(price: string) {
  const normalized = price.toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(/([0-9,.]+)(rb|jt)/);
  if (match) {
    const number = Number(match[1].replace(",", "."));
    if (!Number.isFinite(number)) return 0;
    return Math.round(number * (match[2] === "jt" ? 1000000 : 1000));
  }
  const rupiahMatch = normalized.match(/rp([0-9.]+)/);
  if (rupiahMatch) return Number(rupiahMatch[1].replace(/\./g, ""));
  return 0;
}

function calculateGatewayFee(amount: number) {
  return Math.ceil(amount / (1 - 0.0063) - amount);
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function BillingPage({ currentTier, industries, onTierActivated }: { currentTier: HrisTier; industries: PortalCatalogIndustry[]; onTierActivated: (tier: HrisTier) => void }) {
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qris" | "bank_transfer">("qris");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [checkoutAction, setCheckoutAction] = useState<string | null>(null);
  const [featureAddOns, setFeatureAddOns] = useState<BillingAddOn[]>([]);
  const hrisPlans = useMemo(() => buildPlans("Professional Services", "HRIS", []), []);
  const addOnApps = useMemo(() => {
    const currentSubIndustry = summary?.subIndustry ?? "HRIS";
    return industries
      .flatMap((industry) => industry.subIndustries.map((subIndustry) => ({ industry, subIndustry })))
      .filter(({ subIndustry }) => subIndustry.name !== currentSubIndustry)
      .slice(0, 8);
  }, [industries, summary?.subIndustry]);
  const progress = summary && summary.planDurationDays > 0
    ? Math.max(0, Math.min(100, Math.round((summary.remainingDays / summary.planDurationDays) * 100)))
    : 0;
  const periodEndLabel = summary?.currentPeriodEnd ? new Date(summary.currentPeriodEnd).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      apiFetch<BillingSummary>("/billing/summary"),
      apiFetch<BillingAddOn[]>("/billing/add-ons")
    ]).then(([summaryResult, addOnResult]) => {
      if (cancelled) return;
      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value);
        if (summaryResult.value.tier) onTierActivated(summaryResult.value.tier);
      } else {
        setSummary(null);
      }
      if (addOnResult.status === "fulfilled") {
        setFeatureAddOns(addOnResult.value);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [currentTier, onTierActivated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const ref = params.get("ref");
    if (checkout === "success") {
      setPaymentStatus(`Pembayaran diterima oleh gateway. Ref ${ref ?? "-"}. Akses akan aktif setelah callback pembayaran diproses.`);
    } else if (checkout === "failed") {
      setPaymentStatus(`Checkout belum selesai atau gagal. Ref ${ref ?? "-"}.`);
    }
  }, []);

  const tierFromPlan = (tier: PricingTier): HrisTier => {
    if (tier.name.includes("Enterprise")) return "enterprise";
    if (tier.name.includes("Pro")) return "pro";
    if (tier.name.includes("Growth")) return "growth";
    return "starter";
  };

  const createPortalCheckout = async (input: {
    type: PortalCheckoutType;
    industryName: string;
    segmentName: string;
    tierName: string;
    amount: number;
  }) => {
    setLoadingBilling(true);
    setCheckoutAction(`${input.type}-${input.segmentName}-${input.tierName}`);
    setPaymentStatus(null);
    try {
      const checkout = await apiFetch<{ checkoutUrl: string; total: number; gatewayFee: number }>("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({
          checkoutType: input.type,
          method: paymentMethod,
          industryName: input.industryName,
          segmentName: input.segmentName,
          tierName: input.tierName,
          amount: input.amount
        })
      });
      window.location.href = checkout.checkoutUrl;
    } catch (error) {
      setPaymentStatus(error instanceof Error ? error.message : "Checkout belum bisa dibuat.");
    } finally {
      setLoadingBilling(false);
      setCheckoutAction(null);
      setUpgradeModalOpen(false);
    }
  };

  const activateTier = async (plan: PricingTier) => {
    const nextTier = tierFromPlan(plan);
    const amount = parsePlanPrice(plan.price);
    await createPortalCheckout({
      type: "upgrade",
      industryName: "Professional Services",
      segmentName: summary?.subIndustry ?? "HRIS",
      tierName: plan.name,
      amount
    });
  };

  const renewSubscription = async () => {
    const activePlan = hrisPlans.tiers.find((tier) => tierFromPlan(tier) === (summary?.tier ?? currentTier)) ?? hrisPlans.tiers[1];
    await createPortalCheckout({
      type: "renew",
      industryName: "Professional Services",
      segmentName: summary?.subIndustry ?? "HRIS",
      tierName: activePlan.name,
      amount: parsePlanPrice(activePlan.price)
    });
  };

  const createFeatureAddOnCheckout = async (addOn: BillingAddOn) => {
    setLoadingBilling(true);
    setCheckoutAction(`addon-${addOn.slug}`);
    setPaymentStatus(null);
    try {
      const checkout = await apiFetch<{ checkoutUrl: string }>("/billing/add-ons/checkout", {
        method: "POST",
        body: JSON.stringify({
          addOnId: addOn.slug,
          method: paymentMethod
        })
      });
      window.location.href = checkout.checkoutUrl;
    } catch (error) {
      setPaymentStatus(error instanceof Error ? error.message : "Checkout add-on belum bisa dibuat.");
    } finally {
      setLoadingBilling(false);
      setCheckoutAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Billing owner</p>
            <h1 className="mt-2 text-3xl font-black text-[#172033]">Langganan HRIS</h1>
            <p className="mt-2 text-sm font-bold text-slate-500">Owner dapat melihat paket, invoice, payment method, dan request upgrade.</p>
          </div>
          <div className="rounded-[22px] bg-[var(--portal-primary-soft)] px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--portal-primary)]">Current tier</p>
            <p className="text-2xl font-black text-[#172033]">{summary?.tierName ?? currentTier}</p>
          </div>
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Plan duration</p>
              <h2 className="mt-2 text-2xl font-black text-[#172033]">{summary ? `${summary.subIndustry} ${summary.tierName}` : "Memuat langganan"}</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">
                {summary ? `Durasi plan ${summary.planDurationDays} hari. Sisa masa langganan ${summary.remainingDays} hari sampai ${periodEndLabel}.` : "Data billing akan tampil setelah API mengembalikan subscription tenant."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={renewSubscription} disabled={loadingBilling} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#172033] disabled:opacity-50" type="button">
                Perpanjang
              </button>
              <button onClick={() => setUpgradeModalOpen(true)} disabled={loadingBilling} className="rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-50" type="button">
                Upgrade tier
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              [String(summary?.planDurationDays ?? 0), "hari durasi"],
              [String(summary?.remainingDays ?? 0), "hari tersisa"],
              [summary?.price ?? "-", "harga aktif"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-[18px] bg-slate-50 p-4">
                <p className="text-2xl font-black text-[#172033]">{value}</p>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[var(--portal-primary)] transition-all" style={{ width: `${progress}%` }} />
          </div>
          {paymentStatus ? <p className="mt-4 rounded-[16px] bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">{paymentStatus}</p> : null}
        </Panel>
        <Panel>
          <h2 className="text-2xl font-black text-[#172033]">Payment method</h2>
          <div className="mt-5 rounded-[22px] bg-[#111111] p-5 text-white">
            <CreditCard className="h-7 w-7 text-[var(--portal-primary)]" />
            <p className="mt-8 text-sm font-bold text-white/60">Primary method</p>
            <p className="mt-1 text-xl font-black">{summary?.paymentMethod ?? (paymentMethod === "card" ? "Card" : paymentMethod === "qris" ? "QRIS Omnia" : "Bank transfer")}</p>
            <p className="mt-4 text-xs font-bold text-white/50">Biaya gateway ditambahkan ke tagihan customer. QRIS dipilih sebagai default biaya terendah.</p>
          </div>
          <div className="mt-4 grid gap-2">
            {[
              ["qris", "QRIS"],
              ["bank_transfer", "Transfer"],
              ["card", "Card"]
            ].map(([value, label]) => (
              <button key={value} onClick={() => setPaymentMethod(value as "card" | "qris" | "bank_transfer")} className={`rounded-full border px-5 py-3 text-sm font-black ${paymentMethod === value ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "border-slate-200 text-slate-600"}`} type="button">
                {label}
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="lg:col-span-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Add-on fitur</p>
              <h2 className="mt-2 text-2xl font-black text-[#172033]">Capability tambahan</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">Katalog add-on dari database. Status aktif mengikuti entitlement tenant dan branch saat ini.</p>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{featureAddOns.filter((item) => item.active).length} aktif</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureAddOns.map((addOn) => {
              const isLoading = checkoutAction === `addon-${addOn.slug}`;
              return (
                <article key={addOn.id} className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{addOn.category}</p>
                      <h3 className="mt-1 text-lg font-black leading-tight text-[#172033]">{addOn.name}</h3>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${addOn.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                      {addOn.active ? "Aktif" : addOn.complexity}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-slate-500">{addOn.description}</p>
                  <p className="mt-3 text-xs font-bold leading-5 text-slate-400">{addOn.bestFor}</p>
                  <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                    <p className="text-xl font-black text-[#172033]">{addOn.price}</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">+ PPN dan gateway fee. Source: {addOn.sourceApp ?? "Omnia"}</p>
                  </div>
                  <button
                    onClick={() => createFeatureAddOnCheckout(addOn)}
                    disabled={loadingBilling || addOn.active}
                    className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full bg-[#111111] px-4 py-3 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-500"
                    type="button"
                  >
                    {addOn.active ? "Sudah aktif" : isLoading ? "Membuat invoice..." : "Beli add-on"}
                  </button>
                </article>
              );
            })}
          </div>
          {featureAddOns.length === 0 ? <p className="mt-4 text-sm font-bold text-slate-400">Katalog add-on belum tersedia dari API.</p> : null}
        </Panel>
        <Panel className="lg:col-span-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Add-on aplikasi</p>
              <h2 className="mt-2 text-2xl font-black text-[#172033]">Beli aplikasi tambahan</h2>
              <p className="mt-2 text-sm font-bold text-slate-500">Pilih sub-industri lain dari katalog database. Checkout akan memakai metode pembayaran yang dipilih di kanan.</p>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{addOnApps.length} rekomendasi</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {addOnApps.map(({ industry, subIndustry }) => {
              const IndustryIcon = getIndustryIcon(industry.iconKey);
              const plan = buildPlans(industry.name, subIndustry.name, []).tiers[1];
              const amount = parsePlanPrice(plan.price);
              const fee = calculateGatewayFee(Math.ceil(amount * 1.11));
              const isLoading = checkoutAction === `add_app-${subIndustry.name}-${plan.name}`;
              return (
                <article key={subIndustry.id} className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--portal-primary-soft)]">
                      <IndustryIcon className="h-5 w-5 text-[var(--portal-primary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{industry.name}</p>
                      <h3 className="mt-1 text-lg font-black leading-tight text-[#172033]">{subIndustry.name}</h3>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-slate-500">{subIndustry.need}</p>
                  <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{plan.name.replace(subIndustry.name, "").trim() || "Growth"}</p>
                    <p className="mt-1 text-xl font-black text-[#172033]">{plan.price}</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">+ PPN dan gateway fee mulai {formatRupiah(fee)}</p>
                  </div>
                  <button
                    onClick={() => createPortalCheckout({ type: "add_app", industryName: industry.name, segmentName: subIndustry.name, tierName: plan.name, amount })}
                    disabled={loadingBilling}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                    type="button"
                  >
                    {isLoading ? "Membuat invoice..." : "Beli aplikasi"}
                  </button>
                </article>
              );
            })}
          </div>
          {addOnApps.length === 0 ? <p className="mt-4 text-sm font-bold text-slate-400">Katalog aplikasi tambahan belum tersedia.</p> : null}
        </Panel>
        <Panel className="lg:col-span-3">
          <h2 className="text-2xl font-black text-[#172033]">Invoice terbaru</h2>
          <div className="mt-5 space-y-3">
            {(summary?.invoices ?? []).map(({ id, period, amount, status }) => (
              <div key={id} className="grid gap-2 rounded-[18px] border border-slate-100 p-4 sm:grid-cols-[1fr_1fr_0.7fr_0.5fr] sm:items-center">
                <p className="font-black text-[#172033]">{id}</p>
                <p className="text-sm font-bold text-slate-500">{period}</p>
                <p className="font-black text-[#172033]">{amount}</p>
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">{status}</span>
              </div>
            ))}
          </div>
          {summary && summary.invoices.length === 0 ? <p className="mt-4 text-sm font-bold text-slate-400">Belum ada invoice dari database.</p> : null}
          {!summary ? <p className="mt-4 text-sm font-bold text-slate-400">Billing belum tersedia dari API.</p> : null}
        </Panel>
      </div>
      <PricingPlanModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        tiers={hrisPlans.tiers}
        featureRows={hrisPlans.featureRows}
        label=""
        actionLabel={loadingBilling ? "Memproses..." : "Pilih & bayar"}
        inquirySubject={`Upgrade HRIS dari ${summary?.tierName ?? currentTier}`}
        themeColor="orange"
        onAction={activateTier}
      />
    </div>
  );
}

function AccessManagementPage({ industries }: { industries: PortalCatalogIndustry[] }) {
  const [context, setContext] = useState<TenantContextResponse | null>(null);
  const [roles, setRoles] = useState<Array<{ id: string; name: string; slug: string; permissions: string[] }>>([]);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; module: string; entityType?: string; createdAt: string }>>([]);
  const loadAccess = () => {
    apiFetch<TenantContextResponse>("/tenant/context").then(setContext).catch(console.error);
    apiFetch<Array<{ id: string; name: string; slug: string; permissions: string[] }>>("/tenant/roles").then(setRoles).catch(console.error);
    apiFetch<Array<{ id: string; action: string; module: string; entityType?: string; createdAt: string }>>("/tenant/audit-logs").then(setAuditLogs).catch(console.error);
  };
  useEffect(() => {
    loadAccess();
  }, []);
  const activeTenantId = getStoredActiveTenantId();
  const activeTenant = context?.tenants.find((tenant) => tenant.id === activeTenantId) ?? context?.tenants[0];
  return (
    <div className="space-y-6">
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Tenant access</p>
        <h1 className="mt-2 text-3xl font-black text-[#172033]">Manajemen akses dan cabang</h1>
        <p className="mt-2 text-sm font-bold text-slate-500">{activeTenant?.name ?? "Workspace"} memakai konteks tenant dan branch aktif untuk semua sub-industri.</p>
      </Panel>
      <BranchManagementPanel
        title="Manajemen cabang global"
        caption="Daftar cabang ini dipakai oleh F&B, HRIS, Gereja, dan modul lain. Assignment member menentukan cabang yang boleh dilihat karyawan."
        branchLabel="Cabang"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <ShieldCheck className="h-7 w-7 text-[var(--portal-primary)]" />
          <h2 className="mt-5 text-xl font-black text-[#172033]">Role profile</h2>
          <div className="mt-4 space-y-2">
            {roles.slice(0, 6).map((role) => (
              <div key={role.id} className="rounded-[14px] bg-slate-50 px-3 py-2">
                <p className="text-sm font-black text-[#172033]">{role.name}</p>
                <p className="text-xs font-bold text-slate-500">{role.slug}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel>
        <h2 className="text-2xl font-black text-[#172033]">Audit log terbaru</h2>
        <div className="mt-5 grid gap-2 overflow-x-auto pb-2">
          {auditLogs.length ? auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex min-w-[300px] items-center justify-between gap-4 rounded-[14px] bg-slate-50 px-4 py-3 text-sm font-bold">
              <span className="text-[#172033]">{log.action}</span>
              <span className="shrink-0 text-xs text-slate-500">{log.module} - {new Date(log.createdAt).toLocaleString("id-ID")}</span>
            </div>
          )) : <p className="text-sm font-bold text-slate-500">Belum ada audit log untuk tenant aktif.</p>}
        </div>
      </Panel>
      <Panel>
        <h2 className="text-2xl font-black text-[#172033]">Industri terbuka untuk developer</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => {
            const IndustryIcon = getIndustryIcon(industry.iconKey);
            const color = getIndustryColor(industry.colorKey);
            return (
              <div key={industry.id} className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
                <IndustryIcon className="h-6 w-6" style={{ color }} />
                <p className="mt-3 font-black text-[#172033]">{industry.name}</p>
                <p className="text-xs font-bold text-slate-500">{industry.subIndustries.length} sub-industri unlocked</p>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function HrisSettingsPage({ tier }: { tier: HrisTier }) {
  const settingGroups = [
    {
      title: "Company & Organization",
      caption: "Struktur tenant HRIS",
      icon: Building2,
      items: [
        ["Tenant HRIS", "Omnia HRIS"],
        ["Company code", "OMN-HR-001"],
        ["Work location", "HQ Jakarta + lapangan"],
        ["Department sync", "People, Finance, Operations, Product"]
      ]
    },
    {
      title: "Attendance Rules",
      caption: "Clock in, shift, dan toleransi",
      icon: CalendarCheck2,
      items: [
        ["Jam kerja utama", "08:00 - 17:00"],
        ["Late tolerance", "15 menit"],
        ["GPS radius", "120 meter"],
        ["Auto correction", "Butuh approval HR"]
      ]
    },
    {
      title: "Payroll Formula",
      caption: "Komponen gaji dan cut-off",
      icon: WalletCards,
      items: [
        ["Payroll cut-off", "Tanggal 25 setiap bulan"],
        ["BPJS & PPh 21", "Otomatis"],
        ["Overtime formula", "Disesuaikan regulasi"],
        ["Payslip publish", "Setelah finalisasi payroll"]
      ]
    },
    {
      title: "Approval & Access",
      caption: "Role internal HRIS",
      icon: ShieldCheck,
      items: [
        ["Leave approval", "Manager lalu HR"],
        ["Payroll access", "Owner, HR Admin, Finance"],
        ["Employee self-service", "Aktif"],
        ["Audit trail", tier === "enterprise" ? "Enterprise retention" : "Standard retention"]
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Sub-industry settings</p>
            <h1 className="mt-2 text-3xl font-black text-[#172033]">Pengaturan HRIS</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">
              Konfigurasi khusus sub-industri HRIS untuk attendance, payroll, approval, akses employee, dan integrasi device.
            </p>
          </div>
          <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--portal-primary)]">
            {tier} access
          </span>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {settingGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Panel key={group.title}>
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#172033]">{group.title}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">{group.caption}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {group.items.map(([label, value]) => (
                  <div key={label} className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
                    <p className="mt-2 text-sm font-black text-[#172033]">{value}</p>
                  </div>
                ))}
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#172033]">Integrasi HRIS</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">Siapkan koneksi mesin absensi, accounting, SSO, dan notifikasi.</p>
          </div>
          <button className="w-fit rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
            Simpan pengaturan
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            ["Attendance device", "Connected", CheckCircle2],
            ["Accounting sync", "Ready", Database],
            ["Email notification", "Active", Send],
            ["SSO & audit log", tier === "enterprise" ? "Enterprise" : "Upgrade available", Lock]
          ].map(([label, status, Icon]) => (
            <div key={label as string} className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm">
              <Icon className="h-5 w-5 text-[var(--portal-primary)]" />
              <p className="mt-3 text-sm font-black text-[#172033]">{label as string}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{status as string}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

type AdminSettingsEntity = "industries" | "sub-industries" | "tiers" | "features" | "tier-features" | "users";
type SettingsRow = Record<string, any>;

const adminSettingsEntities: Array<{ key: AdminSettingsEntity; label: string; caption: string; icon: LucideIcon }> = [
  { key: "industries", label: "Industri", caption: "Katalog industri utama", icon: Database },
  { key: "sub-industries", label: "Sub-industri", caption: "Segment dan aplikasi turunan", icon: Layers3 },
  { key: "tiers", label: "Tier", caption: "Paket dan harga", icon: ShieldCheck },
  { key: "features", label: "Fitur", caption: "Daftar entitlement", icon: ListChecks },
  { key: "tier-features", label: "Mapping", caption: "Relasi tier dan fitur", icon: RefreshCcw },
  { key: "users", label: "Akun", caption: "User internal dan tenant", icon: UsersRound }
];

const adminEmptyForm: Record<AdminSettingsEntity, SettingsRow> = {
  industries: { name: "", iconKey: "BriefcaseBusiness", colorKey: "professional-cyan", pain: "", solution: "", sortOrder: 0, isActive: true },
  "sub-industries": { industryId: "", name: "", iconKey: "", colorKey: "", need: "", offer: "", sortOrder: 0, isActive: true },
  tiers: { subIndustryId: "", name: "", price: "", cadence: "/ bulan", description: "", fit: "", limits: "", sortOrder: 0, highlight: false, isActive: true },
  features: { subIndustryId: "", name: "", description: "", sortOrder: 0, isActive: true },
  "tier-features": { tierId: "", featureId: "", included: true },
  users: { email: "", password: "", name: "", role: "owner", status: "active" }
};

function SettingsPage({ themeKey, setThemeKey, role, account }: { themeKey: PortalThemeKey; setThemeKey: (theme: PortalThemeKey) => void; role: PortalRole; account: AuthUser | null }) {
  const isSuperAdmin = role === "developer" || isSuperAdminUser(account);
  const [adminSection, setAdminSection] = useState<AdminSettingsEntity>("industries");
  const [rows, setRows] = useState<SettingsRow[]>([]);
  const [lookup, setLookup] = useState<Record<string, SettingsRow[]>>({});
  const [form, setForm] = useState<SettingsRow>(adminEmptyForm.industries);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [loadingAdminRows, setLoadingAdminRows] = useState(false);
  const [portalSettings, setPortalSettings] = useState<SettingsRow | null>(null);
  const [adminCreateOpen, setAdminCreateOpen] = useState(false);
  const [adminDetailRowId, setAdminDetailRowId] = useState<string | null>(null);

  const activeAdminMeta = adminSettingsEntities.find((item) => item.key === adminSection) ?? adminSettingsEntities[0];
  const ActiveAdminIcon = activeAdminMeta.icon;
  const adminFields = Object.keys(adminEmptyForm[adminSection]);

  const loadAdminRows = useCallback(async () => {
    if (!isSuperAdmin) return;
    setLoadingAdminRows(true);
    setSettingsMessage("");
    try {
      const [activeRows, industries, subs, tiers, features] = await Promise.all([
        apiFetch<SettingsRow[]>(`/admin/${adminSection}`),
        apiFetch<SettingsRow[]>("/admin/industries"),
        apiFetch<SettingsRow[]>("/admin/sub-industries"),
        apiFetch<SettingsRow[]>("/admin/tiers"),
        apiFetch<SettingsRow[]>("/admin/features")
      ]);
      setRows(activeRows);
      setLookup({ industries, "sub-industries": subs, tiers, features });
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : "Gagal memuat admin settings.");
    } finally {
      setLoadingAdminRows(false);
    }
  }, [adminSection, isSuperAdmin]);

  useEffect(() => {
    setForm(adminEmptyForm[adminSection]);
    void loadAdminRows();
  }, [adminSection, loadAdminRows]);

  useEffect(() => {
    apiFetch<SettingsRow>("/settings/portal")
      .then(setPortalSettings)
      .catch(() => setPortalSettings(null));
  }, []);

  const updateAdminField = (field: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const normalizeAdminPayload = () => {
    const payload: SettingsRow = { ...form };
    if (payload.sortOrder !== undefined) payload.sortOrder = Number(payload.sortOrder || 0);
    if (adminSection === "tiers" && typeof payload.limits === "string") {
      payload.limits = payload.limits.split(",").map((item: string) => item.trim()).filter(Boolean);
    }
    if (adminSection === "features" && !payload.subIndustryId) payload.subIndustryId = null;
    return payload;
  };

  const saveAdminData = async () => {
    setSettingsMessage("");
    try {
      await apiFetch(`/admin/${adminSection}`, { method: "POST", body: JSON.stringify(normalizeAdminPayload()) });
      setForm(adminEmptyForm[adminSection]);
      setSettingsMessage("Data berhasil dibuat.");
      setAdminCreateOpen(false);
      await loadAdminRows();
    } catch (error) {
      setSettingsMessage(error instanceof Error ? error.message : "Gagal menyimpan data.");
    }
  };

  const deleteAdminData = async (id: string) => {
    await apiFetch(`/admin/${adminSection}/${id}`, { method: "DELETE" });
    await loadAdminRows();
  };

  const renderAdminField = (field: string) => {
    if (field === "isActive" || field === "highlight" || field === "included") {
      return (
        <label key={field} className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
          <input type="checkbox" checked={Boolean(form[field])} onChange={(event) => updateAdminField(field, event.target.checked)} />
          {field}
        </label>
      );
    }
    const options = field === "industryId"
      ? lookup.industries
      : field === "subIndustryId"
        ? lookup["sub-industries"]
        : field === "tierId"
          ? lookup.tiers
          : field === "featureId"
            ? lookup.features
            : field === "role"
              ? [{ id: "super_admin", name: "super_admin" }, { id: "owner", name: "owner" }, { id: "employee", name: "employee" }]
              : field === "status"
                ? [{ id: "active", name: "active" }, { id: "inactive", name: "inactive" }]
                : null;
    if (options) {
      return (
        <label key={field} className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{field}</span>
          <RoundedSelect className="w-full text-sm" value={form[field] ?? ""} onChange={(event) => updateAdminField(field, event.target.value)}>
            {field === "subIndustryId" ? <option value="">Global / kosong</option> : null}
            {options.map((option) => <option key={option.id} value={option.id}>{option.name ?? option.email ?? option.id}</option>)}
          </RoundedSelect>
        </label>
      );
    }
    if (field === "colorKey") {
      return (
        <label key={field} className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Pilihan Warna</span>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(industryColorHex).map(([key, hex]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateAdminField(field, key)}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${form[field] === key ? "scale-110 border-white ring-2 ring-[var(--portal-primary)]" : "border-transparent"}`}
                style={{ backgroundColor: hex }}
                title={key}
              />
            ))}
            <input type="text" placeholder="color-key / #hex" value={form[field] ?? ""} onChange={(e) => updateAdminField(field, e.target.value)} className="w-24 rounded-[12px] border border-slate-200 px-3 py-1.5 text-xs font-bold outline-none focus:border-[var(--portal-primary)]" />
          </div>
        </label>
      );
    }
    if (field === "iconKey") {
      return (
        <label key={field} className="block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Pilihan Icon</span>
          <div className="flex flex-wrap items-center gap-2 max-h-[140px] overflow-y-auto p-1 scrollbar-hide">
            {Object.entries(landingIndustryIconMap).map(([key, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateAdminField(field, key)}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border transition-colors ${form[field] === key ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}
                title={key}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
            <input type="text" placeholder="Nama Icon" value={form[field] ?? ""} onChange={(e) => updateAdminField(field, e.target.value)} className="w-28 rounded-[12px] border border-slate-200 px-3 py-1.5 text-xs font-bold outline-none focus:border-[var(--portal-primary)]" />
          </div>
        </label>
      );
    }
    const textarea = ["pain", "solution", "need", "offer", "description", "fit"].includes(field);
    return (
      <label key={field} className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{field}</span>
        {textarea ? (
          <textarea className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" rows={3} value={form[field] ?? ""} onChange={(event) => updateAdminField(field, event.target.value)} />
        ) : (
          <input className="w-full rounded-[16px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" type={field === "password" ? "password" : "text"} value={form[field] ?? ""} onChange={(event) => updateAdminField(field, event.target.value)} />
        )}
      </label>
    );
  };

  const getRowTitle = (row: SettingsRow) => row.name ?? row.email ?? `${row.tier?.name ?? "Tier"} -> ${row.feature?.name ?? "Feature"}`;
  const getRowSubtitle = (row: SettingsRow) => {
    if (adminSection === "users") {
      const trial = row.subIndustry?.name && row.tier?.name ? `${row.subIndustry.name} - ${row.tier.name}` : "Belum memilih trial";
      const tenant = row.tenantUsers?.[0]?.tenant?.name;
      return tenant ? `${trial} | ${tenant}` : trial;
    }
    if (adminSection === "sub-industries") return row.industry?.name ?? row.slug ?? row.id;
    if (adminSection === "tier-features") return `${row.tier?.name ?? "Tier"} -> ${row.feature?.name ?? "Feature"}`;
    return row.slug ?? row.description ?? row.id;
  };
  const adminStats = [
    ["Total data", rows.length, ActiveAdminIcon],
    ["Aktif", rows.filter((row) => row.isActive !== false && row.status !== "inactive").length, CheckCircle2],
    ["Baru bulan ini", rows.filter((row) => row.createdAt && new Date(row.createdAt).getMonth() === new Date().getMonth()).length, CalendarCheck2],
    [adminSection === "users" ? "Trial register" : "Perlu review", adminSection === "users" ? rows.filter((row) => row.subIndustry || row.tier || row.subscriptionStatus === "trial").length : rows.filter((row) => row.isActive === false).length, Filter]
  ] as const;

  const adminColumns = adminSection === "users"
    ? [
        { label: "Akun", className: "col-span-2 sm:col-span-3 md:col-span-1", render: (row: SettingsRow) => <div><p className="text-sm font-black text-[#172033]">{row.name}</p><p className="text-xs font-bold text-slate-500">{row.email}</p></div> },
        { label: "Trial / Industri", render: (row: SettingsRow) => <div><p className="text-sm font-black text-[#172033]">{row.subIndustry?.industry?.name ?? row.tenantUsers?.[0]?.tenant?.subscriptions?.[0]?.tier?.subIndustry?.name ?? "Belum ada"}</p><p className="text-xs font-bold text-slate-500">{row.subIndustry?.name ?? row.tenantUsers?.[0]?.tenant?.subscriptions?.[0]?.tier?.name ?? "Tidak ada sub-industri"}</p></div> },
        { label: "Role", render: (row: SettingsRow) => <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-xs font-black text-[var(--portal-primary)]">{row.role}</span> },
        { label: "Status", render: (row: SettingsRow) => <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${row.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{row.status}</span> },
        { label: "Action", render: (row: SettingsRow) => <AdminRowAction row={row} open={adminDetailRowId === row.id} onToggle={() => setAdminDetailRowId((current) => current === row.id ? null : row.id)} onDelete={() => deleteAdminData(row.id)} section={adminSection} /> }
      ]
    : [
        { label: "Data", className: "col-span-2 sm:col-span-3 md:col-span-1", render: (row: SettingsRow) => {
          const hasIcon = adminSection === "industries" || adminSection === "sub-industries";
          const color = getIndustryColor(row.colorKey);
          const Icon = getIndustryIcon(row.iconKey);
          return (
            <div className="flex items-center gap-3">
              {hasIcon && (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] shadow-sm" style={{ background: `linear-gradient(135deg, ${color}, ${color}90)`, color: "#ffffff" }}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-black text-[#172033]">{getRowTitle(row)}</p>
                <p className="text-xs font-bold text-slate-500">{getRowSubtitle(row)}</p>
              </div>
            </div>
          );
        } },
        { label: "Relasi", render: (row: SettingsRow) => <p className="text-xs font-bold text-slate-600">{row.industry?.name ?? row.subIndustry?.name ?? row.tier?.name ?? "-"}</p> },
        { label: "Status", render: (row: SettingsRow) => <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${row.isActive !== false ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{row.isActive === false ? "Inactive" : "Active"}</span> },
        { label: "Sort", render: (row: SettingsRow) => <p className="text-xs font-black text-[#172033]">{row.sortOrder ?? row.included?.toString() ?? "-"}</p> },
        { label: "Action", render: (row: SettingsRow) => <AdminRowAction row={row} open={adminDetailRowId === row.id} onToggle={() => setAdminDetailRowId((current) => current === row.id ? null : row.id)} onDelete={() => deleteAdminData(row.id)} section={adminSection} /> }
      ];

  if (isSuperAdmin) {
    return (
      <div className="flex flex-col min-h-0 xl:grid xl:overflow-hidden xl:rounded-[28px] xl:border xl:border-[var(--portal-border)] xl:bg-white xl:shadow-sm xl:min-h-[calc(100dvh-130px)] xl:grid-cols-[260px_1fr]">
        <aside className="pb-3 lg:pb-4 xl:border-r xl:bg-slate-50/70 xl:p-4 xl:border-b-0">
          <p className="px-1 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[var(--portal-primary)]">Superadmin</p>
          <h2 className="mt-1 px-1 text-xl font-black text-[#172033] lg:mt-2 lg:text-2xl">Portal Settings</h2>
          <nav className="-mx-1 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 touch-pan-x xl:mx-0 xl:mt-5 xl:flex-col xl:overflow-x-visible xl:px-0 xl:pb-0 xl:gap-1.5 scrollbar-hide">
            {adminSettingsEntities.map((item) => {
              const Icon = item.icon;
              const active = adminSection === item.key;
              return (
                <button key={item.key} onClick={() => setAdminSection(item.key)} className={`flex min-w-[136px] shrink-0 snap-start items-center gap-2 rounded-[14px] px-3 py-2 text-left transition xl:min-w-0 xl:gap-3 xl:rounded-[16px] xl:py-3 ${active ? "bg-white text-[var(--portal-primary)] shadow-sm ring-1 ring-slate-100" : "text-slate-500 hover:bg-white"}`} type="button">
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="min-w-0">
                    <span className="block text-xs lg:text-sm font-black text-[#172033] whitespace-nowrap">{item.label}</span>
                    <span className="hidden xl:block truncate text-[10px] lg:text-xs font-bold text-slate-400">{item.caption}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 xl:p-5">
          <div className="flex flex-col gap-3 lg:gap-4 border-b border-slate-200 pb-4 lg:pb-5 lg:flex-row lg:items-center lg:justify-between xl:border-slate-100">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <span className="grid h-10 w-10 lg:h-12 lg:w-12 place-items-center rounded-[12px] lg:rounded-[16px] bg-white text-[var(--portal-primary)] shadow-sm xl:bg-[var(--portal-primary-soft)] xl:shadow-none"><ActiveAdminIcon className="h-5 w-5 lg:h-6 lg:w-6" /></span>
              <div>
                <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[var(--portal-primary)]">Admin catalog</p>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <h1 className="text-xl lg:text-3xl font-black text-[#172033]">{activeAdminMeta.label}</h1>
                  <button onClick={loadAdminRows} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] lg:text-xs font-black text-slate-600 shadow-sm transition hover:bg-slate-50 xl:bg-transparent xl:shadow-none" type="button">
                    <RefreshCcw className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 min-w-0 space-y-4 lg:mt-5 lg:space-y-5">
            <div className="grid gap-2.5 lg:gap-3 grid-cols-2 xl:grid-cols-4">
              {adminStats.map(([label, value, Icon]) => (
                <div key={label as string} className="min-w-0 rounded-[16px] border border-slate-100 bg-slate-50 p-3 lg:rounded-[20px] lg:p-4">
                  <div className="flex items-start justify-between gap-2 lg:gap-3">
                    <div>
                      <p className="truncate text-[10px] font-black text-slate-500 lg:text-xs">{label as string}</p>
                      <p className="mt-2 lg:mt-3 text-2xl lg:text-3xl font-black text-[#172033]">{String(value)}</p>
                    </div>
                    <span className="grid h-8 w-8 lg:h-10 lg:w-10 place-items-center rounded-[10px] lg:rounded-[14px] bg-white text-[var(--portal-primary)] shadow-sm"><Icon className="h-4 w-4 lg:h-5 lg:w-5" /></span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[9px] font-bold leading-tight text-slate-400 lg:mt-2 lg:text-xs">Tersinkron dari backend catalog</p>
                </div>
              ))}
            </div>

            <div className="rounded-[18px] lg:rounded-[22px] border border-slate-100 bg-white p-3 shadow-sm lg:p-4 xl:shadow-none">
              <div className="mb-4 lg:mb-5">
                <h2 className="text-lg lg:text-xl font-black text-[#172033]">Data {activeAdminMeta.label}</h2>
                <p className="text-xs lg:text-sm font-bold text-slate-500">{loadingAdminRows ? "Memuat..." : `${rows.length} row`} dengan pencarian, pagination, dan action menu.</p>
              </div>
              {settingsMessage ? <p className="mb-4 rounded-[16px] bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{settingsMessage}</p> : null}
              <PortalDataTable
                rows={rows}
                rowKey={(row) => row.id}
                searchPlaceholder={`Cari ${activeAdminMeta.label.toLowerCase()}...`}
                getSearchText={(row) => `${getRowTitle(row)} ${getRowSubtitle(row)} ${row.role ?? ""} ${row.status ?? ""}`}
                gridTemplateColumns={adminSection === "users" ? "1.15fr 1.05fr 0.6fr 0.6fr 0.5fr" : "1.25fr 0.9fr 0.65fr 0.45fr 0.5fr"}
                columns={adminColumns}
                headerAction={
                  <button onClick={() => setAdminCreateOpen(true)} className="inline-flex shrink-0 w-fit items-center gap-1.5 lg:gap-2 rounded-full bg-[var(--portal-primary)] p-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[11px] lg:text-sm font-black text-[var(--portal-on-primary)]" type="button" aria-label={`Tambah ${activeAdminMeta.label}`}>
                    <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden sm:inline">Tambah {activeAdminMeta.label}</span>
                  </button>
                }
              />
            </div>
          </div>

          <AnimatePresence>
            {adminCreateOpen ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 12 }} className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Tambah data</p>
                      <h2 className="mt-2 text-3xl font-black text-[#172033]">{activeAdminMeta.label}</h2>
                      <p className="mt-2 text-sm font-bold text-slate-500">Data akan tersimpan ke backend catalog/admin.</p>
                    </div>
                    <button onClick={() => setAdminCreateOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500" type="button" aria-label="Tutup modal"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">{adminFields.map(renderAdminField)}</div>
                  <button onClick={saveAdminData} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
                    <Save className="h-4 w-4" /> Buat data
                  </button>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <Panel className="p-4 lg:p-6">
        <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.22em] text-[var(--portal-primary)]">Tenant settings</p>
        <h1 className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-black text-[#172033]">Pengaturan portal</h1>
        <p className="mt-1.5 lg:mt-2 max-w-2xl text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">Kelola identitas tenant, subscription, akses, tema, notifikasi, dan keamanan workspace.</p>
        <div className="mt-4 lg:mt-6 grid gap-3 lg:gap-4 lg:grid-cols-2">
          {[
            ["Nama tenant", portalSettings?.tenant?.name ?? "Omnia HRIS"],
            ["Domain", portalSettings?.tenant?.domain ?? "demo-hris.omnia.co.id"],
            ["Subscription", portalSettings?.subscription?.tier ?? "Growth"],
            ["Karyawan aktif", `${portalSettings?.access?.employees ?? 75} employee access`],
            ["Workspace timezone", portalSettings?.tenant?.timezone ?? "Asia/Jakarta"],
            ["Default language", portalSettings?.tenant?.language ?? "Indonesia"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[14px] lg:rounded-[18px] border border-slate-100 bg-slate-50 p-3 lg:p-4">
              <p className="text-[9px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.16em] text-slate-400">{label}</p>
              <p className="mt-1 lg:mt-2 text-sm lg:text-base font-black text-[#172033]">{value}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-3 lg:gap-4 lg:grid-cols-3">
        {[
          ["Security", "Session timeout, login audit, dan akses device.", ShieldCheck],
          ["Notifications", "Email payroll, leave approval, dan alert billing.", Bell],
          ["Billing defaults", "Invoice contact, tax ID, dan payment method.", CreditCard]
        ].map(([title, body, Icon]) => (
          <Panel key={title as string} className="p-4 lg:p-6">
            <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-[var(--portal-primary)]" />
            <h2 className="mt-3 lg:mt-4 text-lg lg:text-xl font-black text-[#172033]">{title as string}</h2>
            <p className="mt-1.5 lg:mt-2 text-[11px] lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">{body as string}</p>
            <button onClick={() => { if (title === "Security") window.location.assign("/portal/settings/security"); }} className="mt-4 lg:mt-5 rounded-full border border-slate-200 px-3 py-1.5 lg:px-4 lg:py-2 text-[10px] lg:text-xs font-black text-slate-600 transition hover:border-[var(--portal-primary)] hover:text-[var(--portal-primary)]" type="button">Configure</button>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function AdminRowAction({ row, open, onToggle, onDelete, section }: { row: SettingsRow; open: boolean; onToggle: () => void; onDelete: () => void; section: AdminSettingsEntity }) {
  const trial = row.subIndustry?.name && row.tier?.name ? `${row.subIndustry?.industry?.name ?? "Industri"} / ${row.subIndustry.name} / ${row.tier.name}` : "-";
  const tenantSubscription = row.tenantUsers?.[0]?.tenant?.subscriptions?.[0];
  const detailItems = section === "users"
    ? [
        ["Email", row.email ?? "-"],
        ["Telepon", row.phone ?? "Belum tersimpan"],
        ["Role", row.role ?? "-"],
        ["Status", row.status ?? "-"],
        ["Trial pilihan", trial],
        ["Tenant", row.tenantUsers?.[0]?.tenant?.name ?? "-"],
        ["Subscription", tenantSubscription ? `${tenantSubscription.tier?.name ?? "-"} (${tenantSubscription.status})` : "-"]
      ]
    : [
        ["ID", row.id ?? "-"],
        ["Slug", row.slug ?? "-"],
        ["Status", row.status ?? (row.isActive === false ? "inactive" : "active")],
        ["Sort order", String(row.sortOrder ?? "-")],
        ["Relasi", row.industry?.name ?? row.subIndustry?.name ?? row.tier?.name ?? "-"],
        ...(section === "industries" || section === "sub-industries" ? [
          ["Icon Key", row.iconKey ?? "-"],
          ["Color Key", row.colorKey ?? "-"]
        ] : []),
        ["Updated", row.updatedAt ? new Date(row.updatedAt).toLocaleDateString("id-ID") : "-"]
      ];

  return (
    <div className="relative">
      <button onClick={onToggle} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-[var(--portal-primary)]" type="button" aria-label="Buka detail">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <>
          <button className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" type="button" aria-label="Tutup detail" onClick={onToggle} />
          <div className="fixed inset-x-0 bottom-0 z-40 max-h-[85dvh] overflow-y-auto rounded-t-[22px] border-t border-slate-100 bg-white p-4 shadow-[0_-20px_60px_rgba(15,23,42,0.18)] md:absolute md:inset-auto md:right-0 md:top-11 md:w-[340px] md:rounded-[18px] md:border md:shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 md:hidden" />
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="min-w-0">
                <p className="text-base font-black text-[#172033] md:text-sm">{row.name ?? row.email ?? row.id}</p>
                <p className="mt-0.5 text-xs font-bold text-slate-500">Detail {section}</p>
              </div>
              <button onClick={onToggle} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 md:hidden" type="button" aria-label="Tutup">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 py-3 grid-cols-2 md:grid-cols-1">
              {detailItems.map(([label, value]) => (
                <div key={label} className="rounded-[12px] bg-slate-50 px-3 py-2.5">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 md:text-[10px]">{label}</p>
                  <p className="mt-1 text-xs font-black text-[#172033] break-all">{String(value)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600" type="button">Edit</button>
              <button onClick={onDelete} className="flex-1 rounded-full bg-rose-50 px-4 py-2.5 text-xs font-black text-rose-600" type="button">Delete</button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function TrialLockedPage({ subIndustry, tier, onUpgrade }: { subIndustry: string; tier: string; onUpgrade: () => void }) {
  return (
    <Panel>
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">Trial berakhir</p>
          <h1 className="mt-2 text-3xl font-black text-[#172033]">Fitur Starter dinonaktifkan.</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-slate-500">
            Akun ini masih dapat login, tetapi akses {tier} untuk {subIndustry} sudah melewati masa trial 3 hari. Berlangganan untuk membuka kembali fitur Starter dan melanjutkan operasional.
          </p>
        </div>
        <button onClick={onUpgrade} className="w-fit rounded-full bg-[#111111] px-5 py-3 text-sm font-black text-white" type="button">
          Pilih Langganan
        </button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["Employee Database", "Attendance", "Payslip"].map((feature) => (
          <div key={feature} className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50 p-4 opacity-70">
            <Lock className="h-5 w-5 text-slate-400" />
            <p className="mt-3 font-black text-[#172033]">{feature}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Disabled sampai berlangganan</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ForcedPasswordChangeModal({ onChanged }: { onChanged: (session: { accessToken: string; user: AuthUser }) => void }) {
  const [currentPassword, setCurrentPassword] = useState("user12345");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("Konfirmasi password belum sama.");
      return;
    }
    setSaving(true);
    try {
      const session = await apiFetch<{ accessToken: string; user: AuthUser }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword })
      });
      onChanged(session);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengganti password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.28)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--portal-primary)]">Password wajib diganti</p>
            <h2 className="mt-2 text-2xl font-black text-[#172033]">Buat password baru</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">Akun employee memakai password awal. Portal akan terbuka setelah password baru disimpan.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">Password saat ini</span>
            <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">Password baru</span>
            <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black text-slate-500">Konfirmasi password baru</span>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
          </label>
        </div>
        {message ? <p className="mt-4 rounded-[16px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{message}</p> : null}
        <button onClick={submit} disabled={saving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-60" type="button">
          {saving ? "Menyimpan..." : "Simpan password baru"}
        </button>
      </section>
    </div>
  );
}

function AccountProfilePage({ role, account, profile }: { role: PortalRole; account: AuthUser | null; profile: { initials: string; name: string; email: string; label: string } }) {
  const displayName = account?.name ?? profile.name;
  const email = account?.email ?? profile.email;
  const phone = account?.phoneNumber ?? "Belum tersimpan";
  const subscription = account?.trialTier?.name ?? account?.subscriptionStatus ?? "Demo workspace";
  const profileCards: Array<[string, string, LucideIcon]> = [
    ["Role", role, UserRound],
    ["WhatsApp", phone, Smartphone],
    ["Subscription", subscription, CreditCard]
  ];

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--portal-primary)] text-2xl font-black text-[var(--portal-on-primary)]">
              {profile.initials}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Account profile</p>
              <h1 className="mt-2 text-3xl font-black text-[#172033]">{displayName}</h1>
              <p className="mt-1 text-sm font-bold text-slate-500">{email}</p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--portal-primary)]">
            {profile.label}
          </span>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        {profileCards.map(([label, value, Icon]) => (
          <Panel key={label as string}>
            <Icon className="h-6 w-6 text-[var(--portal-primary)]" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label as string}</p>
            <p className="mt-2 text-lg font-black text-[#172033]">{String(value)}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />
          <div>
            <h2 className="text-xl font-black text-[#172033]">HRIS selfie verification profile</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">
              Enrollment selfie karyawan dilakukan dari modul Attendance saat pertama kali memakai Live Clock In. Setelah baseline tersimpan, setiap clock-in divalidasi dengan Face Match dan Liveness Challenge MVP dari backend.
            </p>
            <button onClick={() => window.location.assign("/portal/professional-services/hris/attendance")} className="mt-5 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
              Buka Attendance
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}
function FaqPage() {
  return (
    <Panel>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">FAQ</p>
      <h1 className="mt-2 text-3xl font-black text-[#172033]">Bantuan portal</h1>
      <div className="mt-6 divide-y divide-slate-100">
        {[
          ["Kenapa ada modul terkunci?", "Modul terkunci berarti belum termasuk tier tenant saat ini. Klik modul untuk request upgrade."],
          ["Apakah data tenant bercampur?", "Tidak. Setiap data operasional wajib memakai tenant context dan tenant guard."],
          ["Bagaimana warna portal ditentukan?", "Warna primary mengikuti identitas industri dan sub-industri yang sedang dibuka."],
          ["Apakah HRIS ini sudah production?", "Saat ini halaman ini frontend demo untuk memvalidasi layout dan alur portal."]
        ].map(([question, answer]) => (
          <div key={question} className="py-5">
            <h3 className="font-black text-[#172033]">{question}</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{answer}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
