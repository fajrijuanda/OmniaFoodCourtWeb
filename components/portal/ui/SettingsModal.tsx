"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { ModalShell } from "./ModalShell";

export function SettingsModal(props: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  return <ModalShell {...props} eyebrow="Settings" />;
}
