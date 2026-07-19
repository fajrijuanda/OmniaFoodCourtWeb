"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalPanel } from "./PortalPanel";
import { PortalButton } from "./PortalButton";

export function UpgradePrompt({ title = "Upgrade dibutuhkan", body, onUpgrade }: { title?: string; body?: string; onUpgrade?: () => void }) {
  return (
    <PortalPanel className="border-dashed p-5">
      <Lock className="h-6 w-6 text-[var(--portal-primary)]" />
      <h3 className="mt-3 text-lg font-black text-[#172033]">{title}</h3>
      {body ? <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{body}</p> : null}
      {onUpgrade ? <PortalButton className="mt-4" onClick={onUpgrade}>Lihat paket</PortalButton> : null}
    </PortalPanel>
  );
}
