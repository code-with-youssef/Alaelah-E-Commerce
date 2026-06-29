"use client";

import { CartItem } from "@/src/types/cart/cart";
import { CartItemRow } from "./CartItemRow";
import { CartCheckoutBar } from "./CartCheckoutBar";
import { CartStockWarning } from "./CartStockWarning";
import { StockWarning } from "@/src/hooks/cart/useCartStockCheck";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTranslations } from "next-intl";

interface CartMobileProps {
  items: CartItem[];
  onClearAll: () => void;
  onEdit?: (item: CartItem) => void;
  onCheckout: () => void;
  isLoading?: boolean;
  warnings: StockWarning[];
  onDismissWarning: (productId: number) => void;
  onDismissAllWarnings: () => void;
  hasUnresolvedWarnings: boolean;
}

export function CartMobile({
  items,
  onClearAll,
  isLoading = false,
  warnings,
  onDismissWarning,
  onDismissAllWarnings,
  hasUnresolvedWarnings,
}: CartMobileProps) {
  const { loading: authLoading } = useAuth();
  const t = useTranslations("cart");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (isLoading || authLoading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-primary)" }}
          aria-label={t("loading")}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <h1
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {t("mobile.cartTitle")}
        </h1>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm font-bold transition-opacity active:opacity-70"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
          >
            {t("mobile.clearAll")}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pb-28 px-4">
        {/* Stock warnings — shown at top of list */}
        {warnings.length > 0 && (
          <div className="pt-2">
            <CartStockWarning
              warnings={warnings}
              onDismiss={onDismissWarning}
              onDismissAll={onDismissAllWarnings}
            />
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[50%] gap-3">
            <p
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              {t("mobile.emptyTitle")}
            </p>
            <p
              className="text-sm text-center"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
            >
              {t("mobile.emptyMessage")}
            </p>
          </div>
        ) : (
          <div className="mb-6">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <CartCheckoutBar
          subtotal={subtotal}
          fixed
          disabled={hasUnresolvedWarnings}
        />
      )}
    </div>
  );
}