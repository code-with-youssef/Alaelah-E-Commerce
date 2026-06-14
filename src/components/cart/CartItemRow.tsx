// components/cart/CartItemRow.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";
import { CartQuantitySelector } from "./CartQuantitySelector";
import { CartItem } from "@/src/types/cart/cart";
import { useCart } from "@/src/hooks/cart/useCart";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { useTranslations } from "next-intl";
import { useCartItemLimits } from "@/src/hooks/cart/useCartItemLimits";
import { validateQuantity } from "@/src/utils/cartQuantityUtils";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { changeQuantity, removeFromCart } = useCart();
  const t = useTranslations("cart");
  const limits = useCartItemLimits(item);

  // localQty = number of ITEMS (pieces)
  const [localQty, setLocalQty] = useState(item.quantity);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with prop when not pending
  if (!isPending && localQty !== item.quantity) {
    setLocalQty(item.quantity);
    setError(null);
  }

  const handleChange = useCallback(
    (newQty: number) => {
      const finalQty = Math.max(
        limits.minQuantity,
        Math.min(limits.maxQuantity, newQty),
      );

      const validation = validateQuantity(
        finalQty,
        limits.minQuantity,
        limits.maxQuantity,
        limits.availableStock,
        limits.measurement,
        t,
      );

      if (!validation.isValid) {
        setError(validation.error || t("quantitySelector.invalidQuantity"));
        if (validation.suggestedQuantity !== undefined) {
          setTimeout(() => handleChange(validation.suggestedQuantity!), 100);
        }
        return;
      }

      setError(null);
      setLocalQty(finalQty);
      setIsPending(true);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          if (finalQty <= 0) {
            await removeFromCart(item.product.id);
          } else {
            // ✅ Send items count directly — API expects pieces, not KG
            await changeQuantity(item.product.id, finalQty);
          }
        } catch (err) {
          setError(t("quantitySelector.updateFailed"));
        } finally {
          setIsPending(false);
        }
      }, 500);
    },
    [item.product.id, limits, changeQuantity, removeFromCart, t],
  );

  const name = item.product_name;
  const imageUrl = useResolvedUrl(item.product.thumbnail_image);
  const unitName = item.product.unit || t("itemsTable.unit");
  const measurement = limits.measurement; // KG per item

  // Display helpers
  const totalWeightKg = localQty * measurement; // for weight display
  const lineTotal = item.price * localQty; // price per item × items
  const hasMeasurement = measurement !== 1;

  return (
    <div className="relative">
      {error && (
        <div
          className="absolute top-0 left-0 right-0 text-xs text-center py-1 z-10"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-danger, #ef4444) 12%, var(--color-bg))",
            color: "var(--color-danger, #ef4444)",
          }}
        >
          {error}
        </div>
      )}

      <div
        className="flex items-start gap-3 py-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {/* Product Image */}
        <div className="relative shrink-0">
          <Link
            href={`/products/${item.product.id}-${item.product.slug.replace(/\./g, "")}`}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                width: "72px",
                height: "72px",
              }}
            >
              <img
                src={imageUrl || "/default.png"}
                alt={t("itemRow.productImageAlt", { name })}
                className="w-full h-full object-contain p-1.5"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/default.png";
                }}
              />
            </div>
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${item.product.id}-${item.product.slug.replace(/\./g, "")}`}
              className="flex-1 min-w-0"
            >
              <p
                className="text-sm font-semibold leading-snug mb-0.5 line-clamp-2 hover:underline"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-text)",
                }}
              >
                {name}
              </p>
            </Link>

            {/* Delete button */}
            <button
              onClick={() => removeFromCart(item.product.id)}
              disabled={isPending}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all hover:bg-red-50 active:scale-90 disabled:opacity-40"
              style={{ color: "var(--color-text-muted)" }}
              aria-label={t("itemsTable.removeAriaLabel", { name })}
            >
              <TrashIcon className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>

          {/* Weight per item (only if measurement-based) */}
          {hasMeasurement && (
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {t("itemsTable.perItem", { measurement, unit: unitName })}
            </p>
          )}

          {/* Price per item */}
          <div className="mt-1">
            <span
              className="text-sm font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {item.currency_symbol} {item.price.toLocaleString()}
            </span>
            <span
              className="text-xs ml-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              / {t("itemsTable.item")}
              {hasMeasurement && ` (${measurement} ${unitName})`}
            </span>
          </div>

          {/* Total */}
          <div className="mt-1">
            <span
              className="text-base font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-primary)",
              }}
            >
              {item.currency_symbol} {lineTotal.toFixed(2)}
            </span>
            {hasMeasurement && (
              <span
                className="text-xs ml-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({totalWeightKg.toFixed(2)} {unitName})
              </span>
            )}
          </div>
        </div>

        {/* Quantity Selector — steps by 1 item */}
        <div className="shrink-0 pt-1">
          <CartQuantitySelector
            quantity={localQty}
            onIncrement={() => handleChange(localQty + 1)}
            onDecrement={() => handleChange(localQty - 1)}
            unitName={t("itemsTable.item")}
            min={limits.minQuantity}
            max={limits.maxQuantity}
            step={1}
            availableStock={limits.availableStock}
            measurement={measurement}
            maxFromProduct={item.product.max_qty ?? 0}
            isLoading={isPending}
            showTooltip={false}
          />
        </div>
      </div>
    </div>
  );
}