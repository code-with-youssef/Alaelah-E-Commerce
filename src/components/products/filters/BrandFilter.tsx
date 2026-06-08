// components/filters/BrandFilter.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { Brand } from "@/src/types/home/brand";
import { useBrands, useCategoryBrands } from "@/src/hooks/home/useBrands";

interface BrandFilterProps {
  catId?: number | null; // now optional
  selectedBrandId: number | null;
  selectedBrandName: string | null;
  onBrandSelect: (brandId: number | null, brandName: string | null) => void;
}

export function BrandFilter({
  catId,
  selectedBrandId,
  selectedBrandName,
  onBrandSelect,
}: BrandFilterProps) {
  const t = useTranslations("product");
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const categoryBrands = useCategoryBrands(catId ?? 0);
  const allBrands = useBrands({ perPage: 9999999 });

  const { data, isLoading, error } = catId ? categoryBrands : allBrands;
  const brands: Brand[] = data?.brands ?? [];

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-4 transition-colors hover:bg-subtle"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {t("filterBrand")}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon
            className="w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
          />
        ) : (
          <ChevronDownIcon
            className="w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
          />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder={t("searchBrands")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg animate-pulse"
                  style={{ backgroundColor: "var(--color-bg-muted)" }}
                />
              ))
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-sm" style={{ color: "var(--color-error)" }}>
                  {t("errorLoadingBrands")}
                </p>
              </div>
            ) : filteredBrands.length === 0 ? (
              <div className="text-center py-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-placeholder)" }}
                >
                  {searchTerm ? t("noBrandsFound") : t("noBrands")}
                </p>
              </div>
            ) : (
              filteredBrands.map((brand) => {
                const isSelected = selectedBrandId === brand.id;
                return (
                  <button
                    key={brand.id}
                    onClick={() =>
                      onBrandSelect(
                        isSelected ? null : brand.id,
                        isSelected ? null : brand.name,
                      )
                    }
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--color-primary-light)"
                        : "transparent",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--color-primary)"
                          : "transparent",
                        borderColor: isSelected
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                      }}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: isSelected
                            ? "var(--color-primary)"
                            : "var(--color-text)",
                        }}
                      >
                        {brand.name}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
