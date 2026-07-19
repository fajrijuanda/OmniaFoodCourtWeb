"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalPanel } from "./PortalPanel";

export function StatCard({ label, value, caption, icon: Icon, tone = "primary", className = "" }: StatDefinition & { className?: string }) {
  return (
    <PortalPanel className={cx("p-5", className)}>
      {Icon ? (
        <div className={cx("grid h-11 w-11 place-items-center rounded-2xl", toneClasses[tone].soft, toneClasses[tone].text)}>
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <p className={cx(Icon ? "mt-5" : "", "text-3xl font-black text-[#172033]")}>{value}</p>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      {caption ? <p className="mt-2 text-xs font-bold leading-5 text-slate-500">{caption}</p> : null}
    </PortalPanel>
  );
}
