"use client";

import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useBrandsInfinite } from "@/src/hooks/home/useBrands";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { Pagination } from "../../common/Pagination";
import { Brand } from "@/src/types/home/brand";

interface BrandsModalProps {
  onClose: () => void;
}

function sortBrands(brands: Brand[]): Brand[] {
  return [...brands.filter((b) => b.top), ...brands.filter((b) => !b.top)];
}

export function BrandsModal({ onClose }: BrandsModalProps) {
  const t = useTranslations("home");

  const { data, fetchNextPage, isFetchingNextPage, isLoading, isError } =
    useBrandsInfinite(30);

  // Flatten all fetched pages — previous pages stay mounted.
  const allBrands: Brand[] = data
    ? sortBrands(data.pages.flatMap((page) => page.brands))
    : [];

  // Build a PaginationMeta from the LAST page so Pagination knows where we are.
  const lastPageMeta = data?.pages.at(-1)?.meta;

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
        aria-label={t("brands.modalAriaLabel")}
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
            {t("brands.title")}
            {lastPageMeta?.total != null && (
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({lastPageMeta.total})
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
            aria-label={t("brands.closeAriaLabel")}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
          {/* Skeleton — first load only */}
          {isLoading && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
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
              {t("brands.errorLoading")}
            </p>
          )}

          {/* Accumulated grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {allBrands.map((brand) => (
                <BrandModalCard
                  key={brand.id}
                  brand={brand}
                  onClose={onClose}
                />
              ))}
            </div>
          )}

          {/* Pagination — driven by the last page's meta */}
          {lastPageMeta && (
            <Pagination
              meta={lastPageMeta}
              onLoadMore={fetchNextPage}
              isLoading={isFetchingNextPage}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ── Single brand card ─────────────────────────────────────────

function BrandModalCard({
  brand,
  onClose,
}: {
  brand: Brand;
  onClose: () => void;
}) {
  const resolvedLogo = useResolvedUrl(brand.logo);

  return (
    <Link
      href={`/brand/${brand.id}/${brand.slug.replace(/\./g, "")}`}
      onClick={onClose}
      className="flex flex-col items-center gap-1.5 group transition-transform duration-200 hover:-translate-y-1"
      aria-label={brand.name}
    >
      <div
        className="w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-white group-hover:shadow-md transition-shadow duration-200"
        style={{
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
            className="font-bold text-center text-[10px] leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {brand.name}
          </span>
        )}
      </div>

      <p
        className="text-[10px] text-center leading-tight line-clamp-2 w-full"
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-muted)",
        }}
      >
        {brand.name}
      </p>
    </Link>
  );
}
