"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Banknote, CheckCircle2, CreditCard, Landmark, Loader2, Plus, QrCode, Save, ShieldCheck, Trash2, WalletCards } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BranchManagementPanel } from "@/components/portal/shared/BranchManagementPanel";

type PaymentProvider = "XENDIT" | "BTN_QRIS";

type ReceiverAccount = {
  id: string;
  label: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  percentage: number;
  isPrimary: boolean;
  notes: string;
};

type FnbSettings = {
  taxRate: number;
  serviceChargeRate: number;
  rounding: string;
  refundPolicy: string;
  payment: {
    provider: PaymentProvider;
    methods: {
      cash: boolean;
      qris: boolean;
      eWallet: boolean;
      debit: boolean;
      transfer: boolean;
    };
    xendit: {
      status: string;
      accountName: string;
      apiKeyConfigured: boolean;
      settlementNotes: string;
    };
    btnQris: {
      status: string;
      merchantId: string;
      terminalId: string;
      apiBaseUrl: string;
      apiClientId: string;
      apiSecretConfigured: boolean;
      qrisImageUrl: string;
      qrisPayload: string;
      notes: string;
    };
    receiverAccounts: ReceiverAccount[];
  };
};

const emptySettings: FnbSettings = {
  taxRate: 10,
  serviceChargeRate: 5,
  rounding: "NEAREST_100",
  refundPolicy: "NO_REFUND",
  payment: {
    provider: "XENDIT",
    methods: {
      cash: true,
      qris: true,
      eWallet: true,
      debit: true,
      transfer: true,
    },
    xendit: {
      status: "READY_TO_CONNECT",
      accountName: "",
      apiKeyConfigured: false,
      settlementNotes: "Settlement mengikuti konfigurasi akun Xendit tenant.",
    },
    btnQris: {
      status: "NOT_CONNECTED",
      merchantId: "",
      terminalId: "",
      apiBaseUrl: "",
      apiClientId: "",
      apiSecretConfigured: false,
      qrisImageUrl: "",
      qrisPayload: "",
      notes: "Gunakan QRIS milik sendiri yang terhubung ke API Bank BTN.",
    },
    receiverAccounts: [
      {
        id: "primary",
        label: "Rekening utama outlet",
        bankName: "BTN",
        accountNumber: "",
        accountHolder: "",
        percentage: 100,
        isPrimary: true,
        notes: "",
      },
    ],
  },
};

const methodOptions = [
  { key: "qris", label: "QRIS", icon: QrCode, caption: "Xendit QRIS atau QRIS BTN milik outlet." },
  { key: "cash", label: "Tunai", icon: Banknote, caption: "Bayar langsung di kasir." },
  { key: "transfer", label: "Transfer", icon: Landmark, caption: "Instruksi transfer manual." },
  { key: "debit", label: "Kartu", icon: CreditCard, caption: "Debit/kredit via gateway atau kasir." },
  { key: "eWallet", label: "E-wallet", icon: WalletCards, caption: "Dompet digital selain QRIS." },
] as const;

function rupiahPercent(value: number) {
  return `${Number.isFinite(value) ? value : 0}%`;
}

function accountId() {
  return `receiver-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export function FnbSettingsPage({ subIndustryName, currentTier }: { subIndustryName: string; currentTier: string }) {
  const [settings, setSettings] = useState<FnbSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    apiFetch<FnbSettings>("/fnb/pos/settings")
      .then((data) => {
        if (alive) setSettings(data);
      })
      .catch((error) => {
        if (alive) setMessage(error instanceof Error ? error.message : "Gagal memuat pengaturan.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const splitTotal = useMemo(
    () => settings.payment.receiverAccounts.reduce((sum, account) => sum + Number(account.percentage || 0), 0),
    [settings.payment.receiverAccounts]
  );
  const splitIsValid = Math.abs(splitTotal - 100) < 0.01;

  const setPaymentProvider = (provider: PaymentProvider) => {
    setSettings((current) => ({
      ...current,
      payment: {
        ...current.payment,
        provider,
        methods: {
          ...current.payment.methods,
          qris: true,
        },
      },
    }));
  };

  const toggleMethod = (key: keyof FnbSettings["payment"]["methods"]) => {
    setSettings((current) => ({
      ...current,
      payment: {
        ...current.payment,
        methods: {
          ...current.payment.methods,
          [key]: !current.payment.methods[key],
        },
      },
    }));
  };

  const updateBtnQris = (key: keyof FnbSettings["payment"]["btnQris"], value: string | boolean) => {
    setSettings((current) => ({
      ...current,
      payment: {
        ...current.payment,
        btnQris: {
          ...current.payment.btnQris,
          [key]: value,
          status: current.payment.provider === "BTN_QRIS" ? "READY_TO_VERIFY" : current.payment.btnQris.status,
        },
      },
    }));
  };

  const updateXendit = (key: keyof FnbSettings["payment"]["xendit"], value: string | boolean) => {
    setSettings((current) => ({
      ...current,
      payment: {
        ...current.payment,
        xendit: {
          ...current.payment.xendit,
          [key]: value,
          status: current.payment.provider === "XENDIT" ? "READY_TO_CONNECT" : current.payment.xendit.status,
        },
      },
    }));
  };

  const updateAccount = (id: string, key: keyof ReceiverAccount, value: string | number | boolean) => {
    setSettings((current) => ({
      ...current,
      payment: {
        ...current.payment,
        receiverAccounts: current.payment.receiverAccounts.map((account) => {
          if (account.id !== id) return key === "isPrimary" && value === true ? { ...account, isPrimary: false } : account;
          return { ...account, [key]: value };
        }),
      },
    }));
  };

  const addAccount = () => {
    setSettings((current) => ({
      ...current,
      payment: {
        ...current.payment,
        receiverAccounts: [
          ...current.payment.receiverAccounts,
          {
            id: accountId(),
            label: `Rekening ${current.payment.receiverAccounts.length + 1}`,
            bankName: "BTN",
            accountNumber: "",
            accountHolder: "",
            percentage: 0,
            isPrimary: false,
            notes: "",
          },
        ],
      },
    }));
  };

  const removeAccount = (id: string) => {
    setSettings((current) => {
      const nextAccounts = current.payment.receiverAccounts.filter((account) => account.id !== id);
      if (nextAccounts.length === 0) return current;
      if (!nextAccounts.some((account) => account.isPrimary)) nextAccounts[0].isPrimary = true;
      return {
        ...current,
        payment: {
          ...current.payment,
          receiverAccounts: nextAccounts,
        },
      };
    });
  };

  const saveSettings = async () => {
    if (!splitIsValid) {
      setMessage("Total persentase rekening penerima harus tepat 100%.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const saved = await apiFetch<FnbSettings>("/fnb/pos/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings(saved);
      setMessage("Pengaturan pembayaran F&B berhasil disimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-full place-items-center bg-slate-50 p-6">
        <div className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-white px-5 py-4 text-sm font-black text-slate-600 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--portal-primary)]" />
          Memuat pengaturan pembayaran...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-4 bg-slate-50 p-3 pb-4 sm:p-5 lg:p-6">
      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">F&B payment settings</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-3xl">Pembayaran {subIndustryName}</h1>
            <p className="mt-1 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Owner dapat memilih payment gateway Xendit atau QRIS milik sendiri via API Bank BTN, lalu membagi settlement ke lebih dari satu rekening dengan persentase yang jelas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--portal-primary)]">
              {currentTier} tier
            </span>
            <button
              onClick={saveSettings}
              disabled={saving || !splitIsValid}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-50"
              type="button"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan
            </button>
          </div>
        </div>
      </section>

      <BranchManagementPanel
        title={`Manajemen cabang ${subIndustryName}`}
        caption="Setiap sub-industri F&B memakai daftar cabang yang sama, lalu payment settings dapat memakai default tenant atau override per cabang dari dropdown global."
        branchLabel="Cabang"
      />

      {message && (
        <div className={`flex items-start gap-3 rounded-[16px] border p-4 text-sm font-bold shadow-sm ${message.includes("berhasil") ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700"}`}>
          {message.includes("berhasil") ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          {message}
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-[#172033] sm:text-xl">Provider pembayaran</h2>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm">
                Pilih jalur utama untuk transaksi digital. Tunai tetap bisa diaktifkan terpisah.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              { id: "XENDIT" as PaymentProvider, title: "Xendit Gateway", caption: "QRIS, kartu, e-wallet, dan transfer melalui payment gateway." },
              { id: "BTN_QRIS" as PaymentProvider, title: "QRIS BTN Milik Sendiri", caption: "Customer scan QRIS outlet, status dan rekonsiliasi disiapkan via API Bank BTN." },
            ].map((provider) => {
              const selected = settings.payment.provider === provider.id;
              return (
                <button
                  key={provider.id}
                  onClick={() => setPaymentProvider(provider.id)}
                  className={`min-h-[92px] rounded-[16px] border p-4 text-left transition ${selected ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)]" : "border-slate-100 bg-slate-50 hover:bg-white"}`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-[12px] ${selected ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-white text-slate-500"}`}>
                      {provider.id === "XENDIT" ? <WalletCards className="h-5 w-5" /> : <QrCode className="h-5 w-5" />}
                    </span>
                    <span>
                      <span className="block text-sm font-black text-[#172033]">{provider.title}</span>
                      <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">{provider.caption}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-cyan-50 text-cyan-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-[#172033] sm:text-xl">Metode yang tampil di checkout</h2>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm">
                Customer hanya melihat metode yang aktif. QRIS akan mengikuti provider utama yang dipilih.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {methodOptions.map((method) => {
              const Icon = method.icon;
              const active = settings.payment.methods[method.key];
              return (
                <button
                  key={method.key}
                  onClick={() => toggleMethod(method.key)}
                  className={`min-h-[118px] rounded-[16px] border p-4 text-left transition ${active ? "border-emerald-100 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-[12px] ${active ? "bg-emerald-600 text-white" : "bg-white text-slate-400"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${active ? "bg-white text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {active ? "Aktif" : "Off"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-black text-[#172033]">{method.label}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{method.caption}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
          <h2 className="text-lg font-black text-[#172033] sm:text-xl">Konfigurasi Xendit</h2>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm">Dipakai saat provider utama adalah Xendit.</p>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Nama akun Xendit</span>
              <input
                value={settings.payment.xendit.accountName}
                onChange={(event) => updateXendit("accountName", event.target.value)}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="Contoh: PT Omnia Cafe Indonesia"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Catatan settlement</span>
              <textarea
                value={settings.payment.xendit.settlementNotes}
                onChange={(event) => updateXendit("settlementNotes", event.target.value)}
                className="min-h-[96px] w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
          <h2 className="text-lg font-black text-[#172033] sm:text-xl">QRIS BTN milik sendiri</h2>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm">Untuk QRIS outlet yang settlement-nya masuk langsung ke rekening sendiri via Bank BTN.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Merchant ID BTN</span>
              <input
                value={settings.payment.btnQris.merchantId}
                onChange={(event) => updateBtnQris("merchantId", event.target.value)}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="MID BTN"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Terminal ID</span>
              <input
                value={settings.payment.btnQris.terminalId}
                onChange={(event) => updateBtnQris("terminalId", event.target.value)}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="TID"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Base URL API BTN</span>
              <input
                value={settings.payment.btnQris.apiBaseUrl}
                onChange={(event) => updateBtnQris("apiBaseUrl", event.target.value)}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="https://api.btn.co.id/..."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Client ID API</span>
              <input
                value={settings.payment.btnQris.apiClientId}
                onChange={(event) => updateBtnQris("apiClientId", event.target.value)}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="Client ID"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Status secret</span>
              <select
                value={settings.payment.btnQris.apiSecretConfigured ? "yes" : "no"}
                onChange={(event) => updateBtnQris("apiSecretConfigured", event.target.value === "yes")}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
              >
                <option value="no">Belum dikonfigurasi</option>
                <option value="yes">Sudah dikonfigurasi</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">URL gambar QRIS statis</span>
              <input
                value={settings.payment.btnQris.qrisImageUrl}
                onChange={(event) => updateBtnQris("qrisImageUrl", event.target.value)}
                className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="https://..."
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">Payload QRIS / instruksi</span>
              <textarea
                value={settings.payment.btnQris.qrisPayload}
                onChange={(event) => updateBtnQris("qrisPayload", event.target.value)}
                className="min-h-[96px] w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                placeholder="Payload QRIS atau instruksi internal untuk generate QR dinamis."
              />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#172033] sm:text-xl">Rekening penerima settlement</h2>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500 sm:text-sm">Atur lebih dari satu rekening dan persentase pembagiannya. Total wajib 100%.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1.5 text-xs font-black ${splitIsValid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
              Total {rupiahPercent(splitTotal)}
            </span>
            <button
              onClick={addAccount}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-[#172033]"
              type="button"
            >
              <Plus className="h-4 w-4" />
              Tambah rekening
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {settings.payment.receiverAccounts.map((account, index) => (
            <div key={account.id} className="rounded-[16px] border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-white text-[var(--portal-primary)] shadow-sm">
                    <Landmark className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#172033]">Rekening {index + 1}</p>
                    <p className="text-xs font-bold text-slate-500">{account.isPrimary ? "Rekening utama" : "Rekening tambahan"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateAccount(account.id, "isPrimary", true)}
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${account.isPrimary ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-500"}`}
                    type="button"
                  >
                    Utama
                  </button>
                  <button
                    onClick={() => removeAccount(account.id)}
                    disabled={settings.payment.receiverAccounts.length === 1}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white text-rose-500 disabled:opacity-30"
                    type="button"
                    aria-label="Hapus rekening"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <label className="block xl:col-span-1">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Label</span>
                  <input
                    value={account.label}
                    onChange={(event) => updateAccount(account.id, "label", event.target.value)}
                    className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Bank</span>
                  <input
                    value={account.bankName}
                    onChange={(event) => updateAccount(account.id, "bankName", event.target.value)}
                    className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">No. rekening</span>
                  <input
                    value={account.accountNumber}
                    onChange={(event) => updateAccount(account.id, "accountNumber", event.target.value)}
                    className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Nama penerima</span>
                  <input
                    value={account.accountHolder}
                    onChange={(event) => updateAccount(account.id, "accountHolder", event.target.value)}
                    className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Persentase</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={account.percentage}
                    onChange={(event) => updateAccount(account.id, "percentage", Number(event.target.value))}
                    className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
