import React from "react";
import { X, Lock, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: string;
  moduleName: string;
  industry: string;
}

export function UpgradeModal({ isOpen, onClose, requiredTier, moduleName, industry }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl relative"
        >
          {/* Header Graphic */}
          <div className="relative h-32 w-full bg-gradient-to-r from-orange-400 to-rose-500 overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:16px_16px]"></div>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-16 w-16 place-items-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30">
               <Lock className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="p-8 text-center">
            <h2 className="text-2xl font-black text-[#172033] mb-2">
              Modul Terkunci
            </h2>
            <p className="text-sm font-bold text-slate-500 mb-6">
              Fitur <span className="text-slate-800 font-black">{moduleName}</span> membutuhkan paket langganan minimum <span className="text-orange-600 font-black px-2 py-0.5 bg-orange-50 rounded-full border border-orange-200">{requiredTier}</span>.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
              <div className="flex items-center gap-2 mb-3 text-[var(--portal-primary)] font-black text-sm">
                <Sparkles className="h-4 w-4" />
                Manfaat Upgrade
              </div>
              <ul className="space-y-2 text-sm font-bold text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--portal-primary)] mt-1.5 shrink-0" />
                  Akses penuh ke semua fitur {requiredTier} untuk {industry}
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--portal-primary)] mt-1.5 shrink-0" />
                  Peningkatan limit user dan kapasitas operasional
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--portal-primary)] mt-1.5 shrink-0" />
                  Prioritas dukungan pelanggan (SLA Support)
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[var(--portal-primary)] text-white font-black hover:opacity-90 transition shadow-lg shadow-[var(--portal-primary-soft)]"
              >
                Lihat Opsi Upgrade
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-full text-slate-500 font-bold hover:bg-slate-50 transition"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
