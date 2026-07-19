"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredAccessToken } from "@/lib/mobile/session";
import { getScopeHomePath } from "@/lib/verticalScope";

/**
 * Root page — smart redirect.
 * - Native (APK): jika sudah login → /portal, jika belum → /login
 * - Web: selalu redirect ke /login (behavior lama)
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredAccessToken();
    router.replace(token ? getScopeHomePath() : "/login");
  }, [router]);

  return null;
}
