"use client";
import { useState, useEffect } from "react";
import { Plus, Download, X, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PortalDataTable } from "@/components/portal/ui";
import { apiFetch } from "@/lib/api";

export function PayrollWorkspace({ onRunPayroll }: { onRunPayroll?: () => void }) {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<any>(null);

  const fetchRuns = () => {
    apiFetch("/api/tenant/hris/payroll")
      .then((data) => setRuns(data as any[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Payroll Runs</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Jalankan dan review kalkulasi gaji bulanan.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button onClick={() => {
            const period = new Date().toISOString().slice(0, 7);
            apiFetch("/api/tenant/hris/payroll", { method: 'POST', body: JSON.stringify({ period }) })
              .then(fetchRuns);
          }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--portal-primary)] px-3 py-2.5 text-xs font-black text-[var(--portal-on-primary)] sm:flex-none sm:gap-2 sm:px-4 sm:py-3 sm:text-sm" type="button">
            <Plus className="h-4 w-4" /> Run Payroll
          </button>
        </div>
      </div>

      {loading ? <div className="p-4 text-center">Loading...</div> : (
        <PortalDataTable
          rows={runs}
          rowKey={(run) => run.id}
          searchPlaceholder="Cari periode..."
          getSearchText={(run) => run.period}
          gridTemplateColumns="1fr 1fr 1fr 1fr"
          columns={[
            { label: "Period", render: (run) => <p className="text-sm font-black text-[#172033] sm:text-base">{run.period}</p> },
            { label: "Net Total", render: (run) => <p className="text-sm font-black text-slate-600">Rp {Number(run.netTotal).toLocaleString('id-ID')}</p> },
            { label: "Status", render: (run) => <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">{run.status}</span> },
            { label: "Action", render: (run) => <button onClick={() => setSelectedRun(run)} className="text-xs font-bold text-blue-500">View details</button> }
          ]}
        />
      )}

      <AnimatePresence>
        {selectedRun && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="w-full max-w-4xl rounded-[28px] bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.28)] flex flex-col max-h-[90vh]">
              <div className="flex items-start justify-between gap-4 shrink-0">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Payroll Details</p>
                  <h2 className="mt-2 text-3xl font-black text-[#172033]">Periode {selectedRun.period}</h2>
                </div>
                <button onClick={() => setSelectedRun(null)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500" type="button"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-6 flex gap-4 shrink-0">
                <div className="rounded-[16px] bg-slate-50 p-4 flex-1">
                  <span className="block text-xs font-bold text-slate-500">Total Gross</span>
                  <p className="text-lg font-black text-[#172033]">Rp {Number(selectedRun.grossTotal).toLocaleString('id-ID')}</p>
                </div>
                <div className="rounded-[16px] bg-red-50 p-4 flex-1">
                  <span className="block text-xs font-bold text-red-500">Total Deduction</span>
                  <p className="text-lg font-black text-red-700">Rp {Number(selectedRun.deductionTotal).toLocaleString('id-ID')}</p>
                </div>
                <div className="rounded-[16px] bg-emerald-50 p-4 flex-1">
                  <span className="block text-xs font-bold text-emerald-600">Total Net</span>
                  <p className="text-lg font-black text-emerald-700">Rp {Number(selectedRun.netTotal).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <button
                onClick={() => apiFetch(`/api/tenant/hris/payroll/${selectedRun.id}/finalize`, { method: "POST" }).then((run) => {
                  setSelectedRun(run);
                  fetchRuns();
                })}
                disabled={selectedRun.status === "finalized"}
                className="mt-4 w-fit rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-xs font-black text-[var(--portal-on-primary)] disabled:opacity-50"
                type="button"
              >
                Finalize payroll
              </button>
              <div className="mt-6 flex-1 overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-[12px] rounded-bl-[12px]">Karyawan</th>
                      <th className="px-4 py-3">Gross</th>
                      <th className="px-4 py-3">Deduction</th>
                      <th className="px-4 py-3">Net</th>
                      <th className="px-4 py-3 rounded-tr-[12px] rounded-br-[12px]">Slip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRun.items?.map((item: any) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-4 font-bold text-[#172033]">{item.employee?.fullName}</td>
                        <td className="px-4 py-4 font-bold text-slate-600">Rp {Number(item.grossAmount).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-4 font-bold text-red-500">Rp {Number(item.deductionAmount).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-4 font-black text-emerald-600">Rp {Number(item.netAmount).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-4"><button className="flex items-center gap-1 text-xs font-bold text-[var(--portal-primary)]"><FileText className="h-4 w-4"/> Download</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
