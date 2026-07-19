import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { PosProduct } from "../store/usePosStore";
import { ProductGrid } from "./ProductGrid";
import { CartSidebar } from "./CartSidebar";
import { ProductCustomizationModal } from "./ProductCustomizationModal";
import { CheckoutModal } from "./CheckoutModal";
import { PosCategory, PosPromoBanner, usePosStore } from "../store/usePosStore";
import { apiFetch } from "@/lib/api";
import { IndexedDBCache } from "@/lib/mobile/indexedDBCache";

type PosCatalogResponse = {
  categories: PosCategory[];
  promoBanners?: PosPromoBanner[];
  products: PosProduct[];
};

export function PosLayout({ subIndustrySlug = "cafe" }: { subIndustrySlug?: string }) {
  const { addToCart, cart, getTotal } = usePosStore();
  const [selectedProduct, setSelectedProduct] = useState<PosProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [categories, setCategories] = useState<PosCategory[]>([]);
  const [promoBanners, setPromoBanners] = useState<PosPromoBanner[]>([]);
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isBackendCatalog, setIsBackendCatalog] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsCatalogLoading(true);
    const cacheKey = `pos_catalog_${subIndustrySlug}`;
    IndexedDBCache.get<PosCatalogResponse>(cacheKey).then((cached) => {
      if (cached && !cancelled) {
        setCategories(cached.categories);
        setPromoBanners(cached.promoBanners ?? []);
        setProducts(cached.products);
        setIsBackendCatalog(true);
        setIsCatalogLoading(false);
      }
    });

    apiFetch<PosCatalogResponse>(`/fnb/pos/catalog?subIndustry=${encodeURIComponent(subIndustrySlug)}`)
      .then((catalog) => {
        if (cancelled) return;
        setCategories(catalog.categories);
        setPromoBanners(catalog.promoBanners ?? []);
        setProducts(catalog.products);
        setIsBackendCatalog(true);
        IndexedDBCache.set(cacheKey, catalog);
      })
      .catch(() => {
        if (cancelled) return;
        setCategories((prev) => prev.length ? prev : []);
        setPromoBanners((prev) => prev.length ? prev : []);
        setProducts((prev) => prev.length ? prev : []);
        setIsBackendCatalog((prev) => prev || false);
      })
      .finally(() => {
        if (!cancelled) setIsCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subIndustrySlug]);

  const handleProductClick = (product: PosProduct) => {
    if (product.variants.length > 0 || product.modifierGroups.length > 0) {
      setSelectedProduct(product);
      return;
    }
    addToCart(product, 1);
  };

  const handleModalConfirm = (
    product: PosProduct,
    quantity: number,
    variant: any,
    modifiers: any,
    note: any
  ) => {
    addToCart(product, quantity, variant, modifiers, note);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = getTotal();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-50 lg:flex-row">
      <div className="min-w-0 flex-1 overflow-hidden">
        <ProductGrid
          categories={categories}
          promoBanners={promoBanners}
          products={products}
          isLoading={isCatalogLoading}
          reserveBottomSpace={cartItemCount > 0}
          onProductClick={handleProductClick}
        />
      </div>

      <div className="hidden lg:block lg:w-96 lg:shrink-0">
        <CartSidebar onCheckout={() => setIsCheckoutOpen(true)} />
      </div>

      {cartItemCount > 0 ? (
        <button
          onClick={() => setIsCartSheetOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 flex min-h-[50px] items-center justify-between gap-3 rounded-full bg-[#172033] px-4 py-2.5 text-white shadow-2xl shadow-slate-900/25 transition hover:opacity-95 lg:hidden"
          type="button"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--portal-primary)]">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[9px] font-black text-[var(--portal-primary)]">
                {cartItemCount}
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-left text-xs font-black leading-tight">Keranjang</span>
              <span className="block text-left text-[10px] font-bold leading-tight text-white/70">{cartItemCount} item</span>
            </span>
          </span>
          <span className="shrink-0 text-sm font-black text-white">
            Rp{cartTotal.toLocaleString("id-ID")}
          </span>
        </button>
      ) : null}

      <AnimatePresence>
        {isCartSheetOpen ? (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartSheetOpen(false)}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-hidden rounded-t-[24px] bg-white shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--portal-primary)]">Order</p>
                  <h2 className="text-base font-black text-[#172033]">Keranjang Anda</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartSheetOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500"
                  aria-label="Tutup keranjang"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="h-[calc(88vh-57px)]">
                <CartSidebar
                  hideHeader
                  onCheckout={() => {
                    setIsCartSheetOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ProductCustomizationModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleModalConfirm}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        syncWithBackend={isBackendCatalog}
        onSuccess={() => {}}
      />
    </div>
  );
}
