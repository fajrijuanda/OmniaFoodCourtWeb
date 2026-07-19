"use client";
import { RoundedSelect } from "@/components/portal/ui";
import { useMemo, useState, useEffect } from "react";
import { Plus, Search, Filter, X, Check, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PortalDataTable } from "@/components/portal/ui";
import { apiFetch, type AuthUser } from "@/lib/api";
import { getStoredUser } from "@/lib/mobile/session";

export function LeaveWorkspace({ onApplyLeave }: { onApplyLeave?: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applyForm, setApplyForm] = useState({ type: "Annual Leave", startDate: "", endDate: "", reason: "", documentUrl: "" });
  const account = useMemo(() => {
    return getStoredUser<AuthUser & { tenantRole?: string | null; permissions?: string[] }>();
  }, []);
  const permissions = account?.permissions ?? [];
  const canApprove = account?.tenantRole === "owner" || account?.tenantRole === "admin" || permissions.includes("*") || permissions.includes("hris.leave.manage") || permissions.includes("hris.*");

  useEffect(() => {
    apiFetch("/api/tenant/hris/leave")
      .then((data) => setRequests(data as any[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Leave Management</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Kelola pengajuan cuti dan absensi karyawan.</p>
        </div>
      </div>
      
      {loading ? <div className="p-4 text-center">Loading...</div> : (
        <PortalDataTable
          headerAction={
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex shrink-0 w-fit items-center gap-1.5 lg:gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[11px] lg:text-sm font-black text-slate-600" type="button">
                <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button onClick={() => setIsApplying(true)} className="inline-flex shrink-0 w-fit items-center gap-1.5 lg:gap-2 rounded-full bg-[var(--portal-primary)] px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[11px] lg:text-sm font-black text-[var(--portal-on-primary)]" type="button">
                <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Apply leave</span>
              </button>
            </div>
          }
          rows={requests}
          rowKey={(req) => req.id}
          searchPlaceholder="Cari pengajuan..."
          getSearchText={(req) => `${req.employee?.fullName} ${req.type}`}
          gridTemplateColumns="1fr 1fr 1fr 0.8fr 1fr"
          columns={[
            { label: "Employee", render: (req) => <p className="text-sm font-black text-[#172033] sm:text-base">{req.employee?.fullName}</p> },
            { label: "Type", render: (req) => <p className="text-xs font-bold text-slate-600 sm:text-sm">{req.type}</p> },
            { label: "Duration", render: (req) => <p className="text-xs font-black text-[#172033] sm:text-sm">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</p> },
            { label: "Status", render: (req) => <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600">{req.status}</span> },
            { label: "Action", render: (req) => <button onClick={() => setSelectedReq(req)} className="text-xs font-bold text-blue-500">{canApprove ? "Review" : "Detail"}</button> }
          ]}
        />
      )}

      <AnimatePresence>
        {selectedReq && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Leave Request</p>
                  <h2 className="mt-2 text-3xl font-black text-[#172033]">Review Cuti</h2>
                </div>
                <button onClick={() => setSelectedReq(null)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500" type="button"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-6 space-y-4">
                <div><span className="block text-xs font-bold text-slate-500">Karyawan</span><p className="text-sm font-black text-[#172033]">{selectedReq.employee?.fullName}</p></div>
                <div><span className="block text-xs font-bold text-slate-500">Tipe Cuti</span><p className="text-sm font-black text-[#172033]">{selectedReq.type}</p></div>
                <div><span className="block text-xs font-bold text-slate-500">Durasi</span><p className="text-sm font-black text-[#172033]">{new Date(selectedReq.startDate).toLocaleDateString()} - {new Date(selectedReq.endDate).toLocaleDateString()}</p></div>
                <div><span className="block text-xs font-bold text-slate-500">Alasan</span><p className="text-sm font-bold text-slate-700">{selectedReq.reason || '-'}</p></div>
                <div><span className="block text-xs font-bold text-slate-500">Status Saat Ini</span><span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600 mt-1 inline-block">{selectedReq.status}</span></div>
              </div>
              {canApprove ? (
                <div className="mt-8 flex gap-3">
                  <button onClick={() => {
                    apiFetch(`/api/tenant/hris/leave/${selectedReq.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Approved' }) })
                    .then(() => {
                      setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, status: 'Approved' } : r));
                      setSelectedReq(null);
                    });
                  }} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600" type="button">
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => {
                    apiFetch(`/api/tenant/hris/leave/${selectedReq.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Rejected' }) })
                    .then(() => {
                      setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, status: 'Rejected' } : r));
                      setSelectedReq(null);
                    });
                  }} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-600" type="button">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isApplying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-[#172033]">Apply Leave / Izin</h3>
                <button onClick={() => setIsApplying(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await apiFetch("/api/tenant/hris/leave", {
                  method: 'POST',
                  body: JSON.stringify(applyForm)
                });
                setIsApplying(false);
                setApplyForm({ type: "Annual Leave", startDate: "", endDate: "", reason: "", documentUrl: "" });
                // re-fetch
                apiFetch("/api/tenant/hris/leave").then((data) => setRequests(data as any[]));
              }} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">Tipe</label>
                  <RoundedSelect value={applyForm.type} onChange={e => setApplyForm({...applyForm, type: e.target.value})} className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold">
                    <option value="Annual Leave">Cuti Tahunan</option>
                    <option value="Sick">Sakit</option>
                    <option value="Permit">Izin</option>
                  </RoundedSelect>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500">Mulai</label>
                    <input type="date" value={applyForm.startDate} onChange={e => setApplyForm({...applyForm, startDate: e.target.value})} className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500">Sampai</label>
                    <input type="date" value={applyForm.endDate} onChange={e => setApplyForm({...applyForm, endDate: e.target.value})} className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold" required />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-500">Alasan</label>
                  <textarea value={applyForm.reason} onChange={e => setApplyForm({...applyForm, reason: e.target.value})} className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold" rows={3}></textarea>
                </div>
                {(applyForm.type === 'Sick' || applyForm.type === 'Permit') && (
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-500">Upload Dokumen (Surat Dokter/Bukti)</label>
                    <input type="file" onChange={(e) => {
                      // Simulated upload, we just set a fake URL
                      setApplyForm({...applyForm, documentUrl: 'https://fake-s3.url/doc.pdf'})
                    }} className="w-full rounded-xl border border-slate-200 p-2 text-xs" />
                    {applyForm.documentUrl && <p className="mt-1 text-[10px] text-emerald-500 font-bold">File uploaded successfully.</p>}
                  </div>
                )}
                <button type="submit" className="w-full rounded-full bg-[var(--portal-primary)] py-3 text-sm font-black text-white hover:opacity-90">Submit Request</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


