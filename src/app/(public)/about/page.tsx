import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaAward, FaHeart, FaHandshake, FaCheck } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import HighlightsSection from "@/components/HighlightsSection";
import { eloquia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Tentang Kami - Sempe Dollar Murni",
  description:
    "Sempe Dollar Murni, UMKM camilan renyah khas Temanggung sejak 1986. Dibuat dengan resep turun-temurun, bahan pilihan, dan bersertifikasi halal.",
};

const values = [
  {
    icon: FaAward,
    title: "Kualitas",
    desc: "Bahan terbaik dan standar produksi yang terjaga untuk hasil maksimal.",
  },
  {
    icon: MdVerified,
    title: "Halal & Higienis",
    desc: "Bersertifikasi halal MUI dan diproduksi secara bersih dan aman.",
  },
  {
    icon: FaHeart,
    title: "Tradisi",
    desc: "Resep turun-temurun yang menjaga keaslian cita rasa.",
  },
  {
    icon: FaHandshake,
    title: "Pelayanan",
    desc: "Melayani setiap pelanggan dengan sepenuh hati.",
  },
];

const misi = [
  "Menggunakan bahan-bahan pilihan dan menjaga proses produksi yang higienis.",
  "Melestarikan resep turun-temurun dengan cita rasa yang autentik.",
  "Menghadirkan beragam varian rasa untuk setiap selera.",
  "Mempertahankan sertifikasi halal demi kepercayaan pelanggan.",
];

export default function AboutPage() {
  return (
    <main>
      {/* Banner */}
      <section className="relative flex h-[60vh] items-center justify-center">
        <Image
          src="/images/slider/1.jpg"
          alt="Tentang Sempe Dollar Murni"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-cream via-cream/40 to-black/30" />

        <div className="relative z-10 px-6 text-center">
          <p className="text-sm tracking-widest text-gray-700">
            SEMPE DOLLAR MURNI
          </p>
          <h1
            className={`${eloquia.className} mt-3 text-4xl font-semibold leading-snug md:text-6xl`}
          >
            Tentang <span className="italic">Kami</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-700">
            Camilan renyah khas Temanggung, dibuat dengan tradisi sejak 1986.
          </p>
        </div>
      </section>

      {/* Cerita / Sejarah */}
      <section className="bg-cream-soft py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
              <Image
                src="/images/owner.jpg"
                alt="Pendiri Sempe Dollar Murni"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-4 rounded-2xl border border-brown/10 bg-cream px-5 py-3 shadow-md">
              <p className="text-xs text-brown">Berdiri sejak</p>
              <p className="text-xl font-semibold text-ink">1986</p>
            </div>
          </div>

          <div>
            <p className="text-sm tracking-widest text-brown">CERITA KAMI</p>
            <h2
              className={`${eloquia.className} mt-3 text-3xl font-semibold leading-snug md:text-4xl`}
            >
              Perjalanan Sejak 1986
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              Sempe Dollar Murni lahir di Temanggung pada tahun 1986, berawal
              dari resep keluarga yang diwariskan turun-temurun. Apa yang dimulai
              sebagai usaha rumahan kini telah menjadi bagian dari tradisi
              kuliner yang dikenal banyak orang.
            </p>
            <p className="mt-4 leading-relaxed text-ink/70">
              Produk andalan kami, Sempe, adalah camilan renyah yang dibuat dari
              bahan-bahan pilihan melalui proses yang higienis. Kami terus
              berinovasi menghadirkan beragam varian rasa, tanpa pernah
              meninggalkan cita rasa autentik yang menjadi ciri khas kami.
            </p>
          </div>
        </div>
      </section>

      {/* Angka ringkas */}
      <HighlightsSection />

      {/* Visi & Misi */}
      <section className="bg-cream-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">Visi & Misi</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Arah dan komitmen yang menjadi pijakan kami setiap hari.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-brown/15 bg-cream p-8">
              <h3 className="text-lg font-semibold text-terracotta">Visi</h3>
              <p className="mt-4 leading-relaxed text-ink/70">
                Menjadi produsen camilan khas Temanggung yang dikenal luas berkat
                kualitas, kebersihan, dan cita rasa autentik yang konsisten.
              </p>
            </div>

            <div className="rounded-3xl border border-brown/15 bg-cream p-8">
              <h3 className="text-lg font-semibold text-terracotta">Misi</h3>
              <ul className="mt-4 space-y-3">
                {misi.map((item) => (
                  <li key={item} className="flex gap-3 text-ink/70">
                    <FaCheck className="mt-1 shrink-0 text-sm text-terracotta" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Kami */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Nilai-Nilai Kami
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Prinsip yang kami pegang dalam setiap produk yang kami buat.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-3xl border border-brown/15 bg-cream-soft p-6 text-center"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-xl text-terracotta">
                    <Icon />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-soft py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2
            className={`${eloquia.className} text-3xl font-semibold leading-snug md:text-4xl`}
          >
            Ingin mencoba <span className="italic text-terracotta">Sempe</span>{" "}
            kami?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/60">
            Jelajahi ragam rasa Sempe Dollar Murni atau hubungi kami langsung
            untuk pemesanan.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/product"
              className="inline-block rounded-full bg-terracotta px-8 py-3 text-sm text-white transition hover:bg-brown"
            >
              Lihat Produk
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-full border border-brown/30 px-8 py-3 text-sm text-ink transition hover:bg-cream"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
