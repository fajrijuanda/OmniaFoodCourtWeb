"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Home, Menu, ShieldCheck, Smartphone, Sparkles, Bell, User } from "lucide-react";
import { mobileAppCatalog, mobileNavItems } from "@/lib/mobile/mobileDefaults";

const statusStyles: Record<string, string> = {
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  locked: "border-amber-200 bg-amber-50 text-amber-700",
  coming_soon: "border-slate-200 bg-slate-100 text-slate-600"
};

const navIcons = {
  hris: Home,
  cafe: Menu,
  catalog: Sparkles,
  notifications: Bell,
  profile: User
};

export function MobileShell() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(236,240,248,0.92)_42%,_rgba(229,231,235,1)_100%)] px-4 py-4 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[460px] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur">
        <header className="border-b border-slate-200/80 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-slate-500">Omnia Mobile</p>
              <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950">Foundation Shell</h1>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure session ready for tenant and branch context
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                Active tenant<br />Omnia Demo Tenant
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                Active branch<br />Head Office
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 space-y-4 px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-slate-500">App catalog</p>
              <h2 className="mt-1 text-lg font-black tracking-tight">Ready for HRIS and Cafe</h2>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.7rem] font-bold text-emerald-700">Phase 1</span>
          </div>

          <div className="grid gap-3">
            {mobileAppCatalog.map((app) => (
              <article key={app.key} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">{app.key}</p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">{app.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{app.subtitle}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] ${statusStyles[app.status]}`}>
                    {app.status.replace("_", " ")}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Shared mobile states
            </div>
            <div className="grid gap-2 text-sm text-slate-600">
              <p>Loading, empty, offline, maintenance, and forbidden states are handled in the shell.</p>
              <p>Deep links, secure storage, push, and lifecycle hooks are prepared in the next slice.</p>
            </div>
          </div>
        </section>

        <nav className="border-t border-slate-200/80 bg-white px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            {mobileNavItems.map((item) => {
              const Icon = navIcons[item.key];
              const active = item.key === "hris";
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-bold transition ${
                    active ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </main>
  );
}
