"use client";
import { RoundedSelect } from "@/components/portal/ui";

import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Loader2, Plus, Save, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import { apiFetch, type TenantContextResponse } from "@/lib/api";
import { getStoredActiveTenantId } from "@/lib/mobile/session";

type Branch = {
  id: string;
  name: string;
  code: string;
  status: string;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
};

type TenantMember = {
  id: string;
  role: "owner" | "admin" | "employee";
  user: { id: string; name: string; email: string; status: string };
  branchAccess?: Array<{ branchId: string; branch?: Branch }>;
};

type BranchForm = {
  name: string;
  code: string;
  address: string;
  phoneNumber: string;
  email: string;
  status: string;
};

const emptyBranchForm: BranchForm = {
  name: "",
  code: "",
  address: "",
  phoneNumber: "",
  email: "",
  status: "active",
};

export function BranchManagementPanel({
  title = "Manajemen cabang",
  caption = "Atur cabang, status operasional, dan assignment member ke cabang.",
  branchLabel = "Cabang",
  showMembers = true,
}: {
  title?: string;
  caption?: string;
  branchLabel?: string;
  showMembers?: boolean;
}) {
  const [context, setContext] = useState<TenantContextResponse | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [form, setForm] = useState<BranchForm>(emptyBranchForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeTenantId = getStoredActiveTenantId();
  const activeTenant = context?.tenants.find((tenant) => tenant.id === activeTenantId) ?? context?.tenants[0];
  const canManage = activeTenant?.role === "owner" || activeTenant?.role === "admin";
  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) ?? null;

  const branchMembers = useMemo(() => {
    if (!selectedBranchId) return [];
    return members.filter((member) => member.branchAccess?.some((access) => access.branchId === selectedBranchId));
  }, [members, selectedBranchId]);

  const loadData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const nextContext = await apiFetch<TenantContextResponse>("/tenant/context");
      const nextBranches = await apiFetch<Branch[]>("/tenant/branches");
      setContext(nextContext);
      setBranches(nextBranches);
      setSelectedBranchId((current) => current ?? nextBranches[0]?.id ?? null);
      if (showMembers) {
        try {
          setMembers(await apiFetch<TenantMember[]>("/tenant/members"));
        } catch {
          setMembers([]);
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat data cabang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!selectedBranch) {
      setForm(emptyBranchForm);
      return;
    }
    setForm({
      name: selectedBranch.name,
      code: selectedBranch.code,
      address: selectedBranch.address ?? "",
      phoneNumber: selectedBranch.phoneNumber ?? "",
      email: selectedBranch.email ?? "",
      status: selectedBranch.status,
    });
  }, [selectedBranch]);

  const updateForm = (field: keyof BranchForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveBranch = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      setMessage("Nama dan kode cabang wajib diisi.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form, code: form.code.toUpperCase() };
      const saved = selectedBranchId
        ? await apiFetch<Branch>(`/tenant/branches/${selectedBranchId}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<Branch>("/tenant/branches", { method: "POST", body: JSON.stringify(payload) });
      setSelectedBranchId(saved.id);
      setMessage(`${branchLabel} berhasil disimpan.`);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Gagal menyimpan ${branchLabel.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const deactivateBranch = async (branchId: string) => {
    setSaving(true);
    setMessage("");
    try {
      await apiFetch(`/tenant/branches/${branchId}`, { method: "DELETE" });
      setMessage(`${branchLabel} berhasil dinonaktifkan.`);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Gagal menonaktifkan ${branchLabel.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const toggleMemberBranch = async (member: TenantMember, branchId: string) => {
    const currentIds = member.branchAccess?.map((access) => access.branchId) ?? [];
    const nextIds = currentIds.includes(branchId) ? currentIds.filter((id) => id !== branchId) : [...currentIds, branchId];
    setSaving(true);
    setMessage("");
    try {
      await apiFetch(`/tenant/members/${member.id}`, {
        method: "PATCH",
        body: JSON.stringify({ branchIds: nextIds, role: member.role }),
      });
      setMessage("Assignment member berhasil diperbarui.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui assignment member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--portal-primary)]">Branch management</p>
          <h2 className="mt-2 text-xl font-black text-[#172033] sm:text-2xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">{caption}</p>
        </div>
        <button
          onClick={() => {
            setSelectedBranchId(null);
            setForm(emptyBranchForm);
          }}
          disabled={!canManage}
          className="inline-flex min-h-[40px] w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-[#172033] disabled:opacity-45"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Tambah {branchLabel.toLowerCase()}
        </button>
      </div>

      {message ? (
        <div className="mt-4 rounded-[14px] border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
          {message}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-slate-50 px-4 py-4 text-sm font-black text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--portal-primary)]" />
          Memuat data cabang...
        </div>
      ) : (
        <div className="mt-5 grid min-w-0 gap-3 xl:grid-cols-[0.9fr_1.1fr] xl:gap-4">
          <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 xl:mx-0 xl:flex-col xl:overflow-visible xl:px-0 xl:pb-0 xl:space-y-3">
            {branches.map((branch) => {
              const selected = branch.id === selectedBranchId;
              return (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`min-w-[250px] snap-start rounded-[16px] border p-3 text-left transition xl:w-full xl:min-w-0 xl:p-4 ${
                    selected ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)]" : "border-slate-100 bg-slate-50 hover:bg-white"
                  }`}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[13px] ${selected ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-white text-slate-500"}`}>
                        <Building2 className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black text-[#172033]">{branch.name}</span>
                        <span className="mt-1 block text-xs font-bold text-slate-500">{branch.code}</span>
                      </span>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${branch.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                      {branch.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-w-0 rounded-[16px] border border-slate-100 bg-slate-50 p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Nama</span>
                <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} disabled={!canManage} className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none disabled:bg-slate-100 sm:px-4 sm:py-3 sm:text-sm" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Kode</span>
                <input value={form.code} onChange={(event) => updateForm("code", event.target.value)} disabled={!canManage} className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold uppercase outline-none disabled:bg-slate-100 sm:px-4 sm:py-3 sm:text-sm" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Alamat</span>
                <input value={form.address} onChange={(event) => updateForm("address", event.target.value)} disabled={!canManage} className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none disabled:bg-slate-100 sm:px-4 sm:py-3 sm:text-sm" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Telepon</span>
                <input value={form.phoneNumber} onChange={(event) => updateForm("phoneNumber", event.target.value)} disabled={!canManage} className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none disabled:bg-slate-100 sm:px-4 sm:py-3 sm:text-sm" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Email</span>
                <input value={form.email} onChange={(event) => updateForm("email", event.target.value)} disabled={!canManage} className="w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none disabled:bg-slate-100 sm:px-4 sm:py-3 sm:text-sm" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Status</span>
                <RoundedSelect value={form.status} onChange={(event) => updateForm("status", event.target.value)} disabled={!canManage} className="w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none disabled:bg-slate-100">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </RoundedSelect>
              </label>
              <div className="flex flex-wrap items-end gap-2">
                <button onClick={saveBranch} disabled={!canManage || saving} className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-45" type="button">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan
                </button>
                {selectedBranchId ? (
                  <button onClick={() => deactivateBranch(selectedBranchId)} disabled={!canManage || saving || branches.length <= 1} className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2.5 text-sm font-black text-rose-600 disabled:opacity-45" type="button">
                    <Trash2 className="h-4 w-4" />
                    Deactivate
                  </button>
                ) : null}
              </div>
            </div>

            {showMembers ? (
              <div className="mt-5 rounded-[16px] bg-white p-4">
                <div className="flex items-center gap-3">
                  <UsersRound className="h-5 w-5 text-[var(--portal-primary)]" />
                  <div>
                    <p className="text-sm font-black text-[#172033]">Assignment member</p>
                    <p className="text-xs font-bold text-slate-500">{branchMembers.length} member aktif di {selectedBranch?.name ?? branchLabel.toLowerCase()} ini.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2">
                  {members.length ? members.map((member) => {
                    const checked = selectedBranchId ? member.branchAccess?.some((access) => access.branchId === selectedBranchId) : false;
                    return (
                      <label key={member.id} className="flex items-center justify-between gap-3 rounded-[14px] border border-slate-100 bg-slate-50 px-3 py-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-[#172033]">{member.user.name}</span>
                          <span className="block truncate text-xs font-bold text-slate-500">{member.user.email} - {member.role}</span>
                        </span>
                        <input type="checkbox" checked={Boolean(checked)} disabled={!canManage || !selectedBranchId || member.role === "owner"} onChange={() => selectedBranchId && toggleMemberBranch(member, selectedBranchId)} />
                      </label>
                    );
                  }) : (
                    <div className="flex items-center gap-2 rounded-[14px] bg-slate-50 px-3 py-3 text-sm font-bold text-slate-500">
                      <ShieldCheck className="h-4 w-4" />
                      Data member hanya tersedia untuk owner/admin.
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {!canManage ? (
              <div className="mt-4 flex items-center gap-2 rounded-[14px] bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Role ini hanya dapat melihat cabang yang ditugaskan.
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}


