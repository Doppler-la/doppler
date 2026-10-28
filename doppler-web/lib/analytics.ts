type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type LeadMethod = "form" | "chat" | "whatsapp";

// No hace nada si GA4 no está cargado (sin ID configurado, o bloqueado por el navegador).
export function trackEvent(name: string, params: GtagParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

// generate_lead es un evento recomendado de GA4: se marca como evento clave e importa a Google Ads como conversión.
export function trackLead(method: LeadMethod): void {
  trackEvent("generate_lead", { method });
}
