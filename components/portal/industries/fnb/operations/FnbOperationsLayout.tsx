"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Gift,
  RefreshCcw,
  Search,
  ReceiptText,
  X,
  TrendingUp,
  BarChart3,
  Plus,
} from "lucide-react";
import { RoundedSelect } from "@/components/portal/ui";
import type { LucideIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";

type ModuleKey =
  | "loyalty"
  | "shift-closing"
  | "order-history";

type OrderItem = {
  id: string;
  quantity: number;
  priceAtSale: number;
  note?: string | null;
  product?: { id: string; name: string; categoryId?: string | null };
};

type PosOrder = {
  id: string;
  invoiceNumber: string;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  paymentMethod: string;
  cashReceived?: number;
  changeAmount?: number;
  createdAt: string;
  shiftId?: string | null;
  items: OrderItem[];
  orderType?: string;
  reservationTime?: string | null;
  tableId?: string | null;
  pax?: number | null;
  customerName?: string | null;
  dpAmount?: number | null;
  isRefunded?: boolean;
  refundAmount?: number | null;
  followUpStatus?: string;
};

type Shift = {
  id: string;
  cashierId: string;
  status: string;
  startTime: string;
  endTime?: string | null;
  initialCash: number;
  finalCashSystem: number;
  finalCashActual: number;
  notes?: string | null;
  orderCount?: number;
};

type DataState = {
  orders: PosOrder[];
  shifts: Shift[];
};

const pageSizeOptions = [5, 10, 20];

const moduleMeta: Record<ModuleKey, { title: string; eyebrow: string; caption: string; icon: LucideIcon; primary: string; secondary: string }> = {
  loyalty: { title: "Loyalty & Promo", eyebrow: "Cafe growth", caption: "Kelola campaign, voucher, dan member summary untuk transaksi POS.", icon: Gift, primary: "Campaign aktif", secondary: "Voucher terpakai" },
  "shift-closing": { title: "Shift & Closing", eyebrow: "Cashier control", caption: "Buka shift, pantau transaksi kasir, dan tutup closing harian.", icon: CalendarClock, primary: "Shift terbuka", secondary: "Cash system" },
  "order-history": { title: "Riwayat Pesanan", eyebrow: "Customer Orders", caption: "Pantau daftar pesanan, riwayat pembayaran, dan struk/invoice pelanggan.", icon: ReceiptText, primary: "Total Pesanan", secondary: "Total Nilai" },
};

const emptyData: DataState = {
  orders: [],
  shifts: [],
};

function rupiah(value: number) {
  return `Rp${Math.round(value).toLocaleString("id-ID")}`;
}

function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const start = (normalizedPage - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), totalPages, normalizedPage };
}

function Pagination({ page, totalPages, totalRows, pageSize, setPage }: { page: number; totalPages: number; totalRows: number; pageSize: number; setPage: (value: number) => void }) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalRows, page * pageSize);
  return (
    <div className="flex flex-col items-center gap-3 border-t border-slate-100 px-4 py-4 text-xs font-black text-slate-500">
      <span>Menampilkan {start}-{end} dari {totalRows} data</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
        <span className="min-w-16 text-center">{page} / {totalPages}</span>
        <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function FnbOperationsLayout({ moduleKey, subIndustryName }: { moduleKey: ModuleKey; subIndustryName: string }) {
  const meta = moduleMeta[moduleKey];
  const [data, setData] = useState<DataState>(emptyData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [shiftCash, setShiftCash] = useState("500000");
  const [selectedOrder, setSelectedOrder] = useState<PosOrder | null>(null);
  const [settlementCash, setSettlementCash] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [orders, shifts] = await Promise.all([
        apiFetch<PosOrder[]>("/fnb/pos/orders"),
        apiFetch<Shift[]>("/fnb/pos/shifts"),
      ]);
      setData({ orders, shifts });
    } catch (event) {
      setError(event instanceof Error ? event.message : "Gagal memuat data F&B dari backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeShift = data.shifts.find((shift) => shift.status === "OPEN");
  const revenue = data.orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const rows = useMemo(() => {
    if (moduleKey === "shift-closing") {
      return data.shifts.map((shift) => ({ id: shift.id, cells: [shift.cashierId, shift.status, new Date(shift.startTime).toLocaleString("id-ID"), shift.endTime ? new Date(shift.endTime).toLocaleString("id-ID") : "-", rupiah(shift.initialCash), rupiah(shift.finalCashSystem), String(shift.orderCount ?? data.orders.filter((order) => order.shiftId === shift.id).length)] }));
    }
    if (moduleKey === "order-history") {
      return data.orders.map((order) => {
        const paymentLabel = order.paymentStatus === 'PAID' ? 'Lunas' : order.paymentStatus === 'UNPAID' ? 'Belum Lunas' : order.paymentStatus || 'Lunas';
        const typeLabel = order.orderType === 'RESERVATION' ? 'Reservasi' : order.orderType === 'TAKEAWAY' ? 'Bawa Pulang' : 'Makan di Sini';
        const resTime = order.reservationTime ? new Date(order.reservationTime).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-";

        return { 
          id: order.id, 
          meta: order, // Store order reference to open modal later
          cells: [order.invoiceNumber, new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }), typeLabel, resTime, order.status, order.paymentMethod || "CASH", paymentLabel, order.items.length + " item", rupiah(order.totalAmount)] 
        };
      });
    }
    return [];
  }, [data, moduleKey]);

  const filteredRows = rows.filter((row) => {
    const haystack = row.cells.join(" ").toLowerCase();
    const queryMatch = haystack.includes(query.toLowerCase());
    const statusMatch = statusFilter === "all" || haystack.includes(statusFilter.toLowerCase());
    return queryMatch && statusMatch;
  });
  const pagination = paginate(filteredRows, page, pageSize);

  const headers = moduleKey === "shift-closing"
    ? ["Kasir", "Status", "Mulai", "Selesai", "Modal", "Cash System", "Order"]
    : moduleKey === "order-history"
      ? ["Invoice", "Waktu Order", "Tipe", "Waktu Reservasi", "Status Dapur", "Metode Bayar", "Status Bayar", "Jumlah Item", "Total Pembayaran"]
      : ["Program", "Audiens", "Benefit", "Status", "Impact"];

  const kpis = [
    { label: meta.primary, value: moduleKey === "shift-closing" ? String(activeShift ? 1 : 0) : String(filteredRows.length), icon: meta.icon, delta: "+15%", caption: "vs minggu lalu" },
    { label: meta.secondary, value: moduleKey === "shift-closing" ? rupiah(activeShift?.finalCashSystem ?? revenue) : rupiah(revenue), icon: BarChart3, delta: "+8.2%", caption: "vs minggu lalu" },
    { label: "Order linked", value: String(data.orders.length), icon: ClipboardList, delta: "Aktif", caption: "hari ini" },
  ];

  if (moduleKey === "order-history") {
    kpis.push({ label: "Avg Nilai Pesanan", value: rupiah(revenue / Math.max(1, filteredRows.length)), icon: TrendingUp, delta: "+2.5%", caption: "vs minggu lalu" });
  }

  const openShift = async () => {
    await apiFetch("/fnb/pos/shifts", { method: "POST", body: JSON.stringify({ initialCash: Number(shiftCash), cashierId: "DV" }) });
    await loadData();
    setModalOpen(false);
  };

  const closeShift = async () => {
    if (!activeShift) return;
    await apiFetch(`/fnb/pos/shifts/${activeShift.id}/close`, { method: "PATCH", body: JSON.stringify({ finalCashActual: Number(shiftCash), notes: "Closing via portal" }) });
    await loadData();
    setModalOpen(false);
  };

  const processSettlement = async () => {
    if (!selectedOrder) return;
    await apiFetch(`/fnb/pos/orders/${selectedOrder.id}/pay`, { 
      method: "PATCH", 
      body: JSON.stringify({ cashReceived: settlementCash ? Number(settlementCash) : undefined }) 
    });
    setSelectedOrder(null);
    setSettlementCash("");
    await loadData();
  };

  const handleFollowUp = async () => {
    if (!selectedOrder) return;
    const newStatus = selectedOrder.followUpStatus === 'PENDING' ? 'CONTACTED' : 'CONFIRMED';
    await apiFetch(`/fnb/pos/orders/${selectedOrder.id}/follow-up`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus })
    });
    setSelectedOrder(null);
    await loadData();
  };

  const handleCancelReservation = async () => {
    if (!selectedOrder) return;
    if (!window.confirm(`Yakin ingin membatalkan reservasi ini?\nJika dibatalkan, kebijakan refund DP tenant akan otomatis diterapkan (sesuai config).`)) return;
    await apiFetch(`/fnb/pos/orders/${selectedOrder.id}/cancel`, {
      method: "PATCH"
    }).catch((e) => alert(e.message || "Gagal membatalkan pesanan."));
    setSelectedOrder(null);
    await loadData();
  };

  return (
    <div className="min-h-full space-y-4 bg-[#fffaf5] p-3 pb-4 sm:p-5 lg:p-6">
      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">{meta.eyebrow}</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-3xl">{meta.title}</h1>
            <p className="mt-1 max-w-3xl text-xs font-bold leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">{subIndustryName} - {meta.caption}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadData} type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-black text-[#172033] sm:h-11 sm:text-sm">
              <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            {moduleKey === "shift-closing" ? (
              <button onClick={() => setModalOpen(true)} type="button" className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 text-xs font-black text-[var(--portal-on-primary)] sm:h-11 sm:text-sm">
                <Plus className="h-4 w-4" /> {activeShift ? "Tutup shift" : "Buka shift"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[18px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">
          {error}
        </div>
      ) : null}

      <div className={`grid gap-2 lg:gap-4 ${kpis.length === 4 ? "grid-cols-2 lg:grid-cols-4" : kpis.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-3"}`}>
        {kpis.map(({ label, value, icon: Icon, delta, caption }) => (
          <article key={label} className="relative min-h-[90px] lg:min-h-[150px] rounded-[16px] lg:rounded-[24px] border border-slate-100 bg-white p-3 lg:p-6 shadow-sm">
            <p className="text-[9px] sm:text-[11px] lg:text-sm font-black text-slate-500 line-clamp-1 pr-6 lg:pr-0">{label}</p>
            <span className="absolute right-2.5 top-2.5 lg:right-5 lg:top-5 grid h-6 w-6 lg:h-11 lg:w-11 place-items-center rounded-[8px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <Icon className="h-3 w-3 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-3 sm:mt-5 lg:mt-8 text-base sm:text-lg lg:text-3xl font-black text-[#07142d] truncate">{value}</p>
            <div className="mt-1.5 sm:mt-2 lg:mt-3 flex flex-wrap items-center gap-1 lg:gap-2">
              <span className={`rounded-full px-1.5 py-0.5 lg:px-3 lg:py-1 text-[8px] lg:text-xs font-black ${String(delta).startsWith("-") ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="text-[8px] lg:text-xs font-bold text-slate-400 hidden lg:inline">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[16px] border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[24px] sm:p-5">
        <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_160px_130px]">
          <div className="flex h-11 items-center gap-2 rounded-[16px] border border-slate-200 bg-white px-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari data..." className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400 min-w-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:contents">
            <RoundedSelect value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="w-full text-xs sm:text-sm">
              <option value="all">Semua status</option>
              <option value="aktif">Aktif</option>
            <option value="paid">Paid</option>
            <option value="open">Open</option>
          </RoundedSelect>
          <RoundedSelect value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="w-full text-xs sm:text-sm">
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size} / halaman</option>)}
          </RoundedSelect>
          </div>
        </div>
        <div className="overflow-hidden rounded-[14px] border border-slate-100 sm:rounded-[18px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full text-left text-xs sm:min-w-[760px] sm:text-sm lg:min-w-[860px]">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
                <tr>{headers.map((header) => <th key={header} className="px-3 py-3 sm:px-5 sm:py-4">{header}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagination.rows.map((row: any) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-slate-50 ${moduleKey === "order-history" && row.meta?.paymentStatus === 'UNPAID' ? 'cursor-pointer hover:bg-orange-50' : ''}`}
                    onClick={() => {
                      if (moduleKey === "order-history" && row.meta?.paymentStatus === 'UNPAID') {
                        setSelectedOrder(row.meta);
                      }
                    }}
                  >
                    {row.cells.map((cell: any, index: number) => (
                      <td key={`${row.id}-${index}`} className={`px-3 py-3 sm:px-5 sm:py-4 ${index === 0 ? "font-black text-[#172033]" : "font-bold text-slate-600"}`}>
                        {cell === 'Belum Lunas' ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                            {cell}
                          </span>
                        ) : cell === 'Lunas' ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
                            {cell}
                          </span>
                        ) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 ? <div className="p-8 text-center text-sm font-black text-slate-500">Data belum tersedia untuk filter ini.</div> : null}
          <Pagination page={pagination.normalizedPage} totalPages={pagination.totalPages} totalRows={filteredRows.length} pageSize={pageSize} setPage={setPage} />
        </div>
      </section>

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[18px] bg-white p-4 shadow-2xl sm:rounded-[24px] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-[#172033]">Pelunasan Pesanan</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{selectedOrder.invoiceNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} type="button" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                <p className="text-xs font-black text-orange-600 mb-1">Total Tagihan</p>
                <p className="text-xl font-black text-orange-600 sm:text-2xl">{rupiah(selectedOrder.totalAmount)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Metode Pembayaran: {selectedOrder.paymentMethod}</label>
                {selectedOrder.paymentMethod === 'CASH' && (
                  <input 
                    value={settlementCash} 
                    onChange={(event) => setSettlementCash(event.target.value)} 
                    type="number" 
                    className="w-full rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white" 
                    placeholder={`Masukkan nominal uang diterima (Min: ${selectedOrder.totalAmount})`} 
                  />
                )}
              </div>

              {selectedOrder.paymentMethod === 'CASH' && Number(settlementCash) >= selectedOrder.totalAmount && (
                <div className="flex justify-between items-center rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Kembalian:</span>
                  <span className="font-black text-[#172033]">{rupiah(Number(settlementCash) - selectedOrder.totalAmount)}</span>
                </div>
              )}

              {selectedOrder.orderType === 'RESERVATION' && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mb-4">
                  <p className="text-sm font-bold text-blue-800 mb-3">Manajemen Reservasi</p>
                  <p className="text-xs font-medium text-blue-600 mb-3">Status Follow-up: <span className="font-black">{selectedOrder.followUpStatus}</span></p>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleFollowUp}
                      type="button" 
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-black text-white"
                    >
                      {selectedOrder.followUpStatus === 'PENDING' ? 'Tandai Selesai Dihubungi' : 'Ubah ke Confirmed'}
                    </button>
                    <button 
                      onClick={handleCancelReservation}
                      type="button" 
                      className="flex-1 rounded-lg bg-white border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                    >
                      Batalkan Reservasi
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={processSettlement} 
                disabled={selectedOrder.paymentMethod === 'CASH' && Number(settlementCash) < selectedOrder.totalAmount}
                type="button" 
                className="min-h-[42px] w-full rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] disabled:opacity-50 sm:py-3"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      ) : modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[18px] bg-white p-4 shadow-2xl sm:rounded-[24px] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-[#172033]">{moduleKey === "shift-closing" ? "Shift kasir" : "Tambah promo"}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{meta.title}</p>
              </div>
              <button onClick={() => setModalOpen(false)} type="button" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            {moduleKey === "shift-closing" ? (
              <div className="space-y-4">
                <input value={shiftCash} onChange={(event) => setShiftCash(event.target.value)} type="number" className="w-full rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none" placeholder={activeShift ? "Cash aktual closing" : "Modal awal shift"} />
                <button onClick={activeShift ? closeShift : openShift} type="button" className="min-h-[42px] w-full rounded-full bg-[var(--portal-primary)] px-5 py-2.5 text-sm font-black text-[var(--portal-on-primary)] sm:py-3">{activeShift ? "Simpan closing" : "Buka shift"}</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
