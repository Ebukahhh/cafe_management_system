import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-espresso": "#1A1208",
        "warm-amber": "#C8864A",
        primary: "#C8864A",
        "primary-container": "#8B5E35",
        "secondary-container": "#2C1F14",
        surface: "#1A1208",
        "surface-container-lowest": "#120D05",
        "surface-container-low": "#1F160A",
        "surface-container": "#261A0D",
        "surface-container-high": "#2E2010",
        "surface-container-highest": "#362514",
        "surface-bright": "#3D2A16",
        "surface-variant": "#4A3728",
        "outline-variant": "#6B5343",
        "on-surface": "#F5ECD7",
        "on-primary": "#FFFFFF",
      },
      fontFamily: {
        headline: ["var(--font-fraunces)", "Fraunces", "serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        label: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["Berkeley Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "24px",
        "2xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
