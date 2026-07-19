import { ArrowUpRight, Bot, CalendarCheck, ChartNoAxesCombined, Database, Globe2, MessageSquareText, ShoppingCart } from "lucide-react";

const moduleIcons = [
  ["Website", Globe2, "bg-orange-100 text-orange-600"],
  ["POS", ShoppingCart, "bg-emerald-100 text-emerald-600"],
  ["ERP", Database, "bg-indigo-100 text-indigo-600"],
  ["AI", Bot, "bg-cyan-100 text-cyan-600"],
  ["Booking", CalendarCheck, "bg-amber-100 text-amber-600"],
  ["CRM", MessageSquareText, "bg-pink-100 text-pink-600"]
];

export function HeroDashboardMockup() {
  return (
    <div className="absolute inset-x-4 top-36 rounded-[28px] border border-white/75 bg-white/78 p-3 shadow-2xl backdrop-blur sm:rounded-[36px] sm:p-4 md:inset-x-12 md:p-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          ["Leads", "426", "+32%"],
          ["Orders", "2.4k", "+18%"],
          ["Automation", "92%", "resolved"]
        ].map(([label, value, note]) => (
          <div key={label} className="rounded-[20px] bg-white p-3 text-left shadow-[0_16px_40px_rgba(15,23,42,0.12)] sm:rounded-[24px] sm:p-5">
            <p className="truncate text-[11px] font-black text-slate-500 sm:text-sm">{label}</p>
            <p className="mt-2 text-xl font-black text-[#263247] sm:mt-3 sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs font-black text-orange-500">{note}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[24px] bg-[#171717] p-4 text-left text-white sm:mt-4 sm:rounded-[30px] sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-300 sm:text-sm">Omnia OS</p>
            <p className="mt-2 text-lg font-black sm:text-2xl">Business Command Center</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-orange-100">Live</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5">
          {moduleIcons.map(([label, Icon]) => (
            <span key={label as string} className="truncate rounded-full bg-white/10 px-3 py-2 text-xs font-bold sm:text-sm">
              {label as string}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OmniaMascot({ className = "", compact = false, variant = "omni" }: { className?: string; compact?: boolean; variant?: "omni" | "odi" }) {
  const isOdi = variant === "odi";
  const accent = isOdi ? "#0ea5e9" : "#f97316";
  const accentDark = isOdi ? "#0369a1" : "#c2410c";
  const glow = isOdi ? "#7dd3fc" : "#fdba74";

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <filter id="shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <linearGradient id={`body-glow-${variant}`} x1="200" y1="120" x2="200" y2="460" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.72" stopColor="#f8fafc" />
            <stop offset="1" stopColor={isOdi ? "#e0f2fe" : "#ffedd5"} />
          </linearGradient>
          <linearGradient id={`metal-${variant}`} x1="114" y1="172" x2="286" y2="433" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="1" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="480" rx="130" ry="16" fill="black" fillOpacity="0.12" filter="url(#shadow-blur)" />
        <path d="M75 245C75 168 126 116 200 116C274 116 325 168 325 245V345C325 420 275 466 200 466C125 466 75 420 75 345V245Z" fill={`url(#body-glow-${variant})`} />
        <path d="M90 252C90 178 135 137 200 137C265 137 310 178 310 252V270C310 308 286 333 246 333H154C114 333 90 308 90 270V252Z" fill="#141414" />
        <path d="M116 288C116 212 151 184 200 184C249 184 284 212 284 288" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="16" strokeLinecap="round" />
        {isOdi ? (
          <>
            <path d="M137 236Q153 214 169 236" stroke={glow} strokeWidth="11" strokeLinecap="round" />
            <path d="M231 236Q247 214 263 236" stroke={glow} strokeWidth="11" strokeLinecap="round" />
            <path d="M176 272Q200 296 224 272" stroke={glow} strokeWidth="11" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="156" cy="238" r="25" fill={accent} />
            <circle cx="244" cy="238" r="25" fill={accent} />
            <circle cx="167" cy="227" r="9" fill="#ffffff" />
            <circle cx="255" cy="227" r="9" fill="#ffffff" />
            <path d="M178 276Q200 300 222 276" stroke={accent} strokeWidth="10" strokeLinecap="round" />
          </>
        )}
        <circle cx="122" cy="293" r="18" fill={accentDark} fillOpacity={isOdi ? "0.18" : "0.64"} />
        <circle cx="278" cy="293" r="18" fill={accentDark} fillOpacity={isOdi ? "0.18" : "0.64"} />
        {isOdi ? (
          <g transform="translate(0 -6)">
            <path d="M154 101L168 74L184 99" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M184 99L200 62L216 99" stroke={glow} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M216 99L232 74L246 101" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="150" y="98" width="100" height="14" rx="7" fill="#e2e8f0" />
            <rect x="158" y="102" width="84" height="5" rx="2.5" fill={glow} fillOpacity="0.9" />
            <circle cx="168" cy="73" r="7" fill="#e0f2fe" stroke={accent} strokeWidth="4" />
            <circle cx="200" cy="61" r="8" fill="#e0f2fe" stroke={glow} strokeWidth="4" />
            <circle cx="232" cy="73" r="7" fill="#e0f2fe" stroke={accent} strokeWidth="4" />
          </g>
        ) : (
          <>
            <line x1="200" y1="116" x2="200" y2="72" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
            <circle cx="200" cy="56" r="26" fill={accent} />
            <circle cx="210" cy="47" r="9" fill="#ffffff" />
          </>
        )}
        <circle cx="91" cy="290" r="20" fill={`url(#metal-${variant})`} />
        <circle cx="309" cy="290" r="20" fill={`url(#metal-${variant})`} />
        <rect x="38" y="278" width="48" height="118" rx="24" fill="#ffffff" transform="rotate(18 62 337)" />
        <rect x="314" y="278" width="48" height="118" rx="24" fill="#ffffff" transform="rotate(-18 338 337)" />
        <rect x="124" y="365" width="152" height="72" rx="30" fill="#eef2f7" />
        <text x="200" y="405" textAnchor="middle" fill={accentDark} fontSize={compact ? "28" : "32"} fontWeight="900" fontFamily="Arial, sans-serif">
          {isOdi ? "Odi" : "Omni"}
        </text>
      </svg>
    </div>
  );
}

export function ServiceMockup({ type }: { type: string }) {
  const labels = {
    website: ["Hero", "SEO", "Lead"],
    commerce: ["Cart", "Pay", "Order"],
    ops: ["Stock", "Shift", "Report"],
    ai: ["Intent", "Reply", "Handoff"],
    hris: ["Payroll", "Leave", "Attnd"],
    cafe: ["POS", "Stock", "Table"],
    restaurant: ["Menu", "KDS", "Cost"],
    erp: ["Finance", "CRM", "Asset"]
  }[type] ?? ["Plan", "Build", "Grow"];

  return (
    <div className="relative mt-8 h-52 overflow-hidden rounded-[28px] bg-white/90 p-4 text-[#263247] shadow-2xl">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-300/80" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">omnia.app</span>
      </div>
      <div className="relative z-10 mt-5 grid grid-cols-[0.8fr_1.2fr] gap-3">
        <div className="space-y-2">
          {labels.map((label, index) => (
            <div key={label} className={`rounded-2xl px-3 py-3 text-xs font-black ${index === 0 ? "bg-orange-500 text-white" : "bg-slate-100"}`}>
              {label}
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-slate-100 p-3">
          <div className="h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-200" />
          <div className="mt-3 space-y-2">
            <div className="h-3 rounded-full bg-slate-300" />
            <div className="h-3 w-3/4 rounded-full bg-slate-300" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[42, 70, 54].map((height, index) => (
              <span key={index} className="rounded-t-lg bg-[#263247]" style={{ height }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OmniaProductIllustration() {
  return (
    <div className="relative mx-auto flex h-[480px] w-full max-w-[420px] flex-col overflow-hidden rounded-[38px] bg-gradient-to-br from-orange-400 to-orange-300 shadow-[0_24px_80px_rgba(249,115,22,0.25)] sm:h-[560px] lg:max-w-none">
      {/* Decorative blurs */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      
      {/* Glassmorphism Title Card */}
      <div className="absolute left-7 right-7 top-7 z-10 rounded-[28px] border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:left-10 sm:right-10 sm:top-10 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Why Omnia?</p>
        <p className="mt-3 text-3xl font-black leading-[1.1] text-[#263247] sm:text-4xl">Built for operational clarity.</p>
      </div>

      {/* Floating Module Pills */}
      <div className="absolute left-7 right-7 top-[220px] z-20 flex flex-row flex-wrap gap-2 sm:left-10 sm:right-auto sm:top-[230px] sm:flex-col sm:gap-3">
        {moduleIcons.slice(0, 2).map(([label, Icon, tone]) => (
          <div key={label as string} className="flex w-fit items-center gap-3 rounded-2xl border border-white/50 bg-white/95 p-2.5 pr-4 shadow-xl backdrop-blur-sm transition-transform hover:scale-105 sm:gap-4 sm:p-3 sm:pr-6">
            <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] sm:h-10 sm:w-10 sm:rounded-[12px] ${tone as string}`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="text-xs font-black text-[#263247] sm:text-sm">{label as string}</span>
          </div>
        ))}
      </div>

      {/* Floating Chart on the Right */}
      <div className="absolute right-7 top-[230px] z-20 hidden w-48 sm:block sm:right-10 sm:top-[260px]">
        <MiniChartPanel />
      </div>

      {/* Solid Dark Metrics Card */}
      <div className="absolute bottom-7 left-7 right-7 z-20 sm:bottom-10 sm:left-10 sm:right-10">
        <div className="flex flex-col justify-end rounded-[30px] border border-white/10 bg-[#171717] p-6 shadow-2xl sm:p-8">
          <p className="text-5xl font-black text-white sm:text-6xl">450<span className="text-orange-500">+</span></p>
          <p className="mt-2 text-sm font-bold text-white/60">workflow scenario siap disesuaikan</p>
        </div>
      </div>
    </div>
  );
}

export function PortfolioVisual({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f7efe8]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(23,23,23,.78)_100%)]" />
      <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-orange-300" />
      <div className="absolute left-8 top-8 w-[72%] rounded-[28px] bg-white p-4 shadow-2xl">
        <div className="h-28 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-200 to-white" />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-2xl bg-slate-100 p-3">
              <div className="h-12 rounded-xl bg-white" />
              <div className="mt-3 h-2 rounded-full bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full border border-orange-500 bg-white text-orange-500">
        <ArrowUpRight className="h-8 w-8" />
      </div>
      <div className="absolute bottom-24 left-8 rounded-full bg-white/20 px-4 py-2 text-sm font-black text-white backdrop-blur">Case {String(index + 1).padStart(2, "0")}</div>
    </div>
  );
}

export function MiniChartPanel() {
  return (
    <div className="rounded-[30px] border border-white/20 bg-white/10 p-5">
      <div className="flex items-center justify-between">
        <p className="font-black text-white">System health</p>
        <ChartNoAxesCombined className="h-5 w-5 text-orange-300" />
      </div>
      <div className="mt-5 flex h-28 items-end gap-2">
        {[42, 64, 52, 80, 72, 96, 84, 108].map((height, index) => (
          <span key={index} className="flex-1 rounded-t-xl bg-orange-400" style={{ height }} />
        ))}
      </div>
    </div>
  );
}
