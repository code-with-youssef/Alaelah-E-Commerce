// components/filters/ActiveFiltersDisplay.tsx
"use client";

import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ActiveFilters } from "@/src/types/products/filter";

interface ActiveFiltersDisplayProps {
  filters: ActiveFilters;
  onRemoveBrand: () => void;
  onRemovePrice: () => void;
  onClearAll: () => void;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
      style={{
        backgroundColor: "var(--color-primary-light)",
        color: "var(--color-primary)",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </span>
  );
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveBrand,
  onRemovePrice,
  onClearAll,
}: ActiveFiltersDisplayProps) {
  const t = useTranslations("product");
  const hasActiveFilters =
    filters.brandId !== null ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  if (!hasActiveFilters) return null;

  return (
    <div
      className="px-4 py-3 border-b"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
          {t("activeFilters")}
        </span>
        <button
          onClick={onClearAll}
          className="text-xs transition-colors"
          style={{ color: "var(--color-primary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-primary-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-primary)";
          }}
        >
          {t("clearAll")}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.brandName && (
          <FilterChip label={filters.brandName} onRemove={onRemoveBrand} />
        )}
        {(filters.minPrice || filters.maxPrice) && (
          <FilterChip
            label={`${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}`}
            onRemove={onRemovePrice}
          />
        )}
      </div>
    </div>
  );
}