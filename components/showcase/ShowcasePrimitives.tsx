"use client";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { toneClasses } from "@/components/showcase/showcaseData";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`scroll-reveal ${className}`} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, align = "center", inverse = false }: { eyebrow: string; title: string; align?: "left" | "center"; inverse?: boolean }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">{eyebrow}</p>
      <h2 className={`mt-4 text-3xl font-black leading-[1.04] tracking-normal text-3xl sm:text-4xl lg:text-6xl ${inverse ? "text-white" : "text-[#263247]"}`}>
        {title.split("|").map((part, index) => (
          <span key={`${part}-${index}`} className={index % 2 ? "text-orange-500" : ""}>
            {part}
          </span>
        ))}
      </h2>
    </Reveal>
  );
}

export function ArrowBubble({ className = "", tone = "orange" }: { className?: string; tone?: string }) {
  const color = toneClasses[tone] ?? toneClasses.orange;

  return (
    <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2d40] text-white shadow-xl transition group-hover:scale-105 sm:h-16 sm:w-16 ${color.hoverBg} ${className}`}>
      <ArrowUpRight className="h-6 w-6 sm:h-8 sm:w-8" />
    </span>
  );
}

export function FeaturePill({ children, inverse = false, tone = "orange" }: { children: ReactNode; inverse?: boolean; tone?: string }) {
  const color = toneClasses[tone] ?? toneClasses.orange;

  return (
    <div className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-black ${inverse ? "bg-white/10 text-white" : `${color.softBg} text-[#263247]`}`}>
      <CheckCircle2 className={`h-4 w-4 shrink-0 ${color.text}`} />
      <span className="truncate">{children}</span>
    </div>
  );
}
