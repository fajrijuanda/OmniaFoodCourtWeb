import { BookOpen, MapPin, ShieldCheck, Layers3, ClipboardList, CalendarCheck2, FileCheck2, UsersRound, Network, NotebookTabs, FileText, CheckCircle2, PenLine, Clock3, CreditCard, LayoutDashboard, Presentation, Target, Award, Milestone, GraduationCap } from "lucide-react";

export type TierLevel = "Starter" | "Growth" | "Pro" | "Enterprise" | "Business";

const tierHierarchy = {
  "Starter": 1,
  "Growth": 2,
  "Pro": 3,
  "Business": 3,
  "Enterprise": 4,
  "starter": 1,
  "growth": 2,
  "pro": 3,
  "business": 3,
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
  "school-campus": {
    id: "school-campus",
    name: "School / Campus",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan aktivitas akademik." },
      { id: "enrollment", label: "Penerimaan Siswa", icon: UsersRound, minTier: "Starter", description: "Sistem penerimaan siswa/mahasiswa baru." },
      { id: "classes", label: "Manajemen Kelas", icon: Layers3, minTier: "Starter", description: "Kelola jadwal, ruangan, dan kelas." },
      { id: "grades", label: "Nilai & Rapor", icon: FileCheck2, minTier: "Growth", description: "Rekapitulasi komponen nilai siswa." },
      { id: "attendance", label: "Presensi", icon: CalendarCheck2, minTier: "Starter", description: "Validasi kehadiran siswa." },
    ]
  },
  "bootcamp": {
    id: "bootcamp",
    name: "Bootcamp",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan progress bootcamp." },
      { id: "lms", label: "Modul LMS", icon: BookOpen, minTier: "Starter", description: "Akses materi dan video pembelajaran." },
      { id: "projects", label: "Tugas & Project", icon: ClipboardList, minTier: "Starter", description: "Submission project akhir dan review." },
      { id: "cohorts", label: "Manajemen Cohort", icon: Network, minTier: "Growth", description: "Kelola batch dan kelompok belajar." },
      { id: "mentorship", label: "Mentorship", icon: UsersRound, minTier: "Growth", description: "Sesi bimbingan 1-on-1." },
    ]
  },
  "tutoring": {
    id: "tutoring",
    name: "Tutoring",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan jadwal tutor." },
      { id: "schedules", label: "Jadwal Kelas", icon: Clock3, minTier: "Starter", description: "Penjadwalan les dan private." },
      { id: "attendance", label: "Absensi", icon: CalendarCheck2, minTier: "Starter", description: "Kehadiran siswa dan tutor." },
      { id: "invoicing", label: "Penagihan", icon: CreditCard, minTier: "Growth", description: "Invoice untuk paket bimbingan." },
      { id: "reports", label: "Laporan Siswa", icon: FileText, minTier: "Starter", description: "Laporan perkembangan siswa." },
    ]
  },
  "language-course": {
    id: "language-course",
    name: "Language Course",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Overview kursus bahasa." },
      { id: "classes", label: "Kelas Bahasa", icon: Presentation, minTier: "Starter", description: "Materi level pemula hingga mahir." },
      { id: "attendance", label: "Absensi", icon: CalendarCheck2, minTier: "Starter", description: "Rekap kehadiran pertemuan." },
      { id: "exams", label: "Ujian Placement", icon: Target, minTier: "Growth", description: "Ujian penentuan level bahasa." },
      { id: "certificates", label: "Sertifikat", icon: Award, minTier: "Starter", description: "Penerbitan sertifikat kelulusan." },
    ]
  },
  "training-center": {
    id: "training-center",
    name: "Training Center",
    modules: [
      { id: "dashboard", label: "Overview", icon: LayoutDashboard, minTier: "Starter", description: "Ringkasan pelatihan korporat." },
      { id: "trainings", label: "Modul Pelatihan", icon: Milestone, minTier: "Starter", description: "Materi dan silabus pelatihan." },
      { id: "trainees", label: "Peserta Training", icon: UsersRound, minTier: "Starter", description: "Daftar peserta dari berbagai divisi/klien." },
      { id: "certificates", label: "Sertifikasi", icon: Award, minTier: "Starter", description: "Sertifikat kelulusan training." },
      { id: "skill-tracking", label: "Skill Tracking", icon: GraduationCap, minTier: "Growth", description: "Evaluasi peningatan skill peserta." },
    ]
  }
};
