"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalBadge } from "./PortalBadge";

export function ModuleCard({ module, onLockedModule, className = "" }: { module: ModuleDefinition; onLockedModule?: (module: ModuleDefinition) => void; className?: string }) {
  if (module.status === "hidden") return null;
  const Icon = module.icon;
  const locked = module.status === "locked" || module.status === "upgrade-only";
  const disabled = module.status === "disabled";
  return (
    <button
      onClick={() => locked ? onLockedModule?.(module) : module.onOpen?.()}
      disabled={disabled}
      className={cx(
        "group min-h-[104px] rounded-[14px] border p-3 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[140px] sm:rounded-[16px]",
        locked ? "border-dashed border-slate-200 bg-slate-50" : "border-slate-100 bg-white shadow-sm",
        className
      )}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-[12px]", locked ? "bg-slate-200 text-slate-400" : "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]")}>
          {Icon ? <Icon className="h-5 w-5" /> : locked ? <Lock className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </span>
        {locked ? <Lock className="h-4 w-4 text-slate-400" /> : null}
      </div>
      <h3 className="mt-3 text-sm font-black text-[#172033] sm:text-base">{module.title}</h3>
      {module.caption ? <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-500">{module.caption}</p> : null}
      {module.badge ? <PortalBadge tone={locked ? "slate" : "primary"} className="mt-3">{module.badge}</PortalBadge> : null}
    </button>
  );
}
