import Link from "next/link";
import Image from "next/image";
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
              className="group glass-card rounded-xl overflow-hidden flex flex-col transition-[transform,box-shadow] duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={service.bgImage}
                  alt={`${service.title} — Soundbox Dubai`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-[transform] duration-500 group-hover:scale-108"
                  style={{ transform: "scale(1.02)" }}
                  unoptimized
                  priority={i < 4}
                />
                {/* Multi-layer overlay for depth */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(5,5,5,0) 30%, rgba(11,11,15,0.75) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-[opacity] duration-400"
                  style={{
                    background: "rgba(214,168,79,0.06)",
                  }}
                />
              </div>

              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3
                  className="text-base font-semibold group-hover:text-[#D6A84F] transition-[color] duration-150"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#A7A7B3" }}>
                  {service.description}
                </p>
                <span
                  className="mt-auto inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-[opacity] duration-200"
                  style={{ color: "#D6A84F" }}
                >
                  Learn more <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
