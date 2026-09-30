"use client";

import "@/lib/r3f-polyfill";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SoundProvider, useSound } from "@/components/SoundController";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { WorkPreview } from "@/components/WorkPreview";
import { LongPressHandler } from "@/components/LongPressHandler";
import { IntroVideoModal } from "@/components/IntroVideoModal";
import { useBackground } from "@/components/BackgroundContext";

const PortfolioContent: React.FC = () => {
  const router = useRouter();
  const { setHoldState } = useBackground();
  const [isLoaded, setIsLoaded] = useState(false);
  const [formationProgress, setFormationProgress] = useState(0);
  const [activeMode, setActiveMode] = useState("IDLE");
  const [isTransitioningToWork, setIsTransitioningToWork] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isIntroVideoOpen, setIsIntroVideoOpen] = useState(false);
  const [introStartTime, setIntroStartTime] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { playTransitionSound, playHoverSound } = useSound();

  const handleHoldStateChange = useCallback(
    (state: { isPressing: boolean; isBursting: boolean; progress: number; elapsedSeconds: number }) => {
      setIsPressing(state.isPressing);
      setIsBursting(state.isBursting);
      setHoldProgress(state.progress);
      setElapsedSeconds(state.elapsedSeconds);
      setHoldState(state.isPressing, state.progress, state.isBursting);
    },
    [setHoldState]
  );

  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true);
    setFormationProgress(1);
  }, []);

  const handleFormationProgress = useCallback((progress: number) => {
    setFormationProgress(progress);
  }, []);

  const handleSelectNav = useCallback((item: string) => {
    playHoverSound();

    if (item === "WORK") {
      playTransitionSound();
      router.push("/work");
      return;
    }
    setActiveSection(item);
  }, [playHoverSound, playTransitionSound, router]);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
    setIsTransitioningToWork(false);
    setActiveMode("IDLE");
  }, []);

  const handleTriggerIntro = useCallback((startTime: number = 0) => {
    setIntroStartTime(startTime);
    setIsIntroVideoOpen(true);
  }, []);

  const handleCloseIntro = useCallback(() => {
    setIsIntroVideoOpen(false);
  }, []);

  const handleHeroWorkClick = useCallback(() => {
    playTransitionSound();
    router.push("/work");
  }, [playTransitionSound, router]);

  return (
    <main className="relative w-full h-screen h-[100dvh] bg-transparent overflow-hidden select-none">
      {/* Invisible Screen Hold Interaction (charges 3D core & triggers intro on hold anywhere) */}
      <LongPressHandler
        onTriggerIntro={handleTriggerIntro}
        onStateChange={handleHoldStateChange}
        disabled={!isLoaded || Boolean(activeSection) || isIntroVideoOpen}
      />

      {/* Cinematic Intro Voice & Media Modal */}
      <IntroVideoModal
        isOpen={isIntroVideoOpen}
        onClose={handleCloseIntro}
        videoSrc="/intro.mp4"
        audioSrc="/sounds/intro-voice.mp3"
        startTime={introStartTime}
      />

      {/* Loading Sequence */}
      <LoadingScreen
        onComplete={handleLoadingComplete}
        onFormationProgress={handleFormationProgress}
      />

      {/* Hero Experience (100vh with 3D Digital Core) */}
      <Hero
        formationProgress={formationProgress}
        activeMode={activeMode}
        isTransitioningToWork={isTransitioningToWork}
        isLoaded={isLoaded}
        onWorkClick={handleHeroWorkClick}
        isChargingIntro={isPressing}
        holdProgress={holdProgress}
        isBurstingIntro={isBursting}
      />

      {/* Unified Navigation (Top Logo/Night Toggle/Sound on top; Floating Bottom Menu on Home) */}
      <Navigation isLoaded={isLoaded} />

      {/* Work Destination / Section Overlay */}
      <WorkPreview
        isOpen={Boolean(activeSection)}
        onClose={handleCloseSection}
        activeSection={activeSection || ""}
      />
    </main>
  );
};

export default function Home() {
  return <PortfolioContent />;
}
