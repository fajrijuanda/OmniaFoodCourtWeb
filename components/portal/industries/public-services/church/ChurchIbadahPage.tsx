"use client";
import { RoundedSelect } from "@/components/portal/ui";

import { Panel } from "@/components/portal/ui";
import { CalendarDays, Plus, X, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type ChurchEvent = {
  id: string;
  name: string;
  eventType: string;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  volunteerSchedules: any[];
};

const EVENT_TYPES = ["Ibadah Raya", "Ibadah Komsel", "Seminar", "Retreat", "Konser Pujian", "Doa Bersama", "Lainnya"];

const eventTypeBadge = (type: string) => {
  const map: Record<string, string> = {
    "Ibadah Raya": "bg-orange-50 text-orange-600",
    "Ibadah Komsel": "bg-blue-50 text-blue-600",
    "Seminar": "bg-purple-50 text-purple-600",
    "Retreat": "bg-emerald-50 text-emerald-600",
    "Konser Pujian": "bg-rose-50 text-rose-600",
  };
  return map[type] || "bg-slate-100 text-slate-600";
};

export function ChurchIbadahPage({ currentTier }: { currentTier: string }) {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", eventType: "Ibadah Raya", date: "", startTime: "", endTime: "", location: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/api/tenant/church/church-events")
      .then(e => setEvents(e as ChurchEvent[])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiFetch("/api/tenant/church/church-events", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          startTime: form.startTime ? `${form.date}T${form.startTime}:00` : undefined,
          endTime: form.endTime ? `${form.date}T${form.endTime}:00` : undefined,
        }),
      });
      setEvents(prev => [{ ...(created as ChurchEvent), volunteerSchedules: [] }, ...prev]);
      setShowForm(false);
      setForm({ name: "", eventType: "Ibadah Raya", date: "", startTime: "", endTime: "", location: "" });
    } catch { alert("Gagal membuat jadwal ibadah"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    try {
      await apiFetch(`/api/tenant/church/church-events/${id}`, { method: "DELETE" });
      setEvents(prev => prev.filter(ev => ev.id !== id));
    } catch { alert("Gagal menghapus event"); }
  };

  const upcoming = events.filter(ev => new Date(ev.date) >= new Date());
  const past = events.filter(ev => new Date(ev.date) < new Date());

  return (
    <div className="space-y-6">
      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-orange-600">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#172033]">Jadwal Ibadah & Event</h2>
              <p className="text-sm font-bold text-slate-500">Ibadah Raya dan Acara Spesial</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90"
            type="button"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Event
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-2xl border border-[var(--portal-primary)] bg-[var(--portal-primary-soft)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--portal-primary)]">Event / Ibadah Baru</h3>
              <button onClick={() => setShowForm(false)} type="button" className="rounded-full p-1 hover:bg-white/50"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nama Event *</span>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Ibadah Raya Minggu" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jenis Event</span>
                <RoundedSelect value={form.eventType} onChange={e => setForm(p => ({ ...p, eventType: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]">
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </RoundedSelect>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tanggal *</span>
                <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jam Mulai</span>
                <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jam Selesai</span>
                <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lokasi</span>
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  placeholder="Main Hall" />
              </label>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button type="submit" disabled={saving}
                  className="rounded-full bg-[var(--portal-primary)] px-6 py-2 text-xs font-bold text-[var(--portal-on-primary)] hover:opacity-90 disabled:opacity-50">
                  {saving ? "Menyimpan…" : "Simpan Event"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 p-4">
                <div className="h-5 w-40 rounded bg-slate-100 mb-3" />
                <div className="h-3 w-32 rounded bg-slate-100 mb-2" />
                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Mendatang ({upcoming.length})</h3>
                <div className="mb-6 grid gap-3 md:grid-cols-2">
                  {upcoming.map(ev => (
                    <EventCard key={ev.id} event={ev} onDelete={handleDelete} />
                  ))}
                </div>
              </>
            )}
            {past.length > 0 && (
              <>
                <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">Selesai ({past.length})</h3>
                <div className="grid gap-3 md:grid-cols-2 opacity-60">
                  {past.slice(0, 4).map(ev => (
                    <EventCard key={ev.id} event={ev} onDelete={handleDelete} />
                  ))}
                </div>
              </>
            )}
            {events.length === 0 && (
              <div className="py-12 text-center text-sm font-bold text-slate-400">
                Belum ada jadwal ibadah. Klik &quot;Tambah Event&quot; untuk memulai.
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}

function EventCard({ event, onDelete }: { event: ChurchEvent; onDelete: (id: string) => void }) {
  const eventDate = new Date(event.date);
  const badge = {
    "Ibadah Raya": "bg-orange-50 text-orange-600",
    "Ibadah Komsel": "bg-blue-50 text-blue-600",
    "Seminar": "bg-purple-50 text-purple-600",
    "Retreat": "bg-emerald-50 text-emerald-600",
    "Konser Pujian": "bg-rose-50 text-rose-600",
  }[event.eventType] || "bg-slate-100 text-slate-600";

  return (
    <div className="group rounded-xl border border-slate-200 p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm border border-slate-100 text-center">
            <span className="text-[10px] font-black text-slate-500 leading-none">{eventDate.toLocaleDateString("id-ID", { month: "short" })}</span>
            <span className="text-sm font-black text-slate-900 leading-none">{eventDate.getDate()}</span>
          </div>
          <div>
            <h4 className="font-black text-[#172033]">{event.name}</h4>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${badge}`}>{event.eventType}</span>
          </div>
        </div>
        <button onClick={() => onDelete(event.id)} type="button"
          className="mt-0.5 rounded-full p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-3 grid gap-1">
        {event.startTime && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Clock className="h-3 w-3" />
            {new Date(event.startTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            {event.endTime && ` — ${new Date(event.endTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        )}
        {event.location && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <MapPin className="h-3 w-3" /> {event.location}
          </p>
        )}
        {event.volunteerSchedules?.length > 0 && (
          <p className="text-[10px] font-bold text-slate-400">{event.volunteerSchedules.length} petugas terjadwal</p>
        )}
      </div>
    </div>
  );
}


