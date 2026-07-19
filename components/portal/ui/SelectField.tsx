"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { RoundedSelect } from "./RoundedSelect";

export function SelectField<T extends string>({ label, value, options, onChange, allowEmpty = false, emptyLabel = "Pilih data", className = "" }: { label: string; value: T | ""; options: Array<{ value: T; label: string; disabled?: boolean }>; onChange: (value: T | "") => void; allowEmpty?: boolean; emptyLabel?: string; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</span>
      <RoundedSelect className="w-full text-sm" value={value} onChange={(event) => onChange(event.target.value as T | "")}>
        {allowEmpty ? <option value="">{emptyLabel}</option> : null}
        {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </RoundedSelect>
    </label>
  );
}
