import Image from "next/image";

export default function OwnerSection() {
  return (
    <section>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <Image
            src="/images/owner.jpg"
            alt="Owner"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>

        <div className="max-w-lg mx-auto md:mx-0 p-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Cerita Kami</h2>

          <p className="mt-4 text-gray-600">
            Didirikan pada tahun 1986, Sempe Dollar Murni telah menjadi bagian
            dari tradisi kuliner Indonesia selama lebih dari tiga dekade. Kami
            memulai perjalanan kami dengan tekad untuk menghadirkan kue kering
            berkualitas tinggi yang dapat dinikmati oleh semua orang. Dengan
            menggunakan resep turun-temurun dan bahan-bahan terbaik, kami telah
            berhasil menciptakan produk yang tidak hanya lezat tetapi juga
            memiliki cita rasa autentik yang disukai oleh banyak orang.
          </p>

          <p className="mt-4 text-gray-600">
            Kami bangga menjadi bagian dari momen-momen spesial dalam kehidupan
            pelanggan kami, dan kami berkomitmen untuk terus memberikan produk
            berkualitas tinggi yang dapat dinikmati oleh semua orang.
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
      </div>
    </section>
  );
}
