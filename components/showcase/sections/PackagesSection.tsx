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


export function PackagesSection({ activeSection }: { activeSection: string }) {
  return (
    <section id="packages" className="overflow-hidden bg-[#171717] py-16 text-white sm:py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_0.6fr_auto] lg:items-end">
          <SectionTitle eyebrow="Paket" title="Scope yang |Bisa Dimulai" align="left" inverse />
          <Reveal>
            <MiniChartPanel />
          </Reveal>
          <div className="h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 shrink-0 relative">
            {activeSection === "packages" && (
              <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 right-0 w-[70px] sm:w-[120px] lg:w-[180px] z-20">
                <OmniaMascot compact />
              </motion.div>
            )}
          </div>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.035} className="h-full">
              <article className="flex h-full flex-col rounded-[30px] border border-white/15 bg-white/10 p-6 transition hover:-translate-y-2 hover:bg-white/15">
                <h3 className="text-2xl font-black">{item.name}</h3>
                <p className="mt-3 font-bold leading-7 text-white/65">{item.description}</p>
                <div className="mt-auto pt-6 space-y-3">
                  {item.features.slice(0, 5).map((feature) => (
                    <FeaturePill key={feature} inverse>{feature}</FeaturePill>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}