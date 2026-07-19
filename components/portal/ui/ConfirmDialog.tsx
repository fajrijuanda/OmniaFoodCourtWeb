"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { ModalShell } from "./ModalShell";
import { PortalButton } from "./PortalButton";

export function ConfirmDialog({ open, title, body, confirmLabel = "Konfirmasi", cancelLabel = "Batal", onConfirm, onClose }: { open: boolean; title: string; body?: string; confirmLabel?: string; cancelLabel?: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <ModalShell open={open} onClose={onClose} title={title} eyebrow="Konfirmasi" footer={
      <div className="flex gap-3">
        <PortalButton variant="secondary" className="flex-1" onClick={onClose}>{cancelLabel}</PortalButton>
        <PortalButton className="flex-1" onClick={onConfirm}>{confirmLabel}</PortalButton>
      </div>
    }>
      {body ? <p className="text-sm font-bold leading-6 text-slate-500">{body}</p> : null}
    </ModalShell>
  );
}
