"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioVisual } from "./Mockups";

export type PortfolioItemData = {
  title: string;
  description: string;
  type: string;
  index: number;
};

export function PortfolioDetailModal({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: PortfolioItemData | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Don't modify body overflow here if it's nested inside another modal that already does it,
    // but just to be safe:
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const modalDepth = Number(document.body.dataset.modalDepth ?? 0) + 1;
      document.body.dataset.modalDepth = String(modalDepth);
      document.body.dataset.modalOpen = "true";
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

  if (!mounted || !item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl lg:h-[640px] lg:flex-row"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/40 lg:right-6 lg:top-6 lg:bg-slate-100 lg:text-slate-500 lg:hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="relative h-64 w-full shrink-0 lg:h-full lg:w-[45%]">
              <PortfolioVisual index={item.index} />
            </div>
            
            <div className="flex flex-1 flex-col overflow-y-auto p-6 sm:p-8 lg:p-12">
              <div>
                <span className="mb-4 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-600">
                  {item.type}
                </span>
                <h3 className="text-3xl font-black text-[#263247] sm:text-4xl">{item.title}</h3>
                <p className="mt-4 text-base font-bold leading-relaxed text-slate-600 sm:mt-6">{item.description}</p>
              </div>
              
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-400">Key Highlights</h4>
                <div className="grid gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                      <p className="text-sm font-bold text-slate-700">Implementasi module {i} yang mempercepat operasional bisnis Anda secara optimal.</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <a href="#industri" onClick={onClose} className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-base font-black text-white transition hover:bg-orange-600">
                  Konsultasi Solusi Ini <ArrowUpRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
