export type PortalPage =
  | "home"
  | "apps"
  | "industry"
  | "sub-industry"
  | "professional-services"
  | "hris"
  | "hris-employees"
  | "hris-attendance"
  | "hris-leave"
  | "hris-payroll"
  | "hris-payslip"
  | "hris-dashboard"
  | "hris-advanced-payroll"
  | "hris-reimbursement"
  | "hris-loans"
  | "hris-field-report"
  | "hris-performance"
  | "hris-recruitment"
  | "hris-settings"
  | "reports"
  | "notifications"
  | "billing"
  | "access"
  | "settings"
  | "settings-security"
  | "profile"
  | "faq"
  | "fnb"
  | "fnb-cafe"
  | "fnb-restaurant"
  | "fnb-bakery"
  | "fnb-cloud-kitchen"
  | "fnb-food-court"
  | "fnb-order-history"
  | "fnb-pos"
  | "fnb-menu"
  | "fnb-kds"
  | "fnb-inventory"
  | "fnb-sales"
  | "fnb-settings"
  | "fnb-table-order"
  | "fnb-reservation"
  | "fnb-pre-order"
  | "fnb-wholesale"
  | "fnb-loyalty"
  | "fnb-shift-closing"
  | "fnb-split-bill"
  | "fnb-batch-stock"
  | "fnb-waste-report"
  | "fnb-order-hub"
  | "fnb-multi-brand"
  | "fnb-delivery-integration"
  | "fnb-delivery-status"
  | "fnb-tenant-management"
  | "fnb-tenant-settlement"
  | "fnb-promo-rules"
  | "fnb-admin-tenant-dashboard"
  | "church"
  | "church-jemaat"
  | "church-komsel"
  | "church-ibadah"
  | "church-pelayanan"
  | "church-keuangan"
  | "church-aset"
  | "church-dashboard"
  | "church-settings"
  | "clinic"
  | "clinic-dashboard"
  | "clinic-analytics"
  | "clinic-patients"
  | "clinic-appointments"
  | "clinic-queue"
  | "clinic-nurse-station"
  | "clinic-visits"
  | "clinic-prescriptions"
  | "clinic-pharmacy"
  | "clinic-cashier"
  | "clinic-finance"
  | "clinic-integrations"
  | "clinic-settings"
  | "social-commerce-intelligence"
  | "social-intel-dashboard"
  | "social-intel-setup"
  | "social-intel-product-radar"
  | "social-intel-creator-intelligence"
  | "social-intel-competitor-watchlist"
  | "social-intel-live-cockpit"
  | "social-intel-ad-radar"
  | "social-intel-campaign-planner"
  | "social-intel-experiment-board"
  | "social-intel-reports"
  | "social-intel-alerts"
  | "social-intel-connectors"
  | "social-intel-settings"
  | "education-lms"
  | "education-kkn"
  | "education-academic"
  | "education-dashboard"
  | "education-courses"
  | "education-assignments"
  | "education-attendance"
  | "education-gradebook"
  | "education-groups"
  | "education-locations"
  | "education-logbook"
  | "education-reports"
  | "education-requests"
  | "education-documents"
  | "education-approvals"
  | "education-billing"
  | "education-settings";

export type PortalRole = "developer" | "owner" | "employee";

export const hrisModulePages = [
  "hris-employees",
  "hris-attendance",
  "hris-leave",
  "hris-payroll",
  "hris-payslip",
  "hris-dashboard",
  "hris-advanced-payroll",
  "hris-reimbursement",
  "hris-loans",
  "hris-field-report",
  "hris-performance",
  "hris-recruitment",
  "hris-settings"
] as const satisfies readonly PortalPage[];

export const hrisContextPages = ["hris", ...hrisModulePages] as const satisfies readonly PortalPage[];

export const churchContextPages = [
  "church",
  "church-jemaat",
  "church-komsel",
  "church-ibadah",
  "church-pelayanan",
  "church-keuangan",
  "church-aset",
  "church-dashboard",
  "church-settings"
] as const satisfies readonly PortalPage[];

export const clinicContextPages = [
  "clinic",
  "clinic-dashboard",
  "clinic-analytics",
  "clinic-patients",
  "clinic-appointments",
  "clinic-queue",
  "clinic-nurse-station",
  "clinic-visits",
  "clinic-prescriptions",
  "clinic-pharmacy",
  "clinic-cashier",
  "clinic-finance",
  "clinic-integrations",
  "clinic-settings"
] as const satisfies readonly PortalPage[];

export const fnbModulePages = [
  "fnb-cafe",
  "fnb-restaurant",
  "fnb-bakery",
  "fnb-cloud-kitchen",
  "fnb-food-court",
  "fnb-order-history",
  "fnb-pos",
  "fnb-menu",
  "fnb-table-order",
  "fnb-reservation",
  "fnb-pre-order",
  "fnb-wholesale",
  "fnb-kds",
  "fnb-inventory",
  "fnb-sales",
  "fnb-settings",
  "fnb-loyalty",
  "fnb-shift-closing",
  "fnb-split-bill",
  "fnb-batch-stock",
  "fnb-waste-report",
  "fnb-order-hub",
  "fnb-multi-brand",
  "fnb-delivery-integration",
  "fnb-delivery-status",
  "fnb-tenant-management",
  "fnb-tenant-settlement",
  "fnb-promo-rules",
  "fnb-admin-tenant-dashboard"
] as const satisfies readonly PortalPage[];

export const socialCommerceContextPages = [
  "social-commerce-intelligence",
  "social-intel-dashboard",
  "social-intel-setup",
  "social-intel-product-radar",
  "social-intel-creator-intelligence",
  "social-intel-competitor-watchlist",
  "social-intel-live-cockpit",
  "social-intel-ad-radar",
  "social-intel-campaign-planner",
  "social-intel-experiment-board",
  "social-intel-reports",
  "social-intel-alerts",
  "social-intel-connectors",
  "social-intel-settings"
] as const satisfies readonly PortalPage[];

export const educationModulePages = [
  "education-lms",
  "education-kkn",
  "education-academic",
  "education-dashboard",
  "education-courses",
  "education-assignments",
  "education-attendance",
  "education-gradebook",
  "education-groups",
  "education-locations",
  "education-logbook",
  "education-reports",
  "education-requests",
  "education-documents",
  "education-approvals",
  "education-billing"
] as const satisfies readonly PortalPage[];

export const educationContextPages = [
  ...educationModulePages,
  "education-settings"
] as const satisfies readonly PortalPage[];

export const globalPortalPages = ["notifications", "profile", "settings", "settings-security", "faq"] as const satisfies readonly PortalPage[];

export const portalPageTitles: Partial<Record<PortalPage, string>> = {
  home: "Portal utama",
  apps: "Aplikasi industri",
  "professional-services": "Professional Services",
  hris: "HRIS",
  "hris-employees": "Employees",
  "hris-attendance": "Attendance",
  "hris-leave": "Leave Approval",
  "hris-payroll": "Payroll",
  "hris-payslip": "Payslip",
  "hris-dashboard": "HR Dashboard",
  "hris-advanced-payroll": "Advanced Payroll",
  "hris-reimbursement": "Reimbursement",
  "hris-loans": "Kasbon",
  "hris-field-report": "Field Report",
  "hris-performance": "Performance",
  "hris-recruitment": "Recruitment",
  "hris-settings": "HRIS Settings",
  reports: "Reports",
  notifications: "Notifications",
  billing: "Billing",
  access: "Manajemen Akses",
  settings: "Settings",
  "settings-security": "Security & Sessions",
  profile: "Profile",
  faq: "FAQ & Help",
  fnb: "F&B Dashboard",
  "fnb-cafe": "Cafe",
  "fnb-restaurant": "Restaurant",
  "fnb-bakery": "Bakery",
  "fnb-cloud-kitchen": "Cloud Kitchen",
  "fnb-food-court": "Food Court",
  "fnb-order-history": "Riwayat Pesanan",
  "fnb-pos": "Point of Sale",
  "fnb-menu": "Menu POS",
  "fnb-kds": "Kitchen Display",
  "fnb-inventory": "Inventory",
  "fnb-sales": "Sales Reports",
  "fnb-table-order": "Table Management",
  "fnb-reservation": "Reservation",
  "fnb-pre-order": "Pre-Order",
  "fnb-wholesale": "Wholesale",
  "fnb-loyalty": "Loyalty & Promo",
  "fnb-shift-closing": "Shift & Closing",
  "fnb-split-bill": "Split Bill",
  "fnb-batch-stock": "Batch Stock",
  "fnb-waste-report": "Waste Report",
  "fnb-order-hub": "Order Hub",
  "fnb-multi-brand": "Multi-Brand Menu",
  "fnb-delivery-integration": "Delivery Integrations",
  "fnb-delivery-status": "Delivery Status",
  "fnb-tenant-management": "Tenant Management",
  "fnb-tenant-settlement": "Tenant Settlement",
  "fnb-promo-rules": "Promo Rules",
  "fnb-admin-tenant-dashboard": "Admin Tenant Dashboard",
  "fnb-settings": "F&B Settings",
  church: "Church Portal",
  "church-jemaat": "Jemaat",
  "church-komsel": "Komsel",
  "church-ibadah": "Ibadah",
  "church-pelayanan": "Pelayanan",
  "church-keuangan": "Keuangan",
  "church-aset": "Aset & Booking",
  "church-dashboard": "Analytics",
  "church-settings": "Settings",
  clinic: "KlinikOps",
  "clinic-dashboard": "KlinikOps Portal",
  "clinic-analytics": "KlinikOps Analytics",
  "clinic-patients": "Pasien",
  "clinic-appointments": "Appointment",
  "clinic-queue": "Antrean",
  "clinic-nurse-station": "Nurse Station",
  "clinic-visits": "Kunjungan",
  "clinic-prescriptions": "E-Resep",
  "clinic-pharmacy": "Farmasi",
  "clinic-cashier": "Kasir Klinik",
  "clinic-finance": "Keuangan Klinik",
  "clinic-integrations": "Integrasi Klinik",
  "clinic-settings": "KlinikOps Settings",
  "social-commerce-intelligence": "Social Commerce Intelligence",
  "social-intel-dashboard": "Social Intel Dashboard",
  "social-intel-setup": "Guided Setup",
  "social-intel-product-radar": "Product Radar",
  "social-intel-creator-intelligence": "Creator Intelligence",
  "social-intel-competitor-watchlist": "Competitor Watchlist",
  "social-intel-live-cockpit": "Live Commerce Cockpit",
  "social-intel-ad-radar": "Ad Creative Radar",
  "social-intel-campaign-planner": "Campaign Planner",
  "social-intel-experiment-board": "Experiment Board",
  "social-intel-reports": "Automated Reports",
  "social-intel-alerts": "Alert Center",
  "social-intel-connectors": "Data Connectors",
  "social-intel-settings": "Social Intel Settings",
  "education-lms": "LMS & E-Learning",
  "education-kkn": "KKN & Fieldwork",
  "education-academic": "Layanan Akademik",
  "education-dashboard": "Overview",
  "education-courses": "Mata Kuliah",
  "education-assignments": "Tugas & Ujian",
  "education-attendance": "Presensi Mahasiswa",
  "education-gradebook": "Buku Nilai",
  "education-groups": "Kelompok KKN",
  "education-locations": "Lokasi Plotting",
  "education-logbook": "Logbook Harian",
  "education-reports": "Laporan Akhir",
  "education-requests": "Antrean Pengajuan",
  "education-documents": "Repositori Dokumen",
  "education-approvals": "Inbox Approval",
  "education-billing": "Kasir & Billing",
  "education-settings": "Campus Settings"
};

export const portalPagePaths: Record<PortalPage, string> = {
  home: "/portal",
  apps: "/portal/apps",
  industry: "/portal/apps",
  "sub-industry": "/portal/apps",
  "professional-services": "/portal/professional-services",
  hris: "/portal/professional-services/hris",
  "hris-employees": "/portal/professional-services/hris/employees",
  "hris-attendance": "/portal/professional-services/hris/attendance",
  "hris-leave": "/portal/professional-services/hris/leave",
  "hris-payroll": "/portal/professional-services/hris/payroll",
  "hris-payslip": "/portal/professional-services/hris/payslip",
  "hris-dashboard": "/portal/professional-services/hris/dashboard",
  "hris-advanced-payroll": "/portal/professional-services/hris/advanced-payroll",
  "hris-reimbursement": "/portal/professional-services/hris/reimbursement",
  "hris-loans": "/portal/professional-services/hris/loans",
  "hris-field-report": "/portal/professional-services/hris/field-report",
  "hris-performance": "/portal/professional-services/hris/performance",
  "hris-recruitment": "/portal/professional-services/hris/recruitment",
  "hris-settings": "/portal/professional-services/hris/settings",
  reports: "/portal/reports",
  notifications: "/portal/notifications",
  billing: "/portal/billing",
  access: "/portal/access",
  settings: "/portal/settings",
  "settings-security": "/portal/settings/security",
  profile: "/portal/profile",
  faq: "/portal/faq",
  fnb: "/portal/fnb",
  "fnb-cafe": "/portal/fnb/cafe",
  "fnb-restaurant": "/portal/fnb/restaurant",
  "fnb-bakery": "/portal/fnb/bakery",
  "fnb-cloud-kitchen": "/portal/fnb/cloud-kitchen",
  "fnb-food-court": "/portal/fnb/food-court",
  "fnb-order-history": "/portal/fnb/cafe/order-history",
  "fnb-pos": "/portal/fnb/pos",
  "fnb-menu": "/portal/fnb/menu",
  "fnb-kds": "/portal/fnb/kds",
  "fnb-inventory": "/portal/fnb/inventory",
  "fnb-sales": "/portal/fnb/sales",
  "fnb-settings": "/portal/fnb/settings",
  "fnb-table-order": "/portal/fnb/table-order",
  "fnb-reservation": "/portal/fnb/reservation",
  "fnb-pre-order": "/portal/fnb/bakery/pre-order",
  "fnb-wholesale": "/portal/fnb/bakery/wholesale",
  "fnb-loyalty": "/portal/fnb/cafe/loyalty",
  "fnb-shift-closing": "/portal/fnb/cafe/shift-closing",
  "fnb-split-bill": "/portal/fnb/restaurant/split-bill",
  "fnb-batch-stock": "/portal/fnb/bakery/batch-stock",
  "fnb-waste-report": "/portal/fnb/bakery/waste-report",
  "fnb-order-hub": "/portal/fnb/cloud-kitchen/order-hub",
  "fnb-multi-brand": "/portal/fnb/cloud-kitchen/multi-brand",
  "fnb-delivery-integration": "/portal/fnb/cloud-kitchen/delivery-integration",
  "fnb-delivery-status": "/portal/fnb/cloud-kitchen/delivery-status",
  "fnb-tenant-management": "/portal/fnb/food-court/tenant-management",
  "fnb-tenant-settlement": "/portal/fnb/food-court/tenant-settlement",
  "fnb-promo-rules": "/portal/fnb/food-court/promo-rules",
  "fnb-admin-tenant-dashboard": "/portal/fnb/food-court/admin-tenant-dashboard",
  church: "/portal/public-services/church",
  "church-jemaat": "/portal/public-services/church/jemaat",
  "church-komsel": "/portal/public-services/church/komsel",
  "church-ibadah": "/portal/public-services/church/ibadah",
  "church-pelayanan": "/portal/public-services/church/pelayanan",
  "church-keuangan": "/portal/public-services/church/keuangan",
  "church-aset": "/portal/public-services/church/aset",
  "church-dashboard": "/portal/public-services/church/dashboard",
  "church-settings": "/portal/public-services/church/settings",
  clinic: "/portal/healthcare/clinic",
  "clinic-dashboard": "/portal/healthcare/clinic/dashboard",
  "clinic-analytics": "/portal/healthcare/clinic/analytics",
  "clinic-patients": "/portal/healthcare/clinic/patients",
  "clinic-appointments": "/portal/healthcare/clinic/appointments",
  "clinic-queue": "/portal/healthcare/clinic/queue",
  "clinic-nurse-station": "/portal/healthcare/clinic/nurse-station",
  "clinic-visits": "/portal/healthcare/clinic/visits",
  "clinic-prescriptions": "/portal/healthcare/clinic/prescriptions",
  "clinic-pharmacy": "/portal/healthcare/clinic/pharmacy",
  "clinic-cashier": "/portal/healthcare/clinic/cashier",
  "clinic-finance": "/portal/healthcare/clinic/finance",
  "clinic-integrations": "/portal/healthcare/clinic/integrations",
  "clinic-settings": "/portal/healthcare/clinic/settings",
  "social-commerce-intelligence": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence",
  "social-intel-dashboard": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/dashboard",
  "social-intel-setup": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/setup",
  "social-intel-product-radar": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/product-radar",
  "social-intel-creator-intelligence": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/creator-intelligence",
  "social-intel-competitor-watchlist": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/competitor-watchlist",
  "social-intel-live-cockpit": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/live-cockpit",
  "social-intel-ad-radar": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/ad-radar",
  "social-intel-campaign-planner": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/campaign-planner",
  "social-intel-experiment-board": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/experiment-board",
  "social-intel-reports": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/reports",
  "social-intel-alerts": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/alerts",
  "social-intel-connectors": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/connectors",
  "social-intel-settings": "/portal/ecommerce-and-marketplaces/social-commerce-intelligence/settings",
  "education-lms": "/portal/education-and-courses/lms",
  "education-kkn": "/portal/education-and-courses/kkn",
  "education-academic": "/portal/education-and-courses/academic",
  "education-dashboard": "/portal/education-and-courses/lms/dashboard",
  "education-courses": "/portal/education-and-courses/lms/courses",
  "education-assignments": "/portal/education-and-courses/lms/assignments",
  "education-attendance": "/portal/education-and-courses/lms/attendance",
  "education-gradebook": "/portal/education-and-courses/lms/gradebook",
  "education-groups": "/portal/education-and-courses/kkn/groups",
  "education-locations": "/portal/education-and-courses/kkn/locations",
  "education-logbook": "/portal/education-and-courses/kkn/logbook",
  "education-reports": "/portal/education-and-courses/kkn/reports",
  "education-requests": "/portal/education-and-courses/academic/requests",
  "education-documents": "/portal/education-and-courses/academic/documents",
  "education-approvals": "/portal/education-and-courses/academic/approvals",
  "education-billing": "/portal/education-and-courses/academic/billing",
  "education-settings": "/portal/education-and-courses/settings"
};
