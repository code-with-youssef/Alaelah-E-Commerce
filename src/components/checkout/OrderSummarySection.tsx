"use client";

import { useTranslations } from 'next-intl';
import { calcGrandTotal, OrderSummary } from "@/src/types/order/checkout";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface OrderSummarySectionProps {
  summary: OrderSummary;
  onPlaceOrder: () => void;
  isLoading?: boolean;
  canPlaceOrder?: boolean;
}

export function OrderSummarySection({
  summary,
  onPlaceOrder,
  isLoading = false,
  canPlaceOrder = true,
}: OrderSummarySectionProps) {
  const t = useTranslations('checkout');
  const grandTotal = calcGrandTotal(summary);
  const { currency } = summary;

  return (
    <>
      {/*
        ── LINE ITEMS ────────────────────────────────────────────
        Always visible, scrolls with the page on both mobile and desktop.
      */}
      <section className="py-5 pb-36 md:pb-5">
        <div className="flex flex-col gap-3 mb-4">
          <SummaryRow
            label={t('subtotal')}
            value={summary.subtotal}
            currency={currency}
          />
          <SummaryRow
            label={t('delivery')}
            value={summary.delivery}
            currency={currency}
          />
          {summary.tip > 0 && (
            <SummaryRow label={t('tip')} value={summary.tip} currency={currency} />
          )}
          {summary.promoDiscount > 0 && (
            <SummaryRow
              label={t('promoDiscount')}
              value={-summary.promoDiscount}
              currency={currency}
              isDiscount
            />
          )}
        </div>

        {/* Divider — desktop only, mobile grand total is in the fixed bar */}
        <div
          className="hidden md:block h-px mb-4"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* Grand total + button — DESKTOP only (inline) */}
        <div className="hidden md:block">
          <GrandTotalBlock
            grandTotal={grandTotal}
            currency={currency}
            pointsEarned={summary.pointsEarned}
            canPlaceOrder={canPlaceOrder}
            isLoading={isLoading}
            onPlaceOrder={onPlaceOrder}
          />
        </div>
      </section>

      {/*
        ── MOBILE FIXED BAR ──────────────────────────────────────
        Fixed to the bottom on mobile, hidden on desktop.
        The `pb-36` above prevents content being hidden behind it.
      */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-70 px-4 pt-4 pb-6"
        style={{
          backgroundColor: "var(--color-bg)",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <GrandTotalBlock
          grandTotal={grandTotal}
          currency={currency}
          pointsEarned={summary.pointsEarned}
          canPlaceOrder={canPlaceOrder}
          isLoading={isLoading}
          onPlaceOrder={onPlaceOrder}
        />
      </div>
    </>
  );
}

// ── Grand total + button block (shared by fixed bar & desktop) ─
function GrandTotalBlock({
  grandTotal,
  currency,
  pointsEarned,
  canPlaceOrder,
  isLoading,
  onPlaceOrder,
}: {
  grandTotal: number;
  currency: string;
  pointsEarned: number;
  canPlaceOrder: boolean;
  isLoading: boolean;
  onPlaceOrder: () => void;
}) {
  const t = useTranslations('checkout');
  
  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <span
          className="text-base font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {t('grandTotal')}
        </span>
        <div className="text-right">
          <p
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {currency} {grandTotal}
          </p>
          {pointsEarned > 0 && (
            <p
              className="text-xs flex items-center justify-end gap-1 mt-0.5"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t('pointsEarned', { points: pointsEarned })}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={!canPlaceOrder || isLoading}
        className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
        style={{
          fontFamily: "var(--font-sans)",
          backgroundColor: canPlaceOrder
            ? "var(--color-primary)"
            : "var(--color-bg-muted)",
          color: canPlaceOrder ? "#ffffff" : "var(--color-text-placeholder)",
          cursor: canPlaceOrder && !isLoading ? "pointer" : "not-allowed",
          boxShadow: canPlaceOrder
            ? "0 4px 14px rgba(181,23,158,0.35)"
            : "none",
        }}
      >
        {isLoading ? t('placingOrder') : t('placeOrder')}
      </button>
    </>
  );
}

// ── Summary row ───────────────────────────────────────────────
function SummaryRow({
  label,
  value,
  currency,
  hasInfo = false,
  isDiscount = false,
}: {
  label: string;
  value: number;
  currency: string;
  hasInfo?: boolean;
  isDiscount?: boolean;
}) {
  const t = useTranslations('checkout');
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span
          className="text-sm"
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-muted)",
          }}
        >
          {label}
        </span>
        {hasInfo && (
          <button aria-label={t('infoAbout', { label })}>
            <InformationCircleIcon
              className="w-3.5 h-3.5"
              style={{ color: "var(--color-primary)" }}
            />
          </button>
        )}
      </div>
      <span
        className="text-sm font-medium"
        style={{
          fontFamily: "var(--font-sans)",
          color: isDiscount
            ? "var(--color-delivery-text)"
            : "var(--color-text)",
        }}
      >
        {isDiscount ? "-" : ""}
        {currency} {Math.abs(value)}
      </span>
    </div>
  );
}