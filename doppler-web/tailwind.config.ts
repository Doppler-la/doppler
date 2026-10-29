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
        // Variante clara del acento para texto pequeño: #7C3AED sobre el fondo da 3,5:1 y el mínimo WCAG AA es 4,5:1.
        "accent-soft": "#A78BFA",
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
