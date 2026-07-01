import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doppler — Software Factory para Startups, Pymes y Empresas",
  description:
    "Desarrollo de software e IA para automatizaciones que generan resultados. Trabajamos con startups, pymes y empresas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
