"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function IconButton({ icon: Icon, label, className = "", tone = "slate", ...props }: ComponentPropsWithoutRef<"button"> & { icon: LucideIcon; label: string; tone?: Tone }) {
  return (
    <button
      className={cx("grid h-10 w-10 place-items-center rounded-full transition disabled:opacity-50", toneClasses[tone].soft, toneClasses[tone].text, className)}
      type="button"
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
