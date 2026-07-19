"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/components/showcase/showcaseData";
import { BrandLogo } from "@/components/BrandLogo";
import { buildWhatsAppUrl, defaultWhatsAppMessage } from "@/lib/whatsapp";
import { AnimatePresence, motion } from "framer-motion";

export function Header({ activeSection }: { activeSection?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // Balanced navigation items
  const leftNav = [["Home", "#home"], ...navItems.slice(0, 2)]; // Home, Solusi, Industri
  const rightNav = navItems.slice(2); // Proses, Portfolio, FAQ
  const mobileNav = [...leftNav, ...rightNav];

  const renderNav = (items: string[][]) => (
    <div className="hidden lg:flex items-center gap-1">
      {items.map(([label, href]) => {
        const id = href.replace("#", "");
        const isActive = activeSection === id;
        return (
          <a
            key={label}
            href={href}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
              isActive
                ? "bg-orange-500 text-white shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            {label}
          </a>
        );
      })}
    </div>
  );

  return (
    <header className="fixed left-3 right-3 top-3 z-[100] sm:left-4 sm:right-4 sm:top-4">
      <nav className="mx-auto flex w-full max-w-[1298px] items-center justify-between rounded-full border border-white/10 bg-[#171717]/95 p-2 text-white shadow-2xl shadow-black/40 backdrop-blur-md">
        
        <div className="flex w-full items-center justify-between lg:hidden">
          <a href="#home" className="flex items-center gap-2 rounded-full px-4 py-2">
            <BrandLogo className="h-8 w-8" />
            <span className="font-black tracking-widest text-lg">OMNIA</span>
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white hover:text-[#171717]"
            aria-expanded={isOpen}
            aria-label="Buka menu navigasi"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden w-full items-center justify-between lg:flex">
          {/* Left Navigation */}
          <div className="flex flex-1 justify-start px-2">
            {renderNav(leftNav)}
          </div>
          
          {/* Center Logo */}
          <a href="#home" className="flex shrink-0 items-center gap-3 px-6 transition hover:scale-105">
            <BrandLogo className="h-10 w-10 shadow-lg shadow-orange-500/20" />
            <span className="text-xl font-black tracking-[0.15em]">OMNIA</span>
          </a>

          {/* Right Navigation & Contact */}
          <div className="flex flex-1 items-center justify-end gap-1 px-2">
            {renderNav(rightNav)}
            <div className="ml-2 h-6 w-px bg-white/10"></div>
            <a href={buildWhatsAppUrl(defaultWhatsAppMessage)} className="ml-2 shrink-0 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-bold transition-all hover:bg-white hover:text-[#171717]">
              Contact
            </a>
          </div>
        </div>

      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto mt-2 grid w-full max-w-[1298px] gap-2 rounded-[24px] border border-white/10 bg-[#171717]/95 p-3 text-white shadow-2xl shadow-black/30 backdrop-blur-md lg:hidden"
          >
            {mobileNav.map(([label, href]) => {
              const id = href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    isActive ? "bg-orange-500 text-white" : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {label}
                </a>
              );
            })}
            <a
              href={buildWhatsAppUrl(defaultWhatsAppMessage)}
              onClick={() => setIsOpen(false)}
              className="rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-black transition hover:bg-white hover:text-[#171717]"
            >
              Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
