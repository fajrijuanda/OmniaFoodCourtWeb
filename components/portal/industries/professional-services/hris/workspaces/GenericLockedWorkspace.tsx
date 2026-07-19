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

export function GenericLockedWorkspace({ featureName }: { featureName: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-indigo-500 shadow-sm">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-black text-[#172033]">{featureName}</h3>
      <p className="mt-3 max-w-md text-sm font-bold leading-6 text-slate-500">
        Fitur ini sudah disiapkan di interface portal dan siap diintegrasikan dengan database backend Omnia.
      </p>
      <button className="mt-6 rounded-full bg-[var(--portal-primary)] px-6 py-2.5 text-sm font-black text-[var(--portal-on-primary)] shadow-sm" type="button">
        Jelajahi Konfigurasi
      </button>
    </div>
  );
}
