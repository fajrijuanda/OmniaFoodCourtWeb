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

export function FeatureCard({ title, caption, icon: Icon, badge, tone = "primary", className = "" }: { title: string; caption?: string; icon?: LucideIcon; badge?: string; tone?: Tone; className?: string }) {
  return (
    <PortalPanel className={cx("p-4", className)} interactive>
      {Icon ? <span className={cx("grid h-10 w-10 place-items-center rounded-[14px]", toneClasses[tone].soft, toneClasses[tone].text)}><Icon className="h-5 w-5" /></span> : null}
      {badge ? <PortalBadge tone={tone} className="mt-4">{badge}</PortalBadge> : null}
      <p className="mt-4 text-sm font-black text-[#172033]">{title}</p>
      {caption ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{caption}</p> : null}
    </PortalPanel>
  );
}
