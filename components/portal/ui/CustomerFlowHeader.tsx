"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function CustomerFlowHeader({ title, backHref, className = "" }: { title: string; backHref?: string; className?: string }) {
  return (
    <header className={cx("sticky top-0 z-40 flex items-center gap-3 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-md", className)}>
      {backHref ? (
        <Link href={backHref} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600" aria-label="Kembali">
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : null}
      <h1 className="text-xl font-black text-slate-900">{title}</h1>
    </header>
  );
}
