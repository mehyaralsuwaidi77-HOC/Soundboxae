"use client";

import { MessageCircle, Mail } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { whatsappQuickQuote } from "@/lib/whatsapp";

const EMAIL_ADDRESS = "info@soundboxdubai.com";

export default function FloatingTabs() {
  const { whatsappNumber } = useSettings();
  const waUrl = whatsappQuickQuote(whatsappNumber);

  function trackEvent(name: string) {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: name, event_type: "engagement", source: "floating_tab" }),
    }).catch(() => {});
  }

  return (
    <div
      className="fixed right-0 z-40 flex flex-col gap-2 hidden sm:flex"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {/* WhatsApp tab */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("quick_whatsapp_quote_click")}
        aria-label="WhatsApp Soundbox Dubai"
        className="group flex items-center gap-0 rounded-l-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #25D366, #1DA851)",
          boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(-4px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
      >
        <span
          className="flex items-center justify-center w-[46px] h-[46px] shrink-0"
          style={{ color: "#FFF" }}
        >
          <MessageCircle size={20} />
        </span>
        <span
          className="text-[12px] font-semibold pr-4 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-[max-width] duration-300"
          style={{ color: "#FFF" }}
        >
          Need a Quote?
        </span>
      </a>

      {/* Email tab */}
      <a
        href={`mailto:${EMAIL_ADDRESS}`}
        onClick={() => trackEvent("quick_email_click")}
        aria-label="Email Soundbox Dubai"
        className="group flex items-center gap-0 rounded-l-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #D6A84F, #B8852A)",
          boxShadow: "0 4px 20px rgba(214,168,79,0.35)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(-4px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
      >
        <span
          className="flex items-center justify-center w-[46px] h-[46px] shrink-0"
          style={{ color: "#050505" }}
        >
          <Mail size={20} />
        </span>
        <span
          className="text-[12px] font-semibold pr-4 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[100px] transition-[max-width] duration-300"
          style={{ color: "#050505" }}
        >
          Email Us
        </span>
      </a>
    </div>
  );
}
