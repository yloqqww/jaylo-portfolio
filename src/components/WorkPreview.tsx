"use client";

import React from "react";
import { ArrowLeft, ExternalLink, Code2, Layers, Cpu, Radio } from "lucide-react";
import { useSound } from "./SoundController";

interface WorkPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string; // "WORK" | "ABOUT" | "STACK" | "LAB" | "CONTACT" | null
}

export const WorkPreview: React.FC<WorkPreviewProps> = ({
  isOpen,
  onClose,
  activeSection,
}) => {
  const { playSelectSound } = useSound();

  if (!isOpen && !activeSection) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030303]/90 backdrop-blur-xl flex flex-col overflow-y-auto animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => {
            playSelectSound();
            onClose();
          }}
          type="button"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/[0.03] border border-white/15 hover:border-coreCyan text-xs font-mono tracking-widest text-white/90 hover:text-coreCyan transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>RETURN TO DIGITAL CORE</span>
        </button>

        <div className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coreCyan animate-pulse"></span>
          <span>SYSTEM GATEWAY // {activeSection}</span>
        </div>
      </div>

      {/* Dynamic Content based on section */}
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-12 py-16 flex-1 flex flex-col justify-center">
        {activeSection === "WORK" ? (
          <div className="space-y-12">
            <div className="space-y-3">
              <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
                // PROJECT ARCHIVE & CASE STUDIES
              </div>
              <h2 className="font-grotesk font-light text-4xl sm:text-5xl text-white tracking-wide">
                Production Systems & Web Applications
              </h2>
              <p className="text-muted text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
                Full-stack web software, AI systems, SaaS architectures, and digital platforms engineered by Jaylo Ludovice.
              </p>
            </div>

            {/* Featured Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              
              {/* Project 1 */}
              <div className="p-6 rounded-lg bg-white/[0.02] border border-white/10 hover:border-coreCyan/40 transition-all space-y-4 group">
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span className="text-coreCyan">01 // AI CRM</span>
                  <span>VERCEL LIVE</span>
                </div>
                <h3 className="font-grotesk text-xl text-white group-hover:text-coreCyan transition-colors">
                  LeadFlow AI CRM
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  AI-powered CRM for sales teams with automated email writer, lead scoring, and team pipelines.
                </p>
                <div className="font-mono text-[10px] text-muted/80 flex flex-wrap gap-2 pt-2">
                  <span>Next.js</span> • <span>TypeScript</span> • <span>OpenAI</span> • <span>Stripe</span>
                </div>
                <a
                  href="https://leadflow-crm-sand.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-coreCyan hover:underline pt-2"
                >
                  <span>EXPLORE PROJECT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Project 2 */}
              <div className="p-6 rounded-lg bg-white/[0.02] border border-white/10 hover:border-coreCyan/40 transition-all space-y-4 group">
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span className="text-coreCyan">02 // E-GOV</span>
                  <span>MABITAC LGU</span>
                </div>
                <h3 className="font-grotesk text-xl text-white group-hover:text-coreCyan transition-colors">
                  Municipal E-Governance
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Official municipal portal with resident services, downloadable forms, and bilingual Groq AI query assistant.
                </p>
                <div className="font-mono text-[10px] text-muted/80 flex flex-wrap gap-2 pt-2">
                  <span>HTML</span> • <span>CSS</span> • <span>JavaScript</span> • <span>Supabase</span> • <span>Groq AI</span>
                </div>
                <a
                  href="https://municipalityofmabitac.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-coreCyan hover:underline pt-2"
                >
                  <span>VIEW LIVE SITE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Project 3 */}
              <div className="p-6 rounded-lg bg-white/[0.02] border border-white/10 hover:border-coreCyan/40 transition-all space-y-4 group">
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span className="text-coreCyan">03 // SAAS</span>
                  <span>UK HOUSING</span>
                </div>
                <h3 className="font-grotesk text-xl text-white group-hover:text-coreCyan transition-colors">
                  PropMaint SaaS
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Property maintenance platform for UK housing with operative mobile app and accounting integrations.
                </p>
                <div className="font-mono text-[10px] text-muted/80 flex flex-wrap gap-2 pt-2">
                  <span>React</span> • <span>Node.js</span> • <span>React Native</span> • <span>PostgreSQL</span>
                </div>
                <a
                  href="https://drive.google.com/drive/folders/1UaN1crC2TiCVU1aOlUHipvo9VQBhYRtj?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-coreCyan hover:underline pt-2"
                >
                  <span>VIEW DEMO</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>
        ) : activeSection === "ABOUT" ? (
          <div className="space-y-6 max-w-2xl">
            <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
              // 01 IDENTITY & PHILOSOPHY
            </div>
            <h2 className="font-grotesk font-light text-4xl text-white">
              Jaylo Ludovice
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed font-sans">
              Full Stack Developer, UI/UX Designer, and Creative Technologist based in Laguna, Philippines.
              Specialized in engineering robust digital systems from procedural 3D interfaces to scalable serverless architectures.
            </p>
            <div className="pt-4 font-mono text-xs text-muted space-y-2">
              <div>LOCATION: Laguna, Philippines (GMT+8)</div>
              <div>AVAILABILITY: Open for Full-Time & Freelance</div>
              <div>EMAIL: yloludovice709@gmail.com</div>
            </div>
          </div>
        ) : activeSection === "STACK" ? (
          <div className="space-y-6 max-w-3xl">
            <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
              // 02 TECHNICAL ARCHITECTURE
            </div>
            <h2 className="font-grotesk font-light text-4xl text-white">
              Full Stack Core Arsenal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 font-mono text-xs text-muted">
              <div className="p-4 rounded bg-white/[0.02] border border-white/10 space-y-2">
                <div className="text-white font-medium flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-coreCyan" />
                  <span>FRONTEND</span>
                </div>
                <div>Next.js • React • TypeScript • Three.js • React Three Fiber • Tailwind CSS</div>
              </div>
              <div className="p-4 rounded bg-white/[0.02] border border-white/10 space-y-2">
                <div className="text-white font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4 text-coreCyan" />
                  <span>BACKEND</span>
                </div>
                <div>Node.js • Laravel • PHP • Supabase • PostgreSQL • Prisma • REST & GraphQL</div>
              </div>
              <div className="p-4 rounded bg-white/[0.02] border border-white/10 space-y-2">
                <div className="text-white font-medium flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-coreCyan" />
                  <span>INTELLIGENCE & UI</span>
                </div>
                <div>OpenAI API • Groq AI • Figma • Photoshop • Premiere Pro • CapCut</div>
              </div>
            </div>
          </div>
        ) : activeSection === "LAB" ? (
          <div className="space-y-6 max-w-2xl">
            <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
              // 03 EXPERIMENTAL PROTOTYPES
            </div>
            <h2 className="font-grotesk font-light text-4xl text-white">
              Procedural & WebGL Experiments
            </h2>
            <p className="text-muted text-sm leading-relaxed font-sans">
              Explorations into WebGL shaders, procedural audio synthesis, physics-driven particle fields, and human-computer interactions.
            </p>
            <div className="p-4 rounded bg-white/[0.02] border border-white/10 font-mono text-xs text-muted flex items-center gap-3">
              <Radio className="w-4 h-4 text-coreCyan animate-pulse" />
              <span>CURRENT SYSTEM: LIVE 3D DIGITAL CORE ENGINE ACTIVE</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <div className="font-mono text-xs text-coreCyan tracking-[0.3em] uppercase">
              // 04 DIRECT TRANSMISSION
            </div>
            <h2 className="font-grotesk font-light text-4xl text-white">
              Get in Touch
            </h2>
            <p className="text-muted text-sm leading-relaxed font-sans">
              Direct inquiries for high-impact software engineering, freelance collaborations, or product builds.
            </p>
            <div className="p-6 rounded bg-white/[0.02] border border-white/10 space-y-4">
              <div className="font-mono text-xs text-muted">DIRECT EMAIL</div>
              <div className="font-mono text-lg text-white font-medium">yloludovice709@gmail.com</div>
              <a
                href="mailto:yloludovice709@gmail.com"
                className="inline-block px-4 py-2 rounded bg-white text-black font-mono text-xs font-semibold hover:bg-coreCyan transition-colors"
              >
                TRANSMIT MESSAGE →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
