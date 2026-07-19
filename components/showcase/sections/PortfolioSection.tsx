import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { PricingPlanModal } from "@/components/PricingPlanModal";
import { ArrowBubble, FeaturePill, Reveal, SectionTitle } from "@/components/showcase/ShowcasePrimitives";
import { MiniChartPanel, OmniaMascot, OmniaProductIllustration, PortfolioVisual, ServiceMockup } from "@/components/showcase/Mockups";
import { PortfolioModal } from "@/components/showcase/PortfolioModal";
import { PortfolioDetailModal, type PortfolioItemData } from "@/components/showcase/PortfolioDetailModal";

import { buildPlans, getSegmentModules } from "@/components/showcase/pricing";
import { industryTone, navItems, processSteps, serviceCards, toneClasses } from "@/components/showcase/showcaseData";
import { faqs } from "@/data/faqs";
import { industries } from "@/data/industries";
import { packages } from "@/data/packages";
import { portfolio } from "@/data/portfolio";
import { products } from "@/data/products";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";


export function PortfolioSection({ activeSection }: { activeSection: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PortfolioItemData | null>(null);
  const portfolioItems = [
    ...portfolio.slice(0, 2).map((item) => ({ title: item.title, description: item.solution })),
    ...products.slice(0, 2).map((item) => ({ title: item.name, description: item.description }))
  ];

  return (
    <section id="portfolio" className="section-shell py-12 sm:py-24">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionTitle eyebrow="Portfolio" title="Produk & |Implementasi" align="left" />
        <div className="flex items-end gap-6">
          <div className="h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 shrink-0 relative">
            {activeSection === "portfolio" && (
              <motion.div layoutId="mascot" transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }} className="absolute bottom-0 right-0 w-[70px] sm:w-[120px] lg:w-[180px] z-20">
                <OmniaMascot compact />
              </motion.div>
            )}
          </div>
          <Reveal>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-600 focus-ring sm:px-10 sm:py-5 sm:text-lg">See All</button>
          </Reveal>
        </div>
      </div>
      <div className="mt-8 sm:mt-12 grid gap-6 lg:grid-cols-2">
        {portfolioItems.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06} className="h-full">
            <article onClick={() => setSelectedDetail({ ...item, type: index < 2 ? "Case Study" : "Product", index })} className="group cursor-pointer relative h-full min-h-[360px] overflow-hidden rounded-[24px] bg-slate-200 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:min-h-[420px] sm:rounded-[28px] sm:p-8">
              <div className="absolute inset-0 z-0 transition group-hover:scale-105 duration-500">
                <PortfolioVisual index={index} />
              </div>
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="relative z-10 flex min-h-[310px] flex-col justify-end text-white sm:min-h-[360px]">
                <h3 className="text-2xl font-black tracking-normal sm:text-3xl lg:text-5xl">{item.title}</h3>
                <p className="mt-4 max-w-xl text-base font-bold leading-7 text-white/82 sm:text-lg sm:leading-8">{item.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <PortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PortfolioDetailModal isOpen={!!selectedDetail} onClose={() => setSelectedDetail(null)} item={selectedDetail} />
    </section>
  );
}
