"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calculator, ChevronLeft, ChevronRight, RefreshCcw, Search, TrendingUp } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { RoundedSelect } from "@/components/portal/ui";

type Ingredient = {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
  costPerUnit: number;
};

type Product = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  isAvailable?: boolean;
  recipe?: {
    id: string;
    items: Array<{ ingredientId: string; quantityRequired: number }>;
  } | null;
};

type Catalog = {
  products: Product[];
  categories: Array<{ id: string; name: string }>;
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

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
      <span>Menampilkan {start}-{end} dari {totalRows} menu</span>
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

export function HppCalculator() {
  const [catalog, setCatalog] = useState<Catalog>({ products: [], categories: [] });
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "warning" | "missing">("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextCatalog, nextIngredients] = await Promise.all([
        apiFetch<Catalog>("/fnb/pos/catalog?scope=management"),
        apiFetch<Ingredient[]>("/fnb/pos/ingredients"),
      ]);
      setCatalog(nextCatalog);
      setIngredients(nextIngredients);
    } catch (event) {
      setError(event instanceof Error ? event.message : "Gagal memuat data HPP dari backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ingredientById = useMemo(() => new Map(ingredients.map((item) => [item.id, item])), [ingredients]);

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return catalog.products
      .map((product) => {
        const recipeItems = product.recipe?.items ?? [];
        const itemCosts = recipeItems.map((item) => {
          const ingredient = ingredientById.get(item.ingredientId);
          const cost = (ingredient?.costPerUnit ?? 0) * item.quantityRequired;
          return { ...item, ingredient, cost };
        });
        const hpp = itemCosts.reduce((sum, item) => sum + item.cost, 0);
        const margin = product.price - hpp;
        const foodCostPercent = product.price > 0 ? (hpp / product.price) * 100 : 0;
        const missingCost = itemCosts.some((item) => !item.ingredient || item.ingredient.costPerUnit <= 0);
        const status = recipeItems.length === 0 || missingCost ? "missing" : foodCostPercent > 45 ? "warning" : "healthy";

        return { product, itemCosts, hpp, margin, foodCostPercent, status };
      })
      .filter((row) => {
        const ingredientsText = row.itemCosts.map((item) => item.ingredient?.name ?? "").join(" ").toLowerCase();
        const queryMatch = row.product.name.toLowerCase().includes(normalizedQuery) || ingredientsText.includes(normalizedQuery);
        const statusMatch = statusFilter === "all" || row.status === statusFilter;
        return queryMatch && statusMatch;
      });
  }, [catalog.products, ingredientById, query, statusFilter]);

  const summary = useMemo(() => {
    const completeRows = rows.filter((row) => row.status !== "missing");
    const avgFoodCost = completeRows.reduce((sum, row) => sum + row.foodCostPercent, 0) / Math.max(1, completeRows.length);
    const avgMargin = completeRows.reduce((sum, row) => sum + row.margin, 0) / Math.max(1, completeRows.length);
    return {
      totalMenu: rows.length,
      completeMenu: completeRows.length,
      warningMenu: rows.filter((row) => row.status === "warning").length,
      avgFoodCost,
      avgMargin,
    };
  }, [rows]);

  const pagination = paginate(rows, page, pageSize);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--portal-primary)]">COGS calculator</p>
          <h2 className="mt-2 text-xl font-black text-[#172033]">Kalkulator HPP Menu</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">Hitung HPP dari resep menu dan biaya bahan per satuan.</p>
        </div>
        <button onClick={loadData} type="button" className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-[#172033]">
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-5 rounded-[18px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600">{error}</div>
      ) : null}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Menu terhitung", value: `${summary.completeMenu}/${summary.totalMenu}`, icon: Calculator, delta: "+5 resep", caption: "bulan ini" },
          { label: "Rata-rata food cost", value: `${summary.avgFoodCost.toFixed(1)}%`, icon: TrendingUp, delta: "+12.4%", caption: "vs bulan lalu" },
          { label: "Rata-rata margin", value: rupiah(summary.avgMargin), icon: TrendingUp, delta: "+2.1%", caption: "vs bulan lalu" },
          { label: "Perlu review", value: String(summary.warningMenu), icon: AlertTriangle, delta: "-2 menu", caption: "bulan ini" },
        ].map(({ label, value, icon: Icon, delta, caption }) => (
          <article key={label} className="relative min-h-[110px] lg:min-h-[150px] rounded-[20px] lg:rounded-[24px] border border-slate-100 bg-white p-4 lg:p-6 shadow-sm">
            <p className="text-[11px] lg:text-sm font-black text-slate-500">{label}</p>
            <span className="absolute right-4 top-4 lg:right-5 lg:top-5 grid h-9 w-9 lg:h-11 lg:w-11 place-items-center rounded-[12px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-5 lg:mt-8 text-2xl lg:text-3xl font-black text-[#07142d]">{value}</p>
            <div className="mt-2 lg:mt-3 flex items-center gap-1.5 lg:gap-2">
              <span className={`rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[9px] lg:text-xs font-black ${String(delta).startsWith("-") ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="text-[9px] lg:text-xs font-bold text-slate-400">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-[1fr_180px_130px]">
        <div className="col-span-2 flex h-11 items-center gap-2 rounded-[16px] border border-slate-200 bg-white px-3 shadow-sm sm:col-span-3 lg:col-span-1">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari menu atau bahan..."
            className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
          />
        </div>
          <RoundedSelect
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="min-w-0 col-span-1 text-xs lg:text-sm"
          ><option value="all">Semua status</option>
          <option value="healthy">Margin sehat</option>
          <option value="warning">Food cost tinggi</option>
          <option value="missing">Belum lengkap</option>
        </RoundedSelect>
          <RoundedSelect
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="min-w-0 col-span-1 text-xs lg:text-sm"
          >{PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size} / halaman</option>
          ))}
        </RoundedSelect>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Menu</th>
                <th className="px-5 py-4 text-right">Harga Jual</th>
                <th className="px-5 py-4 text-right">HPP</th>
                <th className="px-5 py-4 text-right">Margin</th>
                <th className="px-5 py-4 text-right">Food Cost</th>
                <th className="px-5 py-4">Komposisi Biaya</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagination.rows.map((row) => (
                <tr key={row.product.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-black text-[#172033]">{row.product.name}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-600">{rupiah(row.product.price)}</td>
                  <td className="px-5 py-4 text-right font-black text-[#172033]">{rupiah(row.hpp)}</td>
                  <td className={`px-5 py-4 text-right font-black ${row.margin < 0 ? "text-rose-600" : "text-emerald-600"}`}>{rupiah(row.margin)}</td>
                  <td className="px-5 py-4 text-right font-black text-[#172033]">{row.foodCostPercent.toFixed(1)}%</td>
                  <td className="px-5 py-4">
                    <div className="flex max-w-md flex-wrap gap-2">
                      {row.itemCosts.length > 0 ? row.itemCosts.map((item) => (
                        <span key={`${row.product.id}-${item.ingredientId}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                          {item.ingredient?.name ?? "Bahan tidak ditemukan"}: {item.quantityRequired} {item.ingredient?.unit ?? ""} = {rupiah(item.cost)}
                        </span>
                      )) : <span className="text-xs font-bold text-slate-400">Belum ada resep</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${
                      row.status === "healthy" ? "bg-emerald-100 text-emerald-700" : row.status === "warning" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {row.status === "healthy" ? "Sehat" : row.status === "warning" ? "Review harga" : "Lengkapi resep/biaya"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? <div className="p-8 text-center font-bold text-slate-500">Data HPP belum tersedia.</div> : null}
        <Pagination page={pagination.normalizedPage} totalPages={pagination.totalPages} totalRows={rows.length} pageSize={pageSize} setPage={setPage} />
      </div>
    </div>
  );
}
