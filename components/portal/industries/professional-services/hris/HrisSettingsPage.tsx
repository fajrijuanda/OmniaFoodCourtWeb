"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, Loader2, Save, ShieldCheck, Smartphone, WalletCards } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BranchManagementPanel } from "@/components/portal/shared/BranchManagementPanel";
import { CheckboxField, FeedbackAlert, FormField, PortalBadge, PortalButton, SettingsSection } from "@/components/portal/ui";
import type { HrisTier } from "./HrisPortal";

type HrisSettings = {
  attendance: {
    workStart: string;
    workEnd: string;
    lateToleranceMinutes: number;
    gpsRadiusMeters: number;
    requireSelfie: boolean;
    allowMobileClockIn: boolean;
  };
  payroll: {
    cutoffDay: number;
    payDay: number;
    overtimeFormula: string;
    taxMode: string;
    bpjsKesehatanEnabled: boolean;
    bpjsKetenagakerjaanEnabled: boolean;
    jhtEnabled: boolean;
    jpEnabled: boolean;
    pph21Enabled: boolean;
    overtimeEnabled: boolean;
    prorateEnabled: boolean;
    unpaidLeaveDeductionEnabled: boolean;
    latePenaltyEnabled: boolean;
    taxableComponentsEnabled: boolean;
    kasbonDeductionEnabled: boolean;
    publishPayslipAfterFinalization: boolean;
  };
  approval: {
    leaveFlow: string;
    attendanceCorrectionFlow: string;
    payrollFinalizationFlow: string;
  };
  integrations: {
    attendanceDeviceProvider: string;
    attendanceDeviceApiUrl: string;
    ssoProvider: string;
    notificationChannel: string;
  };
  branchId?: string | null;
  isDefault?: boolean;
};

const emptySettings: HrisSettings = {
  attendance: {
    workStart: "08:00",
    workEnd: "17:00",
    lateToleranceMinutes: 15,
    gpsRadiusMeters: 120,
    requireSelfie: true,
    allowMobileClockIn: true,
  },
  payroll: {
    cutoffDay: 25,
    payDay: 28,
    overtimeFormula: "REGULATION_STANDARD",
    taxMode: "PPH21_AUTO",
    bpjsKesehatanEnabled: true,
    bpjsKetenagakerjaanEnabled: true,
    jhtEnabled: true,
    jpEnabled: true,
    pph21Enabled: true,
    overtimeEnabled: true,
    prorateEnabled: true,
    unpaidLeaveDeductionEnabled: true,
    latePenaltyEnabled: false,
    taxableComponentsEnabled: true,
    kasbonDeductionEnabled: true,
    publishPayslipAfterFinalization: true,
  },
  approval: {
    leaveFlow: "MANAGER_THEN_HR",
    attendanceCorrectionFlow: "HR_ADMIN",
    payrollFinalizationFlow: "OWNER_AND_FINANCE",
  },
  integrations: {
    attendanceDeviceProvider: "FINGERSPOT",
    attendanceDeviceApiUrl: "",
    ssoProvider: "NONE",
    notificationChannel: "EMAIL_WHATSAPP",
  },
};

export function HrisSettingsPage({ tier }: { tier: HrisTier }) {
  const [settings, setSettings] = useState<HrisSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    apiFetch<HrisSettings>("/api/tenant/hris/settings")
      .then((data) => {
        if (alive) setSettings({
          ...emptySettings,
          ...data,
          attendance: { ...emptySettings.attendance, ...(data.attendance ?? {}) },
          payroll: { ...emptySettings.payroll, ...(data.payroll ?? {}) },
          approval: { ...emptySettings.approval, ...(data.approval ?? {}) },
          integrations: { ...emptySettings.integrations, ...(data.integrations ?? {}) },
        });
      })
      .catch((error) => {
        if (alive) setMessage(error instanceof Error ? error.message : "Gagal memuat settings HRIS.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const updateSection = <K extends keyof HrisSettings>(section: K, key: string, value: string | number | boolean) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown>),
        [key]: value,
      },
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");
    try {
      const saved = await apiFetch<HrisSettings>("/api/tenant/hris/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings(saved);
      setMessage("Pengaturan HRIS berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan settings HRIS.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[360px] place-items-center">
        <div className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-white px-5 py-4 text-sm font-black text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--portal-primary)]" />
          Memuat pengaturan HRIS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">HRIS settings</p>
            <h1 className="mt-2 text-2xl font-black text-[#172033] sm:text-3xl">Pengaturan HRIS per cabang</h1>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500">
              Default tenant dipakai saat dropdown memilih Semua Cabang. Saat cabang tertentu dipilih, form ini menyimpan override cabang tersebut.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PortalBadge tone="primary">{tier} tier</PortalBadge>
            <PortalButton onClick={saveSettings} disabled={saving} loading={saving} icon={Save} type="button">Simpan</PortalButton>
          </div>
        </div>
        {message ? <FeedbackAlert message={message} className="mt-4" /> : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <SettingsSection icon={CalendarCheck2} title="Attendance rules" caption="Jam kerja, toleransi, radius GPS, dan izin clock-in mobile.">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Jam mulai" value={settings.attendance.workStart} onChange={(value) => updateSection("attendance", "workStart", value)} />
            <FormField label="Jam selesai" value={settings.attendance.workEnd} onChange={(value) => updateSection("attendance", "workEnd", value)} />
            <FormField label="Toleransi terlambat" type="number" value={settings.attendance.lateToleranceMinutes} onChange={(value) => updateSection("attendance", "lateToleranceMinutes", Number(value))} />
            <FormField label="Radius GPS meter" type="number" value={settings.attendance.gpsRadiusMeters} onChange={(value) => updateSection("attendance", "gpsRadiusMeters", Number(value))} />
            <CheckboxField label="Wajib selfie" checked={settings.attendance.requireSelfie} onChange={(value) => updateSection("attendance", "requireSelfie", value)} />
            <CheckboxField label="Mobile clock-in" checked={settings.attendance.allowMobileClockIn} onChange={(value) => updateSection("attendance", "allowMobileClockIn", value)} />
          </div>
        </SettingsSection>

        <SettingsSection icon={WalletCards} title="Payroll cut-off" caption="Cut-off, tanggal gajian, pajak, lembur, dan publish payslip.">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Cut-off tanggal" type="number" value={settings.payroll.cutoffDay} onChange={(value) => updateSection("payroll", "cutoffDay", Number(value))} />
            <FormField label="Payday tanggal" type="number" value={settings.payroll.payDay} onChange={(value) => updateSection("payroll", "payDay", Number(value))} />
            <FormField label="Formula lembur" value={settings.payroll.overtimeFormula} onChange={(value) => updateSection("payroll", "overtimeFormula", value)} />
            <FormField label="Mode pajak" value={settings.payroll.taxMode} onChange={(value) => updateSection("payroll", "taxMode", value)} />
            <CheckboxField label="Publish setelah finalisasi" checked={settings.payroll.publishPayslipAfterFinalization} onChange={(value) => updateSection("payroll", "publishPayslipAfterFinalization", value)} />
            <CheckboxField label="BPJS Kesehatan" checked={settings.payroll.bpjsKesehatanEnabled} onChange={(value) => updateSection("payroll", "bpjsKesehatanEnabled", value)} />
            <CheckboxField label="BPJS Ketenagakerjaan" checked={settings.payroll.bpjsKetenagakerjaanEnabled} onChange={(value) => updateSection("payroll", "bpjsKetenagakerjaanEnabled", value)} />
            <CheckboxField label="JHT" checked={settings.payroll.jhtEnabled} onChange={(value) => updateSection("payroll", "jhtEnabled", value)} />
            <CheckboxField label="Jaminan Pensiun" checked={settings.payroll.jpEnabled} onChange={(value) => updateSection("payroll", "jpEnabled", value)} />
            <CheckboxField label="PPh 21" checked={settings.payroll.pph21Enabled} onChange={(value) => updateSection("payroll", "pph21Enabled", value)} />
            <CheckboxField label="Hitung lembur" checked={settings.payroll.overtimeEnabled} onChange={(value) => updateSection("payroll", "overtimeEnabled", value)} />
            <CheckboxField label="Prorate join/resign" checked={settings.payroll.prorateEnabled} onChange={(value) => updateSection("payroll", "prorateEnabled", value)} />
            <CheckboxField label="Potongan unpaid leave" checked={settings.payroll.unpaidLeaveDeductionEnabled} onChange={(value) => updateSection("payroll", "unpaidLeaveDeductionEnabled", value)} />
            <CheckboxField label="Denda terlambat" checked={settings.payroll.latePenaltyEnabled} onChange={(value) => updateSection("payroll", "latePenaltyEnabled", value)} />
            <CheckboxField label="Komponen taxable" checked={settings.payroll.taxableComponentsEnabled} onChange={(value) => updateSection("payroll", "taxableComponentsEnabled", value)} />
            <CheckboxField label="Potong kasbon otomatis" checked={settings.payroll.kasbonDeductionEnabled} onChange={(value) => updateSection("payroll", "kasbonDeductionEnabled", value)} />
          </div>
        </SettingsSection>

        <SettingsSection icon={ShieldCheck} title="Approval flow" caption="Alur approval untuk leave, koreksi absensi, dan finalisasi payroll.">
          <div className="grid gap-3">
            <FormField label="Leave approval" value={settings.approval.leaveFlow} onChange={(value) => updateSection("approval", "leaveFlow", value)} />
            <FormField label="Koreksi attendance" value={settings.approval.attendanceCorrectionFlow} onChange={(value) => updateSection("approval", "attendanceCorrectionFlow", value)} />
            <FormField label="Payroll finalization" value={settings.approval.payrollFinalizationFlow} onChange={(value) => updateSection("approval", "payrollFinalizationFlow", value)} />
          </div>
        </SettingsSection>

        <SettingsSection icon={Smartphone} title="Device & integrasi" caption="Mesin absensi, API device, SSO, dan channel notifikasi.">
          <div className="grid gap-3">
            <FormField label="Provider device" value={settings.integrations.attendanceDeviceProvider} onChange={(value) => updateSection("integrations", "attendanceDeviceProvider", value)} />
            <FormField label="URL API device" value={settings.integrations.attendanceDeviceApiUrl} onChange={(value) => updateSection("integrations", "attendanceDeviceApiUrl", value)} />
            <FormField label="SSO provider" value={settings.integrations.ssoProvider} onChange={(value) => updateSection("integrations", "ssoProvider", value)} />
            <FormField label="Channel notifikasi" value={settings.integrations.notificationChannel} onChange={(value) => updateSection("integrations", "notificationChannel", value)} />
          </div>
        </SettingsSection>
      </div>

      <BranchManagementPanel
        title="Manajemen cabang HRIS"
        caption="Cabang menentukan scope employee, attendance, payroll, dan approval. Owner dapat melihat Semua Cabang; karyawan hanya cabang assigned."
        branchLabel="Cabang"
      />
    </div>
  );
}
