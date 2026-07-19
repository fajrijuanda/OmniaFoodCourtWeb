import React, { useMemo, useState } from "react";
import { useInventoryStore } from "../store/useInventoryStore";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, History, Search } from "lucide-react";
import { RoundedSelect } from "@/components/portal/ui";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

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
      <span>
        Menampilkan {start}-{end} dari {totalRows} log
      </span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-16 text-center">{page} / {totalPages}</span>
        <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 disabled:opacity-40">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function StockLogTable() {
  const { stockLogs, ingredients } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [movementFilter, setMovementFilter] = useState<"all" | "IN" | "OUT">("all");
  const [reasonFilter, setReasonFilter] = useState<"all" | "SALES" | "PURCHASE" | "ADJUSTMENT" | "WASTE">("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return stockLogs.filter((log) => {
      const ingredient = ingredients.find((item) => item.id === log.ingredientId);
      const queryMatch = (ingredient?.name.toLowerCase() ?? "").includes(query) || log.reason.toLowerCase().includes(query);
      const movementMatch = movementFilter === "all" || log.movementType === movementFilter;
      const reasonMatch = reasonFilter === "all" || log.reason === reasonFilter;
      return queryMatch && movementMatch && reasonMatch;
    });
  }, [ingredients, movementFilter, reasonFilter, searchQuery, stockLogs]);

  const pagination = paginate(rows, page, pageSize);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500">
            <History className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--portal-primary)]">Stock movement</p>
            <h2 className="mt-1 text-xl font-black text-[#172033]">Riwayat Stok</h2>
            <p className="text-sm font-bold text-slate-500">{rows.length} catatan sesuai filter.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(220px,1fr)_120px_150px_120px] sm:gap-3 lg:w-[720px]">
          <div className="col-span-2 flex h-11 items-center gap-2 rounded-[16px] border border-slate-200 bg-white px-3 shadow-sm sm:col-span-1">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari bahan atau alasan..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
            />
          </div>
          <RoundedSelect
            value={movementFilter}
            onChange={(event) => {
              setMovementFilter(event.target.value as typeof movementFilter);
              setPage(1);
            }}
            className="min-w-0 col-span-1 text-xs lg:text-sm"
          >
            <option value="all">Semua tipe</option>
            <option value="IN">Masuk</option>
            <option value="OUT">Keluar</option>
          </RoundedSelect>
          <RoundedSelect
            value={reasonFilter}
            onChange={(event) => {
              setReasonFilter(event.target.value as typeof reasonFilter);
              setPage(1);
            }}
            className="min-w-0 col-span-1 text-xs lg:text-sm"
          >
            <option value="all">Semua alasan</option>
            <option value="SALES">Sales</option>
            <option value="PURCHASE">Purchase</option>
            <option value="ADJUSTMENT">Adjustment</option>
            <option value="WASTE">Waste</option>
          </RoundedSelect>
          <RoundedSelect
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="min-w-0 col-span-2 sm:col-span-1 text-xs lg:text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size} / halaman</option>
            ))}
          </RoundedSelect>
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-sm sm:rounded-[20px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs sm:min-w-[900px] sm:text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Waktu</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Bahan Baku</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Tipe</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4">Alasan</th>
                <th className="px-3 py-3 text-right sm:px-6 sm:py-4">Perubahan</th>
                <th className="px-3 py-3 text-right sm:px-6 sm:py-4">Stok Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagination.rows.map((log) => {
                const ingredient = ingredients.find((i) => i.id === log.ingredientId);
                const isOut = log.movementType === "OUT";
                
                return (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-bold text-slate-500 sm:px-6 sm:py-4">
                      {new Date(log.createdAt).toLocaleString("id-ID", { 
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" 
                      })}
                    </td>
                    <td className="px-3 py-3 font-black text-[#172033] sm:px-6 sm:py-4">
                      {ingredient?.name || "Unknown"}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${
                        isOut ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {isOut ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {log.movementType}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-600 sm:px-6 sm:py-4">
                      {log.reason}
                    </td>
                    <td className="px-3 py-3 text-right font-black text-[#172033] sm:px-6 sm:py-4">
                      <span className={isOut ? "text-rose-600" : "text-emerald-600"}>
                        {log.changeAmount > 0 ? "+" : ""}{log.changeAmount} {ingredient?.unit}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-slate-500 sm:px-6 sm:py-4">
                      {log.finalStock} {ingredient?.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="p-8 text-center font-bold text-slate-500">Belum ada riwayat pergerakan stok.</div>
        )}
        <Pagination page={pagination.normalizedPage} totalPages={pagination.totalPages} totalRows={rows.length} pageSize={pageSize} setPage={setPage} />
      </div>
    </div>
  );
}
