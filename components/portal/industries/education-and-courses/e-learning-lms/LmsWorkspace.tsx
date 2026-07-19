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
function LmsCoursesView({ classes }: { classes?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="LMS" title="Mata Kuliah" body="Kelola materi, silabus, dan daftar mahasiswa di tiap kelas." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {classes?.map(c => (
          <Panel key={c.id || c.code} className="p-5 hover:border-[var(--portal-primary)] transition cursor-pointer">
            <span className="inline-flex rounded-full bg-[var(--portal-primary-soft)] px-2 py-0.5 text-[10px] font-black text-[var(--portal-primary)]">{c.code}</span>
            <h3 className="mt-3 text-lg font-black text-[#172033]">{c.course?.name || "Unknown Course"}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">Dosen: {c.faculty?.name || "TBA"}</p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-black text-slate-400">{c.enrolledCount || 0} Enrolled</span>
              <span className="text-xs font-black text-[var(--portal-primary)]">{c.status}</span>
            </div>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada kelas aktif.</p>}
      </div>
    </div>
  );
}
function LmsAssignmentsView({ assignments }: { assignments?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="LMS" title="Tugas & Ujian" body="Daftar tugas yang diberikan kepada mahasiswa dan status pengumpulannya." />
      <div className="grid gap-4">
        {assignments?.map(a => (
          <Panel key={a.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[#172033]">{a.title}</h3>
              <p className="mt-1 text-xs font-bold text-slate-500">Due: {new Date(a.dueDate).toLocaleString()}</p>
            </div>
            <button className="rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black text-[var(--portal-primary)]">Lihat Submission</button>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada tugas aktif.</p>}
      </div>
    </div>
  );
}
function LmsAttendanceView({ attendance }: { attendance?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="LMS" title="Presensi Mahasiswa" body="Validasi kehadiran tatap muka maupun online." />
      <div className="grid gap-3">
        {attendance?.map(a => (
          <Panel key={a.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-slate-400">{new Date(a.date).toLocaleDateString()}</p>
              <h3 className="mt-1 text-base font-black text-[#172033]">{a.student?.name || "Unknown Student"}</h3>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${a.status === "present" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>{a.status}</span>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Tidak ada data presensi.</p>}
      </div>
    </div>
  );
}
function LmsGradebookView({ grades }: { grades?: any[] }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="LMS" title="Buku Nilai (Gradebook)" body="Rekapitulasi nilai akhir, kuis, UTS, dan UAS." />
      <div className="grid gap-3 sm:grid-cols-2">
        {grades?.map(g => (
          <Panel key={g.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-slate-400">{g.component}</p>
              <h3 className="mt-1 text-base font-black text-[#172033]">{g.student?.name || "Unknown Student"}</h3>
            </div>
            <span className="text-2xl font-black text-[var(--portal-primary)]">{g.score}</span>
          </Panel>
        )) || <p className="text-sm font-black text-slate-400">Belum ada nilai terinput.</p>}
      </div>
    </div>
  );
}
export function LmsWorkspace({ moduleKey, classes, assignments, attendance, grades }: { moduleKey: CampusModuleKey; classes?: any[]; assignments?: any[]; attendance?: any[]; grades?: any[] }) {
  if (moduleKey === "courses") return <LmsCoursesView classes={classes} />;
  if (moduleKey === "assignments") return <LmsAssignmentsView assignments={assignments} />;
  if (moduleKey === "attendance") return <LmsAttendanceView attendance={attendance} />;
  if (moduleKey === "gradebook") return <LmsGradebookView grades={grades} />;

  const tableRows = classes?.length ? classes.map(c => ({
    Course: c.course?.name || "Unknown",
    Code: c.code || "-",
    Lecturer: c.faculty?.name || "TBA",
    Enrolled: `${c.enrolledCount || 0} students`,
    Status: c.status || "active"
  })) : lmsRows;

  return (
    <div className="space-y-4 sm:space-y-6">
      <WorkspaceHeader eyebrow="E-Learning workspace" title="LMS Overview" body="Kelola mata kuliah, materi, tugas, presensi, dan nilai dari satu workspace pembelajaran." />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-lg font-black text-[#172033]">Active courses</h2><p className="text-xs font-bold text-slate-500">Kelas, dosen, jadwal, progress, dan status.</p></div>
            <span className="rounded-full bg-[var(--portal-primary-soft)] px-3 py-1 text-xs font-black text-[var(--portal-primary)]">{classes?.length || 86} kelas</span>
          </div>
          <SimpleTable rows={tableRows} />
        </Panel>
        <Panel className="p-4 sm:p-5">
          <h2 className="text-lg font-black text-[#172033]">Learning queue</h2>
          <div className="mt-4 space-y-3">
            {assignments?.length ? assignments.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-[16px] bg-slate-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <p className="text-sm font-bold text-slate-600">{a.title} - Due: {new Date(a.dueDate).toLocaleDateString()}</p>
              </div>
            )) : ["24 tugas menunggu submit", "11 kelas perlu validasi presensi", "8 gradebook siap export"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[16px] bg-slate-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <p className="text-sm font-bold text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
