"use client";

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Building2, CalendarDays, Package, Plus, Truck, WalletCards } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RoundedSelect } from "@/components/portal/ui";

type WholesaleOrderStatus = "Draft" | "Confirmed" | "Packed" | "Delivered" | "Invoiced";
type WholesaleCustomer = {
  id: string;
  name: string;
  channel: "Hotel" | "Cafe" | "Reseller" | "Corporate";
  priceTier: "Silver" | "Gold" | "Platinum";
  paymentTerms: string;
};
type WholesaleOrderItem = { productName: string; quantity: number; unitPrice: number };
type WholesaleOrder = {
  id: string;
  customerId: string;
  deliveryDate: string;
  status: WholesaleOrderStatus;
  items: WholesaleOrderItem[];
};

const wholesaleStatusFlow: WholesaleOrderStatus[] = ["Draft", "Confirmed", "Packed", "Delivered", "Invoiced"];

const badgeClass: Record<WholesaleOrderStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Confirmed: "bg-blue-50 text-blue-700",
  Packed: "bg-amber-50 text-amber-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Invoiced: "bg-violet-50 text-violet-700",
};

export function BakeryWholesaleLayout() {
  const [wholesaleCustomers, setWholesaleCustomers] = useState<WholesaleCustomer[]>([]);
  const [wholesaleOrders, setWholesaleOrders] = useState<WholesaleOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: "", channel: "Cafe", priceTier: "Silver", paymentTerms: "COD" });
  const [form, setForm] = useState({
    customerId: wholesaleCustomers[0]?.id ?? "",
    deliveryDate: "2026-06-03",
    productName: "Butter Croissant",
    quantity: "48",
    unitPrice: "15000",
  });

  const loadWholesale = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [customers, orders] = await Promise.all([
        apiFetch<WholesaleCustomer[]>("/fnb/operations/wholesale-customers"),
        apiFetch<WholesaleOrder[]>("/fnb/operations/wholesale-orders"),
      ]);
      setWholesaleCustomers(customers);
      setWholesaleOrders(orders);
      if (customers[0]?.id) {
        setForm((value) => (value.customerId ? value : { ...value, customerId: customers[0].id }));
      }
    } catch (event) {
      setError(event instanceof Error ? event.message : "Gagal memuat data wholesale dari backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWholesale();
  }, [loadWholesale]);

  const ordersWithTotals = useMemo(
    () =>
      wholesaleOrders.map((order) => ({
        ...order,
        customer: wholesaleCustomers.find((customer) => customer.id === order.customerId),
        total: order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      })),
    [wholesaleCustomers, wholesaleOrders],
  );

  const pipelineValue = ordersWithTotals.reduce((sum, order) => sum + order.total, 0);
  const deliveryCount = ordersWithTotals.filter((order) => order.status === "Confirmed" || order.status === "Packed").length;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.customerId || !form.productName.trim()) return;

    await apiFetch("/fnb/operations/wholesale-orders", {
      method: "POST",
      body: JSON.stringify({
      customerId: form.customerId,
      deliveryDate: form.deliveryDate,
      items: [
        {
          productName: form.productName.trim(),
          quantity: Number(form.quantity) || 1,
          unitPrice: Number(form.unitPrice) || 0,
        },
      ],
      }),
    });
    await loadWholesale();
    setFormOpen(false);
    setForm((value) => ({ ...value, productName: "Butter Croissant", quantity: "48", unitPrice: "15000" }));
  };

  const handleCustomerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerForm.name.trim()) return;
    await apiFetch("/fnb/operations/wholesale-customers", {
      method: "POST",
      body: JSON.stringify(customerForm),
    });
    setCustomerForm({ name: "", channel: "Cafe", priceTier: "Silver", paymentTerms: "COD" });
    setCustomerFormOpen(false);
    await loadWholesale();
  };

  const updateWholesaleOrderStatus = async (id: string, status: WholesaleOrderStatus) => {
    await apiFetch(`/fnb/operations/wholesale-orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadWholesale();
  };

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--portal-primary)]">Bakery B2B</p>
            <h1 className="mt-1 text-xl font-black text-[#172033] sm:text-2xl">Wholesale & Reseller Orders</h1>
            <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Kelola pelanggan grosir, jadwal kirim, packing, invoice, dan tier harga.</p>
          </div>
          {loading ? <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Loading</span> : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setCustomerFormOpen((value) => !value)}
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 sm:w-fit sm:py-3"
              type="button"
            >
              <Plus className="h-4 w-4" /> Customer
            </button>
            <button
              onClick={() => setFormOpen((value) => !value)}
              disabled={wholesaleCustomers.length === 0}
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-50 sm:w-fit sm:py-3"
              type="button"
            >
              <Plus className="h-4 w-4" /> Buat Sales Order
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-3 pb-4 sm:p-5 lg:p-6">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["B2B accounts", String(wholesaleCustomers.length), Building2],
            ["Order perlu kirim", String(deliveryCount), Truck],
            ["Pipeline wholesale", `Rp${pipelineValue.toLocaleString("id-ID")}`, WalletCards],
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[20px] sm:p-5">
              <Icon className="h-5 w-5 text-[var(--portal-primary)]" />
              <p className="mt-3 text-xl font-black text-[#172033] sm:mt-4 sm:text-2xl">{value as string}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{label as string}</p>
            </div>
          ))}
        </div>

        {error ? <div className="mt-5 rounded-[18px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">{error}</div> : null}

        {customerFormOpen && (
          <form onSubmit={handleCustomerSubmit} className="mt-4 grid gap-2.5 rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:mt-5 sm:gap-3 sm:rounded-[20px] sm:p-5 lg:grid-cols-[1fr_0.5fr_0.5fr_0.6fr_auto]">
            <input value={customerForm.name} onChange={(event) => setCustomerForm((value) => ({ ...value, name: event.target.value }))} className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none" placeholder="Nama customer" />
            <RoundedSelect value={customerForm.channel} onChange={(event) => setCustomerForm((value) => ({ ...value, channel: event.target.value }))} className="w-full text-sm">
              <option>Cafe</option><option>Hotel</option><option>Reseller</option><option>Corporate</option>
            </RoundedSelect>
            <RoundedSelect value={customerForm.priceTier} onChange={(event) => setCustomerForm((value) => ({ ...value, priceTier: event.target.value }))} className="w-full text-sm">
              <option>Silver</option><option>Gold</option><option>Platinum</option>
            </RoundedSelect>
            <input value={customerForm.paymentTerms} onChange={(event) => setCustomerForm((value) => ({ ...value, paymentTerms: event.target.value }))} className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none" placeholder="Term" />
            <button className="min-h-[40px] rounded-full bg-[#172033] px-5 py-2.5 text-sm font-black text-white" type="submit">Simpan</button>
          </form>
        )}

        {formOpen && (
          <form onSubmit={handleSubmit} className="mt-4 grid gap-2.5 rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:mt-5 sm:gap-3 sm:rounded-[20px] sm:p-5 lg:grid-cols-[1fr_0.8fr_1fr_0.5fr_0.7fr_auto]">
            <RoundedSelect value={form.customerId} onChange={(event) => setForm((value) => ({ ...value, customerId: event.target.value }))} className="w-full text-sm">
              {wholesaleCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.name} - {customer.priceTier}</option>
              ))}
            </RoundedSelect>
            <input type="date" value={form.deliveryDate} onChange={(event) => setForm((value) => ({ ...value, deliveryDate: event.target.value }))} className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" />
            <input value={form.productName} onChange={(event) => setForm((value) => ({ ...value, productName: event.target.value }))} className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Produk" />
            <input type="number" min="1" value={form.quantity} onChange={(event) => setForm((value) => ({ ...value, quantity: event.target.value }))} className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Qty" />
            <input type="number" min="0" value={form.unitPrice} onChange={(event) => setForm((value) => ({ ...value, unitPrice: event.target.value }))} className="min-h-[40px] rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:rounded-[14px] sm:px-4 sm:py-3" placeholder="Harga" />
            <button className="min-h-[40px] rounded-full bg-[#172033] px-5 py-2.5 text-sm font-black text-white sm:py-3" type="submit">Simpan</button>
          </form>
        )}

        <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[20px] sm:p-5">
            <h2 className="text-base font-black text-[#172033] sm:text-lg">Wholesale Accounts</h2>
            <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
              {wholesaleCustomers.map((customer) => (
                <div key={customer.id} className="rounded-[14px] border border-slate-100 bg-slate-50 p-3 sm:rounded-[16px] sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-[#172033]">{customer.name}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{customer.channel} - {customer.paymentTerms}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-[var(--portal-primary)]">{customer.priceTier}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 sm:space-y-4">
            {ordersWithTotals.map((order) => {
              const currentIndex = wholesaleStatusFlow.indexOf(order.status);
              const nextStatus = wholesaleStatusFlow[currentIndex + 1];

              return (
                <article key={order.id} className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[20px] sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{order.id}</p>
                      <h3 className="mt-1 text-base font-black text-[#172033] sm:text-lg">{order.customer?.name ?? order.customerId}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500"><CalendarDays className="h-3.5 w-3.5" /> Kirim {order.deliveryDate}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${badgeClass[order.status]}`}>{order.status}</span>
                  </div>
                  <div className="mt-3 divide-y divide-slate-100 rounded-[14px] bg-slate-50 sm:mt-4 sm:rounded-[16px]">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productName}`} className="flex items-center justify-between gap-3 p-3">
                        <p className="flex items-center gap-2 text-sm font-black text-[#172033]"><Package className="h-4 w-4 text-[var(--portal-primary)]" /> {item.productName}</p>
                        <p className="text-sm font-bold text-slate-500">{item.quantity} x Rp{item.unitPrice.toLocaleString("id-ID")}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-black text-[#172033]">Rp{order.total.toLocaleString("id-ID")}</p>
                    {nextStatus && (
                      <button onClick={() => updateWholesaleOrderStatus(order.id, nextStatus)} className="min-h-[40px] rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-xs font-black text-[var(--portal-on-primary)]" type="button">
                        Move to {nextStatus}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}
