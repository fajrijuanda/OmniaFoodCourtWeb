"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalPanel } from "./PortalPanel";

export function PageHeader({ eyebrow, title, body, icon: Icon, actions, className = "" }: { eyebrow?: string; title: string; body?: string; icon?: LucideIcon; actions?: ReactNode; className?: string }) {
  return (
    <PortalPanel className={cx("p-5 sm:p-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          {Icon ? (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] bg-[var(--portal-primary)] text-[var(--portal-on-primary)] shadow-[0_16px_38px_rgba(15,23,42,0.12)] sm:h-14 sm:w-14 sm:rounded-[20px]">
              <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--portal-primary)] sm:text-xs sm:tracking-[0.22em]">{eyebrow}</p> : null}
            <h1 className="mt-1.5 text-2xl font-black text-[#172033] sm:mt-2 sm:text-4xl">{title}</h1>
            {body ? <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500">{body}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </PortalPanel>
  );
}
