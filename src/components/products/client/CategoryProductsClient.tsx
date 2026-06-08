"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Category } from "@/src/types/home/category";
import type { Product } from "@/src/types/products/product";
import { PaginationMeta } from "@/src/types/shared/pagination";
import { fetchProducts } from "@/src/lib/products/product";
import { ActiveFilters } from "@/src/types/products/filter";
import { useTranslations } from "next-intl";

import { CategoryHeaderMobile } from "../CategoryHeaderMobile";
import { ProductsGrid } from "../ProductsGrid";
import { SubCategoryBar } from "../SubCategoryBar";
import { DesktopSidebar } from "../DesktopSidebar";
import { FilterSidebar } from "../filters/FilterSidebar";
import { useLocation } from "@/src/contexts/LocationContext";
import { FilteredProductsView } from "../filters/FilteredProductsView";

// ── Types ─────────────────────────────────────────────────────

export interface SubCategorySection {
  subCategory: Category;
  products: Product[];
  meta: PaginationMeta;
  isLoading: boolean;
  isLoadingMore: boolean;
}

interface CategoryProductsClientProps {
  category: Category;
  allCategories: Category[];
  subCategories: Category[];
  cartCount?: number;
  onSearch?: () => void;
}

const EMPTY_META: PaginationMeta = {
  current_page: 1,
  from: null,
  last_page: 1,
  per_page: 8,
  to: null,
  total: 0,
};

const EMPTY_FILTERS: ActiveFilters = {
  brandId: null,
  brandName: null,
  minPrice: "",
  maxPrice: "",
};

// ── Scroll helper (reused in multiple places) ─────────────────
function scrollToSubCategory(id: number) {
  const el = document.querySelector(`[data-subcategory-id="${id}"]`);
  if (el) {
    const offset = window.innerWidth >= 1024 ? 115 : 110;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

// ── Component ─────────────────────────────────────────────────

export function CategoryProductsClient({
  category,
  allCategories,
  subCategories,
  cartCount = 0,
  onSearch,
}: CategoryProductsClientProps) {
  const t = useTranslations("home");
  const searchParams = useSearchParams();

  // ?sub=<subCategoryId>  — set by resolveBannerUrl for case 2
  const subParam = searchParams.get("sub");
  const targetSubId = subParam ? Number(subParam) : undefined;

  const [sections, setSections] = useState<SubCategorySection[]>([]);
  const [activeSubId, setActiveSubId] = useState<number | undefined>(
    // If a ?sub= param was provided, start with that sub highlighted
    targetSubId ?? subCategories[0]?.id,
  );
  const [productCounts, setProductCounts] = useState<Record<number, number>>(
    {},
  );
  const [allLoaded, setAllLoaded] = useState(false);

  // ── Filter state ─────────────────────────────────────────────
  const [appliedFilters, setAppliedFilters] =
    useState<ActiveFilters>(EMPTY_FILTERS);
  const isFiltering =
    appliedFilters.brandId !== null ||
    appliedFilters.minPrice !== "" ||
    appliedFilters.maxPrice !== "";

  const pendingQueue = useRef<number[]>(subCategories.map((s) => s.id));
  const isSequentialLoading = useRef(false);

  // Track whether we've already done the initial ?sub= scroll so it fires
  // only once (after the target section finishes loading).
  const hasScrolledToTarget = useRef(false);

  const { nearestStoreId } = useLocation();

  // ── Handle category change from subcategory bar while filtering ──
  const handleCategorySelect = useCallback(
    (subCategoryId: number) => {
      const subCategory = subCategories.find((s) => s.id === subCategoryId);
      if (!subCategory) return;

      setAppliedFilters(EMPTY_FILTERS);
      setActiveSubId(subCategoryId);
      scrollToSubCategory(subCategoryId);
    },
    [subCategories],
  );

  // ── Load next sub in queue (page 1) ──────────────────────────
  const loadNextInQueue = useCallback(async () => {
    if (isSequentialLoading.current) return;
    if (pendingQueue.current.length === 0) return;

    const subId = pendingQueue.current[0];
    const sub = subCategories.find((s) => s.id === subId);
    if (!sub) {
      pendingQueue.current.shift();
      loadNextInQueue();
      return;
    }

    isSequentialLoading.current = true;

    setSections((prev) => [
      ...prev,
      {
        subCategory: sub,
        products: [],
        meta: EMPTY_META,
        isLoading: true,
        isLoadingMore: false,
      },
    ]);

    try {
      const result = await fetchProducts(subId, 1, nearestStoreId);

      if (!result.products || result.products.length === 0) {
        setSections((prev) => prev.filter((s) => s.subCategory.id !== subId));
      } else {
        setSections((prev) =>
          prev.map((s) =>
            s.subCategory.id === subId
              ? {
                  ...s,
                  products: result.products,
                  meta: result.meta,
                  isLoading: false,
                }
              : s,
          ),
        );
        setProductCounts((prev) => ({ ...prev, [subId]: result.meta.total }));
      }
    } catch {
      setSections((prev) => prev.filter((s) => s.subCategory.id !== subId));
    } finally {
      pendingQueue.current.shift();
      isSequentialLoading.current = false;

      if (pendingQueue.current.length === 0) {
        setAllLoaded(true);
      }

      void loadNextInQueue();
    }
  }, [subCategories, nearestStoreId]);

  useEffect(() => {
    void loadNextInQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Scroll to ?sub= target once its section is visible ───────
  useEffect(() => {
    if (!targetSubId) return;
    if (hasScrolledToTarget.current) return;

    // Check that the target section has finished loading and has products
    const targetSection = sections.find(
      (s) =>
        s.subCategory.id === targetSubId &&
        !s.isLoading &&
        s.products.length > 0,
    );
    if (!targetSection) return;

    hasScrolledToTarget.current = true;
    // Small delay so the DOM has fully painted before we measure
    requestAnimationFrame(() => {
      setTimeout(() => scrollToSubCategory(targetSubId), 100);
    });
  }, [sections, targetSubId]);

  // ── Load more pages for a specific sub ───────────────────────
  const handleLoadMore = useCallback(
    async (subId: number) => {
      setSections((prev) =>
        prev.map((s) =>
          s.subCategory.id === subId ? { ...s, isLoadingMore: true } : s,
        ),
      );

      try {
        const section = sections.find((s) => s.subCategory.id === subId);
        if (!section) return;
        const nextPage = section.meta.current_page + 1;
        const result = await fetchProducts(subId, nextPage, nearestStoreId);

        setSections((prev) =>
          prev.map((s) =>
            s.subCategory.id === subId
              ? {
                  ...s,
                  products: [...s.products, ...result.products],
                  meta: result.meta,
                  isLoadingMore: false,
                }
              : s,
          ),
        );
      } catch {
        setSections((prev) =>
          prev.map((s) =>
            s.subCategory.id === subId ? { ...s, isLoadingMore: false } : s,
          ),
        );
      }
    },
    [sections, nearestStoreId],
  );

  const scrollToSection = useCallback((id: number) => {
    setActiveSubId(id);
    scrollToSubCategory(id);
  }, []);

  const visibleSubCategories = sections
    .filter((s) => !s.isLoading && s.products.length > 0)
    .map((s) => s.subCategory);

  // ── No products at all ────────────────────────────────────────
  if (allLoaded && sections.length === 0) {
    return (
      <div
        className="min-h-dvh pb-24 md:pb-8"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <CategoryHeaderMobile
          category={category}
          allCategories={allCategories}
          cartCount={cartCount}
          onSearch={onSearch}
        />
        <div className="flex items-center justify-center pt-40">
          <p
            className="text-lg font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("noProducts")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh pb-24 md:pb-8 lg:pb-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <CategoryHeaderMobile
        category={category}
        allCategories={allCategories}
        cartCount={cartCount}
        onSearch={onSearch}
      />

      <div className="lg:hidden">
        <SubCategoryBar
          subCategories={visibleSubCategories}
          activeId={activeSubId}
          onSelect={(id) => {
            scrollToSection(id);
          }}
        />
      </div>

      <div className="flex pt-[110px] md:pt-[110px] lg:pt-0">
        <div className="hidden lg:block">
          <DesktopSidebar
            subCategories={visibleSubCategories}
            activeId={activeSubId}
            onSelect={(id) => {
              scrollToSection(id);
            }}
            categoryName={category.name}
            productCounts={productCounts}
          />
        </div>

        <div className="flex-1 min-w-0 pt-4 lg:pl-6">
          <div className="mt-4">
            {isFiltering ? (
              <FilteredProductsView
                catId={activeSubId ?? category.id}
                filters={appliedFilters}
                onClearFilters={() => {
                  setAppliedFilters(EMPTY_FILTERS);
                  if (activeSubId) {
                    requestAnimationFrame(() => {
                      setTimeout(() => scrollToSubCategory(activeSubId), 0);
                    });
                  }
                }}
                subCategories={subCategories}
                onCategorySelect={handleCategorySelect}
              />
            ) : (
              <ProductsGrid
                sections={sections}
                onActiveChange={setActiveSubId}
                onLoadMore={handleLoadMore}
              />
            )}
          </div>
        </div>

        <FilterSidebar
          catId={activeSubId ?? category.id}
          activeFilters={appliedFilters}
          onApply={(filters) => setAppliedFilters(filters)}
          onClear={() => {
            setAppliedFilters(EMPTY_FILTERS);
            if (activeSubId) {
              requestAnimationFrame(() => {
                setTimeout(() => scrollToSubCategory(activeSubId), 0);
              });
            }
          }}
        />
      </div>
    </div>
  );
}
