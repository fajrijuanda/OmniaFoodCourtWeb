"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { SkeletonBlock } from "./SkeletonBlock";
import { SkeletonGrid } from "./SkeletonGrid";

export function PortalContentSkeleton({ page = "default" }: { page?: "home" | "feature" | "default" }) {
  if (page === "home") {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1.55fr_1fr]">
          <SkeletonBlock className="min-h-[220px] sm:min-h-[390px]" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <SkeletonBlock className="min-h-[108px] sm:min-h-[187px]" />
            <SkeletonBlock className="min-h-[108px] sm:min-h-[187px]" />
          </div>
        </div>
        <SkeletonBlock className="h-56 rounded-[18px] sm:h-80 sm:rounded-[24px]" />
      </div>
    );
  }
  if (page === "feature") {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-28 rounded-[18px] sm:h-40 sm:rounded-[24px]" />
        <SkeletonGrid />
        <SkeletonBlock className="h-80 rounded-[24px]" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-28 rounded-[18px] sm:h-40 sm:rounded-[24px]" />
      <SkeletonGrid count={8} />
      <SkeletonBlock className="h-56 rounded-[18px] sm:h-80 sm:rounded-[24px]" />
    </div>
  );
}
