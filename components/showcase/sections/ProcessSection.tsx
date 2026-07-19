import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { PricingPlanModal } from "@/components/PricingPlanModal";
import { ArrowBubble, FeaturePill, Reveal, SectionTitle } from "@/components/showcase/ShowcasePrimitives";
import { MiniChartPanel, OmniaMascot, OmniaProductIllustration, PortfolioVisual, ServiceMockup } from "@/components/showcase/Mockups";
import { buildPlans, getSegmentModules } from "@/components/showcase/pricing";
import { industryTone, navItems, processSteps, serviceCards, toneClasses } from "@/components/showcase/showcaseData";
import { faqs } from "@/data/faqs";
import { industries } from "@/data/industries";
import { packages } from "@/data/packages";
import { portfolio } from "@/data/portfolio";
import { products } from "@/data/products";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";


export function ProcessSection({ activeSection }: { activeSection: string }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeSection !== "proses") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveStep(Number(visible[0].target.getAttribute("data-step")));
        }
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: "-20% 0px -20% 0px" }
    );
    document.querySelectorAll(".process-step").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeSection]);

  return (
    <section id="proses" className="section-shell py-12 sm:py-20">
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="Workflow" title="Proses Kerja yang |Jelas" />
      </div>
      <div className="relative mx-auto mt-10 sm:mt-16 flex max-w-5xl flex-col gap-8 sm:gap-10">
        <div className="absolute bottom-8 left-[34px] top-8 w-1 border-l-4 border-dashed border-slate-300 lg:left-1/2 lg:-translate-x-1/2" />
        {processSteps.map((step, index) => {
          const isLeft = index % 2 === 0;
          const isActive = activeSection === "proses" && activeStep === index;

          return (
            <div key={step[0]} data-step={index} className="process-step relative block pl-[72px] lg:grid lg:grid-cols-[1fr_80px_1fr] lg:items-center lg:gap-6 lg:pl-0">
              <div className={isLeft ? "lg:col-start-1 lg:text-right" : "lg:col-start-1"}>
                {isLeft ? (
                  <div className={`rounded-[26px] p-5 sm:rounded-[30px] sm:p-7 transition-all duration-500 ${isActive ? 'bg-white ring-4 ring-orange-500/50 shadow-2xl scale-[1.02]' : 'bg-[#f2f4f7] shadow-sm'}`}>
                    <p className="text-sm font-black text-orange-500">{step[0]}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-normal text-[#263247] sm:text-3xl">{step[1]}</h3>
                    <p className="mt-3 text-base font-bold leading-7 text-slate-500 sm:text-lg sm:leading-8">{step[2]}</p>
                  </div>
                ) : <div className="hidden lg:block" />}
              </div>

              <div className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-sm z-10 transition-colors duration-500 lg:static lg:col-start-2 lg:mt-0 lg:h-14 lg:w-14 lg:-translate-y-0 lg:justify-self-center">
                <div className={`h-3 w-3 lg:h-4 lg:w-4 rounded-full transition-colors duration-500 ${isActive ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]' : 'bg-slate-300'}`} />
              </div>

              <div className={!isLeft ? "lg:col-start-3" : "lg:col-start-3"}>
                {!isLeft ? (
                  <div className={`rounded-[26px] p-5 sm:rounded-[30px] sm:p-7 transition-all duration-500 ${isActive ? 'bg-white ring-4 ring-orange-500/50 shadow-2xl scale-[1.02]' : 'bg-[#f2f4f7] shadow-sm'}`}>
                    <p className="text-sm font-black text-orange-500">{step[0]}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-normal text-[#263247] sm:text-3xl">{step[1]}</h3>
                    <p className="mt-3 text-base font-bold leading-7 text-slate-500 sm:text-lg sm:leading-8">{step[2]}</p>
                  </div>
                ) : <div className="hidden lg:block" />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
