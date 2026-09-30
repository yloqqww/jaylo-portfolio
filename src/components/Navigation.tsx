"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SoundToggle, useSound } from "./SoundController";
import { HireModal } from "./HireModal";

export const Navigation: React.FC<{ isLoaded?: boolean }> = ({ isLoaded = true }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { playHoverSound, playSelectSound } = useSound();
  
  const [mounted, setMounted] = useState(false);
  const [isHireOpen, setIsHireOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll position to enhance navbar readability across both native and Lenis scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    let lenisUnsubscribe: (() => void) | null = null;
    const lenisInstance = typeof window !== "undefined" ? (window as any).lenis : null;
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
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock window scroll (both documentElement and body) & disable Lenis when hire or mobile menu is open
  useEffect(() => {
    const isAnyModalOpen = isHireOpen || isMobileMenuOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
        (window as any).lenis.resize();
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
        (window as any).lenis.resize();
      }
    };
  }, [isHireOpen, isMobileMenuOpen]);

  // Menu items: WORK, CREATIVES, HIRE, INFO
  const navItems = [
    { label: "WORK", href: "/work" },
    { label: "CREATIVES", href: "/creatives" },
    { label: "HIRE", isModal: "HIRE" },
    { label: "INFO", href: "/info" },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    playSelectSound();
    if (item.isModal === "HIRE") {
      setIsHireOpen(true);
      return;
    }
    if (item.href) {
      router.push(item.href);
    }
  };

  const handleCategoryNavigate = (cat: "PERSONAL" | "INDUSTRY") => {
    playSelectSound();
    setIsMobileMenuOpen(false);
    if (pathname === "/work") {
      window.history.pushState(null, "", `/work?category=${cat}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      router.push(`/work?category=${cat}`);
    }
  };

  return (
    <>
      {/* ========================================================
          TOP BAR (Always visible on all pages)
          ======================================================== */}
      <header
        className={`fixed top-0 left-0 w-full z-40 px-4 sm:px-10 md:px-12 transition-all duration-300 flex items-center justify-between pointer-events-auto ${
          hasScrolled
            ? "py-3 sm:py-4 bg-black/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "py-4 sm:py-8 bg-transparent border-b border-transparent shadow-none"
        }`}
      >
        {/* Top-Left: JL. Logo */}
        <Link
          href="/"
          onClick={() => {
            playSelectSound();
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="font-grotesk font-light text-lg sm:text-xl tracking-[0.25em] text-white/90 group-hover:text-white transition-colors flex items-center">
            <span>JL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coreCyan ml-1 shadow-[0_0_8px_#4DF2FF]"></span>
          </div>
        </Link>

        {/* Top-Right: Desktop Menu + Controls */}
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
          {/* Subpage Desktop Navigation Links */}
          {!isHome && (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-[11px] lg:text-xs tracking-[0.28em] text-white/60 uppercase">
              <Link
                href="/"
                onClick={() => playSelectSound()}
                onMouseEnter={() => playHoverSound()}
                className="hover:text-white transition-colors"
              >
                HOME
              </Link>
              <span className="text-white/20 select-none">|</span>

              {navItems.map((item, idx) => {
                const isActive = item.href && pathname?.startsWith(item.href);
                return (
                  <React.Fragment key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => playHoverSound()}
                      className={`uppercase transition-colors tracking-[0.28em] cursor-pointer ${
                        isActive
                          ? "text-coreCyan font-medium drop-shadow-[0_0_8px_rgba(77,242,255,0.6)]"
                          : "hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                    {idx < navItems.length - 1 && (
                      <span className="text-white/20 select-none">|</span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Right Controls: Equalizer Sound Bars + Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Audio Equalizer Bars */}
            <SoundToggle />

            {/* Mobile Hamburger Menu Toggle (Visible on < md screens) */}
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-lg bg-black/50 border border-white/15 text-white/80 hover:text-white hover:border-coreCyan/60 transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-coreCyan" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER OVERLAY (Rendered in Portal)
          ======================================================== */}
      {mounted && isMobileMenuOpen && createPortal(
        <div
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          className="fixed inset-0 z-[99999] bg-[#040406]/98 backdrop-blur-3xl md:hidden flex flex-col justify-between px-6 py-8 sm:py-10 overflow-y-auto"
        >
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-grotesk font-light text-xl tracking-[0.25em] text-white">
                JL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-coreCyan"></span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-muted ml-2 uppercase">
                // SYSTEM DIRECTORY
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setIsMobileMenuOpen(false);
              }}
              className="p-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-coreCyan transition-all cursor-pointer"
              aria-label="Close Mobile Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex flex-col space-y-4 sm:space-y-5 py-6 my-auto">
            {/* HOME */}
            <Link
              href="/"
              onClick={() => {
                playSelectSound();
                setIsMobileMenuOpen(false);
              }}
              className={`font-grotesk text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all flex items-center justify-between py-1 ${
                isHome ? "text-coreCyan font-medium pl-2 border-l-2 border-coreCyan" : "text-white/85 hover:text-white"
              }`}
            >
              <span>HOME</span>
              <span className="font-mono text-[10px] text-muted tracking-widest">00</span>
            </Link>

            {/* WORK with Direct Quick-Access to Personal Projects & Industry */}
            <div className="flex flex-col space-y-2 py-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    router.push("/work");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-grotesk text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all flex items-center gap-3 cursor-pointer ${
                    pathname === "/work"
                      ? "text-coreCyan font-medium pl-2 border-l-2 border-coreCyan"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  <span>WORK</span>
                </button>
                <span className="font-mono text-[10px] text-muted tracking-widest">01</span>
              </div>

              {/* Sub-navigation pills directly inside drawer */}
              <div className="pl-3 sm:pl-4 flex flex-col space-y-2 border-l border-white/10 ml-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleCategoryNavigate("PERSONAL")}
                  className="text-left font-mono text-xs sm:text-sm tracking-[0.15em] text-white/80 hover:text-yellow-400 transition-colors py-1 flex items-center gap-2.5 cursor-pointer uppercase group"
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.5)] group-hover:scale-125 transition-transform" />
                  <span>Personal Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryNavigate("INDUSTRY")}
                  className="text-left font-mono text-xs sm:text-sm tracking-[0.15em] text-white/80 hover:text-sky-400 transition-colors py-1 flex items-center gap-2.5 cursor-pointer uppercase group"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.5)] group-hover:scale-125 transition-transform" />
                  <span>Industry Experience</span>
                </button>
              </div>
            </div>

            {/* CREATIVES */}
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                router.push("/creatives");
                setIsMobileMenuOpen(false);
              }}
              className={`text-left font-grotesk text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all flex items-center justify-between py-1 cursor-pointer ${
                pathname?.startsWith("/creatives")
                  ? "text-coreCyan font-medium pl-2 border-l-2 border-coreCyan"
                  : "text-white/85 hover:text-white"
              }`}
            >
              <span>CREATIVES</span>
              <span className="font-mono text-[10px] text-muted tracking-widest">02</span>
            </button>

            {/* HIRE */}
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setIsMobileMenuOpen(false);
                setIsHireOpen(true);
              }}
              className="text-left font-grotesk text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all flex items-center justify-between py-1 cursor-pointer text-white/85 hover:text-white"
            >
              <span>HIRE</span>
              <span className="font-mono text-[10px] text-muted tracking-widest">03</span>
            </button>

            {/* INFO */}
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                router.push("/info");
                setIsMobileMenuOpen(false);
              }}
              className={`text-left font-grotesk text-2xl sm:text-3xl tracking-[0.2em] uppercase transition-all flex items-center justify-between py-1 cursor-pointer ${
                pathname?.startsWith("/info")
                  ? "text-coreCyan font-medium pl-2 border-l-2 border-coreCyan"
                  : "text-white/85 hover:text-white"
              }`}
            >
              <span>INFO</span>
              <span className="font-mono text-[10px] text-muted tracking-widest">04</span>
            </button>
          </nav>

          {/* Drawer Footer Controls */}
          <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted shrink-0">
            <span className="text-[10px] tracking-widest uppercase text-white/50">SYSTEM AUDIO</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase text-white/60">SFX:</span>
              <SoundToggle />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================
          BOTTOM DOCK (Only visible on Homepage)
          ======================================================== */}
      {isHome && (
        <footer className="fixed bottom-5 sm:bottom-8 md:bottom-10 left-0 w-full z-40 px-3 sm:px-8 flex justify-center items-center pointer-events-auto select-none">
          <nav className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-14 flex-wrap max-w-5xl">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => playHoverSound()}
                className="group relative py-1.5 sm:py-2 px-1 sm:px-2 font-mono text-[13px] sm:text-sm md:text-[15px] tracking-[0.2em] sm:tracking-[0.38em] text-white/85 hover:text-white uppercase transition-all duration-300 cursor-pointer font-medium"
              >
                <span className="relative z-10">{item.label}</span>

                {/* Subtle Underline Glow on Hover */}
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-coreCyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#4DF2FF]" />
              </button>
            ))}
          </nav>
        </footer>
      )}

      {/* Modal for HIRE */}

      <HireModal
        isOpen={isHireOpen}
        onClose={() => setIsHireOpen(false)}
      />
    </>
  );
};
