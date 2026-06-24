import { createClient } from "@/lib/supabase/server";

// Returns the currently signed-in Supabase user on the server, or null.
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
