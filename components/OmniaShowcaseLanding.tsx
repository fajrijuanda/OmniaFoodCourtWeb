"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./showcase/sections/Header";
import { HeroSection } from "./showcase/sections/HeroSection";
import { ServicesSection } from "./showcase/sections/ServicesSection";
import { IndustryPlanSection } from "./showcase/sections/IndustryPlanSection";
import { ProcessSection } from "./showcase/sections/ProcessSection";
import { WhyOmniaSection } from "./showcase/sections/WhyOmniaSection";
import { PortfolioSection } from "./showcase/sections/PortfolioSection";
import { PackagesSection } from "./showcase/sections/PackagesSection";
import { FaqSection } from "./showcase/sections/FaqSection";
import { TestimonialSection } from "./showcase/sections/TestimonialSection";
import { ProjectCtaSection } from "./showcase/sections/ProjectCtaSection";
import { Footer } from "./showcase/sections/Footer";
import { FloatingMascotGuide } from "./showcase/FloatingMascotGuide";
import { PortalLoadingScreen } from "@/components/portal/ui";

export type MascotName = "omni" | "odi";
export type MascotStage = "idle" | "exiting" | "entering";

function getStoredMascot(): MascotName {
  if (typeof window === "undefined") return "omni";

  const savedMascot = window.localStorage.getItem("omnia-mascot");
  return savedMascot === "odi" ? "odi" : "omni";
}

export function OmniaShowcaseLanding() {
  const [activeSection, setActiveSection] = useState("home");
  const [mascot, setMascot] = useState<MascotName>(getStoredMascot);
  const [isLoading, setIsLoading] = useState(true);
  const [mascotStage, setMascotStage] = useState<MascotStage>("idle");
  const transitionTimers = useRef<number[]>([]);

  useEffect(() => {
    const storedMascot = getStoredMascot();
    setMascot(storedMascot);
    document.documentElement.dataset.mascot = storedMascot;
    document.body.dataset.mascot = storedMascot;

    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
      document.documentElement.classList.remove("omnia-booting");
    }, 720);

    return () => window.clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const targetId = visibleEntries[0].target.id;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setActiveSection(targetId);
          }, 200); // Debounce to prevent aggressive jumps
        }
      },
      { rootMargin: "-40% 0px -40% 0px" } // Use middle of screen to determine active section
    );

    document.querySelectorAll("section[id], footer[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mascot = mascot;
    document.body.dataset.mascot = mascot;
    window.localStorage.setItem("omnia-mascot", mascot);
    return () => {
      delete document.body.dataset.mascot;
    };
  }, [mascot]);

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const changeMascot = (nextMascot: MascotName) => {
    if (nextMascot === mascot || mascotStage !== "idle") return;

    transitionTimers.current.forEach((timer) => clearTimeout(timer));
    setMascotStage("exiting");
    transitionTimers.current = [
      window.setTimeout(() => {
        setMascot(nextMascot);
        setMascotStage("entering");
      }, 620),
      window.setTimeout(() => {
        setMascotStage("idle");
      }, 1380)
    ];
  };

  return (
    <div data-mascot={mascot} className="overflow-x-hidden bg-white text-[#171717] transition-colors duration-700">
      {isLoading ? (
        <PortalLoadingScreen label="Memuat Omnia" />
      ) : null}
      <Header activeSection={activeSection} />
      <FloatingMascotGuide activeSection={activeSection} mascot={mascot} stage={mascotStage} onMascotChange={changeMascot} />
      <main>
        <HeroSection activeSection={activeSection} mascot={mascot} mascotStage={mascotStage} onMascotChange={changeMascot} />
        <ServicesSection activeSection="mascot-global" />
        <IndustryPlanSection activeSection="mascot-global" />
        <ProcessSection activeSection={activeSection} />
        <WhyOmniaSection activeSection="mascot-global" />
        <PortfolioSection activeSection="mascot-global" />
        <PackagesSection activeSection="mascot-global" />
        <FaqSection activeSection="mascot-global" />
        <TestimonialSection activeSection="mascot-global" />
        <ProjectCtaSection activeSection="mascot-global" />
      </main>
      <Footer activeSection="mascot-global" />
    </div>
  );
}
