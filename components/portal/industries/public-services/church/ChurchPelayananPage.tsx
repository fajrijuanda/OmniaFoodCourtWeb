"use client";
import { RoundedSelect } from "@/components/portal/ui";

import { Panel } from "@/components/portal/ui";
import { Briefcase, Plus, X, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type VolunteerSchedule = {
  id: string;
  role: string;
  status: string;
  member: { id: string; fullName: string };
  event: { id: string; name: string; date: string; eventType: string };
};

type Event = { id: string; name: string; date: string; eventType: string };
type Member = { id: string; fullName: string };

export function ChurchPelayananPage({ currentTier }: { currentTier: string }) {
  const isAutoSchedulingUnlocked = currentTier === "pro" || currentTier === "enterprise";
  const [schedules, setSchedules] = useState<VolunteerSchedule[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eventId: "", memberId: "", role: "Worship Leader" });
  const [saving, setSaving] = useState(false);

  const ROLES = ["Worship Leader", "Singer", "Keyboard", "Guitar", "Drum", "Bass", "Usher", "Multimedia", "Parkir", "Doa"];

  useEffect(() => {
    Promise.all([
      apiFetch<Event[]>("/api/tenant/church/church-events"),
      apiFetch<Member[]>("/api/tenant/church/church-members"),
    ]).then(([ev, mem]) => {
      setEvents(ev);
      setMembers(mem);
      // Aggregate volunteer schedules from all events
      const allSchedules: VolunteerSchedule[] = ev.flatMap((e: any) =>
        (e.volunteerSchedules ?? []).map((vs: any) => ({ ...vs, event: { id: e.id, name: e.name, date: e.date, eventType: e.eventType } }))
      );
      setSchedules(allSchedules as VolunteerSchedule[]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventId || !form.memberId) return;
    setSaving(true);
    try {
      const created = await apiFetch(`/api/tenant/church/church-events/${form.eventId}/volunteers`, {
        method: "POST",
        body: JSON.stringify({ memberId: form.memberId, role: form.role }),
      });
      const event = events.find(ev => ev.id === form.eventId)!;
      const member = members.find(m => m.id === form.memberId)!;
      setSchedules(prev => [{ ...(created as VolunteerSchedule), event, member }, ...prev]);
      setShowForm(false);
    } catch { alert("Gagal menambahkan jadwal"); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id: string, eventId: string, status: string) => {
    try {
      await apiFetch(`/api/tenant/church/church-events/volunteers/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setSchedules(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch { alert("Gagal update status"); }
  };

  const removeSchedule = async (id: string) => {
    if (!confirm("Hapus jadwal ini?")) return;
    try {
      await apiFetch(`/api/tenant/church/church-events/volunteers/${id}`, { method: "DELETE" });
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch { alert("Gagal menghapus jadwal"); }
  };

  const statusBadge = (status: string) => {
    if (status === "Confirmed") return "bg-emerald-50 text-emerald-600";
    if (status === "Declined") return "bg-rose-50 text-rose-600";
    return "bg-amber-50 text-amber-600";
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#172033]">Jadwal Pelayanan</h2>
              <p className="text-sm font-bold text-slate-500">Penjadwalan Relawan dan Petugas Ibadah</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Jadwal
          </button>
        </div>

        {!isAutoSchedulingUnlocked && (
          <div className="mb-5 rounded-xl border border-dashed border-purple-200 bg-purple-50 p-4">
            <h4 className="text-sm font-black text-purple-700">Tingkatkan ke Business</h4>
            <p className="text-xs font-bold text-purple-600">Gunakan fitur Auto-Scheduling untuk membuat jadwal relawan secara otomatis tanpa bentrok.</p>
          </div>
        )}

        {isAutoSchedulingUnlocked && (
          <div className="mb-5 flex justify-end">
            <button className="rounded-full bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700" type="button">
              ✨ Auto-Generate Schedule
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-5 rounded-2xl border border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--portal-primary)]">Tambah Jadwal Pelayanan</h3>
              <button onClick={() => setShowForm(false)} type="button" className="rounded-full p-1 hover:bg-white/50"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Event *</span>
                <RoundedSelect value={form.eventId} onChange={e => setForm(p => ({ ...p, eventId: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  <option value="">Pilih Event</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name} — {new Date(ev.date).toLocaleDateString("id-ID")}</option>)}
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Petugas *</span>
                <RoundedSelect value={form.memberId} onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  <option value="">Pilih Jemaat</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tugas / Peran</span>
                <RoundedSelect value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </RoundedSelect>
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
                <th className="px-4 py-3">Tugas</th>
                <th className="px-4 py-3">Nama Petugas</th>
                <th className="px-4 py-3 hidden sm:table-cell">Event</th>
                <th className="px-4 py-3 hidden md:table-cell">Tanggal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 w-24 rounded bg-slate-100" /></td>)}
                    <td className="px-4 py-3" />
                  </tr>
                ))
              ) : schedules.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm font-bold text-slate-400">Belum ada jadwal pelayanan.</td></tr>
              ) : schedules.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#172033]">{s.role}</td>
                  <td className="px-4 py-3 text-slate-600">{s.member?.fullName ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{s.event?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs font-bold">
                    {s.event?.date ? new Date(s.event.date).toLocaleDateString("id-ID") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {s.status !== "Confirmed" && (
                        <button onClick={() => updateStatus(s.id, s.event?.id, "Confirmed")} type="button" title="Konfirmasi"
                          className="rounded-full p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {s.status !== "Pending" && (
                        <button onClick={() => updateStatus(s.id, s.event?.id, "Pending")} type="button" title="Set Pending"
                          className="rounded-full p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                          <Clock className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => removeSchedule(s.id)} type="button"
                        className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
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


