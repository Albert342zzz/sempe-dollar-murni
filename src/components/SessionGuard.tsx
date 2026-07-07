"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Auto-logout once a session is 1 hour old. After that the UI returns to the
// guest state (login icon). The login time is stored in localStorage so it
// survives closing and reopening the tab.
const MAX_SESSION_MS = 60 * 60 * 1000; // 1 hour
const LOGIN_AT_KEY = "sdm_login_at";

export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function logout() {
      localStorage.removeItem(LOGIN_AT_KEY);
      await supabase.auth.signOut();
      await fetch("/api/admin/logout").catch(() => {});
      router.refresh();
    }

    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        localStorage.removeItem(LOGIN_AT_KEY);
        return;
      }
      let loginAt = Number(localStorage.getItem(LOGIN_AT_KEY));
      if (!loginAt) {
        // Session exists but no login time recorded yet → start counting from now.
        loginAt = Date.now();
        localStorage.setItem(LOGIN_AT_KEY, String(loginAt));
      }
      if (Date.now() - loginAt > MAX_SESSION_MS) {
        await logout();
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        localStorage.removeItem(LOGIN_AT_KEY);
      } else if (!localStorage.getItem(LOGIN_AT_KEY)) {
        // New login → record the time (do not overwrite if already set).
        localStorage.setItem(LOGIN_AT_KEY, String(Date.now()));
      }
    });

    check();
    const timer = setInterval(check, 60 * 1000); // check every minute

    return () => {
      sub.subscription.unsubscribe();
      clearInterval(timer);
    };
  }, [router]);

  return null;
}
