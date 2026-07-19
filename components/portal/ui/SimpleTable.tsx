"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronLeft, Loader2, Lock, Minus, Plus, Search, X } from "lucide-react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx, toneClasses } from "./utils";
import type { ModuleDefinition, StatDefinition, Tone } from "./types";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

export function SimpleTable({ rows, statusColumns = ["status", "Status"] }: { rows: Array<Record<string, string | number>>; statusColumns?: string[] }) {
  const columns = Object.keys(rows[0] ?? {});
  if (!columns.length) return <EmptyState title="Belum ada data." />;
  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-100 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            <tr>{columns.map((column) => <th key={column} className="px-4 py-3">{column.replace(/([A-Z])/g, " $1")}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="px-4 py-4 text-xs font-bold text-slate-600 sm:text-sm">
                    {statusColumns.includes(column) ? <StatusBadge status={String(row[column])} tone="primary" /> : row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
