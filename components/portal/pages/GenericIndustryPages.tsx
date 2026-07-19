"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, LayoutDashboard, Lock, Sparkles } from "lucide-react";
import { PricingPlanModal } from "@/components/PricingPlanModal";
import { buildPlans, getPlansFromCatalog } from "@/components/showcase/pricing";
import { Panel } from "@/components/portal/ui";
import {
  getIndustryColor,
  getIndustryIcon,
  getSubIndustryPortalPath,
  getSegmentIcon,
  ownerPurchasedSegments,
  type PortalCatalogIndustry,
  type PortalCatalogSubIndustry
} from "../portalCatalog";
import type { PortalRole } from "../portalTypes";

export function GenericIndustryPage({
  industry,
  role
}: {
  industry: PortalCatalogIndustry | null;
  role: PortalRole;
}) {
  const router = useRouter();
  const [selectedSegmentForPricing, setSelectedSegmentForPricing] = useState<PortalCatalogSubIndustry | null>(null);
  const [catalog, setCatalog] = useState<any[] | null>(null);
  
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/public/catalog`)
      .then((res) => res.json())
      .then((data) => setCatalog(data))
      .catch((err) => console.error("Failed to fetch catalog:", err));
  }, []);

  const pricingPlans = useMemo(() => {
    if (!selectedSegmentForPricing || !industry) return null;
    return (catalog && getPlansFromCatalog(catalog, industry.name, selectedSegmentForPricing.name, [])) || buildPlans(industry.name, selectedSegmentForPricing.name, []);
  }, [industry, selectedSegmentForPricing, catalog]);

  if (!industry) {
    return (
      <Panel>
        <LayoutDashboard className="h-7 w-7 text-[var(--portal-primary)]" />
        <h1 className="mt-4 text-3xl font-black text-[#172033]">Industri tidak ditemukan</h1>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">Katalog industri belum tersedia dari database atau slug tidak cocok.</p>
      </Panel>
    );
  }

  const Icon = getIndustryIcon(industry.iconKey);
  const color = getIndustryColor(industry.colorKey);
  const visibleSegments = role === "developer"
    ? industry.subIndustries
    : industry.subIndustries.filter((segment) => ownerPurchasedSegments.has(segment.name));
  const suggestedSegments = role === "developer"
    ? []
    : industry.subIndustries.filter((segment) => !ownerPurchasedSegments.has(segment.name));
  const allSegments = [...visibleSegments, ...suggestedSegments];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-white shadow-[0_16px_38px_rgba(15,23,42,0.12)] sm:h-14 sm:w-14 sm:rounded-[20px]" style={{ backgroundColor: color }}>
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.22em]" style={{ color }}>Industri aktif</p>
              <h1 className="mt-1.5 text-2xl font-black text-[#172033] sm:mt-2 sm:text-4xl">{industry.name}</h1>
              <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
                {industry.solution || industry.pain || "Pilih sub-industri untuk membuka preview aplikasi dan simulasi modul tenant."}
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
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Sub-industri {industry.name}</h2>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Semua sub-industri di daftar ini berasal dari database catalog. Sub-industri tanpa modul khusus tetap memiliki halaman preview.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {allSegments.map((segment) => {
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
                      <p className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color }}>
                        {accessible ? "Accessible" : "Rekomendasi"}
                      </p>
                      <h3 className="mt-1 text-sm font-black text-[#172033] sm:text-base">{segment.name}</h3>
                    </div>
                  </div>
                  {accessible ? <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" style={{ color }} /> : <Lock className="h-4 w-4 text-slate-400" />}
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] font-bold leading-5 text-slate-500 sm:text-xs">{segment.need}</p>
                <p className="mt-2 rounded-[10px] px-2 py-1.5 text-[9px] font-black leading-4 sm:rounded-[12px] sm:px-2.5 sm:text-[10px]" style={{ backgroundColor: `${color}14`, color }}>
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
          inquirySubject={`${industry.name} - ${selectedSegmentForPricing?.name ?? ""}`}
          themeColor="orange"
          onAction={() => setSelectedSegmentForPricing(null)}
        />
      ) : null}
    </div>
  );
}

export function GenericSubIndustryPage({
  industry,
  subIndustry,
  role
}: {
  industry: PortalCatalogIndustry | null;
  subIndustry: PortalCatalogSubIndustry | null;
  role: PortalRole;
}) {
  const router = useRouter();

  if (!industry || !subIndustry) {
    return (
      <Panel>
        <LayoutDashboard className="h-7 w-7 text-[var(--portal-primary)]" />
        <h1 className="mt-4 text-3xl font-black text-[#172033]">Sub-industri tidak ditemukan</h1>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">Data sub-industri belum tersedia dari database atau slug tidak cocok.</p>
      </Panel>
    );
  }

  const color = getIndustryColor(industry.colorKey);
  const SegmentIcon = getSegmentIcon(subIndustry.name, subIndustry.iconKey);
  const accessible = role === "developer" || ownerPurchasedSegments.has(subIndustry.name);
  const previewModules = subIndustry.offer
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel>
        <button onClick={() => router.push(`/portal/${industry.slug}`)} className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 sm:mb-5 sm:px-4" type="button">
          <ArrowLeft className="h-4 w-4" /> Kembali ke {industry.name}
        </button>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-white shadow-[0_16px_38px_rgba(15,23,42,0.12)] sm:h-14 sm:w-14 sm:rounded-[20px]" style={{ backgroundColor: color }}>
              <SegmentIcon className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.22em]" style={{ color }}>Preview sub-industri</p>
              <h1 className="mt-1.5 text-2xl font-black text-[#172033] sm:mt-2 sm:text-4xl">{subIndustry.name}</h1>
              <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">{subIndustry.need}</p>
            </div>
          </div>
          <span className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.14em] ${accessible ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
            {accessible ? "Accessible" : "Pricing preview"}
          </span>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Panel>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.22em]" style={{ color }}>Modul demo</p>
          <h2 className="mt-2 text-xl font-black text-[#172033] sm:text-2xl">Workspace {subIndustry.name}</h2>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">
            Halaman ini disediakan otomatis untuk sub-industri yang belum punya modul operasional khusus. Modul rinci mengikuti katalog dan bisa dikembangkan menjadi workflow penuh.
          </p>
          <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 sm:grid-cols-2">
            {(previewModules.length ? previewModules : ["Core workflow", "Dashboard owner", "Role permission", "Report export"]).map((module) => (
              <div key={module} className="rounded-[14px] border border-slate-100 bg-slate-50 p-3 sm:rounded-[18px] sm:p-4">
                <CheckCircle2 className="h-5 w-5" style={{ color }} />
                <p className="mt-2 text-sm font-black text-[#172033] sm:mt-3">{module}</p>
                <p className="mt-1 text-[11px] font-bold leading-5 text-slate-500 sm:text-xs">Preview modul berbasis kebutuhan {subIndustry.name}.</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" style={{ color }} />
          <h2 className="mt-3 text-xl font-black text-[#172033] sm:mt-4 sm:text-2xl">Penawaran</h2>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">{subIndustry.offer}</p>
          <button className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-sm font-black text-white sm:mt-6 sm:px-5 sm:py-3" type="button">
            Request konfigurasi <ArrowRight className="h-4 w-4" />
          </button>
        </Panel>
      </div>
    </div>
  );
}
