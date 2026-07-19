"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { products } from "@/data/products";
import { PortfolioVisual } from "./Mockups";
import { Reveal } from "./ShowcasePrimitives";
import { PortfolioDetailModal, type PortfolioItemData } from "./PortfolioDetailModal";


export function PortfolioModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItemData | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const modalDepth = Number(document.body.dataset.modalDepth ?? 0) + 1;
      document.body.dataset.modalDepth = String(modalDepth);
      document.body.dataset.modalOpen = "true";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      if (!isOpen) return;
      const nextDepth = Math.max(0, Number(document.body.dataset.modalDepth ?? 1) - 1);
      if (nextDepth === 0) {
        delete document.body.dataset.modalDepth;
        delete document.body.dataset.modalOpen;
      } else {
        document.body.dataset.modalDepth = String(nextDepth);
      }
    };
  }, [isOpen]);

  if (!mounted) return null;

  const allItems = [
    ...portfolio.map((item) => ({ title: item.title, description: item.solution, type: "Case Study" })),
    ...products.map((item) => ({ title: item.name, description: item.description, type: "Product" }))
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-6 sm:p-8">
              <div>
                <h3 className="text-2xl font-black text-[#263247] sm:text-3xl">Semua Portfolio & Produk</h3>
                <p className="mt-2 text-sm font-bold text-slate-500">Jelajahi berbagai implementasi dan produk dari Omnia</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allItems.map((item, index) => (
                  <Reveal key={index} delay={0.05 * Math.min(index, 10)} className="h-full">
                    <article onClick={() => setSelectedItem({ ...item, index })} className="group cursor-pointer text-left relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[24px] bg-slate-200 p-6 shadow-sm transition hover:shadow-xl sm:min-h-[380px]">
                      <div className="absolute inset-0 z-0 opacity-80 transition group-hover:opacity-100 group-hover:scale-105 duration-500">
                        {/* We reuse PortfolioVisual but we need varied indexes to make them look distinct */}
                        <PortfolioVisual index={index} />
                      </div>
                      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                      <div className="relative z-10 flex flex-1 flex-col justify-end text-white">
                        <span className="mb-3 inline-flex w-fit rounded-full bg-orange-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-400 backdrop-blur-md">
                          {item.type}
                        </span>
                        <h4 className="text-2xl font-black leading-tight sm:text-3xl">{item.title}</h4>
                        <p className="mt-3 text-sm font-bold leading-relaxed text-white/80 line-clamp-3">{item.description}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <PortfolioDetailModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem} />
    </AnimatePresence>
  );
}
