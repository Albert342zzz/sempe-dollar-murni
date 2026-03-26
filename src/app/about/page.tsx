import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Tentang Kami - Sempe Dollar Murni",
  description:
    "Pelajari lebih lanjut tentang Sempe Dollar Murni, brand penyedia produk berkualitas dengan sertifikasi halal dari MUI.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src="/images/slider/1.jpg"
          alt="About Banner"
          fill
          className="object-cover"
          priority
        />

        {/* <div className="absolute inset-0 bg-linear-to-r from-black/70  to-50% from-50% to-white" /> */}
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 via-0% to-white" /> */}
        <div
          className="absolute inset-0 
  bg-linear-to-r 
  from-transparent 
  via-white/30 
  to-white"
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 items-center">
          <div></div>

          <div className="text-black">
            <h1 className="text-4xl md:text-5xl font-bold">Tentang Dollar</h1>

            <p className="mt-4 text-gray-700">
              Sempe Dollar Murni berkomitmen menghadirkan kue kering berkualitas
              dengan bahan terbaik dan telah bersertifikasi halal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-black">
            Cerita Kami
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Sempe Dollar Murni adalah produk kue kering tradisional yang
            mengutamakan kualitas dan cita rasa autentik. Kami berkomitmen untuk
            menghadirkan produk terbaik dengan bahan pilihan dan proses produksi
            yang higienis serta telah bersertifikasi halal.
          </p>
        </div>
      </section>

      <section className="">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <div>
            <Image
              src="/images/owner2.jpg"
              alt="Owner"
              width={300}
              height={300}
              className="w-full h-80 object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Komitmen Kami
            </h2>

            <p className="mt-4 text-gray-600">
              Kami percaya bahwa kualitas adalah kunci utama. Oleh karena itu,
              setiap produk dibuat dengan standar tinggi untuk memastikan rasa
              yang konsisten dan kepuasan pelanggan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Nilai Kami</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div>
              <h3 className="font-semibold text-lg">Kualitas</h3>
              <p className="text-gray-600 mt-2">
                Menggunakan bahan terbaik untuk hasil maksimal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Kepercayaan</h3>
              <p className="text-gray-600 mt-2">
                Produk telah bersertifikasi halal dan aman dikonsumsi.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Tradisi</h3>
              <p className="text-gray-600 mt-2">
                Menjaga cita rasa khas yang autentik.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
