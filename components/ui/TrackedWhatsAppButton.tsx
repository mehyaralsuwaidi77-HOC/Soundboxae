"use client";

interface Props {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  source?: string;
  service?: string;
}

export default function TrackedWhatsAppButton({
  href,
  className,
  style,
  children,
  source = "unknown",
  service,
}: Props) {
  function handleClick() {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "whatsapp_click",
        event_type: "engagement",
        source,
        metadata: { service: service ?? null, href },
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
