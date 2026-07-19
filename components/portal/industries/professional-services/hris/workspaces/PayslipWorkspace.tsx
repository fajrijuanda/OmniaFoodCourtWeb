"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { PortalDataTable } from "@/components/portal/ui";
import { apiFetch } from "@/lib/api";
import { downloadFileMobile } from "@/lib/mobile/nativeHardware";

type PayslipItem = {
  id: string;
  grossAmount: string | number;
  deductionAmount: string | number;
  netAmount: string | number;
  status: string;
  employee?: { fullName: string; employeeNumber: string };
  payrollRun?: { period: string; status: string };
};

export function PayslipWorkspace() {
  const [items, setItems] = useState<PayslipItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<PayslipItem[]>("/api/tenant/hris/payroll/payslips/latest")
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadPayslip = async (itemId: string) => {
    try {
      const file = await apiFetch<{ filename: string; mimeType: string; content: string }>(`/api/tenant/hris/payroll/payslips/${itemId}/pdf`);
      await downloadFileMobile(file.filename, file.content);
    } catch (err) {
      alert("Gagal mengunduh payslip: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Payslip</h2>
        <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Slip gaji digital dari payroll run terbaru.</p>
      </div>
      {loading ? <div className="p-4 text-center">Loading...</div> : (
        <PortalDataTable
          rows={items}
          rowKey={(row) => row.id}
          searchPlaceholder="Cari karyawan, periode, status..."
          getSearchText={(row) => `${row.employee?.fullName} ${row.payrollRun?.period} ${row.status}`}
          gridTemplateColumns="1fr 0.8fr 0.8fr 0.8fr 0.8fr"
          columns={[
            { label: "Employee", render: (row) => <p className="text-sm font-black text-[#172033] sm:text-base">{row.employee?.fullName}</p> },
            { label: "Period", render: (row) => <p className="text-xs font-bold text-slate-500 sm:text-sm">{row.payrollRun?.period}</p> },
            { label: "Net salary", render: (row) => <p className="text-xs font-black text-[#172033] sm:text-sm">Rp {Number(row.netAmount).toLocaleString("id-ID")}</p> },
            { label: "Status", render: (row) => <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-xs font-black text-[var(--portal-primary)]">{row.payrollRun?.status ?? row.status}</span> },
            { label: "Action", render: (row) => <button onClick={() => downloadPayslip(row.id)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#172033] shadow-sm ring-1 ring-slate-100 transition hover:text-[var(--portal-primary)] sm:w-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-sm" type="button"><Download className="h-4 w-4" /> PDF</button> }
          ]}
        />
      )}
    </div>
  );
}
