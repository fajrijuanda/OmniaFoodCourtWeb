"use client";
import { RoundedSelect } from "@/components/portal/ui";

import { Panel } from "@/components/portal/ui";
import { Users, Search, Plus, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Member = {
  id: string;
  fullName: string;
  phoneNumber?: string | null;
  gender?: string | null;
  status: string;
  dob?: string | null;
  address?: string | null;
};

type Stats = { total: number; tetap: number; simpatisan: number; male: number; female: number };

export function ChurchJemaatPage({ currentTier }: { currentTier: string }) {
  const isFamilyTreeUnlocked = currentTier !== "starter";
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", gender: "Male", phoneNumber: "", status: "Simpatisan", dob: "", address: "" });
  const [saving, setSaving] = useState(false);

  const load = async (q = "") => {
    setLoading(true);
    try {
      const [membersRes, statsRes] = await Promise.all([
        apiFetch(`/api/tenant/church/church-members${q ? `?search=${encodeURIComponent(q)}` : ""}`),
        apiFetch("/api/tenant/church/church-members/stats"),
      ]);
      setMembers(membersRes as Member[]);
      setStats(statsRes as Stats);
    } catch {
      // fallback - keep existing state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(search);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiFetch("/api/tenant/church/church-members", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setMembers(prev => [(created as Member), ...prev]);
      setShowForm(false);
      setFormData({ fullName: "", gender: "Male", phoneNumber: "", status: "Simpatisan", dob: "", address: "" });
      if (stats) setStats({ ...stats, total: stats.total + 1, [formData.status === "Jemaat Tetap" ? "tetap" : "simpatisan"]: (stats[formData.status === "Jemaat Tetap" ? "tetap" : "simpatisan"]) + 1 });
    } catch (err) {
      alert("Gagal menyimpan data jemaat");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data jemaat ini?")) return;
    try {
      await apiFetch(`/api/tenant/church/church-members/${id}`, { method: "DELETE" });
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch {
      alert("Gagal menghapus data");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[
          { label: "Total Jemaat", value: stats?.total ?? "-", color: "blue" },
          { label: "Jemaat Tetap", value: stats?.tetap ?? "-", color: "emerald" },
          { label: "Simpatisan", value: stats?.simpatisan ?? "-", color: "amber" },
          { label: "Pria", value: stats?.male ?? "-", color: "indigo" },
          { label: "Wanita", value: stats?.female ?? "-", color: "rose" },
        ].map(s => (
          <Panel key={s.label}>
            <div className="flex items-start gap-3">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-${s.color}-50 text-${s.color}-600`}>
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                <h3 className="text-xl font-black text-[#172033]">{loading ? "…" : s.value}</h3>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Main Table */}
      <Panel>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black text-[#172033]">Database Jemaat</h2>
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama..."
                  className="w-44 rounded-full border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white"
                />
              </div>
            </form>
            <button
              onClick={() => apiFetch("/api/tenant/church/church-members").then(d => {
                const csv = ["Nama,Telepon,Status,Gender", ...(d as Member[]).map((m: Member) => `${m.fullName},${m.phoneNumber ?? ""},${m.status},${m.gender ?? ""}`)].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "jemaat.csv"; a.click();
              })}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200"
              type="button"
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90"
              type="button"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Jemaat
            </button>
          </div>
        </div>

        {/* Add Form Inline */}
        {showForm && (
          <div className="mb-5 rounded-2xl border border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--portal-primary)]">Tambah Jemaat Baru</h3>
              <button onClick={() => setShowForm(false)} type="button" className="rounded-full p-1 hover:bg-white/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nama Lengkap *</span>
                <input required value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" placeholder="Budi Santoso" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">No. Telepon</span>
                <input value={formData.phoneNumber} onChange={e => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" placeholder="08xx" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tanggal Lahir</span>
                <input type="date" value={formData.dob} onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Gender</span>
                <RoundedSelect value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  <option value="Male">Pria</option>
                  <option value="Female">Wanita</option>
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Status</span>
                <RoundedSelect value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  <option value="Simpatisan">Simpatisan</option>
                  <option value="Jemaat Tetap">Jemaat Tetap</option>
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Alamat</span>
                <input value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" placeholder="Jl. ..." />
              </label>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" disabled={saving}
                  className="rounded-full bg-[var(--portal-primary)] px-6 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90 disabled:opacity-50">
                  {saving ? "Menyimpan…" : "Simpan Jemaat"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama Lengkap</th>
                <th className="px-4 py-3 hidden sm:table-cell">No. Telepon</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Gender</th>
                {isFamilyTreeUnlocked && <th className="px-4 py-3 hidden lg:table-cell">Family Tree</th>}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-slate-100" /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-28 rounded bg-slate-100" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-slate-100" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-12 rounded bg-slate-100" /></td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm font-bold text-slate-400">
                    Belum ada data jemaat. Klik &quot;Tambah Jemaat&quot; untuk mulai.
                  </td>
                </tr>
              ) : members.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#172033]">{m.fullName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{m.phoneNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${m.status === "Jemaat Tetap" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs font-bold">{m.gender ?? "—"}</td>
                  {isFamilyTreeUnlocked && (
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button className="flex items-center gap-1 text-[10px] font-bold text-[var(--portal-primary)] hover:underline" type="button">
                        Lihat Keluarga <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(m.id)} type="button"
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


