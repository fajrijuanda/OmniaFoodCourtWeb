"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function ActionPill({ active = false, icon: Icon, children, className = "", ...props }: ComponentPropsWithoutRef<"button"> & { active?: boolean; icon?: LucideIcon }) {
  return (
    <button
      className={cx(
        "inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition",
        active ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        className
      )}
      type="button"
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
