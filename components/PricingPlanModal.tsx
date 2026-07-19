"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { PricingAddOn } from "@/components/showcase/addOns";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  fit: string;
  limits?: string[];
  highlight?: boolean;
  features: boolean[];
};

type PricingPlanModalProps = {
  featureRows: string[];
  label?: string;
  className?: string;
  inquirySubject?: string;
  tiers: PricingTier[];
  addOns?: PricingAddOn[];
  variant?: "primary" | "secondary";
  themeColor?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  actionLabel?: string;
  onAction?: (tier: PricingTier) => void;
};

const themeColors: Record<string, {
  badgeText: string;
  badgeBg: string;
  priceText: string;
  highlightCardBg: string;
  button: string;
  buttonOutline: string;
  hex: string;
}> = {
  blue: {
    badgeText: "text-blue-500", badgeBg: "bg-blue-500", priceText: "text-blue-600",
    highlightCardBg: "border-blue-300 bg-blue-50 shadow-blue-600/10",
    button: "bg-blue-500 text-white hover:bg-blue-600", buttonOutline: "border border-blue-500 text-blue-600 hover:bg-blue-50",
    hex: "#3b82f6"
  },
  purple: {
    badgeText: "text-purple-500", badgeBg: "bg-purple-500", priceText: "text-purple-600",
    highlightCardBg: "border-purple-300 bg-purple-50 shadow-purple-600/10",
    button: "bg-purple-500 text-white hover:bg-purple-600", buttonOutline: "border border-purple-500 text-purple-600 hover:bg-purple-50",
    hex: "#a855f7"
  },
  emerald: {
    badgeText: "text-emerald-500", badgeBg: "bg-emerald-500", priceText: "text-emerald-600",
    highlightCardBg: "border-emerald-300 bg-emerald-50 shadow-emerald-600/10",
    button: "bg-emerald-500 text-white hover:bg-emerald-600", buttonOutline: "border border-emerald-500 text-emerald-600 hover:bg-emerald-50",
    hex: "#10b981"
  },
  orange: {
    badgeText: "text-orange-500", badgeBg: "bg-orange-500", priceText: "text-orange-600",
    highlightCardBg: "border-orange-300 bg-orange-50 shadow-orange-600/10",
    button: "bg-orange-500 text-white hover:bg-orange-600", buttonOutline: "border border-orange-500 text-orange-600 hover:bg-orange-50",
    hex: "#f97316"
  },
  cyan: {
    badgeText: "text-cyan-500", badgeBg: "bg-cyan-500", priceText: "text-cyan-600",
    highlightCardBg: "border-cyan-300 bg-cyan-50 shadow-cyan-600/10",
    button: "bg-cyan-500 text-white hover:bg-cyan-600", buttonOutline: "border border-cyan-500 text-cyan-600 hover:bg-cyan-50",
    hex: "#06b6d4"
  },
  pink: {
    badgeText: "text-pink-500", badgeBg: "bg-pink-500", priceText: "text-pink-600",
    highlightCardBg: "border-pink-300 bg-pink-50 shadow-pink-600/10",
    button: "bg-pink-500 text-white hover:bg-pink-600", buttonOutline: "border border-pink-500 text-pink-600 hover:bg-pink-50",
    hex: "#ec4899"
  },
  amber: {
    badgeText: "text-amber-500", badgeBg: "bg-amber-500", priceText: "text-amber-600",
    highlightCardBg: "border-amber-300 bg-amber-50 shadow-amber-600/10",
    button: "bg-amber-500 text-white hover:bg-amber-600", buttonOutline: "border border-amber-500 text-amber-600 hover:bg-amber-50",
    hex: "#f59e0b"
  },
  lime: {
    badgeText: "text-lime-600", badgeBg: "bg-lime-600", priceText: "text-lime-700",
    highlightCardBg: "border-lime-300 bg-lime-50 shadow-lime-600/10",
    button: "bg-lime-600 text-white hover:bg-lime-700", buttonOutline: "border border-lime-600 text-lime-700 hover:bg-lime-50",
    hex: "#65a30d"
  },
  indigo: {
    badgeText: "text-indigo-500", badgeBg: "bg-indigo-500", priceText: "text-indigo-600",
    highlightCardBg: "border-indigo-300 bg-indigo-50 shadow-indigo-600/10",
    button: "bg-indigo-500 text-white hover:bg-indigo-600", buttonOutline: "border border-indigo-500 text-indigo-600 hover:bg-indigo-50",
    hex: "#6366f1"
  },
  rose: {
    badgeText: "text-rose-500", badgeBg: "bg-rose-500", priceText: "text-rose-600",
    highlightCardBg: "border-rose-300 bg-rose-50 shadow-rose-600/10",
    button: "bg-rose-500 text-white hover:bg-rose-600", buttonOutline: "border border-rose-500 text-rose-600 hover:bg-rose-50",
    hex: "#f43f5e"
  },
  violet: {
    badgeText: "text-violet-500", badgeBg: "bg-violet-500", priceText: "text-violet-600",
    highlightCardBg: "border-violet-300 bg-violet-50 shadow-violet-600/10",
    button: "bg-violet-500 text-white hover:bg-violet-600", buttonOutline: "border border-violet-500 text-violet-600 hover:bg-violet-50",
    hex: "#8b5cf6"
  },
  teal: {
    badgeText: "text-teal-500", badgeBg: "bg-teal-500", priceText: "text-teal-600",
    highlightCardBg: "border-teal-300 bg-teal-50 shadow-teal-600/10",
    button: "bg-teal-500 text-white hover:bg-teal-600", buttonOutline: "border border-teal-500 text-teal-600 hover:bg-teal-50",
    hex: "#14b8a6"
  },
  sky: {
    badgeText: "text-sky-500", badgeBg: "bg-sky-500", priceText: "text-sky-600",
    highlightCardBg: "border-sky-300 bg-sky-50 shadow-sky-600/10",
    button: "bg-sky-500 text-white hover:bg-sky-600", buttonOutline: "border border-sky-500 text-sky-600 hover:bg-sky-50",
    hex: "#0ea5e9"
  },
};

export function PricingPlanModal({ featureRows, label = "View Plan", className = "", inquirySubject, tiers, addOns = [], variant = "primary", themeColor = "orange", open, onOpenChange, actionLabel, onAction }: PricingPlanModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalIsOpen;
  const setIsOpen = onOpenChange ?? setInternalIsOpen;
  const [isMounted, setIsMounted] = useState(false);
  const theme = themeColors[themeColor] ?? themeColors.orange;
  const scrollbarStyle = {
    "--pricing-scrollbar": theme.hex,
    scrollbarColor: `${theme.hex} #e2e8f0`
  } as CSSProperties;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    const modalDepth = Number(document.body.dataset.modalDepth ?? 0) + 1;
    document.body.dataset.modalDepth = String(modalDepth);
    document.body.dataset.modalOpen = "true";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      const nextDepth = Math.max(0, Number(document.body.dataset.modalDepth ?? 1) - 1);
      if (nextDepth === 0) {
        delete document.body.dataset.modalDepth;
        delete document.body.dataset.modalOpen;
      } else {
        document.body.dataset.modalDepth = String(nextDepth);
      }
    };
  }, [isOpen, setIsOpen]);

  const modal = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] grid min-h-dvh place-items-center overflow-hidden bg-slate-950/65 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-5" role="dialog" aria-modal="true" aria-labelledby="pricing-modal-title">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Tutup modal pricing" onClick={() => setIsOpen(false)} />

          <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative my-auto w-full max-w-[min(96vw,1760px)] overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:gap-4 sm:px-7 sm:py-4">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.16em] ${theme.badgeText}`}>Pricing Plan</p>
            <h2 id="pricing-modal-title" className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
              Pilih Tier Langganan Omnia
            </h2>
            {inquirySubject ? <p className="mt-1 text-sm font-black text-slate-700">{inquirySubject}</p> : null}
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Harga dan kelengkapan fitur mengikuti karakter sub-industri yang dipilih. Scope final tetap disesuaikan dengan outlet, user, add-on, dan kompleksitas workflow.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="pricing-modal-scroll p-4 sm:p-5" style={scrollbarStyle}>
          <div className="grid gap-4 lg:grid-cols-4">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`flex min-h-full flex-col rounded-2xl border p-4 ${
                  tier.highlight ? `${theme.highlightCardBg} shadow-lg` : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{tier.name}</h3>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{tier.description}</p>
                  </div>
                  {tier.highlight ? <span className={`rounded-full ${theme.badgeBg} px-3 py-1 text-xs font-black text-white`}>Populer</span> : null}
                </div>

                <div className="mt-4">
                  <p className={`text-xl font-black ${theme.priceText}`}>{tier.price}</p>
                  <p className="text-sm font-bold text-slate-500">{tier.cadence}</p>
                  <p className="mt-2 rounded-xl bg-white/75 px-3 py-2 text-xs font-bold leading-5 text-slate-600">{tier.fit}</p>
                  {tier.limits?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tier.limits.map((limit) => (
                        <span key={limit} className={`rounded-full border px-3 py-1.5 text-xs font-black ${theme.buttonOutline}`}>
                          {limit}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-1.5">
                  {featureRows.map((feature, index) => {
                    const included = tier.features[index];
                    return (
                      <div key={feature} className="flex items-start gap-2 text-xs font-bold leading-4 text-slate-700">
                        {included ? (
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                        ) : (
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" aria-hidden="true" />
                        )}
                        <span className={included ? "" : "text-slate-400"}>{feature}</span>
                      </div>
                    );
                  })}
                </div>

                {onAction ? (
                  <button
                    type="button"
                    onClick={() => {
                      onAction(tier);
                      setIsOpen(false);
                    }}
                    className={`mt-auto pt-6`}
                  >
                    <div className={`flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-black transition-colors ${tier.highlight ? theme.button : theme.buttonOutline}`}>
                      {actionLabel ?? "Pilih"}
                    </div>
                  </button>
                ) : (
                  <a
                    href={buildWhatsAppUrl(`Halo Omnia, saya ingin konsultasi untuk ${tier.name}${inquirySubject ? ` terkait ${inquirySubject}` : ""}.`)}
                    className={`mt-auto pt-6`}
                  >
                    <div className={`flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-black transition-colors ${tier.highlight ? theme.button : theme.buttonOutline}`}>
                      Konsultasi
                    </div>
                  </a>
                )}
              </article>
            ))}
          </div>

          {addOns.length ? (
            <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.16em] ${theme.badgeText}`}>Add-on opsional</p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">Tambahan fitur lintas aplikasi</h3>
                </div>
                <p className="max-w-xl text-xs font-bold leading-5 text-slate-500">Add-on dipilih saat checkout atau discovery agar fitur dari aplikasi lain bisa dipakai tanpa membeli paket penuh.</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {addOns.slice(0, 6).map((addOn) => (
                  <article key={addOn.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{addOn.category} / {addOn.complexity}</p>
                        <h4 className="mt-1 text-sm font-black text-slate-950">{addOn.name}</h4>
                      </div>
                      <p className={`shrink-0 text-sm font-black ${theme.priceText}`}>{addOn.price}</p>
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{addOn.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      {label ? (
        <Button type="button" onClick={() => setIsOpen(true)} variant={variant} showArrow className={className}>
          {label}
        </Button>
      ) : null}

      {isMounted ? createPortal(modal, document.body) : null}
    </>
  );
}
