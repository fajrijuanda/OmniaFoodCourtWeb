"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, HandCoins, Loader2, Plus, XCircle } from "lucide-react";
import { apiFetch, type AuthUser } from "@/lib/api";
import { FeedbackAlert, PortalDataTable } from "@/components/portal/ui";
import { getStoredUser } from "@/lib/mobile/session";

type LoanRow = {
  id: string;
  amount: string | number;
  reason?: string | null;
  installmentMonths: number;
  monthlyDeduction: string | number;
  remainingBalance: string | number;
  status: "Pending" | "Approved" | "Rejected" | "Paid";
  createdAt: string;
  employee?: { fullName: string; employeeNumber: string; department?: { name: string } | null };
};

export function LoansWorkspace() {
  const [loans, setLoans] = useState<LoanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ amount: 1000000, installmentMonths: 3, reason: "" });
  const account = useMemo(() => {
    return getStoredUser<AuthUser>();
  }, []);
  const permissions = account?.permissions ?? [];
  const canApprove = account?.tenantRole === "owner" || account?.tenantRole === "admin" || permissions.includes("*") || permissions.includes("hris.loan.approve") || permissions.includes("hris.*");

  const loadLoans = () => {
    setLoading(true);
    apiFetch<LoanRow[]>("/api/tenant/hris/loans")
      .then(setLoans)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Gagal memuat kasbon."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const submitLoan = async () => {
    setSaving(true);
    setMessage("");
    try {
      await apiFetch("/api/tenant/hris/loans", { method: "POST", body: JSON.stringify(form) });
      setForm({ amount: 1000000, installmentMonths: 3, reason: "" });
      setMessage("Pengajuan kasbon berhasil dikirim.");
      loadLoans();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengirim kasbon.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: "Approved" | "Rejected") => {
    setMessage("");
    try {
      await apiFetch(`/api/tenant/hris/loans/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      loadLoans();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui kasbon.");
    }
  };

  const formatCurrency = (value: string | number) => `Rp ${Number(value).toLocaleString("id-ID")}`;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <HandCoins className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-[#172033]">Ajukan kasbon</h2>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">Pengajuan disetujui owner/HR, lalu cicilan masuk deduction payroll.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-500">Nominal</span>
              <input type="number" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: Number(event.target.value) }))} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-500">Tenor cicilan bulan</span>
              <input type="number" min={1} max={36} value={form.installmentMonths} onChange={(event) => setForm((current) => ({ ...current, installmentMonths: Number(event.target.value) }))} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black text-slate-500">Alasan</span>
              <textarea value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} className="min-h-24 w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
            </label>
            <button onClick={submitLoan} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-60" type="button">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Kirim pengajuan
            </button>
          </div>
        </section>

        <section className="min-w-0 rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-black text-[#172033]">Daftar kasbon</h2>
            <p className="mt-1 text-xs font-bold text-slate-500">{canApprove ? "Approval kasbon tenant/cabang aktif." : "Riwayat pengajuan kasbon milik kamu."}</p>
          </div>
          {message ? <FeedbackAlert message={message} className="mb-4" /> : null}
          {loading ? (
            <div className="grid min-h-[220px] place-items-center text-sm font-black text-slate-400">
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Memuat kasbon...</span>
            </div>
          ) : (
            <PortalDataTable
              rows={loans}
              rowKey={(loan) => loan.id}
              searchPlaceholder="Cari employee, status, alasan..."
              getSearchText={(loan) => `${loan.employee?.fullName ?? ""} ${loan.status} ${loan.reason ?? ""}`}
              gridTemplateColumns={canApprove ? "1fr 0.7fr 0.65fr 0.65fr 0.8fr" : "1fr 0.75fr 0.75fr 0.7fr"}
              columns={[
                { label: "Employee", render: (loan) => <div><p className="text-sm font-black text-[#172033]">{loan.employee?.fullName ?? "Saya"}</p><p className="text-xs font-bold text-slate-500">{loan.employee?.employeeNumber ?? loan.reason ?? "-"}</p></div> },
                { label: "Nominal", render: (loan) => <p className="text-xs font-black text-[#172033]">{formatCurrency(loan.amount)}</p> },
                { label: "Cicilan", render: (loan) => <p className="text-xs font-bold text-slate-600">{loan.installmentMonths}x {formatCurrency(loan.monthlyDeduction)}</p> },
                { label: "Status", render: (loan) => <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${loan.status === "Approved" ? "bg-emerald-50 text-emerald-600" : loan.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600"}`}>{loan.status}</span> },
                ...(canApprove ? [{ label: "Action", render: (loan: LoanRow) => loan.status === "Pending" ? <div className="flex flex-wrap gap-2"><button onClick={() => updateStatus(loan.id, "Rejected")} className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 px-3 py-1.5 text-xs font-black text-rose-600" type="button"><XCircle className="h-4 w-4" /> Reject</button><button onClick={() => updateStatus(loan.id, "Approved")} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-3 py-1.5 text-xs font-black text-[var(--portal-on-primary)]" type="button"><CheckCircle2 className="h-4 w-4" /> Approve</button></div> : <span className="text-xs font-bold text-slate-400">No action</span> }] : [])
              ]}
            />
          )}
        </section>
      </div>
    </div>
  );
}
