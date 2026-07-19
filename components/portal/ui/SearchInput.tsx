"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function SearchInput({ value, onChange, placeholder = "Cari data...", className = "" }: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={cx("flex min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3", className)}>
      <Search className="h-4 w-4 shrink-0 text-slate-400" />
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 bg-transparent text-xs font-bold outline-none sm:text-sm" placeholder={placeholder} />
    </label>
  );
}
