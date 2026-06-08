// components/cart/CartQuantitySelector.tsx
"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { getMaxQuantityMessage } from "@/src/utils/cartQuantityUtils";

interface CartQuantitySelectorProps {
  quantity: number; // Quantity in KG
  onIncrement: () => void;
  onDecrement: () => void;
  unitName: string;
  min?: number; // Min in KG
  max?: number; // Max in KG
  step?: number; // Step in KG (measurement)
  availableStock?: number; // Available stock in KG
  measurement?: number; // Measurement per item in KG
  maxFromProduct?: number; // Max from product in KG
  compact?: boolean;
  isLoading?: boolean;
  showTooltip?: boolean;
}

export function CartQuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  measurement = 1,
  compact = false,
  isLoading = false,
}: CartQuantitySelectorProps) {
  const t = useTranslations("cart");


  const minExceeded = quantity <= min + 0.001; // Add small tolerance for floating point
  const maxExceeded = quantity >= max - 0.001;

  return (
    <div className="relative">
      <div
        className="inline-flex items-center rounded-2xl transition-opacity relative"
        style={{
          border: "1.5px solid var(--color-border)",
          backgroundColor: "var(--color-bg)",
          padding: compact ? "5px 10px" : "8px 14px",
          gap: compact ? "10px" : "12px",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <button
          onClick={onDecrement}
          disabled={minExceeded || isLoading}
          aria-label={t("quantitySelector.decreaseAriaLabel")}
          className="flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
          style={{
            color: "var(--color-primary)",
            width: compact ? "18px" : "22px",
            height: compact ? "18px" : "22px",
          }}
        >
          <MinusIcon
            className={compact ? "w-3 h-3" : "w-3.5 h-3.5"}
            strokeWidth={2.5}
          />
        </button>

        <div className="text-center">
          <span
            className="tabular-nums font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontSize: compact ? "14px" : "16px",
              minWidth: compact ? "40px" : "50px",
            }}
          >
            {(quantity * measurement).toFixed(2)}
          </span>
        </div>

        <button
          onClick={onIncrement}
          disabled={maxExceeded || isLoading}
          aria-label={t("quantitySelector.increaseAriaLabel")}
          className="flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
          style={{
            color: "var(--color-primary)",
            width: compact ? "18px" : "22px",
            height: compact ? "18px" : "22px",
          }}
        >
          <PlusIcon
            className={compact ? "w-3 h-3" : "w-3.5 h-3.5"}
            strokeWidth={2.5}
          />
        </button>
      </div>

{/*       {showTooltip && maxExceeded && !isLoading && (
        <div
          className="absolute top-full left-0 mt-1 text-xs whitespace-nowrap z-10 px-2 py-1 rounded shadow-lg"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-danger, #ef4444) 12%, var(--color-bg))",
            color: "var(--color-danger, #ef4444)",
            border:
              "1px solid color-mix(in srgb, var(--color-danger, #ef4444) 25%, transparent)",
          }}
        >
          {maxMessage}
        </div>
      )} */}
    </div>
  );
}
