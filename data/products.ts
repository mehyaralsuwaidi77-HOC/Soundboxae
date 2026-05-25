export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
  image: string;
  isBundle: boolean;
  bundleIncludes?: string[];
}

export const products: Product[] = [
  // ── Bundles ──────────────────────────────────────────────────────────────────
  {
    id: "bundle-wedding-essentials",
    name: "Wedding Essentials Bundle",
    category: "Bundles",
    description:
      "Everything you need for an elegant wedding reception — sound, lighting, and visual in one complete package.",
    specs: {
      Coverage: "Up to 300 guests",
      Duration: "Full-day rental",
      Setup: "Professional crew included",
      Breakdown: "Same-day",
    },
    tags: ["Wedding", "Bundle", "Sound", "Lighting"],
    image: "/images/products/bundle-wedding.jpg",
    isBundle: true,
    bundleIncludes: [
      "2× Line array speaker cabinets",
      "2× Subwoofers",
      "Digital mixing console",
      "4× Wireless microphone systems",
      "20× LED uplights",
      "4× Moving head wash fixtures",
      "Full cabling and stands",
      "Setup & operation crew",
    ],
  },
  {
    id: "bundle-corporate-conference",
    name: "Corporate Conference Bundle",
    category: "Bundles",
    description:
      "Professional conference setup with clear speech reinforcement, LED screen, and confidence monitoring.",
    specs: {
      Coverage: "Up to 200 delegates",
      Duration: "Full-day rental",
      Setup: "Technical crew included",
      Breakdown: "Same-day",
    },
    tags: ["Corporate", "Bundle", "Conference", "Presentation"],
    image: "/images/products/bundle-corporate.jpg",
    isBundle: true,
    bundleIncludes: [
      "Main PA speaker system",
      "4× Wireless lapel microphones",
      "2× Handheld wireless microphones",
      "6m × 3m LED screen",
      "Video processor",
      "Stage monitor",
      "Digital mixer",
      "Technical operator",
    ],
  },
  {
    id: "bundle-concert-small",
    name: "Small Concert Package",
    category: "Bundles",
    description:
      "Full concert production package for events up to 1,000 attendees — PA, lights, and stage ready to go.",
    specs: {
      Capacity: "Up to 1,000 guests",
      Stage: "8m × 6m modular stage",
      PA: "Full line array system",
      Lights: "16-fixture moving head rig",
    },
    tags: ["Concert", "Bundle", "Stage", "Lighting", "Audio"],
    image: "/images/products/bundle-concert.jpg",
    isBundle: true,
    bundleIncludes: [
      "8×6m modular stage (1.2m high)",
      "Full line array PA system (left-right hang)",
      "4× High-power subwoofers",
      "Monitor system (4 mixes)",
      "16× Moving head lights",
      "12× LED wash fixtures",
      "Lighting & audio console",
      "Full crew (sound, lighting, staging)",
    ],
  },
  {
    id: "bundle-dj-party",
    name: "DJ Party Package",
    category: "Bundles",
    description:
      "Complete DJ and dance floor package for house parties, pool events, and club nights.",
    specs: {
      Coverage: "Up to 150 guests",
      Duration: "Up to 8 hours",
      Setup: "Included",
      Breakdown: "Next-day collection",
    },
    tags: ["DJ", "Bundle", "Party", "Dance"],
    image: "/images/products/bundle-dj.jpg",
    isBundle: true,
    bundleIncludes: [
      "Pioneer CDJ-3000 × 2",
      "Pioneer DJM-900NXS2 mixer",
      "4× Line array speakers",
      "2× Subwoofers",
      "DJ booth",
      "LED moving heads × 8",
      "Haze machine",
      "Full cabling",
    ],
  },
  // ── Audio ─────────────────────────────────────────────────────────────────────
  {
    id: "pa-line-array",
    name: "Line Array Speaker System",
    category: "Audio",
    description:
      "Professional line array cabinets for medium to large events with even coverage and crystal-clear reproduction.",
    specs: {
      Type: "Active line array",
      Coverage: "100°–130° horizontal",
      SPL: "134 dB peak",
      Power: "2000W Class-D",
    },
    tags: ["Audio", "Speaker", "Line Array"],
    image: "/images/products/line-array.jpg",
    isBundle: false,
  },
  {
    id: "pa-subwoofer",
    name: "Professional Subwoofer",
    category: "Audio",
    description:
      'High-output 18" subwoofer delivering deep, powerful bass for concerts and large events.',
    specs: {
      Driver: '18" woofer',
      Frequency: "35–120 Hz",
      SPL: "138 dB peak",
      Power: "2200W",
    },
    tags: ["Audio", "Subwoofer", "Bass"],
    image: "/images/products/subwoofer.jpg",
    isBundle: false,
  },
  {
    id: "wireless-mic-shure",
    name: "Shure Wireless Microphone System",
    category: "Audio",
    description:
      "Industry-standard wireless microphone system with handheld and bodypack options.",
    specs: {
      System: "UHF digital",
      Range: "90m line-of-sight",
      Battery: "8+ hours",
      Channels: "Up to 24 simultaneous",
    },
    tags: ["Audio", "Microphone", "Wireless"],
    image: "/images/products/wireless-mic.jpg",
    isBundle: false,
  },
  // ── Lighting ──────────────────────────────────────────────────────────────────
  {
    id: "moving-head-spot",
    name: "Moving Head Spot Fixture",
    category: "Lighting",
    description:
      "High-output 300W moving head spot with gobos, prism, and CMY color mixing — a production staple.",
    specs: {
      Power: "300W LED source",
      Pan: "540°",
      Tilt: "270°",
      Features: "Gobo, prism, iris, frost",
    },
    tags: ["Lighting", "Moving Head", "Spot"],
    image: "/images/products/moving-head-spot.jpg",
    isBundle: false,
  },
  {
    id: "led-uplight",
    name: "LED Uplight (RGBW)",
    category: "Lighting",
    description:
      "Battery-powered RGBW uplights for elegant venue wash — wireless DMX control, no cables needed.",
    specs: {
      Colors: "RGBW LED",
      Control: "Wireless DMX",
      Battery: "12+ hours",
      IP: "IP65 rated",
    },
    tags: ["Lighting", "Uplight", "Wireless"],
    image: "/images/products/led-uplight.jpg",
    isBundle: false,
  },
  {
    id: "haze-machine",
    name: "Haze Machine",
    category: "Lighting",
    description:
      "Fine atmospheric haze generator to enhance beam visibility and create premium event atmosphere.",
    specs: {
      Output: "Fine particle haze",
      Tank: "5L fluid capacity",
      Control: "DMX & wireless",
      Coverage: "600 m² per hour",
    },
    tags: ["Lighting", "Atmosphere", "Haze"],
    image: "/images/products/haze-machine.jpg",
    isBundle: false,
  },
  // ── LED Screens ───────────────────────────────────────────────────────────────
  {
    id: "led-wall-indoor-p3",
    name: "Indoor LED Wall P3",
    category: "LED Screens",
    description:
      "Fine-pitch P3 LED video wall panels for crisp, high-resolution indoor displays.",
    specs: {
      Pitch: "3mm pixel pitch",
      Brightness: "800 nits",
      Refresh: "3840 Hz",
      Size: "Modular — any size",
    },
    tags: ["LED", "Screen", "Indoor", "Video Wall"],
    image: "/images/products/led-wall-indoor.jpg",
    isBundle: false,
  },
  {
    id: "led-wall-outdoor-p6",
    name: "Outdoor LED Wall P6",
    category: "LED Screens",
    description:
      "Weather-resistant P6 outdoor LED panels for high-brightness, all-conditions displays.",
    specs: {
      Pitch: "6mm pixel pitch",
      Brightness: "5000 nits",
      IP: "IP65 front & back",
      Size: "Modular — any size",
    },
    tags: ["LED", "Screen", "Outdoor", "Video Wall"],
    image: "/images/products/led-wall-outdoor.jpg",
    isBundle: false,
  },
  // ── Staging ───────────────────────────────────────────────────────────────────
  {
    id: "stage-modular",
    name: "Modular Aluminum Stage",
    category: "Staging",
    description:
      "Lightweight aluminum deck stage in modular 2m×1m panels — any size, any height.",
    specs: {
      Material: "Aluminum alloy",
      Panel: "2m × 1m",
      Heights: "0.4m, 0.6m, 0.8m, 1.0m, 1.2m",
      "Load rating": "750 kg/m²",
    },
    tags: ["Stage", "Modular", "Aluminum"],
    image: "/images/products/modular-stage.jpg",
    isBundle: false,
  },
  // ── DJ ────────────────────────────────────────────────────────────────────────
  {
    id: "dj-pioneer-cdj3000",
    name: "Pioneer CDJ-3000",
    category: "DJ Equipment",
    description:
      "The industry-standard professional media player for club and event DJs.",
    specs: {
      Display: '9" full HD touchscreen',
      Formats: "USB, SD, LAN link",
      Jog: '7″ aluminum jog wheel',
      Connections: "XLR, RCA, digital",
    },
    tags: ["DJ", "CDJ", "Pioneer"],
    image: "/images/products/cdj3000.jpg",
    isBundle: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export const productCategories = [
  "All",
  "Bundles",
  "Audio",
  "Lighting",
  "LED Screens",
  "Staging",
  "DJ Equipment",
] as const;
