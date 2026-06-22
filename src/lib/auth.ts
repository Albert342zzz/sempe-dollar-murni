import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "admin_session";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET);

// Buat token sesi (berlaku 7 hari).
export async function createSession(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

// Verifikasi token sesi; null jika tidak valid/expired.
export async function verifySession(
  token?: string
): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}
