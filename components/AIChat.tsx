"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, CheckCircle } from "lucide-react";
import { whatsappServiceInquiry } from "@/lib/whatsapp";
import { useSettings } from "@/components/providers/SettingsProvider";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step =
  | "idle"
  | "greeting"
  | "event-date"
  | "event-location"
  | "event-type"
  | "equipment"
  | "duration"
  | "name"
  | "phone"
  | "notes"
  | "done";

interface Message {
  role: "bot" | "user";
  text: string;
  isWaLink?: boolean;
  waLink?: string;
}

interface BookingData {
  eventDate: string;
  eventLocation: string;
  eventType: string;
  equipment: string;
  duration: string;
  name: string;
  phone: string;
  notes: string;
}

const EMPTY_DATA: BookingData = {
  eventDate: "", eventLocation: "", eventType: "", equipment: "",
  duration: "", name: "", phone: "", notes: "",
};

const EVENT_TYPES = [
  "Wedding", "Birthday", "Corporate Event", "Concert",
  "Private Party", "Brand Activation", "Conference", "Other",
];

// ── Intent matching ───────────────────────────────────────────────────────────

interface IntentRule {
  pattern: RegExp;
  response: string;
  trackEvent?: string;
}

const INTENT_RULES: IntentRule[] = [
  {
    pattern: /\b(deliver|delivery|setup|set.?up|install|transport|bring|collect|collection)\b/i,
    response: "Delivery and setup are included in the price. For locations outside Dubai, a minimum order fee applies depending on the location.",
  },
  {
    pattern: /\b(pay|payment|cash|card|bank.?transfer|tabby|installment|installments|link|online.?pay)\b/i,
    response: "We accept bank transfer, secure payment links, card payments via our portable card machine, Tabby installment payments (split into 4), and cash payments. Certain payment methods may include additional processing charges.",
    trackEvent: "faq_view",
  },
  {
    pattern: /\b(cancel|cancellation|refund|money.?back|return)\b/i,
    response: "If you cancel 48 hours or more before the event, you will receive a 100% full refund. Cancellations made within 48 hours are eligible for a 50% refund only.",
  },
  {
    pattern: /\b(book|booking|deposit|confirm|advance|reserve|reservation|hire)\b/i,
    response: "Bookings below AED 1,000 require 100% advance payment. Bookings above AED 1,000 require a 50% deposit to confirm, with the remaining 50% paid before setup begins on the event day.\n\nWould you like to make a booking? Type **yes** and I'll collect your event details.",
  },
  {
    pattern: /\b(price|pricing|quotation|quote|cost|package|how.?much|rate)\b/i,
    response: "Please share your event details with us and our team will provide a customized quotation based on your requirements. Minimum order is AED 500 including setup, delivery, and collection.",
  },
  {
    pattern: /\b(speaker|sound.?system|dj|lighting|light|av|audio.?visual|mic|microphone|screen|led|stage|equipment|gear|truss|rigging)\b/i,
    response: "We provide professional audio visual rental solutions including sound systems, DJ equipment, lighting, microphones, LED screens, staging, trusses, rigging, and full event production services.",
  },
  {
    pattern: /\b(dubai|abu.?dhabi|sharjah|ajman|uae|outside.?dubai|emirates|rak|fujairah)\b/i,
    response: "We provide services across the UAE including Dubai, Abu Dhabi, Sharjah, Ajman, and surrounding emirates. Additional transportation charges may apply depending on your event location.",
  },
  {
    pattern: /\b(minimum|min.?order|min order|aed|500)\b/i,
    response: "Our minimum order is AED 500, which includes setup, delivery, and collection.",
  },
  {
    pattern: /\b(instagram|facebook|social|follow)\b/i,
    response: "You can follow us on Instagram @soundboxdubai to see our latest events and setups. Our team is also available via WhatsApp and Email for inquiries.",
  },
];

function matchIntent(text: string): IntentRule | null {
  for (const rule of INTENT_RULES) {
    if (rule.pattern.test(text)) return rule;
  }
  return null;
}

function isBookingIntent(text: string): boolean {
  return /\b(book|booking|reserve|reservation|confirm|hire|yes|yeah|sure|ok|yep|please|start)\b/i.test(text);
}

function isOffTopic(text: string): boolean {
  const offTopicPatterns = [
    /\b(weather|recipe|cook|football|sport|news|politics|joke|movie|film|music.?recommend|stock|crypto|bitcoin)\b/i,
  ];
  return offTopicPatterns.some((p) => p.test(text));
}

function isValidPhone(str: string): boolean {
  return /^(\+|00)?[1-9]\d{6,14}$/.test(str.replace(/[\s\-().]/g, ""));
}

// ── Message sub-components ────────────────────────────────────────────────────

function BotMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 max-w-[88%]">
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
        style={{ background: "rgba(214,168,79,0.18)", color: "#D6A84F" }}
      >
        <Sparkles size={12} />
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
        style={{
          background: "rgba(214,168,79,0.07)",
          border: "1px solid rgba(214,168,79,0.14)",
          color: "#F0F0F8",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[82%] leading-relaxed"
        style={{
          background: "linear-gradient(135deg, #D6A84F, #B8852A)",
          color: "#050505",
          fontWeight: 500,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function WaButton({ link }: { link: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
        style={{ background: "rgba(214,168,79,0.18)", color: "#D6A84F" }}
      >
        <Sparkles size={12} />
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold inline-flex items-center gap-2 text-[12px] py-2.5 px-4"
      >
        <MessageCircle size={13} />
        Send via WhatsApp
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AIChat() {
  const { whatsappNumber } = useSettings();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<BookingData>(EMPTY_DATA);
  const [isTyping, setIsTyping] = useState(false);
  const [inputError, setInputError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBot = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text }]);
        resolve();
      }, 0);
    });
  }, []);

  const addUser = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
  }, []);

  function fireAnalytics(name: string) {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: name, event_type: "chat", source: "ai_chat" }),
    }).catch(() => {});
  }

  function startChat() {
    setStep("greeting");
    setMessages([]);
    setData(EMPTY_DATA);
    setInputError("");
    fireAnalytics("ai_chat_started");
    setTimeout(() => {
      setMessages([
        { role: "bot", text: "👋 Welcome to Soundbox Dubai! I'm your event assistant.\n\nHow can I help you today? You can:\n• Ask about our services, payment, delivery, or cancellation\n• Type **book** to start a booking request" },
      ]);
    }, 200);
  }

  function handleOpen() {
    setOpen(true);
    if (step === "idle") startChat();
  }

  async function processStep(text: string) {
    setIsTyping(true);
    setInputError("");

    await new Promise((r) => setTimeout(r, 380));

    if (step === "greeting") {
      // Check off-topic first
      if (isOffTopic(text)) {
        await addBot("Thank you for contacting us. For event-related inquiries, please let us know your requirements and our team will assist you.");
        setIsTyping(false);
        return;
      }

      // Intent matching
      const matched = matchIntent(text);
      if (matched) {
        if (matched.trackEvent) fireAnalytics(matched.trackEvent);
        await addBot(matched.response);
        await new Promise((r) => setTimeout(r, 200));
        await addBot("Is there anything else I can help you with? Type **book** to start a booking request, or ask another question.");
        setIsTyping(false);
        return;
      }

      // Booking intent
      if (isBookingIntent(text)) {
        setStep("event-date");
        await addBot("To confirm your booking, I'll need a few details.\n\nWhat is the date of your event?");
        setIsTyping(false);
        return;
      }

      // Default fallback
      await addBot("Thank you for reaching out! Our team specialises in audio visual equipment rental for all types of events.\n\nYou can ask me about:\n• Delivery and setup\n• Payment methods\n• Cancellation policy\n• Our services\n\nOr type **book** to start a booking request.");
      setIsTyping(false);
      return;
    }

    // ── Booking flow ──────────────────────────────────────────────────────────

    if (step === "event-date") {
      if (!text || text.trim().length < 2) {
        setInputError("Please enter your event date.");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, eventDate: text.trim() }));
      setStep("event-location");
      await addBot("What is the event location or venue?");
      setIsTyping(false);
      return;
    }

    if (step === "event-location") {
      if (!text || text.trim().length < 2) {
        setInputError("Please enter the event location.");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, eventLocation: text.trim() }));
      setStep("event-type");
      await addBot("What type of event is it? (e.g. Wedding, Birthday, Corporate, Private Party)");
      setIsTyping(false);
      return;
    }

    if (step === "event-type") {
      if (!text || text.trim().length < 2) {
        setInputError("Please enter your event type.");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, eventType: text.trim() }));
      setStep("equipment");
      await addBot("What equipment or services do you require?\n(e.g. Sound system, Lighting, LED Screen, Stage, DJ Equipment, Full Production)");
      setIsTyping(false);
      return;
    }

    if (step === "equipment") {
      if (!text || text.trim().length < 2) {
        setInputError("Please describe the equipment or services needed.");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, equipment: text.trim() }));
      setStep("duration");
      await addBot("How long is the rental / event duration? (e.g. 4 hours, 1 day)");
      setIsTyping(false);
      return;
    }

    if (step === "duration") {
      if (!text || text.trim().length < 1) {
        setInputError("Please enter the duration.");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, duration: text.trim() }));
      setStep("name");
      await addBot("What is your full name?");
      setIsTyping(false);
      return;
    }

    if (step === "name") {
      if (!text || text.trim().length < 2) {
        setInputError("Please enter your name.");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, name: text.trim() }));
      setStep("phone");
      await addBot(`Nice to meet you, ${text.trim().split(" ")[0]}! 👋\n\nWhat is your phone or WhatsApp number?`);
      setIsTyping(false);
      return;
    }

    if (step === "phone") {
      if (!isValidPhone(text)) {
        setInputError("Please enter a valid phone number (e.g. +971501234567 or 0501234567).");
        setIsTyping(false);
        return;
      }
      setData((d) => ({ ...d, phone: text.trim() }));
      setStep("notes");
      await addBot("Any additional notes or requirements? (Type **skip** if none)");
      setIsTyping(false);
      return;
    }

    if (step === "notes") {
      const notes = /^skip$/i.test(text.trim()) ? "" : text.trim();
      const finalData = { ...data, notes };
      setData(finalData);
      setStep("done");

      // Save lead to API
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name:      finalData.name,
            phone:     finalData.phone,
            eventType: finalData.eventType,
            eventDate: finalData.eventDate,
            services:  finalData.equipment ? [finalData.equipment] : ["Audio Visual"],
            notes:     [
              finalData.eventLocation ? `Location: ${finalData.eventLocation}` : "",
              finalData.duration      ? `Duration: ${finalData.duration}`       : "",
              finalData.notes,
            ].filter(Boolean).join(" | "),
            source: "ai_chat",
          }),
        });
      } catch {
        // Silent fail
      }

      fireAnalytics("ai_chat_completed");

      await addBot(
        `Thank you, ${finalData.name}! ✅\n\nYour booking request has been received:\n\n📅 Date: ${finalData.eventDate}\n📍 Location: ${finalData.eventLocation}\n🎉 Event: ${finalData.eventType}\n🎛️ Equipment: ${finalData.equipment}\n⏱️ Duration: ${finalData.duration}\n📞 Phone: ${finalData.phone}${finalData.notes ? `\n📝 Notes: ${finalData.notes}` : ""}\n\nOur team will review your request and contact you shortly.`
      );

      const waLink = whatsappServiceInquiry(
        {
          name:      finalData.name,
          phone:     finalData.phone,
          eventType: finalData.eventType,
          eventDate: finalData.eventDate,
          notes:     [
            finalData.eventLocation ? `Location: ${finalData.eventLocation}` : "",
            finalData.duration      ? `Duration: ${finalData.duration}`       : "",
            finalData.notes,
          ].filter(Boolean).join(" | "),
        },
        whatsappNumber
      );

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "You can also send us this request directly via WhatsApp:" },
        ]);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: "", isWaLink: true, waLink },
          ]);
        }, 400);
      }, 700);
    }

    setIsTyping(false);
  }

  function handleSend(overrideValue?: string) {
    const text = (overrideValue ?? input).trim();
    if (!text) return;
    setInput("");
    addUser(text);
    processStep(text);
  }

  return (
    <>
      {/* ── Floating button ──────────────────────────────────────────────── */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-xl animate-pulse-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6A84F] focus-visible:outline-offset-2"
        style={{
          background: "linear-gradient(135deg, #D6A84F, #B8852A)",
          color: "#050505",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
        aria-label={open ? "Close assistant" : "Open booking assistant"}
      >
        {open ? <X size={21} /> : <MessageCircle size={21} />}
      </button>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-[88px] right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: "#0E0E16",
            border: "1px solid rgba(214,168,79,0.18)",
            maxHeight: "min(72vh, 540px)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(214,168,79,0.08), inset 0 1px 0 rgba(214,168,79,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0 border-b"
            style={{
              background: "linear-gradient(135deg, rgba(20,14,5,0.9), rgba(14,14,22,0.9))",
              borderColor: "rgba(214,168,79,0.12)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(214,168,79,0.18)" }}
            >
              <Sparkles size={14} style={{ color: "#D6A84F" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-none">Soundbox Assistant</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#D6A84F" }}>● Online · AV Rental Inquiries</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg transition-[background] duration-150 hover:bg-[rgba(255,255,255,0.06)]"
              style={{ color: "#6A6A7A" }}
              aria-label="Close chat"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 min-h-0">
            {messages.map((msg, i) => {
              if (msg.isWaLink && msg.waLink) return <WaButton key={i} link={msg.waLink} />;
              return msg.role === "bot" ? (
                <BotMessage key={i} text={msg.text} />
              ) : (
                <UserMessage key={i} text={msg.text} />
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(214,168,79,0.18)", color: "#D6A84F" }}
                >
                  <Sparkles size={12} />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm"
                  style={{ background: "rgba(214,168,79,0.07)", border: "1px solid rgba(214,168,79,0.14)" }}
                >
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#D6A84F",
                          opacity: 0.5,
                          animation: `bounce 1s ease-in-out ${j * 0.15}s infinite`,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick event-type chips in booking flow */}
          {step === "event-type" && !isTyping && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => handleSend(t)}
                  className="text-[11.5px] px-2.5 py-1.5 rounded-full border transition-[background,color] duration-150"
                  style={{ borderColor: "rgba(214,168,79,0.25)", color: "#D6A84F" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(214,168,79,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {inputError && (
            <div className="px-4 pb-1 shrink-0">
              <p className="text-[11.5px]" style={{ color: "#EB5757" }}>{inputError}</p>
            </div>
          )}

          {/* Input bar */}
          {step !== "done" && step !== "idle" && (
            <div
              className="flex items-center gap-2 px-4 py-3 border-t shrink-0"
              style={{ borderColor: "rgba(214,168,79,0.1)" }}
            >
              <input
                type={step === "phone" ? "tel" : "text"}
                value={input}
                onChange={(e) => { setInput(e.target.value); setInputError(""); }}
                onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
                placeholder={
                  step === "phone"          ? "+971 50 123 4567" :
                  step === "event-date"     ? "e.g. 20 August 2025" :
                  step === "event-location" ? "e.g. Jumeirah, Dubai" :
                  step === "duration"       ? "e.g. 5 hours" :
                  "Type your reply…"
                }
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#3A3A50]"
                style={{ color: "#F0F0F8" }}
                disabled={isTyping}
                autoFocus
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 disabled:opacity-30 transition-[transform,opacity] duration-150"
                style={{
                  background: "linear-gradient(135deg, #D6A84F, #B8852A)",
                  color: "#050505",
                  transform: input.trim() ? "scale(1)" : "scale(0.9)",
                }}
                onMouseEnter={(e) => { if (input.trim()) (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </div>
          )}

          {/* Done state */}
          {step === "done" && (
            <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "rgba(214,168,79,0.1)" }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} style={{ color: "#27AE60" }} />
                <span className="text-xs" style={{ color: "#27AE60" }}>Request submitted</span>
              </div>
              <button
                onClick={startChat}
                className="btn-ghost w-full text-[12px] py-2.5"
              >
                Start New Conversation
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
