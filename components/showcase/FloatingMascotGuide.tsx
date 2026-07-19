"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { OmniaMascot } from "@/components/showcase/Mockups";
import type { MascotName, MascotStage } from "@/components/OmniaShowcaseLanding";

const sectionMessages: Record<string, string> = {
  home: "Hello!",
  solusi: "Di sini kamu bisa lihat core service Omnia: HRIS, F&B POS, F&B Operations, dan ERP.",
  industri: "Pilih industri, lalu buka View Plan untuk melihat fitur dan harga yang sesuai kebutuhan sub-industrinya.",
  proses: "Bagian ini menjelaskan alur kerja Omnia dari mapping kebutuhan sampai launch dan growth.",
  why: "Omnia dibuat modular, jadi sistem bisa mulai kecil lalu berkembang mengikuti operasional bisnis.",
  portfolio: "Di sini ada contoh produk dan implementasi yang bisa jadi gambaran bentuk sistemnya.",
  packages: "Paket ini membantu memilih scope awal sebelum masuk ke detail sub-industri.",
  faq: "Bagian FAQ menjawab pertanyaan umum sebelum mulai konsultasi.",
  testimonial: "Di sini kamu bisa melihat ringkasan kepercayaan dan sinyal kualitas implementasi.",
  cta: "Kalau sudah punya kebutuhan, bagian ini adalah jalur cepat untuk mulai konsultasi.",
  footer: "Ini area navigasi akhir untuk kembali ke section penting atau menghubungi Omnia."
};

const mascotPositions: Record<string, { left: string; top: string; scale: number; rotate: number }> = {
  home: { left: "50vw", top: "84vh", scale: 2.02, rotate: 0 },
  solusi: { left: "78vw", top: "28vh", scale: 0.64, rotate: 6 },
  industri: { left: "78vw", top: "42vh", scale: 0.62, rotate: 6 },
  proses: { left: "78vw", top: "54vh", scale: 0.66, rotate: 5 },
  why: { left: "22vw", top: "58vh", scale: 0.64, rotate: -4 },
  portfolio: { left: "78vw", top: "44vh", scale: 0.68, rotate: 4 },
  packages: { left: "78vw", top: "46vh", scale: 0.62, rotate: 5 },
  faq: { left: "78vw", top: "52vh", scale: 0.62, rotate: 5 },
  testimonial: { left: "78vw", top: "48vh", scale: 0.64, rotate: 4 },
  cta: { left: "78vw", top: "46vh", scale: 0.68, rotate: 3 },
  footer: { left: "78vw", top: "66vh", scale: 0.62, rotate: -5 }
};

const mobileMascotPositions: Record<string, { left: string; top: string; scale: number; rotate: number }> = {
  home: { left: "50vw", top: "64vh", scale: 1.22, rotate: 0 },
  solusi: { left: "78vw", top: "78vh", scale: 0.46, rotate: 6 },
  industri: { left: "78vw", top: "76vh", scale: 0.46, rotate: 6 },
  proses: { left: "22vw", top: "76vh", scale: 0.46, rotate: -5 },
  why: { left: "78vw", top: "76vh", scale: 0.46, rotate: 4 },
  portfolio: { left: "22vw", top: "76vh", scale: 0.46, rotate: -4 },
  packages: { left: "78vw", top: "76vh", scale: 0.46, rotate: 5 },
  faq: { left: "22vw", top: "74vh", scale: 0.44, rotate: -5 },
  testimonial: { left: "78vw", top: "76vh", scale: 0.46, rotate: 4 },
  cta: { left: "22vw", top: "76vh", scale: 0.46, rotate: -4 },
  footer: { left: "78vw", top: "78vh", scale: 0.44, rotate: 5 }
};

export function FloatingMascotGuide({
  activeSection,
  mascot,
  stage,
  onMascotChange
}: {
  activeSection: string;
  mascot: MascotName;
  stage: MascotStage;
  onMascotChange: (mascot: MascotName) => void;
}) {
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const message = sectionMessages[activeSection] ?? sectionMessages.home;
  const positionSet = isCompactViewport ? mobileMascotPositions : mascotPositions;
  const position = positionSet[activeSection] ?? positionSet.home;
  const isHero = activeSection === "home";
  const dramaticExit = stage === "exiting";
  const carouselDirection = mascot === "odi" ? 1 : -1;
  const visibleScale = isModalOpen && !isHero ? position.scale * 1.16 : position.scale;

  const bubbleSide = useMemo(() => {
    const leftValue = Number.parseInt(position.left, 10);
    return leftValue > 50 ? "left" : "right";
  }, [position.left]);

  const bubblePosition = useMemo(() => {
    if (isHero) {
      return isCompactViewport
        ? { left: `calc(${position.left} + 36px)`, top: `calc(${position.top} - 150px)` }
        : { left: `calc(${position.left} + 90px)`, top: `calc(${position.top} - 292px)` };
    }

    if (isCompactViewport) {
      return bubbleSide === "left"
        ? { left: "calc(100vw - 224px)", top: `calc(${position.top} - 104px)` }
        : { left: "12px", top: `calc(${position.top} - 104px)` };
    }

    return bubbleSide === "left"
      ? { left: "calc(100vw - 324px)", top: `calc(${position.top} - 120px)` }
      : { left: "24px", top: `calc(${position.top} - 120px)` };
  }, [bubbleSide, isCompactViewport, isHero, position.left, position.top]);

  useEffect(() => {
    setTypedText("");
    setIsBubbleOpen(true);

    let timer: number;
    const startTyping = window.setTimeout(() => {
      let index = 0;
      timer = window.setInterval(() => {
        index += 1;
        setTypedText(message.slice(0, index));
        if (index >= message.length) window.clearInterval(timer);
      }, activeSection === "home" ? 70 : 24);
    }, activeSection === "home" ? 60 : 560);

    return () => {
      window.clearTimeout(startTyping);
      window.clearInterval(timer);
    };
  }, [activeSection, message]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)");
    const syncViewport = () => setIsCompactViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    const syncModalState = () => {
      setIsModalOpen(document.body.dataset.modalOpen === "true");
    };

    syncModalState();
    const observer = new MutationObserver(syncModalState);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-modal-open"] });
    return () => observer.disconnect();
  }, []);

  const replayTyping = () => {
    if (!isBubbleOpen) {
      setTypedText("");
      setIsBubbleOpen(true);
      let index = 0;
      const timer = window.setInterval(() => {
        index += 1;
        setTypedText(message.slice(0, index));
        if (index >= message.length) window.clearInterval(timer);
      }, activeSection === "home" ? 70 : 24);
      return;
    }

    setIsBubbleOpen(false);
  };

  return (
    <>
      {isBubbleOpen ? (
        <motion.div
          key={`${activeSection}-bubble`}
          className={`pointer-events-auto fixed rounded-[20px] border border-slate-200 bg-white text-left text-xs font-bold leading-5 text-[#263247] shadow-2xl sm:text-sm sm:leading-6 ${
            isHero ? "w-24 px-3 py-2.5 sm:w-28 sm:px-4 sm:py-3" : "w-52 p-3 sm:w-72 sm:p-4"
          }`}
          initial={isHero ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.94 }}
          animate={{ left: bubblePosition.left, top: bubblePosition.top, opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 42, damping: 18, mass: 1 }}
          style={{ left: bubblePosition.left, top: bubblePosition.top, zIndex: isModalOpen ? 125 : 70 }}
        >
          <span>{typedText}</span>
          <span className="ml-1 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-orange-500" />
        </motion.div>
      ) : null}

      <motion.div
        className="pointer-events-none fixed block"
        initial={false}
        animate={{ left: position.left, top: position.top }}
        transition={{ type: "spring", stiffness: 38, damping: 18, mass: 1 }}
        style={{ left: position.left, top: position.top, transform: "translate(-50%, -50%)", transformOrigin: "center", perspective: 1200, zIndex: isModalOpen ? 120 : 40 }}
      >
        <div className="relative">
          <motion.button
            key={mascot}
            type="button"
            onClick={replayTyping}
            initial={stage === "entering" ? {
              rotateY: -110 * carouselDirection,
              rotateZ: -8 * carouselDirection,
              scale: visibleScale * 0.82,
              opacity: 0
            } : false}
            animate={dramaticExit
              ? {
                rotateY: 110 * carouselDirection,
                rotateZ: 8 * carouselDirection,
                scale: visibleScale * 0.82,
                opacity: 0
              }
              : {
                rotateY: 0,
                rotateZ: position.rotate,
                scale: visibleScale,
                opacity: 1
              }
            }
            transition={{
              type: dramaticExit ? "tween" : "spring",
              duration: dramaticExit ? 0.62 : undefined,
              ease: dramaticExit ? [0.45, 0, 0.55, 1] : undefined,
              stiffness: 56,
              damping: 18,
              mass: 1
            }}
            className="pointer-events-auto block w-[220px] cursor-pointer rounded-full transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 58%" }}
            aria-label="Tampilkan penjelasan maskot"
          >
            <OmniaMascot compact variant={mascot} className="w-full" />
          </motion.button>
        </div>
      </motion.div>

    </>
  );
}
