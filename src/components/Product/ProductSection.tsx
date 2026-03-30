import Image from "next/image";
import ToggleButton from "./ToggleButton";

export default function ProductSection() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative w-full min-h-[calc(100vh-80px)]">
          <Image
            src="/images/owner2.jpg"
            alt="Owner"
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-lg mx-auto md:mx-0 p-10">
          <h2 className="text-2xl md:text-3xl font-semibold">Produk Kami</h2>

          <p className="mt-4 text-gray-600">
            Produk kami dibuat dengan resep turun-temurun dan bahan-bahan
            terbaik untuk memastikan kualitas dan cita rasa yang konsisten.
          </p>

          <ToggleButton />

          <div className="mt-10">
            <a
              href="/product"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Selengkapnya
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
