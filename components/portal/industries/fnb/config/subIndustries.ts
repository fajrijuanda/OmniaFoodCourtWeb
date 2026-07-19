import { BarChart3, ShoppingCart, ChefHat, Package, BookOpen, Clock, Store, Users, MapPin, Target, ListChecks, ReceiptText } from "lucide-react";

export type TierLevel = "Starter" | "Growth" | "Pro" | "Enterprise";

const tierHierarchy = {
  "Starter": 1,
  "Growth": 2,
  "Pro": 3,
  "Enterprise": 4,
  "starter": 1,
  "growth": 2,
  "pro": 3,
  "enterprise": 4,
};

export interface FnbModuleConfig {
  id: string;
  label: string;
  icon: any;
  minTier: TierLevel;
  description: string;
}

export interface SubIndustryConfig {
  id: string;
  name: string;
  modules: FnbModuleConfig[];
}

// Map tier to number for comparison
export function hasAccess(currentTier: string, requiredTier: TierLevel): boolean {
  const current = tierHierarchy[currentTier as keyof typeof tierHierarchy] || 0;
  const required = tierHierarchy[requiredTier] || 99;
  return current >= required;
}

export const fnbSubIndustries: Record<string, SubIndustryConfig> = {
  "cafe": {
    id: "cafe",
    name: "Cafe",
    modules: [
      { id: "sales-dashboard", label: "Sales Dashboard", icon: BarChart3, minTier: "Growth", description: "Laporan harian dan performa menu." },
      { id: "order-history", label: "Riwayat Pesanan", icon: ReceiptText, minTier: "Starter", description: "Daftar transaksi pelanggan dan invoice." },
      { id: "pos", label: "Cafe POS", icon: ShoppingCart, minTier: "Starter", description: "Sistem kasir utama untuk cafe." },
      { id: "menu-settings", label: "Menu POS", icon: ListChecks, minTier: "Starter", description: "Atur kategori dan menu yang tampil di POS." },
      { id: "table-order", label: "Table Order", icon: MapPin, minTier: "Starter", description: "Manajemen pesanan di meja." },
      { id: "kds", label: "Kitchen Display", icon: ChefHat, minTier: "Growth", description: "Antrean pesanan dapur." },
      { id: "inventory", label: "Inventory & Resep", icon: Package, minTier: "Starter", description: "Stok bahan baku dan HPP." },
      { id: "loyalty", label: "Loyalty & Promo", icon: Target, minTier: "Starter", description: "Program poin dan reward." },
      { id: "shift-closing", label: "Shift & Closing", icon: Clock, minTier: "Starter", description: "Shift kasir dan closing harian." },
    ]
  },
  "restoran": {
    id: "restoran",
    name: "Restoran",
    modules: [
      { id: "sales-dashboard", label: "Outlet Report", icon: BarChart3, minTier: "Pro", description: "Laporan outlet dan performa menu." },
      { id: "order-history", label: "Riwayat Pesanan", icon: ReceiptText, minTier: "Starter", description: "Daftar transaksi pelanggan dan invoice." },
      { id: "pos", label: "Resto POS", icon: ShoppingCart, minTier: "Starter", description: "Sistem kasir utama restoran." },
      { id: "menu-settings", label: "Menu POS", icon: ListChecks, minTier: "Starter", description: "Atur kategori dan menu yang tampil di POS." },
      { id: "table-order", label: "Table Management", icon: MapPin, minTier: "Starter", description: "Manajemen meja & reservasi." },
      { id: "kds", label: "Kitchen Display", icon: ChefHat, minTier: "Growth", description: "Antrean pesanan multi-station dapur." },
      { id: "inventory", label: "Inventory & COGS", icon: Package, minTier: "Growth", description: "Manajemen stok & HPP kompleks." },
      { id: "reservation", label: "Reservasi", icon: Clock, minTier: "Growth", description: "Booking jadwal restoran." },
      { id: "split-bill", label: "Split Bill", icon: Users, minTier: "Growth", description: "Pisah tagihan per tamu atau meja." },
    ]
  },
  "bakery": {
    id: "bakery",
    name: "Bakery & Cake Shop",
    modules: [
      { id: "sales-dashboard", label: "Sales & Waste Report", icon: BarChart3, minTier: "Growth", description: "Laporan penjualan, produksi, dan waste." },
      { id: "order-history", label: "Riwayat Pesanan", icon: ReceiptText, minTier: "Starter", description: "Daftar transaksi pelanggan dan invoice." },
      { id: "pos", label: "Bakery POS", icon: ShoppingCart, minTier: "Starter", description: "Kasir retail bakery." },
      { id: "menu-settings", label: "Menu POS", icon: ListChecks, minTier: "Starter", description: "Atur kategori dan menu yang tampil di POS." },
      { id: "pre-order", label: "Pre-Order", icon: BookOpen, minTier: "Starter", description: "Manajemen PO & Custom Cake." },
      { id: "kds", label: "Production Display", icon: ChefHat, minTier: "Growth", description: "Jadwal produksi dapur harian." },
      { id: "inventory", label: "Inventory & Resep", icon: Package, minTier: "Starter", description: "Stok bahan roti & kue." },
      { id: "batch-stock", label: "Batch Stock", icon: Package, minTier: "Growth", description: "Kontrol batch, display stock, dan tanggal produksi." },
      { id: "waste-report", label: "Waste Report", icon: Target, minTier: "Growth", description: "Catat waste produksi dan produk display." },
      { id: "wholesale", label: "B2B Wholesale", icon: Store, minTier: "Pro", description: "Penjualan grosir & reseller." },
    ]
  },
  "cloud-kitchen": {
    id: "cloud-kitchen",
    name: "Cloud Kitchen",
    modules: [
      { id: "sales-dashboard", label: "Consolidated Sales", icon: BarChart3, minTier: "Starter", description: "Dasbor gabungan multi-brand." },
      { id: "order-history", label: "Riwayat Pesanan", icon: ReceiptText, minTier: "Starter", description: "Daftar transaksi pelanggan dan invoice." },
      { id: "order-hub", label: "Order Hub", icon: Store, minTier: "Starter", description: "Pusat pesanan dari banyak channel." },
      { id: "pos", label: "POS", icon: ShoppingCart, minTier: "Starter", description: "Kasir & input manual pesanan." },
      { id: "menu-settings", label: "Menu POS", icon: ListChecks, minTier: "Starter", description: "Atur kategori dan menu yang tampil di POS." },
      { id: "multi-brand", label: "Multi-Brand Menu", icon: BookOpen, minTier: "Starter", description: "Kelola banyak brand dalam 1 sistem." },
      { id: "kds", label: "Kitchen Display", icon: ChefHat, minTier: "Starter", description: "Antrean dapur terpusat." },
      { id: "inventory", label: "Inventory & Recipe Costing", icon: Package, minTier: "Starter", description: "Stok gudang pusat, resep, dan HPP." },
      { id: "delivery-integration", label: "Delivery Integrations", icon: Store, minTier: "Growth", description: "Integrasi Grab/Gojek/Shopee." },
      { id: "delivery-status", label: "Delivery Status", icon: MapPin, minTier: "Growth", description: "Pantau status pickup dan pengiriman." },
    ]
  },
  "food-court": {
    id: "food-court",
    name: "Food Court / Pujasera",
    modules: [
      { id: "sales-dashboard", label: "Master Dashboard", icon: BarChart3, minTier: "Growth", description: "Pantau sales semua tenant." },
      { id: "order-history", label: "Riwayat Pesanan", icon: ReceiptText, minTier: "Starter", description: "Daftar transaksi pelanggan dan invoice." },
      { id: "pos", label: "Central POS", icon: ShoppingCart, minTier: "Starter", description: "Kasir pusat food court." },
      { id: "menu-settings", label: "Menu POS", icon: ListChecks, minTier: "Starter", description: "Atur kategori dan menu yang tampil di POS." },
      { id: "tenant-management", label: "Tenant Management", icon: Users, minTier: "Starter", description: "Kelola tenant & bagi hasil (revenue split)." },
      { id: "kds", label: "Tenant Kitchen Display", icon: ChefHat, minTier: "Growth", description: "Layar antrean per tenant." },
      { id: "tenant-settlement", label: "Tenant Settlement", icon: Target, minTier: "Growth", description: "Rekap settlement dan bagi hasil tenant." },
      { id: "promo-rules", label: "Promo Rules", icon: BookOpen, minTier: "Growth", description: "Aturan promo per tenant." },
      { id: "admin-tenant-dashboard", label: "Admin Tenant Dashboard", icon: BarChart3, minTier: "Growth", description: "Dashboard admin untuk performa tenant." },
    ]
  }
};
