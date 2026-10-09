"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import ContactForm from "./ContactForm";
import { chatContent } from "@/lib/content";

type Message = { role: "user" | "assistant"; content: string };
type Status = "idle" | "streaming" | "error" | "closed";
type ChatEvent =
  | { type: "text"; text: string }
  | { type: "brief"; subject: string; text: string }
  | { type: "done"; submitted: boolean }
  | { type: "error"; message: string };

const MAX_MESSAGE_CHARS = 1500;

export default function LeadChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [brief, setBrief] = useState<{ subject: string; text: string } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) return; // evita scrollear la página al montar
    endRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  function appendToReply(text: string) {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, content: last.content + text }];
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || status === "streaming" || status === "closed") return;

    const history: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStatus("streaming");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const chatEvent = JSON.parse(line) as ChatEvent;
          if (chatEvent.type === "text") {
            appendToReply(chatEvent.text);
          } else if (chatEvent.type === "brief") {
            setBrief({ subject: chatEvent.subject, text: chatEvent.text });
          } else if (chatEvent.type === "error") {
            throw new Error(chatEvent.message);
          } else {
            finished = true;
            setStatus(chatEvent.submitted ? "closed" : "idle");
          }
        }
      }
      if (!finished) throw new Error("stream ended early");
    } catch {
      // Se descarta el turno fallido para que el historial siga alternando roles.
      setMessages(messages);
      setInput(text);
      setStatus("error");
    }
  }

  const locked = status === "streaming" || status === "closed";

  return (
    <section id="contacto" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          {chatContent.heading}
        </h2>

        <div
          role="log"
          aria-live="polite"
          className="mt-10 flex max-h-[28rem] flex-col gap-3 overflow-y-auto rounded-md border border-primary/40 bg-background p-4"
        >
          <p className="max-w-[85%] self-start rounded-md bg-surface px-4 py-2 text-sm text-foreground">
            {chatContent.greeting}
          </p>
          {messages.map((message, index) => (
            <p
              key={index}
              className={
                message.role === "user"
                  ? "bg-brand-gradient max-w-[85%] self-end whitespace-pre-wrap rounded-md px-4 py-2 text-sm text-foreground"
                  : "max-w-[85%] self-start whitespace-pre-wrap rounded-md bg-surface px-4 py-2 text-sm text-foreground"
              }
            >
              {message.content || "…"}
            </p>
          ))}
          <div ref={endRef} />
        </div>

        {status === "error" && (
          <p className="mt-3 text-sm text-danger">{chatContent.errorMessage}</p>
        )}
        {status === "closed" && (
          <p className="mt-3 text-sm text-accent">{chatContent.closedNotice}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
          <label htmlFor="chat-input" className="sr-only">
            {chatContent.inputLabel}
          </label>
          <textarea
            id="chat-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Enter envía, Shift+Enter deja el salto de línea nativo.
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            maxLength={MAX_MESSAGE_CHARS}
            disabled={locked}
            placeholder={chatContent.placeholder}
            className="max-h-40 flex-1 resize-none rounded-md border border-primary/40 bg-background px-4 py-2 text-foreground [field-sizing:content] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={locked}
            className="bg-brand-gradient rounded-md px-6 py-2 font-semibold text-foreground shadow-md shadow-accent/30 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {chatContent.sendLabel}
          </button>
        </form>

        {brief && (
          <div className="mt-6 rounded-md border border-accent/40 bg-background p-4">
            <p className="text-sm font-semibold text-accent">{chatContent.previewTitle}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{brief.subject}</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-muted">{brief.text}</pre>
          </div>
        )}

        <details className="mt-8" open={status === "error"}>
          <summary className="cursor-pointer text-sm text-muted">
            {chatContent.fallbackSummary}
          </summary>
          <div className="mt-4">
            <ContactForm />
          </div>
        </details>
      </div>
    </section>
  );
}
