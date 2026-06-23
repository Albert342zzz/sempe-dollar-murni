import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

// Check the admin session from the cookie (used in Server Actions / Route
// Handlers — Node runtime, not edge). Do NOT import this from proxy.ts.
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return (await verifySession(token)) !== null;
}
