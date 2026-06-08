import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  onViewAll?: () => void;
}

export function SectionHeader({ title, viewAllHref, onViewAll }: SectionHeaderProps) {
  const t = useTranslations("home");

  return (
    <div className="flex items-center justify-between mb-3">
      <h2
        className="text-xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
      >
        {title}
      </h2>

      {(viewAllHref || onViewAll) && (
        onViewAll ? (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm font-semibold transition-colors"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
          >
            {t("sectionHeader.viewAll")}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={viewAllHref || "#"}
            className="flex items-center gap-1 text-sm font-semibold transition-colors"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
          >
            {t("sectionHeader.viewAll")}
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        )
      )}
    </div>
  );
}