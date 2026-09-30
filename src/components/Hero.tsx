"use client";

import React from "react";
 
interface HeroProps {
  isLoaded: boolean;
  isTransitioningToWork?: boolean;
  formationProgress?: number;
  activeMode?: string;
  onWorkClick?: () => void;
  isChargingIntro?: boolean;
  holdProgress?: number;
  isBurstingIntro?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  isLoaded,
  isTransitioningToWork,
}) => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-transparent pointer-events-none">

      {/* Center Cinematic Typography */}
      <div
        className={`relative z-10 text-center flex flex-col items-center select-none pointer-events-none transition-all duration-1000 ease-out px-2 sm:px-6 w-full max-w-7xl mx-auto ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } ${isTransitioningToWork ? "scale-90 opacity-0 transition-all duration-700" : ""}`}
      >
        {/* Hero Title: JAYLO LUDOVICE - Bold & punchy on mobile, untouched on desktop */}
        <h1 className="font-grotesk font-light text-[8.5vw] xs:text-5xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.16em] sm:tracking-[0.35em] text-typography uppercase leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] whitespace-nowrap">
          JAYLO LUDOVICE
        </h1>

        {/* Roles & Disciplines - Mobile: 2 readable lines, Desktop: 100% identical single line */}
        <div className="mt-4 sm:mt-8 md:mt-10 flex items-center justify-center w-full px-2">
          {/* Mobile (< sm): Larger, well-proportioned two-line layout */}
          <div className="flex sm:hidden flex-col items-center justify-center gap-1.5 font-mono text-[11px] xs:text-xs tracking-[0.12em] text-white/95 font-medium uppercase text-center drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-center gap-2">
              <span className="hover:text-coreCyan transition-colors">FULL STACK DEVELOPMENT</span>
              <span className="text-coreCyan/70 font-light select-none">•</span>
              <span className="hover:text-coreCyan transition-colors">UI/UX DESIGN</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="hover:text-coreCyan transition-colors">SOCIAL MEDIA MANAGEMENT</span>
              <span className="text-coreCyan/70 font-light select-none">•</span>
              <span className="hover:text-coreCyan transition-colors">VIDEO EDITING</span>
            </div>
          </div>

          {/* Desktop (sm and up): Exactly identical original single-line layout */}
          <div className="hidden sm:flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-7 font-mono text-[clamp(9.5px,1.45vw,18px)] tracking-[clamp(0.05em,0.2vw,0.22em)] text-white/95 font-medium uppercase text-center drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)] whitespace-nowrap">
            <span className="hover:text-coreCyan transition-colors">FULL STACK DEVELOPMENT</span>
            <span className="text-coreCyan/70 font-light select-none">|</span>
            <span className="hover:text-coreCyan transition-colors">UI/UX & GRAPHIC DESIGN</span>
            <span className="text-coreCyan/70 font-light select-none">|</span>
            <span className="hover:text-coreCyan transition-colors">SOCIAL MEDIA MANAGEMENT</span>
            <span className="text-coreCyan/70 font-light select-none">|</span>
            <span className="hover:text-coreCyan transition-colors">VIDEO EDITING</span>
          </div>
        </div>
      </div>

    </section>
  );
};
