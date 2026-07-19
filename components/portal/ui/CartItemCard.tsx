"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { QuantityStepper } from "./QuantityStepper";

export function CartItemCard({ title, subtitle, note, price, quantity, onDecrease, onIncrease }: { title: string; subtitle?: string; note?: string; price: string; quantity: number; onDecrease: () => void; onIncrease: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-black text-slate-900">{title}</h3>
        {subtitle ? <p className="text-xs font-bold text-slate-500">{subtitle}</p> : null}
        {note ? <p className="text-xs italic text-slate-400">Catatan: {note}</p> : null}
        <p className="mt-1 font-bold text-orange-500">{price}</p>
      </div>
      <QuantityStepper value={quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
    </div>
  );
}
