import { Suspense } from "react";
import { OAuthCallback } from "@/components/portal/auth/OAuthCallback";

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-orange-50 font-black text-slate-950">Menyelesaikan login...</main>}>
      <OAuthCallback />
    </Suspense>
  );
}
