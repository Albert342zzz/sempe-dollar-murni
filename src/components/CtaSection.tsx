import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import WhatsAppLink from "@/components/WhatsAppLink";
import { waLink } from "@/lib/contact";
import { eloquia } from "@/lib/fonts";

export default function CtaSection() {
  return (
    <section className="bg-cream-soft py-20">
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <h2
          className={`${eloquia.className} text-3xl font-semibold leading-snug md:text-4xl`}
        >
          Siap menikmati <span className="italic text-terracotta">Sempe</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/60">
          Pesan sekarang dan rasakan camilan renyah khas Temanggung langsung di
          rumah Anda.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <WhatsAppLink
            href={waLink("Halo Sempe Dollar Murni, saya ingin memesan Sempe.")}
            source="home"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3 text-sm text-white transition hover:-translate-y-0.5 hover:bg-brown hover:shadow-md"
          >
            <FaWhatsapp className="text-base" />
            Pesan via WhatsApp
          </WhatsAppLink>
          <Link
            href="/product"
            className="inline-block rounded-full border border-brown/30 px-8 py-3 text-sm text-ink transition hover:bg-cream"
          >
            Lihat Produk
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
