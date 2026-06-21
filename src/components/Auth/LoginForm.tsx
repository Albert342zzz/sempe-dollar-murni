"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: hubungkan dengan sistem autentikasi (mis. API / NextAuth).
    // Untuk saat ini, langsung arahkan ke dashboard admin sebagai demo.
    router.push("/admin");
  }

  const inputClass =
    "w-full rounded-xl border border-brown/20 px-4 py-3 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/15";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 transition hover:text-terracotta"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink/70">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-brown/30 accent-terracotta"
          />
          Ingat saya
        </label>
        <a href="#" className="text-terracotta transition hover:text-brown">
          Lupa kata sandi?
        </a>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white transition hover:bg-brown"
      >
        Masuk
      </button>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-brown/15" />
        <span className="text-xs text-ink/50">atau</span>
        <span className="h-px flex-1 bg-brown/15" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-brown/20 px-6 py-3 text-sm text-ink transition hover:bg-cream-soft"
      >
        <FaGoogle className="text-base text-terracotta" />
        Masuk dengan Google
      </button>
    </form>
  );
}
