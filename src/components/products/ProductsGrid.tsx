"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { Pagination } from "../common/Pagination";
import type { Category } from "@/src/types/home/category";
import type { PaginationMeta } from "@/src/types/shared/pagination";
import { Product } from "@/src/types/products/product";

export interface SubCategorySection {
  subCategory: Category;
  products: Product[];
  meta: PaginationMeta;
  isLoading: boolean;
  isLoadingMore: boolean;
}

interface ProductsGridProps {
  sections: SubCategorySection[];
  onActiveChange: (id: number) => void;
  onLoadMore: (subId: number) => void;
}

export function ProductsGrid({
  sections,
  onActiveChange,
  onLoadMore,
}: ProductsGridProps) {
  const t = useTranslations("product");
  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = Number(
            (visible[0].target as HTMLElement).dataset.subcategoryId,
          );
          if (!isNaN(id)) onActiveChange(id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px", threshold: 0 },
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, onActiveChange]);

  return (
    <div className="flex-1 min-w-0">
      {sections.map(
        ({ subCategory, products, meta, isLoading, isLoadingMore }) => (
          <section
            key={subCategory.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(subCategory.id, el);
              else sectionRefs.current.delete(subCategory.id);
            }}
            data-subcategory-id={subCategory.id}
            className="mb-8"
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {subCategory.name}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl animate-pulse"
                    style={{
                      height: "160px",
                      backgroundColor: "var(--color-bg-muted)",
                    }}
                    aria-label={t("loadingProducts")}
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-2 sm:gap-3 grid-cols-2 min-[475px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 mr-3">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}-${product.slug.replace(/\./g, "")}`}
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
                  {isLoadingMore &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={`more-skeleton-${i}`}
                        className="rounded-xl animate-pulse"
                        style={{
                          height: "160px",
                          backgroundColor: "var(--color-bg-muted)",
                        }}
                        aria-label={t("loadingMoreProducts")}
                      />
                    ))}
                </div>

                {/* Pagination per section — passes this section's meta and wires onLoadMore to its subId */}
                <Pagination
                  meta={meta}
                  onLoadMore={() => onLoadMore(subCategory.id)}
                  isLoading={isLoadingMore}
                />
              </>
            )}
          </section>
        ),
      )}
    </div>
  );
}
