"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Code2, 
  Video, 
  Share2, 
  Palette,
  Copy,
  Check,
  GraduationCap,
  Heart,
  ArrowUpRight,
  Database,
  Bot,
  Smartphone,
  Wrench,
  Server,
  ShieldCheck,
  CreditCard,
  Radio,
  Briefcase,
  Terminal,
  Cloud,
  Layers,
  Cpu
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SectionHeader } from "@/components/SectionHeader";
import { useSound } from "@/components/SoundController";
import { HireModal } from "@/components/HireModal";

export default function InfoPage() {
  const { playHoverSound, playSelectSound } = useSound();
  const [isHireOpen, setIsHireOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Lock window scroll and Lenis when hire modal is open
  useEffect(() => {
    if (isHireOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
        (window as any).lenis.resize();
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
        (window as any).lenis.resize();
      }
    };
  }, [isHireOpen]);

  const handleCopy = (text: string, fieldName: string) => {
    playSelectSound();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Specific, focused technical skills grouped into 6 core pillars
  const skillGroups = [
    {
      id: "WEB",
      title: "Programming & Web",
      icon: Code2,
      skills: [
        "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", 
        "Node.js", "Express.js", "PHP", "Laravel", "Python", "C#", "Tailwind CSS"
      ]
    },
    {
      id: "DATABASE",
      title: "Databases & Backend",
      icon: Database,
      skills: [
        "PostgreSQL", "MySQL", "Supabase", "Prisma ORM", 
        "Firebase", "Redis", "REST APIs", "Socket.IO"
      ]
    },
    {
      id: "AI_PAYMENTS",
      title: "AI & Integrations",
      icon: Bot,
      skills: [
        "OpenAI API", "ChatGPT", "Claude Code", "Gemini", "Antigravity", 
        "Amazon Q", "Groq AI", "Codex", "Kiro", "Cursor AI", 
        "LLaMA", "Stripe Payments", "Twilio", "Xero API", "QuickBooks API"
      ]
    },
    {
      id: "MOBILE",
      title: "Mobile Development",
      icon: Smartphone,
      skills: [
        "Flutter", "Dart", "React Native", "Android Studio"
      ]
    },
    {
      id: "DEVOPS",
      title: "DevOps & Tools",
      icon: Cloud,
      skills: [
        "Docker", "Docker Compose", "Git", "GitHub", "Vercel", 
        "Netlify", "Railway", "Render", "Postman", "Cloud Deployment"
      ]
    },
    {
      id: "CREATIVE",
      title: "Creative & CMS",
      icon: Palette,
      skills: [
        "Figma", "Adobe Photoshop", "Adobe Premiere Pro", "Canva", 
        "CapCut", "WordPress", "Wix", "Squarespace", "UI/UX Design"
      ]
    }
  ];

  const filterTabs = [
    { id: "ALL", label: `All Skills (${skillGroups.length} Pillars)` },
    { id: "WEB", label: "Programming & Web" },
    { id: "DATABASE", label: "Databases & Backend" },
    { id: "AI_PAYMENTS", label: "AI & Integrations" },
    { id: "MOBILE", label: "Mobile Dev" },
    { id: "DEVOPS", label: "DevOps & Tools" },
    { id: "CREATIVE", label: "Creative & CMS" },
  ];

  const filteredGroups = skillGroups.filter((group) => {
    if (activeCategory === "ALL") return true;
    return group.id === activeCategory;
  });

  const services = [
    {
      title: "Full Stack & Web Application Development",
      icon: Code2,
      desc: "Building fast, reliable, and secure web applications using Next.js, React, TypeScript, Node.js, Express, and PostgreSQL."
    },
    {
      title: "Mobile App Development",
      icon: Smartphone,
      desc: "Creating cross-platform mobile apps for iOS and Android using Flutter, Dart, and React Native with clean user experiences."
    },
    {
      title: "UI/UX & Graphic Design",
      icon: Palette,
      desc: "Designing user-friendly web and mobile interfaces in Figma, plus high-converting marketing visuals, posters, and brand identities in Photoshop."
    },
    {
      title: "Video Editing & Social Media Management",
      icon: Video,
      desc: "Editing dynamic short-form videos, reels, and commercial videos in Premiere Pro and CapCut, combined with AI-assisted scheduling using Blotato AI."
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white overflow-x-clip selection:bg-coreCyan/30 selection:text-white page-transition-enter">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-atmospheric pointer-events-none opacity-40" />
      <div className="fixed inset-0 bg-digital-grid pointer-events-none opacity-15" />
      <div className="fixed -bottom-28 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <Navigation />

      {/* Outline Watermark Header */}
      <SectionHeader
        watermark="INFO"
        className="pt-20 sm:pt-28 md:pt-32 pb-4 sm:pb-6"
        subtitle="ABOUT ME, TECHNICAL STACK, SERVICES, CONTACT"
        description="Learn more about my educational background, complete technical capabilities, backend systems, creative services, and direct inquiry channels."
      />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24 space-y-14 sm:space-y-18">
        
        {/* ========================================================================= */}
        {/* 1. ABOUT ME (CLEAN EDITORIAL PROFILE CARD)                                */}
        {/* ========================================================================= */}
        <section className="relative p-6 sm:p-10 rounded-3xl bg-[#090c15]/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Authentic Portrait */}
            <div className="lg:col-span-5 relative w-full max-w-xs sm:max-w-sm mx-auto">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#070912]">
                <Image
                  src="/last.png"
                  alt="Jaylo Ludovice"
                  fill
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 font-mono text-xs">
                  <span className="text-zinc-400">Location</span>
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coreCyan" />
                    Laguna, Philippines
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Bio & Background in Plain English */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div>
                <span className="font-mono text-xs tracking-widest text-coreCyan uppercase font-semibold">
                  About Me
                </span>
                <h1 className="font-grotesk text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase mt-1">
                  Jaylo Ludovice
                </h1>
                <p className="font-mono text-xs sm:text-sm text-sky-400 mt-1.5 font-medium">
                  Full Stack Developer, Software Engineer in Training, UI/UX Designer, Video Editor
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-3.5 font-sans text-sm sm:text-base text-zinc-200 leading-relaxed">
                <p>
                  Hi, I am Jaylo Ludovice. I graduated with a Bachelor of Science in Information Technology, major in Web and Mobile Application Development.
                </p>
                <p>
                  I build web and mobile applications, manage social media accounts, design brand identities, and edit long-form and short-form videos. I have hands-on experience building multi-tenant SaaS systems, real-time dashboards, Stripe payment integrations, and automated AI workflows.
                </p>
                <p>
                  I am continuously practicing, building, and studying every single day to grow into an exceptional Software Engineer and Full Stack Developer.
                </p>
                <p className="text-zinc-300 flex items-center gap-2 pt-1 font-sans text-sm">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Outside of coding and designing, I love playing basketball and volleyball.</span>
                </p>
              </div>

              {/* Key Quick Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 font-mono text-xs text-zinc-200">
                  <GraduationCap className="w-4 h-4 text-coreCyan" />
                  <span>BSIT, Major in Web & Mobile App Dev</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for Full-time Roles & Contracts</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsHireOpen(true);
                  }}
                  onMouseEnter={() => playHoverSound()}
                  className="px-6 py-3 rounded-xl bg-white text-black font-mono text-xs tracking-wider uppercase font-semibold hover:bg-coreCyan hover:text-black transition-all shadow-md cursor-pointer"
                >
                  Hire Me / Inquire
                </button>

                <a
                  href="/resume.pdf"
                  download="JAYLO_LUDOVICE_RESUME.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSelectSound()}
                  onMouseEnter={() => playHoverSound()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/20 text-white font-mono text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-coreCyan" />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COMPLETE TECHNICAL STACK & TOOLS (ORGANIZED, CLEAN, NO PERCENTAGES)    */}
        {/* ========================================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-white/15 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs tracking-widest text-coreCyan uppercase font-semibold">
                Complete Technical Stack
              </span>
              <h2 className="font-grotesk text-2xl sm:text-3xl text-white font-bold uppercase mt-1">
                Skills, Architecture & Tools
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-1">
                Full-stack languages, backend frameworks, database systems, background processing, security, payments, and creative software.
              </p>
            </div>

            <span className="font-mono text-xs text-coreCyan border border-coreCyan/30 bg-coreCyan/10 px-3 py-1 rounded-full shrink-0">
              {skillGroups.length} CORE PILLARS
            </span>
          </div>

          {/* Quick Filter Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setActiveCategory(tab.id);
                }}
                onMouseEnter={() => playHoverSound()}
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? "bg-coreCyan text-black border-coreCyan font-semibold shadow-[0_0_12px_rgba(77,242,255,0.35)]"
                    : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Clean Skills Cards Grid (2 rows of 3 on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#090c15]/90 border border-white/15 hover:border-coreCyan/50 transition-all duration-300 shadow-lg flex flex-col space-y-4 text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-coreCyan/10 border border-coreCyan/30 flex items-center justify-center text-coreCyan shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-grotesk text-lg sm:text-xl font-bold text-white tracking-wide">
                        {group.title}
                      </h3>
                    </div>

                    <span className="font-mono text-[10px] text-zinc-500 border border-white/10 px-2 py-0.5 rounded">
                      {group.skills.length} items
                    </span>
                  </div>

                  {/* Clean Tags for Skills - Sits right below the header without awkward gap */}
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-coreCyan/40 text-xs sm:text-sm font-mono text-zinc-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. WHAT I DO / SERVICES (CLEAN 4 CARDS)                                   */}
        {/* ========================================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-white/15 pb-4">
            <span className="font-mono text-xs tracking-widest text-coreCyan uppercase font-semibold">
              Services
            </span>
            <h2 className="font-grotesk text-2xl sm:text-3xl text-white font-bold uppercase mt-1">
              What I Can Deliver For You
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#090c15]/90 border border-white/15 hover:border-white/30 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-coreCyan">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-grotesk text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CONTACT & GET IN TOUCH                                                 */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#090c15]/90 border border-white/15 text-center space-y-6 shadow-xl">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-widest text-coreCyan uppercase font-semibold">
              Get In Touch
            </span>
            <h2 className="font-grotesk text-2xl sm:text-4xl text-white font-bold uppercase">
              Let&apos;s Work Together
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm max-w-lg mx-auto font-sans leading-relaxed">
              Feel free to send an email, give me a call, or fill out the inquiry form. I am always open to new software engineering projects, roles, and collaborations.
            </p>
          </div>

          {/* Quick Copy Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs sm:text-sm">
            
            {/* Email Box */}
            <div className="flex items-center rounded-xl bg-white/[0.05] border border-white/15 hover:border-coreCyan transition-all overflow-hidden">
              <a
                href="mailto:ludoviceylo26@gmail.com"
                onClick={() => playSelectSound()}
                className="px-4 py-3 text-white hover:text-coreCyan transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-coreCyan" />
                <span>ludoviceylo26@gmail.com</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy("ludoviceylo26@gmail.com", "email")}
                title="Copy Email"
                className="px-3 py-3 border-l border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedField === "email" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone Box */}
            <div className="flex items-center rounded-xl bg-white/[0.05] border border-white/15 hover:border-coreCyan transition-all overflow-hidden">
              <a
                href="tel:+639817529936"
                onClick={() => playSelectSound()}
                className="px-4 py-3 text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+63 981 752 9936</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy("+639817529936", "phone")}
                title="Copy Phone"
                className="px-3 py-3 border-l border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedField === "phone" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setIsHireOpen(true);
              }}
              onMouseEnter={() => playHoverSound()}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-coreCyan hover:text-black transition-all shadow-md cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <span>Open Inquiry Form</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {copiedField && (
            <p className="font-mono text-xs text-emerald-400 animate-fadeIn">
              ✓ Copied {copiedField} to clipboard
            </p>
          )}
        </section>

      </main>

      {/* Hire Modal */}
      <HireModal
        isOpen={isHireOpen}
        onClose={() => setIsHireOpen(false)}
      />
    </div>
  );
}
