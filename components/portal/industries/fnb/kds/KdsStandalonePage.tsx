"use client";

import { useEffect } from "react";
import { ArrowLeft, ChefHat, Clock3, MonitorCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { fnbSubIndustries } from "../config/subIndustries";
import { KdsLayout } from "./KdsLayout";

export function KdsStandalonePage({ subIndustrySlug = "cafe" }: { subIndustrySlug?: string }) {
  const router = useRouter();
  const subIndustry = fnbSubIndustries[subIndustrySlug] ?? fnbSubIndustries.cafe;

  useEffect(() => {
    document.documentElement.dataset.portalTheme = "omni";
    document.body.dataset.portalTheme = "omni";
  }, []);

  return (
    <main className="portal-theme-scope min-h-screen overflow-hidden bg-[#fff8f1] text-[#172033]">
      <header className="flex min-h-[50px] items-center justify-between gap-2 border-b border-orange-100/80 bg-white sm:bg-white/92 px-2.5 shadow-sm backdrop-blur-xl lg:min-h-[76px] lg:gap-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/portal/fnb/${subIndustry.id}`)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[var(--portal-primary)] hover:text-[var(--portal-primary)]"
            aria-label="Kembali ke dashboard F&B"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[var(--portal-primary)] text-white shadow-[0_14px_34px_rgba(249,115,22,0.26)]">
            <ChefHat className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase tracking-[0.2em] text-[var(--portal-primary)]">Omnia Kitchen Display</p>
            <h1 className="truncate text-xl font-black leading-tight text-[#172033]">{subIndustry.name} Kitchen Display</h1>
          </div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black text-orange-700">
            <MonitorCheck className="h-4 w-4" />
            Tablet Mode
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600">
            <Clock3 className="h-4 w-4" />
            Live Queue
          </span>
        </div>
      </header>
      <section className="h-[calc(100vh-76px)]">
        <KdsLayout standalone />
      </section>
    </main>
  );
}
