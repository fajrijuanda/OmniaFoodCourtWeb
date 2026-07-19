"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

export function LoadingState({ label = "Memuat data...", className = "" }: { label?: string; className?: string }) {
  return <div className={cx("rounded-2xl bg-slate-50 p-5 text-center text-sm font-black text-slate-400", className)}><Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />{label}</div>;
}
