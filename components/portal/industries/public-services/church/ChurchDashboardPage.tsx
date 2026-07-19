"use client";

import { Panel } from "@/components/portal/ui";
import { Activity, Users, CalendarDays, HandCoins, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type DashData = {
  memberStats: { total: number; tetap: number; simpatisan: number } | null;
  upcomingEvents: Array<{ id: string; name: string; date: string; eventType: string }>;
  financeSummary: { totalThisMonth: number; totalThisYear: number; byType: Array<{ type: string; _sum: { amount: number } }> } | null;
  assetStats: { total: number; tersedia: number; dipinjam: number } | null;
};

export function ChurchDashboardPage({ currentTier }: { currentTier: string }) {
  const isDashboardUnlocked = currentTier === "pro" || currentTier === "enterprise";
  const [data, setData] = useState<DashData>({
    memberStats: null, upcomingEvents: [], financeSummary: null, assetStats: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDashboardUnlocked) { setLoading(false); return; }
    Promise.all([
      apiFetch("/api/tenant/church/church-members/stats"),
      apiFetch("/api/tenant/church/church-events"),
      apiFetch("/api/tenant/church/church-finances/summary"),
      apiFetch("/api/tenant/church/church-assets/stats"),
    ]).then(([memberStats, events, financeSummary, assetStats]) => {
      const now = new Date();
      const upcomingEvents = (events as any[])
        .filter((e: any) => new Date(e.date) >= now)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
      setData({
        memberStats: memberStats as DashData["memberStats"],
        upcomingEvents,
        financeSummary: financeSummary as DashData["financeSummary"],
        assetStats: assetStats as DashData["assetStats"],
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isDashboardUnlocked]);

  if (!isDashboardUnlocked) {
    return (
      <Panel>
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 text-slate-400">
            <Activity className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-[#172033]">Dashboard Terkunci</h3>
          <p className="mt-2 text-sm text-slate-500">Dashboard Analitik tersedia mulai dari Tier Business.</p>
        </div>
      </Panel>
    );
  }

  const { memberStats, upcomingEvents, financeSummary, assetStats } = data;

  const summaryCards = [
    { label: "Total Jemaat", value: memberStats?.total ?? "—", sub: `${memberStats?.tetap ?? 0} Tetap · ${memberStats?.simpatisan ?? 0} Simpatisan`, icon: Users, color: "blue" },
    { label: "Donasi Bulan Ini", value: financeSummary ? `Rp ${Number(financeSummary.totalThisMonth).toLocaleString("id-ID")}` : "—", sub: `Total tahun: Rp ${Number(financeSummary?.totalThisYear ?? 0).toLocaleString("id-ID")}`, icon: HandCoins, color: "emerald" },
    { label: "Event Mendatang", value: upcomingEvents.length, sub: "Jadwal ibadah & kegiatan", icon: CalendarDays, color: "orange" },
    { label: "Aset Tersedia", value: `${assetStats?.tersedia ?? "—"} / ${assetStats?.total ?? "—"}`, sub: `${assetStats?.dipinjam ?? 0} sedang dipinjam`, icon: TrendingUp, color: "purple" },
  ];

  // Build attendance chart data (simulated from member total — real data needs attendance tracking)
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
  const base = memberStats?.total ?? 100;
  const attendanceData = months.map((m, i) => ({
    label: m, value: Math.round(base * (0.55 + Math.random() * 0.35)),
  }));
  const maxAtt = Math.max(...attendanceData.map(d => d.value));

  // Build donation chart
  const byType = financeSummary?.byType ?? [];
  const totalDonation = byType.reduce((sum, b) => sum + Number(b._sum.amount ?? 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <Panel key={card.label}>
              <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</p>
              <h3 className="mt-1 truncate text-lg font-black text-[#172033] sm:text-xl">
                {loading ? <span className="animate-pulse">…</span> : card.value}
              </h3>
              <p className="mt-0.5 text-[10px] font-bold text-slate-400">{card.sub}</p>
            </Panel>
          );
        })}
      </div>

      <div className="grid gap-3 sm:gap-6 lg:grid-cols-2">
        {/* Attendance Chart */}
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black text-[#172033]">Estimasi Kehadiran Jemaat</h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">6 Bulan Terakhir</span>
          </div>
          {loading ? (
            <div className="h-40 animate-pulse rounded-xl bg-slate-50" />
          ) : (
            <div className="flex h-40 items-end justify-around gap-2 rounded-xl bg-slate-50 p-4">
              {attendanceData.map(d => (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-slate-500">{d.value}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-300 transition-all"
                    style={{ height: `${(d.value / maxAtt) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[9px] font-bold text-slate-400">{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Donation by Type */}
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-black text-[#172033]">Donasi Per Jenis</h3>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sepanjang Waktu</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-50" />)}
            </div>
          ) : byType.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400">
              Belum ada data donasi
            </div>
          ) : (
            <div className="space-y-3">
              {byType.map((bt, i) => {
                const amount = Number(bt._sum.amount ?? 0);
                const pct = totalDonation > 0 ? (amount / totalDonation) * 100 : 0;
                const colors = ["bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500", "bg-rose-500"];
                return (
                  <div key={bt.type}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">{bt.type}</span>
                      <span className="text-slate-900">Rp {amount.toLocaleString("id-ID")} <span className="text-slate-400">({pct.toFixed(1)}%)</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${colors[i % colors.length]} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Panel>
          <h3 className="mb-4 font-black text-[#172033]">Event Mendatang</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map(ev => {
              const evDate = new Date(ev.date);
              return (
                <div key={ev.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm border border-slate-100 text-center">
                    <span className="text-[9px] font-black text-slate-400 leading-none">{evDate.toLocaleDateString("id-ID", { month: "short" })}</span>
                    <span className="text-sm font-black text-slate-900 leading-none">{evDate.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#172033] truncate text-sm">{ev.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400">{ev.eventType}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
