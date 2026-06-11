// src/components/product/ProductCard.tsx
"use client";

import { useState, useEffect } from "react";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
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

  const {
    isInWishlist,
    isLoading: wishlistLoading,
    toggleWishlist,
  } = useWishlistToggle(forceInWishlist || (product.is_in_wishlist ?? false));

  const { addToCart, changeQuantity, removeFromCart } = useCart();

  const [isInCartLocal, setIsInCartLocal] = useState(product.is_in_cart ?? false);
  const [qtyInCartLocal, setQtyInCartLocal] = useState(product.qty_in_cart ?? 0);

  const limits = useCartItemLimits(product);
  const inStock = limits.availableStock > 0;

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

  const stopParentNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
      className="flex flex-col rounded-2xl overflow-hidden transition-transform duration-300 ease-out relative hover:-translate-y-1 will-change-transform"
      aria-label={product.name}
      style={{
        backgroundColor: "var(--color-bg)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-bg)", aspectRatio: "1/1" }}
      >
        {product.has_discount && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: "var(--color-delivery-bg)",
                color: "var(--color-delivery-text)",
                fontFamily: "var(--font-sans)",
              }}
            >
              -{product.discount}%
            </span>
          </div>
        )}

        {!hideFavourite && (
          <button
            disabled={wishlistLoading}
            aria-label={isInWishlist ? t("removeFromFavourites") : t("addToFavourites")}
            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFav}
          >
            {isInWishlist ? (
              <HeartSolid className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            ) : (
              <HeartIcon className="w-5 h-5" style={{ color: "var(--color-primary)" }} strokeWidth={1.8} />
            )}
          </button>
        )}

        <img
          src={imageUrl || "/default.png"}
          alt={product.name}
          className="w-full h-full object-contain p-4"
          loading="lazy"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/default.png"; }}
        />

        {!inStock && !inlineError && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", fontFamily: "var(--font-sans)" }}
            >
              {t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col px-3 pt-2 pb-3">
        {/* Unit label */}
        <span
          className="text-xs mb-1"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {product.unit}
        </span>

        {/* Product name — always exactly 2 lines tall; 1-line names leave blank space below */}
        <p
          className="text-sm font-bold"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text)",
            lineHeight: "1.375em",
            height: "2.75em",        // exactly 2 lines
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-2">
          <span
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}
          >
            {t("currency")} {product.main_price.toFixed(2)}
          </span>
          {product.has_discount && product.stroked_price > product.main_price && (
            <span
              className="text-xs line-through"
              style={{ color: "var(--color-error)", fontFamily: "var(--font-sans)", opacity: 0.75 }}
            >
              {product.stroked_price}
            </span>
          )}
        </div>

        {/* Inline error */}
        {inlineError && (
          <span
            className="mt-1 text-[10px] font-semibold px-2 py-1 rounded-md text-center animate-in fade-in slide-in-from-bottom-1 duration-200"
            style={{ backgroundColor: "var(--color-error)", color: "#fff", fontFamily: "var(--font-sans)" }}
          >
            {inlineError}
          </span>
        )}

        {/* Add / Quantity — full width, always at bottom */}
        <div className="mt-2" onClick={stopParentNavigation}>
          {isInCartLocal ? (
            <QuantitySelector
              quantity={qtyInCartLocal}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              min={limits.minQuantity}
              max={limits.maxQuantity}
              measurement={limits.measurement}
              size="sm"
              disabled={isUpdating}
            />
          ) : (
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              aria-label={t("addToCart", { name: product.name })}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                         font-semibold cursor-pointer text-sm transition-all duration-150 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-primary-light, #fff4ee)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <ShoppingCartIcon className="w-4 h-4" strokeWidth={2} />
              {t("add")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}