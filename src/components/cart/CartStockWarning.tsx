"use client";

import { StockWarning } from "@/src/hooks/cart/useCartStockCheck";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface CartStockWarningProps {
  warnings: StockWarning[];
  onDismiss: (productId: number) => void;
  onDismissAll: () => void;
}

export function CartStockWarning({
  warnings,
  onDismiss,
  onDismissAll,
}: CartStockWarningProps) {
  const t = useTranslations("cart");

  if (warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {warnings.map((w) => (
        <div
          key={w.productId}
          className="flex items-start gap-3 rounded-2xl px-4 py-3"
          style={{
            backgroundColor: "color-mix(in srgb, #f59e0b 10%, var(--color-bg))",
            border: "1px solid color-mix(in srgb, #f59e0b 35%, transparent)",
          }}
        >
          {/* Warning icon */}
          <svg
            className="w-4 h-4 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#f59e0b"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>

          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold leading-snug"
              style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
            >
              {w.availableQty === 0
                ? t("stockCheck.removedOutOfStock", { name: w.productName })
                : t("stockCheck.adjustedQty", {
                    name: w.productName,
                    available: w.availableQty,
                    requested: w.requestedQty,
                  })}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
            >
              {t("stockCheck.storeStockNote")}
            </p>
          </div>

          <button
            onClick={() => onDismiss(w.productId)}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full active:scale-90 transition-all"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={t("stockCheck.dismiss")}
          >
            <XMarkIcon className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      ))}

      {warnings.length > 1 && (
        <button
          onClick={onDismissAll}
          className="self-end text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {t("stockCheck.dismissAll")}
        </button>
      )}
    </div>
  );
}