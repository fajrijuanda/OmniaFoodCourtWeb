import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MobileBootloader } from "@/components/mobile/shell/MobileBootloader";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Omnia Portal",
  description:
    "Portal Omnia untuk admin, owner tenant, dan employee.",
  keywords: ["omnia portal", "admin portal", "saas portal"],
  openGraph: {
    title: "Omnia Portal",
    description: "Portal aplikasi industri Omnia.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var mascot = localStorage.getItem('omnia-mascot');
                  if (mascot !== 'odi') mascot = 'omni';
                  document.documentElement.dataset.mascot = mascot;
                  document.documentElement.dataset.portalTheme = 'industry';
                  document.documentElement.classList.add('omnia-booting');
                } catch (error) {
                  document.documentElement.dataset.mascot = 'omni';
                  document.documentElement.dataset.portalTheme = 'industry';
                  document.documentElement.classList.add('omnia-booting');
                }
              })();
            `
          }}
        />
      </head>
      <body className={jakarta.variable}>
        <MobileBootloader>
          {children}
        </MobileBootloader>
      </body>
    </html>
  );
}
