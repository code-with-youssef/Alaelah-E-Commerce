"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeader } from "../SectionHeader";
import { useBrands } from "@/src/hooks/home/useBrands";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import type { Brand } from "@/src/types/home/brand";

export function BrandsSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  const { data, isLoading, isError } = useBrands({ perPage: 30, page: 1 });

  // Preview: only top brands
  const topBrands: Brand[] = data?.brands
    ? data.brands.filter((b) => b.top)
    : [];

  if (!isLoading && topBrands.length === 0) return null;

  return (
    <>
      <style>{`
        .brands-slider {
          --brand-w: calc((100% - 3 * 10px) / 4.3);
        }
        @media (min-width: 640px) {
          .brands-slider { --brand-w: calc((100% - 5 * 12px) / 6); }
        }
        @media (min-width: 768px) {
          .brands-slider { --brand-w: calc((100% - 7 * 12px) / 8); }
        }
        @media (min-width: 1024px) {
          .brands-slider { --brand-w: calc((100% - 9 * 12px) / 10); }
        }
      `}</style>

      <section className="py-2">
        <div className="flex items-center justify-between">
          <SectionHeader title={t("brands.title")} />

          {!isLoading && !isError && (
            <Link
              href={`/${locale}/brands`}
              className="text-xs font-semibold mb-2 transition-opacity hover:opacity-70"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("viewAll")}
            </Link>
          )}
        </div>

        <p
          className="-mt-2 mb-3 text-sm"
          style={{
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {t("brands.subtitle")}
        </p>

        <div
          className="brands-slider flex gap-2.5 md:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonLogo key={i} />)}

          {isError && (
            <p
              className="text-sm px-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("brands.errorLoading")}
            </p>
          )}

          {!isLoading &&
            !isError &&
            topBrands.map((brand) => (
              <BrandLogo key={brand.id} brand={brand} />
            ))}
        </div>
      </section>
    </>
  );
}

function BrandLogo({ brand }: { brand: Brand }) {
  const resolvedLogo = useResolvedUrl(brand.logo);

  return (
    <Link
      href={`/brand/${brand.id}/${brand.slug.replace(/\./g, "")}`}
      className="snap-start shrink-0 flex flex-col items-center gap-1.5 transition-all duration-200 hover:-translate-y-1"
      style={{ flex: "0 0 var(--brand-w)" }}
      aria-label={brand.name}
    >
      <div
        className="w-full rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: "1 / 1",
          backgroundColor: "var(--color-bg)",
          boxShadow: "var(--shadow-card)",
          padding: "8px",
        }}
      >
        {resolvedLogo ? (
          <img
            src={resolvedLogo}
            alt={brand.name}
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
            {brand.name}
          </span>
        )}
      </div>

      <span
        className="w-full text-center truncate text-[11px] md:text-[13px] font-medium leading-tight"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {brand.name}
      </span>
    </Link>
  );
}

function SkeletonLogo() {
  return (
    <div
      className="snap-start shrink-0 flex flex-col items-center gap-1.5"
      style={{ flex: "0 0 var(--brand-w)" }}
    >
      <div
        className="w-full rounded-2xl animate-pulse"
        style={{
          aspectRatio: "1 / 1",
          backgroundColor: "var(--color-bg-subtle)",
        }}
      />
      <div
        className="h-2.5 w-3/4 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--color-bg-subtle)" }}
      />
    </div>
  );
}
