"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle, ChefHat, Clock, Play, Utensils } from "lucide-react";
import { motion } from "framer-motion";

export type KitchenTicketStatus = "NEW" | "ACCEPTED" | "COOKING" | "READY";

export type KitchenTicket = {
  id: string;
  invoiceNumber: string;
  status: KitchenTicketStatus;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    id: string;
    quantity: number;
    note?: string | null;
    variantSnapshot?: { name?: string } | null;
    modifiersSnapshot?: Array<{ name?: string }> | null;
    product: {
      id: string;
      name: string;
    };
  }>;
};

const nextAction: Record<KitchenTicketStatus, { label: string; nextStatus: KitchenTicketStatus | null; icon: LucideIcon }> = {
  NEW: { label: "Terima pesanan", nextStatus: "ACCEPTED", icon: CheckCircle },
  ACCEPTED: { label: "Mulai masak", nextStatus: "COOKING", icon: Play },
  COOKING: { label: "Siap disajikan", nextStatus: "READY", icon: Utensils },
  READY: { label: "Ready", nextStatus: null, icon: CheckCircle },
};

export function TicketCard({
  ticket,
  onStatusChange,
}: {
  ticket: KitchenTicket;
  onStatusChange: (ticketId: string, status: KitchenTicketStatus) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const action = nextAction[ticket.status];

  useEffect(() => {
    const start = new Date(ticket.createdAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000 / 60));
    tick();
    const interval = window.setInterval(tick, 60000);
    return () => window.clearInterval(interval);
  }, [ticket.createdAt]);

  const isLate = elapsed >= 15;
  const ActionIcon = action.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`flex min-h-[240px] flex-col rounded-[16px] border bg-white p-3 shadow-sm lg:min-h-[320px] lg:rounded-[24px] lg:p-4 ${
        ticket.status === "READY" ? "border-emerald-200 bg-emerald-50/70" : isLate ? "border-rose-200" : "border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 lg:gap-3">
        <div>
          <span className="rounded-full bg-[#172033] px-3 py-1 text-xs font-black text-white">{ticket.invoiceNumber}</span>
          <p className="mt-2 text-xs font-bold text-slate-500">
            {new Date(ticket.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${isLate ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`}>
          <Clock className="h-3.5 w-3.5" />
          {elapsed} min
        </span>
      </div>

      <div className="flex-1 space-y-2 py-3 lg:space-y-3 lg:py-4">
        {ticket.items.map((item) => (
          <div key={item.id} className="flex items-start gap-2 rounded-[12px] bg-slate-50 p-2.5 lg:gap-3 lg:rounded-[16px] lg:p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-white text-xs font-black text-[var(--portal-primary)] shadow-sm lg:h-8 lg:w-8 lg:rounded-[10px] lg:text-sm">
              {item.quantity}x
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black leading-snug text-[#172033] lg:text-base">{item.product.name}</p>
              {item.variantSnapshot?.name ? <p className="mt-1 text-xs font-bold text-slate-500">- {item.variantSnapshot.name}</p> : null}
              {Array.isArray(item.modifiersSnapshot)
                ? item.modifiersSnapshot.map((modifier, index) => (
                    <p key={`${item.id}-modifier-${index}`} className="mt-1 text-xs font-bold text-slate-500">+ {modifier.name}</p>
                  ))
                : null}
              {item.note ? <p className="mt-2 rounded-[10px] bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">Note: {item.note}</p> : null}
            </div>
          </div>
        ))}
      </div>

      {action.nextStatus ? (
        <button
          onClick={() => onStatusChange(ticket.id, action.nextStatus!)}
          className="mt-auto inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--portal-primary)] px-3 py-2.5 text-sm font-black text-[var(--portal-on-primary)] shadow-lg shadow-[var(--portal-primary-soft)] lg:rounded-[16px] lg:px-4 lg:py-4 lg:text-base"
          type="button"
        >
          <ActionIcon className="h-5 w-5" />
          {action.label}
        </button>
      ) : (
        <div className="mt-auto inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[14px] bg-emerald-100 px-3 py-2.5 text-sm font-black text-emerald-700 lg:rounded-[16px] lg:px-4 lg:py-4 lg:text-base">
          <ChefHat className="h-5 w-5" />
          Siap diambil server
        </div>
      )}
    </motion.article>
  );
}
