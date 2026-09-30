import type { Metadata } from "next";
import "@/lib/r3f-polyfill";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JAYLO LUDOVICE — Full Stack Development | UI/UX & Graphic Design | Social Media Management | Video Editing",
  description: "Official interactive portfolio of Jaylo Ludovice. Full Stack Development, UI/UX & Graphic Design, Social Media Management, and Video Editing.",
  icons: {
    icon: "/beymax.jpeg",
  },
};

import { SoundProvider } from "@/components/SoundController";
import { BackgroundProvider } from "@/components/BackgroundContext";
import { GlobalBackground3D } from "@/components/GlobalBackground3D";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";
import { BackToTop } from "@/components/BackToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-canvas text-typography antialiased selection:bg-coreCyan/30 selection:text-white"
        suppressHydrationWarning
      >
        <SoundProvider>
          <BackgroundProvider>
            <SmoothScroll>
              {/* Global Persistent 3D WebGL Background (Never unmounts across routes) */}
              <GlobalBackground3D />
              <PageTransition>
                {children}
              </PageTransition>
              {/* Global Floating Back To Top button (Web & Mobile responsive) */}
              <BackToTop />
            </SmoothScroll>
          </BackgroundProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
