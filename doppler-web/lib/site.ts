
// Número de WhatsApp comercial en formato internacional, solo dígitos (ej. 5491112345678). Vacío si no está configurado.
export function getWhatsAppNumber(): string {
  return (process.env.WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
}
