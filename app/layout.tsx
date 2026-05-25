import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { getSiteSettings } from "@/lib/site-settings";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { whatsappGeneral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.soundboxdubai.com"),
  title: {
    default: "Soundbox Dubai — Premium Audio Visual Rental",
    template: "%s | Soundbox Dubai",
  },
  description:
    "Dubai's premier audio visual rental company. Sound systems, LED screens, lighting, stages, rigging, DJ equipment and full event production for weddings, corporate events & concerts.",
  keywords: [
    "AV rental Dubai",
    "sound system rental Dubai",
    "speaker rental Dubai",
    "lighting rental Dubai",
    "LED screen rental Dubai",
    "stage rental Dubai",
    "event production Dubai",
    "DJ equipment rental Dubai",
    "audio visual Dubai",
    "event equipment rental UAE",
  ],
  authors: [{ name: "Soundbox Electronic Equipment Rental" }],
  creator: "Soundbox Dubai",
  openGraph: {
    type: "website",
    locale: "en_AE",
    alternateLocale: "ar_AE",
    url: "https://www.soundboxdubai.com",
    siteName: "Soundbox Dubai",
    title: "Soundbox Dubai — Premium Audio Visual Rental",
    description:
      "Premium AV rental for events in Dubai. Sound, lighting, LED screens, stages, DJ equipment & full production.",
    images: [
      {
        url: "/logos/soundbox-logo.png",
        width: 1200,
        height: 630,
        alt: "Soundbox Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soundbox Dubai — Premium Audio Visual Rental",
    description: "Premium AV rental for events in Dubai.",
    images: ["/logos/soundbox-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const publicSettings = {
    whatsappNumber: settings.whatsappNumber,
    whatsappUrl:    whatsappGeneral(settings.whatsappNumber),
    phone:          settings.managerPhone,
    phoneDisplay:   settings.whatsappDisplay,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.soundboxdubai.com",
    name: settings.companyName,
    alternateName: "Soundbox Dubai",
    description:
      "Dubai's premier audio visual rental company. Sound systems, LED screens, lighting, stages, rigging, DJ equipment and full event production.",
    url: settings.websiteUrl || "https://www.soundboxdubai.com",
    telephone: settings.managerPhone,
    email: settings.notificationEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      streetAddress: settings.companyAddress,
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2048,
      longitude: 55.2708,
    },
    areaServed: [
      { "@type": "City", name: "Dubai" },
      { "@type": "City", name: "Abu Dhabi" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AV Equipment Rental Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Audio Systems Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lighting Systems Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "LED Screen Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Stage Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "DJ Equipment Rental" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event Production" } },
      ],
    },
    sameAs: [
      `https://wa.me/${settings.whatsappNumber}`,
      "https://www.instagram.com/soundboxdubai/",
    ],
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0B0F] text-white antialiased">
        <SettingsProvider settings={publicSettings}>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
