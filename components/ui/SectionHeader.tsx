interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
          style={{ color: "#D6A84F" }}
        >
          {eyebrow}
        </p>
      )}
      <div className={`gold-divider ${centered ? "mx-auto" : ""}`} />
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 text-base md:text-lg max-w-2xl leading-relaxed"
          style={{ color: "#A7A7B3", ...(centered ? { marginLeft: "auto", marginRight: "auto" } : {}) }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
