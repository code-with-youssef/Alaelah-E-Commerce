"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useCategories } from "@/src/hooks/home/useCategories";
import { generatePaletteCSS } from "@/src/config/color-palettes";
import { Category } from "@/src/types/home/category";
import CategoryCard from "./CategoryCard";

interface CategoriesModalProps {
  onClose: () => void;
}

function sortCategories(categories: Category[]): Category[] {
  return [
    ...categories.filter((c) => c.top),
    ...categories.filter((c) => !c.top),
  ];
}

export function CategoriesModal({ onClose }: CategoriesModalProps) {
  const t = useTranslations("home");
  const paletteCSS = generatePaletteCSS();

  const { data: categories, isLoading, isError } = useCategories();

  const allCategories: Category[] = categories ? sortCategories(categories) : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl animate-fade-in
                   sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                   sm:rounded-3xl sm:w-full sm:max-w-2xl lg:max-w-3xl"
        style={{
          backgroundColor: "var(--color-bg)",
          maxHeight: "88dvh",
          display: "flex",
          flexDirection: "column",
        }}
        role="dialog"
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <h3
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {t("category.title")}
            {allCategories.length > 0 && (
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({allCategories.length})
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              color: "var(--color-text-muted)",
            }}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
          {/* Inject palette styles */}
          <style>{paletteCSS}</style>

          {/* Skeleton — first load */}
          {isLoading && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-full aspect-square rounded-2xl animate-pulse bg-gray-100" />
                  <div className="w-3/4 h-2 rounded animate-pulse bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <p
              className="text-sm text-center py-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("categories.errorLoading")}
            </p>
          )}

          {/* Full grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {allCategories.map((cat, idx) => (
                <div key={cat.id} onClick={onClose}>
                  <CategoryCard category={cat} index={idx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}