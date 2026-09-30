"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BackgroundContextType {
  isCharging: boolean;
  holdProgress: number;
  isBursting: boolean;
  setHoldState: (charging: boolean, progress: number, bursting: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  isCharging: false,
  holdProgress: 0,
  isBursting: false,
  setHoldState: () => { },
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCharging, setIsCharging] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isBursting, setIsBursting] = useState(false);

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
        setHoldState,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};
