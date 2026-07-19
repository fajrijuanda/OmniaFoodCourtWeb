"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function SegmentedControl<T extends string>({ value, options, onChange, className = "" }: { value: T; options: Array<{ value: T; label: string; disabled?: boolean }>; onChange: (value: T) => void; className?: string }) {
  return (
    <div className={cx("flex gap-1 rounded-xl bg-slate-100 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={option.disabled}
          className={cx(
            "flex-1 rounded-lg px-3 py-2 text-xs font-black transition disabled:opacity-40",
            value === option.value ? "bg-white text-[var(--portal-primary)] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
