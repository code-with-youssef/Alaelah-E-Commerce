"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { Product } from "@/src/types/products/product";

interface FlatProductsGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleFavourite?: (productId: number) => void;
  hideFavourite?: boolean;
  /** When true, heart button is shown and triggers removal */
  showRemove?: boolean;
  emptyMessage?: string;
}

export function FlatProductsGrid({
  products,
  onAddToCart,
  onToggleFavourite,
  hideFavourite = false,
  showRemove = false,
  emptyMessage,
}: FlatProductsGridProps) {
  const t = useTranslations("product");

  const defaultEmptyMessage = emptyMessage ?? t("noProductsFound");

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p
          className="text-base font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {defaultEmptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}-${product.slug?.replace(/\./g, "")}`}>
          <ProductCard
            product={product}
            // On favourites page: heart is visible and triggers removal
            hideFavourite={hideFavourite}
            // Force heart to appear filled since all products here are favourited
            forceInWishlist={showRemove}
          />
        </Link>
      ))}
    </div>
  );
}