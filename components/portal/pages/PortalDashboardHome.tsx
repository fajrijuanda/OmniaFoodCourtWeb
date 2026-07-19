"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CircleHelp, Database, Layers3, Lock, LockOpen, Megaphone, X } from "lucide-react";
import { PricingPlanModal } from "@/components/PricingPlanModal";
import { buildPlans } from "@/components/showcase/pricing";
import { Panel } from "@/components/portal/ui";
import { getStoredActiveTenantId, setStoredTenantContext } from "@/lib/mobile/session";
import {
  getIndustryColor,
  getIndustryIcon,
  getIndustryPortalPath,
  getSegmentIcon,
  getSubIndustryPortalPath,
  ownerPurchasedSegments,
  type PortalCatalogIndustry,
  type PortalCatalogSubIndustry
} from "../portalCatalog";
import type { PortalPage, PortalRole } from "../portalTypes";

export function PortalDashboardHome({
  setActivePage,
  role,
  industries
}: {
  setActivePage: (page: PortalPage) => void;
  role: PortalRole;
  industries: PortalCatalogIndustry[];
}) {
  const router = useRouter();
  const [selectedCatalogIndustry, setSelectedCatalogIndustry] = useState<PortalCatalogIndustry | null>(null);
  const [mobileSegmentIndex, setMobileSegmentIndex] = useState(0);
  const totalSegments = industries.reduce((total, industry) => total + industry.subIndustries.length, 0);
  const accessibleSegments = role === "developer" ? totalSegments : ownerPurchasedSegments.size;
  const heroTitle = role === "developer" ? "Superadmin Omnia Control." : "Portal Owner Tenant.";
  const heroBody = role === "developer"
    ? "Kelola akses seluruh industri, sub-industri, tenant, dan konfigurasi demo dari satu portal."
    : "Pantau langganan aktif, buka sub-industri yang dibeli, dan temukan rekomendasi pembelian berikutnya.";
  const heroStats = role === "developer"
    ? [
        [String(industries.length), "industri"],
        [String(totalSegments), "sub-industri"],
        ["All", "akses konten"]
      ]
    : [
        [String(accessibleSegments), "sub-industri aktif"],
        ["Growth", "tier aktif"],
        [String(Math.max(0, totalSegments - accessibleSegments)), "saran pembelian"]
      ];
  const mobileHighlights = [
    { title: "Promo & Update", caption: role === "developer" ? "Lihat fitur baru dan campaign Omnia terbaru" : "Rekomendasi fitur dan promo untuk workspace kamu", icon: Megaphone, page: "apps" as PortalPage, gradient: "from-violet-500 to-fuchsia-200", badge: "Baru" },
    { title: "Panduan & Bantuan", caption: "Temukan panduan penggunaan dan jawaban untuk pertanyaan umum", icon: CircleHelp, page: "faq" as PortalPage, gradient: "from-orange-500 to-orange-200", badge: "Pelajari" }
  ];

  return (
    <div className="sm:space-y-6 -mx-2.5 sm:mx-0 -mt-2.5 sm:mt-0">
      {/* Mobile-only Header + Swiper Container */}
      <section className="sm:hidden relative overflow-hidden bg-[#111111] px-3 pb-12 pt-5 rounded-none">
        <div className="absolute -top-10 -right-10 w-[240px] h-[240px] bg-[var(--portal-primary)] rounded-full blur-[65px] opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-[200px] h-[200px] bg-[var(--portal-primary)] rounded-full blur-[75px] opacity-30 pointer-events-none" />
        
        <div className="relative text-white mb-6 pt-2">
          <span className="inline-flex rounded-full bg-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white/80">
            {role === "developer" ? "Superadmin account" : "Owner account"}
          </span>
          <h1 className="mt-3 text-2xl font-black leading-tight">{heroTitle}</h1>
          <p className="mt-2 max-w-[280px] text-[12px] font-bold leading-5 text-white/70">{heroBody}</p>
        </div>

        <div className="portal-mobile-stat-row relative mb-6 grid grid-cols-3 gap-2">
          {heroStats.map(([value, label]) => (
            <div key={label} className="rounded-[14px] bg-white/5 border border-white/10 p-3 backdrop-blur-md">
              <p className="text-lg font-black text-white">{value}</p>
              <p className="mt-0.5 text-[9px] font-bold leading-tight text-white/60">{label}</p>
            </div>
          ))}
        </div>

        <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 no-scrollbar">
          {mobileHighlights.map((card) => (
            <button key={card.title} onClick={() => setActivePage(card.page)} type="button" className="group relative min-h-[142px] min-w-[82%] snap-center overflow-hidden rounded-[20px] p-4 text-left text-white shadow-lg border border-white/5 bg-white/5 backdrop-blur-md transition-transform active:scale-95">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-25`} />
              <div className="relative">
                <card.icon className="h-6 w-6 text-white" />
                <h2 className="mt-4 text-lg font-black">{card.title}</h2>
                <p className="mt-0.5 text-[11px] font-bold leading-tight text-white/70">{card.caption}</p>
                <p className="mt-2.5 w-fit rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black">{card.badge}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Desktop-only Header Section */}
      <section className="hidden sm:grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="relative min-h-[390px] rounded-[28px] overflow-hidden bg-[#111111] p-9 text-white shadow-[0_26px_80px_rgba(15,23,42,0.16)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_36%,var(--portal-primary)_0%,transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.2))] opacity-90" />
          <div className="relative max-w-xl">
            <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/72">
              {role === "developer" ? "Superadmin account" : "Owner account"}
            </span>
            <h1 className="mt-6 text-3xl font-black leading-tight sm:text-6xl">{heroTitle}</h1>
            <p className="mt-4 max-w-lg text-base font-bold leading-7 text-white/68">{heroBody}</p>
            <button onClick={() => setActivePage("apps")} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--portal-primary)] px-6 py-3 text-sm font-black text-[var(--portal-on-primary)] transition-transform active:scale-95" type="button">
              Buka katalog aplikasi
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="relative mt-9 grid max-w-3xl grid-cols-3 gap-3">
            {heroStats.map(([value, label]) => (
              <div key={label} className="rounded-[18px] bg-transparent border-transparent p-4 lg:bg-white/12 lg:backdrop-blur">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-xs font-bold leading-tight text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1">
          {mobileHighlights.map((card) => (
            <button key={card.title} onClick={() => setActivePage(card.page)} type="button" className="group relative min-h-[187px] min-w-0 rounded-[24px] overflow-hidden p-6 text-left text-white shadow-[0_18px_55px_rgba(15,23,42,0.12)] transition-transform active:scale-95">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
              <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/12" />
              <div className="relative">
                <card.icon className="h-8 w-8" />
                <h2 className="mt-8 text-2xl font-black">{card.title}</h2>
                <p className="mt-1 text-sm font-bold leading-normal text-white/82">{card.caption}</p>
                <p className="mt-3 w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-black">{card.badge}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      
      {/* Container for the rest, restoring padding on mobile */}
      <div className="relative z-10 -mt-6 sm:mt-0 pt-0 pb-0 space-y-0 sm:space-y-6">

      <Panel className="p-4 lg:p-6 !border-x-0 !border-b-0 sm:!border-x sm:!border-b !rounded-t-[32px] !rounded-b-none sm:!rounded-[24px] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] sm:!shadow-[0_12px_40px_rgba(15,23,42,0.04)] bg-white">
        <div className="grid gap-4 lg:gap-5 border-b border-slate-100 pb-4 lg:pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.22em] text-[var(--portal-primary)]">Home access</p>
            <h1 className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-black text-[#172033] sm:text-4xl portal-colorful-text">Pilih Industri</h1>
            <p className="mt-1.5 lg:mt-3 max-w-3xl text-[11px] lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">
              {role === "developer"
                ? "Klik icon industri untuk melihat seluruh sub-industri dari database."
                : "Klik icon industri untuk melihat sub-industri aktif dan rekomendasi pembelian berikutnya."}
            </p>
          </div>
          <div className="portal-mobile-stat-row grid grid-cols-3 gap-2 sm:grid-cols-3 lg:min-w-[430px]">
            {([
              [String(industries.length), "Industri", Database],
              [String(totalSegments), "Sub-industri", Layers3],
              [role === "developer" ? "All" : String(accessibleSegments), "Terbuka", LockOpen]
            ] as Array<[string, string, typeof Database]>).map(([value, label, Icon]) => (
              <div key={label} className="rounded-[12px] lg:rounded-[18px] bg-[var(--portal-primary-soft)] p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg lg:text-2xl font-black text-[#172033]">{value}</p>
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-[var(--portal-primary)] opacity-60" />
                </div>
                <p className="mt-0.5 lg:mt-0 text-[8.5px] lg:text-xs font-black uppercase tracking-[0.1em] lg:tracking-[0.14em] text-[var(--portal-primary)] leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 lg:mt-6 grid portal-mobile-3-cols grid-cols-3 gap-x-2 lg:gap-x-3 gap-y-5 lg:gap-y-6 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12">
          {industries.map((industry) => {
            const Icon = getIndustryIcon(industry.iconKey);
            const industryColor = getIndustryColor(industry.colorKey);
            const purchasedCount = industry.subIndustries.filter((segment) => ownerPurchasedSegments.has(segment.name)).length;
            const isActiveForOwner = role === "developer" || purchasedCount > 0;
            return (
              <button
                key={industry.id}
                onClick={() => { setMobileSegmentIndex(0); setSelectedCatalogIndustry(industry); }}
                className="group flex min-w-0 flex-col items-center gap-2 rounded-[18px] p-2 text-center transition hover:bg-slate-50"
                type="button"
              >
                <span
                  className="relative grid h-12 w-12 lg:h-14 lg:w-14 place-items-center rounded-[14px] lg:rounded-[17px] shadow-[0_12px_26px_rgba(15,23,42,0.08)] transition group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)] sm:h-16 sm:w-16 sm:rounded-[20px]"
                  style={{ background: `linear-gradient(135deg, ${industryColor}, ${industryColor}90)`, color: "#ffffff" }}
                >
                  <Icon className="h-6 w-6 lg:h-7 lg:w-7 sm:h-8 sm:w-8" />
                  <span className="absolute -right-1 -top-1 grid h-4 lg:h-5 min-w-[16px] lg:min-w-5 place-items-center rounded-full bg-white px-1 text-[9px] lg:text-[10px] font-black shadow-sm" style={{ color: industryColor }}>
                    {industry.subIndustries.length}
                  </span>
                </span>
                <span className="line-clamp-2 min-h-[28px] lg:min-h-[32px] text-[10px] lg:text-[11px] font-black leading-[13px] lg:leading-4 text-[#172033] sm:text-xs">{industry.name}</span>
                <span className={`h-1.5 w-1.5 rounded-full ${isActiveForOwner ? "bg-emerald-400" : "bg-slate-300"}`} />
              </button>
            );
          })}
        </div>
      </Panel>

      {role === "owner" ? (
        <Panel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Subscription aktif</p>
              <h2 className="mt-2 text-2xl font-black text-[#172033]">HRIS Growth</h2>
              <p className="mt-1 text-sm font-bold text-slate-500">Sub-industri aktif tenant saat ini. Sub-industri lain ditampilkan sebagai saran pembelian.</p>
            </div>
            <button onClick={() => setActivePage("hris")} className="w-fit rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
              Buka HRIS
            </button>
          </div>
        </Panel>
      ) : null}
      </div>

      <AnimatePresence>
        {selectedCatalogIndustry ? (
          <IndustrySegmentsModal
            industry={selectedCatalogIndustry}
            role={role}
            mobileSegmentIndex={mobileSegmentIndex}
            setMobileSegmentIndex={setMobileSegmentIndex}
            onClose={() => setSelectedCatalogIndustry(null)}
            onOpenIndustry={() => {
              router.push(getIndustryPortalPath(selectedCatalogIndustry));
              setSelectedCatalogIndustry(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
function IndustrySegmentsModal({
  industry,
  role,
  mobileSegmentIndex,
  setMobileSegmentIndex,
  onClose,
  onOpenIndustry
}: {
  industry: PortalCatalogIndustry;
  role: PortalRole;
  mobileSegmentIndex: number;
  setMobileSegmentIndex: (value: number) => void;
  onClose: () => void;
  onOpenIndustry: () => void;
}) {
  const router = useRouter();
  const [selectedSegmentForPricing, setSelectedSegmentForPricing] = useState<PortalCatalogSubIndustry | null>(null);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const Icon = getIndustryIcon(industry.iconKey);
  const industryColor = getIndustryColor(industry.colorKey);
  const industrySoft = `color-mix(in srgb, ${industryColor} 12%, white)`;
  const openSegments = role === "developer"
    ? industry.subIndustries
    : industry.subIndustries.filter((segment) => ownerPurchasedSegments.has(segment.name));
  const mobileSegment = industry.subIndustries[mobileSegmentIndex] ?? industry.subIndustries[0];
  const mobileSegmentAccessible = role === "developer" || ownerPurchasedSegments.has(mobileSegment?.name ?? "");
  const pricingPlans = useMemo(() => {
    if (!selectedSegmentForPricing) return null;
    return buildPlans(industry.name, selectedSegmentForPricing.name, []);
  }, [industry.name, selectedSegmentForPricing]);

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.24 }}
        className="flex h-auto max-h-[88dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[min(92rem,calc(100vw-2.5rem))] sm:rounded-[26px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative shrink-0 overflow-hidden border-b border-slate-100 p-5 sm:p-7">
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-white shadow-[0_16px_36px_rgba(15,23,42,0.12)]" style={{ backgroundColor: industryColor }}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: industryColor }}>Katalog sub-industri</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-[#172033] sm:text-4xl">{industry.name}</h2>
                <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500">{industry.solution || industry.pain}</p>
              </div>
            </div>
            <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200" type="button" aria-label="Tutup modal sub-industri">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500">{industry.subIndustries.length} sub-industri</span>
            <span className="rounded-full px-3 py-1.5 text-xs font-black" style={{ backgroundColor: industrySoft, color: industryColor }}>
              {role === "developer" ? "All unlocked" : `${openSegments.length} dibeli`}
            </span>
            <button onClick={onOpenIndustry} className="rounded-full bg-[#111111] px-3 py-1.5 text-xs font-black text-white" type="button">
              Buka halaman industri
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          {mobileSegment ? (
            <div className="sm:hidden">
              <button
                type="button"
                className="w-full rounded-[24px] border border-slate-100 bg-white p-5 text-left shadow-[0_12px_34px_rgba(15,23,42,0.08)]"
                onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
                onTouchEnd={(event) => {
                  const startX = touchStartX.current;
                  const endX = event.changedTouches[0]?.clientX;
                  touchStartX.current = null;
                  if (startX === null || endX === undefined || Math.abs(startX - endX) < 40) return;
                  didSwipe.current = true;
                  setMobileSegmentIndex(startX > endX ? Math.min(industry.subIndustries.length - 1, mobileSegmentIndex + 1) : Math.max(0, mobileSegmentIndex - 1));
                }}
                onClick={() => {
                  if (didSwipe.current) { didSwipe.current = false; return; }
                  if (mobileSegmentAccessible) {
                    router.push(getSubIndustryPortalPath(industry, mobileSegment));
                    onClose();
                  } else setSelectedSegmentForPricing(mobileSegment);
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: industryColor }}>{mobileSegmentAccessible ? "Accessible" : "Saran pembelian"}</p>
                <div className="mt-4 flex items-center gap-3">
                  {(() => { const SegmentIcon = getSegmentIcon(mobileSegment.name, mobileSegment.iconKey); return <SegmentIcon className="h-8 w-8" style={{ color: industryColor }} />; })()}
                  <h3 className="text-2xl font-black text-[#172033]">{mobileSegment.name}</h3>
                </div>
                <p className="mt-4 text-sm font-bold leading-6 text-slate-500">{mobileSegment.need}</p>
                <span className="mt-5 inline-flex rounded-full px-3 py-1.5 text-xs font-black" style={{ backgroundColor: industrySoft, color: industryColor }}>{mobileSegmentAccessible ? "Buka sub-industri" : "Lihat paket"}</span>
              </button>
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {industry.subIndustries.map((segment, index) => <button key={segment.name} type="button" aria-label={`Sub-industri ${index + 1}`} onClick={() => setMobileSegmentIndex(index)} className={`block shrink-0 rounded-full transition-all ${index === mobileSegmentIndex ? "h-1.5 w-1.5" : "h-1.5 w-1.5 bg-slate-200"}`} style={index === mobileSegmentIndex ? { backgroundColor: industryColor } : undefined} />)}
              </div>
            </div>
          ) : null}
          <div className="hidden grid-cols-3 gap-2 sm:grid sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
            {industry.subIndustries.map((segment) => {
              const accessible = role === "developer" || ownerPurchasedSegments.has(segment.name);
              const SegmentIcon = getSegmentIcon(segment.name, segment.iconKey);
              return (
                <div
                  key={segment.name}
                  className="group cursor-pointer rounded-[20px] bg-white border border-slate-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                  onClick={() => {
                    if (accessible) {
                      if (industry.slug === "internal-operations") {
                        setStoredTenantContext({ tenantId: "pt-omnia-internal", branchId: null, branchScope: "single" });
                        window.location.href = getSubIndustryPortalPath(industry, segment);
                      } else {
                        if (getStoredActiveTenantId() === "pt-omnia-internal") {
                          setStoredTenantContext({ tenantId: null, branchId: null, branchScope: "single" });
                        }
                        router.push(getSubIndustryPortalPath(industry, segment));
                      }
                      onClose();
                      return;
                    }
                    setSelectedSegmentForPricing(segment);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: industryColor }}>
                        {accessible ? "Accessible" : "Saran pembelian"}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <SegmentIcon className="h-5 w-5" style={{ color: industryColor }} />
                        <h3 className="text-lg font-black text-[#172033]">{segment.name}</h3>
                      </div>
                    </div>
                    {accessible ? <ArrowRight className="mt-1 h-5 w-5" style={{ color: industryColor }} /> : <Lock className="mt-1 h-5 w-5 text-slate-400" />}
                  </div>
                  <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{segment.need}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
      {pricingPlans ? (
        <PricingPlanModal
          open={selectedSegmentForPricing !== null}
          onOpenChange={(open) => { if (!open) setSelectedSegmentForPricing(null); }}
          tiers={pricingPlans.tiers}
          featureRows={pricingPlans.featureRows}
          addOns={pricingPlans.addOns}
          inquirySubject={`${industry.name} - ${selectedSegmentForPricing?.name ?? ""}`}
          themeColor="orange"
        />
      ) : null}
    </motion.div>
  );

  return createPortal(modal, document.body);
}
