"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function RadioCardGroup<T extends string>({ value, options, onChange, className = "" }: { value: T; options: Array<{ value: T; label: string; caption?: string; disabled?: boolean }>; onChange: (value: T) => void; className?: string }) {
  return (
    <div className={cx("grid gap-3", className)}>
      {options.map((option) => (
        <label key={option.value} className={cx("flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors", value === option.value ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)]" : "border-slate-200 bg-white", option.disabled && "cursor-not-allowed opacity-50")}>
          <input type="radio" checked={value === option.value} disabled={option.disabled} onChange={() => onChange(option.value)} className="hidden" />
          <span className={cx("flex h-5 w-5 items-center justify-center rounded-full border-2", value === option.value ? "border-[var(--portal-primary)]" : "border-slate-300")}>
            {value === option.value ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--portal-primary)]" /> : null}
          </span>
          <span>
            <span className="block text-sm font-bold text-slate-700">{option.label}</span>
            {option.caption ? <span className="mt-0.5 block text-xs font-bold text-slate-500">{option.caption}</span> : null}
          </span>
        </label>
      ))}
    </div>
  );
}
