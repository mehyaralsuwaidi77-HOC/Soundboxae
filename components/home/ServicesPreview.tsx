import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { services } from "@/data/services";

const featured = services.slice(0, 8);

export default function ServicesPreview() {
  return (
    <section
      className="py-24 relative"
      style={{ background: "#0B0B0F" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="What We Do"
            title="Complete AV Solutions"
            subtitle="From intimate gatherings to grand productions — we provide every technical element your event needs."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium shrink-0 transition-[color] duration-150"
            style={{ color: "#D6A84F" }}
          >
            All Services
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group glass-card rounded-xl p-6 flex flex-col gap-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div>
                <h3
                  className="text-lg font-semibold mb-1 group-hover:text-[#D6A84F] transition-[color] duration-150"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#A7A7B3" }}>
                  {service.description}
                </p>
              </div>
              <span
                className="mt-auto inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-[opacity] duration-200"
                style={{ color: "#D6A84F" }}
              >
                Learn more <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
