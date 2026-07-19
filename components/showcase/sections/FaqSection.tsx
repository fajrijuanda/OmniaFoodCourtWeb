import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Star, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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


export function FaqSection({ activeSection }: { activeSection: string }) {
  return (
    <section id="faq" className="section-shell py-12 sm:py-24">
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="FAQ" title="Pertanyaan yang |Sering Muncul" />
        <div className="absolute -right-16 top-0 h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
          {activeSection === "faq" && (
            <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 left-0 w-[70px] sm:w-[120px] lg:w-[180px] z-20">
              <OmniaMascot compact />
            </motion.div>
          )}
        </div>
      </div>
      <div className="mx-auto mt-8 sm:mt-12 max-w-4xl space-y-4">
        {faqs.map((faq, index) => (
          <Reveal key={faq.question} delay={index * 0.035}>
            <details className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[26px] sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-black text-[#263247] transition-colors hover:text-orange-500 group-open:text-orange-500 sm:text-xl">
                {faq.question}
                <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-transform duration-300 group-open:rotate-180 group-hover:bg-orange-100 group-open:bg-orange-100">
                  <ChevronDown className="h-5 w-5" />
                </span>
              </summary>
              <p className="mt-4 text-base font-bold leading-7 text-slate-500 sm:text-lg sm:leading-8">{faq.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}