"use client";

import { useState } from "react";
import { FiZap, FiSend } from "react-icons/fi";
import { flavors } from "@/lib/flavors";
import Spinner from "@/components/Spinner";

const PREFS = [
  "Yang manis",
  "Gurih & asin",
  "Cokelat / kopi",
  "Buah segar",
  "Untuk kado",
  "Baru pertama coba",
];

export default function FlavorRecommender() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask(pref: string) {
    const preference = pref.trim();
    if (!preference || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal.");
      setResult(data.text ?? "");
    } catch {
      setError("Maaf, lagi ada kendala. Coba lagi sebentar ya kak 🙏");
    } finally {
      setLoading(false);
    }
  }

  // Flavors mentioned in the answer → show them as highlight badges.
  const matched = result
    ? flavors.filter((f) => result.toLowerCase().includes(f.name.toLowerCase()))
    : [];

  return (
    <div className="rounded-3xl border border-brown/15 bg-cream-soft p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
          <FiZap className="text-xl" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">Bingung pilih rasa?</h3>
          <p className="text-sm text-ink/60">
            Biar Mbak Sempe bantu carikan rasa yang pas untukmu.
          </p>
        </div>
      </div>

      {/* Quick preferences */}
      <div className="mt-5 flex flex-wrap gap-2">
        {PREFS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setInput(p);
              ask(p);
            }}
            disabled={loading}
            className="rounded-full border border-brown/20 bg-cream px-4 py-1.5 text-sm text-ink/70 transition hover:border-terracotta/40 hover:text-terracotta disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Free-text input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="atau ketik sendiri, mis. 'suka kopi tapi gak terlalu pahit'"
          maxLength={200}
          className="min-w-0 flex-1 rounded-full border border-brown/20 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Carikan rasa"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Spinner className="h-4 w-4" /> : <FiSend className="text-base" />}
        </button>
      </form>

      {/* Result */}
      {loading && (
        <div className="mt-5 flex items-center gap-2 text-sm text-ink/50">
          <Spinner className="h-4 w-4 text-terracotta" /> Mbak Sempe lagi mikir…
        </div>
      )}

      {error && <p className="mt-5 text-sm text-terracotta">{error}</p>}

      {result && !loading && (
        <div className="mt-5 rounded-2xl border border-brown/10 bg-cream p-4">
          <p className="leading-relaxed text-ink/80">{result}</p>
          {matched.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-brown/10 pt-3">
              {matched.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: f.accent }}
                  />
                  {f.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
