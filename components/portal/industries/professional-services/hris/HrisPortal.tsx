"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Lock
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel } from "@/components/portal/ui";
import type { PortalPage, PortalRole } from "../../../portalTypes";
import { HrisMetricCard } from "./components/HrisMetricCard";
import {
  buildHrisFeatureMeta,
  hrisCatalogModules,
  hrisTierConfigs,
  initialLeaveRequests,
  tierRank
} from "./hrisData";
import type { HrisCatalogModule, HrisStatTuple, HrisTier, LeaveRequest } from "./hrisTypes";
import {
  AdvancedPayrollWorkspace,
  LockedDashboardWorkspace,
} from "./workspaces/HrisWorkspaces";
import {
  AttendanceWorkspace,
  EmployeesWorkspace,
  LoansWorkspace,
  LeaveWorkspace,
  PayrollWorkspace,
  PayslipWorkspace
} from "./workspaces";
import {
  FieldReportWorkspace,
  HrisDashboardLiveWorkspace,
  PerformanceWorkspace,
  RecruitmentWorkspace,
  ReimbursementWorkspace
} from "./workspaces/ProposalFeatureWorkspaces";

export type { HrisTier } from "./hrisTypes";

export function HrisOverviewPage({ role, setActivePage, tier, onLockedModule }: { role: PortalRole; setActivePage: (page: PortalPage) => void; onLockedModule: () => void; tier: HrisTier }) {
  const effectiveTier: HrisTier = role === "developer" ? "enterprise" : tier;
  const config = hrisTierConfigs[effectiveTier];
  const unlockedModules = hrisCatalogModules.filter((module) => tierRank[module.minimumTier] <= tierRank[effectiveTier]);
  const lockedModules = hrisCatalogModules.filter((module) => tierRank[module.minimumTier] > tierRank[effectiveTier]);
  const launcherModules = hrisCatalogModules.filter((module) => module.route);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">HRIS tier preview</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-4xl">HRIS {config.name}</h1>
            <p className="mt-2 max-w-2xl text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">{config.caption}</p>
          </div>
          <div className="rounded-[16px] bg-[var(--portal-primary-soft)] px-4 py-3 sm:rounded-[20px] sm:px-5 sm:py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--portal-primary)] sm:text-xs">Limit</p>
            <p className="mt-1 text-xl font-black text-[#172033] sm:text-2xl">{config.employeeLimit}</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          [effectiveTier === "starter" ? "25" : effectiveTier === "growth" ? "75" : effectiveTier === "pro" ? "250" : "Custom", "Karyawan", hrisCatalogModules[1].icon],
          [String(unlockedModules.length), "Modul terbuka", CheckCircle2],
          [String(lockedModules.length), "Modul terkunci", Lock],
          [config.price, "Harga tier", hrisCatalogModules[7].icon]
        ].map(([value, label, Icon]) => (
          <HrisMetricCard key={label as string} value={value as string} label={label as string} Icon={Icon as LucideIcon} />
        ))}
      </div>

      <Panel>
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Fitur HRIS {config.name}</h2>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Kiri menampilkan launcher halaman HRIS. Kanan merangkum fitur terbuka dan fitur terkunci dalam card ringkas.
            </p>
          </div>
          <button onClick={() => setActivePage("professional-services")} className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600" type="button">
            Kembali ke overview
          </button>
        </div>

        <div className="grid gap-3 sm:gap-5 xl:grid-cols-2">
          <HrisLauncherPanel modules={launcherModules} effectiveTier={effectiveTier} setActivePage={setActivePage} onLockedModule={onLockedModule} />
          <HrisEntitlementPanel modules={hrisCatalogModules} effectiveTier={effectiveTier} setActivePage={setActivePage} onLockedModule={onLockedModule} unlockedCount={unlockedModules.length} lockedCount={lockedModules.length} />
        </div>
      </Panel>
    </div>
  );
}

function HrisLauncherPanel({ modules, effectiveTier, setActivePage, onLockedModule }: { modules: HrisCatalogModule[]; effectiveTier: HrisTier; setActivePage: (page: PortalPage) => void; onLockedModule: () => void }) {
  return (
    <section className="rounded-[16px] border border-slate-100 bg-slate-50 p-3 sm:rounded-[22px] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--portal-primary)]">App launcher</p>
          <h3 className="mt-1 text-base font-black text-[#172033] sm:text-lg">Menu sidebar HRIS</h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-slate-500">{modules.length} menu</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {modules.map((module) => {
          const unlocked = tierRank[module.minimumTier] <= tierRank[effectiveTier];
          const Icon = module.icon;
          return (
            <button
              key={module.key}
              onClick={() => {
                if (unlocked && module.route) setActivePage(module.route);
                else onLockedModule();
              }}
              className={`group flex min-h-[88px] flex-col items-center justify-center rounded-[14px] border p-2.5 text-center transition hover:-translate-y-0.5 sm:min-h-[104px] sm:rounded-[18px] sm:p-3 ${
                unlocked ? "border-white bg-white shadow-sm" : "border-dashed border-slate-200 bg-white/60 opacity-70"
              }`}
              type="button"
            >
              <span className={`grid h-9 w-9 place-items-center rounded-[12px] sm:h-11 sm:w-11 sm:rounded-[15px] ${unlocked ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-100 text-slate-400"}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="mt-2 line-clamp-2 text-xs font-black leading-4 text-[#172033]">{module.name.replace("Payroll Basic", "Payroll")}</span>
              <span className={`mt-2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] ${unlocked ? "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "bg-slate-100 text-slate-400"}`}>
                {unlocked ? "Open" : hrisTierConfigs[module.minimumTier].name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function HrisEntitlementPanel({ modules, effectiveTier, setActivePage, onLockedModule, unlockedCount, lockedCount }: { modules: HrisCatalogModule[]; effectiveTier: HrisTier; setActivePage: (page: PortalPage) => void; onLockedModule: () => void; unlockedCount: number; lockedCount: number }) {
  return (
    <section className="rounded-[16px] border border-slate-100 bg-white p-3 sm:rounded-[22px] sm:p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--portal-primary)]">Entitlement</p>
          <h3 className="mt-1 text-base font-black text-[#172033] sm:text-lg">Unlocked & locked</h3>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600">{unlockedCount} open</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">{lockedCount} locked</span>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {modules.map((module) => {
          const unlocked = tierRank[module.minimumTier] <= tierRank[effectiveTier];
          const Icon = module.icon;
          return (
            <button
              key={module.key}
              onClick={() => {
                if (unlocked && module.route) setActivePage(module.route);
                else if (!unlocked) onLockedModule();
              }}
              className={`flex min-h-[68px] items-start gap-2 rounded-[14px] border p-2.5 text-left transition hover:-translate-y-0.5 sm:min-h-[76px] sm:gap-3 sm:rounded-[16px] sm:p-3 ${
                unlocked ? "border-slate-100 bg-slate-50/70" : "border-dashed border-slate-200 bg-slate-50 opacity-75"
              }`}
              type="button"
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[12px] ${unlocked ? "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "bg-white text-slate-400"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  {unlocked ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> : <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  <span className="truncate text-xs font-black text-[#172033]">{module.name}</span>
                </span>
                <span className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-500">{module.caption}</span>
                <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] ${unlocked ? "bg-emerald-50 text-emerald-600" : "bg-white text-slate-400"}`}>
                  {unlocked ? "Unlocked" : `Min ${hrisTierConfigs[module.minimumTier].name}`}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function HrisFeaturePage({ role, tier, feature, onLockedModule }: { role: PortalRole; tier: HrisTier; feature: HrisCatalogModule["key"]; onLockedModule: () => void }) {
  const [payrollFinalized, setPayrollFinalized] = useState(false);
  const [syncStatus, setSyncStatus] = useState("1 jam yang lalu");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const meta = buildHrisFeatureMeta(tier, payrollFinalized)[feature as keyof ReturnType<typeof buildHrisFeatureMeta>];

  const updateLeaveStatus = (id: string, status: LeaveRequest["status"]) => {
    setLeaveRequests((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  if (!meta) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--portal-primary)] sm:text-xs">{meta.eyebrow}</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-4xl">{meta.title}</h1>
            <p className="mt-2 max-w-2xl text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">{meta.body}</p>
          </div>
          <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--portal-primary)] sm:px-4 sm:py-2 sm:text-xs">
            {tier} access
          </span>
        </div>
      </Panel>

      <div className={`grid gap-3 ${(meta.stats as HrisStatTuple[]).length === 3 ? "grid-cols-3" : "grid-cols-2"} xl:grid-cols-4`}>
        {(meta.stats as HrisStatTuple[]).map(([value, label, Icon]) => (
          <HrisMetricCard key={label} value={value} label={label} Icon={Icon} />
        ))}
      </div>

      {feature === "dashboard" && tierRank[tier] >= tierRank.pro ? (
        <HrisDashboardLiveWorkspace />
      ) : (
        <Panel>
          {feature === "employees" ? <EmployeesWorkspace canManageEmployees={role !== "employee"} /> : null}
          {feature === "attendance" ? <AttendanceWorkspace syncStatus={syncStatus} onSync={() => setSyncStatus("Baru saja sync dari device")} /> : null}
          {feature === "leave" ? <LeaveWorkspace /> : null}
          {feature === "payroll" ? <PayrollWorkspace /> : null}
          {feature === "payslip" ? <PayslipWorkspace /> : null}
          {feature === "advanced-payroll" ? <AdvancedPayrollWorkspace /> : null}
          {feature === "dashboard" ? <LockedDashboardWorkspace onLockedModule={onLockedModule} /> : null}
          {feature === "reimbursement" ? <ReimbursementWorkspace /> : null}
          {feature === "loans" ? <LoansWorkspace /> : null}
          {feature === "field-report" ? <FieldReportWorkspace /> : null}
          {feature === "performance" ? <PerformanceWorkspace /> : null}
          {feature === "recruitment" ? <RecruitmentWorkspace /> : null}
        </Panel>
      )}
    </div>
  );
}
