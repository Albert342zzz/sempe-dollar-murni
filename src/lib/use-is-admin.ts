"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Hook: true when the signed-in user has the ADMIN role.
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

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
        .catch(() => {});
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
