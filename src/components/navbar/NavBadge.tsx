interface NavBadgeProps {
  count: number;
}

export function NavBadge({ count }: NavBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full
                 flex items-center justify-center
                 text-[10px] font-bold text-white leading-none"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}