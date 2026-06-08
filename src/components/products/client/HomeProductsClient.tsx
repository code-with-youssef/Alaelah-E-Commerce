// components/products/HomeProductsClient.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

import type { HomeProductsType } from "@/src/types/products/product";
import type { Product } from "@/src/types/products/product";
import { ActiveFilters } from "@/src/types/products/filter";
import { useHomeProducts } from "@/src/hooks/products/useHomeProducts";
import { useFilteredProducts } from "@/src/hooks/products/useFilterdProducts";
import { FilterSidebar } from "../filters/FilterSidebar";
import { ProductCard } from "../ProductCard";
import { Pagination } from "@/src/components/common/Pagination";
import { FunnelIcon } from "@heroicons/react/24/outline";

interface HomeProductsClientProps {
  type: HomeProductsType;
  title: string;
}

const EMPTY_FILTERS: ActiveFilters = {
  brandId: null,
  brandName: null,
  minPrice: "",
  maxPrice: "",
};

export function HomeProductsClient({ type, title }: HomeProductsClientProps) {
  const t = useTranslations("home");

  // ── Filter state ─────────────────────────────────────────
  const [appliedFilters, setAppliedFilters] = useState<ActiveFilters>(EMPTY_FILTERS);

  const isFiltering =
    appliedFilters.brandId !== null ||
    appliedFilters.minPrice !== "" ||
    appliedFilters.maxPrice !== "";

  // ── Unfiltered home products ──────────────────────────────
  const {
    data: homeData,
    isLoading: homeLoading,
    isFetchingNextPage: homeFetchingMore,
    fetchNextPage: homeFetchNext,
  } = useHomeProducts(true, type);

  // ── Filtered products (only when filters are active) ──────
  const {
    data: filteredData,
    isLoading: filteredLoading,
    isFetchingNextPage: filteredFetchingMore,
    fetchNextPage: filteredFetchNext,
    isError: filteredIsError,
    error: filteredError,
  } = useFilteredProducts({
    catId: 0,                  // no category scope — all products
    brandId: appliedFilters.brandId,
    minPrice: appliedFilters.minPrice !== "" ? Number(appliedFilters.minPrice) : null,
    maxPrice: appliedFilters.maxPrice !== "" ? Number(appliedFilters.maxPrice) : null,
    enabled: isFiltering,      // ← only fires when filters are actually set
  });

  // ── Decide which dataset to show ─────────────────────────
  const activeData    = isFiltering ? filteredData    : homeData;
  const isLoading     = isFiltering ? filteredLoading : homeLoading;
  const isFetchingMore = isFiltering ? filteredFetchingMore : homeFetchingMore;
  const fetchNext     = isFiltering ? filteredFetchNext     : homeFetchNext;

  const products = useMemo(
    () => activeData?.pages.flatMap((p) => p.products) ?? [],
    [activeData],
  );

  const meta = useMemo(() => {
    const pages = activeData?.pages;
    return pages?.[pages.length - 1]?.meta;
  }, [activeData]);

  // ── 404 / empty detection (mirrors FilteredProductsView logic) ──
  const isNoResults =
    isFiltering &&
    !filteredLoading &&
    ((filteredError as any)?.status === 404 ||
      (filteredError as any)?.response?.status === 404 ||
      (filteredError as any)?.statusCode === 404 ||
      filteredError?.message?.toLowerCase().includes("no products") ||
      filteredError?.message?.includes("404") ||
      (!filteredIsError && products.length === 0));

  // ── Handlers ─────────────────────────────────────────────
  const handleApplyFilters = useCallback((filters: ActiveFilters) => {
    setAppliedFilters(filters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
  }, []);

  // ── Render ───────────────────────────────────────────────
  return (
    <div
      className="min-h-dvh pb-24 md:pb-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="flex">
        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 px-4 pt-4">
          <h1
            className="text-xl font-bold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </h1>

          {/* ── Loading ── */}
          {isLoading ? (
            <ProductsGridSkeleton />

          /* ── No results (filtered) ── */
          ) : isNoResults ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary-light)" }}
              >
                <FunnelIcon
                  className="w-10 h-10"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                {t("noProducts")}
              </h3>
              <button
                onClick={handleClearFilters}
                className="btn-primary"
                style={{ padding: "0.75rem 1.5rem" }}
              >
                {t("clearAllFilters")}
              </button>
            </div>

          /* ── Products grid ── */
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product: Product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}-${product.slug.replace(/\./g, "")}`}
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <Pagination
                  meta={meta}
                  onLoadMore={() => void fetchNext()}
                  isLoading={isFetchingMore}
                />
              )}
            </>
          )}
        </div>

        {/* ── Filter sidebar ── */}
        {/* catId=null → BrandFilter will fetch all brands (no category scope) */}
        <FilterSidebar
          catId={null}
          activeFilters={appliedFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl animate-pulse"
          style={{ backgroundColor: "var(--color-border)", aspectRatio: "3/4" }}
        />
      ))}
    </div>
  );
}