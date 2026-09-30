"use client";

import React, { useRef, useEffect } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number; // max tilt in degrees (default: 8)
  scale?: number; // scale factor on hover (default: 1.025)
  perspective?: number; // perspective distance (default: 1200)
  glare?: boolean; // enable specular glare layer (default: true)
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 8,
  scale = 1.025,
  perspective = 1200,
  glare = true,
  className = "",
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const glareGradientRef = useRef<HTMLDivElement>(null);

  // Physics animation values in refs (zero React re-renders, 120fps smooth)
  const animRef = useRef({
    currentRotateX: 0,
    currentRotateY: 0,
    currentScale: 1,
    targetRotateX: 0,
    targetRotateY: 0,
    targetScale: 1,
    currentGlareOpacity: 0,
    targetGlareOpacity: 0,
    glareX: 50,
    glareY: 50,
    targetGlareX: 50,
    targetGlareY: 50,
    rafId: 0,
    isHovered: false,
  });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const loop = () => {
      const state = animRef.current;
      
      // High-end exponential smoothing factor
      const spring = state.isHovered ? 0.12 : 0.07;

      state.currentRotateX += (state.targetRotateX - state.currentRotateX) * spring;
      state.currentRotateY += (state.targetRotateY - state.currentRotateY) * spring;
      state.currentScale += (state.targetScale - state.currentScale) * spring;
      state.currentGlareOpacity += (state.targetGlareOpacity - state.currentGlareOpacity) * spring;
      state.glareX += (state.targetGlareX - state.glareX) * spring;
      state.glareY += (state.targetGlareY - state.glareY) * spring;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${state.currentRotateX.toFixed(3)}deg) rotateY(${state.currentRotateY.toFixed(3)}deg) scale3d(${state.currentScale.toFixed(4)}, ${state.currentScale.toFixed(4)}, ${state.currentScale.toFixed(4)})`;
      }

      if (glareRef.current) {
        glareRef.current.style.opacity = state.currentGlareOpacity.toFixed(3);
      }

      if (glareGradientRef.current) {
        glareGradientRef.current.style.background = `radial-gradient(circle 380px at ${state.glareX.toFixed(1)}% ${state.glareY.toFixed(1)}%, rgba(255,255,255,0.24), rgba(77,242,255,0.08) 35%, transparent 70%)`;
      }

      state.rafId = requestAnimationFrame(loop);
    };

    animRef.current.rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current.rafId);
    };
  }, [perspective]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const xPercent = (clientX / rect.width) * 2 - 1;
    const yPercent = (clientY / rect.height) * 2 - 1;

    animRef.current.targetRotateX = -yPercent * maxTilt;
    animRef.current.targetRotateY = xPercent * maxTilt;
    animRef.current.targetScale = scale;
    animRef.current.targetGlareOpacity = 0.28;
    animRef.current.targetGlareX = (clientX / rect.width) * 100;
    animRef.current.targetGlareY = (clientY / rect.height) * 100;
  };

  const handleMouseEnter = () => {
    animRef.current.isHovered = true;
    animRef.current.targetScale = scale;
    animRef.current.targetGlareOpacity = 0.28;
  };

  const handleMouseLeave = () => {
    animRef.current.isHovered = false;
    animRef.current.targetRotateX = 0;
    animRef.current.targetRotateY = 0;
    animRef.current.targetScale = 1;
    animRef.current.targetGlareOpacity = 0;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Specular Glare Layer */}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-20"
          style={{ opacity: 0 }}
        >
          <div
            ref={glareGradientRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}
    </div>
  );
};
