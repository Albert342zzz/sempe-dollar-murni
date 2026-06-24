"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { waLink } from "@/lib/contact";
import {
  validateName,
  validatePhone,
  validateMessage,
  sanitizeName,
  sanitizePhone,
} from "@/lib/validation";

export default function ContactForm() {
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nameError = validateName(nama);
    if (nameError) return setError(nameError);
    const phoneError = validatePhone(telepon);
    if (phoneError) return setError(phoneError);
    const msgError = validateMessage(pesan);
    if (msgError) return setError(msgError);

    const message = `Halo Sempe Dollar Murni,\n\nNama: ${nama.trim()}\nNo. Telepon: ${telepon.trim()}\n\n${pesan.trim()}`;
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border border-brown/20 px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/15";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="nama" className="mb-2 block text-sm font-medium">
          Nama
        </label>
        <input
          id="nama"
          type="text"
          value={nama}
          onChange={(e) => setNama(sanitizeName(e.target.value))}
          placeholder="Nama lengkap Anda"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="telepon" className="mb-2 block text-sm font-medium">
          No. Telepon
        </label>
        <input
          id="telepon"
          type="tel"
          inputMode="numeric"
          value={telepon}
          onChange={(e) => setTelepon(sanitizePhone(e.target.value))}
          placeholder="08xxxxxxxxxx"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pesan" className="mb-2 block text-sm font-medium">
          Pesan
        </label>
        <textarea
          id="pesan"
          rows={5}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Tuliskan pesan atau pertanyaan Anda..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-terracotta px-8 py-3 text-white transition hover:bg-brown"
      >
        <FaWhatsapp className="text-lg" />
        Kirim via WhatsApp
      </button>
    </form>
  );
}
