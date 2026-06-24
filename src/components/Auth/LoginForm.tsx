"use client";

import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-terracotta">{error}</p>}

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-brown/20 px-6 py-3 text-sm text-ink transition hover:bg-cream-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaGoogle className="text-base text-terracotta" />
        {loading ? "Mengalihkan ke Google..." : "Masuk dengan Google"}
      </button>
    </div>
  );
}
