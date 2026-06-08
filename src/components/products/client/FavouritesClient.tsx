"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { HeartIcon } from "@heroicons/react/24/solid";
import { FlatProductsGrid } from "../FlatProductsGrid";
import { Pagination } from "../../common/Pagination";
import Loader from "../../common/Loader";
import Error from "../../common/Error";
import type { Product } from "@/src/types/products/product";

import type { PaginationMeta } from "@/src/types/shared/pagination";
import { useWishlist } from "@/src/hooks/products/useWishlist";
import { useLocation } from "@/src/contexts/LocationContext";
import { fetchWishlist, removeProductFromWishlist } from "@/src/lib/products/wishlist";

interface FavouritesClientProps {
  onAddToCart?: (product: Product) => void;
}

export function FavouritesClient({ onAddToCart }: FavouritesClientProps) {
  const t = useTranslations("product");
  const { nearestStoreId } = useLocation();
  const [mounted, setMounted] = useState(false);

  const { data, isLoading, error } = useWishlist(1);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data && allProducts.length === 0) {
      setAllProducts(data.products);
      setCurrentMeta(data.meta);
    }
  }, [data]);

  const handleToggleFavourite = async (productId: number) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await removeProductFromWishlist(productId);
    } catch {
      setAllProducts((prev) => {
        const product = data?.products.find((p) => p.id === productId);
        if (!product || prev.find((p) => p.id === productId)) return prev;
        return [...prev, product];
      });
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !nearestStoreId || !currentMeta) return;
    setLoadingMore(true);
    try {
      const result = await fetchWishlist(
        nearestStoreId,
        currentMeta.current_page + 1,
      );
      setAllProducts((prev) => [...prev, ...result.products]);
      setCurrentMeta(result.meta);
    } catch {
      // silently ignore
    } finally {
      setLoadingMore(false);
    }
  };

  if (!mounted) return null;
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
          <HeartIcon
            className="w-5 h-5 shrink-0"
            style={{ color: "var(--color-primary)" }}
          />
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
          >
            {t("favourites.title")}
          </h1>
        </div>
        {currentMeta && (
          <p
            className="text-sm ps-7"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {allProducts.length > 0
              ? t("favourites.itemsCount", { count: allProducts.length })
              : t("favourites.empty")}
          </p>
        )}
      </div>

      <FlatProductsGrid
        products={allProducts}
        onAddToCart={onAddToCart}
        onToggleFavourite={handleToggleFavourite}
        showRemove
        emptyMessage={t("favourites.noFavouritesYet")}
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