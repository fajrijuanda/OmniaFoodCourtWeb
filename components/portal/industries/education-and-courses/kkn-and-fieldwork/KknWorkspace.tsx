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
function KknGroupsView({ kknGroups }: { kknGroups?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="KKN" title="Kelompok KKN" body="Daftar kelompok, anggota, dan dosen pembimbing lapangan." />
      <div className="grid gap-4 sm:grid-cols-2">
        {kknGroups?.map(g => (
          <Panel key={g.id} className="p-5">
            <h3 className="text-lg font-black text-[#172033]">{g.name}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">DPL: {g.supervisor?.name || "-"}</p>
            <p className="mt-1 text-xs text-slate-500">Lokasi: {g.location?.name || "-"}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{g.members?.length || 0} Mahasiswa</span>
              <span className="rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-xs font-black text-[var(--portal-primary)]">{g.status}</span>
            </div>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada kelompok aktif.</p>}
      </div>
    </div>
  );
}
function KknLocationsView({ kknLocations }: { kknLocations?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="KKN" title="Lokasi Plotting" body="Pemetaan wilayah dan kuota desa untuk penempatan mahasiswa." />
      <div className="grid gap-4 sm:grid-cols-2">
        {kknLocations?.map(l => (
          <Panel key={l.id} className="p-4 sm:p-5">
            <h3 className="text-lg font-black text-[#172033]">{l.name}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">Kuota Mahasiswa: {l.quota || 0}</p>
            <p className="mt-1 text-xs text-slate-500">Kebutuhan Disiplin Ilmu: {l.requirements || "Umum"}</p>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Belum ada lokasi terdaftar.</p>}
      </div>
    </div>
  );
}
function KknLogbookView({ kknLogbook }: { kknLogbook?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="KKN" title="Logbook Harian" body="Jurnal kegiatan harian mahasiswa di lokasi KKN." />
      <div className="grid gap-3">
        {kknLogbook?.map(log => (
          <Panel key={log.id} className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--portal-primary-soft)] px-2.5 py-0.5 text-[10px] font-black uppercase text-[var(--portal-primary)]">{new Date(log.date).toLocaleDateString()}</span>
              <span className="text-xs font-black text-slate-500">{log.student?.name || "Unknown"}</span>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-600">{log.activity}</p>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Belum ada logbook terinput.</p>}
      </div>
    </div>
  );
}
function KknReportsView({ kknReports }: { kknReports?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="KKN" title="Laporan Akhir" body="Review dan penilaian laporan akhir kelompok KKN." />
      <div className="grid gap-3">
        {kknReports?.map(r => (
          <Panel key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-400">Tanggal Upload: {new Date(r.submittedAt).toLocaleDateString()}</p>
              <h3 className="mt-1 text-base font-black text-[#172033]">{r.group?.name || "Unknown Group"}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">{r.title}</p>
            </div>
            <button className="rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black text-[var(--portal-primary)]">Lihat File</button>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Belum ada laporan akhir.</p>}
      </div>
    </div>
  );
}
export function KknWorkspace({ moduleKey, kknGroups, kknLocations, kknLogbook, kknReports }: { moduleKey: CampusModuleKey; kknGroups?: any[]; kknLocations?: any[]; kknLogbook?: any[]; kknReports?: any[] }) {
  if (moduleKey === "kkn-groups") return <KknGroupsView kknGroups={kknGroups} />;
  if (moduleKey === "kkn-locations") return <KknLocationsView kknLocations={kknLocations} />;
  if (moduleKey === "kkn-logbook") return <KknLogbookView kknLogbook={kknLogbook} />;
  if (moduleKey === "kkn-reports") return <KknReportsView kknReports={kknReports} />;

  const tableRows = kknGroups?.length ? kknGroups.map(g => ({
    Group: g.name,
    Location: g.location?.name || "-",
    Members: `${g.members?.length || 0} students`,
    Supervisor: g.supervisor?.name || "-",
    Status: g.status || "active"
  })) : kknRows;

  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="KKN workspace" title="KKN Overview" body="Pantau periode, kelompok, lokasi, dosen pembimbing, logbook, laporan, dan validasi KKN." />
      <Panel className="p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-lg font-black text-[#172033]">KKN active groups</h2><p className="text-xs font-bold text-slate-500">Progress per kelompok, lokasi, pembimbing, dan status lapangan.</p></div>
          <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-xs font-black text-[var(--portal-primary)]">{kknGroups?.length || 18} kelompok aktif</span>
        </div>
        <SimpleTable rows={tableRows} />
      </Panel>
      <ActionGrid />
    </div>
  );
}
