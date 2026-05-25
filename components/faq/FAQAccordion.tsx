"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-[border-color] duration-200"
            style={{
              border: `1px solid ${isOpen ? "rgba(214,168,79,0.35)" : "rgba(214,168,79,0.1)"}`,
              background: isOpen ? "rgba(214,168,79,0.04)" : "rgba(17,17,24,0.6)",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="text-base font-semibold leading-snug"
                style={{
                  fontFamily: "var(--font-display)",
                  color: isOpen ? "#D6A84F" : "#E8E8F0",
                }}
              >
                {item.q}
              </span>
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                style={{
                  background: isOpen ? "rgba(214,168,79,0.15)" : "rgba(214,168,79,0.08)",
                  color: "#D6A84F",
                }}
              >
                {isOpen ? <Minus size={13} /> : <Plus size={13} />}
              </span>
            </button>

            <div
              style={{
                maxHeight: isOpen ? "500px" : "0",
                overflow: "hidden",
                transition: "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <p
                className="px-6 pb-5 text-sm leading-relaxed"
                style={{ color: "#A7A7B3" }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
