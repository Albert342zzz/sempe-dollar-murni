// Pusat data kontak Sempe Dollar Murni.
// Ganti seluruh nilai placeholder di bawah dengan data resmi perusahaan.
export const contact = {
  whatsapp: "6281234567890", // format internasional, tanpa tanda "+"
  whatsappDisplay: "+62 812-3456-7890",
  email: "info@sempedollarmurni.com",
  address: "Temanggung, Jawa Tengah, Indonesia",
  hours: "Senin - Sabtu, 08.00 - 17.00 WIB",
  instagram: "#",
  facebook: "#",
  maps: "https://maps.app.goo.gl/R9GxhJm4EVbL8sqi8",
  mapsEmbed:
    "https://maps.google.com/maps?q=-7.3290656,110.1927953&z=16&output=embed",
};

export function waLink(message?: string) {
  const base = `https://wa.me/${contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
