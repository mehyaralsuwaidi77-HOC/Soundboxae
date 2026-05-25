export interface Service {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  useCases: string[];
  image: string;
  category: "audio" | "visual" | "staging" | "production";
}

export const services: Service[] = [
  {
    slug: "audio-systems",
    title: "Audio Systems",
    subtitle: "Crystal-clear sound for every scale",
    description:
      "Professional line arrays, subwoofers, and PA systems engineered for perfect acoustics — from intimate gatherings to stadium-scale concerts.",
    longDescription:
      "Our premium audio inventory features world-class brands including d&b audiotechnik, L-Acoustics, and QSC. Every system is tuned by our certified audio engineers to deliver pristine sound reproduction. Whether you need a simple two-speaker setup for a boardroom or a full line-array hang for a 5,000-person concert, we have the gear and the expertise.",
    icon: "🔊",
    features: [
      "Line array speaker systems",
      "High-power subwoofer stacks",
      "Stage monitor wedges & IEM systems",
      "Digital mixing consoles (Yamaha, Allen & Heath, DiGiCo)",
      "Wireless microphone systems (Shure, Sennheiser)",
      "Audio signal processing & system tuning",
      "Full cabling and rigging included",
    ],
    useCases: ["Concerts", "Corporate events", "Weddings", "Private parties", "Conferences", "Outdoor festivals"],
    image: "/images/services/audio-systems.jpg",
    category: "audio",
  },
  {
    slug: "lighting-systems",
    title: "Lighting Systems",
    subtitle: "Transform any venue with stunning light",
    description:
      "From elegant uplighting to dramatic concert-grade moving heads — our lighting solutions create unforgettable atmospheres.",
    longDescription:
      "Our lighting inventory spans the full spectrum of professional event lighting. We stock the latest moving head fixtures, LED wash systems, architectural lighting, and intelligent beam effects. Our lighting designers work with you to craft a look that enhances your event theme and brand.",
    icon: "💡",
    features: [
      "Moving head spot & wash fixtures",
      "LED par cans and wash bars",
      "Follow spots (manual & robotic)",
      "Haze & fog machines",
      "Pixel mapping LED strips",
      "Lighting control consoles (MA Lighting, Avolites)",
      "Rigging and truss integration",
    ],
    useCases: ["Weddings", "Concert productions", "Brand activations", "Product launches", "Gala dinners", "Nightclub events"],
    image: "/images/services/lighting-systems.jpg",
    category: "visual",
  },
  {
    slug: "led-screens",
    title: "LED Screens",
    subtitle: "Vivid visuals that command attention",
    description:
      "Indoor and outdoor LED video walls in any configuration — delivering pixel-perfect imagery for maximum visual impact.",
    longDescription:
      "Our LED screen inventory includes fine-pitch indoor panels (P2.6 to P4) and high-brightness outdoor tiles (P5 to P10). We handle full installation, configuration, and content playback management. Custom shapes, curved configurations, and ceiling installations are all possible with our versatile modular system.",
    icon: "📺",
    features: [
      "Indoor fine-pitch LED panels (P2.6–P4)",
      "Outdoor high-brightness LED tiles (P5–P10)",
      "Video processors (Novastar, Brompton)",
      "Scalable modular configuration",
      "Content management & playback",
      "Curved and custom-shape builds",
      "Seamless edge-to-edge display",
    ],
    useCases: ["Concert backdrops", "Conference presentations", "Award ceremonies", "Outdoor advertising", "Sports events", "Brand activations"],
    image: "/images/services/led-screens.jpg",
    category: "visual",
  },
  {
    slug: "stages",
    title: "Stages",
    subtitle: "Elevated platforms built for the spotlight",
    description:
      "Modular staging systems in any size and height — engineered to the highest safety standards for performers and production alike.",
    longDescription:
      "Our aluminum and steel stage systems are engineered for rapid deployment and absolute structural integrity. From a simple 4×8m presentation riser to a full 30×20m concert stage with covered roof systems, our certified crew handles design, installation, and load calculations to meet UAE safety codes.",
    icon: "🎭",
    features: [
      "Modular aluminum deck systems",
      "Heights from 0.6m to 2m+",
      "Integrated cable management",
      "Stage extensions & thrust configurations",
      "Covered roof and weather protection",
      "Guardrails and safety barriers",
      "Structural load certification",
    ],
    useCases: ["Concerts", "Fashion shows", "Corporate presentations", "Weddings", "Award ceremonies", "Outdoor festivals"],
    image: "/images/services/stages.jpg",
    category: "staging",
  },
  {
    slug: "rigging",
    title: "Rigging",
    subtitle: "Safe, certified overhead production",
    description:
      "Professional rigging services using certified hardware and experienced riggers — ensuring your overhead production is safe and spectacular.",
    longDescription:
      "All rigging is executed by IRATA-certified riggers using rated chain hoists, shackles, and structural steelwork. We conduct full load assessments for every venue and provide documentation for venue compliance. From hanging a single chandelier to flying a full production rig with 50+ hoists, our team delivers with precision.",
    icon: "⛓️",
    features: [
      "Chain hoists (CM, Liftket) — 0.5T to 2T",
      "IRATA-certified rigging crew",
      "Structural load calculations",
      "Motor control systems",
      "Safety slings, shackles & hardware",
      "Venue inspection & compliance docs",
      "Pre-event load testing",
    ],
    useCases: ["Concert productions", "Theatre shows", "Corporate galas", "Award ceremonies", "Exhibitions", "Architectural lighting installs"],
    image: "/images/services/rigging.jpg",
    category: "staging",
  },
  {
    slug: "trusses",
    title: "Trusses",
    subtitle: "Structural backbone for world-class productions",
    description:
      "Heavy-duty aluminum truss systems that provide the foundation for lighting rigs, PA hangs, LED screens, and scenic elements.",
    longDescription:
      "We stock a comprehensive range of box truss, tri-truss, and circle truss in standard lengths and custom configurations. All truss comes with rated connection hardware and is maintained to strict inspection schedules. Our technical team handles structural design and ensures every build complies with load requirements.",
    icon: "🏗️",
    features: [
      "Box truss (290mm & 390mm)",
      "Tri truss and ladder truss",
      "Circle and arc truss configurations",
      "Rated corner blocks and couplers",
      "Ground support tower systems",
      "Custom configurations available",
      "Technical drawings on request",
    ],
    useCases: ["Concert productions", "Exhibition stands", "Corporate stages", "Outdoor events", "TV & film sets", "Themed installations"],
    image: "/images/services/trusses.jpg",
    category: "staging",
  },
  {
    slug: "dj-equipment",
    title: "DJ Equipment",
    subtitle: "Professional gear for the perfect set",
    description:
      "Industry-standard DJ equipment — from CDJ setups and mixers to full DJ booths — for clubs, weddings, and events of every scale.",
    longDescription:
      "Our DJ inventory covers everything professional DJs require: Pioneer CDJ-3000 media players, DJM mixers, Rane Sevens, full DJ booths with built-in monitoring, and lighting controller integration. All equipment is PAT tested and delivered in road cases with complete cabling.",
    icon: "🎧",
    features: [
      "Pioneer CDJ-3000 media players",
      "Pioneer DJM-900NXS2 mixer",
      "Rane Seven & Seventy-Two controllers",
      "Custom DJ booth options",
      "Technics SL-1200 turntables",
      "Booth monitors (Yamaha, QSC)",
      "Full cabling and road cases",
    ],
    useCases: ["Weddings", "Club nights", "Corporate parties", "Brand activations", "Pool parties", "Private events"],
    image: "/images/services/dj-equipment.jpg",
    category: "audio",
  },
  {
    slug: "event-production",
    title: "Event Production",
    subtitle: "End-to-end production management",
    description:
      "Full turnkey event production — from initial concept and technical design to on-site delivery, setup, and operation.",
    longDescription:
      "Soundbox provides complete event production services across Dubai and the UAE. Our production team handles technical design, site surveys, crew scheduling, equipment logistics, on-site supervision, and post-event breakdown. We coordinate every element so you can focus on your guests.",
    icon: "🎬",
    features: [
      "Technical event design & CAD drawings",
      "Full equipment supply (audio, visual, staging)",
      "Experienced crew (engineers, riggers, operators)",
      "Site survey and advance preparation",
      "On-site technical direction",
      "Logistics and transport",
      "Post-event breakdown & collection",
    ],
    useCases: ["Large-scale concerts", "Corporate conferences", "Exhibition builds", "Gala dinners", "Product launches", "Government events"],
    image: "/images/services/event-production.jpg",
    category: "production",
  },
  {
    slug: "concert-setup",
    title: "Concert Setup",
    subtitle: "Concert-grade production for live music",
    description:
      "Complete concert infrastructure — full PA systems, stage structures, lighting rigs, LED screens, and production crew for live music events.",
    longDescription:
      "From intimate 500-person shows to major outdoor concerts, Soundbox delivers the full technical rider. We work directly with artist management and production riders to match technical specifications and deliver an immersive live experience. Our concert packages include all audio, lighting, staging, and rigging elements.",
    icon: "🎸",
    features: [
      "Main PA & delay speaker systems",
      "Monitor world and IEM systems",
      "Full production lighting rig",
      "LED screen backdrops",
      "Concert stage with roof",
      "Rigging and truss structure",
      "FOH & monitor mix positions",
    ],
    useCases: ["Outdoor concerts", "Indoor arena shows", "Music festivals", "Tour production", "Headline performances", "Open-air events"],
    image: "/images/services/concert-setup.jpg",
    category: "production",
  },
  {
    slug: "wedding-setup",
    title: "Wedding Setup",
    subtitle: "Crafting the perfect wedding ambiance",
    description:
      "Luxurious audio visual production for weddings — elegant lighting designs, seamless sound, and stunning LED displays tailored to your vision.",
    longDescription:
      "Your wedding deserves perfection. Our wedding AV team specializes in creating intimate, romantic, and opulent atmospheres that complement your venue and theme. From subtle uplighting in gold and white to dramatic entrance reveals with synchronized lighting and sound, every detail is choreographed.",
    icon: "💍",
    features: [
      "Ceremony & reception audio systems",
      "Wireless lavalier microphones",
      "Romantic uplighting and ambiance lighting",
      "LED backdrop screens",
      "Monogram projection",
      "Dance floor lighting effects",
      "Dedicated wedding AV coordinator",
    ],
    useCases: ["Ballroom weddings", "Beach ceremonies", "Hotel receptions", "Garden weddings", "Destination weddings", "UAE traditional weddings"],
    image: "/images/services/wedding-setup.jpg",
    category: "production",
  },
  {
    slug: "corporate-events",
    title: "Corporate Events",
    subtitle: "Professional production for business",
    description:
      "Polished AV solutions for corporate conferences, product launches, award ceremonies, and brand activations across Dubai and the UAE.",
    longDescription:
      "Soundbox understands corporate requirements: reliable equipment, professional crew, and seamless execution. We provide clear presentation audio, bright projection or LED screens, confident room acoustics, and branded lighting environments. Our team is experienced in working with Fortune 500 companies and UAE government entities.",
    icon: "🏢",
    features: [
      "Conference audio and presentation systems",
      "Large-format LED screens and projectors",
      "Interpretation & translation systems",
      "Stage and podium setup",
      "Branded lighting environments",
      "Live streaming integration",
      "Simultaneous multi-room setups",
    ],
    useCases: ["Annual general meetings", "Product launches", "Award ceremonies", "Team-building events", "Training sessions", "Press conferences"],
    image: "/images/services/corporate-events.jpg",
    category: "production",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: Service["category"]): Service[] {
  return services.filter((s) => s.category === category);
}
