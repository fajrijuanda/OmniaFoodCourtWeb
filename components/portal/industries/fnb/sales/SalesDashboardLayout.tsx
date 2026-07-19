"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarDays, CreditCard, RefreshCcw, ReceiptText, TrendingUp, WalletCards } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RoundedSelect } from "@/components/portal/ui";

type SalesRow = {
  id: string;
  time: string;
  customer: string;
  channel: string;
  payment: string;
  items: number;
  total: number;
  status: string;
};

type PosOrder = {
  id: string;
  invoiceNumber: string;
  status: string;
  paymentStatus?: string;
  totalAmount: number;
  paymentMethod: string;
  orderType?: string;
  customerName?: string | null;
  createdAt: string;
  items: Array<{ quantity: number; priceAtSale: number; product?: { name: string } }>;
};

function formatCurrency(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function SalesDashboardLayout({ subIndustryName }: { subIndustryName: string }) {
  const [orders, setOrders] = useState<PosOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("today");
  const [channel, setChannel] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const loadOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      setOrders(await apiFetch<PosOrder[]>("/fnb/pos/orders"));
    } catch (event) {
      setError(event instanceof Error ? event.message : "Gagal memuat sales dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const salesRows = useMemo<SalesRow[]>(() => orders.map((order) => ({
    id: order.invoiceNumber,
    time: new Date(order.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    customer: order.customerName || (order.orderType === "DINE_IN" ? "Dine-in" : order.orderType === "TAKEAWAY" ? "Takeaway" : "Customer"),
    channel: order.orderType === "DELIVERY" ? "Delivery" : order.orderType === "TAKEAWAY" ? "Takeaway" : "Dine-in",
    payment: order.paymentMethod,
    items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: order.totalAmount,
    status: order.paymentStatus === "PAID" || order.status === "PAID" ? "Paid" : order.status,
  })), [orders]);

  const topMenus = useMemo<Array<[string, number, number]>>(() => {
    const map = new Map<string, { qty: number; total: number }>();
    orders.forEach((order) => order.items.forEach((item) => {
      const name = item.product?.name ?? "Menu";
      const row = map.get(name) ?? { qty: 0, total: 0 };
      row.qty += item.quantity;
      row.total += item.priceAtSale * item.quantity;
      map.set(name, row);
    }));
    return [...map.entries()]
      .map(([name, value]): [string, number, number] => [name, value.qty, value.total])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  const dailyChart = useMemo<Array<[string, number]>>(() => {
    const map = new Map<string, number>();
    orders.forEach((order) => {
      const key = new Date(order.createdAt).toLocaleDateString("id-ID", { weekday: "short" });
      map.set(key, (map.get(key) ?? 0) + order.totalAmount);
    });
    return [...map.entries()];
  }, [orders]);

  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return salesRows.filter((row) => {
      const channelMatch = channel === "all" || row.channel.toLowerCase() === channel;
      const keywordMatch = !keyword || `${row.id} ${row.customer} ${row.payment} ${row.channel}`.toLowerCase().includes(keyword);
      return channelMatch && keywordMatch;
    });
  }, [channel, query]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const revenue = filteredRows.reduce((sum, row) => sum + row.total, 0);
  const transactions = filteredRows.length;
  const itemCount = filteredRows.reduce((sum, row) => sum + row.items, 0);
  const averageBasket = transactions > 0 ? Math.round(revenue / transactions) : 0;
  const maxChartValue = Math.max(1, ...dailyChart.map(([, value]) => Number(value)));

  const stats = [
    { label: "Omset", value: formatCurrency(revenue), delta: "+15%", caption: "vs minggu lalu", icon: WalletCards },
    { label: "Transaksi", value: String(transactions), delta: "+8 order", caption: "vs minggu lalu", icon: ReceiptText },
    { label: "Item terjual", value: String(itemCount), delta: "+12 item", caption: "vs minggu lalu", icon: BarChart3 },
    { label: "Avg basket", value: formatCurrency(averageBasket), delta: "+2.4%", caption: "vs minggu lalu", icon: TrendingUp },
  ];

  return (
    <div className="min-h-full space-y-5 bg-[#fffaf5] p-4 sm:p-5 lg:p-6">
      <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Sales dashboard</p>
            <h1 className="mt-2 text-2xl font-black text-[#172033] sm:text-3xl">Laporan Penjualan {subIndustryName}</h1>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-500">
              Ringkasan performa penjualan, metode pembayaran, menu terlaris, dan riwayat transaksi POS.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <RoundedSelect value={period} onChange={(event) => setPeriod(event.target.value)} className="w-full sm:w-40 text-sm">
              <option value="today">Hari ini</option>
              <option value="week">7 hari</option>
              <option value="month">Bulan ini</option>
            </RoundedSelect>
            <button onClick={loadOrders} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600" type="button">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-[18px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">{error}</div> : null}

      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, delta, caption, icon: Icon }) => (
          <article key={label} className="relative min-h-[110px] lg:min-h-[150px] min-w-0 rounded-[20px] lg:rounded-[24px] border border-slate-100 bg-white p-4 lg:p-6 shadow-sm overflow-hidden">
            <p className="text-[11px] lg:text-sm font-black text-slate-500">{label}</p>
            <span className="absolute right-4 top-4 lg:right-5 lg:top-5 grid h-9 w-9 lg:h-11 lg:w-11 place-items-center rounded-[12px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-5 lg:mt-8 text-xl lg:text-3xl font-black text-[#07142d] truncate">{value}</p>
            <div className="mt-2 lg:mt-3 flex items-center gap-1.5 lg:gap-2">
              <span className={`shrink-0 rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[9px] lg:text-xs font-black ${String(delta).startsWith("-") ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="truncate text-[9px] lg:text-xs font-bold text-slate-400">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[20px] sm:rounded-[24px] border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#172033]">Trend omset</h2>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-500">Performa harian minggu ini.</p>
            </div>
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--portal-primary)]" />
          </div>
          <div className="mt-4 sm:mt-5 flex h-48 sm:h-72 items-end gap-2 sm:gap-3">
            {dailyChart.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm font-black text-slate-400">{isLoading ? "Memuat trend..." : "Belum ada transaksi."}</div>
            ) : dailyChart.map(([label, value]) => (
              <div key={label as string} className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:gap-2">
                <div className="flex h-36 sm:h-56 w-full items-end rounded-t-[14px] sm:rounded-t-[18px] bg-slate-50 px-1 sm:px-2">
                  <div
                    className="w-full rounded-t-[14px] bg-[var(--portal-primary)] shadow-[0_12px_30px_var(--portal-primary-soft)]"
                    style={{ height: `${Math.max(14, (Number(value) / maxChartValue) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-slate-500">{label as string}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] sm:rounded-[24px] border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <h2 className="text-lg sm:text-xl font-black text-[#172033]">Menu terlaris</h2>
            <p className="mt-1 text-xs sm:text-sm font-bold text-slate-500">Berdasarkan jumlah item terjual.</p>
          </div>
          <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
            {topMenus.length === 0 ? <p className="rounded-[16px] bg-slate-50 p-4 text-sm font-black text-slate-400">Belum ada menu terjual.</p> : topMenus.map(([name, qty, total], index) => (
              <div key={name as string} className="flex items-center gap-2 sm:gap-3 rounded-[16px] sm:rounded-[18px] border border-slate-100 bg-slate-50 p-3 sm:p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-[var(--portal-primary)]">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#172033]">{name as string}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{qty as number} item</p>
                </div>
                <p className="text-sm font-black text-[#172033]">{formatCurrency(total as number)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[20px] sm:rounded-[24px] border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-3 sm:pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#172033]">Riwayat transaksi</h2>
            <p className="mt-1 text-xs sm:text-sm font-bold text-slate-500">{filteredRows.length} transaksi sesuai filter.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-2.5 sm:py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white"
              placeholder="Cari invoice..."
            />
            <RoundedSelect value={channel} onChange={(event) => { setChannel(event.target.value); setPage(1); }} className="w-full text-sm">
              <option value="all">Semua channel</option>
              <option value="dine-in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </RoundedSelect>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-[18px] border border-slate-100">
          <div className="hidden grid-cols-[1fr_0.7fr_0.7fr_0.6fr_0.7fr_0.5fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:grid">
            <span>Invoice</span><span>Customer</span><span>Channel</span><span>Payment</span><span>Total</span><span>Status</span>
          </div>
          {paginatedRows.length === 0 ? <div className="p-6 text-center text-sm font-black text-slate-400">{isLoading ? "Memuat transaksi..." : "Belum ada transaksi."}</div> : paginatedRows.map((row) => (
            <div key={row.id} className="flex flex-col gap-3 border-t border-slate-100 p-4 lg:grid lg:grid-cols-[1fr_0.7fr_0.7fr_0.6fr_0.7fr_0.5fr] lg:items-center lg:gap-2">
              <div className="flex justify-between items-start lg:block">
                <div>
                  <p className="font-black text-[#172033] text-sm sm:text-base">{row.id}</p>
                  <p className="mt-1 text-[10px] sm:text-xs font-bold text-slate-500">{row.time} - {row.items} item</p>
                </div>
                <div className="lg:hidden text-right">
                  <p className="text-sm font-black text-[#172033]">{formatCurrency(row.total)}</p>
                  <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${row.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>{row.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:contents">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 lg:hidden mb-1">Customer</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 line-clamp-1">{row.customer}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 lg:hidden mb-1">Channel</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">{row.channel}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 lg:hidden mb-1">Payment</p>
                  <p className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-50 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-black text-slate-600">
                    <CreditCard className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {row.payment}
                  </p>
                </div>
              </div>
              <p className="hidden lg:block text-sm font-black text-[#172033]">{formatCurrency(row.total)}</p>
              <div className="hidden lg:block">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider ${row.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>{row.status}</span>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-[14px] border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-50"
              type="button"
            >
              Sebelumnya
            </button>
            <p className="text-sm font-bold text-slate-500">
              Hal {page} dari {totalPages}
            </p>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="rounded-[14px] border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-50"
              type="button"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
