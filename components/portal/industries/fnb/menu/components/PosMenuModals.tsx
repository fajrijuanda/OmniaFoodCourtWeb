"use client";

import type React from "react";
import {
  ListPlus, Plus, Save, ShieldCheck, Trash2
} from "lucide-react";
import type { PosProduct } from "../../store/usePosStore";
import { CheckboxField, FeedbackAlert, FormField, IconButton, ModalShell, PortalButton, ResultDialog, SelectField } from "@/components/portal/ui";

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
export type PromoBannerForm = {
  id?: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};
export type RecipeFormItem = { ingredientId: string; quantityRequired: string };
export type ProductVariantFormItem = { name: string; priceAdjustment: string };
export type ProductOptionFormItem = { name: string; priceAdjustment: string };
export type ProductModifierGroupFormItem = {
  name: string;
  minSelection: string;
  maxSelection: string;
  options: ProductOptionFormItem[];
};
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
  variants: ProductVariantFormItem[];
  modifierGroups: ProductModifierGroupFormItem[];
  recipeItems: RecipeFormItem[];
};

export const colorOptions = ["#f97316", "#8b5a2b", "#10b981", "#ef4444", "#0ea5e9", "#7c3aed"];

export function money(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function loadImageFromDataUrl(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Gambar tidak bisa dibaca."));
    image.src = dataUrl;
  });
}

async function compressImageFile(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
  const image = await loadImageFromDataUrl(dataUrl);
  const maxSize = 900;
  const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.78);
}

export function SettingsModal({ title, children, feedback, isSaving, onClose, onSave }: { title: string; children: React.ReactNode; feedback?: string; isSaving: boolean; onClose: () => void; onSave: () => void }) {
  return (
    <ModalShell
      open
      onClose={onClose}
      title={title}
      eyebrow="POS catalog"
      className="max-h-[90vh] max-w-2xl overflow-y-auto"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <PortalButton onClick={onClose} variant="secondary">Batal</PortalButton>
          <PortalButton onClick={onSave} loading={isSaving} icon={Save}>
            {isSaving ? "Menyimpan..." : "Simpan"}
          </PortalButton>
        </div>
      }
    >
      {children}
      {feedback ? <FeedbackAlert message={feedback} className="mt-5" /> : null}
    </ModalShell>
  );
}

export function ResultModal({ title, description, type, onClose }: { title: string; description: string; type: "success" | "error"; onClose: () => void }) {
  return <ResultDialog open title={title} description={description} type={type} onClose={onClose} />;
}

export function CategoryFields({ form, setForm }: { form: CategoryForm; setForm: React.Dispatch<React.SetStateAction<CategoryForm>> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Nama kategori" value={form.name} onChange={(name) => setForm((value) => ({ ...value, name }))} className="sm:col-span-2" />
      <FormField label="Urutan" value={form.sortOrder} onChange={(sortOrder) => setForm((value) => ({ ...value, sortOrder: sortOrder.replace(/[^\d-]/g, "") }))} />
      <CheckboxField label="Tampil di POS" checked={form.isActive} onChange={(isActive) => setForm((value) => ({ ...value, isActive }))} />
      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Warna kategori</p>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button key={color} onClick={() => setForm((value) => ({ ...value, color }))} className={`h-10 w-10 rounded-full border-4 ${form.color === color ? "border-[#172033]" : "border-white"}`} style={{ backgroundColor: color }} type="button" aria-label={`Pilih warna ${color}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PromoBannerFields({ form, setForm }: { form: PromoBannerForm; setForm: React.Dispatch<React.SetStateAction<PromoBannerForm>> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Judul banner" value={form.title} onChange={(title) => setForm((value) => ({ ...value, title }))} />
      <FormField label="Urutan" value={form.sortOrder} onChange={(sortOrder) => setForm((value) => ({ ...value, sortOrder: sortOrder.replace(/[^\d-]/g, "") }))} />
      <FormField label="Link opsional" value={form.linkUrl} onChange={(linkUrl) => setForm((value) => ({ ...value, linkUrl }))} className="sm:col-span-2" />
      <FormField label="Mulai tampil" value={form.startsAt} onChange={(startsAt) => setForm((value) => ({ ...value, startsAt }))} />
      <FormField label="Selesai tampil" value={form.endsAt} onChange={(endsAt) => setForm((value) => ({ ...value, endsAt }))} />
      <CheckboxField label="Tampil di POS" checked={form.isActive} onChange={(isActive) => setForm((value) => ({ ...value, isActive }))} />
      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-[1fr_180px] sm:items-center">
        <label className="flex min-h-[54px] cursor-pointer items-center justify-between gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-[var(--portal-primary)] hover:bg-white">
          <span className="truncate">{form.imageUrl ? "Gambar banner sudah dipilih" : "Pilih gambar banner promo"}</span>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--portal-primary)] shadow-sm">Browse</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const imageUrl = await compressImageFile(file);
              setForm((value) => ({ ...value, imageUrl }));
            }}
          />
        </label>
        <div className="aspect-[3.4/1] w-full overflow-hidden rounded-[16px] border border-slate-200 bg-slate-50">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview banner promo" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center px-3 text-center text-xs font-black text-slate-400">Preview banner</div>
          )}
        </div>
        {form.imageUrl ? (
          <PortalButton onClick={() => setForm((value) => ({ ...value, imageUrl: "" }))} variant="secondary" className="min-h-0 w-fit px-4 py-2 text-xs sm:col-span-2" type="button">
            Hapus gambar
          </PortalButton>
        ) : null}
      </div>
    </div>
  );
}

export function ProductFields({
  form,
  setForm,
  categories,
  ingredients,
  canManageRecipe,
}: {
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  categories: ManagedCategory[];
  ingredients: ManagedIngredient[];
  canManageRecipe: boolean;
}) {
  const addRecipeItem = () => {
    setForm((value) => ({
      ...value,
      recipeItems: [...value.recipeItems, { ingredientId: ingredients[0]?.id ?? "", quantityRequired: "" }],
    }));
  };
  const addVariant = () => {
    setForm((value) => ({
      ...value,
      variants: [...value.variants, { name: "", priceAdjustment: "0" }],
    }));
  };
  const addModifierGroup = () => {
    setForm((value) => ({
      ...value,
      modifierGroups: [
        ...value.modifierGroups,
        {
          name: "",
          minSelection: "0",
          maxSelection: "1",
          options: [{ name: "", priceAdjustment: "0" }],
        },
      ],
    }));
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Nama menu" value={form.name} onChange={(name) => setForm((value) => ({ ...value, name }))} />
      <FormField label="Harga" value={form.price} onChange={(price) => setForm((value) => ({ ...value, price: price.replace(/\D/g, "") }))} />
      <SelectField
        label="Kategori"
        value={form.categoryId}
        allowEmpty
        emptyLabel="Pilih kategori"
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
        onChange={(categoryId) => setForm((value) => ({ ...value, categoryId }))}
      />
      <FormField label="Urutan" value={form.sortOrder} onChange={(sortOrder) => setForm((value) => ({ ...value, sortOrder: sortOrder.replace(/[^\d-]/g, "") }))} />
      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-[1fr_112px] sm:items-center">
        <label className="flex min-h-[54px] cursor-pointer items-center justify-between gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 transition hover:border-[var(--portal-primary)] hover:bg-white">
          <span className="truncate">{form.imageUrl ? "Gambar menu sudah dipilih" : "Pilih gambar dari galeri"}</span>
          <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--portal-primary)] shadow-sm">Browse</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const imageUrl = await compressImageFile(file);
              setForm((value) => ({ ...value, imageUrl }));
            }}
          />
        </label>
        <div className="grid h-24 w-full place-items-center overflow-hidden rounded-[16px] border border-slate-200 bg-slate-50 sm:w-28">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview menu" className="h-full w-full object-cover" />
          ) : (
            <span className="px-3 text-center text-xs font-black text-slate-400">Preview</span>
          )}
        </div>
        {form.imageUrl ? (
          <PortalButton onClick={() => setForm((value) => ({ ...value, imageUrl: "" }))} variant="secondary" className="min-h-0 w-fit px-4 py-2 text-xs sm:col-span-2" type="button">
            Hapus gambar
          </PortalButton>
        ) : null}
      </div>
      <FormField label="Deskripsi menu" value={form.description} onChange={(description) => setForm((value) => ({ ...value, description }))} textarea className="sm:col-span-2" />
      <div className="rounded-[18px] border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#172033]">Varian menu</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Opsional. Cocok untuk ukuran, porsi, atau tipe menu dengan satu pilihan.</p>
          </div>
          <PortalButton onClick={addVariant} variant="secondary" icon={Plus} className="min-h-0 w-fit px-4 py-2 text-xs" type="button">
            Tambah varian
          </PortalButton>
        </div>
        <div className="mt-4 space-y-3">
          {form.variants.map((variant, index) => (
            <div key={index} className="grid gap-2 rounded-[16px] bg-white p-3 sm:grid-cols-[1fr_150px_40px] sm:items-end">
              <FormField
                label="Nama varian"
                value={variant.name}
                onChange={(name) => {
                  setForm((value) => ({
                    ...value,
                    variants: value.variants.map((row, rowIndex) => rowIndex === index ? { ...row, name } : row),
                  }));
                }}
              />
              <FormField
                label="Tambahan harga"
                value={variant.priceAdjustment}
                onChange={(priceAdjustment) => {
                  setForm((value) => ({
                    ...value,
                    variants: value.variants.map((row, rowIndex) => rowIndex === index ? { ...row, priceAdjustment: priceAdjustment.replace(/\D/g, "") } : row),
                  }));
                }}
              />
              <IconButton
                onClick={() => setForm((value) => ({ ...value, variants: value.variants.filter((_, rowIndex) => rowIndex !== index) }))}
                icon={Trash2}
                label="Hapus varian"
                tone="rose"
              />
            </div>
          ))}
          {form.variants.length === 0 ? (
            <p className="rounded-[14px] bg-white px-4 py-3 text-xs font-bold text-slate-500">Belum ada varian. Menu akan memakai harga dasar.</p>
          ) : null}
        </div>
      </div>
      <div className="rounded-[18px] border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#172033]">Opsi pilihan sebelum masuk order</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Untuk level pedas, gula/es, topping, atau pilihan lain dari menu ini.</p>
          </div>
          <PortalButton onClick={addModifierGroup} variant="secondary" icon={ListPlus} className="min-h-0 w-fit px-4 py-2 text-xs" type="button">
            Tambah opsi
          </PortalButton>
        </div>
        <div className="mt-4 space-y-4">
          {form.modifierGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3 rounded-[18px] bg-white p-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_96px_96px_40px] sm:items-end">
                <FormField
                  label="Nama grup opsi"
                  value={group.name}
                  onChange={(name) => {
                    setForm((value) => ({
                      ...value,
                      modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? { ...row, name } : row),
                    }));
                  }}
                />
                <FormField
                  label="Min"
                  value={group.minSelection}
                  onChange={(minSelection) => {
                    setForm((value) => ({
                      ...value,
                      modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? { ...row, minSelection: minSelection.replace(/\D/g, "") } : row),
                    }));
                  }}
                />
                <FormField
                  label="Max"
                  value={group.maxSelection}
                  onChange={(maxSelection) => {
                    setForm((value) => ({
                      ...value,
                      modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? { ...row, maxSelection: maxSelection.replace(/\D/g, "") } : row),
                    }));
                  }}
                />
                <IconButton
                  onClick={() => setForm((value) => ({ ...value, modifierGroups: value.modifierGroups.filter((_, rowIndex) => rowIndex !== groupIndex) }))}
                  icon={Trash2}
                  label="Hapus grup opsi"
                  tone="rose"
                />
              </div>
              <div className="space-y-2">
                {group.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="grid gap-2 rounded-[14px] border border-slate-100 bg-slate-50 p-2 sm:grid-cols-[1fr_150px_40px] sm:items-end">
                    <FormField
                      label="Pilihan"
                      value={option.name}
                      onChange={(name) => {
                        setForm((value) => ({
                          ...value,
                          modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? {
                            ...row,
                            options: row.options.map((optionRow, optionRowIndex) => optionRowIndex === optionIndex ? { ...optionRow, name } : optionRow),
                          } : row),
                        }));
                      }}
                    />
                    <FormField
                      label="Tambahan harga"
                      value={option.priceAdjustment}
                      onChange={(priceAdjustment) => {
                        setForm((value) => ({
                          ...value,
                          modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? {
                            ...row,
                            options: row.options.map((optionRow, optionRowIndex) => optionRowIndex === optionIndex ? { ...optionRow, priceAdjustment: priceAdjustment.replace(/\D/g, "") } : optionRow),
                          } : row),
                        }));
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        setForm((value) => ({
                          ...value,
                          modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? {
                            ...row,
                            options: row.options.filter((_, optionRowIndex) => optionRowIndex !== optionIndex),
                          } : row),
                        }));
                      }}
                      icon={Trash2}
                      label="Hapus pilihan"
                      tone="rose"
                    />
                  </div>
                ))}
                <PortalButton
                  onClick={() => {
                    setForm((value) => ({
                      ...value,
                      modifierGroups: value.modifierGroups.map((row, rowIndex) => rowIndex === groupIndex ? {
                        ...row,
                        options: [...row.options, { name: "", priceAdjustment: "0" }],
                      } : row),
                    }));
                  }}
                  variant="secondary"
                  icon={Plus}
                  className="min-h-0 w-fit px-4 py-2 text-xs"
                  type="button"
                >
                  Tambah pilihan
                </PortalButton>
              </div>
            </div>
          ))}
          {form.modifierGroups.length === 0 ? (
            <p className="rounded-[14px] bg-white px-4 py-3 text-xs font-bold text-slate-500">Belum ada opsi. Saat diklik, menu langsung masuk keranjang.</p>
          ) : null}
        </div>
      </div>
      <div className="rounded-[18px] border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#172033]">Bahan yang digunakan</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Opsional. Menu tetap bisa disimpan tanpa bahan; stok otomatis hanya berjalan jika resep diisi.</p>
          </div>
          {canManageRecipe ? (
            <PortalButton onClick={addRecipeItem} disabled={ingredients.length === 0} variant="secondary" icon={Plus} className="min-h-0 w-fit px-4 py-2 text-xs" type="button">
              Tambah bahan
            </PortalButton>
          ) : null}
        </div>

        {canManageRecipe ? (
          <div className="mt-4 space-y-3">
            {ingredients.length === 0 ? (
              <p className="rounded-[14px] bg-white px-4 py-3 text-xs font-bold text-slate-500">Belum ada bahan di Inventory Stok. Menu tetap bisa disimpan tanpa bahan.</p>
            ) : null}
            {form.recipeItems.map((item, index) => {
              const selectedIngredient = ingredients.find((ingredient) => ingredient.id === item.ingredientId);
              return (
                <div key={index} className="grid gap-2 rounded-[16px] bg-white p-3 sm:grid-cols-[1fr_130px_40px] sm:items-center">
                  <SelectField
                    label="Bahan"
                    value={item.ingredientId}
                    allowEmpty
                    emptyLabel="Pilih bahan"
                    options={ingredients.map((ingredient) => ({ value: ingredient.id, label: ingredient.name }))}
                    onChange={(nextIngredientId) => {
                      setForm((value) => ({
                        ...value,
                        recipeItems: value.recipeItems.map((row, rowIndex) => rowIndex === index ? { ...row, ingredientId: nextIngredientId } : row),
                      }));
                    }}
                  />
                  <div className="flex items-center gap-2 rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2">
                    <input
                      value={item.quantityRequired}
                      onChange={(event) => {
                        const nextQuantity = event.target.value.replace(/[^\d.,]/g, "");
                        setForm((value) => ({
                          ...value,
                          recipeItems: value.recipeItems.map((row, rowIndex) => rowIndex === index ? { ...row, quantityRequired: nextQuantity } : row),
                        }));
                      }}
                      className="min-w-0 flex-1 bg-transparent text-sm font-black outline-none"
                      placeholder="Qty"
                    />
                    <span className="text-xs font-black text-slate-400">{selectedIngredient?.unit ?? "unit"}</span>
                  </div>
                  <IconButton
                    onClick={() => setForm((value) => ({ ...value, recipeItems: value.recipeItems.filter((_, rowIndex) => rowIndex !== index) }))}
                    icon={Trash2}
                    label="Hapus bahan"
                    tone="rose"
                  />
                </div>
              );
            })}
            {form.recipeItems.length === 0 && ingredients.length > 0 ? (
              <p className="rounded-[14px] bg-white px-4 py-3 text-xs font-bold text-slate-500">Belum ada bahan dipilih untuk menu ini.</p>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-dashed border-slate-200 bg-white p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-sm font-black text-[#172033]">Fitur resep tersedia mulai tier Growth.</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">Menu tetap bisa dibuat dan dijual tanpa mencantumkan bahan.</p>
            </div>
          </div>
        )}
      </div>
      <CheckboxField label="Best seller" checked={form.isBestSeller} onChange={(isBestSeller) => setForm((value) => ({ ...value, isBestSeller }))} />
      <CheckboxField label="Tampil di POS" checked={form.isAvailable} onChange={(isAvailable) => setForm((value) => ({ ...value, isAvailable }))} className="sm:col-span-2" />
    </div>
  );
}
