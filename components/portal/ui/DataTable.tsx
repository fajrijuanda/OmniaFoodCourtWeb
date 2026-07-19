"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { EmptyState } from "./EmptyState";

export type DataTableColumn<T> = {
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({ rows, columns, rowKey, gridTemplateColumns = "1fr 1fr 1fr" }: { rows: T[]; columns: DataTableColumn<T>[]; rowKey: (row: T) => string; gridTemplateColumns?: string }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-slate-100 sm:rounded-[20px]">
      <div
        className="hidden bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 md:grid md:[grid-template-columns:var(--table-grid)]"
        style={{ "--table-grid": gridTemplateColumns } as CSSProperties}
      >
        {columns.map((column) => <span key={column.label}>{column.label}</span>)}
      </div>
      {rows.map((row) => (
        <div
          key={rowKey(row)}
          className="grid grid-cols-2 gap-x-2 gap-y-3 border-t border-slate-100 p-4 text-sm sm:grid-cols-3 md:grid-cols-none md:items-center md:[grid-template-columns:var(--table-grid)]"
          style={{ "--table-grid": gridTemplateColumns } as CSSProperties}
        >
          {columns.map((column) => (
            <div key={column.label} className={column.className}>
              <span className="mb-0.5 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 md:hidden">{column.label}</span>
              {column.render(row)}
            </div>
          ))}
        </div>
      ))}
      {rows.length === 0 ? <EmptyState title="Tidak ada data yang cocok." className="rounded-none border-0" /> : null}
    </div>
  );
}
