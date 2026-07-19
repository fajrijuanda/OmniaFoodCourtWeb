"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";

type PortalButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: LucideIcon;
  loading?: boolean;
};

export function PortalButton({ href, variant = "primary", icon: Icon, loading = false, className = "", children, disabled, ...props }: PortalButtonProps) {
  const variants = {
    primary: "bg-[var(--portal-primary)] text-[var(--portal-on-primary)] hover:bg-[var(--portal-primary-dark)]",
    secondary: "border border-[var(--portal-border)] bg-white text-[#172033] hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-500 text-white hover:bg-rose-600"
  };
  const classes = cx(
    "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition disabled:pointer-events-none disabled:opacity-50 sm:min-h-10 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
    variants[variant],
    className
  );
  const content = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </>
  );

  if (href) {
    return <Link href={href} className={classes}>{content}</Link>;
  }

  return <button className={classes} disabled={disabled || loading} {...props}>{content}</button>;
}
