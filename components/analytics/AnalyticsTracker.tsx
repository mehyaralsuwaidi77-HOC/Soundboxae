"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getEventName(path: string): string {
  if (path === "/") return "home_view";
  if (path.startsWith("/gallery")) return "gallery_view";
  if (path.startsWith("/services/")) return "service_view";
  if (path === "/services") return "services_view";
  if (path.startsWith("/products")) return "products_view";
  if (path.startsWith("/about")) return "about_view";
  if (path.startsWith("/faq")) return "faq_view";
  if (path.startsWith("/clients")) return "clients_view";
  if (path.startsWith("/track")) return "tracking_view";
  return "page_view";
}

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
        event_name: getEventName(pathname),
        event_type: "pageview",
        page_path: pathname,
        source: searchParams.get("utm_source") ?? searchParams.get("source") ?? undefined,
        metadata: {
          search: searchParams.toString() || undefined,
          referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
          slug: pathname.startsWith("/services/") ? pathname.replace("/services/", "") : undefined,
        },
      }),
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}
