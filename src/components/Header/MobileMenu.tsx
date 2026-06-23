import Link from "next/link";
import Image from "next/image";
import { BiShoppingBag, BiLogIn } from "react-icons/bi";

type MobileMenuProps = {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
};

export default function MobileMenu({ menuOpen, setMenuOpen }: MobileMenuProps) {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full bg-cream z-40 transform transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/">
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={275}
              height={200}
              className="h-12 w-auto md:h-16 lg:h-20"
            />
          </Link>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-ink">
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            Tentang
          </Link>
          <Link href="/product" onClick={() => setMenuOpen(false)}>
            Produk
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Kontak
          </Link>
          <Link href="/gallery" onClick={() => setMenuOpen(false)}>
            Galeri
          </Link>

          <div className="pt-4 border-t flex gap-4 text-xl">
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              aria-label="Keranjang Saya"
            >
              <BiShoppingBag />
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              aria-label="Masuk"
            >
              <BiLogIn />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
