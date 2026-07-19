import React, { useState, useEffect } from "react";
import { IngredientList } from "./IngredientList";
import { RecipeList } from "./RecipeList";
import { StockLogTable } from "./StockLogTable";
import { HppCalculator } from "./HppCalculator";
import { Package, Calculator, BookOpen, ClipboardList, RefreshCcw, Boxes, AlertCircle, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";

type ActiveTab = "ingredients" | "hpp" | "recipes" | "logs";

export function InventoryLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ingredients");
  const [ingredientsCount, setIngredientsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [recipesCount, setRecipesCount] = useState(0);
  const [logsCount, setLogsCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const [ingredients, logs, catalog] = await Promise.all([
        apiFetch<any[]>("/fnb/pos/ingredients").catch(() => []),
        apiFetch<any[]>("/fnb/pos/stock-logs").catch(() => []),
        apiFetch<any>("/fnb/pos/catalog?scope=management").catch(() => ({ products: [] })),
      ]);
      setIngredientsCount(ingredients.length);
      setLowStockCount(ingredients.filter((i: any) => i.currentStock <= i.minStockAlert).length);
      setRecipesCount(catalog.products?.filter((p: any) => p.recipe != null).length || 0);
      setLogsCount(logs.length);
    } catch {
      // ignore
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-full space-y-4 bg-[#fffaf5] p-3 pb-4 sm:p-5 lg:p-6">
      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Inventory settings</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-3xl">Inventory & Stok</h1>
            <p className="mt-1 max-w-2xl text-xs font-bold leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Kelola bahan baku, resep menu, dan pergerakan stok untuk memantau HPP dan profitabilitas.
            </p>
          </div>
          <button onClick={loadStats} disabled={isLoadingStats} className="inline-flex min-h-[40px] w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 sm:px-5 sm:py-3 sm:text-sm" type="button">
            <RefreshCcw className={`h-4 w-4 ${isLoadingStats ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {([
          ["Total Bahan", ingredientsCount, Boxes, "Aktif", "dalam sistem"],
          ["Stok Menipis", lowStockCount, AlertCircle, lowStockCount > 0 ? "Perhatian" : "Aman", "butuh restock"],
          ["Menu Beresep", recipesCount, BookOpen, "Terkait", "dengan HPP"],
          ["Log Pergerakan", logsCount, TrendingDown, "Tercatat", "dalam sistem"],
        ] as Array<[string, number, LucideIcon, string, string]>).map(([label, value, Icon, delta, caption]) => (
          <article key={label} className="relative min-h-[110px] lg:min-h-[150px] rounded-[20px] lg:rounded-[24px] border border-slate-100 bg-white p-4 lg:p-6 shadow-sm">
            <p className="text-[11px] lg:text-sm font-black text-slate-500">{label}</p>
            <span className="absolute right-4 top-4 lg:right-5 lg:top-5 grid h-9 w-9 lg:h-11 lg:w-11 place-items-center rounded-[12px] lg:rounded-[14px] bg-[var(--portal-primary-soft)] text-[var(--portal-primary)]">
              <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
            </span>
            <p className="mt-5 lg:mt-8 text-2xl lg:text-3xl font-black text-[#07142d]">{value}</p>
            <div className="mt-2 lg:mt-3 flex items-center gap-1.5 lg:gap-2">
              <span className={`rounded-full px-2 py-0.5 lg:px-3 lg:py-1 text-[9px] lg:text-xs font-black ${String(delta) === "Perhatian" ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"}`}>
                {delta}
              </span>
              <span className="text-[9px] lg:text-xs font-bold text-slate-400">{caption}</span>
            </div>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-sm sm:rounded-[24px]">
        <div className="grid lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-slate-100 bg-slate-50/70 p-3 lg:border-b-0 lg:border-r">
            <div className="-mx-3 flex touch-pan-x gap-2 overflow-x-auto px-3 pb-2 no-scrollbar sm:pb-0 lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none">
              {[
                { id: "ingredients" as ActiveTab, label: "Bahan Baku", caption: "Kelola item bahan", icon: Package },
                { id: "hpp" as ActiveTab, label: "Hitung HPP", caption: "Simulasi modal", icon: Calculator },
                { id: "recipes" as ActiveTab, label: "Buku Resep", caption: "Komposisi menu", icon: BookOpen },
                { id: "logs" as ActiveTab, label: "Riwayat Stok", caption: "Pergerakan barang", icon: ClipboardList },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 min-w-[150px] lg:min-w-0 min-h-[64px] items-center gap-2 rounded-[14px] border p-2.5 text-left transition sm:min-h-[78px] sm:gap-3 sm:rounded-[18px] sm:p-3 ${
                    activeTab === item.id ? "border-[var(--portal-primary)] bg-white shadow-sm" : "border-transparent bg-white sm:bg-white/60 hover:bg-white"
                  }`}
                  type="button"
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[12px] sm:h-11 sm:w-11 sm:rounded-[14px] ${activeTab === item.id ? "bg-[var(--portal-primary)] text-white" : "bg-slate-100 text-slate-500"}`}>
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black text-[#172033] sm:text-sm">{item.label}</span>
                    <span className="mt-0.5 block text-xs font-bold text-slate-500">{item.caption}</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 p-2.5 sm:p-5">
            {activeTab === "ingredients" && <IngredientList />}
            {activeTab === "recipes" && <RecipeList />}
            {activeTab === "hpp" && <HppCalculator />}
            {activeTab === "logs" && <StockLogTable />}
          </div>
        </div>
      </section>
    </div>
  );
}
