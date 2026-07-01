# Doppler Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Doppler marketing landing page (single page `/`) in Next.js, per `docs/superpowers/specs/2026-07-01-doppler-landing-design.md`.

**Architecture:** Next.js 14 App Router project with a `(marketing)` route group holding the landing page and its layout, a `components/marketing/` folder of presentational section components, a centralized `lib/content.ts` for all copy, and an `app/api/contact/route.ts` handler for the contact form. Vitest + React Testing Library provide the test cycle for logic-bearing pieces (content shape, the API route, and the interactive FAQ/ContactForm components); purely static sections get a lightweight render/content-presence test.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS 3, lucide-react, Vitest, @testing-library/react, jsdom.

## Global Constraints

- Next.js 14+, App Router only (no Pages Router).
- TypeScript throughout — no `.js`/`.jsx` files.
- Tailwind CSS 3.x with a classic `tailwind.config.ts` (not Tailwind v4 CSS-config) so the color tokens table below is a plain JS object.
- No CMS, no database. All copy lives in `lib/content.ts`.
- No animation library (framer-motion excluded). Only Tailwind CSS transitions.
- Font: Geist (Next.js default via `next/font/google` or the built-in `geist` package from `create-next-app`).
- Color tokens (Tailwind `theme.extend.colors`):
  - `background: #0A0A0A`
  - `surface: #111813`
  - `primary: #0F3D2E`
  - `accent: #1E7A4C`
  - `foreground: #F5F5F4`
  - `muted: #A1A1AA`
- Placeholder content (logos, metrics, testimonials) must be visually distinguishable (reduced opacity / "Logo" label / explicit TODO comment in `lib/content.ts`) — never indistinguishable from real data.
- Site is Spanish-only, dark-mode-only (no light theme, no i18n).
- Out of scope: `/admin`, blog, team section, real email delivery, `/ia-para-empresas` standalone page.

---

## File Structure

```
doppler-web/
  app/
    layout.tsx                       # root layout: html/body, font, metadata
    globals.css                      # tailwind directives + base styles
    (marketing)/
      layout.tsx                     # wraps children with Header + Footer
      page.tsx                       # assembles all sections in order
    api/
      contact/
        route.ts                     # POST handler
        route.test.ts                # vitest test for the handler
  components/
    marketing/
      Header.tsx
      Header.test.tsx
      Hero.tsx
      Hero.test.tsx
      ClientLogos.tsx
      ClientLogos.test.tsx
      Services.tsx
      Services.test.tsx
      AiSection.tsx
      AiSection.test.tsx
      Metrics.tsx
      Metrics.test.tsx
      Testimonials.tsx
      Testimonials.test.tsx
      FAQ.tsx
      FAQ.test.tsx
      FinalCTA.tsx
      FinalCTA.test.tsx
      ContactForm.tsx
      ContactForm.test.tsx
      Footer.tsx
      Footer.test.tsx
  lib/
    content.ts
  tailwind.config.ts
  vitest.config.ts
  vitest.setup.ts
  package.json
  tsconfig.json
```

---

### Task 1: Initialize the Next.js project and git repository

**Files:**
- Create: entire `doppler-web/` project (via `create-next-app`)
- Create: `docs/superpowers/` (already exists, will be copied/kept at repo root)

**Interfaces:**
- Produces: a working Next.js 14 TypeScript + Tailwind project at `/Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web`, with git initialized at the repo root (`/Users/ignacioirigoitia/Desktop/DOPPLER`).

- [ ] **Step 1: Initialize git at the repo root**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git init
```

Expected: `Initialized empty Git repository in /Users/ignacioirigoitia/Desktop/DOPPLER/.git/`

- [ ] **Step 2: Scaffold the Next.js app**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
npx create-next-app@14 doppler-web \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias "@/*" --use-npm
```

When prompted, accept defaults (Turbopack not required; if asked, answer "No" to keep webpack default for Next 14).

Expected: a `doppler-web/` folder created with `app/`, `package.json`, `tailwind.config.ts`, `tsconfig.json`.

- [ ] **Step 3: Verify the default app boots**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm run build
```

Expected: build completes with `Compiled successfully`.

- [ ] **Step 4: Commit the scaffold**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web docs
git commit -m "chore: scaffold Next.js 14 app with TypeScript and Tailwind"
```

---

### Task 2: Configure Tailwind design tokens and global styles

**Files:**
- Modify: `doppler-web/tailwind.config.ts`
- Modify: `doppler-web/app/globals.css`

**Interfaces:**
- Consumes: nothing (pure config).
- Produces: Tailwind utility classes `bg-background`, `bg-surface`, `bg-primary`, `bg-accent`, `text-foreground`, `text-muted` (and their `text-`/`border-`/`from-`/`to-` variants) usable by every later component task.

- [ ] **Step 1: Replace `tailwind.config.ts` content**

```ts
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
```

- [ ] **Step 2: Replace `app/globals.css` content**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0A0A0A;
  color: #F5F5F4;
}
```

- [ ] **Step 3: Verify the build still passes**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm run build
```

Expected: `Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add doppler-web/tailwind.config.ts doppler-web/app/globals.css
git commit -m "feat: configure Doppler dark green/black color tokens"
```

---

### Task 3: Set up Vitest + React Testing Library

**Files:**
- Modify: `doppler-web/package.json` (devDependencies + `test` script)
- Create: `doppler-web/vitest.config.ts`
- Create: `doppler-web/vitest.setup.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest once; every later `*.test.tsx`/`*.test.ts` file in this plan relies on this config existing.

- [ ] **Step 1: Install test dependencies**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Add the `test` script to `package.json`**

In `doppler-web/package.json`, inside `"scripts"`, add:

```json
"test": "vitest run"
```

- [ ] **Step 5: Add a throwaway smoke test to confirm the harness works**

Create `doppler-web/lib/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("vitest harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run:

```bash
npm test
```

Expected: `1 passed`.

- [ ] **Step 6: Delete the smoke test**

```bash
rm /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web/lib/smoke.test.ts
```

- [ ] **Step 7: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/package.json doppler-web/package-lock.json doppler-web/vitest.config.ts doppler-web/vitest.setup.ts
git commit -m "chore: add Vitest + React Testing Library test harness"
```

---

### Task 4: Content module (`lib/content.ts`)

**Files:**
- Create: `doppler-web/lib/content.ts`
- Create: `doppler-web/lib/content.test.ts`

**Interfaces:**
- Produces: typed exports `navLinks`, `heroContent`, `clientLogos`, `services`, `aiSection`, `metrics`, `testimonials`, `faqItems`, `footerLinks` — every component task below imports from this module using these exact names.

- [ ] **Step 1: Write the failing test**

Create `doppler-web/lib/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  navLinks,
  heroContent,
  clientLogos,
  services,
  aiSection,
  metrics,
  testimonials,
  faqItems,
  footerLinks,
} from "./content";

describe("content", () => {
  it("has 4 nav links", () => {
    expect(navLinks).toHaveLength(4);
  });

  it("has hero headline and CTA", () => {
    expect(heroContent.headline).toContain("Startups, Pymes y Empresas");
    expect(heroContent.ctaLabel).toBe("Hablemos hoy");
  });

  it("has at least 6 placeholder client logos", () => {
    expect(clientLogos.length).toBeGreaterThanOrEqual(6);
  });

  it("has exactly 3 services", () => {
    expect(services).toHaveLength(3);
  });

  it("has 4 AI capabilities and a 4-step methodology", () => {
    expect(aiSection.capabilities).toHaveLength(4);
    expect(aiSection.methodology).toHaveLength(4);
  });

  it("has 3 metrics", () => {
    expect(metrics).toHaveLength(3);
  });

  it("has between 3 and 4 testimonials", () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    expect(testimonials.length).toBeLessThanOrEqual(4);
  });

  it("has 5 FAQ items", () => {
    expect(faqItems).toHaveLength(5);
  });

  it("has footer links", () => {
    expect(footerLinks.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test
```

Expected: FAIL — `Cannot find module './content'`.

- [ ] **Step 3: Create `lib/content.ts`**

```ts
export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "IA para Empresas", href: "#ia" },
  { label: "Nosotros", href: "#clientes" },
  { label: "Contacto", href: "#contacto" },
];

export const heroContent = {
  eyebrow: "Software Factory",
  headline: "Construimos tecnología para Startups, Pymes y Empresas",
  subheadline:
    "Desarrollamos software a medida e impulsamos tu negocio con IA para automatizaciones que generan resultados reales.",
  ctaLabel: "Hablemos hoy",
  ctaHref: "#contacto",
};

export type ClientLogo = { name: string };

// TODO: reemplazar con logos reales de clientes.
export const clientLogos: ClientLogo[] = [
  { name: "Logo" },
  { name: "Logo" },
  { name: "Logo" },
  { name: "Logo" },
  { name: "Logo" },
  { name: "Logo" },
];

export type ServiceItem = {
  icon: "code" | "bot" | "lightbulb";
  title: string;
  description: string;
};

export const services: ServiceItem[] = [
  {
    icon: "code",
    title: "Desarrollo de Software",
    description:
      "Aplicaciones web, mobile y sistemas a medida, construidos con foco en escalabilidad y velocidad de entrega.",
  },
  {
    icon: "bot",
    title: "IA & Automatizaciones",
    description:
      "Diseñamos e implementamos soluciones de inteligencia artificial que automatizan procesos y reducen costos operativos.",
  },
  {
    icon: "lightbulb",
    title: "Consultoría Tech",
    description:
      "Acompañamos decisiones tecnológicas clave: arquitectura, stack, y estrategia digital para crecer con foco.",
  },
];

export type CapabilityItem = {
  icon: "workflow" | "sparkles" | "plug" | "trending-up";
  title: string;
  description: string;
};

export type MethodologyStep = {
  step: number;
  title: string;
  description: string;
};

export const aiSection = {
  headline: "Impulsamos tu negocio con IA que genera resultados",
  subheadline:
    "No vendemos promesas: diseñamos automatizaciones e integraciones de IA medibles, pensadas para el día a día de tu operación.",
  capabilities: [
    {
      icon: "workflow",
      title: "Automatización de procesos",
      description: "Eliminamos tareas manuales repetitivas conectando tus sistemas de punta a punta.",
    },
    {
      icon: "sparkles",
      title: "IA generativa",
      description: "Asistentes y modelos de lenguaje aplicados a tus flujos de trabajo reales.",
    },
    {
      icon: "plug",
      title: "Integraciones a medida",
      description: "Conectamos tus herramientas actuales sin romper lo que ya funciona.",
    },
    {
      icon: "trending-up",
      title: "Análisis predictivo",
      description: "Datos históricos convertidos en decisiones anticipadas para tu negocio.",
    },
  ] as CapabilityItem[],
  methodology: [
    { step: 1, title: "Diagnóstico", description: "Relevamos procesos y detectamos oportunidades de mejora." },
    { step: 2, title: "Diseño", description: "Priorizamos por impacto y esfuerzo, y definimos la solución." },
    { step: 3, title: "Implementación", description: "Desarrollamos e integramos la automatización o modelo." },
    { step: 4, title: "Medición", description: "Medimos resultados reales y ajustamos de forma continua." },
  ] as MethodologyStep[],
};

export type Metric = { value: string; label: string };

// TODO: reemplazar con métricas reales de la empresa.
export const metrics: Metric[] = [
  { value: "+0", label: "Proyectos entregados" },
  { value: "+0", label: "Automatizaciones implementadas" },
  { value: "+0", label: "Clientes activos" },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

// TODO: reemplazar con testimonios reales de clientes.
export const testimonials: Testimonial[] = [
  {
    quote: "Placeholder: entregaron el proyecto a tiempo y con excelente comunicación.",
    author: "Nombre Apellido",
    role: "Cargo",
    company: "Empresa Placeholder",
  },
  {
    quote: "Placeholder: la automatización que implementaron nos ahorró horas de trabajo manual por semana.",
    author: "Nombre Apellido",
    role: "Cargo",
    company: "Empresa Placeholder",
  },
  {
    quote: "Placeholder: equipo muy sólido técnicamente y fácil de coordinar.",
    author: "Nombre Apellido",
    role: "Cargo",
    company: "Empresa Placeholder",
  },
];

export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "¿A qué tipo de clientes atienden?",
    answer: "Trabajamos con startups, pymes y empresas de cualquier industria que necesiten desarrollo de software o automatizaciones con IA.",
  },
  {
    question: "¿Cómo es el proceso de trabajo?",
    answer: "Empezamos con una reunión de diagnóstico, definimos alcance y plan, y trabajamos en ciclos cortos con entregas frecuentes.",
  },
  {
    question: "¿Cuánto tiempo toma un proyecto?",
    answer: "Depende del alcance: un MVP puede tomar semanas, mientras que un proyecto más amplio se planifica en etapas con entregas incrementales.",
  },
  {
    question: "¿Qué los diferencia de otras software factories?",
    answer: "Combinamos desarrollo de software tradicional con foco fuerte en IA aplicada a automatización, con equipos chicos y comunicación directa.",
  },
  {
    question: "¿Cómo arranco un proyecto con Doppler?",
    answer: "Completá el formulario de contacto o escribinos, y coordinamos una primera reunión sin costo para entender tu necesidad.",
  },
];

export const footerLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "IA para Empresas", href: "#ia" },
  { label: "Clientes", href: "#clientes" },
  { label: "Contacto", href: "#contacto" },
];
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npm test
```

Expected: all tests in `lib/content.test.ts` PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/lib/content.ts doppler-web/lib/content.test.ts
git commit -m "feat: add centralized landing content module"
```

---

### Task 5: Header component

**Files:**
- Create: `doppler-web/components/marketing/Header.tsx`
- Create: `doppler-web/components/marketing/Header.test.tsx`

**Interfaces:**
- Consumes: `navLinks` from `@/lib/content`.
- Produces: default export `Header()` — a React Server Component (no client state needed since it only renders anchor links) — used by `app/(marketing)/layout.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the Doppler logo text and all nav links", () => {
    render(<Header />);
    expect(screen.getByText("Doppler")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Servicios" })).toHaveAttribute("href", "#servicios");
    expect(screen.getByRole("link", { name: "IA para Empresas" })).toHaveAttribute("href", "#ia");
    expect(screen.getByRole("link", { name: "Nosotros" })).toHaveAttribute("href", "#clientes");
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "#contacto");
    expect(screen.getByRole("link", { name: "Hablemos" })).toHaveAttribute("href", "#contacto");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- Header
```

Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 3: Implement `Header.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Header
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/Header.tsx doppler-web/components/marketing/Header.test.tsx
git commit -m "feat: add Header component"
```

---

### Task 6: Hero component

**Files:**
- Create: `doppler-web/components/marketing/Hero.tsx`
- Create: `doppler-web/components/marketing/Hero.test.tsx`

**Interfaces:**
- Consumes: `heroContent` from `@/lib/content`.
- Produces: default export `Hero()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { heroContent } from "@/lib/content";

describe("Hero", () => {
  it("renders headline, subheadline and CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heroContent.headline);
    expect(screen.getByText(heroContent.subheadline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: heroContent.ctaLabel })).toHaveAttribute(
      "href",
      heroContent.ctaHref
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- Hero
```

Expected: FAIL — `Cannot find module './Hero'`.

- [ ] **Step 3: Implement `Hero.tsx`**

```tsx
import Link from "next/link";
import { heroContent } from "@/lib/content";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/30 via-background to-background px-6 py-28 text-center">
      <div className="mx-auto max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-accent">
          {heroContent.eyebrow}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-foreground md:text-6xl">
          {heroContent.headline}
        </h1>
        <p className="mt-6 text-lg text-muted">{heroContent.subheadline}</p>
        <Link
          href={heroContent.ctaHref}
          className="mt-10 inline-block rounded-md bg-accent px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent/80"
        >
          {heroContent.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Hero
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/Hero.tsx doppler-web/components/marketing/Hero.test.tsx
git commit -m "feat: add Hero component"
```

---

### Task 7: ClientLogos component

**Files:**
- Create: `doppler-web/components/marketing/ClientLogos.tsx`
- Create: `doppler-web/components/marketing/ClientLogos.test.tsx`

**Interfaces:**
- Consumes: `clientLogos` from `@/lib/content`.
- Produces: default export `ClientLogos()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientLogos from "./ClientLogos";
import { clientLogos } from "@/lib/content";

describe("ClientLogos", () => {
  it("renders the section title and one placeholder box per logo", () => {
    render(<ClientLogos />);
    expect(screen.getByText("Empresas que confiaron en nosotros")).toBeInTheDocument();
    expect(screen.getAllByText("Logo")).toHaveLength(clientLogos.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- ClientLogos
```

Expected: FAIL — `Cannot find module './ClientLogos'`.

- [ ] **Step 3: Implement `ClientLogos.tsx`**

```tsx
import { clientLogos } from "@/lib/content";

export default function ClientLogos() {
  return (
    <section id="clientes" className="px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Empresas que confiaron en nosotros
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {clientLogos.map((logo, index) => (
            <div
              key={index}
              className="flex h-16 items-center justify-center rounded-md border border-primary/40 bg-surface text-sm text-muted opacity-60"
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- ClientLogos
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/ClientLogos.tsx doppler-web/components/marketing/ClientLogos.test.tsx
git commit -m "feat: add ClientLogos placeholder section"
```

---

### Task 8: Services component

**Files:**
- Create: `doppler-web/components/marketing/Services.tsx`
- Create: `doppler-web/components/marketing/Services.test.tsx`

**Interfaces:**
- Consumes: `services` from `@/lib/content`; icons `Code2`, `Bot`, `Lightbulb` from `lucide-react`.
- Produces: default export `Services()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "./Services";
import { services } from "@/lib/content";

describe("Services", () => {
  it("renders a heading per service with its description", () => {
    render(<Services />);
    services.forEach((service) => {
      expect(screen.getByText(service.title)).toBeInTheDocument();
      expect(screen.getByText(service.description)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- Services
```

Expected: FAIL — `Cannot find module './Services'`.

- [ ] **Step 3: Install lucide-react and implement `Services.tsx`**

```bash
npm install lucide-react
```

```tsx
import { Code2, Bot, Lightbulb } from "lucide-react";
import { services, type ServiceItem } from "@/lib/content";

const icons: Record<ServiceItem["icon"], typeof Code2> = {
  code: Code2,
  bot: Bot,
  lightbulb: Lightbulb,
};

export default function Services() {
  return (
    <section id="servicios" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Qué hacemos
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <div
                key={service.title}
                className="rounded-lg border border-primary/40 bg-background p-8"
              >
                <Icon className="h-8 w-8 text-accent" />
                <h3 className="mt-4 text-xl font-semibold text-foreground">{service.title}</h3>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Services
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/Services.tsx doppler-web/components/marketing/Services.test.tsx doppler-web/package.json doppler-web/package-lock.json
git commit -m "feat: add Services section with lucide-react icons"
```

---

### Task 9: AiSection component

**Files:**
- Create: `doppler-web/components/marketing/AiSection.tsx`
- Create: `doppler-web/components/marketing/AiSection.test.tsx`

**Interfaces:**
- Consumes: `aiSection` from `@/lib/content`; icons `Workflow`, `Sparkles`, `Plug`, `TrendingUp` from `lucide-react`.
- Produces: default export `AiSection()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AiSection from "./AiSection";
import { aiSection } from "@/lib/content";

describe("AiSection", () => {
  it("renders headline, all capabilities and all methodology steps", () => {
    render(<AiSection />);
    expect(screen.getByText(aiSection.headline)).toBeInTheDocument();
    aiSection.capabilities.forEach((c) => {
      expect(screen.getByText(c.title)).toBeInTheDocument();
    });
    aiSection.methodology.forEach((m) => {
      expect(screen.getByText(m.title)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- AiSection
```

Expected: FAIL — `Cannot find module './AiSection'`.

- [ ] **Step 3: Implement `AiSection.tsx`**

```tsx
import { Workflow, Sparkles, Plug, TrendingUp } from "lucide-react";
import { aiSection, type CapabilityItem } from "@/lib/content";

const icons: Record<CapabilityItem["icon"], typeof Workflow> = {
  workflow: Workflow,
  sparkles: Sparkles,
  plug: Plug,
  "trending-up": TrendingUp,
};

export default function AiSection() {
  return (
    <section id="ia" className="bg-gradient-to-b from-background to-primary/20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{aiSection.headline}</h2>
          <p className="mt-4 text-muted">{aiSection.subheadline}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aiSection.capabilities.map((capability) => {
            const Icon = icons[capability.icon];
            return (
              <div
                key={capability.title}
                className="rounded-lg border border-primary/40 bg-surface p-6"
              >
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-3 font-semibold text-foreground">{capability.title}</h3>
                <p className="mt-2 text-sm text-muted">{capability.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {aiSection.methodology.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-background">
                {step.step}
              </div>
              <h4 className="mt-3 font-semibold text-foreground">{step.title}</h4>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- AiSection
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/AiSection.tsx doppler-web/components/marketing/AiSection.test.tsx
git commit -m "feat: add AI/Automations section with methodology"
```

---

### Task 10: Metrics component

**Files:**
- Create: `doppler-web/components/marketing/Metrics.tsx`
- Create: `doppler-web/components/marketing/Metrics.test.tsx`

**Interfaces:**
- Consumes: `metrics` from `@/lib/content`.
- Produces: default export `Metrics()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Metrics from "./Metrics";
import { metrics } from "@/lib/content";

describe("Metrics", () => {
  it("renders every metric value and label", () => {
    render(<Metrics />);
    metrics.forEach((metric) => {
      expect(screen.getByText(metric.value)).toBeInTheDocument();
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- Metrics
```

Expected: FAIL — `Cannot find module './Metrics'`.

- [ ] **Step 3: Implement `Metrics.tsx`**

```tsx
import { metrics } from "@/lib/content";

export default function Metrics() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="text-4xl font-bold text-accent">{metric.value}</div>
            <div className="mt-2 text-sm text-muted">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Metrics
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/Metrics.tsx doppler-web/components/marketing/Metrics.test.tsx
git commit -m "feat: add Metrics section"
```

---

### Task 11: Testimonials component

**Files:**
- Create: `doppler-web/components/marketing/Testimonials.tsx`
- Create: `doppler-web/components/marketing/Testimonials.test.tsx`

**Interfaces:**
- Consumes: `testimonials` from `@/lib/content`.
- Produces: default export `Testimonials()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Testimonials from "./Testimonials";
import { testimonials } from "@/lib/content";

describe("Testimonials", () => {
  it("renders every quote and author", () => {
    render(<Testimonials />);
    testimonials.forEach((t) => {
      expect(screen.getByText(t.quote)).toBeInTheDocument();
      expect(screen.getByText(t.author)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- Testimonials
```

Expected: FAIL — `Cannot find module './Testimonials'`.

- [ ] **Step 3: Implement `Testimonials.tsx`**

```tsx
import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Lo que dicen de nosotros
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.author}
              className="rounded-lg border border-primary/40 bg-background p-6"
            >
              <p className="text-sm italic text-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-foreground">
                {t.author}
                <span className="block text-xs font-normal text-muted">
                  {t.role} · {t.company}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Testimonials
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/Testimonials.tsx doppler-web/components/marketing/Testimonials.test.tsx
git commit -m "feat: add Testimonials placeholder section"
```

---

### Task 12: FAQ component (interactive accordion)

**Files:**
- Create: `doppler-web/components/marketing/FAQ.tsx`
- Create: `doppler-web/components/marketing/FAQ.test.tsx`

**Interfaces:**
- Consumes: `faqItems` from `@/lib/content`; icon `ChevronDown` from `lucide-react`.
- Produces: default export `FAQ()` (client component), used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FAQ from "./FAQ";
import { faqItems } from "@/lib/content";

describe("FAQ", () => {
  it("renders all questions collapsed, and reveals the answer on click", () => {
    render(<FAQ />);
    faqItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(faqItems[0].question));
    expect(screen.getByText(faqItems[0].answer)).toBeInTheDocument();

    fireEvent.click(screen.getByText(faqItems[0].question));
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- FAQ
```

Expected: FAIL — `Cannot find module './FAQ'`.

- [ ] **Step 3: Implement `FAQ.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 divide-y divide-primary/40 border-t border-b border-primary/40">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-5 text-left text-foreground"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && <p className="pb-5 text-sm text-muted">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- FAQ
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/FAQ.tsx doppler-web/components/marketing/FAQ.test.tsx
git commit -m "feat: add interactive FAQ accordion"
```

---

### Task 13: FinalCTA component

**Files:**
- Create: `doppler-web/components/marketing/FinalCTA.tsx`
- Create: `doppler-web/components/marketing/FinalCTA.test.tsx`

**Interfaces:**
- Consumes: nothing external (static copy owned by this component, since it's a one-off closing statement not reused elsewhere).
- Produces: default export `FinalCTA()`, used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalCTA from "./FinalCTA";

describe("FinalCTA", () => {
  it("renders the closing headline and a link to the contact section", () => {
    render(<FinalCTA />);
    expect(
      screen.getByText("Más que una software factory, un equipo que impulsa tu negocio")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Empecemos" })).toHaveAttribute("href", "#contacto");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- FinalCTA
```

Expected: FAIL — `Cannot find module './FinalCTA'`.

- [ ] **Step 3: Implement `FinalCTA.tsx`**

```tsx
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-primary/30 to-background px-6 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Más que una software factory, un equipo que impulsa tu negocio
        </h2>
        <Link
          href="#contacto"
          className="mt-8 inline-block rounded-md bg-accent px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent/80"
        >
          Empecemos
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- FinalCTA
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/FinalCTA.tsx doppler-web/components/marketing/FinalCTA.test.tsx
git commit -m "feat: add final CTA section"
```

---

### Task 14: Contact API route

**Files:**
- Create: `doppler-web/app/api/contact/route.ts`
- Create: `doppler-web/app/api/contact/route.test.ts`

**Interfaces:**
- Produces: `POST(request: Request): Promise<Response>` exported from `app/api/contact/route.ts`. Response body shape on success: `{ ok: true }` (status 200). On validation failure: `{ ok: false, error: string }` (status 400). Consumed by `ContactForm.tsx` (Task 15) via `fetch("/api/contact", { method: "POST", body: JSON.stringify({ name, email, message }) })`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("returns 200 and ok:true for a valid submission", async () => {
    const res = await POST(
      makeRequest({ name: "Ignacio", email: "ignacio@example.com", message: "Hola, quiero info" })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ email: "ignacio@example.com", message: "Hola" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(
      makeRequest({ name: "Ignacio", email: "not-an-email", message: "Hola" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is missing", async () => {
    const res = await POST(makeRequest({ name: "Ignacio", email: "ignacio@example.com" }));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- route
```

Expected: FAIL — `Cannot find module './route'`.

- [ ] **Step 3: Implement `app/api/contact/route.ts`**

```ts
import { NextResponse } from "next/server";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body inválido" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name) {
    return NextResponse.json({ ok: false, error: "El nombre es requerido" }, { status: 400 });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: false, error: "El email no es válido" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ ok: false, error: "El mensaje es requerido" }, { status: 400 });
  }

  // TODO: conectar con un servicio de email (ej. Resend) o guardar en base de datos.
  console.log("Nuevo contacto recibido:", { name, email, message });

  return NextResponse.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- route
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/app/api/contact/route.ts doppler-web/app/api/contact/route.test.ts
git commit -m "feat: add contact API route with validation"
```

---

### Task 15: ContactForm component

**Files:**
- Create: `doppler-web/components/marketing/ContactForm.tsx`
- Create: `doppler-web/components/marketing/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `POST /api/contact` (Task 14) via `fetch`.
- Produces: default export `ContactForm()` (client component), used by `app/(marketing)/page.tsx` (Task 17).

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";

afterEach(() => {
  vi.unstubAllGlobals();
});

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ignacio" } });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ignacio@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mensaje"), {
    target: { value: "Quiero más info" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
}

describe("ContactForm", () => {
  it("shows a success message when the submission succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    );
    render(<ContactForm />);

    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText("¡Gracias! Te vamos a contactar pronto.")).toBeInTheDocument()
    );
  });

  it("shows an error message when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    render(<ContactForm />);

    fillAndSubmit();

    await waitFor(() =>
      expect(
        screen.getByText("No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.")
      ).toBeInTheDocument()
    );
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ignacio");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- ContactForm
```

Expected: FAIL — `Cannot find module './ContactForm'`.

- [ ] **Step 3: Implement `ContactForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Hablemos de tu proyecto
        </h2>
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-muted">
              Nombre
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-md border border-primary/40 bg-background px-4 py-2 text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md border border-primary/40 bg-background px-4 py-2 text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm text-muted">
              Mensaje
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="rounded-md border border-primary/40 bg-background px-4 py-2 text-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-accent px-6 py-3 font-semibold text-foreground transition-colors hover:bg-accent/80 disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Enviar"}
          </button>
          {status === "success" && (
            <p className="text-sm text-accent">¡Gracias! Te vamos a contactar pronto.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">
              No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
```

Note: labels use `htmlFor`/`id` pairs (`name`, `email`, `message`) so Testing Library's `getByLabelText` matches by the visible label text ("Nombre", "Email", "Mensaje").

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- ContactForm
```

Expected: both tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/ContactForm.tsx doppler-web/components/marketing/ContactForm.test.tsx
git commit -m "feat: add ContactForm with success/error states"
```

---

### Task 16: Footer component

**Files:**
- Create: `doppler-web/components/marketing/Footer.tsx`
- Create: `doppler-web/components/marketing/Footer.test.tsx`

**Interfaces:**
- Consumes: `footerLinks` from `@/lib/content`.
- Produces: default export `Footer()`, used by `app/(marketing)/layout.tsx` (Task 17).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { footerLinks } from "@/lib/content";

describe("Footer", () => {
  it("renders all footer links and the current year in the copyright", () => {
    render(<Footer />);
    footerLinks.forEach((link) => {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    });
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((text) => text.includes(year) && text.includes("Doppler"))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm test -- Footer
```

Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Implement `Footer.tsx`**

```tsx
import Link from "next/link";
import { footerLinks } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/40 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <span className="text-lg font-bold text-foreground">Doppler</span>
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- Footer
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/components/marketing/Footer.tsx doppler-web/components/marketing/Footer.test.tsx
git commit -m "feat: add Footer component"
```

---

### Task 17: Assemble the marketing layout and page

**Files:**
- Modify: `doppler-web/app/layout.tsx`
- Create: `doppler-web/app/(marketing)/layout.tsx`
- Modify: `doppler-web/app/(marketing)/page.tsx` (created by `create-next-app` at `app/page.tsx` — moved into the route group)
- Create: `doppler-web/app/(marketing)/page.test.tsx`

**Interfaces:**
- Consumes: `Header`, `Hero`, `ClientLogos`, `Services`, `AiSection`, `Metrics`, `Testimonials`, `FAQ`, `FinalCTA`, `ContactForm`, `Footer` (all Tasks 5–16).
- Produces: the assembled `/` route.

- [ ] **Step 1: Move the default page into the route group**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
mkdir -p "app/(marketing)"
git mv app/page.tsx "app/(marketing)/page.tsx" 2>/dev/null || mv app/page.tsx "app/(marketing)/page.tsx"
```

- [ ] **Step 2: Write the failing integration test**

Create `doppler-web/app/(marketing)/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import { heroContent, faqItems } from "@/lib/content";

describe("Landing page", () => {
  it("renders every section of the landing", () => {
    render(<Page />);
    expect(screen.getByText("Doppler")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heroContent.headline);
    expect(screen.getByText("Empresas que confiaron en nosotros")).toBeInTheDocument();
    expect(screen.getByText("Qué hacemos")).toBeInTheDocument();
    expect(screen.getByText("Lo que dicen de nosotros")).toBeInTheDocument();
    expect(screen.getByText(faqItems[0].question)).toBeInTheDocument();
    expect(screen.getByText("Hablemos de tu proyecto")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test -- "page.test"
```

Expected: FAIL (page.tsx still has the default `create-next-app` boilerplate content).

- [ ] **Step 4: Implement `app/(marketing)/page.tsx`**

```tsx
import Hero from "@/components/marketing/Hero";
import ClientLogos from "@/components/marketing/ClientLogos";
import Services from "@/components/marketing/Services";
import AiSection from "@/components/marketing/AiSection";
import Metrics from "@/components/marketing/Metrics";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import ContactForm from "@/components/marketing/ContactForm";

export default function Page() {
  return (
    <main>
      <Hero />
      <ClientLogos />
      <Services />
      <AiSection />
      <Metrics />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <ContactForm />
    </main>
  );
}
```

- [ ] **Step 5: Implement `app/(marketing)/layout.tsx`**

```tsx
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Update `app/layout.tsx` metadata**

Replace the contents of `doppler-web/app/layout.tsx` with:

```tsx
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
```

- [ ] **Step 7: Run test to verify it passes**

```bash
npm test -- "page.test"
```

Expected: PASS.

- [ ] **Step 8: Run the full test suite**

```bash
npm test
```

Expected: all test files PASS (Header, Hero, ClientLogos, Services, AiSection, Metrics, Testimonials, FAQ, FinalCTA, ContactForm, Footer, content, route, page).

- [ ] **Step 9: Commit**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web/app
git commit -m "feat: assemble marketing layout and landing page"
```

---

### Task 18: Build verification and manual QA

**Files:** none created — verification only.

**Interfaces:** none (final integration check).

- [ ] **Step 1: Run the production build**

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER/doppler-web
npm run build
```

Expected: `Compiled successfully`, no TypeScript or ESLint errors.

- [ ] **Step 2: Run the full test suite one more time**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 3: Start the dev server and manually verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000` and confirm, at both a desktop width (~1440px) and a mobile width (~390px):
- All 11 sections render in order: Header, Hero, Client logos, Services, AI section, Metrics, Testimonials, FAQ, Final CTA, Contact form, Footer.
- Header nav links scroll to the right anchors (`#servicios`, `#ia`, `#clientes`, `#contacto`).
- FAQ items expand/collapse on click.
- Submitting the contact form with valid data shows the success message (check the terminal running `npm run dev` for the `console.log` of the submitted contact).
- Color palette matches dark green/black/white-gray tokens (no light-mode flash, no stock photos).

Stop the dev server (`Ctrl+C`) once verified.

- [ ] **Step 4: Commit any final fixes found during manual QA**

If manual QA surfaced issues, fix them, re-run `npm test` and `npm run build`, then:

```bash
cd /Users/ignacioirigoitia/Desktop/DOPPLER
git add doppler-web
git commit -m "fix: address manual QA findings on landing page"
```

If no issues were found, skip this commit.

---

## Plan Self-Review

**Spec coverage:** Header/Hero/ClientLogos/Services/AiSection/Metrics/Testimonials/FAQ/FinalCTA/ContactForm/Footer each map 1:1 to spec sections 1–11 (Tasks 5–16). Color tokens (Task 2), folder structure incl. `(marketing)` route group and `lib/content.ts` (Tasks 1, 4, 17), contact form behavior and `/api/contact` (Tasks 14–15), placeholder-distinguishability for logos/metrics/testimonials (Tasks 4, 7, 10, 11), and the testing requirements (manual QA + build, Task 18) are all covered. Admin panel, blog, team section, real email delivery, i18n, and `/ia-para-empresas` are correctly left out of every task.

**Placeholder scan:** No TBD/TODO-as-plan-content; the only `// TODO` comments are intentional, spec-mandated markers inside actual shipped code (`lib/content.ts`, `route.ts`) for future real data/integration.

**Type consistency:** `ServiceItem["icon"]`, `CapabilityItem["icon"]`, `Metric`, `Testimonial`, `FaqItem`, `NavLink`, `ClientLogo` types defined once in Task 4 and consumed with matching field names (`title`, `description`, `value`, `label`, `quote`, `author`, `role`, `company`, `question`, `answer`, `label`, `href`, `name`) by every consuming component task. The contact route's response shape (`{ ok: boolean }`) matches what `ContactForm.tsx` checks (`res.ok` from `fetch`, i.e., HTTP status, not the JSON body — verified consistent since `ContactForm` only checks `res.ok`/throws, it doesn't need to parse the JSON body's `ok` field, avoiding a mismatch).

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-01-doppler-landing.md`.** Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
