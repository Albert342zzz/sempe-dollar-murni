import type { Metadata } from "next";
import Image from "next/image";
import GalleryGrid from "@/components/Gallery/GalleryGrid";
import { eloquia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Galeri - Sempe Dollar Murni",
  description:
    "Galeri foto produk dan dokumentasi Sempe Dollar Murni, UMKM kue kering asal Temanggung.",
};

export default function GalleryPage() {
  return (
    <main>
      {/* Banner */}
      <section className="relative flex h-[60vh] items-center justify-center">
        <Image
          src="/images/slider/1.jpg"
          alt="Galeri Sempe Dollar Murni"
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
            Galeri <span className="italic">Kami</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-700">
            Sekilas momen, produk, dan proses di balik setiap kue kering yang
            kami buat.
          </p>
        </div>
      </section>

      {/* Grid Galeri */}
      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-6">
          <GalleryGrid />
        </div>
      </section>
    </main>
  );
}
