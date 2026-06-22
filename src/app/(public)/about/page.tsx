import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaAward, FaHeart, FaHandshake, FaCheck } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import HighlightsSection from "@/components/HighlightsSection";
import Reveal from "@/components/Reveal";
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

const timeline = [
  {
    year: "1986",
    label: "Berdiri",
    desc: "Usaha dimulai dari dapur rumah dengan resep keluarga turun-temurun.",
  },
  {
    year: "2000-an",
    label: "Berkembang",
    desc: "Produksi meluas dan mulai dikenal di pasar lokal Temanggung.",
  },
  {
    year: "2010-an",
    label: "Ragam Rasa",
    desc: "Inovasi menghadirkan 10 varian rasa untuk menjangkau lebih banyak selera.",
  },
  {
    year: "Kini",
    label: "Halal & Digital",
    desc: "Bersertifikasi halal MUI, melayani pesanan online & offline.",
    active: true,
  },
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
          <Reveal className="relative">
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
          </Reveal>

          <div>
            <Reveal>
              <p className="text-sm tracking-widest text-brown">CERITA KAMI</p>
              <h2
                className={`${eloquia.className} mt-3 text-3xl font-semibold leading-snug md:text-4xl`}
              >
                Perjalanan Sejak 1986
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                Sempe Dollar Murni lahir di Temanggung pada tahun 1986, berawal
                dari resep keluarga yang diwariskan turun-temurun. Apa yang
                dimulai sebagai usaha rumahan kini telah menjadi bagian dari
                tradisi kuliner yang dikenal banyak orang.
              </p>
              <p className="mt-4 leading-relaxed text-ink/70">
                Produk andalan kami, Sempe, adalah camilan renyah yang dibuat
                dari bahan-bahan pilihan melalui proses yang higienis. Kami
                terus berinovasi menghadirkan beragam varian rasa, tanpa pernah
                meninggalkan cita rasa autentik yang menjadi ciri khas kami.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="text-sm tracking-widest text-brown">PERJALANAN</p>
            <h2
              className={`${eloquia.className} mt-3 text-2xl font-semibold md:text-3xl`}
            >
              Lebih dari Tiga{" "}
              <span className="italic text-terracotta">Dekade</span>
            </h2>
          </Reveal>

          <div className="relative">
            {/* Garis penghubung (desktop) */}
            <div className="absolute top-5 left-[12.5%] right-[12.5%] hidden h-px bg-brown/20 md:block" />

            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
              {timeline.map((t, i) => (
                <Reveal
                  key={t.year}
                  delay={i * 120}
                  className="flex flex-col items-center text-center"
                >
                  {/* Titik */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm ${
                      t.active
                        ? "border-terracotta bg-terracotta"
                        : "border-brown/30 bg-cream"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        t.active ? "bg-white" : "bg-terracotta"
                      }`}
                    />
                  </div>

                  <p
                    className={`mt-4 text-lg font-semibold ${
                      t.active ? "text-terracotta" : "text-ink"
                    }`}
                  >
                    {t.year}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {t.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {t.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Angka ringkas */}
      <HighlightsSection />

      {/* Visi & Misi */}
      <section className="bg-cream-soft py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-12 text-center">
            <p className="text-sm tracking-widest text-brown">ARAH KAMI</p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Visi & Misi
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Arah dan komitmen yang menjadi pijakan kami setiap hari.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-brown/15 bg-cream p-8">
                <h3 className="text-lg font-semibold text-terracotta">Visi</h3>
                <p className="mt-4 leading-relaxed text-ink/70">
                  Menjadi produsen camilan khas Temanggung yang dikenal luas
                  berkat kualitas, kebersihan, dan cita rasa autentik yang
                  konsisten.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="h-full rounded-3xl border border-brown/15 bg-cream p-8">
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* Nilai Kami */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-12 text-center">
            <p className="text-sm tracking-widest text-brown">
              NILAI-NILAI KAMI
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Prinsip yang Kami Pegang
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/60">
              Nilai yang kami jaga dalam setiap produk yang kami buat.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={i * 80}>
                  <div className="h-full rounded-3xl border border-brown/15 bg-cream-soft p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-xl text-terracotta">
                      <Icon />
                    </span>
                    <h3 className="mt-4 font-semibold text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {value.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-soft py-16 md:py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <h2
            className={`${eloquia.className} text-3xl font-semibold leading-snug md:text-4xl`}
          >
            Ingin mencoba{" "}
            <span className="italic text-terracotta">Sempe</span> kami?
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
        </Reveal>
      </section>
    </main>
  );
}