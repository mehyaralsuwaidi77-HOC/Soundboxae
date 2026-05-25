import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const categories = [
  {
    label: "Weddings",
    icon: "💍",
    href: "/services/wedding-setup",
    description: "Elegant AV for the most important day of your life.",
    gradient: "from-[#1a1209] to-[#111118]",
    accent: "#D6A84F",
  },
  {
    label: "Corporate Events",
    icon: "🏢",
    href: "/services/corporate-events",
    description: "Polished production for conferences, launches & galas.",
    gradient: "from-[#091220] to-[#111118]",
    accent: "#2F80ED",
  },
  {
    label: "Concerts",
    icon: "🎸",
    href: "/services/concert-setup",
    description: "Full concert infrastructure for live music & festivals.",
    gradient: "from-[#140919] to-[#111118]",
    accent: "#D6A84F",
  },
  {
    label: "Private Parties",
    icon: "🎉",
    href: "/services/event-production",
    description: "Premium DJ & AV setups for unforgettable private events.",
    gradient: "from-[#0d1a0d] to-[#111118]",
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
              className={`group relative overflow-hidden rounded-2xl p-8 flex flex-col gap-5 bg-gradient-to-br ${cat.gradient} border transition-[transform,box-shadow] duration-300 hover:-translate-y-2`}
              style={{
                borderColor: "rgba(214,168,79,0.1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-[opacity] duration-300 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, ${cat.accent}18 0%, transparent 70%)`,
                }}
              />

              <div>
                <h3
                  className="text-xl font-bold mb-2 transition-[color] duration-150 group-hover:text-[#D6A84F]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A7A7B3" }}>
                  {cat.description}
                </p>
              </div>

              <span
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider mt-auto"
                style={{ color: cat.accent }}
              >
                Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-[transform] duration-150" />
              </span>
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
