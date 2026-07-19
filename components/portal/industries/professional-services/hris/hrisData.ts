import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Filter,
  HandCoins,
  Lock,
  Receipt,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Target,
  UserPlus,
  UserRound,
  UserSearch,
  UsersRound,
  WalletCards,
  XCircle
} from "lucide-react";
import type { HrisCatalogModule, HrisModuleKey, HrisTier, LeaveRequest } from "./hrisTypes";

export const employeeRows = [
  { name: "Alya Putri", role: "HR Admin", department: "People", status: "Active", attendance: "Present", salary: "Rp8.500.000" },
  { name: "Raka Pratama", role: "Finance Officer", department: "Finance", status: "Active", attendance: "Late", salary: "Rp9.200.000" },
  { name: "Nadia Safira", role: "Operations Lead", department: "Operations", status: "Active", attendance: "Present", salary: "Rp10.000.000" },
  { name: "Dimas Ardi", role: "Frontend Engineer", department: "Product", status: "Probation", attendance: "Remote", salary: "Rp11.500.000" },
  { name: "Mira Lestari", role: "Account Executive", department: "Sales", status: "Active", attendance: "Leave", salary: "Rp7.800.000" },
  { name: "Bagas Wicaksono", role: "Customer Success", department: "Support", status: "Active", attendance: "Present", salary: "Rp7.600.000" },
  { name: "Citra Maharani", role: "QA Analyst", department: "Product", status: "Active", attendance: "Present", salary: "Rp8.900.000" },
  { name: "Yusuf Akbar", role: "IT Support", department: "Technology", status: "Contract", attendance: "Late", salary: "Rp7.200.000" }
];

export const attendanceRows = [
  { name: "Alya Putri", shift: "09:00 - 18:00", in: "08:54", out: "17:58", status: "On time" },
  { name: "Raka Pratama", shift: "09:00 - 18:00", in: "09:18", out: "-", status: "Late" },
  { name: "Nadia Safira", shift: "08:00 - 17:00", in: "07:51", out: "17:04", status: "Complete" },
  { name: "Dimas Ardi", shift: "Remote", in: "09:02", out: "-", status: "Remote" },
  { name: "Mira Lestari", shift: "09:00 - 18:00", in: "-", out: "-", status: "Leave" },
  { name: "Bagas Wicaksono", shift: "10:00 - 19:00", in: "09:55", out: "-", status: "On time" },
  { name: "Citra Maharani", shift: "09:00 - 18:00", in: "08:59", out: "-", status: "On time" }
];

export const payrollRows = [
  { name: "Alya Putri", gross: "Rp8.900.000", deduction: "Rp400.000", net: "Rp8.500.000", status: "Ready" },
  { name: "Raka Pratama", gross: "Rp9.700.000", deduction: "Rp500.000", net: "Rp9.200.000", status: "Ready" },
  { name: "Nadia Safira", gross: "Rp10.600.000", deduction: "Rp600.000", net: "Rp10.000.000", status: "Review" },
  { name: "Dimas Ardi", gross: "Rp12.000.000", deduction: "Rp500.000", net: "Rp11.500.000", status: "Ready" },
  { name: "Mira Lestari", gross: "Rp8.250.000", deduction: "Rp450.000", net: "Rp7.800.000", status: "Ready" },
  { name: "Bagas Wicaksono", gross: "Rp8.000.000", deduction: "Rp400.000", net: "Rp7.600.000", status: "Review" },
  { name: "Citra Maharani", gross: "Rp9.300.000", deduction: "Rp400.000", net: "Rp8.900.000", status: "Ready" }
];

export const payslipRows = [
  { employee: "Alya Putri", period: "Mei 2026", amount: "Rp8.500.000", status: "Published" },
  { employee: "Raka Pratama", period: "Mei 2026", amount: "Rp9.200.000", status: "Published" },
  { employee: "Nadia Safira", period: "Mei 2026", amount: "Rp10.000.000", status: "Waiting payroll" },
  { employee: "Dimas Ardi", period: "Mei 2026", amount: "Rp11.500.000", status: "Published" },
  { employee: "Mira Lestari", period: "Mei 2026", amount: "Rp7.800.000", status: "Published" },
  { employee: "Bagas Wicaksono", period: "Mei 2026", amount: "Rp7.600.000", status: "Waiting payroll" }
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: "LV-1024", employee: "Budi Santoso", type: "Annual Leave", dates: "12-14 Juni 2026", reason: "Liburan keluarga", status: "Pending" },
  { id: "LV-1018", employee: "Nadia Safira", type: "Permit", dates: "24 Mei 2026", reason: "Urus dokumen", status: "Approved" },
  { id: "LV-1015", employee: "Raka Pratama", type: "Annual Leave", dates: "20 Mei 2026", reason: "Personal leave", status: "Rejected" },
  { id: "LV-1012", employee: "Alya Putri", type: "Permit", dates: "16 Mei 2026", reason: "Family matter", status: "Approved" }
];

export const hrisWorkspaceModules: Array<{ key: HrisModuleKey; name: string; icon: typeof UsersRound; active: boolean }> = [
  { key: "employees", name: "Employees", icon: UsersRound, active: true },
  { key: "attendance", name: "Attendance", icon: CalendarCheck2, active: true },
  { key: "leave", name: "Leave", icon: ShieldCheck, active: true },
  { key: "payroll", name: "Payroll", icon: WalletCards, active: true },
  { key: "payslip", name: "Payslip", icon: FileText, active: true },
  { key: "reimbursement", name: "Reimbursement", icon: Receipt, active: true },
  { key: "loans", name: "Kasbon", icon: HandCoins, active: true },
  { key: "field-report", name: "Field Report", icon: Receipt, active: true },
  { key: "advanced-payroll", name: "Adv. Payroll", icon: ReceiptText, active: true },
  { key: "dashboard", name: "Dashboard", icon: BarChart3, active: false },
  { key: "performance", name: "Performance", icon: Target, active: false },
  { key: "recruitment", name: "Recruitment", icon: UserSearch, active: false }
];

export const hrisCatalogModules: HrisCatalogModule[] = [
  { key: "organization", name: "Organization Setup", caption: "Tenant, department, position, lokasi kerja.", category: "Core", minimumTier: "starter", icon: Building2 },
  { key: "employees", name: "Employee Database", caption: "Profil, kontrak, import, dokumen karyawan.", category: "Core", minimumTier: "starter", icon: UsersRound, route: "hris-employees" },
  { key: "self-service", name: "Employee Self-Service", caption: "Update profil, rekening, riwayat pribadi.", category: "Core", minimumTier: "starter", icon: UserRound },
  { key: "attendance", name: "Attendance", caption: "Clock in/out, riwayat, koreksi, sync device.", category: "Time", minimumTier: "starter", icon: CalendarCheck2, route: "hris-attendance" },
  { key: "shift", name: "Shift & Roster", caption: "Jadwal kerja, roster, multi shift.", category: "Time", minimumTier: "starter", icon: Clock3 },
  { key: "leave", name: "Leave Approval", caption: "Cuti, izin, sakit, saldo cuti, approval.", category: "Time", minimumTier: "starter", icon: ShieldCheck, route: "hris-leave" },
  { key: "overtime", name: "Overtime", caption: "Request lembur dan approval overtime.", category: "Time", minimumTier: "starter", icon: Activity },
  { key: "payroll", name: "Payroll Basic", caption: "Draft, review, finalisasi payroll bulanan dan lembur.", category: "Payroll", minimumTier: "starter", icon: WalletCards, route: "hris-payroll" },
  { key: "payslip", name: "Payslip", caption: "Publish slip gaji dan arsip payslip.", category: "Payroll", minimumTier: "starter", icon: FileText, route: "hris-payslip" },
  { key: "advanced-payroll", name: "Advanced Payroll", caption: "Komponen gaji custom, prorate, PPh 21, BPJS.", category: "Payroll", minimumTier: "growth", icon: ReceiptText, route: "hris-advanced-payroll" },
  { key: "reimbursement", name: "Reimbursement", caption: "Klaim biaya, upload bukti transaksi, approval berjenjang.", category: "Finance", minimumTier: "growth", icon: Receipt, route: "hris-reimbursement" },
  { key: "loans", name: "Kasbon", caption: "Pengajuan utang karyawan dan cicilan payroll otomatis.", category: "Finance", minimumTier: "growth", icon: HandCoins, route: "hris-loans" },
  { key: "field-report", name: "Field Report", caption: "Absensi lokasi GPS, laporan kunjungan, route tracking.", category: "Time", minimumTier: "growth", icon: Receipt, route: "hris-field-report" },
  { key: "dashboard", name: "HR Dashboard", caption: "Headcount, attendance, leave, payroll summary.", category: "Control", minimumTier: "pro", icon: BarChart3, route: "hris-dashboard" },
  { key: "performance", name: "Performance (KPI)", caption: "Manajemen KPI, OKR, dan evaluasi kinerja.", category: "Talent", minimumTier: "pro", icon: Target, route: "hris-performance" },
  { key: "analytics", name: "HR Analytics", caption: "Insight advanced dan anomaly detection.", category: "Control", minimumTier: "pro", icon: Activity },
  { key: "audit", name: "Audit Log HR", caption: "Riwayat salary, formula, approval, finalisasi.", category: "Control", minimumTier: "pro", icon: Lock },
  { key: "recruitment", name: "Recruitment (ATS)", caption: "Applicant tracking system dan portal lowongan kerja.", category: "Talent", minimumTier: "enterprise", icon: UserSearch, route: "hris-recruitment" },
  { key: "integrations", name: "Integrations", caption: "Attendance device, accounting, SSO/API payroll.", category: "Integration", minimumTier: "enterprise", icon: Database },
  { key: "dedicated-db", name: "Dedicated Database", caption: "Isolasi database dan SLA Enterprise.", category: "Enterprise", minimumTier: "enterprise", icon: BriefcaseBusiness }
];

export const tierRank: Record<HrisTier, number> = {
  starter: 1,
  growth: 2,
  pro: 3,
  enterprise: 4
};

export const hrisTierConfigs: Record<HrisTier, {
  name: string;
  price: string;
  priceUnit: string;
  caption: string;
  employeeLimit: string;
  activeModules: HrisModuleKey[];
  highlights: string[];
}> = {
  starter: {
    name: "Starter",
    price: "Rp799rb",
    priceUnit: "/ bulan",
    caption: "Untuk database karyawan, absensi GPS, cuti, payroll sederhana, dan payslip digital.",
    employeeLimit: "hingga 25 karyawan",
    activeModules: ["employees", "attendance", "leave", "payroll", "payslip"],
    highlights: ["Employee database", "Attendance & GPS", "Employee self-service"]
  },
  growth: {
    name: "Growth",
    price: "Rp1,5jt",
    priceUnit: "/ bulan",
    caption: "Untuk HR aktif dengan advanced payroll, reimbursement, dan field report.",
    employeeLimit: "hingga 75 karyawan",
    activeModules: ["employees", "attendance", "leave", "payroll", "payslip", "advanced-payroll", "reimbursement", "loans", "field-report"],
    highlights: ["Leave approval", "Payroll run & payslip", "Shift & roster"]
  },
  pro: {
    name: "Pro",
    price: "Rp3jt+",
    priceUnit: "/ bulan",
    caption: "Untuk multi-divisi dengan kontrol anti-fraud lanjutan, HR analytics, KPI, dan approval berjenjang.",
    employeeLimit: "hingga 200 karyawan",
    activeModules: ["employees", "attendance", "leave", "payroll", "payslip", "advanced-payroll", "reimbursement", "loans", "field-report", "dashboard", "performance"],
    highlights: ["HR analytics & dashboard", "PPh 21 & BPJS export", "Overtime & approval policy"]
  },
  enterprise: {
    name: "Enterprise",
    price: "Mulai Rp7,5jt",
    priceUnit: "/ bulan",
    caption: "Untuk korporasi dengan SLA, database dedicated, dan integrasi custom.",
    employeeLimit: "custom & negosiasi",
    activeModules: ["employees", "attendance", "leave", "payroll", "payslip", "advanced-payroll", "reimbursement", "loans", "field-report", "dashboard", "performance", "recruitment"],
    highlights: ["Dedicated database", "Custom integration & SSO", "SLA & priority support"]
  }
};

export function buildHrisFeatureMeta(tier: HrisTier, payrollFinalized: boolean) {
  return {
    employees: { eyebrow: "Employee master", title: "Employee Database", body: "Data karyawan, department, status kerja, dan salary assignment.", stats: [["75", "Karyawan aktif", UsersRound], ["7", "Department", Building2], ["5", "Probation", UserRound], ["3", "Data perlu review", Filter]] },
    attendance: { eyebrow: "Time tracking", title: "Attendance", body: "Pantau clock in/out, keterlambatan, shift, dan sync device.", stats: [["92%", "Attendance rate", CalendarCheck2], ["68", "Present hari ini", CheckCircle2], ["5", "Late", Clock3], ["12", "Belum clock out", Bell]] },
    leave: { eyebrow: "Approval flow", title: "Leave Approval", body: "Pengajuan cuti, izin, sakit, approval, dan riwayat keputusan.", stats: [["4", "Pending approval", ShieldCheck], ["12", "Approved bulan ini", CheckCircle2], ["2", "Rejected", XCircle], ["18", "Sisa cuti rata-rata", CalendarCheck2]] },
    payroll: { eyebrow: "Payroll run", title: "Payroll", body: "Draft payroll, komponen gaji, deduction, dan finalisasi periode.", stats: [[payrollFinalized ? "Final" : "Draft", "Payroll Mei", WalletCards], ["Rp428jt", "Total gross", ReceiptText], ["Rp31jt", "Deduction", Filter], ["75", "Employee included", UsersRound]] },
    payslip: { eyebrow: "Employee document", title: "Payslip", body: "Slip gaji per karyawan, status publish, dan download dokumen.", stats: [["75", "Payslip generated", FileText], ["68", "Published", CheckCircle2], ["7", "Waiting payroll", Clock3], ["Mei", "Periode aktif", CalendarCheck2]] },
    dashboard: { eyebrow: tierRank[tier] >= tierRank.pro ? "Analytics" : "Locked analytics", title: "HR Dashboard", body: tierRank[tier] >= tierRank.pro ? "Analytics lanjutan untuk headcount, payroll, attendance, dan anomaly." : "Analytics lanjutan tersedia di tier Business.", stats: [[tierRank[tier] >= tierRank.pro ? "Open" : "Locked", "Tier aktif", tierRank[tier] >= tierRank.pro ? CheckCircle2 : Lock], ["Pro", tierRank[tier] >= tierRank.pro ? "Included" : "Upgrade needed", ArrowRight], ["3", "Analytics pack", BarChart3], ["Audit", tierRank[tier] >= tierRank.pro ? "Included" : "Included on upgrade", ShieldCheck]] },
    "advanced-payroll": { eyebrow: "Advanced finance", title: "Advanced Payroll", body: "Kalkulasi BPJS, PPh 21 otomatis, dan komponen gaji custom.", stats: [["BPJS", "Tersedia", ShieldCheck], ["PPh 21", "Otomatis", ReceiptText], ["Custom", "Setup", Settings], ["Prorate", "Otomatis", Clock3]] },
    reimbursement: { eyebrow: "Finance klaim", title: "Reimbursement", body: "Klaim biaya dengan upload bukti dan approval berjenjang.", stats: [["0", "Pending claim", Receipt], ["12", "Approved", CheckCircle2], ["Rp0", "Total claim", WalletCards], ["2", "Rejected", XCircle]] },
    loans: { eyebrow: "Kasbon karyawan", title: "Kasbon", body: "Pengajuan utang karyawan, approval owner, dan cicilan payroll otomatis.", stats: [["Growth", "Minimal tier", HandCoins], ["0", "Pending", Clock3], ["Payroll", "Auto deduction", WalletCards], ["Self", "Employee portal", UserRound]] },
    "field-report": { eyebrow: "Tim lapangan", title: "Field Report", body: "Absensi lokasi GPS, route tracking, dan laporan kunjungan.", stats: [["14", "Visit hari ini", Receipt], ["2", "Luar area GPS", Activity], ["100%", "Check in success", CheckCircle2], ["15", "Active tim", UsersRound]] },
    performance: { eyebrow: "Talent management", title: "Performance (KPI)", body: "Manajemen KPI, OKR, dan evaluasi kinerja karyawan.", stats: [["15", "Active KPI", Target], ["85%", "Avg score", Activity], ["2", "Needs review", Search], ["Q2", "Periode aktif", CalendarCheck2]] },
    recruitment: { eyebrow: "Applicant tracking", title: "Recruitment (ATS)", body: "Kelola lowongan, screening kandidat, dan hiring process.", stats: [["3", "Open jobs", BriefcaseBusiness], ["45", "Total applicants", UsersRound], ["5", "Interviewing", UserSearch], ["1", "Hired", UserPlus]] }
  };
}
