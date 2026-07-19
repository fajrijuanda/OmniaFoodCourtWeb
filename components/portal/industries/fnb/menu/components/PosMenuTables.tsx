"use client";

import type React from "react";
import {
  Edit3, Eye, EyeOff, Filter, Plus, RotateCcw, Star, Trash2
} from "lucide-react";
import type { PosProduct } from "../../store/usePosStore";
import { EmptyState, PaginationControls, PortalButton, RoundedSelect, SearchInput, StatusBadge as PortalStatusBadge } from "@/components/portal/ui";

export type ManagedCategory = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  isActive: boolean;
};

export type ManagedProduct = PosProduct & {
  sortOrder?: number;
  archivedAt?: string | null;
  recipe?: {
    id: string;
    items: Array<{ ingredientId: string; quantityRequired: number }>;
  } | null;
};

export type ManagedIngredient = {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
};

export type CategoryForm = { id?: string; name: string; color: string; sortOrder: string; isActive: boolean };
export type RecipeFormItem = { ingredientId: string; quantityRequired: string };
export type ProductForm = {
  id?: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  sortOrder: string;
  isBestSeller: boolean;
  isAvailable: boolean;
  recipeItems: RecipeFormItem[];
};

export const colorOptions = ["#f97316", "#8b5a2b", "#10b981", "#ef4444", "#0ea5e9", "#7c3aed"];

export function money(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export function TableToolbar({
  query,
  setQuery,
  pageSize,
  setPageSize,
  children,
}: {
  query: string;
  setQuery: (value: string) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 xl:grid-cols-[1fr_auto] xl:items-center">
      <SearchInput value={query} onChange={setQuery} placeholder="Cari data..." className="rounded-[12px] py-2 sm:rounded-[16px] sm:py-3" />
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
        {children}
        <label className="flex min-w-0 flex-1 sm:flex-none items-center justify-between sm:justify-start gap-1.5 rounded-[12px] border border-slate-200 bg-white px-2.5 py-2 text-[10px] font-black text-slate-500 sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0 sm:text-xs">
          <span className="sm:inline">Tampilkan</span>
          <RoundedSelect value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="min-w-0 flex-1 text-[11px] sm:flex-none sm:text-xs">
            {[5, 10, 25].map((size) => <option key={size} value={size}>{size}</option>)}
          </RoundedSelect>
        </label>
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, totalRows, pageSize, setPage }: { page: number; totalPages: number; totalRows: number; pageSize: number; setPage: (value: number) => void }) {
  return <PaginationControls page={page} totalPages={totalPages} totalRows={totalRows} pageSize={pageSize} onPageChange={setPage} />;
}

export function ProductsTable(props: {
  rows: ManagedProduct[];
  totalRows: number;
  page: number;
  totalPages: number;
  pageSize: number;
  setPageSize: (value: number) => void;
  setPage: (value: number) => void;
  query: string;
  setQuery: (value: string) => void;
  status: "all" | "active" | "hidden" | "archived";
  setStatus: (value: "all" | "active" | "hidden" | "archived") => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: ManagedCategory[];
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (product: ManagedProduct) => void;
  onToggle: (product: ManagedProduct) => void;
  onDelete: (product: ManagedProduct) => void;
  onRestore: (product: ManagedProduct) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#172033] sm:text-xl">Menu Jualan</h2>
          <p className="mt-0.5 text-xs font-bold text-slate-500 sm:mt-1 sm:text-sm">Menu aktif di tabel ini langsung tampil di POS.</p>
        </div>
        <PortalButton onClick={props.onCreate} icon={Plus} className="min-h-[36px] w-full text-xs sm:w-fit sm:text-sm">Tambah menu</PortalButton>
      </div>

      <TableToolbar query={props.query} setQuery={props.setQuery} pageSize={props.pageSize} setPageSize={props.setPageSize}>
        <RoundedSelect value={props.status} onChange={(event) => props.setStatus(event.target.value as "all" | "active" | "hidden" | "archived")} className="min-w-0 flex-1 text-[11px] sm:flex-none sm:text-xs">
          <option value="all">Semua status</option>
          <option value="active">Tampil di POS</option>
          <option value="hidden">Disembunyikan</option>
          <option value="archived">Diarsipkan</option>
        </RoundedSelect>
        <RoundedSelect value={props.categoryFilter} onChange={(event) => props.setCategoryFilter(event.target.value)} className="min-w-0 flex-1 text-[11px] sm:flex-none sm:text-xs">
          <option value="all">Semua kategori</option>
          {props.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </RoundedSelect>
      </TableToolbar>

      <div className="overflow-hidden rounded-[14px] border border-slate-100 sm:rounded-[18px]">
        <div className="hidden grid-cols-[1.25fr_0.85fr_0.55fr_0.55fr_0.75fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:grid">
          <span>Menu</span><span>Kategori</span><span>Harga</span><span>Status</span><span>Aksi</span>
        </div>
        {props.rows.map((product) => {
          const category = props.categories.find((item) => item.id === product.categoryId);
          return (
            <div key={product.id} className="grid gap-2 border-t border-slate-100 p-3 lg:grid-cols-[1.25fr_0.85fr_0.55fr_0.55fr_0.75fr] lg:items-center lg:p-4">
              <div>
                <span className="mb-1 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 lg:hidden">Menu</span>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black text-[#172033]">{product.name}</p>
                  {product.isBestSeller ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-600">
                      <Star className="h-3 w-3 fill-current" />
                      Best seller
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-500">{product.description || "Tanpa deskripsi"}</p>
              </div>
              <div className="text-sm font-bold text-slate-600">{category?.name ?? "Tanpa kategori"}</div>
              <div className="text-sm font-black text-[#172033]">{money(product.price)}</div>
              <div>
                {product.archivedAt ? (
                  <PortalStatusBadge status="Diarsipkan" tone="rose" />
                ) : (
                  <StatusBadge active={product.isAvailable} activeText="Tampil" inactiveText="Hidden" />
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.archivedAt ? (
                  <PortalButton onClick={() => props.onRestore(product)} icon={RotateCcw} variant="secondary" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">Pulihkan</PortalButton>
                ) : (
                  <>
                    <PortalButton onClick={() => props.onEdit(product)} icon={Edit3} variant="secondary" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">Edit</PortalButton>
                    <PortalButton onClick={() => props.onToggle(product)} icon={product.isAvailable ? EyeOff : Eye} variant="secondary" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">{product.isAvailable ? "Hide" : "Show"}</PortalButton>
                    <PortalButton onClick={() => props.onDelete(product)} icon={Trash2} variant="danger" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">Hapus</PortalButton>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {!props.isLoading && props.rows.length === 0 ? <EmptyTable /> : null}
      </div>

      <Pagination page={props.page} totalPages={props.totalPages} totalRows={props.totalRows} pageSize={props.pageSize} setPage={props.setPage} />
    </div>
  );
}

export function CategoriesTable(props: {
  rows: ManagedCategory[];
  totalRows: number;
  page: number;
  totalPages: number;
  pageSize: number;
  setPageSize: (value: number) => void;
  setPage: (value: number) => void;
  query: string;
  setQuery: (value: string) => void;
  status: "all" | "active" | "hidden";
  setStatus: (value: "all" | "active" | "hidden") => void;
  isLoading: boolean;
  onCreate: () => void;
  onEdit: (category: ManagedCategory) => void;
  onToggle: (category: ManagedCategory) => void;
  onDelete: (category: ManagedCategory) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-[#172033] sm:text-xl">Kategori POS</h2>
          <p className="mt-0.5 text-xs font-bold text-slate-500 sm:mt-1 sm:text-sm">Kategori aktif menjadi tab/filter kategori di halaman POS.</p>
        </div>
        <PortalButton onClick={props.onCreate} icon={Plus} className="min-h-[36px] w-full text-xs sm:w-fit sm:text-sm">Tambah kategori</PortalButton>
      </div>

      <TableToolbar query={props.query} setQuery={props.setQuery} pageSize={props.pageSize} setPageSize={props.setPageSize}>
        <RoundedSelect value={props.status} onChange={(event) => props.setStatus(event.target.value as "all" | "active" | "hidden")} className="min-w-0 flex-1 text-[11px] sm:flex-none sm:text-xs">
          <option value="all">Semua status</option>
          <option value="active">Aktif</option>
          <option value="hidden">Disembunyikan</option>
        </RoundedSelect>
      </TableToolbar>

      <div className="overflow-hidden rounded-[14px] border border-slate-100 sm:rounded-[18px]">
        <div className="hidden grid-cols-[1.2fr_0.6fr_0.55fr_0.75fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:grid">
          <span>Kategori</span><span>Urutan</span><span>Status</span><span>Aksi</span>
        </div>
        {props.rows.map((category) => (
          <div key={category.id} className="grid gap-2 border-t border-slate-100 p-3 lg:grid-cols-[1.2fr_0.6fr_0.55fr_0.75fr] lg:items-center lg:p-4">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color ?? "#94a3b8" }} />
              <p className="font-black text-[#172033]">{category.name}</p>
            </div>
            <div className="text-sm font-black text-slate-600">{category.sortOrder ?? 0}</div>
            <div><StatusBadge active={category.isActive} activeText="Aktif" inactiveText="Hidden" /></div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <PortalButton onClick={() => props.onEdit(category)} icon={Edit3} variant="secondary" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">Edit</PortalButton>
              <PortalButton onClick={() => props.onToggle(category)} icon={category.isActive ? EyeOff : Eye} variant="secondary" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">{category.isActive ? "Hide" : "Show"}</PortalButton>
              <PortalButton onClick={() => props.onDelete(category)} icon={Trash2} variant="danger" className="min-h-0 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs" type="button">Hapus</PortalButton>
            </div>
          </div>
        ))}
        {!props.isLoading && props.rows.length === 0 ? <EmptyTable /> : null}
      </div>

      <Pagination page={props.page} totalPages={props.totalPages} totalRows={props.totalRows} pageSize={props.pageSize} setPage={props.setPage} />
    </div>
  );
}

export function StatusBadge({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) {
  return <PortalStatusBadge status={active ? activeText : inactiveText} tone={active ? "emerald" : "slate"} />;
}

export function EmptyTable() {
  return <EmptyState icon={Filter} title="Tidak ada data yang cocok." className="rounded-none border-0 px-4 py-12" />;
}
