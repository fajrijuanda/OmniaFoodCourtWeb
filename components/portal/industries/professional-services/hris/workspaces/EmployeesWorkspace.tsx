"use client";
import { useCallback, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Filter, RotateCcw, UserPlus, X, Plus } from "lucide-react";
import { ConfirmDialog, PortalButton, PortalDataTable, ResultDialog, StatusBadge, RoundedSelect } from "@/components/portal/ui";
import { apiFetch } from "@/lib/api";

type EmployeeStatusFilter = "active" | "inactive" | "all";
type PendingAction = { type: "archive" | "restore"; employee: any } | null;
type ResultState = { type: "success" | "error"; title: string; description: string } | null;

export function EmployeesWorkspace({ canManageEmployees = false, onAddEmployee }: { canManageEmployees?: boolean; onAddEmployee?: () => void }) {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>("active");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [result, setResult] = useState<ResultState>(null);
  const [savingAction, setSavingAction] = useState(false);

  const openEmployeeModal = onAddEmployee ?? (() => setShowEmployeeModal(true));

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    return apiFetch(`/api/tenant/hris/employees?status=${statusFilter}`)
      .then((data) => setEmployees(data as any[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { type, employee } = pendingAction;
    setSavingAction(true);
    try {
      await apiFetch(`/api/tenant/hris/employees/${employee.id}${type === "restore" ? "/restore" : ""}`, {
        method: type === "restore" ? "PATCH" : "DELETE"
      });
      setPendingAction(null);
      await fetchEmployees();
      setResult({
        type: "success",
        title: type === "restore" ? "Karyawan Dipulihkan" : "Karyawan Dinonaktifkan",
        description: type === "restore"
          ? "Karyawan kembali aktif dan akun login sudah diaktifkan lagi."
          : "Karyawan dipindahkan ke arsip. Riwayat attendance, payroll, dan data HR tetap aman."
      });
    } catch (error: any) {
      setResult({
        type: "error",
        title: type === "restore" ? "Gagal Memulihkan" : "Gagal Menonaktifkan",
        description: error?.message || "Aksi employee gagal diproses."
      });
    } finally {
      setSavingAction(false);
    }
  };

  const statusOptions: Array<{ value: EmployeeStatusFilter; label: string }> = [
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Diarsipkan" },
    { value: "all", label: "Semua" }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Employee Database</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Kelola data karyawan, department, status kerja, dan salary assignment.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <PortalButton variant="secondary" icon={Filter} className="flex-1 sm:flex-none" type="button">
            Filter
          </PortalButton>
          {canManageEmployees ? (
            <PortalButton onClick={openEmployeeModal} icon={UserPlus} className="flex-1 sm:hidden" type="button">
              Add employee
            </PortalButton>
          ) : null}
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-sm font-bold text-slate-400">Loading employees...</div>
      ) : (
        <PortalDataTable
          headerAction={
            <div className="flex flex-wrap items-center gap-2">
              <RoundedSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-32 !py-2 text-xs">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </RoundedSelect>
              {canManageEmployees ? (
                <button onClick={openEmployeeModal} className="hidden sm:inline-flex shrink-0 w-fit items-center gap-1.5 lg:gap-2 rounded-full bg-[var(--portal-primary)] px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[11px] lg:text-sm font-black text-[var(--portal-on-primary)]" type="button">
                  <UserPlus className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden sm:inline">Add employee</span>
                </button>
              ) : null}
            </div>
          }
          rows={employees}
          rowKey={(employee) => employee.id}
          searchPlaceholder="Cari nama..."
          getSearchText={(employee) => `${employee.fullName} ${employee.employeeNumber} ${employee.employmentStatus}`}
          gridTemplateColumns={canManageEmployees ? "1.1fr 1fr 0.8fr 0.8fr 0.9fr" : "1.2fr 1fr 0.8fr 0.8fr"}
          columns={[
            { label: "Employee", render: (employee) => <div><p className="text-sm font-black text-[#172033] sm:text-base">{employee.fullName}</p><p className="text-xs font-bold text-slate-500 sm:text-sm">{employee.employeeNumber} - {employee.email ?? employee.user?.email ?? "No email"}</p></div> },
            { label: "Department", render: (employee) => <p className="text-xs font-bold text-slate-600 sm:text-sm">{employee.department?.name || '-'}</p> },
            { label: "Status", render: (employee) => <div className="flex flex-wrap gap-2"><StatusBadge status={employee.employmentStatus} tone="emerald" />{employee.status === "inactive" ? <StatusBadge status="Diarsipkan" tone="slate" /> : null}</div> },
            { label: "Akun", render: (employee) => <StatusBadge status={employee.user?.mustChangePassword ? "Password awal" : employee.user?.status ?? employee.status} tone={employee.user?.status === "inactive" || employee.status === "inactive" ? "slate" : "primary"} /> },
            ...(canManageEmployees ? [{ label: "Aksi", render: (employee: any) => employee.status === "inactive" ? (
              <PortalButton variant="secondary" icon={RotateCcw} onClick={() => setPendingAction({ type: "restore", employee })} type="button">
                Pulihkan
              </PortalButton>
            ) : (
              <PortalButton variant="danger" icon={Archive} onClick={() => setPendingAction({ type: "archive", employee })} type="button">
                Nonaktifkan
              </PortalButton>
            ) }] : []),
          ]}
        />
      )}

      <AnimatePresence>
        {showEmployeeModal && canManageEmployees ? <EmployeeModal onClose={() => setShowEmployeeModal(false)} onRefresh={fetchEmployees} /> : null}
      </AnimatePresence>
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "restore" ? "Pulihkan karyawan?" : "Nonaktifkan karyawan?"}
        body={pendingAction?.type === "restore"
          ? "Karyawan akan kembali aktif dan akun login diaktifkan lagi."
          : "Karyawan akan dinonaktifkan dan akun login ikut nonaktif. Riwayat attendance, payroll, dan data HR tetap aman."}
        confirmLabel={savingAction ? "Memproses..." : pendingAction?.type === "restore" ? "Pulihkan" : "Nonaktifkan"}
        onConfirm={handleConfirmAction}
        onClose={() => savingAction ? undefined : setPendingAction(null)}
      />
      <ResultDialog
        open={Boolean(result)}
        type={result?.type ?? "success"}
        title={result?.title ?? ""}
        description={result?.description ?? ""}
        onClose={() => setResult(null)}
      />
    </div>
  );
}

function EmployeeModal({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [form, setForm] = useState({ fullName: '', email: '', employmentStatus: 'PKWTT', status: 'active', joinDate: '' });

  const handleSave = () => {
    apiFetch("/api/tenant/hris/employees", {
      method: "POST",
      body: JSON.stringify(form)
    }).then(() => {
      onRefresh();
      onClose();
    }).catch((e) => alert("Error: " + e.message));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">New employee</p><h2 className="mt-2 text-3xl font-black text-[#172033]">Tambah karyawan</h2></div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500" type="button"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-black text-[#172033]">Nama lengkap</span>
            <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" placeholder="Nama karyawan" />
          </label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-black text-[#172033]">Email kerja / username</span>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" placeholder="nama@perusahaan.com" />
          </label>
          <label className="block"><span className="mb-2 block text-sm font-black text-[#172033]">Employment Status</span>
            <RoundedSelect value={form.employmentStatus} onChange={e => setForm({...form, employmentStatus: e.target.value})} className="w-full text-sm">
              <option value="PKWTT">Tetap (PKWTT)</option><option value="PKWT">Kontrak (PKWT)</option><option value="Probation">Probation</option>
            </RoundedSelect>
          </label>
          <label className="block"><span className="mb-2 block text-sm font-black text-[#172033]">Join Date</span>
            <input type="date" value={form.joinDate} onChange={e => setForm({...form, joinDate: e.target.value})} className="w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)]" />
          </label>
        </div>
        <div className="mt-5 rounded-[16px] bg-sky-50 p-4 text-sm font-bold leading-6 text-sky-900">
          Akun employee akan otomatis dibuat. Username memakai email kerja, password awal: <b>user12345</b>.
        </div>
        <button onClick={handleSave} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-5 py-3 text-sm font-black text-[var(--portal-on-primary)] transition hover:scale-[1.02]" type="button">
          <Plus className="h-4 w-4" /> Simpan employee
        </button>
      </motion.div>
    </motion.div>
  );
}
