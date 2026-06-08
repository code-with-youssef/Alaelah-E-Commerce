// components/filters/FilteredProductsView.tsx
"use client";

import { ActiveFilters } from "@/src/types/products/filter";
import type { Product } from "@/src/types/products/product";
import { Category } from "@/src/types/home/category";
import { useTranslations } from "next-intl";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useFilteredProducts } from "@/src/hooks/products/useFilterdProducts";
import { ProductCard } from "../ProductCard";
import { SubCategoryBar } from "../SubCategoryBar";
import { Pagination } from "../../common/Pagination";
import { Link } from "@/src/i18n/navigation";

interface FilteredProductsViewProps {
  catId: number;
  filters: ActiveFilters;
  onClearFilters: () => void;
  subCategories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

// ── Skeleton grid reused in both loading states ───────────────
function ProductsGridSkeleton({ withSubBar = false }: { withSubBar?: boolean }) {
  return (
    <div className="px-4">
      {withSubBar && (
        <div className="mb-4 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full animate-pulse flex-shrink-0"
                style={{ backgroundColor: "var(--color-bg-muted)" }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mb-4">
        <div
          className="h-6 w-32 rounded animate-pulse"
          style={{ backgroundColor: "var(--color-bg-muted)" }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg animate-pulse"
            style={{ backgroundColor: "var(--color-bg-muted)" }}
          />
        ))}
      </div>
    </div>
  );
}

export function FilteredProductsView({
  catId,
  filters,
  onClearFilters,
  subCategories,
  onCategorySelect,
}: FilteredProductsViewProps) {
  const t = useTranslations("product");

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,      // ← true during filter-change refetches too
    isError,
    error,
  } = useFilteredProducts({
    catId,
    brandId: filters.brandId,
    minPrice: filters.minPrice ? Number(filters.minPrice) : null,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
  });

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];
  const totalProducts = data?.pages[0]?.meta.total ?? 0;
  const lastPageMeta = data?.pages.at(-1)?.meta;

  const isNoProductsError =
    isError &&
    ((error as any)?.status === 404 ||
      (error as any)?.response?.status === 404 ||
      (error as any)?.statusCode === 404 ||
      error?.message?.toLowerCase().includes("no products") ||
      error?.message?.includes("404"));

  // ── Show skeleton on initial load OR when filters change ────
  // isFetching covers both: first load and every subsequent refetch.
  // We skip it only when fetching the *next page* (pagination),
  // since that appends below the existing list.
  if ((isLoading || isFetching) && !isFetchingNextPage) {
    return <ProductsGridSkeleton withSubBar={subCategories.length > 0} />;
  }

  // ── No products (404 from API) ────────────────────────────
  if (isNoProductsError) {
    return (
      <div className="px-4">
        {subCategories.length > 0 && (
          <div className="mb-4 lg:hidden">
            <SubCategoryBar
              subCategories={subCategories}
              activeId={catId}
              onSelect={onCategorySelect}
            />
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t("showingResults", { count: 0 })}
            </p>
            <button
              onClick={onClearFilters}
              className="btn-secondary text-sm flex items-center gap-1"
              style={{ padding: "0.5rem 1rem" }}
            >
              <XMarkIcon className="w-4 h-4" />
              {t("clearAllFilters")}
            </button>
          </div>
          {(filters.brandName || filters.minPrice || filters.maxPrice) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.brandName && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                >
                  {filters.brandName}
                  <button onClick={onClearFilters} className="ml-1">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                  }}
                >
                  {filters.minPrice || "0"} - {filters.maxPrice || "∞"}
                  <button onClick={onClearFilters} className="ml-1">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-center py-16 max-w-md mx-auto">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-primary-light)" }}
          >
            <FunnelIcon className="w-10 h-10" style={{ color: "var(--color-primary)" }} />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
            {t("noProductsFound")}
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            {t("tryDifferentFilters")}
          </p>
          <button
            onClick={onClearFilters}
            className="btn-primary"
            style={{ padding: "0.75rem 1.5rem" }}
          >
            {t("clearAllFilters")}
          </button>
        </div>
      </div>
    );
  }

  // ── Real error ────────────────────────────────────────────
  if (isError) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div
          className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-error)" }}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {t("errorLoadingProducts")}
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          {t("pleaseTryAgain")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
          style={{ padding: "0.75rem 1.5rem" }}
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  // ── Empty (200 but 0 products) ────────────────────────────
  if (allProducts.length === 0) {
    return (
      <div className="px-4">
        {subCategories.length > 0 && (
          <div className="mb-4 lg:hidden">
            <SubCategoryBar
              subCategories={subCategories}
              activeId={catId}
              onSelect={onCategorySelect}
            />
          </div>
        )}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t("showingResults", { count: 0 })}
            </p>
            <button
              onClick={onClearFilters}
              className="btn-secondary text-sm flex items-center gap-1"
              style={{ padding: "0.5rem 1rem" }}
            >
              <XMarkIcon className="w-4 h-4" />
              {t("clearAllFilters")}
            </button>
          </div>
        </div>
        <div className="text-center py-16">
          <p style={{ color: "var(--color-text-muted)" }}>{t("noProductsFound")}</p>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────
  return (
    <div className="px-4">
      {subCategories.length > 0 && (
        <div className="mb-4 lg:hidden">
          <SubCategoryBar
            subCategories={subCategories}
            activeId={catId}
            onSelect={onCategorySelect}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {t("showingResults", { count: totalProducts })}
          </p>
          <button
            onClick={onClearFilters}
            className="btn-secondary text-sm flex items-center gap-1"
            style={{ padding: "0.5rem 1rem" }}
          >
            <XMarkIcon className="w-4 h-4" />
            {t("clearAllFilters")}
          </button>
        </div>
        {(filters.brandName || filters.minPrice || filters.maxPrice) && (
          <div className="flex flex-wrap gap-2">
            {filters.brandName && (
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                {filters.brandName}
                <button onClick={onClearFilters} className="ml-1">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                }}
              >
                {filters.minPrice || "0"} - {filters.maxPrice || "∞"}
                <button onClick={onClearFilters} className="ml-1">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProducts.map((product: Product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}-${product.slug.replace(/\./g, "")}`}
          >
            <ProductCard key={product.id} product={product} />
          </Link>
        ))}
      </div>

      {lastPageMeta && (
        <Pagination
          meta={lastPageMeta}
          onLoadMore={fetchNextPage}
          isLoading={isFetchingNextPage}
        />
      )}
    </div>
  );
}