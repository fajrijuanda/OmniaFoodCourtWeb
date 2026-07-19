"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";

export type PortalThemeKey = "neutral" | "omni" | "odi" | "emerald" | "violet" | "rose" | "yellow" | "brown" | "colorful";

export type PortalTheme = {
  key: PortalThemeKey;
  name: string;
  description: string;
  primary: string;
  preview?: string;
  primarySoft: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  onPrimary: string;
};

export const PORTAL_THEME_STORAGE_KEY = "omnia-portal-theme";

export const portalThemes: PortalTheme[] = [
  {
    key: "neutral",
    name: "Neutral",
    description: "Industry colors",
    primary: "#334155",
    primarySoft: "#f1f5f9",
    surface: "#ffffff",
    text: "#172033",
    muted: "#64748b",
    border: "#e2e8f0",
    onPrimary: "#ffffff"
  },
  {
    key: "omni",
    name: "Omni",
    description: "Orange energetic",
    primary: "#f97316",
    primarySoft: "#fff3e8",
    surface: "#ffffff",
    text: "#172033",
    muted: "#667085",
    border: "#e7edf5",
    onPrimary: "#ffffff"
  },
  {
    key: "odi",
    name: "Odi",
    description: "Blue digital",
    primary: "#0ea5e9",
    primarySoft: "#eaf8ff",
    surface: "#ffffff",
    text: "#172033",
    muted: "#667085",
    border: "#e7edf5",
    onPrimary: "#ffffff"
  },
  {
    key: "emerald",
    name: "Emerald",
    description: "Growth",
    primary: "#10b981",
    primarySoft: "#ecfdf5",
    surface: "#ffffff",
    text: "#163027",
    muted: "#667085",
    border: "#dff3eb",
    onPrimary: "#ffffff"
  },
  {
    key: "violet",
    name: "Violet",
    description: "Creative",
    primary: "#7c3aed",
    primarySoft: "#f3edff",
    surface: "#ffffff",
    text: "#251a3d",
    muted: "#6b617d",
    border: "#e8defd",
    onPrimary: "#ffffff"
  },
  {
    key: "rose",
    name: "Rose",
    description: "Warm service",
    primary: "#e11d48",
    primarySoft: "#fff1f4",
    surface: "#ffffff",
    text: "#31131b",
    muted: "#745b63",
    border: "#f8d7df",
    onPrimary: "#ffffff"
  },
  {
    key: "yellow",
    name: "Yellow",
    description: "Bright energy",
    primary: "#facc15",
    primarySoft: "#fef9c3",
    surface: "#ffffff",
    text: "#1f2937",
    muted: "#6b7280",
    border: "#f7e9a0",
    onPrimary: "#111827"
  },
  {
    key: "brown",
    name: "Brown",
    description: "Grounded",
    primary: "#92400e",
    primarySoft: "#fef3c7",
    surface: "#ffffff",
    text: "#2f1f14",
    muted: "#756457",
    border: "#ead7bd",
    onPrimary: "#ffffff"
  },
  {
    key: "colorful",
    name: "Colorful",
    description: "Tech Giant vibe",
    primary: "#4285F4",
    preview: "conic-gradient(#ea4335 0deg 90deg, #fbbc05 90deg 180deg, #34a853 180deg 270deg, #4285f4 270deg 360deg)",
    primarySoft: "#e8f0fe",
    surface: "#ffffff",
    text: "#202124",
    muted: "#5f6368",
    border: "#dadce0",
    onPrimary: "#ffffff"
  }
];

export function getPortalTheme(key: PortalThemeKey) {
  return portalThemes.find((theme) => theme.key === key) ?? portalThemes[0];
}

export function isPortalThemeKey(value: string | null): value is PortalThemeKey {
  return portalThemes.some((theme) => theme.key === value);
}

export function getPortalThemeStyle(theme: PortalTheme) {
  return {
    "--portal-primary": theme.primary,
    "--portal-primary-soft": theme.primarySoft,
    "--portal-surface": theme.surface,
    "--portal-text": theme.text,
    "--portal-muted": theme.muted,
    "--portal-border": theme.border,
    "--portal-on-primary": theme.onPrimary
  } as React.CSSProperties;
}

export function ThemeCustomizer({
  activeTheme,
  onChange
}: {
  activeTheme: PortalThemeKey;
  onChange: (theme: PortalThemeKey) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const active = getPortalTheme(activeTheme);

  return (
    <div className="fixed bottom-20 right-4 z-50 sm:bottom-5 sm:right-5">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Buka pengaturan warna portal"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--portal-border)] bg-[var(--portal-surface)] text-[var(--portal-text)] shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-1"
        >
          <Palette className="h-5 w-5" />
        </button>
        <AnimatePresence>
        {isOpen ? (
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="absolute bottom-16 right-0 w-[min(calc(100vw-32px),310px)] rounded-[24px] border border-[var(--portal-border)] bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--portal-primary)]">Theme</p>
              <h2 className="mt-1 text-xl font-black text-[#172033]">Warna portal</h2>
              <p className="mt-1 text-xs font-bold text-slate-500">Aktif: {active.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup pengaturan warna portal"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2">
            {portalThemes.map((theme) => (
              <button
                key={theme.key}
                type="button"
                onClick={() => onChange(theme.key)}
                className={`flex items-center gap-3 rounded-[16px] border p-3 text-left transition hover:-translate-y-0.5 ${
                  activeTheme === theme.key ? "border-[var(--portal-primary)] bg-[var(--portal-primary-soft)]" : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <span
                  className="h-9 w-9 shrink-0 rounded-full border border-slate-200 shadow-inner"
                  style={{ background: theme.preview || theme.primary }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black text-[#172033]">{theme.name}</span>
                  <span className="block text-xs font-bold text-slate-500">{theme.description}</span>
                </span>
                {activeTheme === theme.key ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--portal-primary)]" /> : null}
              </button>
            ))}
          </div>
        </motion.div>
        ) : null}
        </AnimatePresence>
      </div>
      <style>{`
        .portal-colorful-strip { display: none; }
        [data-portal-theme="colorful"] .portal-colorful-strip {
          display: block;
          background: linear-gradient(90deg, #4285F4 25%, #EA4335 25% 50%, #FBBC05 50% 75%, #34A853 75%);
        }
        [data-portal-theme="colorful"] .portal-colorful-text {
          background: linear-gradient(90deg, #4285F4 25%, #EA4335 25% 50%, #FBBC05 50% 75%, #34A853 75%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
