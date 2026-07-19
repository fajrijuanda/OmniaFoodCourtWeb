import React, { useEffect, useMemo, useState } from "react";
import { PosIngredient } from "../store/useInventoryStore";
import { AlertTriangle, Plus, Edit3, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { SettingsModal, ResultModal } from "../menu/components/PosMenuModals";
import { TableToolbar, Pagination, EmptyTable } from "../menu/components/PosMenuTables";
import { AnimatePresence } from "framer-motion";
import { ConfirmDialog, RoundedSelect } from "@/components/portal/ui";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const start = (normalizedPage - 1) * pageSize;
  return { rows: rows.slice(start, start + pageSize), totalPages, normalizedPage };
}

export function IngredientList() {
  const [ingredients, setIngredients] = useState<PosIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "safe" | "low">("all");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedIngredient, setSelectedIngredient] = useState<PosIngredient | null>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<PosIngredient | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState<"PURCHASE" | "ADJUSTMENT" | "WASTE">("PURCHASE");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", unit: "gram", currentStock: "0", minStockAlert: "0", costPerUnit: "0" });
  const [isSaving, setIsSaving] = useState(false);
  const [resultModal, setResultModal] = useState<{ type: "success" | "error"; title: string; description: string } | null>(null);

  const loadIngredients = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      setIngredients(await apiFetch<PosIngredient[]>("/fnb/pos/ingredients"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat bahan baku.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ingredients.filter((item) => {
      const isLow = item.currentStock <= item.minStockAlert;
      const queryMatch = item.name.toLowerCase().includes(query) || item.unit.toLowerCase().includes(query);
      const statusMatch = statusFilter === "all" || (statusFilter === "low" ? isLow : !isLow);
      return queryMatch && statusMatch;
    });
  }, [ingredients, searchQuery, statusFilter]);

  const pagination = paginate(filtered, page, pageSize);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setIsSaving(true);
    try {
      await apiFetch("/fnb/pos/ingredients", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          unit: form.unit.trim() || "gram",
          currentStock: Number(form.currentStock) || 0,
          minStockAlert: Number(form.minStockAlert) || 0,
          costPerUnit: Number(form.costPerUnit) || 0,
        }),
      });
      setForm({ name: "", unit: "gram", currentStock: "0", minStockAlert: "0", costPerUnit: "0" });
      setFormOpen(false);
      await loadIngredients();
      setResultModal({
        type: "success",
        title: "Berhasil",
        description: "Bahan baku berhasil ditambahkan."
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan bahan baku.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdjust = async () => {
    if (!selectedIngredient) return;
    const amount = parseInt(adjustAmount, 10);
    if (isNaN(amount) || amount === 0) return;
    setIsSaving(true);
    try {
      await apiFetch("/fnb/pos/stock-adjustments", {
        method: "POST",
        body: JSON.stringify({ ingredientId: selectedIngredient.id, amount, reason: adjustReason, notes: "Penyesuaian stok manual" }),
      });
      await loadIngredients();
      setSelectedIngredient(null);
      setAdjustAmount("");
      setAdjustReason("PURCHASE");
      setResultModal({
        type: "success",
        title: "Berhasil",
        description: "Stok bahan baku berhasil disesuaikan."
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyesuaikan stok.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!ingredientToDelete) return;
    setIsSaving(true);
    try {
      await apiFetch<{ id: string; deleted: boolean }>(`/fnb/pos/ingredients/${ingredientToDelete.id}`, {
        method: "DELETE",
      });
      setIngredientToDelete(null);
      await loadIngredients();
      setResultModal({
        type: "success",
        title: "Bahan Dihapus",
        description: "Bahan baku berhasil dihapus dan dilepas dari resep yang memakai bahan ini."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menghapus",
        description: error instanceof Error ? error.message : "Gagal menghapus bahan baku."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Raw Materials</p>
          <h2 className="mt-2 text-xl font-black text-[#172033]">Bahan Baku</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">{filtered.length} bahan sesuai filter.</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="inline-flex min-h-[36px] w-full sm:w-fit justify-center items-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-[var(--portal-on-primary)] sm:px-5 sm:py-3 sm:text-sm" type="button">
          <Plus className="h-4 w-4" /> Tambah bahan
        </button>
      </div>

      {message && !formOpen && !selectedIngredient ? <div className="mb-4 rounded-[16px] border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700">{message}</div> : null}

      <TableToolbar query={searchQuery} setQuery={(q) => { setSearchQuery(q); setPage(1); }} pageSize={pageSize} setPageSize={(s) => { setPageSize(s); setPage(1); }}>
        <RoundedSelect
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as typeof statusFilter);
            setPage(1);
          }}
          className="min-w-0 flex-1 sm:flex-none text-xs"
        >
          <option value="all">Semua status</option>
          <option value="safe">Aman</option>
          <option value="low">Stok menipis</option>
        </RoundedSelect>
      </TableToolbar>

      <div className="overflow-hidden rounded-[14px] border border-slate-100 bg-white sm:rounded-[18px]">
        <div className="hidden grid-cols-[1.5fr_0.85fr_0.85fr_0.85fr_0.75fr] bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:grid">
          <span>Nama Bahan</span><span>Satuan</span><span>Minimum Stok</span><span>Stok Saat Ini</span><span>Aksi</span>
        </div>
        {pagination.rows.map((item) => {
          const isLow = item.currentStock <= item.minStockAlert;
          return (
            <div key={item.id} className="grid gap-2 border-t border-slate-100 p-3 lg:grid-cols-[1.5fr_0.85fr_0.85fr_0.85fr_0.75fr] lg:items-center lg:p-4 hover:bg-slate-50 transition">
              <div>
                <span className="mb-1 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 lg:hidden">Nama Bahan</span>
                <p className="font-black text-[#172033]">{item.name}</p>
              </div>
              <div className="text-sm font-bold text-slate-600">
                <span className="mr-2 inline-block text-[10px] font-black uppercase text-slate-400 lg:hidden">Satuan:</span>
                {item.unit}
              </div>
              <div className="text-sm font-bold text-slate-600">
                <span className="mr-2 inline-block text-[10px] font-black uppercase text-slate-400 lg:hidden">Min Stok:</span>
                {item.minStockAlert.toLocaleString("id-ID")} {item.unit}
              </div>
              <div>
                <span className="mr-2 inline-block text-[10px] font-black uppercase text-slate-400 lg:hidden">Stok:</span>
                <span className={`text-sm font-black ${isLow ? "text-rose-600" : "text-[#172033]"}`}>
                  {item.currentStock.toLocaleString("id-ID")} {item.unit}
                </span>
                {isLow && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">
                    <AlertTriangle className="h-3 w-3" /> Menipis
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2 lg:mt-0">
                <button
                  onClick={() => setSelectedIngredient(item)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] font-black text-slate-600 sm:px-3 sm:py-2 sm:text-xs hover:bg-slate-100"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Adjust Stok
                </button>
                <button
                  onClick={() => setIngredientToDelete(item)}
                  className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1.5 text-[11px] font-black text-rose-600 sm:px-3 sm:py-2 sm:text-xs hover:bg-rose-100"
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            </div>
          );
        })}
        {!isLoading && filtered.length === 0 ? <EmptyTable /> : null}
        {isLoading && <div className="p-8 text-center font-bold text-slate-500">Memuat bahan baku...</div>}
      </div>

      <Pagination page={pagination.normalizedPage} totalPages={pagination.totalPages} totalRows={filtered.length} pageSize={pageSize} setPage={setPage} />

      <AnimatePresence>
        {formOpen && (
          <SettingsModal
            title="Tambah Bahan Baku"
            isSaving={isSaving}
            onClose={() => setFormOpen(false)}
            onSave={handleCreate}
            feedback={message}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white sm:col-span-2" placeholder="Nama bahan" />
              <input value={form.unit} onChange={(event) => setForm((value) => ({ ...value, unit: event.target.value }))} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white" placeholder="Satuan" />
              <input type="number" value={form.currentStock} onChange={(event) => setForm((value) => ({ ...value, currentStock: event.target.value }))} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white" placeholder="Stok" />
              <input type="number" value={form.minStockAlert} onChange={(event) => setForm((value) => ({ ...value, minStockAlert: event.target.value }))} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white" placeholder="Min Stok Alert" />
              <input type="number" value={form.costPerUnit} onChange={(event) => setForm((value) => ({ ...value, costPerUnit: event.target.value }))} className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white" placeholder="HPP/unit" />
            </div>
          </SettingsModal>
        )}

        {selectedIngredient && (
          <SettingsModal
            title="Penyesuaian Stok"
            isSaving={isSaving}
            onClose={() => setSelectedIngredient(null)}
            onSave={handleAdjust}
            feedback={message}
          >
            <p className="mb-5 text-sm font-bold text-slate-500">
              {selectedIngredient.name} (Stok Saat Ini: {selectedIngredient.currentStock} {selectedIngredient.unit})
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                  Jumlah Perubahan (Gunakan - untuk mengurangi)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full rounded-[16px] border border-slate-200 bg-slate-50 p-4 font-bold outline-none focus:border-[var(--portal-primary)] focus:bg-white"
                  placeholder="Contoh: 500 atau -100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                  Alasan
                </label>
                <RoundedSelect
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full text-base sm:text-sm"
                >
                  <option value="PURCHASE">Pembelian Stok Baru (+)</option>
                  <option value="ADJUSTMENT">Penyesuaian Manual (+/-)</option>
                  <option value="WASTE">Bahan Rusak/Terbuang (-)</option>
                </RoundedSelect>
              </div>
            </div>
          </SettingsModal>
        )}

        {ingredientToDelete && (
          <ConfirmDialog
            open
            title={`Hapus ${ingredientToDelete.name}?`}
            body="Bahan akan dilepas dari resep menu yang memakai bahan ini. Riwayat stok tetap disimpan sebagai histori."
            confirmLabel={isSaving ? "Menghapus..." : "Hapus bahan"}
            cancelLabel="Batal"
            onConfirm={handleDelete}
            onClose={() => setIngredientToDelete(null)}
          />
        )}

        {resultModal && (
          <ResultModal
            title={resultModal.title}
            description={resultModal.description}
            type={resultModal.type}
            onClose={() => setResultModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
