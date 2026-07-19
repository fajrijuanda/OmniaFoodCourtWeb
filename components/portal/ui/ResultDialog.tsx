"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { ModalShell } from "./ModalShell";

export function ResultDialog({ open, title, description, type = "success", onClose }: { open: boolean; title: string; description: string; type?: "success" | "error"; onClose: () => void }) {
  return (
    <ModalShell open={open} onClose={onClose} title={title} eyebrow={type === "success" ? "Berhasil" : "Gagal"}>
      <div className="flex gap-4">
        <span className={cx("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
          {type === "success" ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        </span>
        <p className="text-sm font-bold leading-6 text-slate-500">{description}</p>
      </div>
    </ModalShell>
  );
}
