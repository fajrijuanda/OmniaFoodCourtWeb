"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { SkeletonBlock } from "./SkeletonBlock";

export function SkeletonGrid({ count = 4, className = "" }: { count?: number; className?: string }) {
  return <div className={cx("grid gap-3 md:grid-cols-2 xl:grid-cols-4", className)}>{Array.from({ length: count }).map((_, index) => <SkeletonBlock key={index} className="h-32" />)}</div>;
}
