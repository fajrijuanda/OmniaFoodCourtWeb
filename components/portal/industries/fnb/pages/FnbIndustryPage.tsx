"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Store } from "lucide-react";
import { PricingPlanModal } from "@/components/PricingPlanModal";
import { buildPlans } from "@/components/showcase/pricing";
import { PortalPage, PortalRole } from "../../../portalTypes";
import { Panel } from "@/components/portal/ui";
import {
  getIndustryColor,
  getIndustryIcon,
  getSubIndustryPortalPath,
  getSegmentIcon,
  ownerPurchasedSegments,
  type PortalCatalogIndustry,
  type PortalCatalogSubIndustry
} from "../../../portalCatalog";

export function FnbIndustryPage({
  role,
  industry
}: {
  role: PortalRole;
  setActivePage: (page: PortalPage) => void;
  industry: PortalCatalogIndustry | null;
}) {
  const router = useRouter();
  const Icon = getIndustryIcon(industry?.iconKey) ?? Store;
  const industryColor = getIndustryColor(industry?.colorKey);
  const visibleSegments = role === "developer"
    ? industry?.subIndustries ?? []
    : (industry?.subIndustries ?? []).filter((segment) => ownerPurchasedSegments.has(segment.name));
  const suggestedSegments = role === "developer"
    ? []
    : (industry?.subIndustries ?? []).filter((segment) => !ownerPurchasedSegments.has(segment.name));
  const [selectedSegmentForPricing, setSelectedSegmentForPricing] = useState<PortalCatalogSubIndustry | null>(null);

  const pricingPlans = useMemo(() => {
    if (!selectedSegmentForPricing || !industry) return null;
    return buildPlans(industry.name, selectedSegmentForPricing.name, []);
  }, [industry, selectedSegmentForPricing]);

  if (!industry) {
    return (
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Industri aktif</p>
        <h1 className="mt-2 text-3xl font-black text-[#172033]">F&B belum tersedia dari database</h1>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">Pastikan katalog industri dari API sudah memuat Food & Beverage / F&B Kuliner.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-white shadow-[0_16px_38px_rgba(15,23,42,0.12)] sm:h-14 sm:w-14 sm:rounded-[20px]" style={{ backgroundColor: industryColor }}>
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.22em]" style={{ color: industryColor }}>Industri aktif</p>
              <h1 className="mt-1.5 text-2xl font-black text-[#172033] sm:mt-2 sm:text-4xl">{industry.name}</h1>
              <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
                Pilih sub-industri kuliner yang dimiliki tenant. Superadmin dapat membuka semua demo sub-industri dan memilih simulasi tier.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-[310px]">
            <div className="rounded-[14px] bg-slate-50 p-3 sm:rounded-[18px] sm:p-4">
              <p className="text-xl font-black text-[#172033] sm:text-2xl">{industry.subIndustries.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 sm:text-xs sm:tracking-[0.12em]">Sub-industri</p>
            </div>
            <div className="rounded-[14px] bg-[var(--portal-primary-soft)] p-3 sm:rounded-[18px] sm:p-4">
              <p className="text-xl font-black text-[#172033] sm:text-2xl">{role === "developer" ? "All" : visibleSegments.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--portal-primary)] sm:text-xs sm:tracking-[0.12em]">Terbuka</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 border-b border-slate-100 pb-4 sm:mb-5 sm:pb-5">
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Sub-industri F&B / Kuliner</h2>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Cafe, restoran, cloud kitchen, bakery, dan food court memakai halaman preview masing-masing dengan modul operasional berbeda.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[...visibleSegments, ...suggestedSegments].map((segment) => {
            const accessible = role === "developer" || ownerPurchasedSegments.has(segment.name);
            const SegmentIcon = getSegmentIcon(segment.name, segment.iconKey);
            return (
              <button
                key={segment.id}
                onClick={() => {
                  if (accessible) {
                    router.push(getSubIndustryPortalPath(industry, segment));
                    return;
                  }
                  setSelectedSegmentForPricing(segment);
                }}
                className={`group min-h-[104px] rounded-[14px] border p-3 text-left transition hover:-translate-y-0.5 sm:min-h-[140px] sm:rounded-[16px] ${
                  accessible ? "border-slate-100 bg-white shadow-sm" : "border-dashed border-slate-200 bg-slate-50 opacity-80"
                }`}
                type="button"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[11px] sm:h-10 sm:w-10 sm:rounded-[12px] ${accessible ? "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "bg-slate-200 text-slate-400"}`}>
                      <SegmentIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: industryColor }}>
                        {accessible ? "Accessible" : "Rekomendasi"}
                      </p>
                      <h3 className="mt-1 text-sm font-black text-[#172033] sm:text-base">{segment.name}</h3>
                    </div>
                  </div>
                  {accessible ? <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" style={{ color: industryColor }} /> : <Lock className="h-4 w-4 text-slate-400" />}
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-5 text-slate-500 sm:text-xs">{segment.need}</p>
                <p className="mt-2 rounded-[10px] px-2 py-1.5 text-[9px] font-black leading-4 sm:rounded-[12px] sm:px-2.5 sm:text-[10px]" style={{ backgroundColor: `${industryColor}14`, color: industryColor }}>
                  {accessible ? segment.offer : "Belum dibeli tenant. Klik untuk pricing."}
                </p>
              </button>
            );
          })}
        </div>
      </Panel>

      {pricingPlans ? (
        <PricingPlanModal
          open={selectedSegmentForPricing !== null}
          onOpenChange={(open) => { if (!open) setSelectedSegmentForPricing(null); }}
          tiers={pricingPlans.tiers}
          featureRows={pricingPlans.featureRows}
          addOns={pricingPlans.addOns}
          actionLabel="Pilih Tier"
          themeColor="orange"
          onAction={() => setSelectedSegmentForPricing(null)}
        />
      ) : null}
    </div>
  );
}
