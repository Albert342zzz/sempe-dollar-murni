"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Hook: true/false when the ADMIN role is known, null while still checking
// (so callers can avoid rendering transitional UI before the status settles).
export function useIsAdmin(): boolean | null {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    function load(hasUser: boolean) {
      if (!hasUser) {
        setIsAdmin(false);
        return;
      }
      fetch("/api/profile")
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => {
          if (active) setIsAdmin(p?.role === "ADMIN");
        })
        .catch(() => {
          if (active) setIsAdmin(false);
        });
    }

    supabase.auth.getUser().then(({ data }) => load(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      load(!!session?.user)
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return isAdmin;
}
