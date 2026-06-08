// components/cart/CartItemsTable.tsx
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

interface CartItemsTableProps {
  items: CartItem[];
  onRemove?: (productId: number) => void;
}

export function CartItemsTable({ items, onRemove }: CartItemsTableProps) {
  const t = useTranslations("cart");

  if (items.length === 0) return null;

  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div
        className="grid grid-cols-12 px-6 py-3 text-xs font-bold uppercase tracking-wider"
        style={{
          backgroundColor: "var(--color-bg-subtle)",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-sans)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="col-span-5">{t("itemsTable.product")}</div>
        <div className="col-span-2 text-center">
          {t("itemsTable.unitPrice")}
        </div>
        <div className="col-span-2 text-center">{t("itemsTable.quantity")}</div>
        <div className="col-span-2 text-right">{t("itemsTable.total")}</div>
        <div className="col-span-1" />
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <TableRow
          key={item.id}
          item={item}
          isLast={i === items.length - 1}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

interface TableRowProps {
  item: CartItem;
  isLast: boolean;
  onRemove?: (productId: number) => void;
}

function TableRow({ item, isLast, onRemove }: TableRowProps) {
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
            // ✅ Send items count directly
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
  const hasMeasurement = measurement !== 1;

  // Display helpers
  const totalWeightKg = localQty * measurement;
  const lineTotal = item.price * localQty;

  return (
    <div
      className="relative"
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--color-border)",
      }}
    >
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

      <div className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-[var(--color-bg-subtle)]">
        {/* Product Info Column */}
        <div className="col-span-5 flex items-center gap-4">
          <Link
            href={`/products/${item.product.id}-${item.product.slug.replace(/\./g, "")}`}
          >
            <div
              className="rounded-2xl overflow-hidden shrink-0"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
              }}
            >
              <img
                src={imageUrl || "/default.png"}
                alt={t("itemsTable.productImageAlt", { name })}
                className="w-full h-full object-contain p-1.5"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/default.png";
                }}
              />
            </div>
          </Link>

          <div className="min-w-0">
            <Link
              href={`/products/${item.product.id}-${item.product.slug.replace(/\./g, "")}`}
            >
              <p
                className="text-sm font-semibold leading-snug line-clamp-2 hover:underline"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-text)",
                }}
              >
                {name}
              </p>
            </Link>
          </div>
        </div>

        {/* Unit Price Column */}
        <div className="col-span-2 text-center">
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {item.currency_symbol} {item.price.toLocaleString()}
          </span>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {hasMeasurement && ` (${measurement} ${unitName})`}
          </p>
        </div>

        {/* Quantity Column — steps by 1 item */}
        <div className="col-span-2 flex justify-center">
          <CartQuantitySelector
            quantity={localQty}
            onIncrement={() => handleChange(localQty + 1)}
            onDecrement={() => handleChange(localQty - 1)}
            unitName={unitName}
            min={limits.minQuantity}
            max={limits.maxQuantity}
            step={1}
            availableStock={limits.availableStock}
            measurement={measurement}
            maxFromProduct={item.product.max_qty ?? 0}
            compact
            isLoading={isPending}
          />
        </div>

        {/* Total Price Column */}
        <div className="col-span-2 text-right">
          <span
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {item.currency_symbol} {lineTotal.toFixed(2)}
          </span>
          {hasMeasurement && (
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              {totalWeightKg.toFixed(2)} {unitName}
            </p>
          )}
        </div>

        {/* Remove Button Column */}
        <div className="col-span-1 flex justify-end">
          <button
            onClick={() => {
              if (onRemove) {
                onRemove(item.product.id);
              } else {
                removeFromCart(item.product.id);
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-red-50 active:scale-90"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={t("itemsTable.removeAriaLabel", { name })}
            disabled={isPending}
          >
            <TrashIcon className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
