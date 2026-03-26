import { FiMenu, FiX } from "react-icons/fi";

type MobileMenuProps = {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
};

export default function HamburgerButton({
  menuOpen,
  setMenuOpen,
}: MobileMenuProps) {
  return (
    <button
      className="md:hidden text-2xl z-50 ml-auto relative w-8 h-8"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <FiMenu
        className={`absolute inset-0 m-auto transition-all duration-300 ${menuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}
      />
      <FiX
        className={`absolute inset-0 m-auto transition-all duration-300 ${menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
      />
    </button>
  );
}
