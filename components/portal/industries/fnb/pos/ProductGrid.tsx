import React, { useEffect, useMemo, useRef, useState } from "react";
import { PosProduct, PosCategory, PosPromoBanner } from "../store/usePosStore";
import { Search, Star, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api";
import { Browser } from '@capacitor/browser';

interface ProductGridProps {
  categories: PosCategory[];
  promoBanners?: PosPromoBanner[];
  products: PosProduct[];
  isLoading?: boolean;
  reserveBottomSpace?: boolean;
  onProductClick: (product: PosProduct) => void;
}

function resolveProductImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE_URL.replace(/\/api$/, "")}${imageUrl}`;
  return imageUrl;
}

export function ProductGrid({ categories, promoBanners = [], products, isLoading = false, reserveBottomSpace = false, onProductClick }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("best-seller");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [products, searchQuery]);

  const groupedProducts = useMemo(() => {
    const bestSellerProducts = filteredProducts.filter((product) => product.isBestSeller);
    const bestSellerIds = new Set(bestSellerProducts.map((product) => product.id));
    const categoryRows = categories
      .map((category) => ({
        category,
        products: filteredProducts.filter((product) => product.categoryId === category.id && !bestSellerIds.has(product.id)),
      }))
      .filter((group) => group.products.length > 0);
    const uncategorized = filteredProducts.filter((product) => !bestSellerIds.has(product.id) && !categories.some((category) => category.id === product.categoryId));
    const rows = uncategorized.length > 0
      ? [...categoryRows, { category: { id: "uncategorized", name: "Lainnya", color: "#94a3b8" }, products: uncategorized }]
      : categoryRows;
    return bestSellerProducts.length > 0
      ? [{ category: { id: "best-seller", name: "Best Seller", color: "#f97316" }, products: bestSellerProducts }, ...rows]
      : rows;
  }, [categories, filteredProducts]);

  useEffect(() => {
    const firstGroupId = groupedProducts[0]?.category.id;
    if (firstGroupId && !groupedProducts.some((group) => group.category.id === activeCategory)) {
      setActiveCategory(firstGroupId);
    }
  }, [activeCategory, groupedProducts]);

  useEffect(() => {
    if (categoryScrollRef.current) {
      const activeBtn = categoryScrollRef.current.querySelector(`[data-category-id="${activeCategory}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    const section = sectionRefs.current[categoryId];
    if (!section) return;
    setActiveCategory(categoryId);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
    let currentCategory = groupedProducts[0]?.category.id;
    let closestOffset = Number.NEGATIVE_INFINITY;

    groupedProducts.forEach((group) => {
      const section = sectionRefs.current[group.category.id];
      if (!section) return;
      const offset = section.getBoundingClientRect().top - containerTop;
      if (offset <= 24 && offset > closestOffset) {
        closestOffset = offset;
        currentCategory = group.category.id;
      }
    });

    if (currentCategory && currentCategory !== activeCategory) {
      setActiveCategory(currentCategory);
    }
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-white">
      {/* Top Bar: Search & Categories */}
      <div className="border-b border-slate-100 p-2 lg:p-4">
        <div className="mb-2 flex h-8 w-full items-center gap-1.5 rounded-[11px] bg-slate-50 px-2.5 transition focus-within:ring-2 focus-within:ring-[var(--portal-primary-soft)] lg:mb-4 lg:h-12 lg:rounded-[16px] lg:px-4">
          <Search className="h-3 w-3 text-slate-400 lg:h-5 lg:w-5" />
          <input
            type="text"
            placeholder="Cari menu (Kopi, Nasi Goreng...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[11px] font-bold outline-none placeholder:text-slate-400 lg:text-sm"
          />
        </div>

        {promoBanners.length > 0 ? (
          <div className="mb-2.5 flex gap-2 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mb-4">
            {promoBanners.map((banner) => (
              <button
                key={banner.id}
                type="button"
                className="relative aspect-[3.4/1] min-w-[82%] overflow-hidden rounded-[14px] bg-slate-100 text-left shadow-sm sm:min-w-[58%] lg:min-w-[420px] lg:rounded-[18px]"
                onClick={() => {
                  if (banner.linkUrl) {
                    if (window.hasOwnProperty("Capacitor")) {
                      Browser.open({ url: banner.linkUrl });
                    } else {
                      window.open(banner.linkUrl, "_blank", "noopener,noreferrer");
                    }
                  }
                }}
              >
                <img src={resolveProductImageUrl(banner.imageUrl)} alt={banner.title} className="h-full w-full object-cover" />
                <span className="sr-only">{banner.title}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div ref={categoryScrollRef} className="flex gap-1.5 overflow-x-auto border-b-0 pb-0 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-2">
          {groupedProducts.some((group) => group.category.id === "best-seller") ? (
            <button
              onClick={() => handleCategoryClick("best-seller")}
              data-category-id="best-seller"
              className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-black transition lg:gap-1.5 lg:px-5 lg:py-2.5 lg:text-sm ${
                activeCategory === "best-seller"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-orange-50 text-orange-600 hover:bg-orange-100"
              }`}
            >
              <Star className="h-2.5 w-2.5 fill-current lg:h-3.5 lg:w-3.5" />
              Best Seller
            </button>
          ) : null}
          {groupedProducts.filter((group) => group.category.id !== "best-seller").map(({ category: cat }) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              data-category-id={cat.id}
              className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-black transition lg:px-5 lg:py-2.5 lg:text-sm ${
                activeCategory === cat.id
                  ? "text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              style={{ backgroundColor: activeCategory === cat.id ? cat.color || "var(--portal-primary)" : undefined }}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Grid */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-2 lg:p-4 lg:pb-4 ${reserveBottomSpace ? "pb-20" : "pb-3"}`}
      >
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[160px] animate-pulse rounded-[14px] border border-slate-100 bg-slate-50 lg:h-[234px] lg:rounded-[20px]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-[14px] bg-slate-100 lg:mb-4 lg:h-16 lg:w-16 lg:rounded-[20px]">
              <Search className="h-5 w-5 text-slate-400 lg:h-6 lg:w-6" />
            </div>
            <p className="text-xs font-bold text-slate-500 lg:text-sm">Tidak ada produk ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-3.5 lg:space-y-5">
            {groupedProducts.map((group) => (
              <section
                key={group.category.id}
                ref={(node) => {
                  sectionRefs.current[group.category.id] = node;
                }}
                className="scroll-mt-2 space-y-2 lg:scroll-mt-4 lg:space-y-2.5"
              >
                <div className="flex items-center gap-1.5 px-0.5 lg:gap-2 lg:px-1">
                  <span className="h-2 w-2 rounded-full lg:h-3 lg:w-3" style={{ backgroundColor: group.category.color || "#94a3b8" }} />
                  <h2 className="text-xs font-black text-[#172033] lg:text-base">{group.category.name}</h2>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500 lg:px-2 lg:text-[10px]">{group.products.length} menu</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-3">
                  {group.products.map((product) => {
                    const category = categories.find((c) => c.id === product.categoryId);
                    const imageUrl = resolveProductImageUrl(product.imageUrl);
                    return (
                      <motion.button
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        key={product.id}
                        onClick={() => onProductClick(product)}
                        className={`group relative flex flex-col bg-transparent text-left transition ${
                          !product.isAvailable ? "opacity-50 grayscale" : ""
                        }`}
                        disabled={!product.isAvailable}
                      >
                        {/* Image Container */}
                        <div
                          className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[16px] bg-slate-50 lg:rounded-[24px] shadow-sm"
                          style={{ backgroundColor: `${category?.color || "#94a3b8"}15` }}
                        >
                          {imageUrl ? (
                            <img src={imageUrl} alt={product.name} className="h-full w-full object-contain p-2 lg:p-4" />
                          ) : (
                            <div
                              className="grid h-10 w-10 place-items-center rounded-full text-lg font-black text-white lg:h-16 lg:w-16 lg:text-2xl"
                              style={{ backgroundColor: category?.color || "#94a3b8" }}
                            >
                              {product.name.charAt(0)}
                            </div>
                          )}

                          {/* Plus Button - floating bottom right rounded squircle */}
                          <div className="absolute bottom-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-[10px] bg-[var(--portal-primary)] text-white shadow-md transition-transform group-hover:scale-110 lg:bottom-3 lg:right-3 lg:h-9 lg:w-9 lg:rounded-[14px]">
                            <Plus className="h-3.5 w-3.5 lg:h-5 lg:w-5" strokeWidth={3} />
                          </div>

                          {/* Top Badges */}
                          {product.isBestSeller ? (
                            <div className="absolute left-0 top-0 rounded-br-[14px] bg-[#f97316] px-2 py-0.5 text-[9px] font-black text-white shadow-sm lg:rounded-br-[18px] lg:px-3 lg:py-1 lg:text-[11px]">
                              Terlaris
                            </div>
                          ) : null}
                          
                          {/* Unavailable overlay just for the image */}
                          {!product.isAvailable && (
                            <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-[2px]">
                              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-black text-white lg:px-3 lg:py-1 lg:text-xs">
                                Habis
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Text Area floating below */}
                        <div className="flex flex-1 flex-col pt-2 lg:pt-3 px-0.5">
                          <h3 className="line-clamp-2 text-[11px] font-bold leading-[1.25] text-[#172033] lg:text-[15px]">{product.name}</h3>
                          <div className="mt-1 flex flex-col justify-end lg:mt-1.5">
                            <span className="text-[9px] font-bold text-slate-400 lg:text-[11px]">
                              {category?.name || "Lainnya"}
                            </span>
                            <p className="mt-0.5 text-[12px] font-black text-[var(--portal-primary)] lg:text-[16px]">
                              Rp{product.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
