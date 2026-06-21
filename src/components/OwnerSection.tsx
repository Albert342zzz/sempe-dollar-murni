import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { eloquia } from "@/lib/fonts";

export default function OwnerSection() {
  return (
    <section className="bg-cream-soft py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        {/* Teks */}
        <Reveal>
          <p className="text-sm tracking-widest text-brown">CERITA KAMI</p>

          <h2
            className={`${eloquia.className} mt-3 text-3xl font-semibold leading-snug md:text-4xl`}
          >
            Tradisi yang Terus{" "}
            <span className="italic text-terracotta">Hidup</span>
          </h2>

          <p className="mt-4 leading-relaxed text-ink/70">
            Didirikan pada tahun 1986, Sempe Dollar Murni telah menjadi bagian
            dari tradisi kuliner selama lebih dari tiga dekade. Berawal dari
            resep keluarga, kami bertekad menghadirkan camilan renyah berkualitas
            yang bisa dinikmati semua orang.
          </p>
          <p className="mt-4 leading-relaxed text-ink/70">
            Dengan resep turun-temurun dan bahan-bahan terbaik, kami bangga
            menjadi bagian dari momen spesial pelanggan, dan terus berkomitmen
            menjaga cita rasa autentik di setiap produk.
          </p>

          <Link
            href="/about"
            className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:-translate-y-0.5 hover:bg-brown hover:shadow-md"
          >
            Selengkapnya
          </Link>
        </Reveal>

        {/* Gambar */}
        <Reveal delay={100} className="relative">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/owner.jpg"
              alt="Pendiri Sempe Dollar Murni"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-2xl border border-brown/10 bg-cream px-5 py-3 shadow-md">
            <p className="text-xs text-brown">Berdiri sejak</p>
            <p className="text-xl font-semibold text-ink">1986</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
