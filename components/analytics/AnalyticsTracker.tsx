"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (lastTracked.current === url) return;
    lastTracked.current = url;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "page_view",
        event_type: "pageview",
        page_path: pathname,
        source: searchParams.get("utm_source") ?? searchParams.get("source") ?? undefined,
        metadata: {
          search: searchParams.toString() || undefined,
          referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        },
      }),
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}
