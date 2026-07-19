"use client";

import { useEffect, useState } from "react";
import { consumeVerticalHandoff } from "@/lib/verticalHandoff";

export default function SessionHandoffPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const encoded = new URLSearchParams(window.location.hash.slice(1)).get("session");
    window.history.replaceState({}, "", "/auth/handoff");
    if (!encoded) {
      setError("Data sesi tidak ditemukan.");
      return;
    }
    consumeVerticalHandoff(encoded)
      .then((destinationPath) => window.location.replace(destinationPath))
      .catch((reason: Error) => setError(reason.message));
  }, []);

  return <main className="grid min-h-screen place-items-center bg-[#fffaf5] p-6"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" /><h1 className="mt-5 text-xl font-black text-slate-900">{error ? "Sesi tidak dapat diteruskan" : "Membuka workspace Omnia…"}</h1><p className="mt-2 text-sm font-semibold text-slate-500">{error ?? "Sesi portal sedang dipindahkan dengan aman."}</p>{error ? <a className="mt-5 inline-flex rounded-full bg-orange-500 px-5 py-2.5 text-sm font-black text-white" href="/login">Masuk kembali</a> : null}</div></main>;
}
