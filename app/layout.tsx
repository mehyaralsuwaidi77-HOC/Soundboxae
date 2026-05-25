import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0B0F] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
