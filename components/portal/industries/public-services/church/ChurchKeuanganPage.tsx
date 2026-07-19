"use client";
import { RoundedSelect } from "@/components/portal/ui";

import { Panel } from "@/components/portal/ui";
import { HandCoins, Plus, X, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Donation = {
  id: string;
  amount: number;
  type: string;
  date: string;
  paymentMethod: string;
  notes?: string | null;
  member?: { id: string; fullName: string } | null;
};

type Summary = {
  totalAllTime: number;
  totalThisMonth: number;
  totalThisYear: number;
  byType: Array<{ type: string; _sum: { amount: number }; _count: { id: number } }>;
};

const DONATION_TYPES = ["Persepuluhan", "Kolekte", "Diakonia", "Pembangunan", "Misi", "Lainnya"];
const PAYMENT_METHODS = ["Cash", "QRIS", "Transfer"];

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    "Persepuluhan": "bg-emerald-50 text-emerald-600",
    "Kolekte": "bg-blue-50 text-blue-600",
    "Diakonia": "bg-orange-50 text-orange-600",
    "Pembangunan": "bg-amber-50 text-amber-600",
    "Misi": "bg-purple-50 text-purple-600",
  };
  return map[type] || "bg-slate-100 text-slate-600";
};

export function ChurchKeuanganPage({ currentTier }: { currentTier: string }) {
  const isPaymentGatewayUnlocked = currentTier === "pro" || currentTier === "enterprise";
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", type: "Kolekte", date: new Date().toISOString().slice(0, 10), paymentMethod: "Cash", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([
      apiFetch("/api/tenant/church/church-finances"),
      apiFetch("/api/tenant/church/church-finances/summary"),
    ]).then(([d, s]) => { setDonations(d as Donation[]); setSummary(s as Summary); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    setSaving(true);
    try {
      const created = await apiFetch("/api/tenant/church/church-finances", {
        method: "POST",
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      setDonations(prev => [(created as Donation), ...prev]);
      setShowForm(false);
      setForm({ amount: "", type: "Kolekte", date: new Date().toISOString().slice(0, 10), paymentMethod: "Cash", notes: "" });
      // refresh summary
      apiFetch("/api/tenant/church/church-finances/summary").then(s => setSummary(s as Summary)).catch(() => {});
    } catch { alert("Gagal mencatat donasi"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus catatan donasi ini?")) return;
    try {
      await apiFetch(`/api/tenant/church/church-finances/${id}`, { method: "DELETE" });
      setDonations(prev => prev.filter(d => d.id !== id));
      apiFetch("/api/tenant/church/church-finances/summary").then(s => setSummary(s as Summary)).catch(() => {});
    } catch { alert("Gagal menghapus donasi"); }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Panel>
          <p className="text-xs font-bold text-slate-500">Total Kas (Sepanjang Waktu)</p>
          <h3 className="mt-1 text-xl font-black text-[#172033]">
            {loading ? "…" : `Rp ${Number(summary?.totalAllTime ?? 0).toLocaleString("id-ID")}`}
          </h3>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <p className="text-xs font-bold text-slate-500">Pemasukan Bulan Ini</p>
          </div>
          <h3 className="mt-1 text-xl font-black text-emerald-600">
            {loading ? "…" : `+ Rp ${Number(summary?.totalThisMonth ?? 0).toLocaleString("id-ID")}`}
          </h3>
        </Panel>
        <Panel>
          <p className="text-xs font-bold text-slate-500">Total Tahun Ini</p>
          <h3 className="mt-1 text-xl font-black text-indigo-600">
            {loading ? "…" : `Rp ${Number(summary?.totalThisYear ?? 0).toLocaleString("id-ID")}`}
          </h3>
        </Panel>
      </div>

      {/* By Type Breakdown */}
      {summary && summary.byType.length > 0 && (
        <Panel>
          <h3 className="mb-4 font-black text-[#172033]">Rekap Per Jenis</h3>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {summary.byType.map(bt => (
              <div key={bt.type} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-black uppercase mb-1 ${typeBadge(bt.type)}`}>{bt.type}</span>
                  <p className="text-xs font-bold text-slate-500">{bt._count.id} transaksi</p>
                </div>
                <p className="font-black text-[#172033]">Rp {Number(bt._sum.amount ?? 0).toLocaleString("id-ID")}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-50 text-green-600">
              <HandCoins className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#172033]">Keuangan & Donasi</h2>
              <p className="text-sm font-bold text-slate-500">Pencatatan Persembahan, Kolekte, dan Kas</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" /> Catat Donasi
          </button>
        </div>

        {isPaymentGatewayUnlocked ? (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-emerald-700">Payment Gateway Aktif</h4>
                <p className="text-xs font-bold text-emerald-600">Sistem terhubung otomatis dengan QRIS dan Virtual Account.</p>
              </div>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700" type="button">
                Lihat Transaksi
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-black text-slate-700">Integrasi Payment Gateway Terkunci</h4>
            <p className="text-xs font-bold text-slate-500">Tingkatkan ke tier Business untuk rekonsiliasi donasi otomatis (QRIS/VA).</p>
          </div>
        )}

        {showForm && (
          <div className="mb-5 rounded-2xl border border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--portal-primary)]">Catat Donasi Baru</h3>
              <button onClick={() => setShowForm(false)} type="button" className="rounded-full p-1 hover:bg-white/50"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jumlah (Rp) *</span>
                <input required type="number" min={1} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="500000" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jenis</span>
                <RoundedSelect value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  {DONATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tanggal</span>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Metode Bayar</span>
                <RoundedSelect value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Keterangan</span>
                <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Ibadah Minggu, 1 Juni..." />
              </label>
              <div className="flex items-end">
                <button type="submit" disabled={saving}
                  className="w-full rounded-full bg-[var(--portal-primary)] px-6 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90 disabled:opacity-50">
                  {saving ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3 hidden sm:table-cell">Metode</th>
                <th className="px-4 py-3 hidden md:table-cell">Tanggal</th>
                <th className="px-4 py-3 hidden lg:table-cell">Keterangan</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 w-20 rounded bg-slate-100" /></td>)}
                    <td className="px-4 py-3" />
                  </tr>
                ))
              ) : donations.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm font-bold text-slate-400">Belum ada catatan donasi.</td></tr>
              ) : donations.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${typeBadge(d.type)}`}>{d.type}</span>
                  </td>
                  <td className="px-4 py-3 font-black text-emerald-600">Rp {Number(d.amount).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs font-bold">{d.paymentMethod}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs font-bold">
                    {new Date(d.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden lg:table-cell text-xs">{d.notes || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(d.id)} type="button"
                      className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}


