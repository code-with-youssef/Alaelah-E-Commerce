"use client";

import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import type { Product } from "@/src/types/products/product";

interface SuggestionItemProps {
  product: Product;
  onSelect: () => void;
}

export function SuggestionItem({ product, onSelect }: SuggestionItemProps) {
  const imageUrl = useResolvedUrl(product.thumbnail_image);

  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
      style={{
        backgroundColor: "var(--color-bg-subtle)",
        border: "1px solid var(--color-border)",
      }}
    >
      {product.thumbnail_image ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-9 h-9 rounded-lg object-cover shrink-0"
          style={{ border: "1px solid var(--color-border)" }}
        />
      ) : (
        <div
          className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-lg"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          🛒
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
        >
          {product.name}
        </p>
        {product.category && (
          <p
            className="text-xs truncate"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            {product.category}
          </p>
        )}
      </div>

      <span
        className="text-sm font-semibold shrink-0"
        style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
      >
        {product.main_price}
      </span>
    </button>
  );
}