"use client";

import { useState } from "react";
import type { Product } from "@/src/types/products/product";
import { RelatedProductsStrip } from "./RelatedProductsStrip";
import { AllRelatedModal } from "./AllRelatedModal";
import { PaginationMeta } from "@/src/types/shared/pagination";

interface RelatedProductsProps {
  products: Product[];
  isLoading?: boolean;
  isMobile?: boolean;
  onAddToCart?: (p: Product) => void;
  onToggleFavourite?: (id: number) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  meta?: PaginationMeta;
}

export function RelatedProducts({
  products,
  isLoading = false,
  isMobile = false,
  onAddToCart,
  onToggleFavourite,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  meta,
}: RelatedProductsProps) {
  const [showModal, setShowModal] = useState(false);

  if (!isLoading && !products.length) return null;

  return (
    <>
      <RelatedProductsStrip
        products={products}
        isLoading={isLoading}
        isMobile={isMobile}
        onShowAll={() => setShowModal(true)}
        onAddToCart={onAddToCart}
        onToggleFavourite={onToggleFavourite}
      />

      {showModal && (
        <AllRelatedModal
          products={products}
          onClose={() => setShowModal(false)}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          meta={meta}
        />
      )}
    </>
  );
}