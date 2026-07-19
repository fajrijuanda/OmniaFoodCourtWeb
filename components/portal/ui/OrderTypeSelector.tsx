"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { SegmentedControl } from "./SegmentedControl";

export function OrderTypeSelector<T extends string>(props: { value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void }) {
  return <SegmentedControl {...props} />;
}
