"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalBadge } from "./PortalBadge";

export function PlanBadge({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return <PortalBadge tone={active ? "primary" : "slate"} className="uppercase tracking-[0.12em]">{children}</PortalBadge>;
}
