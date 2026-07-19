import {
  BarChart3,
  Bell,
  Bot,
  ClipboardList,
  FileText,
  Gauge,
  LineChart,
  Megaphone,
  Radar,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Users,
  Wand2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PortalPage } from "../../../portalTypes";

export type SocialCommerceTier = "starter" | "growth" | "pro" | "enterprise";

export type SocialCommerceModuleKey =
  | "dashboard"
  | "setup"
  | "product-radar"
  | "creator-intelligence"
  | "competitor-watchlist"
  | "live-cockpit"
  | "ad-radar"
  | "campaign-planner"
  | "experiment-board"
  | "reports"
  | "alerts"
  | "connectors"
  | "settings";

export type SocialCommerceModule = {
  key: SocialCommerceModuleKey;
  name: string;
  caption: string;
  minimumTier: SocialCommerceTier;
  icon: LucideIcon;
  route: PortalPage;
};

export const socialTierRank: Record<SocialCommerceTier, number> = {
  starter: 1,
  growth: 2,
  pro: 3,
  enterprise: 4
};

export const socialTierConfigs: Record<SocialCommerceTier, { name: string; price: string; caption: string; limit: string }> = {
  starter: {
    name: "Starter",
    price: "Rp349rb/bln",
    caption: "Product research cepat untuk solo seller, affiliate, dan brand kecil.",
    limit: "100 product lookups / hari"
  },
  growth: {
    name: "Growth",
    price: "Rp899rb/bln",
    caption: "Insight berubah menjadi campaign dan eksperimen mingguan.",
    limit: "3 connected shops"
  },
  pro: {
    name: "Business",
    price: "Rp2,49jt/bln",
    caption: "Monitoring kompetitor, live cockpit, report, dan workflow tim.",
    limit: "Refresh 15 menit"
  },
  enterprise: {
    name: "Agency",
    price: "Rp5,99jt/bln",
    caption: "Multi-client workspace, white-label report, approval, dan API.",
    limit: "15 client workspace"
  }
};

export const socialCommerceModules: SocialCommerceModule[] = [
  { key: "dashboard", name: "Home Dashboard", caption: "Persona dashboard, KPI, action cards, dan weekly plan.", minimumTier: "starter", icon: Gauge, route: "social-intel-dashboard" },
  { key: "setup", name: "Guided Setup", caption: "Wizard 7 pertanyaan dengan preset kategori dan checklist 7 hari.", minimumTier: "starter", icon: Wand2, route: "social-intel-setup" },
  { key: "product-radar", name: "Product Radar", caption: "Produk emerging, freshness, saturation, confidence, dan margin.", minimumTier: "starter", icon: Radar, route: "social-intel-product-radar" },
  { key: "creator-intelligence", name: "Creator Intelligence", caption: "Creator fit score, audience fit, outreach, dan risk warning.", minimumTier: "starter", icon: Users, route: "social-intel-creator-intelligence" },
  { key: "competitor-watchlist", name: "Competitor Watchlist", caption: "Pantau shop, pricing, collab creator, live, dan velocity spike.", minimumTier: "starter", icon: Store, route: "social-intel-competitor-watchlist" },
  { key: "campaign-planner", name: "Campaign Planner", caption: "Pairing produk, creator, script, budget, timeline, dan target.", minimumTier: "starter", icon: Megaphone, route: "social-intel-campaign-planner" },
  { key: "experiment-board", name: "Experiment Board", caption: "Backlog, running, learning, scale, stop untuk setiap insight.", minimumTier: "growth", icon: ClipboardList, route: "social-intel-experiment-board" },
  { key: "live-cockpit", name: "Live Commerce Cockpit", caption: "Rundown, buying signals, comment cluster, dan post-live diagnosis.", minimumTier: "growth", icon: RadioTower, route: "social-intel-live-cockpit" },
  { key: "ad-radar", name: "Ad Creative Radar", caption: "Hook analysis, creative fatigue, CTA pattern, dan script extraction.", minimumTier: "growth", icon: Sparkles, route: "social-intel-ad-radar" },
  { key: "reports", name: "Automated Reports", caption: "Weekly opportunity, competitor movement, dan client executive report.", minimumTier: "growth", icon: FileText, route: "social-intel-reports" },
  { key: "alerts", name: "Alert Center", caption: "Fresh trend, competitor spike, saturation risk, dan margin warning.", minimumTier: "pro", icon: Bell, route: "social-intel-alerts" },
  { key: "connectors", name: "Data Connectors", caption: "TikTok Shop, Shopify, marketplace, ads, CSV, dan API webhook.", minimumTier: "pro", icon: BarChart3, route: "social-intel-connectors" },
  { key: "settings", name: "Workspace Settings", caption: "Role, market, preset, billing, feature flag, dan data governance.", minimumTier: "pro", icon: ShieldCheck, route: "social-intel-settings" }
];

export const socialMetricCards = [
  { label: "Time to first insight", value: "4m 18s", trend: "Target < 5 menit", icon: Target },
  { label: "Product opportunities", value: "128", trend: "24 fresh, 61 heating", icon: Radar },
  { label: "Creator matches", value: "42", trend: "Fit score > 80", icon: Users },
  { label: "Action cards saved", value: "31%", trend: "Goal 30%+", icon: ClipboardList }
];

export const socialActionCards = [
  {
    title: "Test hair serum mini size minggu ini",
    body: "Freshness tinggi, creator crowding rendah, margin aman pada harga Rp89rb.",
    confidence: "High",
    action: "Buat experiment"
  },
  {
    title: "Naikkan komisi affiliate serum dari 10% ke 14%",
    body: "Top creator beauty di benchmark kategori merespons lebih cepat di komisi 13-15%.",
    confidence: "Medium",
    action: "Update campaign"
  },
  {
    title: "Tahan produk LED vanity mirror",
    body: "Seller crowding naik 38% dan price compression mulai menekan margin.",
    confidence: "High",
    action: "Mark as crowded"
  }
];

export const productRadarRows = [
  { product: "Hair serum travel pack", category: "Beauty", freshness: 91, saturation: "Fresh", confidence: "High", margin: "34%", signal: "+28% creator velocity" },
  { product: "Magnetic cable organizer", category: "Home", freshness: 78, saturation: "Heating", confidence: "Medium", margin: "29%", signal: "+19% review velocity" },
  { product: "Portable blender cup", category: "Electronics", freshness: 62, saturation: "Crowded", confidence: "Medium", margin: "21%", signal: "Ad pressure naik" },
  { product: "LED vanity mirror", category: "Beauty", freshness: 44, saturation: "Saturated", confidence: "High", margin: "13%", signal: "Price compression" }
];

export const creatorShortlistRows = [
  { creator: "@glowdaily.id", niche: "Beauty micro", fit: 92, gmv: "Rp118jt", commission: "12-14%", note: "Audience match kuat" },
  { creator: "@rumahrapi", niche: "Home living", fit: 87, gmv: "Rp76jt", commission: "10-12%", note: "Format demo efektif" },
  { creator: "@dealhunter.id", niche: "Affiliate deals", fit: 81, gmv: "Rp144jt", commission: "14-16%", note: "Butuh margin guard" }
];

export const competitorRows = [
  { shop: "Glow Lab Official", movement: "+18% GMV proxy", risk: "Creator collab spike", response: "Pantau 3 SKU serum" },
  { shop: "Beauty Flash ID", movement: "-7% price", risk: "Voucher pressure", response: "Jangan ikut perang harga" },
  { shop: "HomeHack Store", movement: "+9 live sessions", risk: "Live angle baru", response: "Review replay hari ini" }
];

export const liveSignals = [
  "Komentar harga meningkat pada menit 18-24",
  "Bundle 2 pcs memicu buying signal tertinggi",
  "Kompetitor memakai hook before-after dalam 4 live terakhir"
];

export const reportSections = [
  "Executive summary",
  "Product opportunities",
  "Competitor movement",
  "Creator shortlist",
  "Campaign recommendation",
  "Risk and saturation warning",
  "Next 7-day action plan"
];

