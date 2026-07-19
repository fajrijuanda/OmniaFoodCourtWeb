"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Star } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useCart } from "./cart-context";
import { CustomerCustomizationModal, CustomerProduct } from "./CustomerCustomizationModal";

type Catalog = {
  categories: any[];
  products: any[];
};

function resolveProductImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("/uploads/")) return `${API_BASE_URL.replace(/\/api$/, "")}${imageUrl}`;
  return imageUrl;
}

export default function MenuPageClient({ tenantId }: { tenantId: string }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CustomerProduct | null>(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/fnb/public/catalog/${tenantId}`)
      .then(res => res.json())
      .then(data => {
        setCatalog(data);
        if (data.products?.some((product: any) => product.isBestSeller)) {
          setActiveCategory("best-seller");
        } else if (data.categories?.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tenantId]);

  const filteredProducts = useMemo(() => {
    if (!catalog) return [];
    let list = catalog.products;
    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeCategory === "best-seller") {
      list = list.filter(p => p.isBestSeller);
    } else if (activeCategory) {
      list = list.filter(p => p.categoryId === activeCategory);
    }
    return list;
  }, [catalog, activeCategory, searchQuery]);
  const hasBestSellers = Boolean(catalog?.products?.some(product => product.isBestSeller));

  if (loading) return <div className="p-10 text-center text-slate-500 font-bold">Memuat menu...</div>;
  if (!catalog) return <div className="p-10 text-center text-red-500 font-bold">Gagal memuat menu</div>;

  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/90 px-4 py-4 backdrop-blur-md shadow-sm">
        <h1 className="text-xl font-black text-slate-900 mb-3">Pesan Sekarang</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari makanan atau minuman..."
            className="w-full rounded-full bg-slate-100 pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        
        {!searchQuery && (
          <div className="mt-4 flex gap-2 overflow-x-auto border-b-0 pb-0 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hasBestSellers ? (
              <button
                onClick={() => setActiveCategory("best-seller")}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2 text-xs font-black transition-colors ${activeCategory === "best-seller" ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600"}`}
              >
                <Star className="h-3.5 w-3.5 fill-current" />
                Best Seller
              </button>
            ) : null}
            {catalog.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-black transition-colors ${activeCategory === cat.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="px-4 py-6 grid gap-4">
        {filteredProducts.map(product => {
          // Simply find quantity in cart for this product
          const qtyInCart = items.filter(i => i.productId === product.id).reduce((sum, i) => sum + i.quantity, 0);
          const imageUrl = resolveProductImageUrl(product.imageUrl);
          
          return (
            <div key={product.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 items-center">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
              ) : (
                <div className="h-24 w-24 rounded-xl bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 text-xs font-bold">No Image</span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-slate-900">{product.name}</h3>
                  {product.isBestSeller ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-600">
                      <Star className="h-3 w-3 fill-current" />
                      Best
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-orange-500">Rp {product.price.toLocaleString("id-ID")}</span>
                  <button
                    onClick={() => {
                      if (product.variants?.length > 0 || product.modifierGroups?.length > 0) {
                        setSelectedProduct(product as CustomerProduct);
                      } else {
                        addItem({ productId: product.id, name: product.name, priceAtSale: product.price, quantity: 1, note: "", variantSnapshot: null, modifiersSnapshot: null });
                      }
                    }}
                    className="relative grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    {qtyInCart > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[8px] font-bold text-white">
                        {qtyInCart}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm font-bold">Tidak ada produk ditemukan.</div>
        )}
      </div>

      <CustomerCustomizationModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={(prod, qty, variant, modifiers, note) => {
          let price = prod.price;
          if (variant) price += variant.priceAdjustment;
          if (modifiers) modifiers.forEach((m: any) => (price += m.priceAdjustment));
          addItem({
            productId: prod.id,
            name: prod.name,
            priceAtSale: price,
            quantity: qty,
            note: note || "",
            variantSnapshot: variant || null,
            modifiersSnapshot: modifiers || null,
          });
        }}
      />
    </div>
  );
}
