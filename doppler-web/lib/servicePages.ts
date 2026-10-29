import type { FaqItem } from "@/lib/content";

export type ServicePage = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  includes: { title: string; description: string }[];
  forWho: string[];
  faqs: FaqItem[];
  testimonialCompanies: string[];
  // Fecha (YYYY-MM-DD) de la última modificación del contenido. Actualizar al editar la página.
  updatedAt: string;
};

// Proceso y diferenciales tomados de las preguntas frecuentes de la home.
export const workProcess = [
  {
    title: "Reunión de diagnóstico",
    description: "Una primera reunión sin costo para entender tu necesidad.",
  },
  {
    title: "Alcance y plan",
    description: "Definimos qué se construye, en qué orden y cómo se mide.",
  },
  {
    title: "Ciclos cortos",
    description: "Trabajamos con entregas frecuentes para que veas avances reales.",
  },
];

export const whyDoppler = [
  {
    title: "Software tradicional + IA aplicada",
    description:
      "Combinamos desarrollo de software tradicional con foco fuerte en IA aplicada a automatización.",
  },
  {
    title: "Equipos chicos, comunicación directa",
    description: "Hablás con quienes construyen tu proyecto, sin capas de intermediarios.",
  },
  {
    title: "Para cualquier industria",
    description:
      "Trabajamos con startups, pymes y empresas de cualquier industria que necesiten software o automatizaciones con IA.",
  },
];

// Contenido basado en lo que ya dice el sitio (servicios, sección de IA y FAQ). Sin cifras ni clientes inventados.
export const servicePages: ServicePage[] = [
  {
    slug: "desarrollo-de-software",
    updatedAt: "2026-10-29",
    testimonialCompanies: ["Pahema", "Kuyén"],
    name: "Desarrollo de Software",
    metaTitle: "Desarrollo de software a medida para pymes y empresas | Doppler",
    metaDescription:
      "Aplicaciones web, mobile y sistemas a medida para startups, pymes y empresas. Equipos chicos, comunicación directa y entregas frecuentes.",
    headline: "Desarrollo de software a medida",
    intro:
      "Construimos aplicaciones web, mobile y sistemas a medida con foco en escalabilidad y velocidad de entrega. Trabajamos con startups, pymes y empresas de cualquier industria, con equipos chicos y comunicación directa.",
    includes: [
      {
        title: "Aplicaciones web",
        description: "Plataformas, portales y herramientas internas pensadas para el flujo de trabajo de tu negocio.",
      },
      {
        title: "Aplicaciones mobile",
        description: "Apps para tus clientes o para tu equipo, con la misma lógica de negocio que tus sistemas.",
      },
      {
        title: "Sistemas a medida",
        description: "Software que se adapta a cómo trabajás, en lugar de obligarte a adaptarte a una herramienta genérica.",
      },
      {
        title: "MVPs",
        description: "Una primera versión para validar la idea con usuarios reales y evolucionarla por etapas.",
      },
    ],
    forWho: [
      "Startups que necesitan lanzar un producto o validar una idea",
      "Pymes que quieren digitalizar o reemplazar un proceso manual",
      "Empresas que necesitan un sistema a medida o sumar capacidad técnica",
    ],
    faqs: [
      {
        question: "¿Cuánto tiempo toma un proyecto de desarrollo?",
        answer:
          "Depende del alcance: un MVP puede tomar semanas, mientras que un proyecto más amplio se planifica en etapas con entregas incrementales.",
      },
      {
        question: "¿Cómo trabajan durante el desarrollo?",
        answer:
          "Definimos alcance y plan después de una reunión de diagnóstico, y trabajamos en ciclos cortos con entregas frecuentes para que veas avances reales.",
      },
      {
        question: "¿Cómo arranco?",
        answer:
          "Contanos tu proyecto en el chat o en el formulario de esta página y coordinamos una primera reunión sin costo para entender tu necesidad.",
      },
    ],
  },
  {
    slug: "ia-y-automatizaciones",
    updatedAt: "2026-10-29",
    testimonialCompanies: ["Sintectur"],
    name: "IA & Automatizaciones",
    metaTitle: "IA y automatización de procesos para empresas | Doppler",
    metaDescription:
      "Automatizaciones e integraciones de IA medibles para reducir tareas manuales y costos operativos. Diagnóstico, diseño, implementación y medición.",
    headline: "IA y automatización de procesos para tu empresa",
    intro:
      "Diseñamos e implementamos soluciones de inteligencia artificial que automatizan procesos y reducen costos operativos. No vendemos promesas: construimos automatizaciones e integraciones medibles, pensadas para el día a día de tu operación.",
    includes: [
      {
        title: "Automatización de procesos",
        description: "Eliminamos tareas manuales repetitivas conectando tus sistemas de punta a punta.",
      },
      {
        title: "IA generativa",
        description: "Asistentes y modelos de lenguaje aplicados a tus flujos de trabajo reales.",
      },
      {
        title: "Integraciones a medida",
        description: "Conectamos tus herramientas actuales sin romper lo que ya funciona.",
      },
      {
        title: "Análisis predictivo",
        description: "Datos históricos convertidos en decisiones anticipadas para tu negocio.",
      },
    ],
    forWho: [
      "Equipos que pierden horas en tareas manuales y repetitivas",
      "Empresas con varias herramientas que no se hablan entre sí",
      "Negocios que quieren aplicar IA a un proceso concreto, con resultados medibles",
    ],
    faqs: [
      {
        question: "¿Cómo es el proceso de una automatización?",
        answer:
          "Empezamos con un diagnóstico de tus procesos, priorizamos por impacto y esfuerzo, implementamos la solución y medimos resultados reales para ajustar de forma continua.",
      },
      {
        question: "¿Hay que cambiar las herramientas que ya usamos?",
        answer:
          "No necesariamente. Priorizamos integraciones que conectan tus herramientas actuales sin romper lo que ya funciona.",
      },
      {
        question: "¿Cómo arranco?",
        answer:
          "Contanos qué proceso querés mejorar en el chat o en el formulario de esta página y coordinamos una primera reunión sin costo.",
      },
    ],
  },
  {
    slug: "consultoria-tech",
    updatedAt: "2026-10-29",
    testimonialCompanies: ["Kuyén"],
    name: "Consultoría Tech",
    metaTitle: "Consultoría tecnológica y estrategia digital | Doppler",
    metaDescription:
      "Acompañamos decisiones tecnológicas clave: arquitectura, stack y estrategia digital para startups, pymes y empresas que quieren crecer con foco.",
    headline: "Consultoría tecnológica para decidir con foco",
    intro:
      "Acompañamos las decisiones tecnológicas clave de tu negocio: arquitectura, stack y estrategia digital, para que puedas crecer con foco y sin construir de más.",
    includes: [
      {
        title: "Arquitectura",
        description: "Cómo se estructura un sistema para que escale y se pueda mantener en el tiempo.",
      },
      {
        title: "Elección de stack",
        description: "Qué tecnologías usar según tu equipo, tus plazos y los objetivos del producto.",
      },
      {
        title: "Estrategia digital",
        description: "Qué construir primero, qué comprar y qué automatizar para que la tecnología empuje tu negocio.",
      },
    ],
    forWho: [
      "Equipos que van a encarar un proyecto técnico y quieren decidir bien desde el inicio",
      "Empresas con un sistema existente que necesitan ordenar o evolucionar",
      "Founders sin equipo técnico que necesitan un criterio de confianza",
    ],
    faqs: [
      {
        question: "¿Qué pasa después de la consultoría?",
        answer:
          "Podés llevarte las definiciones y ejecutarlas con tu equipo, o seguir con nosotros en el desarrollo. Lo decidís vos.",
      },
      {
        question: "¿Cómo arranco?",
        answer:
          "Contanos tu situación en el chat o en el formulario de esta página y coordinamos una primera reunión sin costo.",
      },
    ],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
