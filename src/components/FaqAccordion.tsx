"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export type FaqItem = { id: number; question: string; answer: string };

// Accessible accordion: one panel open at a time, keyboard-operable buttons,
// smooth height transition via grid-rows trick.
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-brown/15 bg-cream"
          >
            <button
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-cream-soft"
            >
              <span className="font-medium text-ink">{item.question}</span>
              <FiChevronDown
                className={`shrink-0 text-lg text-terracotta transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line px-5 pb-5 leading-relaxed text-ink/70">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
