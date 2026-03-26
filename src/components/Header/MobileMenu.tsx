import Link from "next/link";
import { BiShoppingBag, BiLogIn } from "react-icons/bi";

type MobileMenuProps = {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
};

export default function MobileMenu({ menuOpen, setMenuOpen }: MobileMenuProps) {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white z-40 transform transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/">
            <img
              className="h-12 md:h-16 lg:h-20"
              src="/images/logo/logo.png"
              alt="Logo"
            />
          </Link>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-black">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Beranda
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            Tentang Kami
          </Link>
          <Link href="/product" onClick={() => setMenuOpen(false)}>
            Produk
          </Link>
          <Link href="/store" onClick={() => setMenuOpen(false)}>
            Lokasi
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Kontak
          </Link>
          <Link href="/gallery" onClick={() => setMenuOpen(false)}>
            Galeri
          </Link>

          <div className="pt-4 border-t flex gap-4 text-xl">
            <BiShoppingBag />
            <BiLogIn />
          </div>
        </nav>
      </div>
    </>
  );
}
