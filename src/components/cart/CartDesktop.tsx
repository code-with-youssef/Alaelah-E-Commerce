"use client";

import { CartItemsTable } from "./CartItemsTable";
import { CartCheckoutBar } from "./CartCheckoutBar";
import { CartStockWarning } from "./CartStockWarning";
import { StockWarning } from "@/src/hooks/cart/useCartStockCheck";
import { CartItem } from "@/src/types/cart/cart";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTranslations } from "next-intl";

interface CartDesktopProps {
  items: CartItem[];
  onRemove?: (productId: number) => void;
  onClearAll: () => void;
  onCheckout: () => void;
  isLoading?: boolean;
  warnings: StockWarning[];
  onDismissWarning: (productId: number) => void;
  onDismissAllWarnings: () => void;
  hasUnresolvedWarnings: boolean;
}

export function CartDesktop({
  items,
  onRemove,
  onClearAll,
  isLoading = false,
  warnings,
  onDismissWarning,
  onDismissAllWarnings,
  hasUnresolvedWarnings,
}: CartDesktopProps) {
  const { loading: authLoading } = useAuth();
  const t = useTranslations("cart");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.length;

  if (isLoading || authLoading) {
    return (
      <div
        className="flex flex-col min-h-dvh items-center justify-center"
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
    <div className="flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[33%] gap-3">
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              {t("desktop.emptyTitle")}
            </p>
            <p
              className="text-base"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
            >
              {t("desktop.emptyMessage")}
            </p>
          </div>
        ) : (
          <>
            <header
              className="sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10 py-4"
              style={{
                backgroundColor: "var(--color-bg)",
                borderBottom: "1px solid var(--color-border)",
                boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <h1
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                >
                  {t("desktop.cartTitle")}
                </h1>
                {totalItems > 0 && (
                  <span
                    className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {totalItems} {t("desktop.items", { count: totalItems })}
                  </span>
                )}
              </div>

              <button
                onClick={onClearAll}
                className="text-sm font-bold transition-opacity hover:opacity-70 active:opacity-50"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
              >
                {t("desktop.clearAll")}
              </button>
            </header>

            {/* Stock warnings — shown above the table */}
            {warnings.length > 0 && (
              <CartStockWarning
                warnings={warnings}
                onDismiss={onDismissWarning}
                onDismissAll={onDismissAllWarnings}
              />
            )}

            <CartItemsTable items={items} onRemove={onRemove} />

            <div className="flex items-center justify-between gap-6">
              <div>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
                >
                  {t("desktop.subtotalLabel", { count: totalItems })}
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                >
                  {t("checkoutBar.currency")} {subtotal.toFixed(2).toLocaleString()}
                </p>
              </div>

              <div className="shrink-0 w-72">
                <CartCheckoutBar
                  subtotal={subtotal}
                  fixed={false}
                  disabled={hasUnresolvedWarnings}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}