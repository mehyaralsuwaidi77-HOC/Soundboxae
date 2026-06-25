import type { Metadata } from "next";
import { MessageCircle, Mail } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { whatsappLink } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/site-settings";
import { contactMailto } from "@/lib/mailto";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Soundbox Dubai",
  description:
    "Answers to the most common questions about Soundbox Dubai's AV equipment rental: delivery, payment, cancellation policy, and more.",
};

const faqs = [
  {
    q: "Does the price include delivery and setup?",
    a: "Yes, delivery and setup are included in the price. For locations outside of Dubai, a minimum order fee applies, which varies depending on the delivery location.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We offer flexible payment options and accept bank transfers, secure payment links, card payments via our portable card machine, Tabby installment payments, and cash payments for your convenience. Certain payment methods may include additional processing charges.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes. If you cancel 48 hours or more before your event, you will receive a 100% full refund. If the cancellation is made within 48 hours of the event, only a 50% refund will be issued.",
  },
  {
    q: "When do I need to make payment for my booking?",
    a: "Bookings under AED 1,000 require full payment in advance. For bookings above AED 1,000, 50% payment is required to confirm the reservation, while the remaining balance must be cleared before setup begins on the event day.",
  },
  {
    q: "What documents are required to rent the equipment?",
    a: "We will require our customers to sign the lease agreement upon delivery and setup of the rented items. Apart from that, we require a valid ID or passport copy.",
  },
  {
    q: "What is your policy for damaged products?",
    a: "As per our lease agreement, which is signed by the client with each rental, any damaged product will be chargeable to the client.",
  },
  {
    q: "Can there be a technician on site?",
    a: "Yes, we can provide a technician to stay during your event, but that will be chargeable depending on the size of your event and duration.",
  },
  {
    q: "In which areas do you operate?",
    a: "We provide services across the UAE including Dubai, Abu Dhabi, Sharjah, Ajman, and surrounding areas. Additional transportation charges may apply depending on your event location outside Dubai.",
  },
];

export default async function FAQPage() {
  const settings = await getSiteSettings();
  const waLink = whatsappLink(
    "Hi Soundbox Dubai! I have a question about your AV rental services.",
    settings.whatsappNumber
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: "#050505" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(214,168,79,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            eyebrow="Support"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know before booking. Can't find what you're looking for? Just reach out."
            centered
          />
        </div>
      </section>

      {/* Tabby payment notice */}
      <div style={{ background: "#050505" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl text-sm w-full justify-center"
            style={{
              background: "rgba(214,168,79,0.07)",
              border: "1px solid rgba(214,168,79,0.18)",
            }}
          >
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ background: "rgba(214,168,79,0.2)", color: "#D6A84F" }}
            >
              Tabby
            </span>
            <span style={{ color: "#A7A7B3" }}>
              Split your payment into <strong style={{ color: "#FFF" }}>4 interest-free installments</strong> with Tabby — available at checkout.
            </span>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-20" style={{ background: "#0B0B0F" }}>
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(214,168,79,0.15), transparent)",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative"
        style={{ background: "#111118" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(to right, transparent, rgba(214,168,79,0.2), transparent)",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-2xl px-8 py-12"
            style={{
              background: "linear-gradient(135deg, rgba(214,168,79,0.08), rgba(214,168,79,0.03))",
              border: "1px solid rgba(214,168,79,0.18)",
            }}
          >
            <p
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Still have questions?
            </p>
            <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "#A7A7B3" }}>
              Give us a call, send us a message, or drop us an email — we&apos;re happy to help with anything you need.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <MessageCircle size={15} />
                WhatsApp Us
              </a>
              <a
                href={contactMailto}
                className="btn-ghost inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Mail size={15} />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
