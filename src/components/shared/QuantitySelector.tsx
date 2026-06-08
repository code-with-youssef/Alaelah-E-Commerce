"use client";

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  measurement?: number;
  size?: "xs" | "sm" | "md";
  disabled?: boolean;
  showDelete?: boolean;
  isDisabled?: boolean; // for future use if we want to disable the whole selector (e.g. during checkout)
}

const SIZE_TOKENS = {
  xs: {
    padding: "2px 3px",
    gap: "3px",
    btn: 17,
    icon: "w-5 h-5",
    font: "15px",
    minWidth: "15px",
    minWidthKg: "34px",
    radius: "9999px",
  },
  sm: {
    padding: "6px 10px",
    gap: "10px",
    btn: 20,
    icon: "w-5 h-5",
    font: "15px",
    minWidth: "16px",
    minWidthKg: "44px",
    radius: "16px",
  },
  md: {
    padding: "10px 14px",
    gap: "14px",
    btn: 26,
    icon: "w-5 h-5",
    font: "17px",
    minWidth: "20px",
    minWidthKg: "52px",
    radius: "16px",
  },
} as const;

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  measurement = 1,
  size = "md",
  disabled = false,
  showDelete = true,
  isDisabled = false,
}: QuantitySelectorProps) {
  const tokens = SIZE_TOKENS[size];

  const hasMeasurement = measurement < 1;
  const displayValue = isDisabled
    ? "0"
    : hasMeasurement
      ? `${parseFloat((quantity * measurement).toFixed(4))} kg`
      : `${quantity}`;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDecrement();
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onIncrement();
  };

  return (
    <div
      className="flex items-center"
      style={{
        border: "1.5px solid var(--color-primary)",
        backgroundColor: "var(--color-bg-subtle)",
        padding: tokens.padding,
        gap: tokens.gap,
        borderRadius: tokens.radius,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || (quantity <= min && !showDelete) || isDisabled}
        aria-label={quantity <= min ? "Remove from cart" : "Decrease quantity"}
        className="flex items-center cursor-pointer justify-center rounded-full transition-all active:scale-90 disabled:opacity-35"
        style={{
          color: "var(--color-primary)",
          width: `${tokens.btn}px`,
          height: `${tokens.btn}px`,
          flexShrink: 0,
        }}
      >
        {showDelete && quantity <= min ? (
          <TrashIcon className={tokens.icon} strokeWidth={2.5} />
        ) : (
          <MinusIcon className={tokens.icon} strokeWidth={2.5} />
        )}
      </button>

      <span
        className="tabular-nums font-bold text-center"
        style={{
          fontFamily: "var(--font-display)",
          color: isDisabled ? "var(--color-text-muted)" : "var(--color-text)",
          fontSize: tokens.font,
          minWidth: measurement < 1 ? tokens.minWidthKg : tokens.minWidth,
        }}
      >
        {displayValue}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max || isDisabled}
        aria-label="Increase quantity"
        className="flex items-center cursor-pointer justify-center rounded-full transition-all active:scale-90 disabled:opacity-35"
        style={{
          color: "var(--color-primary)",
          width: `${tokens.btn}px`,
          height: `${tokens.btn}px`,
          flexShrink: 0,
        }}
      >
        <PlusIcon className={tokens.icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}
