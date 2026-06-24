"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { eloquia } from "@/lib/fonts";
import {
  validateName,
  validatePhone,
  sanitizeName,
  sanitizePhone,
} from "@/lib/validation";
import Spinner from "@/components/Spinner";

const inputClass =
  "w-full rounded-xl border border-brown/20 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/15";

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/login");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nameError = validateName(nickname);
    if (nameError) {
      setError(nameError);
      return;
    }
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), phone: phone.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menyimpan profil.");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
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
              Lengkapi Profil
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Satu langkah lagi! Isi nama panggilan dan nomor HP kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Nama Panggilan
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(sanitizeName(e.target.value))}
                placeholder="Panggil aku..."
                className={inputClass}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Nomor WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                placeholder="08xxxxxxxxxx"
                className={inputClass}
                required
              />
            </div>

            {error && <p className="text-sm text-terracotta">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3 text-sm text-white transition hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Spinner className="h-4 w-4" />}
              {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={null}>
      <CompleteProfileContent />
    </Suspense>
  );
}
