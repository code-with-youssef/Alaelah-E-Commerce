// src/components/product/ProductCard.tsx
"use client";

import { useState, useEffect } from "react";
import { HeartIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useWishlistToggle } from "@/src/hooks/products/useWishlist";
import { useCart } from "@/src/hooks/cart/useCart";
import { useCartItemLimits } from "@/src/hooks/cart/useCartItemLimits";
import { useNotification } from "@/src/contexts/NotificationContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { validateQuantity } from "@/src/utils/cartQuantityUtils";
import { QuantitySelector } from "../shared/QuantitySelector";
import { Product } from "@/src/types/products/product";

interface ProductCardProps {
  product: Product;
  hideFavourite?: boolean;
  forceInWishlist?: boolean;
}

export function ProductCard({
  product,
  hideFavourite = false,
  forceInWishlist = false,
}: ProductCardProps) {
  const t = useTranslations("product");
  const tRoot = useTranslations();
  const { user } = useAuth();
  const { showLoginNotification } = useNotification();

  // ── Wishlist ──────────────────────────────────────────────────
  const {
    isInWishlist,
    isLoading: wishlistLoading,
    toggleWishlist,
  } = useWishlistToggle(forceInWishlist || (product.is_in_wishlist ?? false));

  // ── Cart ──────────────────────────────────────────────────────
  const { addToCart, changeQuantity, removeFromCart } = useCart();

  const [isInCartLocal, setIsInCartLocal] = useState(
    product.is_in_cart ?? false,
  );
  const [qtyInCartLocal, setQtyInCartLocal] = useState(
    product.qty_in_cart ?? 0,
  );

  // ✅ Shared limits hook — same source of truth as cart rows
  const limits = useCartItemLimits(product);
  const inStock = limits.availableStock > 0;

  // ── Per-card UI state ────────────────────────────────────────
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [added, setAdded] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  useEffect(() => {
    if (!inlineError) return;
    const handle = setTimeout(() => setInlineError(null), 2200);
    return () => clearTimeout(handle);
  }, [inlineError]);

  const canAdd = inStock && !isInCartLocal && !isAdding;

  // ✅ Reusable: block any click in an interactive zone from bubbling to a parent <Link>
  const stopParentNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ── Handlers ─────────────────────────────────────────────────
  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showLoginNotification(t("loginRequiredWishlist"));
      return;
    }

    toggleWishlist(product.id);
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAdd) return;

    const initialQty = limits.minQuantity > 0 ? limits.minQuantity : 1;

    setIsAdding(true);
    try {
      await addToCart(product, initialQty);
      setIsInCartLocal(true);
      setQtyInCartLocal(initialQty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setInlineError(t("addFailed") || "Failed to add");
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrement = async () => {
    if (isUpdating) return;
    const newQty = qtyInCartLocal + 1;

    const validation = validateQuantity(
      newQty,
      limits.minQuantity,
      limits.maxQuantity,
      limits.availableStock,
      limits.measurement,
      tRoot,
    );

    if (!validation.isValid) {
      if (validation.error) setInlineError(validation.error);
      return;
    }

    const previousQty = qtyInCartLocal;
    setQtyInCartLocal(newQty);
    setIsUpdating(true);
    try {
      await changeQuantity(product.id, newQty);
    } catch {
      setQtyInCartLocal(previousQty);
      setInlineError(t("updateFailed") || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (isUpdating) return;
    const newQty = qtyInCartLocal - 1;

    // Below min → remove from cart
    if (newQty < limits.minQuantity) {
      const previousQty = qtyInCartLocal;
      const previousInCart = isInCartLocal;
      setIsInCartLocal(false);
      setQtyInCartLocal(0);
      setIsUpdating(true);
      try {
        await removeFromCart(product.id);
      } catch {
        setIsInCartLocal(previousInCart);
        setQtyInCartLocal(previousQty);
        setInlineError(t("removeFailed") || "Remove failed");
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    const previousQty = qtyInCartLocal;
    setQtyInCartLocal(newQty);
    setIsUpdating(true);
    try {
      await changeQuantity(product.id, newQty);
    } catch {
      setQtyInCartLocal(previousQty);
      setInlineError(t("updateFailed") || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const imageUrl = useResolvedUrl(product.thumbnail_image);

  return (
    <article
      className="flex flex-col rounded-2xl p-1.5 transition-transform duration-300 ease-out relative hover:-translate-y-1 will-change-transform"
      aria-label={product.name}
      style={{
        backgroundColor: "var(--color-bg-subtle)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {/* Image container */}
      <div
        className="relative rounded-xl overflow-hidden mb-1.5"
        style={{
          backgroundColor: "var(--color-bg)",
          aspectRatio: "4/5",
        }}
      >
        {/* ✅ Top row: discount badge + fav — clicks here never bubble to parent Link */}
        <div
          className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10"
          onClick={stopParentNavigation}
        >
          {product.has_discount ? (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: "var(--color-delivery-bg)",
                color: "var(--color-delivery-text)",
                fontFamily: "var(--font-sans)",
              }}
            >
              -{product.discount}%
            </span>
          ) : (
            <span />
          )}

          {!hideFavourite && (
            <button
              onClick={handleFav}
              disabled={wishlistLoading}
              aria-label={
                isInWishlist ? t("removeFromFavourites") : t("addToFavourites")
              }
              className="w-7 h-7 flex items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-bg)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
              }}
            >
              {isInWishlist ? (
                <HeartSolid
                  className="w-4 h-4"
                  style={{ color: "var(--color-primary)" }}
                />
              ) : (
                <HeartIcon
                  className="w-4 h-4"
                  style={{ color: "var(--color-text-muted)" }}
                />
              )}
            </button>
          )}
        </div>

        <img
          src={imageUrl || "/default.png"}
          alt={product.name}
          className="w-full h-full object-contain p-2"
          loading="lazy"
          draggable={false}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/default.png";
          }}
        />

        {/* Inline error toast */}
        {inlineError && (
          <div className="absolute bottom-1.5 left-1.5 right-1.5 z-20 flex justify-center pointer-events-none">
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-md text-center animate-in fade-in slide-in-from-bottom-1 duration-200"
              style={{
                backgroundColor: "var(--color-error)",
                color: "#fff",
                fontFamily: "var(--font-sans)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                maxWidth: "95%",
              }}
            >
              {inlineError}
            </span>
          </div>
        )}

        {!inStock && !inlineError && (
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none">
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                color: "#fff",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* ✅ Price + Add/Quantity — 2-col grid at ALL screen sizes */}
      <div
        className="grid items-center mb-0.5 px-0.5 gap-x-1"
        style={{ gridTemplateColumns: "1fr auto" }}
        onClick={stopParentNavigation}
      >
        {/* Left col: price stack */}
        <div className="flex flex-col min-w-0">
          <span
            className="text-xs font-bold whitespace-nowrap leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-primary)",
            }}
          >
            {product.main_price.toFixed(2)} {t("currency")}
          </span>
          {product.has_discount &&
            product.stroked_price > product.main_price && (
              <span
                className="text-[9px] line-through whitespace-nowrap leading-tight"
                style={{
                  color: "var(--color-error)",
                  fontFamily: "var(--font-sans)",
                  opacity: 0.75,
                }}
              >
                {product.stroked_price} {t("currency")}
              </span>
            )}
        </div>

        {/* Right col: selector or add button — always auto-width, centered */}
        <div className="flex items-center justify-center">
          {isInCartLocal ? (
            <QuantitySelector
              quantity={qtyInCartLocal}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              min={limits.minQuantity}
              max={limits.maxQuantity}
              measurement={limits.measurement}
              size="xs"
              disabled={isUpdating}
            />
          ) : (
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              aria-label={t("addToCart", { name: product.name })}
              className="w-7 h-7 cursor-pointer rounded-full flex items-center justify-center
                   shadow-md transition-all duration-150 active:scale-90
                   disabled:opacity-50 disabled:cursor-not-allowed
                   relative overflow-hidden shrink-0"
              style={{
                backgroundColor: added
                  ? "var(--color-success)"
                  : "var(--color-primary)",
              }}
            >
              <div className="relative w-4 h-4">
                {added ? (
                  <CheckIcon
                    className="absolute inset-0 w-full h-full text-white animate-in fade-in zoom-in duration-150"
                    strokeWidth={2.5}
                  />
                ) : (
                  <PlusIcon
                    className="absolute inset-0 w-full h-full text-white transition-transform duration-150 hover:scale-110"
                    strokeWidth={2.5}
                  />
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Product name */}
      <div className="relative">
        <p className="text-[10px] md:text-xs leading-snug font-bold line-clamp-2 px-0.5 pb-0.5">
          {product.name}
        </p>
      </div>
    </article>
  );
}
