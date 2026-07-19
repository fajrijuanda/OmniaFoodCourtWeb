"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function PortalPanel({ children, className = "", interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div
      className={cx(
        "rounded-[16px] border border-[var(--portal-border)] bg-white p-3.5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:rounded-[24px] sm:p-7",
        interactive && "transition hover:-translate-y-0.5 hover:border-[var(--portal-primary)] hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}
