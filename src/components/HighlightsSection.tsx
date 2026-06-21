import Reveal from "@/components/Reveal";

const highlights = [
  { value: "1986", label: "Berdiri Sejak" },
  { value: "100% Halal", label: "Sertifikasi MUI" },
  { value: "10 Rasa", label: "Varian Sempe" },
  { value: "Temanggung", label: "Diproduksi di" },
];

export default function HighlightsSection({
  className = "bg-cream",
}: {
  className?: string;
}) {
  return (
    <section className={`${className} py-16`}>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 px-6 md:grid-cols-4">
        {highlights.map((item, i) => (
          <Reveal
            key={item.label}
            delay={i * 80}
            className="flex flex-col items-center text-center md:border-r md:border-brown/20 md:last:border-none"
          >
            <span className="text-2xl font-semibold text-ink md:text-3xl">
              {item.value}
            </span>
            <span className="mt-2 h-0.5 w-8 rounded-full bg-gold" />
            <span className="mt-3 text-sm tracking-wide text-brown">
              {item.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
