import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "admin_session";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET);

// Create a session token (valid 1 hour — matches the user session auto-logout).
export async function createSession(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret());
}

// Verify a session token; null if invalid or expired.
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
