"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ExternalLink, 
  Code2, 
  Layers, 
  Cpu, 
  Sparkles, 
  Terminal, 
  ArrowUpRight, 
  Download, 
  Copy, 
  Check, 
  Radio, 
  Globe, 
  ShieldCheck,
  ChevronUp
} from "lucide-react";
import { useSound } from "./SoundController";

interface ExploreFeedProps {
  onBackToCore: () => void;
}



export const ExploreFeed: React.FC<ExploreFeedProps> = ({ onBackToCore }) => {
  const { playHoverSound, playSelectSound, playTransitionSound } = useSound();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    playSelectSound();
    navigator.clipboard.writeText("yloludovice709@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="explore-section" className="relative w-full z-20 bg-canvas text-typography border-t border-white/10 pt-20 pb-36 px-6 sm:px-12 lg:px-20">
      
      {/* Background Ambience & Cyber Grid */}
      <div className="absolute inset-0 bg-atmospheric pointer-events-none opacity-60"></div>
      <div className="absolute inset-0 bg-digital-grid pointer-events-none opacity-20"></div>

      <div className="relative max-w-7xl mx-auto space-y-36">
        
        {/* SECTION 1: ABOUT / DOSSIER */}
        <div id="about" className="scroll-mt-24 space-y-12">
          
          {/* Top telemetry status bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-md bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coreCyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coreCyan"></span>
              </span>
              <span className="font-mono text-xs tracking-widest text-coreCyan uppercase">
                TELEMETRY // SYSTEM ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-6 font-mono text-[11px] tracking-wider text-muted">
              <span>LOCATION: LAGUNA, PH (GMT+8)</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-white/80">STATUS: OPEN FOR NEW PROJECTS</span>
            </div>
          </div>

          {/* Bio Dossier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Profile Avatar / Hologram Badge */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group w-60 h-60 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-white/15 hover:border-coreCyan/80 transition-all duration-500 shadow-[0_0_30px_rgba(77,242,255,0.15)]">
                <Image
                  src="/last.png"
                  alt="Jaylo Ludovice"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
                {/* Cyber Scanline Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-coreCyan/5 to-transparent pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] font-mono text-white/90">
                  <span>JAYLO LUDOVICE</span>
                  <span className="text-coreCyan">CORE DEV</span>
                </div>
              </div>
            </div>

            {/* Narrative & Capabilities */}
            <div className="lg:col-span-8 space-y-6">
              <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
                // 01 OPERATIONAL PROFILE
              </div>
              <h2 className="font-grotesk font-light text-3xl sm:text-5xl text-white tracking-wide leading-tight">
                Architecting High-Impact Digital Systems & 3D Interactive Web
              </h2>
              <p className="text-muted text-sm sm:text-base font-sans leading-relaxed">
                I am a Full Stack Developer, UI/UX Designer, and Creative Technologist based in the Philippines.
                I engineer digital products at the intersection of robust backend infrastructure, responsive real-time data flows, and visually magnetic 3D web experiences.
              </p>

              {/* Live Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="font-mono text-2xl sm:text-3xl text-coreCyan font-semibold">30+</div>
                  <div className="font-mono text-[10px] tracking-wider text-muted uppercase">Shipped Projects</div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="font-mono text-2xl sm:text-3xl text-white font-semibold">5+</div>
                  <div className="font-mono text-[10px] tracking-wider text-muted uppercase">Years Experience</div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="font-mono text-2xl sm:text-3xl text-coreCyan font-semibold">100%</div>
                  <div className="font-mono text-[10px] tracking-wider text-muted uppercase">Code Reliability</div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="font-mono text-2xl sm:text-3xl text-white font-semibold">&lt;50ms</div>
                  <div className="font-mono text-[10px] tracking-wider text-muted uppercase">UI Response Latency</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 2: DEDICATED WORK MATRIX GATEWAY */}
        <div id="work" className="scroll-mt-24">
          <div className="relative p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0c0c0c] border border-white/15 hover:border-coreCyan/50 transition-all duration-500 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            
            {/* Ambient Cyan Radial Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-coreCyan/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coreCyan/10 border border-coreCyan/30 font-mono text-[10px] tracking-[0.3em] text-coreCyan uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>// 02 DEDICATED WORK MATRIX</span>
                </div>

                <h2 className="font-grotesk font-light text-3xl sm:text-5xl text-white leading-tight">
                  Production Systems & Industry Record
                </h2>

                <p className="text-muted text-sm sm:text-base font-sans leading-relaxed">
                  Access the standalone interactive 3D workspace featuring deployed personal full-stack platforms and verified commercial industry work experience.
                </p>

                <div className="flex flex-wrap gap-3 font-mono text-xs text-white/80 pt-2">
                  <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-coreCyan animate-pulse"></span>
                    <span>PERSONAL PROJECTS [6 SYSTEMS]</span>
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-coreBlue"></span>
                    <span>INDUSTRY [4 ROLES]</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <Link
                  href="/work"
                  onClick={() => playTransitionSound()}
                  className="group px-8 py-4 rounded-xl bg-coreCyan hover:bg-white text-black font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-3 font-semibold shadow-[0_0_30px_rgba(77,242,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  <span>LAUNCH 3D WORK PAGE</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: CORE ARSENAL & TECH STACK */}
        <div id="stack" className="scroll-mt-24 space-y-12">
          
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
              // 03 TECHNICAL INFRASTRUCTURE
            </div>
            <h2 className="font-grotesk font-light text-3xl sm:text-5xl text-white">
              Full Stack & Creative Arsenal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Frontend Matrix */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-coreCyan/50 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-coreCyan/10 border border-coreCyan/30 flex items-center justify-center text-coreCyan">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm tracking-wider text-white uppercase">Frontend Core</h3>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Engineered for sub-second rendering, accessible semantic structure, and responsive fluidity.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-coreCyan/90">
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">React 19</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Next.js 15</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">TypeScript</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Tailwind CSS</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Lenis Scroll</span>
              </div>
            </div>

            {/* Backend & Cloud */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-coreCyan/50 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-coreBlue/10 border border-coreBlue/30 flex items-center justify-center text-coreBlue">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm tracking-wider text-white uppercase">Backend & Cloud</h3>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Scalable database architectures, REST & GraphQL endpoints, and serverless edge functions.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-coreCyan/90">
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Node.js</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">PostgreSQL</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Supabase</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">REST APIs</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Edge Functions</span>
              </div>
            </div>

            {/* Creative & 3D Web */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-coreCyan/50 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-coreCyan/10 border border-coreCyan/30 flex items-center justify-center text-coreCyan">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm tracking-wider text-white uppercase">3D & Creative Web</h3>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Procedural particle systems, custom WebGL materials, and hardware-accelerated micro-interactions.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-coreCyan/90">
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Three.js</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">R3F</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">GSAP</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">WebGL</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Web Audio API</span>
              </div>
            </div>

            {/* Design & Multimedia */}
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-coreCyan/50 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm tracking-wider text-white uppercase">Design & Media</h3>
              <p className="text-xs text-muted leading-relaxed font-sans">
                High-fidelity UI/UX design systems, branding aesthetics, motion graphics, and video production.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-coreCyan/90">
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Figma</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">UI/UX Systems</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Premiere Pro</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">After Effects</span>
                <span className="px-2 py-0.5 bg-white/[0.03] border border-white/10 rounded">Design Systems</span>
              </div>
            </div>

          </div>

        </div>

        {/* SECTION 4: DIRECT TRANSMISSION & CONTACT */}
        <div id="contact" className="scroll-mt-24 space-y-12">
          
          <div className="p-8 sm:p-14 rounded-2xl bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-white/15 relative overflow-hidden space-y-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-coreCyan/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-4 max-w-2xl">
              <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>// 04 DIRECT UPLINK FREQUENCY</span>
              </div>
              <h2 className="font-grotesk font-light text-3xl sm:text-5xl text-white">
                Ready to Engineer Your Next Vision?
              </h2>
              <p className="text-muted text-sm sm:text-base font-sans leading-relaxed">
                Whether you need a high-performance web platform, an interactive 3D portfolio, or end-to-end full stack architecture, my transmission lines are open.
              </p>
            </div>

            {/* Interaction Buttons: Copy Email & Resume */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group px-5 py-3 rounded-lg bg-coreCyan hover:bg-white text-black font-mono text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(77,242,255,0.4)]"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>FREQUENCY COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black transition-transform group-hover:scale-110" />
                    <span>COPY EMAIL: yloludovice709@gmail.com</span>
                  </>
                )}
              </button>

              {/* Download Resume Button */}
              <a
                href="/resume.pdf"
                download="JAYLO_LUDOVICE_RESUME.pdf"
                onClick={() => playSelectSound()}
                className="px-5 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-coreCyan font-mono text-xs tracking-widest text-white/90 hover:text-white transition-all duration-300 flex items-center gap-2.5"
              >
                <Download className="w-4 h-4 text-coreCyan" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>

            </div>

            {/* Social Channels / Frequency nodes */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-xs font-mono text-muted">
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/jayloludovice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-coreCyan transition-colors"
                >
                  GITHUB // @jayloludovice
                </a>
                <span>•</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-coreCyan transition-colors"
                >
                  LINKEDIN
                </a>
              </div>

              {/* Return to Core quick link */}
              <button
                type="button"
                onClick={() => {
                  playTransitionSound();
                  onBackToCore();
                }}
                className="hover:text-coreCyan flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>RETURN TO DIGITAL CORE</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
