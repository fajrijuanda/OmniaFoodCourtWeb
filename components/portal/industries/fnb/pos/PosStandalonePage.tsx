"use client";

import { useEffect } from "react";
import { ArrowLeft, BadgeCheck, Clock3, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { PosLayout } from "./PosLayout";
import { fnbSubIndustries } from "../config/subIndustries";

export function PosStandalonePage({ subIndustrySlug = "cafe" }: { subIndustrySlug?: string }) {
  const router = useRouter();
  const subIndustry = fnbSubIndustries[subIndustrySlug] ?? fnbSubIndustries.cafe;

  useEffect(() => {
    document.documentElement.dataset.portalTheme = "omni";
    document.body.dataset.portalTheme = "omni";
  }, []);

  return (
    <main className="portal-theme-scope min-h-screen overflow-hidden bg-[#fff8f1] text-[#172033]">
      <header className="flex min-h-[50px] items-center justify-between gap-2 border-b border-orange-100/80 bg-white sm:bg-white/92 px-2.5 shadow-sm backdrop-blur-xl lg:min-h-[76px] lg:gap-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-1.5 lg:gap-3">
          <button
            type="button"
            onClick={() => router.push(`/portal/fnb/${subIndustry.id}`)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[var(--portal-primary)] hover:text-[var(--portal-primary)] lg:h-11 lg:w-11"
            aria-label="Kembali ke dashboard F&B"
          >
            <ArrowLeft className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
          </button>
          <BrandLogo className="h-8 w-8 lg:h-12 lg:w-12" />
          <div className="min-w-0 leading-none">
            <p className="truncate text-[8px] font-black uppercase tracking-[0.1em] text-[var(--portal-primary)] lg:text-xs lg:tracking-[0.2em]">Omnia POS</p>
            <h1 className="truncate text-[10px] font-black leading-tight text-[#172033] lg:text-xl">{subIndustry.name} Point of Sale</h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black text-orange-700">
            <Store className="h-4 w-4" />
            Outlet Utama
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
            Shift Aktif
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600">
            <Clock3 className="h-4 w-4" />
            Kasir DV
          </span>
        </div>
      </header>
      <section className="h-[calc(100vh-50px)] p-1.5 lg:h-[calc(100vh-76px)] lg:p-5">
        <div className="h-full overflow-hidden rounded-[14px] border border-orange-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:rounded-[22px]">
          <PosLayout subIndustrySlug={subIndustry.id} />
        </div>
      </section>
    </main>
  );
}
