import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import SectionHeader from "@/components/ui/SectionHeader";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { whatsappLink } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Soundbox Dubai",
  description:
    "Answers to the most common questions about Soundbox Dubai's AV equipment rental: delivery, payment, required documents, cancellation policy, and more.",
};

const faqs = [
  {
    q: "Does the price include delivery and setup?",
    a: "Yes, delivery and setup are included in the price. However, for locations outside Dubai there will be extra delivery fees which vary depending on the location.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept card payments through our website, or cash upon delivery.",
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
    q: "Do I need to be a certain age to rent your equipment?",
    a: "Yes, we have a minimum age requirement of 18 years or older to rent any of our equipment.",
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, orders can be cancelled free of charge if the customer requests to cancel at least 6 hours prior to the delivery time. If the customer wishes to cancel after that, there will be a cancellation fee of 25% of the total order value.",
  },
  {
    q: "Can there be a technician on site?",
    a: "Yes, we can provide a technician to stay during your event, but that will be chargeable depending on the size of your event and duration.",
  },
  {
    q: "In which country do you operate?",
    a: "Currently we only operate in the United Arab Emirates.",
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
              Give us a call or send us a message — we&apos;re happy to help with anything you need.
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
                href={`tel:${settings.managerPhone}`}
                className="btn-ghost inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Phone size={15} />
                {settings.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
