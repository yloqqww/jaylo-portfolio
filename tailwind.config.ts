import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#030303",
        surface: "#0a0a0a",
        surfaceElevated: "#121212",
        line: "rgba(255, 255, 255, 0.08)",
        lineHighlight: "rgba(255, 255, 255, 0.18)",
        coreCyan: "#4DF2FF",
        coreBlue: "#1C88FF",
        coreGlow: "rgba(77, 242, 255, 0.35)",
        muted: "#7A7A7A",
        typography: "#EDEDED",
        accentWhite: "#FFFFFF"
      },
      fontFamily: {
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        'super-wide': '0.35em',
        'mega-wide': '0.55em',
      },
    },
  },
  plugins: [],
};
export default config;
