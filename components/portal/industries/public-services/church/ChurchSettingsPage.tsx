"use client";

import { useEffect, useState } from "react";
import { CalendarDays, HandCoins, Loader2, Save, ShieldCheck, UsersRound } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BranchManagementPanel } from "@/components/portal/shared/BranchManagementPanel";
import { CheckboxField, FeedbackAlert, FormField, PortalBadge, PortalButton, SettingsSection } from "@/components/portal/ui";

type ChurchSettings = {
  service: {
    defaultServiceName: string;
    defaultDay: string;
    defaultTime: string;
    attendanceRequired: boolean;
  };
  cellGroup: {
    terminology: string;
    requireLeaderApproval: boolean;
    defaultCapacity: number;
  };
  finance: {
    donationCategories: string[];
    requireFinanceApproval: boolean;
    defaultFund: string;
  };
  asset: {
    requireCheckoutApproval: boolean;
    maintenanceReminderDays: number;
    defaultLocation: string;
  };
  branchId?: string | null;
  isDefault?: boolean;
};

const emptySettings: ChurchSettings = {
  service: {
    defaultServiceName: "Ibadah Raya",
    defaultDay: "Minggu",
    defaultTime: "09:00",
    attendanceRequired: true,
  },
  cellGroup: {
    terminology: "Komsel",
    requireLeaderApproval: true,
    defaultCapacity: 20,
  },
  finance: {
    donationCategories: ["Persembahan", "Persepuluhan", "Misi", "Pembangunan"],
    requireFinanceApproval: true,
    defaultFund: "General Fund",
  },
  asset: {
    requireCheckoutApproval: true,
    maintenanceReminderDays: 30,
    defaultLocation: "Gudang utama",
  },
};

export function ChurchSettingsPage({ currentTier }: { currentTier: string }) {
  const [settings, setSettings] = useState<ChurchSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    apiFetch<ChurchSettings>("/api/tenant/church/settings")
      .then((data) => {
        if (alive) setSettings(data);
      })
      .catch((error) => {
        if (alive) setMessage(error instanceof Error ? error.message : "Gagal memuat settings Gereja.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const updateSection = <K extends keyof ChurchSettings>(section: K, key: string, value: string | number | boolean | string[]) => {
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
      const saved = await apiFetch<ChurchSettings>("/api/tenant/church/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings(saved);
      setMessage("Pengaturan Gereja berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan settings Gereja.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[360px] place-items-center">
        <div className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-white px-5 py-4 text-sm font-black text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--portal-primary)]" />
          Memuat pengaturan Gereja...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Church settings</p>
            <h1 className="mt-2 text-2xl font-black text-[#172033] sm:text-3xl">Pengaturan Cabang/Rayon/Satelit</h1>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-500">
              Semua data Jemaat, Komsel, Ibadah/Event, Pelayanan, Keuangan, dan Aset mengikuti branch context aktif.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PortalBadge tone="primary">{currentTier} access</PortalBadge>
            <PortalButton onClick={saveSettings} disabled={saving} loading={saving} icon={Save} type="button">Simpan</PortalButton>
          </div>
        </div>
        {message ? <FeedbackAlert message={message} className="mt-4" /> : null}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <SettingsSection icon={CalendarDays} title="Ibadah & event" caption="Default nama ibadah, hari, jam, dan presensi.">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Nama ibadah default" value={settings.service.defaultServiceName} onChange={(value) => updateSection("service", "defaultServiceName", value)} />
            <FormField label="Hari default" value={settings.service.defaultDay} onChange={(value) => updateSection("service", "defaultDay", value)} />
            <FormField label="Jam default" value={settings.service.defaultTime} onChange={(value) => updateSection("service", "defaultTime", value)} />
            <CheckboxField label="Wajib presensi" checked={settings.service.attendanceRequired} onChange={(value) => updateSection("service", "attendanceRequired", value)} />
          </div>
        </SettingsSection>

        <SettingsSection icon={UsersRound} title="Komsel" caption="Terminologi, approval leader, dan kapasitas default.">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Terminologi" value={settings.cellGroup.terminology} onChange={(value) => updateSection("cellGroup", "terminology", value)} />
            <FormField label="Kapasitas default" type="number" value={settings.cellGroup.defaultCapacity} onChange={(value) => updateSection("cellGroup", "defaultCapacity", Number(value))} />
            <CheckboxField label="Butuh approval leader" checked={settings.cellGroup.requireLeaderApproval} onChange={(value) => updateSection("cellGroup", "requireLeaderApproval", value)} />
          </div>
        </SettingsSection>

        <SettingsSection icon={HandCoins} title="Keuangan & donasi" caption="Kategori donasi, approval finance, dan fund default.">
          <div className="grid gap-3">
            <FormField label="Kategori donasi" value={settings.finance.donationCategories.join(", ")} onChange={(value) => updateSection("finance", "donationCategories", value.split(",").map((item) => item.trim()).filter(Boolean))} />
            <FormField label="Fund default" value={settings.finance.defaultFund} onChange={(value) => updateSection("finance", "defaultFund", value)} />
            <CheckboxField label="Butuh approval finance" checked={settings.finance.requireFinanceApproval} onChange={(value) => updateSection("finance", "requireFinanceApproval", value)} />
          </div>
        </SettingsSection>

        <SettingsSection icon={ShieldCheck} title="Aset & pelayanan" caption="Approval pinjam aset, reminder maintenance, dan lokasi default.">
          <div className="grid gap-3">
            <FormField label="Lokasi default" value={settings.asset.defaultLocation} onChange={(value) => updateSection("asset", "defaultLocation", value)} />
            <FormField label="Reminder maintenance hari" type="number" value={settings.asset.maintenanceReminderDays} onChange={(value) => updateSection("asset", "maintenanceReminderDays", Number(value))} />
            <CheckboxField label="Butuh approval checkout" checked={settings.asset.requireCheckoutApproval} onChange={(value) => updateSection("asset", "requireCheckoutApproval", value)} />
          </div>
        </SettingsSection>
      </div>

      <BranchManagementPanel
        title="Manajemen Cabang/Rayon/Satelit"
        caption="Owner dapat mengelola rayon/satelit dan assignment member. Karyawan pelayanan hanya melihat branch yang ditugaskan."
        branchLabel="Cabang/Rayon/Satelit"
      />
    </div>
  );
}
