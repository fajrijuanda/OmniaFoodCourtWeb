"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalButton } from "./PortalButton";

export function CartSummaryCard({ totalLabel = "Total Pembayaran", total, subtotal, actionLabel, loading = false, onAction, children }: { totalLabel?: string; total: string; subtotal?: string; actionLabel: string; loading?: boolean; onAction: () => void; children?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 text-white">
      {subtotal ? (
        <div className="mb-1 flex items-center justify-between">
          <span className="font-bold text-slate-400">Total Pesanan</span>
          <span className="font-bold text-slate-300">{subtotal}</span>
        </div>
      ) : null}
      {children}
      <div className="mb-4 mt-2 flex items-center justify-between">
        <span className="text-lg font-bold text-white">{totalLabel}</span>
        <span className="text-2xl font-black">{total}</span>
      </div>
      <PortalButton loading={loading} onClick={onAction} className="w-full bg-orange-500 text-white hover:bg-orange-600">
        {actionLabel}
      </PortalButton>
    </div>
  );
}
