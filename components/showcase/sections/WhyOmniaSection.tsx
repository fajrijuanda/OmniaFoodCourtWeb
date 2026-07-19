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


export function WhyOmniaSection({ activeSection }: { activeSection: string }) {
  return (
    <section id="why" className="mx-auto max-w-[1440px] rounded-[32px] bg-[#f2f4f7] py-16 sm:rounded-[44px] sm:py-20">
      <div className="section-shell grid items-center gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1fr]">
        <Reveal>
          <div className="relative">
            <OmniaProductIllustration />
            <div className="absolute -bottom-6 -right-10 h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
              {activeSection === "why" && (
                <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 right-0 w-[70px] sm:w-[120px] lg:w-[180px] z-20">
                  <OmniaMascot compact />
                </motion.div>
              )}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-3xl font-black leading-tight tracking-normal text-[#263247] sm:text-4xl lg:text-6xl">
            Kenapa <span className="text-orange-500">Omnia</span> cocok untuk bisnis lintas industri?
          </h2>
          <p className="mt-6 max-w-2xl text-base font-bold leading-7 text-slate-500 sm:text-xl sm:leading-9">Karena sistem tidak dipaksa generik. Modul, harga, dan prioritas fitur disesuaikan ke cara kerja sub-industri: klinik, retail, F&B, properti, manufaktur, sampai layanan publik.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {["Modular dari kecil ke besar", "Dashboard owner real-time", "Integrasi WA, payment, API", "Support dan maintenance"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-base font-black text-[#263247] sm:text-lg">
                <CheckCircle2 className="h-6 w-6 text-orange-500" />
                {item}
              </div>
            ))}
          </div>
          <a href="/login" className="mt-8 sm:mt-10 inline-flex rounded-[18px] border border-[#171717] px-5 py-3 text-sm font-black transition hover:bg-[#171717] hover:text-white sm:rounded-[28px] sm:px-14 sm:py-6 sm:text-2xl">
            Lihat Demo Portal
          </a>
        </Reveal>
      </div>
    </section>
  );
}
