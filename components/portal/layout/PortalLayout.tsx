"use client";

import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CircleHelp, MoreHorizontal, X, Menu, LayoutDashboard, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PortalPage, PortalRole } from "../portalTypes";
import { getIndustryPalette, type PortalCatalogIndustry } from "../portalCatalog";
import { PortalSidebar } from "./PortalSidebar";
import { PortalHeader, type PortalProfile } from "./PortalHeader";
import type { TenantContextResponse } from "@/lib/api";
import { BrandLogo } from "@/components/BrandLogo";
import { PortalLoadingScreen } from "@/components/portal/ui";
import type { PortalThemeKey } from "../settings/ThemeCustomizer";

export interface PortalLayoutProps {
  children: ReactNode;
  activePage: PortalPage;
  role: PortalRole;
  pageTitle: string;
  profile: PortalProfile;
  tenantContext?: TenantContextResponse | null;
  onTenantContextChange?: (tenantId: string, branchId: string | null, branchScope: "single" | "all") => void;
  sidebarItems: Array<{ icon: LucideIcon; label: string; page: PortalPage }>;
  isHrisContextPage: boolean;
  isFnbModulePage: boolean;
  isChurchContextPage: boolean;
  isClinicContextPage?: boolean;
  isSocialCommerceContextPage?: boolean;
  isEducationContextPage?: boolean;
  isLoading: boolean;
  themeKey: PortalThemeKey;
  setThemeKey: (key: PortalThemeKey) => void;
  goToPage: (page: PortalPage) => void;
  goToPath: (path: string) => void;
  industries: PortalCatalogIndustry[];
  activeIndustrySlug?: string | null;
  onSignOutConfirm: () => void;
  onOpenProfile: () => void;
}

export function PortalLayout({
  children,
  activePage,
  role,
  pageTitle,
  profile,
  tenantContext,
  onTenantContextChange,
  sidebarItems,
  isHrisContextPage,
  isFnbModulePage,
  isChurchContextPage,
  isClinicContextPage = false,
  isSocialCommerceContextPage = false,
  isEducationContextPage = false,
  isLoading,
  themeKey,
  setThemeKey,
  goToPage,
  goToPath,
  industries,
  activeIndustrySlug,
  onSignOutConfirm,
  onOpenProfile,
}: PortalLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  useEffect(() => {
    const activeIndustry = industries.find((industry) => industry.slug === activeIndustrySlug);
    const palette = isFnbModulePage
      ? { primary: "#F97316", soft: "#FFF7ED", dark: "#C2410C" }
      : isHrisContextPage
        ? { primary: "#3B82F6", soft: "#EFF6FF", dark: "#1D4ED8" }
        : activeIndustry
          ? getIndustryPalette(activeIndustry.colorKey)
          : { primary: "#F97316", soft: "#FFF7ED", dark: "#C2410C" };
    const roots = [document.documentElement, document.body];
    roots.forEach((root) => {
      root.dataset.portalTheme = "industry";
      root.style.setProperty("--portal-primary", palette.primary);
      root.style.setProperty("--portal-primary-soft", palette.soft);
      root.style.setProperty("--portal-primary-dark", palette.dark);
      root.style.setProperty("--portal-surface", "#ffffff");
      root.style.setProperty("--portal-text", "#172033");
      root.style.setProperty("--portal-muted", "#667085");
      root.style.setProperty("--portal-border", `color-mix(in srgb, ${palette.primary} 14%, #e7edf5)`);
      root.style.setProperty("--portal-on-primary", "#ffffff");
    });
  }, [activeIndustrySlug, industries, isFnbModulePage, isHrisContextPage]);

  const moduleSidebarActive = isHrisContextPage || isChurchContextPage || isClinicContextPage || isSocialCommerceContextPage || isEducationContextPage || role === "employee" || isFnbModulePage;
  const wideSidebar = moduleSidebarActive || sidebarExpanded;
  const sidebarPaddingClass = wideSidebar ? "lg:pl-[116px]" : "lg:pl-[76px]";

  const mobileHomeItem = sidebarItems[0] || { icon: LayoutDashboard, label: "Beranda", page: "apps" as PortalPage };
  const mobileSecondItem = sidebarItems.length > 1 ? sidebarItems[1] : { icon: Bell, label: "Notif", page: "notifications" as PortalPage };
  const actualSecondItem = mobileSecondItem.page === "notifications" && sidebarItems.length > 2 ? sidebarItems[2] : mobileSecondItem;
  const mobileFourthItem = { icon: Bell, label: "Notif", page: "notifications" as PortalPage };
  const mobileSettingsPage = sidebarItems.find((item) => item.icon === Settings)?.page ?? "settings";
  
  const mobileOverflowItems = [
    ...sidebarItems.filter(item => item.page !== mobileHomeItem.page && item.page !== actualSecondItem.page && item.page !== mobileSettingsPage),
    { icon: CircleHelp, label: "FAQ", page: "faq" as PortalPage }
  ];

  return (
    <main className="portal-theme-scope relative h-dvh overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,var(--portal-primary-soft)_48%,#fff_100%)] text-[var(--portal-text)] transition-colors duration-700">
      <div className="absolute top-0 left-0 w-full h-1 portal-colorful-strip" />
      
      {isLoading ? <PortalLoadingScreen label="Opening portal" /> : null}
      
      <PortalSidebar
        activePage={activePage}
        role={role}
        sidebarItems={sidebarItems}
        isHrisContextPage={isHrisContextPage}
        isFnbModulePage={isFnbModulePage}
        isChurchContextPage={isChurchContextPage}
        isClinicContextPage={isClinicContextPage}
        isSocialCommerceContextPage={isSocialCommerceContextPage}
        isEducationContextPage={isEducationContextPage}
        wideSidebar={wideSidebar}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        goToPage={goToPage}
        goToPath={goToPath}
        industries={industries}
        activeIndustrySlug={activeIndustrySlug}
      />

      <div className={`flex h-dvh min-h-0 flex-col transition-[padding] duration-300 ${sidebarPaddingClass}`}>
        <PortalHeader
          pageTitle={pageTitle}
          profile={profile}
          role={role}
          tenantContext={tenantContext}
          onTenantContextChange={onTenantContextChange}
          setMobileMenuOpen={setMobileMenuOpen}
          onSignOut={() => setSignOutOpen(true)}
          onOpenProfile={onOpenProfile}
        />

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-20 pt-2.5 sm:px-6 sm:py-6 lg:pb-6">
          <div className="mx-auto max-w-[1500px]">
            {children}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {signOutOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-md rounded-[18px] bg-white p-4 shadow-[0_28px_90px_rgba(15,23,42,0.28)] sm:rounded-[28px] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Sign out</p>
              <h2 className="mt-2 text-xl font-black text-[#172033] sm:mt-3 sm:text-3xl">Keluar dari portal?</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
                Kamu akan kembali ke halaman login demo. Tema portal terakhir tetap disimpan.
              </p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setSignOutOpen(false)} className="min-h-10 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-black sm:px-5 sm:py-3" type="button">
                  Batal
                </button>
                <button
                  onClick={() => {
                    setSignOutOpen(false);
                    onSignOutConfirm();
                  }}
                  className="min-h-10 flex-1 rounded-full bg-[var(--portal-primary)] px-4 py-2.5 text-sm font-black text-[var(--portal-on-primary)] sm:px-5 sm:py-3"
                  type="button"
                >
                  Yes, sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" type="button" aria-label="Tutup menu portal" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} className="absolute bottom-0 left-0 right-0 rounded-t-[22px] border border-white/50 bg-white p-3 shadow-[0_-24px_70px_rgba(15,23,42,0.18)] sm:rounded-t-[28px] sm:p-4">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:mb-4 sm:w-12" />
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <BrandLogo className="h-10 w-10 sm:h-11 sm:w-11" />
                <div>
                  <p className="text-sm font-black text-[#172033] sm:text-base">Omnia Portal</p>
                  <p className="text-xs font-bold text-slate-500">{pageTitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sidebarItems.map(({ icon: Icon, label, page }) => {
                  const active = activePage === page;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        goToPage(page);
                        setMobileMoreOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 rounded-[15px] p-3 text-left text-xs font-black transition sm:gap-3 sm:rounded-[18px] sm:p-4 sm:text-sm ${
                        active ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-50 text-[#172033]"
                      }`}
                      type="button"
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--portal-border)] bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-14px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
        <AnimatePresence>
          {mobileMoreOpen && mobileOverflowItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="absolute bottom-[76px] left-3 right-3 rounded-[18px] border border-[var(--portal-border)] bg-white p-2.5 shadow-[0_18px_60px_rgba(15,23,42,0.16)]"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Menu lainnya</p>
                <button onClick={() => setMobileMoreOpen(false)} className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500" type="button" aria-label="Tutup menu lainnya">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mobileOverflowItems.map(({ icon: Icon, label, page }) => {
                  const active = activePage === page;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        goToPage(page);
                        setMobileMoreOpen(false);
                      }}
                      className={`flex items-center gap-2 rounded-[14px] p-2.5 text-left text-xs font-black transition ${
                        active ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-50 text-[#172033]"
                      }`}
                      type="button"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="min-w-0 truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="portal-mobile-tabbar relative grid grid-cols-5 gap-1">
          <button
            onClick={() => {
              goToPage(mobileHomeItem.page);
              setMobileMoreOpen(false);
            }}
            className={`relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[16px] px-1 text-[10px] font-bold transition ${
              activePage === mobileHomeItem.page ? "text-[var(--portal-primary)]" : "text-slate-500"
            }`}
            type="button"
          >
            {activePage === mobileHomeItem.page ? <motion.span layoutId="portal-mobile-active" className="absolute inset-0 rounded-[16px] bg-[var(--portal-primary-soft)]" /> : null}
            <motion.span animate={activePage === mobileHomeItem.page ? { scale: 1.06, y: -1 } : { scale: 1, y: 0 }} className={`relative grid h-7 w-7 place-items-center rounded-[10px] ${activePage === mobileHomeItem.page ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : ""}`}>
              <mobileHomeItem.icon className="h-4 w-4" />
            </motion.span>
            <span className="relative max-w-full truncate leading-none">{mobileHomeItem.label}</span>
          </button>

          <button
            onClick={() => {
              goToPage(actualSecondItem.page);
              setMobileMoreOpen(false);
            }}
            className={`relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[16px] px-1 text-[10px] font-bold transition ${
              activePage === actualSecondItem.page ? "text-[var(--portal-primary)]" : "text-slate-500"
            }`}
            type="button"
          >
            {activePage === actualSecondItem.page ? <motion.span layoutId="portal-mobile-active" className="absolute inset-0 rounded-[16px] bg-[var(--portal-primary-soft)]" /> : null}
            <motion.span animate={activePage === actualSecondItem.page ? { scale: 1.06, y: -1 } : { scale: 1, y: 0 }} className={`relative grid h-7 w-7 place-items-center rounded-[10px] ${activePage === actualSecondItem.page ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : ""}`}>
              <actualSecondItem.icon className="h-4 w-4" />
            </motion.span>
            <span className="relative max-w-full truncate leading-none">{actualSecondItem.label}</span>
          </button>

          <div className="relative flex justify-center">
            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className="absolute -top-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--portal-primary)] shadow-lg ring-4 ring-white/95 transition active:scale-95"
              type="button"
            >
              <BrandLogo className="h-6 w-6 text-white" />
            </button>
            <span className="mt-auto pb-[5px] text-[10px] font-bold text-slate-500">Omnia</span>
          </div>

          <button
            onClick={() => {
              goToPage(mobileFourthItem.page);
              setMobileMoreOpen(false);
            }}
            className={`relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[16px] px-1 text-[10px] font-bold transition ${
              activePage === mobileFourthItem.page ? "text-[var(--portal-primary)]" : "text-slate-500"
            }`}
            type="button"
          >
            {activePage === mobileFourthItem.page ? <motion.span layoutId="portal-mobile-active" className="absolute inset-0 rounded-[16px] bg-[var(--portal-primary-soft)]" /> : null}
            <motion.span animate={activePage === mobileFourthItem.page ? { scale: 1.06, y: -1 } : { scale: 1, y: 0 }} className={`relative grid h-7 w-7 place-items-center rounded-[10px] ${activePage === mobileFourthItem.page ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : ""}`}>
              <mobileFourthItem.icon className="h-4 w-4" />
            </motion.span>
            <span className="relative max-w-full truncate leading-none">{mobileFourthItem.label}</span>
          </button>

          <button
            onClick={() => {
              goToPage(mobileSettingsPage as PortalPage);
              setMobileMoreOpen(false);
            }}
            className={`relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[16px] px-1 text-[10px] font-bold transition ${
              activePage === mobileSettingsPage ? "text-[var(--portal-primary)]" : "text-slate-500"
            }`}
            type="button"
            aria-label="Pengaturan"
          >
            {activePage === mobileSettingsPage ? <motion.span layoutId="portal-mobile-active" className="absolute inset-0 rounded-[16px] bg-[var(--portal-primary-soft)]" /> : null}
            <motion.span animate={activePage === mobileSettingsPage ? { scale: 1.06, y: -1 } : { scale: 1, y: 0 }} className={`relative grid h-7 w-7 place-items-center rounded-[10px] ${activePage === mobileSettingsPage ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : ""}`}>
              <Settings className="h-4 w-4" />
            </motion.span>
            <span className="relative max-w-full truncate leading-none">Settings</span>
          </button>
        </div>
      </nav>

    </main>
  );
}
