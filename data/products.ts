export type Product = {
  name: string;
  category: "Website" | "Business System" | "Commerce" | "AI & Automation" | "Industry System" | "Integration";
  description: string;
  features: string[];
  industries: string[];
  accent: "blue" | "purple" | "emerald" | "orange" | "cyan" | "pink";
};

export const categories = ["All", "Website", "Business System", "Commerce", "AI & Automation", "Industry System", "Integration"] as const;

export const products: Product[] = [
  {
    name: "Omnia Profile",
    category: "Website",
    description: "Company Profile Dan Landing Page Modern Untuk Membangun Kredibilitas, Menjelaskan Layanan, Dan Menghasilkan Leads.",
    features: ["Responsive Layout", "SEO Foundation", "WhatsApp CTA", "Service Catalog", "Lead Form", "Analytics Setup"],
    industries: ["Semua Bisnis", "Jasa Profesional", "Company"],
    accent: "blue"
  },
  {
    name: "Omnia Commerce",
    category: "Commerce",
    description: "Online Store Dengan Katalog, Checkout, Pembayaran, Promo, Dan Manajemen Order Untuk Brand Yang Ingin Jualan Online.",
    features: ["Product Catalog", "Checkout Flow", "Payment Gateway", "Voucher Rules", "Order Dashboard", "Customer Notification"],
    industries: ["Retail", "Fashion", "Beauty"],
    accent: "pink"
  },
  {
    name: "Omnia POS",
    category: "Business System",
    description: "POS Dan Inventory Untuk Transaksi, Stok, Shift Kasir, Laporan Penjualan, Dan Monitoring Multi-Cabang.",
    features: ["Cashier Mode", "Barcode Scanner", "Stock Opname", "Shift Closing", "Branch Report", "Low Stock Alert"],
    industries: ["Retail", "F&B", "Apotek"],
    accent: "emerald"
  },
  {
    name: "Omnia ERP",
    category: "Business System",
    description: "Sistem Operasional Bisnis Untuk Finance, Inventory, Approval, HRD, Audit Log, Dan Dashboard Owner.",
    features: ["Role Permission", "Approval Workflow", "Inventory Control", "Finance Report", "Audit Log", "Owner Dashboard"],
    industries: ["Distribusi", "Manufaktur", "Franchise"],
    accent: "purple"
  },
  {
    name: "Omnia KlinikOps",
    category: "Industry System",
    description: "Sistem Klinik Dan Rekam Medis Ringan Untuk Klinik Umum, Dentist, Klinik Kecantikan, Veterinary Clinic, Dan Apotek.",
    features: ["Patient Booking", "Medical Record", "E-Prescription", "Pharmacy Stock", "Doctor Schedule", "Treatment Reminder"],
    industries: ["Klinik", "Dentist", "Vet"],
    accent: "blue"
  },
  {
    name: "Omnia CRM",
    category: "Business System",
    description: "Lead Dan Customer Management Agar Follow-Up Sales, Pipeline, Riwayat Kontak, Dan Reminder Lebih Terukur.",
    features: ["Lead Pipeline", "Contact History", "Follow-Up Reminder", "Sales Notes", "Lead Source", "Team Assignment"],
    industries: ["Properti", "Jasa", "Franchise"],
    accent: "cyan"
  },
  {
    name: "Omnia Assist AI",
    category: "AI & Automation",
    description: "AI Chatbot Dan Lead Assistant Untuk Menjawab Pertanyaan, Mengambil Data Calon Customer, Dan Membantu Follow-Up.",
    features: ["FAQ Bot", "Lead Capture", "Chat Summary", "Intent Detection", "WhatsApp Handoff", "Knowledge Base"],
    industries: ["Jasa", "Klinik", "E-Commerce"],
    accent: "purple"
  },
  {
    name: "Omnia Helpdesk",
    category: "Business System",
    description: "Ticketing Dan Support System Untuk Tim Layanan Pelanggan, Operasional Internal, After-Sales, Dan Maintenance.",
    features: ["Ticket Status", "SLA Tracking", "Knowledge Base", "Agent Assignment", "Priority Label", "Customer Portal"],
    industries: ["SaaS", "Service", "Internal Ops"],
    accent: "orange"
  },
  {
    name: "Omnia Booking",
    category: "Industry System",
    description: "Appointment Dan Scheduling System Untuk Bisnis Berbasis Jadwal, Kapasitas, Slot, Dan Reminder Otomatis.",
    features: ["Slot Management", "Calendar View", "Reminder Automation", "Staff Schedule", "Capacity Rules", "Booking History"],
    industries: ["Klinik", "Salon", "Kursus"],
    accent: "emerald"
  },
  {
    name: "Omnia API Bridge",
    category: "Integration",
    description: "Integrasi API Dan Automasi Data Antar Sistem Bisnis, Payment, WhatsApp, Cloud, Dashboard, Dan Database.",
    features: ["REST API", "Webhook", "Data Sync", "Payment Integration", "WhatsApp API", "Cloud Deployment"],
    industries: ["Enterprise", "Marketplace", "Operasional"],
    accent: "cyan"
  },
  {
    name: "Omnia Dashboard",
    category: "Business System",
    description: "Dashboard KPI Untuk Owner Dan Manager Agar Data Penjualan, Operasional, Stok, Leads, Dan Performa Tim Lebih Mudah Dibaca.",
    features: ["KPI Cards", "Trend Chart", "Export Report", "Role-Based View", "Branch Filter", "Realtime Summary"],
    industries: ["Multi-Cabang", "Owner", "Manajemen"],
    accent: "orange"
  },
  {
    name: "Omnia Partner Portal",
    category: "Industry System",
    description: "Portal Khusus Untuk Vendor, Mitra, Franchisee, Supplier, Atau Client Agar Dokumen Dan Status Kerja Lebih Transparan.",
    features: ["Partner Login", "Document Upload", "Approval Status", "Performance Report", "Announcement", "Task Checklist"],
    industries: ["Supplier", "Franchise", "Jasa"],
    accent: "pink"
  }
];
