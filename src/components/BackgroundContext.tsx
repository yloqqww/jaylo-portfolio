"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface BackgroundContextType {
  isCharging: boolean;
  holdProgress: number;
  isBursting: boolean;
  isEcoMode: boolean;
  toggleEcoMode: () => void;
  setHoldState: (charging: boolean, progress: number, bursting: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  isCharging: false,
  holdProgress: 0,
  isBursting: false,
  isEcoMode: false,
  toggleEcoMode: () => { },
  setHoldState: () => { },
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCharging, setIsCharging] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isBursting, setIsBursting] = useState(false);
  const [isEcoMode, setIsEcoMode] = useState(false);

  // Auto-detect low-power / battery-saver / low-core hardware
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jl_perf_mode");
      if (saved !== null) {
        setIsEcoMode(saved === "eco");
        return;
      }
      // If low-spec laptop (<= 4 CPU cores or mobile screen with low memory)
      const isLowCore = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 4) <= 2;
      if (isLowCore) {
        setIsEcoMode(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleEcoMode = useCallback(() => {
    setIsEcoMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("jl_perf_mode", next ? "eco" : "turbo");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setHoldState = useCallback((charging: boolean, progress: number, bursting: boolean) => {
    setIsCharging(charging);
    setHoldProgress(progress);
    setIsBursting(bursting);
  }, []);

  return (
    <BackgroundContext.Provider
      value={{
        isCharging,
        holdProgress,
        isBursting,
        isEcoMode,
        toggleEcoMode,
        setHoldState,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

