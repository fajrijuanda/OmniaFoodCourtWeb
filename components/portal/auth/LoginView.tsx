"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Chrome, Eye, EyeOff, Github, LockKeyhole, Mail, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import { API_BASE_URL, LANDING_URL, isSuperAdminUser, unwrapApiResponse, type AuthUser } from "@/lib/api";
import { persistAuthSession } from "@/lib/mobile/session";
import { BrandLogo } from "@/components/BrandLogo";
import { PortalLoadingScreen } from "@/components/portal/ui";
import { getScopeHomePath } from "@/lib/verticalScope";

function parseLoginResponse(payload: unknown): { accessToken: string; user: AuthUser } {
  let current = payload;

  for (let depth = 0; depth < 3; depth += 1) {
    if (current && typeof current === "object") {
      const candidate = current as { accessToken?: unknown; user?: unknown; data?: unknown };
      if (typeof candidate.accessToken === "string" && candidate.user && typeof candidate.user === "object") {
        return { accessToken: candidate.accessToken, user: candidate.user as AuthUser };
      }
      if (candidate.data !== undefined) {
        current = candidate.data;
        continue;
      }
    }
    break;
  }

  throw new Error("Respons login dari server tidak lengkap. Silakan coba lagi.");
}

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [booting, setBooting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isNative = typeof window !== "undefined" && Capacitor.isNativePlatform();

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const routeAfterLogin = (user: AuthUser) => {
    if (isSuperAdminUser(user)) return "/portal?role=developer";
    return getScopeHomePath(user);
  };

  const storeSession = async (data: { accessToken: string; user: AuthUser }) => {
    await persistAuthSession(data);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      if (!response.ok) {
        if (response.status >= 500) throw new Error("Terjadi kesalahan pada server API (500).");
        throw new Error("Email atau password tidak valid.");
      }
      const data = parseLoginResponse(await response.json());
      await storeSession(data);
      router.push(routeAfterLogin(data.user));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login gagal.");
    } finally {
      setSubmitting(false);
    }
  };

  const oauthLogin = (provider: "google" | "github") => {
    setSubmitting(true);
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <main className="portal-theme-scope min-h-screen overflow-hidden bg-[#fff7ed] text-[var(--portal-text)] transition-colors duration-700">
      {booting || submitting ? <PortalLoadingScreen label={submitting ? "Memproses login" : "Menyiapkan portal"} /> : null}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.92)_0%,rgba(255,247,237,0.9)_44%,rgba(239,246,255,0.92)_100%)]" />
      <div className="pointer-events-none absolute left-[8%] top-[10%] hidden h-36 w-36 rounded-full border border-orange-200 bg-white/50 blur-sm lg:block" />
      <div className="pointer-events-none absolute bottom-[8%] right-[10%] hidden h-44 w-44 rounded-full border border-sky-200 bg-white/50 blur-sm lg:block" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[118rem] items-start justify-center p-0 sm:p-5 lg:items-center lg:p-6 xl:p-8">
        <div className="relative w-full overflow-visible rounded-none bg-transparent shadow-none lg:overflow-hidden lg:rounded-[40px] lg:bg-[#101010] lg:shadow-[0_32px_90px_rgba(15,23,42,0.24)]">
          <div className="absolute inset-x-0 top-0 hidden h-1 bg-[linear-gradient(90deg,#f97316,#38bdf8,#22c55e)] lg:block" />
          <div className="pointer-events-none absolute left-[20%] top-28 hidden h-72 w-72 rounded-full bg-orange-500/18 blur-3xl lg:block" />
          <div className="pointer-events-none absolute bottom-20 left-[10%] hidden h-64 w-64 rounded-full bg-sky-500/16 blur-3xl lg:block" />

          <div className="relative grid w-full gap-0 lg:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="relative hidden min-h-[720px] p-8 text-white lg:block xl:p-14">

          <div className="relative flex items-center justify-between">
            <Link href="https://omnia-landing-page.vercel.app/" className="flex items-center gap-3">
              <BrandLogo className="h-12 w-12" />
              <span className="text-xl font-black tracking-[0.24em]">OMNIA</span>
            </Link>
            <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70">Portal</span>
          </div>

          <div className="relative mt-16 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black">
              <Sparkles className="h-4 w-4 text-[var(--portal-primary)]" />
              Portal industri, trial, dan admin katalog
            </div>
            <h1 className="mt-8 text-6xl font-black leading-[0.94]">Kelola aplikasi industri dalam satu tempat.</h1>
            <p className="mt-6 max-w-lg text-lg font-bold leading-8 text-white/62">
              Login untuk melanjutkan workspace tenant, atau mulai trial Starter 3 hari untuk satu sub-industri.
            </p>
          </div>

          <div className="relative mt-14 grid grid-cols-2 gap-4">
            {[
              ["61", "Sub-industri"],
              ["3 hari", "Trial Starter"],
              ["JWT", "Secure session"],
              ["OAuth", "Google & GitHub"]
            ].map(([value, label]) => (
              <motion.div whileHover={{ y: -4, scale: 1.01 }} key={label} className="rounded-[26px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
                <p className="text-4xl font-black text-[var(--portal-primary)]">{value}</p>
                <p className="mt-2 text-sm font-bold text-white/58">{label}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-10 rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-white/10 text-orange-300"><Wand2 className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-black">Akun trial tetap bisa login setelah expired</p>
                <p className="mt-1 text-xs font-bold text-white/50">Fitur Starter dinonaktifkan sampai subscription aktif.</p>
              </div>
            </div>
          </div>
            </section>

            <section className="relative flex items-center justify-center px-6 py-10 sm:px-8 sm:py-12 lg:p-10">
              <div className="w-full max-w-[480px] rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none lg:rounded-[30px] lg:border lg:border-white/70 lg:bg-white/90 lg:p-8 lg:shadow-[0_30px_90px_rgba(0,0,0,0.1)] lg:backdrop-blur">
                {/* Logo Omnia — tampil di mobile/APK, hidden di desktop (sudah ada di panel kiri) */}
                <div className="mb-5 flex justify-center lg:hidden">
                  <BrandLogo className="h-20 w-20 rounded-[22px]" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--portal-primary)]">{isNative ? "Masuk" : "Login Portal"}</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#172033] sm:text-5xl">{isNative ? "Masuk ke Omnia" : "Masuk ke Portal Omnia"}</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
            {isNative
              ? "Masuk dengan akun Omnia kamu untuk melanjutkan ke aplikasi."
              : "Lanjutkan workspace kamu, kelola trial, atau masuk sebagai admin internal melalui kredensial yang sudah disiapkan."}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => oauthLogin("google")} className="flex items-center justify-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
              <Chrome className="h-5 w-5 text-orange-500" />
              Google
            </button>
            <button type="button" onClick={() => oauthLogin("github")} className="flex items-center justify-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              <Github className="h-5 w-5" />
              GitHub
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">atau email</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
            <span className="mb-2 block text-sm font-black text-[#172033]">Username / Email kerja</span>
              <span className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 transition focus-within:border-[var(--portal-primary)]">
                <Mail className="h-5 w-5 text-[var(--portal-primary)]" />
                <input required type="email" className="w-full bg-transparent text-sm font-bold outline-none" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@perusahaan.com" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#172033]">Password</span>
              <span className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 transition focus-within:border-[var(--portal-primary)]">
                <LockKeyhole className="h-5 w-5 text-[var(--portal-primary)]" />
                <input required type={showPassword ? "text" : "password"} className="w-full bg-transparent text-sm font-bold outline-none" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password akun" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </label>
            {error ? <p className="rounded-[16px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}
            <button disabled={submitting} className="flex w-full items-center justify-center gap-3 rounded-full bg-[var(--portal-primary)] px-6 py-4 text-base font-black text-[var(--portal-on-primary)] shadow-[0_18px_45px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
              {submitting ? "Memproses..." : isNative ? "Masuk" : "Masuk ke Portal"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[var(--portal-primary)]" />
              <div>
                <p className="text-sm font-black text-[#172033]">Belum punya akun?</p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-500">Mulai trial 3 hari, pilih 1 sub-industri, dan gunakan Tier Starter.</p>
              </div>
            </div>
            <Link href="/register" className="mt-4 flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-[#172033] transition hover:border-[var(--portal-primary)] hover:text-[var(--portal-primary)]">
              Daftar trial 3 hari
            </Link>
          </div>
          </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
