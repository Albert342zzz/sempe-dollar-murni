"use client";

import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { eloquia } from "@/lib/fonts";
import { createClient } from "@/lib/supabase/client";

type Message = { role: "user" | "assistant"; content: string };

const GREETING =
  "Halo kak! 👋 Aku Mbak Sempe, siap bantu soal rasa, harga, atau cara pesan. Ada yang bisa dibantu?";

const SUGGESTIONS = [
  "Rasa apa aja yang ada?",
  "Berapa harga ukuran 250gr?",
  "Gimana cara pesannya?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Reset conversation to greeting when the user signs out.
  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setMessages([{ role: "assistant", content: GREETING }]);
        setInput("");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      // Rate limited: the server sends a friendly plain-text explanation.
      if (res.status === 429) {
        const notice = await res.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: notice };
          return copy;
        });
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error("Gagal terhubung");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Maaf kak, lagi ada kendala 🙏 Coba lagi sebentar ya, atau hubungi WhatsApp kami.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showTyping =
    streaming && lastMsg.role === "assistant" && lastMsg.content === "";

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat bantuan"}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-terracotta text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-brown active:scale-95"
      >
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-300" style={{ opacity: open ? 0 : 1, transform: open ? "rotate(90deg) scale(0.5)" : "none" }}>
          <FiMessageCircle className="text-2xl" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-300" style={{ opacity: open ? 1 : 0, transform: open ? "none" : "rotate(-90deg) scale(0.5)" }}>
          <FiX className="text-2xl" />
        </span>
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-5 z-40 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-brown/15 bg-cream shadow-2xl transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(560px, calc(100vh - 8rem))" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-ink px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">
            MS
          </div>
          <div className="min-w-0">
            <p className={`${eloquia.className} text-[15px] leading-tight text-cream`}>
              Mbak Sempe
            </p>
            <p className="flex items-center gap-1.5 text-[11px] leading-none text-cream/50">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-olive" />
              Asisten online
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup chat"
            className="ml-auto cursor-pointer rounded-lg p-1.5 text-cream/40 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-cream-soft px-4 py-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-sm bg-terracotta text-white"
                    : "rounded-bl-sm border border-brown/10 bg-cream text-ink"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {showTyping && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-brown/10 bg-cream px-4 py-3">
                <Dot delay="0ms" />
                <Dot delay="150ms" />
                <Dot delay="300ms" />
              </div>
            </div>
          )}

          {/* Quick-reply suggestions — only shown at the start of the conversation */}
          {messages.length === 1 && !streaming && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="cursor-pointer rounded-full border border-terracotta/30 bg-cream px-3 py-1.5 text-xs text-terracotta transition-colors hover:bg-terracotta/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-brown/10 bg-cream p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan..."
            maxLength={500}
            className="flex-1 rounded-full border border-brown/20 bg-cream-soft px-4 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            aria-label="Kirim"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-terracotta text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiSend className="text-base" />
          </button>
        </form>
      </div>
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-brown/40"
      style={{ animationDelay: delay }}
    />
  );
}
