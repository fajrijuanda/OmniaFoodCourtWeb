"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function AdminHeader({ eyebrow = "Superadmin", title, icon: Icon, actions }: { eyebrow?: string; title: string; icon?: LucideIcon; actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-orange-500 text-sm font-black text-white">
            {Icon ? <Icon className="h-5 w-5" /> : <BrandLogo className="h-10 w-10" />}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">{eyebrow}</p>
            <h1 className="text-2xl font-black">{title}</h1>
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
