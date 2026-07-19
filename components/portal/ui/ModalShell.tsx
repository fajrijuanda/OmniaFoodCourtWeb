"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { IconButton } from "./IconButton";

export function ModalShell({ open, onClose, title, eyebrow, children, footer, className = "" }: { open: boolean; onClose: () => void; title?: string; eyebrow?: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/55 p-0 sm:p-5 backdrop-blur-sm" onMouseDown={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24 }}
            className={cx("flex flex-col w-full h-[100dvh] sm:h-auto max-w-lg sm:max-h-[calc(100dvh-2.5rem)] overflow-hidden rounded-none sm:rounded-[24px] bg-white sm:shadow-[0_30px_100px_rgba(15,23,42,0.28)]", className)}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {(title || eyebrow) ? (
              <div className="shrink-0 flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                <div>
                  {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--portal-primary)]">{eyebrow}</p> : null}
                  {title ? <h2 className="mt-2 text-2xl font-black text-[#172033]">{title}</h2> : null}
                </div>
                <IconButton icon={X} label="Tutup" onClick={onClose} />
              </div>
            ) : null}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 no-scrollbar">{children}</div>
            {footer ? <div className="border-t border-slate-100 p-5 sm:p-6">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
