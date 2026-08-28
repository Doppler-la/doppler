import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#12121A",
        primary: "#4F46E5",
        accent: "#7C3AED",
        foreground: "#F5F5F4",
        muted: "#A1A1AA",
        danger: "#F87171",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
