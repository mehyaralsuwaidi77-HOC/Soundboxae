import Image from "next/image";
import { clients } from "@/data/clients";

export default function ClientLogosStrip() {
  // Duplicate for infinite scroll effect
  const doubled = [...clients, ...clients];

  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: "#050505", borderTop: "1px solid rgba(214,168,79,0.08)", borderBottom: "1px solid rgba(214,168,79,0.08)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#5A5A6E" }}
        >
          Trusted by Dubai&apos;s finest
        </p>
      </div>

      {/* Scrolling strip */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050505, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050505, transparent)" }}
        />

        <div className="flex animate-scroll-left gap-8 w-max">
          {doubled.map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className="client-logo-card flex items-center justify-center rounded-xl p-4 shrink-0"
              style={{ width: "130px", height: "80px" }}
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={100}
                height={50}
                className="object-contain client-logo-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
