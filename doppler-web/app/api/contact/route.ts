import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_RECIPIENTS = ["dsalamone@doppler.la", "i.irigoitia@doppler.la"];

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

  try {
    const { error: sendError } = await resend.emails.send({
      from: "Doppler <onboarding@resend.dev>",
      to: CONTACT_RECIPIENTS,
      replyTo: email,
      subject: `Nuevo contacto de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    });
    if (sendError) throw sendError;
  } catch (error) {
    console.error("Error enviando email de contacto:", error);
    return NextResponse.json({ ok: false, error: "No se pudo enviar el mensaje" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
