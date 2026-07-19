"use client";

import React, { useMemo, useState } from "react";
import { ArrowRight, Bell, CalendarCheck2, CheckCircle2, CreditCard, Lock, Percent, Printer, ReceiptText, Save, ShieldCheck, Store, Truck, WalletCards } from "lucide-react";
import { PricingPlanModal } from "@/components/PricingPlanModal";
import { buildPlans } from "@/components/showcase/pricing";
import { PortalPage, PortalRole } from "../../portalTypes";
import { Panel } from "@/components/portal/ui";
import { PosLayout } from "./pos/PosLayout";
import { PosMenuSettingsLayout } from "./menu/PosMenuSettingsLayout";
import { SalesDashboardLayout } from "./sales/SalesDashboardLayout";
import { KdsLayout } from "./kds/KdsLayout";
import { InventoryLayout } from "./inventory/InventoryLayout";
import { TableManagementLayout } from "./tables/TableManagementLayout";
import { ReservationLayout } from "./reservation/ReservationLayout";
import { BakeryPreOrderLayout } from "./bakery/BakeryPreOrderLayout";
import { BakeryWholesaleLayout } from "./bakery/BakeryWholesaleLayout";
import { FnbOperationsLayout } from "./operations/FnbOperationsLayout";
import { fnbSubIndustries, hasAccess, FnbModuleConfig } from "./config/subIndustries";
import { UpgradeModal } from "../../shared/UpgradeModal";
import { usePathname, useRouter } from "next/navigation";

interface FnbPortalProps {
  activePage: PortalPage;
  currentTier: string;
}

const fnbOverviewProfiles: Record<string, { caption: string; limit: string; primaryValue: string; primaryLabel: string }> = {
  cafe: {
    caption: "POS cafe, table order, inventory bahan, loyalty, promo, dan kitchen flow ringan untuk outlet minuman dan dessert.",
    limit: "multi outlet cafe",
    primaryValue: "0",
    primaryLabel: "Meja aktif"
  },
  restoran: {
    caption: "Operasional dine-in restoran dengan table management, reservasi, KDS multi-station, inventory, dan laporan penjualan.",
    limit: "multi area service",
    primaryValue: "0",
    primaryLabel: "Meja & area"
  },
  bakery: {
    caption: "Kasir bakery, pre-order custom cake, jadwal produksi, resep, stok bahan, dan penjualan reseller.",
    limit: "retail + produksi",
    primaryValue: "0",
    primaryLabel: "SKU aktif"
  },
  "cloud-kitchen": {
    caption: "Kontrol dapur delivery-only untuk multi-brand menu, consolidated sales, KDS pusat, stok gudang, dan integrasi aggregator.",
    limit: "multi brand kitchen",
    primaryValue: "0",
    primaryLabel: "Brand aktif"
  },
  "food-court": {
    caption: "Kasir pusat, tenant management, revenue split, tenant KDS, dan dashboard sales gabungan untuk pujasera atau food hall.",
    limit: "multi tenant",
    primaryValue: "0",
    primaryLabel: "Tenant aktif"
  }
};

const moduleRouteSlugs: Record<string, string> = {
  "sales-dashboard": "sales",
  "order-history": "order-history",
  pos: "pos",
  "menu-settings": "menu",
  "table-order": "table-order",
  reservation: "reservation",
  kds: "kds",
  inventory: "inventory",
  "pre-order": "pre-order",
  wholesale: "wholesale",
  loyalty: "loyalty",
  "shift-closing": "shift-closing",
  "split-bill": "split-bill",
  "batch-stock": "batch-stock",
  "waste-report": "waste-report",
  "order-hub": "order-hub",
  "multi-brand": "multi-brand",
  "delivery-integration": "delivery-integration",
  "delivery-status": "delivery-status",
  "tenant-management": "tenant-management",
  "tenant-settlement": "tenant-settlement",
  "promo-rules": "promo-rules",
  "admin-tenant-dashboard": "admin-tenant-dashboard",
  settings: "settings"
};

function getFnbModulePath(subIndustrySlug: string, moduleId: string) {
  const routeSlug = moduleRouteSlugs[moduleId];
  if (!routeSlug) return null;
  return `/portal/fnb/${subIndustrySlug}/${routeSlug}`;
}

const fnbTierPrices: Record<string, Record<string, string>> = {
  cafe: { starter: "Rp110rb", growth: "Rp220rb", pro: "Rp450rb", enterprise: "Mulai Rp950rb" },
  restoran: { starter: "Rp190rb", growth: "Rp390rb", pro: "Rp790rb", enterprise: "Mulai Rp1,5jt" },
  bakery: { starter: "Rp499rb", growth: "Rp999rb", pro: "Rp2jt+", enterprise: "Mulai Rp6jt" },
  "cloud-kitchen": { starter: "Rp499rb", growth: "Rp999rb", pro: "Rp2jt+", enterprise: "Mulai Rp6jt" },
  "food-court": { starter: "Rp999rb", growth: "Rp2jt", pro: "Rp4jt+", enterprise: "Mulai Rp8jt" },
};

const recipeMinTier = "Growth";

function getFnbTierPrice(subIndustrySlug: string, currentTier: string) {
  const normalizedTier = currentTier.toLowerCase();
  return fnbTierPrices[subIndustrySlug]?.[normalizedTier] ?? fnbTierPrices.cafe.starter;
}


import { FnbSettingsPage } from "./pages/FnbSettingsPage";

export function FnbPortal({ activePage, currentTier }: FnbPortalProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [upgradeModal, setUpgradeModal] = useState<{isOpen: boolean, requiredTier: string, moduleName: string}>({
    isOpen: false,
    requiredTier: "Growth",
    moduleName: ""
  });

  // Extract sub-industry from pathname (e.g. /portal/fnb/cafe/pos)
  // Or fallback to 'cafe' if none found
  const subIndustrySlug = useMemo(() => {
    const parts = pathname.split("/");
    const idx = parts.indexOf("fnb");
    if (idx !== -1 && parts.length > idx + 1) {
      const possibleSlug = parts[idx + 1];
      if (possibleSlug === "restaurant") return "restoran";
      if (fnbSubIndustries[possibleSlug]) return possibleSlug;
    }
    return "cafe"; // Default for demo
  }, [pathname]);

  const subIndustry = fnbSubIndustries[subIndustrySlug];

  // Determine active module based on page path
  const activeModuleKey = useMemo((): string | null => {
    if (activePage === "fnb-pos") return "pos";
    if (activePage === "fnb-menu") return "menu-settings";
    if (activePage === "fnb-kds") return "kds";
    if (activePage === "fnb-inventory") return "inventory";
    if (activePage === "fnb-sales") return "sales-dashboard";
    if (activePage === "fnb-order-history") return "order-history";
    if (activePage === "fnb-table-order") return "table-order";
    if (activePage === "fnb-reservation") return "reservation";
    if (activePage === "fnb-pre-order") return "pre-order";
    if (activePage === "fnb-wholesale") return "wholesale";
    if (activePage === "fnb-loyalty") return "loyalty";
    if (activePage === "fnb-shift-closing") return "shift-closing";
    if (activePage === "fnb-split-bill") return "split-bill";
    if (activePage === "fnb-batch-stock") return "batch-stock";
    if (activePage === "fnb-waste-report") return "waste-report";
    if (activePage === "fnb-order-hub") return "order-hub";
    if (activePage === "fnb-multi-brand") return "multi-brand";
    if (activePage === "fnb-delivery-integration") return "delivery-integration";
    if (activePage === "fnb-delivery-status") return "delivery-status";
    if (activePage === "fnb-tenant-management") return "tenant-management";
    if (activePage === "fnb-tenant-settlement") return "tenant-settlement";
    if (activePage === "fnb-promo-rules") return "promo-rules";
    if (activePage === "fnb-admin-tenant-dashboard") return "admin-tenant-dashboard";
    if (activePage === "fnb-settings") return "settings";
    return null; // Dashboard or fallback
  }, [activePage]);

  // Handle Dashboard View (Default)
  if (!activeModuleKey) {
    const unlockedModules = subIndustry.modules.filter((mod) => hasAccess(currentTier, mod.minTier));
    const lockedModules = subIndustry.modules.length - unlockedModules.length;
    const tierName = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);
    const tierPrice = getFnbTierPrice(subIndustrySlug, currentTier);
    const overview = fnbOverviewProfiles[subIndustry.id] ?? fnbOverviewProfiles.cafe;
    const statCards = [
      { value: overview.primaryValue, label: overview.primaryLabel, icon: Store, delta: "0%", caption: "belum ada data" },
      { value: String(unlockedModules.length), label: "Modul terbuka", icon: CheckCircle2, delta: "+24.5%", caption: "coverage tier" },
      { value: String(lockedModules), label: "Modul terkunci", icon: Lock, delta: lockedModules === 0 ? "-100%" : "-16.2%", caption: "setelah upgrade" },
      { value: tierPrice, label: "Harga tier", icon: WalletCards, delta: "Aktif", caption: "per bulan" }
    ];

    const openModule = (mod: FnbModuleConfig) => {
      const isUnlocked = hasAccess(currentTier, mod.minTier);
      if (!isUnlocked) {
        setUpgradeModal({ isOpen: true, requiredTier: mod.minTier, moduleName: mod.label });
        return;
      }

      const modulePath = getFnbModulePath(subIndustrySlug, mod.id);
      if (modulePath) {
        router.push(modulePath);
      }
    };

    return (
      <div className="min-h-full space-y-4 lg:space-y-6 bg-transparent px-1 py-4 sm:bg-[#fffaf5] sm:p-5 lg:p-6 sm:rounded-3xl">
        <section className="rounded-[20px] lg:rounded-[28px] border border-slate-100 bg-white p-5 lg:p-7 shadow-sm">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] lg:tracking-[0.24em] text-[var(--portal-primary)]">F&B tier preview</p>
              <h1 className="mt-2 lg:mt-3 text-xl lg:text-4xl font-black text-[#172033]">{subIndustry.name} {tierName}</h1>
              <p className="mt-2 lg:mt-3 max-w-3xl text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">{overview.caption}</p>
            </div>
            <div className="rounded-[16px] lg:rounded-[22px] bg-[var(--portal-primary-soft)] px-5 py-4 lg:px-7 lg:py-5">
              <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.18em] text-[var(--portal-primary)]">Limit</p>
              <p className="mt-1 lg:mt-2 text-base lg:text-2xl font-black text-[#172033]">{overview.limit}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-3 lg:gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ value, label, icon: Icon, delta, caption }) => (
            <article key={label} className="relative min-h-[110px] lg:min-h-[150px] rounded-[20px] lg:rounded-[24px] border border-slate-100 bg-white p-4 lg:p-6 shadow-sm">
              <p className="text-[11px] lg:text-sm font-black text-slate-500">{label}</p>
              <span className="absolute right-4 top-4 lg:right-5 lg:top-5 grid h-9 w-9 lg:h-11 lg:w-11 place-items-center rounded-[12px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
                <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
              </span>
              <p className="mt-5 lg:mt-8 text-xl lg:text-3xl font-black text-[#07142d]">{value}</p>
              <div className="mt-2 lg:mt-3 flex items-center gap-1.5 lg:gap-2">
                <span className={`rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[9px] lg:text-xs font-black ${delta.startsWith("-") ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                  {delta}
                </span>
                <span className="text-[9px] lg:text-xs font-bold text-slate-400">{caption}</span>
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-[20px] lg:rounded-[28px] border border-slate-100 bg-white p-4 lg:p-6 shadow-sm">
          <div className="flex flex-col gap-3 lg:gap-4 border-b border-slate-100 pb-4 lg:pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-[#172033]">Fitur {subIndustry.name} {tierName}</h2>
              <p className="mt-1 lg:mt-2 text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">
                Kiri menampilkan launcher halaman F&B. Kanan merangkum fitur terbuka dan fitur terkunci dalam card ringkas.
              </p>
            </div>
            <button onClick={() => router.push("/portal")} className="w-fit rounded-full border border-slate-200 px-4 py-2.5 lg:px-5 lg:py-3 text-[11px] lg:text-sm font-black text-[#172033]" type="button">
              Kembali ke overview
            </button>
          </div>

          <div className="mt-4 lg:mt-5 grid gap-4 lg:gap-5 xl:grid-cols-2">
            <div className="rounded-[16px] lg:rounded-[24px] border border-slate-100 bg-slate-50 p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2 lg:gap-3">
                <div>
                  <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[var(--portal-primary)]">App launcher</p>
                  <h3 className="mt-1 lg:mt-2 text-lg lg:text-xl font-black text-[#172033]">Menu {subIndustry.name}</h3>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-slate-500 shadow-sm">{subIndustry.modules.length} menu</span>
              </div>
              <div className="mt-4 lg:mt-5 grid grid-cols-2 gap-2.5 lg:gap-3 sm:grid-cols-3 lg:grid-cols-3">
                {subIndustry.modules.map((mod) => {
                  const isUnlocked = hasAccess(currentTier, mod.minTier);
                  const modulePath = getFnbModulePath(subIndustrySlug, mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => openModule(mod)}
                      className={`group min-h-[100px] lg:min-h-[122px] rounded-[14px] lg:rounded-[18px] border p-3 lg:p-4 text-center transition ${
                        isUnlocked
                          ? "border-slate-100 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[var(--portal-primary)]"
                          : "border-dashed border-slate-200 bg-white sm:bg-white/70 hover:bg-white"
                      }`}
                      type="button"
                    >
                      <span className={`mx-auto grid h-10 w-10 lg:h-12 lg:w-12 place-items-center rounded-[12px] lg:rounded-[16px] ${
                        isUnlocked ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-100 text-slate-400"
                      }`}>
                        <mod.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </span>
                      <p className="mt-2.5 lg:mt-3 text-xs lg:text-sm font-black text-[#172033] leading-snug">{mod.label}</p>
                      <span className={`mt-1.5 lg:mt-2 inline-flex rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${
                        !isUnlocked ? "bg-slate-100 text-slate-500" : modulePath ? "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]" : "bg-cyan-50 text-cyan-600"
                      }`}>
                        {!isUnlocked ? "Locked" : modulePath ? "Open" : "Roadmap"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[16px] lg:rounded-[24px] border border-slate-100 bg-white p-4 lg:p-5">
              <div className="flex items-center justify-between gap-2 lg:gap-3">
                <div>
                  <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[var(--portal-primary)]">Entitlement</p>
                  <h3 className="mt-1 lg:mt-2 text-lg lg:text-xl font-black text-[#172033]">Unlocked & locked</h3>
                </div>
                <div className="flex gap-1.5 lg:gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-emerald-600">{unlockedModules.length} open</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-slate-500">{lockedModules} locked</span>
                </div>
              </div>
              <div className="mt-4 lg:mt-5 grid gap-2.5 lg:gap-3 sm:grid-cols-2">
                {subIndustry.modules.map((mod) => {
                  const isUnlocked = hasAccess(currentTier, mod.minTier);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => openModule(mod)}
                      className="flex min-h-[72px] lg:min-h-[88px] items-start gap-2.5 lg:gap-3 rounded-[14px] lg:rounded-[18px] border border-slate-100 bg-slate-50 p-3 lg:p-4 text-left transition hover:bg-white"
                      type="button"
                    >
                      <span className="grid h-8 w-8 lg:h-10 lg:w-10 shrink-0 place-items-center rounded-[10px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
                        <mod.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 lg:gap-2">
                          {isUnlocked ? <CheckCircle2 className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500" /> : <Lock className="h-3 w-3 lg:h-4 lg:w-4 text-slate-400" />}
                          <span className="text-xs lg:text-sm font-black text-[#172033]">{mod.label}</span>
                        </span>
                        <span className="mt-0.5 lg:mt-1 block text-[10px] lg:text-xs font-bold leading-snug lg:leading-5 text-slate-500">{mod.description}</span>
                        <span className={`mt-1.5 lg:mt-2 inline-flex rounded-full px-2 py-0.5 lg:px-2.5 lg:py-1 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${
                          isUnlocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}>
                          {isUnlocked ? "Unlocked" : `Req. ${mod.minTier}`}
                        </span>
                      </span>
                      <ArrowRight className="mt-1 h-3 w-3 lg:h-4 w-4 shrink-0 text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <UpgradeModal 
          isOpen={upgradeModal.isOpen} 
          onClose={() => setUpgradeModal({...upgradeModal, isOpen: false})} 
          requiredTier={upgradeModal.requiredTier}
          moduleName={upgradeModal.moduleName}
          industry={subIndustry.name}
        />
      </div>
    );
  }

  // Check module access for direct routing
  const targetMod = subIndustry.modules.find(m => m.id === activeModuleKey);
  const isAllowed = targetMod ? hasAccess(currentTier, targetMod.minTier) : false;

  if (targetMod && !isAllowed) {
    return (
      <div className="p-8 h-full bg-slate-50 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center mb-6">
          <targetMod.icon className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black text-[#172033] mb-3">Akses {targetMod.label} Terkunci</h2>
        <p className="text-slate-500 font-bold mb-8 max-w-md">
          Paket <span className="uppercase text-[var(--portal-primary)]">{currentTier}</span> Anda tidak mencakup fitur ini. Fitur ini terbuka untuk pengguna paket <strong>{targetMod.minTier}</strong> ke atas.
        </p>
        <button className="rounded-full bg-[var(--portal-primary)] px-8 py-4 font-black text-white shadow-lg shadow-[var(--portal-primary-soft)] hover:opacity-90 transition">
          Hubungi Admin untuk Upgrade
        </button>
      </div>
    );
  }

  // Render specific module layouts
  switch (activeModuleKey) {
    case "pos":
      return <PosLayout />;
    case "menu-settings":
      return (
        <PosMenuSettingsLayout
          subIndustryName={subIndustry.name}
          canManageRecipe={hasAccess(currentTier, recipeMinTier)}
        />
      );
    case "kds":
      return <KdsLayout />;
    case "inventory":
      return <InventoryLayout />;
    case "table-order":
      return <TableManagementLayout />;
    case "reservation":
      return <ReservationLayout />;
    case "pre-order":
      return <BakeryPreOrderLayout />;
    case "wholesale":
      return <BakeryWholesaleLayout />;
    case "sales-dashboard":
      return <SalesDashboardLayout subIndustryName={subIndustry.name} />;
    case "order-history":
      return <FnbOperationsLayout moduleKey={activeModuleKey} subIndustryName={subIndustry.name} />;
    case "loyalty":
    case "shift-closing":
    case "split-bill":
    case "batch-stock":
    case "waste-report":
    case "order-hub":
    case "multi-brand":
    case "delivery-integration":
    case "delivery-status":
    case "tenant-management":
    case "tenant-settlement":
    case "promo-rules":
    case "admin-tenant-dashboard":
      return <FnbOperationsLayout moduleKey={activeModuleKey} subIndustryName={subIndustry.name} />;
    case "settings":
      return <FnbSettingsPage subIndustryName={subIndustry.name} currentTier={currentTier} />;
    default:
      // Render placeholder for sub-industry specific unbuilt modules (e.g. table-order, wholesale)
      return (
        <div className="p-8 h-full bg-slate-50 flex flex-col items-center justify-center">
           <div className="w-20 h-20 rounded-[24px] bg-[var(--portal-primary-soft)] flex items-center justify-center mb-6">
              <span className="text-[var(--portal-primary)] font-black text-sm">PROTOTYPE</span>
           </div>
           <h2 className="text-3xl font-black text-[#172033] mb-2">{targetMod?.label || "Modul Spesifik"}</h2>
           <p className="text-slate-500 font-bold mb-6 text-center max-w-sm">
             Modul ini dirancang khusus untuk sub-industri {subIndustry.name} dan sedang dalam tahap pengembangan (MVP Phase).
           </p>
        </div>
      );
  }
}

