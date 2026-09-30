"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface LongPressHandlerProps {
  onTriggerIntro: (startTime?: number) => void;
  onStateChange?: (state: {
    isPressing: boolean;
    isBursting: boolean;
    progress: number;
    elapsedSeconds: number;
  }) => void;
  disabled?: boolean;
}

export const LongPressHandler: React.FC<LongPressHandlerProps> = ({
  onTriggerIntro,
  onStateChange,
  disabled = false,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pressStartTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null);
  const selectAudioRef = useRef<HTMLAudioElement | null>(null);
  const duration = 2500; // Snappy 2.5 seconds
  const minHoldThreshold = 2300; // Requires full ~2.5s hold before opening

  // Notify parent of 3D core hold and burst state changes
  useEffect(() => {
    onStateChange?.({
      isPressing,
      isBursting,
      progress,
      elapsedSeconds,
    });
  }, [isPressing, isBursting, progress, elapsedSeconds, onStateChange]);

  // Preload Audio Elements (Loading.wav and Select.mp3)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadingAudio = new Audio("/sounds/Loading.wav");
    loadingAudio.preload = "auto";
    loadingAudio.loop = true;
    loadingAudio.volume = 0.3; // Balanced 30% volume for subtle audio experience
    loadingAudioRef.current = loadingAudio;

    const selectAudio = new Audio("/sounds/Select.mp3");
    selectAudio.preload = "auto";
    selectAudio.volume = 0.3;
    selectAudioRef.current = selectAudio;

    return () => {
      loadingAudio.pause();
      loadingAudio.src = "";
      selectAudio.pause();
      selectAudio.src = "";
    };
  }, []);

  // Play the satisfying Select.mp3 "pop" sound
  const playSelectSound = useCallback(() => {
    if (selectAudioRef.current) {
      try {
        const sound = selectAudioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.3;
        sound.play().catch(() => {});
      } catch {
        selectAudioRef.current.currentTime = 0;
        selectAudioRef.current.play().catch(() => {});
      }
    }
  }, []);

  // Trigger 3D background particle explosion & launch Intro Video (No white flash!)
  const triggerIntro = useCallback((targetTime: number = 0) => {
    // 1. Immediately cut off Loading.wav
    if (loadingAudioRef.current) {
      loadingAudioRef.current.pause();
      loadingAudioRef.current.currentTime = 0;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // 2. Play satisfying Select.mp3 pop sound (same as sound toggle)
    playSelectSound();

    // 3. Trigger 3D background particle explosion (naghihiwalay-hiwalay palabas)
    setIsPressing(false);
    setIsBursting(true);

    // 4. Open video in true fullscreen after ~350ms of 3D particle explosion
    setTimeout(() => {
      setIsBursting(false);
      setProgress(0);
      setElapsedSeconds(0);
      pressStartTimeRef.current = null;
      onTriggerIntro(targetTime);
    }, 350);
  }, [onTriggerIntro, playSelectSound]);

  // Cancel hold if released prematurely (< 7s)
  const cancelHold = useCallback(() => {
    setIsPressing(false);
    setProgress(0);
    setElapsedSeconds(0);
    pressStartTimeRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (loadingAudioRef.current) {
      loadingAudioRef.current.pause();
      loadingAudioRef.current.currentTime = 0;
    }
  }, []);

  // Start charging on press down
  const startCharging = useCallback(() => {
    if (disabled || isBursting) return;
    setIsPressing(true);
    const startTime = performance.now();
    pressStartTimeRef.current = startTime;

    // Start playing Loading.wav
    if (loadingAudioRef.current) {
      loadingAudioRef.current.currentTime = 0;
      loadingAudioRef.current.play().catch(() => {});
    }

    const updateFrame = () => {
      if (!pressStartTimeRef.current) return;
      const elapsed = performance.now() - pressStartTimeRef.current;
      const currentProgress = Math.min(1, elapsed / duration);
      const seconds = Math.min(5, elapsed / 1000);

      setProgress(currentProgress);
      setElapsedSeconds(seconds);

      if (currentProgress >= 1) {
        // Reached full 5.0s! Trigger particle explosion & open video
        triggerIntro(0);
      } else {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);
  }, [disabled, duration, isBursting, triggerIntro]);

  // Handle release:
  // Must hold for the full 5 seconds! Releasing early cancels the charge.
  const handleRelease = useCallback(() => {
    if (!isPressing || !pressStartTimeRef.current) return;

    const elapsed = performance.now() - pressStartTimeRef.current;

    // Only trigger if hold completed the 5 seconds (>= 4800ms)
    if (elapsed >= minHoldThreshold) {
      triggerIntro(0);
    } else {
      // Released too early (e.g. before 5s) -> cancel charging, do not open video!
      cancelHold();
    }
  }, [cancelHold, isPressing, minHoldThreshold, triggerIntro]);

  // Global listeners for hold anywhere on the page
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      // Exclude interactive navigation and inputs
      if (
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        (target.closest("button") && !target.closest("#intro-reel-btn")) ||
        target.closest(".no-long-press")
      ) {
        return;
      }
      startCharging();
    };

    const handleMouseUp = () => {
      handleRelease();
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        (target.closest("button") && !target.closest("#intro-reel-btn")) ||
        target.closest(".no-long-press")
      ) {
        return;
      }
      startCharging();
    };

    const handleTouchEnd = () => {
      handleRelease();
    };

    // Prevent context menu or drag during press so holding is never interrupted
    const handleContextMenu = (e: MouseEvent) => {
      if (pressStartTimeRef.current) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (pressStartTimeRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("dragstart", handleDragStart);

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [handleRelease, startCharging]);

  return null;
};
