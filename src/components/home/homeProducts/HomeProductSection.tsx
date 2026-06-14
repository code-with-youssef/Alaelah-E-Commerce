"use client";

import { useRef, useState, useMemo } from "react";
import { HomeProductModal } from "./HomeProductModal";
import { ProductCard } from "../../products/ProductCard";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useHomeProducts } from "@/src/hooks/products/useHomeProducts";
import { HomeProductsType, Product } from "@/src/types/products/product";

export function HomeProductSection({ type }: { type: HomeProductsType }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("home");

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useHomeProducts(true, type);

  const firstPageProducts: Product[] = data?.pages[0]?.products ?? [];
  const meta = data?.pages[0]?.meta;

  const allLoadedProducts: Product[] = useMemo(
    () => data?.pages.flatMap((p) => p.products) ?? [],
    [data],
  );

  if (isError) return null;

  if (!isLoading && firstPageProducts.length === 0) return null;

  const cardStyle: React.CSSProperties = {
    flex: "0 0 var(--card-w)",
    minWidth: 0,
  };

  return (
    <section className="py-4">
      {/* Scoped responsive card width */}
      <style>{`
              .best-seller-slider {
          --card-w: calc((100% - 1 * 12px) / 2);        /* xs: 2 cards */
        }
        @media (min-width: 480px) {
          .best-seller-slider {
            --card-w: calc((100% - 2 * 12px) / 3);      /* sm-ish: 3 cards */
          }
        }
        @media (min-width: 640px) {
          .best-seller-slider {
            --card-w: calc((100% - 3 * 12px) / 4);      /* sm: 4 cards */
          }
        }
        @media (min-width: 768px) {
          .best-seller-slider {
            --card-w: calc((100% - 4 * 12px) / 5);      /* md: 5 cards */
          }
        }
        @media (min-width: 1024px) {
          .best-seller-slider {
            --card-w: calc((100% - 5 * 12px) / 6);      /* lg: 6 cards */
          }
        }
        @media (min-width: 1280px) {
          .best-seller-slider {
            --card-w: calc((100% - 6 * 12px) / 7);      /* xl: 7 cards */
          }
        }
        @media (min-width: 1536px) {
          .best-seller-slider {
            --card-w: calc((100% - 7 * 12px) / 8);      /* 2xl: 8 cards */
          }
        }
      `}</style>

      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2
            className="text-base md:text-lg font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {t(`${type}.title`)}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {meta && meta.total > firstPageProducts.length && (
            <Link
              href={`/${type}/products`}
              className="text-xs cursor-pointer font-semibold mb-2 transition-opacity hover:opacity-70"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("viewAll")}
            </Link>
          )}
        </div>
      </div>

      {/* Slider */}
      {isLoading ? (
        <div className="best-seller-slider flex gap-3 overflow-hidden">
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
      ) : firstPageProducts.length === 0 ? null : (
        <div
          ref={sliderRef}
          className="best-seller-slider flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth"
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

          {/* View More card — same slot width as product cards */}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <HomeProductModal
          products={allLoadedProducts}
          onClose={() => setModalOpen(false)}
          hasMore={hasNextPage}
          onLoadMore={() => fetchNextPage()}
          isLoadingMore={isFetchingNextPage}
          type={type}
          meta={data?.pages[data.pages.length - 1]?.meta}
        />
      )}
    </section>
  );
}
