import type { Tone } from "./types";

export const toneClasses: Record<Tone, { soft: string; solid: string; text: string; border: string }> = {
  primary: {
    soft: "bg-[var(--portal-primary-soft)]",
    solid: "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]",
    text: "text-[var(--portal-primary)]",
    border: "border-[var(--portal-primary)]"
  },
  slate: { soft: "bg-slate-100", solid: "bg-slate-950 text-white", text: "text-slate-600", border: "border-slate-200" },
  emerald: { soft: "bg-emerald-50", solid: "bg-emerald-500 text-white", text: "text-emerald-600", border: "border-emerald-100" },
  amber: { soft: "bg-amber-50", solid: "bg-amber-500 text-white", text: "text-amber-600", border: "border-amber-100" },
  rose: { soft: "bg-rose-50", solid: "bg-rose-500 text-white", text: "text-rose-600", border: "border-rose-100" },
  orange: { soft: "bg-orange-50", solid: "bg-orange-500 text-white", text: "text-orange-600", border: "border-orange-100" },
  blue: { soft: "bg-blue-50", solid: "bg-blue-500 text-white", text: "text-blue-600", border: "border-blue-100" },
  pink: { soft: "bg-pink-50", solid: "bg-pink-500 text-white", text: "text-pink-600", border: "border-pink-100" }
};

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
