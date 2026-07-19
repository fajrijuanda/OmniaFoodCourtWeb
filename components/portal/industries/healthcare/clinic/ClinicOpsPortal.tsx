"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, ArrowRightLeft, CalendarCheck2, CheckCircle2, ClipboardList, CreditCard, FlaskConical, HeartPulse, ListChecks, Lock, Network, Pill, Plus, RefreshCcw, Search, Settings, Stethoscope, Users, WalletCards } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Panel } from "@/components/portal/ui";
import type { PortalPage } from "../../../portalTypes";

type ClinicTier = "starter" | "growth" | "pro" | "enterprise";
type ClinicPatient = {
  id: string;
  medicalRecordNo: string;
  fullName: string;
  gender?: string | null;
  phoneNumber?: string | null;
  allergyNotes?: string | null;
  visits?: Array<{ id: string; status: string; createdAt: string; service?: { name: string } | null }>;
  appointments?: Array<{ id: string; status: string; scheduledAt: string; service?: { name: string } | null }>;
  invoices?: Array<{ id: string; invoiceNumber: string; status: string; totalAmount: string | number }>;
};
type ClinicService = { id: string; name: string; category: string; price: string | number; isActive: boolean };
type ClinicAppointment = { id: string; scheduledAt: string; queueNumber?: string | null; status: string; patient: ClinicPatient; service?: ClinicService | null };
type ClinicQueue = { id: string; number: string; status: string; station?: string | null; patient?: { name: string; medicalRecordNo: string } | null; service?: { name: string } | null };
type ClinicVisit = { id: string; status: string; chiefComplaint?: string | null; patient: ClinicPatient; service?: ClinicService | null; vital?: Record<string, unknown> | null; soap?: Record<string, unknown> | null; diagnoses?: Array<{ name: string; code?: string | null }> };
type ClinicPrescription = { id: string; status: string; patient: ClinicPatient; items: Array<{ name: string; dosage?: string | null; quantity: string | number }> };
type PharmacyData = {
  drugs: Array<{ id: string; name: string; sku?: string | null; unit: string; salePrice: string | number; minStock: string | number; stocks: Array<{ quantity: string | number; expiryDate?: string | null }> }>;
  movements: Array<{ id: string; type: string; quantity: string | number; createdAt: string; drug?: { name: string } | null }>;
  purchaseOrders: Array<{ id: string; poNumber: string; vendorName: string; status: string; totalAmount: string | number }>;
  stockOpnames: Array<{ id: string; code: string; status: string; notes?: string | null }>;
};
type ClinicInvoice = { id: string; invoiceNumber: string; status: string; totalAmount: string | number; paidAmount: string | number; patient: ClinicPatient; items: Array<{ name: string; totalAmount: string | number }> };
type DashboardData = {
  tier: ClinicTier;
  stats: {
    patients: number;
    appointmentsToday: number;
    waitingQueue: number;
    openVisits: number;
    finalizedToday: number;
    lowStocks: number;
    expiringStocks: number;
    revenueToday: number;
  };
  queue: ClinicQueue[];
};

const tierRank: Record<ClinicTier, number> = { starter: 1, growth: 2, pro: 3, enterprise: 4 };
const moduleMinimumTier: Partial<Record<PortalPage, ClinicTier>> = {
  "clinic-analytics": "starter",
  "clinic-nurse-station": "growth",
  "clinic-visits": "growth",
  "clinic-prescriptions": "growth",
  "clinic-pharmacy": "pro",
  "clinic-cashier": "pro",
  "clinic-finance": "pro",
  "clinic-integrations": "enterprise"
};

const pageMeta: Record<string, { title: string; caption: string }> = {
  "clinic-dashboard": { title: "KlinikOps Portal", caption: "Operasional harian klinik lintas cabang dalam satu workspace." },
  "clinic-analytics": { title: "KlinikOps Analytics", caption: "Ringkasan performa klinik dan antrean aktif." },
  "clinic-patients": { title: "Pasien", caption: "Master pasien, ringkasan riwayat, alergi, appointment, visit, dan invoice." },
  "clinic-appointments": { title: "Appointment", caption: "Jadwal pasien, check-in, dan nomor antrean." },
  "clinic-queue": { title: "Antrean", caption: "Queue display internal untuk call, skip, dan selesai." },
  "clinic-nurse-station": { title: "Nurse Station", caption: "Triage cepat, vital sign, dan keluhan awal." },
  "clinic-visits": { title: "Kunjungan", caption: "SOAP, diagnosis, tindakan, dan finalize visit." },
  "clinic-prescriptions": { title: "E-Resep", caption: "Resep sederhana dan dispensing farmasi." },
  "clinic-pharmacy": { title: "Farmasi", caption: "Master obat, stok cabang, kartu stok, PO, dan opname." },
  "clinic-cashier": { title: "Kasir Klinik", caption: "Invoice layanan dan obat, pembayaran, refund, dan closing." },
  "clinic-finance": { title: "Keuangan", caption: "Ringkasan pendapatan dan outstanding owner." },
  "clinic-integrations": { title: "Integrasi", caption: "Lab mailbox dan SatuSehat-ready sync log." },
  "clinic-settings": { title: "Settings", caption: "Policy branch, role, dan operational controls KlinikOps." }
};

export function ClinicOpsPortal({ activePage, currentTier }: { activePage: PortalPage; currentTier: string }) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [patients, setPatients] = useState<ClinicPatient[]>([]);
  const [services, setServices] = useState<ClinicService[]>([]);
  const [appointments, setAppointments] = useState<ClinicAppointment[]>([]);
  const [queue, setQueue] = useState<ClinicQueue[]>([]);
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [prescriptions, setPrescriptions] = useState<ClinicPrescription[]>([]);
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const [invoices, setInvoices] = useState<ClinicInvoice[]>([]);
  const [finance, setFinance] = useState<{ revenue: number; paymentCount: number; outstanding: number; outstandingCount: number } | null>(null);
  const [integrations, setIntegrations] = useState<{ lab: Array<Record<string, unknown>>; satuSehat: Array<Record<string, unknown>>; transfers: Array<Record<string, unknown>> }>({ lab: [], satuSehat: [], transfers: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedTier = useMemo<ClinicTier>(() => {
    const value = (dashboard?.tier ?? currentTier).toLowerCase();
    if (value.includes("enterprise")) return "enterprise";
    if (value.includes("pro")) return "pro";
    if (value.includes("growth")) return "growth";
    return "starter";
  }, [currentTier, dashboard?.tier]);

  const meta = pageMeta[activePage] ?? pageMeta["clinic-dashboard"];
  const minTier = moduleMinimumTier[activePage] ?? "starter";
  const locked = tierRank[normalizedTier] < tierRank[minTier];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await apiFetch<DashboardData>("/tenant/clinic/dashboard");
      setDashboard(dashboardData);
      const page = activePage === "clinic" ? "clinic-dashboard" : activePage;
      const shared = [
        apiFetch<ClinicPatient[]>(`/tenant/clinic/patients${search ? `?search=${encodeURIComponent(search)}` : ""}`),
        apiFetch<ClinicService[]>("/tenant/clinic/services")
      ] as const;
      const [patientData, serviceData] = await Promise.all(shared);
      setPatients(patientData);
      setServices(serviceData);
      if (["clinic-dashboard", "clinic-analytics", "clinic-appointments", "clinic-queue"].includes(page)) {
        const [appointmentData, queueData] = await Promise.all([
          apiFetch<ClinicAppointment[]>("/tenant/clinic/appointments"),
          apiFetch<ClinicQueue[]>("/tenant/clinic/queue")
        ]);
        setAppointments(appointmentData);
        setQueue(queueData);
      }
      if (["clinic-nurse-station", "clinic-visits"].includes(page) && !locked) setVisits(await apiFetch<ClinicVisit[]>("/tenant/clinic/visits"));
      if (page === "clinic-prescriptions" && !locked) setPrescriptions(await apiFetch<ClinicPrescription[]>("/tenant/clinic/prescriptions"));
      if (page === "clinic-pharmacy" && !locked) setPharmacy(await apiFetch<PharmacyData>("/tenant/clinic/pharmacy"));
      if (page === "clinic-cashier" && !locked) setInvoices(await apiFetch<ClinicInvoice[]>("/tenant/clinic/billing"));
      if (page === "clinic-finance" && !locked) setFinance(await apiFetch<{ revenue: number; paymentCount: number; outstanding: number; outstandingCount: number }>("/tenant/clinic/finance"));
      if (page === "clinic-integrations" && !locked) {
        const [lab, satuSehat, transfers] = await Promise.all([
          apiFetch<Array<Record<string, unknown>>>("/tenant/clinic/lab-mailbox"),
          apiFetch<Array<Record<string, unknown>>>("/tenant/clinic/satusehat-sync"),
          apiFetch<Array<Record<string, unknown>>>("/tenant/clinic/transfers")
        ]);
        setIntegrations({ lab, satuSehat, transfers });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat KlinikOps.");
    } finally {
      setLoading(false);
    }
  }, [activePage, locked, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const createPatient = async () => {
    await apiFetch("/tenant/clinic/patients", {
      method: "POST",
      body: JSON.stringify({ fullName: `Pasien Baru ${patients.length + 1}`, gender: "Female", phoneNumber: `0813${Date.now().toString().slice(-8)}` })
    });
    await load();
  };

  const createAppointment = async () => {
    if (!patients[0]) return;
    const scheduledAt = new Date();
    scheduledAt.setHours(scheduledAt.getHours() + 1, 0, 0, 0);
    await apiFetch("/tenant/clinic/appointments", {
      method: "POST",
      body: JSON.stringify({ patientId: patients[0].id, serviceId: services[0]?.id, scheduledAt, queueNumber: `A${String(appointments.length + 1).padStart(3, "0")}` })
    });
    await load();
  };

  const createVisit = async () => {
    if (!patients[0]) return;
    await apiFetch("/tenant/clinic/visits", {
      method: "POST",
      body: JSON.stringify({ patientId: patients[0].id, serviceId: services[0]?.id, chiefComplaint: "Keluhan awal pasien" })
    });
    await load();
  };

  const createPrescription = async () => {
    if (!patients[0]) return;
    await apiFetch("/tenant/clinic/prescriptions", {
      method: "POST",
      body: JSON.stringify({ patientId: patients[0].id, visitId: visits[0]?.id, items: [{ name: "Paracetamol 500mg", dosage: "3x1", quantity: 10, instructions: "Sesudah makan" }] })
    });
    await load();
  };

  const createDrug = async () => {
    await apiFetch("/tenant/clinic/pharmacy/drugs", {
      method: "POST",
      body: JSON.stringify({ sku: `OBT-${Date.now().toString().slice(-4)}`, name: `Obat Demo ${(pharmacy?.drugs.length ?? 0) + 1}`, unit: "tablet", salePrice: 2500, minStock: 20 })
    });
    await load();
  };

  const createInvoice = async () => {
    if (!patients[0]) return;
    await apiFetch("/tenant/clinic/billing", {
      method: "POST",
      body: JSON.stringify({ patientId: patients[0].id, visitId: visits[0]?.id, items: [{ name: "Konsultasi dokter", quantity: 1, unitPrice: 150000 }] })
    });
    await load();
  };

  const titleAction = (() => {
    if (activePage === "clinic-patients") return { label: "Pasien", onClick: createPatient };
    if (activePage === "clinic-appointments") return { label: "Appointment", onClick: createAppointment };
    if (activePage === "clinic-visits" || activePage === "clinic-nurse-station") return { label: "Visit", onClick: createVisit };
    if (activePage === "clinic-prescriptions") return { label: "Resep", onClick: createPrescription };
    if (activePage === "clinic-pharmacy") return { label: "Obat", onClick: createDrug };
    if (activePage === "clinic-cashier") return { label: "Invoice", onClick: createInvoice };
    return null;
  })();

  return (
    <div className="space-y-4 sm:space-y-5">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">KlinikOps Omnia</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-4xl">{meta.title}</h1>
            <p className="mt-1 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">{meta.caption}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={load} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-[#172033]" type="button">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            {titleAction && !locked ? (
              <button onClick={titleAction.onClick} className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-[var(--portal-on-primary)]" type="button">
                <Plus className="h-4 w-4" />
                {titleAction.label}
              </button>
            ) : null}
          </div>
        </div>
      </Panel>

      {locked ? <LockedPanel tier={normalizedTier} minTier={minTier} /> : null}
      {error ? <Panel><p className="text-sm font-black text-rose-600">{error}</p></Panel> : null}
      {loading ? <Panel><p className="py-8 text-center text-sm font-black text-slate-400">Loading KlinikOps...</p></Panel> : null}

      {!loading && !locked && (activePage === "clinic" || activePage === "clinic-dashboard") ? <ClinicOverviewView currentTier={normalizedTier} dashboard={dashboard} /> : null}
      {!loading && !locked && activePage === "clinic-analytics" ? <DashboardView dashboard={dashboard} queue={dashboard?.queue ?? queue} /> : null}
      {!loading && !locked && activePage === "clinic-patients" ? <PatientsView patients={patients} search={search} setSearch={setSearch} onSearch={load} /> : null}
      {!loading && !locked && activePage === "clinic-appointments" ? <AppointmentsView appointments={appointments} onCheckIn={async (id) => { await apiFetch(`/tenant/clinic/appointments/${id}`, { method: "PATCH", body: JSON.stringify({ status: "checked_in" }) }); await load(); }} /> : null}
      {!loading && !locked && activePage === "clinic-queue" ? <QueueView queue={queue} onStatus={async (id, status) => { await apiFetch(`/tenant/clinic/queue/${id}`, { method: "PATCH", body: JSON.stringify({ status, station: "Ruang 1" }) }); await load(); }} /> : null}
      {!loading && !locked && activePage === "clinic-nurse-station" ? <VisitsView visits={visits} compact /> : null}
      {!loading && !locked && activePage === "clinic-visits" ? <VisitsView visits={visits} onFinalize={async (id) => { await apiFetch(`/tenant/clinic/visits/${id}/finalize`, { method: "PATCH" }); await load(); }} /> : null}
      {!loading && !locked && activePage === "clinic-prescriptions" ? <PrescriptionsView prescriptions={prescriptions} onDispense={async (id) => { await apiFetch(`/tenant/clinic/prescriptions/${id}/dispense`, { method: "PATCH" }); await load(); }} /> : null}
      {!loading && !locked && activePage === "clinic-pharmacy" ? <PharmacyView pharmacy={pharmacy} /> : null}
      {!loading && !locked && activePage === "clinic-cashier" ? <CashierView invoices={invoices} onPay={async (id) => { await apiFetch(`/tenant/clinic/billing/${id}/pay`, { method: "PATCH", body: JSON.stringify({ amount: invoices.find((invoice) => invoice.id === id)?.totalAmount ?? 0, method: "cash" }) }); await load(); }} /> : null}
      {!loading && !locked && activePage === "clinic-finance" ? <FinanceView finance={finance} /> : null}
      {!loading && !locked && activePage === "clinic-integrations" ? <IntegrationsView integrations={integrations} /> : null}
      {!loading && !locked && activePage === "clinic-settings" ? <SettingsView tier={normalizedTier} /> : null}
    </div>
  );
}

function DashboardView({ dashboard, queue }: { dashboard: DashboardData | null; queue: ClinicQueue[] }) {
  const stats = [
    { label: "Pasien aktif", value: dashboard?.stats.patients ?? 0, icon: Users },
    { label: "Appointment hari ini", value: dashboard?.stats.appointmentsToday ?? 0, icon: CalendarCheck2 },
    { label: "Antrean berjalan", value: dashboard?.stats.waitingQueue ?? 0, icon: ClipboardList },
    { label: "Revenue hari ini", value: formatMoney(dashboard?.stats.revenueToday ?? 0), icon: WalletCards },
    { label: "Visit open", value: dashboard?.stats.openVisits ?? 0, icon: Stethoscope },
    { label: "Visit selesai", value: dashboard?.stats.finalizedToday ?? 0, icon: Activity },
    { label: "Low stock", value: dashboard?.stats.lowStocks ?? 0, icon: Pill },
    { label: "Expiry alert", value: dashboard?.stats.expiringStocks ?? 0, icon: FlaskConical }
  ];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Panel key={label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-black text-[#172033]">{value}</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </Panel>
        ))}
      </div>
      <Panel>
        <SectionTitle title="Queue display" caption="Antrean aktif cabang saat ini." />
        <QueueRows queue={queue} />
      </Panel>
    </>
  );
}

function PatientsView({ patients, search, setSearch, onSearch }: { patients: ClinicPatient[]; search: string; setSearch: (value: string) => void; onSearch: () => void }) {
  return (
    <Panel>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle title="Master pasien" caption={`${patients.length} pasien dalam konteks cabang aktif.`} />
        <div className="flex w-full gap-2 sm:w-auto">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 px-3 py-2 sm:w-72">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none" placeholder="Cari pasien" />
          </div>
          <button onClick={onSearch} className="rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white" type="button">Cari</button>
        </div>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-slate-100">
        {patients.map((patient) => (
          <div key={patient.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 lg:grid-cols-[1.3fr_1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-[#172033]">{patient.fullName}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{patient.medicalRecordNo} · {patient.gender ?? "-"} · {patient.phoneNumber ?? "-"}</p>
            </div>
            <p className="text-xs font-bold text-slate-500">{patient.allergyNotes ? `Alergi: ${patient.allergyNotes}` : "Tidak ada catatan alergi"}</p>
            <p className="text-xs font-black text-[var(--portal-primary)]">{patient.visits?.[0]?.service?.name ?? patient.appointments?.[0]?.service?.name ?? "Belum ada layanan terakhir"}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AppointmentsView({ appointments, onCheckIn }: { appointments: ClinicAppointment[]; onCheckIn: (id: string) => void }) {
  return (
    <Panel>
      <SectionTitle title="Jadwal pasien" caption={`${appointments.length} appointment terbaru.`} />
      <div className="mt-4 grid gap-3">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="grid gap-3 rounded-[18px] border border-slate-100 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black text-[#172033]">{appointment.patient.fullName} · {appointment.service?.name ?? "Layanan"}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{new Date(appointment.scheduledAt).toLocaleString("id-ID")} · {appointment.queueNumber ?? "Tanpa antrean"} · {appointment.status}</p>
            </div>
            <button onClick={() => onCheckIn(appointment.id)} className="rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-[var(--portal-on-primary)]" type="button">Check-in</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function QueueView({ queue, onStatus }: { queue: ClinicQueue[]; onStatus: (id: string, status: string) => void }) {
  return (
    <Panel>
      <SectionTitle title="Antrean klinik" caption="Kontrol antrean display." />
      <QueueRows queue={queue} actions={(ticket) => (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onStatus(ticket.id, "called")} className="rounded-full bg-[var(--portal-primary)] px-3 py-1.5 text-xs font-black text-[var(--portal-on-primary)]" type="button">Call</button>
          <button onClick={() => onStatus(ticket.id, "skipped")} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black" type="button">Skip</button>
          <button onClick={() => onStatus(ticket.id, "done")} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600" type="button">Done</button>
        </div>
      )} />
    </Panel>
  );
}

function VisitsView({ visits, compact = false, onFinalize }: { visits: ClinicVisit[]; compact?: boolean; onFinalize?: (id: string) => void }) {
  return (
    <Panel>
      <SectionTitle title={compact ? "Nurse station" : "Kunjungan pasien"} caption={`${visits.length} visit dalam konteks aktif.`} />
      <div className="mt-4 grid gap-3">
        {visits.map((visit) => (
          <div key={visit.id} className="rounded-[18px] border border-slate-100 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-[#172033]">{visit.patient.fullName} · {visit.service?.name ?? "Visit"}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{visit.chiefComplaint ?? "Belum ada keluhan"} · {visit.status}</p>
              </div>
              {onFinalize && visit.status !== "finalized" ? <button onClick={() => onFinalize(visit.id)} className="rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white" type="button">Finalize</button> : null}
            </div>
            {!compact ? <p className="mt-3 text-xs font-bold text-slate-500">Diagnosis: {visit.diagnoses?.map((item) => item.name).join(", ") || "Belum diisi"}</p> : null}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PrescriptionsView({ prescriptions, onDispense }: { prescriptions: ClinicPrescription[]; onDispense: (id: string) => void }) {
  return (
    <Panel>
      <SectionTitle title="E-resep" caption={`${prescriptions.length} resep terbaru.`} />
      <div className="mt-4 grid gap-3">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="grid gap-3 rounded-[18px] border border-slate-100 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black text-[#172033]">{prescription.patient.fullName} · {prescription.status}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{prescription.items.map((item) => `${item.name} ${item.dosage ?? ""}`).join(", ")}</p>
            </div>
            <button onClick={() => onDispense(prescription.id)} className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600" type="button">Dispense</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PharmacyView({ pharmacy }: { pharmacy: PharmacyData | null }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <Panel>
        <SectionTitle title="Master obat dan stok" caption={`${pharmacy?.drugs.length ?? 0} obat aktif.`} />
        <div className="mt-4 grid gap-3">
          {(pharmacy?.drugs ?? []).map((drug) => {
            const stock = drug.stocks.reduce((sum, item) => sum + Number(item.quantity), 0);
            return (
              <div key={drug.id} className="grid gap-2 rounded-[18px] border border-slate-100 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-black text-[#172033]">{drug.name}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{drug.sku ?? "-"} · {formatMoney(drug.salePrice)} · min {String(drug.minStock)} {drug.unit}</p>
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-black ${stock <= Number(drug.minStock) ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>{stock} {drug.unit}</span>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel>
        <SectionTitle title="Kartu stok" caption="Movement terakhir." />
        <div className="mt-4 space-y-3">
          {(pharmacy?.movements ?? []).map((movement) => (
            <div key={movement.id} className="rounded-[16px] bg-slate-50 p-3">
              <p className="text-xs font-black text-[#172033]">{movement.drug?.name ?? "Obat"} · {movement.type}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{String(movement.quantity)} · {new Date(movement.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CashierView({ invoices, onPay }: { invoices: ClinicInvoice[]; onPay: (id: string) => void }) {
  return (
    <Panel>
      <SectionTitle title="Invoice klinik" caption={`${invoices.length} invoice terbaru.`} />
      <div className="mt-4 grid gap-3">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="grid gap-3 rounded-[18px] border border-slate-100 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black text-[#172033]">{invoice.invoiceNumber} · {invoice.patient.fullName}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{invoice.items.map((item) => item.name).join(", ")} · {invoice.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#172033]">{formatMoney(invoice.totalAmount)}</span>
              {invoice.status !== "paid" ? <button onClick={() => onPay(invoice.id)} className="rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-[var(--portal-on-primary)]" type="button">Pay</button> : null}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function FinanceView({ finance }: { finance: { revenue: number; paymentCount: number; outstanding: number; outstandingCount: number } | null }) {
  const items = [
    { label: "Revenue", value: formatMoney(finance?.revenue ?? 0), icon: WalletCards },
    { label: "Payment count", value: finance?.paymentCount ?? 0, icon: CreditCard },
    { label: "Outstanding", value: formatMoney(finance?.outstanding ?? 0), icon: ClipboardList },
    { label: "Outstanding invoice", value: finance?.outstandingCount ?? 0, icon: Activity }
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <Panel key={label}>
          <Icon className="h-5 w-5 text-[var(--portal-primary)]" />
          <p className="mt-4 text-xs font-black text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-[#172033]">{value}</p>
        </Panel>
      ))}
    </div>
  );
}

function IntegrationsView({ integrations }: { integrations: { lab: Array<Record<string, unknown>>; satuSehat: Array<Record<string, unknown>>; transfers: Array<Record<string, unknown>> } }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <IntegrationColumn title="Lab mailbox" items={integrations.lab} icon={FlaskConical} />
      <IntegrationColumn title="SatuSehat sync" items={integrations.satuSehat} icon={HeartPulse} />
      <IntegrationColumn title="Transfer pasien" items={integrations.transfers} icon={ArrowRightLeft} />
    </div>
  );
}

function SettingsView({ tier }: { tier: ClinicTier }) {
  const roles = ["clinic_admin", "clinic_doctor", "clinic_nurse", "clinic_cashier", "clinic_pharmacist", "clinic_branch_manager"];
  return (
    <Panel>
      <SectionTitle title="Policy KlinikOps" caption={`Tier aktif ${tier}. Permission detail dikelola di halaman Access.`} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <div key={role} className="rounded-[18px] border border-slate-100 p-4">
            <Settings className="h-5 w-5 text-[var(--portal-primary)]" />
            <p className="mt-3 text-sm font-black text-[#172033]">{role}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Role profile default tenant.</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function LockedPanel({ tier, minTier }: { tier: ClinicTier; minTier: ClinicTier }) {
  return (
    <Panel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Tier locked</p>
          <h2 className="mt-2 text-2xl font-black text-[#172033]">Butuh KlinikOps {minTier}</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">Tier aktif saat ini {tier}. Modul ini tetap terlihat agar owner tahu jalur upgrade berikutnya.</p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-rose-50 text-rose-500">
          <Lock className="h-6 w-6" />
        </span>
      </div>
    </Panel>
  );
}

function QueueRows({ queue, actions }: { queue: ClinicQueue[]; actions?: (ticket: ClinicQueue) => ReactNode }) {
  return (
    <div className="mt-4 grid gap-3">
      {queue.map((ticket) => (
        <div key={ticket.id} className="grid gap-3 rounded-[18px] border border-slate-100 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
          <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-[var(--portal-primary-soft)] text-base font-black text-[var(--portal-primary)]">{ticket.number}</span>
          <div>
            <p className="text-sm font-black text-[#172033]">{ticket.patient?.name ?? "Pasien"}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{ticket.patient?.medicalRecordNo ?? "-"} · {ticket.service?.name ?? "Layanan"} · {ticket.status}</p>
          </div>
          {actions?.(ticket)}
        </div>
      ))}
      {!queue.length ? <p className="rounded-[18px] bg-slate-50 p-5 text-center text-sm font-black text-slate-400">Tidak ada antrean aktif.</p> : null}
    </div>
  );
}

function IntegrationColumn({ title, items, icon: Icon }: { title: string; items: Array<Record<string, unknown>>; icon: typeof FlaskConical }) {
  return (
    <Panel>
      <Icon className="h-5 w-5 text-[var(--portal-primary)]" />
      <p className="mt-3 text-sm font-black text-[#172033]">{title}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{items.length} record</p>
      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <div key={String(item.id ?? index)} className="rounded-[16px] bg-slate-50 p-3">
            <p className="text-xs font-black text-[#172033]">{String(item.subject ?? item.entityType ?? item.status ?? "Record")}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{String(item.status ?? "queued")}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SectionTitle({ title, caption }: { title: string; caption: string }) {
  return (
    <div>
      <h2 className="text-xl font-black text-[#172033]">{title}</h2>
      <p className="mt-1 text-xs font-bold text-slate-500">{caption}</p>
    </div>
  );
}

function formatMoney(value: number | string) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value));
}

function ClinicOverviewView({ currentTier, dashboard }: { currentTier: ClinicTier; dashboard: DashboardData | null }) {
  const router = import("next/navigation").then(mod => mod.useRouter).catch(() => (() => ({})));
  const { useRouter } = require("next/navigation");
  const nav = useRouter();

  const tierPrices: Record<string, string> = { starter: "Rp499rb", growth: "Rp999rb", pro: "Rp2jt+", enterprise: "Mulai Rp6jt" };
  const tierPrice = tierPrices[currentTier] ?? tierPrices.starter;
  const tierName = currentTier.charAt(0).toUpperCase() + currentTier.slice(1);

  const modules = [
    { id: "clinic-analytics", label: "Analytics", icon: Activity, minTier: "starter" as ClinicTier, description: "Performa klinik dan antrean harian." },
    { id: "clinic-patients", label: "Patients", icon: Users, minTier: "starter" as ClinicTier, description: "Master pasien dan rekam medis." },
    { id: "clinic-appointments", label: "Appointment", icon: CalendarCheck2, minTier: "starter" as ClinicTier, description: "Jadwal dan check-in kedatangan." },
    { id: "clinic-queue", label: "Queue", icon: ListChecks, minTier: "starter" as ClinicTier, description: "Display antrean pemanggilan." },
    { id: "clinic-nurse-station", label: "Nurse Station", icon: HeartPulse, minTier: "growth" as ClinicTier, description: "Triage dan keluhan awal pasien." },
    { id: "clinic-visits", label: "Visits", icon: Stethoscope, minTier: "growth" as ClinicTier, description: "Pemeriksaan dokter dan SOAP." },
    { id: "clinic-prescriptions", label: "E-Resep", icon: Pill, minTier: "growth" as ClinicTier, description: "Resep digital dan dispensing." },
    { id: "clinic-pharmacy", label: "Farmasi", icon: FlaskConical, minTier: "pro" as ClinicTier, description: "Stok obat dan pergerakan." },
    { id: "clinic-cashier", label: "Kasir", icon: CreditCard, minTier: "pro" as ClinicTier, description: "Invoice dan pembayaran." },
    { id: "clinic-finance", label: "Finance", icon: WalletCards, minTier: "pro" as ClinicTier, description: "Laporan pendapatan." },
    { id: "clinic-integrations", label: "Integrasi", icon: Network, minTier: "enterprise" as ClinicTier, description: "Lab mailbox dan SatuSehat." },
    { id: "clinic-settings", label: "Settings", icon: Settings, minTier: "starter" as ClinicTier, description: "Pengaturan role dan operasional." }
  ];

  const unlockedModules = modules.filter(m => tierRank[currentTier] >= tierRank[m.minTier]);
  const lockedModules = modules.length - unlockedModules.length;

  const statCards = [
    { value: String(dashboard?.stats.patients ?? "150"), label: "Pasien aktif", icon: Users, delta: "+12%", caption: "dari bulan lalu" },
    { value: String(unlockedModules.length), label: "Modul terbuka", icon: CheckCircle2, delta: "+45%", caption: "coverage tier" },
    { value: String(lockedModules), label: "Modul terkunci", icon: Lock, delta: lockedModules === 0 ? "-100%" : "-15%", caption: "setelah upgrade" },
    { value: tierPrice, label: "Harga tier", icon: WalletCards, delta: "Aktif", caption: "per bulan" }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm lg:rounded-[28px] lg:p-7">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-6">
          <div>
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] lg:tracking-[0.24em] text-[var(--portal-primary)]">Healthcare tier preview</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] lg:mt-3 lg:text-4xl">KlinikOps {tierName}</h1>
            <p className="mt-2 lg:mt-3 max-w-3xl text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">
              Operasional harian klinik lintas cabang dalam satu workspace yang terpusat.
            </p>
          </div>
          <div className="rounded-[14px] bg-[var(--portal-primary-soft)] px-4 py-3 lg:rounded-[22px] lg:px-7 lg:py-5">
            <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.18em] text-[var(--portal-primary)]">Limit</p>
            <p className="mt-1 lg:mt-2 text-lg lg:text-2xl font-black text-[#172033]">Multi branch clinic</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4">
        {statCards.map(({ value, label, icon: Icon, delta, caption }) => (
          <article key={label} className="relative min-h-[100px] rounded-[16px] border border-slate-100 bg-white p-3 shadow-sm lg:min-h-[150px] lg:rounded-[24px] lg:p-6">
            <p className="pr-9 text-[11px] font-black text-slate-500 lg:text-sm">{label}</p>
            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-[11px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)] lg:right-5 lg:top-5 lg:h-11 lg:w-11 lg:rounded-[14px]">
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-4 text-xl font-black text-[#07142d] lg:mt-8 lg:text-3xl">{value}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 lg:mt-3 lg:gap-2">
              <span className={`rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[9px] lg:text-xs font-black ${delta.startsWith("-") ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="text-[9px] lg:text-xs font-bold text-slate-400">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm lg:rounded-[28px] lg:p-6">
        <div className="flex flex-col gap-3 lg:gap-4 border-b border-slate-100 pb-4 lg:pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-[#172033]">Fitur Klinik Enterprise</h2>
            <p className="mt-1 lg:mt-2 text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">
              Kiri menampilkan launcher halaman KlinikOps. Kanan merangkum fitur terbuka dan fitur terkunci dalam card ringkas.
            </p>
          </div>
          <button onClick={() => nav.push("/portal")} className="w-fit rounded-full border border-slate-200 px-4 py-2.5 lg:px-5 lg:py-3 text-[11px] lg:text-sm font-black text-[#172033]" type="button">
            Kembali ke overview
          </button>
        </div>

        <div className="mt-4 lg:mt-5 grid gap-4 lg:gap-5 xl:grid-cols-2">
          <div className="rounded-[16px] border border-slate-100 bg-slate-50 p-3 lg:rounded-[24px] lg:p-5">
            <div className="flex items-center justify-between gap-2 lg:gap-3">
              <div>
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[var(--portal-primary)]">App launcher</p>
                <h3 className="mt-1 lg:mt-2 text-lg lg:text-xl font-black text-[#172033]">Modul KlinikOps</h3>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-slate-500 shadow-sm">{modules.length} menu</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-5 lg:grid-cols-3 lg:gap-3">
              {modules.map((mod) => {
                const isUnlocked = tierRank[currentTier] >= tierRank[mod.minTier];
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      if (isUnlocked) nav.push(`/portal/healthcare/clinic/${mod.id.replace("clinic-", "")}`);
                    }}
                    className={`group min-h-[88px] rounded-[14px] border p-2.5 text-center transition lg:min-h-[122px] lg:rounded-[18px] lg:p-4 ${
                      isUnlocked
                        ? "border-slate-100 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[var(--portal-primary)]"
                        : "border-dashed border-slate-200 bg-white/70 hover:bg-white"
                    }`}
                    type="button"
                  >
                    <span className={`mx-auto grid h-9 w-9 place-items-center rounded-[12px] lg:h-12 lg:w-12 lg:rounded-[16px] ${
                      isUnlocked ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "bg-slate-100 text-slate-400"
                    }`}>
                      <mod.icon className="h-4 w-4 lg:h-6 lg:w-6" />
                    </span>
                    <p className="mt-2 text-xs font-black leading-snug text-[#172033] lg:mt-3 lg:text-sm">{mod.label}</p>
                    <span className={`mt-1.5 lg:mt-2 inline-flex rounded-full px-2 py-0.5 lg:px-3 py-1 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${
                      !isUnlocked ? "bg-slate-100 text-slate-500" : "bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]"
                    }`}>
                      {!isUnlocked ? "Locked" : "Open"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[16px] border border-slate-100 bg-white p-3 lg:rounded-[24px] lg:p-5">
            <div className="flex items-center justify-between gap-2 lg:gap-3">
              <div>
                <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] text-[var(--portal-primary)]">Entitlement</p>
                <h3 className="mt-1 lg:mt-2 text-lg lg:text-xl font-black text-[#172033]">Unlocked & locked</h3>
              </div>
              <div className="flex gap-1.5 lg:gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-emerald-600">{unlockedModules.length} open</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 lg:px-3 lg:py-1.5 text-[10px] lg:text-xs font-black text-slate-500">{lockedModules} locked</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:mt-5 lg:gap-3">
              {modules.map((mod) => {
                const isUnlocked = tierRank[currentTier] >= tierRank[mod.minTier];
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      if (isUnlocked) nav.push(`/portal/healthcare/clinic/${mod.id.replace("clinic-", "")}`);
                    }}
                    className="flex min-h-[68px] items-start gap-2.5 rounded-[14px] border border-slate-100 bg-slate-50 p-2.5 text-left transition hover:bg-white lg:min-h-[88px] lg:gap-3 lg:rounded-[18px] lg:p-4"
                    type="button"
                  >
                    <span className="grid h-8 w-8 lg:h-10 lg:w-10 shrink-0 place-items-center rounded-[10px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
                      <mod.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 lg:gap-2">
                        {isUnlocked ? <CheckCircle2 className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500" /> : <Lock className="h-3 w-3 lg:h-4 lg:w-4 text-slate-400" />}
                        <span className="text-xs lg:text-sm font-black text-[#172033]">{mod.label}</span>
                      </span>
                      <span className="mt-0.5 lg:mt-1 block text-[10px] lg:text-xs font-bold leading-snug lg:leading-5 text-slate-500">{mod.description}</span>
                      <span className={`mt-1.5 lg:mt-2 inline-flex rounded-full px-2 py-0.5 lg:px-2.5 lg:py-1 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] ${
                        isUnlocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      }`}>
                        {isUnlocked ? "Unlocked" : `Req. ${mod.minTier}`}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-3 w-3 lg:h-4 lg:w-4 shrink-0 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
