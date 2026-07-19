"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, ClipboardList, Lock, Radar, RefreshCcw, Target } from "lucide-react";
import { Panel } from "@/components/portal/ui";
import type { HrisTier } from "../../professional-services/hris/HrisPortal";
import type { PortalPage, PortalRole } from "../../../portalTypes";
import { SocialIntelMetricCard } from "./components/SocialIntelMetricCard";
import { fallbackSocialSnapshot, fetchSocialSnapshot, type SocialSnapshot } from "./socialCommerceApi";
import {
  socialCommerceModules,
  socialTierConfigs,
  socialTierRank,
  type SocialCommerceModule,
  type SocialCommerceModuleKey,
  type SocialCommerceTier
} from "./socialCommerceData";
import { SocialCommerceWorkspace } from "./workspaces/SocialCommerceWorkspaces";

const socialPageToModule: Partial<Record<PortalPage, SocialCommerceModuleKey>> = Object.fromEntries(
  socialCommerceModules.map((module) => [module.route, module.key])
) as Partial<Record<PortalPage, SocialCommerceModuleKey>>;

const metricIcons = [Target, Radar, BarChart3, ClipboardList];

function toSocialTier(tier: HrisTier): SocialCommerceTier {
  if (tier === "enterprise") return "enterprise";
  if (tier === "pro") return "pro";
  if (tier === "growth") return "growth";
  return "starter";
}

function useSocialCommerceSnapshot() {
  const [snapshot, setSnapshot] = useState<SocialSnapshot>(fallbackSocialSnapshot);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSocialSnapshot();
      setSnapshot(data);
    } catch (err) {
      setSnapshot(fallbackSocialSnapshot);
      setError(err instanceof Error ? err.message : "Gagal memuat social commerce intelligence.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { snapshot, loading, error, refresh: load };
}

export function SocialCommerceOverviewPage({
  role,
  tier,
  setActivePage,
  onLockedModule
}: {
  role: PortalRole;
  tier: HrisTier;
  setActivePage: (page: PortalPage) => void;
  onLockedModule: () => void;
}) {
  const { snapshot, loading, error, refresh } = useSocialCommerceSnapshot();
  const effectiveTier = role === "developer" ? "enterprise" : toSocialTier(tier);
  const tierConfig = socialTierConfigs[effectiveTier];
  const unlockedCount = socialCommerceModules.filter((module) => socialTierRank[module.minimumTier] <= socialTierRank[effectiveTier]).length;
  const lockedCount = socialCommerceModules.length - unlockedCount;
  const metrics = useMemo(
    () => snapshot.metrics.map((metric, index) => ({ ...metric, icon: metricIcons[index % metricIcons.length] })),
    [snapshot.metrics]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-600">E-Commerce & Marketplace</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight text-[#172033] sm:text-5xl">
              Social commerce intelligence yang langsung memberi aksi.
            </h1>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-500 sm:text-base sm:leading-7">
              Product radar, creator fit score, competitor watchlist, live cockpit, profit reality layer, confidence score, dan AI strategy workflow untuk TikTok Shop seller, brand, affiliate, agency, dan live commerce team.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Setup < 5 menit", "Action cards", "Saturation guard", "Agency-ready"].map((item) => (
                <span key={item} className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-black text-pink-700">{item}</span>
              ))}
              <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700">
                {snapshot.dataMode === "demo_seeded" ? "Demo seeded data" : "Live data"}
              </span>
            </div>
          </div>
          <aside className="border-t border-slate-100 bg-slate-50 p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Current tier</p>
            <h2 className="mt-2 text-3xl font-black text-[#172033]">{tierConfig.name}</h2>
            <p className="mt-1 text-lg font-black text-pink-600">{tierConfig.price}</p>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{tierConfig.caption}</p>
            <div className="mt-4 rounded-[16px] bg-white p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Limit utama</p>
              <p className="mt-1 text-sm font-black text-[#172033]">{tierConfig.limit}</p>
            </div>
          </aside>
        </div>
      </Panel>

      {error ? (
        <Panel className="border-amber-100 bg-amber-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold leading-6 text-amber-800">
              API social commerce belum bisa diakses, menampilkan fallback demo lokal. Detail: {error.slice(0, 160)}
            </p>
            <button onClick={refresh} className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-amber-700 shadow-sm" type="button">
              <RefreshCcw className="h-4 w-4" /> Coba lagi
            </button>
          </div>
        </Panel>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <SocialIntelMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Panel className="p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">Module launcher</p>
            <h2 className="mt-1 text-2xl font-black text-[#172033]">Social Commerce Intelligence modules</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">{unlockedCount} terbuka, {lockedCount} terkunci sesuai tier.</p>
          </div>
          <button onClick={loading ? refresh : () => setActivePage("social-intel-product-radar")} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white" type="button">
            {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Memuat data" : "Buka Product Radar"}
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {socialCommerceModules.map((module) => (
            <SocialModuleCard
              key={module.key}
              module={module}
              effectiveTier={effectiveTier}
              onOpen={() => setActivePage(module.route)}
              onLockedModule={onLockedModule}
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SocialModuleCard({ module, effectiveTier, onOpen, onLockedModule }: { module: SocialCommerceModule; effectiveTier: SocialCommerceTier; onOpen: () => void; onLockedModule: () => void }) {
  const unlocked = socialTierRank[module.minimumTier] <= socialTierRank[effectiveTier];
  const Icon = module.icon;

  return (
    <button
      onClick={() => (unlocked ? onOpen() : onLockedModule())}
      className={`group min-h-[152px] rounded-[18px] border p-4 text-left transition hover:-translate-y-0.5 ${
        unlocked ? "border-slate-100 bg-white shadow-sm" : "border-dashed border-slate-200 bg-slate-50 opacity-75"
      }`}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-[14px] ${unlocked ? "bg-pink-600 text-white" : "bg-white text-slate-400"}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${unlocked ? "bg-emerald-50 text-emerald-600" : "bg-white text-slate-400"}`}>
          {unlocked ? <CheckCircle2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
          {unlocked ? "Open" : socialTierConfigs[module.minimumTier].name}
        </span>
      </div>
      <h3 className="mt-4 text-base font-black text-[#172033]">{module.name}</h3>
      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-500">{module.caption}</p>
    </button>
  );
}

export function SocialCommerceFeaturePage({ activePage, currentTier, role, onLockedModule }: { activePage: PortalPage; currentTier: HrisTier; role: PortalRole; onLockedModule: () => void }) {
  const { snapshot, loading, error, refresh } = useSocialCommerceSnapshot();
  const effectiveTier = role === "developer" ? "enterprise" : toSocialTier(currentTier);
  const moduleKey = socialPageToModule[activePage] ?? "dashboard";
  const activeModule = socialCommerceModules.find((item) => item.key === moduleKey) ?? socialCommerceModules[0];
  const locked = socialTierRank[activeModule.minimumTier] > socialTierRank[effectiveTier];
  const Icon = activeModule.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-pink-50 text-pink-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-600">Social Commerce Intelligence</p>
              <h1 className="mt-1 text-3xl font-black text-[#172033]">{activeModule.name}</h1>
              <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500">{activeModule.caption}</p>
            </div>
          </div>
          <span className="w-fit rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-700">
            {locked ? `Min ${socialTierConfigs[activeModule.minimumTier].name}` : `${socialTierConfigs[effectiveTier].name} access`}
          </span>
        </div>
      </Panel>
      {error ? (
        <Panel className="border-amber-100 bg-amber-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold leading-6 text-amber-800">Menampilkan fallback demo lokal karena API belum merespons: {error.slice(0, 160)}</p>
            <button onClick={refresh} className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-amber-700 shadow-sm" type="button">
              <RefreshCcw className="h-4 w-4" /> Coba lagi
            </button>
          </div>
        </Panel>
      ) : null}
      <SocialCommerceWorkspace moduleKey={activeModule.key} locked={locked} onLockedModule={onLockedModule} snapshot={snapshot} loading={loading} refreshSnapshot={refresh} />
    </div>
  );
}
