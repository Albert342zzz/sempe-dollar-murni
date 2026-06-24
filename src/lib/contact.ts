// Pusat data kontak Sempe Dollar Murni.
// Ganti seluruh nilai placeholder di bawah dengan data resmi perusahaan.
export const contact = {
  whatsapp: "6285156924502", // format internasional, tanpa tanda "+"
  whatsappDisplay: "0851-5692-4502",
  email: "info@sempedollarmurni.com",
  address:
    "Jl. Kartini No.42, Margosari, Kertosari, Kec. Temanggung, Kabupaten Temanggung, Jawa Tengah 56216",
  hours: "Senin - Minggu, 07.00 - 22.00 WIB",
  instagram: "https://www.instagram.com/sempe_dollar.murni/",
  facebook:
    "https://www.facebook.com/p/SEMPE-Dollar-MURNI-Temanggung-100069792446177/",
  tokopedia: "https://www.tokopedia.com/sempe-dollar-murni",
  maps: "https://maps.app.goo.gl/R9GxhJm4EVbL8sqi8",
  mapsEmbed:
    "https://maps.google.com/maps?q=-7.3290656,110.1927953&z=16&output=embed",
};

export function waLink(message?: string) {
  const base = `https://wa.me/${contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
