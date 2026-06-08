"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Category } from "@/src/types/home/category";

interface DesktopSidebarProps {
  subCategories: Category[];
  activeId?: number;
  onSelect: (id: number) => void;
  categoryName: string;
  productCounts: Record<number, number>;
}

export function DesktopSidebar({
  subCategories,
  activeId,
  onSelect,
  categoryName,
  productCounts,
}: DesktopSidebarProps) {
  const t = useTranslations("product");
  const activeRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const prevLengthRef = useRef(0);

  // Animate newly added subcategories one by one with staggered delay
  useEffect(() => {
    const newSubs = subCategories.slice(prevLengthRef.current);
    if (newSubs.length === 0) return;

    newSubs.forEach((sub, i) => {
      setTimeout(() => {
        setVisibleIds((prev) => new Set([...prev, sub.id]));
      }, i * 80);
    });

    prevLengthRef.current = subCategories.length;
  }, [subCategories]);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const btn = activeRef.current;
      const scrollTo =
        btn.offsetTop - container.offsetHeight / 2 + btn.offsetHeight / 2;
      container.scrollTo({ top: scrollTo, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <aside
      className="hidden lg:flex flex-col sticky top-[105px] h-[calc(100dvh-105px)] w-56 xl:w-64 flex-shrink-0"
      style={{ borderRight: "1px solid var(--color-border)" }}
      aria-label={t("categoriesSidebar")}
    >
      <div
        className="px-4 py-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <h2
          className="text-sm font-bold uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-muted)",
          }}
        >
          {categoryName}
        </h2>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto py-2 scrollbar-hide"
        role="tablist"
        aria-label={t("subcategoryList")}
      >
        {subCategories.map((sub) => {
          const isActive = sub.id === activeId;
          const count = productCounts[sub.id];
          const isVisible = visibleIds.has(sub.id);

          return (
            <button
              key={sub.id}
              ref={isActive ? activeRef : null}
              onClick={() => onSelect(sub.id)}
              className="w-full flex items-center cursor-pointer justify-between px-4 py-3 text-left relative"
              style={{
                backgroundColor: isActive
                  ? "var(--color-primary-light)"
                  : "transparent",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(-8px)",
                transition: isVisible
                  ? "opacity 300ms ease, transform 300ms ease, background-color 150ms ease"
                  : "none",
              }}
              aria-pressed={isActive}
              role="tab"
              aria-selected={isActive}
              aria-label={isActive ? t("activeSubcategory", { name: sub.name }) : t("selectSubcategory", { name: sub.name })}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  aria-hidden="true"
                />
              )}

              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text)",
                  transition: "color 150ms ease",
                }}
              >
                {sub.name}
              </span>

              {count !== undefined && (
                <span
                  className="text-[11px] font-medium ml-2 shrink-0"
                  style={{ color: "var(--color-text-placeholder)" }}
                  aria-label={t("productCount", { count })}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}