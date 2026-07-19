"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function CheckboxField({ label, checked, onChange, className = "" }: { label: string; checked: boolean; onChange: (checked: boolean) => void; className?: string }) {
  return (
    <label className={cx("flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700", className)}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
