import type { PricingTier } from "@/components/PricingPlanModal";
import type { PricingAddOn } from "@/components/showcase/addOns";
import { getSuggestedAddOns } from "@/components/showcase/addOns";
import { industryBasePrice, segmentPriceOverride } from "@/components/showcase/showcaseData";

const uppercaseWords = new Set(["AI", "API", "B2B", "CRM", "ERP", "F&B", "HR", "HRD", "HRIS", "KDS", "POS", "QR", "SOP", "WA"]);

const sharedAdvancedFeatures = [
  "Role permission & approval",
  "Owner dashboard & KPI",
  "Reminder / automation",
  "Integrasi dasar",
  "Audit log",
  "SLA & priority support",
  "Database dedicated"
];

const industryFeatureRows: Record<string, string[]> = {
  "F&B / Kuliner": [
    "Shift kasir & closing harian",
    "Recipe costing / bahan baku",
    "Kitchen / produksi status",
    "Promo, loyalty, dan voucher",
    "Laporan outlet & menu performance",
    "Multi-outlet stock transfer"
  ],
  "Kesehatan & Klinik": [
    "Data pasien & riwayat kunjungan",
    "Jadwal dokter / terapis",
    "Farmasi, resep, dan stok obat",
    "Reminder kontrol / vaksin",
    "Dashboard dokter & owner",
    "Akses role untuk kasir, dokter, farmasi"
  ],
  "Retail & Toko": [
    "Barcode / SKU management",
    "Stock opname & mutasi stok",
    "Supplier order & purchase tracking",
    "Retur, garansi, dan claim",
    "Loyalty / member pricing",
    "Laporan cabang & produk terlaris"
  ],
  "E-Commerce & Marketplace": [
    "Checkout & payment flow",
    "Order fulfillment dashboard",
    "Shipping / delivery status",
    "Promo, voucher, bundle",
    "Customer CRM & repeat order",
    "Return request / aftersales"
  ],
  "Pendidikan & Kursus": [
    "Data siswa / peserta",
    "Jadwal kelas & presensi",
    "Invoice / pembayaran kelas",
    "Portal materi / assignment",
    "Progress report",
    "Sertifikat / evaluasi"
  ],
  "Jasa Profesional": [
    "Lead intake & pipeline",
    "Booking / schedule management",
    "Document portal",
    "Proposal / approval tracker",
    "Client communication log",
    "Invoice & milestone billing"
  ],
  "Distribusi & Supplier": [
    "Sales order & price list B2B",
    "Warehouse stock & batch tracking",
    "Route / sales visit plan",
    "Invoice & receivable tracker",
    "Delivery / pickup schedule",
    "Sales target dashboard"
  ],
  "Manufaktur Ringan": [
    "Work order / job queue",
    "BOM / material usage",
    "QC checklist",
    "Production timeline",
    "Costing & waste report",
    "Delivery / handover tracker"
  ],
  "Properti & Real Estate": [
    "Listing / unit inventory",
    "Lead buyer / tenant CRM",
    "Booking unit / room availability",
    "Document pipeline",
    "Agent / vendor dashboard",
    "Maintenance / complaint ticket"
  ],
  "Franchise & Kemitraan": [
    "Outlet performance dashboard",
    "SOP / training portal",
    "Royalty / settlement report",
    "Raw material / stock order",
    "QC visit checklist",
    "Partner onboarding"
  ],
  "Event & Komunitas": [
    "Registration / ticketing",
    "QR check-in",
    "Reminder WA / email",
    "Sponsor / tenant dashboard",
    "Member / participant portal",
    "Certificate / feedback form"
  ],
  "Layanan Publik": [
    "Portal layanan publik",
    "Pengajuan surat / formulir",
    "Tracking status pengajuan",
    "Pengaduan / complaint desk",
    "Arsip digital",
    "Laporan transparansi"
  ]
};

const segmentFeatureRows: Record<string, string[]> = {
  "Cafe": [
    "Menu sederhana",
    "Riwayat transaksi",
    "Pembayaran tunai/QRIS manual",
    "Laporan harian ringkas",
    "QR/table order",
    "Promo sederhana"
  ],
  "Restoran": [
    "Resto POS",
    "Menu POS",
    "Riwayat order",
    "Table management dasar",
    "Open bill",
    "QR/table order",
    "Reservasi",
    "Split bill",
    "Inventory bahan",
    "COGS / recipe costing",
    "Pajak & service charge",
    "Laporan closing shift"
  ],
  "HRIS": [
    "Employee self-service",
    "Struktur organisasi & divisi",
    "Shift schedule & roster",
    "Cuti, izin, lembur",
    "Payroll component rules",
    "Payslip digital",
    "Export BPJS / PPh 21",
    "HR analytics dashboard"
  ],
  "Dental Clinic": ["Odontogram", "Treatment plan", "Follow-up kontrol", "Dokumentasi tindakan"],
  "Klinik Kecantikan": ["Treatment package", "Membership / paket sesi", "Product retail CRM", "Before-after treatment log"],
  "Apotek": ["Batch obat", "Expiry alert", "Supplier reorder", "Margin obat"],
  "Food Court": ["Tenant settlement", "Tenant performance", "Promo rules per tenant", "Admin tenant dashboard"],
  "Sekolah": ["PPDB", "Student master data", "Pengumuman sekolah", "Billing siswa"],
  "Farmasi": ["Compliance report", "B2B order apotek", "Batch / expiry chain", "Distributor invoice"],
  "Property Management": ["Vendor portal", "Work order", "Inspection checklist", "Owner report"],
  "Expo": ["Exhibitor portal", "Booth map", "Visitor check-in", "Sponsor dashboard"]
};

const tierProfiles: Record<string, Array<Pick<PricingTier, "description" | "fit" | "limits">>> = {
  default: [
    { description: "Untuk mulai digitalisasi workflow inti dan laporan dasar.", fit: "1 outlet, tim kecil, validasi awal.", limits: ["1 outlet", "1-3 user", "report dasar"] },
    { description: "Untuk tim aktif yang butuh workflow lengkap, dashboard, dan automation ringan.", fit: "Operasional mulai rutin pakai sistem.", limits: ["1 outlet", "hingga 8 user", "automation ringan"] },
    { description: "Untuk multi-role, cabang, approval, integrasi dasar, dan support prioritas.", fit: "Bisnis bertumbuh atau multi-cabang.", limits: ["multi-cabang", "hingga 25 user", "approval & integrasi"] },
    { description: "Untuk scope custom, SLA, database dedicated, dan integrasi kompleks.", fit: "Franchise, korporasi, atau data sensitif.", limits: ["custom outlet", "custom user", "database dedicated"] }
  ],
  hris: [
    { description: "Untuk merapikan database karyawan, absensi, cuti, dan payroll sederhana.", fit: "Tim kecil yang mulai menata HR digital.", limits: ["hingga 25 karyawan", "1 admin HR", "1 lokasi kerja"] },
    { description: "Untuk HR aktif dengan approval cuti, lembur, payslip, dan dashboard bulanan.", fit: "Perusahaan kecil-menengah dengan proses HR rutin.", limits: ["hingga 75 karyawan", "3 admin/approver", "multi shift"] },
    { description: "Untuk multi-divisi, approval berjenjang, payroll rule lebih kompleks, dan integrasi dasar.", fit: "Perusahaan bertumbuh dengan beberapa lokasi/divisi.", limits: ["hingga 200 karyawan", "multi lokasi/divisi", "approval berjenjang"] },
    { description: "Untuk jumlah karyawan custom, SLA, database dedicated, SSO/API, dan integrasi payroll kompleks.", fit: "Korporasi atau data karyawan sensitif.", limits: ["custom karyawan", "SSO/API payroll", "database dedicated"] }
  ],
  franchise: [
    { description: "Untuk pilot outlet atau calon mitra awal dengan modul inti.", fit: "Validasi 1 outlet atau partner kecil.", limits: ["1 outlet", "3 user", "SOP dasar"] },
    { description: "Untuk outlet aktif dengan dashboard, SOP, dan monitoring rutin.", fit: "Brand mulai mengelola beberapa proses outlet.", limits: ["hingga 3 outlet", "10 user", "training portal"] },
    { description: "Untuk multi-outlet dengan royalty, QC, approval, dan laporan cabang.", fit: "Franchise bertumbuh dengan cabang aktif.", limits: ["hingga 10 outlet", "30 user", "royalty/QC"] },
    { description: "Untuk jaringan besar, SLA, dashboard owner, dan integrasi kompleks.", fit: "Franchise atau kemitraan skala besar.", limits: ["custom outlet", "custom role", "SLA"] }
  ],
  manufacturing: [
    { description: "Untuk tracking order produksi, bahan, dan status pekerjaan dasar.", fit: "Workshop atau produksi kecil.", limits: ["1 lini produksi", "3 user", "report dasar"] },
    { description: "Untuk produksi rutin dengan material usage, QC, dan timeline.", fit: "Tim produksi yang mulai terstruktur.", limits: ["hingga 2 lini", "10 user", "QC checklist"] },
    { description: "Untuk multi-role, costing, approval, stok bahan, dan laporan owner.", fit: "Pabrik ringan atau workshop bertumbuh.", limits: ["multi-lini", "25 user", "costing & approval"] },
    { description: "Untuk MRP custom, integrasi mesin/API, SLA, dan database dedicated.", fit: "Manufaktur kompleks atau multi-site.", limits: ["custom lini", "custom user", "integrasi kompleks"] }
  ]
};

const cafeProfiles: Array<Pick<PricingTier, "description" | "fit" | "limits">> = [
  {
    description: "Untuk kedai kopi kecil yang butuh kasir sederhana, menu dasar, dan riwayat transaksi harian.",
    fit: "Kedai kopi kecil, 1 outlet, owner merangkap kasir/barista.",
    limits: ["1 outlet", "1 kasir aktif", "menu & laporan dasar"]
  },
  {
    description: "Untuk cafe yang mulai ramai dan butuh order meja/QR, stok bahan sederhana, promo, dan closing shift.",
    fit: "Cafe kecil-menengah dengan transaksi harian rutin.",
    limits: ["1 outlet", "hingga 4 user", "QR order & inventory dasar"]
  },
  {
    description: "Untuk cafe bertumbuh yang butuh KDS/bar queue, dashboard owner, recipe costing, dan kontrol tim lebih rapi.",
    fit: "Cafe ramai, beberapa role operasional, atau persiapan outlet kedua.",
    limits: ["hingga 2 outlet", "hingga 10 user", "KDS & dashboard owner"]
  },
  {
    description: "Untuk jaringan cafe atau brand yang butuh multi-outlet, integrasi, SLA, dan penyesuaian workflow.",
    fit: "Multi-outlet, franchise awal, atau brand cafe dengan kebutuhan custom.",
    limits: ["custom outlet", "custom user", "integrasi & SLA"]
  }
];

const restaurantProfiles: Array<Pick<PricingTier, "description" | "fit" | "limits">> = [
  {
    description: "Untuk restoran kecil yang butuh POS dine-in, menu, riwayat order, dan table management dasar.",
    fit: "Restoran kecil, warung modern, atau rumah makan 1 outlet.",
    limits: ["1 outlet", "1 kasir aktif", "meja & open bill dasar"]
  },
  {
    description: "Untuk restoran yang mulai ramai dan butuh reservasi, split bill, QR order, inventory dasar, dan closing shift.",
    fit: "Restoran dine-in aktif dengan waiter dan kasir terpisah.",
    limits: ["1 outlet", "hingga 6 user", "reservasi & inventory dasar"]
  },
  {
    description: "Untuk restoran bertumbuh yang butuh KDS multi-station, COGS, outlet report, role permission, dan kontrol operasional lebih lengkap.",
    fit: "Restoran ramai, multi-area, atau persiapan outlet kedua.",
    limits: ["hingga 2 outlet", "hingga 15 user", "KDS & COGS"]
  },
  {
    description: "Untuk grup restoran atau brand multi-outlet dengan kebutuhan integrasi, SLA, audit, dan workflow custom.",
    fit: "Multi-outlet, grup restoran, atau franchise restoran.",
    limits: ["custom outlet", "custom user", "integrasi & SLA"]
  }
];

const hrisPackageTiers: Array<Pick<PricingTier, "name" | "price" | "description" | "fit" | "limits" | "highlight"> & { baseTierIndex: 0 | 1 | 2 }> = [
  {
    baseTierIndex: 0,
    name: "HRIS Starter Paket Hemat",
    price: "Rp 275.000/bulan/maks. 50 kryw",
    description: tierProfiles.hris[0].description,
    fit: "Diskon Rp 50.000 untuk tim sampai 50 karyawan.",
    limits: ["maks. 50 karyawan", "diskon Rp 50.000"]
  },
  {
    baseTierIndex: 1,
    name: "HRIS Growth Paket Hemat",
    price: "Rp 320.000/bulan/maks. 50 kryw",
    description: tierProfiles.hris[1].description,
    fit: "Hemat 20% (-Rp 80.000) untuk tim sampai 50 karyawan.",
    limits: ["maks. 50 karyawan", "hemat 20%"]
  },
  {
    baseTierIndex: 2,
    name: "HRIS Pro Paket Hemat",
    price: "Rp 450.000/bulan/maks. 50 kryw",
    description: tierProfiles.hris[2].description,
    fit: "Hemat 25% (-Rp 150.000) untuk tim sampai 50 karyawan.",
    limits: ["maks. 50 karyawan", "hemat 25%"]
  },
  {
    baseTierIndex: 0,
    name: "HRIS Starter Paket Hemat+",
    price: "Rp 520.000/bulan/maks. 100 kryw",
    description: tierProfiles.hris[0].description,
    fit: "Hemat 20% (-Rp 130.000) + free slot 20 karyawan; Rp 4.333/HC.",
    limits: ["maks. 100 karyawan", "free slot 20 karyawan", "Rp 4.333/HC"]
  },
  {
    baseTierIndex: 1,
    name: "HRIS Growth Paket Hemat+",
    price: "Rp 640.000/bulan/maks. 100 kryw",
    description: tierProfiles.hris[1].description,
    fit: "Hemat 20% (-Rp 160.000) + free slot 25 karyawan; Rp 5.120/HC.",
    limits: ["maks. 100 karyawan", "free slot 25 karyawan", "Rp 5.120/HC"],
    highlight: true
  },
  {
    baseTierIndex: 2,
    name: "HRIS Pro Paket Hemat+",
    price: "Rp 900.000/bulan/maks. 100 kryw",
    description: tierProfiles.hris[2].description,
    fit: "Hemat 25% (-Rp 300.000) + free slot 50 karyawan; Rp 6.000/HC.",
    limits: ["maks. 100 karyawan", "free slot 50 karyawan", "Rp 6.000/HC"]
  }
];

export function toTitleCase(value: string) {
  return value
    .replace(/\.$/, "")
    .split(" ")
    .map((word) => (uppercaseWords.has(word.toUpperCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
}

export function getSegmentModules(offer: string) {
  return offer
    .replace(/\.$/, "")
    .split(",")
    .map((item) => toTitleCase(item.trim()))
    .filter(Boolean)
    .slice(0, 8);
}

function uniqueRows(rows: string[]) {
  return Array.from(new Set(rows.filter(Boolean)));
}

function getProfiles(industryName: string, segmentName: string) {
  if (industryName === "F&B / Kuliner" && segmentName === "Cafe") return cafeProfiles;
  if (industryName === "F&B / Kuliner" && segmentName === "Restoran") return restaurantProfiles;
  if (segmentName === "HRIS") return tierProfiles.hris;
  if (industryName === "Franchise & Kemitraan") return tierProfiles.franchise;
  if (industryName === "Manufaktur Ringan") return tierProfiles.manufacturing;
  return tierProfiles.default;
}

function getTierThresholds(industryName: string, segmentName: string) {
  if (industryName === "F&B / Kuliner" && segmentName === "Cafe") {
    return [
      { modules: 1, segment: 2, industry: 1, advanced: 0 },
      { modules: 3, segment: 5, industry: 3, advanced: 1 },
      { modules: 4, segment: 6, industry: 5, advanced: 4 },
      null
    ] as const;
  }

  if (industryName === "F&B / Kuliner" && segmentName === "Restoran") {
    return [
      { modules: 0, segment: 4, industry: 1, advanced: 0 },
      { modules: 2, segment: 9, industry: 3, advanced: 1 },
      { modules: 5, segment: 12, industry: 5, advanced: 4 },
      null
    ] as const;
  }

  return [
    { modules: 3, segment: 2, industry: 2, advanced: 0 },
    { modules: 6, segment: 5, industry: 4, advanced: 3 },
    { modules: 8, segment: 7, industry: 6, advanced: 6 },
    null
  ] as const;
}

function includedRows(featureRows: string[], thresholds: { modules: number; industry: number; segment: number; advanced: number }, groups: { modules: string[]; industryRows: string[]; segmentRows: string[]; advancedRows: string[] }) {
  const included = new Set<string>([
    "Core workflow sub-industri",
    ...groups.modules.slice(0, thresholds.modules),
    ...groups.industryRows.slice(0, thresholds.industry),
    ...groups.segmentRows.slice(0, thresholds.segment),
    ...groups.advancedRows.slice(0, thresholds.advanced)
  ]);

  return featureRows.map((feature) => included.has(feature));
}

export function buildPlans(industryName: string, segmentName: string, modules: string[]): { featureRows: string[]; tiers: PricingTier[]; addOns: PricingAddOn[] } {
  const prices = segmentPriceOverride[`${industryName}::${segmentName}`] ?? segmentPriceOverride[segmentName] ?? industryBasePrice[industryName] ?? ["Rp499rb", "Rp1,5jt", "Rp3,5jt", "Mulai Rp7,5jt"];
  const segmentRows = segmentFeatureRows[segmentName] ?? [];
  const industryRows = industryFeatureRows[industryName] ?? [];
  const advancedRows = segmentName === "HRIS"
    ? ["Approval berjenjang HR", "Payroll formula custom", "Integrasi mesin absensi", "Integrasi accounting", "Audit log HR", "SLA & priority support", "Database dedicated"]
    : sharedAdvancedFeatures;
  const featureRows = uniqueRows(["Core workflow sub-industri", ...modules, ...segmentRows, ...industryRows, ...advancedRows]);
  const profiles = getProfiles(industryName, segmentName);
  const groups = { modules, industryRows, segmentRows, advancedRows };
  const thresholds = getTierThresholds(industryName, segmentName);

  const baseTiers: PricingTier[] = [
    {
        name: `${segmentName} Starter`,
        price: prices[0],
        cadence: "/ bulan",
        ...profiles[0],
        features: includedRows(featureRows, thresholds[0], groups)
    },
    {
        name: `${segmentName} Growth`,
        price: prices[1],
        cadence: "/ bulan",
        ...profiles[1],
        highlight: true,
        features: includedRows(featureRows, thresholds[1], groups)
    },
    {
        name: `${segmentName} Pro`,
        price: prices[2],
        cadence: "/ bulan",
        ...profiles[2],
        features: includedRows(featureRows, thresholds[2], groups)
    },
    {
        name: `${segmentName} Enterprise`,
        price: prices[3],
        cadence: "/ bulan",
        ...profiles[3],
        features: featureRows.map(() => true)
    }
  ];
  const tiers = segmentName === "HRIS"
    ? [
        ...baseTiers.slice(0, 3),
        ...hrisPackageTiers.map((tier) => ({
          ...tier,
          cadence: "/ bulan",
          features: baseTiers[tier.baseTierIndex].features
        })),
        baseTiers[3]
      ]
    : baseTiers;

  return {
    featureRows,
    addOns: getSuggestedAddOns(industryName, segmentName),
    tiers
  };
}

export function getPlansFromCatalog(catalog: any[], industryName: string, segmentName: string, modules: string[]) {
  const ind = catalog.find((i) => i.name === industryName);
  const sub = ind?.subIndustries?.find((s: any) => s.name === segmentName);
  if (!sub) return null;
  return {
    featureRows: sub.features.map((f: any) => f.name),
    tiers: sub.tiers.map((t: any) => ({
      name: t.name.replace(sub.name, "").trim() || t.name,
      price: t.price,
      cadence: t.cadence,
      description: t.description,
      fit: t.fit,
      limits: t.limitsJson,
      highlight: t.highlight,
      features: sub.features.map((f: any) => {
        const tf = t.tierFeatures.find((x: any) => x.featureId === f.id);
        return tf ? tf.included : false;
      })
    })),
    addOns: getSuggestedAddOns(industryName, segmentName)
  };
}
