"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CircleHelp, ChevronRight, MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { getIndustryColor, getIndustryIcon, getIndustryPortalPath, type PortalCatalogIndustry } from "../portalCatalog";
import type { PortalPage, PortalRole } from "../portalTypes";

export interface PortalSidebarProps {
  activePage: PortalPage;
  role: PortalRole;
  sidebarItems: Array<{ icon: LucideIcon; label: string; page: PortalPage }>;
  isHrisContextPage: boolean;
  isFnbModulePage: boolean;
  isChurchContextPage: boolean;
  isClinicContextPage?: boolean;
  isSocialCommerceContextPage?: boolean;
  isEducationContextPage?: boolean;
  wideSidebar: boolean;
  sidebarExpanded: boolean;
  setSidebarExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  goToPage: (page: PortalPage) => void;
  goToPath: (path: string) => void;
  industries: PortalCatalogIndustry[];
  activeIndustrySlug?: string | null;
}

export function PortalSidebar({
  activePage,
  role,
  sidebarItems,
  isHrisContextPage,
  isFnbModulePage,
  isChurchContextPage,
  isClinicContextPage = false,
  isSocialCommerceContextPage = false,
  isEducationContextPage = false,
  wideSidebar,
  sidebarExpanded,
  setSidebarExpanded,
  goToPage,
  goToPath,
  industries,
  activeIndustrySlug,
}: PortalSidebarProps) {
  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);

  const moduleSidebarActive = isHrisContextPage || isChurchContextPage || isClinicContextPage || isSocialCommerceContextPage || isEducationContextPage || role === "employee" || isFnbModulePage;
  const sidebarWidthClass = wideSidebar ? "w-[116px]" : "w-[76px]";
  const sidebarButtonWidthClass = wideSidebar ? "w-[96px]" : "w-14";
  
  const sidebarNavClass = `flex min-h-0 flex-1 flex-col items-center gap-1.5 px-2 py-3 ${
    moduleSidebarActive ? "overflow-y-auto overflow-x-hidden no-scrollbar" : "overflow-visible"
  }`;
  const sidebarUtilityClass = "grid place-items-center gap-2 p-3";
  const availableIndustries = industries;

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 hidden overflow-visible border-r border-[var(--portal-border)] bg-white/82 backdrop-blur-xl transition-[width] duration-300 lg:flex lg:flex-col ${sidebarWidthClass}`}>
      <div className="grid h-[72px] place-items-center">
        <button
          onClick={() => {
            goToPage("home");
            setIndustryMenuOpen(false);
          }}
          className="grid h-11 w-11 place-items-center rounded-[14px] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--portal-primary-soft)]"
          type="button"
          title="Home portal"
          aria-label="Kembali ke home portal"
        >
          <BrandLogo className="h-9 w-9" />
        </button>
      </div>
      <nav className={sidebarNavClass}>
        {sidebarItems.map(({ icon: Icon, label, page }) => {
          const active = activePage === page;
          if (page === "reports" && role !== "employee") {
            const isJasaProfesional = activePage === "professional-services" || activePage === "hris" || activePage.startsWith("hris-");
            const isFnbIndustry = activePage === "fnb" || activePage.startsWith("fnb-");
            const isSocialCommerceIndustry = activePage === "social-commerce-intelligence" || activePage.startsWith("social-intel-");
            const isEducationIndustry = activePage.startsWith("education-");
            const selectedIndustry = availableIndustries.find((industry) => industry.slug === activeIndustrySlug) ?? availableIndustries[0];
            const displayIndustry = isFnbIndustry
              ? availableIndustries.find((i) => ["food-and-beverage", "fb-kuliner", "fnb"].includes(i.slug) || i.slug.startsWith("fb-")) || selectedIndustry
              : isJasaProfesional
              ? availableIndustries.find((i) => ["professional-services", "jasa-profesional"].includes(i.slug)) || selectedIndustry
              : isSocialCommerceIndustry
              ? availableIndustries.find((i) => i.slug.includes("commerce") || i.slug.includes("marketplace")) || selectedIndustry
              : isEducationIndustry
              ? availableIndustries.find((i) => i.slug.includes("education") || i.slug.includes("pendidikan")) || selectedIndustry
              : selectedIndustry;
            const IndustryIcon = getIndustryIcon(displayIndustry?.iconKey);
            const industryActive = Boolean(activeIndustrySlug) || isJasaProfesional || isFnbIndustry || isSocialCommerceIndustry || isEducationIndustry;
            return (
              <div key="industry-selector" className="relative">
                <button
                  onClick={() => setIndustryMenuOpen((value) => !value)}
                  className={`relative flex min-h-[60px] ${sidebarButtonWidthClass} flex-col items-center justify-center gap-1 rounded-[18px] px-2 text-[10px] font-bold transition ${
                    industryActive ? "text-[var(--portal-primary)]" : "text-slate-500 hover:bg-slate-100 hover:text-[#172033]"
                  }`}
                  type="button"
                  title={displayIndustry?.name ?? "Industri"}
                  aria-expanded={industryMenuOpen}
                >
                  {industryActive ? (
                    <motion.span
                      layoutId="portal-sidebar-active"
                      className="absolute inset-1 rounded-[18px] bg-[var(--portal-primary-soft)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  {industryActive ? <motion.span layoutId="portal-sidebar-bar" className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-[var(--portal-primary)]" /> : null}
                  <motion.span
                    key={displayIndustry?.name ?? "industry"}
                    initial={{ rotate: -18, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: industryActive ? 1.08 : 1, opacity: 1, y: industryActive ? -2 : 0 }}
                    transition={{ duration: 0.35 }}
                    className={`relative grid h-8 w-8 place-items-center rounded-[12px] ${industryActive ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : ""}`}
                  >
                    <IndustryIcon className="h-5 w-5" />
                  </motion.span>
                  <span className={`relative max-w-full text-center leading-tight ${industryActive ? "font-black text-[#172033]" : ""}`}>Industri</span>
                </button>
                <AnimatePresence>
                  {industryMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-[calc(100%+10px)] top-0 z-50 w-[340px] overflow-hidden rounded-[24px] border border-[var(--portal-border)] bg-white p-3 shadow-[0_22px_70px_rgba(15,23,42,0.18)]"
                    >
                      <div className="mb-3 flex items-center justify-between px-2">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pilih industri</p>
                          <p className="mt-1 text-xs font-bold text-slate-500">{availableIndustries.length} lini tersedia</p>
                        </div>
                        <span className="rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-[10px] font-black text-[var(--portal-primary)]">
                          {role === "developer" ? "All access" : "Catalog"}
                        </span>
                      </div>
                      <div className="portal-industry-menu grid max-h-[min(70vh,640px)] gap-2 overflow-y-auto pr-1 no-scrollbar">
                        {availableIndustries.map((industry) => {
                          const MenuIcon = getIndustryIcon(industry.iconKey);
                          const color = getIndustryColor(industry.colorKey);
                          const selected = selectedIndustry?.slug === industry.slug
                            || activeIndustrySlug === "professional-services" && industry.slug === "jasa-profesional"
                            || activeIndustrySlug === "public-services" && industry.slug.includes("layanan-publik")
                            || activeIndustrySlug === "fnb" && industry.slug.startsWith("fb-")
                            || activeIndustrySlug === "ecommerce-and-marketplaces" && (industry.slug.includes("commerce") || industry.slug.includes("marketplace"))
                            || activeIndustrySlug === "education-and-courses" && (industry.slug.includes("education") || industry.slug.includes("pendidikan"));
                          return (
                            <button
                              key={industry.id}
                              onClick={() => {
                                goToPath(getIndustryPortalPath(industry));
                                setIndustryMenuOpen(false);
                              }}
                              className={`group relative flex items-center gap-3 overflow-hidden rounded-[18px] border p-3 text-left transition ${
                                selected ? "border-transparent bg-[var(--portal-primary-soft)] shadow-sm" : "border-slate-100 bg-slate-50 text-[#172033] hover:border-slate-200 hover:bg-white"
                              }`}
                              style={selected ? { background: `${color}14` } : undefined}
                              type="button"
                            >
                              <span
                                className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                                style={{ backgroundColor: selected ? color : "#ffffff", color: selected ? "#ffffff" : color }}
                              >
                                <MenuIcon className="h-5 w-5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-black text-[#172033]">{industry.name}</span>
                                <span className="mt-0.5 block truncate text-xs font-bold text-slate-500">{industry.subIndustries.length} sub-industries</span>
                              </span>
                              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-slate-500 ring-1 ring-slate-100">
                                {industry.subIndustries.length}
                              </span>
                              <ChevronRight className={`h-4 w-4 shrink-0 transition group-hover:translate-x-0.5 ${selected ? "text-[var(--portal-primary)]" : "text-slate-400"}`} />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          }
          return (
            <button
              key={label}
              onClick={() => {
                goToPage(page);
                setIndustryMenuOpen(false);
              }}
              className={`relative flex min-h-[60px] ${sidebarButtonWidthClass} flex-col items-center justify-center gap-1 rounded-[18px] px-2 text-[10px] font-bold transition ${
                active ? "text-[var(--portal-primary)]" : "text-slate-500 hover:bg-slate-100 hover:text-[#172033]"
              }`}
              type="button"
              title={label}
            >
              {active ? (
                <motion.span
                  layoutId="portal-sidebar-active"
                  className="absolute inset-1 rounded-[18px] bg-[var(--portal-primary-soft)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              {active ? <motion.span layoutId="portal-sidebar-bar" className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-[var(--portal-primary)]" /> : null}
              <motion.span
                animate={active ? { y: -2, scale: 1.08, rotate: [0, -8, 8, 0] } : { y: 0, scale: 1, rotate: 0 }}
                transition={{ duration: 0.38 }}
                className={`relative grid h-8 w-8 place-items-center rounded-[12px] ${active ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : ""}`}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
              <span className={`relative max-w-full text-center leading-tight ${active ? "font-black text-[#172033]" : ""}`}>{label}</span>
            </button>
          );
        })}
        {!(isHrisContextPage || role === "employee" || isFnbModulePage || isSocialCommerceContextPage) && sidebarItems.length > 7 ? (
          <button
            onClick={() => setSidebarExpanded((value) => !value)}
            className={`relative flex h-[58px] ${sidebarButtonWidthClass} flex-col items-center justify-center gap-1 rounded-[16px] text-[10px] font-black text-slate-500 transition hover:bg-slate-100 hover:text-[#172033]`}
            type="button"
            aria-expanded={sidebarExpanded}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>{sidebarExpanded ? "Less" : "More"}</span>
          </button>
        ) : null}
      </nav>
      <div className={sidebarUtilityClass}>
        <button
          onClick={() => { goToPage("notifications"); setIndustryMenuOpen(false); }}
          className={`relative grid h-12 w-12 place-items-center rounded-[18px] transition ${
            activePage === "notifications" ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "text-slate-500 hover:bg-slate-100"
          }`}
          type="button"
          aria-label="Buka notifikasi"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <button
          onClick={() => { goToPage("faq"); setIndustryMenuOpen(false); }}
          className={`grid h-12 w-12 place-items-center rounded-[18px] transition ${
            activePage === "faq" ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "text-slate-500 hover:bg-slate-100"
          }`}
          type="button"
          aria-label="FAQ"
        >
          <CircleHelp className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
