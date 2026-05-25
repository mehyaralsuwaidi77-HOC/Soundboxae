import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const categories = [
  {
    label: "Weddings",
    image: "/Category%20BG/Wedding%20Setup%20BG.png",
    href: "/services/wedding-setup",
    description: "Elegant AV for the most important day of your life.",
    accent: "#D6A84F",
  },
  {
    label: "Corporate Events",
    image: "/Category%20BG/Corporate%20Events%20BG.png",
    href: "/services/corporate-events",
    description: "Polished production for conferences, launches & galas.",
    accent: "#2F80ED",
  },
  {
    label: "Concerts",
    image: "/Category%20BG/Concert%20Setup%20BG.png",
    href: "/services/concert-setup",
    description: "Full concert infrastructure for live music & festivals.",
    accent: "#D6A84F",
  },
  {
    label: "Private Parties",
    image: "/Category%20BG/Event%20Production%20BG.png",
    href: "/services/event-production",
    description: "Premium DJ & AV setups for unforgettable private events.",
    accent: "#D6A84F",
  },
];

export default function FeaturedCategories() {
  return (
    <section
      className="py-24 relative"
      style={{ background: "#111118" }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(214,168,79,0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Event Types"
          title="We Cover Every Occasion"
          subtitle="From intimate weddings to stadium concerts — our team has the expertise and equipment for every event format."
          centered
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-2"
              style={{
                minHeight: "260px",
                border: "1px solid rgba(214,168,79,0.12)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
              }}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-[transform] duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to bottom, rgba(5,5,5,0.3), rgba(5,5,5,0.85))",
                  }}
                />
              </div>

              {/* Hover accent glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-[opacity] duration-300 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, ${cat.accent}22 0%, transparent 65%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end flex-1 p-7 gap-3">
                <div>
                  <h3
                    className="text-xl font-bold mb-2 transition-[color] duration-150 group-hover:text-[#D6A84F]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(200,200,210,0.85)" }}>
                    {cat.description}
                  </p>
                </div>

                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mt-1"
                  style={{ color: cat.accent }}
                >
                  Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-[transform] duration-150" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(214,168,79,0.3), transparent)",
        }}
      />
    </section>
  );
}
