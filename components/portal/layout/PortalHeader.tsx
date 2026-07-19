"use client";

import { useState } from "react";
import { Search, Menu, UserRound, LogOut } from "lucide-react";
import type { TenantContextResponse } from "@/lib/api";
import { BrandLogo } from "@/components/BrandLogo";
import { RoundedSelect } from "@/components/portal/ui";
import { getStoredActiveBranchId, getStoredActiveTenantId, getStoredBranchScope } from "@/lib/mobile/session";
import type { PortalRole } from "../portalTypes";

export interface PortalProfile {
  initials: string;
  name: string;
  email: string;
  label: string;
}

export interface PortalHeaderProps {
  pageTitle: string;
  profile: PortalProfile;
  setMobileMenuOpen: (val: boolean) => void;
  onSignOut: () => void;
  onOpenProfile: () => void;
  role: PortalRole;
  tenantContext?: TenantContextResponse | null;
  onTenantContextChange?: (tenantId: string, branchId: string | null, branchScope: "single" | "all") => void;
}

function tierRank(text: string) {
  const value = text.toLowerCase();
  if (value.includes("enterprise")) return 4;
  if (value.includes("business") || value.includes("pro")) return 3;
  if (value.includes("growth")) return 2;
  if (value.includes("starter")) return 1;
  return 1;
}

function tenantTierRank(tenant: TenantContextResponse["tenants"][number] | undefined) {
  const text = tenant?.subscriptions?.map((subscription) => `${subscription.tier?.slug ?? ""} ${subscription.tier?.name ?? ""}`).join(" ") ?? "";
  return tierRank(text);
}

export function PortalHeader({
  pageTitle,
  profile,
  setMobileMenuOpen,
  onSignOut,
  onOpenProfile,
  role,
  tenantContext,
  onTenantContextChange,
}: PortalHeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const activeTenantId = getStoredActiveTenantId() ?? tenantContext?.activeTenantId ?? tenantContext?.tenants[0]?.id;
  const activeTenant = tenantContext?.tenants.find((tenant) => tenant.id === activeTenantId) ?? tenantContext?.tenants[0];
  const activeBranchId = getStoredActiveBranchId() ?? tenantContext?.activeBranchId ?? activeTenant?.branches[0]?.id;
  const branchScope = getStoredBranchScope() === "all" ? "all" : (tenantContext?.branchScope ?? "single");
  const canUseAllBranches = Boolean((role === "developer" || activeTenant?.role === "owner" || activeTenant?.role === "admin") && tenantTierRank(activeTenant) >= 2);
  const allowedBranchIds = activeTenant?.allowedBranchIds?.length ? activeTenant.allowedBranchIds : activeTenant?.branches.map((branch) => branch.id) ?? [];
  const visibleBranches = activeTenant?.branches.filter((branch) => allowedBranchIds.includes(branch.id)) ?? [];
  const selectedBranchValue = branchScope === "all" && canUseAllBranches ? "all" : (visibleBranches.some((branch) => branch.id === activeBranchId) ? activeBranchId : visibleBranches[0]?.id) ?? "";

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-[var(--portal-border)] bg-white/78 px-2.5 py-2 backdrop-blur-xl sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-[1500px] items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-slate-100 text-slate-600 sm:h-11 sm:w-11 sm:rounded-[16px] lg:hidden"
          type="button"
          aria-label="Buka menu portal"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-3 sm:flex">
          <BrandLogo className="h-11 w-11" />
          <div>
            <p className="text-sm font-black tracking-[0.24em] text-[#172033]">OMNIA</p>
            <p className="text-xs font-bold text-slate-500">{pageTitle} - {profile.label}</p>
          </div>
        </div>
        <div className="mx-auto flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[13px] border border-[var(--portal-border)] bg-white px-3 sm:h-11 sm:max-w-2xl sm:gap-3 sm:rounded-[14px] sm:px-4">
          <Search className="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
          <input className="w-full min-w-0 bg-transparent text-sm font-bold outline-none placeholder:text-slate-400" placeholder="Search portal..." />
        </div>
        {tenantContext?.tenants.length ? (
          <div className="hidden items-center gap-2 xl:flex">
            <RoundedSelect
              value={activeTenant?.id ?? ""}
              onChange={(event) => {
                const nextTenant = tenantContext.tenants.find((tenant) => tenant.id === event.target.value);
                const nextAllowedIds = nextTenant?.allowedBranchIds?.length ? nextTenant.allowedBranchIds : nextTenant?.branches.map((branch) => branch.id) ?? [];
                const nextBranches = nextTenant?.branches.filter((branch) => nextAllowedIds.includes(branch.id)) ?? [];
                const nextCanUseAll = Boolean((role === "developer" || nextTenant?.role === "owner" || nextTenant?.role === "admin") && tenantTierRank(nextTenant) >= 2);
                onTenantContextChange?.(event.target.value, nextCanUseAll ? null : nextBranches[0]?.id ?? null, nextCanUseAll ? "all" : "single");
              }}
              className="h-11 max-w-[190px] rounded-[14px] border border-[var(--portal-border)] bg-white px-3 text-xs font-black text-[#172033] outline-none"
              aria-label="Pilih workspace tenant"
            >
              {tenantContext.tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </RoundedSelect>
            <RoundedSelect
              value={selectedBranchValue}
              onChange={(event) => {
                if (!activeTenant) return;
                if (event.target.value === "all") onTenantContextChange?.(activeTenant.id, null, "all");
                else onTenantContextChange?.(activeTenant.id, event.target.value, "single");
              }}
              className="h-11 max-w-[170px] rounded-[14px] border border-[var(--portal-border)] bg-white px-3 text-xs font-black text-[#172033] outline-none"
              aria-label="Pilih cabang"
            >
              {canUseAllBranches ? <option value="all">Semua Cabang</option> : null}
              {!canUseAllBranches && activeTenant && tenantTierRank(activeTenant) < 2 && (activeTenant.role === "owner" || activeTenant.role === "admin") ? (
                <option value="" disabled>Semua Cabang tersedia di Growth+</option>
              ) : null}
              {visibleBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </RoundedSelect>
          </div>
        ) : null}
        {/* Tombol statis "Omnia HRIS" telah dihapus sesuai instruksi */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-xs font-black transition hover:ring-4 hover:ring-[var(--portal-primary-soft)] sm:h-11 sm:w-11 sm:text-sm"
            type="button"
            aria-label="Buka profil"
          >
            {profile.initials}
          </button>
          {profileOpen ? (
            <>
              <button className="fixed inset-0 z-0" type="button" aria-label="Tutup profil" onClick={() => setProfileOpen(false)} />
              <div className="fixed left-3 right-3 top-16 z-10 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.22)] sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-[320px]">
                <div className="flex gap-4 p-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-200 text-xl font-black">{profile.initials}</div>
                  <div className="min-w-0">
                    <p className="font-black text-[#172033]">{profile.name}</p>
                    <p className="truncate text-sm font-bold text-slate-500">{profile.email}</p>
                    <p className="mt-1 w-fit rounded-full bg-[var(--portal-primary-soft)] px-2 py-1 text-[10px] font-black text-[var(--portal-primary)]">{profile.label}</p>
                    <button
                      className="mt-2 flex items-center gap-2 text-sm font-black text-[var(--portal-primary)]"
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onOpenProfile();
                      }}
                    >
                      <UserRound className="h-4 w-4" /> Profile
                    </button>
                  </div>
                </div>
                {tenantContext?.tenants.length ? (
                  <div className="border-t border-slate-100 p-4 xl:hidden">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Workspace</p>
                    <RoundedSelect
                      value={activeTenant?.id ?? ""}
                      onChange={(event) => {
                        const nextTenant = tenantContext.tenants.find((tenant) => tenant.id === event.target.value);
                        const nextAllowedIds = nextTenant?.allowedBranchIds?.length ? nextTenant.allowedBranchIds : nextTenant?.branches.map((branch) => branch.id) ?? [];
                        const nextBranches = nextTenant?.branches.filter((branch) => nextAllowedIds.includes(branch.id)) ?? [];
                        const nextCanUseAll = Boolean((role === "developer" || nextTenant?.role === "owner" || nextTenant?.role === "admin") && tenantTierRank(nextTenant) >= 2);
                        onTenantContextChange?.(event.target.value, nextCanUseAll ? null : nextBranches[0]?.id ?? null, nextCanUseAll ? "all" : "single");
                      }}
                      className="mb-2 h-10 w-full rounded-[12px] border border-slate-200 bg-slate-50 px-3 text-xs font-black text-[#172033] outline-none"
                      aria-label="Pilih tenant"
                    >
                      {tenantContext.tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                      ))}
                    </RoundedSelect>
                    <RoundedSelect
                      value={selectedBranchValue}
                      onChange={(event) => {
                        if (!activeTenant) return;
                        if (event.target.value === "all") onTenantContextChange?.(activeTenant.id, null, "all");
                        else onTenantContextChange?.(activeTenant.id, event.target.value, "single");
                      }}
                      className="h-10 w-full rounded-[12px] border border-slate-200 bg-slate-50 px-3 text-xs font-black text-[#172033] outline-none"
                      aria-label="Pilih cabang"
                    >
                      {canUseAllBranches ? <option value="all">Semua Cabang</option> : null}
                      {visibleBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </RoundedSelect>
                  </div>
                ) : null}
                <div className="border-t border-slate-100 p-4">
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-100"
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onSignOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
