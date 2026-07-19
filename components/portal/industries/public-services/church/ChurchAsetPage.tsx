"use client";
import { RoundedSelect } from "@/components/portal/ui";

import { Panel } from "@/components/portal/ui";
import { Building2, Plus, X, PackageCheck, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Asset = {
  id: string;
  name: string;
  type: string;
  location?: string | null;
  status: string;
};

type Stats = { total: number; tersedia: number; dipinjam: number; rusak: number };

const ASSET_TYPES = ["Room", "Item", "Kendaraan", "Elektronik", "Peralatan Ibadah", "Lainnya"];
const ASSET_STATUSES = ["Tersedia", "Dipinjam", "Rusak", "Dalam Perbaikan"];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    "Tersedia": "bg-emerald-50 text-emerald-600",
    "Dipinjam": "bg-amber-50 text-amber-600",
    "Rusak": "bg-rose-50 text-rose-600",
    "Dalam Perbaikan": "bg-slate-100 text-slate-500",
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

export function ChurchAsetPage({ currentTier }: { currentTier: string }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Room", location: "", status: "Tersedia" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([
      apiFetch("/api/tenant/church/church-assets"),
      apiFetch("/api/tenant/church/church-assets/stats"),
    ]).then(([a, s]) => { setAssets(a as Asset[]); setStats(s as Stats); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiFetch("/api/tenant/church/church-assets", {
        method: "POST", body: JSON.stringify(form),
      });
      setAssets(prev => [created as Asset, ...prev]);
      setShowForm(false);
      setForm({ name: "", type: "Room", location: "", status: "Tersedia" });
      apiFetch("/api/tenant/church/church-assets/stats").then(s => setStats(s as Stats)).catch(() => {});
    } catch { alert("Gagal menambahkan aset"); }
    finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updated = await apiFetch(`/api/tenant/church/church-assets/${id}`, {
        method: "PUT", body: JSON.stringify({ status }),
      });
      setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      apiFetch("/api/tenant/church/church-assets/stats").then(s => setStats(s as Stats)).catch(() => {});
    } catch { alert("Gagal update status"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus aset ini?")) return;
    try {
      await apiFetch(`/api/tenant/church/church-assets/${id}`, { method: "DELETE" });
      setAssets(prev => prev.filter(a => a.id !== id));
      apiFetch("/api/tenant/church/church-assets/stats").then(s => setStats(s as Stats)).catch(() => {});
    } catch { alert("Gagal menghapus aset"); }
  };

  const rooms = assets.filter(a => a.type === "Room");
  const items = assets.filter(a => a.type !== "Room");

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total Aset", value: stats?.total, color: "blue", icon: Layers },
          { label: "Tersedia", value: stats?.tersedia, color: "emerald", icon: PackageCheck },
          { label: "Dipinjam", value: stats?.dipinjam, color: "amber", icon: Building2 },
          { label: "Rusak", value: stats?.rusak, color: "rose", icon: X },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Panel key={s.label}>
              <div className="flex items-start gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-xl bg-${s.color}-50 text-${s.color}-600`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                  <h3 className="text-xl font-black text-[#172033]">{loading ? "…" : (s.value ?? 0)}</h3>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#172033]">Manajemen Aset & Fasilitas</h2>
              <p className="text-sm font-bold text-slate-500">Peminjaman Ruangan dan Inventaris Alat</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Aset
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-2xl border border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--portal-primary)]">Aset Baru</h3>
              <button onClick={() => setShowForm(false)} type="button" className="rounded-full p-1 hover:bg-white/50"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nama Aset *</span>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Main Hall, Proyektor..." />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jenis</span>
                <RoundedSelect value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lokasi</span>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Gedung A, Lantai 2..." />
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

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 p-4 space-y-2">
                <div className="h-5 w-40 rounded bg-slate-100" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Rooms */}
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Ruangan ({rooms.length})</h3>
              <div className="space-y-2">
                {rooms.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 text-center py-4">Belum ada ruangan</p>
                ) : rooms.map(a => (
                  <AssetRow key={a.id} asset={a} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Inventaris ({items.length})</h3>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-xs font-bold text-slate-400 text-center py-4">Belum ada inventaris</p>
                ) : items.map(a => (
                  <AssetRow key={a.id} asset={a} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function AssetRow({ asset, onStatusChange, onDelete }: {
  asset: Asset;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const statusBadgeClass = {
    "Tersedia": "bg-emerald-50 text-emerald-600",
    "Dipinjam": "bg-amber-50 text-amber-600",
    "Rusak": "bg-rose-50 text-rose-600",
    "Dalam Perbaikan": "bg-slate-100 text-slate-500",
  }[asset.status] || "bg-slate-100 text-slate-600";

  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-white hover:border-slate-300 transition-all">
      <div className="min-w-0">
        <h4 className="font-bold text-[#172033] truncate">{asset.name}</h4>
        {asset.location && <p className="text-[10px] font-bold text-slate-400">{asset.location}</p>}
      </div>
      <div className="flex items-center gap-2 ml-3">
        <RoundedSelect
          value={asset.status}
          onChange={e => onStatusChange(asset.id, e.target.value)}
          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase border-0 outline-none cursor-pointer ${statusBadgeClass}`}
        >
          {["Tersedia", "Dipinjam", "Rusak", "Dalam Perbaikan"].map(s => <option key={s} value={s}>{s}</option>)}
        </RoundedSelect>
        <button onClick={() => onDelete(asset.id)} type="button"
          className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


