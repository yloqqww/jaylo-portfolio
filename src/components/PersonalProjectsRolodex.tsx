"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { 
  ArrowUpRight, 
  ExternalLink, 
  Lock, 
  Video, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  Grid, 
  Volume2, 
  VolumeX,
  Play,
  RotateCcw
} from "lucide-react";
import { useSound } from "./SoundController";
import { TiltCard } from "./TiltCard";

export interface ProjectItem {
  id: string;
  tag: string;
  category: string;
  title: string;
  tagline: string;
  client: string;
  shortDesc: string;
  fullDesc: string;
  imageSrc: string;
  videoUrl?: string;
  videoDriveUrl?: string;
  tech: string[];
  liveUrl?: string;
  statusText: string;
  [key: string]: any;
}

interface PersonalProjectsRolodexProps<T = ProjectItem> {
  projects: T[];
  onOpenProject: (project: T) => void;
}

export const PersonalProjectsRolodex = <T extends ProjectItem>({
  projects,
  onOpenProject,
}: PersonalProjectsRolodexProps<T>) => {
  const { playHoverSound, playSelectSound } = useSound();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"DECK" | "GRID">("DECK");
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");
  const wheelLockRef = useRef(false);

  const total = projects.length;
  const current = projects[activeIndex] || projects[0];

  const handleNext = useCallback(() => {
    playSelectSound();
    setActiveIndex((prev) => (prev + 1) % total);
  }, [playSelectSound, total]);

  const handlePrev = useCallback(() => {
    playSelectSound();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [playSelectSound, total]);

  // Keyboard navigation when in Deck mode
  useEffect(() => {
    if (viewMode !== "DECK") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  // Mouse wheel scroll to flip through cards
  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "DECK") return;
    if (wheelLockRef.current) return;

    if (Math.abs(e.deltaY) > 35) {
      wheelLockRef.current = true;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 550);
    }
  };

  // Filtered list for Grid mode
  const filteredProjects = projects.filter((p) => {
    if (activeCategoryFilter === "ALL") return true;
    if (activeCategoryFilter === "LIVE") return Boolean(p.liveUrl);
    if (activeCategoryFilter === "VIDEO") return Boolean(p.videoUrl);
    if (activeCategoryFilter === "SAAS") return p.category.includes("SAAS") || p.category.includes("FULL STACK");
    if (activeCategoryFilter === "CIVIC") return p.category.includes("COMMUNITY") || p.category.includes("GOVERNANCE");
    return true;
  });

  // Calculate 3D perspective styles for Beeyond Tech-inspired Folding Deck
  const getCardTransform = (index: number) => {
    const diff = index - activeIndex;

    // Previous card: Folded forward on bottom plane (Floor reflection)
    if (diff === -1 || (activeIndex === 0 && index === total - 1)) {
      return {
        transform: "perspective(1400px) rotateX(76deg) translateY(180px) translateZ(-40px) scale(0.96)",
        transformOrigin: "top center",
        opacity: 0.65,
        zIndex: 5,
        filter: "brightness(0.65) blur(0.5px)",
        pointerEvents: "auto" as const,
        transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    // Active Center Card
    if (diff === 0) {
      return {
        transform: "perspective(1400px) rotateX(8deg) translateY(0px) translateZ(50px) scale(1)",
        transformOrigin: "center center",
        opacity: 1,
        zIndex: 40,
        filter: "none",
        pointerEvents: "auto" as const,
        transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    // Stacked Cards behind (peeking tabs)
    if (diff > 0 && diff <= 5) {
      const ty = -diff * 32;
      const tz = -diff * 75;
      const rot = 7 + diff * 2.2;
      const scale = 1 - diff * 0.032;
      const opacity = Math.max(0.35, 1 - diff * 0.14);
      return {
        transform: `perspective(1600px) rotateX(${rot}deg) translateY(${ty}px) translateZ(${tz}px) scale(${scale})`,
        transformOrigin: "bottom center",
        opacity,
        zIndex: 30 - diff,
        filter: `brightness(${Math.max(0.45, 1 - diff * 0.12)})`,
        pointerEvents: "auto" as const,
        transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    // Far inactive cards
    return {
      transform: "perspective(1600px) rotateX(25deg) translateY(-260px) translateZ(-600px) scale(0.8)",
      transformOrigin: "bottom center",
      opacity: 0,
      zIndex: 0,
      filter: "brightness(0.3)",
      pointerEvents: "none" as const,
      transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
    };
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-500">
      
      {/* Top Header & Layout Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 font-mono text-xs text-coreCyan tracking-[0.25em] uppercase">
            <span className="w-2 h-2 rounded-full bg-coreCyan animate-pulse" />
            <span>3D FOLDING ARCHIVE • PERSONAL SOFTWARE SYSTEMS</span>
          </div>
          <h2 className="font-grotesk font-light text-3xl sm:text-5xl text-white tracking-wide">
            Personal Projects & Platforms
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans max-w-2xl leading-relaxed">
            Interactive layered deck of production web applications, SaaS ecosystems, and civic e-governance solutions.
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Deck vs Grid Switcher */}
          <div className="flex items-center p-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setViewMode("DECK");
              }}
              onMouseEnter={() => playHoverSound()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
                viewMode === "DECK"
                  ? "bg-coreCyan text-black font-semibold shadow-[0_0_15px_rgba(77,242,255,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D FOLDING DECK</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setViewMode("GRID");
              }}
              onMouseEnter={() => playHoverSound()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
                viewMode === "GRID"
                  ? "bg-coreCyan text-black font-semibold shadow-[0_0_15px_rgba(77,242,255,0.4)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>EXPANDED GRID</span>
            </button>
          </div>



          {/* Quick Filter Pills (in Grid mode) */}
          {viewMode === "GRID" && (
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {[
                { id: "ALL", label: `ALL (${projects.length})` },
                { id: "LIVE", label: "LIVE SITES" },
                { id: "VIDEO", label: "VIDEO DEMOS" },
                { id: "SAAS", label: "SAAS" },
                { id: "CIVIC", label: "CIVIC" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playHoverSound();
                    setActiveCategoryFilter(tab.id);
                  }}
                  className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    activeCategoryFilter === tab.id
                      ? "bg-coreCyan text-black border-coreCyan font-semibold"
                      : "bg-white/[0.04] text-white/70 border-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BEEYOND TECH-INSPIRED 3D FOLDING DECK MODE                              */}
      {/* ========================================================================= */}
      {viewMode === "DECK" ? (
        <div 
          onWheel={handleWheel}
          className="relative w-full min-h-[760px] sm:min-h-[840px] lg:min-h-[920px] flex flex-col justify-between items-center py-6 select-none overflow-hidden transition-all duration-500"
          style={{ perspective: "1500px" }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-coreCyan/10 blur-[180px] pointer-events-none rounded-full transition-all duration-700" />

          {/* Top Instruction Pill */}
          <div className="relative z-30 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md font-mono text-[11px] text-zinc-300 shadow-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-coreCyan animate-ping" />
            <span className="tracking-wide">
              SCROLL / CLICK TABS TO FLIP THROUGH THE 3D DECK
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-coreCyan font-semibold">{activeIndex + 1} of {total}</span>
          </div>

          {/* 3D Stacked Stage */}
          <div className="relative w-full max-w-5xl xl:max-w-6xl h-[480px] sm:h-[560px] lg:h-[640px] my-auto flex items-center justify-center transition-all duration-500">
            {projects.map((item, idx) => {
              const cardStyle = getCardTransform(idx);
              const isActive = idx === activeIndex;
              const isPrevious = idx === activeIndex - 1 || (activeIndex === 0 && idx === total - 1);

              return (
                <div
                  key={item.id}
                  style={cardStyle}
                  onClick={() => {
                    if (!isActive) {
                      playSelectSound();
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute w-[94%] sm:w-[90%] lg:w-[960px] xl:w-[1080px] aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden border bg-[#0d0d15] shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col cursor-pointer transition-all duration-500 ${
                    isActive
                      ? "border-coreCyan/80 shadow-[0_35px_100px_rgba(77,242,255,0.3)] ring-1 ring-coreCyan/40"
                      : "border-white/20 hover:border-white/50"
                  }`}
                >
                  {/* Peeking Tab Header Bar (Always visible in 3D stack) */}
                  <div className="w-full px-4 sm:px-7 py-3 bg-[#141520] border-b border-white/10 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-2 font-mono text-[11px] sm:text-xs font-semibold text-white tracking-widest uppercase">
                        {item.tag} // {item.client}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {item.videoUrl && (
                        <span className="px-2.5 py-0.5 rounded-full bg-coreCyan/20 border border-coreCyan/50 font-mono text-[9px] sm:text-[10px] text-coreCyan flex items-center gap-1 font-medium">
                          <Video className="w-3 h-3" />
                          VIDEO DEMO
                        </span>
                      )}
                      <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[200px] hidden sm:inline">
                        {item.liveUrl ? item.liveUrl.replace(/^https?:\/\//, '') : `${item.id}.sys`}
                      </span>
                    </div>
                  </div>

                  {/* Surface Content (Video / Image) */}
                  <div className="relative flex-1 w-full bg-black overflow-hidden group/media">
                    {item.videoUrl ? (
                      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                        <video
                          src={item.videoUrl}
                          autoPlay
                          loop
                          muted={isVideoMuted}
                          playsInline
                          className="w-full h-full object-cover object-top"
                        />
                        {/* Video Live Badge */}
                        <div className="absolute top-3.5 left-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-coreCyan/40 text-coreCyan font-mono text-[10px] sm:text-[11px] tracking-wider pointer-events-none z-10 shadow-xl">
                          <span className="w-2 h-2 rounded-full bg-coreCyan animate-ping" />
                          <span>WALKTHROUGH DEMO</span>
                        </div>

                        {/* Audio Toggle (Only on active card) */}
                        {isActive && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playHoverSound();
                              setIsVideoMuted(!isVideoMuted);
                            }}
                            className="absolute bottom-4 right-4 z-20 px-3.5 py-2 rounded-full bg-black/85 hover:bg-white text-white hover:text-black border border-white/20 transition-all font-mono text-[10px] sm:text-[11px] flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-xl"
                          >
                            {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 text-coreCyan" /> : <Volume2 className="w-3.5 h-3.5 text-coreCyan" />}
                            <span>{isVideoMuted ? "UNMUTE AUDIO" : "MUTED"}</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-full overflow-hidden">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          className="object-cover object-top group-hover/media:object-bottom transition-all duration-[4500ms] ease-in-out opacity-90 group-hover/media:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity flex items-end p-5">
                          <span className="font-mono text-[11px] text-white bg-black/90 px-4 py-1.5 rounded-full border border-white/20 shadow-xl">
                            HOVER TO AUTO-SCROLL FULL SYSTEM
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for bottom text */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/65 to-transparent pointer-events-none" />

                    {/* Active Project Overlay Banner (Theater Sized) */}
                    <div className="absolute bottom-5 sm:bottom-7 left-6 sm:left-9 right-6 sm:right-9 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4 text-left pointer-events-none">
                      <div className="space-y-1.5 max-w-xl lg:max-w-2xl">
                        <span className="font-mono text-[11px] sm:text-xs text-coreCyan uppercase tracking-widest font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-coreCyan" />
                          {item.category}
                        </span>
                        <h3 className="font-grotesk font-bold text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight line-clamp-1 drop-shadow-lg">
                          {item.title}
                        </h3>
                        <p className="text-zinc-300 text-xs sm:text-sm font-sans line-clamp-2 drop-shadow-md max-w-xl">
                          {item.shortDesc}
                        </p>
                      </div>

                      {/* Interactive Buttons (Clickable) */}
                      {isActive && (
                        <div className="flex items-center gap-3 pointer-events-auto shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenProject(item);
                            }}
                            className="px-5 py-2.5 rounded-full bg-coreCyan text-black hover:bg-white font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(77,242,255,0.45)] cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <span>INSPECT SPECS</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          {item.liveUrl && (
                            <a
                              href={item.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-5 py-2.5 rounded-full bg-black/85 hover:bg-white text-white hover:text-black border border-white/30 font-mono text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2 backdrop-blur-md shadow-xl hover:scale-105 active:scale-95"
                            >
                              <span>LAUNCH</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Deck Controls (Prev / Next & Counter) */}
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl px-4 pt-6 border-t border-white/10 shrink-0 gap-4 transition-all duration-500">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              onMouseEnter={() => playHoverSound()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/30 hover:border-coreCyan bg-zinc-900/90 hover:bg-coreCyan hover:text-black text-white font-mono text-xs tracking-widest uppercase transition-all backdrop-blur-md cursor-pointer shadow-xl group"
            >
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>PREVIOUS</span>
            </button>

            {/* Stepper Dots & Numbers */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-base font-bold text-white tracking-widest">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {projects.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    onClick={() => {
                      playSelectSound();
                      setActiveIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeIndex
                        ? "w-7 bg-coreCyan shadow-[0_0_10px_#4df2ff]"
                        : "w-1.5 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-zinc-500 tracking-widest">
                {String(total).padStart(2, "0")}
              </span>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              onMouseEnter={() => playHoverSound()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/30 hover:border-coreCyan bg-zinc-900/90 hover:bg-coreCyan hover:text-black text-white font-mono text-xs tracking-widest uppercase transition-all backdrop-blur-md cursor-pointer shadow-xl group"
            >
              <span>NEXT</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. EXPANDED GRID MODE                                                     */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 animate-in fade-in duration-500">
          {filteredProjects.map((project) => (
            <TiltCard
              key={project.id}
              onClick={() => onOpenProject(project)}
              onMouseEnter={() => playHoverSound()}
              maxTilt={6}
              className="group relative rounded-2xl sm:rounded-3xl bg-[#090c15]/95 border border-white/15 hover:border-coreCyan/70 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:-translate-y-1.5"
            >
              {/* Top Viewport Header */}
              <div className="w-full px-4 sm:px-5 py-3 bg-[#11131c] border-b border-white/10 flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline">
                    {project.tag}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/60 border border-white/10 font-mono text-[10px] text-zinc-300 max-w-[200px] truncate">
                  <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : `${project.id}.internal.sys`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {project.videoUrl && (
                    <span className="px-2 py-0.5 rounded-full bg-coreCyan/20 border border-coreCyan/50 font-mono text-[9px] text-coreCyan flex items-center gap-1">
                      <Video className="w-2.5 h-2.5" />
                      DEMO
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-coreCyan hidden sm:inline">
                    {project.statusText}
                  </span>
                </div>
              </div>

              {/* Media Preview */}
              <div className="relative w-full aspect-[16/10] bg-[#0c0d14] overflow-hidden group/media">
                {project.videoUrl ? (
                  <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-coreCyan/40 text-coreCyan font-mono text-[9px] tracking-wider pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-coreCyan animate-ping" />
                      <span>LIVE WALKTHROUGH DEMO</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      className="object-cover object-top group-hover/media:object-bottom transition-all duration-[4000ms] ease-in-out opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="font-mono text-[10px] text-white bg-black/85 px-3.5 py-1 rounded-full border border-white/20 shadow-lg">
                        HOVER TO AUTO-SCROLL FULL SYSTEM
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-coreCyan/20 group-hover:bg-coreCyan text-coreCyan group-hover:text-black flex items-center justify-center backdrop-blur-md transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 text-left">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-coreCyan tracking-widest uppercase">
                    <span className="w-3 h-[1.5px] bg-coreCyan" />
                    <span>{project.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">{project.client}</span>
                  </div>

                  <h3 className="font-grotesk text-2xl sm:text-3xl text-white group-hover:text-coreCyan transition-colors font-medium leading-tight">
                    {project.title}
                  </h3>

                  <p className="font-mono text-xs text-coreCyan/80 uppercase tracking-wider line-clamp-1">
                    {project.tagline}
                  </p>

                  <p className="text-zinc-300 text-xs sm:text-sm font-sans line-clamp-2 leading-relaxed">
                    {project.shortDesc}
                  </p>
                </div>

                {/* Tech Chips & Actions */}
                <div className="space-y-4 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-300 tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-white hover:text-coreCyan tracking-wider transition-colors cursor-pointer"
                    >
                      <span>INSPECT ARCHITECTURE</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-coreCyan" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.videoDriveUrl && (
                        <a
                          href={project.videoDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 rounded-full border border-white/20 hover:border-coreCyan bg-white/[0.04] hover:bg-coreCyan hover:text-black text-white font-mono text-[10px] tracking-wider transition-all flex items-center gap-1.5"
                        >
                          <span>DRIVE DEMO</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-1 rounded-full bg-white hover:bg-coreCyan text-black font-mono text-[10px] font-semibold tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <span>LIVE SITE</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

    </div>
  );
};
