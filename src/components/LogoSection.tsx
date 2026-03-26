export default function LogoSection() {
  return (
    <section id="content" className="py-16 px-6 bg-white">
      <div className="container mx-auto text-center">
        <img
          src="/images/logo/halal.png"
          alt="Logo Halal"
          className="mx-auto h-32"
        />
        <h3 className="mt-6 text-black text-2xl font-semibold">
          Bersertifikasi Halal
        </h3>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto text-base">
          Sempe Dollar Murni berkomitmen untuk menyajikan produk terbaik dengan
          memperoleh sertifikasi Halal dari Majelis Ulama Indonesia.
        </p>
      </div>
    </section>
  );
}
