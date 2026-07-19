"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ChevronLeft, Chrome, Factory, GraduationCap, HeartPulse, Landmark, Network, Eye, EyeOff, Github, LockKeyhole, Mail, MessageCircle, Phone, Search, ShoppingBag, Sparkles, Store, Truck, UserRound, Utensils, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { API_BASE_URL, unwrapApiResponse, type AuthUser } from "@/lib/api";
import { Capacitor } from "@capacitor/core";
import { persistAuthSession, setStoredDemoRole, setStoredHrisTier } from "@/lib/mobile/session";
import { BrandLogo } from "@/components/BrandLogo";
import { PortalLoadingScreen } from "@/components/portal/ui";
import { industries } from "@/data/industries";
import { segmentIconMap } from "../portalCatalog";

type SubOption = {
  id: string;
  name: string;
  slug: string;
  industryName: string;
  need: string;
  offer: string;
};

type RegisterIndustry = {
  id?: string;
  name: string;
  icon: string;
  pain: string;
  solution: string;
  segments: Array<{
    id?: string;
    name: string;
    slug: string;
    need: string;
    offer: string;
  }>;
};

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void;
    onTurnstileExpired?: () => void;
    turnstile?: { reset: () => void };
  }
}

const industryIconMap: Record<string, LucideIcon> = {
  Utensils,
  Stethoscope: HeartPulse,
  Store,
  ShoppingBag,
  GraduationCap,
  BriefcaseBusiness,
  Truck,
  Factory,
  Building2,
  Network,
  CalendarDays,
  Landmark,
};

const industryDisplayName: Record<string, string> = {
  "F&B / Restoran / Cafe": "F&B / Kuliner",
  "F&B/Restoran/Cafe": "F&B / Kuliner",
  "Desa / Layanan Publik": "Layanan Publik",
  "Desa/Layanan Publik": "Layanan Publik"
};

function normalizeIndustryDisplayName(name: string) {
  return industryDisplayName[name] ?? name;
}

export function RegisterView() {
  const router = useRouter();
  const [selectedSubId, setSelectedSubId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeIndustryIndex, setActiveIndustryIndex] = useState<number | null>(null);
  const [industryQuery, setIndustryQuery] = useState("");
  const [subIndustryQuery, setSubIndustryQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState<RegisterIndustry[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [otpChallengeId, setOtpChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState("");
  const [otpRetryAt, setOtpRetryAt] = useState(0);
  const [nowMs, setNowMs] = useState(Date.now());
  const [otpSending, setOtpSending] = useState(false);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const isNative = typeof window !== "undefined" && Capacitor.isNativePlatform();
  const sourceIndustries = useMemo<RegisterIndustry[]>(() => (
    catalog.length
      ? catalog
      : industries.map((industry) => ({
          ...industry,
          name: normalizeIndustryDisplayName(industry.name),
          segments: industry.segments.map((segment) => ({ ...segment, slug: slugify(segment.name) }))
        }))
  ), [catalog]);

  const options = useMemo<SubOption[]>(() => {
    return sourceIndustries.flatMap((industry) =>
      industry.segments.map((sub) => ({
        id: sub.id ?? `${industry.name}::${sub.name}`,
        name: sub.name,
        slug: slugify(sub.name),
        industryName: industry.name,
        need: sub.need,
        offer: sub.offer
      }))
    );
  }, [sourceIndustries]);

  const selected = options.find((option) => option.id === selectedSubId);
  const activeIndustry = activeIndustryIndex === null ? null : sourceIndustries[activeIndustryIndex];
  const activeIndustryName = activeIndustry ? normalizeIndustryDisplayName(activeIndustry.name) : "";
  const selectedIndustry = selected ? sourceIndustries.find((industry) => industry.name === selected.industryName) : null;
  const otpResendRemaining = Math.max(0, Math.ceil((otpRetryAt - nowMs) / 1000));
  const filteredIndustries = useMemo(() => {
    const normalized = industryQuery.trim().toLowerCase();
    if (!normalized) return sourceIndustries;
    return sourceIndustries.filter((industry) => `${industry.name} ${industry.pain} ${industry.solution} ${industry.segments.map((segment) => segment.name).join(" ")}`.toLowerCase().includes(normalized));
  }, [industryQuery, sourceIndustries]);
  const filteredSubIndustries = useMemo(() => {
    if (!activeIndustry) return [];
    const normalized = subIndustryQuery.trim().toLowerCase();
    if (!normalized) return activeIndustry.segments;
    return activeIndustry.segments.filter((segment) => `${segment.name} ${segment.need} ${segment.offer}`.toLowerCase().includes(normalized));
  }, [activeIndustry, subIndustryQuery]);

  useEffect(() => {
    if (options[0] && !selectedSubId) setSelectedSubId(options[0].id);
  }, [options, selectedSubId]);

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => setTurnstileToken(token);
    window.onTurnstileExpired = () => setTurnstileToken("");
    return () => {
      delete window.onTurnstileSuccess;
      delete window.onTurnstileExpired;
    };
  }, []);

  useEffect(() => {
    if (!otpRetryAt) return;
    const updateCountdown = () => {
      const current = Date.now();
      setNowMs(current);
      if (current >= otpRetryAt) setOtpRetryAt(0);
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [otpRetryAt]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/industries`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Gagal memuat katalog API.")))
      .then((data: any[]) => {
        setCatalog(data.map((industry) => ({
          id: industry.id,
          name: normalizeIndustryDisplayName(industry.name),
          icon: industry.iconKey,
          pain: industry.pain,
          solution: industry.solution,
          segments: (industry.subIndustries ?? []).map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            need: sub.need,
            offer: sub.offer
          }))
        })));
      })
      .catch(() => setCatalog([]));
  }, []);

  const requestOtp = async () => {
    setError("");
    setOtpSending(true);
    try {
      if (otpResendRemaining > 0) throw new Error(`Tunggu ${otpResendRemaining} detik sebelum mengirim ulang OTP.`);
      const antiBotToken = turnstileToken || (!turnstileSiteKey ? "development-disabled-turnstile-token" : "");
      if (!antiBotToken) throw new Error("Selesaikan verifikasi anti-bot sebelum mengirim OTP.");
      if (!email.trim()) throw new Error("Isi alamat email terlebih dahulu.");

      const response = await fetch(`${API_BASE_URL}/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), turnstileToken: antiBotToken })
      });
      if (!response.ok) {
        const errorPayload = await readApiError(response);
        if (errorPayload.retryAfterSeconds) {
          setOtpRetryAt(Date.now() + errorPayload.retryAfterSeconds * 1000);
          setNowMs(Date.now());
        }
        throw new Error(errorPayload.message || "Gagal mengirim OTP ke Email.");
      }
      const data = unwrapApiResponse<{ challengeId: string; expiresAt: string; resendAfterSeconds?: number }>(await response.json());
      setOtpChallengeId(data.challengeId);
      setOtpExpiresAt(data.expiresAt);
      setOtpRetryAt(Date.now() + (data.resendAfterSeconds ?? 120) * 1000);
      setNowMs(Date.now());
      setOtpCode("");
      setTurnstileToken("");
      window.turnstile?.reset();
    } catch (otpError) {
      setTurnstileToken("");
      window.turnstile?.reset();
      setError(otpError instanceof Error ? otpError.message : "Gagal mengirim OTP ke Email.");
    } finally {
      setOtpSending(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!selectedSubId) throw new Error("Pilih salah satu sub-industri untuk trial.");
      if (!otpChallengeId) throw new Error("Kirim OTP Email terlebih dahulu.");
      if (!otpCode.trim()) throw new Error("Masukkan kode OTP Email.");

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          password,
          subIndustryId: selectedSubId,
          otpChallengeId,
          otpCode: otpCode.trim()
        })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registrasi trial gagal.");
      }

      const data = unwrapApiResponse<{ accessToken: string; user: AuthUser }>(await response.json());
      await persistAuthSession(data);
      setStoredDemoRole("owner");
      setStoredHrisTier("starter");
      router.push("/portal?role=owner");
    } catch (registerError) {
      setTurnstileToken("");
      setError(registerError instanceof Error ? registerError.message : "Registrasi trial gagal.");
    } finally {
      setSubmitting(false);
    }
  };

  const oauthRegister = (provider: "google" | "github") => {
    window.location.href = `${API_BASE_URL}/auth/${provider}/start?subIndustryId=${encodeURIComponent(selectedSubId)}`;
  };

  return (
    <main className="portal-theme-scope min-h-screen overflow-hidden bg-[#fff7ed] text-[var(--portal-text)] transition-colors duration-700">
      {submitting ? <PortalLoadingScreen label="Menyiapkan portal" /> : null}
      
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
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/80 transition hover:bg-white/15">
                <ChevronLeft className="h-4 w-4" />
                {isNative ? "Login" : "Login portal"}
              </Link>
              
              <div className="mt-16 xl:mt-24">
                <BrandLogo className="h-10 text-white" />
                <div className="mt-12 max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/90">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    Portal Trial
                  </div>
                  <h1 className="mt-6 text-4xl font-black leading-[1.15] tracking-tight text-white xl:text-[3.5rem]">
                    Mulai trial<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      gratis 3 hari.
                    </span>
                  </h1>
                  <p className="mt-6 text-lg font-bold leading-relaxed text-white/70">
                    Pilih 1 dari {options.length || 61} sub-industri. Trial dibuat otomatis setelah lolos verifikasi anti-bot dengan Tier Starter aktif.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 xl:bottom-14 xl:left-14 xl:right-14">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {[
                    { label: "Validasi aktif", icon: CheckCircle2 },
                    { label: "Tier Starter", icon: CheckCircle2 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/80 backdrop-blur-md">
                      <item.icon className="h-5 w-5 text-emerald-400" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </section>
        <form onSubmit={submit} className="p-5 sm:rounded-[28px] sm:border sm:border-slate-200 bg-white lg:bg-white/95 sm:shadow-[0_26px_80px_rgba(15,23,42,0.12)] sm:backdrop-blur sm:p-7 lg:my-6 lg:mr-6 xl:my-8 xl:mr-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-500">{isNative ? "Daftar Akun" : "Register Trial"}</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">{isNative ? "Buat akun Omnia" : "Buka demo frontend"}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{isNative ? "Daftarkan akun baru untuk mulai menggunakan Omnia." : "Akun trial dibuat melalui API Omnia setelah lolos verifikasi anti-bot."}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Nama">
              <UserRound className="h-5 w-5 text-orange-500" />
              <input required className="w-full bg-transparent text-sm font-bold outline-none" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama lengkap" />
            </Field>
            <Field label="Nomor WhatsApp">
              <Phone className="h-5 w-5 text-orange-500" />
              <input className="w-full bg-transparent text-sm font-bold outline-none" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="08xxxxxxxxxx (Opsional)" />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Field label="Email">
              <Mail className="h-5 w-5 text-orange-500" />
              <input required type="email" className="w-full bg-transparent text-sm font-bold outline-none" value={email} onChange={(event) => {
                setEmail(event.target.value);
                setOtpChallengeId("");
                setOtpCode("");
                setOtpRetryAt(0);
              }} placeholder="email@bisnis.com" />
            </Field>
            <button
              type="button"
              onClick={requestOtp}
              disabled={otpSending || otpResendRemaining > 0 || !email.trim()}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 text-sm font-black text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle className="h-4 w-4" />
              {otpSending ? "Mengirim..." : otpResendRemaining > 0 ? `Kirim ulang ${otpResendRemaining}d` : otpChallengeId ? "Kirim ulang OTP" : "Kirim OTP"}
            </button>
          </div>

          <div className="mt-4">
            <Field label="Kode OTP Email">
              <MessageCircle className="h-5 w-5 text-orange-500" />
              <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} className="w-full bg-transparent text-sm font-bold tracking-[0.28em] outline-none" value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
            </Field>
            {otpChallengeId ? (
              <p className="mt-2 text-xs font-bold text-emerald-600">
                OTP terkirim ke Email. Berlaku sampai {otpExpiresAt ? new Date(otpExpiresAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "10 menit"}.
              </p>
            ) : null}
          </div>

          <div className="mt-4">
            <Field label="Password">
              <LockKeyhole className="h-5 w-5 text-orange-500" />
              <input required minLength={8} type={showPassword ? "text" : "password"} className="w-full bg-transparent text-sm font-bold outline-none" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </Field>
          </div>

          <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3">
              <Search className="h-5 w-5 text-orange-500" />
              <input className="w-full bg-transparent text-sm font-bold outline-none" value={industryQuery} onChange={(event) => setIndustryQuery(event.target.value)} placeholder="Cari industri..." />
            </div>
            <div className="mt-3 grid max-h-[340px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
              {filteredIndustries.map((industry) => {
                const realIndex = sourceIndustries.findIndex((item) => item.name === industry.name);
                const Icon = industryIconMap[industry.icon] ?? Store;
                const displayName = normalizeIndustryDisplayName(industry.name);
                const selectedInIndustry = selected?.industryName === industry.name;
                return (
                  <button
                    key={industry.name}
                    type="button"
                    onClick={() => {
                      setActiveIndustryIndex(realIndex);
                      setSubIndustryQuery("");
                    }}
                    className={`flex min-h-[118px] flex-col items-start justify-between rounded-[18px] border p-4 text-left transition ${
                      selectedInIndustry ? "border-orange-500 bg-white shadow-sm" : "border-transparent bg-white/70 hover:bg-white"
                    }`}
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-[15px] ${selectedInIndustry ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-slate-950">{displayName}</span>
                      <span className="mt-1 block text-xs font-bold text-slate-500">{industry.segments.length} sub-industri</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-[18px] bg-white px-4 py-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Pilihan demo</p>
                <p className="mt-1 text-sm font-black text-slate-950">{selected ? `${selected.name} - ${selected.industryName}` : "Belum memilih sub-industri"}</p>
              </div>
              {selectedIndustry ? (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">All Access</span>
              ) : null}
            </div>
          </div>

          {activeIndustry ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
              <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Pilih sub-industri</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">{activeIndustryName}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">{activeIndustry.solution}</p>
                  </div>
                  <button type="button" onClick={() => setActiveIndustryIndex(null)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-4 flex items-center gap-3 rounded-[16px] bg-slate-50 px-4 py-3">
                    <Search className="h-5 w-5 text-orange-500" />
                    <input className="w-full bg-transparent text-sm font-bold outline-none" value={subIndustryQuery} onChange={(event) => setSubIndustryQuery(event.target.value)} placeholder="Cari sub-industri di kategori ini..." />
                  </div>
                  <div className="grid max-h-[460px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                    {filteredSubIndustries.map((segment) => {
                      const optionId = segment.id ?? `${activeIndustry.name}::${segment.name}`;
                      const isSelected = selectedSubId === optionId;
                      const SegmentIcon = segmentIconMap[segment.name] ?? Store;
                      return (
                        <button
                          key={segment.name}
                          type="button"
                          onClick={() => {
                            setSelectedSubId(optionId);
                            setActiveIndustryIndex(null);
                            setError("");
                          }}
                          className={`rounded-[18px] border p-4 text-left transition ${isSelected ? "border-orange-500 bg-orange-50" : "border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/40"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-[15px] ${isSelected ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"}`}>
                                <SegmentIcon className="h-5 w-5" />
                              </span>
                              <div>
                                <p className="text-base font-black text-slate-950">{segment.name}</p>
                                <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-orange-500">All Access</p>
                              </div>
                            </div>
                            {isSelected ? <CheckCircle2 className="h-5 w-5 text-orange-500" /> : null}
                          </div>
                          <p className="mt-3 text-sm font-bold leading-6 text-slate-500">{segment.need}</p>
                          <p className="mt-3 rounded-[14px] bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-500">{segment.offer}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {selected ? (
            <p className="mt-4 rounded-[16px] bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
              Trial dipilih: {selected.name} - Tier Starter aktif selama 3 hari setelah registrasi berhasil.
            </p>
          ) : null}
          {turnstileSiteKey ? (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
              <div className="mt-4 flex justify-center rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                <div
                  className="cf-turnstile"
                  data-sitekey={turnstileSiteKey}
                  data-callback="onTurnstileSuccess"
                  data-expired-callback="onTurnstileExpired"
                  data-error-callback="onTurnstileExpired"
                />
              </div>
            </>
          ) : (
            <p className="mt-4 rounded-[16px] bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
              Turnstile site key belum diatur. Mode lokal hanya berjalan jika API menonaktifkan Turnstile.
            </p>
          )}
          {error ? <p className="mt-4 rounded-[16px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</p> : null}

          <button disabled={submitting || !selectedSubId} type="submit" className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-orange-500 px-6 py-4 text-base font-black text-white shadow-[0_18px_45px_rgba(249,115,22,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Mendaftarkan trial..." : "Mulai Trial 3 Hari"}
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">atau OAuth</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => oauthRegister("google")} className="flex items-center justify-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
              <Chrome className="h-5 w-5 text-orange-500" />
              Google
            </button>
            <button type="button" onClick={() => oauthRegister("github")} className="flex items-center justify-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              <Github className="h-5 w-5" />
              GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">{label}</span>
      <span className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3">
        {children}
      </span>
    </label>
  );
}

async function readApiError(response: Response) {
  const fallback = { message: "", retryAfterSeconds: 0 };
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { ...fallback, message: await response.text() };
  }

  const payload = await response.json().catch(() => null) as { message?: string | string[]; retryAfterSeconds?: number } | null;
  const message = Array.isArray(payload?.message) ? payload.message.join(" ") : payload?.message;
  return {
    message: message ?? "",
    retryAfterSeconds: Number(payload?.retryAfterSeconds ?? 0)
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
