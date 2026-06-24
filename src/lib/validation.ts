// Shared form validation helpers (used by both the API and client-side forms).

// Name / nickname: letters and spaces only, 2–40 characters.
export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return "Nama wajib diisi.";
  if (v.length < 2) return "Nama terlalu pendek.";
  if (v.length > 40) return "Nama terlalu panjang.";
  if (!/^[a-zA-Z\s]+$/.test(v)) {
    return "Nama hanya boleh berisi huruf.";
  }
  return null;
}

// Input sanitizer: strips anything that isn't a letter or space.
export function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, "");
}

// Input sanitizer: keeps digits and a leading "+", caps at 16 characters.
export function sanitizePhone(value: string): string {
  return value
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "")
    .slice(0, 16);
}

// Strips spaces, dashes, and parentheses from a phone number.
export function normalizePhone(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

// Indonesian WhatsApp number: 08xxxx / +628xxxx / 628xxxx (10–15 digits total).
export function validatePhone(value: string): string | null {
  const v = normalizePhone(value);
  if (!v) return "Nomor WhatsApp wajib diisi.";
  if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(v)) {
    return "Format nomor WhatsApp tidak valid (contoh: 08123456789).";
  }
  return null;
}

// Free-text message: non-empty, at least a few characters.
export function validateMessage(value: string): string | null {
  const v = value.trim();
  if (!v) return "Pesan wajib diisi.";
  if (v.length < 5) return "Pesan terlalu pendek.";
  return null;
}
