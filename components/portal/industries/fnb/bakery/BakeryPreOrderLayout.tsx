"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, PackageCheck, Plus, Search, UserRound } from "lucide-react";
import { apiFetch } from "@/lib/api";

type BakeryPreOrderStatus = "New" | "Confirmed" | "In Production" | "Ready" | "Completed" | "Cancelled";
type BakeryPreOrder = {
  id: string;
  customerName: string;
  contact: string;
  productName: string;
  pickupDate: string;
  pickupTime: string;
  quantity: number;
  depositPaid: number;
  totalAmount: number;
  status: BakeryPreOrderStatus;
  notes: string;
};

const statusFlow: BakeryPreOrderStatus[] = ["New", "Confirmed", "In Production", "Ready", "Completed"];

const statusClass: Record<BakeryPreOrderStatus, string> = {
  New: "bg-blue-50 text-blue-700",
  Confirmed: "bg-amber-50 text-amber-700",
  "In Production": "bg-violet-50 text-violet-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Completed: "bg-slate-100 text-slate-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

export function BakeryPreOrderLayout() {
  const [preOrders, setPreOrders] = useState<BakeryPreOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    productName: "Custom Birthday Cake 20cm",
    pickupDate: "2026-06-03",
    pickupTime: "14:00",
    quantity: "1",
    depositPaid: "100000",
    totalAmount: "350000",
    notes: "",
  });

  const loadPreOrders = async () => {
    setLoading(true);
    setError("");
    try {
      setPreOrders(await apiFetch<BakeryPreOrder[]>("/fnb/operations/pre-orders"));
    } catch (event) {
      setError(event instanceof Error ? event.message : "Gagal memuat pre-order dari backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return preOrders;

    return preOrders.filter((order) =>
      `${order.id} ${order.customerName} ${order.productName} ${order.status}`.toLowerCase().includes(term),
    );
  }, [preOrders, query]);

  const productionCount = preOrders.filter((order) => order.status === "Confirmed" || order.status === "In Production").length;
  const readyCount = preOrders.filter((order) => order.status === "Ready").length;
  const depositTotal = preOrders.reduce((sum, order) => sum + order.depositPaid, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.customerName.trim() || !form.contact.trim() || !form.productName.trim()) return;

    await apiFetch("/fnb/operations/pre-orders", {
      method: "POST",
      body: JSON.stringify({
      customerName: form.customerName.trim(),
      contact: form.contact.trim(),
      productName: form.productName.trim(),
      pickupDate: form.pickupDate,
      pickupTime: form.pickupTime,
      quantity: Number(form.quantity) || 1,
      depositPaid: Number(form.depositPaid) || 0,
      totalAmount: Number(form.totalAmount) || 0,
      notes: form.notes.trim(),
      }),
    });
    await loadPreOrders();
    setFormOpen(false);
    setForm({
      customerName: "",
      contact: "",
      productName: "Custom Birthday Cake 20cm",
      pickupDate: "2026-06-03",
      pickupTime: "14:00",
      quantity: "1",
      depositPaid: "100000",
      totalAmount: "350000",
      notes: "",
    });
  };

  const updatePreOrderStatus = async (id: string, status: BakeryPreOrderStatus) => {
    await apiFetch(`/fnb/operations/pre-orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadPreOrders();
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--portal-primary)]">Bakery workflow</p>
            <h1 className="mt-1 text-xl font-black text-[#172033] sm:text-2xl">Pre-Order & Custom Cake</h1>
            <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Kelola pesanan booking, DP, pickup time, dan status produksi harian.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {loading ? <span className="self-center text-xs font-black uppercase tracking-[0.16em] text-slate-400">Loading</span> : null}
            <div className="flex min-h-[40px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:px-4 sm:py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400 sm:w-56"
                placeholder="Cari pre-order..."
              />
            </div>
            <button
              onClick={() => setFormOpen((value) => !value)}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] sm:py-3"
              type="button"
            >
              <Plus className="h-4 w-4" /> Tambah PO
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 pb-4 sm:p-5 lg:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Produksi aktif", String(productionCount), PackageCheck],
            ["Siap pickup", String(readyCount), CheckCircle2],
            ["DP terkumpul", `Rp${depositTotal.toLocaleString("id-ID")}`, CalendarDays],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[20px] sm:p-5">
              <Icon className="h-5 w-5 text-[var(--portal-primary)]" />
              <p className="mt-3 text-xl font-black text-[#172033] sm:mt-4 sm:text-2xl">{value as string}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{label as string}</p>
            </div>
          ))}
        </div>

        {error ? <div className="mt-5 rounded-[18px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">{error}</div> : null}

        {formOpen && (
          <form onSubmit={handleSubmit} className="mt-4 grid gap-2.5 rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:mt-5 sm:gap-3 sm:rounded-[20px] sm:p-5 lg:grid-cols-4">
            <input className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Nama pelanggan" value={form.customerName} onChange={(event) => setForm((value) => ({ ...value, customerName: event.target.value }))} />
            <input className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Kontak" value={form.contact} onChange={(event) => setForm((value) => ({ ...value, contact: event.target.value }))} />
            <input className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3 lg:col-span-2" placeholder="Produk / custom request" value={form.productName} onChange={(event) => setForm((value) => ({ ...value, productName: event.target.value }))} />
            <input type="date" className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" value={form.pickupDate} onChange={(event) => setForm((value) => ({ ...value, pickupDate: event.target.value }))} />
            <input type="time" className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" value={form.pickupTime} onChange={(event) => setForm((value) => ({ ...value, pickupTime: event.target.value }))} />
            <input type="number" min="1" className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Qty" value={form.quantity} onChange={(event) => setForm((value) => ({ ...value, quantity: event.target.value }))} />
            <input type="number" min="0" className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Total" value={form.totalAmount} onChange={(event) => setForm((value) => ({ ...value, totalAmount: event.target.value }))} />
            <input type="number" min="0" className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="DP" value={form.depositPaid} onChange={(event) => setForm((value) => ({ ...value, depositPaid: event.target.value }))} />
            <input className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3 lg:col-span-2" placeholder="Catatan produksi" value={form.notes} onChange={(event) => setForm((value) => ({ ...value, notes: event.target.value }))} />
            <button className="min-h-[40px] rounded-full bg-[#172033] px-5 py-2.5 text-sm font-black text-white sm:py-3" type="submit">Simpan PO</button>
          </form>
        )}

        <div className="mt-4 grid gap-3 sm:mt-5 xl:grid-cols-3">
          {filteredOrders.map((order) => {
            const currentIndex = statusFlow.indexOf(order.status);
            const nextStatus = statusFlow[currentIndex + 1];
            const balance = order.totalAmount - order.depositPaid;

            return (
              <article key={order.id} className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[20px] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{order.id}</p>
                    <h3 className="mt-1 text-base font-black text-[#172033] sm:text-lg">{order.productName}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500"><UserRound className="h-3.5 w-3.5" /> {order.customerName}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${statusClass[order.status]}`}>{order.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:mt-4 sm:gap-3">
                  <div className="rounded-[12px] bg-slate-50 p-2.5 sm:rounded-[14px] sm:p-3">
                    <p className="text-xs font-bold text-slate-400">Pickup</p>
                    <p className="mt-1 flex items-center gap-1 font-black text-[#172033]"><Clock className="h-3.5 w-3.5" /> {order.pickupDate} {order.pickupTime}</p>
                  </div>
                  <div className="rounded-[12px] bg-slate-50 p-2.5 sm:rounded-[14px] sm:p-3">
                    <p className="text-xs font-bold text-slate-400">Sisa bayar</p>
                    <p className="mt-1 font-black text-[#172033]">Rp{balance.toLocaleString("id-ID")}</p>
                  </div>
                </div>
                {order.notes && <p className="mt-4 rounded-[14px] bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-800">{order.notes}</p>}
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 sm:mt-4 sm:pt-4">
                  {nextStatus && (
                    <button onClick={() => updatePreOrderStatus(order.id, nextStatus)} className="min-h-[40px] flex-1 rounded-full bg-[var(--portal-primary)] px-4 py-2.5 text-xs font-black text-[var(--portal-on-primary)]" type="button">
                      Move to {nextStatus}
                    </button>
                  )}
                  {order.status !== "Cancelled" && order.status !== "Completed" && (
                    <button onClick={() => updatePreOrderStatus(order.id, "Cancelled")} className="min-h-[40px] rounded-full border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-500" type="button">
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
