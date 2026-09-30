"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    setNavigating(true);
    setIsRevealing(true);
    const navTimer = setTimeout(() => {
      setNavigating(false);
    }, 600);
    const revealTimer = setTimeout(() => {
      setIsRevealing(false);
    }, 700);
    return () => {
      clearTimeout(navTimer);
      clearTimeout(revealTimer);
    };
  }, [pathname]);

  return (
    <>
      {/* Luminous Top Navigation Laser Sweep */}
      <div
        className={`fixed top-0 left-0 h-[2px] z-50 pointer-events-none transition-all duration-700 ease-out ${
          navigating
            ? "w-full opacity-100 bg-gradient-to-r from-transparent via-coreCyan to-yellow-400 shadow-[0_0_12px_#4df2ff]"
            : "w-0 opacity-0"
        }`}
      />

      <div
        key={pathname}
        className="w-full min-h-screen transition-opacity duration-500 ease-out"
        style={
          isRevealing
            ? {
                animation: "cinematicReveal 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                willChange: "transform, opacity, filter",
              }
            : undefined
        }
      >
        <style jsx global>{`
          @keyframes cinematicReveal {
            0% {
              opacity: 0;
              transform: translateY(16px) scale(0.992);
              filter: blur(6px);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0px);
            }
          }
        `}</style>
        {children}
      </div>
    </>
  );
};
