import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Star, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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


export function IndustryPlanSection({ activeSection }: { activeSection: string }) {
  const [activeIndustryIndex, setActiveIndustryIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const activeIndustry = industries[activeIndustryIndex] ?? industries[0];
  const activeTone = industryTone[activeIndustry.name] ?? "orange";
  const activeColor = toneClasses[activeTone] ?? toneClasses.orange;

  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section id="industri" className="section-shell py-12 sm:py-24">
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="Industry Solutions" title="Pilih Sub-Industri, |Lihat Plan" />
        <div className="absolute -right-24 top-0 h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
          {activeSection === "industri" && (
            <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 left-8 w-[60px] sm:w-[100px] lg:w-[140px] z-20">
              <OmniaMascot compact />
            </motion.div>
          )}
        </div>
      </div>
      <Reveal className="mt-8 sm:mt-12">
        <div className="overflow-hidden rounded-[34px] border border-slate-200 bg-[#f7f9fb] shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <aside className="border-b border-slate-200 bg-white p-4 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center justify-between rounded-full bg-[#f2f4f7] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-black text-[#263247] shadow-sm">omnia.app</span>
              </div>

              {/* Mobile Dropdown */}
              <div className="relative z-50 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black text-white shadow-lg outline-none transition-all ${activeColor.bg}`}
                >
                  <span>{activeIndustry.name}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-[calc(100%+8px)] flex max-h-[320px] flex-col overflow-y-auto rounded-[20px] border border-slate-200 bg-white p-2 shadow-2xl"
                    >
                      {industries.map((industry, index) => {
                        const isActive = activeIndustryIndex === index;
                        return (
                          <button
                            key={industry.name}
                            type="button"
                            onClick={() => {
                              setActiveIndustryIndex(index);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-black transition-colors ${
                              isActive ? "bg-slate-100 text-[#263247]" : "text-slate-500 hover:bg-slate-50 hover:text-[#263247]"
                            }`}
                          >
                            {industry.name}
                            {isActive && <CheckCircle2 className="h-4 w-4 text-orange-500" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop List */}
              <div className="hidden lg:flex lg:max-h-[720px] lg:flex-col lg:gap-2 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
                {industries.map((industry, index) => {
                  const tone = industryTone[industry.name] ?? "orange";
                  const color = toneClasses[tone] ?? toneClasses.orange;
                  const isActive = activeIndustryIndex === index;

                  return (
                    <button
                      key={industry.name}
                      type="button"
                      onClick={() => setActiveIndustryIndex(index)}
                      className={`shrink-0 rounded-2xl px-4 py-3 text-left text-sm font-black transition w-full ${
                        isActive ? `${color.bg} text-white shadow-lg` : "bg-[#f2f4f7] text-[#263247] hover:bg-slate-200"
                      }`}
                    >
                      {industry.name}
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="min-w-0 p-5 sm:p-7">
              <div className="flex flex-col gap-6 xl:gap-8">
                <div className={`relative flex flex-col justify-between overflow-hidden rounded-[30px] p-6 sm:p-8 md:flex-row md:items-center ${activeColor.softBg}`}>
                  <div className={`absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 ${activeColor.bg}`} />
                  <div className="relative z-10 flex-1 md:pr-8">
                    <p className={`text-sm font-black uppercase tracking-[0.18em] ${activeColor.text}`}>Kategori Aktif</p>
                    <h3 className="mt-4 text-3xl font-black leading-tight text-[#263247] sm:text-4xl">{activeIndustry.name}</h3>
                    <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-slate-600">{activeIndustry.pain}</p>
                  </div>
                  <div className="relative z-10 mt-6 shrink-0 md:mt-0 md:w-[360px] xl:w-[420px]">
                    <div className="rounded-2xl bg-white/80 p-5 text-sm font-bold leading-6 text-slate-700 shadow-sm">{activeIndustry.solution}</div>
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Sub-industri</span>
                      <p className="mt-1 font-bold text-slate-700">{activeIndustry.segments.length} pilihan tersedia</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={scrollLeft} className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f7] text-[#263247] transition hover:text-white ${activeColor.hoverBg}`}>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button type="button" onClick={scrollRight} className={`focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f4f7] text-[#263247] transition hover:text-white ${activeColor.hoverBg}`}>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div ref={carouselRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
                    {activeIndustry.segments.map((segment, segmentIndex) => {
                      const modules = getSegmentModules(segment.offer);
                      const { featureRows, tiers, addOns } = buildPlans(activeIndustry.name, segment.name, modules);

                      return (
                        <article key={segment.name} className="flex w-[280px] h-full shrink-0 snap-start flex-col rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:w-[320px]">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className={`text-xs font-black uppercase tracking-[0.16em] ${activeColor.text}`}>Sub {String(segmentIndex + 1).padStart(2, "0")}</p>
                              <h4 className="mt-2 text-2xl font-black text-[#263247]">{segment.name}</h4>
                            </div>
                            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white ${activeColor.bg}`}>
                              <ArrowUpRight className="h-5 w-5" />
                            </span>
                          </div>

                          <p className="mt-4 text-sm font-bold leading-6 text-slate-500">{segment.need}</p>

                          <div className="mt-5 grid gap-2">
                            {modules.slice(0, 4).map((module) => (
                              <FeaturePill key={module} tone={activeTone}>{module}</FeaturePill>
                            ))}
                          </div>

                          <PricingPlanModal
                            featureRows={featureRows}
                            tiers={tiers}
                            addOns={addOns}
                            inquirySubject={`${segment.name} di lini ${activeIndustry.name}`}
                            variant="secondary"
                            className={`mt-auto w-full !rounded-full !border-[#171717] !bg-[#171717] !text-white ${activeColor.hoverBg}`}
                            themeColor={activeTone}
                          />
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
