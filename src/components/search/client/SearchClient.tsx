"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Pagination } from "../../common/Pagination";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import type { Product } from "@/src/types/products/product";

import type { PaginationMeta } from "@/src/types/shared/pagination";
import { useLocation } from "@/src/contexts/LocationContext";
import { fetchSearchResults } from "@/src/lib/products/search";
import { FlatProductsGrid } from "../../products/FlatProductsGrid";

interface SearchClientProps {
  onAddToCart?: (product: Product) => void;
}

export function SearchClient({ onAddToCart }: SearchClientProps) {
  const t = useTranslations("home");
  const { nearestStoreId } = useLocation();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [mounted, setMounted] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !query.trim()) return;

    setIsLoading(true);
    setError(null);
    setAllProducts([]);
    setCurrentMeta(null);

    fetchSearchResults(query, 1, nearestStoreId)
      .then((result) => {
        setAllProducts(result.products);
        setCurrentMeta(result.meta);
      })
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [query, nearestStoreId, mounted]);

  const handleLoadMore = async () => {
    if (loadingMore || !currentMeta) return;
    setLoadingMore(true);
    try {
      const result = await fetchSearchResults(
        query,
        currentMeta.current_page + 1,
        nearestStoreId,
      );
      setAllProducts((prev) => [...prev, ...result.products]);
      setCurrentMeta(result.meta);
    } catch {
      // silently ignore load-more failures
    } finally {
      setLoadingMore(false);
    }
  };

  if (!mounted) return null;

  if (!query.trim()) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          className="text-base"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {t("search.emptyPrompt")}
        </p>
      </div>
    );
  }

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  return (
    <div
      className="min-h-dvh pb-24 md:pb-8 px-4 pt-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MagnifyingGlassIcon
            className="w-5 h-5 shrink-0"
            style={{ color: "var(--color-primary)" }}
          />
          <h1
            className="text-xl font-bold truncate"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
          >
            {t("header.title", { query })}
          </h1>
        </div>
        {currentMeta && (
          <p
            className="text-sm ps-7"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {currentMeta.total > 0
              ? t("search.resultsCount", { count: currentMeta.total, query })
              : t("search.noResults", { query })}
          </p>
        )}
      </div>

      <FlatProductsGrid
        products={allProducts}
        onAddToCart={onAddToCart}
        emptyMessage={t("search.emptyResults", { query })}
      />

      {currentMeta && (
        <Pagination
          meta={currentMeta}
          onLoadMore={handleLoadMore}
          isLoading={loadingMore}
        />
      )}
    </div>
  );
}