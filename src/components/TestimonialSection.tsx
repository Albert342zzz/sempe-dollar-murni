import Reveal from "@/components/Reveal";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

// Testimoni contoh — ganti dengan ulasan pelanggan asli.
const testimonials = [
  {
    quote:
      "Sempe-nya renyah dan rasanya autentik. Jadi favorit keluarga di rumah!",
    name: "Rina Wijaya",
    city: "Temanggung",
  },
  {
    quote:
      "Varian rasanya banyak dan semuanya enak. Cocok banget buat oleh-oleh.",
    name: "Budi Santoso",
    city: "Magelang",
  },
  {
    quote:
      "Pelayanannya ramah dan produknya berkualitas. Sangat direkomendasikan!",
    name: "Sari Andini",
    city: "Semarang",
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 text-center">
          <p className="text-sm tracking-widest text-brown">TESTIMONI</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            Apa Kata Mereka
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className="h-full rounded-3xl border border-brown/15 bg-cream-soft p-6">
                <FaQuoteLeft className="text-xl text-terracotta/40" />
                <p className="mt-4 leading-relaxed text-ink/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <FaStar key={s} className="text-sm" />
                  ))}
                </div>
                <p className="mt-3 font-semibold text-ink">{t.name}</p>
                <p className="text-sm text-ink/50">{t.city}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
