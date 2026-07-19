import { BarChart3, CheckCircle2, Lock, Settings, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/portal/ui";
import { FeatureCard, SimpleTable, WorkspaceHeader } from "../../../ui";
import { academicRows, campusAnnouncements, campusQuickActions, kknRows, lmsRows } from "../educationData";
import type { CampusModuleKey } from "../educationTypes";

function ActionGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {campusQuickActions.map((action) => {
        const Icon = action.icon;
        return (
          <FeatureCard key={action.title} title={action.title} caption={action.body} icon={Icon} />
        );
      })}
    </div>
  );
}
function AcademicRequestsView({ requests }: { requests?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="Layanan Akademik" title="Antrean Pengajuan" body="Daftar permohonan mahasiswa seperti cuti, surat keterangan, dan transkrip." />
      <div className="grid gap-3">
        {requests?.map(r => (
          <Panel key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--portal-primary-soft)] px-2.5 py-0.5 text-[10px] font-black uppercase text-[var(--portal-primary)]">{r.type}</span>
                <span className="text-xs font-black text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="mt-2 text-base font-black text-[#172033]">{r.student?.name || "Unknown Student"}</h3>
              <p className="mt-1 text-xs font-bold text-slate-500">{r.notes || "Tidak ada catatan tambahan."}</p>
            </div>
            <button className="rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white">Proses</button>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada antrean aktif.</p>}
      </div>
    </div>
  );
}
function AcademicDocumentsView({ documents }: { documents?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="Layanan Akademik" title="Repositori Dokumen" body="Arsip surat menyurat akademik dan transkrip mahasiswa." />
      <div className="grid gap-3 sm:grid-cols-2">
        {documents?.map(d => (
          <Panel key={d.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-[var(--portal-primary)]">{d.type}</p>
              <h3 className="mt-1 text-base font-black text-[#172033]">{d.title}</h3>
              <p className="mt-1 text-xs font-bold text-slate-500">Owner: {d.student?.name || "System"}</p>
            </div>
            <button className="rounded-full bg-slate-100 p-3 text-slate-400 hover:bg-[var(--portal-primary-soft)] hover:text-[var(--portal-primary)] transition">
              <span className="sr-only">Download</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Belum ada dokumen yang diterbitkan.</p>}
      </div>
    </div>
  );
}
function AcademicApprovalsView({ approvals }: { approvals?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="Layanan Akademik" title="Inbox Approval" body="Kotak masuk persetujuan dari Dekan, Kaprodi, atau BAAK." />
      <div className="grid gap-3">
        {approvals?.map(a => (
          <Panel key={a.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-slate-400">Request: {a.academicRequest?.type || "General"}</p>
              <h3 className="mt-1 text-base font-black text-[#172033]">Persetujuan {a.stage}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">Mahasiswa: {a.academicRequest?.student?.name || "Unknown"}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-600">Tolak</button>
              <button className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600">Setujui</button>
            </div>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada pengajuan yang membutuhkan persetujuan Anda saat ini.</p>}
      </div>
    </div>
  );
}
function AcademicBillingView({ invoices }: { invoices?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="Layanan Akademik" title="Kasir & Billing" body="Kelola invoice UKT, denda, dan biaya layanan akademik lainnya." />
      <div className="grid gap-3">
        {invoices?.map(i => (
          <Panel key={i.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-slate-400">Invoice: {i.invoiceNumber}</p>
              <h3 className="mt-1 text-base font-black text-[#172033]">{i.student?.name || "Unknown"}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{i.items?.[0]?.name || "Tagihan Kampus"} - <span className="font-black text-[#172033]">Rp {Number(i.totalAmount).toLocaleString()}</span></p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${i.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{i.status}</span>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada data billing aktif.</p>}
      </div>
    </div>
  );
}
export function AcademicWorkspace({ moduleKey, academicRequests, invoices, documents, approvals }: { moduleKey: CampusModuleKey; academicRequests?: any[]; invoices?: any[]; documents?: any[]; approvals?: any[] }) {
  if (moduleKey === "requests") return <AcademicRequestsView requests={academicRequests} />;
  if (moduleKey === "documents") return <AcademicDocumentsView documents={documents} />;
  if (moduleKey === "approvals") return <AcademicApprovalsView approvals={approvals} />;
  if (moduleKey === "billing") return <AcademicBillingView invoices={invoices} />;

  const tableRows = academicRequests?.length ? academicRequests.map(r => ({
    Type: r.type,
    Student: r.student?.name || "Unknown",
    Date: new Date(r.createdAt).toLocaleDateString(),
    Status: r.status
  })) : academicRows;

  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="Academic services" title="Academic Overview" body="Kelola pengajuan mahasiswa, dokumen, approval, riwayat layanan, dan billing akademik." />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-lg font-black text-[#172033]">Request queue</h2><p className="text-xs font-bold text-slate-500">Pengajuan yang sedang berjalan di BAAK, fakultas, dan kaprodi.</p></div>
            <span className="rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-xs font-black text-[var(--portal-primary)]">{academicRequests?.length || 37} pending</span>
          </div>
          <SimpleTable rows={tableRows} />
        </Panel>
        <Panel className="p-4 sm:p-5">
          <h2 className="text-lg font-black text-[#172033]">SLA health</h2>
          <div className="mt-5 space-y-4">
            {[["BAAK", "82%"], ["Fakultas", "74%"], ["Kaprodi", "69%"]].map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-black text-slate-600"><span>{label}</span><span>{value}</span></div>
                <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[var(--portal-primary)]" style={{ width: value }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
