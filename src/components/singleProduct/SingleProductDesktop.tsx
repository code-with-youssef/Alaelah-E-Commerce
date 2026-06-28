"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { HeartIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import type { Product } from "@/src/types/products/product";
import { PaginationMeta } from "@/src/types/shared/pagination";
import { useWishlistToggle } from "@/src/hooks/products/useWishlist";
import { useCart } from "@/src/hooks/cart/useCart";
import { useNotification } from "@/src/contexts/NotificationContext";
import { RelatedProducts } from "./related/RelatedProducts";
import { DetailsModal } from "./DetailsModal";
import { AddToCart } from "./AddToCart";
import { useAuth } from "@/src/contexts/AuthContext";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { getWeightLabel } from "@/src/utils/GetWeightLabel";
import { useProductLimits } from "@/src/hooks/cart/useProductItemLimits";

interface SingleProductDesktopProps {
  product: Product;
  relatedProducts?: Product[];
  isRelatedLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  meta?: PaginationMeta;
}

function ImageResolver({
  src,
  index,
  onResolved,
}: {
  src: string;
  index: number;
  onResolved: (index: number, url: string) => void;
}) {
  const resolved = useResolvedUrl(src);
  const reported = useRef<string | null>(null);

  useEffect(() => {
    if (resolved && resolved !== reported.current) {
      reported.current = resolved;
      onResolved(index, resolved);
    }
  }, [resolved, index, onResolved]);

  return null;
}

function ImageGallery({
  photoUrls,
  productName,
}: {
  photoUrls: string[];
  productName: string;
}) {
  const t = useTranslations("singleProduct");
  const [resolved, setResolved] = useState<(string | undefined)[]>(() =>
    new Array(photoUrls.length).fill(undefined),
  );
  const [selectedImage, setSelectedImage] = useState(0);

  const handleResolved = (index: number, url: string) => {
    setResolved((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const allResolved = resolved.every((r) => r !== undefined);
  const safeIndex = Math.min(selectedImage, Math.max(photoUrls.length - 1, 0));

  return (
    <>
      {photoUrls.map((src, i) => (
        <ImageResolver
          key={src + i}
          src={src}
          index={i}
          onResolved={handleResolved}
        />
      ))}

      <div className="flex flex-col gap-4">
        <div
          className="w-full rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-bg-subtle)",
            aspectRatio: "1/1",
            boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
          }}
        >
          {!allResolved ? (
            <div
              className="w-full h-full rounded-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-bg-subtle)" }}
            />
          ) : (
            <img
              src={resolved[safeIndex] ?? "/default.png"}
              alt={productName}
              className="w-full h-full object-contain p-10"
              loading="lazy"
              draggable={false}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/default.png";
              }}
            />
          )}
        </div>

        {allResolved && photoUrls.length > 1 && (
          <div className="flex gap-3 flex-wrap">
            {resolved.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className="rounded-2xl overflow-hidden transition-all shrink-0"
                style={{
                  width: "72px",
                  height: "72px",
                  backgroundColor: "var(--color-bg)",
                  border: `2px solid ${
                    i === safeIndex
                      ? "var(--color-primary)"
                      : "var(--color-border)"
                  }`,
                }}
                aria-label={t("viewImage", { number: i + 1 })}
              >
                <img
                  src={img ?? "/default.png"}
                  alt={t("thumbnail", { number: i + 1 })}
                  className="w-full h-full object-contain p-1.5"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/default.png";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function SingleProductDesktop({
  product,
  relatedProducts = [],
  isRelatedLoading = false,
  hasMore,
  onLoadMore,
  isLoadingMore,
  meta,
}: SingleProductDesktopProps) {
  const t = useTranslations("singleProduct");
  const { user } = useAuth();
  const { showLoginNotification } = useNotification();

  const {
    isInWishlist,
    isLoading: wishlistLoading,
    toggleWishlist,
  } = useWishlistToggle(product.is_in_wishlist);

  const { addToCart, isAdding } = useCart();

  // ── limits derived from product type + stock ──────────────────────────
  const { minQuantity, maxQuantity, measurement } = useProductLimits(product);

  const inStock = maxQuantity > 0;
  const weightLabel = getWeightLabel(product.variant, product.unit_type, product.unit);
  const brandName = product.brand;
  const hasDiscount = product.has_discount && product.discount;

  const [quantity, setQuantity] = useState(minQuantity);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Keep quantity valid if product data changes
  useEffect(() => {
    setQuantity(minQuantity);
  }, [minQuantity]);

  const handleFav = () => {
    if (!user) {
      showLoginNotification(t("loginRequiredWishlist"));
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAdd = async () => {
    if (!inStock || isAdding) return;
    setAdded(true);
    await addToCart(product, quantity);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <ImageGallery
            photoUrls={product.photos_urls ?? []}
            productName={product.name}
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="text-sm font-semibold"
                style={{
                  color: inStock
                    ? "var(--color-success)"
                    : "var(--color-error)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {inStock ? t("inStock") : t("outOfStock")}
              </span>

              {hasDiscount && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {t("percentOff", { percent: product.discount })}
                </span>
              )}
            </div>

            <h1
              className="text-3xl font-bold leading-tight mb-2"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {product.name}
            </h1>

            {weightLabel && (
              <p
                className="text-sm mb-1"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {weightLabel}
              </p>
            )}

            <div className="flex items-center justify-between mt-1 mb-5">
              {brandName && (
                <span
                  className="text-sm"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {brandName}
                </span>
              )}
              <button
                onClick={handleFav}
                disabled={wishlistLoading}
                className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 ml-auto transition-opacity"
                style={{
                  color: isInWishlist
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
                  opacity: wishlistLoading ? 0.5 : 1,
                }}
                aria-label={
                  isInWishlist
                    ? t("removeFromFavourites")
                    : t("addToFavourites")
                }
              >
                {isInWishlist ? (
                  <HeartSolid className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div
              className="flex items-baseline gap-3 mb-6 pb-6"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <span
                className="text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text)",
                }}
              >
                {product.main_price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span
                  className="text-lg line-through"
                  style={{
                    color: "var(--color-error)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {product.stroked_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* ── Shared AddToCart component (inline, not fixed) ── */}
            <AddToCart
              product={product}
              quantity={quantity}
              onIncrement={() => setQuantity((q) => Math.min(q + 1, maxQuantity))}
              onDecrement={() => setQuantity((q) => Math.max(q - 1, minQuantity))}
              onAdd={handleAdd}
              added={added}
              isAdding={isAdding}
              measurement={measurement}
              min={minQuantity}
              max={maxQuantity}
              fixed={false}
            />

            <button
              onClick={() => setDetailsOpen(true)}
              className="w-full flex items-start justify-between rounded-2xl px-4 py-4 text-left active:scale-[0.99] transition-transform mt-4"
              style={{
                backgroundColor: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex-1 pr-3">
                <p
                  className="text-base font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-text)",
                  }}
                >
                  {t("productDetails")}
                </p>
                {product.name && (
                  <p
                    className="text-sm leading-snug"
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {product.name}
                  </p>
                )}
              </div>
              <ChevronRightIcon
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: "var(--color-primary)" }}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        <div className="mt-12">
          <RelatedProducts
            products={relatedProducts}
            isLoading={isRelatedLoading}
            isMobile={false}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            isLoadingMore={isLoadingMore}
            meta={meta}
          />
        </div>
      </main>

      {detailsOpen && (
        <DetailsModal
          product={product}
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
}