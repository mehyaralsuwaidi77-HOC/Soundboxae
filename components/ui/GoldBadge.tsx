interface GoldBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function GoldBadge({ children, className = "" }: GoldBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${className}`}
      style={{
        background: "rgba(214,168,79,0.12)",
        color: "#D6A84F",
        borderColor: "rgba(214,168,79,0.3)",
      }}
    >
      {children}
    </span>
  );
}
