import Link from "next/link";
import { footerLinks, socialLinks } from "@/lib/content";
import { getWhatsAppNumber } from "@/lib/site";
import DopplerMark from "./DopplerMark";
import WhatsAppLink from "./WhatsAppLink";

export default function Footer({ basePath = "" }: { basePath?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/40 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <span className="flex items-center gap-2 text-lg font-bold text-foreground">
          <DopplerMark size={26} />
          Doppler
        </span>
        <nav className="flex gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href.startsWith("#") ? `${basePath}${link.href}` : link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <WhatsAppLink
            number={getWhatsAppNumber()}
            label="WhatsApp"
            className="text-sm text-muted transition-colors hover:text-foreground"
          />
        </nav>
        <p className="text-sm text-muted">
          © {year} Doppler. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
