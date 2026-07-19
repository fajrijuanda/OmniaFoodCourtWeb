import { apiFetch } from "@/lib/api";
import {
  competitorRows,
  creatorShortlistRows,
  productRadarRows,
  reportSections,
  socialActionCards,
  socialMetricCards
} from "./socialCommerceData";

export type SocialConnectorStatus = "active" | "queued" | "needs_credentials" | "disabled";

export type SocialMetric = {
  label: string;
  value: string;
  trend: string;
  tone?: string;
};

export type SocialProductTrend = {
  id: string;
  productName: string;
  category: string;
  channel: string;
  channelLabel: string;
  marketplaceRank?: number | null;
  signal: string;
  freshnessScore: number;
  saturationLevel: string;
  confidenceScore: number;
  marginEstimate: number;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  gmvProxy: number;
  reviewVelocity: number;
  creatorVelocity: number;
  recommendedAction: string;
  status: string;
  capturedAt?: string;
};

export type SocialCreatorSignal = {
  id: string;
  handle: string;
  niche: string;
  channel: string;
  channelLabel: string;
  fitScore: number;
  gmvProxy: number;
  commissionRange: string;
  audienceFit: string;
  riskLevel: string;
  note?: string | null;
};

export type SocialCompetitorWatch = {
  id: string;
  shopName: string;
  channel: string;
  channelLabel: string;
  category: string;
  movement: string;
  risk: string;
  response: string;
  velocityScore: number;
  priceChangePct: number;
  creatorCollabCount: number;
  status: string;
};

export type SocialActionCard = {
  id: string;
  title: string;
  body: string;
  confidence: string;
  actionLabel: string;
  moduleKey: string;
  priority: string;
  status: string;
};

export type SocialAlert = {
  id: string;
  title: string;
  body: string;
  channel?: string | null;
  channelLabel: string;
  category?: string | null;
  severity: string;
  status: string;
  rule: string;
  triggeredAt?: string;
};

export type SocialConnector = {
  id: string;
  channel: string;
  label: string;
  status: SocialConnectorStatus;
  lastSyncAt?: string | null;
  credentialHint?: string | null;
  notes?: string | null;
};

export type SocialExperiment = {
  id: string;
  title: string;
  productName?: string | null;
  channel?: string | null;
  channelLabel: string;
  hypothesis: string;
  status: string;
  budget: number;
  targetMetric?: string | null;
  result?: string | null;
};

export type SocialReport = {
  id: string;
  title: string;
  period: string;
  status: string;
  sections: string[];
  summary: string;
};

export type SocialSnapshot = {
  dataMode: "demo_seeded" | "live" | string;
  metrics: SocialMetric[];
  connectors: SocialConnector[];
  products: SocialProductTrend[];
  creators: SocialCreatorSignal[];
  competitors: SocialCompetitorWatch[];
  actionCards: SocialActionCard[];
  alerts: SocialAlert[];
  experiments: SocialExperiment[];
  reports: SocialReport[];
  settings?: {
    market: string;
    preset: string;
    refreshMode: string;
    dataMode: string;
    categories: string[];
    channels: string[];
    notes?: string | null;
  } | null;
};

const channelLabels: Record<string, string> = {
  tiktok_shop: "TikTok Shop",
  shopee: "Shopee",
  tokopedia: "Tokopedia",
  lazada: "Lazada",
  blibli: "Blibli"
};

export const channelOptions = [
  { value: "all", label: "All channels" },
  { value: "tiktok_shop", label: "TikTok Shop" },
  { value: "shopee", label: "Shopee" },
  { value: "tokopedia", label: "Tokopedia" },
  { value: "lazada", label: "Lazada" },
  { value: "blibli", label: "Blibli" }
];

export const categoryOptions = ["all", "Beauty", "Home", "Electronics", "Fashion", "FMCG"];

export const fallbackSocialSnapshot: SocialSnapshot = {
  dataMode: "demo_seeded",
  settings: {
    market: "Indonesia",
    preset: "Beauty, Home, Electronics, Fashion, FMCG",
    refreshMode: "demo_seeded",
    dataMode: "demo_seeded",
    categories: categoryOptions.slice(1),
    channels: channelOptions.slice(1).map((item) => item.value),
    notes: "Development fallback. Not live marketplace data."
  },
  metrics: socialMetricCards.map((item) => ({ label: item.label, value: item.value, trend: item.trend })),
  connectors: channelOptions.slice(1).map((item, index) => ({
    id: `fallback-${item.value}`,
    channel: item.value,
    label: item.label,
    status: index < 2 ? "active" : index === 2 ? "queued" : index === 3 ? "needs_credentials" : "disabled",
    credentialHint: "Demo mode",
    notes: "Official marketplace credentials required for live data."
  })),
  products: productRadarRows.map((item, index) => ({
    id: `fallback-product-${index}`,
    productName: item.product,
    category: item.category,
    channel: channelOptions[(index % 5) + 1].value,
    channelLabel: channelOptions[(index % 5) + 1].label,
    marketplaceRank: index + 3,
    signal: item.signal,
    freshnessScore: item.freshness,
    saturationLevel: item.saturation,
    confidenceScore: item.confidence === "High" ? 88 : 72,
    marginEstimate: Number(item.margin.replace("%", "")),
    priceRange: index % 2 === 0 ? "Rp69.000 - Rp99.000" : "Rp39.000 - Rp79.000",
    priceMin: index % 2 === 0 ? 69000 : 39000,
    priceMax: index % 2 === 0 ? 99000 : 79000,
    gmvProxy: 76000000 + index * 36000000,
    reviewVelocity: 80 + index * 42,
    creatorVelocity: 12 + index * 9,
    recommendedAction: "Review untuk campaign 7 hari",
    status: index === 3 ? "avoid" : "watch"
  })),
  creators: creatorShortlistRows.map((item, index) => ({
    id: `fallback-creator-${index}`,
    handle: item.creator,
    niche: item.niche,
    channel: channelOptions[(index % 3) + 1].value,
    channelLabel: channelOptions[(index % 3) + 1].label,
    fitScore: item.fit,
    gmvProxy: Number(item.gmv.replace(/\D/g, "")) * 1000000,
    commissionRange: item.commission,
    audienceFit: item.note,
    riskLevel: index === 2 ? "medium" : "low",
    note: item.note
  })),
  competitors: competitorRows.map((item, index) => ({
    id: `fallback-competitor-${index}`,
    shopName: item.shop,
    channel: channelOptions[(index % 3) + 1].value,
    channelLabel: channelOptions[(index % 3) + 1].label,
    category: index === 2 ? "Home" : "Beauty",
    movement: item.movement,
    risk: item.risk,
    response: item.response,
    velocityScore: 91 - index * 8,
    priceChangePct: index === 1 ? -7 : 0,
    creatorCollabCount: 12 - index * 3,
    status: "monitoring"
  })),
  actionCards: socialActionCards.map((item, index) => ({
    id: `fallback-action-${index}`,
    title: item.title,
    body: item.body,
    confidence: item.confidence,
    actionLabel: item.action,
    moduleKey: "product-radar",
    priority: index === 0 ? "high" : "normal",
    status: "open"
  })),
  alerts: [
    { id: "fallback-alert-1", title: "Fresh trend detected", body: "Hair serum travel pack melewati freshness 90.", channel: "tiktok_shop", channelLabel: "TikTok Shop", category: "Beauty", severity: "high", status: "unread", rule: "Freshness score > 85" },
    { id: "fallback-alert-2", title: "Competitor spike", body: "Glow Lab Official naik +18% GMV proxy.", channel: "tiktok_shop", channelLabel: "TikTok Shop", category: "Beauty", severity: "high", status: "unread", rule: "Competitor velocity naik 3 hari" }
  ],
  experiments: [
    { id: "fallback-exp-1", title: "Serum mini: 3 creator micro", productName: "Hair serum travel pack", channel: "tiktok_shop", channelLabel: "TikTok Shop", hypothesis: "Before-after hook menjaga CPA < Rp35rb.", status: "running", budget: 1500000, targetMetric: "CPA < Rp35rb" }
  ],
  reports: [
    { id: "fallback-report-1", title: "Weekly opportunity report", period: "Demo", status: "ready", summary: "Beauty dan Fashion memberi sinyal fresh tertinggi.", sections: reportSections }
  ]
};

export function fetchSocialSnapshot() {
  return apiFetch<SocialSnapshot>("/social-commerce-intelligence/snapshot");
}

export function fetchSocialProducts(filters: { channel?: string; category?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters.channel) params.set("channel", filters.channel);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  const query = params.toString();
  return apiFetch<SocialProductTrend[]>(`/social-commerce-intelligence/products${query ? `?${query}` : ""}`);
}

export function connectorStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export function socialChannelLabel(channel?: string | null) {
  return channel ? channelLabels[channel] ?? channel : "All channels";
}
