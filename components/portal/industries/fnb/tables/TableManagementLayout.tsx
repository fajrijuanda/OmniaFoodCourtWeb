"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Users, ReceiptText } from "lucide-react";
import { usePosStore } from "../store/usePosStore";
import { RestaurantTable } from "../store/useRestaurantStore";
import { apiFetch } from "@/lib/api";

export function TableManagementLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { loadTableOrder } = usePosStore();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ number: "", capacity: "2" });
  const [message, setMessage] = useState("");

  const normalizeTable = (table: any): RestaurantTable => ({
    id: table.id,
    number: table.number ?? String(table.name ?? "").replace(/^Meja\s*/i, ""),
    capacity: table.capacity,
    status: table.status === "OCCUPIED" ? "Occupied" : table.status === "RESERVED" ? "Reserved" : "Available",
  });

  const loadTables = async () => {
    setMessage("");
    try {
      const rows = await apiFetch<any[]>("/fnb/pos/tables");
      setTables(rows.map(normalizeTable));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat meja.");
    }
  };

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const getPosPath = () => {
    const parts = pathname.split("/");
    const fnbIndex = parts.indexOf("fnb");
    const subIndustry = fnbIndex >= 0 ? parts[fnbIndex + 1] : undefined;

    if (subIndustry && !["pos", "table-order", "reservation", "kds", "inventory", "sales", "settings"].includes(subIndustry)) {
      return `/portal/fnb/${subIndustry}/pos`;
    }

    return "/portal/fnb/pos";
  };
  
  const handleTableClick = (table: RestaurantTable) => {
    loadTableOrder(table.id, table.guestName ?? null, table.openBill?.items ?? []);
    router.push(getPosPath());
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.number.trim()) return;
    try {
      await apiFetch("/fnb/pos/tables", {
        method: "POST",
        body: JSON.stringify({ number: form.number.trim(), capacity: Number(form.capacity) || 2 }),
      });
      setForm({ number: "", capacity: "2" });
      setFormOpen(false);
      await loadTables();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat meja.");
    }
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div>
          <h1 className="text-xl font-black text-[#172033] sm:text-2xl">Manajemen Meja</h1>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">Pilih meja untuk memulai pesanan Dine-in.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Kosong
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="h-3 w-3 rounded-full bg-rose-500"></span> Terisi
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="h-3 w-3 rounded-full bg-amber-500"></span> Reservasi
          </div>
          <button onClick={() => setFormOpen((value) => !value)} className="rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-[var(--portal-on-primary)]" type="button">Tambah Meja</button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 pb-4 sm:p-5 lg:p-6">
        {message ? <div className="mb-4 rounded-[16px] border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700">{message}</div> : null}
        {formOpen ? (
          <form onSubmit={handleCreate} className="mb-5 grid gap-3 rounded-[18px] border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_140px_auto]">
            <input value={form.number} onChange={(event) => setForm((value) => ({ ...value, number: event.target.value }))} className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none" placeholder="Nomor/nama meja" />
            <input type="number" min="1" value={form.capacity} onChange={(event) => setForm((value) => ({ ...value, capacity: event.target.value }))} className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none" placeholder="Kapasitas" />
            <button className="rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white" type="submit">Simpan</button>
          </form>
        ) : null}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {tables.map((table) => {
            const isAvailable = table.status === "Available";
            const isOccupied = table.status === "Occupied";
            const billTotal = table.openBill?.items.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0) ?? 0;

            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`relative flex h-24 flex-col items-center justify-center rounded-[16px] border-2 p-3 transition sm:h-32 sm:rounded-[22px] sm:p-4 ${
                  isAvailable
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-100"
                    : isOccupied
                    ? "border-rose-100 bg-rose-50 text-rose-700 hover:border-rose-200 hover:bg-rose-100"
                    : "border-amber-100 bg-amber-50 text-amber-700 hover:border-amber-200 hover:bg-amber-100"
                }`}
              >
                <div className="absolute right-2 top-2 sm:right-4 sm:top-4">
                  <span className={`flex h-5 items-center gap-1 rounded-full px-2 text-[10px] font-black sm:h-6 sm:px-2.5 ${
                    isAvailable ? "bg-emerald-200 text-emerald-800" : isOccupied ? "bg-rose-200 text-rose-800" : "bg-amber-200 text-amber-800"
                  }`}>
                    <Users className="h-3 w-3" /> {table.capacity}
                  </span>
                </div>
                <h3 className="text-2xl font-black sm:text-4xl">{table.number}</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide sm:mt-1 sm:text-xs">{table.status}</p>
                {table.guestName && (
                  <p className="mt-1 max-w-[90%] truncate text-[10px] font-black opacity-80 sm:mt-2 sm:text-xs">{table.guestName}</p>
                )}
                {billTotal > 0 && (
                  <p className="mt-1 flex items-center gap-1 rounded-full bg-white sm:bg-white/70 px-2 py-1 text-[10px] font-black sm:mt-2">
                    <ReceiptText className="h-3 w-3" />
                    Rp{billTotal.toLocaleString("id-ID")}
                  </p>
                )}
              </button>
            );
          })}
        </div>
        {tables.length === 0 ? <div className="mt-12 text-center text-sm font-black text-slate-400">Belum ada meja. Tambahkan meja untuk mulai table order.</div> : null}
      </main>
    </div>
  );
}
