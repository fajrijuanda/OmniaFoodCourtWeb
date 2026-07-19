import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnia Mobile",
  description: "Mobile shell for Omnia HRIS and Cafe"
};

export default function MobileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
