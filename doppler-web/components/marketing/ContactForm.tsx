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
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        className="bg-brand-gradient rounded-md px-6 py-3 font-semibold text-foreground shadow-md shadow-accent/30 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Enviar"}
      </button>
      {status === "success" && (
        <p className="text-sm text-accent">¡Gracias! Te vamos a contactar pronto.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-danger">
          No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.
        </p>
      )}
    </form>
  );
}
