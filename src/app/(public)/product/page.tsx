import type { Metadata } from "next";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import ProductShowcase from "@/components/Product/ProductShowcase";
import { waLink } from "@/lib/contact";
import { eloquia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Produk - Sempe Dollar Murni",
  description:
    "Sempe, camilan renyah khas Sempe Dollar Murni dari Temanggung, hadir dalam beragam pilihan rasa. Dibuat dengan resep turun-temurun dan bersertifikasi halal.",
};

const WHATSAPP_LINK = waLink(
  "Halo Sempe Dollar Murni, saya ingin memesan Sempe."
);

export default function ProductPage() {
  return (
    <main>
      {/* Banner */}
      <section className="relative flex h-[70vh] items-center justify-center">
        <Image
          src="/images/slider/2.jpg"
          alt="Sempe Dollar Murni"
          fill
          priority
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
            Sempe
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-700">
            Satu camilan renyah, ragam rasa istimewa — dibuat dengan cinta dari
            Temanggung.
          </p>
        </div>
      </section>

      {/* Mengenal Sempe + Halal */}
      <section className="bg-cream py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <Image
            src="/images/logo/halal.png"
            alt="Sertifikasi Halal MUI"
            width={72}
            height={72}
            className="h-16 w-16 object-contain"
          />
          <h2 className="text-2xl font-semibold md:text-3xl">Mengenal Sempe</h2>
          <p className="leading-relaxed text-gray-600">
            Sempe adalah camilan renyah yang menjadi produk andalan kami. Dibuat
            dengan resep turun-temurun dan bahan pilihan melalui proses yang
            higienis, kini Sempe hadir dalam beragam pilihan rasa untuk
            memanjakan setiap selera. Seluruh produk telah bersertifikasi halal,
            sehingga aman dinikmati oleh keluarga Anda.
          </p>
        </div>
      </section>

      {/* Penjelajah Rasa */}
      <section className="bg-cream-soft py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Satu Sempe, Banyak Rasa
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Dari original wijen yang gurih hingga manisnya cokelat dan
              brownies. Pilih rasa favoritmu di bawah ini.
            </p>
          </div>

          <ProductShowcase />
        </div>
      </section>

      {/* Pilihan Kemasan */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">Pilihan Kemasan</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            Cocok untuk camilan harian, hampers, maupun pesanan dalam jumlah
            besar.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { size: "250gr", desc: "Pas untuk dinikmati sendiri" },
              { size: "500gr", desc: "Ideal untuk keluarga kecil" },
              { size: "1kg", desc: "Untuk acara & berbagi" },
              { size: "Grosir", desc: "Pesanan jumlah besar" },
            ].map((item) => (
              <div
                key={item.size}
                className="rounded-3xl border border-brown/15 bg-cream-soft p-6 transition hover:shadow-md"
              >
                <p className="text-xl font-semibold">{item.size}</p>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai / Keunggulan */}
      <section className="bg-cream-soft py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Mengapa Memilih Kami
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">Resep Turun-Temurun</h3>
              <p className="mt-2 text-gray-600">
                Cita rasa autentik yang dijaga dari generasi ke generasi.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Bahan Pilihan</h3>
              <p className="mt-2 text-gray-600">
                Hanya menggunakan bahan terbaik untuk hasil yang maksimal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Bersertifikasi Halal</h3>
              <p className="mt-2 text-gray-600">
                Telah tersertifikasi halal MUI dan aman untuk dikonsumsi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Pemesanan */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2
            className={`${eloquia.className} text-3xl font-semibold leading-snug md:text-4xl`}
          >
            Tertarik untuk{" "}
            <span className="italic text-terracotta">memesan</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Hubungi kami langsung melalui WhatsApp untuk informasi harga,
            ketersediaan stok, dan pemesanan.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3 text-white transition hover:bg-brown"
          >
            <FaWhatsapp className="text-lg" />
            Pesan via WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
