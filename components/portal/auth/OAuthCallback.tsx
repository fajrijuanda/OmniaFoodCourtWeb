"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { isSuperAdminUser, type AuthUser } from "@/lib/api";
import { persistAuthSession } from "@/lib/mobile/session";
import { getScopeHomePath } from "@/lib/verticalScope";

export function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("Menyelesaikan login...");

  useEffect(() => {
    const token = params.get("token");
    const encodedUser = params.get("user");
    if (!token || !encodedUser) {
      setMessage("Callback OAuth tidak valid.");
      return;
    }

    try {
      const normalized = encodedUser.replace(/-/g, "+").replace(/_/g, "/");
      const user = JSON.parse(decodeURIComponent(escape(window.atob(normalized)))) as AuthUser;
      void persistAuthSession({ accessToken: token, user })
        .then(() => router.replace(isSuperAdminUser(user) ? "/portal?role=developer" : getScopeHomePath(user)))
        .catch(() => setMessage("Gagal menyimpan sesi login."));
    } catch {
      setMessage("Gagal membaca data OAuth.");
    }
  }, [params, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-orange-50 px-4">
      <div className="rounded-[28px] bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
        <BrandLogo className="mx-auto h-14 w-14 rounded-[18px]" />
        <p className="mt-5 text-lg font-black text-slate-950">{message}</p>
      </div>
    </main>
  );
}
