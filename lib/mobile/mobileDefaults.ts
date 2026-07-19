export type MobileAppKey = "hris" | "cafe" | "catalog" | "notifications" | "profile";

export type MobileAppCard = {
  key: MobileAppKey;
  title: string;
  subtitle: string;
  status: "ready" | "locked" | "coming_soon";
};

export type MobileNavItem = {
  key: MobileAppKey;
  label: string;
  href: string;
};

export const mobileAppCatalog: MobileAppCard[] = [
  {
    key: "hris",
    title: "HRIS",
    subtitle: "Absensi, cuti, payslip, approval",
    status: "ready"
  },
  {
    key: "cafe",
    title: "Cafe",
    subtitle: "POS, shift, KDS, inventory",
    status: "ready"
  },
  {
    key: "catalog",
    title: "Katalog Omnia",
    subtitle: "Sub-industri lain tetap tersembunyi atau pilot only",
    status: "coming_soon"
  }
];

export const mobileNavItems: MobileNavItem[] = [
  { key: "hris", label: "Home", href: "/mobile" },
  { key: "catalog", label: "Aktivitas", href: "/mobile/activity" },
  { key: "cafe", label: "Aksi", href: "/mobile/action" },
  { key: "notifications", label: "Notifikasi", href: "/mobile/notifications" },
  { key: "profile", label: "Lainnya", href: "/mobile/profile" }
];
