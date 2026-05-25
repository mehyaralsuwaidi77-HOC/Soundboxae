"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, CheckCircle } from "lucide-react";
import { whatsappBookingRequest } from "@/lib/whatsapp";
import { saveLead } from "@/lib/storage";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step =
  | "idle"
  | "greeting"
  | "event-type"
  | "event-date"
  | "guests"
  | "services"
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

interface FormData {
  eventType: string;
  eventDate: string;
  guests: number;
  services: string[];
  name: string;
  phone: string;
  notes: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event",
  "Concert",
  "House Party",
  "Brand Activation",
  "Private Gathering",
  "Other",
];

const SERVICE_OPTIONS = [
  "Sound System",
  "Lighting",
  "LED Screen",
  "Stage",
  "DJ Equipment",
  "Trussing & Rigging",
  "Full Production Package",
];

const INITIAL_DATA: FormData = {
  eventType: "",
  eventDate: "",
  guests: 0,
  services: [],
  name: "",
  phone: "",
  notes: "",
};

// ── Validation helpers ────────────────────────────────────────────────────────

function isValidDate(str: string): boolean {
  const d = new Date(str);
  return !isNaN(d.getTime()) && d > new Date();
}

function isValidPhone(str: string): boolean {
  // Accept UAE/international formats: +971..., 05..., 00971...
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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [isTyping, setIsTyping] = useState(false);
  const [inputError, setInputError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBot = useCallback((text: string, delay = 0) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text }]);
        resolve();
      }, delay);
    });
  }, []);

  const addUser = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
  }, []);

  function startChat() {
    setStep("greeting");
    setMessages([]);
    setData(INITIAL_DATA);
    setInputError("");
    setTimeout(() => {
      setMessages([
        { role: "bot", text: "👋 Welcome to Soundbox Dubai! I'm your event assistant." },
      ]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Would you like to create a booking request?\n\nType **yes** to start, or **no** if you have a different question." },
        ]);
      }, 600);
    }, 200);
  }

  function handleOpen() {
    setOpen(true);
    if (step === "idle") startChat();
  }

  async function processStep(text: string) {
    setIsTyping(true);
    setInputError("");

    await new Promise((r) => setTimeout(r, 450));

    switch (step) {
      case "greeting": {
        if (/yes|yeah|sure|ok|yep|please|y\b/i.test(text)) {
          setStep("event-type");
          await addBot("What type of event is it?");
        } else if (/no|n\b|nope/i.test(text)) {
          await addBot(
            "No problem! You can reach us anytime on WhatsApp (+971 55 332 0051) or browse our services at soundboxdubai.com 😊"
          );
        } else {
          await addBot(
            "Please type **yes** to create a booking request, or **no** if you'd like to explore another way to reach us."
          );
          setStep("greeting");
        }
        break;
      }

      case "event-type": {
        if (!text || text.length < 2) {
          setInputError("Please enter your event type.");
          break;
        }
        setData((d) => ({ ...d, eventType: text }));
        setStep("event-date");
        await addBot(`Great choice! 🎉\n\nWhat is the date of your event? (e.g. 20 August 2025)`);
        break;
      }

      case "event-date": {
        if (!isValidDate(text)) {
          setInputError("Please enter a valid future date (e.g. 20 August 2025).");
          break;
        }
        setData((d) => ({ ...d, eventDate: text }));
        setStep("guests");
        await addBot(`Perfect. How many guests or people will attend?`);
        break;
      }

      case "guests": {
        const n = parseInt(text.replace(/[^\d]/g, ""), 10);
        if (isNaN(n) || n < 1 || n > 100000) {
          setInputError("Please enter a valid number of guests (e.g. 150).");
          break;
        }
        setData((d) => ({ ...d, guests: n }));
        setStep("services");
        await addBot(
          "Which services do you need? You can select options or type your own:\n\n" +
          SERVICE_OPTIONS.map((s, i) => `${i + 1}. ${s}`).join("\n")
        );
        break;
      }

      case "services": {
        if (!text || text.length < 2) {
          setInputError("Please specify at least one service.");
          break;
        }
        const selected: string[] = [];
        SERVICE_OPTIONS.forEach((s, i) => {
          if (
            text.includes(String(i + 1)) ||
            text.toLowerCase().includes(s.toLowerCase().split(" ")[0])
          ) {
            selected.push(s);
          }
        });
        const srv = selected.length ? selected : [text];
        setData((d) => ({ ...d, services: srv }));
        setStep("name");
        await addBot("Great selections! What is your **full name**?");
        break;
      }

      case "name": {
        if (!text || text.trim().length < 2) {
          setInputError("Please enter your full name.");
          break;
        }
        setData((d) => ({ ...d, name: text.trim() }));
        setStep("phone");
        await addBot(`Nice to meet you, ${text.trim().split(" ")[0]}! 👋\n\nWhat is your phone or WhatsApp number so our team can reach you?`);
        break;
      }

      case "phone": {
        if (!isValidPhone(text)) {
          setInputError("Please enter a valid phone number (e.g. +971501234567 or 05XXXXXXXX).");
          break;
        }
        setData((d) => ({ ...d, phone: text.trim() }));
        setStep("notes");
        await addBot("Almost done! Any extra notes or special requirements for your event? (Type **skip** if none)");
        break;
      }

      case "notes": {
        const notes = /^skip$/i.test(text.trim()) ? "" : text.trim();
        const finalData = { ...data, notes };
        setData(finalData);
        setStep("done");

        // Save to localStorage
        try {
          saveLead({
            name: finalData.name,
            phone: finalData.phone,
            eventType: finalData.eventType,
            eventDate: finalData.eventDate,
            guests: finalData.guests,
            services: finalData.services,
            notes: finalData.notes,
            source: "ai-chat",
          });
        } catch {
          // Silent fail — localStorage may be unavailable
        }

        // Submit to API (best-effort)
        try {
          fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: finalData.name,
              phone: finalData.phone,
              eventType: finalData.eventType,
              eventDate: finalData.eventDate,
              guests: finalData.guests,
              services: finalData.services,
              notes: finalData.notes,
              source: "ai-chat",
            }),
          }).catch(() => {});
        } catch {
          // Ignore API errors — lead is already saved to localStorage
        }

        // Track analytics event (best-effort)
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_name: "ai_chat_completed",
            event_type: "chat",
            metadata: { eventType: finalData.eventType, services: finalData.services },
          }),
        }).catch(() => {});

        await addBot(
          `Thank you, ${finalData.name}! ✅\n\nYour booking request has been received:\n\n📅 Date: ${finalData.eventDate}\n🎉 Event: ${finalData.eventType}\n👥 Guests: ${finalData.guests}\n🎛️ Services: ${finalData.services.join(", ")}\n📞 Phone: ${finalData.phone}\n\nOur team will review your request and contact you shortly.`
        );

        const waLink = whatsappBookingRequest({
          eventType: finalData.eventType,
          date: finalData.eventDate,
          guests: finalData.guests,
          services: finalData.services,
        });

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: "You can also send us this request directly via WhatsApp:", isWaLink: false },
          ]);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { role: "bot", text: "", isWaLink: true, waLink },
            ]);
          }, 400);
        }, 700);
        break;
      }
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
        aria-label={open ? "Close booking assistant" : "Open booking assistant"}
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
              <p className="text-[11px] mt-0.5" style={{ color: "#D6A84F" }}>● Online · Book your event</p>
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
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#D6A84F",
                          opacity: 0.5,
                          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
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

          {/* Quick picks for event-type */}
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

          {/* Service quick picks */}
          {step === "services" && !isTyping && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
              {SERVICE_OPTIONS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => handleSend(String(i + 1))}
                  className="text-[11.5px] px-2.5 py-1.5 rounded-full border transition-[background,color] duration-150"
                  style={{ borderColor: "rgba(214,168,79,0.2)", color: "#A7A7B3" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(214,168,79,0.08)"; (e.currentTarget as HTMLElement).style.color = "#D6A84F"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#A7A7B3"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input error */}
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
                type={step === "phone" ? "tel" : step === "event-date" ? "text" : "text"}
                value={input}
                onChange={(e) => { setInput(e.target.value); setInputError(""); }}
                onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
                placeholder={
                  step === "phone" ? "+971 50 123 4567" :
                  step === "event-date" ? "e.g. 20 August 2025" :
                  step === "guests" ? "e.g. 200" :
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
