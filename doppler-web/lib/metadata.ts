import type { Metadata } from "next";

type SocialInput = { title: string; description: string; path: string };

// Next reemplaza (no mezcla) los objetos openGraph/twitter del layout cuando una página define los suyos,
// así que cada página tiene que declararlos completos. Este helper mantiene los campos comunes en un solo lugar.
export function socialMetadata({ title, description, path }: SocialInput): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: "Doppler",
      title,
      description,
      url: path,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Doppler" }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@dopplerla",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
