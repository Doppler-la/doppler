import Link from "next/link";
import { navLinks } from "@/lib/content";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/40 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-foreground">Doppler</span>
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
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent/80"
        >
          Hablemos
        </Link>
      </div>
    </header>
  );
}
