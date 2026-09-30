"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Send, CheckCircle2, Download, Sparkles } from "lucide-react";
import { useSound } from "./SoundController";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HireModal: React.FC<HireModalProps> = ({ isOpen, onClose }) => {
  const { playSelectSound, playHoverSound } = useSound();
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Client-side portal mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle smooth entrance and exit animations
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setIsRendered(true);
      // Small frame delay to trigger CSS transition
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 20);
    } else {
      setIsVisible(false);
      // Wait for exit transition before unmounting from DOM
      timer = setTimeout(() => {
        setIsRendered(false);
        setIsSubmitted(false);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Lock background scroll (both documentElement & body) and stop Lenis while modal is open
  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.start();
          (window as any).lenis.resize();
        }
      };
    }
  }, [isOpen]);

  // Escape key handler to close smoothly
  const handleClose = useCallback(() => {
    playSelectSound();
    onClose();
  }, [onClose, playSelectSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSelectSound();
    setIsSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 2800);
  };

  if (!mounted || !isRendered) return null;

  return createPortal(
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 overscroll-contain transition-all duration-300 ease-out select-none ${
        isVisible
          ? "bg-black/85 backdrop-blur-xl opacity-100 pointer-events-auto"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
    >
      {/* Click outside to close backdrop */}
      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={handleClose}
        aria-label="Close modal background"
      />

      {/* Perfectly Centered Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-modal-title"
        className={`relative z-10 w-full max-w-[760px] my-auto bg-[#09090f]/95 border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-9 md:p-11 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-h-[92vh] flex flex-col overflow-y-auto overflow-x-hidden modal-scroll-clean transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6"
        }`}
      >
        {/* Glow ambient background accents */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-coreCyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-5 sm:pb-6 gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
              </span>
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.22em] text-emerald-400 uppercase font-semibold">
                AVAILABLE FOR NEW PROJECTS & COLLABORATIONS
              </span>
            </div>

            <h2
              id="hire-modal-title"
              className="font-grotesk text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-wide uppercase"
            >
              LET&apos;S WORK TOGETHER
            </h2>
            <p className="text-zinc-400 font-sans text-xs sm:text-sm font-light leading-relaxed max-w-xl">
              Have an upcoming project, an idea you want to bring to life, or just want to connect? Send a note below and let&apos;s start a conversation.
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            onMouseEnter={() => playHoverSound()}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body / Content */}
        {isSubmitted ? (
          <div className="relative z-10 py-14 sm:py-20 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>
            <h3 className="font-grotesk text-2xl sm:text-3xl text-white font-light tracking-wide uppercase">
              MESSAGE SENT!
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-300 max-w-md leading-relaxed">
              Thank you for reaching out! Jaylo has received your note and will get back to you within 24 hours.
            </p>
            <span className="font-mono text-xs tracking-widest text-coreCyan pt-2">
              AUTO-CLOSING WINDOW...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 mt-6 sm:mt-7 space-y-5 sm:space-y-6">
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2 text-left">
                <label className="block font-mono text-xs sm:text-[13px] tracking-widest text-zinc-300 uppercase font-semibold">
                  YOUR NAME <span className="text-coreCyan">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Vance"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-sm sm:text-base placeholder:text-zinc-600 focus:outline-none focus:border-coreCyan focus:ring-2 focus:ring-coreCyan/20 transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="block font-mono text-xs sm:text-[13px] tracking-widest text-zinc-300 uppercase font-semibold">
                  EMAIL ADDRESS <span className="text-coreCyan">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-sm sm:text-base placeholder:text-zinc-600 focus:outline-none focus:border-coreCyan focus:ring-2 focus:ring-coreCyan/20 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Row 2: Message Textarea */}
            <div className="space-y-2 text-left">
              <label className="block font-mono text-xs sm:text-[13px] tracking-widest text-zinc-300 uppercase font-semibold">
                YOUR MESSAGE / HOW CAN I HELP? <span className="text-coreCyan">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me a bit about what you have in mind, any questions you have, or what you'd like to build..."
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-sm sm:text-base placeholder:text-zinc-600 focus:outline-none focus:border-coreCyan focus:ring-2 focus:ring-coreCyan/20 transition-all resize-none shadow-inner leading-relaxed"
              />
            </div>

            {/* Footer Actions & Resume Link */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <a
                href="/resume.pdf"
                download="JAYLO_LUDOVICE_RESUME.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => playHoverSound()}
                onClick={() => playSelectSound()}
                className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm tracking-wider text-zinc-400 hover:text-coreCyan transition-colors py-2"
              >
                <Download className="w-4 h-4 text-coreCyan" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="hidden sm:inline-flex px-5 py-3.5 rounded-xl border border-white/15 text-zinc-400 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  onMouseEnter={() => playHoverSound()}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-coreCyan text-black font-mono text-xs sm:text-sm tracking-[0.2em] font-bold uppercase hover:bg-white hover:shadow-[0_0_30px_rgba(77,242,255,0.4)] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-95"
                >
                  <span>SEND MESSAGE</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

