"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { CheckCircle2, Lock, Store, WalletCards, ArrowRight } from "lucide-react";
import { PortalPage, PortalRole } from "../../../portalTypes";
import { Panel } from "@/components/portal/ui";
import { educationSubIndustries, hasAccess, EducationModuleConfig } from "../config/educationSubIndustries";
import { UpgradeModal } from "../../../shared/UpgradeModal";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { LmsWorkspace } from "../e-learning-lms/LmsWorkspace";
import { KknWorkspace } from "../kkn-and-fieldwork/KknWorkspace";
import { AcademicWorkspace } from "../layanan-akademik/AcademicWorkspace";
import { HigherEducationTier } from "../educationTypes";

interface TutoringPortalProps {
  activePage: PortalPage;
  currentTier: string;
}

const educationOverviewProfiles: Record<string, { caption: string; limit: string; primaryValue: string; primaryLabel: string }> = {
  school: { caption: "Sistem informasi akademik dan LMS terpadu untuk institusi pendidikan.", limit: "multi jurusan", primaryValue: "0", primaryLabel: "Siswa Aktif" },
  bootcamp: { caption: "Manajemen cohort, silabus, dan proyek akhir bootcamp teknologi.", limit: "multi batch", primaryValue: "0", primaryLabel: "Siswa Terdaftar" },
  tutoring: { caption: "Portal bimbingan belajar terpusat untuk jadwal dan penagihan.", limit: "multi tutor", primaryValue: "0", primaryLabel: "Siswa Aktif" },
  "language-course": { caption: "Manajemen kursus bahasa, sertifikat, dan tes penempatan.", limit: "multi level", primaryValue: "0", primaryLabel: "Siswa Aktif" },
  "training-center": { caption: "Sistem registrasi dan evaluasi untuk lembaga pelatihan kerja.", limit: "multi program", primaryValue: "0", primaryLabel: "Peserta Aktif" },
  lms: { caption: "Portal E-Learning untuk manajemen mata kuliah, tugas, presensi, dan buku nilai terintegrasi.", limit: "multi prodi & kelas", primaryValue: "0", primaryLabel: "Kelas Aktif" },
  kkn: { caption: "Manajemen KKN & Fieldwork dengan plotting lokasi, kelompok, logbook harian, dan laporan akhir.", limit: "multi wilayah & DPL", primaryValue: "0", primaryLabel: "Kelompok KKN" },
  academic: { caption: "Layanan akademik, antrean pengajuan SIPT, repositori dokumen, approval, dan billing kasir.", limit: "SLA approval berjenjang", primaryValue: "0", primaryLabel: "Antrean Request" }
};


const moduleRouteSlugs: Record<string, string> = {
  "dashboard": "dashboard",
  "courses": "courses",
  "assignments": "assignments",
  "attendance": "attendance",
  "gradebook": "gradebook",
  "groups": "groups",
  "locations": "locations",
  "logbook": "logbook",
  "reports": "reports",
  "requests": "requests",
  "documents": "documents",
  "approvals": "approvals",
  "billing": "billing",
};

function getEducationModulePath(subIndustrySlug: string, moduleId: string) {
  const routeSlug = moduleRouteSlugs[moduleId];
  if (!routeSlug) return null;
  return `/portal/education-and-courses/${subIndustrySlug}/${routeSlug}`;
}

function getEducationTierPrice(currentTier: string) {
  const normalizedTier = currentTier.toLowerCase();
  const prices: Record<string, string> = { starter: "Rp2jt", growth: "Rp5jt", pro: "Rp10jt+", enterprise: "Mulai Rp25jt" };
  return prices[normalizedTier] ?? prices.starter;
}

export function TutoringPortal({ activePage, currentTier }: TutoringPortalProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [upgradeModal, setUpgradeModal] = useState<{isOpen: boolean, requiredTier: string, moduleName: string}>({
    isOpen: false,
    requiredTier: "Growth",
    moduleName: ""
  });

  // Extract sub-industry from pathname
  const subIndustrySlug = "tutoring";

  const subIndustry = educationSubIndustries[subIndustrySlug];

  // Extract module from pathname
  const activeModuleKey = useMemo((): string | null => {
    const parts = pathname.split("/");
    const idx = parts.indexOf(subIndustrySlug);
    if (idx !== -1 && parts.length > idx + 1) {
      const possibleModule = parts[idx + 1];
      if (moduleRouteSlugs[possibleModule]) return possibleModule;
    }
    return null;
  }, [pathname, subIndustrySlug]);

  const isUnlocked = useCallback((modMinTier: string) => hasAccess(currentTier, modMinTier as any), [currentTier]);

  // Data fetching logic
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [kknGroups, setKknGroups] = useState<any[]>([]);
  const [kknLocations, setKknLocations] = useState<any[]>([]);
  const [kknLogbook, setKknLogbook] = useState<any[]>([]);
  const [kknReports, setKknReports] = useState<any[]>([]);
  const [academicRequests, setAcademicRequests] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!activeModuleKey || activeModuleKey === "dashboard") return;
    setLoading(true);
    try {
      const [cls, asm, att, grd] = await Promise.all([
        apiFetch<any[]>("/tenant/lms/classes"),
        apiFetch<any[]>("/tenant/lms/assignments"),
        apiFetch<any[]>("/tenant/lms/attendance"),
        apiFetch<any[]>("/tenant/lms/grades")
      ]);
      setClasses(cls);
      setAssignments(asm);
      setAttendance(att);
      setGrades(grd);
    } catch (e) {
      console.error("Failed to load education data", e);
    } finally {
      setLoading(false);
    }
  }, [subIndustrySlug, activeModuleKey]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!activeModuleKey || activeModuleKey === "dashboard") {
    const unlockedModules = subIndustry.modules.filter((mod) => hasAccess(currentTier, mod.minTier as any));
    const lockedModules = subIndustry.modules.length - unlockedModules.length;
    const tierName = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);
    const tierPrice = getEducationTierPrice(currentTier);
    const overview = educationOverviewProfiles[subIndustry.id] ?? educationOverviewProfiles.lms;
    const statCards = [
      { value: overview.primaryValue, label: overview.primaryLabel, icon: Store, delta: "0%", caption: "belum ada data" },
      { value: String(unlockedModules.length), label: "Modul terbuka", icon: CheckCircle2, delta: "+24.5%", caption: "coverage tier" },
      { value: String(lockedModules), label: "Modul terkunci", icon: Lock, delta: lockedModules === 0 ? "-100%" : "-16.2%", caption: "setelah upgrade" },
      { value: tierPrice, label: "Harga tier", icon: WalletCards, delta: "Aktif", caption: "per bulan" }
    ];

    const openModule = (mod: EducationModuleConfig) => {
      const isUnlockedMod = hasAccess(currentTier, mod.minTier as any);
      if (!isUnlockedMod) {
        setUpgradeModal({ isOpen: true, requiredTier: mod.minTier, moduleName: mod.label });
        return;
      }
      const modulePath = getEducationModulePath(subIndustrySlug, mod.id);
      if (modulePath) {
        router.push(modulePath);
      }
    };

    return (
      <div className="min-h-full space-y-4 lg:space-y-6 bg-transparent px-1 py-4 sm:bg-[#fffaf5] sm:p-5 lg:p-6 sm:rounded-3xl">
        <section className="rounded-[20px] lg:rounded-[28px] border border-slate-100 bg-white p-5 lg:p-7 shadow-sm">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] lg:tracking-[0.24em] text-[var(--portal-primary)]">Education tier preview</p>
              <h1 className="mt-2 lg:mt-3 text-2xl lg:text-4xl font-black text-[#172033]">{subIndustry.name} {tierName}</h1>
              <p className="mt-2 lg:mt-3 max-w-3xl text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">{overview.caption}</p>
            </div>
            <div className="rounded-[16px] lg:rounded-[22px] bg-[var(--portal-primary-soft)] px-5 py-4 lg:px-7 lg:py-5">
              <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.18em] text-[var(--portal-primary)]">Limit</p>
              <p className="mt-1 lg:mt-2 text-lg lg:text-2xl font-black text-[#172033]">{overview.limit}</p>
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
              <p className="mt-5 lg:mt-8 text-2xl lg:text-3xl font-black text-[#07142d]">{value}</p>
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
                Kiri menampilkan launcher halaman modul. Kanan merangkum fitur terbuka dan fitur terkunci dalam card ringkas.
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
                  const isUnlockedMod = hasAccess(currentTier, mod.minTier as any);
                  const modulePath = getEducationModulePath(subIndustrySlug, mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => openModule(mod)}
                      className={`group min-h-[100px] lg:min-h-[122px] rounded-[14px] lg:rounded-[18px] border p-3 lg:p-4 text-center transition ${
                        isUnlockedMod
                          ? "border-slate-100 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[var(--portal-primary)]"
                          : "border-dashed border-slate-200 bg-white/70 hover:bg-white"
                      }`}
                      type="button"
                    >
                      <span className={`mx-auto grid h-10 w-10 lg:h-12 lg:w-12 place-items-center rounded-[12px] lg:rounded-[16px] ${
                        isUnlockedMod ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-100 text-slate-400"
                      }`}>
                        <mod.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </span>
                      <p className="mt-2.5 lg:mt-3 text-xs lg:text-sm font-black text-[#172033] leading-snug">{mod.label}</p>
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
                  const isUnlockedMod = hasAccess(currentTier, mod.minTier as any);
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
                          {isUnlockedMod ? <CheckCircle2 className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500" /> : <Lock className="h-3 w-3 lg:h-4 lg:w-4 text-slate-400" />}
                          <span className="text-xs lg:text-sm font-black text-[#172033]">{mod.label}</span>
                        </span>
                        <span className="mt-0.5 lg:mt-1 block text-[10px] lg:text-xs font-bold leading-snug lg:leading-5 text-slate-500">{mod.description}</span>
                        <span className={`mt-1.5 lg:mt-2 inline-flex rounded-full px-2 py-0.5 lg:px-2.5 lg:py-1 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${
                          isUnlockedMod ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}>
                          {isUnlockedMod ? "Unlocked" : `Req. ${mod.minTier}`}
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

  const targetMod = subIndustry.modules.find(m => m.id === activeModuleKey);
  const isAllowed = targetMod ? hasAccess(currentTier, targetMod.minTier as any) : false;

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

  
  if (loading) return <Panel className="m-6"><p className="py-8 text-center text-sm font-black text-slate-400">Loading Data...</p></Panel>;

  if (["courses", "assignments", "attendance", "gradebook"].includes(activeModuleKey as string)) {
    return <div className="p-6"><LmsWorkspace moduleKey={activeModuleKey as any} classes={classes} assignments={assignments} attendance={attendance} grades={grades} /></div>;
  }
  
  if (["groups", "locations", "logbook", "reports"].includes(activeModuleKey as string)) {
    return <div className="p-6"><KknWorkspace moduleKey={activeModuleKey as any} kknGroups={kknGroups} kknLocations={kknLocations} kknLogbook={kknLogbook} kknReports={kknReports} /></div>;
  }
  
  if (["requests", "documents", "approvals", "billing"].includes(activeModuleKey as string)) {
    return <div className="p-6"><AcademicWorkspace moduleKey={activeModuleKey as any} academicRequests={academicRequests} documents={documents} approvals={approvals} invoices={invoices} /></div>;
  }

  return null;
}
