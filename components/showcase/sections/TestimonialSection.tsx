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


export function TestimonialSection({ activeSection }: { activeSection: string }) {
  const testimonials = [
    { name: "Budi Santoso", role: "CEO, Retail XYZ", text: "Sistem Omnia sangat membantu operasional toko kami yang sebelumnya berantakan. Dashboard dan POS-nya luar biasa cepat dan mudah digunakan oleh kasir kami." },
    { name: "Rina Gunawan", role: "Owner, Klinik Medika", text: "Sejak beralih ke Omnia, antrean pasien jadi lebih rapi dan rekam medis terintegrasi dengan baik. Sangat merekomendasikan untuk industri kesehatan." },
    { name: "Ahmad Fadil", role: "Director, F&B Group", text: "Integrasi antara inventaris, resep, dan POS membuat cost tracking jadi lebih presisi. Kami bisa menekan HPP dan meningkatkan margin keuntungan." },
  ];

  return (
    <section id="testimonial" className="relative overflow-hidden bg-[#1e1e1e] py-20 text-white sm:py-28">
      {/* Background styling to match the dark sleek look */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none">
          <path d="M0,400 Q360,200 720,400 T1440,400 L1440,800 L0,800 Z" fill="#f97316" />
        </svg>
      </div>

      <div className="section-shell relative z-10">
        <div className="mx-auto max-w-4xl text-center relative">
          <div className="absolute -top-4 right-0 h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
            {activeSection === "testimonial" && (
              <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 right-0 w-[60px] sm:w-[100px] lg:w-[140px] z-20">
                <OmniaMascot compact />
              </motion.div>
            )}
          </div>
          <Reveal>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-6xl">
              Testimonials That <br className="hidden sm:block" />
              Speak to <span className="text-orange-500">My Results</span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-sm font-bold text-white/70 sm:text-base">
              Ratusan bisnis telah mempercayakan sistem operasional mereka kepada Omnia. Berikut adalah beberapa pengalaman terbaik dari mereka.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testi, idx) => (
            <Reveal key={idx} delay={idx * 0.1} className="h-full">
              <article className="relative h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#2a2a2a]/60 p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute -right-4 -top-4 text-9xl font-serif leading-none text-white/5">&quot;</div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-300">
                      <img src={`https://i.pravatar.cc/150?u=${idx+10}`} alt={testi.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black">{testi.name}</h4>
                      <p className="text-xs font-bold text-white/60">{testi.role}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="ml-2 text-sm font-black text-white">5.0</span>
                  </div>
                  <p className="mt-5 text-sm font-bold leading-relaxed text-white/70">
                    &quot;{testi.text}&quot;
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
