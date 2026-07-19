"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { IconButton } from "./IconButton";

export function QuantityStepper({ value, onDecrease, onIncrease }: { value: number; onDecrease: () => void; onIncrease: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <IconButton icon={Minus} label="Kurangi" onClick={onDecrease} className="h-8 w-8" />
      <span className="w-4 text-center font-bold">{value}</span>
      <IconButton icon={Plus} label="Tambah" onClick={onIncrease} className="h-8 w-8" />
    </div>
  );
}
