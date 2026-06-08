"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Category } from "@/src/types/home/category";

interface SubCategoryBarProps {
  subCategories: Category[];
  activeId?: number;
  onSelect: (id: number) => void;
}

export function SubCategoryBar({
  subCategories,
  activeId,
  onSelect,
}: SubCategoryBarProps) {
  const t = useTranslations("product");
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  console.log("SubCategoryBar rendered with activeId:", activeId);

  // Scroll active pill into view whenever activeId changes
  useEffect(() => {
    if (activeId === undefined) return;
    const btn = buttonRefs.current.get(activeId);
    if (btn && scrollRef.current) {
      const container = scrollRef.current;
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollTo = btnLeft - containerWidth / 2 + btnWidth / 2;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div
      className="fixed left-0 right-0 z-30 top-14"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
      aria-label={t("subcategoryNavigation")}
    >
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
        role="tablist"
        aria-label={t("subcategoryTabs")}
      >
        {subCategories.map((sub) => {
          const isActive = sub.id === activeId;
          return (
            <button
              key={sub.id}
              ref={(el) => {
                if (el) buttonRefs.current.set(sub.id, el);
                else buttonRefs.current.delete(sub.id);
              }}
              onClick={() => onSelect(sub.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sans)",
                backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                border: isActive
                  ? "1.5px solid var(--color-primary)"
                  : "1.5px solid var(--color-border)",
              }}
              aria-pressed={isActive}
              role="tab"
              aria-selected={isActive}
              aria-label={isActive ? t("activeSubcategory", { name: sub.name }) : t("selectSubcategory", { name: sub.name })}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}