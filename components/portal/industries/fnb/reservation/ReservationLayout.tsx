"use client";

import React, { FormEvent, useEffect, useMemo, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, User, Clock, CheckCircle2, XCircle, Phone, Users } from "lucide-react";
import { usePosStore } from "../store/usePosStore";
import { ReservationStatus, RestaurantReservation, RestaurantTable } from "../store/useRestaurantStore";
import { apiFetch } from "@/lib/api";

const reservationTabs: Array<ReservationStatus | "All"> = ["All", "Upcoming", "Seated", "Completed", "Cancelled"];

const getPosPath = (pathname: string) => {
  const parts = pathname.split("/");
  const fnbIndex = parts.indexOf("fnb");
  const subIndustry = fnbIndex >= 0 ? parts[fnbIndex + 1] : undefined;

  if (subIndustry && !["pos", "table-order", "reservation", "kds", "inventory", "sales", "settings"].includes(subIndustry)) {
    return `/portal/fnb/${subIndustry}/pos`;
  }

  return "/portal/fnb/pos";
};

export function ReservationLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { loadTableOrder } = usePosStore();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [reservations, setReservations] = useState<RestaurantReservation[]>([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState<ReservationStatus | "All">("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    contact: "",
    pax: "2",
    time: "19:00",
    tableId: "",
  });

  const normalizeTable = useCallback((table: any): RestaurantTable => ({
    id: table.id,
    number: table.number ?? String(table.name ?? "").replace(/^Meja\s*/i, ""),
    capacity: table.capacity,
    status: table.status === "OCCUPIED" ? "Occupied" : table.status === "RESERVED" ? "Reserved" : "Available",
  }), []);

  const loadData = useCallback(async () => {
    setMessage("");
    try {
      const [tableRows, reservationRows] = await Promise.all([
        apiFetch<any[]>("/fnb/pos/tables"),
        apiFetch<RestaurantReservation[]>("/fnb/pos/reservations"),
      ]);
      setTables(tableRows.map(normalizeTable));
      setReservations(reservationRows);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat reservasi.");
    }
  }, [normalizeTable]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableTables = useMemo(
    () => tables.filter((table) => table.status === "Available" || table.id === form.tableId),
    [form.tableId, tables],
  );
  const filtered = filter === "All" ? reservations : reservations.filter((reservation) => reservation.status === filter);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.guestName.trim() || !form.contact.trim() || !form.tableId) return;

    await apiFetch("/fnb/pos/reservations", {
      method: "POST",
      body: JSON.stringify({
        guestName: form.guestName.trim(),
        contact: form.contact.trim(),
        pax: Number(form.pax) || 1,
        time: form.time,
        tableId: form.tableId,
      }),
    });
    setForm({ guestName: "", contact: "", pax: "2", time: "19:00", tableId: "" });
    setIsFormOpen(false);
    await loadData();
  };

  const handleCheckIn = async (reservationId: string) => {
    const reservation = reservations.find((item) => item.id === reservationId);
    await apiFetch(`/fnb/pos/reservations/${reservationId}/status`, { method: "PATCH", body: JSON.stringify({ status: "Seated" }) });
    const table = tables.find((item) => item.id === reservation?.tableId);
    if (!table) return;

    loadTableOrder(table.id, table.guestName ?? null, table.openBill?.items ?? []);
    router.push(getPosPath(pathname));
  };

  const handleCancel = async (reservationId: string) => {
    await apiFetch(`/fnb/pos/reservations/${reservationId}/status`, { method: "PATCH", body: JSON.stringify({ status: "Cancelled" }) });
    await loadData();
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div>
          <h1 className="text-xl font-black text-[#172033] sm:text-2xl">Reservasi</h1>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">Jadwal booking meja hari ini.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex max-w-full overflow-x-auto rounded-full border border-slate-200 bg-slate-100 p-1">
            {reservationTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`min-h-[34px] whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-black transition sm:px-4 ${
                  filter === tab ? "bg-white text-[#172033] shadow-sm" : "text-slate-500 hover:text-[#172033]"
                }`}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsFormOpen((value) => !value)}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-[var(--portal-on-primary)] shadow-sm hover:opacity-90"
            type="button"
          >
            <Plus className="h-4 w-4" /> Tambah Booking
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 pb-4 sm:p-5 lg:p-6">
        {message ? <div className="mb-4 rounded-[16px] border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700">{message}</div> : null}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mb-4 grid gap-2.5 rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:mb-6 sm:gap-3 sm:rounded-[20px] sm:p-5 lg:grid-cols-[1.2fr_0.8fr_0.5fr_0.5fr_0.7fr_auto]">
            <input
              value={form.guestName}
              onChange={(event) => setForm((value) => ({ ...value, guestName: event.target.value }))}
              className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3"
              placeholder="Nama tamu"
            />
            <input
              value={form.contact}
              onChange={(event) => setForm((value) => ({ ...value, contact: event.target.value }))}
              className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3"
              placeholder="Kontak"
            />
            <input
              type="number"
              min="1"
              value={form.pax}
              onChange={(event) => setForm((value) => ({ ...value, pax: event.target.value }))}
              className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3"
              placeholder="Pax"
            />
            <input
              type="time"
              value={form.time}
              onChange={(event) => setForm((value) => ({ ...value, time: event.target.value }))}
              className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3"
            />
            <select
              value={form.tableId}
              onChange={(event) => setForm((value) => ({ ...value, tableId: event.target.value }))}
              className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3"
            >
              <option value="">Pilih meja</option>
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>
                  Meja {table.number} - {table.capacity} pax
                </option>
              ))}
            </select>
            <button className="min-h-[40px] rounded-full bg-[#172033] px-5 py-2.5 text-sm font-black text-white sm:py-3" type="submit">
              Simpan
            </button>
          </form>
        )}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((reservation) => {
            const table = tables.find((item) => item.id === reservation.tableId);

            return (
              <div key={reservation.id} className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[24px] sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#172033] sm:text-lg">{reservation.guestName}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500 sm:gap-3 sm:text-xs">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {reservation.pax} Pax</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {reservation.time}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {reservation.contact}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      reservation.status === "Upcoming" ? "bg-blue-100 text-blue-700" :
                      reservation.status === "Seated" ? "bg-emerald-100 text-emerald-700" :
                      reservation.status === "Cancelled" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {reservation.status}
                    </span>
                    <p className="mt-2 text-xl font-black text-[#172033] sm:text-2xl">T{table?.number ?? reservation.tableId}</p>
                  </div>
                </div>

                {reservation.status === "Upcoming" && (
                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 sm:mt-5 sm:pt-4">
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2 text-xs font-black text-slate-600 hover:bg-slate-50"
                      type="button"
                    >
                      <XCircle className="h-4 w-4" /> Cancel
                    </button>
                    <button
                      onClick={() => handleCheckIn(reservation.id)}
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--portal-primary)] py-2 text-xs font-black text-[var(--portal-on-primary)] hover:opacity-90"
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Check-in
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center text-center text-slate-400">
            <User className="h-10 w-10" />
            <p className="mt-3 text-sm font-black">Tidak ada reservasi untuk filter ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}
