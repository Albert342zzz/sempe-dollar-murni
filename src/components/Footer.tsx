import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdAccessTime } from "react-icons/md";
import { BiStore } from "react-icons/bi";
import { FiChevronRight } from "react-icons/fi";
import { contact, waLink } from "@/lib/contact";
import { eloquia } from "@/lib/fonts";

const menuLinks = [
  { label: "Tentang", href: "/about" },
  { label: "Produk", href: "/product" },
  { label: "Galeri", href: "/gallery" },
  { label: "Kontak", href: "/contact" },
];

const socials = [
  { icon: FaInstagram, href: contact.instagram, label: "Instagram" },
  { icon: FaFacebookF, href: contact.facebook, label: "Facebook" },
  { icon: BiStore, href: contact.tokopedia, label: "Tokopedia" },
  { icon: FaWhatsapp, href: waLink(), label: "WhatsApp" },
];

// Column heading with a gold accent underline.
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="relative pb-2.5 text-sm font-semibold tracking-widest text-cream">
      {children}
      <span className="absolute bottom-0 left-0 h-0.5 w-8 rounded-full bg-gold" />
    </h3>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-cream/70">
      {/* Gradient accent line at the top edge */}
      <div className="h-1 w-full bg-linear-to-r from-terracotta via-gold to-terracotta" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_0.8fr_1.4fr]">
        {/* Brand */}
        <div>
          <h2 className={`${eloquia.className} text-2xl text-cream`}>
            Sempe Dollar Murni
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Sempe renyah berkualitas dengan resep turun-temurun dan bahan
            pilihan. Dibuat dengan cinta sejak 1986 di Temanggung.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Bersertifikasi Halal MUI
          </div>

          <div className="mt-6 flex gap-3">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream/80 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-ink hover:shadow-lg hover:shadow-gold/20"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        {/* Menu */}
        <div>
          <ColHeading>MENU</ColHeading>
          <ul className="mt-4 space-y-3 text-sm">
            {menuLinks.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="group inline-flex items-center text-cream/70 transition-colors duration-200 hover:text-gold"
                >
                  <FiChevronRight className="-ml-4 text-gold opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100" />
                  <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                    {m.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <ColHeading>KONTAK</ColHeading>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/5 text-gold">
                <MdLocationOn />
              </span>
              <span className="pt-1.5 leading-relaxed">{contact.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/5 text-gold">
                <FaWhatsapp />
              </span>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold"
              >
                {contact.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/5 text-gold">
                <MdEmail />
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="transition-colors hover:text-gold"
              >
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream/5 text-gold">
                <MdAccessTime />
              </span>
              <span>{contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-cream/50 md:flex-row">
          <p>&copy; {year} Sempe Dollar Murni. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan
            <span className="text-terracotta">&hearts;</span>
            di Temanggung
          </p>
        </div>
      </div>
    </footer>
  );
}
