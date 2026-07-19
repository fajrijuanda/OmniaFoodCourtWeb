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

export function HrisDashboardWorkspace() {
  const weeklyAttendance = [82, 88, 76, 91, 95, 74, 89];
  const payrollBars = [78, 62, 88, 70, 92, 66, 74, 86];
  const departmentMix = [["Operations", "28", 86, "bg-[var(--portal-primary)]"], ["People", "12", 64, "bg-cyan-400"], ["Finance", "9", 52, "bg-emerald-400"], ["Product", "18", 78, "bg-violet-500"]];
  const approvalQueue = [["Leave Approval", "4 pending", "People", "bg-orange-50 text-orange-600"], ["Payroll Review", "7 draft rows", "Finance", "bg-violet-50 text-violet-600"], ["Data Update", "3 employee profiles", "HR Admin", "bg-cyan-50 text-cyan-600"], ["Field Report", "2 GPS exceptions", "Operations", "bg-rose-50 text-rose-600"]];
  const activityTimeline: Array<[string, string, string, LucideIcon]> = [["Payroll Mei disiapkan", "75 karyawan masuk draft payroll", "12 min ago", WalletCards], ["Device attendance sync", "68 present, 5 late, 2 leave", "45 min ago", CalendarCheck2], ["Leave request approved", "Nadia Safira - Permit", "2 hr ago", ShieldCheck], ["Recruitment shortlist", "5 kandidat masuk interview", "Yesterday", UserSearch]];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr_0.95fr]">
        <section className="relative min-h-[230px] overflow-hidden rounded-[24px] bg-[#111827] p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.12)] sm:p-6">
          <div className="absolute right-6 top-6 grid h-20 w-20 place-items-center rounded-[28px] bg-white lg:bg-white/10 text-white backdrop-blur"><UsersRound className="h-9 w-9" /></div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/58">HR command center</p>
          <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight">75 karyawan aktif, 92% attendance health.</h2>
          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-white/62">Ringkasan operasional HRIS dari employee database, attendance, leave approval, payroll, payslip, field report, performance, dan recruitment.</p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["68", "Present"], ["5", "Late"], ["4", "Leave pending"], ["Rp428jt", "Payroll draft"]].map(([value, label]) => <div key={label} className="rounded-[16px] bg-white lg:bg-white/10 p-3"><p className="text-xl font-black">{value}</p><p className="mt-1 text-[11px] font-bold text-white/55">{label}</p></div>)}</div>
        </section>

        <section className="rounded-[24px] border border-[var(--portal-border)] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-[#172033]">Attendance Trend</p><p className="mt-1 text-xs font-bold text-slate-400">Last 7 days</p></div><span className="rounded-[8px] bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">+4.8%</span></div>
          <div className="mt-7 flex h-28 items-end gap-2">{weeklyAttendance.map((height, index) => <span key={index} className="flex-1 rounded-t-full bg-[var(--portal-primary-soft)]"><span className="block rounded-t-full bg-[var(--portal-primary)]" style={{ height: `${height}%` }} /></span>)}</div>
          <div className="mt-4 flex justify-between text-[10px] font-black text-slate-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>
        </section>

        <section className="rounded-[24px] border border-[var(--portal-border)] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-[#172033]">Leave Balance</p><p className="mt-1 text-xs font-bold text-slate-400">Team average</p></div><span className="rounded-[8px] bg-cyan-50 px-2.5 py-1 text-xs font-black text-cyan-600">18 days</span></div>
          <div className="relative mx-auto mt-7 grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(var(--portal-primary)_0_72%,#e2e8f0_72%_100%)]"><div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center"><p className="text-3xl font-black text-[#172033]">72%</p><p className="text-[10px] font-black text-slate-400">healthy</p></div></div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.2fr_0.95fr]">
        <section className="rounded-[24px] border border-[var(--portal-border)] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]"><p className="text-sm font-black text-[#172033]">Department Mix</p><p className="mt-1 text-xs font-bold text-slate-400">Headcount by function</p><div className="mt-5 space-y-4">{departmentMix.map(([name, count, width, color]) => <div key={String(name)}><div className="flex items-center justify-between text-xs font-black"><span className="text-slate-600">{name}</span><span className="text-[#172033]">{count}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} /></div></div>)}</div></section>
        <section className="rounded-[24px] border border-[var(--portal-border)] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-[#172033]">Payroll Overview</p><p className="mt-1 text-xs font-bold text-slate-400">Gross, deduction, and payout health</p></div><span className="rounded-[8px] bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">+8.2%</span></div><div className="mt-7 flex h-44 items-end gap-4">{payrollBars.map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><span className="w-full rounded-full bg-[var(--portal-primary)]" style={{ height: `${height}%` }} /><span className="w-full rounded-full bg-slate-300" style={{ height: `${Math.max(18, height - 44)}%` }} /></div>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Rp428jt", "Gross payroll", "text-[#172033]"], ["Rp31jt", "Deduction", "text-rose-500"], ["68", "Payslip published", "text-emerald-600"]].map(([value, label, color]) => <div key={label} className="rounded-[16px] bg-slate-50 p-3"><p className={`text-lg font-black ${color}`}>{value}</p><p className="text-[11px] font-bold text-slate-400">{label}</p></div>)}</div></section>
        <section className="rounded-[24px] border border-[var(--portal-border)] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]"><p className="text-sm font-black text-[#172033]">Approval Queue</p><p className="mt-1 text-xs font-bold text-slate-400">Items that need owner attention</p><div className="mt-5 space-y-3">{approvalQueue.map(([title, count, owner, badge]) => <div key={title} className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-100 p-3"><div><p className="text-sm font-black text-[#172033]">{title}</p><p className="mt-0.5 text-xs font-bold text-slate-400">{owner}</p></div><span className={`rounded-[8px] px-2.5 py-1 text-[10px] font-black ${badge}`}>{count}</span></div>)}</div></section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.35fr]">
        <section className="rounded-[24px] border border-[var(--portal-border)] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]"><p className="text-sm font-black text-[#172033]">Activity Timeline</p><p className="mt-1 text-xs font-bold text-slate-400">Latest HRIS activity</p><div className="mt-5 space-y-4">{activityTimeline.map(([title, body, time, Icon], index) => { const ActivityIcon = Icon; return <div key={title} className="relative flex gap-3">{index < activityTimeline.length - 1 ? <span className="absolute left-5 top-11 h-8 w-px bg-slate-100" /> : null}<span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]"><ActivityIcon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-3"><span className="text-sm font-black text-[#172033]">{title}</span><span className="shrink-0 text-[10px] font-bold text-slate-400">{time}</span></span><span className="mt-1 block text-xs font-bold leading-5 text-slate-500">{body}</span></span></div>; })}</div></section>
        <section className="overflow-hidden rounded-[24px] border border-[var(--portal-border)] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5"><div><p className="text-sm font-black text-[#172033]">People Priority List</p><p className="mt-1 text-xs font-bold text-slate-400">Employees requiring review</p></div><button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button">Open database</button></div><div className="divide-y divide-slate-100">{[["Dimas Ardi", "Probation review", "Product", "56%", "bg-violet-500"], ["Raka Pratama", "Late attendance trend", "Finance", "42%", "bg-orange-500"], ["Nadia Safira", "Payslip waiting payroll", "Operations", "72%", "bg-cyan-500"], ["Mira Lestari", "Leave balance low", "Sales", "34%", "bg-rose-500"]].map(([name, issue, department, progress, color]) => <div key={name} className="grid gap-3 p-4 sm:grid-cols-[1fr_0.75fr_0.8fr] sm:items-center"><div><p className="text-sm font-black text-[#172033]">{name}</p><p className="mt-1 text-xs font-bold text-slate-400">{issue}</p></div><span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">{department}</span><div className="flex items-center gap-3"><div className="h-2 flex-1 rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: progress }} /></div><span className="text-xs font-black text-slate-500">{progress}</span></div></div>)}</div></section>
      </div>
    </div>
  );
}
