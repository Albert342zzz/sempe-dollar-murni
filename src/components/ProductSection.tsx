import Image from "next/image";

export default function ProductSection() {
  return (
    <section>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="max-w-lg mx-auto md:mx-0 p-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Produk Kami</h2>

          <p className="mt-4 text-gray-600">
            Produk kami dibuat dengan resep turun-temurun dan bahan-bahan
            terbaik untuk memastikan kualitas dan cita rasa yang konsisten. Kami
            menawarkan berbagai macam kue kering yang cocok untuk berbagai
            kesempatan, mulai dari perayaan hingga camilan sehari-hari.
          </p>

          <div className="mt-6">
            <a
              href="#"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Selengkapnya
            </a>
          </div>
        </div>

        <div>
          <Image
            src="/images/owner2.jpg"
            alt="Owner"
            width={500}
            height={500}
            className="w-auto h-screen"
          />
        </div>
      </div>
    </section>
  );
}
