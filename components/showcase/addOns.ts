export type AddOnComplexity = "Lite" | "Standard" | "Advanced" | "Complex" | "Integration";

export type PricingAddOn = {
  id: string;
  name: string;
  category: string;
  complexity: AddOnComplexity;
  price: string;
  amount: number;
  description: string;
  bestFor: string;
  recommendedFor: string[];
  sourceApp?: string;
};

export const addOnPriceBands: Record<AddOnComplexity, { label: string; range: string }> = {
  Lite: { label: "Lite", range: "Rp29rb - Rp79rb / bulan" },
  Standard: { label: "Standard", range: "Rp99rb - Rp199rb / bulan" },
  Advanced: { label: "Advanced", range: "Rp199rb - Rp399rb / bulan" },
  Complex: { label: "Complex", range: "Rp399rb+ / bulan" },
  Integration: { label: "Integration", range: "Custom / mulai Rp499rb" }
};

export const addOnCatalog: PricingAddOn[] = [
  {
    id: "clinic-advanced-pharmacy",
    name: "Advanced Pharmacy Internal",
    category: "Healthcare",
    complexity: "Advanced",
    price: "Rp249rb",
    amount: 249000,
    description: "Batch/expiry obat, kartu stok, purchase order, stock opname, dan dispensing lanjutan untuk farmasi internal klinik.",
    bestFor: "Klinik yang punya farmasi internal aktif, tetapi belum membutuhkan aplikasi Apotek penuh.",
    recommendedFor: ["Klinik Umum", "Dental Clinic", "Klinik Kecantikan", "Veterinary Clinic"],
    sourceApp: "Apotek"
  },
  {
    id: "full-pharmacy-app",
    name: "Full Apotek App Add-on",
    category: "Healthcare",
    complexity: "Complex",
    price: "Rp499rb",
    amount: 499000,
    description: "POS apotek retail, margin obat, supplier reorder, batch/expiry chain, dan laporan penjualan obat penuh.",
    bestFor: "Klinik yang juga menjual obat retail atau memiliki unit apotek terpisah.",
    recommendedFor: ["Klinik Umum", "Dental Clinic", "Klinik Kecantikan"],
    sourceApp: "Apotek"
  },
  {
    id: "hris-lite",
    name: "HRIS Lite",
    category: "People Ops",
    complexity: "Standard",
    price: "Rp149rb",
    amount: 149000,
    description: "Data karyawan, jadwal shift, absensi sederhana, dan rekap kehadiran untuk tim operasional kecil.",
    bestFor: "Cafe, restoran, klinik, retail, atau service business dengan tim shift kecil.",
    recommendedFor: ["Cafe", "Restoran", "Klinik Umum", "Retail Apotek", "Minimarket", "Laundry"],
    sourceApp: "HRIS"
  },
  {
    id: "payroll-payslip",
    name: "Payroll & Payslip Add-on",
    category: "People Ops",
    complexity: "Advanced",
    price: "Rp299rb",
    amount: 299000,
    description: "Komponen gaji, potongan, tunjangan, payroll run, dan payslip digital untuk tim non-HRIS penuh.",
    bestFor: "Bisnis dengan payroll rutin, tetapi belum siap membeli HRIS lengkap.",
    recommendedFor: ["Cafe", "Restoran", "Klinik Umum", "Retail Apotek", "Franchise"],
    sourceApp: "HRIS"
  },
  {
    id: "advanced-inventory",
    name: "Advanced Inventory & Batch",
    category: "Operations",
    complexity: "Advanced",
    price: "Rp249rb",
    amount: 249000,
    description: "Stock opname, batch/expiry, transfer stok, reorder alert, dan kartu stok lintas cabang.",
    bestFor: "Bisnis dengan bahan/produk bernilai tinggi atau stok sensitif.",
    recommendedFor: ["Cafe", "Restoran", "Bakery", "Klinik Umum", "Apotek", "Retail Apotek", "Minimarket"]
  },
  {
    id: "finance-cashier",
    name: "Finance & Cashier Control",
    category: "Finance",
    complexity: "Advanced",
    price: "Rp199rb",
    amount: 199000,
    description: "Closing kasir, invoice, payment tracking, kas kecil, AR/AP sederhana, dan rekonsiliasi harian.",
    bestFor: "Owner yang ingin kontrol uang harian tanpa spreadsheet manual.",
    recommendedFor: ["Cafe", "Restoran", "Klinik Umum", "Apotek", "Retail", "Jasa Profesional"]
  },
  {
    id: "crm-loyalty",
    name: "CRM, Loyalty & Voucher",
    category: "Growth",
    complexity: "Standard",
    price: "Rp129rb",
    amount: 129000,
    description: "Database pelanggan, poin/member, voucher, campaign sederhana, dan repeat-order note.",
    bestFor: "Bisnis yang mulai mengejar repeat customer.",
    recommendedFor: ["Cafe", "Restoran", "Klinik Kecantikan", "Retail Apotek", "Beauty Store", "Fashion Store"]
  },
  {
    id: "wa-automation",
    name: "WhatsApp Reminder & Automation",
    category: "Automation",
    complexity: "Standard",
    price: "Rp149rb",
    amount: 149000,
    description: "Reminder booking, kontrol, invoice, follow-up pelanggan, dan template pesan operasional.",
    bestFor: "Bisnis berbasis appointment atau repeat visit.",
    recommendedFor: ["Klinik Umum", "Dental Clinic", "Klinik Kecantikan", "Veterinary Clinic", "Kursus Bahasa", "Jasa Profesional"]
  },
  {
    id: "ai-assistant",
    name: "AI Assistant & Knowledge Base",
    category: "AI",
    complexity: "Complex",
    price: "Rp399rb",
    amount: 399000,
    description: "AI assistant untuk FAQ, SOP, product knowledge, intake lead, dan draft response customer service.",
    bestFor: "Tim yang sering menjawab pertanyaan berulang atau butuh support internal cepat.",
    recommendedFor: ["Jasa Profesional", "Klinik Umum", "Cafe", "Restoran", "E-Commerce", "Education"]
  },
  {
    id: "multi-branch",
    name: "Multi-Branch Control",
    category: "Scale",
    complexity: "Complex",
    price: "Rp399rb",
    amount: 399000,
    description: "Cabang tambahan, role per cabang, transfer stok, dashboard cabang, dan laporan komparatif.",
    bestFor: "Bisnis yang mulai punya lebih dari satu outlet/cabang.",
    recommendedFor: ["Cafe", "Restoran", "Klinik Umum", "Apotek", "Retail", "Franchise"]
  },
  {
    id: "accounting-integration",
    name: "Accounting Integration",
    category: "Integration",
    complexity: "Integration",
    price: "Mulai Rp499rb",
    amount: 499000,
    description: "Integrasi jurnal, invoice, payment, dan chart of account ke sistem accounting eksternal.",
    bestFor: "Bisnis yang sudah punya pembukuan formal dan ingin mengurangi input ulang.",
    recommendedFor: ["Cafe", "Restoran", "Klinik Umum", "Distribusi", "Manufaktur", "Jasa Profesional"]
  },
  {
    id: "payment-delivery-integration",
    name: "Payment / Delivery Integration",
    category: "Integration",
    complexity: "Integration",
    price: "Mulai Rp499rb",
    amount: 499000,
    description: "Integrasi payment gateway, delivery aggregator, QRIS, callback status, dan settlement report.",
    bestFor: "Bisnis yang butuh transaksi online atau sinkronisasi delivery/payment.",
    recommendedFor: ["Cafe", "Restoran", "Cloud Kitchen", "E-Commerce", "Retail"]
  },
  {
    id: "compliance-audit",
    name: "Compliance & Audit Pack",
    category: "Governance",
    complexity: "Complex",
    price: "Rp399rb",
    amount: 399000,
    description: "Audit log lanjutan, approval matrix, export regulasi, backup policy, dan kontrol akses sensitif.",
    bestFor: "Bisnis dengan data sensitif atau kebutuhan audit internal.",
    recommendedFor: ["Klinik Umum", "Apotek", "HRIS", "Farmasi", "Finance", "Layanan Publik"]
  }
];

export function getSuggestedAddOns(industryName: string, segmentName: string) {
  const normalizedIndustry = industryName.toLowerCase();
  const normalizedSegment = segmentName.toLowerCase();
  return addOnCatalog.filter((addOn) =>
    addOn.recommendedFor.some((target) => {
      const normalizedTarget = target.toLowerCase();
      return normalizedTarget === normalizedSegment
        || normalizedSegment.includes(normalizedTarget)
        || normalizedTarget.includes(normalizedSegment)
        || normalizedIndustry.includes(normalizedTarget);
    })
  );
}
