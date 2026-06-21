import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { eloquia } from "@/lib/fonts";
import { flavors, sizes, getPrice, formatRupiah } from "@/lib/flavors";

export default function ProductSection() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        {/* Gambar produk */}
        <Reveal className="relative">
          <div className="group relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] bg-cream-soft">
            <Image
              src="/images/product3.png"
              alt="Sempe Dollar Murni"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Badge halal */}
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-cream/90 px-3 py-2 shadow-sm backdrop-blur">
            <Image
              src="/images/logo/halal.png"
              alt="Halal MUI"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="pr-1 text-xs font-medium text-ink">Halal MUI</span>
          </div>
        </Reveal>

        {/* Teks */}
        <div>
          <Reveal delay={100}>
            <p className="text-sm tracking-widest text-brown">PRODUK ANDALAN</p>

            <h2
              className={`${eloquia.className} mt-3 text-3xl font-semibold leading-snug md:text-4xl`}
            >
              Satu Sempe,{" "}
              <span className="italic text-terracotta">banyak rasa</span>
            </h2>

            <p className="mt-4 leading-relaxed text-ink/70">
              Camilan renyah khas Temanggung yang dibuat dari resep
              turun-temurun. Nikmati Sempe dalam beragam pilihan rasa — dari
              original wijen yang gurih hingga manis legitnya cokelat dan
              brownies.
            </p>
          </Reveal>

          {/* Preview rasa — klik untuk lihat produk */}
          <Reveal delay={250} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {flavors.map((f) => (
                <Link
                  key={f.id}
                  href="/product"
                  className="group/chip inline-flex items-center gap-2 rounded-full border border-brown/15 bg-cream-soft px-3 py-1.5 text-sm text-ink/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-brown/30 hover:shadow-sm"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover/chip:scale-150"
                    style={{ backgroundColor: f.accent }}
                  />
                  {f.name}
                </Link>
              ))}
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={400} className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/product"
                className="inline-block rounded-full bg-terracotta px-6 py-3 text-sm text-white transition hover:-translate-y-0.5 hover:bg-brown hover:shadow-md"
              >
                Lihat Semua Rasa
              </Link>
              <span className="text-sm text-ink/60">
                Mulai {formatRupiah(getPrice(sizes[0]))}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
