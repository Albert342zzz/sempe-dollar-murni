import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Returns the currently signed-in Supabase user on the server, or null.
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// True if the given user has the ADMIN role. Admins have no customer-facing
// cart or order history, so customer pages use this to redirect them away.
export async function isAdminUser(userId: string): Promise<boolean> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { role: true },
  });
  return profile?.role === "ADMIN";
}
