"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { whatsappBookingRequest } from "@/lib/whatsapp";
import { saveLead } from "@/lib/storage";

type Step =
  | "idle"
  | "greeting"
  | "event-type"
  | "event-date"
  | "guests"
  | "services"
  | "name"
  | "done";

interface Message {
  role: "bot" | "user";
  text: string;
}

const EVENT_TYPES = ["Wedding", "Corporate Event", "Concert", "House Party", "Brand Activation", "Other"];
const SERVICE_OPTIONS = ["Sound System", "Lighting", "LED Screen", "Stage", "DJ Equipment", "Trussing & Rigging", "Full Production"];

function BotMsg({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 max-w-[85%]">
      <div
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
        style={{ background: "rgba(214,168,79,0.2)", color: "#D6A84F" }}
      >
        <Sparkles size={13} />
      </div>
      <div
        className="rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed"
        style={{ background: "rgba(214,168,79,0.08)", border: "1px solid rgba(214,168,79,0.15)", color: "#FFFFFF" }}
      >
        {text}
      </div>
    </div>
  );
}

function UserMsg({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-[80%]"
        style={{ background: "linear-gradient(135deg, #D6A84F, #B8852A)", color: "#050505", fontWeight: 500 }}
      >
        {text}
      </div>
    </div>
  );
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [data, setData] = useState({
    eventType: "",
    eventDate: "",
    guests: 0,
    services: [] as string[],
    name: "",
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addBot(text: string) {
    setMessages((prev) => [...prev, { role: "bot", text }]);
  }

  function addUser(text: string) {
    setMessages((prev) => [...prev, { role: "user", text }]);
  }

  function startChat() {
    setStep("greeting");
    setMessages([]);
    setData({ eventType: "", eventDate: "", guests: 0, services: [], name: "" });
    setTimeout(() => {
      addBot("👋 Welcome to Soundbox Dubai! I'm here to help you set up a booking request.");
      setTimeout(() => addBot("Would you like to create a booking request? (yes / no)"), 600);
    }, 300);
  }

  function handleOpen() {
    setOpen(true);
    if (step === "idle") startChat();
  }

  function handleSend(value?: string) {
    const text = (value ?? input).trim();
    if (!text) return;
    setInput("");
    addUser(text);

    setTimeout(() => {
      switch (step) {
        case "greeting":
          if (/yes|yeah|sure|ok|yep|please/i.test(text)) {
            setStep("event-type");
            addBot("What type of event is it?");
            setTimeout(() => addBot(EVENT_TYPES.join(" · ")), 400);
          } else {
            addBot("No problem! Feel free to come back anytime. You can also WhatsApp us at +971 55 332 0051. 😊");
          }
          break;

        case "event-type":
          setData((d) => ({ ...d, eventType: text }));
          setStep("event-date");
          addBot(`Great! When is the event? Please share the date (e.g. 15 July 2025).`);
          break;

        case "event-date":
          setData((d) => ({ ...d, eventDate: text }));
          setStep("guests");
          addBot("How many guests/people will attend?");
          break;

        case "guests":
          setData((d) => ({ ...d, guests: parseInt(text) || 0 }));
          setStep("services");
          addBot("What services do you need? (Select all that apply — type the numbers or names)");
          setTimeout(() => {
            addBot(SERVICE_OPTIONS.map((s, i) => `${i + 1}. ${s}`).join("\n"));
          }, 400);
          break;

        case "services": {
          const selected: string[] = [];
          SERVICE_OPTIONS.forEach((s, i) => {
            if (text.includes(String(i + 1)) || text.toLowerCase().includes(s.toLowerCase())) {
              selected.push(s);
            }
          });
          const srv = selected.length ? selected : [text];
          setData((d) => ({ ...d, services: srv }));
          setStep("name");
          addBot("Almost done! What is your name?");
          break;
        }

        case "name": {
          const finalData = { ...data, name: text };
          setData(finalData);
          setStep("done");

          // Save lead
          try {
            saveLead({
              name: finalData.name,
              eventType: finalData.eventType,
              eventDate: finalData.eventDate,
              guests: finalData.guests,
              services: finalData.services,
            });
          } catch {}

          addBot(
            `Thank you, ${text}! 🙏\n\nYour booking request has been received:\n📅 ${finalData.eventDate}\n🎉 ${finalData.eventType}\n👥 ${finalData.guests} guests\n🎛️ ${finalData.services.join(", ")}\n\nOur team will review your request and contact you shortly.`
          );

          const waLink = whatsappBookingRequest({
            eventType: finalData.eventType,
            date: finalData.eventDate,
            guests: finalData.guests,
            services: finalData.services,
          });

          setTimeout(() => {
            addBot("You can also send this directly via WhatsApp for a faster response:");
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  role: "bot",
                  text: `__wa__${waLink}`,
                },
              ]);
            }, 500);
          }, 800);
          break;
        }

        default:
          addBot("Feel free to start a new conversation by refreshing this chat!");
      }
    }, 500);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-pulse-gold transition-[transform] duration-200 hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6A84F]"
        style={{
          background: "linear-gradient(135deg, #D6A84F, #B8852A)",
          color: "#050505",
        }}
        aria-label="Open booking assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{
            background: "#111118",
            border: "1px solid rgba(214,168,79,0.2)",
            maxHeight: "70vh",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(214,168,79,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-4 border-b"
            style={{
              background: "linear-gradient(135deg, #1a1209, #111118)",
              borderColor: "rgba(214,168,79,0.2)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(214,168,79,0.2)" }}
            >
              <Sparkles size={15} style={{ color: "#D6A84F" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Soundbox Assistant</p>
              <p className="text-xs" style={{ color: "#D6A84F" }}>● Online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto p-1 rounded transition-[opacity] duration-150 hover:opacity-60"
              style={{ color: "#A7A7B3" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 200 }}>
            {messages.map((msg, i) => {
              if (msg.role === "bot" && msg.text.startsWith("__wa__")) {
                const link = msg.text.replace("__wa__", "");
                return (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(214,168,79,0.2)", color: "#D6A84F" }}
                    >
                      <Sparkles size={13} />
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold inline-flex items-center gap-2 text-xs"
                    >
                      <MessageCircle size={13} />
                      Send via WhatsApp
                    </a>
                  </div>
                );
              }
              return msg.role === "bot" ? (
                <BotMsg key={i} text={msg.text} />
              ) : (
                <UserMsg key={i} text={msg.text} />
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Quick picks for event-type step */}
          {step === "event-type" && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => handleSend(t)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-[background,color] duration-150 hover:bg-[rgba(214,168,79,0.15)]"
                  style={{ borderColor: "rgba(214,168,79,0.3)", color: "#D6A84F" }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {step !== "done" && (
            <div
              className="flex items-center gap-2 px-4 py-3 border-t"
              style={{ borderColor: "rgba(214,168,79,0.1)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your reply…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#5A5A6E]"
                style={{ color: "#FFFFFF" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 rounded-full transition-[opacity,transform] duration-150 disabled:opacity-30 hover:scale-110 active:scale-95"
                style={{ background: "linear-gradient(135deg, #D6A84F, #B8852A)", color: "#050505" }}
              >
                <Send size={14} />
              </button>
            </div>
          )}

          {step === "done" && (
            <button
              onClick={startChat}
              className="m-4 btn-ghost text-sm"
            >
              Start New Conversation
            </button>
          )}
        </div>
      )}
    </>
  );
}
