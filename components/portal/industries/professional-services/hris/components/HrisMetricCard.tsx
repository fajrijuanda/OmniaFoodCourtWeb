import type { LucideIcon } from "lucide-react";
import { MetricCard } from "../../../../ui";

const hrisMetricTrends: Record<string, { value: string; direction: "up" | "down" | "neutral"; caption: string }> = {
  "Karyawan aktif": { value: "+10%", direction: "up", caption: "dari bulan lalu" },
  Karyawan: { value: "+10%", direction: "up", caption: "dari bulan lalu" },
  "Modul terbuka": { value: "+24.5%", direction: "up", caption: "coverage tier" },
  "Modul terkunci": { value: "-16.2%", direction: "down", caption: "setelah upgrade" },
  "Harga tier": { value: "Aktif", direction: "neutral", caption: "per karyawan" },
  Department: { value: "+2", direction: "up", caption: "department baru" },
  Probation: { value: "-5%", direction: "down", caption: "dari bulan lalu" },
  "Data perlu review": { value: "-3", direction: "down", caption: "issue selesai" },
  "Attendance rate": { value: "+4.8%", direction: "up", caption: "dari minggu lalu" },
  "Present hari ini": { value: "+6", direction: "up", caption: "vs kemarin" },
  Late: { value: "-2.5%", direction: "down", caption: "dari minggu lalu" },
  "Belum clock out": { value: "+3", direction: "neutral", caption: "perlu follow up" },
  "Pending approval": { value: "-12%", direction: "down", caption: "lebih cepat diproses" },
  "Approved bulan ini": { value: "+18%", direction: "up", caption: "dari bulan lalu" },
  Rejected: { value: "-1", direction: "down", caption: "lebih rendah" },
  "Sisa cuti rata-rata": { value: "+2 hari", direction: "up", caption: "saldo rata-rata" },
  "Payroll Mei": { value: "+100%", direction: "up", caption: "progress run" },
  "Total gross": { value: "+8.2%", direction: "up", caption: "dari bulan lalu" },
  Deduction: { value: "-1.6%", direction: "down", caption: "dari bulan lalu" },
  "Employee included": { value: "+10%", direction: "up", caption: "dari bulan lalu" },
  "Payslip generated": { value: "+100%", direction: "up", caption: "periode ini" },
  Published: { value: "+24.5%", direction: "up", caption: "dari minggu lalu" },
  "Waiting payroll": { value: "-16.2%", direction: "down", caption: "dari periode lalu" },
  "Periode aktif": { value: "On track", direction: "neutral", caption: "periode berjalan" },
  "Tier aktif": { value: "+1 tier", direction: "up", caption: "akses demo" },
  "Upgrade needed": { value: "Locked", direction: "neutral", caption: "butuh upgrade" },
  "Analytics pack": { value: "+15.2%", direction: "up", caption: "insight aktif" },
  "Included on upgrade": { value: "Ready", direction: "neutral", caption: "tersedia" },
  Tersedia: { value: "+8.24%", direction: "up", caption: "coverage naik" },
  Otomatis: { value: "+12.6%", direction: "up", caption: "otomasi aktif" },
  Setup: { value: "Ready", direction: "neutral", caption: "konfigurasi" },
  "Pending claim": { value: "-100%", direction: "down", caption: "dari minggu lalu" },
  Approved: { value: "+18.2%", direction: "up", caption: "dari bulan lalu" },
  "Total claim": { value: "-8.7%", direction: "down", caption: "dari bulan lalu" },
  "Visit hari ini": { value: "+4.3%", direction: "up", caption: "dari rute kemarin" },
  "Luar area GPS": { value: "-2.5%", direction: "down", caption: "dari minggu lalu" },
  "Check in success": { value: "+15.8%", direction: "up", caption: "akurasi lokasi" },
  "Active tim": { value: "+3", direction: "up", caption: "tim lapangan" },
  "Active KPI": { value: "+18.2%", direction: "up", caption: "dari kuartal lalu" },
  "Avg score": { value: "+8.24%", direction: "up", caption: "dari review lalu" },
  "Needs review": { value: "-2", direction: "down", caption: "lebih sedikit" },
  "Open jobs": { value: "+1", direction: "up", caption: "lowongan baru" },
  "Total applicants": { value: "+15.8%", direction: "up", caption: "dari bulan lalu" },
  Interviewing: { value: "+4.3%", direction: "up", caption: "pipeline" },
  Hired: { value: "+1", direction: "up", caption: "bulan ini" }
};

export function HrisMetricCard({ value, label, Icon }: { value: string; label: string; Icon: LucideIcon }) {
  const trend = hrisMetricTrends[label] ?? { value: "+0%", direction: "neutral" as const, caption: "periode berjalan" };
  return (
    <MetricCard
      label={label}
      value={value}
      icon={Icon}
      trend={trend.value}
      caption={trend.caption}
      tone={trend.direction === "down" ? "rose" : trend.direction === "up" ? "emerald" : "slate"}
    />
  );
}
