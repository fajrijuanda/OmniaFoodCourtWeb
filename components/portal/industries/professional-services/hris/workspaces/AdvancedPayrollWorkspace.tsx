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

const advancedPayrollRows = [
  { employee: "Alya Putri", department: "People", ptkp: "TK/0", gross: "Rp8.900.000", bpjs: "Rp356.000", pph21: "Rp311.500", custom: "-", net: "Rp8.232.500", status: "Ready" },
  { employee: "Raka Pratama", department: "Finance", ptkp: "K/0", gross: "Rp9.700.000", bpjs: "Rp388.000", pph21: "Rp339.500", custom: "Rp125.000", net: "Rp8.847.500", status: "Review" },
  { employee: "Nadia Safira", department: "Operations", ptkp: "TK/1", gross: "Rp10.600.000", bpjs: "Rp424.000", pph21: "Rp371.000", custom: "-", net: "Rp9.805.000", status: "Ready" },
  { employee: "Dimas Ardi", department: "Product", ptkp: "TK/0", gross: "Rp12.000.000", bpjs: "Rp480.000", pph21: "Rp420.000", custom: "Rp150.000", net: "Rp10.950.000", status: "Ready" },
  { employee: "Mira Lestari", department: "Sales", ptkp: "K/1", gross: "Rp8.250.000", bpjs: "Rp330.000", pph21: "Rp288.750", custom: "-", net: "Rp7.631.250", status: "Ready" }
];

export function AdvancedPayrollWorkspace() {
  const [simulation, setSimulation] = useState({ gross: 12000000, paidDays: 18, customDeduction: 150000 });
  const workDays = 22;
  const prorateGross = Math.round(simulation.gross * (simulation.paidDays / workDays));
  const bpjs = Math.round(Math.min(prorateGross, 12000000) * 0.01);
  const jht = Math.round(prorateGross * 0.02);
  const pph21 = Math.round(Math.max(0, prorateGross - 5400000) * 0.05);
  const net = prorateGross - bpjs - jht - pph21 - simulation.customDeduction;
  const formatCurrency = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

  const ruleCards = [
    { title: "BPJS Kesehatan", value: "1% employee", caption: "Company 4%, cap Rp12jt", icon: ShieldCheck, tone: "bg-emerald-50 text-emerald-600" },
    { title: "JHT", value: "2% employee", caption: "Company 3.7%, uncapped", icon: Landmark, tone: "bg-cyan-50 text-cyan-600" },
    { title: "Jaminan Pensiun", value: "1% employee", caption: "Company 2%, cap aktif", icon: Banknote, tone: "bg-violet-50 text-violet-600" },
    { title: "PPh 21 TER", value: "Auto tax", caption: "PTKP dan TER monthly", icon: Percent, tone: "bg-orange-50 text-orange-600" }
  ];

  const componentCards = [
    ["Basic Salary", "Earning", "Taxable", "Rp8.500.000"],
    ["Transport Allowance", "Earning", "Taxable", "Rp750.000"],
    ["Meal Allowance", "Earning", "Taxable", "Rp650.000"],
    ["Late Penalty", "Deduction", "Non-tax", "Rp125.000"],
    ["Overtime Multiplier", "Formula", "Auto", "1.5x - 2x"],
    ["Prorate Join/Resign", "Formula", "Auto", "Calendar days"]
  ];

  const approvalFlow = [
    ["Formula review", "HR Admin", "Completed", CheckCircle2, "text-emerald-600 bg-emerald-50"],
    ["Tax validation", "Finance", "Completed", CheckCircle2, "text-emerald-600 bg-emerald-50"],
    ["Owner approval", "Owner Tenant", "Pending", Clock3, "text-orange-600 bg-orange-50"],
    ["Payslip publish", "System", "Waiting", AlertTriangle, "text-slate-500 bg-slate-50"]
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Advanced Payroll Control</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Kelola formula BPJS, PPh 21, prorate, komponen custom, dan approval payroll Mei 2026.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-black text-slate-600" type="button">
            <RefreshCw className="h-4 w-4" /> Recalculate
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
            <ClipboardCheck className="h-4 w-4" /> Submit approval
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-[24px] bg-[#111827] p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">Payroll engine</p>
              <h3 className="mt-3 max-w-xl text-3xl font-black leading-tight">Rp428,5jt gross payroll siap divalidasi.</h3>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/62">Engine menghitung BPJS, JHT, JP, PPh 21 TER, prorate join/resign, deduction manual, dan salary component custom.</p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] bg-white/10 text-orange-200">
              <SlidersHorizontal className="h-7 w-7" />
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[["75", "Employee included"], ["Rp31,8jt", "Statutory deduction"], ["5", "Need review"], ["98%", "Formula health"]].map(([value, label]) => (
              <div key={label} className="rounded-[16px] bg-white/10 p-3">
                <p className="text-xl font-black">{value}</p>
                <p className="mt-1 text-[11px] font-bold text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#172033]">Prorate simulator</p>
              <p className="mt-1 text-xs font-bold text-slate-400">Preview join/resign mid-period</p>
            </div>
            <TrendingUp className="h-5 w-5 text-[var(--portal-primary)]" />
          </div>
          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-500">Gross salary</span>
              <input type="number" value={simulation.gross} onChange={(event) => setSimulation((current) => ({ ...current, gross: Number(event.target.value) }))} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-500">Paid days</span>
                <input type="number" min={1} max={22} value={simulation.paidDays} onChange={(event) => setSimulation((current) => ({ ...current, paidDays: Number(event.target.value) }))} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black text-slate-500">Custom deduction</span>
                <input type="number" value={simulation.customDeduction} onChange={(event) => setSimulation((current) => ({ ...current, customDeduction: Number(event.target.value) }))} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
              </label>
            </div>
          </div>
          <div className="mt-5 rounded-[18px] bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm font-black"><span>Prorate gross</span><span>{formatCurrency(prorateGross)}</span></div>
            <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500">
              <span>BPJS: {formatCurrency(bpjs)} | JHT: {formatCurrency(jht)}</span>
              <span>PPh 21: {formatCurrency(pph21)} | Net: <b className="text-[#172033]">{formatCurrency(net)}</b></span>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {ruleCards.map((rule) => {
          const Icon = rule.icon;
          return (
            <section key={rule.title} className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm">
              <span className={`grid h-11 w-11 place-items-center rounded-[15px] ${rule.tone}`}><Icon className="h-5 w-5" /></span>
              <p className="mt-4 text-sm font-black text-[#172033]">{rule.title}</p>
              <p className="mt-2 text-2xl font-black text-[#172033]">{rule.value}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{rule.caption}</p>
            </section>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.2fr]">
        <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#172033]">Salary components</h3>
              <p className="mt-1 text-xs font-bold text-slate-500">Komponen earning, deduction, dan formula custom.</p>
            </div>
            <button className="rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black text-[var(--portal-primary)]" type="button">Add component</button>
          </div>
          <div className="mt-5 grid gap-2">
            {componentCards.map(([name, type, tax, amount]) => (
              <div key={name} className="grid grid-cols-[1fr_auto] gap-3 rounded-[16px] border border-slate-100 p-3">
                <div>
                  <p className="text-sm font-black text-[#172033]">{name}</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-400">{type} - {tax}</p>
                </div>
                <p className="text-sm font-black text-[#172033]">{amount}</p>
              </div>
            ))}
          </div>
        </section>

        <PortalDataTable
          rows={advancedPayrollRows}
          rowKey={(row) => row.employee}
          searchPlaceholder="Cari karyawan, PTKP, department..."
          getSearchText={(row) => `${row.employee} ${row.department} ${row.ptkp} ${row.status}`}
          gridTemplateColumns="1.05fr 0.65fr 0.75fr 0.75fr 0.75fr 0.8fr 0.65fr"
          columns={[
            { label: "Employee", render: (row) => <div><p className="text-sm font-black text-[#172033]">{row.employee}</p><p className="text-xs font-bold text-slate-500">{row.department} - {row.ptkp}</p></div> },
            { label: "Gross", render: (row) => <p className="text-xs font-black text-[#172033]">{row.gross}</p> },
            { label: "BPJS", render: (row) => <p className="text-xs font-bold text-slate-500">{row.bpjs}</p> },
            { label: "PPh 21", render: (row) => <p className="text-xs font-bold text-slate-500">{row.pph21}</p> },
            { label: "Custom", render: (row) => <p className="text-xs font-bold text-rose-500">{row.custom}</p> },
            { label: "Net", render: (row) => <p className="text-xs font-black text-[#172033]">{row.net}</p> },
            { label: "Status", render: (row) => <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${row.status === "Ready" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>{row.status}</span> }
          ]}
        />
      </div>

      <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-black text-[#172033]">Approval & audit trail</h3>
            <p className="mt-1 text-xs font-bold text-slate-500">Kontrol perubahan formula, validasi tax, dan publikasi payslip.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600" type="button">
            <Download className="h-4 w-4" /> Export audit
          </button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          {approvalFlow.map(([step, owner, status, Icon, tone]) => (
            <div key={step} className="rounded-[18px] border border-slate-100 bg-slate-50 p-4">
              <span className={`grid h-10 w-10 place-items-center rounded-[14px] ${tone}`}><Icon className="h-5 w-5" /></span>
              <p className="mt-3 text-sm font-black text-[#172033]">{step}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{owner}</p>
              <p className="mt-3 w-fit rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">{status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
