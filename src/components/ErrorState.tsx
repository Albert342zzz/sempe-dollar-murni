import Image from "next/image";
import Link from "next/link";
import { FiHome, FiRotateCw } from "react-icons/fi";
import { eloquia } from "@/lib/fonts";

// Shared, self-contained visual for the 404 and error pages. It doesn't rely on
// the public Header/Footer (those live in the (public) group), so it renders
// correctly for any route — including crashes in the root layout.
export default function ErrorState({
  code,
  title,
  message,
  onRetry,
}: {
  code: string;
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-soft px-6 py-16 text-center">
      <Link href="/" className="inline-block">
        <Image
          src="/images/logo/logo.png"
          alt="Sempe Dollar Murni"
          width={150}
          height={60}
          priority
          className="h-16 w-auto object-contain"
        />
      </Link>

      <p
        className={`${eloquia.className} mt-10 text-7xl font-semibold text-terracotta md:text-8xl`}
      >
        {code}
      </p>

      <h1 className="mt-4 text-2xl font-semibold text-ink md:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
        {message}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:bg-brown"
        >
          <FiHome /> Kembali ke Beranda
        </Link>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full border border-brown/25 px-6 py-3 text-sm text-ink/70 transition hover:border-terracotta/50 hover:text-terracotta"
          >
            <FiRotateCw /> Coba Lagi
          </button>
        )}
      </div>
    </main>
  );
}
