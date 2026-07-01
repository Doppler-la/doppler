# Doppler — Landing Page Design

**Fecha:** 2026-07-01
**Estado:** Aprobado para implementación

## Contexto

Doppler es una software factory fundada por dos socios que realiza cualquier tipo de trabajo
de tecnología (desarrollo de software, IA/automatizaciones, consultoría tech). Necesitan una
landing page para vender la empresa, sin exponer detalles de proyectos específicos de clientes
(para no "quemarlos"), pero sí mostrando qué empresas confiaron en ellos. El foco de audiencia
es **Startups, Pymes y Empresas**, con énfasis en el uso de **IA para automatizaciones**.

El proyecto se construye en Next.js porque a futuro también va a alojar un panel de administración
interno (seguimiento de proyectos, calendario, gestión de la empresa). Este spec cubre **solo la
landing pública**; el admin panel es un proyecto futuro separado (su propio spec/plan).

Referencia de estructura: [hitocean.com](https://www.hitocean.com/) (sin la sección de blog) y
su página [hitocean.com/ia-para-empresas](https://www.hitocean.com/ia-para-empresas/) para el
enfoque de la sección de IA.

## Objetivo

Landing page de una sola página (`/`) que comunique quiénes son, qué hacen, y genere leads a
través de un formulario de contacto. Sin blog, sin detalle de proyectos de clientes.

## Stack técnico

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **lucide-react** para iconografía
- Sin CMS, sin base de datos. Todo el copy vive centralizado en código (`lib/content.ts`).
- Sin librerías de animación (framer-motion descartado); transiciones simples vía Tailwind
  (`hover:`, `transition-colors`, etc.).
- Fuente: Geist (la que trae Next.js por defecto).

## Estructura de carpetas

```
app/
  (marketing)/
    layout.tsx          # layout específico de la landing (header + footer wrap)
    page.tsx            # ensambla todas las secciones en orden
  api/
    contact/
      route.ts          # POST: valida body, loguea el mensaje (placeholder de envío real)
  layout.tsx             # root layout: fonts, <html>, metadata global
  globals.css            # tokens de color Tailwind, estilos base
components/
  marketing/
    Header.tsx
    Hero.tsx
    ClientLogos.tsx
    Services.tsx
    AiSection.tsx
    Metrics.tsx
    Testimonials.tsx
    FAQ.tsx
    FinalCTA.tsx
    ContactForm.tsx
    Footer.tsx
lib/
  content.ts              # todo el copy: arrays/objetos consumidos por los componentes
```

Cada componente de `components/marketing/` es responsable únicamente de su presentación;
recibe el contenido desde `lib/content.ts` como props o importándolo directamente. Esto permite
editar textos, agregar testimonios reales, o cambiar logos sin tocar JSX/lógica.

`(marketing)` es un route group pensado para que, cuando se agregue el admin en el futuro, exista
un route group hermano `(admin)` con su propio layout y auth, sin interferir con esta landing.

## Paleta de colores (Tailwind tokens en `globals.css` / `tailwind.config`)

| Token | Valor aprox. | Uso |
|---|---|---|
| `background` | `#0A0A0A` | Fondo general de la página |
| `surface` | `#111813` | Fondo de cards/secciones alternas |
| `primary` (verde oscuro) | `#0F3D2E` | Fondos de acento, bordes de cards, botones secundarios |
| `accent` (verde vivo) | `#1E7A4C` | CTAs principales, hovers, íconos destacados |
| `foreground` | `#F5F5F4` | Texto principal |
| `muted` | `#A1A1AA` | Texto secundario/descripciones |

Gradientes sutiles verde oscuro → negro se usan en el fondo del hero y como separadores visuales
entre secciones. Sin fotos de stock; solo iconografía (lucide-react) y tipografía como recurso visual.

## Secciones de la landing (orden final)

1. **Header** — Logo "Doppler" + nav (Servicios, IA para Empresas, Nosotros, Contacto) + botón CTA
   "Hablemos". Sticky al hacer scroll.
2. **Hero** — Headline centrado en "Software Factory para Startups, Pymes y Empresas"; subheadline
   sobre construir soluciones tecnológicas y automatizar con IA. CTA primario "Hablemos hoy" que
   scrollea a la sección de contacto.
3. **Logos de clientes** — Título "Empresas que confiaron en nosotros" + grid de placeholders
   (recuadros con texto "Logo" y opacidad reducida) hasta que se reemplacen por logos reales vía
   `lib/content.ts`.
4. **Servicios** — 3 cards: **Desarrollo de Software**, **IA & Automatizaciones**, **Consultoría
   Tech**. Cada una con ícono, título y descripción corta (2-3 líneas), sin mención de clientes o
   proyectos específicos.
5. **IA / Automatizaciones (sección destacada)** — Headline fuerte ("Impulsamos tu negocio con IA
   que genera resultados"). Incluye:
   - Grid de capacidades: automatización de procesos, IA generativa, integraciones a medida,
     análisis predictivo.
   - Metodología resumida en 4 pasos horizontales: Diagnóstico → Diseño → Implementación → Medición.
6. **Métricas** — 3 números destacados con placeholder (ej. "+X proyectos entregados", "+X
   automatizaciones implementadas", "+X clientes activos"), marcados en `content.ts` con comentario
   `// TODO: reemplazar con métricas reales`.
7. **Testimonios** — 3-4 quotes con nombre/rol/empresa placeholder, mismo patrón de TODO para
   reemplazo futuro.
8. **FAQ** — Acordeón con 5 preguntas: tipos de clientes que atienden, cómo es el proceso de
   trabajo, tiempos estimados, qué los diferencia, cómo arrancar un proyecto.
9. **CTA final** — Frase de cierre fuerte + botón que lleva al formulario de contacto.
10. **Contacto** — Formulario con campos: nombre, email, mensaje. Envía `POST` a `/api/contact`.
11. **Footer** — Links de navegación a las secciones (anchors), espacio para redes sociales
    (placeholders, a completar), copyright con año dinámico.

## Formulario de contacto — comportamiento

- Client component con estado local (loading/success/error) y validación básica (campos
  requeridos, formato de email).
- `POST /api/contact` (route handler en `app/api/contact/route.ts`):
  - Valida el body (nombre, email, mensaje requeridos).
  - Por ahora **solo loguea** el contacto recibido (`console.log`) y devuelve `200 { ok: true }`.
  - Placeholder explícito (comentario en código) indicando dónde se conectará un servicio de email
    o guardado en base de datos en el futuro.
- El formulario muestra un mensaje de éxito ("¡Gracias! Te vamos a contactar pronto.") o de error
  simple si el `fetch` falla.

## Errores / casos borde

- Si `/api/contact` devuelve error o el `fetch` falla (red caída), el formulario muestra un mensaje
  de error y no pierde los datos ingresados por el usuario.
- Sin JavaScript no hay fallback de envío nativo (aceptable para esta primera versión, ya que es un
  form controlado por React); no se requiere soporte sin JS.
- Logos y testimonios placeholder deben ser visualmente identificables como tales (opacidad/estilo
  distintivo) para que no parezcan contenido real accidentalmente en producción.

## Fuera de alcance (explícitamente no incluido en este spec)

- Panel de administración (`/admin`), seguimiento de proyectos, calendario — proyecto futuro
  separado.
- Blog o sección de recursos.
- Sección de equipo/fundadores (se decidió no incluir por ahora).
- Envío real de emails o persistencia en base de datos desde el formulario de contacto.
- Internacionalización (la landing es solo en español).
- Página dedicada `/ia-para-empresas` — el contenido de IA vive como sección dentro de la landing.

## Testing

- Verificación manual en navegador (desktop y mobile viewport) de las 11 secciones, dark mode
  únicamente (no hay modo claro).
- Test del formulario de contacto: envío exitoso muestra mensaje de éxito; simular fallo de red
  muestra mensaje de error.
- `npm run build` sin errores de tipos/lint antes de considerar la tarea completa.
