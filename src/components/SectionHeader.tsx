"use client";

import React from "react";

interface SectionHeaderProps {
  watermark: string;
  subtitle?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  watermark,
  subtitle,
  description,
  className = "",
  compact = false,
}) => {
  return (
    <div
      className={`relative w-full max-w-[100vw] ${
        className
          ? className
          : compact
          ? "pt-6 sm:pt-8 md:pt-10 pb-3 sm:pb-4"
          : "pt-12 sm:pt-16 md:pt-20 pb-4 sm:pb-6"
      } flex flex-col items-center justify-center select-none overflow-visible`}
    >
      {/* Giant Outline Watermark Typography behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap z-0 select-none overflow-visible">
        <h1
          className="text-5xl xs:text-6xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-grotesk font-extralight tracking-[0.1em] sm:tracking-[0.2em] pl-[0.1em] sm:pl-[0.2em] uppercase select-none opacity-20 sm:opacity-25 text-transparent leading-none text-center"
          style={{
            WebkitTextStroke: "1.2px rgba(255, 255, 255, 0.4)",
          }}
        >
          {watermark}
        </h1>
      </div>

      {/* Foreground Subtitle & Categories (only if subtitle provided) */}
      {subtitle && (
        <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-4xl mx-auto">
          <h2
            className={`font-mono ${
              compact
                ? "text-xs sm:text-sm md:text-base tracking-[0.22em] sm:tracking-[0.3em]"
                : "text-sm sm:text-base md:text-xl lg:text-2xl tracking-[0.22em] sm:tracking-[0.34em]"
            } text-white font-bold drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]`}
          >
            {subtitle}
          </h2>

          {description && (
            <p
              className={`mt-2 font-mono ${
                compact
                  ? "text-[11px] sm:text-xs md:text-sm text-white/80 max-w-xl"
                  : "text-xs sm:text-sm md:text-base text-white/90 max-w-3xl"
              } tracking-wide text-center leading-relaxed px-3 drop-shadow-md`}
            >
              {description}
            </p>
          )}

          {/* Minimal Accent Center Line */}
          <div className="mt-2.5 sm:mt-3 w-12 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-coreCyan/60 to-transparent"></div>
        </div>
      )}
    </div>
  );
};
