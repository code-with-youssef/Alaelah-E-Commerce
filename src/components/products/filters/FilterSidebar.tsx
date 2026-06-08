"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { ActiveFilters } from "@/src/types/products/filter";
import { BrandFilter } from "./BrandFilter";
import { PriceFilter } from "./PriceFilter";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";

interface FilterSidebarProps {
  catId: number | null;
  activeFilters: ActiveFilters;
  onApply: (filters: ActiveFilters) => void;
  onClear: () => void;
}

const EMPTY_FILTERS: ActiveFilters = {
  brandId: null,
  brandName: null,
  minPrice: "",
  maxPrice: "",
};

export function FilterSidebar({
  catId,
  activeFilters,
  onApply,
  onClear,
}: FilterSidebarProps) {
  const t = useTranslations("product");
  const [draft, setDraft] = useState<ActiveFilters>(activeFilters);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(activeFilters);
  }, [activeFilters]);

  const hasActiveFilters =
    activeFilters.brandId !== null ||
    activeFilters.minPrice !== "" ||
    activeFilters.maxPrice !== "";

  const activeCount = [
    activeFilters.brandId !== null,
    activeFilters.minPrice !== "" || activeFilters.maxPrice !== "",
  ].filter(Boolean).length;

  const hasDraftChanges =
    draft.brandId !== activeFilters.brandId ||
    draft.minPrice !== activeFilters.minPrice ||
    draft.maxPrice !== activeFilters.maxPrice;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApply = async () => {
    setIsApplying(true);
    await onApply(draft);
    setIsApplying(false);
    setMobileOpen(false);
    scrollToTop();
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onClear();
    setMobileOpen(false);
    scrollToTop();
  };

  const handleBrandSelect = (brandId: number | null, brandName: string | null) => {
    setDraft((prev) => ({ ...prev, brandId, brandName }));
  };

  const handlePriceChange = (min: string, max: string) => {
    setDraft((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleRemoveBrand = () => {
    setDraft((prev) => ({ ...prev, brandId: null, brandName: null }));
    onApply({ ...activeFilters, brandId: null, brandName: null });
    scrollToTop();
  };

  const handleRemovePrice = () => {
    setDraft((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
    onApply({ ...activeFilters, minPrice: "", maxPrice: "" });
    scrollToTop();
  };

  // ── Shared action buttons (rendered inline after PriceFilter) ──
  const ActionButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className="px-4 pt-3 pb-4 space-y-2"
      style={{ borderColor: "var(--color-border)" }}
    >
      {mobile ? (
        // Mobile: clear + apply side by side
        <div className="flex gap-3">
          {(draft.brandId !== null || draft.minPrice !== "" || draft.maxPrice !== "") && (
            <button
              onClick={() => {
                handleBrandSelect(null, null);
                handlePriceChange("", "");
              }}
              className="flex-1 btn-secondary"
              style={{ fontSize: "0.875rem", padding: "0.75rem" }}
            >
              {t("filterClear")}
            </button>
          )}
          <button
            onClick={handleApply}
            disabled={isApplying || !hasDraftChanges}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: "0.875rem", padding: "0.75rem" }}
          >
            {isApplying ? t("applying") : t("filterApply")}
          </button>
        </div>
      ) : (
        // Desktop: stacked
        <>
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="btn-secondary w-full"
              style={{ fontSize: "0.875rem", padding: "0.625rem 1rem" }}
            >
              {t("filterClear")}
            </button>
          )}
          <button
            onClick={handleApply}
            disabled={isApplying || !hasDraftChanges}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: "0.875rem", padding: "0.625rem 1rem" }}
          >
            {isApplying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("applying")}
              </div>
            ) : (
              t("filterApply")
            )}
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col sticky top-[105px] h-[calc(100dvh-105px)] w-72 flex-shrink-0 border-l shadow-lg z-10"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg)",
        }}
        aria-label={t("filterSidebar")}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
            <h2
              className="text-base font-bold"
              style={{ color: "var(--color-text)" }}
            >
              {t("filters")}
            </h2>
          </div>
          {hasActiveFilters && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-full text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {activeCount}
            </span>
          )}
        </div>

        {/* Active Filters */}
        <ActiveFiltersDisplay
          filters={activeFilters}
          onRemoveBrand={handleRemoveBrand}
          onRemovePrice={handleRemovePrice}
          onClearAll={handleClear}
        />

        {/* Filter Panels + Actions */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <BrandFilter
            catId={catId}
            selectedBrandId={draft.brandId}
            selectedBrandName={draft.brandName}
            onBrandSelect={handleBrandSelect}
          />
          <PriceFilter
            minPrice={draft.minPrice}
            maxPrice={draft.maxPrice}
            onPriceChange={handlePriceChange}
          />
          {/* Actions sit directly after PriceFilter, inside the scroll area */}
          <ActionButtons />
        </div>
      </aside>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-semibold text-sm active:scale-95 transition-all"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#fff",
          }}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          {t("filters")}
          {activeCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 transition-opacity"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            ref={panelRef}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl flex flex-col animate-slide-up"
            style={{
              backgroundColor: "var(--color-bg)",
              maxHeight: "85dvh",
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: "var(--color-border)" }}
              />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--color-text)" }}
              >
                {t("filters")}
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-full transition-colors hover:bg-subtle"
              >
                <XMarkIcon className="w-6 h-6" style={{ color: "var(--color-text-muted)" }} />
              </button>
            </div>

            {/* Active Filters (Mobile) */}
            <ActiveFiltersDisplay
              filters={draft}
              onRemoveBrand={() => handleBrandSelect(null, null)}
              onRemovePrice={() => handlePriceChange("", "")}
              onClearAll={() => {
                handleBrandSelect(null, null);
                handlePriceChange("", "");
              }}
            />

            {/* Filter Panels + Actions (Mobile) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <BrandFilter
                catId={catId}
                selectedBrandId={draft.brandId}
                selectedBrandName={draft.brandName}
                onBrandSelect={handleBrandSelect}
              />
              <PriceFilter
                minPrice={draft.minPrice}
                maxPrice={draft.maxPrice}
                onPriceChange={handlePriceChange}
              />
              {/* Actions sit directly after PriceFilter, inside the scroll area */}
              <ActionButtons mobile />
            </div>
          </div>
        </>
      )}
    </>
  );
}