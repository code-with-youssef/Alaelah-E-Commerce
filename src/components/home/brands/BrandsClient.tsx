"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useBrands } from "@/src/hooks/home/useBrands";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import type { Brand } from "@/src/types/home/brand";
import { SkeletonCard } from "../../shared/SkeltonCard";

// ── Arabic alphabet (28 letters) ──────────────────────────────
const AR_LETTERS = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ",
  "د", "ذ", "ر", "ز", "س", "ش", "ص",
  "ض", "ط", "ظ", "ع", "غ", "ف", "ق",
  "ك", "ل", "م", "ن", "ه", "و", "ي",
];

const EN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ── helpers ───────────────────────────────────────────────────

function normaliseAr(str: string): string {
  return str.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
}

function startsWithLetter(brand: Brand, letter: string, locale: string): boolean {
  const name = brand.name.trim();
  if (!name) return false;
  if (locale === "eg") {
    return normaliseAr(name).startsWith(normaliseAr(letter));
  }
  return name.toUpperCase().startsWith(letter.toUpperCase());
}

// ── sub-components ────────────────────────────────────────────

function BrandCard({ brand, locale }: { brand: Brand; locale: string }) {
  const resolvedLogo = useResolvedUrl(brand.logo);
  const displayName = brand.name;

  return (
    <Link
      href={`/brand/${brand.id}/${brand.slug.replace(/\./g, "")}`}
      className="group flex flex-col items-center gap-1.5 transition-transform duration-200 hover:-translate-y-1"
      aria-label={displayName}
    >
      <div
        className="w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center transition-shadow duration-200 group-hover:shadow-md"
        style={{
          backgroundColor: "var(--color-bg-subtle)",
          boxShadow: "var(--shadow-card)",
          padding: "8px",
        }}
      >
        {resolvedLogo ? (
          <img
            src={resolvedLogo}
            alt={displayName}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : (
          <span
            className="font-bold text-center leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(9px, 2.2vw, 13px)",
              color: "var(--color-text)",
            }}
          >
            {displayName}
          </span>
        )}
      </div>

      <span
        className="w-full text-center truncate text-[10px] md:text-[11px] font-medium leading-tight"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {displayName}
      </span>
    </Link>
  );
}

// ── main component ────────────────────────────────────────────

export function BrandsClient() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isAr = locale === "eg";

  const letters = isAr ? AR_LETTERS : EN_LETTERS;

  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  // Fetch ALL brands in one shot
  const { data, isLoading, isError } = useBrands({ perPage: 999999, page: 1 });

  const allBrands: Brand[] = useMemo(() => {
    if (!data?.brands) return [];
    return [...data.brands].sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [data, locale]);

  const lettersWithBrands = useMemo(
    () =>
      new Set(
        letters.filter((l) => allBrands.some((b) => startsWithLetter(b, l, locale)))
      ),
    [allBrands, letters, locale]
  );

  const visibleBrands = useMemo(() => {
    if (!activeLetter) return allBrands;
    return allBrands.filter((b) => startsWithLetter(b, activeLetter, locale));
  }, [allBrands, activeLetter, locale]);

  const grouped = useMemo(() => {
    if (activeLetter) return null;
    const map: Record<string, Brand[]> = {};
    for (const brand of allBrands) {
      const name = brand.name.trim();
      if (!name) continue;
      const firstChar = isAr ? normaliseAr(name[0]) : name[0].toUpperCase();
      if (!map[firstChar]) map[firstChar] = [];
      map[firstChar].push(brand);
    }
    return map;
  }, [allBrands, activeLetter, isAr]);

  // ── letter selection: set filter + scroll to top ──
  function handleLetterClick(letter: string | null) {
    setActiveLetter((prev) => (letter !== null && prev === letter ? null : letter));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg, #f8f8f8)" }}
    >
      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-10 shadow-sm"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {/* Title row — same horizontal padding as the cards grid */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1
            className="text-xl font-bold shrink-0"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {t("brands.title")}
            {!isLoading && data?.meta?.total != null && (
              <span
                className="ms-2 text-sm font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({data.meta.total})
              </span>
            )}
          </h1>

          {activeLetter && (
            <button
              onClick={() => handleLetterClick(null)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-opacity hover:opacity-70"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span>{activeLetter}</span>
              <span className="text-xs opacity-80">✕</span>
            </button>
          )}
        </div>

        {/* ── Letter strip — scrollable, starts at the same px-4 margin as cards ── */}
        <div
          className="border-t overflow-x-auto py-4"
          style={{ borderColor: "var(--color-border)", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/*
            max-w-7xl + px-4 mirrors the cards grid below so the "All" pill
            lines up flush with the left (LTR) or right (RTL) edge of the grid.
            w-max keeps the inner row from wrapping while min-w-full ensures
            it fills the viewport when there's extra space.
          */}
          <div
            className="max-w-7xl mx-auto px-4 py-2"
            dir={isAr ? "rtl" : "ltr"}
          >
            <div className="flex gap-1 w-max min-w-full">
              {/* "All" pill */}
              <button
                onClick={() => handleLetterClick(null)}
                className="shrink-0 w-9 h-9 rounded-full text-xs font-semibold transition-all duration-150"
                style={{
                  backgroundColor:
                    activeLetter === null
                      ? "var(--color-primary)"
                      : "var(--color-bg-muted, #f0f0f0)",
                  color: activeLetter === null ? "#fff" : "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {isAr ? "الكل" : "All"}
              </button>

              {letters.map((letter) => {
                const hasItems = lettersWithBrands.has(letter);
                const isActive = activeLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => hasItems && handleLetterClick(letter)}
                    disabled={!hasItems}
                    className="shrink-0 w-9 h-9 rounded-full text-xs font-semibold transition-all duration-150 disabled:cursor-default"
                    style={{
                      backgroundColor: isActive
                        ? "var(--color-primary)"
                        : hasItems
                        ? "var(--color-bg-muted, #f0f0f0)"
                        : "transparent",
                      color: isActive
                        ? "#fff"
                        : hasItems
                        ? "var(--color-text)"
                        : "var(--color-text-muted)",
                      opacity: hasItems ? 1 : 0.35,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {Array.from({ length: 40 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <p
            className="text-sm text-center py-16"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {t("brands.errorLoading")}
          </p>
        )}

        {/* Filtered view */}
        {!isLoading && !isError && activeLetter && (
          <>
            <p
              className="text-xs mb-4"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
            >
              {visibleBrands.length} {isAr ? "علامة تجارية" : "brand(s)"}
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {visibleBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} locale={locale} />
              ))}
            </div>
            {visibleBrands.length === 0 && (
              <p
                className="text-sm text-center py-16"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
              >
                {isAr ? "لا توجد علامات تجارية" : "No brands found"}
              </p>
            )}
          </>
        )}

        {/* Grouped view */}
        {!isLoading && !isError && !activeLetter && grouped && (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped)
              .sort(([a], [b]) =>
                isAr
                  ? AR_LETTERS.indexOf(a) - AR_LETTERS.indexOf(b)
                  : a.localeCompare(b)
              )
              .map(([letter, brands]) => (
                <section key={letter}>
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-text)",
                      }}
                    >
                      {letter}
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: "var(--color-border)" }}
                    />
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {brands.map((brand) => (
                      <BrandCard key={brand.id} brand={brand} locale={locale} />
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}