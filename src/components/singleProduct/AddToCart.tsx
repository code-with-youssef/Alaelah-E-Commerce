"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/src/types/products/product";
import { QuantitySelector } from "../shared/QuantitySelector";

interface AddToCartProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAdd: () => void;
  added: boolean;
  isAdding?: boolean;
  measurement?: number; // KG per item — forwarded to QuantitySelector for display
  min?: number; // in ITEMS
  max?: number; // in ITEMS
  /** true = fixed bottom bar (mobile), false = inline block (desktop) */
  fixed?: boolean;
}

export function AddToCart({
  product,
  quantity,
  onIncrement,
  onDecrement,
  onAdd,
  added,
  isAdding = false,
  measurement = 1,
  min = 1,
  max = 99,
  fixed = false,
}: AddToCartProps) {
  const t = useTranslations("singleProduct");
  const inStock = max > 0;
  // ...
  const totalPrice = product.main_price * quantity;
  const totalOriginal =
    product.has_discount && product.discount
      ? product.stroked_price * quantity
      : undefined;

  const disabled = !inStock || isAdding;

  let buttonLabel = t("add");
  if (added) buttonLabel = t("added");
  if (isAdding) buttonLabel = t("adding");

  const bar = (
    <div
      className="flex items-center gap-3 p-3"
      style={{
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <QuantitySelector
        quantity={quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        min={min}
        max={max}
        measurement={measurement}
        showDelete={false}
        isDisabled={disabled}
      />

      <button
        onClick={onAdd}
        disabled={disabled}
        className="flex-1 flex items-center justify-between rounded-2xl px-5 py-3.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: added
            ? "var(--color-success)"
            : "var(--color-primary)",
        }}
      >
        <span
          className="text-white font-bold text-base"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {buttonLabel}
        </span>

        <div className="text-right">
          <p
            className="text-white font-bold text-base leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {totalPrice.toLocaleString()}
          </p>
          {totalOriginal && (
            <p className="text-white/70 text-xs line-through leading-tight">
              {totalOriginal.toLocaleString()}
            </p>
          )}
        </div>
      </button>
    </div>
  );

  if (fixed) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-60"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {bar}
      </div>
    );
  }

  return <div className="mt-6">{bar}</div>;
}
