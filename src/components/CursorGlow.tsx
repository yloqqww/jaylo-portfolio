"use client";

import React, { useEffect, useRef, useState } from "react";

export const CursorGlow: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only run on client and devices with fine pointers (mouse)
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("button") ||
          target.closest("a") ||
          target.closest("[role='button']") ||
          target.closest(".cursor-pointer") ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA"
        );
        setIsHovered(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Physics Lerp Loop for organic weighted fluid drift
    const render = () => {
      // Glow trails slightly behind for luxury cinematic feel (lerp factor 0.12)
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * 0.12;

      // Inner dot follows swiftly (lerp factor 0.4)
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.4;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.4;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Ambient Large Cyan Halo Glow (illuminate dark background & objects) */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full mix-blend-screen pointer-events-none transition-transform duration-75 will-change-transform"
        style={{
          background: isHovered
            ? "radial-gradient(circle, rgba(77,242,255,0.18) 0%, rgba(77,242,255,0.06) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(77,242,255,0.11) 0%, rgba(77,242,255,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Sleek Inner Cyan Beacon / Follower Ring */}
      <div
        ref={cursorRef}
        className={`absolute top-0 left-0 rounded-full pointer-events-none transition-all duration-300 ease-out will-change-transform flex items-center justify-center ${
          isHovered
            ? "w-10 h-10 border border-coreCyan/80 bg-coreCyan/15 shadow-[0_0_20px_rgba(77,242,255,0.5)] scale-110"
            : "w-3 h-3 bg-coreCyan/80 shadow-[0_0_10px_#4DF2FF] scale-100"
        }`}
      >
        {isHovered && (
          <span className="w-1.5 h-1.5 rounded-full bg-coreCyan shadow-[0_0_6px_#4DF2FF] animate-pulse"></span>
        )}
      </div>
    </div>
  );
};
