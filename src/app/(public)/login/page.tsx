import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/Auth/LoginForm";
import { eloquia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Masuk - Sempe Dollar Murni",
  description: "Masuk ke akun Sempe Dollar Murni Anda.",
};

export default function LoginPage() {
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
              Masuk
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Ingin memesan? Masuk terlebih dahulu untuk membuat pesanan.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-ink/60">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-terracotta hover:text-brown">
              Daftar di sini
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
