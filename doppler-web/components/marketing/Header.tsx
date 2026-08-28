import Link from "next/link";
import { navLinks } from "@/lib/content";
import DopplerMark from "./DopplerMark";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#" aria-label="Doppler" className="flex items-center gap-2">
          <DopplerMark />
          <span className="text-gradient text-xl font-bold tracking-tight">doppler</span>
        </Link>
        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="#contacto"
          className="bg-brand-gradient rounded-md px-4 py-2 text-sm font-semibold text-foreground shadow-md shadow-accent/30 transition-opacity hover:opacity-90"
        >
          Hablemos
        </Link>
      </div>
    </header>
  );
}
