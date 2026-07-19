"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function MobileTabBar<T extends string>({ value, items, onChange, className = "" }: { value: T; items: Array<{ value: T; label: string; icon?: LucideIcon; badge?: number }>; onChange: (value: T) => void; className?: string }) {
  return (
    <div className={cx("fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[max(env(safe-area-inset-bottom),0px)] backdrop-blur-lg lg:hidden", className)}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = value === item.value;
          return (
            <button key={item.value} onClick={() => onChange(item.value)} className={cx("relative flex min-h-[44px] items-center justify-center gap-2 py-2.5 text-sm font-black transition", active ? "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "text-slate-500")} type="button">
              {Icon ? <Icon className="h-5 w-5" /> : null}
              {item.label}
              {item.badge ? <span className="absolute right-[calc(50%-52px)] top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--portal-primary)] px-1 text-[10px] font-black text-white">{item.badge}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
