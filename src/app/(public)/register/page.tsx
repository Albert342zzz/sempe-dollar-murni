"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { eloquia } from "@/lib/fonts";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
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
    <main className="bg-cream-soft">
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md rounded-3xl border border-brown/15 bg-cream p-8 shadow-sm md:p-10">
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/logo.png"
                alt="Sempe Dollar Murni"
                width={140}
                height={56}
                className="mx-auto h-14 w-auto object-contain"
              />
            </Link>

            <h1
              className={`${eloquia.className} mt-5 text-3xl font-semibold md:text-4xl`}
            >
              Daftar Akun
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Daftar agar memesan lebih mudah — bisa pilih banyak rasa, pakai
              keranjang, dan lihat riwayat pesanan.
            </p>
            <p className="mt-1 text-xs text-ink/40">
              Kami akan meminta nama panggilan dan nomor HP setelah masuk.
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <p className="mb-4 text-sm text-terracotta">{error}</p>
            )}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brown/20 px-6 py-3 text-sm text-ink transition hover:bg-cream-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaGoogle className="text-base text-terracotta" />
              {loading ? "Mengalihkan ke Google..." : "Daftar dengan Google"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-ink/60">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-terracotta hover:text-brown"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
