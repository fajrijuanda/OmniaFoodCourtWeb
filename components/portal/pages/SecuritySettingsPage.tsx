import { useState } from "react";
import { ShieldCheck, Smartphone, Laptop, AlertTriangle, KeyRound } from "lucide-react";
import { apiFetch, type AuthUser } from "@/lib/api";
import { Panel } from "@/components/portal/ui";
import { clearAuthSession } from "@/lib/mobile/session";

export function SecuritySettingsPage({ account }: { account: AuthUser | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRevokeAll = async () => {
    if (!confirm("Tindakan ini akan mengeluarkan Anda dari semua perangkat yang sedang login (termasuk perangkat ini). Lanjutkan?")) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await apiFetch("/auth/logout", { method: "POST" });
      setMessage("Berhasil logout dari semua perangkat.");
      
      // Clear local session as well
      setTimeout(() => {
        clearAuthSession();
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal melakukan logout.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <Panel className="p-4 lg:p-6">
        <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.15em] lg:tracking-[0.22em] text-[var(--portal-primary)]">Security & Sessions</p>
        <h1 className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-black text-[#172033]">Keamanan Akun</h1>
        <p className="mt-1.5 lg:mt-2 max-w-2xl text-xs lg:text-sm font-bold leading-5 lg:leading-6 text-slate-500">
          Kelola akses perangkat dan tingkatkan keamanan akun Anda.
        </p>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[var(--portal-primary)]" />
            <h2 className="text-xl font-black text-[#172033]">Sesi Aktif</h2>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-500">
            Sistem melacak perangkat yang terhubung dengan akun Anda. Jika Anda merasa ada aktivitas mencurigakan, segera keluar dari semua perangkat.
          </p>

          {message ? <p className="mt-4 rounded-[16px] bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-4 rounded-[16px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}

          <div className="mt-6 rounded-[20px] border border-slate-100 p-4">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-400">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-[#172033]">Perangkat Saat Ini</p>
                <p className="text-xs font-bold text-slate-500">Akses Anda sedang aktif di perangkat ini.</p>
                <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRevokeAll}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
            type="button"
          >
            <AlertTriangle className="h-4 w-4" />
            {loading ? "Memproses..." : "Logout dari SEMUA perangkat"}
          </button>
        </Panel>

        <Panel className="p-4 lg:p-6 opacity-70">
          <div className="flex items-center gap-3">
            <KeyRound className="h-6 w-6 text-slate-400" />
            <h2 className="text-xl font-black text-[#172033]">Ganti Password</h2>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-500">
            Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-black text-slate-500">Password Lama</span>
              <input disabled type="password" placeholder="••••••••" className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-400" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black text-slate-500">Password Baru</span>
              <input disabled type="password" placeholder="••••••••" className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-400" />
            </label>
            <button disabled className="mt-2 w-full rounded-full bg-slate-200 px-5 py-3 text-sm font-black text-slate-400" type="button">
              Simpan Password
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
