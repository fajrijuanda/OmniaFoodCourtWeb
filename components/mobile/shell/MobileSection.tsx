import type { ReactNode } from "react";

export function MobileSection({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(236,240,248,0.92)_42%,_rgba(229,231,235,1)_100%)] px-4 py-4 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[460px] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 px-5 py-5 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-[32ch] text-sm leading-6 text-slate-600">{description}</p>
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {children ?? "Placeholder route untuk fondasi mobile. Isi fase berikutnya akan dipasang di sini."}
        </div>
      </div>
    </main>
  );
}
