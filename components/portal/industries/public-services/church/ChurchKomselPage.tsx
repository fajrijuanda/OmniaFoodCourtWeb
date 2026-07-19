"use client";

import { Panel } from "@/components/portal/ui";
import { Users, Plus, X, MapPin, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type CellGroup = {
  id: string;
  name: string;
  leaderId?: string | null;
  schedule?: string | null;
  location?: string | null;
  members: Array<{ id: string; member: { id: string; fullName: string; status: string } }>;
};

export function ChurchKomselPage({ currentTier }: { currentTier: string }) {
  const isUnlocked = currentTier !== "starter";
  const [groups, setGroups] = useState<CellGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", schedule: "", location: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isUnlocked) { setLoading(false); return; }
    apiFetch("/api/tenant/church/church-cell-groups")
      .then(g => setGroups(g as CellGroup[])).catch(() => {}).finally(() => setLoading(false));
  }, [isUnlocked]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiFetch("/api/tenant/church/church-cell-groups", {
        method: "POST", body: JSON.stringify(form),
      });
      setGroups(prev => [...prev, { ...(created as any), members: [] }]);
      setShowForm(false);
      setForm({ name: "", schedule: "", location: "" });
    } catch { alert("Gagal membuat grup komsel"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus grup komsel ini?")) return;
    try {
      await apiFetch(`/api/tenant/church/church-cell-groups/${id}`, { method: "DELETE" });
      setGroups(prev => prev.filter(g => g.id !== id));
    } catch { alert("Gagal menghapus grup"); }
  };

  if (!isUnlocked) {
    return (
      <Panel>
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 text-slate-400">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-[#172033]">Modul Terkunci</h3>
          <p className="mt-2 text-sm text-slate-500">Manajemen Komsel tersedia mulai dari Tier Growth.</p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#172033]">Kelompok Sel (Komsel)</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" /> Buat Grup
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-2xl border border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--portal-primary)]">Komsel Baru</h3>
              <button onClick={() => setShowForm(false)} type="button" className="rounded-full p-1 hover:bg-white/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nama Komsel *</span>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Komsel Bethlehem" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jadwal</span>
                <input value={form.schedule} onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Jumat, 19:00 WIB" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lokasi</span>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Jl. Merdeka No. 12" />
              </label>
              <div className="sm:col-span-3 flex justify-end">
                <button type="submit" disabled={saving}
                  className="rounded-full bg-[var(--portal-primary)] px-6 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90 disabled:opacity-50">
                  {saving ? "Menyimpan…" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 p-4">
                <div className="h-5 w-40 rounded bg-slate-100 mb-3" />
                <div className="h-3 w-32 rounded bg-slate-100 mb-2" />
                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="py-12 text-center text-sm font-bold text-slate-400">
            Belum ada grup komsel. Klik &quot;Buat Grup&quot; untuk memulai.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map(g => (
              <div key={g.id} className="group rounded-xl border border-slate-200 p-4 hover:border-[var(--portal-primary)] hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <h4 className="font-black text-[#172033]">{g.name}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(g.id)} type="button"
                      className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 grid gap-1">
                  {g.schedule && (
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Calendar className="h-3 w-3" /> {g.schedule}
                    </p>
                  )}
                  {g.location && (
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MapPin className="h-3 w-3" /> {g.location}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Users className="h-3 w-3" /> {g.members.length} anggota
                  </p>
                </div>
                {g.members.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.members.slice(0, 4).map(m => (
                      <span key={m.id} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                        {m.member.fullName}
                      </span>
                    ))}
                    {g.members.length > 4 && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                        +{g.members.length - 4} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
