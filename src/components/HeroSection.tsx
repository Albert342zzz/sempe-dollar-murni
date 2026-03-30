import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { eloquia } from "@/lib/fonts";

export default function HeroSection() {
  return (
    <section className="relative h-screen bg-background pt-50 md:pt-40 -mt-20 overflow-hidden">
      <div className="relative z-20 text-center max-w-3xl mx-auto px-6">
        <p className="text-md tracking-widest text-gray-500">
          SEMPE DOLLAR MURNI
        </p>

        <h1
          className={`${eloquia.className} text-3xl md:text-5xl font-semibold leading-snug`}
        >
          Dibuat dengan <span className="italic">tradisi</span>,
          <br />
          disempurnakan oleh <span className="italic">waktu</span>
        </h1>
      </div>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2
        w-[250%] md:w-[140%] h-190 md:h-120 
        rounded-t-[50%] md:rounded-t-[100%] 
        overflow-hidden z-10"
      >
        <Image
          src="/images/heroProduct.webp"
          alt="Sempe Dollar Murni Background"
          fill
          priority
          sizes="100vw"
          className="object-contain opacity-60 scale-110 md:scale-220"
        />

        <div className="absolute inset-0 bg-white/30" />
      </div>

      <div className="relative z-20 mt-100 md:mt-65 text-center text-2xl max-w-3xl mx-auto px-6">
        <p className={`${eloquia.className} italic mt-4 text-gray-600`}>
          Ragam rasa yang berbeda, dengan cinta yang sama
        </p>
      </div>
    </section>
  );
}
