"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowRight, Banknote, CalendarCheck2,
  CheckCircle2, ClipboardCheck, Clock3, Download, Filter,
  Landmark, Lock, Percent, Plus, RefreshCw, Search, ShieldCheck,
  SlidersHorizontal, Sparkles, TrendingUp, UserPlus, UserSearch,
  UsersRound, WalletCards, X, XCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PortalDataTable } from "@/components/portal/ui";
import { attendanceRows, employeeRows, payrollRows, payslipRows } from "../hrisData";
import type { LeaveRequest } from "../hrisTypes";

export function LockedDashboardWorkspace({ onLockedModule }: { onLockedModule: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Business upgrade</p>
        <h2 className="mt-2 text-3xl font-black text-[#172033]">Dashboard analytics belum termasuk tier Growth.</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-slate-500">Modul ini tetap terlihat agar karyawan paham opsi upgrade, tapi tidak bisa dibuka sebelum owner menaikkan tier.</p>
        <button onClick={onLockedModule} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
          Lihat opsi upgrade <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6">
        <Lock className="h-8 w-8 text-slate-400" />
        <div className="mt-8 flex h-36 items-end gap-2 opacity-40">{[42, 70, 54, 88, 62, 76].map((height, index) => <span key={index} className="flex-1 rounded-t-full bg-slate-400" style={{ height: `${height}%` }} />)}</div>
      </div>
    </div>
  );
}
