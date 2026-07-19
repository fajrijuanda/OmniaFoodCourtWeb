"use client";

import { useEffect, useState, type ReactNode } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { OfflineBanner } from "@/components/mobile/shared/OfflineBanner";
import { PortalLoadingScreen } from "@/components/portal/ui";
import { useAppLifecycle } from "@/lib/mobile/network";
import { OfflineQueue } from "@/lib/mobile/offlineQueue";
import { initSecureSession } from "@/lib/mobile/session";

export function MobileBootloader({ children }: { children: ReactNode }) {
  const [isBooting, setIsBooting] = useState(true);

  useAppLifecycle(() => {
    OfflineQueue.processQueue(fetch);
  });

  useEffect(() => {
    async function boot() {
      try {
        await initSecureSession();

        if (Capacitor.isNativePlatform()) {
          CapacitorApp.removeAllListeners();
          CapacitorApp.addListener("appUrlOpen", (event) => {
            const appPath = event.url.split("app.omnia.id").pop();
            if (appPath) window.location.assign(appPath);
          });
          CapacitorApp.addListener("backButton", () => {
            const path = window.location.pathname;
            if (path === "/" || path === "/login" || path === "/portal") CapacitorApp.exitApp();
            else window.history.back();
          });
        }
      } catch (error) {
        console.error("Failed to initialize secure session", error);
      } finally {
        setIsBooting(false);
      }
    }

    void boot();
  }, []);

  if (isBooting) return <PortalLoadingScreen label="Memulai Omnia" />;

  return (
    <>
      <OfflineBanner />
      {children}
    </>
  );
}
