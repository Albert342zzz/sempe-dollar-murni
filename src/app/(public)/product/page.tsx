import type { Metadata } from "next";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiHeart,
  FiStar,
  FiShield,
  FiPackage,
  FiGift,
  FiBox,
  FiShoppingBag,
} from "react-icons/fi";
import ProductShowcase from "@/components/Product/ProductShowcase";
import FlavorRecommender from "@/components/Product/FlavorRecommender";
import WhatsAppLink from "@/components/WhatsAppLink";
import { waLink } from "@/lib/contact";
import { eloquia } from "@/lib/fonts";
import { prisma } from "@/lib/prisma";
import type { PriceMap } from "@/lib/prices";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Sempe, camilan renyah khas Sempe Dollar Murni dari Temanggung, hadir dalam beragam pilihan rasa. Dibuat dengan resep turun-temurun dan bersertifikasi halal.",
};

const WHATSAPP_LINK = waLink(
  "Halo Sempe Dollar Murni, saya ingin memesan Sempe."
);

// Small label above a section title, with accent lines on each side.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-terracotta/40" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
        {children}
      </span>
      <span className="h-px w-8 bg-terracotta/40" />
    </div>
  );
}

const packaging = [
  { icon: FiPackage, size: "250gr", desc: "Pas untuk dinikmati sendiri" },
  { icon: FiGift, size: "500gr", desc: "Ideal untuk keluarga kecil" },
  { icon: FiBox, size: "3kg", desc: "Untuk acara & berbagi" },
  { icon: FiShoppingBag, size: "Grosir", desc: "Pesanan jumlah besar" },
];

const features = [
  {
    icon: FiHeart,
    title: "Resep Turun-Temurun",
    desc: "Cita rasa autentik yang dijaga dari generasi ke generasi.",
  },
  {
    icon: FiStar,
    title: "Bahan Pilihan",
    desc: "Hanya menggunakan bahan terbaik untuk hasil yang maksimal.",
  },
  {
    icon: FiShield,
    title: "Bersertifikasi Halal",
    desc: "Telah tersertifikasi halal MUI dan aman untuk dikonsumsi.",
  },
];

export default async function ProductPage() {
  const flavorPrices = await prisma.flavorPrice.findMany({
    include: { size: true },
  });
  const prices: PriceMap = {};
  for (const fp of flavorPrices) {
    (prices[fp.flavorId] ??= {})[fp.size.label] = fp.price;
  }

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

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {["Sejak 1986", "Halal MUI", "10 Varian Rasa"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-brown/20 bg-cream/70 px-4 py-1.5 text-xs font-medium text-ink/70 backdrop-blur-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mengenal Sempe + Halal */}
      <section className="relative overflow-hidden bg-cream py-20">
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-terracotta/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-cream-soft shadow-sm ring-4 ring-gold/10">
            <Image
              src="/images/logo/halal.png"
              alt="Sertifikasi Halal MUI"
              width={72}
              height={72}
              className="h-14 w-14 object-contain"
            />
          </div>
          <Eyebrow>Tentang Produk</Eyebrow>
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
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <Eyebrow>Penjelajah Rasa</Eyebrow>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Satu Sempe, Banyak Rasa
            </h2>
            <p className="mx-auto max-w-xl text-gray-600">
              Dari original wijen yang gurih hingga manisnya cokelat dan
              brownies. Pilih rasa favoritmu di bawah ini.
            </p>
          </div>

          <div className="mx-auto mb-10 max-w-3xl">
            <FlavorRecommender />
          </div>

          <ProductShowcase prices={prices} />
        </div>
      </section>

      {/* Pilihan Kemasan */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <Eyebrow>Ukuran & Kemasan</Eyebrow>
            <h2 className="text-2xl font-semibold md:text-3xl">Pilihan Kemasan</h2>
            <p className="mx-auto max-w-xl text-gray-600">
              Cocok untuk camilan harian, hampers, maupun pesanan dalam jumlah
              besar.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {packaging.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.size}
                  className="group relative overflow-hidden rounded-3xl border border-brown/15 bg-cream-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-lg hover:shadow-brown/5"
                >
                  <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-terracotta to-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta transition-colors duration-300 group-hover:bg-terracotta group-hover:text-white">
                    <Icon className="text-xl" />
                  </div>
                  <p className="mt-4 text-xl font-semibold">{item.size}</p>
                  <p className="mt-1.5 text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nilai / Keunggulan */}
      <section className="bg-cream-soft py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <Eyebrow>Kenapa Kami</Eyebrow>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Mengapa Memilih Kami
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.title}
                  className="group rounded-3xl border border-brown/15 bg-cream p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brown/5"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="text-2xl text-terracotta" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{k.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {k.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Pemesanan */}
      <section className="bg-cream py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-brown/15 bg-ink px-6 py-16 text-center">
          {/* Decorative accents */}
          <span className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-terracotta/20 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-terracotta via-gold to-terracotta" />

          <div className="relative">
            <h2
              className={`${eloquia.className} text-3xl font-semibold leading-snug text-cream md:text-4xl`}
            >
              Tertarik untuk{" "}
              <span className="italic text-gold">memesan</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              Hubungi kami langsung melalui WhatsApp untuk informasi harga,
              ketersediaan stok, dan pemesanan.
            </p>

            <WhatsAppLink
              href={WHATSAPP_LINK}
              source="product_cta"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3 text-white shadow-lg shadow-terracotta/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brown"
            >
              <FaWhatsapp className="text-lg" />
              Pesan via WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
