import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
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


export function Footer({ activeSection }: { activeSection?: string }) {
  return (
    <footer id="footer" className="bg-[#242424] text-white pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative">
        <div className="absolute -top-40 right-10 h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
          {activeSection === "footer" && (
            <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 right-0 w-[80px] sm:w-[140px] lg:w-[200px] z-20">
              <OmniaMascot compact />
            </motion.div>
          )}
        </div>
        
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Coba Portal Omnia
          </h2>
          <a href="/login" className="inline-flex shrink-0 items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-black transition hover:bg-orange-600 sm:px-8 sm:py-4 sm:text-xl">
            Demo Portal <ArrowUpRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>

        <div className="my-16 h-px w-full bg-white/10" />

        <div className="grid gap-10 lg:gap-12 lg:grid-cols-[1fr_auto_auto_1fr] lg:gap-20">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-12 w-12" />
              <span className="text-2xl font-black uppercase tracking-widest">OMNIA</span>
            </div>
            <p className="mt-6 text-sm font-bold leading-relaxed text-white/70">
              Masuk ke demo portal untuk melihat bagaimana tenant memilih aplikasi industri, sub-industri, dan modul sesuai tier langganan.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-[#242424] hover:bg-orange-500 hover:text-white"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-[#242424] hover:bg-orange-500 hover:text-white"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-orange-500">Navigation</h3>
            <ul className="mt-6 space-y-4 text-sm font-bold text-white/70">
              <li><a href="#home" className="hover:text-white">Home</a></li>
              <li><a href="#solusi" className="hover:text-white">Solusi</a></li>
              <li><a href="#industri" className="hover:text-white">Industri</a></li>
              <li><a href="#proses" className="hover:text-white">Proses</a></li>
              <li><a href="#portfolio" className="hover:text-white">Portfolio</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-orange-500">Contact</h3>
            <ul className="mt-6 space-y-4 text-sm font-bold text-white/70">
              <li>WhatsApp Omnia</li>
              <li>hello@omnia.co.id</li>
              <li>omnia.co.id</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-orange-500">Mulai dari demo portal</h3>
            <div className="mt-6 flex overflow-hidden rounded-[8px] bg-white">
              <input type="email" placeholder="Email bisnis" className="w-full bg-transparent px-4 text-sm font-bold text-black outline-none" />
              <button className="flex h-12 w-12 shrink-0 items-center justify-center bg-orange-500 text-white hover:bg-orange-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 h-px w-full bg-white/10" />

        <div className="mt-8 flex flex-col justify-between gap-4 pb-8 text-sm font-bold text-white/50 sm:flex-row">
          <p>Copyright © 2026 Omnia. All Rights Reserved.</p>
          <p>User Terms & Conditions | Privacy Policy</p>
        </div>

      </div>
    </footer>
  );
}
