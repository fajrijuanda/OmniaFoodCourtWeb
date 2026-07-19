import {
  Activity,
  Armchair,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  Calculator,
  Calendar,
  CalendarDays,
  Cloud,
  Coffee,
  Compass,
  Download,
  Droplets,
  Factory,
  Globe,
  GraduationCap,
  Hammer,
  Handshake,
  Heart,
  Home,
  Landmark,
  Laptop,
  LayoutDashboard,
  Lightbulb,
  Map,
  Mic,
  Monitor,
  Network,
  Package,
  PenTool,
  Pill,
  Plus,
  Presentation,
  Printer,
  Radar,
  Scale,
  Scissors,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smile,
  Sparkles,
  Star,
  Store,
  Stethoscope,
  Tags,
  Terminal,
  Ticket,
  Truck,
  Users,
  Utensils,
  Wallet,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PortalPage } from "./portalTypes";

export type PortalCatalogSubIndustry = {
  id: string;
  name: string;
  slug: string;
  iconKey?: string | null;
  colorKey?: string | null;
  need: string;
  offer: string;
  isActive?: boolean;
  tiers?: Array<{ id: string; name: string; slug: string }>;
};

export type PortalCatalogIndustry = {
  id: string;
  name: string;
  slug: string;
  iconKey?: string | null;
  colorKey?: string | null;
  pain?: string | null;
  solution?: string | null;
  isActive?: boolean;
  subIndustries: PortalCatalogSubIndustry[];
};

export const landingIndustryIconMap: Record<string, LucideIcon> = {
  Utensils,
  Stethoscope,
  Store,
  ShoppingBag,
  GraduationCap,
  BriefcaseBusiness,
  Truck,
  Factory,
  Building2,
  Network,
  CalendarDays,
  Landmark
};

export const industryColorPalette: Record<string, { primary: string; soft: string; dark: string }> = {
  "food-orange": { primary: "#F97316", soft: "#FFF7ED", dark: "#C2410C" },
  "health-blue": { primary: "#14B8A6", soft: "#F0FDFA", dark: "#0F766E" },
  "retail-green": { primary: "#22C55E", soft: "#F0FDF4", dark: "#15803D" },
  "commerce-pink": { primary: "#F43F5E", soft: "#FFF1F2", dark: "#BE123C" },
  "education-purple": { primary: "#06B6D4", soft: "#ECFEFF", dark: "#0E7490" },
  "professional-cyan": { primary: "#0891B2", soft: "#ECFEFF", dark: "#0E7490" },
  "distribution-indigo": { primary: "#8B5CF6", soft: "#F5F3FF", dark: "#6D28D9" },
  "manufacturing-teal": { primary: "#0D9488", soft: "#F0FDFA", dark: "#0F766E" },
  "property-violet": { primary: "#315CAA", soft: "#EFF4FF", dark: "#1E3A6D" },
  "franchise-amber": { primary: "#F59E0B", soft: "#FFFBEB", dark: "#B45309" },
  "event-rose": { primary: "#E11D48", soft: "#FFF1F2", dark: "#BE123C" },
  "public-sky": { primary: "#84CC16", soft: "#F7FEE7", dark: "#4D7C0F" }
};

export const industryColorHex: Record<string, string> = Object.fromEntries(
  Object.entries(industryColorPalette).map(([key, palette]) => [key, palette.primary])
);

export const ownerPurchasedSegments = new Set(["HRIS", "Education"]);

export const segmentIconMap: Record<string, LucideIcon> = {
  Cafe: Coffee,
  Restaurant: Utensils,
  Restoran: Utensils,
  "Cloud Kitchen": Cloud,
  Bakery: Coffee,
  "Food Court": Store,
  "General Clinic": Stethoscope,
  "Klinik Umum": Stethoscope,
  "Dental Clinic": Smile,
  "Beauty Clinic": Sparkles,
  "Klinik Kecantikan": Sparkles,
  "Veterinary Clinic": Activity,
  Pharmacy: Pill,
  Apotek: Pill,
  Retail: ShoppingBasket,
  "Hardware Store": Hammer,
  "Toko Bangunan": Hammer,
  "Fashion Store": Shirt,
  "Electronics Store": Monitor,
  "Retail Pharmacy": Plus,
  "D2C Brand": Star,
  "Online Fashion": Shirt,
  "Beauty Store": Sparkles,
  Electronics: Laptop,
  Elektronik: Laptop,
  "Digital Products": Download,
  "Social Commerce Intelligence": Radar,
  Tutoring: BookOpen,
  Bimbel: BookOpen,
  "Language Course": Globe,
  "Kursus Bahasa": Globe,
  Bootcamp: Terminal,
  School: GraduationCap,
  Sekolah: GraduationCap,
  "Training Center": Presentation,
  "E-Learning (LMS)": GraduationCap,
  "KKN & Fieldwork": Map,
  "Layanan Akademik": Landmark,
  "Campus Management System": GraduationCap,
  Consultant: Briefcase,
  Konsultan: Briefcase,
  "Law Firm": Scale,
  Agency: Lightbulb,
  HRIS: Users,
  Architect: Compass,
  Arsitek: Compass,
  "Accounting Firm": Calculator,
  "Kantor Akuntan": Calculator,
  FMCG: Truck,
  Pharmaceuticals: Pill,
  Farmasi: Pill,
  "Building Materials": Hammer,
  "Bahan Bangunan": Hammer,
  Spareparts: Wrench,
  Sparepart: Wrench,
  Wholesale: Package,
  Grosir: Package,
  Apparel: Scissors,
  Konveksi: Scissors,
  Furniture: Armchair,
  Printing: Printer,
  Percetakan: Printer,
  "Packaged Food": Search,
  "Makanan Kemasan": Search,
  Workshop: PenTool,
  Developer: Building,
  Broker: Handshake,
  "Boarding House": Home,
  Kost: Home,
  Apartment: Building2,
  Apartemen: Building2,
  "Property Management": LayoutDashboard,
  "F&B Franchise": Store,
  Laundry: Droplets,
  "Retail Franchise": Tags,
  "Education Franchise": GraduationCap,
  "Brand Partnership": Network,
  "Kemitraan Brand": Network,
  Seminar: Mic,
  "Workshop (Event)": Users,
  Expo: Ticket,
  Community: Users,
  Komunitas: Users,
  "Event Organizer": Calendar,
  Village: Map,
  Desa: Map,
  "Sub-district": Landmark,
  Kelurahan: Landmark,
  Foundation: Heart,
  Yayasan: Heart,
  Cooperative: Wallet,
  Koperasi: Wallet,
  "Layanan Komunitas": Users,
  Church: Heart,
  "CRM & Leads": Users,
  "Project Management": LayoutDashboard,
  "KPI & Performance": Activity
};

export function getIndustryIcon(iconKey?: string | null) {
  if (!iconKey) return LayoutDashboard;
  return landingIndustryIconMap[iconKey] ?? LayoutDashboard;
}

export function getSegmentIcon(name: string, iconKey?: string | null) {
  if (iconKey && landingIndustryIconMap[iconKey]) return landingIndustryIconMap[iconKey];
  if (iconKey && segmentIconMap[iconKey]) return segmentIconMap[iconKey];
  return segmentIconMap[name] ?? LayoutDashboard;
}

export const getSegmentPage = (segmentName: string): PortalPage => {
  const segmentPageMap: Record<string, PortalPage> = {
    HRIS: "hris",
    "E-Learning (LMS)": "education-school-dashboard",
    "KKN & Fieldwork": "education-school-dashboard",
    "Layanan Akademik": "education-school-dashboard",
    "Campus Management System": "education-school-dashboard",
    Cafe: "fnb-cafe",
    Restaurant: "fnb-restaurant",
    Restoran: "fnb-restaurant",
    Bakery: "fnb-bakery",
    "Cloud Kitchen": "fnb-cloud-kitchen",
    "Food Court": "fnb-food-court",
    Church: "church-dashboard"
  };

  return segmentPageMap[segmentName] ?? "sub-industry";
};

export function getIndustryColor(colorKey?: string | null) {
  if (!colorKey) return "#0d9488";
  return colorKey.startsWith("#") ? colorKey : industryColorHex[colorKey] ?? "#0d9488";
}

export function getIndustryPalette(colorKey?: string | null) {
  if (colorKey && industryColorPalette[colorKey]) return industryColorPalette[colorKey];
  const primary = getIndustryColor(colorKey);
  return { primary, soft: `color-mix(in srgb, ${primary} 12%, white)`, dark: `color-mix(in srgb, ${primary} 82%, #111111)` };
}

export function getSpecializedPortalPage(industry: Pick<PortalCatalogIndustry, "slug">, subIndustry?: Pick<PortalCatalogSubIndustry, "slug" | "name">): PortalPage | null {
  const industrySlug = industry.slug;
  const subSlug = subIndustry?.slug ?? "";
  const subName = subIndustry?.name ?? "";
  const isFnbIndustry = ["food-and-beverage", "fb-kuliner", "fnb"].includes(industrySlug) || industrySlug.startsWith("fb-") || industrySlug.includes("restoran-cafe");
  const isProfessionalIndustry = ["professional-services", "jasa-profesional"].includes(industrySlug);
  const isRetailIndustry = industrySlug === "retail-and-stores" || industrySlug.includes("retail");
  const isPublicIndustry = ["public-services", "layanan-publik"].includes(industrySlug) || industrySlug.includes("layanan-publik");
  const isCommerceIndustry = ["ecommerce-and-marketplaces", "e-commerce-and-marketplace", "ecommerce"].includes(industrySlug)
    || industrySlug.includes("commerce")
    || industrySlug.includes("marketplace");
  const isEducationIndustry = ["education-and-courses", "pendidikan-and-kursus", "education"].includes(industrySlug)
    || industrySlug.includes("education")
    || industrySlug.includes("pendidikan");

  if (isFnbIndustry) {
    const fnbPageMap: Record<string, PortalPage> = {
      cafe: "fnb-cafe",
      restaurant: "fnb-restaurant",
      restoran: "fnb-restaurant",
      bakery: "fnb-bakery",
      "cloud-kitchen": "fnb-cloud-kitchen",
      "food-court": "fnb-food-court"
    };
    const fnbKey = Object.keys(fnbPageMap).find((key) => subSlug === key || subSlug.endsWith(`-${key}`) || subName.toLowerCase() === key);
    return subIndustry ? fnbPageMap[fnbKey ?? ""] ?? "fnb" : "fnb";
  }

  if ((isProfessionalIndustry || industrySlug === "internal-operations") && (subSlug === "hris" || subSlug.endsWith("-hris") || subName === "HRIS" || subName === "Omnia HRIS")) return "hris";
  if (isRetailIndustry && (subSlug === "retail-store" || subName === "Retail" || subName === "Retail Toko")) return "sub-industry";
  if (isEducationIndustry) {
    if (subSlug === "school-campus" || subName === "School / Campus") return "education-school-campus";
    if (subSlug === "bootcamp" || subName === "Bootcamp") return "education-bootcamp";
    if (subSlug === "tutoring" || subName === "Tutoring") return "education-tutoring";
    if (subSlug === "language-course" || subName === "Language Course") return "education-language-course";
    if (subSlug === "training-center" || subName === "Training Center") return "education-training-center";
    return "education-school-dashboard"; // fallback
  }
  if (isPublicIndustry && (subSlug === "church" || subSlug.endsWith("-church") || subName === "Church")) return "church-dashboard";
  if (isCommerceIndustry && (subSlug === "social-commerce-intelligence" || subSlug.endsWith("-social-commerce-intelligence") || subName === "Social Commerce Intelligence")) return "social-commerce-intelligence";
  return null;
}

export function getIndustryPortalPath(industry: Pick<PortalCatalogIndustry, "slug">) {
  const specialized = getSpecializedPortalPage(industry);
  if (specialized === "fnb") return "/portal/fnb";
  return `/portal/${industry.slug}`;
}

export function getSubIndustryPortalPath(industry: Pick<PortalCatalogIndustry, "slug">, subIndustry: Pick<PortalCatalogSubIndustry, "slug" | "name">) {
  const isCafe = (industry.slug.includes("fnb") || industry.slug.includes("food")) && (subIndustry.slug === "cafe" || subIndustry.name.toLowerCase() === "cafe");
  const isHris = subIndustry.slug === "hris" || subIndustry.name === "HRIS" || subIndustry.name === "Omnia HRIS";
  const isRetail = industry.slug.includes("retail") && (subIndustry.slug.includes("retail") || subIndustry.name.toLowerCase().includes("retail"));
  const isClinic = (industry.slug.includes("health") || industry.slug.includes("kesehatan")) && (subIndustry.slug.includes("clinic") || subIndustry.slug.includes("klinik") || subIndustry.name.toLowerCase().includes("klinik") || subIndustry.name.toLowerCase().includes("clinic"));
  const isChurch = industry.slug.includes("public-services") && (subIndustry.slug.includes("church") || subIndustry.name.toLowerCase().includes("gereja"));
  const isSocialCommerce = subIndustry.slug.includes("social-commerce");
  const isEducation = industry.slug.includes("education");

  if (isCafe) return process.env.NEXT_PUBLIC_CAFE_URL || "https://omnia-cafe-web.vercel.app";
  if (isHris) return process.env.NEXT_PUBLIC_HRIS_URL || "https://omnia-hris-web.vercel.app";
  if (isRetail) return process.env.NEXT_PUBLIC_RETAIL_URL || "https://omnia-retail-web.vercel.app";
  if (isClinic) return process.env.NEXT_PUBLIC_CLINIC_URL || "https://omnia-clinic-web.vercel.app";
  if (isChurch) return process.env.NEXT_PUBLIC_CHURCH_URL || "https://omnia-church-web.vercel.app";
  if (isSocialCommerce) return process.env.NEXT_PUBLIC_SOCIAL_COMMERCE_URL || "https://omnia-social-commerce-web.vercel.app";
  
  const specialized = getSpecializedPortalPage(industry, subIndustry);
  if (isEducation && specialized) {
    if (specialized === "education-school-campus") return process.env.NEXT_PUBLIC_EDUCATION_SCHOOL_URL || "https://omnia-education-school-web.vercel.app";
    if (specialized === "education-bootcamp") return process.env.NEXT_PUBLIC_EDUCATION_BOOTCAMP_URL || "https://omnia-education-bootcamp-web.vercel.app";
    if (specialized === "education-tutoring") return process.env.NEXT_PUBLIC_EDUCATION_TUTORING_URL || "https://omnia-education-tutoring-web.vercel.app";
    if (specialized === "education-language-course") return process.env.NEXT_PUBLIC_EDUCATION_LANGUAGE_URL || "https://omnia-education-language-web.vercel.app";
    if (specialized === "education-training-center") return process.env.NEXT_PUBLIC_EDUCATION_TRAINING_URL || "https://omnia-education-training-web.vercel.app";
  }
  if (specialized === "sub-industry" && (industry.slug === "retail-and-stores" || industry.slug.includes("retail"))) return "/portal/retail-and-stores/retail-store";
  if (specialized === "hris") return `/portal/${industry.slug}/hris`;
  if (specialized?.startsWith("fnb-")) {
    const fnbSlug = subIndustry.name === "Restoran" || subIndustry.slug.endsWith("-restoran") ? "restaurant" : subIndustry.name.toLowerCase().replace(/\s+/g, "-");
    return `/portal/fnb/${fnbSlug}`;
  }
  return `/portal/${industry.slug}/${subIndustry.slug}`;
}
