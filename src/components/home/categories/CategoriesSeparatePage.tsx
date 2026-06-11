"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  useCategories,
  useSubCategories,
} from "@/src/hooks/home/useCategories";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { Category } from "@/src/types/home/category";

// ─── Subcategory tile ─────────────────────────────────────────
function SubTile({
  sub,
  parentId,
  parentSlug,
}: {
  sub: Category;
  parentId: number;
  parentSlug: string;
}) {
  const imageUrl = useResolvedUrl(sub.icon ?? null);
  const href = `/category/${parentId}/${parentSlug.replace(/\./g, "")}?sub=${sub.id}`;

  return (
    <Link href={href} className="flex flex-col items-center gap-1 no-underline group">
      <div
        className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center p-2"
        style={{ backgroundColor: "var(--color-category-tile-bg, #eef4fb)" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={sub.name}
            className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          <div className="w-3/5 h-3/5 rounded-lg" style={{ backgroundColor: "var(--color-bg-subtle)" }} />
        )}
      </div>
      <span
        className="text-[0.6rem] md:text-[0.65rem] font-medium text-center leading-tight line-clamp-2 w-full"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
      >
        {sub.name}
      </span>
    </Link>
  );
}

// ─── One category section in the right panel ──────────────────
function CategorySection({
  category,
  sectionRef,
}: {
  category: Category;
  sectionRef: (el: HTMLDivElement | null) => void;
}) {
  const { data: subCategories, isLoading } = useSubCategories(category.id);
  const imageUrl = useResolvedUrl(category.icon ?? null);
  const href = `/category/${category.id}/${category.slug.replace(/\./g, "")}`;

  return (
    <div ref={sectionRef} className="flex flex-col gap-3 mb-6">
      <Link
        href={href}
        className="flex flex-row items-center justify-between rounded-2xl overflow-hidden px-4 py-3 no-underline"
        style={{
          backgroundColor: "var(--color-category-banner-bg, #fdf8ee)",
          minHeight: "80px",
        }}
      >
        <span
          className="text-sm md:text-base font-bold leading-tight flex-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {category.name}
        </span>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md shrink-0"
          />
        )}
      </Link>

      {isLoading ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--color-bg-subtle)" }} />
          ))}
        </div>
      ) : subCategories && subCategories.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {subCategories.map((sub) => (
            <SubTile key={sub.id} sub={sub} parentId={category.id} parentSlug={category.slug} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── Sidebar item ─────────────────────────────────────────────
function SidebarItem({
  category,
  isActive,
  onClick,
}: {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}) {
  const imageUrl = useResolvedUrl(category.icon ?? null);

  return (
    <button
      onClick={onClick}
      className="relative w-full flex flex-col md:flex-row items-center gap-1 md:gap-2.5 py-3 px-1 md:px-3 transition-colors duration-150 text-start"
      style={{
        backgroundColor: isActive ? "var(--color-primary-light, #fff4ee)" : "transparent",
        borderInlineStart: isActive
          ? "3px solid var(--color-primary)"
          : "3px solid transparent",
      }}
    >
      <div
        className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl flex items-center justify-center overflow-hidden p-1"
        style={{ backgroundColor: "var(--color-category-tile-bg, #f5f5f0)" }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={category.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full rounded-lg" style={{ backgroundColor: "var(--color-bg-subtle)" }} />
        )}
      </div>
      <span
        className="text-[0.6rem] md:text-xs font-medium leading-tight line-clamp-2 text-center md:text-start w-full"
        style={{
          fontFamily: "var(--font-sans)",
          color: isActive ? "var(--color-primary)" : "var(--color-text)",
        }}
      >
        {category.name}
      </span>
    </button>
  );
}

// ─── Main export ──────────────────────────────────────────────
export function CategoriesSeparatePage() {
  const { data: allCategories, isLoading } = useCategories();
  const [activeIndex, setActiveIndex] = useState(0);

  const mainCategories: Category[] =
    allCategories?.filter((c) => c.parent_id === 1) ?? [];

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  // Sidebar click → scroll page to that section
  const handleSidebarClick = useCallback((idx: number) => {
    setActiveIndex(idx);
    const el = sectionRefs.current[idx];
    if (!el) return;
    isScrollingProgrammatically.current = true;
    // offset 80px for sticky header
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    setTimeout(() => { isScrollingProgrammatically.current = false; }, 800);
  }, []);

  // Page scroll → update active sidebar item
  useEffect(() => {
    const onScroll = () => {
      if (isScrollingProgrammatically.current) return;
      const scrollY = window.scrollY;
      let current = 0;
      sectionRefs.current.forEach((el, idx) => {
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY - 100;
          if (top <= scrollY) current = idx;
        }
      });
      setActiveIndex(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mainCategories.length]);

  // Keep active sidebar item scrolled into view within the sticky sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const activeEl = sidebar.children[activeIndex] as HTMLElement | undefined;
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className="flex items-start">
        <div
          className="w-1/3 md:w-[200px] shrink-0 sticky top-[70px] flex flex-col gap-1 p-2"
          style={{
            backgroundColor: "var(--color-bg-subtle)",
            height: "calc(100vh - 70px)",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--color-bg)" }} />
          ))}
        </div>
        <div className="flex-1 p-3 flex flex-col gap-4">
          <div className="rounded-2xl h-20 animate-pulse" style={{ backgroundColor: "var(--color-bg-subtle)" }} />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl animate-pulse"
                style={{ backgroundColor: "var(--color-bg-subtle)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mainCategories.length === 0) return null;

  return (
    <div className="flex items-start">
      {/* ── Left sidebar: sticky, scrolls independently inside itself ── */}
      <div
        ref={sidebarRef}
        className="w-1/3 md:w-[200px] shrink-0 sticky top-[70px] flex flex-col overflow-y-auto"
        style={{
          backgroundColor: "var(--color-bg-subtle)",
          height: "calc(100vh - 70px)",
          scrollbarWidth: "none",
          borderInlineEnd: "1px solid var(--color-border, rgba(0,0,0,0.06))",
        }}
      >
        {mainCategories.map((cat, idx) => (
          <SidebarItem
            key={cat.id}
            category={cat}
            isActive={idx === activeIndex}
            onClick={() => handleSidebarClick(idx)}
          />
        ))}
      </div>

      {/* ── Right panel: normal flow, page scrolls it ── */}
      <div
        className="flex-1 px-3 pt-3 md:px-5 md:pt-4"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {mainCategories.map((cat, idx) => (
          <CategorySection
            key={cat.id}
            category={cat}
            sectionRef={(el) => { sectionRefs.current[idx] = el; }}
          />
        ))}
      </div>
    </div>
  );
}