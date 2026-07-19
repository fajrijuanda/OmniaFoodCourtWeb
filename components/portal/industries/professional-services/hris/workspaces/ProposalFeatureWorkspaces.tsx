"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, MapPin, Plus, RefreshCw, Send, Target, UserPlus } from "lucide-react";
import { PortalDataTable, StatusBadge as PortalStatusBadge } from "@/components/portal/ui";
import { apiFetch } from "@/lib/api";

function downloadFile(file: { filename: string; mimeType: string; content: string }) {
  const bytes = Uint8Array.from(atob(file.content), (char) => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: file.mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = file.filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function HrisDashboardLiveWorkspace() {
  const [summary, setSummary] = useState<any>(null);

  const load = () => apiFetch("/api/tenant/hris/dashboard/summary").then(setSummary).catch(console.error);
  useEffect(() => { load(); }, []);

  const exportSummary = (format: "pdf" | "excel") => {
    apiFetch<{ filename: string; mimeType: string; content: string }>(`/api/tenant/hris/dashboard/export?format=${format}`).then(downloadFile);
  };

  const cards = [
    ["Employees", summary?.employees ?? 0],
    ["Attendance today", summary?.attendanceToday ?? 0],
    ["Pending leave", summary?.pendingLeave ?? 0],
    ["Open jobs", summary?.openJobs ?? 0]
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">HR Analytics Dashboard</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Ringkasan real-time dari modul HRIS tenant.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportSummary("excel")} className="rounded-full border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600" type="button"><Download className="mr-1 inline h-4 w-4" /> Excel</button>
          <button onClick={() => exportSummary("pdf")} className="rounded-full bg-[var(--portal-primary)] px-4 py-2.5 text-xs font-black text-[var(--portal-on-primary)]" type="button"><Download className="mr-1 inline h-4 w-4" /> PDF</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-[18px] bg-slate-50 p-4">
            <p className="text-2xl font-black text-[#172033]">{String(value)}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReimbursementWorkspace() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ type: "Travel", amount: "", receiptText: "", notes: "" });
  const load = () => apiFetch<any[]>("/api/tenant/hris/reimbursement").then(setRows).catch(console.error);
  useEffect(() => { load(); }, []);

  const submit = () => {
    apiFetch("/api/tenant/hris/reimbursement", { method: "POST", body: JSON.stringify(form) }).then(() => {
      setForm({ type: "Travel", amount: "", receiptText: "", notes: "" });
      load();
    });
  };

  return (
    <CrudShell title="Smart Reimbursement" caption="Klaim biaya dengan OCR sederhana dan approval.">
      <div className="grid gap-3 lg:grid-cols-[0.85fr_1.2fr]">
        <FormPanel actionLabel="Submit claim" onSubmit={submit}>
          <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Type" />
          <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Amount, optional if OCR text has Rp" />
          <textarea value={form.receiptText} onChange={(e) => setForm({ ...form, receiptText: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" rows={3} placeholder="Paste receipt/OCR text, e.g. Grab Rp 125.000" />
        </FormPanel>
        <PortalDataTable rows={rows} rowKey={(row) => row.id} searchPlaceholder="Cari claim..." getSearchText={(row) => `${row.employee?.fullName} ${row.type} ${row.status}`} gridTemplateColumns="1fr 0.7fr 0.7fr 0.7fr" columns={[
          { label: "Employee", render: (row) => <b>{row.employee?.fullName}</b> },
          { label: "Type", render: (row) => row.type },
          { label: "Amount", render: (row) => `Rp ${Number(row.amount).toLocaleString("id-ID")}` },
          { label: "Status", render: (row) => <StatusBadge value={row.status} /> }
        ]} />
      </div>
    </CrudShell>
  );
}

export function FieldReportWorkspace() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ locationName: "", notes: "", latitude: "", longitude: "" });
  const load = () => apiFetch<any[]>("/api/tenant/hris/field-report").then(setRows).catch(console.error);
  useEffect(() => { load(); }, []);

  const useLocation = () => navigator.geolocation?.getCurrentPosition((pos) => setForm((current) => ({ ...current, latitude: String(pos.coords.latitude), longitude: String(pos.coords.longitude) })));
  const submit = () => apiFetch("/api/tenant/hris/field-report", { method: "POST", body: JSON.stringify({ ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) }) }).then(() => { setForm({ locationName: "", notes: "", latitude: "", longitude: "" }); load(); });

  return (
    <CrudShell title="Field Report" caption="Check-in kunjungan lapangan dengan koordinat dan catatan.">
      <div className="grid gap-3 lg:grid-cols-[0.85fr_1.2fr]">
        <FormPanel actionLabel="Check in" onSubmit={submit}>
          <input value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Location name" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Latitude" />
            <input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Longitude" />
          </div>
          <button onClick={useLocation} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" type="button"><MapPin className="mr-1 inline h-4 w-4" /> Use GPS</button>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" rows={3} placeholder="Visit notes" />
        </FormPanel>
        <PortalDataTable rows={rows} rowKey={(row) => row.id} searchPlaceholder="Cari laporan..." getSearchText={(row) => `${row.employee?.fullName} ${row.locationName}`} gridTemplateColumns="1fr 0.8fr 0.8fr" columns={[
          { label: "Employee", render: (row) => <b>{row.employee?.fullName}</b> },
          { label: "Location", render: (row) => row.locationName },
          { label: "Coordinate", render: (row) => `${Number(row.latitude ?? 0).toFixed(4)}, ${Number(row.longitude ?? 0).toFixed(4)}` }
        ]} />
      </div>
    </CrudShell>
  );
}

export function PerformanceWorkspace() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ metricName: "", targetValue: "100", actualValue: "0", period: "Q2-2026" });
  const load = () => apiFetch<any[]>("/api/tenant/hris/performance").then(setRows).catch(console.error);
  useEffect(() => { load(); }, []);
  const submit = () => apiFetch("/api/tenant/hris/performance", { method: "POST", body: JSON.stringify(form) }).then(() => { setForm({ metricName: "", targetValue: "100", actualValue: "0", period: "Q2-2026" }); load(); });

  return (
    <CrudShell title="Performance KPI" caption="Buat dan pantau KPI karyawan per kuartal.">
      <div className="grid gap-3 lg:grid-cols-[0.85fr_1.2fr]">
        <FormPanel actionLabel="Create KPI" onSubmit={submit}>
          <input value={form.metricName} onChange={(e) => setForm({ ...form, metricName: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Metric name" />
          <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Period" />
          <div className="grid grid-cols-2 gap-2">
            <input value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Target" />
            <input value={form.actualValue} onChange={(e) => setForm({ ...form, actualValue: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Actual" />
          </div>
        </FormPanel>
        <PortalDataTable rows={rows} rowKey={(row) => row.id} searchPlaceholder="Cari KPI..." getSearchText={(row) => `${row.employee?.fullName} ${row.metricName}`} gridTemplateColumns="1fr 0.8fr 0.7fr 0.7fr" columns={[
          { label: "Employee", render: (row) => <b>{row.employee?.fullName}</b> },
          { label: "Metric", render: (row) => row.metricName },
          { label: "Score", render: (row) => <span className="font-black text-[var(--portal-primary)]">{Number(row.score).toLocaleString("id-ID")}%</span> },
          { label: "Status", render: (row) => <StatusBadge value={row.status} /> }
        ]} />
      </div>
    </CrudShell>
  );
}

export function RecruitmentWorkspace() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", employmentType: "Full-time", description: "" });
  const load = () => apiFetch<any[]>("/api/tenant/hris/recruitment/jobs").then(setRows).catch(console.error);
  useEffect(() => { load(); }, []);
  const submit = () => apiFetch("/api/tenant/hris/recruitment/jobs", { method: "POST", body: JSON.stringify(form) }).then(() => { setForm({ title: "", employmentType: "Full-time", description: "" }); load(); });

  return (
    <CrudShell title="Recruitment ATS" caption="Kelola lowongan dan pipeline pelamar.">
      <div className="grid gap-3 lg:grid-cols-[0.85fr_1.2fr]">
        <FormPanel actionLabel="Post job" onSubmit={submit}>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Job title" />
          <input value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" placeholder="Employment type" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm font-bold" rows={3} placeholder="Description" />
        </FormPanel>
        <PortalDataTable rows={rows} rowKey={(row) => row.id} searchPlaceholder="Cari lowongan..." getSearchText={(row) => `${row.title} ${row.employmentType}`} gridTemplateColumns="1fr 0.8fr 0.7fr 0.7fr" columns={[
          { label: "Job", render: (row) => <b>{row.title}</b> },
          { label: "Type", render: (row) => row.employmentType },
          { label: "Applicants", render: (row) => row.jobApplicants?.length ?? 0 },
          { label: "Status", render: (row) => <StatusBadge value={row.status} /> }
        ]} />
      </div>
    </CrudShell>
  );
}

function CrudShell({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">{title}</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">{caption}</p>
        </div>
        <RefreshCw className="h-5 w-5 text-[var(--portal-primary)]" />
      </div>
      {children}
    </div>
  );
}

function FormPanel({ children, actionLabel, onSubmit }: { children: React.ReactNode; actionLabel: string; onSubmit: () => void }) {
  return (
    <div className="grid gap-3 rounded-[18px] bg-slate-50 p-4">
      {children}
      <button onClick={onSubmit} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)]" type="button">
        <Plus className="h-4 w-4" /> {actionLabel}
      </button>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  return <PortalStatusBadge status={value} tone="primary" />;
}
