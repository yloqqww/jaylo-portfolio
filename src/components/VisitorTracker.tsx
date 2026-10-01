"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const VisitorTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Only track in production browser environment
    if (typeof window === "undefined") return;

    // Filter out automated bots, crawlers, and headless testing tools
    if (
      (typeof navigator !== "undefined" && navigator.webdriver) ||
      /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|whatsapp|discordbot/i.test(navigator.userAgent || "")
    ) {
      return;
    }

    // Prevent spamming Discord within the same session
    const sessionKey = "jl_session_telemetry_sent";
    const alreadySent = sessionStorage.getItem(sessionKey);
    if (alreadySent) return;

    // Small delay so initial 3D rendering and page hydration happen with 0 interference
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(sessionKey, "true");

        const payload = {
          path: pathname || window.location.pathname || "/",
          referrer: document.referrer || "Direct Visit / Bookmark",
          screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
        };

        const jsonString = JSON.stringify(payload);

        // Use modern sendBeacon if available, fallback to fetch with keepalive
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          const blob = new Blob([jsonString], { type: "application/json" });
          navigator.sendBeacon("/api/track-visitor", blob);
        } else {
          fetch("/api/track-visitor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonString,
            keepalive: true,
          }).catch(() => {
            // Silently ignore network failures
          });
        }
      } catch {
        // Silently ignore storage or beacon errors
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};
