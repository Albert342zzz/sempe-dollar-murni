"use client";

import { useRouter } from "next/navigation";

// Makes the whole report row clickable, not just the period link. The inner
// <Link> is kept for keyboard/screen-reader navigation and middle-click; this
// only adds the mouse affordance. Clicks on interactive children (the delete
// button and its dialog) are ignored so they don't navigate.
export default function ReportRow({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <tr
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a,button,[role='dialog']")) return;
        router.push(href);
      }}
      className="cursor-pointer border-b border-brown/5 transition last:border-0 hover:bg-cream-soft"
    >
      {children}
    </tr>
  );
}
