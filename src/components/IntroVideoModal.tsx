"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Subtitles
} from "lucide-react";
import { useSound } from "./SoundController";

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
  audioSrc?: string;
  startTime?: number;
}

interface CaptionSegment {
  start: number;
  end: number;
  text: string;
}

const INTRO_CAPTIONS: CaptionSegment[] = [
  {
    start: 0.0,
    end: 2.8,
    text: "Meet Jaylo, a software engineer",
  },
  {
    start: 2.8,
    end: 5.3,
    text: "who builds full stack web and mobile applications.",
  },
  {
    start: 5.3,
    end: 8.6,
    text: "He turns ideas into digital experiences",
  },
  {
    start: 8.6,
    end: 12.1,
    text: "through development, UI/UX design, and graphic design.",
  },
  {
    start: 12.1,
    end: 14.6,
    text: "His projects include AI-powered systems,",
  },
  {
    start: 14.6,
    end: 17.2,
    text: "SaaS platforms, and dashboards.",
  },
  {
    start: 17.2,
    end: 21.0,
    text: "Beyond software, Jaylo edits videos and manages social media content,",
  },
  {
    start: 21.0,
    end: 25.2,
    text: "bringing together code, visuals, and storytelling.",
  },
  {
    start: 25.2,
    end: 27.8,
    text: "This is Jaylo's portfolio.",
  },
  {
    start: 27.8,
    end: 30.75,
    text: "Explore his work, and let's build what's next.",
  },
];

export const IntroVideoModal: React.FC<IntroVideoModalProps> = ({
  isOpen,
  onClose,
  audioSrc = "/sounds/intro-voice.mp3",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("00:00");
  const [totalDurationFormatted, setTotalDurationFormatted] = useState("00:30");
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playSelectSound, playHoverSound } = useSound();

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Find the synchronized caption for current playback timestamp
  const currentCaption = INTRO_CAPTIONS.find(
    (cap) => currentTime >= cap.start && currentTime <= cap.end
  );

  // Auto-request browser native fullscreen when opened
  const enterNativeFullscreen = useCallback(() => {
    try {
      const el = containerRef.current || document.documentElement;
      if (el.requestFullscreen && !document.fullscreenElement) {
        el.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request prevented:", err);
        });
      }
    } catch {
      // Ignore fullscreen prevention
    }
  }, []);

  const exitNativeFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleClose = useCallback(() => {
    playSelectSound();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    exitNativeFullscreen();
    onClose();
  }, [onClose, playSelectSound, exitNativeFullscreen]);

  // Main playback trigger when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      enterNativeFullscreen();

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.95;
        audioRef.current.play().catch((err) => {
          if (err?.name !== "AbortError") {
            console.warn("Audio autoplay prevented:", err);
          }
          setIsPlaying(false);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      exitNativeFullscreen();
    }
  }, [enterNativeFullscreen, exitNativeFullscreen, isOpen]);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle escape & keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      } else if (e.key === "c" || e.key === "C") {
        setShowCaptions((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreenMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, isPlaying, isMuted]);

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 4000);
  };

  const togglePlay = () => {
    playSelectSound();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    playSelectSound();
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const restartMedia = () => {
    playSelectSound();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleFullscreenMode = () => {
    playSelectSound();
    if (!document.fullscreenElement) {
      enterNativeFullscreen();
    } else {
      exitNativeFullscreen();
    }
  };

  const handleMediaTimeUpdate = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    const cur = e.currentTarget.currentTime;
    const dur = e.currentTarget.duration || 30.75;
    const p = (cur / dur) * 100;
    setCurrentTime(cur);
    setProgress(isNaN(p) ? 0 : p);
    setCurrentTimeFormatted(formatTime(cur));
    setTotalDurationFormatted(formatTime(dur));
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) {
      audioRef.current.currentTime = pos * (audioRef.current.duration || 30.75);
    }
    playSelectSound();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[200] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* 
        ========================================================================
        CYBERNETIC AUDIO TRANSMISSION STAGE
        ========================================================================
      */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-[#04060d]">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleMediaTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
          }}
          preload="auto"
        />

        {/* Ambient Glowing Background Core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-[320px] sm:w-[560px] h-[320px] sm:h-[560px] rounded-full bg-gradient-to-tr from-coreBlue/25 via-coreCyan/20 to-transparent blur-3xl transition-transform duration-700 ${
            isPlaying ? "scale-110 opacity-75 animate-pulse" : "scale-90 opacity-25"
          }`} />
          <div className="absolute w-[220px] sm:w-[380px] h-[220px] sm:h-[380px] rounded-full border border-coreCyan/25 animate-spin" style={{ animationDuration: "25s" }} />
          <div className="absolute w-[260px] sm:w-[440px] h-[260px] sm:h-[440px] rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: "40s", animationDirection: "reverse" }} />
        </div>

        {/* Centerpiece Audio Transmission Card */}
        <div className="relative z-10 max-w-xl w-full p-6 sm:p-9 rounded-3xl bg-[#090d18]/90 border border-white/20 backdrop-blur-2xl shadow-[0_0_80px_rgba(77,242,255,0.2)] flex flex-col items-center space-y-5 sm:space-y-6">
          
          {/* Live Transmission Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-coreCyan/10 border border-coreCyan/30">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-coreCyan ${isPlaying ? "opacity-75" : "opacity-0"}`} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-coreCyan" />
            </span>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-coreCyan uppercase font-semibold">
              {isPlaying ? "VOICE TRANSMISSION ACTIVE" : "VOICE TRANSMISSION PAUSED"}
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-1">
            <h2 className="font-grotesk text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-wide uppercase">
              JAYLO LUDOVICE
            </h2>
            <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
              Portfolio voice introduction and creative stack overview.
            </p>
          </div>

          {/* Kinetic Frequency Spectrum Visualizer */}
          <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 h-14 sm:h-16 py-1">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-coreBlue via-coreCyan to-white transition-all duration-300 ${
                  isPlaying ? "opacity-100" : "opacity-30 h-2"
                }`}
                style={{
                  height: isPlaying ? `${Math.max(10, Math.sin(i * 0.35 + (progress / 10)) * 48 + 18 + (i % 6) * 6)}px` : "6px",
                  animationDelay: `${(i * 0.05).toFixed(2)}s`,
                }}
              />
            ))}
          </div>

          {/* Real-Time Synchronized Speech Captions */}
          {showCaptions && (
            <div className="w-full min-h-[60px] sm:min-h-[68px] flex items-center justify-center px-4 py-3 rounded-2xl bg-black/60 border border-coreCyan/30 shadow-[0_0_25px_rgba(77,242,255,0.15)] transition-all">
              {currentCaption ? (
                <p className="font-sans text-sm sm:text-base md:text-lg text-white font-medium text-center leading-relaxed tracking-wide animate-in fade-in zoom-in-95 duration-200">
                  {currentCaption.text}
                </p>
              ) : (
                <p className="font-mono text-xs text-zinc-500 italic">
                  // Initializing speech transmission...
                </p>
              )}
            </div>
          )}

          {/* Time Indicator */}
          <div className="flex items-center justify-between w-full font-mono text-xs text-zinc-400 px-1">
            <span>{currentTimeFormatted}</span>
            <span className="text-coreCyan tracking-widest text-[11px]">AUDIO INTRO [0:30]</span>
            <span>{totalDurationFormatted}</span>
          </div>

          {/* Quick Play/Pause Action Bar */}
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={restartMedia}
              onMouseEnter={() => playHoverSound()}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white transition-all cursor-pointer"
              title="Replay Audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              onMouseEnter={() => playHoverSound()}
              className="w-14 h-14 rounded-full bg-coreCyan text-black flex items-center justify-center shadow-[0_0_30px_rgba(77,242,255,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              onMouseEnter={() => playHoverSound()}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white transition-all cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-coreCyan" />}
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        TOP HUD BAR (Clean, Minimal, Only Status, Captions Toggle & Close)
        ========================================================================
      */}
      <div
        className={`fixed top-0 left-0 w-full p-4 sm:p-6 flex items-center justify-between z-30 transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Left Live Status */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs text-muted/80 bg-black/75 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-coreCyan animate-ping shadow-[0_0_8px_#4DF2FF]"></span>
          <span className="text-white font-semibold tracking-wider uppercase text-[10px] sm:text-xs">
            JAYLO LUDOVICE // VOICE TRANSMISSION
          </span>
          <span className="text-coreCyan/80 font-mono text-[9px] sm:text-[10px] hidden md:inline-block border-l border-white/20 pl-2">
            0:30 AUDIO INTRO
          </span>
        </div>

        {/* Top Right Action: Subtitles/Captions Toggle + Close Button */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Captions Toggle Button */}
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setShowCaptions((prev) => !prev);
            }}
            onMouseEnter={() => playHoverSound()}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border font-mono text-[11px] tracking-wider transition-all cursor-pointer backdrop-blur-md ${
              showCaptions
                ? "bg-coreCyan/20 text-coreCyan border-coreCyan/40 shadow-[0_0_12px_rgba(77,242,255,0.25)]"
                : "bg-black/80 text-zinc-400 border-white/15 hover:text-white"
            }`}
            title="Toggle Captions [C]"
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CC {showCaptions ? "ON" : "OFF"}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            type="button"
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/80 hover:bg-white/15 border border-white/20 hover:border-coreCyan text-xs tracking-widest text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer"
            title="Exit Fullscreen / Close [ESC]"
          >
            <span className="hidden sm:inline font-mono font-medium">CLOSE</span>
            <span className="hidden sm:inline text-[10px] text-muted/80 font-mono">[ESC]</span>
            <X className="w-4 h-4 text-coreCyan group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        BOTTOM FLOATING CINEMA CONTROLS
        ========================================================================
      */}
      <div
        className={`fixed bottom-0 left-0 w-full p-4 sm:p-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3.5 z-30 transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Interactive Timeline Scrubber Track */}
        <div
          onClick={handleScrubberClick}
          className="pointer-events-auto w-full h-2 hover:h-3 bg-white/20 hover:bg-white/30 rounded-full overflow-hidden cursor-pointer transition-all relative group/scrubber"
        >
          <div
            className="h-full bg-gradient-to-r from-coreBlue to-coreCyan shadow-[0_0_12px_#4DF2FF] transition-all duration-75 relative"
            style={{ width: `${progress}%` }}
          >
            {/* Scrubber head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#FFFFFF] opacity-0 group-hover/scrubber:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white font-mono text-xs">
          {/* Left Buttons: Play, Restart, Mute, Time */}
          <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
            <button
              onClick={togglePlay}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-coreCyan/20 text-white hover:text-coreCyan transition-all"
              title={isPlaying ? "Pause [Space]" : "Play [Space]"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={restartMedia}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-muted hover:text-white transition-all"
              title="Restart Audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-coreCyan transition-all"
              title={isMuted ? "Unmute [M]" : "Mute [M]"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-coreCyan" />}
            </button>

            {/* Time Indicator */}
            <div className="text-[11px] sm:text-xs text-muted tracking-wider">
              <span className="text-white font-semibold">{currentTimeFormatted}</span>
              <span className="mx-1">/</span>
              <span>{totalDurationFormatted}</span>
            </div>
          </div>

          {/* Right Buttons: Fullscreen */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={toggleFullscreenMode}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-coreCyan transition-all"
              title={isBrowserFullscreen ? "Exit Fullscreen [F]" : "Fullscreen [F]"}
            >
              {isBrowserFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
