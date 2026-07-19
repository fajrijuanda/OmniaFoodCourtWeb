import React, { useMemo, useState } from "react";
import { useInventoryStore } from "../store/useInventoryStore";
import { mockProducts } from "../pos/posMockData";
import { TableToolbar, Pagination, EmptyTable } from "../menu/components/PosMenuTables";
import { RoundedSelect } from "@/components/portal/ui";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const start = (normalizedPage - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), totalPages, normalizedPage };
}

export function RecipeList() {
  const { recipes, ingredients } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeFilter, setRecipeFilter] = useState<"all" | "complete" | "empty">("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return recipes
      .map((recipe) => {
        const product = mockProducts.find((item) => item.id === recipe.productId);
        const recipeIngredients = recipe.items
          .map((item) => {
            const ingredient = ingredients.find((ingredientItem) => ingredientItem.id === item.ingredientId);
            return ingredient ? { ...item, ingredient } : null;
          })
          .filter(Boolean);
        return { recipe, product, recipeIngredients };
      })
      .filter((row) => {
        if (!row.product) return false;
        const ingredientNames = row.recipeIngredients.map((item) => item?.ingredient.name.toLowerCase()).join(" ");
        const queryMatch = row.product.name.toLowerCase().includes(query) || ingredientNames.includes(query);
        const statusMatch = recipeFilter === "all" || (recipeFilter === "complete" ? row.recipeIngredients.length > 0 : row.recipeIngredients.length === 0);
        return queryMatch && statusMatch;
      });
  }, [ingredients, recipeFilter, recipes, searchQuery]);

  const pagination = paginate(rows, page, pageSize);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--portal-primary)]">Bill of materials</p>
          <h2 className="mt-2 text-xl font-black text-[#172033]">Buku Resep</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{rows.length} resep sesuai filter.</p>
        </div>
      </div>

      <TableToolbar query={searchQuery} setQuery={(q) => { setSearchQuery(q); setPage(1); }} pageSize={pageSize} setPageSize={(s) => { setPageSize(s); setPage(1); }}>
        <RoundedSelect
          value={recipeFilter}
          onChange={(event) => {
            setRecipeFilter(event.target.value as typeof recipeFilter);
            setPage(1);
          }}
          className="min-w-0 flex-1 sm:flex-none text-xs"
        >
          <option value="all">Semua resep</option>
          <option value="complete">Ada bahan</option>
          <option value="empty">Belum lengkap</option>
        </RoundedSelect>
      </TableToolbar>

      <div className="overflow-hidden rounded-[14px] border border-slate-100 bg-white sm:rounded-[18px]">
        <div className="hidden grid-cols-[1.5fr_0.8fr_1.5fr_0.8fr_0.8fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:grid">
          <span>Menu</span><span>Harga</span><span>Bahan Digunakan</span><span>Jumlah Bahan</span><span>Status</span>
        </div>
        {pagination.rows.map((row) => (
          <div key={row.recipe.id} className="grid gap-2 border-t border-slate-100 p-3 lg:grid-cols-[1.5fr_0.8fr_1.5fr_0.8fr_0.8fr] lg:items-center lg:p-4 hover:bg-slate-50 transition">
            <div>
              <span className="mb-1 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 lg:hidden">Menu</span>
              <p className="font-black text-[#172033]">{row.product?.name}</p>
            </div>
            <div className="text-sm font-bold text-slate-600">
              <span className="mr-2 inline-block text-[10px] font-black uppercase text-slate-400 lg:hidden">Harga:</span>
              Rp{row.product?.price.toLocaleString("id-ID")}
            </div>
            <div className="text-sm font-bold text-slate-600">
              <span className="mr-2 block text-[10px] font-black uppercase text-slate-400 lg:hidden">Bahan Digunakan:</span>
              <div className="flex flex-wrap gap-2 mt-1 lg:mt-0">
                {row.recipeIngredients.length > 0 ? row.recipeIngredients.map((item) => (
                  <span key={item?.ingredientId} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] sm:text-xs font-black text-slate-600">
                    {item?.ingredient.name}: {item?.quantityRequired} {item?.ingredient.unit}
                  </span>
                )) : <span className="text-sm font-bold text-slate-400">Belum ada bahan</span>}
              </div>
            </div>
            <div className="text-sm font-black text-[#172033]">
              <span className="mr-2 inline-block text-[10px] font-black uppercase text-slate-400 lg:hidden">Jumlah Bahan:</span>
              {row.recipeIngredients.length}
            </div>
            <div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-black ${row.recipeIngredients.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {row.recipeIngredients.length > 0 ? "Lengkap" : "Belum lengkap"}
              </span>
            </div>
          </div>
        ))}
        {rows.length === 0 && <EmptyTable />}
      </div>

      <Pagination page={pagination.normalizedPage} totalPages={pagination.totalPages} totalRows={rows.length} pageSize={pageSize} setPage={setPage} />
    </div>
  );
}
