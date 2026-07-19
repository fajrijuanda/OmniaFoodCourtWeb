"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx } from "./utils";

export function SettingsSection({
  icon: Icon,
  title,
  caption,
  children,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  caption: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5", className)}>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-black text-[#172033]">{title}</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{caption}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
