"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function FormField({ label, value, onChange, textarea = false, type = "text", placeholder, className = "" }: { label: string; value: string | number; onChange: (value: string) => void; textarea?: boolean; type?: string; placeholder?: string; className?: string }) {
  const inputClass = "w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]";
  return (
    <label className={cx("block", className)}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</span>
      {textarea ? (
        <textarea className={inputClass} rows={3} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputClass} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}
