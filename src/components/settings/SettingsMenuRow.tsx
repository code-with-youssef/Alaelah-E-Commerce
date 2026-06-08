import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface SettingsMenuRowProps {
  label: string;
  href: string;
  danger?: boolean;
}

export function SettingsMenuRow({ label, href, danger = false }: SettingsMenuRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-4 transition-colors active:bg-[var(--color-bg-subtle)]"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <span
        className="text-base font-medium"
        style={{
          fontFamily: "var(--font-sans)",
          color: danger ? "var(--color-error)" : "var(--color-text)",
        }}
      >
        {label}
      </span>
      <ChevronRightIcon
        className="w-4 h-4"
        style={{ color: "var(--color-text-muted)" }}
        strokeWidth={2}
      />
    </Link>
  );
}