"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { EmptyState } from "./EmptyState";
import { PortalButton } from "./PortalButton";

export function LockedState({ title = "Fitur terkunci", body = "Upgrade paket untuk membuka modul ini.", onUpgrade }: { title?: string; body?: string; onUpgrade?: () => void }) {
  return <EmptyState icon={Lock} title={title} body={body} action={onUpgrade ? <PortalButton onClick={onUpgrade}>Upgrade</PortalButton> : null} />;
}
