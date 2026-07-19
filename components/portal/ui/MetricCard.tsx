"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalPanel } from "./PortalPanel";
import { PortalBadge } from "./PortalBadge";

export function MetricCard({ label, value, caption, trend, icon: Icon, tone = "primary", className = "" }: StatDefinition & { className?: string }) {
  return (
    <PortalPanel className={cx("relative min-h-[108px] overflow-hidden p-3 sm:min-h-[156px] sm:p-5", className)}>
      {Icon ? (
        <div className={cx("absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-[12px] sm:right-5 sm:top-5 sm:h-11 sm:w-11 sm:rounded-[14px]", toneClasses[tone].soft, toneClasses[tone].text)}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      ) : null}
      <p className="max-w-[72%] text-[11px] font-black text-slate-500 sm:text-sm">{label}</p>
      <p className="mt-3 text-xl font-black leading-none text-[#172033] sm:mt-6 sm:text-3xl">{value}</p>
      {(trend || caption) ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-4 sm:gap-2">
          {trend ? <PortalBadge tone={tone} className="rounded-[8px] px-2 py-1 text-[10px] sm:px-2.5 sm:text-xs">{trend}</PortalBadge> : null}
          {caption ? <span className="text-[11px] font-bold text-slate-400 sm:text-xs">{caption}</span> : null}
        </div>
      ) : null}
    </PortalPanel>
  );
}
