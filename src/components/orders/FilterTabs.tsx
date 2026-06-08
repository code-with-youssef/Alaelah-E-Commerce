// app/orders/components/FilterTabs.tsx
"use client";

import { useRef, useEffect } from "react";
import { FILTER_TABS } from "@/src/config/order";
import type { OrderFilter } from "@/src/config/order";
import { useTranslations } from "next-intl";

interface FilterTabsProps {
  active: OrderFilter;
  onChange: (filter: OrderFilter) => void;
  counts?: Partial<Record<OrderFilter, number>>;
}

export function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  const t = useTranslations("orders");
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Get translated tab labels
  const getTabLabel = (tabId: string): string => {
    switch (tabId) {
      case "all":
        return t("tabAll");
      case "active":
        return t("tabActive");
      case "completed":
        return t("tabCompleted");
      case "cancelled":
        return t("tabCancelled");
      default:
        return tabId;
    }
  };

  useEffect(() => {
    const btn = btnRefs.current.get(active);
    const container = scrollRef.current;
    if (!btn || !container) return;
    const scrollTo = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
    container.scrollTo({ left: scrollTo, behavior: "smooth" });
  }, [active]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {FILTER_TABS.map((tab) => {
        const isActive = active === tab.id;
        const count = counts?.[tab.id] || 0;

        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) btnRefs.current.set(tab.id, el);
              else btnRefs.current.delete(tab.id);
            }}
            onClick={() => onChange(tab.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: isActive ? "var(--color-primary)" : "var(--color-bg-subtle)",
              color: isActive ? "#ffffff" : "var(--color-text-muted)",
            }}
          >
            {getTabLabel(tab.id)}
            {count > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--color-primary-light)",
                  color: isActive ? "#fff" : "var(--color-primary)",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}