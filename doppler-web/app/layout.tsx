import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const title = "Doppler — Software Factory para Startups, Pymes y Empresas";
const description =
  "Desarrollo de software e IA para automatizaciones que generan resultados. Trabajamos con startups, pymes y empresas.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.doppler.la"),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Doppler",
    title,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Doppler" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
