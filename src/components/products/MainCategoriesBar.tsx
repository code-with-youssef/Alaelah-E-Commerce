"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Category } from "@/src/types/home/category";

interface MainCategoryBarProps {
  mainCategories: Category[];
  subCategoriesMap: Record<number, Category[]>;
  activeMainId: number | null;
  activeSubId: number | null;
  onSelectMain: (id: number | null) => void;
  onSelectSub: (id: number) => void;
  isLoadingSubs?: boolean;
}

export function MainCategoryBar({
  mainCategories,
  subCategoriesMap,
  activeMainId,
  activeSubId,
  onSelectMain,
  onSelectSub,
  isLoadingSubs = false,
}: MainCategoryBarProps) {
  const t = useTranslations("product");

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const subScrollRef = useRef<HTMLDivElement>(null);
  const mainButtonRefs = useRef<Map<number | "all", HTMLButtonElement>>(
    new Map(),
  );
  const subButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const activeSubs =
    activeMainId !== null ? (subCategoriesMap[activeMainId] ?? []) : [];

  // ── Scroll active main pill into view ──────────────────────
  useEffect(() => {
    const key = activeMainId ?? "all";
    const btn = mainButtonRefs.current.get(key);
    const container = mainScrollRef.current;
    if (!btn || !container) return;
    const scrollTo =
      btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
    container.scrollTo({ left: scrollTo, behavior: "smooth" });
  }, [activeMainId]);

  // ── Scroll active sub pill into view ───────────────────────
  useEffect(() => {
    if (activeSubId === null) return;
    const btn = subButtonRefs.current.get(activeSubId);
    const container = subScrollRef.current;
    if (!btn || !container) return;
    const scrollTo =
      btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
    container.scrollTo({ left: scrollTo, behavior: "smooth" });
  }, [activeSubId]);

  const hasSubs = activeSubs.length > 0;

  return (
    <div
      className="fixed left-0 right-0 z-30 top-14"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* ── Main category row ── */}
      <div
        ref={mainScrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
        role="tablist"
        aria-label={t("mainCategoryNavigation")}
      >
        {/* "All" pill */}
        <MainPill
          label={t("all")}
          isActive={activeMainId === null}
          refKey="all"
          buttonRefs={mainButtonRefs}
          onClick={() => onSelectMain(null)}
        />

        {mainCategories.map((cat) => (
          <MainPill
            key={cat.id}
            label={cat.name}
            isActive={activeMainId === cat.id}
            refKey={cat.id}
            buttonRefs={mainButtonRefs}
            onClick={() => onSelectMain(cat.id)}
          />
        ))}
      </div>

      {/* ── Sub-category row (animated) ── */}
      <div
        style={{
          maxHeight: hasSubs ? "56px" : "0px",
          overflow: "hidden",
          transition: "max-height 220ms ease",
          borderTop: hasSubs ? "1px solid var(--color-border)" : "none",
        }}
      >
        <div
          ref={subScrollRef}
          className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide"
          role="tablist"
          aria-label={t("subcategoryNavigation")}
        >
          {isLoadingSubs
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 rounded-full flex-shrink-0 animate-pulse"
                  style={{ backgroundColor: "var(--color-border)" }}
                />
              ))
            : activeSubs.map((sub) => {
                const isActive = sub.id === activeSubId;
                return (
                  <button
                    key={sub.id}
                    ref={(el) => {
                      if (el) subButtonRefs.current.set(sub.id, el);
                      else subButtonRefs.current.delete(sub.id);
                    }}
                    onClick={() => onSelectSub(sub.id)}
                    role="tab"
                    aria-selected={isActive}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-sans)",
                      backgroundColor: isActive
                        ? "var(--color-primary-light)"
                        : "transparent",
                      color: isActive
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)",
                      border: isActive
                        ? "1.5px solid var(--color-primary)"
                        : "1.5px solid var(--color-border)",
                    }}
                  >
                    {sub.name}
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}

// ── Small internal helper so the main row is DRY ─────────────

interface MainPillProps {
  label: string;
  isActive: boolean;
  refKey: number | "all";
  buttonRefs: React.MutableRefObject<Map<number | "all", HTMLButtonElement>>;
  onClick: () => void;
}

function MainPill({
  label,
  isActive,
  refKey,
  buttonRefs,
  onClick,
}: MainPillProps) {
  return (
    <button
      ref={(el) => {
        if (el) buttonRefs.current.set(refKey, el);
        else buttonRefs.current.delete(refKey);
      }}
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
      style={{
        fontFamily: "var(--font-sans)",
        backgroundColor: isActive
          ? "var(--color-primary-light)"
          : "transparent",
        color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
        border: isActive
          ? "1.5px solid var(--color-primary)"
          : "1.5px solid var(--color-border)",
      }}
    >
      {label}
    </button>
  );
}
