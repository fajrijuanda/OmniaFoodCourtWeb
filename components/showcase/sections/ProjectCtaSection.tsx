import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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


export function ProjectCtaSection({ activeSection }: { activeSection: string }) {
  return (
    <section id="cta" className="relative bg-white py-14 sm:py-28">
      <div className="section-shell relative">
        <div className="absolute -top-10 right-10 h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
          {activeSection === "cta" && (
            <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 left-0 w-[60px] sm:w-[100px] lg:w-[140px] z-20">
              <OmniaMascot compact />
            </motion.div>
          )}
        </div>
        <Reveal>
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-black leading-tight text-[#263247] sm:text-5xl lg:text-7xl">
              Siap Pilih Plan Sesuai <br className="hidden sm:block" />
              Sub-Industri? <span className="text-orange-500">Let&apos;s Discuss</span>
            </h2>

            <div className="mx-auto mt-8 sm:mt-12 flex max-w-3xl items-center rounded-full border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500 sm:h-14 sm:w-14">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <input type="email" placeholder="Enter Email Address" className="w-full bg-transparent px-4 text-base font-bold text-[#263247] outline-none placeholder:text-slate-400 sm:px-6 sm:text-lg" />
              <button className="shrink-0 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 sm:px-10 sm:py-4 sm:text-lg">
                Send
              </button>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-12">
              <div className="flex items-center gap-2 text-sm font-black text-[#263247] sm:text-base">
                <Star className="h-5 w-5 fill-[#263247]" />
                4.9/5 Average Ratings
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-[#263247] sm:text-base">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                25+ Winning Awards
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-[#263247] sm:text-base">
                <svg className="h-5 w-5 text-[#263247]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                Certified Product Designer
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
