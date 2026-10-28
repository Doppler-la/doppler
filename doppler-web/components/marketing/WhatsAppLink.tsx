"use client";

import { trackLead } from "@/lib/analytics";

type Props = { number: string; label: string; className?: string };

// number: formato internacional, solo dígitos. Sin número no se muestra nada.
export default function WhatsAppLink({ number, label, className }: Props) {
  if (!number) return null;
  const text = encodeURIComponent("Hola Doppler, quiero consultar por un proyecto.");
  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead("whatsapp")}
      className={className}
    >
      {label}
    </a>
  );
}
