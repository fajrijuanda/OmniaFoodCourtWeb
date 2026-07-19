"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Browser } from '@capacitor/browser';
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock3, CreditCard, LogOut, RefreshCcw, UsersRound } from "lucide-react";
import { AdminHeader, EmptyState, IconButton, PortalButton, PriorityBadge, SearchInput, StatCard, StatusBadge } from "@/components/portal/ui";
import { apiFetch, isSuperAdminUser, type AuthUser } from "@/lib/api";
import { clearAuthSession, getStoredUser } from "@/lib/mobile/session";

type TabKey = "accounts" | "transactions" | "followUps";

type Overview = {
  trialAccounts: number;
  subscribedAccounts: number;
  pendingTransactions: number;
  paidTransactions: number;
  followUpDue: number;
};

type AccountRow = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  subscriptionStatus: string;
  effectiveStatus: string;
  trialExpired: boolean;
  trialEndsAt?: string | null;
  trialSubIndustry?: { name: string; industry?: string } | null;
  trialTier?: string | null;
  tenant?: { id: string; name: string; status: string } | null;
  subscriptions: Array<{ id: string; status: string; industry?: string; subIndustry: string; tier: string; price: string; currentPeriodEnd: string }>;
};

type TransactionRow = {
  id: string;
  externalId: string;
  checkoutUrl?: string | null;
  source: string;
  action: string;
  status: string;
  paymentMethod: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  tenant?: { id: string; name: string } | null;
  industry?: string | null;
  subIndustry?: string | null;
  tier?: string | null;
  subtotal: string;
  tax: string;
  gatewayFee: string;
  total: string;
  followUpStatus: string;
  followUpNotes?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

type FollowUpRow = {
  id: string;
  type: string;
  priority: "high" | "medium" | "low";
  customerName: string;
  email?: string | null;
  phoneNumber?: string | null;
  context: string;
  status: string;
  amount?: string | null;
  dueAt?: string | null;
  notes: string;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "accounts", label: "Akun" },
  { key: "transactions", label: "Transaksi" },
  { key: "followUps", label: "Follow-up" }
];

export function AdminCustomers() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("accounts");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const parsed = getStoredUser<AuthUser>();
    if (!isSuperAdminUser(parsed)) {
      router.replace("/login");
      return;
    }
    setUser(parsed);
  }, [router]);

  const load = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [nextOverview, nextAccounts, nextTransactions, nextFollowUps] = await Promise.all([
        apiFetch<Overview>("/admin/customers/overview"),
        apiFetch<AccountRow[]>("/admin/customers/accounts"),
        apiFetch<TransactionRow[]>("/admin/customers/transactions"),
        apiFetch<FollowUpRow[]>("/admin/customers/follow-ups")
      ]);
      setOverview(nextOverview);
      setAccounts(nextAccounts);
      setTransactions(nextTransactions);
      setFollowUps(nextFollowUps);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat data customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) void load();
  }, [user]);

  const filteredAccounts = useMemo(() => {
    const q = query.toLowerCase();
    return accounts.filter((row) => `${row.name} ${row.email} ${row.tenant?.name ?? ""} ${row.trialSubIndustry?.name ?? ""}`.toLowerCase().includes(q));
  }, [accounts, query]);

  const filteredTransactions = useMemo(() => {
    const q = query.toLowerCase();
    return transactions.filter((row) => `${row.customerName ?? ""} ${row.customerEmail ?? ""} ${row.externalId} ${row.source} ${row.action} ${row.status}`.toLowerCase().includes(q));
  }, [transactions, query]);

  const filteredFollowUps = useMemo(() => {
    const q = query.toLowerCase();
    return followUps.filter((row) => `${row.customerName} ${row.email ?? ""} ${row.context} ${row.status} ${row.type}`.toLowerCase().includes(q));
  }, [followUps, query]);

  const updateFollowUp = async (row: FollowUpRow, status: string) => {
    if (row.id.startsWith("trial-") || row.id.startsWith("renew-")) {
      setMessage("Follow-up trial/renewal bersifat rekomendasi otomatis. Update status tersedia untuk transaksi checkout.");
      return;
    }
    await apiFetch(`/admin/customers/follow-ups/${row.id}`, {
      method: "PATCH",
      body: JSON.stringify({ followUpStatus: status, followUpNotes: row.notes })
    });
    await load();
  };

  const logout = () => {
    clearAuthSession();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-100 text-[#172033]">
      <AdminHeader
        title="Customer & transaksi"
        actions={
          <>
            <PortalButton href="/admin/settings" variant="secondary">Settings</PortalButton>
            <PortalButton href="/portal?role=developer" variant="secondary">Portal</PortalButton>
            <IconButton icon={RefreshCcw} label="Refresh" onClick={load} />
            <IconButton icon={LogOut} label="Logout" onClick={logout} className="bg-slate-950 text-white" />
          </>
        }
      />

      <section className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Trial" value={overview?.trialAccounts ?? 0} icon={Clock3} tone="orange" />
          <StatCard label="Subscriber" value={overview?.subscribedAccounts ?? 0} icon={UsersRound} tone="emerald" />
          <StatCard label="Pending trx" value={overview?.pendingTransactions ?? 0} icon={CreditCard} tone="amber" />
          <StatCard label="Paid trx" value={overview?.paidTransactions ?? 0} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Perlu follow-up" value={overview?.followUpDue ?? 0} icon={AlertCircle} tone="rose" />
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-black ${activeTab === tab.key ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`} type="button">
                  {tab.label}
                </button>
              ))}
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Cari customer, email, transaksi..." className="w-full lg:w-[360px]" />
          </div>
          {message ? <p className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</p> : null}
          {loading ? <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">Memuat data...</p> : null}

          {!loading && activeTab === "accounts" ? <AccountsTable rows={filteredAccounts} /> : null}
          {!loading && activeTab === "transactions" ? <TransactionsTable rows={filteredTransactions} /> : null}
          {!loading && activeTab === "followUps" ? <FollowUpsTable rows={filteredFollowUps} onUpdate={updateFollowUp} /> : null}
        </div>
      </section>
    </main>
  );
}

function AccountsTable({ rows }: { rows: AccountRow[] }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          <tr><th className="p-3">Customer</th><th className="p-3">Status</th><th className="p-3">Trial</th><th className="p-3">Tenant</th><th className="p-3">Subscriptions</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              <td className="p-3"><p className="font-black">{row.name}</p><p className="text-xs font-bold text-slate-500">{row.email}</p><p className="text-xs font-bold text-slate-400">{row.phoneNumber ?? "-"}</p></td>
              <td className="p-3"><StatusBadge status={row.effectiveStatus} /></td>
              <td className="p-3"><p className="font-bold">{row.trialSubIndustry ? `${row.trialSubIndustry.industry} / ${row.trialSubIndustry.name}` : "-"}</p><p className="text-xs font-bold text-slate-500">{row.trialTier ?? "-"} {row.trialExpired ? "(expired)" : ""}</p></td>
              <td className="p-3"><p className="font-bold">{row.tenant?.name ?? "-"}</p><p className="text-xs font-bold text-slate-500">{row.tenant?.status ?? "-"}</p></td>
              <td className="p-3">{row.subscriptions.length ? row.subscriptions.map((sub) => <p key={sub.id} className="mb-1 text-xs font-bold text-slate-600">{sub.industry} / {sub.subIndustry} / {sub.tier}</p>) : <span className="text-xs font-bold text-slate-400">Belum ada</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <EmptyState /> : null}
    </div>
  );
}

function TransactionsTable({ rows }: { rows: TransactionRow[] }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left text-sm">
        <thead className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          <tr><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3">Source</th><th className="p-3">Plan</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Link</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              <td className="p-3"><p className="font-black">{row.externalId}</p><p className="text-xs font-bold text-slate-500">{new Date(row.createdAt).toLocaleString("id-ID")}</p></td>
              <td className="p-3"><p className="font-bold">{row.customerName ?? row.tenant?.name ?? "-"}</p><p className="text-xs font-bold text-slate-500">{row.customerEmail ?? row.customerPhone ?? "-"}</p></td>
              <td className="p-3"><p className="font-bold capitalize">{row.source}</p><p className="text-xs font-bold text-slate-500">{row.action}</p></td>
              <td className="p-3"><p className="font-bold">{row.industry ?? "-"}</p><p className="text-xs font-bold text-slate-500">{row.subIndustry ?? "-"} / {row.tier ?? "-"}</p></td>
              <td className="p-3"><p className="font-black">{formatCurrency(row.total)}</p><p className="text-xs font-bold text-slate-500">fee {formatCurrency(row.gatewayFee)}</p></td>
              <td className="p-3"><StatusBadge status={row.status} /></td>
              <td className="p-3">{row.checkoutUrl ? <a href={row.checkoutUrl} target="_blank" onClick={(e) => { if (window.hasOwnProperty('Capacitor')) { e.preventDefault(); Browser.open({ url: row.checkoutUrl as string }); } }} className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">Open <ArrowUpRight className="h-3 w-3" /></a> : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? <EmptyState /> : null}
    </div>
  );
}

function FollowUpsTable({ rows, onUpdate }: { rows: FollowUpRow[]; onUpdate: (row: FollowUpRow, status: string) => void }) {
  return (
    <div className="mt-5 grid gap-3">
      {rows.map((row) => (
        <article key={row.id} className="grid gap-4 rounded-[20px] border border-slate-100 bg-slate-50 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={row.priority} />
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{row.type}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{row.status}</span>
            </div>
            <h3 className="mt-3 text-lg font-black">{row.customerName}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">{row.email ?? row.phoneNumber ?? "Kontak belum lengkap"}</p>
            <p className="mt-2 text-sm font-bold text-slate-600">{row.context}</p>
            <p className="mt-2 text-xs font-bold text-slate-400">{row.notes}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button onClick={() => onUpdate(row, "contacted")} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black" type="button">Sudah dihubungi</button>
            <button onClick={() => onUpdate(row, "converted")} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black text-white" type="button">Converted</button>
            <button onClick={() => onUpdate(row, "closed")} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white" type="button">Close</button>
          </div>
        </article>
      ))}
      {rows.length === 0 ? <EmptyState /> : null}
    </div>
  );
}

function formatCurrency(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);
}
