"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { waLink } from "@/lib/contact";

export default function ContactForm() {
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [pesan, setPesan] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = `Halo Sempe Dollar Murni,\n\nNama: ${nama}\nNo. Telepon: ${telepon}\n\n${pesan}`;
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border border-brown/20 px-4 py-3 text-sm outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/15";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nama" className="mb-2 block text-sm font-medium">
          Nama
        </label>
        <input
          id="nama"
          type="text"
          required
          value={nama}
          onChange={(e) => setNama(e.target.value)}
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
          required
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
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
          required
          rows={5}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Tuliskan pesan atau pertanyaan Anda..."
          className={`${inputClass} resize-none`}
        />
      </div>

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
