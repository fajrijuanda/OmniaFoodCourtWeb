import { BookOpen, MapPin, ShieldCheck, Layers3, ClipboardList, CalendarCheck2, FileCheck2, UsersRound, Network, NotebookTabs, FileText, CheckCircle2, PenLine, Clock3, CreditCard, LayoutDashboard } from "lucide-react";

export type TierLevel = "Starter" | "Growth" | "Pro" | "Enterprise";

const tierHierarchy = {
  "Starter": 1,
  "Growth": 2,
  "Pro": 3,
  "Enterprise": 4,
  "starter": 1,
  "growth": 2,
  "pro": 3,
  "enterprise": 4,
};

export interface EducationModuleConfig {
  id: string;
  label: string;
  icon: any;
  minTier: TierLevel;
  description: string;
}

export interface EducationSubIndustryConfig {
  id: string;
  name: string;
  modules: EducationModuleConfig[];
}

export function hasAccess(currentTier: string, requiredTier: TierLevel): boolean {
  const current = tierHierarchy[currentTier as keyof typeof tierHierarchy] || 0;
  const required = tierHierarchy[requiredTier] || 99;
  return current >= required;
}

export const educationSubIndustries: Record<string, EducationSubIndustryConfig> = {
  "lms": {
    id: "lms",
    name: "E-Learning (LMS)",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan aktivitas E-Learning." },
      { id: "courses", label: "Mata Kuliah", icon: Layers3, minTier: "Starter", description: "Kelola kelas, jadwal, dan silabus." },
      { id: "assignments", label: "Tugas & Ujian", icon: ClipboardList, minTier: "Starter", description: "Daftar tugas dan status pengumpulan." },
      { id: "attendance", label: "Presensi Mahasiswa", icon: CalendarCheck2, minTier: "Starter", description: "Validasi kehadiran kelas." },
      { id: "gradebook", label: "Buku Nilai", icon: FileCheck2, minTier: "Growth", description: "Rekapitulasi komponen nilai mahasiswa." },
    ]
  },
  "kkn": {
    id: "kkn",
    name: "KKN & Fieldwork",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan aktivitas KKN." },
      { id: "groups", label: "Kelompok KKN", icon: UsersRound, minTier: "Starter", description: "Daftar kelompok, anggota, dan DPL." },
      { id: "locations", label: "Lokasi Plotting", icon: Network, minTier: "Starter", description: "Pemetaan wilayah dan kuota desa." },
      { id: "logbook", label: "Logbook Harian", icon: NotebookTabs, minTier: "Starter", description: "Jurnal kegiatan harian mahasiswa." },
      { id: "reports", label: "Laporan Akhir", icon: FileText, minTier: "Growth", description: "Review dan penilaian laporan akhir." },
    ]
  },
  "academic": {
    id: "academic",
    name: "Layanan Akademik",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan layanan akademik." },
      { id: "requests", label: "Antrean Pengajuan", icon: PenLine, minTier: "Starter", description: "Daftar permohonan mahasiswa (SIPT)." },
      { id: "documents", label: "Repositori Dokumen", icon: FileText, minTier: "Starter", description: "Arsip surat dan transkrip." },
      { id: "approvals", label: "Inbox Approval", icon: CheckCircle2, minTier: "Growth", description: "Persetujuan berjenjang Kaprodi/Dekan." },
      { id: "billing", label: "Kasir & Billing", icon: CreditCard, minTier: "Growth", description: "Invoice UKT dan denda." },
    ]
  }
};
