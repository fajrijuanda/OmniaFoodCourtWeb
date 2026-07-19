"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function EmptyState({ title = "Belum ada data.", body, icon: Icon = AlertCircle, action, className = "" }: { title?: string; body?: string; icon?: LucideIcon; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-[18px] bg-slate-50 p-5 text-center text-sm font-bold text-slate-500", className)}>
      <Icon className="mx-auto mb-3 h-6 w-6 text-slate-300" />
      <p>{title}</p>
      {body ? <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
