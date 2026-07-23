import type { Metadata } from "next";
import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import {
  MdEmail,
  MdLocationOn,
  MdAccessTime,
  MdStorefront,
} from "react-icons/md";
import ContactForm from "@/components/Contact/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import { contact, waLink } from "@/lib/contact";
import { eloquia } from "@/lib/fonts";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Sempe Dollar Murni, UMKM kue kering asal Temanggung. Pesan produk, ajukan pertanyaan, atau kunjungi kami.",
};

const info = [
  {
    icon: MdLocationOn,
    label: "Alamat",
    value: contact.address,
    href: contact.maps,
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: contact.whatsappDisplay,
    href: waLink(),
  },
  {
    icon: MdEmail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  { icon: MdAccessTime, label: "Jam Operasional", value: contact.hours },
];

export default async function ContactPage() {
  const [outlets, faqs] = await Promise.all([
    prisma.outlet.findMany({ orderBy: { id: "asc" } }),
    prisma.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
  ]);

  return (
    <main>
      {/* Banner */}
      <section className="relative flex h-[60vh] items-center justify-center">
        <Image
          src="/images/slider/3.jpg"
          alt="Kontak Sempe Dollar Murni"
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
            Hubungi <span className="italic">Kami</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-700">
            Ada pertanyaan atau ingin memesan? Kami senang mendengar dari Anda.
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="bg-cream py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          {/* Info kontak */}
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Informasi Kontak
            </h2>
            <p className="mt-3 text-gray-600">
              Hubungi kami melalui kanal di bawah ini, atau kirim pesan langsung
              lewat formulir.
            </p>

            <ul className="mt-8 space-y-6">
              {info.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-lg text-terracotta">
                      <Icon />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.label}
                      </p>
                      <p className="mt-1 text-gray-600">{item.value}</p>
                    </div>
                  </div>
                );

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transition hover:opacity-80"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex gap-3">
              <a
                href={contact.instagram}
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brown/20 transition hover:bg-gold/15"
              >
                <FaInstagram />
              </a>
              <a
                href={contact.facebook}
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brown/20 transition hover:bg-gold/15"
              >
                <FaFacebookF />
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brown/20 transition hover:bg-gold/15"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Formulir */}
          <div className="rounded-3xl border border-brown/15 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Kirim Pesan</h2>
            <p className="mt-2 text-sm text-gray-600">
              Isi formulir berikut dan pesan Anda akan diteruskan ke WhatsApp
              kami.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Peta */}
      <section className="bg-cream pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl border border-brown/15 shadow-sm">
            <iframe
              title="Lokasi Sempe Dollar Murni"
              src={contact.mapsEmbed}
              className="h-80 w-full md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Where to find our products — hidden when there are no outlets */}
      {outlets.length > 0 && (
        <section className="bg-cream-soft py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Temukan Produk Kami di
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-600">
              Selain lewat WhatsApp, produk kami juga tersedia di beberapa toko
              rekanan berikut.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {outlets.map((o) => (
              <div
                key={o.id}
                className="rounded-3xl border border-brown/15 bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brown/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-terracotta/10 text-xl text-terracotta">
                  <MdStorefront />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{o.name}</h3>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm text-gray-600">
                  <MdLocationOn className="mt-0.5 shrink-0 text-terracotta/70" />
                  <span>{o.address}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>
      )}

      {/* FAQ — hidden when there are no questions */}
      {faqs.length > 0 && (
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 text-center">
              <p className="text-sm tracking-widest text-brown">FAQ</p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-600">
                Belum menemukan jawabannya? Hubungi kami langsung lewat WhatsApp.
              </p>
            </div>

            <FaqAccordion
              items={faqs.map((f) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
              }))}
            />
          </div>
        </section>
      )}
    </main>
  );
}
