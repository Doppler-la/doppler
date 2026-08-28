import Link from "next/link";
import { footerLinks } from "@/lib/content";
import DopplerMark from "./DopplerMark";

export default function Footer() {
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
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted">
          © {year} Doppler. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
