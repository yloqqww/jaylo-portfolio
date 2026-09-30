"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSound } from "./SoundController";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { playHoverSound, playSelectSound } = useSound();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      // Show button after scrolling down 250px
      if (currentScroll > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate percentage for progress ring
      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also attach to Lenis scroll if available
    let lenisUnsubscribe: (() => void) | null = null;
    const lenisInstance = (window as any).lenis;
    if (lenisInstance && typeof lenisInstance.on === "function") {
      lenisUnsubscribe = () => {
        lenisInstance.off("scroll", handleScroll);
      };
      lenisInstance.on("scroll", handleScroll);
    }

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenisUnsubscribe) lenisUnsubscribe();
    };
  }, []);

  const scrollToTop = () => {
    playSelectSound();
    if (typeof window !== "undefined") {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };

  // SVG ring parameters (size: 46px on mobile, 48px on desktop)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed right-4 sm:right-7 bottom-5 sm:bottom-8 z-40 transition-all duration-300 pointer-events-none ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-90"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        onMouseEnter={() => playHoverSound()}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 sm:bg-black/50 backdrop-blur-md border border-white/20 hover:border-coreCyan/80 text-white/80 hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(77,242,255,0.4)] active:scale-90 cursor-pointer"
        aria-label="Back to top"
        title="Back to top"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 48 48"
        >
          {/* Subtle track background */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-white/10 fill-none"
            strokeWidth="2.5"
          />
          {/* Active progress indicator with glowing neon cyan */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-coreCyan fill-none transition-[stroke-dashoffset] duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Up Arrow Icon with hover animation */}
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-coreCyan group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform duration-200 z-10 drop-shadow-[0_0_6px_rgba(77,242,255,0.7)]" />

        {/* Tooltip on desktop hover */}
        <span className="hidden sm:block absolute -top-8 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono tracking-widest text-white/70 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
          TOP
        </span>
      </button>
    </div>
  );
};
