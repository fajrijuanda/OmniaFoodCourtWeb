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


export function ServicesSection({ activeSection }: { activeSection: string }) {
  return (
    <section id="solusi" className="overflow-hidden rounded-[32px] bg-[#171717] py-16 text-white sm:rounded-[56px] sm:py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr_auto] lg:items-end">
          <SectionTitle eyebrow="Solusi" title="Core |Services" align="left" inverse />
          <Reveal>
            <p className="text-base font-bold leading-7 text-white/78 sm:text-xl sm:leading-9">Komponen Omnia disusun seperti product suite: mulai dari website, lalu berkembang menjadi sistem operasional, commerce, automation, dan integrasi.</p>
          </Reveal>
          <div className="h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 shrink-0 relative">
            {activeSection === "solusi" && (
              <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute -bottom-10 right-0 w-[70px] sm:w-[120px] lg:w-[180px] z-20">
                <OmniaMascot compact />
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.05} className="h-full">
              <article className="group flex h-full flex-col min-h-full rounded-[26px] border border-white/25 bg-white/10 p-5 backdrop-blur transition hover:-translate-y-2 hover:bg-white/15 sm:rounded-[32px] sm:p-6">
                <div className="flex items-center justify-between border-b border-white/20 pb-6">
                  <h3 className="text-2xl font-black">{service.title}</h3>
                  <service.icon className="h-7 w-7 text-orange-400" />
                </div>
                <ServiceMockup type={service.mockup} />
                <p className="mt-7 text-base font-bold leading-7 text-white/75">{service.text}</p>
                <div className="mt-auto pt-8">
                  <ArrowBubble />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}