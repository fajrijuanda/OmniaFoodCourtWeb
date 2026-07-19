import { Users, Coffee, Utensils, Building2 } from "lucide-react";

export const navItems = [
  ["Solusi", "#solusi"],
  ["Industri", "#industri"],
  ["Proses", "#proses"],
  ["Portfolio", "#portfolio"],
  ["FAQ", "#faq"]
];

export const serviceCards = [
  {
    title: "HRIS",
    text: "Attendance, payroll, leave management, employee self-service, performance review, dan reporting.",
    icon: Users,
    mockup: "hris"
  },
  {
    title: "F&B POS",
    text: "POS system, inventory management, table management, QR order, loyalty program, dan owner dashboard.",
    icon: Coffee,
    mockup: "cafe"
  },
  {
    title: "F&B Operations",
    text: "Multi-branch POS, recipe management, kitchen display system, reservation, cost control, dan report.",
    icon: Utensils,
    mockup: "restaurant"
  },
  {
    title: "ERP",
    text: "Finance, accounting, procurement, CRM, warehouse management, production planning, dan analytics.",
    icon: Building2,
    mockup: "erp"
  }
];

export const processSteps = [
  ["01", "Konsultasi Kebutuhan", "Mapping tujuan bisnis, pain point, role user, prioritas fitur, dan target operasional."],
  ["02", "Blueprint & Scope", "Menyusun modul, estimasi tier, workflow, timeline, dan batasan implementasi yang jelas."],
  ["03", "Design & Development", "Membangun UI, database, dashboard, integrasi, dan automation secara bertahap."],
  ["04", "Launch & Growth", "Testing, deployment, monitoring, maintenance, dan pengembangan fitur berkelanjutan."]
];

export const basePlanFeatures = [
  "1 outlet aktif",
  "1-3 user awal",
  "Report dasar",
  "Dashboard owner",
  "Reminder / automation",
  "Multi-outlet / cabang",
  "Role permission & approval",
  "Integrasi dasar",
  "SLA & priority support"
];

export const industryTone: Record<string, string> = {
  "F&B / Kuliner": "orange",
  "Kesehatan & Klinik": "blue",
  "Retail & Toko": "emerald",
  "E-Commerce & Marketplace": "pink",
  "Pendidikan & Kursus": "purple",
  "Jasa Profesional": "cyan",
  "Distribusi & Supplier": "indigo",
  "Manufaktur Ringan": "teal",
  "Properti & Real Estate": "violet",
  "Franchise & Kemitraan": "amber",
  "Event & Komunitas": "rose",
  "Layanan Publik": "sky"
};

export const toneClasses: Record<string, { text: string; bg: string; softBg: string; border: string; hoverBg: string; hoverRing: string }> = {
  orange: { text: "text-orange-500", bg: "bg-orange-500", softBg: "bg-orange-50", border: "border-orange-200", hoverBg: "hover:!bg-orange-500", hoverRing: "hover:ring-orange-200" },
  blue: { text: "text-blue-600", bg: "bg-blue-600", softBg: "bg-blue-50", border: "border-blue-200", hoverBg: "hover:!bg-blue-600", hoverRing: "hover:ring-blue-200" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-600", softBg: "bg-emerald-50", border: "border-emerald-200", hoverBg: "hover:!bg-emerald-600", hoverRing: "hover:ring-emerald-200" },
  purple: { text: "text-purple-600", bg: "bg-purple-600", softBg: "bg-purple-50", border: "border-purple-200", hoverBg: "hover:!bg-purple-600", hoverRing: "hover:ring-purple-200" },
  pink: { text: "text-pink-600", bg: "bg-pink-600", softBg: "bg-pink-50", border: "border-pink-200", hoverBg: "hover:!bg-pink-600", hoverRing: "hover:ring-pink-200" },
  cyan: { text: "text-cyan-600", bg: "bg-cyan-600", softBg: "bg-cyan-50", border: "border-cyan-200", hoverBg: "hover:!bg-cyan-600", hoverRing: "hover:ring-cyan-200" },
  amber: { text: "text-amber-600", bg: "bg-amber-500", softBg: "bg-amber-50", border: "border-amber-200", hoverBg: "hover:!bg-amber-500", hoverRing: "hover:ring-amber-200" },
  lime: { text: "text-lime-700", bg: "bg-lime-600", softBg: "bg-lime-50", border: "border-lime-200", hoverBg: "hover:!bg-lime-600", hoverRing: "hover:ring-lime-200" },
  indigo: { text: "text-indigo-600", bg: "bg-indigo-600", softBg: "bg-indigo-50", border: "border-indigo-200", hoverBg: "hover:!bg-indigo-600", hoverRing: "hover:ring-indigo-200" },
  rose: { text: "text-rose-600", bg: "bg-rose-600", softBg: "bg-rose-50", border: "border-rose-200", hoverBg: "hover:!bg-rose-600", hoverRing: "hover:ring-rose-200" },
  violet: { text: "text-violet-600", bg: "bg-violet-600", softBg: "bg-violet-50", border: "border-violet-200", hoverBg: "hover:!bg-violet-600", hoverRing: "hover:ring-violet-200" },
  teal: { text: "text-teal-600", bg: "bg-teal-600", softBg: "bg-teal-50", border: "border-teal-200", hoverBg: "hover:!bg-teal-600", hoverRing: "hover:ring-teal-200" },
  sky: { text: "text-sky-600", bg: "bg-sky-600", softBg: "bg-sky-50", border: "border-sky-200", hoverBg: "hover:!bg-sky-600", hoverRing: "hover:ring-sky-200" }
};

export const industryBasePrice: Record<string, string[]> = {
  "Kesehatan & Klinik": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Retail & Toko": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "F&B / Kuliner": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp6jt"],
  "E-Commerce & Marketplace": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Pendidikan & Kursus": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp5jt"],
  "Jasa Profesional": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Distribusi & Supplier": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Manufaktur Ringan": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Properti & Real Estate": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Franchise & Kemitraan": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Event & Komunitas": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Layanan Publik": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"]
};

export const segmentPriceOverride: Record<string, string[]> = {
  // F&B / Kuliner
  "Cafe": ["Rp110rb", "Rp220rb", "Rp450rb", "Mulai Rp950rb"],
  "Restoran": ["Rp190rb", "Rp390rb", "Rp790rb", "Mulai Rp1,5jt"],
  "Cloud Kitchen": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp6jt"],
  "Bakery": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp6jt"],
  "Food Court": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],

  // Kesehatan & Klinik
  "Klinik Umum": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Dental Clinic": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Klinik Kecantikan": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Veterinary Clinic": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Apotek": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp5jt"],

  // Retail & Toko
  "Retail": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Toko Bangunan": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Fashion Store": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Toko Elektronik": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Retail Apotek": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],

  // E-Commerce & Marketplace
  "Brand D2C": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Fashion Online": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Beauty Store": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Elektronik": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Produk Digital": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],

  // Pendidikan & Kursus
  "Bimbel": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp5jt"],
  "Kursus Bahasa": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp5jt"],
  "Bootcamp": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp5jt"],
  "Sekolah": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Training Center": ["Rp499rb", "Rp999rb", "Rp2jt+", "Mulai Rp5jt"],

  // Jasa Profesional
  "Konsultan": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Law Firm": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Agency": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "HRIS": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Arsitek": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],
  "Kantor Akuntan": ["Rp499rb", "Rp1jt", "Rp2,5jt+", "Mulai Rp6jt"],

  // Distribusi & Supplier
  "FMCG": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Farmasi": ["Rp1,2jt", "Rp2,5jt", "Rp5jt+", "Mulai Rp9jt"],
  "Bahan Bangunan": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Sparepart": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],
  "Grosir": ["Rp999rb", "Rp2jt", "Rp4jt+", "Mulai Rp8jt"],

  // Manufaktur Ringan
  "Konveksi": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Furniture": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Percetakan": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Makanan Kemasan": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Workshop": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],

  // Properti & Real Estate
  "Developer": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Broker": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Kost": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Apartemen": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Property Management": ["Rp1,2jt", "Rp2,5jt", "Rp5jt+", "Mulai Rp9jt"],

  // Franchise & Kemitraan
  "F&B Franchise": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Laundry": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Retail Franchise": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Education Franchise": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],
  "Kemitraan Brand": ["Rp1,5jt", "Rp3jt", "Rp6jt+", "Mulai Rp10jt"],

  // Event & Komunitas
  "Seminar": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Event & Komunitas::Workshop": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Expo": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7jt"],
  "Komunitas": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],
  "Event Organizer": ["Rp399rb", "Rp799rb", "Rp1,5jt+", "Mulai Rp5jt"],

  // Layanan Publik
  "Desa": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Kelurahan": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Yayasan": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Koperasi": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"],
  "Layanan Komunitas": ["Rp799rb", "Rp1,5jt", "Rp3jt+", "Mulai Rp7,5jt"]
};
