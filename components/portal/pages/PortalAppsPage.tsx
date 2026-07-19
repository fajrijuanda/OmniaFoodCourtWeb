"use client";

import { ArrowRight, LayoutDashboard } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";
import { Panel } from "@/components/portal/ui";
import { getIndustryColor, getIndustryPortalPath, type PortalCatalogIndustry } from "../portalCatalog";

export function PortalAppsPage({ industries }: { industries: PortalCatalogIndustry[] }) {
  const router = useRouter();
  return (
    <div className="space-y-4 lg:space-y-6">
      <Panel className="p-4 lg:p-6">
        <div className="mb-4 lg:mb-5 flex items-center justify-between border-b border-slate-100 pb-4 lg:pb-5">
          <div>
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] lg:tracking-[0.22em] text-[var(--portal-primary)]">Application hub</p>
            <h1 className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-black text-[#172033]">Pilih aplikasi industri</h1>
          </div>
          <LayoutDashboard className="h-6 w-6 lg:h-8 lg:w-8 text-[var(--portal-primary)]" />
        </div>
        <div className="grid grid-cols-3 gap-3 lg:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {industries.map((industry) => {
            const IndustryIcon = (LucideIcons as any)[industry.iconKey || ""] || LucideIcons.LayoutDashboard;
            const colorHex = getIndustryColor(industry.colorKey);
            return (
              <article key={industry.name} className="overflow-hidden rounded-[16px] lg:rounded-[22px] border border-slate-100 bg-white shadow-sm">
                <div className="relative h-16 lg:h-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${colorHex}, ${colorHex}38)` }}>
                  <div className="absolute -right-6 -top-6 lg:-right-8 lg:-top-8 h-16 w-16 lg:h-28 lg:w-28 rounded-full bg-white/22" />
                  <div className="absolute bottom-2 left-3 lg:bottom-4 lg:left-5 grid h-8 w-8 lg:h-14 lg:w-14 place-items-center rounded-[10px] lg:rounded-[18px] bg-white/22 text-white backdrop-blur">
                    <IndustryIcon className="h-4 w-4 lg:h-7 lg:w-7" />
                  </div>
                </div>
                <div className="p-3 lg:p-5">
                  <h3 className="text-[13px] leading-snug lg:text-lg font-black text-[#172033]">{industry.name}</h3>
                  <p className="mt-0.5 lg:mt-1 text-[9px] lg:text-sm font-bold leading-tight lg:leading-6 text-slate-500">{industry.subIndustries.length} sub-industries</p>
                  <button onClick={() => router.push(getIndustryPortalPath(industry))} className="mt-3 lg:mt-5 flex w-full items-center justify-center gap-1.5 lg:gap-2 rounded-full bg-[#111111] px-2.5 py-2 lg:px-4 lg:py-3 text-[10px] lg:text-sm font-black text-white transition-transform active:scale-95" type="button">
                    Open app <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
