"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/src/types/products/product";
import { SkeletonCard } from "../../shared/SkeltonCard";
import { ProductCard } from "../../products/ProductCard";
import { Link } from "@/src/i18n/navigation";

interface RelatedProductsStripProps {
  products: Product[];
  isLoading: boolean;
  isMobile: boolean;
  onShowAll: () => void;
  onAddToCart?: (p: Product) => void;
  onToggleFavourite?: (id: number) => void;
}

export function RelatedProductsStrip({
  products,
  isLoading,
  isMobile,
  onShowAll,
}: RelatedProductsStripProps) {
  const t = useTranslations("singleProduct");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  const showControls = !isLoading && products.length > 0;

  // Card width: slightly wider on desktop for breathing room around the new quantity selector
  const cardWidth = isMobile ? "10rem" : "11rem";

  return (
    <section className="py-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h3
          className="text-lg font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {t("relatedProducts")}
        </h3>

        <div className="flex items-center gap-2">
          {showControls && (
            <button
              onClick={onShowAll}
              className="text-xs font-semibold cursor-pointer px-3 py-1.5 rounded-full transition-all active:scale-95"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-primary)",
                border: "1px solid var(--color-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("viewAll")}
            </button>
          )}

          {showControls && !isMobile && (
            <div className="flex items-center gap-1.5">
              {(["left", "right"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                  aria-label={
                    dir === "left" ? t("scrollLeft") : t("scrollRight")
                  }
                >
                  {dir === "left" ? (
                    <ChevronLeftIcon className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 cursor-pointer pb-1 scrollbar-hide"
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <SkeletonCard />
              </div>
            ))
          : products.map((p) => (
              <div
                key={p.id}
                className="flex-shrink-0"
                style={{ width: cardWidth }}
              >
                <Link
                  key={p.id}
                  href={`/products/${p.id}-${p.slug.replace(/\./g, "")}`}
                >
                  <ProductCard product={p} />
                </Link>
              </div>
            ))}
      </div>
    </section>
  );
}
