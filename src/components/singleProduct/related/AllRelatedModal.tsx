"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import type { Product } from "@/src/types/products/product";
import { Pagination } from "../../common/Pagination";
import { PaginationMeta } from "@/src/types/shared/pagination";
import { ProductCard } from "../../products/ProductCard";
import { Link } from "@/src/i18n/navigation";

interface AllRelatedModalProps {
  products: Product[];
  onClose: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  meta?: PaginationMeta;
}

export function AllRelatedModal({
  products,
  onClose,
  hasMore,
  onLoadMore,
  isLoadingMore,
  meta,
}: AllRelatedModalProps) {
  const t = useTranslations("singleProduct");

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

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
        aria-label={t("allRelatedDialog")}
      >
        {/* Drag handle — mobile only */}
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
            {t("relatedProducts")}
            <span
              className="ml-2 text-sm font-normal"
              style={{ color: "var(--color-text-muted)" }}
            >
              ({meta?.total || products.length})
            </span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              color: "var(--color-text-muted)",
            }}
            aria-label={t("close")}
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
                <ProductCard key={p.id} product={p} />
              </Link>
            ))}
          </div>
          {/* Optional: Use your existing Pagination component */}
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
