"use client";

import { BrandLogo } from "@/components/BrandLogo";

export function PortalLoadingScreen({ label = "Memuat Omnia" }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-white"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px]" />
      <div className="relative z-10 flex flex-col items-center">
        <BrandLogo className="mb-8 h-32 w-32 animate-in zoom-in duration-700 ease-out drop-shadow-xl" />
        <div className="h-1 w-32 overflow-hidden rounded-full bg-neutral-200">
          <div className="omnia-splash-progress h-full rounded-full bg-orange-500" />
        </div>
        <span className="sr-only">{label}</span>
      </div>
      <style>{`
        @keyframes omnia-splash-progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 42%; transform: translateX(45%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        .omnia-splash-progress {
          animation: omnia-splash-progress 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .omnia-splash-progress { animation-duration: 3s; }
        }
      `}</style>
    </div>
  );
}
