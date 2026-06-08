"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  useSubCategories,
  useCategories,
} from "@/src/hooks/home/useCategories";
import { fetchProducts } from "@/src/lib/products/product";
import { ProductCard } from "../../products/ProductCard";
import { useLocation } from "@/src/contexts/LocationContext";
import { useTranslations } from "next-intl";

export function HomeCategorySection() {
  const t = useTranslations("home");
  const { nearestStoreId } = useLocation();

  const { data: allCategories } = useCategories();

  const [activeSubId, setActiveSubId] = useState<number | null>(null);

  const mainCategory = allCategories?.[0]; // index 1 = second
  const categoryId = mainCategory?.id;

  const { data: subCategories, isLoading: subsLoading } =
    useSubCategories(categoryId);

  const resolvedSubId = activeSubId ?? subCategories?.[0]?.id ?? null;

  const {
    data: result,
    isLoading: productsLoading,
    isError,
  } = useQuery({
    queryKey: ["home-cat-section", resolvedSubId, nearestStoreId],
    queryFn: () => fetchProducts(resolvedSubId!, 1, nearestStoreId),
    enabled: !!resolvedSubId,
    staleTime: 1000 * 60 * 5,
  });

  const firstPageProducts = result?.products ?? [];

  // Don't render until subs have loaded
  if (subsLoading) return null;

  // No subs at all — hide the whole section
  if (!subCategories || subCategories.length === 0) return null;

  // Products loaded and empty — hide the whole section
  if (!productsLoading && firstPageProducts.length === 0) return null;

  if (isError) return null;

  const cardStyle: React.CSSProperties = {
    flex: "0 0 var(--card-w)",
    minWidth: 0,
  };

  return (
    <section className="py-4">
      <style>{`
        .home-cat-slider {
          --card-w: calc((100% - 1 * 12px) / 2);
        }
        @media (min-width: 480px) {
          .home-cat-slider { --card-w: calc((100% - 2 * 12px) / 3); }
        }
        @media (min-width: 640px) {
          .home-cat-slider { --card-w: calc((100% - 3 * 12px) / 4); }
        }
        @media (min-width: 768px) {
          .home-cat-slider { --card-w: calc((100% - 4 * 12px) / 5); }
        }
        @media (min-width: 1024px) {
          .home-cat-slider { --card-w: calc((100% - 5 * 12px) / 6); }
        }
        @media (min-width: 1280px) {
          .home-cat-slider { --card-w: calc((100% - 6 * 12px) / 7); }
        }
        @media (min-width: 1536px) {
          .home-cat-slider { --card-w: calc((100% - 7 * 12px) / 8); }
        }
      `}</style>

      {/* ── Main category header ── */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-base md:text-lg font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {mainCategory?.name ?? ""}
        </h2>

        {mainCategory && (
          <Link
            href={`/category/${mainCategory.id}/${mainCategory.slug.replace(/\./g, "")}`}
            className="text-xs font-semibold transition-opacity hover:opacity-70"
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {t("viewAll")}
          </Link>
        )}
      </div>

      {/* ── Subcategory pill tabs ── */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-3 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {subCategories.map((sub) => {
          const isActive = sub.id === resolvedSubId;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubId(sub.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                backgroundColor: isActive
                  ? "var(--color-primary)"
                  : "var(--color-bg-subtle)",
                color: isActive ? "#fff" : "var(--color-text-muted)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {sub.name}
            </button>
          );
        })}
      </div>

      {/* ── Product slider ── */}
      {productsLoading ? (
        <div className="home-cat-slider flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse"
              style={{
                ...cardStyle,
                aspectRatio: "3/4",
                backgroundColor: "var(--color-bg-subtle)",
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className="home-cat-slider flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {firstPageProducts.map((product) => (
            <div key={product.id} className="snap-start" style={cardStyle}>
              <Link
                href={`/products/${product.id}-${product.slug.replace(/\./g, "")}`}
                style={{
                  backgroundColor: "var(--color-bg)",
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
                  textDecoration: "none",
                }}
              >
                <ProductCard product={product} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
