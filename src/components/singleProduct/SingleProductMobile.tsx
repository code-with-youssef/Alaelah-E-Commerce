"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { RelatedProducts } from "./related/RelatedProducts";
import { AddToCart } from "./AddToCart";
import { DetailsModal } from "./DetailsModal";
import type { Product } from "@/src/types/products/product";
import { PaginationMeta } from "@/src/types/shared/pagination";
import { useWishlistToggle } from "@/src/hooks/products/useWishlist";
import { useCart } from "@/src/hooks/cart/useCart";
import { useNotification } from "@/src/contexts/NotificationContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { getWeightLabel } from "@/src/utils/GetWeightLabel";
import { useCartItemLimits } from "@/src/hooks/cart/useCartItemLimits";

interface SingleProductMobileProps {
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

function MobileCarousel({
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
  const [current, setCurrent] = useState(0);

  const handleResolved = (index: number, url: string) => {
    setResolved((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const allResolved = resolved.every((r) => r !== undefined);
  const total = photoUrls.length;
  const safeIndex = Math.min(current, Math.max(total - 1, 0));

  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);
  const goNext = () => setCurrent((c) => (c + 1) % total);

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

      <div
        className="relative w-full flex items-center justify-center select-none"
        style={{
          minHeight: "260px",
          backgroundColor: "var(--color-bg-subtle)",
        }}
      >
        {!allResolved ? (
          <div
            className="w-full animate-pulse"
            style={{
              height: "260px",
              backgroundColor: "var(--color-bg-subtle)",
            }}
          />
        ) : (
          <img
            src={resolved[safeIndex] ?? "/default.png"}
            alt={productName}
            className="w-full object-contain"
            style={{ maxHeight: "280px", padding: "1.5rem 2rem" }}
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/default.png";
            }}
          />
        )}

        {allResolved && total > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{
                backgroundColor: "var(--color-bg)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
                color: "var(--color-text-muted)",
              }}
              aria-label={t("previousImage")}
            >
              <ChevronLeftIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{
                backgroundColor: "var(--color-bg)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
                color: "var(--color-text-muted)",
              }}
              aria-label={t("nextImage")}
            >
              <ChevronRightIcon className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </>
        )}

        {allResolved && total > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {resolved.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === safeIndex ? "16px" : "6px",
                  height: "6px",
                  backgroundColor:
                    i === safeIndex
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                }}
                aria-label={t("goToImage", { number: i + 1 })}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function SingleProductMobile({
  product,
  relatedProducts = [],
  isRelatedLoading = false,
  hasMore,
  onLoadMore,
  isLoadingMore,
  meta,
}: SingleProductMobileProps) {
  const t = useTranslations("singleProduct");
  const router = useRouter();
  const { user } = useAuth();
  const { showLoginNotification } = useNotification();

  const {
    isInWishlist,
    isLoading: wishlistLoading,
    toggleWishlist,
  } = useWishlistToggle(product.is_in_wishlist);

  const { cartCount, addToCart, isAdding } = useCart();

  // ── limits derived from product type + stock ──────────────────────────
  const { minQuantity, maxQuantity, measurement } = useCartItemLimits(product);

  const inStock = maxQuantity > 0;
  const weightLabel = getWeightLabel(product.variant, product.unit_type, product.unit);
  const brandName = product.name ?? null;
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
      <header
        className="flex items-center justify-between px-3 pt-3 pb-2 shrink-0"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90"
          style={{ color: "var(--color-text-muted)" }}
          aria-label={t("goBack")}
        >
          <ArrowLeftIcon className="w-5 h-5" strokeWidth={2} />
        </button>

        <button
          onClick={() => router.push("/cart")}
          className="relative w-9 h-9 flex items-center justify-center rounded-full active:scale-90"
          style={{ color: "var(--color-primary)" }}
          aria-label={t("viewCart")}
        >
          <ShoppingCartIcon className="w-5 h-5" strokeWidth={2} />
          {cartCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-28">
        <MobileCarousel
          photoUrls={product.photos_urls ?? []}
          productName={product.name}
        />

        <div className="px-4 pt-2 pb-4">
          <p
            className="text-sm font-semibold mb-1"
            style={{
              color: inStock ? "var(--color-success)" : "var(--color-error)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {inStock ? t("inStock") : t("outOfStock")}
          </p>

          <h1
            className="text-2xl font-bold leading-snug mb-2"
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

          {hasDiscount && (
            <span
              className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full mb-3"
              style={{
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("percentOff", { percent: product.discount })}
            </span>
          )}

          <div className="flex items-baseline gap-2 mt-1 mb-3">
            <span
              className="text-xl font-bold"
              style={{
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
              }}
            >
              {product.main_price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span
                className="text-sm line-through"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {product.stroked_price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
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
                isInWishlist ? t("removeFromFavourites") : t("addToFavourites")
              }
            >
              {isInWishlist ? (
                <HeartSolid className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mx-4 mb-2">
          <button
            onClick={() => setDetailsOpen(true)}
            className="w-full flex items-start justify-between rounded-2xl px-4 py-4 text-left active:scale-[0.99] transition-transform"
            style={{
              backgroundColor: "var(--color-bg-subtle)",
              boxShadow:
                "0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
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
              {product.category && (
                <p
                  className="text-sm leading-snug"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {product.category}
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

        <div className="h-2 my-2" />

        <RelatedProducts
          products={relatedProducts}
          isLoading={isRelatedLoading}
          isMobile={true}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          meta={meta}
        />
      </div>

      {/* AddToCart now receives measurement so it can pass it down to QuantitySelector */}
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
        fixed
      />

      <DetailsModal
        product={product}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}
