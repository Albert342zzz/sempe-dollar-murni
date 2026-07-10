"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/track";

type Props = {
  href: string;
  source: string;
  meta?: Record<string, unknown>;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

// Anchor to WhatsApp that logs a `wa_click` event before navigating.
export default function WhatsAppLink({
  href,
  source,
  meta,
  children,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("wa_click", { source, ...meta })}
      {...rest}
    >
      {children}
    </a>
  );
}
