import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#111813",
        primary: "#0F3D2E",
        accent: "#1E7A4C",
        foreground: "#F5F5F4",
        muted: "#A1A1AA",
      },
    },
  },
  plugins: [],
};

export default config;
