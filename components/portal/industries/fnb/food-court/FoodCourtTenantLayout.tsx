"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, WalletCards, BadgePercent, BarChart3, RefreshCcw, Search, Plus, X } from "lucide-react";
import { RoundedSelect } from "@/components/portal/ui";
import type { LucideIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";

type ModuleKey = "tenant-management" | "tenant-settlement" | "promo-rules" | "admin-tenant-dashboard";

type PromoRule = { id: string; name: string; tenant: string; type: string; status: string; period?: string };
type FoodCourtTenant = { id: string; name: string; status: string; commission: number; categoryName?: string | null };
type TenantSettlement = { id: string; tenantId: string; tenantName: string; status: string; commission: number; sales: number; settlement: number; period: string };
type OperationsSnapshot = {
  promoRules: PromoRule[];
  foodCourtTenants: FoodCourtTenant[];
  tenantSettlements: TenantSettlement[];
};

const moduleMeta: Record<ModuleKey, { title: string; eyebrow: string; caption: string; icon: LucideIcon; primary: string; secondary: string }> = {
  "tenant-management": { title: "Tenant Management", eyebrow: "Food court", caption: "Kelola tenant food court, kategori, commission, dan status operasional.", icon: Users, primary: "Tenant aktif", secondary: "Avg commission" },
  "tenant-settlement": { title: "Tenant Settlement", eyebrow: "Food court", caption: "Rekap settlement tenant berdasarkan transaksi dan pembagian revenue.", icon: WalletCards, primary: "Settlement", secondary: "Tenant paid" },
  "promo-rules": { title: "Promo Rules", eyebrow: "Food court", caption: "Atur promo per tenant dan periode campaign.", icon: BadgePercent, primary: "Promo aktif", secondary: "Tenant ikut" },
  "admin-tenant-dashboard": { title: "Admin Tenant Dashboard", eyebrow: "Food court", caption: "Pantau performa tenant, settlement, dan promo dari satu dashboard.", icon: BarChart3, primary: "Tenant sales", secondary: "Top tenant" },
};

function rupiah(value: number) {
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
}

function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const start = (normalizedPage - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), totalPages, normalizedPage };
}

function Pagination({ page, totalPages, totalRows, pageSize, setPage }: { page: number; totalPages: number; totalRows: number; pageSize: number; setPage: (value: number) => void }) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalRows, page * pageSize);
  return (
    <div className="flex flex-col items-center gap-3 border-t border-slate-100 px-4 py-4 text-xs font-black text-slate-500">
      <span>Menampilkan {start}-{end} dari {totalRows} data</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 disabled:opacity-40">{"<"}</button>
        <span className="min-w-16 text-center">{page} / {totalPages}</span>
        <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 disabled:opacity-40">{">"}</button>
      </div>
    </div>
  );
}

export function FoodCourtTenantLayout({ moduleKey, subIndustryName = "Food Court" }: { moduleKey: ModuleKey; subIndustryName?: string }) {
  const meta = moduleMeta[moduleKey];
  const [operations, setOperations] = useState<OperationsSnapshot>({ promoRules: [], foodCourtTenants: [], tenantSettlements: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({ name: "", tenant: "", type: "" });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      setOperations(await apiFetch<OperationsSnapshot>("/fnb/operations/snapshot"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const settlements = operations.tenantSettlements || [];
  const tenants = operations.foodCourtTenants || [];

  const rows = useMemo(() => {
    if (moduleKey === "tenant-management" || moduleKey === "tenant-settlement" || moduleKey === "admin-tenant-dashboard") {
      if (moduleKey === "tenant-management") {
        return tenants.map((tenant) => ({ id: tenant.id, cells: [tenant.name, tenant.status, `${tenant.commission}%`, tenant.categoryName ?? "-", "-"] }));
      }
      return settlements.map((settlement) => ({ id: settlement.id, cells: [settlement.tenantName, settlement.status, `${settlement.commission}%`, rupiah(settlement.sales), rupiah(settlement.settlement)] }));
    }
    if (moduleKey === "promo-rules") {
      return (operations.promoRules || []).map((promo) => ({ id: promo.id, cells: [promo.name, promo.tenant, promo.type, promo.status, promo.period ?? "-"] }));
    }
    return [];
  }, [moduleKey, operations, settlements, tenants]);

  const filteredRows = rows.filter((row) => {
    const haystack = row.cells.join(" ").toLowerCase();
    const queryMatch = haystack.includes(query.toLowerCase());
    const statusMatch = statusFilter === "all" || haystack.includes(statusFilter.toLowerCase());
    return queryMatch && statusMatch;
  });
  
  const pagination = paginate(filteredRows, page, pageSize);
  
  const headers = moduleKey.includes("tenant") || moduleKey === "admin-tenant-dashboard"
    ? ["Tenant", "Status", "Commission", "Sales", "Settlement"]
    : moduleKey === "promo-rules"
      ? ["Promo", "Tenant", "Tipe", "Status", "Periode"]
      : ["Program", "Audiens", "Benefit", "Status", "Impact"];

  const kpis = [
    { label: meta.primary, value: moduleKey.includes("tenant") ? String(tenants.length) : String(filteredRows.length), icon: meta.icon, delta: "+15%", caption: "vs minggu lalu" },
    { label: meta.secondary, value: moduleKey.includes("settlement") ? rupiah(settlements.reduce((sum, settlement) => sum + settlement.settlement, 0)) : moduleKey === "promo-rules" ? String(new Set((operations.promoRules || []).map((row) => row.tenant)).size) : String(tenants.length), icon: BarChart3, delta: "+8.2%", caption: "vs minggu lalu" },
  ];

  const savePromo = async () => {
    if (!promoForm.name.trim()) return;
    await apiFetch("/fnb/operations/promo-rules", { method: "POST", body: JSON.stringify(promoForm) });
    setPromoForm({ name: "", tenant: "", type: "" });
    await loadData();
    setModalOpen(false);
  };

  return (
    <div className="min-h-full space-y-4 bg-[#fffaf5] p-3 pb-4 sm:p-5 lg:p-6">
      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">{meta.eyebrow}</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-3xl">{meta.title}</h1>
            <p className="mt-1 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">{subIndustryName} - {meta.caption}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadData} type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-black text-[#172033] sm:h-11 sm:text-sm">
              <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            {moduleKey === "promo-rules" && (
              <button onClick={() => setModalOpen(true)} type="button" className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 text-xs font-black text-[var(--portal-on-primary)] sm:h-11 sm:text-sm">
                <Plus className="h-4 w-4" /> Tambah promo
              </button>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[18px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">
          {error}
        </div>
      )}

      <div className="grid gap-2 lg:gap-4 grid-cols-2 lg:grid-cols-2">
        {kpis.map(({ label, value, icon: Icon, delta, caption }) => (
          <article key={label} className="relative min-h-[90px] lg:min-h-[150px] rounded-[16px] lg:rounded-[24px] border border-slate-100 bg-white p-3 lg:p-6 shadow-sm">
            <p className="text-[9px] sm:text-[11px] lg:text-sm font-black text-slate-500 line-clamp-1 pr-6 lg:pr-0">{label}</p>
            <span className="absolute right-2.5 top-2.5 lg:right-5 lg:top-5 grid h-6 w-6 lg:h-11 lg:w-11 place-items-center rounded-[8px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <Icon className="h-3 w-3 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-3 sm:mt-5 lg:mt-8 text-base sm:text-lg lg:text-3xl font-black text-[#07142d] truncate">{value}</p>
            <div className="mt-1.5 sm:mt-2 lg:mt-3 flex flex-wrap items-center gap-1 lg:gap-2">
              <span className={`rounded-full px-1.5 py-0.5 lg:px-3 lg:py-1 text-[8px] lg:text-xs font-black ${String(delta).startsWith("-") ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="text-[8px] lg:text-xs font-bold text-slate-400 hidden lg:inline">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[16px] border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[24px] sm:p-5">
        <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_160px_130px]">
          <div className="flex h-11 items-center gap-2 rounded-[16px] border border-slate-200 bg-white px-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari data..." className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400 min-w-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:contents">
            <RoundedSelect value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="w-full text-xs sm:text-sm">
              <option value="all">Semua status</option>
              <option value="aktif">Aktif</option>
            </RoundedSelect>
            <RoundedSelect value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="w-full text-xs sm:text-sm">
              {[5, 10, 20].map((size) => <option key={size} value={size}>{size} / halaman</option>)}
            </RoundedSelect>
          </div>
        </div>
        <div className="overflow-hidden rounded-[14px] border border-slate-100 sm:rounded-[18px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full text-left text-xs sm:min-w-[760px] sm:text-sm lg:min-w-[860px]">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
                <tr>{headers.map((header) => <th key={header} className="px-3 py-3 sm:px-5 sm:py-4">{header}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.rows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {row.cells.map((cell: any, index: number) => (
                      <td key={`${row.id}-${index}`} className={`px-3 py-3 sm:px-5 sm:py-4 ${index === 0 ? "font-black text-[#172033]" : "font-bold text-slate-600"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && <div className="p-8 text-center text-sm font-black text-slate-500">Data belum tersedia untuk filter ini.</div>}
          <Pagination page={pagination.normalizedPage} totalPages={pagination.totalPages} totalRows={filteredRows.length} pageSize={pageSize} setPage={setPage} />
        </div>
      </section>

      {modalOpen && moduleKey === "promo-rules" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[18px] bg-white p-4 shadow-2xl sm:rounded-[24px] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-[#172033]">Tambah promo</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{meta.title}</p>
              </div>
              <button onClick={() => setModalOpen(false)} type="button" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <input value={promoForm.name} onChange={(event) => setPromoForm((value) => ({ ...value, name: event.target.value }))} className="w-full rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none" placeholder="Nama promo" />
              <input value={promoForm.tenant} onChange={(event) => setPromoForm((value) => ({ ...value, tenant: event.target.value }))} className="w-full rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none" placeholder="Tenant" />
              <input value={promoForm.type} onChange={(event) => setPromoForm((value) => ({ ...value, type: event.target.value }))} className="w-full rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none" placeholder="Tipe benefit" />
              <button onClick={savePromo} type="button" className="min-h-[42px] w-full rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] sm:py-3">Simpan promo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
