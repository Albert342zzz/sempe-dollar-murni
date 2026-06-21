import Reveal from "@/components/Reveal";
import { FaHeart, FaLeaf, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const features = [
  {
    icon: FaHeart,
    title: "Resep Turun-Temurun",
    desc: "Cita rasa autentik yang dijaga sejak 1986.",
  },
  {
    icon: FaLeaf,
    title: "Bahan Pilihan",
    desc: "Dibuat dari bahan terbaik untuk hasil yang maksimal.",
  },
  {
    icon: MdVerified,
    title: "Bersertifikasi Halal",
    desc: "Telah tersertifikasi halal MUI dan aman dikonsumsi.",
  },
  {
    icon: FaStar,
    title: "Ragam Rasa",
    desc: "Sepuluh varian rasa untuk memanjakan setiap selera.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12 text-center">
          <p className="text-sm tracking-widest text-brown">MENGAPA KAMI</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            Mengapa Memilih Sempe Dollar Murni
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Kualitas dan cita rasa yang konsisten dalam setiap kemasan.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={i * 100}>
                <div className="h-full rounded-3xl border border-brown/15 bg-cream-soft p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-xl text-terracotta">
                    <Icon />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
