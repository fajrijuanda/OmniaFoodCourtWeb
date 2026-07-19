import { Sparkles, Star } from "lucide-react";
import { Reveal } from "@/components/showcase/ShowcasePrimitives";
import { OmniaMascot } from "@/components/showcase/Mockups";
import type { MascotName, MascotStage } from "@/components/OmniaShowcaseLanding";


export function HeroSection({
  mascot,
  mascotStage,
  onMascotChange
}: {
  activeSection: string;
  mascot: MascotName;
  mascotStage: MascotStage;
  onMascotChange: (mascot: MascotName) => void;
}) {
  return (
    <section id="home" className="section-shell min-h-[760px] overflow-hidden pt-24 text-center sm:min-h-screen sm:pt-36">
      <Reveal>
        <div className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-[#171717] bg-white px-5 py-3 text-sm font-black sm:px-7 sm:text-lg">
          <Sparkles className="h-5 w-5 text-orange-500" />
          Satu ekosistem digital
        </div>
        <h1 className="mx-auto mt-5 max-w-6xl text-[2rem] font-black leading-[0.96] tracking-normal text-[#171717] min-[420px]:text-[2.45rem] sm:mt-8 sm:text-7xl lg:text-8xl">
          <span className="block sm:inline">Omnia <span className="text-orange-500">Digital</span>,</span>{" "}
          <span className="block sm:inline">Sistem Bisnis</span>{" "}
          <span className="block sm:inline">yang Siap</span>{" "}
          <span className="block sm:inline">Tumbuh</span>
        </h1>
      </Reveal>



      <div className="relative mx-auto mt-4 min-h-[410px] max-w-[1298px] sm:mt-8 sm:mt-12 sm:min-h-[650px] lg:min-h-[720px]">
        <Reveal className="absolute left-2 top-24 hidden max-w-[280px] text-left xl:block" delay={0.12}>
          <p className="text-7xl font-black leading-none text-[#263247]">&quot;</p>
          <p className="-mt-4 text-xl font-black leading-8 text-[#263247]">Website, POS, ERP, CRM, AI chatbot, dan integrasi dalam satu arah strategi.</p>
        </Reveal>

        <Reveal className="absolute right-2 top-20 hidden text-right xl:block" delay={0.2}>
          <div className="flex justify-end gap-1 text-orange-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-7 w-7 fill-current" />
            ))}
          </div>
          <p className="mt-5 text-5xl font-black">12+</p>
          <p className="text-lg font-semibold">lini industri</p>
        </Reveal>

        <div className="absolute inset-x-0 bottom-0 mx-auto h-[270px] w-[min(100%,520px)] rounded-t-full bg-orange-300 sm:h-[430px] sm:w-[min(100%,780px)] lg:h-[470px]">

          <button
            type="button"
            onClick={() => onMascotChange("omni")}
            disabled={mascotStage !== "idle"}
            aria-pressed={mascot === "omni"}
            className={`absolute left-4 top-10 z-40 rounded-full px-4 py-2 text-xs font-black shadow-2xl transition-all disabled:cursor-wait sm:left-6 sm:top-20 sm:px-6 sm:py-3 sm:text-sm lg:left-14 ${
              mascot === "omni" ? "bg-orange-500 text-white ring-4 ring-white/70" : "bg-white text-[#171717] hover:bg-slate-100"
            }`}
          >
            Omni
          </button>
          <button
            type="button"
            onClick={() => onMascotChange("odi")}
            disabled={mascotStage !== "idle"}
            aria-pressed={mascot === "odi"}
            className={`absolute right-4 top-10 z-40 rounded-full px-4 py-2 text-xs font-black shadow-2xl transition-all disabled:cursor-wait sm:right-6 sm:top-20 sm:px-6 sm:py-3 sm:text-sm lg:right-14 ${
              mascot === "odi" ? "bg-orange-500 text-white ring-4 ring-white/70" : "bg-[#171717] text-white hover:bg-[#2b2b2b]"
            }`}
          >
            Odi
          </button>
        </div>
      </div>
    </section>
  );
}
