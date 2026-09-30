"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSound } from "./SoundController";

interface LoadingScreenProps {
  onComplete: () => void;
  onFormationProgress: (progress: number) => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  onFormationProgress,
}) => {
  const [phaseText, setPhaseText] = useState("INITIALIZING DIGITAL SYSTEM...");
  const [percent, setPercent] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { playPowerUpSound } = useSound();

  const onCompleteRef = useRef(onComplete);
  const onFormationProgressRef = useRef(onFormationProgress);
  const playPowerUpSoundRef = useRef(playPowerUpSound);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onFormationProgressRef.current = onFormationProgress;
    playPowerUpSoundRef.current = playPowerUpSound;
  });

  useEffect(() => {
    // Initial sound
    try {
      playPowerUpSoundRef.current?.();
    } catch {}

    const startTime = performance.now();
    const duration = 350; // Ultra fast & snappy ~0.35s

    let animId: number;

    const updateProgress = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeProgress = Math.pow(progress, 1.2);

      setPercent(Math.min(100, Math.floor(progress * 100)));
      try {
        onFormationProgressRef.current?.(easeProgress);
      } catch {}

      if (progress < 0.4) {
        setPhaseText("INITIALIZING...");
      } else if (progress < 0.8) {
        setPhaseText("LOADING EXPERIENCE...");
      } else {
        setPhaseText("JAYLO / 2026");
      }

      if (progress >= 1) {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsDone(true);
          try {
            onCompleteRef.current?.();
          } catch {}
        }, 150);
      } else {
        animId = requestAnimationFrame(updateProgress);
      }
    };

    animId = requestAnimationFrame(updateProgress);

    // Guaranteed fallback timer
    const safetyTimeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsDone(true);
        try {
          onCompleteRef.current?.();
        } catch {}
      }, 100);
    }, 600);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#030303] flex flex-col items-center justify-center transition-opacity duration-200 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-6">
        
        {/* Subtle Minimal Loader Mark */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-10 h-10 border border-white/10 rounded-full animate-ping opacity-30"></div>
          <div className="w-6 h-6 border border-coreCyan/60 rounded-sm rotate-45 animate-spin duration-3000"></div>
          <div className="absolute w-1.5 h-1.5 bg-coreCyan rounded-full shadow-[0_0_8px_#4DF2FF]"></div>
        </div>

        {/* Phase Text */}
        <div className="space-y-2 text-center">
          <div className="font-mono text-[11px] tracking-[0.25em] text-white/90 uppercase font-medium">
            {phaseText}
          </div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted">
            SYS.BOOT // [{percent.toString().padStart(3, "0")}%]
          </div>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-48 h-[1px] bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-coreBlue to-coreCyan transition-all duration-75 ease-out shadow-[0_0_8px_#4DF2FF]"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

      </div>
    </div>
  );
};
