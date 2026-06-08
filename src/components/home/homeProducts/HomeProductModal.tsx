"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Pagination } from "@/src/components/common/Pagination";
import { PaginationMeta } from "@/src/types/shared/pagination";
import { ProductCard } from "../../products/ProductCard";
import Link from "next/link";
import { Product } from "@/src/types/products/product";

interface HomeProductModalProps {
  products: Product[];
  onClose: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  type: "best-seller" | "featured" | "todays-deal";
  meta?: PaginationMeta;
}

export function HomeProductModal({
  products,
  onClose,
  onLoadMore,
  isLoadingMore,
  type,
  meta,
}: HomeProductModalProps) {
  const t = useTranslations("home");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Dialog */}
      <div
        className="fixed z-[101] overflow-hidden
                   bottom-0 left-0 right-0 rounded-t-3xl
                   sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                   sm:rounded-3xl sm:w-full sm:max-w-2xl lg:max-w-3xl"
        style={{
          backgroundColor: "var(--color-bg)",
          maxHeight: "88dvh",
          display: "flex",
          flexDirection: "column",
        }}
        role="dialog"
        aria-label="Best sellers"
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <h3
            className="text-lg font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {t(`${type}.title`)}
            {meta?.total !== undefined && (
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({meta.total})
              </span>
            )}
          </h3>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              color: "var(--color-text-muted)",
            }}
            aria-label="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto custom-scrollbar p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}-${p.slug.replace(/\./g, "")}`}
              >
                <ProductCard product={p} />
              </Link>
            ))}
          </div>

          {meta && meta.last_page > 1 && onLoadMore && (
            <Pagination
              meta={meta}
              onLoadMore={onLoadMore}
              isLoading={isLoadingMore}
            />
          )}
        </div>
      </div>
    </>
  );
}
