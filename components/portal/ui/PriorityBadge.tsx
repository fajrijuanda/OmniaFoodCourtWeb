"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { PortalBadge } from "./PortalBadge";

export function PriorityBadge({ priority }: { priority: string }) {
  const tone: Tone = priority === "high" ? "rose" : priority === "medium" ? "amber" : "slate";
  return <PortalBadge tone={tone} className="uppercase">{priority}</PortalBadge>;
}
