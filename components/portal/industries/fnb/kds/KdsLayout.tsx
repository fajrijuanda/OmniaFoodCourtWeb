"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ChefHat, ClipboardCheck, RefreshCcw, Utensils } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { triggerHaptic } from "@/lib/mobile/nativeHardware";
import { KitchenTicket, KitchenTicketStatus, TicketCard } from "./TicketCard";

const columns: Array<{ status: KitchenTicketStatus; title: string; caption: string; icon: typeof AlertCircle; tone: string }> = [
  { status: "NEW", title: "Pesanan Masuk", caption: "Menunggu konfirmasi", icon: AlertCircle, tone: "text-blue-600 bg-blue-50" },
  { status: "ACCEPTED", title: "Diterima", caption: "Siap dimasak", icon: ClipboardCheck, tone: "text-cyan-600 bg-cyan-50" },
  { status: "COOKING", title: "Sedang Dimasak", caption: "Dalam proses", icon: ChefHat, tone: "text-orange-600 bg-orange-50" },
  { status: "READY", title: "Siap Disajikan", caption: "Ambil pesanan", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
];

export function KdsLayout({ standalone = false }: { standalone?: boolean }) {
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadTickets = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const rows = await apiFetch<KitchenTicket[]>("/fnb/pos/kds/orders");
      
      // If we have more NEW tickets than before, trigger a heavy haptic for new order alert
      if (tickets.length > 0) {
        const currentNew = tickets.filter(t => t.status === "NEW").length;
        const incomingNew = rows.filter(t => t.status === "NEW").length;
        if (incomingNew > currentNew) {
          triggerHaptic('HEAVY' as any); // Use heavy haptic for new incoming order
        }
      }
      
      setTickets(rows);
    } catch {
      setMessage("Belum bisa memuat antrean dapur. Pastikan backend aktif dan user sudah login.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = window.setInterval(loadTickets, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const groupedTickets = useMemo(() => {
    return columns.reduce<Record<KitchenTicketStatus, KitchenTicket[]>>((acc, column) => {
      acc[column.status] = tickets
        .filter((ticket) => ticket.status === column.status)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return acc;
    }, { NEW: [], ACCEPTED: [], COOKING: [], READY: [] });
  }, [tickets]);

  const updateTicketStatus = async (ticketId: string, status: KitchenTicketStatus) => {
    // Trigger medium haptic when chef interacts with ticket
    triggerHaptic('MEDIUM' as any);
    
    setTickets((value) => value.map((ticket) => ticket.id === ticketId ? { ...ticket, status } : ticket));
    try {
      const updated = await apiFetch<KitchenTicket>(`/fnb/pos/kds/orders/${ticketId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setTickets((value) => value.map((ticket) => ticket.id === ticketId ? updated : ticket));
    } catch {
      setMessage("Gagal mengubah status pesanan dapur.");
      loadTickets();
    }
  };

  return (
    <div className={`flex h-full w-full flex-col overflow-hidden ${standalone ? "bg-[#fff8f1]" : "bg-slate-50"}`}>
      <div className="flex flex-col gap-3 border-b border-orange-100 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--portal-primary)]">Kitchen display</p>
          <h1 className="mt-1 text-xl font-black text-[#172033] sm:text-2xl lg:text-3xl">Antrean Dapur</h1>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Dapur menerima pesanan, mulai memasak, dan menandai pesanan siap disajikan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 sm:px-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Live queue
          </span>
          <button onClick={loadTickets} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {message ? <p className="mx-4 mt-4 rounded-[16px] bg-orange-50 px-4 py-3 text-sm font-black text-orange-700 lg:mx-6">{message}</p> : null}

      <div className="flex-1 overflow-y-auto p-3 pb-4 sm:p-4 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-4 lg:gap-4">
          {columns.map((column) => {
            const Icon = column.icon;
            const rows = groupedTickets[column.status];
            return (
              <section key={column.status} className="flex min-h-[400px] flex-col rounded-[18px] border border-slate-100 bg-white sm:bg-white/88 p-3 shadow-sm lg:h-[calc(100vh-170px)] lg:min-h-[620px] lg:rounded-[28px] lg:p-4">
                <div className="mb-3 flex items-center justify-between gap-2 lg:mb-4 lg:gap-3">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-[12px] lg:h-11 lg:w-11 lg:rounded-[16px] ${column.tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-black text-[#172033] lg:text-base">{column.title}</h2>
                      <p className="text-xs font-bold text-slate-500">{column.caption}</p>
                    </div>
                  </div>
                  <span className="grid h-8 min-w-8 place-items-center rounded-full bg-slate-100 px-2 text-xs font-black text-slate-600">{rows.length}</span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1 lg:space-y-4">
                  <AnimatePresence>
                    {rows.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} onStatusChange={updateTicketStatus} />
                    ))}
                  </AnimatePresence>
                  {!isLoading && rows.length === 0 ? (
                    <div className="grid h-44 place-items-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50 text-center">
                      <div>
                        <Utensils className="mx-auto h-7 w-7 text-slate-300" />
                        <p className="mt-3 text-sm font-bold text-slate-400">Tidak ada pesanan</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
