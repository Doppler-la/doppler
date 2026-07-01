"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/lib/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 divide-y divide-primary/40 border-t border-b border-primary/40">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-5 text-left text-foreground"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-medium">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && <p className="pb-5 text-sm text-muted">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
