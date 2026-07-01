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
