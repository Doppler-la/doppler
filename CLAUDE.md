# Doppler

Doppler is a software factory (built by two co-founders) offering custom software development, AI-driven automation, and tech consulting. This repo currently contains the public marketing landing page. An internal admin panel (project tracking, calendar, company management) is planned as a future addition to the same Next.js app.

## Repo layout

```
DOPPLER/                        <- git repo root
  docs/superpowers/
    specs/2026-07-01-doppler-landing-design.md   <- landing page design spec
    plans/2026-07-01-doppler-landing.md          <- implementation plan (18 tasks, all shipped)
  doppler-web/                  <- the actual Next.js app (run all commands from here)
```

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS 3
- lucide-react for icons
- Vitest + React Testing Library for tests (`npm test`)
- No CMS, no database. All landing copy lives in `doppler-web/lib/content.ts`.

## Commands (run from `doppler-web/`)

```bash
npm run dev     # dev server
npm run build   # production build + typecheck + lint
npm test        # vitest run (full suite)
npm test -- Header   # run a single test file by name match
```

## Architecture

- `app/(marketing)/` — route group for the public landing page. `layout.tsx` wraps children with `Header`/`Footer`; `page.tsx` assembles the 9 body sections. A sibling `(admin)` route group can be added later without touching this one.
- `app/layout.tsx` — root layout: Geist font (via `next/font/local`, using the woff files in `app/fonts/`), global metadata, `lang="es"`.
- `app/api/contact/route.ts` — `POST` handler for the contact form. Validates name/email/message, **only `console.log`s the submission** (marked with a `// TODO` for real email/DB integration — nothing is actually sent or stored yet).
- `components/marketing/*.tsx` — one component per landing section (Header, Hero, ClientLogos, Services, AiSection, Metrics, Testimonials, FAQ, FinalCTA, ContactForm, Footer). Each has a co-located `.test.tsx`. All are Server Components except `FAQ.tsx` and `ContactForm.tsx` (client, use `useState`).
- `lib/content.ts` — single source of truth for all copy (nav links, hero text, services, AI section content, metrics, testimonials, FAQ, footer links). Edit copy here, not in components.

## Design tokens (`tailwind.config.ts`)

Dark green/black/white-gray palette — do not introduce hardcoded hex colors in components:

| Token | Hex | Use |
|---|---|---|
| `background` | `#0A0A0A` | page background |
| `surface` | `#111813` | alternating section/card backgrounds |
| `primary` | `#0F3D2E` | accents, borders |
| `accent` | `#1E7A4C` | CTAs, hover states, icon highlights |
| `foreground` | `#F5F5F4` | primary text |
| `muted` | `#A1A1AA` | secondary text |
| `danger` | `#F87171` | error states (e.g. contact form failure message) |

`fontFamily.sans` maps to the Geist variable (`var(--font-geist-sans)`).

## Placeholder content — replace before real launch

Several sections ship with intentionally marked placeholder data in `lib/content.ts`:

- `clientLogos` — 6 generic "Logo" boxes (reduced opacity), no real client logos yet.
- `metrics` — all three values are `"+0"`.
- `testimonials` — 3 generic placeholder quotes, all sharing the author name "Nombre Apellido".

Each is marked with a `// TODO: reemplazar con...` comment. When replacing with real data, note that some tests intentionally use `getAllByText(...).length` instead of per-item `getByText` because the placeholder values are duplicates — once real (unique) data replaces them, those tests can be simplified back to a straightforward per-item loop if desired (not required).

## Explicitly out of scope (per the design spec)

- Admin panel (`/admin`), project tracking, calendar — future, separate spec/plan.
- Blog.
- Team/founders section.
- Real email delivery or database persistence from the contact form.
- Internationalization — Spanish only, dark mode only.
- A standalone `/ia-para-empresas` page — the AI/automation pitch lives as a section (`AiSection`) within the single landing page, not a separate route.

## Testing conventions

- Test files are co-located (`Component.tsx` + `Component.test.tsx`).
- The `(marketing)/page.test.tsx` and `(marketing)/nav-links.test.tsx` are integration tests that render `<MarketingLayout><Page /></MarketingLayout>` together — rendering `<Page />` alone won't include Header/Footer, since those live in the layout, not the page.
- `nav-links.test.tsx` guards that every `navLinks` href in `lib/content.ts` has a matching section `id` in the DOM — update both together if you rename a section anchor.
