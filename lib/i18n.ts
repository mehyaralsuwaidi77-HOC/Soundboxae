export type Lang = "en" | "ar";

export const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      products: "Products",
      gallery: "Gallery",
      clients: "Clients",
      tracking: "Track Booking",
      contact: "Contact",
    },
    cta: {
      bookingRequest: "Create Booking Request",
      whatsappUs: "WhatsApp Us",
      inquireNow: "Inquire Now",
      viewAll: "View All",
      learnMore: "Learn More",
      getQuote: "Get a Quote",
    },
    hero: {
      tagline: "Premium Audio Visual Rental",
      subtitle: "Elevating events across Dubai with world-class sound, light, and visual production.",
    },
    sections: {
      services: "Our Services",
      featuredEvents: "Event Categories",
      clients: "Trusted By",
      gallery: "Our Work",
      contact: "Get In Touch",
    },
    footer: {
      description: "Dubai's premier audio visual rental company — delivering premium sound, lighting, and event production across the UAE.",
      quickLinks: "Quick Links",
      services: "Services",
      contactUs: "Contact Us",
      rights: "All rights reserved.",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      services: "الخدمات",
      products: "المنتجات",
      gallery: "معرض الأعمال",
      clients: "عملاؤنا",
      tracking: "تتبع الحجز",
      contact: "اتصل بنا",
    },
    cta: {
      bookingRequest: "إنشاء طلب حجز",
      whatsappUs: "تواصل عبر واتساب",
      inquireNow: "استفسر الآن",
      viewAll: "عرض الكل",
      learnMore: "اعرف المزيد",
      getQuote: "احصل على عرض سعر",
    },
    hero: {
      tagline: "تأجير معدات الصوت والإضاءة الاحترافية",
      subtitle: "نرتقي بفعالياتكم في دبي بأعلى معايير الصوت والإضاءة والإنتاج البصري.",
    },
    sections: {
      services: "خدماتنا",
      featuredEvents: "أنواع الفعاليات",
      clients: "عملاؤنا",
      gallery: "أعمالنا",
      contact: "تواصل معنا",
    },
    footer: {
      description: "شركة صوندبوكس دبي — الشريك الأمثل لتأجير معدات الصوت والإضاءة والإنتاج الفني في الإمارات.",
      quickLinks: "روابط سريعة",
      services: "الخدمات",
      contactUs: "اتصل بنا",
      rights: "جميع الحقوق محفوظة.",
    },
  },
} as const;

export type Translations = typeof translations.en;
