"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleSound: () => void;
  playHoverSound: () => void;
  playCoreReactSound: (intensity?: number) => void;
  playTransitionSound: () => void;
  playPowerUpSound: () => void;
  playSelectSound: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  toggleSound: () => {},
  playHoverSound: () => {},
  playCoreReactSound: () => {},
  playTransitionSound: () => {},
  playPowerUpSound: () => {},
  playSelectSound: () => {},
});

export const useSound = () => useContext(SoundContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  // HTML5 Audio elements for the authentic Joshua Fields sound files
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  // Procedural Web Audio API synthesizer for micro-chimes & sweeps
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize Audio & Autoplay
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Ambient track: Harmonious_Visit.mp3 (loop: true, volume: 0.3)
      const ambient = new Audio("/sounds/Harmonious_Visit.mp3");
      ambient.loop = true;
      ambient.volume = 0.3;
      ambientAudioRef.current = ambient;

      // 2. Select/Click track: Select.mp3 (volume: 0.3)
      const click = new Audio("/sounds/Select.mp3");
      click.volume = 0.3;
      clickAudioRef.current = click;

      // Autoplay ambient sound
      const playPromise = ambient.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks immediate autoplay, unlock on first user gesture
          const unlockAudio = () => {
            if (ambientAudioRef.current) {
              ambientAudioRef.current.play().catch(() => {});
            }
            window.removeEventListener("pointerdown", unlockAudio);
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
          };

          window.addEventListener("pointerdown", unlockAudio, { once: true });
          window.addEventListener("click", unlockAudio, { once: true });
          window.addEventListener("keydown", unlockAudio, { once: true });
          window.addEventListener("touchstart", unlockAudio, { once: true });
        });
      }
    } catch (e) {
      console.warn("Audio initialization caught:", e);
    }

    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.src = "";
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const initWebAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;
      } catch (err) {
        console.warn("Web Audio API not supported:", err);
      }
    }
  }, []);

  // Play click / select sound (Select.mp3)
  const playSelectSound = useCallback(() => {
    if (isMuted) return;
    if (clickAudioRef.current) {
      try {
        // Clone or reset to allow rapid re-triggering on fast hover/clicks
        const sound = clickAudioRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.3;
        sound.play().catch(() => {});
      } catch {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  // Hover sound - uses Select.mp3
  const playHoverSound = useCallback(() => {
    playSelectSound();
  }, [playSelectSound]);

  // Toggle Mute / Sound On-Off
  const toggleSound = useCallback(() => {
    initWebAudio();

    if (isMuted) {
      // Unmute: play ambient track (Harmonious_Visit.mp3)
      setIsMuted(false);

      if (ambientAudioRef.current) {
        ambientAudioRef.current.currentTime = 0;
        ambientAudioRef.current.volume = 0;
        const playPromise = ambientAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Smooth fade in volume to 0.3
            let vol = 0;
            const fadeInterval = setInterval(() => {
              if (!ambientAudioRef.current) {
                clearInterval(fadeInterval);
                return;
              }
              vol = Math.min(0.3, vol + 0.03);
              ambientAudioRef.current.volume = vol;
              if (vol >= 0.3) clearInterval(fadeInterval);
            }, 60);
          }).catch((err) => {
            if (err?.name !== "AbortError") {
              console.warn("Ambient playback blocked or waiting for user interaction:", err);
            }
          });
        }
      }

      // Play selection confirmation sound
      setTimeout(() => {
        if (clickAudioRef.current) {
          clickAudioRef.current.currentTime = 0;
          clickAudioRef.current.play().catch(() => {});
        }
      }, 50);

    } else {
      // Mute: fade out ambient track
      setIsMuted(true);

      if (ambientAudioRef.current) {
        let vol = ambientAudioRef.current.volume;
        const fadeInterval = setInterval(() => {
          if (!ambientAudioRef.current) {
            clearInterval(fadeInterval);
            return;
          }
          vol = Math.max(0, vol - 0.08);
          ambientAudioRef.current.volume = vol;
          if (vol <= 0) {
            clearInterval(fadeInterval);
            ambientAudioRef.current.pause();
          }
        }, 40);
      }
    }
  }, [isMuted, initWebAudio]);

  // Core reaction sound
  const playCoreReactSound = useCallback((intensity = 1) => {
    if (isMuted || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(380, now);
    filter.frequency.linearRampToValueAtTime(580 * intensity, now + 0.2);
    filter.Q.setValueAtTime(3.5, now);

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.2);

    gain.gain.setValueAtTime(0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 0.24);
  }, [isMuted]);

  // Transition to WORK sound (Select.mp3 feedback only, no Loading.wav)
  const playTransitionSound = useCallback(() => {
    if (isMuted) return;

    // Play Select.mp3 immediately for click feedback
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  // Power-up boot sound
  const playPowerUpSound = useCallback(() => {
    if (isMuted) return;
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleSound,
        playHoverSound,
        playCoreReactSound,
        playTransitionSound,
        playPowerUpSound,
        playSelectSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const SoundToggle: React.FC = () => {
  const { isMuted, toggleSound } = useSound();

  return (
    <button
      onClick={toggleSound}
      type="button"
      className="group relative flex items-center justify-center p-1.5 active:scale-90 transition-transform focus:outline-none cursor-pointer"
      aria-label={isMuted ? "Enable Sound" : "Mute Sound"}
      title={isMuted ? "Enable Audio" : "Mute Audio"}
    >
      {/* 4 Animated Equalizer Audio Bars */}
      <div className="flex items-end justify-center gap-[3px] h-[16px] w-[16px]">
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? "h-[3px] bg-white/40 group-hover:bg-white/80"
              : "bg-coreCyan shadow-[0_0_8px_#4DF2FF] animate-eq-1"
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? "h-[3px] bg-white/40 group-hover:bg-white/80"
              : "bg-coreCyan shadow-[0_0_8px_#4DF2FF] animate-eq-2"
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? "h-[3px] bg-white/40 group-hover:bg-white/80"
              : "bg-coreCyan shadow-[0_0_8px_#4DF2FF] animate-eq-3"
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? "h-[3px] bg-white/40 group-hover:bg-white/80"
              : "bg-coreCyan shadow-[0_0_8px_#4DF2FF] animate-eq-4"
          }`}
        />
      </div>
    </button>
  );
};
