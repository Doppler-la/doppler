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
