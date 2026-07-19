"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalBadge } from "./PortalBadge";

export function StatusBadge({ status, tone, className = "" }: { status: string; tone?: Tone; className?: string }) {
  const normalized = status.toLowerCase();
  const resolvedTone = tone ?? (
    normalized.includes("paid") || normalized.includes("active") || normalized.includes("approved") || normalized.includes("subscribed")
      ? "emerald"
      : normalized.includes("pending") || normalized.includes("trial") || normalized.includes("medium")
        ? "amber"
        : normalized.includes("rejected") || normalized.includes("expired") || normalized.includes("high")
          ? "rose"
          : "slate"
  );
  return <PortalBadge tone={resolvedTone} className={cx("capitalize", className)}>{status}</PortalBadge>;
}
