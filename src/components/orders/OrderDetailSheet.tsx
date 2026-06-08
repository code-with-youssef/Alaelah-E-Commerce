// app/orders/components/OrderDetailSheet.tsx
"use client";

import { useEffect } from "react";
import {
  XMarkIcon,
  MapPinIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ReceiptRefundIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDate, ORDER_STATUS_META, UIOrder } from "@/src/config/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { useTranslations } from "next-intl";

interface OrderDetailSheetProps {
  order: UIOrder;
  onClose: () => void;
  onReorder?: (orderId: string) => void;
}

export function OrderDetailSheet({
  order,
  onClose,
  onReorder,
}: OrderDetailSheetProps) {
  const t = useTranslations("orders");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const isActive = [
    "pending",
    "confirmed",
    "processing",
    "out_for_delivery",
  ].includes(order.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile sheet */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--color-bg)", maxHeight: "92dvh" }}
      >
        <div className="flex justify-center pt-3 pb-0 shrink-0">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>
        <DetailContent
          order={order}
          onClose={onClose}
          onReorder={onReorder}
          isActive={isActive}
        />
      </div>

      {/* Desktop panel */}
      <div
        className="hidden md:flex fixed top-0 right-0 bottom-0 z-[201] flex-col shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg)",
          width: "460px",
          borderLeft: "1px solid var(--color-border)",
        }}
      >
        <DetailContent
          order={order}
          onClose={onClose}
          onReorder={onReorder}
          isActive={isActive}
        />
      </div>
    </>
  );
}

/* =========================
   ✅ Item image wrapper — resolves URL at its own boundary
========================= */
function OrderDetailItemImage({ item }: { item: any }) {
  const imageUrl = useResolvedUrl(item.imageUrl);

  if (!imageUrl) return null;

  return (
    <div
      className="w-16 h-16 rounded-xl overflow-hidden shrink-0"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      <img
        src={imageUrl}
        alt={item.name}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function DetailContent({
  order,
  onClose,
  onReorder,
  isActive,
}: {
  order: UIOrder;
  onClose: () => void;
  onReorder?: (id: string) => void;
  isActive: boolean;
}) {
  const t = useTranslations("orders");
  const statusMeta = ORDER_STATUS_META[order.status];

  return (
    <>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div>
          <p
            className="text-base font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {t("orderNumber", { orderNumber: order.orderNumber })}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {order.date}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              color: "var(--color-text-muted)",
            }}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 px-5">
        {/* Status Timeline */}
        {isActive && (
          <div className="py-5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: statusMeta.bgColor }}
              >
                <ClockIcon
                  className="w-4 h-4"
                  style={{ color: statusMeta.color }}
                />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {t("currentStatus")}: {order.statusText}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatDate(order.date)}
                </p>
              </div>
            </div>
          </div>
        )}

        <Divider />

        {/* Items */}
        <section className="py-5">
          <h3
            className="text-sm font-bold mb-3"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--color-text)",
            }}
          >
            {t("items", { count: order.items.length })}
          </h3>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <OrderDetailItemImage item={item} />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {order.currency} {item.total.toFixed(2)}
                    </p>
                  </div>
                  {item.variation && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.variation}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {t("quantity")}: {item.quantity} × {order.currency}{" "}
                      {item.price.toFixed(2)}
                    </p>
                    {item.canRefund && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                        {t("refundAvailable")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          item.deliveryStatus === "delivered"
                            ? "#dcfce7"
                            : "#fff3cd",
                        color:
                          item.deliveryStatus === "delivered"
                            ? "#166534"
                            : "#856404",
                      }}
                    >
                      {item.deliveryStatusText}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <>
            <section className="py-5">
              <h3
                className="text-sm font-bold mb-3"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-text)",
                }}
              >
                {t("deliveryAddress")}
              </h3>
              <div className="flex items-start gap-3">
                <MapPinIcon
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <p className="text-sm" style={{ color: "var(--color-text)" }}>
                  {order.deliveryAddress}
                </p>
              </div>
            </section>
            <Divider />
          </>
        )}

        {/* Payment */}
        <section className="py-5">
          <h3
            className="text-sm font-bold mb-3"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--color-text)",
            }}
          >
            {t("paymentDetails")}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            {order.paymentType === "cashOnDelivery" ? (
              <BanknotesIcon
                className="w-4 h-4"
                style={{ color: "var(--color-text-muted)" }}
              />
            ) : (
              <CreditCardIcon
                className="w-4 h-4"
                style={{ color: "var(--color-text-muted)" }}
              />
            )}
            <div>
              <p className="text-sm" style={{ color: "var(--color-text)" }}>
                {order.paymentType === "cashOnDelivery"
                  ? t("cashOnDelivery")
                  : t("cardPayment")}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{
                  backgroundColor:
                    order.paymentStatus === "paid" ? "#dcfce7" : "#fff3cd",
                  color:
                    order.paymentStatus === "paid" ? "#166534" : "#856404",
                }}
              >
                {order.paymentStatusText}
              </span>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="flex flex-col gap-2.5 mt-4">
            <PriceRow
              label={t("subtotal")}
              value={order.subtotal}
              currency={order.currency}
            />
            <PriceRow
              label={t("shipping")}
              value={order.shippingCost}
              currency={order.currency}
            />
            <PriceRow
              label={t("tax")}
              value={order.tax}
              currency={order.currency}
            />
            {order.couponDiscount > 0 && (
              <PriceRow
                label={t("discount")}
                value={-order.couponDiscount}
                currency={order.currency}
                isDiscount
              />
            )}
            <div
              className="h-px my-1"
              style={{ backgroundColor: "var(--color-border)" }}
            />
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t("grandTotal")}
              </span>
              <span
                className="text-sm font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {order.currency} {order.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function Divider() {
  return (
    <div className="h-px" style={{ backgroundColor: "var(--color-border)" }} />
  );
}

function PriceRow({
  label,
  value,
  currency,
  isDiscount = false,
}: {
  label: string;
  value: number;
  currency: string;
  isDiscount?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </span>
      <span
        className="text-xs font-medium"
        style={{
          color: isDiscount ? "#16a34a" : "var(--color-text)",
        }}
      >
        {isDiscount ? "-" : ""}
        {currency} {Math.abs(value).toFixed(2)}
      </span>
    </div>
  );
}