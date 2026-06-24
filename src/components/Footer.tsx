import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { BiStore } from "react-icons/bi";
import { contact, waLink } from "@/lib/contact";
import { eloquia } from "@/lib/fonts";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className={`${eloquia.className} text-2xl text-cream`}>
            Sempe Dollar Murni
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Sempe renyah berkualitas dengan resep turun-temurun dan bahan
            pilihan. Dibuat dengan cinta sejak 1986 di Temanggung.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-gold hover:text-ink"
            >
              <FaInstagram />
            </a>
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-gold hover:text-ink"
            >
              <FaFacebookF />
            </a>
            <a
              href={contact.tokopedia}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tokopedia"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-gold hover:text-ink"
            >
              <BiStore />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-gold hover:text-ink"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="text-sm font-semibold tracking-widest text-cream">
            NAVIGASI
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/about" className="transition hover:text-gold">
                Tentang
              </Link>
            </li>
            <li>
              <Link href="/product" className="transition hover:text-gold">
                Produk
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="transition hover:text-gold">
                Galeri
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-gold">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-sm font-semibold tracking-widest text-cream">
            KONTAK
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MdLocationOn className="mt-0.5 shrink-0 text-gold" />
              <span>{contact.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <FaWhatsapp className="shrink-0 text-gold" />
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gold"
              >
                {contact.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MdEmail className="shrink-0 text-gold" />
              <a
                href={`mailto:${contact.email}`}
                className="transition hover:text-gold"
              >
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-cream/50 md:flex-row">
          <p>
            &copy; {year} Sempe Dollar Murni. Seluruh hak cipta dilindungi.
          </p>
          <p>Bersertifikasi Halal MUI</p>
        </div>
      </div>
    </footer>
  );
}
