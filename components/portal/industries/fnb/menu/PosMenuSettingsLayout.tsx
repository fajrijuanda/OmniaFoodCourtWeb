"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Filter,
  ImageIcon,
  ListChecks,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api";
import { ConfirmDialog } from "@/components/portal/ui";
import type { PosProduct } from "../store/usePosStore";
import {
  ProductsTable, CategoriesTable, StatusBadge, EmptyTable, TableToolbar, Pagination
} from "./components/PosMenuTables";
import {
  SettingsModal, CategoryFields, ProductFields, PromoBannerFields, ResultModal
} from "./components/PosMenuModals";


type ManagedCategory = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  isActive: boolean;
};

type ManagedProduct = PosProduct & {
  sortOrder?: number;
  archivedAt?: string | null;
  recipe?: {
    id: string;
    items: Array<{ ingredientId: string; quantityRequired: number }>;
  } | null;
};

type ManagedPromoBanner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder?: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

type PosCatalogResponse = {
  categories: ManagedCategory[];
  promoBanners?: ManagedPromoBanner[];
  products: ManagedProduct[];
};

type DeleteProductResponse = {
  id: string;
  deleted: boolean;
  archived?: boolean;
};

type ManagedIngredient = {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStockAlert: number;
};

type ActiveTab = "products" | "categories" | "banners";
type CategoryForm = { id?: string; name: string; color: string; sortOrder: string; isActive: boolean };
type PromoBannerForm = { id?: string; title: string; imageUrl: string; linkUrl: string; sortOrder: string; isActive: boolean; startsAt: string; endsAt: string };
type RecipeFormItem = { ingredientId: string; quantityRequired: string };
type ProductVariantFormItem = { name: string; priceAdjustment: string };
type ProductOptionFormItem = { name: string; priceAdjustment: string };
type ProductModifierGroupFormItem = {
  name: string;
  minSelection: string;
  maxSelection: string;
  options: ProductOptionFormItem[];
};
type ProductForm = {
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

const colorOptions = ["#f97316", "#8b5a2b", "#10b981", "#ef4444", "#0ea5e9", "#7c3aed"];
const defaultCategoryForm: CategoryForm = { name: "", color: colorOptions[0], sortOrder: "0", isActive: true };
const defaultPromoBannerForm: PromoBannerForm = { title: "", imageUrl: "", linkUrl: "", sortOrder: "0", isActive: true, startsAt: "", endsAt: "" };
const defaultProductForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  imageUrl: "",
  sortOrder: "0",
  isBestSeller: false,
  isAvailable: true,
  variants: [],
  modifierGroups: [],
  recipeItems: [],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE_URL.replace(/\/api$/, "")}${imageUrl}`;
  return imageUrl;
}

function paginate<T>(rows: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  return {
    totalPages,
    normalizedPage,
    rows: rows.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize),
  };
}

function parseRecipeQuantity(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const quantity = Number(normalized);
  return Number.isFinite(quantity) ? quantity : Number.NaN;
}

function buildRecipeItems(items: RecipeFormItem[]) {
  const quantityByIngredient = new Map<string, number>();
  for (const item of items) {
    const ingredientId = item.ingredientId.trim();
    const hasQuantity = item.quantityRequired.trim().length > 0;
    if (!ingredientId && !hasQuantity) continue;
    if (!ingredientId) throw new Error("Pilih bahan untuk setiap baris resep yang diisi.");
    const quantityRequired = parseRecipeQuantity(item.quantityRequired);
    if (quantityRequired === null || !Number.isFinite(quantityRequired) || quantityRequired <= 0) {
      throw new Error("Jumlah bahan harus berupa angka lebih dari 0. Contoh: 0.2 atau 0,2.");
    }
    quantityByIngredient.set(ingredientId, (quantityByIngredient.get(ingredientId) ?? 0) + quantityRequired);
  }
  return Array.from(quantityByIngredient.entries()).map(([ingredientId, quantityRequired]) => ({ ingredientId, quantityRequired }));
}

function parseMoneyInput(value: string) {
  const price = Number(value || 0);
  return Number.isFinite(price) ? price : Number.NaN;
}

function buildVariants(items: ProductVariantFormItem[]) {
  return items
    .map((item) => ({
      name: item.name.trim(),
      priceAdjustment: parseMoneyInput(item.priceAdjustment),
    }))
    .filter((item) => item.name || item.priceAdjustment > 0)
    .map((item) => {
      if (!item.name) throw new Error("Nama varian wajib diisi jika baris varian digunakan.");
      if (!Number.isFinite(item.priceAdjustment) || item.priceAdjustment < 0) {
        throw new Error("Harga tambahan varian harus berupa angka 0 atau lebih.");
      }
      return item;
    });
}

function buildModifierGroups(groups: ProductModifierGroupFormItem[]) {
  return groups
    .map((group) => {
      const options = group.options
        .map((option) => ({
          name: option.name.trim(),
          priceAdjustment: parseMoneyInput(option.priceAdjustment),
        }))
        .filter((option) => option.name || option.priceAdjustment > 0)
        .map((option) => {
          if (!option.name) throw new Error("Nama pilihan opsi wajib diisi jika baris opsi digunakan.");
          if (!Number.isFinite(option.priceAdjustment) || option.priceAdjustment < 0) {
            throw new Error("Harga tambahan opsi harus berupa angka 0 atau lebih.");
          }
          return option;
        });
      return {
        name: group.name.trim(),
        minSelection: Number(group.minSelection || 0),
        maxSelection: Number(group.maxSelection || 1),
        options,
      };
    })
    .filter((group) => group.name || group.options.length > 0)
    .map((group) => {
      if (!group.name) throw new Error("Nama grup opsi wajib diisi.");
      if (!Number.isInteger(group.minSelection) || group.minSelection < 0) {
        throw new Error("Minimal pilihan opsi harus berupa angka 0 atau lebih.");
      }
      if (!Number.isInteger(group.maxSelection) || group.maxSelection < 1) {
        throw new Error("Maksimal pilihan opsi minimal 1.");
      }
      if (group.minSelection > group.maxSelection) {
        throw new Error("Minimal pilihan tidak boleh lebih besar dari maksimal pilihan.");
      }
      if (group.options.length === 0) {
        throw new Error(`Grup opsi "${group.name}" harus punya minimal satu pilihan.`);
      }
      if (group.maxSelection > group.options.length) {
        throw new Error(`Maksimal pilihan "${group.name}" tidak boleh melebihi jumlah opsinya.`);
      }
      return group;
    });
}

export function PosMenuSettingsLayout({ subIndustryName, canManageRecipe }: { subIndustryName: string; canManageRecipe: boolean }) {
  const [categories, setCategories] = useState<ManagedCategory[]>([]);
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [promoBanners, setPromoBanners] = useState<ManagedPromoBanner[]>([]);
  const [ingredients, setIngredients] = useState<ManagedIngredient[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("products");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<null | "category" | "product" | "banner">(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ManagedCategory | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<ManagedPromoBanner | null>(null);
  const [productToDelete, setProductToDelete] = useState<ManagedProduct | null>(null);
  const [productToRestore, setProductToRestore] = useState<ManagedProduct | null>(null);
  const [productSortSwap, setProductSortSwap] = useState<{ conflictName: string; sortOrder: number } | null>(null);
  const [resultModal, setResultModal] = useState<{ title: string; description: string; type: "success" | "error" } | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(defaultCategoryForm);
  const [promoBannerForm, setPromoBannerForm] = useState<PromoBannerForm>(defaultPromoBannerForm);
  const [productForm, setProductForm] = useState<ProductForm>(defaultProductForm);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [categoryStatus, setCategoryStatus] = useState<"all" | "active" | "hidden">("all");
  const [productStatus, setProductStatus] = useState<"all" | "active" | "hidden" | "archived">("all");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [categoryPage, setCategoryPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const activeCategories = useMemo(() => categories.filter((category) => category.isActive).length, [categories]);
  const activePromoBanners = useMemo(() => promoBanners.filter((banner) => banner.isActive).length, [promoBanners]);
  const visibleProducts = useMemo(() => products.filter((product) => !product.archivedAt), [products]);
  const archivedProducts = useMemo(() => products.filter((product) => product.archivedAt), [products]);
  const activeProducts = useMemo(() => visibleProducts.filter((product) => product.isAvailable).length, [visibleProducts]);
  const activeProductCategories = useMemo(() => categories.filter((category) => category.isActive), [categories]);

  const loadCatalog = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const catalog = await apiFetch<PosCatalogResponse>("/fnb/pos/catalog?scope=management");
      const [archivedResult, ingredientsResult] = await Promise.allSettled([
        apiFetch<PosCatalogResponse>("/fnb/pos/catalog?scope=management&includeArchived=true"),
        apiFetch<ManagedIngredient[]>("/fnb/pos/ingredients"),
      ]);
      const archivedCatalog = archivedResult.status === "fulfilled" ? archivedResult.value : { categories: [], products: [] };
      const ingredientRows = ingredientsResult.status === "fulfilled" ? ingredientsResult.value : [];

      setCategories(catalog.categories);
      setPromoBanners(catalog.promoBanners ?? []);
      setProducts([...catalog.products, ...archivedCatalog.products]);
      setIngredients(ingredientRows);
      if (ingredientsResult.status === "rejected") {
        setMessage("Katalog POS berhasil dimuat, tetapi data bahan belum bisa dimuat.");
      }
    } catch (error) {
      setMessage(`Belum bisa memuat katalog POS. ${getErrorMessage(error, "Pastikan sudah login dan backend aktif.")}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    setCategoryPage(1);
  }, [categoryQuery, categoryStatus, pageSize]);

  useEffect(() => {
    setProductPage(1);
  }, [productQuery, productStatus, productCategoryFilter, pageSize]);

  const filteredCategories = useMemo(() => {
    const keyword = categoryQuery.trim().toLowerCase();
    return categories.filter((category) => {
      const statusMatch =
        categoryStatus === "all" ||
        (categoryStatus === "active" && category.isActive) ||
        (categoryStatus === "hidden" && !category.isActive);
      const keywordMatch = !keyword || `${category.name} ${category.color ?? ""}`.toLowerCase().includes(keyword);
      return statusMatch && keywordMatch;
    });
  }, [categories, categoryQuery, categoryStatus]);

  const filteredProducts = useMemo(() => {
    const keyword = productQuery.trim().toLowerCase();
    return products.filter((product) => {
      const category = categories.find((item) => item.id === product.categoryId);
      const statusMatch =
        (productStatus === "all" && !product.archivedAt) ||
        (productStatus === "active" && !product.archivedAt && product.isAvailable) ||
        (productStatus === "hidden" && !product.archivedAt && !product.isAvailable) ||
        (productStatus === "archived" && Boolean(product.archivedAt));
      const categoryMatch = productCategoryFilter === "all" || product.categoryId === productCategoryFilter;
      const keywordMatch = !keyword || `${product.name} ${product.description ?? ""} ${category?.name ?? ""}`.toLowerCase().includes(keyword);
      return statusMatch && categoryMatch && keywordMatch;
    });
  }, [categories, productCategoryFilter, productQuery, products, productStatus]);

  const categoryPagination = paginate(filteredCategories, categoryPage, pageSize);
  const productPagination = paginate(filteredProducts, productPage, pageSize);

  const openCategoryModal = (category?: ManagedCategory) => {
    setMessage("");
    setCategoryForm(category
      ? {
          id: category.id,
          name: category.name,
          color: category.color ?? colorOptions[0],
          sortOrder: String(category.sortOrder ?? 0),
          isActive: category.isActive,
        }
      : defaultCategoryForm
    );
    setModal("category");
  };

  const openPromoBannerModal = (banner?: ManagedPromoBanner) => {
    setMessage("");
    setPromoBannerForm(banner
      ? {
          id: banner.id,
          title: banner.title,
          imageUrl: banner.imageUrl,
          linkUrl: banner.linkUrl ?? "",
          sortOrder: String(banner.sortOrder ?? 0),
          isActive: banner.isActive,
          startsAt: banner.startsAt ? String(banner.startsAt).slice(0, 10) : "",
          endsAt: banner.endsAt ? String(banner.endsAt).slice(0, 10) : "",
        }
      : defaultPromoBannerForm
    );
    setModal("banner");
  };

  const openProductModal = (product?: ManagedProduct) => {
    setMessage("");
    setProductForm(product
      ? {
          id: product.id,
          name: product.name,
          description: product.description ?? "",
          price: String(product.price),
          categoryId: product.categoryId,
          imageUrl: product.imageUrl ?? "",
          sortOrder: String(product.sortOrder ?? 0),
          isBestSeller: Boolean(product.isBestSeller),
          isAvailable: product.isAvailable,
          variants: (product.variants ?? []).map((variant) => ({
            name: variant.name,
            priceAdjustment: String(variant.priceAdjustment ?? 0),
          })),
          modifierGroups: (product.modifierGroups ?? []).map((group) => ({
            name: group.name,
            minSelection: String(group.minSelection ?? 0),
            maxSelection: String(group.maxSelection ?? 1),
            options: (group.options ?? []).map((option) => ({
              name: option.name,
              priceAdjustment: String(option.priceAdjustment ?? 0),
            })),
          })),
          recipeItems: (product.recipe?.items ?? []).map((item) => ({
            ingredientId: item.ingredientId,
            quantityRequired: String(item.quantityRequired),
          })),
        }
      : { ...defaultProductForm, categoryId: activeProductCategories[0]?.id ?? "" }
    );
    setModal("product");
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      setResultModal({
        type: "error",
        title: "Gagal Menyimpan",
        description: "Nama kategori wajib diisi."
      });
      return;
    }
    const sortOrder = Number(categoryForm.sortOrder) || 0;
    const conflictingCategory = categories.find((category) => category.id !== categoryForm.id && (category.sortOrder ?? 0) === sortOrder);
    if (conflictingCategory) {
      setResultModal({
        type: "error",
        title: "Urutan Sudah Dipakai",
        description: `Urutan ${sortOrder} sudah digunakan oleh kategori "${conflictingCategory.name}" di cabang ini.`
      });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: categoryForm.name.trim(),
        slug: slugify(categoryForm.name),
        color: categoryForm.color,
        sortOrder,
        isActive: categoryForm.isActive,
      };
      const saved = categoryForm.id
        ? await apiFetch<ManagedCategory>(`/fnb/pos/categories/${categoryForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<ManagedCategory>("/fnb/pos/categories", { method: "POST", body: JSON.stringify(payload) });

      setCategories((value) => categoryForm.id ? value.map((item) => item.id === saved.id ? saved : item) : [...value, saved]);
      setModal(null);
      setResultModal({
        type: "success",
        title: "Berhasil",
        description: categoryForm.id ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menyimpan",
        description: getErrorMessage(error, "Terjadi kesalahan saat menyimpan kategori.")
      });
    } finally {
      setIsSaving(false);
    }
  };

  const savePromoBanner = async () => {
    if (!promoBannerForm.title.trim() || !promoBannerForm.imageUrl) {
      setResultModal({
        type: "error",
        title: "Gagal Menyimpan",
        description: "Judul dan gambar banner promo wajib diisi."
      });
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title: promoBannerForm.title.trim(),
        imageUrl: promoBannerForm.imageUrl,
        linkUrl: promoBannerForm.linkUrl.trim() || undefined,
        sortOrder: Number(promoBannerForm.sortOrder) || 0,
        isActive: promoBannerForm.isActive,
        startsAt: promoBannerForm.startsAt || undefined,
        endsAt: promoBannerForm.endsAt || undefined,
      };
      const saved = promoBannerForm.id
        ? await apiFetch<ManagedPromoBanner>(`/fnb/pos/promo-banners/${promoBannerForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<ManagedPromoBanner>("/fnb/pos/promo-banners", { method: "POST", body: JSON.stringify(payload) });

      setPromoBanners((value) => promoBannerForm.id ? value.map((item) => item.id === saved.id ? saved : item) : [...value, saved]);
      setModal(null);
      setResultModal({
        type: "success",
        title: "Berhasil",
        description: promoBannerForm.id ? "Banner promo berhasil diperbarui." : "Banner promo berhasil ditambahkan ke POS."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menyimpan",
        description: getErrorMessage(error, "Gagal menyimpan banner promo.")
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveProduct = async (allowSortOrderSwap = false) => {
    const price = Number(productForm.price);
    if (!productForm.name.trim() || !Number.isFinite(price) || price < 0) {
      setResultModal({
        type: "error",
        title: "Gagal Menyimpan",
        description: "Nama menu dan harga wajib valid."
      });
      return;
    }
    try {
      let categoryId = productForm.categoryId;
      if (!categoryId && categories.length === 0) {
        setIsSaving(true);
        const defaultCategory = await apiFetch<ManagedCategory>("/fnb/pos/categories", {
          method: "POST",
          body: JSON.stringify({ name: "Umum", slug: "umum", color: colorOptions[0], sortOrder: 0, isActive: true }),
        });
        setIsSaving(false);
        setCategories((value) => [...value, defaultCategory]);
        categoryId = defaultCategory.id;
      }
      if (!categoryId) {
        setResultModal({
          type: "error",
          title: "Kategori Kosong",
          description: "Pilih kategori aktif terlebih dahulu, atau aktifkan/buat kategori baru."
        });
        setIsSaving(false);
        return;
      }
      if (!productForm.id && !activeProductCategories.some((category) => category.id === categoryId)) {
        setResultModal({
          type: "error",
          title: "Kategori Hidden",
          description: "Kategori yang disembunyikan tidak bisa dipakai untuk menu baru."
        });
        setIsSaving(false);
        return;
      }
      const sortOrder = Number(productForm.sortOrder) || 0;
      const sortConflict = visibleProducts.find((product) =>
        product.id !== productForm.id &&
        product.categoryId === categoryId &&
        (product.sortOrder ?? 0) === sortOrder
      );
      if (sortConflict && !allowSortOrderSwap) {
        const originalProduct = productForm.id ? products.find((product) => product.id === productForm.id) : null;
        if (productForm.id && originalProduct?.categoryId === categoryId) {
          setProductSortSwap({ conflictName: sortConflict.name, sortOrder });
        } else {
          setResultModal({
            type: "error",
            title: "Urutan Sudah Dipakai",
            description: `Urutan ${sortOrder} sudah digunakan oleh menu "${sortConflict.name}" di kategori ini. Pilih urutan lain.`
          });
        }
        return;
      }
      const recipeItems = canManageRecipe ? buildRecipeItems(productForm.recipeItems) : [];
      const variants = buildVariants(productForm.variants);
      const modifierGroups = buildModifierGroups(productForm.modifierGroups);
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim() || undefined,
        categoryId: categoryId,
        imageUrl: productForm.imageUrl || undefined,
        price,
        sortOrder,
        isBestSeller: productForm.isBestSeller,
        isAvailable: productForm.isAvailable,
        variants,
        modifierGroups,
        ...(allowSortOrderSwap ? { allowSortOrderSwap: true } : {}),
        ...(canManageRecipe ? { recipeItems } : {}),
      };
      setIsSaving(true);
      const saved = productForm.id
        ? await apiFetch<ManagedProduct>(`/fnb/pos/products/${productForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        : await apiFetch<ManagedProduct>("/fnb/pos/products", { method: "POST", body: JSON.stringify(payload) });

      if (allowSortOrderSwap) {
        await loadCatalog();
      } else {
        setProducts((value) => productForm.id ? value.map((item) => item.id === saved.id ? saved : item) : [...value, saved]);
      }
      setModal(null);
      setProductSortSwap(null);
      setResultModal({
        type: "success",
        title: "Berhasil",
        description: allowSortOrderSwap
          ? "Menu berhasil diperbarui dan urutan menu sudah ditukar."
          : productForm.id ? "Menu berhasil diperbarui dan POS memakai data terbaru." : "Menu berhasil ditambahkan dan akan tampil di POS."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menyimpan",
        description: error instanceof Error ? error.message : "Gagal menyimpan menu POS."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = async (category: ManagedCategory) => {
    const next = { ...category, isActive: !category.isActive };
    setCategories((value) => value.map((item) => item.id === category.id ? next : item));
    try {
      await apiFetch<ManagedCategory>(`/fnb/pos/categories/${category.id}`, { method: "PATCH", body: JSON.stringify({ isActive: next.isActive }) });
    } catch {
      setCategories((value) => value.map((item) => item.id === category.id ? category : item));
      setMessage("Gagal mengubah status kategori.");
    }
  };

  const togglePromoBanner = async (banner: ManagedPromoBanner) => {
    const next = { ...banner, isActive: !banner.isActive };
    setPromoBanners((value) => value.map((item) => item.id === banner.id ? next : item));
    try {
      await apiFetch<ManagedPromoBanner>(`/fnb/pos/promo-banners/${banner.id}`, { method: "PATCH", body: JSON.stringify({ isActive: next.isActive }) });
    } catch {
      setPromoBanners((value) => value.map((item) => item.id === banner.id ? banner : item));
      setMessage("Gagal mengubah status banner promo.");
    }
  };

  const deletePromoBanner = async () => {
    if (!bannerToDelete) return;
    setIsSaving(true);
    try {
      await apiFetch<{ id: string; deleted: boolean }>(`/fnb/pos/promo-banners/${bannerToDelete.id}`, { method: "DELETE" });
      setPromoBanners((value) => value.filter((item) => item.id !== bannerToDelete.id));
      setBannerToDelete(null);
      setResultModal({
        type: "success",
        title: "Banner Dihapus",
        description: "Banner promo berhasil dihapus dari POS."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menghapus",
        description: getErrorMessage(error, "Gagal menghapus banner promo.")
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsSaving(true);
    try {
      await apiFetch<{ id: string; deleted: boolean }>(`/fnb/pos/categories/${categoryToDelete.id}`, { method: "DELETE" });
      setCategories((value) => value.filter((item) => item.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setResultModal({
        type: "success",
        title: "Kategori Dihapus",
        description: "Kategori berhasil dihapus dari katalog POS."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menghapus",
        description: error instanceof Error ? error.message : "Gagal menghapus kategori POS."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleProduct = async (product: ManagedProduct) => {
    const next = { ...product, isAvailable: !product.isAvailable };
    setProducts((value) => value.map((item) => item.id === product.id ? next : item));
    try {
      await apiFetch<ManagedProduct>(`/fnb/pos/products/${product.id}`, { method: "PATCH", body: JSON.stringify({ isAvailable: next.isAvailable }) });
    } catch {
      setProducts((value) => value.map((item) => item.id === product.id ? product : item));
      setMessage("Gagal mengubah status menu.");
    }
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    setIsSaving(true);
    try {
      const result = await apiFetch<DeleteProductResponse>(`/fnb/pos/products/${productToDelete.id}`, { method: "DELETE" });
      setProductToDelete(null);
      await loadCatalog();
      setResultModal({
        type: "success",
        title: result.archived ? "Menu Diarsipkan" : "Menu Dihapus",
        description: result.archived
          ? "Menu dipindahkan ke Arsip. Riwayat penjualan dan inventory yang sudah tercatat tetap aman."
          : "Menu berhasil dihapus dari katalog POS."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Menghapus",
        description: error instanceof Error ? error.message : "Gagal menghapus menu POS."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const restoreProduct = async () => {
    if (!productToRestore) return;
    setIsSaving(true);
    try {
      await apiFetch<ManagedProduct>(`/fnb/pos/products/${productToRestore.id}/restore`, { method: "PATCH" });
      setProductToRestore(null);
      setProductStatus("hidden");
      await loadCatalog();
      setResultModal({
        type: "success",
        title: "Menu Dipulihkan",
        description: "Menu kembali ke daftar Menu POS dalam status Hidden. Anda bisa Show kapan saja."
      });
    } catch (error) {
      setResultModal({
        type: "error",
        title: "Gagal Memulihkan",
        description: error instanceof Error ? error.message : "Gagal memulihkan menu POS."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full space-y-4 bg-[#fffaf5] p-3 pb-4 sm:p-5 lg:p-6">
      <section className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">POS menu settings</p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-3xl">Setting Menu {subIndustryName}</h1>
            <p className="mt-1 max-w-2xl text-xs font-bold leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Data di halaman ini tersambung langsung ke katalog POS. Kategori aktif dan menu aktif akan tampil di halaman kasir.
            </p>
          </div>
          <button onClick={loadCatalog} className="inline-flex min-h-[40px] w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 sm:px-5 sm:py-3 sm:text-sm" type="button">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {([
          ["Kategori POS", categories.length, Tags, "+1 kategori", "bulan ini"],
          ["Banner promo", promoBanners.length, ImageIcon, `${activePromoBanners} tampil`, "di POS"],
          ["Menu tampil", activeProducts, CheckCircle2, "+2 menu", "bulan ini"],
          ["Menu arsip", archivedProducts.length, EyeOff, "Aman", "histori tetap"],
        ] as Array<[string, number, LucideIcon, string, string]>).map(([label, value, Icon, delta, caption]) => (
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

      {message ? <p className="rounded-[18px] bg-orange-50 px-4 py-3 text-sm font-black text-orange-700">{message}</p> : null}

      <section className="overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-sm sm:rounded-[24px]">
        <div className="grid lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-slate-100 bg-slate-50/70 p-3 lg:border-b-0 lg:border-r">
            <div className="-mx-3 flex touch-pan-x gap-2 overflow-x-auto px-3 pb-2 no-scrollbar sm:pb-0 lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none">
              {[
                { id: "products" as ActiveTab, label: "Menu Jualan", count: visibleProducts.length, icon: ListChecks },
                { id: "categories" as ActiveTab, label: "Kategori POS", count: categories.length, icon: Tags },
                { id: "banners" as ActiveTab, label: "Banner Promo", count: promoBanners.length, icon: ImageIcon },
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
                    <span className="mt-0.5 block text-xs font-bold text-slate-500">{item.count} data</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 p-2.5 sm:p-5">
            {activeTab === "products" ? (
              <ProductsTable
                rows={productPagination.rows}
                totalRows={filteredProducts.length}
                page={productPagination.normalizedPage}
                totalPages={productPagination.totalPages}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPage={setProductPage}
                query={productQuery}
                setQuery={setProductQuery}
                status={productStatus}
                setStatus={setProductStatus}
                categoryFilter={productCategoryFilter}
                setCategoryFilter={setProductCategoryFilter}
                categories={categories}
                isLoading={isLoading}
                onCreate={() => openProductModal()}
                onEdit={openProductModal}
                onToggle={toggleProduct}
                onDelete={setProductToDelete}
                onRestore={setProductToRestore}
              />
            ) : activeTab === "categories" ? (
              <CategoriesTable
                rows={categoryPagination.rows}
                totalRows={filteredCategories.length}
                page={categoryPagination.normalizedPage}
                totalPages={categoryPagination.totalPages}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setPage={setCategoryPage}
                query={categoryQuery}
                setQuery={setCategoryQuery}
                status={categoryStatus}
                setStatus={setCategoryStatus}
                isLoading={isLoading}
                onCreate={() => openCategoryModal()}
                onEdit={openCategoryModal}
                onToggle={toggleCategory}
                onDelete={setCategoryToDelete}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#172033] sm:text-xl">Banner Promo</h2>
                    <p className="mt-0.5 text-xs font-bold text-slate-500 sm:mt-1 sm:text-sm">Banner aktif tampil di POS tepat di atas tab kategori menu, mengikuti tenant dan cabang aktif.</p>
                  </div>
                  <button onClick={() => openPromoBannerModal()} className="inline-flex min-h-[36px] items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] px-4 py-2 text-xs font-black text-white sm:w-fit sm:text-sm" type="button">
                    <Plus className="h-4 w-4" />
                    Tambah banner
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {promoBanners.map((banner) => (
                    <article key={banner.id} className="overflow-hidden rounded-[18px] border border-slate-100 bg-white shadow-sm">
                      <div className="aspect-[3.4/1] bg-slate-100">
                        {banner.imageUrl ? (
                          <img src={resolveImageUrl(banner.imageUrl)} alt={banner.title} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="space-y-3 p-3 sm:p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-black text-[#172033]">{banner.title}</p>
                            <p className="mt-1 text-xs font-bold text-slate-500">Urutan {banner.sortOrder ?? 0}</p>
                          </div>
                          <StatusBadge active={banner.isActive} activeText="Tampil" inactiveText="Hidden" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => openPromoBannerModal(banner)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-600" type="button">
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button onClick={() => togglePromoBanner(banner)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-black text-slate-600" type="button">
                            {banner.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            {banner.isActive ? "Hide" : "Show"}
                          </button>
                          <button onClick={() => setBannerToDelete(banner)} className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-2 text-xs font-black text-rose-600" type="button">
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {!isLoading && promoBanners.length === 0 ? (
                    <div className="md:col-span-2">
                      <EmptyTable />
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal === "category" ? (
          <SettingsModal title={categoryForm.id ? "Edit kategori" : "Tambah kategori"} onClose={() => setModal(null)} onSave={saveCategory} isSaving={isSaving}>
            <CategoryFields form={categoryForm} setForm={setCategoryForm} />
          </SettingsModal>
        ) : null}
        {modal === "banner" ? (
          <SettingsModal title={promoBannerForm.id ? "Edit banner promo" : "Tambah banner promo"} onClose={() => setModal(null)} onSave={savePromoBanner} isSaving={isSaving}>
            <PromoBannerFields form={promoBannerForm} setForm={setPromoBannerForm} />
          </SettingsModal>
        ) : null}
        {modal === "product" ? (
          <SettingsModal title={productForm.id ? "Edit menu jualan" : "Tambah menu jualan"} onClose={() => setModal(null)} onSave={saveProduct} isSaving={isSaving}>
            <ProductFields
              form={productForm}
              setForm={setProductForm}
              categories={productForm.id
                ? categories.filter((category) => category.isActive || category.id === productForm.categoryId)
                : activeProductCategories}
              ingredients={ingredients}
              canManageRecipe={canManageRecipe}
            />
          </SettingsModal>
        ) : null}
        {productSortSwap ? (
          <ConfirmDialog
            open
            title="Tukar urutan menu?"
            body={`Urutan ${productSortSwap.sortOrder} sudah digunakan oleh "${productSortSwap.conflictName}". Tukar urutan menu ini dengan menu tersebut?`}
            confirmLabel={isSaving ? "Menukar..." : "Tukar urutan"}
            cancelLabel="Batal"
            onConfirm={() => saveProduct(true)}
            onClose={() => setProductSortSwap(null)}
          />
        ) : null}
        {productToDelete ? (
          <ConfirmDialog
            open
            title={`Hapus ${productToDelete.name}?`}
            body="Menu akan hilang dari daftar jualan. Riwayat penjualan dan inventory yang sudah tercatat tetap aman."
            confirmLabel={isSaving ? "Menghapus..." : "Hapus menu"}
            cancelLabel="Batal"
            onConfirm={deleteProduct}
            onClose={() => setProductToDelete(null)}
          />
        ) : null}
        {categoryToDelete ? (
          <ConfirmDialog
            open
            title={`Hapus ${categoryToDelete.name}?`}
            body="Kategori akan dihapus permanen dari katalog POS. Jika masih dipakai menu, sistem akan menolak penghapusan."
            confirmLabel={isSaving ? "Menghapus..." : "Hapus kategori"}
            cancelLabel="Batal"
            onConfirm={deleteCategory}
            onClose={() => setCategoryToDelete(null)}
          />
        ) : null}
        {bannerToDelete ? (
          <ConfirmDialog
            open
            title={`Hapus ${bannerToDelete.title}?`}
            body="Banner promo akan hilang dari POS cabang ini."
            confirmLabel={isSaving ? "Menghapus..." : "Hapus banner"}
            cancelLabel="Batal"
            onConfirm={deletePromoBanner}
            onClose={() => setBannerToDelete(null)}
          />
        ) : null}
        {productToRestore ? (
          <ConfirmDialog
            open
            title={`Pulihkan ${productToRestore.name}?`}
            body="Menu akan kembali ke daftar Menu POS dalam status Hidden, lalu bisa Anda Show kapan saja."
            confirmLabel={isSaving ? "Memulihkan..." : "Pulihkan menu"}
            cancelLabel="Batal"
            onConfirm={restoreProduct}
            onClose={() => setProductToRestore(null)}
          />
        ) : null}
        {resultModal ? (
          <ResultModal
            type={resultModal.type}
            title={resultModal.title}
            description={resultModal.description}
            onClose={() => setResultModal(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
